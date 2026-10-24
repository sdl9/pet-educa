import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sharedScenerySnapshot } from './helpers/walkSceneComparison.mjs';

const tree = { role: 'scenery', key: 'plaza-tree-large-base', frame: '__BASE', x: 192, y: 352,
    width: 128, height: 128, scaleX: 1.5, scaleY: 1.5, originX: 0.5, originY: 1,
    depth: 352, flipX: false, flipY: false };
const tutor = { ...tree, key: 'npc-tutor-cachorro-guia', frame: 0, width: 128, height: 64,
    x: 544, y: 368, depth: 368, scaleX: 1.8, scaleY: 1.8 };
const compare = (gameplay, editor) => assert.deepEqual(
    sharedScenerySnapshot(gameplay, 'gameplay'), sharedScenerySnapshot(editor, 'editor'));

test('comparison excludes only explicit runtime roles and retains unknown scenery', () => {
    compare([tree, ...['player', 'saci', 'heart', 'hud'].map(role => ({ ...tree, role }))], [tree]);
    assert.throws(() => compare([tree, { ...tree, key: 'unexpected-sprite' }], [tree]));
    assert.throws(() => sharedScenerySnapshot([{ ...tree, role: 'unknown' }], 'gameplay'));
});

test('comparison retains duplicates, static frames, positions and geometry', () => {
    assert.throws(() => compare([tree, tree], [tree]));
    for (const field of ['frame', 'x', 'y', 'width', 'height', 'scaleX', 'scaleY', 'originX', 'originY', 'depth', 'flipX', 'flipY']) {
        const changed = typeof tree[field] === 'number' ? tree[field] + 1 : !tree[field];
        assert.throws(() => compare([{ ...tree, [field]: changed }], [tree]), field);
    }
    compare([tree, tutor], [tutor, tree]);
});

test('tutor phase, patrol X and facing vary; geometry and editor anchor do not', () => {
    compare([{ ...tutor, x: 640, frame: 3, flipX: true }], [tutor]);
    assert.throws(() => compare([{ ...tutor, x: 641 }], [tutor]));
    assert.throws(() => compare([tutor], [{ ...tutor, x: 545 }]));
    for (const field of ['y', 'depth', 'scaleX', 'width', 'height']) {
        assert.throws(() => compare([{ ...tutor, [field]: tutor[field] + 1 }], [tutor]), field);
    }
});

test('only the three declared animations permit valid frame phase changes', () => {
    for (const [key, width, height, frames] of [
        ['plaza-fountain-water', 160, 128, 6], ['plaza-spring-rider', 96, 96, 12]
    ]) {
        const animated = { ...tree, key, width, height, frame: 0 };
        compare([{ ...animated, frame: frames - 1 }], [animated]);
        assert.throws(() => compare([{ ...animated, frame: frames }], [animated]));
        assert.throws(() => compare([{ ...animated, x: animated.x + 1 }], [animated]));
    }
    assert.throws(() => compare([{ ...tutor, frame: 4 }], [tutor]));
});
