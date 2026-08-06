/* ===================================================================
   CONFIGURAÇÃO
   Endpoint de formulário fica no repositório de propósito: ele é
   visível no código-fonte de qualquer página publicada, então esconder
   não protegeria nada. Não vale para chave de API — essa nunca entra aqui.
   =================================================================== */
const FORM_ENDPOINT = "https://formspree.io/f/xdenobvp";
const WHATSAPP      = "";   // ex.: "5514999999999". Vazio = oculto.
/* =================================================================== */

const TRILHAS=DADOS.trilhas, ESTRATOS=DADOS.estratos;
const T=c=>TRILHAS.find(t=>t.c===c);
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- som opcional ---------- */
let AC=null, somOn=false;
function ping(f=520,d=.12,v=.05){
 if(!somOn)return;
 try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  const o=AC.createOscillator(),g=AC.createGain();
  o.type="sine";o.frequency.value=f;g.gain.value=v;
  o.connect(g);g.connect(AC.destination);o.start();
  g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);
  o.stop(AC.currentTime+d+.02);}catch(e){}
}
$("#snd").onclick=()=>{somOn=!somOn;$("#snd").setAttribute("aria-pressed",somOn);
 $("#snd").textContent=somOn?"♪ som ligado":"♪ som";if(somOn)ping(620);};

/* ---------- neve marinha ---------- */
(function(){
 if(RM)return;
 const c=$("#snow"),x=c.getContext("2d");let W,H,ps=[];
 function size(){W=c.width=innerWidth;H=c.height=innerHeight;
  const n=Math.min(48,Math.round(W/28));
  ps=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,
   r:Math.random()*1.5+.4,s:Math.random()*.22+.05,o:Math.random()*.45+.12,
   d:Math.random()*Math.PI*2}));}
 size();addEventListener("resize",size);
 (function loop(){
  x.clearRect(0,0,W,H);
  for(const p of ps){
   p.y-=p.s;p.d+=.01;p.x+=Math.sin(p.d)*.13;
   if(p.y<-4){p.y=H+4;p.x=Math.random()*W;}
   x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);
   x.fillStyle="rgba(160,195,190,"+p.o+")";x.fill();
  }
  requestAnimationFrame(loop);
 })();
})();

/* ---------- medidor + hud ---------- */
const ZONAS=[[0,"Superfície"],[600,"Zona fótica"],[1400,"Plataforma"],[2400,"Talude"],[3200,"Abissal"]];
function gauge(){
 const max=document.body.scrollHeight-innerHeight;
 const p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
 const m=Math.round(p*4000);
 const top=70+p*(innerHeight-140);
 $("#gCur").style.top=top+"px";
 const v=$("#gVal");v.style.top=top+"px";v.textContent=m.toLocaleString("pt-BR")+" m";
 const z=ZONAS.filter(a=>m>=a[0]).pop();
 const gz=$("#gZone");gz.style.top=(top+58)+"px";gz.textContent=z[1];
 $("#hud").classList.toggle("on",scrollY>innerHeight*.75);
}
addEventListener("scroll",gauge,{passive:true});addEventListener("resize",gauge);

/* ---------- revelação ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));

/* ---------- contadores ---------- */
const io2=new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;io2.unobserve(e.target);
 const n=+e.target.dataset.n;if(RM){e.target.textContent=n.toLocaleString("pt-BR");return;}
 let i=0;const t=setInterval(()=>{i+=n/26;if(i>=n){i=n;clearInterval(t);}
  e.target.textContent=Math.round(i).toLocaleString("pt-BR");},26);
}),{threshold:.5});
document.querySelectorAll(".hnums b").forEach(e=>io2.observe(e));

