# Formato de arquivo do mergulho

Esta é a decisão de arquitetura que `docs/ROADMAP.md` (Fase 1) previa adiar até
existirem 2-3 mergulhos reais escritos. Foi antecipada a pedido — o esquema abaixo
existe para não deixar a primeira trilha real ser escrita em cima de um formato
inventado ad hoc, o que o `CLAUDE.md` já apontava como risco. Continua valendo o
critério do ROADMAP: só a produção de conteúdo de verdade (Fase 1) vai confirmar se
este formato aguenta 48 aulas sem forçar bem. Revisar aqui se ele rachar.

O esquema formal está em `docs/schema/mergulho.schema.json` (JSON Schema
2020-12). O exemplo de referência — o mergulho `EP.E1.M02.A03`, hoje também hardcoded
em `site/assets/js/mergulho.js` — está em `content/mergulhos/EP.E1.M02.A03.mergulho.json`.
Os dois precisam continuar dizendo a mesma coisa; se a landing mudar o texto do
mergulho de demonstração, atualize o arquivo de conteúdo junto.

## Por que este formato existe

`site/data/curriculo.js` é o esqueleto do currículo — trilha, estrato, módulo, e por
enquanto só o **título** de cada aula (`docs/curriculo.md`, seção "Ao adicionar ou
editar um módulo"). Este formato é o **conteúdo completo** de uma aula: as 7 fases,
o texto de cada uma, e — o que importa mais — as verificações executáveis que travam
o avanço. Um arquivo por aula, nomeado pelo id (`EP.E1.M02.A03.mergulho.json`).

## O princípio que organiza tudo: verificação nunca passa por modelo

A Lei 4 (`docs/metodo-abissal.md`) diz que quem julga não é o aluno. Este formato
estende isso: **quem julga também não é um modelo de linguagem**. Um `verificador`
é sempre um teste determinístico — schema JSON, regex, "campo não é null", "tipo é
number", ou uma função pura — nunca uma chamada de API pedindo "isso está certo?".
Um verificador pode ser convencido por um prompt bem escrito; um `assert` não pode.
Isso é o que torna a fase 3 (bancada) e a fase 4 (pressão) uma porta de verdade em
vez de um julgamento de gosto.

Cada `execucao` (uma tentativa de resolver, um prompt escolhido) carrega um campo
`modo`:

- **`roteirizado`** — a saída já está escrita no arquivo, junto com o resultado de
  cada verificador. Custo de modelo zero. É o que a landing usa hoje (nenhuma chamada
  real de API — ver `docs/ROADMAP.md`, Fase 2, sobre por que isso é deliberado) e
  continua sendo o modo certo para qualquer mergulho de demonstração pública.
- **`vivo`** — o prompt roda de verdade contra o sandbox/modelo, e os `verificadores`
  avaliam a saída real, em runtime. É o modo da Fase 2 (plataforma paga). Os
  `resultados_teste` de uma execução `vivo` no arquivo servem de gabarito para
  revisão de conteúdo, não são o resultado que o aluno vê.

Migrar um mergulho de `roteirizado` para `vivo` não deveria exigir reescrever a
fase — só trocar o modo e apontar os verificadores para o runtime real. Se isso não
for verdade na prática, o formato errou em algum lugar.

## As 7 fases, campo a campo

Nomes e travas vêm direto de `docs/metodo-abissal.md` §3 — não são livres.

| Chave | Fase | Campos próprios |
|---|---|---|
| `0_briefing` | Briefing | `contexto`, `casos[]`, `opcoes_leitura[]` (leituras do problema — uma correta), `trava` |
| `1_tentativa_cega` | Tentativa cega | `instrucao`, `execucoes[]` (modo quase sempre `roteirizado` aqui — o aluno ainda não tem instrução), `trava` |
| `2_descida` | Descida | `conceito[]` (parágrafos curtos), `checagens[]` (pergunta + opções), `trava` |
| `3_trabalho_no_fundo` | Trabalho no fundo | `instrucao`, `execucoes[]` (aqui é onde `modo: vivo` compensa o custo — é a fase mais longa), `trava` |
| `4_pressao` | Pressão | `ataque` (um `caso`), `defesas[]` (uma resiste), `trava` |
| `5_descompressao` | Descompressão | `pergunta`, `min_caracteres`, `trava` |
| `6_emersao` | Emersão | `texto` (a ponte para o Projeto Farol), `trava` |

`3_trabalho_no_fundo` e `1_tentativa_cega` reaproveitam a mesma forma
(`faseExecucao` no schema) porque as duas são "aluno escolhe/produz uma tentativa,
vê o resultado, vê o que passou". A diferença é só o momento — antes e depois da
Descida — e o `modo` predominante.

## Verificadores

```json
{
  "id": "v_json_puro",
  "descricao": "JSON puro, sem texto ao redor",
  "tipo": "regex",
  "parametros": { "padrao": "^\\s*\\{[\\s\\S]*\\}\\s*$" }
}
```

`tipo` fecha em seis valores (ver schema). Isso é deliberado — se um verificador
novo não cabe em nenhum, ou é composição de dois existentes, ou o tipo precisa
entrar no schema com discussão, não como `"tipo": "custom"` genérico que vira
gaveta de tudo.

## Onde isso NÃO muda nada ainda

Este formato não está ligado a `site/`. `site/assets/js/mergulho.js` continua
hardcoded como está — reescrever a landing para carregar
`content/mergulhos/*.mergulho.json` em runtime é trabalho de Fase 1/2, não desta
decisão de esquema. O `CLAUDE.md` já avisa: não introduzir isso na landing de forma
improvisada. `content/mergulhos/EP.E1.M02.A03.mergulho.json` existe hoje só como
prova de que o formato consegue representar o mergulho real que já existe — é
validado em CI, não é servido a ninguém.

## Validação

`.github/scripts/checar-mergulhos.js` valida todo `content/mergulhos/*.mergulho.json`
contra as regras do schema (sem dependência externa — mesmo padrão de
`checar-referencias.js`) e roda no CI. Rodar localmente:

```bash
node .github/scripts/checar-mergulhos.js
```

Ao editar um mergulho:
1. `opcoes_leitura`, `checagens[].opcoes` e `defesas` — checar que existe exatamente
   uma correta/resiste `true` (o script confere isso).
2. Todo `verificador.id` referenciado em `resultados_teste` precisa existir em
   `verificadores[]` (o script confere isso também).
3. Subir a versão (`versao`, semver) quando a mudança invalidaria progresso salvo de
   um aluno em andamento — trocar um verificador ou uma trava conta; corrigir
   português não conta.
