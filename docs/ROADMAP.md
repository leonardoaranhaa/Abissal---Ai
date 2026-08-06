# Roadmap — Abissal

Cada fase tem um critério de saída explícito. Não avance para a fase seguinte sem
bater o critério — é a defesa contra o erro mais comum em projeto solo: construir a
próxima coisa porque é mais interessante que validar a atual.

## Fase 0 — Validação de demanda (agora)

**Está em:** `site/`, landing estática, R$ 0–100/mês.

**Critério de saída:** 60 leads com Projeto Farol específico (não "quero aprender IA",
e sim algo com contexto concreto) em 30 dias corridos desde a publicação.

**Enquanto estiver aqui:**
- Medir 3 números: % que termina o diagnóstico, % que deixa e-mail depois do resultado,
  qualidade qualitativa do campo Farol (ler um por um, não só contar).
- Não escrever código de plataforma (login, pagamento, área de aluno).
- Pode e deve iterar na própria landing: testar variações de pergunta, do laboratório
  de demonstração, dos textos de "Verdades". É barato mudar aqui.

**Se não bater o número em 30 dias:** o problema não é o site, é a proposta ou o
público. Ajustar a landing não resolve — a próxima ação é conversa direta com quem
deixou lead e com quem não converteu, não mais engenharia.

## Fase 1 — Produção da primeira trilha

**Gatilho:** critério da Fase 0 batido.

**Objetivo:** produzir o conteúdo completo de UMA trilha (candidatas naturais pelo
retorno rápido ao aluno: Engenharia de Prompt ou Automação — decidir com base em qual
teve mais leads na Fase 0, não por preferência).

Isso significa: os módulos que hoje só têm título e objetivo em `curriculo.js` ganham
os 7 mergulhos completos (briefing, tentativa cega, descida, bancada, pressão,
descompressão, emersão), no padrão do mergulho de demonstração já construído
(`EP.E1.M02.A03`, hoje hardcoded em `app.js` como conteúdo de exemplo).

**Decisão de arquitetura pendente, a tomar no início desta fase:** formato de arquivo
para um mergulho completo. Candidatos: JSON por aula, Markdown com frontmatter, ou
migrar para um CMS leve. Não decidir isso agora — decidir quando houver 2-3 mergulhos
reais escritos e um padrão emergir do uso, não da teoria.

**Critério de saída:** uma trilha (4 estratos, ~12 módulos, ~48 aulas) com conteúdo
real, testável por um aluno beta do zero ao fim.

## Fase 2 — MVP de plataforma

**Gatilho:** Fase 1 completa E pelo menos 5 alunos beta reais rodando a trilha.

Aqui entra a primeira peça de backend real:
- Autenticação simples (Supabase Auth ou equivalente)
- Progresso do aluno persistido (hoje é só `localStorage`/`window.storage` na demo)
- Chamadas de modelo passando por rota de servidor, nunca direto do browser com
  chave exposta — o laboratório de demonstração da Fase 0 não faz chamada real de API
  por esse motivo
- Caderno de Bordo funcional (hoje é conceito documentado, não implementado)

Stack sugerida quando chegar a hora: Next.js + Vercel + Supabase. Não adotar antes —
ver seção "O que NÃO fazer" em `CLAUDE.md`.

**Critério de saída:** primeira turma paga, mesmo que pequena (10–20 alunos),
completando a trilha com o método real (verificação executável, não simulada).

## Fase 3 — Segunda trilha e mentoria em escala

**Gatilho:** Fase 2 com turma concluída e taxa de conclusão documentada.

Aqui a conversa muda de "construir a plataforma" para "operar a escola": processo
repetível de produção de mergulho, proporção mentor/aluno definida em
`docs/metodo-abissal.md` (1:25 em E1–E2, 1:12 em E3–E4) precisa de ferramenta de
verdade para o mentor acompanhar Caderno de Bordo de várias pessoas.

Não detalhado ainda — revisitar este roadmap ao chegar aqui, com dados reais das
fases anteriores em mãos.

---

**Regra geral entre todas as fases:** cada uma financia a seguinte. Não usar capital
próprio para pular fase — se a Fase 1 não gerar aluno pagante suficiente para
financiar parte da Fase 2, o problema é de novo validação, não de mais construção.
