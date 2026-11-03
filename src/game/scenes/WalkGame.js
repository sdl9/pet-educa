import { Input, Scene } from 'phaser';
import walkMap from '../data/walkMap.json';
import { WALK_DIALOGUES } from '../data/walkDialogues';
import { WalkVisualBuilder } from '../systems/WalkVisualBuilder';
import { WalkCollisionBuilder } from '../systems/WalkCollisionBuilder';
import { WalkInteractionSystem } from '../systems/WalkInteractionSystem';
import { WalkDialogueSystem } from '../systems/WalkDialogueSystem';
import { WalkTutorPatrol } from '../systems/WalkTutorPatrol';
import { readKeyboardDirection, combineDirections, shouldShowTouchControls } from '../systems/DirectionInput';
import { VirtualDPad } from '../systems/VirtualDPad';
import { WalkPlayer } from '../objects/WalkPlayer';
import { Saci } from '../objects/Saci';
import { createWalkButton } from '../ui/walkUI';
import { createPetEducaScreen } from '../ui/petEducaUI';
import { createWalkInstructions } from '../ui/walkInstructions';

export class WalkGame extends Scene {
    constructor() {
        super('WalkGame');
    }

    create() {
        this.uiNavigating = false;
        this.walkStarted = false;
        this.instructionsUI = null;
        this.physics.pause();
        this.interactions = walkMap.interactions.map(interaction => ({ ...interaction }));
        const visualBuilder = new WalkVisualBuilder(this);
        const layout = this.cache.json.get('walk-layout');
        const stage = visualBuilder.build(
            walkMap,
            layout,
            { includeRegistry: true }
        );
        const collisionManifest = this.cache.json.get(
            'walk-collision-depth-manifest'
        );

        const playerCollision =
            collisionManifest.objects['walk-player'].collisionShapes[0];


        this.physics.world.setBounds(
            0,
            0,
            stage.width,
            stage.height
        );

        this.player = new WalkPlayer(
            this,
            800,
            832,
            playerCollision
        );
        this.saci = new Saci(
            this,
            layout.placements.saci.x,
            layout.placements.saci.y
        );

        const collisionBuilder = new WalkCollisionBuilder(
            this,
            collisionManifest
        );
        this.walkCollisions = collisionBuilder.build({
            player: this.player,
            stageMap: walkMap,
            layout,
            visualRegistry: stage.visualRegistry
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.teclas = this.input.keyboard.addKeys({
            cima: 'W',
            baixo: 'S',
            esquerda: 'A',
            direita: 'D',
            espaco: 'SPACE'
        });

        this.showTouchControls = shouldShowTouchControls();
        this.touchControls = new VirtualDPad(this, this.showTouchControls);
        this.touchControls.setEnabled(false);

        this.onInputInterrupted = () => {
            this.touchControls.clear();
            this.player.mover(0, 0);
        };
        this.onVisibilityChange = () => {
            if (document.hidden) this.onInputInterrupted();
        };
        window.addEventListener('blur', this.onInputInterrupted);
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.events.on('pause', this.onInputInterrupted);
        this.events.once('shutdown', () => {
            window.removeEventListener('blur', this.onInputInterrupted);
            document.removeEventListener('visibilitychange', this.onVisibilityChange);
            this.events.off('pause', this.onInputInterrupted);
        });

        this.dialogueSystem = new WalkDialogueSystem(
            this,
            WALK_DIALOGUES,
            walkMap.requiredLessons
        );
        this.interactionSystem = new WalkInteractionSystem(
            this,
            this.interactions,
            (interaction) => {
                if (!this.walkStarted || this.uiNavigating) return;
                this.touchControls.setEnabled(false);
                this.player.mover(0, 0);
                this.dialogueSystem.openInteraction(interaction);
                this.tutorPatrol.setPaused(true);
            }
        );

        const tutor = stage.educationalElements.find(object => object.texture.key === 'npc-tutor-cachorro-guia');
        this.tutorPatrol = new WalkTutorPatrol(
            tutor,
            this.interactions.find(interaction => interaction.id === 'guia'),
            this.walkCollisions.syncObject
        );
        const cleanupTutor = () => {
            this.events.off('shutdown', cleanupTutor);
            this.events.off('destroy', cleanupTutor);
            this.tutorPatrol.destroy();
            this.tutorPatrol = null;
            this.interactions = null;
        };
        this.events.once('shutdown', cleanupTutor);
        this.events.once('destroy', cleanupTutor);
        this.tutorPatrol.setPaused(true);

        this.menuButton = createWalkButton(this, 1080, 12, 184, 64, 'Menu', () => this.returnToMenu());
        this.controlsButton = createWalkButton(this, 872, 12, 184, 64, 'Controles', () => this.showControls());
        this.controlsButton.setEnabled(false);
        this.menuUI = this.add.container(0, 0, [
            this.menuButton.background, this.menuButton.text, this.menuButton.hit,
            this.controlsButton.background, this.controlsButton.text, this.controlsButton.hit
        ]).setDepth(22001).setScrollFactor(0, 0, true);

        this.cameras.main
            .setBounds(0, 0, stage.width, stage.height)
            .setZoom(1)
            .centerOn(
                this.player.x,
                this.player.y
            )
            .startFollow(
                this.player,
                true,
                0.15,
                0.15
            );
        this.events.once('shutdown', this.clearInstructions, this);
        createPetEducaScreen(this, () => {
            this.instructionsUI = createWalkInstructions(this, () => this.startWalk());
        });
    }

    clearInstructions() {
        this.instructionsUI?.destroy();
        this.instructionsUI = null;
    }

    startWalk() {
        if (this.walkStarted || this.uiNavigating || !this.instructionsUI) return;
        this.walkStarted = true;
        // Descarta teclas/toques da apresentação antes de liberar o cenário.
        this.input.keyboard.resetKeys();
        this.touchControls.clear();
        this.clearInstructions();
        this.controlsButton.setEnabled(true);
        this.touchControls.setEnabled(this.showTouchControls);
        this.tutorPatrol.setPaused(false);
        this.physics.resume();
    }

    showControls() {
        if (!this.walkStarted || this.uiNavigating || this.dialogueSystem.isOpen()) return;
        this.touchControls.setEnabled(false);
        this.player.mover(0, 0);
        this.tutorPatrol.setPaused(true);
        this.dialogueSystem.showPages(WALK_DIALOGUES.intro, () => this.dialogueSystem.close(), { allowClose: true, closeOnly: true });
    }

    returnToMenu() {
        if (this.uiNavigating) return;
        this.uiNavigating = true;
        this.menuButton.setEnabled(false);
        this.controlsButton.setEnabled(false);
        this.touchControls.setEnabled(false);
        this.player.mover(0, 0);
        this.clearInstructions();
        this.scene.start('MainMenu');
    }

    update(time, delta) {
        if (this.uiNavigating || !this.walkStarted) return;
        const interactionPressed = Input.Keyboard.JustDown(this.teclas.espaco);

        const dialogueWasOpen = this.dialogueSystem.isOpen();
        this.dialogueSystem.update(interactionPressed);
        const dialogueOpen = this.dialogueSystem.isOpen();
        this.tutorPatrol.update(delta, dialogueWasOpen || dialogueOpen);
        this.touchControls.setEnabled(this.showTouchControls && !dialogueOpen);

        const direction = dialogueOpen
            ? { x: 0, y: 0 }
            : combineDirections(
                readKeyboardDirection(this.cursors, this.teclas),
                this.touchControls.getDirection()
            );

        this.player.mover(direction.x, direction.y);
        this.saci.atualizarInteracao(this.player);
        this.interactionSystem.update(this.player, !dialogueOpen);

        if (
            !dialogueWasOpen
            && !dialogueOpen
            && interactionPressed
        ) {
            this.interactionSystem.activateCurrent();
        }
    }
}
