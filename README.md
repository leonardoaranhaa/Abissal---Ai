# Abissal — Escola Avançada de Inteligência Artificial

Landing interativa de validação de demanda. Sem build, sem backend, sem dependências.

## Rodar localmente

Qualquer servidor estático funciona, porque `index.html` carrega CSS/JS por caminho
relativo (não abre com `file://` — os `<script src>` falham por CORS em alguns navegadores).

```bash
cd site
python3 -m http.server 8000
# ou
npx serve .
```

Abra `http://localhost:8000`.

## Estrutura

Ver `CLAUDE.md` — é o mapa completo do repositório e das convenções.

```
site/index.html              shell HTML
site/assets/css/style.css    design system (tokens no :root)
site/assets/js/app.js        toda a lógica (diagnóstico, laboratório, currículo, form)
site/data/curriculo.js       currículo completo — 12 trilhas, 132 módulos
```

## Captação de lead

Configurado em `site/assets/js/app.js`, topo do arquivo:

```js
const FORM_ENDPOINT = "https://formspree.io/f/xdenobvp";
const WHATSAPP      = "";   // "5514999999999" ou vazio
```

O endpoint fica no repositório de propósito — ele aparece no código-fonte de qualquer
página publicada, então escondê-lo não protegeria nada, e tirá-lo daqui quebraria o
deploy automático a partir do GitHub. Chave de API é outra história: essa nunca entra
no repositório.

Se `FORM_ENDPOINT` estiver vazio, o site roda em modo teste — o lead cai no console
do navegador em vez de ser enviado.

## Deploy

Vercel conectada a este repositório: todo push em `main` republica sozinho.
Root directory do projeto na Vercel: `site/`. Sem build step, sem custo.
Passo a passo e alternativas (Netlify, Cloudflare) em `docs/publicar-abissal.md`.

## Onde editar o currículo

`site/data/curriculo.js`. É um objeto JS puro — `estratos` (4, fixos) e `trilhas`
(hoje 12). Formato de cada campo documentado em `CLAUDE.md`, seção "O dado central".

Depois de editar, valide a sintaxe antes de commitar:

```bash
node -e "require('./site/data/curriculo.js')" 2>&1 | head -5
```

(vai reclamar de `module.exports` ausente — é esperado, o arquivo é feito para
`<script>` no browser, não para Node. O teste serve só para pegar erro de sintaxe JSON.)

## Métricas desta fase

Ver `docs/ROADMAP.md`. Resumo: 60 leads com Projeto Farol específico em 30 dias
é o gatilho para começar a produção de conteúdo da primeira trilha.