/* ---------- diagnóstico ---------- */
const PERG=[
 {id:"origem",q:"De onde você está partindo?",h:"Não existe resposta errada. Isso muda o ponto de entrada, não o teto.",prof:"0 m",
  o:[["fora","Não sou da área","Outra profissão, ou começando agora"],
     ["op","Operação ou gestão","Você conhece processo e sabe onde dói"],
     ["dev","Desenvolvimento ou TI","Você já entrega software"],
     ["dados","Dados e análise","Você já vive de SQL, planilha ou BI"],
     ["ia","Já uso IA no trabalho","Mexe com ferramentas, quer profundidade"]]},
 {id:"meta",q:"O que precisa ter acontecido daqui a 12 meses?",h:"Escolha o que você defenderia numa conversa difícil em casa.",prof:"200 m",
  o:[["troca","Trocar de carreira","Sair do que faço e trabalhar com IA"],
     ["mais","Ganhar mais no que já faço","Virar a pessoa de IA onde já estou"],
     ["auto","Automatizar minha operação","Devolver horas para mim ou para a empresa"],
     ["prod","Construir um produto próprio","Tirar uma ideia do papel e colocar no ar"],
     ["lider","Liderar IA na empresa","Decidir, avaliar fornecedor, responder pelo risco"]]},
 {id:"tempo",q:"Quanto tempo por semana, de verdade?",h:"Prefira subestimar. O percurso é calculado em cima disso.",prof:"900 m",
  o:[["4","Até 4 horas","Sobrou pouco, mas eu vou"],
     ["7","5 a 9 horas","Umas noites e um pedaço do fim de semana"],
     ["12","10 a 15 horas","É prioridade real na minha semana"],
     ["18","Mais de 15 horas","Estou em transição, com tempo dedicado"]]},
 {id:"code",q:"Sua relação com código hoje?",h:"Isso define se você começa por uma ponte ou direto na trilha.",prof:"1 800 m",
  o:[["0","Nenhuma","Nunca escrevi uma linha"],
     ["1","Fórmula e planilha","Excel avançado, automação simples, no-code"],
     ["2","Um pouco de Python","Consigo ler e adaptar scripts"],
     ["3","Programo profissionalmente","É o meu trabalho"]]},
 {id:"farol",q:"Tem um projeto ou um sonho específico?",h:"Aqui isso vira o seu Projeto Farol: toda aula termina aterrissando nele. Escreva com suas palavras, mesmo que ainda esteja confuso.",prof:"3 000 m",
  tipo:"texto",ph:"Ex.: quero automatizar os orçamentos da marcenaria onde trabalho. Hoje leva 2 horas por cliente e sempre sai erro de medida."}
];
const REGRAS=[
 {se:r=>r.meta==="auto",tri:"AU",apo:"EP"},
 {se:r=>r.meta==="prod",tri:"PD",apo:"EP"},
 {se:r=>r.meta==="lider"&&(r.origem==="dev"||r.origem==="ia"),tri:"GE",apo:"AV"},
 {se:r=>r.meta==="lider",tri:"PD",apo:"GE"},
 {se:r=>r.meta==="troca"&&r.origem==="dev",tri:"EA",apo:"RC"},
 {se:r=>r.meta==="troca"&&r.origem==="dados",tri:"CI",apo:"AD"},
 {se:r=>r.meta==="troca"&&r.origem==="ia",tri:"EA",apo:"AV"},
 {se:r=>r.meta==="troca",tri:"EP",apo:"AU"},
 {se:r=>r.meta==="mais"&&r.origem==="dev",tri:"EA",apo:"OI"},
 {se:r=>r.meta==="mais"&&r.origem==="dados",tri:"AD",apo:"RC"},
 {se:r=>r.meta==="mais"&&r.origem==="op",tri:"AU",apo:"PD"},
 {se:r=>r.meta==="mais"&&r.origem==="ia",tri:"AV",apo:"EP"},
 {se:r=>true,tri:"EP",apo:"AU"}
];
let resp={},passo=0,pronto=false;

/* pergunta 1 no hero */
(function(){
 const h=$("#hopts");
 PERG[0].o.forEach(([v,t],i)=>{
  const b=el("button","hopt",`<span class="kb">${i+1}</span>${t}`);
  b.onclick=()=>{resp.origem=v;passo=1;ping(560);renderDiag();
   document.getElementById("diag").scrollIntoView({behavior:RM?"auto":"smooth"});};
  h.appendChild(b);
 });
})();

function renderDiag(){
 const box=$("#dbox");
 box.style.setProperty("--p",(passo/PERG.length*100)+"%");
 const s=$("#dstep");s.innerHTML="";
 if(passo>=PERG.length){$("#dm1").textContent="Resultado da sondagem";
  $("#dm2").innerHTML="profundidade <b>4 000 m</b>";sondar(s);return;}
 const q=PERG[passo];
 $("#dm1").textContent=`Sondagem · pergunta ${passo+1} de ${PERG.length}`;
 $("#dm2").innerHTML=`profundidade <b>${q.prof}</b>`;
 const d=el("div","dstep",`<div class="eyebrow">${passo===4?"Última — e a mais importante":"Pergunta "+(passo+1)}</div>
  <div class="q">${q.q}</div><p class="hint">${q.h}</p>`);
 if(q.tipo==="texto"){
  const ta=el("textarea");ta.placeholder=q.ph;ta.value=resp.farol||"";
  ta.oninput=()=>{resp.farol=ta.value;};
  d.appendChild(ta);
 }else{
  const g=el("div","opts");
  q.o.forEach(([v,t,dd],i)=>{
   const b=el("button","opt"+(resp[q.id]===v?" sel":""),
    `<span class="kb">${i+1}</span><span><b>${t}</b><span>${dd}</span></span>`);
   b.style.animationDelay=(i*45)+"ms";
   b.onclick=()=>{resp[q.id]=v;passo++;ping(500+passo*40);renderDiag();manterVista();};
   g.appendChild(b);
  });
  d.appendChild(g);
 }
 const nav=el("div","dnav");
 if(passo>0){const b=el("button","dback","← voltar");b.onclick=()=>{passo--;renderDiag();};nav.appendChild(b);}
 else nav.appendChild(el("span"));
 if(q.tipo==="texto"){
  const b=el("button","btn pri","Montar meu percurso");
  b.onclick=()=>{if((resp.farol||"").trim().length<20){d.querySelector("textarea").focus();return;}
   passo++;ping(700);renderDiag();manterVista();};
  nav.appendChild(b);
 }else nav.appendChild(el("span","kbtip","use as teclas 1–"+q.o.length));
 d.appendChild(nav);s.appendChild(d);
}
function manterVista(){const y=$("#diag").offsetTop-16;if(scrollY>y+40||scrollY<y-300)
 window.scrollTo({top:y,behavior:RM?"auto":"smooth"});}
