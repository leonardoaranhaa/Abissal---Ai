#!/usr/bin/env node
// Verifica que todo href/src local em site/**/*.html aponta para um arquivo
// que existe de fato no disco. Existe porque o site não tem build step —
// nada além disso pegaria um caminho errado antes do deploy (foi exatamente
// o bug corrigido em site/ vs. raiz do repo numa sessão anterior).

const fs = require("fs");
const path = require("path");

const siteDir = path.join(__dirname, "..", "..", "site");

function listarHtml(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listarHtml(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

const attrRe = /\b(?:href|src)\s*=\s*"([^"]+)"/g;
let erros = 0;
let checados = 0;

for (const file of listarHtml(siteDir)) {
  const html = fs.readFileSync(file, "utf8");
  let m;
  while ((m = attrRe.exec(html))) {
    const ref = m[1];
    if (/^([a-z]+:)?\/\//i.test(ref) || ref.startsWith("#") || ref.startsWith("mailto:")) continue;
    const alvo = path.join(path.dirname(file), ref.split("#")[0]);
    checados++;
    if (!fs.existsSync(alvo)) {
      console.error(
        `✗ ${path.relative(siteDir, file)}: referência quebrada "${ref}" (esperado em ${path.relative(siteDir, alvo)})`
      );
      erros++;
    }
  }
}

console.log(`${checados} referência(s) local(is) checada(s) em ${listarHtml(siteDir).length} arquivo(s) HTML.`);

if (erros > 0) {
  console.error(`\n${erros} referência(s) quebrada(s).`);
  process.exit(1);
}
console.log("Todas as referências locais resolvem.");
