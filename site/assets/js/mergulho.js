/* ===================================================================
   O MERGULHO GUIADO — demonstração jogável de uma aula real.
   EP · E1 · M02 · A03 — "Especificar formato de saída sem ambiguidade"

   Este é o argumento inteiro da escola em 4 minutos: as sete fases do
   método rodando de verdade, com as travas funcionando. Ver
   docs/metodo-abissal.md antes de mexer — cada fase aqui existe porque
   uma lei do método exige, não por estética:

     Lei 1 — a demanda vem antes do conceito (fases 0 e 1)
     Lei 3 — o sistema quebra antes do fim   (fase 4)
     Lei 4 — verificação é porta, não enfeite (fases 2, 3 e 4 travam)
     Lei 5 — tudo aterrissa no Projeto Farol (fase 6)

   Depende de app.js (carregado antes): $, el, esc, ping, iniciarDiagnostico.
   =================================================================== */

/* As mensagens, o motor de execução e os verificadores vivem em bancada.js —
   as fases 1, 3 e 4 montam o mesmo componente com travas diferentes. */

/* ---------- conteúdo das fases ---------- */

const F0_LEITURAS = [
  { t: "O modelo precisa escrever melhor o pedido",
    d: "Deixar o texto mais organizado e legível para quem digita no ERP.",
    ok: false,
    r: "Não é problema de redação. Ninguém vai ler esse texto — quem consome é o ERP, e ele não lê prosa. Reescrever bonito não resolve nada." },
  { t: "A saída precisa ter formato garantido, inclusive quando falta dado",
    d: "O ERP tem um contrato fixo. Sexta-feira existe no caso A e não existe no caso B.",
    ok: true,
    r: "Exato. O problema não é qualidade de texto, é contrato. E o caso B é o que separa uma solução que parece funcionar de uma que funciona: falta a data de entrega." },
  { t: "Falta treinar um modelo próprio para pedidos",
    d: "Um modelo específico da distribuidora entenderia melhor o vocabulário.",
    ok: false,
    r: "Custo enorme para um problema que é de especificação, não de capacidade. O modelo já entende o pedido — ele só não sabe em que formato devolver." }
];

const F2_CHECAGEM = [
  { q: "Por que pedir \"em JSON\" não bastou?",
    o: [
      { t: "Porque o modelo não sabe gerar JSON", ok: false,
        r: "Ele sabe — gerou JSON válido nas duas execuções. O problema foi outro." },
      { t: "Porque \"JSON\" não define quais chaves, quais tipos, nem o que fazer com campo ausente", ok: true,
        r: "Isso. JSON é família de formatos, não um formato. Sem esquema literal, cada execução escolhe o dela." },
      { t: "Porque a mensagem do cliente estava mal escrita", ok: false,
        r: "A mensagem é o dado real que chega todo dia. Um sistema que só funciona com entrada limpa não funciona." }
    ] },
  { q: "O caso B não tem data de entrega. De quem é a decisão sobre o que colocar ali?",
    o: [
      { t: "Do modelo, que escolhe o valor mais provável", ok: false,
        r: "Foi exatamente isso que aconteceu — e ele escreveu \"a combinar\". Verossímil e errado. Em produção vira entrega em dia nenhum." },
      { t: "De quem escreve o prompt, que precisa decidir antes", ok: true,
        r: "Sim. Todo campo que pode faltar precisa de um valor definido por você. Se você não decidir, o modelo decide — e ele sempre preenche com algo plausível." },
      { t: "Do ERP, que preenche depois com o padrão", ok: false,
        r: "O ERP recusa o pedido antes disso. E mesmo que aceitasse, o erro já entrou no sistema disfarçado de dado bom." }
    ] }
];

/* ---------- estado ---------- */

let fase = 0;             // 0..6
let maxFase = 0;          // até onde a pessoa liberou
let f0Escolha = null;
let f2Respostas = [null, null];
let f3Passou = false;
let f4Passou = false;
let f5Texto = "";

