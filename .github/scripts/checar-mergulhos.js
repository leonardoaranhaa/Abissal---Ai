#!/usr/bin/env node
// Valida todo content/mergulhos/*.mergulho.json contra as regras de
// docs/schema/mergulho.schema.json. Sem dependência externa (mesmo padrão de
// checar-referencias.js) — checa estrutura e as invariantes que um JSON
// Schema sozinho não expressa bem (exatamente uma opção correta, todo
// verificador referenciado existe de fato).
//
// Ver docs/formato-mergulho.md antes de mudar este script ou o schema.

const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "..", "content", "mergulhos");

const FASES_ESPERADAS = [
  "0_briefing",
  "1_tentativa_cega",
  "2_descida",
  "3_trabalho_no_fundo",
  "4_pressao",
  "5_descompressao",
  "6_emersao",
];

const AMBIENTES = ["Bancada", "Mesa de Ensaio", "Sala de Situação", "Cabine", "Prancheta", "Campo"];
const LEIS = ["lei1", "lei2", "lei3", "lei4", "lei5"];
const TIPOS_VERIFICADOR = ["json-schema", "regex", "campo-nao-nulo", "tipo-de-campo", "estavel-entre-execucoes", "funcao-pura"];

let erros = 0;

function erro(arquivo, msg) {
  console.error(`✗ ${arquivo}: ${msg}`);
  erros++;
}

function checarString(arquivo, campo, v, opts = {}) {
  if (typeof v !== "string" || (!opts.vazioOk && v.trim() === "")) {
    erro(arquivo, `campo "${campo}" precisa ser string não vazia`);
    return false;
  }
  return true;
}

function checarOpcoes(arquivo, caminho, opcoes, chaveBooleana) {
  if (!Array.isArray(opcoes) || opcoes.length < 2) {
    erro(arquivo, `${caminho}: precisa de ao menos 2 opções`);
    return;
  }
  let corretas = 0;
  opcoes.forEach((o, i) => {
    checarString(arquivo, `${caminho}[${i}].texto`, o.texto);
    checarString(arquivo, `${caminho}[${i}].retorno`, o.retorno);
    if (typeof o[chaveBooleana] !== "boolean") {
      erro(arquivo, `${caminho}[${i}].${chaveBooleana} precisa ser boolean`);
    } else if (o[chaveBooleana]) {
      corretas++;
    }
  });
  if (corretas !== 1) {
    erro(arquivo, `${caminho}: precisa haver exatamente uma opção com ${chaveBooleana}=true (achei ${corretas})`);
  }
}

function checarCaso(arquivo, caminho, caso) {
  if (!caso || typeof caso !== "object") {
    erro(arquivo, `${caminho}: caso ausente`);
    return;
  }
  checarString(arquivo, `${caminho}.id`, caso.id);
  checarString(arquivo, `${caminho}.entrada`, caso.entrada);
}

function checarVerificadores(arquivo, verificadores) {
  const ids = new Set();
  if (!Array.isArray(verificadores) || verificadores.length === 0) {
    erro(arquivo, "verificadores: precisa ter ao menos 1");
    return ids;
  }
  verificadores.forEach((v, i) => {
    if (!checarString(arquivo, `verificadores[${i}].id`, v.id)) return;
    if (ids.has(v.id)) erro(arquivo, `verificadores[${i}].id "${v.id}" duplicado`);
    ids.add(v.id);
    checarString(arquivo, `verificadores[${i}].descricao`, v.descricao);
    if (!TIPOS_VERIFICADOR.includes(v.tipo)) {
      erro(arquivo, `verificadores[${i}].tipo "${v.tipo}" não é um dos permitidos: ${TIPOS_VERIFICADOR.join(", ")}`);
    }
  });
  return ids;
}

function checarExecucoes(arquivo, caminho, execucoes, idsVerificadores) {
  if (!Array.isArray(execucoes) || execucoes.length === 0) {
    erro(arquivo, `${caminho}: precisa de ao menos 1 execução`);
    return;
  }
  execucoes.forEach((ex, i) => {
    const p = `${caminho}[${i}]`;
    checarString(arquivo, `${p}.texto`, ex.texto);
    checarString(arquivo, `${p}.diagnostico`, ex.diagnostico);
    if (!["roteirizado", "vivo"].includes(ex.modo)) {
      erro(arquivo, `${p}.modo precisa ser "roteirizado" ou "vivo", veio "${ex.modo}"`);
    }
    if (!ex.resultados_teste || typeof ex.resultados_teste !== "object") {
      erro(arquivo, `${p}.resultados_teste ausente`);
    } else {
      for (const id of Object.keys(ex.resultados_teste)) {
        if (!idsVerificadores.has(id)) {
          erro(arquivo, `${p}.resultados_teste referencia verificador "${id}", que não existe em verificadores[]`);
        }
        if (typeof ex.resultados_teste[id] !== "boolean") {
          erro(arquivo, `${p}.resultados_teste["${id}"] precisa ser boolean`);
        }
      }
    }
  });
}

