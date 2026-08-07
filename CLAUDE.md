# CLAUDE.md — contexto do projeto Abissal

Este arquivo é lido pelo Claude Code no início de cada sessão. Ele existe porque o
desenvolvimento é orquestrado por uma pessoa só, entre sessões que não compartilham
memória — este documento é a memória. Mantenha-o atualizado; ele vale mais que qualquer
comentário espalhado pelo código.

## O que é o Abissal, em uma frase

Escola de IA com método de imersão: cada aula (um "mergulho") tem 7 fases, o aluno
tenta antes de aprender, o avanço é travado por verificação executável, e tudo aterrissa
num projeto real declarado pelo aluno no primeiro dia (o "Projeto Farol").

O manual pedagógico completo está em `docs/metodo-abissal.md`. Leia antes de tomar
qualquer decisão que toque a experiência de aula — as sete fases e as cinco leis do
método não são estética, são a proposta de valor inteira.

## Fase atual do projeto

**Validação de demanda**, não construção de plataforma. `site/` é uma landing
interativa que:
1. faz o visitante responder 5 perguntas e recebe um percurso montado com dados reais do currículo;
2. deixa fazer as 3 primeiras fases de um mergulho de verdade, sem cadastro;
3. captura lead com o percurso + o Projeto Farol anexados.

**Critério de saída desta fase:** 60 leads com Projeto Farol específico (não genérico)
em 30 dias. Antes de bater esse número, não construir login, pagamento, ou área de aluno.
Ver `docs/ROADMAP.md` para as fases seguintes e o que cada uma libera.

Orçamento desta fase: ~R$ 100/mês. Isso significa hospedagem estática grátis
(Netlify/Vercel/Cloudflare Pages) e nenhum backend com custo fixo ainda.

## Estrutura do repositório

```
abissal/
  site/                    → a landing de validação (produção hoje)
    index.html             → landing: hero → mergulho → diagnóstico → lista
    curriculo.html         → catálogo completo (carta de profundidade, percursos)
    assets/css/style.css   → design system (tokens no :root) + a landing
    assets/css/curriculo.css → só o que é específico do catálogo
    assets/js/app.js       → diagnóstico, currículo, formulário, som ambiente
    assets/js/bancada.js   → o laboratório: detector de prompt + verificadores reais
    assets/js/mergulho.js  → o mergulho guiado de 7 fases da landing
    assets/js/curriculo.js → lógica do catálogo
    assets/logo/svg, /png  → identidade visual (mark, wordmark, panorâmica) — ver docs/marca.md
    assets/favicon/        → favicon.ico, PNGs por tamanho, apple-touch-icon
    data/curriculo.js      → ÚNICA fonte de verdade do currículo (ver abaixo)
  docs/
    metodo-abissal.md      → manual pedagógico — leia antes de mexer em UX de aula
    curriculo.md           → como o currículo foi desenhado, convenções de conteúdo
    marca.md               → guia da marca — símbolo, cor, tipografia, o que não fazer
    formato-mergulho.md    → esquema do arquivo de mergulho completo (7 fases + testes)
    ROADMAP.md             → fases seguintes e critérios de avanço
    schema/mergulho.schema.json → JSON Schema formal do mergulho
  content/
    mergulhos/              → mergulhos completos, um arquivo por aula (*.mergulho.json)
  CLAUDE.md                → este arquivo
  README.md                → como rodar, testar e publicar localmente
```

Não existe build step. `site/` é HTML/CSS/JS puro, aberto direto no navegador ou
servido por qualquer servidor estático. Mantenha assim enquanto estiver em validação —
introduzir um bundler agora é trabalho que não paga aluguel.

## A bancada — a regra que não pode ser quebrada

`site/assets/js/bancada.js` é o laboratório da landing, usado no cold open do hero e
nas fases 1, 3 e 4 do mergulho. A pessoa escreve o próprio prompt; a saída é derivada
do que ela escreveu, não de qual botão clicou. A divisão é o argumento de honestidade
da escola, e está escrita na própria página:

- **A resposta do modelo é simulada.** Não há chamada de API (não pode haver chave num
  site estático — e o ROADMAP põe modelo atrás de rota de servidor só na Fase 2). O que
  existe é `lerPrompt()`, um detector das decisões que a aula ensina.
- **A verificação NÃO é simulada.** `VERIFS` roda `JSON.parse`, checagem de tipo e
  comparação de esquema entre execuções, sobre a string produzida. Nunca substituir um
  verificador por julgamento de modelo — é o que a Lei 4 proíbe, e é o que separa esta
  demonstração de um quiz com resposta pré-escrita.

Se um dia a Fase 2 trouxer modelo de verdade, só `gerarSaida()` sai; os verificadores
ficam como estão. Ao mexer no detector, lembre que o modo de falha que importa é o falso
verde: prompt ruim que passa prova que a escola é fachada. Prefira reprovar e explicar.

`content/mergulhos/` é conteúdo, não código do produto: hoje só serve para validação
em CI (ver `docs/formato-mergulho.md`) — nada em `site/` carrega esses arquivos ainda.
Não conectar isso à landing de forma improvisada; a migração de `site/assets/js/mergulho.js`
(hardcoded) para carregar `content/mergulhos/*.mergulho.json` é trabalho da Fase 1/2
do ROADMAP, não desta decisão de esquema.