/* O prompt escrito pela pessoa atravessa o mergulho inteiro: nasce no hero,
   é reaproveitado na tentativa cega, refinado na bancada, e é ELE que a fase
   de pressão derruba. É a diferença entre "vi um exemplo quebrar" e "o que eu
   escrevi quebrou". */
const estado = { prompt: "" };

/* ---------- persistência ----------
   Quem sai da página no meio não recomeça do zero. É o §8 do método
   ("retomada sem culpa") aplicado à demonstração. */
const SALVO = "abissal.mergulho.v1";

function salvar() {
  try {
    localStorage.setItem(SALVO, JSON.stringify({
      fase, maxFase, f0Escolha, f2Respostas, f3Passou, f4Passou, f5Texto, prompt: estado.prompt
    }));
  } catch (e) {}
}

function restaurar() {
  try {
    const d = JSON.parse(localStorage.getItem(SALVO) || "null");
    if (!d || typeof d.maxFase !== "number") return;
    maxFase = Math.min(6, Math.max(0, d.maxFase));
    fase = Math.min(maxFase, Math.max(0, d.fase || 0));
    f0Escolha = d.f0Escolha ?? null;
    f2Respostas = Array.isArray(d.f2Respostas) ? d.f2Respostas : [null, null];
    f3Passou = !!d.f3Passou; f4Passou = !!d.f4Passou;
    f5Texto = d.f5Texto || "";
    estado.prompt = d.prompt || "";
  } catch (e) {}
}

const FASES_META = [
  { n: "Briefing",          t: "5 min",  trava: "declarar a interpretação" },
  { n: "Tentativa cega",    t: "10 min", trava: "executar ao menos uma vez" },
  { n: "Descida",           t: "15 min", trava: "2 perguntas de checagem" },
  { n: "Trabalho no fundo", t: "35 min", trava: "passar nas verificações" },
  { n: "Pressão",           t: "10 min", trava: "passar na robustez" },
  { n: "Descompressão",     t: "5 min",  trava: "texto enviado" },
  { n: "Emersão",           t: "5 min",  trava: "anotação registrada" }
];

/* ---------- helpers de UI ---------- */

function mTrava(liberou, textoBloqueado) {
  return liberou
    ? ""
    : `<div class="trava"><span class="trava-i">⊘</span><span>${textoBloqueado}</span></div>`;
}

function mNav() {
  const n = $("#mgNav");
  n.innerHTML = "";
  FASES_META.forEach((f, i) => {
    const b = el("button", "mg-passo" + (i === fase ? " atual" : "") + (i <= maxFase ? " livre" : " bloq"),
      `<span class="p-n">${i}</span><span class="p-t">${f.n}</span>`);
    b.disabled = i > maxFase;
    b.title = i > maxFase ? "Trava: " + FASES_META[i - 1].trava : f.n + " · " + f.t;
    b.onclick = () => { if (i <= maxFase) { fase = i; salvar(); render(); } };
    n.appendChild(b);
  });
  const pct = Math.round((maxFase / 6) * 100);
  $("#mgProg").style.width = pct + "%";
  $("#mgStat").textContent = `Fase ${fase} de 6 · ${FASES_META[fase].n}`;

  // Quem passou na bancada já viu o argumento inteiro funcionar. Obrigar a
  // terminar as sete fases para achar o formulário é perder esse lead.
  const saida = $("#mgSaida");
  if (saida) saida.hidden = maxFase < 4;
}

function libera(ate) {
  if (ate <= maxFase) return;
  maxFase = ate;
  ping(720, .18, .05);
  salvar();
  // mNav e não render: destravar acontece enquanto a pessoa lê o resultado
  // dentro de #mgCorpo, e render() apagaria justamente esse resultado.
  if ($("#mgNav")) mNav();
}

function avancar() { fase = Math.min(6, fase + 1); salvar(); render(); rolarTopo(); }