function checarMergulho(arquivo, m) {
  if (!/^[A-Z]{2}\.E[1-4]\.M\d{2}\.A\d{2}$/.test(m.id || "")) {
    erro(arquivo, `id "${m.id}" não bate com o padrão TRILHA.EN.MNN.ANN`);
  }
  checarString(arquivo, "titulo", m.titulo);
  if (!/^\d+\.\d+\.\d+$/.test(m.versao || "")) erro(arquivo, `versao "${m.versao}" não é semver (N.N.N)`);
  if (!AMBIENTES.includes(m.ambiente)) erro(arquivo, `ambiente "${m.ambiente}" não é um dos 6 ambientes de docs/metodo-abissal.md §4`);
  if (!Number.isInteger(m.duracao_min) || m.duracao_min < 25) erro(arquivo, `duracao_min precisa ser inteiro >= 25 (sessão mínima viável, §8)`);
  if (!Array.isArray(m.leis) || m.leis.length === 0 || !m.leis.every((l) => LEIS.includes(l))) {
    erro(arquivo, `leis[] precisa ser um array não vazio com valores dentre ${LEIS.join(", ")}`);
  }

  const idsVerificadores = checarVerificadores(arquivo, m.verificadores);

  if (!m.fases || typeof m.fases !== "object") {
    erro(arquivo, "fases ausente");
    return;
  }
  const chaves = Object.keys(m.fases);
  for (const f of FASES_ESPERADAS) {
    if (!chaves.includes(f)) erro(arquivo, `fases: falta a chave "${f}"`);
  }
  for (const f of chaves) {
    if (!FASES_ESPERADAS.includes(f)) erro(arquivo, `fases: chave "${f}" não é uma das 7 fases esperadas`);
  }

  const f0 = m.fases["0_briefing"];
  if (f0) {
    checarString(arquivo, "fases.0_briefing.contexto", f0.contexto);
    (f0.casos || []).forEach((c, i) => checarCaso(arquivo, `fases.0_briefing.casos[${i}]`, c));
    checarOpcoes(arquivo, "fases.0_briefing.opcoes_leitura", f0.opcoes_leitura, "correta");
    checarString(arquivo, "fases.0_briefing.trava", f0.trava);
  }

  const f1 = m.fases["1_tentativa_cega"];
  if (f1) {
    checarString(arquivo, "fases.1_tentativa_cega.instrucao", f1.instrucao);
    checarExecucoes(arquivo, "fases.1_tentativa_cega.execucoes", f1.execucoes, idsVerificadores);
    checarString(arquivo, "fases.1_tentativa_cega.trava", f1.trava);
  }

  const f2 = m.fases["2_descida"];
  if (f2) {
    if (!Array.isArray(f2.conceito) || f2.conceito.length === 0) erro(arquivo, "fases.2_descida.conceito precisa ser array não vazio");
    (f2.checagens || []).forEach((c, i) => {
      checarString(arquivo, `fases.2_descida.checagens[${i}].pergunta`, c.pergunta);
      checarOpcoes(arquivo, `fases.2_descida.checagens[${i}].opcoes`, c.opcoes, "correta");
    });
    if (!Array.isArray(f2.checagens) || f2.checagens.length === 0) erro(arquivo, "fases.2_descida.checagens precisa ser array não vazio");
    checarString(arquivo, "fases.2_descida.trava", f2.trava);
  }

  const f3 = m.fases["3_trabalho_no_fundo"];
  if (f3) {
    checarString(arquivo, "fases.3_trabalho_no_fundo.instrucao", f3.instrucao);
    checarExecucoes(arquivo, "fases.3_trabalho_no_fundo.execucoes", f3.execucoes, idsVerificadores);
    checarString(arquivo, "fases.3_trabalho_no_fundo.trava", f3.trava);
  }

  const f4 = m.fases["4_pressao"];
  if (f4) {
    checarCaso(arquivo, "fases.4_pressao.ataque", f4.ataque);
    checarOpcoes(arquivo, "fases.4_pressao.defesas", f4.defesas, "resiste");
    checarString(arquivo, "fases.4_pressao.trava", f4.trava);
  }

  const f5 = m.fases["5_descompressao"];
  if (f5) {
    checarString(arquivo, "fases.5_descompressao.pergunta", f5.pergunta);
    if (!Number.isInteger(f5.min_caracteres) || f5.min_caracteres < 1) erro(arquivo, "fases.5_descompressao.min_caracteres precisa ser inteiro >= 1");
    checarString(arquivo, "fases.5_descompressao.trava", f5.trava);
  }

  const f6 = m.fases["6_emersao"];
  if (f6) {
    checarString(arquivo, "fases.6_emersao.texto", f6.texto);
    checarString(arquivo, "fases.6_emersao.trava", f6.trava);
  }
}

if (!fs.existsSync(contentDir)) {
  console.log("Nenhum content/mergulhos/ ainda — nada para validar.");
  process.exit(0);
}

const arquivos = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mergulho.json"));

if (arquivos.length === 0) {
  console.log("Nenhum arquivo .mergulho.json em content/mergulhos/ — nada para validar.");
  process.exit(0);
}

for (const nome of arquivos) {
  const arquivo = path.relative(path.join(__dirname, "..", ".."), path.join(contentDir, nome));
  let m;
  try {
    m = JSON.parse(fs.readFileSync(path.join(contentDir, nome), "utf8"));
  } catch (e) {
    erro(arquivo, `JSON inválido: ${e.message}`);
    continue;
  }
  checarMergulho(arquivo, m);
}

if (erros > 0) {
  console.error(`\n${erros} erro(s) em ${arquivos.length} arquivo(s) de mergulho.`);
  process.exit(1);
}
console.log(`${arquivos.length} arquivo(s) de mergulho validado(s) contra docs/schema/mergulho.schema.json.`);