addEventListener("keydown",e=>{
 if(passo>=PERG.length||PERG[passo].tipo==="texto")return;
 const n=parseInt(e.key,10);const q=PERG[passo];
 if(n>=1&&n<=q.o.length&&document.activeElement.tagName!=="TEXTAREA"&&document.activeElement.tagName!=="INPUT"){
  resp[q.id]=q.o[n-1][0];passo++;ping(500+passo*40);renderDiag();manterVista();}
});

function calcula(){
 const r=REGRAS.find(x=>x.se(resp));
 const t=T(r.tri),a=T(r.apo);
 const ponte=(resp.code==="0"&&["EA","CI","AD","OI","MM","SR"].includes(r.tri));
 const horas=t.est.reduce((s,e)=>s+e.m.reduce((x,m)=>x+m.h,0),0);
 const sem=parseInt(resp.tempo,10);
 return {t,a,ponte,horas,sem,meses:Math.max(3,Math.round(horas/sem/4.3)),
  primeiros:t.est[0].m.concat(t.est[1].m).slice(0,4)};
}
function sondar(s){
 const c=calcula();
 const linhas=[
  "cruzando 132 módulos do currículo…",
  `ponto de entrada identificado: <b>estrato 1 · fótico</b>`,
  `trilha compatível: <b>${c.t.n}</b>`,
  `ritmo de ${c.sem} h/semana → <b>~${c.meses} meses</b> até o estrato 4`,
  "ancorando o percurso no seu Projeto Farol…"
 ];
 const box=el("div","sonda");
 s.appendChild(box);
 if(RM){mostrar(s,c);return;}
 linhas.forEach((l,i)=>{
  setTimeout(()=>{const d=el("div",null,'<span class="pulse"></span>'+l);
   box.appendChild(d);ping(420+i*60,.07,.03);},i*330);
 });
 setTimeout(()=>{s.innerHTML="";mostrar(s,c);ping(760,.2,.06);},linhas.length*330+380);
}
function mostrar(s,c){
 pronto=true;
 $("#ctaT").textContent=c.t.c+" · "+c.t.n;
 $("#cta").classList.add("on");
 document.querySelectorAll(".tcard").forEach(x=>x.classList.toggle("hl",x.dataset.c===c.t.c));
 const b=el("div");
 let k=0;const stg=n=>{n.classList.add("stg");n.style.animationDelay=(k++*80)+"ms";return n;};
 b.appendChild(stg(el("div","res-h",`<div class="k">Percurso montado · ${c.t.c}</div>
  <h3>${c.t.n}</h3><p>${c.t.tese}</p>`)));
 b.appendChild(stg(el("dl","grid2",`
  <div><dt>Trilha principal</dt><dd>${c.t.n}<small>${c.t.est.reduce((s,e)=>s+e.m.length,0)} módulos · ${c.horas} horas</small></dd></div>
  <div><dt>Trilha de apoio</dt><dd>${c.a.n}<small>atravessa a principal em pontos-chave</small></dd></div>
  <div><dt>Ritmo estimado</dt><dd>~${c.meses} meses<small>a ${c.sem} h/semana, do E1 ao E4</small></dd></div>
  <div><dt>Primeiro artefato</dt><dd>1ª semana<small>algo que roda, não um certificado</small></dd></div>`)));
 if(c.ponte)b.appendChild(stg(el("div","nota aviso",
  `<b>Uma ressalva honesta</b>Você marcou que não programa, e ${c.t.n} exige código desde o estrato 2.
   Não vamos fingir que dá para pular. Seu percurso começa por <b>Engenharia de Prompt (E1)</b> e
   <b>Automação (E1)</b> como ponte — cerca de 8 semanas — e só então entra em ${c.t.c}.
   É mais longo, e é o que funciona.`)));
 b.appendChild(stg(el("div","nota",`<b>Seu Projeto Farol</b>"${esc((resp.farol||"").slice(0,320))}"<br><br>
  A partir do primeiro dia, toda aula termina com uma pergunta ligando o conteúdo a isso. Ao fim do
  primeiro estrato, você tem cerca de 30 anotações que, juntas, são a especificação do seu projeto.`)));
 b.appendChild(stg(el("div","eyebrow","Seus quatro primeiros mergulhos")));
 const ml=el("div","mlist");ml.style.marginTop="16px";
 c.primeiros.forEach((m,i)=>ml.appendChild(el("div","mrow",
  `<span class="n">M${String(i+1).padStart(2,"0")}</span>
   <span style="flex:1"><b>${m.t}</b><span>${m.o}</span></span><span class="h">${m.h} h</span>`)));
 b.appendChild(stg(ml));
 b.appendChild(stg(el("div","eyebrow","Para onde esta trilha leva")));
 const cg=el("div","cargos");cg.style.marginTop="16px";
 c.t.cargos.forEach(x=>cg.appendChild(el("div","cargo",
  `<b>${x.t}</b><span class="fx">${x.f} / mês</span><p>${x.d}</p>`)));
 b.appendChild(stg(cg));
 const nt=el("p",null,"Faixas indicativas do mercado brasileiro, coletadas de vagas públicas. Servem para calibrar expectativa — não são promessa.");
 nt.style.cssText="color:var(--dim);font-size:13px;margin-top:12px";b.appendChild(stg(nt));
 const nav=el("div","dnav");
 const bk=el("button","dback","← refazer a sondagem");
 bk.onclick=()=>{passo=0;pronto=false;$("#cta").classList.remove("on");renderDiag();manterVista();};
 nav.appendChild(bk);
 const go=el("a","btn pri","Guardar meu percurso");go.href="#lista";nav.appendChild(go);
 b.appendChild(stg(nav));
 s.appendChild(b);
 renderForm(c);
}

