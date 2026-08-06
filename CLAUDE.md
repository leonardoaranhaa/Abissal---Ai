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
    index.html             → shell HTML, sem estilo/lógica inline
    assets/css/style.css   → todo o design system (tokens no :root)
    assets/js/app.js       → toda a lógica: diagnóstico, laboratório, currículo, form
    data/curriculo.js      → ÚNICA fonte de verdade do currículo (ver abaixo)
  docs/
    metodo-abissal.md      → manual pedagógico — leia antes de mexer em UX de aula
    curriculo.md           → como o currículo foi desenhado, convenções de conteúdo
    ROADMAP.md             → fases seguintes e critérios de avanço
  CLAUDE.md                → este arquivo
  README.md                → como rodar, testar e publicar localmente
```

Não existe build step. `site/` é HTML/CSS/JS puro, aberto direto no navegador ou
servido por qualquer servidor estático. Mantenha assim enquanto estiver em validação —
introduzir um bundler agora é trabalho que não paga aluguel.

## O dado central: `data/curriculo.js`

Define `const DADOS = { estratos: [...], trilhas: [...] }`, carregado antes de `app.js`.

**Estratos** (4, fixos, compartilhados por todas as trilhas):
`{ n, nome, sub, d }` — profundidade nominal, do fótico (fundamentos) ao abissal (fronteira).

**Trilhas** (hoje 12): cada uma com `c` (código de 2 letras, ex. "EP"), `n` (nome), `area`,
`tese`, `ementa`, `pre[]`, `fer[]`, `cargos[]`, e `est[]` — um array de 4 estratos, cada um
com `p` (entrega avaliativa) e `m[]` (módulos).

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
- Nunca commitar `FORM_ENDPOINT` ou chaves de API no repositório público. Ver README
  sobre variáveis de ambiente quando isso deixar de ser um site estático.

## O que NÃO fazer nesta fase

- Não adicionar framework (React, Next.js, etc.) sem o gatilho do ROADMAP.
- Não adicionar backend/banco de dados sem o gatilho do ROADMAP.
- Não pedir cadastro para o visitante fazer o laboratório de demonstração — é decisão
  deliberada, discutida e mantida: cobrar pedágio na demonstração contradiz o
  argumento de honestidade que é o diferencial da escola.
- Não prometer, em nenhum texto de UI, emprego, salário ou resultado garantido.
  Ver seção "Verdades" em `app.js` — esse é o padrão de tom a seguir.
