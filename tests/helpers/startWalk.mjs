import assert from 'node:assert/strict';

// Entra pela apresentação real antes dos checks de exploração já existentes.
export async function startWalk({ page, evaluate, until, scene = '__checkedScene', touch = false }) {
    await until(() => evaluate(`Boolean(${scene}.instructionsUI)`), 'Apresentação do passeio não abriu');
    assert.equal(await evaluate(`${scene}.walkStarted`), false);
    const point = await evaluate(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect();
        return {x:r.x+640*r.width/1280,y:r.y+638*r.height/720};})()`);
    if (touch) await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, id: 1 }] });
    else await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', buttons: 1, clickCount: 1 });
    await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    if (touch) await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    else await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', buttons: 0, clickCount: 1 });
    await until(() => evaluate(`${scene}.walkStarted`), 'Começar não liberou o passeio');
    assert.equal(await evaluate(`${scene}.instructionsUI`), null);
    assert.equal(await evaluate(`${scene}.dialogueSystem.isOpen()`), false);
}
