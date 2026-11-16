import { Scene } from 'phaser';
import { preloadAnimatedWalkAssets } from '../data/walkAnimatedAssets';
import { preloadQuizSaciAssets } from '../data/quizSaciAssets';
import { preloadPetEducaUI, openPetEducaScene } from '../ui/petEducaUI';
import { FOOD_CONFIG } from '../data/foodConfig';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  Esta imagem foi carregada na cena Boot, então podemos exibi-la aqui
        this.add.image(512, 384, 'background');

        //  Uma barra de progresso simples. Este é o contorno da barra.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  Esta é a barra de progresso em si. Ela cresce a partir da esquerda conforme a porcentagem de progresso.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use o evento 'progress' emitido pelo LoaderPlugin para atualizar a barra de carregamento
        this.load.on('progress', (progress) => {

            //  Atualiza a barra de progresso (a barra tem 464px de largura, então 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        this.load.setPath('assets');
        this.petEducaFonts = preloadPetEducaUI(this);

        this.load.image('foodgame-street-background', 'foodgame/background/foodgame-street-background.png');
        this.load.spritesheet('food-dog-caramelo', 'foodgame/dog/food-dog-caramelo-sheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        for (const { texture: key } of Object.values(FOOD_CONFIG).flat()) {
            this.load.image(key, `foodgame/foods/${key}.png`);
        }

        preloadAnimatedWalkAssets(this);
        preloadQuizSaciAssets(this);
        this.load.spritesheet(
            'walk-saci',
            'walk/npcs/saci-idle-spritesheet.png',
            { frameWidth: 128, frameHeight: 96 }
        );
        this.load.image('walk-heart', 'walk/effects/walk-heart.png');
    }

    create() {
        //  Após carregar todos os recursos, este é um bom lugar para criar objetos globais que o restante do jogo pode usar.
        //  Por exemplo, você pode definir animações globais aqui para usá-las em outras cenas.

        //  Vai para o MainMenu. Você também pode usar uma transição de cena, como um escurecimento gradual da câmera.
        const params = new URLSearchParams(window.location.search);
        const startScene = import.meta.env.DEV && params.has('walkLayoutEditor')
            ? 'WalkLayoutEditor'
            : import.meta.env.DEV && (params.has('quizVisual') || params.has('saciQuiz'))
            ? 'SaciGame'
            : params.has('walkLearning')
            ? 'WalkGame'
            : 'Intro';

        if (['Intro', 'SaciGame', 'WalkGame'].includes(startScene)) {
            openPetEducaScene(this, startScene, this.petEducaFonts, {
                visualDemo: import.meta.env.DEV && params.has('quizVisual')
            });
        } else {
            this.scene.start(startScene);
        }

        console.log(
            'Player carregado:',
            this.textures.exists('walk-player')
        );

        console.log(
            'Tileset carregado:',
            this.textures.exists('walk-tileset')
        );

        console.log(
            'Árvore carregada:',
            this.textures.exists('plaza-tree-large')
        );
    }
}