/* ---------- laboratório interativo ---------- */
const CASO1='Bom dia! preciso de 20 caixas de água 500ml e 5 fardo de coca 2l pra sexta feira. Mercado São Jorge';
const CASO4='preciso repor: 15 fardos de cerveja lata. Padaria Trigo de Ouro';
const TENT=[
 {p:'"Extraia o pedido da mensagem do cliente e me devolva organizado."',
  s1:`Pedido — Mercado São Jorge

• 20 caixas de água 500ml
• 5 fardos de Coca-Cola 2L

Entrega: sexta-feira`,
  s4:`Cliente: Padaria Trigo de Ouro
Item: 15 fardos de cerveja em lata
Entrega: a combinar`,
  v:[0,0,1,0],d:"Texto em prosa, formato diferente nos dois casos, e a entrega do caso 4 foi inventada. O ERP rejeita os dois."},
 {p:'"Você é um assistente de vendas. Leia a mensagem e liste os itens do pedido."',
  s1:`Itens do pedido:
1. Água 500ml — 20 caixas
2. Coca-Cola 2L — 5 fardos
Cliente: Mercado São Jorge | Entrega: sexta`,
  s4:`Itens do pedido:
1. Cerveja lata — 15 fardos
Cliente: Padaria Trigo de Ouro`,
  v:[0,0,1,1],d:"Ficou mais consistente, mas ainda é lista em markdown. Nenhuma integração consome isso sem um parser frágil no meio."},
 {p:'"Extraia o pedido em JSON."',
  s1:`{"cliente":"Mercado São Jorge","itens":[{"item":"água 500ml","qtd":"20 caixas"},{"item":"coca 2l","qtd":"5 fardos"}],"entrega":"sexta-feira"}`,
  s4:`{"cliente":"Padaria Trigo de Ouro","produtos":["15 fardos de cerveja lata"],"entrega":"a combinar"}`,
  v:[1,0,1,0],d:"JSON nos dois — mas com chaves diferentes entre execuções, quantidade como texto e a entrega do caso 4 inventada. É o erro mais perigoso: parece certo até quebrar em produção."}
];
const FINAL=[
 {p:'Igual à anterior, mas acrescentando: "Responda apenas o JSON."',
  s4:`{"cliente":"Padaria Trigo de Ouro","itens":[{"produto":"cerveja lata","quantidade":15,"unidade":"fardo"}],"entrega":"a combinar"}`,
  v:[1,1,1,0],d:"Quase. O esquema estabilizou, mas nada disse o que fazer quando o campo não existe — então o modelo preencheu com algo verossímil. Em produção, isso vira entrega errada."},
 {p:'Esquema literal com tipos + regra explícita: campo ausente na mensagem = null, nunca deduzir. Mensagem do cliente delimitada como dado.',
  s4:`{
  "cliente": "Padaria Trigo de Ouro",
  "entrega": null,
  "itens": [
    { "produto": "cerveja lata", "quantidade": 15, "unidade": "fardo" }
  ]
}`,
  v:[1,1,1,1],d:"Passou nas quatro. E a delimitação da mensagem como dado é o que vai segurar a fase 4, quando alguém mandar uma instrução escondida dentro do pedido."},
 {p:'"Extraia em JSON com os campos cliente, itens e entrega. Seja preciso e não invente nada."',
  s4:`{"cliente":"Padaria Trigo de Ouro","itens":[{"produto":"cerveja lata","quantidade":15,"unidade":"fardo"}],"entrega":"não informado"}`,
  v:[1,1,1,0],d:'"Não invente" é instrução negativa: diz o que não fazer, sem dizer o que fazer no lugar. O modelo escolheu "não informado" — uma string onde o ERP espera null. Falha de tipo.'}
];
const VNOMES=[["JSON puro, sem texto ao redor"],["Esquema e tipos estáveis"],["Quantidades corretas"],["Campo ausente vira null"]];
let labE=0;
function labProg(n){const p=$("#labPr");p.innerHTML="";
 for(let i=0;i<5;i++)p.appendChild(el("i",i<=n?"on":""));}