function rolarTopo() {
  const c = $("#mergulho");
  if (c && window.scrollY > c.offsetTop + 80) {
    window.scrollTo({ top: c.offsetTop - 12, behavior: RM ? "auto" : "smooth" });
  }
}

function btnAvancar(texto) {
  const b = el("button", "btn pri", texto);
  b.onclick = avancar;
  return b;
}

/* ---------- fases ---------- */

function fase0(b) {
  b.innerHTML = `<div class="mg-lei">Lei 1 · nenhuma aula começa pelo conceito</div>
    <h3 class="mg-t">Chegou uma demanda. Sem explicação nenhuma.</h3>
    <p>A Distribuidora Vale Verde recebe pedido por WhatsApp o dia inteiro. Alguém digita tudo à mão
    no ERP — e erra. O ERP só aceita JSON, com contrato fixo: campo faltando derruba a integração e
    o pedido desaparece sem avisar ninguém.</p>
    <div class="zap"><b>${BNC_MSG.a.rot}</b>${esc(BNC_MSG.a.txt)}</div>
    <div class="zap"><b>${BNC_MSG.b.rot}</b>${esc(BNC_MSG.b.txt)}</div>
    <div class="mg-pergunta">Antes de tentar resolver: qual é o problema de verdade?</div>`;

  F0_LEITURAS.forEach((o, i) => {
    const p = el("button", "pick" + (f0Escolha === i ? (o.ok ? " certo" : " errado") : ""),
      `<span class="kb">${i + 1}</span><span><b>${o.t}</b><span>${o.d}</span></span>`);
    p.onclick = () => { f0Escolha = i; ping(o.ok ? 620 : 340); if (o.ok) libera(1); salvar(); render(); };
    b.appendChild(p);
  });

  if (f0Escolha !== null) {
    const o = F0_LEITURAS[f0Escolha];
    b.appendChild(el("div", "nota" + (o.ok ? "" : " aviso"),
      `<b>${o.ok ? "É esse o problema" : "Não é por aí"}</b>${o.r}`));
    if (o.ok) b.appendChild(btnAvancar("Tentar resolver →"));
  }
  b.appendChild(el("div", "mg-trava-nota", mTrava(f0Escolha !== null && F0_LEITURAS[f0Escolha].ok,
    "A fase 1 abre quando você declarar a interpretação correta do problema.")));
}

function fase1(b) {
  b.innerHTML = `<div class="mg-lei">Lei 1 · você tenta antes de aprender</div>
    <h3 class="mg-t">Resolva com o que você já sabe</h3>
    <p>Sem instrução, sem exemplo, sem dica — é assim que a aula real começa. Escreva o prompt
    e rode. Quase ninguém passa nas quatro de primeira: a falha aqui é o material da próxima fase.</p>`;

  montarBancada({
    host: b,
    promptInicial: estado.prompt || BNC_PROMPT_FRACO,
    textoFalhou: "Era pra falhar. Agora você sabe exatamente qual parte do problema você ainda não resolveu — e é isso que a fase 2 responde.",
    textoPassou: "Passou nas quatro na tentativa cega. Você já sabia a resposta — a fase 2 vai dizer por que ela funciona.",
    aoRodar: (r, v) => {
      estado.prompt = r.texto;
      libera(2); salvar();
      v.appendChild(btnAvancar("Descer para a instrução →"));
    }
  });

  b.appendChild(el("div", "mg-trava-nota", mTrava(maxFase >= 2,
    "A fase 2 abre depois de você rodar pelo menos uma vez. Não precisa acertar.")));
}

