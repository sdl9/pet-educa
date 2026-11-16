import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  A cena Boot costuma carregar os recursos necessários ao Preloader, como o logotipo ou o fundo do jogo.
        //  Quanto menores os arquivos dos recursos, melhor, pois a própria cena Boot não tem um pré-carregador.

        this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