## O dado central: `data/curriculo.js`

Define `const DADOS = { estratos: [...], trilhas: [...] }`, carregado antes de `app.js`.

**Estratos** (4, fixos, compartilhados por todas as trilhas):
`{ n, nome, sub, d }` — profundidade nominal, do fótico (fundamentos) ao abissal (fronteira).

**Trilhas** (hoje 13, incluindo a de entrada `BT`): cada uma com `c` (código de 2 letras, ex. "EP"), `n` (nome), `area`,
`tese`, `ementa`, `pre[]`, `fer[]`, `cargos[]`, e `est[]` — um array de até 4 estratos, cada
um com `p` (entrega avaliativa) e `m[]` (módulos).

Uma trilha pode parar antes do E4: o `BT · Batismo` tem só E1 e E2 porque leva até a borda,
não até o fundo, e a carta de profundidade desenha as células que faltam tracejadas. Trilha
de entrada também tem `cargos` vazio e um campo `destino` no lugar — ela não promete cargo,
promete porta aberta. Regras completas em `docs/curriculo.md`.

Os números do currículo (trilhas, módulos, aulas, horas) são **calculados** de `DADOS` em
`app.js` e injetados no hero. Nunca escreva esses números à mão no HTML — eles desatualizam
na primeira trilha nova.

**Módulo**: `{ t (título), o (objetivo), h (horas), a[] (aulas, só título por enquanto) }`.

Isso é o esqueleto do currículo, não o conteúdo das aulas. As aulas em si (os 7 mergulhos
completos, como o de `EP.E1.M02.A03` usado no laboratório da landing) ainda não têm um
formato de arquivo próprio — é a próxima decisão de arquitetura relevante, tratada no
ROADMAP quando a fase de produção de conteúdo começar. Não invente esse formato ad hoc
dentro da landing; isso vai virar dívida técnica rápido.

## Convenções de design — não reinvente

Os tokens estão em `:root` no topo de `style.css`. Resumo:

- **Paleta**: fundo abissal quase-preto azulado (`--abyss #07131A`), superfície clara
  só no hero (`--paper #DCE2DE`), acento âmbar (`--sulfur #E5A82E`) para ênfase e chamada,
  acento hidro (`--hydro #57BFB0`) para sucesso/progresso. Nunca use vermelho fora de
  `--alert`, e só para falha real (verificação reprovada), nunca decorativo.
- **Tipografia**: Archivo (display, títulos), Newsreader (corpo, itálico para tese/citação),
  IBM Plex Mono (tudo que é label, metadado, código, unidade de medida).
- **Metáfora estrutural**: profundidade. Estrato 1 é claro/raso, estrato 4 é escuro/denso.
  Isso não é só cor — é a lógica de navegação (o medidor de profundidade, as zonas).
  Qualquer feature nova deveria perguntar "isso reforça ou dilui a metáfora?".
- **Motion**: `--ease` é a curva padrão. Tudo respeita `prefers-reduced-motion` —
  isso é acessibilidade, não polimento, não remova os fallbacks.

## As cinco leis do método (não violar em nenhuma UI de aula)

1. Nenhuma aula começa pelo conceito — começa por uma demanda real.
2. Nenhuma aula termina sem artefato que roda.
3. O sistema quebra antes do fim (fase de pressão obrigatória).
4. Verificação é automática e é porta — nunca autodeclarada.
5. Tudo aterrissa no Projeto Farol do aluno.

Se uma decisão de produto violar uma destas, o problema é a decisão, não a lei.

## Convenções de commit e trabalho solo

Como é uma pessoa só orquestrando, prefira:
- Commits pequenos e descritivos em português, no imperativo: `adiciona verificação de robustez ao laboratório`.
- Um branch por ajuste de UX ou por trilha de conteúdo nova, mesmo trabalhando sozinho —
  facilita reverter quando uma sessão do Code degringola.
- Antes de pedir uma feature nova ao Code, diga a ele para ler este arquivo e
  `docs/metodo-abissal.md` primeiro, especialmente em sessões novas.
- Nunca commitar chave de API no repositório público. `FORM_ENDPOINT` é exceção
  deliberada: ele fica visível no código-fonte de qualquer página publicada, então
  escondê-lo não protegeria nada, e mantê-lo fora do repo quebrava o deploy contínuo
  a partir do GitHub. Chave de verdade (modelo, banco) nunca entra aqui — quando
  isso deixar de ser site estático, vai para variável de ambiente com rota de servidor.

## O que NÃO fazer nesta fase

- Não adicionar framework (React, Next.js, etc.) sem o gatilho do ROADMAP.
- Não adicionar backend/banco de dados sem o gatilho do ROADMAP.
- Não pedir cadastro para o visitante fazer o laboratório de demonstração — é decisão
  deliberada, discutida e mantida: cobrar pedágio na demonstração contradiz o
  argumento de honestidade que é o diferencial da escola.
- Não prometer, em nenhum texto de UI, emprego, salário ou resultado garantido.
  Ver seção "Verdades" em `app.js` — esse é o padrão de tom a seguir.