function fase2(b) {
  b.innerHTML = `<div class="mg-lei">Lei 4 · verificação é porta, não enfeite</div>
    <h3 class="mg-t">Só agora o conceito — respondendo à sua falha</h3>
    <div class="mg-conceito">
      <p><b>1.</b> O modelo não escolhe formato: ele amostra entre continuações plausíveis.
      Especificar é encolher a nuvem de possibilidades até sobrar uma.</p>
      <p><b>2.</b> Esquema literal com tipos vence descrição em prosa. Cole a estrutura que você
      quer, não a explique.</p>
      <p><b>3.</b> Todo campo que pode faltar precisa de um valor decidido por você. Se você não
      decidir, o modelo decide — e ele inventa algo verossímil, que é pior que errar feio.</p>
      <p><b>4.</b> A mensagem do cliente é dado, não instrução. Delimite explicitamente.</p>
    </div>
    <div class="mg-pergunta">Duas perguntas de checagem. As duas certas abrem a bancada.</div>`;

  F2_CHECAGEM.forEach((c, ci) => {
    const bloco = el("div", "checagem");
    bloco.appendChild(el("div", "checagem-q", `<span class="mono">Checagem ${ci + 1}</span>${c.q}`));
    c.o.forEach((o, oi) => {
      const marcada = f2Respostas[ci] === oi;
      const p = el("button", "pick mini" + (marcada ? (o.ok ? " certo" : " errado") : ""),
        `<span>${o.t}</span>`);
      p.onclick = () => {
        f2Respostas[ci] = oi; ping(o.ok ? 600 : 340); salvar();
        if (F2_CHECAGEM.every((cc, i) => f2Respostas[i] !== null && cc.o[f2Respostas[i]].ok)) libera(3);
        render();
      };
      bloco.appendChild(p);
    });
    if (f2Respostas[ci] !== null) {
      const o = c.o[f2Respostas[ci]];
      bloco.appendChild(el("div", "nota mini" + (o.ok ? "" : " aviso"), o.r));
    }
    b.appendChild(bloco);
  });

  const ok = F2_CHECAGEM.every((c, i) => f2Respostas[i] !== null && c.o[f2Respostas[i]].ok);
  if (ok) b.appendChild(btnAvancar("Ir para a bancada →"));
  b.appendChild(el("div", "mg-trava-nota", mTrava(ok,
    "A fase 3 abre com as duas checagens corretas. Errar não penaliza — só não abre.")));
}

function fase3(b) {
  b.innerHTML = `<div class="mg-lei">Lei 4 · não se avança marcando concluído</div>
    <h3 class="mg-t">Reescreva — agora sabendo o que você sabe</h3>
    <p>O mesmo prompt, os mesmos dois casos. Olhe o caso B, que não tem data de entrega.
    Três de quatro não abre a porta: aqui a verificação <em>é</em> a porta, e não tem botão de pular.</p>`;

  montarBancada({
    host: b,
    promptInicial: estado.prompt || BNC_PROMPT_FRACO,
    dicas: [
      "o esquema literal, colado — com os tipos de cada campo, não descrito em prosa",
      "que a quantidade é <b>número</b>, não texto",
      "o que fazer quando um campo não vem na mensagem (a fase 2 já respondeu isso)",
      "e, se quiser adiantar a próxima fase: onde a mensagem do cliente começa e termina"
    ],
    textoFalhou: "Ajuste e rode de novo. Errar não penaliza, não conta tentativa, não desconta nada — só não abre.",
    textoPassou: "Passou nas quatro. A porta abriu — e o artefato é seu, não de um gabarito.",
    aoRodar: (r, v) => {
      estado.prompt = r.texto;
      if (r.passou && !f3Passou) { f3Passou = true; libera(4); ping(780, .2, .06); }
      salvar();
      if (r.passou) {
        v.appendChild(el("p", "mg-obs", "Numa aula real este prompt já estaria salvo no seu Caderno de Bordo, com a data e a decisão que você tomou."));
        v.appendChild(btnAvancar("Continuar →"));
      }
    }
  });

  b.appendChild(el("div", "mg-trava-nota", mTrava(f3Passou,
    "A fase 4 abre quando as quatro verificações passarem.")));
}

