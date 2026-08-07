# Como o currículo foi desenhado

Referência rápida de convenções ao editar `site/data/curriculo.js`. Para o dado em si,
ver a seção "O dado central" em `CLAUDE.md`.

## Códigos de trilha (campo `c`)

Duas letras, fixas, usadas em toda parte (URL de módulo, título de mergulho, etc.):

| Código | Trilha |
|---|---|
| BT | Batismo (entrada) |
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

## Estratos

E1 Fótico (fundamentos) → E2 Plataforma (aplicação) → E3 Talude (especialização)
→ E4 Abissal (fronteira). Nunca criar um 5º estrato nem trocar o significado de um
existente: a carta de profundidade e o medidor lateral dependem dessa escala.

Uma trilha **pode** parar antes do E4, e o site lida com isso — a carta desenha as
células que faltam tracejadas, com um traço no lugar do número. Isso existe para o
Batismo, que tem só E1 e E2 de propósito: ele leva até a borda, não até o fundo, e
mostrar isso na carta é mais honesto que fingir quatro estratos.

O que não pode: começar em E2, ou pular E2 e ter E1 e E3. Estrato ausente só no fim.

## Trilha de entrada

`BT · Batismo` é a porta para quem não vem da área, e segue três regras próprias:

- **`cargos` vazio.** Ela não leva a um cargo, leva às trilhas que levam. No lugar
  dos cargos vai o campo `destino` (`{texto, trilhas[], nota}`), que o site renderiza
  como as portas que ela destrava. Nunca inventar faixa salarial para ela.
- **Pré-requisitos sem jargão.** "Vontade de construir alguma coisa", não "lógica básica" —
  quem lê isso está decidindo se pertence ao lugar.
- **Ordem entender → construir → técnica.** A base técnica vem depois de já existir um
  motivo para ela. Inverter isso é começar pelo conceito, que a Lei 1 proíbe.

Quem marca "nunca escrevi uma linha" no diagnóstico é roteado para o Batismo antes da
trilha alvo (ver `EXIGEM_CODIGO` em `app.js`). Ao criar uma trilha nova que precise de
código, incluir o código dela nessa lista.

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
