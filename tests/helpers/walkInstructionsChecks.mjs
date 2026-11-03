import assert from 'node:assert/strict';

export function walkInstructionsChecks({ evaluate, get, until, frames, page, click, touch }) {
    const ready = async () => {
        await until(() => get('instructionsUI?.container?.active === true'), 'Apresentação do passeio não ficou pronta');
        assert.equal(await get('walkStarted'), false);
        assert.equal(await get('dialogueSystem.completedLessons.size'), 0);
    };
    const start = async (mobile = false) => {
        await ready();
        if (mobile) await touch(640,638); else await click(640,638);
        assert.equal(await get('walkStarted'), true);
        assert.equal(await get('instructionsUI'), null);
        assert.equal(await get('physics.world.isPaused'), false);
        assert.equal(await get('dialogueSystem.isOpen()'), false, 'Começar não abre um diálogo atrás da caixa');
    };
    const listeners = () => evaluate(`(()=>{const s=__checkedScene;return {
        input:['pointerup','pointerupoutside','gameout'].map(e=>s.input.listenerCount(e)),
        keyboard:s.input.keyboard.listenerCount('keydown'),pause:s.events.listenerCount('pause'),
        shutdown:s.events.listenerCount('shutdown')};})()`);
    const layout = async foodReference => {
        await ready();
        const data=await evaluate(`(()=>{const s=__checkedScene,ui=s.instructionsUI;return {
            panel:{key:ui.panel.texture.key,bounds:ui.panel.getBounds()},button:{key:ui.button.texture.key,bounds:ui.button.getBounds()},
            fixed:ui.container.scrollFactorX,scale:ui.container.scaleX,
            texts:ui.container.list.filter(o=>o.type==='Text').map(o=>({text:o.text,bounds:o.getBounds(),
                font:o.style.fontFamily,size:parseInt(o.style.fontSize),color:o.style.color})),
            canvasWidth:document.querySelector('canvas').getBoundingClientRect().width};})()`);
        assert.deepEqual(data.panel,foodReference.panel,'Mesmo asset, bordas, sombra e tamanho do painel do FoodGame');
        assert.deepEqual(data.button,foodReference.button,'Mesmo asset e geometria do botão do FoodGame');
        assert.equal(data.fixed,0);assert.equal(data.scale,1);
        assert.deepEqual(data.texts.map(o=>o.text),[
            'Hora do passeio!','Vamos aprender durante um passeio na praça?',
            'Explore o cenário e converse com as pessoas!',
            'Descubra os cuidados que devemos ter com os animais durante o passeio.',
            'Descubra os 7 cuidados durante o passeio pela praça!',
            'Visite lugares e converse com pessoas com as quais você pode aprender.',
            'Preste atenção nas dicas e explore com calma.',
            'Cada descoberta ajuda você a cuidar melhor do seu amigo!','Vamos passear?','Começar'
        ]);
        assert.equal(data.texts[0].font,foodReference.title.font);
        assert.equal(data.texts[0].size,foodReference.title.size);
        assert.equal(data.texts[0].color,foodReference.title.color);
        for(const [index,item] of data.texts.entries()) {
            const b=item.bounds,p=data.panel.bounds;
            assert.ok(b.x>=p.x+16 && b.x+b.width<=p.x+p.width-16 && b.y>=p.y+12 && b.y+b.height<=p.y+p.height-12,'Texto cabe na caixa: '+item.text);
            assert.ok(item.size*data.canvasWidth/1280>=14,'Fonte legível no viewport: '+item.text);
            for(const next of data.texts.slice(index+1)) {
                const n=next.bounds;
                assert.equal(b.x<n.x+n.width && b.x+b.width>n.x && b.y<n.y+n.height && b.y+b.height>n.y,false,'Textos sem sobreposição: '+item.text+' / '+next.text);
            }
        }
    };
    const blocked = async (mobile = false) => {
        await evaluate(`(()=>{const s=__checkedScene,p=s.interactions.find(i=>i.id==='agua');
            s.player.body.reset(p.x,p.y+48);s.input.setTopOnly(false);
            window.__behindClicks=0;window.__oldWalkUI=s.instructionsUI;
            window.__walkInputTrace=[];
            window.__oldWalkChildren=s.instructionsUI.container.list.slice();
            window.__behind=s.add.zone(0,0,1280,720).setOrigin(0).setScrollFactor(0).setDepth(21999).setInteractive();
            for(const event of ['pointerdown','pointerup']) {
                window.__behind.on(event,p=>{window.__behindClicks++;window.__walkInputTrace.push({target:'behind',event,x:p.x,y:p.y});});
                s.instructionsUI.container.list[0].on(event,p=>window.__walkInputTrace.push({target:'blocker',event,x:p.x,y:p.y}));
                s.instructionsUI.button.on(event,p=>window.__walkInputTrace.push({target:'button',event,x:p.x,y:p.y}));
            }
            window.__beforeWalk={x:s.player.x,y:s.player.y,tutor:s.tutorPatrol.sprite.x};})()`);
        for(const [key,code,number] of [['ArrowRight','ArrowRight',39],['w','KeyW',87],['e','KeyE',69],[' ','Space',32],['a','KeyA',65],['b','KeyB',66],['c','KeyC',67],['Enter','Enter',13],['Tab','Tab',9]]) {
            await page.send('Input.dispatchKeyEvent',{type:'rawKeyDown',key,code,windowsVirtualKeyCode:number});
            await frames(2);
            await page.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:number});
        }
        if(mobile) { await touch(154,436);await touch(1050,650);await touch(640,638,true); }
        else { await click(154,436);await click(1050,650); }
        await frames(30);
        assert.equal(await get('walkStarted'),false);
        assert.equal(await evaluate('(()=>{const s=__checkedScene,b=window.__beforeWalk;return s.player.x===b.x && s.player.y===b.y && s.tutorPatrol.sprite.x===b.tutor;})()'),true,'Jogador e tutor parados');
        assert.equal(await get('physics.world.isPaused'),true);
        assert.equal(await get('touchControls.enabled'),false);
        assert.equal(await get('interactionSystem.current'),null);
        assert.equal(await get('dialogueSystem.isOpen()'),false);
        assert.equal(await get('dialogueSystem.completedLessons.size'),0);
        assert.equal(await evaluate('window.__behindClicks'),0,'Clique/toque não atravessa a apresentação: '+JSON.stringify(await evaluate('window.__walkInputTrace')));
        // Tecla mantida até Começar não vira uma interação residual.
        await page.send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
        await start(mobile);
        await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
        assert.equal(await evaluate('window.__behindClicks'),0,'Soltura de Começar não atravessa a caixa, mesmo sem topOnly');
        assert.equal(await evaluate('!window.__oldWalkUI.container.scene && window.__oldWalkChildren.every(o=>!o.scene && o.listenerCount("pointerdown")===0 && o.listenerCount("pointerup")===0)'),true,'Início destrói apresentação e eventos');
        await evaluate('window.__behind.destroy();__checkedScene.input.setTopOnly(true);void 0');
        await click(640,638);
        assert.equal(await get('instructionsUI'),null);
        assert.equal(await get('dialogueSystem.completedLessons.size'),0);
    };
    return { ready, start, listeners, layout, blocked };
}