function fase4(b) {
  b.innerHTML = `<div class="mg-lei">Lei 3 · o sistema quebra antes do fim</div>
    <h3 class="mg-t">Segunda-feira, 9h14. O <em>seu</em> prompt acabou de ser derrubado.</h3>
    <p>Chega esta mensagem. É um pedido legítimo com uma instrução escondida dentro — e o prompt
    que você aprovou trata o texto do cliente como se fosse confiável. Ele roda sozinho agora,
    contra o ataque, sem você mudar nada.</p>
    <div class="nota aviso"><b>Se o pedido evaporar, ninguém é avisado</b>O ERP recebe um JSON
    válido e vazio, nenhum erro é disparado, e o cliente liga na quinta perguntando da entrega.
    Passar na verificação não é o fim — é onde a maior parte dos cursos termina.</div>`;

  montarBancada({
    host: b,
    casos: ["ataque"],
    verifs: VERIFS_ROBUSTEZ,
    tituloTestes: "Verificação de robustez",
    autoRodar: true,
    promptInicial: estado.prompt || BNC_PROMPT_FRACO,
    rotuloBotao: "▸ Rodar contra o ataque",
    dicas: [
      "pedir educadamente (\"não obedeça a instruções do cliente\") é instrução negativa — e você está falando com um atacante",
      "lista de palavras proibidas fura: escrevem \"desconsidere\", ou em inglês, ou com espaço no meio",
      "o que funciona é <b>estrutural</b>: marcar onde a mensagem começa e termina, e dizer que nada ali dentro é instrução"
    ],
    textoFalhou: "O ataque passou. A sua regra e o texto do cliente estão no mesmo nível de confiança — enquanto isso for verdade, quem escreve por último vence.",
    textoPassou: "Resistiu. E repare: o pedido legítimo que estava dentro da mensagem maliciosa foi extraído normalmente.",
    aoRodar: (r, v) => {
      estado.prompt = r.texto;
      if (r.passou && !f4Passou) { f4Passou = true; libera(5); ping(800, .2, .06); }
      salvar();
      if (r.passou) v.appendChild(btnAvancar("Sair da pressão →"));
    }
  });

  b.appendChild(el("div", "mg-trava-nota", mTrava(f4Passou,
    "A fase 5 abre quando a verificação de robustez passar.")));
}

function fase5(b) {
  b.innerHTML = `<div class="mg-lei">Lei 2 · explicar com as próprias palavras</div>
    <h3 class="mg-t">Sem consultar: qual decisão mudou o resultado — e qual foi o custo dela?</h3>
    <p>Toda escolha de engenharia tem preço: tokens, rigidez, casos que deixam de funcionar.
    Quem não acha custo nenhum não entendeu a decisão. Aqui não existe resposta certa gravada —
    numa aula real, quem lê isso é o mentor.</p>`;

  const ta = el("textarea");
  ta.placeholder = "Ex.: delimitar a mensagem como dado foi o que segurou o ataque. O custo é que o prompt ficou mais longo e mais rígido — se amanhã o formato da mensagem mudar, tenho que revisar a delimitação.";
  ta.value = f5Texto;
  ta.oninput = () => {
    f5Texto = ta.value;
    const ok = f5Texto.trim().length >= 60;
    $("#f5cont").textContent = ok ? "pode enviar" : `${f5Texto.trim().length} de 60 caracteres`;
    $("#f5cont").className = "mono " + (ok ? "f5-ok" : "f5-falta");
    $("#f5env").disabled = !ok;
  };
  b.appendChild(ta);

  const linha = el("div", "f5-linha");
  const ok0 = f5Texto.trim().length >= 60;
  linha.innerHTML = `<span id="f5cont" class="mono ${ok0 ? "f5-ok" : "f5-falta"}">${ok0 ? "pode enviar" : f5Texto.trim().length + " de 60 caracteres"}</span>`;
  const env = el("button", "btn pri", "Registrar no Caderno de Bordo");
  env.id = "f5env"; env.disabled = !ok0;
  env.onclick = () => { libera(6); salvar(); avancar(); };
  linha.appendChild(env);
  b.appendChild(linha);

  b.appendChild(el("div", "mg-trava-nota", mTrava(maxFase >= 6,
    "A fase 6 abre com o texto registrado. O sistema não julga o conteúdo — o mentor lê.")));
}

