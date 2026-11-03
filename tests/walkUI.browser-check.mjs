import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { WALK_DIALOGUES } from '../src/game/data/walkDialogues.js';
import { walkInstructionsChecks } from './helpers/walkInstructionsChecks.mjs';

const walkMap = JSON.parse(await fs.readFile(new URL('../src/game/data/walkMap.json', import.meta.url), 'utf8'));
assert.deepEqual(walkMap.acceptance.keyboardInteractionKeys, ['SPACE']);

// Teste local com Edge headless, seguindo os checks de navegador já usados no projeto.
const baseURL = process.env.WALK_UI_URL || 'http://localhost:8080';
const output = path.resolve('tmp/walk-ui-validation');
await fs.mkdir(output, { recursive: true });
const profile = await fs.mkdtemp(path.join(tmpdir(), 'walk-ui-check-'));
const edgePath = process.env.WALK_EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const edge = spawn(edgePath, ['--headless=new', '--remote-debugging-port=0', '--no-first-run',
    '--no-default-browser-check', '--disable-extensions', '--enable-unsafe-swiftshader',
    '--window-size=1280,720', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function until(action, message) {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
        try { const value = await action(); if (value) return value; } catch { /* startup/navigation */ }
        await pause(200);
    }
    throw new Error(message);
}
const sockets = [];
async function connect(url) {
    const ws = new WebSocket(url);
    sockets.push(ws);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
    let counter = 0;
    const pending = new Map();
    const events = [];
    ws.addEventListener('close', () => { for (const call of pending.values()) call.reject(new Error('Conexão do Edge encerrada')); pending.clear(); });
    ws.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        if (message.id) {
            const callback = pending.get(message.id);
            pending.delete(message.id);
            if (callback) message.error ? callback.reject(new Error(JSON.stringify(message.error))) : callback.resolve(message.result);
        } else events.push(message);
    });
    return {
        events,
        send(method, params = {}) {
            return new Promise((resolve, reject) => {
                const id = ++counter;
                const timer = setTimeout(() => { pending.delete(id); reject(new Error('Sem resposta do Edge: ' + method)); }, 10000);
                pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
                ws.send(JSON.stringify({ id, method, params }));
            });
        }
    };
}