function renderLab(){
 const b=$("#labB");b.innerHTML="";labProg(labE);
 if(labE===0){
  b.innerHTML=`<div class="eyebrow">Fase 0 · Briefing</div>
   <h4 style="margin:14px 0 10px;font-size:20px">Chegou uma demanda. Sem explicação.</h4>
   <p>A Distribuidora Vale Verde recebe pedidos por WhatsApp o dia inteiro e alguém digita tudo à mão
   no ERP — e erra. O ERP só aceita JSON: um campo faltando derruba a integração e o pedido some.</p>
   <div class="zap"><b>WhatsApp · caso 1</b>${CASO1}</div>
   <div class="zap"><b>WhatsApp · caso 4 — repare no que falta aqui</b>${CASO4}</div>`;
  const btn=el("button","btn pri","Tentar resolver");btn.style.marginTop="16px";
  btn.onclick=()=>{labE=1;ping(540);renderLab();};
  b.appendChild(btn);return;
 }
 if(labE===1){
  b.innerHTML=`<div class="eyebrow">Fase 1 · Tentativa cega</div>
   <h4 style="margin:14px 0 10px;font-size:20px">Resolva com o que você já sabe</h4>
   <p>Sem instrução e sem exemplo — é assim que a aula real começa. Qual prompt você escreveria?</p>`;
  TENT.forEach((t,i)=>{const p=el("button","pick",`<span class="kb">${i+1}</span><span>${t.p}</span>`);
   p.onclick=()=>{labE=2;labSel=i;ping(480);renderLab();};b.appendChild(p);});
  return;
 }
 if(labE===2){
  const t=TENT[labSel];
  b.innerHTML=`<div class="eyebrow">Resultado da sua tentativa</div>
   <h4 style="margin:14px 0 12px;font-size:20px">Rodou nos dois casos</h4>
   <div class="saida">CASO 1 →
${esc(t.s1)}</div><div class="saida">CASO 4 →
${esc(t.s4)}</div>`;
  const vc=el("div");vc.style.marginTop="16px";
  t.v.forEach((ok,i)=>vc.appendChild(el("div","vchk",
   `<span class="mk ${ok?"ok":"bad"}">${ok?"✓":"✕"}</span><span><b>${VNOMES[i][0]}</b>
    <span>${ok?"aprovado":"reprovado"}</span></span>`)));
  b.appendChild(vc);
  b.appendChild(el("div","nota",`<b>Diagnóstico</b>${t.d}`));
  const btn=el("button","btn pri","Descer para a instrução");
  btn.onclick=()=>{labE=3;ping(560);renderLab();};b.appendChild(btn);
  return;
 }
 if(labE===3){
  b.innerHTML=`<div class="eyebrow">Fase 2 · Descida</div>
   <h4 style="margin:14px 0 10px;font-size:20px">Só agora o conceito — respondendo à sua falha</h4>
   <p><b style="font-family:var(--disp)">1.</b> O modelo não escolhe formato: ele amostra entre continuações plausíveis. Especificar é encolher a nuvem até sobrar uma.</p>
   <p><b style="font-family:var(--disp)">2.</b> Esquema literal com tipos vence descrição em prosa. Cole a estrutura, não a explique.</p>
   <p><b style="font-family:var(--disp)">3.</b> Todo campo ausente precisa de um valor definido. Se você não decidir, o modelo decide — e ele inventa algo verossímil.</p>
   <p><b style="font-family:var(--disp)">4.</b> A mensagem do cliente é dado, não instrução. Delimite explicitamente.</p>
   <p style="color:var(--dim);font-size:14.5px">Na plataforma, esta fase só libera depois de duas perguntas de checagem.</p>`;
  const btn=el("button","btn pri","Voltar para a bancada");
  btn.onclick=()=>{labE=4;ping(520);renderLab();};b.appendChild(btn);
  return;
 }
 if(labE===4){
  b.innerHTML=`<div class="eyebrow">Fase 3 · Trabalho no fundo</div>
   <h4 style="margin:14px 0 10px;font-size:20px">Agora escolha de novo — sabendo o que sabe</h4>
   <p>Qual destes três passa nas quatro verificações? Repare no caso 4, que não tem data de entrega.</p>`;
  FINAL.forEach((t,i)=>{const p=el("button","pick",`<span class="kb">${i+1}</span><span>${t.p}</span>`);
   p.onclick=()=>{labE=5;labSel=i;ping(t.v.every(x=>x)?760:400);renderLab();};b.appendChild(p);});
  return;
 }
 const t=FINAL[labSel];const passou=t.v.every(x=>x);
 b.innerHTML=`<div class="eyebrow">${passou?"Verificações aprovadas":"Ainda não passou"}</div>
  <h4 style="margin:14px 0 12px;font-size:20px">${passou?"É esse.":"Perto — mas o teste é objetivo"}</h4>
  <div class="saida">CASO 4 →
${esc(t.s4)}</div>`;
 const vc=el("div");vc.style.marginTop="16px";
 t.v.forEach((ok,i)=>vc.appendChild(el("div","vchk",
  `<span class="mk ${ok?"ok":"bad"}">${ok?"✓":"✕"}</span><span><b>${VNOMES[i][0]}</b>
   <span>${ok?"aprovado":"reprovado"}</span></span>`)));
 b.appendChild(vc);
 b.appendChild(el("div","nota"+(passou?"":" aviso"),`<b>${passou?"Por que funcionou":"Por que falhou"}</b>${t.d}`));
 if(passou){
  b.appendChild(el("p",null,`<b style="font-family:var(--disp)">Você acabou de fazer três das sete fases de um mergulho.</b>
   Faltam a pressão (alguém injeta uma instrução dentro do pedido e seu prompt precisa resistir),
   a descompressão (explicar por escrito qual foi o <i>custo</i> da sua decisão) e a emersão —
   ligar isso ao seu próprio projeto. Na plataforma, tudo isso roda ao vivo contra o modelo.`));
  const g=el("a","btn pri","Ver meu percurso");g.href="#diag";b.appendChild(g);
 }
 const r=el("button","dback","← tentar outro prompt");r.style.marginLeft=passou?"14px":"0";
 r.onclick=()=>{labE=4;renderLab();};b.appendChild(r);
}
let labSel=0;