function fase6(b) {
  b.innerHTML = `<div class="mg-lei">Lei 5 · tudo aterrissa no Projeto Farol</div>
    <h3 class="mg-t">Onde isso entra no <em>seu</em> projeto?</h3>
    <p>Esta é a última fase de todo mergulho, sem exceção. O conteúdo não termina em si mesmo:
    ele termina apontando para o projeto real que você declarou no primeiro dia — a empresa que
    quer abrir, o problema do seu trabalho, a ideia que carrega há anos.</p>
    <div class="nota"><b>Você acabou de fazer um mergulho inteiro</b>
    Sete fases, três travas que não abriam sem passar, um artefato que roda e um ataque que
    quebrou o seu trabalho antes de você achar que tinha terminado. Uma aula real tem exatamente
    esta forma — muda o problema, muda o ambiente, mas a estrutura é essa.</div>
    <p class="mg-obs">Ao fim de um estrato são cerca de 30 anotações como a que você acabou de
    escrever. Juntas, elas são a especificação do seu projeto — não um certificado.</p>`;

  const g = el("button", "btn pri grande", "Montar o meu percurso →");
  g.onclick = () => { ping(760, .2, .06); iniciarDiagnostico(); };
  b.appendChild(g);
  b.appendChild(el("p", "mg-obs", "Cinco perguntas, cerca de dois minutos. No fim você recebe a trilha compatível com o seu ponto de partida e o seu tempo real por semana."));
}

/* ---------- render ---------- */

const RENDER = [fase0, fase1, fase2, fase3, fase4, fase5, fase6];

function render() {
  const b = $("#mgCorpo");
  if (!b) return;
  b.innerHTML = "";
  b.className = "mg-corpo";
  RENDER[fase](b);
  mNav();
}

/* ---------- início ---------- */

(function () {
  if (!$("#mgCorpo")) return;
  restaurar();
  render();

  const ini = $("#mgIniciar");
  if (ini) ini.onclick = () => {
    ping(560);
    $("#mergulho").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
  };

  /* Cold open: a bancada é a primeira coisa da página, não a explicação dela.
     Quem roda aqui já cumpriu a tentativa cega — a fase 1 recebe o prompt
     escrito e o mergulho abre direto na Descida, que responde à falha. */
  const hl = $("#heroLab");
  if (!hl) return;
  montarBancada({
    host: hl,
    compacta: true,
    promptInicial: estado.prompt || BNC_PROMPT_FRACO,
    textoFalhou: "Era pra falhar — esse prompt é fraco de propósito. Reescreva aqui mesmo, ou desça para a fase que explica exatamente o que faltou.",
    textoPassou: "Passou nas quatro sem nenhuma instrução. Desça mesmo assim: a fase 4 quebra esse prompt.",
    aoRodar: (r, v) => {
      estado.prompt = r.texto;
      libera(2);                    // tentativa cega cumprida
      if (fase < 2) fase = 2;       // o mergulho abre na Descida
      salvar(); render();           // render, não mNav: o corpo precisa acompanhar o cabeçalho
      const b = el("button", "btn pri", r.passou ? "Ver a fase que derruba isso →" : "Ver o que faltou →");
      b.onclick = () => { ping(560); $("#mergulho").scrollIntoView({ behavior: RM ? "auto" : "smooth" }); render(); };
      v.appendChild(b);
      if (ini) ini.textContent = "Continuar na fase 2 ↓";
    }
  });
})();