let browser, page;
const passed = [];
try {
    const portFile = await until(() => fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8'), 'Edge não iniciou');
    const [port, endpoint] = portFile.trim().split(/\r?\n/);
    browser = await connect('ws://127.0.0.1:' + port + endpoint);
    const pages = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
    page = await connect(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
    await page.send('Page.enable'); await page.send('Runtime.enable'); await page.send('Network.enable');
    async function evaluate(expression) {
        const result = await page.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
        return result.result.value;
    }
    async function attach(key) {
        const result = await page.send('Runtime.evaluate', { expression: "import('/src/game/scenes/Intro.js').then(m => m.Intro.prototype)", awaitPromise: true });
        if (!result.result.objectId) return false;
        const instances = await page.send('Runtime.queryObjects', { prototypeObjectId: result.result.objectId });
        const attached = await page.send('Runtime.callFunctionOn', {
            objectId: instances.objects.objectId,
            functionDeclaration: 'function(key){ window.__checkedScene = this.map(s => s.sys?.game?.scene?.keys?.[key]).find(s => s?.sys?.isActive()); return Boolean(window.__checkedScene); }',
            arguments: [{ value: key }], returnByValue: true
        });
        return attached.result.value;
    }
    const frames = (count = 3) => evaluate('new Promise(resolve => { let n=' + count + '; const tick=()=>--n<=0?resolve():requestAnimationFrame(tick);requestAnimationFrame(tick); })');
    const get = expression => evaluate('__checkedScene.' + expression);
    async function shot(name) {
        const result = await page.send('Page.captureScreenshot', { format: 'png' });
        await fs.writeFile(path.join(output, name + '.png'), Buffer.from(result.data, 'base64'));
    }
    async function viewport(width, height, mobile = false) {
        await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
        await page.send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: 3 });
    }
    async function navigate(query, scene) {
        await page.send('Page.navigate', { url: baseURL + '/' + query });
        await until(() => attach(scene), 'Cena não abriu: ' + scene);
        await frames(4);
    }
    async function point(x, y) {
        return evaluate('(()=>{const r=document.querySelector("canvas").getBoundingClientRect();return {x:r.left+' + x + '*r.width/1280,y:r.top+' + y + '*r.height/720};})()');
    }
    async function mouse(type, x, y) {
        const p = await point(x, y);
        await page.send('Input.dispatchMouseEvent', { type, ...p, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
        await frames();
    }
    async function click(x, y) { await mouse('mousePressed', x, y); await mouse('mouseReleased', x, y); }
    async function touch(x, y, cancel = false) {
        const p = await point(x, y);
        await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...p, id: 1, radiusX: 3, radiusY: 3, force: 1 }] });
        await frames();
        await page.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
        await frames();
    }
    async function approach(id) {
        await evaluate('(()=>{const s=__checkedScene; const p=s.interactionSystem.interactions.find(i=>i.id===' + JSON.stringify(id) + ');s.player.body.reset(p.x,p.y+48);s.cameras.main.centerOn(p.x,p.y+48);})()');
        await frames(5);
        assert.equal(await get('interactionSystem.current?.id'), id);
        assert.ok((await get('interactionSystem.promptText.text')).endsWith('Espaço ou toque'));
        await assertTips();
    }
    async function key(code, key, number, modifiers = 0) {
        await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key, windowsVirtualKeyCode: number, modifiers });
        await frames(3);
        await page.send('Input.dispatchKeyEvent', { type: 'keyUp', code, key, windowsVirtualKeyCode: number, modifiers });
        await frames(3);
    }
    async function assertTips() {
        const texts=await evaluate(`(()=>{const texts=[];const visit=o=>{if(!o.visible)return;
            if(o.type==='Text')texts.push(o.text);if(o.list)o.list.forEach(visit);};
            __checkedScene.children.list.forEach(visit);return texts;})()`);
        assert.equal(texts.some(text=>/\bE\s*(?:\/|ou)\s*Espaço|pressione E\b/iu.test(text)),false,'Nenhuma dica visível anuncia E');
    }
    async function assertEInactive() {
        const snapshot=()=>evaluate(`(()=>{const s=__checkedScene,d=s.dialogueSystem;return {
            started:s.walkStarted,active:s.sys.isActive(),mode:d.mode,page:d.pageIndex,pages:d.pages.length,
            lessons:[...d.completedLessons],speaker:d.speakerText.text,text:d.bodyText.text,
            buttons:d.buttons.map(b=>({visible:b.visible,enabled:b.enabled,focused:b.focused,label:b.text.text})),
            player:{x:s.player.x,y:s.player.y},instructions:Boolean(s.instructionsUI)};})()`);
        const before=await snapshot();
        assert.equal(await get('input.keyboard.keys[69] === undefined'),true,'E não está registrada no Passeio');
        await key('KeyE','e',69);
        await key('KeyE','E',69,8);
        await page.send('Input.dispatchKeyEvent',{type:'rawKeyDown',code:'KeyE',key:'e',windowsVirtualKeyCode:69});
        await frames(6);
        await page.send('Input.dispatchKeyEvent',{type:'rawKeyDown',code:'KeyE',key:'e',windowsVirtualKeyCode:69,autoRepeat:true});
        await frames(3);
        await page.send('Input.dispatchKeyEvent',{type:'keyUp',code:'KeyE',key:'e',windowsVirtualKeyCode:69});
        await frames(3);
        assert.deepEqual(await snapshot(),before,'E/e, Shift+E e repetição não abrem, avançam, fecham ou confirmam ações');
        await assertTips();
    }
    async function geometry() {
        await assertTips();
        const data = await get('dialogueSystem.buttons.filter(b=>b.visible).map(b=>({label:b.text.text,text:b.text.getBounds(),box:b.background.getBounds(),scaleX:b.background.scaleX,scaleY:b.background.scaleY,left:b.background.leftWidth,right:b.background.rightWidth}))');
        for (const b of data) {
            for (const rect of [b.text, b.box]) { rect.right = rect.x + rect.width; rect.bottom = rect.y + rect.height; }
            assert.equal(b.scaleX, 2); assert.equal(b.scaleY, 2);
            assert.equal(b.left, 8); assert.equal(b.right, 8);
            assert.ok(b.box.x >= 0 && b.box.y >= 0 && b.box.right <= 1280 && b.box.bottom <= 720, b.label);
            assert.ok(b.text.x >= b.box.x + 8 && b.text.right <= b.box.right - 8 && b.text.y >= b.box.y + 4 && b.text.bottom <= b.box.bottom - 4, 'Texto fora do botão: ' + b.label);
        }
        const body = await evaluate('({bounds:__checkedScene.dialogueSystem.bodyText.getBounds(),mode:__checkedScene.dialogueSystem.mode,firstTopic:__checkedScene.dialogueSystem.topicButtons[0].background.y})');
        body.bounds.bottom = body.bounds.y + body.bounds.height;
        assert.ok(body.bounds.bottom <= (body.mode === 'topics' ? body.firstTopic - 8 : 604), 'Fala sobrepõe controles');
    }
    function pass(name) { passed.push(name); console.log('PASS ' + name); }
    const intro = walkInstructionsChecks({ evaluate, get, until, frames, page, click, touch });

    await viewport(1280, 720);
    await navigate('', 'Intro');
    await until(() => get('children.list.some(o=>o.texture?.key==="pet-educa-ui-button")'), 'Intro não ficou pronta');
    await click(504,564);await until(()=>attach('MainMenu'),'Menu não abriu');
    await click(500,258);await until(()=>attach('FoodGame'),'FoodGame não abriu');
    await until(()=>get('uiReady'),'Instruções do FoodGame não ficaram prontas');
    const foodReference=await evaluate(`(()=>{const s=__checkedScene;return {
        panel:{key:s.painelInstrucoes.texture.key,bounds:s.painelInstrucoes.getBounds()},
        button:{key:s.botaoComecar.texture.key,bounds:s.botaoComecar.getBounds()},
        title:{font:s.textoInstrucoes.style.fontFamily,size:parseInt(s.textoInstrucoes.style.fontSize),color:s.textoInstrucoes.style.color}};})()`);
    await navigate('?walkLearning', 'WalkGame');
    await intro.layout(foodReference);const initialListeners=await intro.listeners();
    await shot('walk-instructions-pc');await intro.blocked();
    await click(964,44);
    assert.equal(await get('dialogueSystem.bodyText.text'),WALK_DIALOGUES.intro[0].text,'Controles preservam o texto existente');
    assert.match(await get('dialogueSystem.bodyText.text'),/pressione Espaço para interagir/);
    assert.deepEqual(await get('dialogueSystem.buttons.filter(b=>b.visible).map(b=>b.text.text)'),['FECHAR']);
    assert.equal(await get('dialogueSystem.nextButton.hit.input.enabled'),false);
    assert.equal(await get('dialogueSystem.instructionText.text'),'Espaço ou toque em FECHAR');
    await shot('walk-controls-pc');
    await key('Tab','Tab',9);await assertEInactive();
    await click(904,652);
    assert.equal(await get('dialogueSystem.isOpen()'),false);
    pass('Estilo real do FoodGame, comandos bloqueados, Começar sem propagação e Controles acessíveis');
    assert.equal(await get('dialogueSystem.bodyText.style.fontFamily'), 'Nunito Sans');
    assert.equal(await get('dialogueSystem.bodyText.style.color'), '#342B24');
    assert.equal(await get('dialogueSystem.panel.scrollFactorX'), 0);
    assert.equal(await get('dialogueSystem.panel.scaleX'), 1);
    assert.equal(await get('dialogueSystem.buttons.some(b=>b.hit.input?.enabled)'), false);
    await approach('feevalepet');
    await shot('walk-booth-pc');
    await approach('guia');
    await assertEInactive();
    await shot('walk-prompt-pc');
    await mouse('mouseMoved', 1050, 650);
    assert.equal(await get('interactionSystem.promptButton.state'), 'hover');
    await mouse('mousePressed', 1050, 650);
    assert.equal(await get('interactionSystem.promptButton.state'), 'selected');
    await mouse('mouseReleased', 1050, 650);
    await assertEInactive();
    assert.equal(await get('dialogueSystem.speakerText.text'), 'Tutor com cachorro');
    await geometry(); await shot('walk-dialogue-pc');
    assert.equal(await get('player.body.velocity.length()'), 0);
    assert.equal(await get('dialogueSystem.closeButton.visible'), false);
    assert.equal(await get('dialogueSystem.closeButton.hit.input.enabled'), false);
    assert.equal(await get('dialogueSystem.nextButton.text.text'), 'CONCLUIR');
    await click(904, 652);
    assert.equal(await get('dialogueSystem.isOpen()'), true, 'Área do Fechar oculto deve ficar inativa');
    await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await frames();
    assert.equal(await get('dialogueSystem.isOpen()'), true, 'Escape não deve pular Concluir');
    await click(1112, 652);
    assert.equal(await get('dialogueSystem.isOpen()'), false);
    assert.equal(await get('dialogueSystem.completedLessons.has("guia")'), true);
    assert.equal(await get('dialogueSystem.buttons.some(b=>b.hit.input?.enabled)'), false);
    pass('Prompt normal/hover/pressionado, diálogo, fechamento e input oculto');

    for (const [id, name] of [['feevalepet','Voluntária FeevalePet'],['descanso','Pessoa no banco'],['agua','Bebedouro']]) {
        await approach(id); await click(1050, 650);
        assert.equal(await get('dialogueSystem.speakerText.text'), name);
        assert.equal(await get('dialogueSystem.closeButton.visible'), false);
        await geometry(); await click(1112, 652);
        assert.equal(await get('dialogueSystem.isOpen()'), false);
    }
    pass('NPCs e câmera em posições diferentes');

    await approach('veterinaria'); await click(1050, 650);
    await assertEInactive();
    assert.equal(await get('dialogueSystem.mode'), 'topics');
    assert.equal(await get('dialogueSystem.closeButton.visible'), true);
    await geometry(); await shot('walk-topics-pc');
    await mouse('mouseMoved', 440, 520);
    assert.equal(await get('dialogueSystem.topicButtons[0].state'), 'hover');
    await mouse('mousePressed', 440, 520);
    assert.equal(await get('dialogueSystem.topicButtons[0].state'), 'selected');
    await shot('walk-action-pressed');
    await mouse('mouseReleased', 440, 520);
    assert.equal(await get('dialogueSystem.pageIndex'), 0);
    assert.equal(await get('dialogueSystem.closeButton.visible'), true);
    await geometry(); await click(1112, 652);
    assert.equal(await get('dialogueSystem.pageIndex'), 1);
    assert.equal(await get('dialogueSystem.closeButton.visible'), true);
    await geometry(); await click(1112, 652);
    assert.equal(await get('dialogueSystem.mode'), 'topics');
    assert.equal(await get('dialogueSystem.completedLessons.has("guarda")'), true);
    assert.ok((await get('dialogueSystem.topicButtons[0].text.text')).startsWith('✓ '));
    await get('dialogueSystem.closeButton.setEnabled(false)');
    assert.equal(await get('dialogueSystem.closeButton.state'), 'disabled');
    await shot('walk-action-disabled'); await click(904, 652);
    assert.equal(await get('dialogueSystem.isOpen()'), true);
    await get('dialogueSystem.closeButton.setEnabled(true)'); await click(904, 652);
    pass('Tópicos, paginação, recompensa e estado desabilitado');

    await evaluate("import('/src/game/data/walkDialogues.js').then(({WALK_DIALOGUES})=>{__checkedScene.dialogueSystem.showPages(WALK_DIALOGUES.intro,()=>__checkedScene.dialogueSystem.close());})");
    await frames(); await geometry(); await shot('walk-long-dialogue-pc');
    assert.equal(await get('dialogueSystem.closeButton.visible'), false);
    await click(1112, 652);
    const allPages = [...Object.values(WALK_DIALOGUES).filter(Array.isArray).flat(),
        ...WALK_DIALOGUES.veterinaria.topics.flatMap(topic => topic.pages)];
    for (const speech of allPages) {
        await evaluate('__checkedScene.dialogueSystem.showPages(' + JSON.stringify([speech]) + ',()=>__checkedScene.dialogueSystem.close())');
        await frames(); await geometry();
        assert.equal(await get('dialogueSystem.bodyText.text'), speech.text);
        await assertEInactive();
    }
    for (const [key, code, number] of [['Tab','Tab',9],['Tab','Tab',9]]) {
        await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key, code, windowsVirtualKeyCode: number });
        await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: number });
        await frames();
    }
    assert.equal(await get('dialogueSystem.nextButton.state'), 'hover');
    await assertEInactive();
    await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await frames();
    assert.equal(await get('dialogueSystem.isOpen()'), false);
    pass('Foco por Tab e ativação por Enter');
    pass('Todas as falas com a fonte real, sem corte ou sobreposição (' + allPages.length + ' páginas)');

    await viewport(844, 390, true);
    await navigate('?walkLearning', 'WalkGame');
    await intro.layout(foodReference);await shot('walk-instructions-mobile');
    await viewport(740,360,true);await frames(4);await intro.layout(foodReference);await shot('walk-instructions-mobile-small');
    await viewport(844,390,true);await frames(4);await intro.blocked(true);
    await touch(964,44);
    assert.deepEqual(await get('dialogueSystem.buttons.filter(b=>b.visible).map(b=>b.text.text)'),['FECHAR']);
    await shot('walk-controls-mobile');await touch(904,652);
    assert.equal(await get('dialogueSystem.isOpen()'),false);
    assert.equal(await get('touchControls.enabled'), true);
    await approach('feevalepet');
    await shot('walk-booth-mobile');
    await shot('walk-mobile-controls');
    const before = await get('player.y');
    const up = await point(154, 436);
    await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...up, id: 1, radiusX: 3, radiusY: 3, force: 1 }] });
    await frames(10);
    assert.equal(await get('touchControls.frames.get("up").object.texture.key'), 'quiz-saci-answer-panel-selected');
    assert.ok((await get('player.y')) < before);
    await page.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await frames();
    assert.deepEqual(await get('touchControls.getDirection()'), { x: 0, y: 0 });
    await approach('guia'); await touch(1050, 650);
    await assertEInactive();
    assert.equal(await get('dialogueSystem.closeButton.visible'), false);
    await touch(904, 652);
    assert.equal(await get('dialogueSystem.isOpen()'), true);
    await touch(1112, 652);
    assert.equal(await get('dialogueSystem.isOpen()'), false);
    await approach('veterinaria'); await touch(1050, 650);
    assert.equal(await get('dialogueSystem.mode'), 'topics');
    assert.equal(await get('touchControls.enabled'), false);
    await geometry(); await shot('walk-topics-mobile');
    await touch(440, 592, true);
    assert.equal(await get('dialogueSystem.mode'), 'topics');
    assert.notEqual(await get('dialogueSystem.topicButtons[1].state'), 'selected');
    await touch(440, 592);
    assert.equal(await get('dialogueSystem.mode'), 'pages');
    assert.equal(await get('dialogueSystem.closeButton.visible'), true);
    await geometry(); await shot('walk-dialogue-mobile');
    await touch(904, 652);
    assert.equal(await get('dialogueSystem.isOpen()'), false);
    assert.equal(await get('touchControls.enabled'), true);
    assert.equal(await get('dialogueSystem.buttons.some(b=>b.hit.input?.enabled)'), false);
    pass('Celular horizontal: escala, direcional, toque, cancelamento, bloqueio e reabertura');

    await navigate('?walkLearning', 'WalkGame');await intro.start(true);
    for(const id of ['guia','feevalepet','descanso','agua']) {
        await approach(id);await assertEInactive();await touch(1050,650);
        assert.equal(await get('dialogueSystem.pageIndex'),0);
        await assertEInactive();await touch(1112,652);
        assert.equal(await get('dialogueSystem.isOpen()'),false);
    }
    await approach('veterinaria');await touch(1050,650);await assertEInactive();
    for(const [index,y] of [520,592,664].entries()) {
        await touch(440,y);await touch(1112,652);
        assert.equal(await get('dialogueSystem.pageIndex'),1);
        await touch(1112,652);
        assert.equal(await get('dialogueSystem.completedLessons.size'),5+index);
    }
    assert.equal(await get('dialogueSystem.speakerText.text'),'Passeio concluído!');
    await assertEInactive();await geometry();await shot('walk-completion-mobile');await touch(1112,652);
    assert.equal(await get('dialogueSystem.isOpen()'),false);
    pass('Toque emulado conclui os sete cuidados nos cinco locais, sem depender de teclado; E não altera o estado');

    await viewport(1280, 720);
    await navigate('?walkLearning', 'WalkGame');
    await intro.start();
    for (const id of ['guia', 'feevalepet', 'descanso', 'agua']) {
        await approach(id);await assertEInactive();
        const before=await get('dialogueSystem.completedLessons.size');
        await page.send('Input.dispatchKeyEvent',{type:'rawKeyDown',code:'Space',key:' ',windowsVirtualKeyCode:32});
        await frames(6);
        await page.send('Input.dispatchKeyEvent',{type:'rawKeyDown',code:'Space',key:' ',windowsVirtualKeyCode:32,autoRepeat:true});
        await frames(4);
        assert.equal(await get('dialogueSystem.mode'),'pages');
        assert.equal(await get('dialogueSystem.pageIndex'),0);
        assert.equal(await get('dialogueSystem.completedLessons.size'),before,'Uma pressão/tecla mantida só abre; não conclui o diálogo recém-aberto');
        await page.send('Input.dispatchKeyEvent',{type:'keyUp',code:'Space',key:' ',windowsVirtualKeyCode:32});await frames(3);
        await assertEInactive();await key('Space',' ',32);
        assert.equal(await get('dialogueSystem.isOpen()'), false);
        assert.equal(await get('dialogueSystem.completedLessons.size'),before+1,'Espaço conclui uma vez, sem reabrir');
    }
    assert.equal(await get('dialogueSystem.completedLessons.size'), 4);
    await approach('veterinaria');await assertEInactive();await key('Space',' ',32);
    assert.equal(await get('dialogueSystem.mode'),'topics');
    await assertEInactive();await key('Space',' ',32);
    assert.equal(await get('dialogueSystem.mode'),'topics','Espaço preserva o contexto: não escolhe tema arbitrariamente');
    for (const [index, letter] of ['A','B','C'].entries()) {
        await key('Key'+letter,letter.toLowerCase(),65+index);
        assert.equal(await get('dialogueSystem.pageIndex'),0);
        await assertEInactive();await key('Space',' ',32);
        assert.equal(await get('dialogueSystem.pageIndex'),1);
        await assertEInactive();await key('Space',' ',32);
        assert.equal(await get('dialogueSystem.completedLessons.size'), 5 + index);
    }
    assert.equal(await get('dialogueSystem.speakerText.text'), 'Passeio concluído!');
    assert.equal(await get('dialogueSystem.closeButton.visible'), false);
    assert.equal(await get('dialogueSystem.progressText.text'), 'Cuidados: 7/7');
    await geometry();await assertEInactive();await shot('walk-completion-pc');await key('Space',' ',32);
    assert.equal(await get('dialogueSystem.isOpen()'), false);
    pass('Espaço percorre cinco pontos/sete cuidados, páginas e conclusão; E inativo e uma ação por pressão, sem reabrir diálogo');

    assert.equal(await get('menuUI.visible'), true);
    assert.equal(await get('menuButton.hit.scrollFactorX'), 0);
    await shot('walk-menu-pc');
    await click(1172, 44);
    await until(() => attach('MainMenu'), 'Menu não abriu ao sair do passeio');
    await click(500, 408); // Cartão existente do Passeio Consciente.
    await until(() => attach('WalkGame'), 'Passeio não reabriu pelo menu');
    await intro.ready();assert.deepEqual(await intro.listeners(),initialListeners,'Reentrada sem eventos duplicados');
    await intro.start();
    assert.equal(await get('dialogueSystem.completedLessons.size'), 0);
    await approach('guia');await assertEInactive();await key('Space',' ',32);
    assert.equal(await get('menuButton.visible'), true);
    await click(1172,44);
    await until(() => attach('MainMenu'), 'Menu não abriu durante o diálogo');
    pass('Menu no PC durante exploração/diálogo e reentrada pelo cartão');

    await viewport(844,390,true);
    await navigate('?walkLearning', 'WalkGame');
    await intro.start(true);
    await touch(1172,44,true);
    assert.equal(await get('sys.isActive()'), true);
    await approach('veterinaria'); await touch(1050,650);
    assert.equal(await get('menuButton.visible'), true);
    await shot('walk-menu-mobile');
    await touch(1172,44);
    await until(() => attach('MainMenu'), 'Menu por toque não abriu durante diálogo');
    await touch(500,408);
    await until(() => attach('WalkGame'), 'Passeio não reabriu por toque');
    await intro.ready();assert.deepEqual(await intro.listeners(),initialListeners,'Reentrada por toque sem eventos duplicados');
    await evaluate('window.__exitWalkUI=__checkedScene.instructionsUI;window.__exitWalkChildren=__checkedScene.instructionsUI.container.list.slice();void 0');
    assert.equal(await get('menuButton.enabled'), true);
    assert.equal(await get('dialogueSystem.isOpen()'), false);
    await touch(1172,44);
    await until(() => attach('MainMenu'), 'Menu por toque não abriu durante exploração');
    assert.equal(await evaluate('!window.__exitWalkUI.container.scene && window.__exitWalkChildren.every(o=>!o.scene && o.listenerCount("pointerdown")===0)'),true,'Saída nas instruções descarta a caixa e os eventos');
    pass('Menu por toque, cancelamento e reabertura no celular horizontal');
    await viewport(1280,720);

    for (const mobile of [false, true]) {
        await viewport(mobile ? 844 : 1280, mobile ? 390 : 720, mobile);
        await navigate('?saciQuiz', 'SaciGame');
        await until(() => evaluate('Boolean(__checkedScene.quizUI?.indicator)'), 'Quiz não inicializou');
        assert.equal(await get('quizUI.questionPanel.width'), 480);
        assert.equal(await get('quizUI.questionPanel.scaleX'), 2);
        const activate = mobile ? touch : click;
        for (let game = 0; game < 2; game++) {
            const ids = await get('round.questions.map(q=>q.id)');
            assert.equal(ids.length, 5);
            assert.equal(new Set(ids).size, 5);
            let hits = 0;
            for (let index = 0; index < 5; index++) {
                assert.equal(await get('quizUI.indicator.text'), `Pergunta ${index + 1} de 5`);
                const question = await get('round.currentQuestion');
                assert.equal(await get('quizUI.question.text'), question.pergunta);
                assert.deepEqual(await get('quizUI.answers.map(a=>a.label.text)'), question.alternativas);
                const correct = 'ABC'.indexOf(question.correta);
                const chosen = game === 0 && index % 2 ? (correct + 1) % 3 : correct;
                if (chosen === correct) hits++;
                const b = await get(`quizUI.answers[${chosen}].hit.getBounds()`);
                await activate(b.x + b.width / 2, b.y + b.height / 2);
                await activate(b.x + b.width / 2, b.y + b.height / 2);
                assert.equal(await get('round.hits'), hits, 'Uma única resposta por pergunta');
                assert.equal(await get('round.index'), index, 'Feedback não avança automaticamente');
                assert.equal(await get(`quizUI.answers[${correct}].state`), 'correct');
                assert.equal(await get('quizUI.next.label.text'), index === 4 ? 'Finalizar' : 'Próxima');
                await shot(`quiz-${mobile ? 'touch' : 'pc'}-${game}-${index}`);
                await activate(1120, 660);
            }
            assert.equal(await get('round.phase'), 'complete');
            assert.equal(await get('round.currentQuestion'), null);
            assert.equal(await get('round.hits'), game === 0 ? 3 : 5);
            assert.equal(await get(`children.list.some(o=>o.visible && o.text==='Você acertou ${hits} de 5 perguntas')`), true);
            if (game === 0) {
                // Oráculo controlado só no teste: prova que o botão solicita outro Fisher–Yates.
                await evaluate('window.__previousQuestions=__checkedScene.round.questions;window.__quizDraws=0;__checkedScene.round.random=()=>{window.__quizDraws++;return 0;};void 0');
                const b = await get('quizUI.restart.hit.getBounds()');
                await activate(b.x + b.width / 2, b.y + b.height / 2);
                assert.equal(await evaluate('window.__quizDraws'), 14);
                assert.equal(await evaluate('__checkedScene.round.questions!==window.__previousQuestions'), true);
                assert.deepEqual(await get('round.questions.map(q=>q.id)'), [2, 3, 4, 5, 6]);
                assert.equal(await get('round.index'), 0);
                assert.equal(await get('round.hits'), 0);
                assert.equal(await get('round.feedback'), null);
                assert.equal(await get('round.phase'), 'question');
            }
        }
        const b = await get('quizUI.menu.hit.getBounds()');
        await activate(b.x + b.width / 2, b.y + b.height / 2);
        await until(() => attach('MainMenu'), 'Quiz não voltou ao menu');
        await activate(500, 558);
        await until(() => attach('SaciGame'), 'Quiz não reabriu');
        assert.equal(await get('round.total'), 5);
        assert.equal(await get('round.hits'), 0);
        assert.equal(await get('round.index'), 0);
        assert.equal(await get('round.phase'), 'question');
    }
    pass('Quiz PC/toque: cinco perguntas únicas, feedback, resultado 3/5 e 5/5, novo sorteio no reinício e reentrada');

    const failures = page.events.filter(e => e.method === 'Runtime.exceptionThrown' ||
        (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
        (e.method === 'Network.responseReceived' && e.params.response.status >= 400 && e.params.response.url.includes('/assets/')));
    assert.deepEqual(failures, [], 'Erros de execução ou carregamento');
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify({ passed: true, checks: passed, renderer: 'Edge WebGL (SwiftShader)', viewports: ['1280x720','844x390','740x360'], errors: failures }, null, 2));
} catch (error) {
    console.error(error);
    if (page) {
        console.error(JSON.stringify(page.events.filter(e=>e.method === 'Runtime.exceptionThrown').slice(-5),null,2));
        const shot = await page.send('Page.captureScreenshot', { format: 'png' }).catch(()=>null);
        if (shot) await fs.writeFile(path.join(output, 'failure.png'), Buffer.from(shot.data,'base64'));
    }
    process.exitCode = 1;
} finally {
    if (browser) await browser.send('Browser.close').catch(()=>{});
    sockets.forEach(ws=>ws.close()); edge.kill();
}
