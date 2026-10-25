// Build, start dev on 8080 and `vite preview` on 8081, then npm run test:walk-routes.
// Uses the real dev app and built distribution; no test globals in production source.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';

const urls = {
    dev: process.env.WALK_UI_URL || 'http://127.0.0.1:8080',
    production: process.env.WALK_PROD_URL || 'http://127.0.0.1:8081'
};
const edgePath = process.env.WALK_EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
try { await fs.access(edgePath); } catch {
    throw new Error(`Navegador não encontrado em ${edgePath}. Defina WALK_EDGE_PATH; teste não executado.`);
}
const assets = await fs.readdir('dist/assets').catch(() => { throw new Error('Execute npm run build-nolog antes deste teste.'); });
const scripts = assets.filter(file => file.endsWith('.js'));
const phaserChunk = scripts.find(file => /^phaser-/.test(file));
assert.ok(phaserChunk, 'Build contains its Phaser module');
const bundle = (await Promise.all(scripts.map(file => fs.readFile(path.join('dist/assets', file), 'utf8')))).join('\n');
for (const marker of ['WalkGameLearning', 'WalkLayoutEditor', 'WalkLayoutDraft',
    'Editor provisório de layout', 'Walk Layout Editor', 'quiz-visual-inspector', 'Estados visuais (dev)']) {
    assert.equal(bundle.includes(marker), false, `Production JavaScript excludes ${marker}`);
}
const output = path.resolve('tmp/walk-ui-validation/routes');
await fs.mkdir(output, { recursive: true });
const profile = await fs.mkdtemp(path.join(tmpdir(), 'walk-routes-check-'));
const edge = spawn(edgePath, ['--headless=new', '--remote-debugging-port=0', '--no-first-run',
    '--no-default-browser-check', '--disable-extensions', '--enable-unsafe-swiftshader',
    '--window-size=1280,720', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(action, message) {
    const deadline = Date.now() + 30000;
    let lastError;
    while (Date.now() < deadline) {
        try { const result = await action(); if (result) return result; } catch (error) { lastError = error; }
        await pause(100);
    }
    throw new Error(message + (lastError ? ': ' + lastError.message : ''));
}
const sockets = [];
async function connect(url) {
    const ws = new WebSocket(url); sockets.push(ws);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
    let id = 0;
    const pending = new Map(), events = [];
    ws.addEventListener('close', () => { for (const call of pending.values()) call.reject(new Error('Conexão do navegador encerrada')); pending.clear(); });
    ws.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        if (!message.id) { events.push(message); return; }
        const callback = pending.get(message.id); pending.delete(message.id);
        if (callback) message.error ? callback.reject(new Error(JSON.stringify(message.error))) : callback.resolve(message.result);
    });
    return { events, send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const request = ++id;
            const timer = setTimeout(() => { pending.delete(request); reject(new Error('Sem resposta do navegador: ' + method)); }, 10000);
            pending.set(request, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
            ws.send(JSON.stringify({ id: request, method, params }));
        });
    } };
}

