# Método Abissal
## Manual pedagógico — v0.1

> O Abissal constrói ambiente, ferramenta, avaliação e trilha.
> O que ele não constrói é o profissional. Isso o aluno constrói dentro do ambiente.
> Todo o resto existe só para tornar essa construção inevitável.

---

## 1. As cinco leis

Toda decisão pedagógica da plataforma se submete a estas cinco. Se um módulo, uma aula ou uma funcionalidade violar qualquer uma, ela não entra.

**Lei 1 — Nenhuma aula começa pelo conceito.**
Começa por uma demanda real que o aluno não consegue resolver ainda. O conceito chega depois, como resposta a uma falha que ele acabou de sentir na pele. Instrução antes da tentativa produz reconhecimento; instrução depois da tentativa produz aprendizado.

**Lei 2 — Nenhuma aula termina sem artefato.**
Ao sair, o aluno leva um arquivo que roda, um documento que decide algo ou um número que ele mediu. Aula sem artefato é palestra.

**Lei 3 — O sistema quebra antes do fim.**
Em toda aula existe uma fase de pressão: o dado muda, o custo estoura, alguém ataca o prompt, o fornecedor cai. Quem só viu o caminho feliz não sabe fazer o trabalho.

**Lei 4 — Verificação é automática e é porta.**
Não se avança marcando "concluído". Avança-se passando numa verificação executável. O aluno nunca se ilude sobre o próprio nível, porque não é ele quem julga.

**Lei 5 — Tudo aterrissa no Projeto Farol.**
Cada aula termina com uma transposição obrigatória: onde isso entra no projeto real do aluno. Sem isso, o curso vira coleção de exercícios órfãos.

---

## 2. O Projeto Farol

No primeiro dia, antes de qualquer aula, o aluno declara um projeto real: a empresa que quer construir, o problema que vê no trabalho, a ideia que carrega há anos. Não precisa ser bom. Precisa ser dele.

O Farol é registrado com quatro campos:

| Campo | Pergunta |
|---|---|
| Problema | Quem sofre com isso hoje, e como você sabe? |
| Estado atual | Como esse problema é resolvido sem você? |
| Marco de 90 dias | O que precisa existir para deixar de ser ideia? |
| Prova de valor | Que número muda se der certo? |

A partir daí, o Farol aparece em **toda** aula, na última fase, com uma pergunta gerada a partir do conteúdo daquela aula. Ao fim de um estrato, o aluno não tem só um certificado: tem 30 a 40 anotações de transposição que, juntas, são a especificação do projeto dele.

Ao fim de uma trilha, o Farol vira entrega: um projeto funcionando, medido, com limitação declarada. É isso que ele mostra numa entrevista ou para o primeiro cliente.

---

## 3. A estrutura de um mergulho

Cada aula é um **mergulho** de 60 a 90 minutos, em sete fases. As fases não são etiquetas: são estados de tela do ambiente, com trava entre elas.

| # | Fase | Tempo | O que acontece | Trava para avançar |
|---|---|---|---|---|
| 0 | **Briefing** | 5 min | Chega uma demanda real: mensagem de cliente, chamado, incidente, planilha suja. Nenhuma explicação. | Ler e declarar a interpretação do problema |
| 1 | **Tentativa cega** | 10 min | O aluno resolve com o que já tem. Roda de verdade. Costuma falhar parcialmente. | Ter executado ao menos uma vez |
| 2 | **Descida** | 15 min | Só agora o conceito — e ele responde exatamente à falha que acabou de acontecer. Curto, denso, com fonte. | Responder 2 perguntas de checagem |
| 3 | **Trabalho no fundo** | 30–40 min | Construção na bancada, com verificações executáveis rodando ao lado. | Passar nas verificações obrigatórias |
| 4 | **Pressão** | 10 min | O caso adversarial. O que você fez quebra. Conserte. | Passar na verificação de robustez |
| 5 | **Descompressão** | 5 min | Recuperação ativa: explicar por escrito por que a decisão foi certa e qual foi o custo dela. | Texto enviado |
| 6 | **Emersão** | 5 min | Transposição para o Projeto Farol. | Anotação registrada |

**Por que sete e não três:** as fases 1, 4 e 5 são as que quase todo curso corta — e são exatamente as três responsáveis por retenção e transferência. Tentativa antes da instrução, ruptura depois do sucesso, e explicação com as próprias palavras.

---

## 4. Os seis ambientes

Cada aula roda num ambiente próprio. O ambiente não é decoração: ele impõe as restrições do trabalho real.

**Bancada** — editor, execução e teste. Código roda, verificação roda junto.
*Trilhas: EA, RC, AD, OI, CI, MM, AU.*