/* ---------- fases (referência) ---------- */
const FASES=[
 {n:"Briefing",t:"5 min",h:"A demanda chega antes do conceito.",c:"<p>Nenhuma aula começa explicando. Começa com um problema real que você ainda não resolve: uma mensagem de cliente, um chamado, uma planilha suja. Instrução antes da tentativa produz reconhecimento; depois da tentativa, produz aprendizado.</p>"},
 {n:"Tentativa cega",t:"10 min",h:"Você tenta e falha primeiro.",c:"<p>Dez minutos resolvendo com o que já tem. Roda de verdade e costuma quebrar. Essa falha é o material didático da fase seguinte — sem ela, o conceito não gruda.</p>"},
 {n:"Descida",t:"15 min",h:"O conceito responde à sua falha.",c:"<p>Quinze minutos densos, com fonte declarada, endereçando exatamente o que acabou de dar errado nas suas mãos. Libera com duas perguntas de checagem, não com um botão de próximo.</p>"},
 {n:"Trabalho no fundo",t:"35 min",h:"Bancada, com verificação executável.",c:"<p>Construção real, com testes automáticos rodando ao lado. Não se avança marcando concluído: avança-se passando na verificação. Você nunca se ilude sobre o próprio nível, porque não é você quem julga.</p>"},
 {n:"Pressão",t:"10 min",h:"O que você fez quebra.",c:"<p>O dado muda, o custo estoura, alguém injeta instrução no seu prompt, o provedor cai. Quem só viu o caminho feliz não sabe fazer o trabalho. Consertar sob pressão é parte da aula, não bônus.</p>"},
 {n:"Descompressão",t:"5 min",h:"Explicar por escrito, sem consultar.",c:"<p>Qual decisão mudou o resultado e qual foi o <b>custo</b> dela. Toda escolha de engenharia tem preço: tokens, rigidez, casos que deixam de funcionar. Quem não acha nenhum custo, não entendeu a decisão. Vai para o Caderno de Bordo, que o mentor lê e que vira portfólio.</p>"},
 {n:"Emersão",t:"5 min",h:"Aterrissa no seu Projeto Farol.",c:"<p>Toda aula termina ligando o conteúdo ao projeto real que você declarou no primeiro dia. Ao fim de um estrato, essas anotações são a especificação do seu projeto. Retomada agendada em D+2, D+10 e D+30.</p>"}
];
let fase=0;
function renderFases(){
 const n=$("#fnav");n.innerHTML="";
 FASES.forEach((f,i)=>{
  const b=el("button","fbtn",`<span class="n">FASE ${i}</span><b>${f.n}</b><span>${f.t}</span>`);
  b.setAttribute("aria-current",i===fase?"true":"false");
  b.onclick=()=>{fase=i;renderFases();};n.appendChild(b);
 });
 $("#fbody").innerHTML=`<div class="eyebrow">Fase ${fase} · ${FASES[fase].n}</div>
  <h4 style="margin-top:14px">${FASES[fase].h}</h4>${FASES[fase].c}`;
}

