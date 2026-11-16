import { PET_EDUCA_UI, addPetEducaImage } from './petEducaUI';

// Referência direta: foodInstructions.js. Mesmo painel, botão, fontes,
// cores e escala lógica; apenas o conteúdo e seus espaçamentos são próprios.
export function createWalkInstructions(scene, onStart) {
    const first = scene.children.list.length;
    const { fonts, colors } = PET_EDUCA_UI;
    const body = { fontFamily: fonts.body, fontStyle: '700', fontSize: 30, color: colors.brown };
    const heading = { fontFamily: fonts.heading, fontSize: 34, color: colors.brown };
    // Intercepta também comandos fora da caixa. Menu fica acima desta camada.
    // O hit test considera o fator do filho, mesmo dentro de um HUD fixo.
    const blocker = scene.add.zone(0, 0, 1280, 720).setOrigin(0).setScrollFactor(0).setInteractive();
    for (const type of ['pointerdown', 'pointerup']) {
        blocker.on(type, (pointer, x, y, event) => event.stopPropagation());
    }
    const panel = addPetEducaImage(scene, 'panel', 32, 88).setDisplaySize(1216, 616);
    const text = (y, content, style = body) => scene.add.text(640, y, content, style).setOrigin(0.5, 0);
    text(106, 'Hora do passeio!', { ...heading, fontSize: 44 });
    text(166, 'Vamos aprender durante um passeio na praça?');
    text(222, 'Explore o cenário e converse com as pessoas!', { ...body, fontSize: 32, fontStyle: '900' });
    text(268, 'Descubra os cuidados que devemos ter com os animais durante o passeio.');

    const highlight = scene.add.graphics();
    highlight.fillStyle(0xf0f1d2).fillRoundedRect(72, 324, 1136, 104, 16);
    highlight.lineStyle(3, 0x496c31).strokeRoundedRect(72, 324, 1136, 104, 16);
    text(332, 'Descubra os 7 cuidados durante o passeio pela praça!', { ...body, fontSize: 32, fontStyle: '900' });
    text(378, 'Visite lugares e converse com pessoas com as quais você pode aprender.');
    text(442, 'Preste atenção nas dicas e explore com calma.');
    text(480, 'Cada descoberta ajuda você a cuidar melhor do seu amigo!');
    text(534, 'Vamos passear?', heading);

    const button = addPetEducaImage(scene, 'button', 500, 590).setScrollFactor(0);
    text(638, 'Começar', { ...heading, fontSize: 42, color: colors.cream }).setOrigin(0.5);
    let pressed = null;
    const cancel = () => { pressed = null; };
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', (pointer, x, y, event) => {
        event.stopPropagation();
        pressed = pointer.id;
    });
    button.on('pointerout', cancel);
    button.on('pointerup', (pointer, x, y, event) => {
        event.stopPropagation();
        if (pressed !== pointer.id) return;
        cancel();
        onStart();
    });
    scene.input.on('pointerupoutside', cancel);
    window.addEventListener('blur', cancel);
    scene.game.canvas.addEventListener('pointercancel', cancel);
    scene.game.canvas.addEventListener('touchcancel', cancel);
    const container = scene.add.container(0, 0, scene.children.list.slice(first))
        .setDepth(22000).setScrollFactor(0, 0, true);
    return {
        container, panel, button,
        destroy() {
            scene.input.off('pointerupoutside', cancel);
            window.removeEventListener('blur', cancel);
            scene.game.canvas.removeEventListener('pointercancel', cancel);
            scene.game.canvas.removeEventListener('touchcancel', cancel);
            container.destroy();
        }
    };
}
