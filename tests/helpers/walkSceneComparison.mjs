import assert from 'node:assert/strict';

// Assigned by object identity in the real scene, never by texture prefixes,
// visibility, depth, or a catch-all predicate. Unknown roles must fail.
const runtimeRoles = new Set(['player', 'saci', 'heart', 'hud']);
const animatedScenery = new Map([
    ['plaza-fountain-water', { width: 160, height: 128, frames: 6 }],
    ['plaza-spring-rider', { width: 96, height: 96, frames: 12 }],
    ['npc-tutor-cachorro-guia', { width: 128, height: 64, frames: 4 }]
]);

export function sharedScenerySnapshot(snapshot, mode) {
    assert.ok(['gameplay', 'editor'].includes(mode), 'Known scene comparison mode');
    const scenery = [];
    for (const item of snapshot) {
        assert.ok(item.role === 'scenery' || runtimeRoles.has(item.role), `Unknown role: ${item.role}`);
        if (runtimeRoles.has(item.role)) continue;
        const { role, ...visual } = item;
        const animation = animatedScenery.get(visual.key);
        if (animation) {
            assert.equal(visual.width, animation.width, `${visual.key}: frame width`);
            assert.equal(visual.height, animation.height, `${visual.key}: frame height`);
            assert.ok(Number.isInteger(visual.frame) && visual.frame >= 0 && visual.frame < animation.frames,
                `${visual.key}: valid animation frame`);
            // Time-dependent phase only; all geometry remains in the comparison.
            visual.frame = 'animation-phase';
        }
        if (visual.key === 'npc-tutor-cachorro-guia') {
            if (mode === 'gameplay') {
                assert.ok(visual.x >= 448 && visual.x <= 640, 'Tutor stays on its patrol');
            } else {
                assert.equal(visual.x, 544, 'Editor tutor starts at the official anchor');
            }
            // Only X and facing change along this horizontal patrol. Y, depth,
            // size, scale, origin and flipY still have to match the editor.
            assert.equal(typeof visual.flipX, 'boolean', 'Tutor facing is boolean');
            visual.x = 544;
            visual.flipX = false;
        }
        scenery.push(visual);
    }
    // Compare a multiset: render ordering may change between frames. Sorting
    // retains every object, including duplicates and unexpected textures.
    return scenery.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