/* ---------- currículo ---------- */
function renderCurriculo(){
 const g=$("#tgrid");
 TRILHAS.forEach(t=>{
  const mods=t.est.reduce((s,e)=>s+e.m.length,0);
  const hrs=t.est.reduce((s,e)=>s+e.m.reduce((x,m)=>x+m.h,0),0);
  const b=el("button","tcard",
   `<span class="k">${t.c} · ${t.area}</span><b>${t.n}</b><p>${t.tese.slice(0,140)}…</p>
    <span class="m">${mods} módulos · ${hrs} h · ver programa →</span>
    <span class="badge" style="display:none">seu percurso</span>`);
  b.dataset.c=t.c;
  b.onclick=()=>abrirTrilha(t);
  g.appendChild(b);
 });
}
function abrirTrilha(t){
 ping(500);
 $("#dlgTitle").innerHTML=`<div class="mono" style="color:var(--sulfur)">${t.c} · ${t.area}</div>
  <h3 style="font-size:24px;margin-top:8px;font-variation-settings:'wdth' 94">${t.n}</h3>`;
 const b=$("#dlgBody");
 b.innerHTML=`<p style="font-style:italic;color:#DCE7E4">${t.tese}</p>
  <p style="font-size:15px;color:var(--dim)">${t.ementa}</p>
  <p style="font-family:var(--mono);font-size:11px;color:var(--dim);line-height:1.8">
   Pré-requisitos: ${t.pre.join(" · ")}<br>Ferramentas: ${t.fer.join(" · ")}</p>`;
 t.est.forEach((e,i)=>{
  const info=ESTRATOS[i];const box=el("div","est");
  box.appendChild(el("div","est-h",
   `E${info.n} · ${info.nome.toUpperCase()} — ${info.sub}<span>${e.m.length} mód · ${e.m.reduce((s,m)=>s+m.h,0)} h</span>`));
  const bd=el("div","est-b");
  e.m.forEach(m=>bd.appendChild(el("div","mmin",`<b>${m.t}</b><i>${m.o}</i><u>${m.a.map(a=>"· "+a).join("<br>")}</u>`)));
  bd.appendChild(el("div","mmin",`<b style="color:var(--sulfur);font-size:13px">Entrega avaliativa</b><i>${e.p}</i>`));
  box.appendChild(bd);b.appendChild(box);
 });
 $("#dlg").showModal();
}
$("#dlgX").onclick=()=>$("#dlg").close();
$("#dlg").addEventListener("click",e=>{if(e.target.id==="dlg")$("#dlg").close();});

/* ---------- verdades ---------- */
const VERDADES=[
 ["Isso vai ser difícil, e às vezes chato","Toda aula tem uma fase onde você tenta sem saber e falha de propósito. Parte das pessoas acha que a plataforma está escondendo a resposta. Não está — a ordem é essa porque instrução antes da tentativa produz reconhecimento, não aprendizado."],
 ["Não prometemos emprego nem salário","As faixas que você viu vêm de vagas públicas e servem para calibrar expectativa. Quem promete colocação garantida em IA está vendendo sorte como se fosse método."],
 ["Seu Projeto Farol pode não dar certo","Muitos não vão. O que se garante é que você vai descobrir isso construindo e medindo — em semanas, não em anos — e sai com a habilidade de construir e medir a próxima ideia."],
 ["Você vai precisar aparecer","O maior inimigo não é a dificuldade, é o sumiço. Existem turmas com data, defesa em grupo e contato humano quando alguém some. Compromisso social é o que sustenta quando a motivação cai."],
 ["A escola ainda está sendo construída","O currículo está publicado inteiro e o método está definido e testado. A primeira turma abre com uma trilha completa, não com as doze. Você está vendo o projeto no estágio real dele — e é por isso que quem entra agora entra como fundador."]
];
function renderVerdades(){
 const v=$("#vlist");
 VERDADES.forEach(([t,d],i)=>v.appendChild(el("div","vitem",
  `<span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${t}</b><p>${d}</p></span>`)));
}

