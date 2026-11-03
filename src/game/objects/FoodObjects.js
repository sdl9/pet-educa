import { Math as PhaserMath } from 'phaser';
import { FOOD_CONFIG } from '../data/foodConfig';

export default class FoodObjects {
    static criar(cena, tipo, grupo) {
        const x = cena.scale.width + 50;
        const y = PhaserMath.Between(440, 630);
        const alimentos = FOOD_CONFIG[tipo];
        const { texture: textura } = alimentos[PhaserMath.Between(0, alimentos.length - 1)];
        // O grupo cria o corpo antes de aplicarmos os valores do alimento.
        // Assim seus defaults não sobrescrevem a velocidade definida abaixo.
        const item = grupo.create(x, y, textura).setOrigin(0.5).setScale(2);

        item.tipo = tipo;
        // 30 pixels de origem viram os 60 pixels da colisao anterior na escala 2.
        item.body.setSize(30, 30).setOffset(1, 1);
        item.body.updateFromGameObject();
        item.body.setAllowGravity(false);
        item.body.setVelocityX(-325);
        return item;
    }
}
