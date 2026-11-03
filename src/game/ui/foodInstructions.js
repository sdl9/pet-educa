import { Textures } from 'phaser';
import { FOOD_CONFIG } from '../data/foodConfig';
import { PET_EDUCA_UI, addPetEducaImage } from './petEducaUI';

// Composição lógica em 1280 × 720, escalada pelo FIT já usado pelo jogo.
// Duas linhas de alimentos permitem legendas grandes também no celular horizontal.
export function createFoodInstructions(scene, onStart) {
    const first = scene.children.list.length;
    const { fonts, colors } = PET_EDUCA_UI;
    const body = { fontFamily: fonts.body, fontStyle: '700', fontSize: 30, color: colors.brown };
    const heading = { fontFamily: fonts.heading, fontSize: 34, color: colors.brown };
    const panel = addPetEducaImage(scene, 'panel', 32, 88).setDisplaySize(1216, 616);
    const title = scene.add.text(640, 106, 'Ajude o Caramelo a comer bem!', {
        ...heading, fontSize: 44
    }).setOrigin(0.5, 0);

    // Textos separados destacam a duração sem reduzir o restante da frase.
    const sentence = [
        scene.add.text(0, 166, 'Você tem ', body),
        scene.add.text(0, 166, '1 minuto', { ...body, fontStyle: '900', color: '#365321' }),
        scene.add.text(0, 166, ' para pegar os alimentos que fazem bem ao Caramelo', body)
    ];
    let x = (1280 - sentence.reduce((width, text) => width + text.width, 0)) / 2;
    for (const text of sentence) { text.x = x; x += text.width; }
    scene.add.text(640, 204, 'e ganhar pontos!', body).setOrigin(0.5, 0);
    scene.add.text(640, 249, 'Desvie dos alimentos que fazem mal para ele!', {
        ...body, fontSize: 32, fontStyle: '900'
    }).setOrigin(0.5, 0);

    for (const [type, label, left, width, color, fill] of [
        ['bom', 'Pode comer:', 72, 540, 0x496c31, 0xf0f1d2],
        ['ruim', 'Faz mal:', 632, 576, 0x8e3c35, 0xffe4d0]
    ]) {
        const center = left + width / 2;
        const frame = scene.add.graphics();
        frame.fillStyle(fill).fillRoundedRect(left, 300, width, 280, 16);
        frame.lineStyle(3, color).strokeRoundedRect(left, 300, width, 280, 16);
        const groupTitle = scene.add.text(center + 20, 304, label, heading).setOrigin(0.5, 0);
        // Símbolos desenhados: independem de cor e de fontes de emoji.
        const symbolX = groupTitle.x - groupTitle.width / 2 - 28;
        frame.lineStyle(5, color);
        if (type === 'bom') {
            frame.beginPath().moveTo(symbolX - 10, 325).lineTo(symbolX - 2, 333)
                .lineTo(symbolX + 12, 315).strokePath();
        } else {
            frame.lineBetween(symbolX - 9, 316, symbolX + 9, 334);
            frame.lineBetween(symbolX + 9, 316, symbolX - 9, 334);
        }
        const foods = FOOD_CONFIG[type];
        const columns = Math.ceil(foods.length / 2);
        const cellWidth = width / columns;
        foods.forEach(({ texture, name }, index) => {
            const x = left + cellWidth * (index % columns + 0.5);
            const y = 384 + Math.floor(index / columns) * 118;
            scene.textures.get(texture).setFilter(Textures.FilterMode.NEAREST);
            scene.add.image(x, y, texture).setScale(2).setData('foodType', type);
            scene.add.text(x, y + 34, name, body).setOrigin(0.5, 0).setData('foodType', type);
        });
    }

    const button = addPetEducaImage(scene, 'button', 500, 590);
    scene.add.text(640, 638, 'Começar', { ...heading, fontSize: 42, color: colors.cream }).setOrigin(0.5);
    button.setInteractive({ useHandCursor: true }).on('pointerdown', onStart);
    const container = scene.add.container(0, 0, scene.children.list.slice(first)).setDepth(10000);
    return { container, panel, title, button };
}
