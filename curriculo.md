# Como o currículo foi desenhado

Referência rápida de convenções ao editar `site/data/curriculo.js`. Para o dado em si,
ver a seção "O dado central" em `CLAUDE.md`.

## Códigos de trilha (campo `c`)

Duas letras, fixas, usadas em toda parte (URL de módulo, título de mergulho, etc.):

| Código | Trilha |
|---|---|
| EP | Engenharia de Prompt |
| EA | Engenharia de Agentes |
| RC | RAG e Engenharia de Conhecimento |
| AD | Arquitetura de Dados para IA |
| OI | Orquestração e Infraestrutura de IA |
| CI | Cientista de IA e Aprendizado de Máquina |
| AV | Avaliação, Evals e Confiabilidade |
| SR | Segurança, Alinhamento e Red Teaming |
| GE | Governança, Ética e Conformidade em IA |
| PD | Produto de IA e Descoberta de Casos de Uso |
| AU | Automação de Processos com IA |
| MM | IA Multimodal e Visão Computacional |

Não reutilizar um código para outra trilha nem renomear um existente sem avaliar
todo lugar que referencia o código (percursos de carreira, lógica do diagnóstico
em `app.js`, links externos já divulgados).

## Estratos (fixos, os mesmos para todas as trilhas)

E1 Fótico (fundamentos) → E2 Plataforma (aplicação) → E3 Talude (especialização)
→ E4 Abissal (fronteira). Não criar um 5º estrato ou variar por trilha — a carta de
profundidade do site depende dessa simetria.

## Ao adicionar ou editar um módulo

- `t` (título) começa com o que o aluno vai FAZER ou ENTENDER, não com o nome da
  tecnologia. "Especificar formato de saída sem deixar ambiguidade", não "Structured Outputs".
- `o` (objetivo) é uma frase, sempre respondendo "por que isso importa", não "o que é".
- `h` (horas) é estimativa realista de um adulto com o resto da vida acontecendo,
  não de alguém em imersão full-time.
- `a[]` (aulas) hoje são só títulos — o conteúdo completo de cada aula é trabalho da
  Fase 1 do ROADMAP, não editar isso pensando que é o produto final.

## Faixas salariais em `cargos[]`

São indicativas, de vagas públicas brasileiras, e o site já avisa isso ao usuário.
Revisar a cada 6 meses — mercado de IA no Brasil está mudando rápido e número velho
prejudica a credibilidade mais do que ajuda a conversão.
