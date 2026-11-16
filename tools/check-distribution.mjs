// Run after npm run build-nolog. Checks the current tree, not Git history.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { WALK_IMAGE_ASSETS, WALK_SPRITESHEETS, WALK_JSON_ASSETS } from '../src/game/data/walkAssetCatalog.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const forbiddenDirectory = /(^|\/)(art-source|tmp|node_modules|WalkGame_Assets_Animados|Pet-Educa-Telas|quiz-saci-q4-assets|previews|frames|referencias|Default|Cache)(\/|$)/;
async function files(directory, prefix = '') {
    const result = [];
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const relative = prefix + entry.name;
        if (entry.isDirectory()) {
            assert.equal(forbiddenDirectory.test(relative), false, 'Source/profile/cache directory in public or dist: ' + relative);
            result.push(...await files(path.join(directory, entry.name), relative + '/'));
        }
        else {
            assert.ok(entry.isFile(), 'Unexpected filesystem entry: ' + relative);
            result.push(relative);
        }
    }
    return result.sort();
}
const publicRoot = path.join(root, 'public'), distRoot = path.join(root, 'dist');
await fs.access(path.join(distRoot, 'index.html')).catch(() => {
    throw new Error('Build ausente. Execute npm run build-nolog antes de test:distribution.');
});
const publicFiles = await files(publicRoot), distFiles = await files(distRoot);
for (const file of distFiles) {
    assert.equal(forbiddenDirectory.test(file), false, 'Source package/profile/cache in distribution: ' + file);
    assert.equal(/\.md$/i.test(file), false, 'Creation prompt/document in distribution: ' + file);
    assert.equal(['assets/2.png', 'assets/tst.png', 'dist.zip', 'h -u origin walk-layout-editor-phase-a'].includes(file), false,
        'Obsolete artifact in distribution: ' + file);
    assert.equal(file.endsWith('/build_background.py'), false, 'Art generator in distribution');
}
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const assets = [];
for (const file of publicFiles) {
    const source = await fs.readFile(path.join(publicRoot, file));
    const built = await fs.readFile(path.join(distRoot, file));
    assert.equal(sha256(built), sha256(source), 'Public asset bytes differ in build: ' + file);
    assets.push({ file, bytes: source.length, sha256: sha256(source) });
}
// Deliberately retain extra catalog entries; verify all of them still resolve.
for (const { key, path: assetPath } of [...WALK_IMAGE_ASSETS, ...WALK_SPRITESHEETS, ...WALK_JSON_ASSETS]) {
    assert.ok(publicFiles.includes('assets/' + assetPath), 'Missing walk catalog entry: ' + key);
}
const residues = execFileSync('git', ['ls-files', '-z', '--', 'tmp', 'dist.zip', 'h -u origin walk-layout-editor-phase-a'],
    { cwd: root, encoding: 'utf8', windowsHide: true }).split('\0').filter(Boolean);
assert.deepEqual(residues, [], 'Temporary/local artifacts must be absent from the current Git index');
let distBytes = 0;
for (const file of distFiles) distBytes += (await fs.stat(path.join(distRoot, file))).size;
const report = { passed: true, publicFiles: publicFiles.length, publicBytes: assets.reduce((total, item) => total + item.bytes, 0),
    distFiles: distFiles.length, distBytes, temporaryIndexEntries: residues, assets };
const output = path.join(root, 'tmp/distribution-validation');
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(`PASS distribution: ${publicFiles.length} public files byte-identical; ${distFiles.length} files / ${distBytes} bytes; no source packages, previews, prompts or temporary index entries.`);
