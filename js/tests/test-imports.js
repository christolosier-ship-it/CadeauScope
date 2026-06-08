import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve, relative } from 'node:path';
import { applyTheme } from '../services/settings.service.js';

function findJsFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return findJsFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

function exportedNames(source) {
  const names = new Set();
  for (const match of source.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1]);
  for (const match of source.matchAll(/export\s+(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1]);
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(',')) {
      const declaration = part.trim();
      if (!declaration) continue;
      const [, alias] = declaration.split(/\s+as\s+/);
      names.add((alias || declaration).trim());
    }
  }
  if (/export\s+default\b/.test(source)) names.add('default');
  return names;
}

function importedNames(specifier) {
  const namedImport = specifier.match(/\{([^}]+)\}/s);
  if (!namedImport) return [];
  return namedImport[1]
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => part.split(/\s+as\s+/)[0].trim());
}

const projectRoot = resolve(new URL('../..', import.meta.url).pathname);
const jsFiles = findJsFiles(join(projectRoot, 'js'));
const exportMap = new Map(jsFiles.map(file => [resolve(file), exportedNames(readFileSync(file, 'utf8'))]));
const errors = [];

for (const file of jsFiles) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/import\s+([^'";]+?)\s+from\s+['"]([^'"]+)['"]/gs)) {
    const [, specifier, importPath] = match;
    if (!importPath.startsWith('.')) continue;

    const resolvedPath = resolve(dirname(file), importPath);
    const targetPath = extname(resolvedPath) ? resolvedPath : `${resolvedPath}.js`;
    if (!statSync(targetPath, { throwIfNoEntry: false })?.isFile()) {
      errors.push(`${relative(projectRoot, file)} imports missing module ${importPath}`);
      continue;
    }

    const exports = exportMap.get(targetPath) || new Set();
    for (const importedName of importedNames(specifier)) {
      if (!exports.has(importedName)) {
        errors.push(`${relative(projectRoot, file)} imports missing export ${importedName} from ${importPath}`);
      }
    }

    const defaultImport = specifier.replace(/\{[^}]*\}/s, '').replaceAll(',', '').trim();
    if (defaultImport && !defaultImport.startsWith('* as') && !exports.has('default')) {
      errors.push(`${relative(projectRoot, file)} imports missing default export from ${importPath}`);
    }
  }

  for (const match of source.matchAll(/import\s+['"]([^'"]+)['"]/g)) {
    const [, importPath] = match;
    if (!importPath.startsWith('.')) continue;
    const resolvedPath = resolve(dirname(file), importPath);
    const targetPath = extname(resolvedPath) ? resolvedPath : `${resolvedPath}.js`;
    if (!statSync(targetPath, { throwIfNoEntry: false })?.isFile()) {
      errors.push(`${relative(projectRoot, file)} imports missing module ${importPath}`);
    }
  }
}

assert.deepEqual(errors, []);

const root = {
  dataset: {},
  removeAttribute(name) {
    delete this.dataset[name.replace(/^data-/, '')];
    this.removed = name;
  }
};
const meta = { value:'', setAttribute(name, value){ if(name === 'content') this.value = value; } };
globalThis.document = { documentElement: root, querySelector: selector => selector === 'meta[name="theme-color"]' ? meta : null };
applyTheme({ theme: 'dark' });
assert.equal(root.dataset.theme, 'dark');
assert.equal(meta.value, '#222733');
applyTheme({ theme: 'light' });
assert.equal(root.dataset.theme, 'light');
assert.equal(meta.value, '#D94F5C');
applyTheme({ theme: 'auto' });
assert.equal(root.dataset.theme, undefined);
assert.equal(root.removed, 'data-theme');
applyTheme();
assert.equal(root.dataset.theme, undefined);