/* ---------- formulário ---------- */
function renderForm(c){
 const h=$("#formHolder");h.innerHTML="";
 const f=el("div","form");
 f.innerHTML=`<div class="eyebrow">Turma piloto</div>
  <h3 style="margin-top:14px">${c?`Guardar o percurso ${c.t.c} e entrar na lista`:"Entrar na lista da primeira turma"}</h3>
  <p style="color:var(--dim);font-size:15.5px;max-width:60ch">
   A primeira turma abre com uma trilha completa e vagas limitadas pela capacidade de mentoria.
   Quem está na lista recebe o percurso por escrito, é avisado antes de todo mundo e entra com
   condição de fundador. Nenhum pagamento agora.</p>
  ${c?"":'<p style="color:var(--sulfur);font-size:14.5px"><a href="#diag">Faça a sondagem primeiro</a> — assim eu guardo o seu percurso junto, e não só o e-mail.</p>'}
  <div class="fgrid">
   <div><label class="lbl" for="nm">Nome</label><input id="nm" type="text" placeholder="Como te chamam"></div>
   <div><label class="lbl" for="em">E-mail</label><input id="em" type="email" placeholder="voce@email.com"></div>
   <div class="full"><label class="lbl" for="wz">WhatsApp (opcional)</label><input id="wz" type="text" placeholder="Só se preferir ser avisado por aqui"></div>
  </div>
  <div class="chkline"><input type="checkbox" id="ck"><label for="ck">Aceito receber e-mails sobre a abertura da turma. Seus dados não são vendidos nem compartilhados, e você pode pedir exclusão a qualquer momento (LGPD).</label></div>
  <button class="btn pri" id="sub">Entrar na lista</button><div class="msg" id="msg"></div>`;
 h.appendChild(f);
 $("#sub").onclick=async()=>{
  const nome=$("#nm").value.trim(),email=$("#em").value.trim(),zap=$("#wz").value.trim(),m=$("#msg");
  if(nome.length<2){m.innerHTML='<span class="bad">Falta o nome.</span>';return;}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){m.innerHTML='<span class="bad">Confira o e-mail.</span>';return;}
  if(!$("#ck").checked){m.innerHTML='<span class="bad">Marque o aceite para eu poder te avisar.</span>';return;}
  const payload={nome,email,whatsapp:zap,trilha:c?c.t.c:"",trilha_nome:c?c.t.n:"",apoio:c?c.a.c:"",
   origem:resp.origem||"",meta:resp.meta||"",tempo:resp.tempo||"",codigo:resp.code||"",
   farol:resp.farol||"",data:new Date().toISOString(),pagina:location.href};
  $("#sub").disabled=true;m.textContent="enviando…";
  if(!FORM_ENDPOINT){console.log("LEAD (modo teste):",payload);
   m.innerHTML='<span style="color:var(--sulfur)">Modo teste: FORM_ENDPOINT não configurado. O lead saiu no console do navegador.</span>';
   $("#sub").disabled=false;return;}
  try{
   const r=await fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)});
   if(!r.ok)throw new Error(r.status);
   ping(820,.25,.07);
   f.innerHTML=`<div class="eyebrow">Registrado</div>
    <h3 style="margin-top:14px">Pronto, ${esc(nome.split(" ")[0])}.</h3>
    <p style="max-width:58ch">Seu percurso ${c?c.t.c:""} ficou guardado junto com o seu Projeto Farol.
    Você recebe a abertura da turma antes da divulgação pública.</p>
    <p style="color:var(--dim);font-size:15px;max-width:58ch">Se quiser dar um passo hoje: escolha um
    módulo da sua trilha ali em cima e tente resolver o problema dele sozinho, antes de procurar como se faz.
    É exatamente assim que a primeira fase de todo mergulho começa.</p>
    ${WHATSAPP?`<a class="btn gh" style="margin-top:16px" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">Falar comigo no WhatsApp</a>`:""}`;
   $("#cta").classList.remove("on");
  }catch(e){
   m.innerHTML='<span class="bad">Não consegui enviar agora. Tente de novo em instantes'+(WHATSAPP?' ou fale comigo no WhatsApp.':'.')+'</span>';
   $("#sub").disabled=false;
  }
 };
}

renderDiag();renderLab();renderFases();renderCurriculo();renderVerdades();renderForm(null);gauge();
