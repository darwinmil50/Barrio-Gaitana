import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const EXTENSIONS = new Set([
  '.ts', '.tsx', '.css', '.json', '.html', '.md', '.js', '.mjs', '.gitignore',
]);
const SKIP = new Set([
  'node_modules', 'dist', 'coverage', 'test-results', 'playwright-report', '.git', '.vite',
]);

function countLines(file) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.length;
}

function walk(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, found);
    else if (EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf('.')))) found.push(path);
  }
  return found;
}

const files = walk(ROOT);
const offenders = files
  .map((file) => ({ file: relative(ROOT, file), lines: countLines(file) }))
  .filter((item) => item.lines > 100)
  .sort((a, b) => b.lines - a.lines);

if (offenders.length > 0) {
  console.error('Archivos con más de 100 líneas:');
  for (const item of offenders) console.error(`  ${item.lines}\t${item.file}`);
  process.exit(1);
}

console.log(`check:lines OK — ${files.length} archivos revisados, ninguno supera 100 líneas.`);