let browser, page;
const routes = [], checks = [];
try {
    const portFile = await until(() => fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8'), 'Navegador não iniciou');
    const [port, endpoint] = portFile.trim().split(/\r?\n/);
    browser = await connect(`ws://127.0.0.1:${port}${endpoint}`);
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    page = await connect(pages.find(item => item.type === 'page').webSocketDebuggerUrl);
    await page.send('Page.enable'); await page.send('Runtime.enable'); await page.send('Network.enable'); await page.send('Log.enable');
    async function evaluate(expression) {
        const result = await page.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
        return result.result.value;
    }
    async function attachGame(mode) {
        if (await evaluate('Boolean(window.__routeGame?.isBooted)')) return true;
        // Dev exposes source modules. Production uses the exported Game constructor
        // from the actual hashed Phaser chunk, independent of minified export names.
        const expression = mode === 'dev'
            ? "import('/src/game/scenes/Boot.js').then(m=>m.Boot.prototype)"
            : `import(${JSON.stringify('/assets/' + phaserChunk)}).then(module=>{
                const values=Object.values(module);
                const candidates=[...values,...values.filter(v=>v&&typeof v==='object').map(v=>v.Game)];
                const Game=candidates.find(v=>typeof v==='function'&&typeof v.prototype?.headlessStep==='function'&&typeof v.prototype?.step==='function');
                if(!Game)throw new Error('Game constructor not exported by the production Phaser chunk');
                return Game.prototype;
            })`;
        const prototype = await page.send('Runtime.evaluate', { expression, awaitPromise: true });
        if (!prototype.result.objectId) return false;
        const instances = await page.send('Runtime.queryObjects', { prototypeObjectId: prototype.result.objectId });
        const result = await page.send('Runtime.callFunctionOn', {
            objectId: instances.objects.objectId,
            functionDeclaration: 'function(dev){window.__routeGame=this.map(v=>dev?v.game:v).find(g=>g?.isBooted&&g.canvas===document.querySelector("canvas"));return Boolean(window.__routeGame);}',
            arguments: [{ value: mode === 'dev' }], returnByValue: true
        });
        return result.result.value;
    }
    const get = expression => evaluate('__routeGame.scene.keys.WalkGame.' + expression);
    const frames = (count = 3) => evaluate(`new Promise(resolve=>{let n=${count};const step=()=>--n<=0?resolve():requestAnimationFrame(step);requestAnimationFrame(step);})`);
    const active = () => evaluate('__routeGame.scene.getScenes(true).map(s=>s.sys.settings.key)');
    async function ready(mode, key) {
        await until(() => attachGame(mode), `Aplicativo ${mode} não iniciou; confira ${urls[mode]}`);
        await until(() => evaluate(`Boolean(__routeGame.scene.keys[${JSON.stringify(key)}]?.sys.isActive())`), `Cena ${key} não abriu em ${mode}`);
        if (['Intro', 'MainMenu'].includes(key)) {
            await until(() => evaluate(`__routeGame.scene.keys[${JSON.stringify(key)}].children.list.some(o=>o.text==='Pet Educa')`), 'Fontes/UI não ficaram prontas');
        }
        if (key === 'WalkGame') {
            await until(() => evaluate('Boolean(__routeGame.scene.keys.WalkGame.player?.body && __routeGame.scene.keys.WalkGame.dialogueSystem)'), 'Passeio não ficou pronto');
        }
        await frames();
    }
    async function viewport(width, height, touch = false) {
        await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: touch });
        await page.send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: 3 });
    }
    async function navigate(mode, query, expected) {
        await page.send('Page.navigate', { url: urls[mode] + '/' + (query ? '?' + query : '') });
        await ready(mode, expected);
        const registered = await evaluate('Object.keys(__routeGame.scene.keys).sort()');
        const expectedKeys = ['Boot', 'Preloader', 'Intro', 'MainMenu', 'FoodGame', 'SaciGame', 'WalkGame'];
        if (mode === 'dev') expectedKeys.push('WalkLayoutEditor');
        assert.deepEqual(registered, expectedKeys.sort(), 'Only the intended scenes are registered');
        assert.deepEqual(await active(), [expected]);
        assert.equal(await evaluate('Boolean(document.querySelector("aside"))'), expected === 'WalkLayoutEditor');
        routes.push({ mode, query, expected, registered });
    }
    async function click(x, y, touch = false) {
        const point = await evaluate(`(()=>{const r=__routeGame.canvas.getBoundingClientRect();return{x:r.x+${x}*r.width/1280,y:r.y+${y}*r.height/720};})()`);
        if (touch) {
            await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, id: 1, radiusX: 2, radiusY: 2 }] });
            await frames(); await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        } else {
            await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', buttons: 1, clickCount: 1 });
            await frames(); await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', buttons: 0, clickCount: 1 });
        }
        await frames();
    }
    const screenshot = async name => {
        const shot = await page.send('Page.captureScreenshot', { format: 'png' });
        await fs.writeFile(path.join(output, name + '.png'), Buffer.from(shot.data, 'base64'));
    };
    for (const mode of ['dev', 'production']) {
        await viewport(1280, 720);
        for (const [query, expected] of [
            ['', 'Intro'], ['walkLearning', 'WalkGame'], ['walkLayoutEditor', mode === 'dev' ? 'WalkLayoutEditor' : 'Intro'],
            ['walkLayoutEditor&walkLearning', mode === 'dev' ? 'WalkLayoutEditor' : 'WalkGame'],
            ['saciQuiz', mode === 'dev' ? 'SaciGame' : 'Intro'], ['quizVisual', mode === 'dev' ? 'SaciGame' : 'Intro'],
            ['quizVisual&walkLearning', mode === 'dev' ? 'SaciGame' : 'WalkGame']
        ]) {
            await navigate(mode, query, expected);
            if (expected === 'SaciGame') {
                await until(() => evaluate('Boolean(__routeGame.scene.keys.SaciGame.quizUI)'), 'Quiz não ficou pronto');
                assert.equal(await evaluate('Boolean(document.querySelector("#quiz-visual-inspector"))'), query.includes('quizVisual'));
                assert.equal(await evaluate('Boolean(__routeGame.scene.keys.SaciGame.round)'), !query.includes('quizVisual'));
            }
        }
        await navigate(mode, '', 'Intro'); await click(504, 564); await ready(mode, 'MainMenu');
        await click(500, 408); await ready(mode, 'WalkGame');
        assert.equal(await get('dialogueSystem.requiredLessons.length'), 7);
        assert.ok(await get('walkCollisions.staticBodies.getLength()') > 0);
        if (mode === 'dev') assert.equal(await get('constructor.name'), 'WalkGame');
        const x = await get('player.x');
        await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
        await frames(6); await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
        await frames(); assert.ok(await get('player.x') > x, 'Keyboard moves the real player');
        const animated = () => get('children.list.filter(o=>["plaza-fountain-water","plaza-spring-rider","npc-tutor-cachorro-guia"].includes(o.texture?.key)).map(o=>({key:o.texture.key,frame:o.frame.name,playing:o.anims.isPlaying}))');
        const before = await animated(), samples = [before];
        for (let index = 0; index < 5; index++) { await frames(8); samples.push(await animated()); }
        assert.equal(before.length, 3);
        for (const item of before) {
            assert.equal(item.playing, true);
            assert.ok(new Set(samples.flat().filter(value => value.key === item.key).map(value => value.frame)).size > 1, item.key + ' advances frames');
        }
        assert.equal(await get('saci.texture.key'), 'walk-saci');
        await evaluate('(()=>{const s=__routeGame.scene.keys.WalkGame;s.player.body.reset(s.saci.x,s.saci.y+48);})()');
        await frames(4);
        assert.equal(await get('saci.jogadorEstavaProximo'), true); assert.equal(await get('saci.coracao.visible'), true);
        await screenshot(mode + '-walk');
        await click(1172, 44); await ready(mode, 'MainMenu'); await click(500, 408); await ready(mode, 'WalkGame');
        assert.equal(await get('dialogueSystem.completedLessons.size'), 0);
        assert.ok(await get('tutorPatrol.sprite.x') >= 544 && await get('tutorPatrol.sprite.x') < 555);
        checks.push(mode + ': routes, registered scenes, menu/reentry, keyboard, seven lessons, collisions, Saci/heart and three animations');
        console.log('PASS ' + checks.at(-1));
    }
    await viewport(844, 390, true);
    await navigate('production', 'walkLearning', 'WalkGame');
    assert.equal(await get('touchControls.enabled'), true);
    const startY = await get('player.y');
    const point = await evaluate('(()=>{const r=__routeGame.canvas.getBoundingClientRect();return{x:r.x+154*r.width/1280,y:r.y+436*r.height/720};})()');
    await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, id: 1 }] });
    await frames(6); await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await frames();
    assert.ok(await get('player.y') < startY); assert.deepEqual(await get('touchControls.getDirection()'), { x: 0, y: 0 });
    await evaluate('(()=>{const s=__routeGame.scene.keys.WalkGame,p=s.interactions.find(i=>i.id==="guia");s.player.body.reset(p.x,p.y+48);s.cameras.main.centerOn(p.x,p.y+48);})()');
    await frames(5); await click(1050, 650, true);
    assert.equal(await get('dialogueSystem.isOpen()'), true); assert.equal(await get('touchControls.enabled'), false);
    await click(1112, 652, true); assert.equal(await get('dialogueSystem.completedLessons.has("guia")'), true);
    await screenshot('production-touch-dialogue-complete');
    await click(1172, 44, true); await ready('production', 'MainMenu'); await click(500, 408, true); await ready('production', 'WalkGame');
    assert.equal(await get('dialogueSystem.completedLessons.size'), 0);
    checks.push('production: emulated touch, movement, real dialogue/completion, menu and clean reentry');
    const errors = page.events.filter(event => event.method === 'Runtime.exceptionThrown' ||
        (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') ||
        (event.method === 'Network.responseReceived' && event.params.response.status >= 400));
    assert.deepEqual(errors, [], 'No execution or network errors');
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify({ passed: true, urls, routes, checks, phaserChunk,
        viewports: ['1280x720', '844x390'], input: ['keyboard', 'mouse', 'emulated touch'], realDevice: false, errors }, null, 2));
    console.log('PASS production touch and route policy; editor/inspector absent from production JavaScript and registered scenes');
} catch (error) {
    console.error(error); process.exitCode = 1;
    if (page) {
        const shot = await page.send('Page.captureScreenshot', { format: 'png' }).catch(() => null);
        if (shot) await fs.writeFile(path.join(output, 'failure.png'), Buffer.from(shot.data, 'base64'));
    }
} finally {
    if (browser) await browser.send('Browser.close').catch(() => {});
    sockets.forEach(ws => ws.close()); edge.kill();
}
