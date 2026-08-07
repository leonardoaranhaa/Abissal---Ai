# Marca Abissal — guia de uso (v2)

## O conceito

O símbolo é o **corte batimétrico da Fossa das Marianas** — a mesma visualização que
oceanógrafos usam pra desenhar o ponto mais fundo do planeta: um platô raso, uma rampa
que desce, e um entalhe estreito e agudo que mergulha até o Challenger Deep, marcado
com um ponto.

Não é um ícone abstrato de tecnologia. É um lugar real, com uma profundidade real
(**-10.935 m**, medição da expedição *Five Deeps*, 2020 — as estimativas variam entre
10.902 e 10.994 m conforme o método; usamos a mais citada como referência atual). A
assimetria do entalhe — rampa longa de um lado, parede curta do outro — reproduz a
geologia real de uma fossa de subducção, não é enfeite.

A primeira versão deste símbolo usava arcos concêntricos e foi descartada por lembrar
ícone de sinal de wi-fi. Esta versão resolve isso: nada aqui é genérico de "marca de
IA" — é especificamente sobre profundidade, sobre o lugar de onde o nome "Abissal" vem.

## Onde os arquivos vivem no repositório

```
site/assets/logo/svg/     → vetores-fonte, editáveis
site/assets/logo/png/     → exportações em alta resolução
site/assets/favicon/      → favicon.ico + PNGs em todos os tamanhos padrão + apple-touch-icon
```

| Arquivo | Uso |
|---|---|
| `abissal-mark-dark.svg` | símbolo sozinho, fundo escuro/transparente |
| `abissal-mark-light.svg` | símbolo sozinho, fundo claro/transparente |
| `abissal-mark-tile-*.svg` | símbolo com fundo sólido em cantos arredondados — avatar, ícone de app |
| `abissal-mark-mono-*.svg` | versão 1 cor, sem degradê — carimbo, bordado, gravação |
| `abissal-logo-horizontal-*.svg` | símbolo + nome + subtítulo — cabeçalho, papelaria, assinatura de e-mail |
| `abissal-logo-horizontal-dark-simples.svg` | símbolo + nome, sem subtítulo — espaços estreitos |
| `abissal-logo-stacked-*.svg` | símbolo acima do nome — avatar de rede social |
| `abissal-panoramica-*.svg` | peça larga ilustrativa (não é o mark do dia a dia) — capa de site, papel de parede, cabeçalho de apresentação |
| `abissal-panoramica-anotada.svg` | a mesma peça panorâmica com a profundidade real rotulada — página "sobre"/método, materiais institucionais |
| `favicon/favicon.ico` | favicon multi-resolução (16/32/48px) |
| `favicon/apple-touch-icon.png` | ícone de atalho iOS (180px) |
| `favicon/icon-512.png` | ícone PWA / Android (512px) |

## Mark do dia a dia × peça panorâmica — quando usar cada uma

O **mark compacto** (quase quadrado) é a marca — é o que vai no favicon, no avatar, ao
lado do nome. A **panorâmica** é uma peça ilustrativa derivada do mesmo conceito, larga
demais para funcionar como ícone, mas poderosa como imagem de capa ou fundo de seção.
Não use a panorâmica como logo de cabeçalho; não use o mark compacto como imagem hero.

## Como está aplicado hoje no site (`site/`)

`index.html` e `curriculo.html` já carregam o favicon e o mark no cabeçalho:

```html
<link rel="icon" href="assets/favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="assets/favicon/favicon-dark.svg">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png">
<link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
```

A barra clara do topo (`.top .brand`, fundo `--paper`) usa `abissal-mark-light.svg` ao
lado do wordmark em texto; a barra fixa escura (`.hud .bm`, fundo `--abyss` translúcido)
usa `abissal-mark-dark.svg`. Os dois SVGs de mark são transparentes (sem `<rect>` de
fundo), diferente dos `abissal-logo-horizontal-*.svg`, que já vêm com um retângulo de
fundo sólido — por isso o site usa mark + texto (CSS) em vez do lockup horizontal
pronto, para não colar uma caixa sólida sobre o blur da `.hud`. O lockup horizontal
completo fica reservado para papelaria, assinatura de e-mail e materiais fora do site.

A peça `abissal-panoramica-dark.svg` (ou o PNG equivalente) funciona bem como fundo da
seção `#diag` ou do rodapé — onde antes havia só gradiente sólido, ela reforça o
conceito sem competir com o conteúdo, desde que fique com opacidade reduzida ou atrás
do texto. Isso ainda não foi aplicado — é uma melhoria futura, não obrigatória.

## Área de proteção e tamanho mínimo

Deixe ao redor do símbolo um espaço livre de pelo menos a altura da faixa "rasa" (a
parte de cima, mais clara). Abaixo de 24px de altura, o ponto âmbar quase desaparece —
teste em contexto real antes de usar tão pequeno; o entalhe em si continua legível até
16px, o que já é suficiente pra um favicon de aba de navegador.

## Cor

| Token | Hex | Uso |
|---|---|---|
| Abyss | `#07131A` | fundo escuro padrão / platô raso no fundo escuro |
| Paper | `#DCE2DE` | fundo claro / platô raso no fundo claro |
| Hydro (topo do degradê) | `#57BFB0` | água rasa — sempre no topo, nunca no fundo do entalhe |
| Ink (base do degradê) | `#07131A` / `#08151C` | água profunda — sempre a cor mais escura, sempre embaixo |
| Sulfur (acento) | `#E5A82E` (fundo escuro) / `#B9791C` (fundo claro) | o ponto — Challenger Deep, o lugar mais fundo |

O degradê é a alma do símbolo: raso sempre claro, fundo sempre escuro. Não inverta, não
achate num tom só fora da versão mono oficial, e não troque a cor do ponto — ele marca
literalmente um lugar específico no planeta, é a assinatura mais reconhecível da marca.

## O que não fazer

- Não gire o símbolo. A linha de superfície (o tracejado no topo) é sempre horizontal —
  é o nível do mar, a referência de tudo.
- Não simetrize o entalhe. A assimetria (rampa longa + parede curta) é o que faz parecer
  uma fossa de verdade e não um "V" genérico.
- Não separe o ponto âmbar do fundo do entalhe, nem o recolore.
- Não use a peça panorâmica como ícone/favicon — ela não foi desenhada pra isso e perde
  o entalhe estreito quando espremida num formato quadrado.
- Não estique desproporcionalmente.

## Wordmark — nota sobre a fonte

O texto "ABISSAL" usa Archivo Extra Bold (a mesma do site), com fallback para
Helvetica Neue/Arial. Funciona perfeitamente na tela. Para impressão profissional,
converta o texto em contornos num editor vetorial antes de mandar pra gráfica, pra não
depender da fonte estar instalada na máquina de destino.

## Sobre esta versão

Este é o logotipo v2 — substitui a v1 (arcos concêntricos), descartada por lembrar
ícone de sinal wi-fi. Se a marca for registrada oficialmente (INPI), vale checar a
disponibilidade do símbolo e do nome antes do registro.
