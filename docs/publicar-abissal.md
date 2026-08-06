# Colocar o Abissal no ar

Arquivo único, sem servidor, sem build. Custo mensal: **R$ 0**. Só o domínio (~R$ 40/ano).

## 1. Configurar a captação (5 min)

Abra `abissal-landing.html`, ache o bloco de configuração no topo do `<script>`:

```js
const FORM_ENDPOINT = "";
const WHATSAPP      = "";
```

**Formspree** (recomendado — grátis até 50 leads/mês):
1. Crie conta em formspree.io, novo form, copie a URL `https://formspree.io/f/xxxxxxx`
2. Cole em `FORM_ENDPOINT`
3. Nas configurações do form, ative notificação por e-mail

**Alternativa sem limite mensal:** Google Apps Script publicado como Web App gravando numa planilha. Mais trabalho, zero custo, dados seus.

Em `WHATSAPP`, coloque seu número no formato `5514999999999` (sem + e sem espaços). Deixe vazio para ocultar o botão.

Enquanto `FORM_ENDPOINT` estiver vazio, o site roda em **modo teste**: o lead aparece no console do navegador e o visitante vê um aviso. Não publique assim.

## 2. Publicar (10 min)

**Netlify Drop** — o caminho mais curto:
1. Renomeie o arquivo para `index.html`
2. Arraste a pasta em app.netlify.com/drop
3. Está no ar

**Vercel** ou **Cloudflare Pages** funcionam igual. Ambas grátis, ambas com HTTPS automático.

## 3. Domínio

Registre em registro.br (`.com.br` ~R$ 40/ano) e aponte para a hospedagem. `abissal.com.br` ou `escolaabissal.com.br`. Vale checar antes se o nome está livre também como marca no INPI, já que a intenção é comercial.

## 4. Medir (o ponto principal)

Sem métrica, validação vira torcida. Coloque Plausible (grátis 30 dias) ou Umami autohospedado, e acompanhe **três números**:

| Métrica | O que significa | Sinal bom |
|---|---|---|
| % que termina o diagnóstico | O conteúdo prende? | acima de 35% de quem começa |
| % que deixa e-mail depois do resultado | O percurso convence? | acima de 20% |
| Qualidade do campo Farol | Interesse real ou curiosidade? | respostas com contexto específico |

O terceiro é o mais importante e não aparece em dashboard nenhum: leia os Projetos Farol um por um. Se as pessoas escreverem projetos concretos e específicos, existe demanda. Se escreverem "quero aprender IA", ainda não existe.

## 5. Onde levar o link

- Grupos e comunidades de tecnologia e de negócios no seu estado
- LinkedIn, com o diagnóstico como isca (não com o discurso de "curso")
- Sua rede direta primeiro: 20 conversas boas valem mais que 2.000 visitas frias
- Faculdades e escolas técnicas da região

## Critério de decisão

Defina o número **antes** de publicar. Sugestão: **60 leads com Projeto Farol específico em 30 dias**. Chegando lá, produza a primeira trilha e abra a turma. Não chegando, o problema não é o site — é a proposta ou o público, e aí a conversa é outra.