**Mesa de Ensaio** — arena de prompt e avaliação. O aluno escreve, roda contra um lote de casos, vê a taxa de acerto e o custo em tokens na hora.
*Trilhas: EP, AV, RC.*

**Sala de Situação** — simulação de incidente em tempo corrido. Alertas chegam, o custo sobe, o relógio anda. Decisões sob pressão com consequência.
*Trilhas: OI, SR, AV.*

**Cabine** — simulação de decisão com papéis. O aluno defende uma escolha diante de um interlocutor difícil (o financeiro cético, o jurídico, o operador que não quer mudar). O interlocutor responde de verdade.
*Trilhas: PD, GE, SR.*

**Prancheta** — canvas de arquitetura. Componentes, fluxos, custo estimado por caminho. A entrega é um desenho defensável.
*Trilhas: AD, OI, EA, PD.*

**Campo** — a única fase que sai da tela. O aluno captura dado do mundo: fotografa, grava, mede, entrevista, cronometra. Depois traz para dentro.
*Trilhas: MM, AU, PD, AD.*

---

## 5. Três níveis de evidência

Ninguém conclui nada por assistir. Cada módulo exige três provas, nesta ordem:

1. **Reproduzir** — fazer funcionar no caso apresentado. Verificação automática.
2. **Transferir** — fazer funcionar num caso novo, que o aluno não viu, com dado diferente. É aqui que se separa quem copiou de quem entendeu.
3. **Defender** — explicar por que a escolha, qual alternativa foi descartada e qual o custo. Avaliado por rubrica, com revisão por pares e por mentor nos estratos E3 e E4.

Só o nível 3 fecha módulo. Níveis 1 e 2 são pré-requisito, não conclusão.

---

## 6. Caderno de Bordo

Tudo que o aluno escreve nas fases 5 e 6 vai para um caderno permanente, organizado por trilha e por data. Ele serve a três funções:

- **Para o aluno:** revisão espaçada. O sistema devolve anotações antigas em contextos novos ("você decidiu X na aula de recuperação híbrida — a decisão de hoje contradiz aquilo. Qual das duas você mantém?").
- **Para o mentor:** enxergar o raciocínio, não só o resultado.
- **Para o mercado:** o caderno exporta como portfólio público — repositório com README, número medido e limitação declarada. É o artefato que consegue emprego, não o certificado.

---

## 7. Retomada espaçada

Sem retomada, 70% evapora em duas semanas. O sistema agenda automaticamente:

- **D+2** — uma verificação curta do módulo, em caso novo.
- **D+10** — o conceito reaparece dentro de uma aula de outro módulo, como pré-requisito silencioso.
- **D+30** — uma aula de estrato superior depende explicitamente da decisão tomada antes.
- **Por estrato** — a entrega avaliativa exige combinar todos os módulos do estrato, não apenas o último.

---

## 8. Ritmo, presença e o aluno que some

O maior inimigo não é dificuldade: é sumiço. Protocolo:

- **Sessão mínima viável:** 25 minutos. Existe uma versão curta de todo mergulho, que ainda termina com artefato.
- **Retomada sem culpa:** ao voltar depois de sumir, o sistema não mostra o quanto atrasou. Mostra o próximo mergulho e um resumo de onde parou.
- **Sinal precoce:** três dias sem sessão com um mergulho iniciado dispara contato humano, não notificação automática.
- **Coorte:** turmas com data de início e defesa em grupo ao fim de cada estrato. Compromisso social é o que sustenta quando a motivação cai.

---

## 9. O papel do mentor

A plataforma corrige. O mentor faz o que a plataforma não faz:

- Lê o Caderno de Bordo e aponta contradição de raciocínio.
- Conduz a defesa oral de E3 e E4 e sustenta a reprovação quando é o caso.
- Ajuda a recortar o Projeto Farol quando ele é grande demais.
- Diz "isso aqui não vai funcionar" com antecedência suficiente para doer pouco.

Proporção-alvo: 1 mentor para 25 alunos ativos em E1–E2, 1 para 12 em E3–E4.

---

## 10. O que a plataforma promete e o que não promete

**Promete:** que ao fim de cada mergulho existe um artefato que roda; que ao fim de cada estrato existe um projeto medido; que ao fim de uma trilha o aluno tem portfólio público e consegue defender cada decisão dele.

**Não promete:** emprego, salário, nem que o Projeto Farol vai dar certo. Muitos não vão. O que se garante é que o aluno vai descobrir isso construindo e medindo — e sairá com a habilidade de construir e medir a próxima ideia.

Essa honestidade é parte do método. Uma escola que promete resultado inevitável está ensinando a primeira lição errada.
