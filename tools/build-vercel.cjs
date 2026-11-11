const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'vercel-dist');
const filesIn = (dir, extension) => fs.readdirSync(path.join(root, dir), { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith(extension))
  .map(entry => `${dir}/${entry.name}`);
const entrypoints = ['index.html', ...filesIn('css', '.css'), ...filesIn('javascript', '.js')];
const files = new Set([
  ...entrypoints,
  ...filesIn('assets/dialogos/retratos', '.png'),
  ...filesIn('assets/fontes', '-OFL.txt'),
]);

// Collect local resources referenced by HTML, JavaScript and stylesheets.
const assetPath = /(?:^|["'(`])(?:\.\.\/)?(assets\/[^\s"'()?]+\.(?:png|webp|jpe?g|svg|ttf|woff2?|mp3|ogg|wav))\b/gim;
for (const entrypoint of entrypoints) {
  const source = fs.readFileSync(path.join(root, entrypoint), 'utf8');
  for (const [, resource] of source.matchAll(assetPath)) files.add(resource);
}

for (const file of files) {
  if (!path.resolve(root, file).startsWith(`${root}${path.sep}`) || !fs.statSync(path.join(root, file)).isFile()) {
    throw new Error(`Recurso inválido: ${file}`);
  }
}

fs.rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target);
}
console.log(`Publicação estática: ${files.size} arquivos em vercel-dist/`);
