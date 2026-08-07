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
/* ---------- ruído abissal ----------
   Ambiente gerado no navegador: ruído marrom filtrado, como pressão de água.
   Fica mais grave e mais denso conforme a pessoa desce a página — a mesma
   metáfora de profundidade do medidor lateral, no ouvido.
   Nunca toca sozinho: navegador bloqueia autoplay e som surpresa afasta. */
let amb=null;
function ambienteLigar(){
 try{
  AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  if(AC.state==="suspended")AC.resume();
  // ruído marrom: passeio aleatório, muito mais grave que o branco
  const dur=4, buf=AC.createBuffer(1,AC.sampleRate*dur,AC.sampleRate), d=buf.getChannelData(0);
  let last=0;
  for(let i=0;i<d.length;i++){
   const w=Math.random()*2-1;
   last=(last+.02*w)/1.02; d[i]=last*3.2;
  }
  const src=AC.createBufferSource();src.buffer=buf;src.loop=true;
  const lp=AC.createBiquadFilter();lp.type="lowpass";lp.frequency.value=340;lp.Q.value=.7;
  const g=AC.createGain();g.gain.value=0;
  src.connect(lp);lp.connect(g);g.connect(AC.destination);
  src.start();
  g.gain.linearRampToValueAtTime(.05,AC.currentTime+2.5);
  amb={src,lp,g};
 }catch(e){amb=null;}
}
function ambienteDesligar(){
 if(!amb)return;
 try{
  amb.g.gain.linearRampToValueAtTime(.0001,AC.currentTime+.6);
  const a=amb;setTimeout(()=>{try{a.src.stop();}catch(e){}},700);
 }catch(e){}
 amb=null;
}
/* profundidade da rolagem escurece o filtro: 340 Hz na superfície, 120 Hz no fundo */
function ambienteProfundidade(p){
 if(!amb)return;
 try{amb.lp.frequency.setTargetAtTime(340-p*220,AC.currentTime,.4);}catch(e){}
}
$("#snd").onclick=()=>{
 somOn=!somOn;
 $("#snd").setAttribute("aria-pressed",somOn);
 $("#snd").textContent=somOn?"♪ som ligado":"♪ som";
 if(somOn){ambienteLigar();ping(620);}else ambienteDesligar();
};

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
 ambienteProfundidade(p);
}
addEventListener("scroll",gauge,{passive:true});addEventListener("resize",gauge);

/* ---------- revelação ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));

/* ---------- contadores ----------
   Os números do hero saem de DADOS, nunca do HTML: currículo é fonte única
   de verdade, e número escrito à mão desatualiza na primeira trilha nova. */
(function(){
 const n={trilhas:TRILHAS.length,modulos:0,aulas:0,horas:0};
 TRILHAS.forEach(t=>t.est.forEach(e=>e.m.forEach(m=>{
  n.modulos++;n.aulas+=m.a.length;n.horas+=m.h;})));
 document.querySelectorAll("#hnums b[data-k]").forEach(b=>{b.dataset.n=n[b.dataset.k];});
})();
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

/* Trilhas que pedem código de verdade: quem nunca programou entra pelo Batismo. */
const EXIGEM_CODIGO=["EA","RC","AD","OI","CI","AV","SR","AU","MM"];
function calcula(){
 const r=REGRAS.find(x=>x.se(resp));
 const t=T(r.tri),a=T(r.apo);
 const ponte=(resp.code==="0"&&EXIGEM_CODIGO.includes(r.tri));
 const bt=ponte?T("BT"):null;
 const horas=t.est.reduce((s,e)=>s+e.m.reduce((x,m)=>x+m.h,0),0);
 const hbt=bt?bt.est.reduce((s,e)=>s+e.m.reduce((x,m)=>x+m.h,0),0):0;
 const sem=parseInt(resp.tempo,10);
 /* Quando existe ponte, o percurso é Batismo + trilha — e o prazo diz isso. */
 const inicio=bt||t;
 return {t,a,ponte,bt,horas,hbt,sem,
  meses:Math.max(3,Math.round((horas+hbt)/sem/4.3)),
  mesesBt:bt?Math.max(1,Math.round(hbt/sem/4.3)):0,
  primeiros:inicio.est[0].m.concat(inicio.est[1].m).slice(0,4)};
}
function sondar(s){
 const c=calcula();
 const linhas=[
  `cruzando ${TRILHAS.reduce((s,t)=>s+t.est.reduce((x,e)=>x+e.m.length,0),0)} módulos do currículo…`,
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
  ${c.ponte?`<div><dt>Você começa por</dt><dd>${c.bt.n}<small>${c.bt.est.reduce((s,e)=>s+e.m.length,0)} módulos · ${c.hbt} horas · ~${c.mesesBt} ${c.mesesBt===1?"mês":"meses"}</small></dd></div>`:""}
  <div><dt>${c.ponte?"Depois, a trilha":"Trilha principal"}</dt><dd>${c.t.n}<small>${c.t.est.reduce((s,e)=>s+e.m.length,0)} módulos · ${c.horas} horas</small></dd></div>
  <div><dt>Trilha de apoio</dt><dd>${c.a.n}<small>atravessa a principal em pontos-chave</small></dd></div>
  <div><dt>Ritmo estimado</dt><dd>~${c.meses} meses<small>a ${c.sem} h/semana, ${c.ponte?"do Batismo ao E4":"do E1 ao E4"}</small></dd></div>
  <div><dt>Primeiro artefato</dt><dd>1ª semana<small>algo que roda, não um certificado</small></dd></div>`)));
 if(c.ponte)b.appendChild(stg(el("div","nota",
  `<b>Você não vai começar pelo fundo — e isso não é consolo</b>
   Você marcou que nunca escreveu código, e ${c.t.n} exige isso desde o estrato 2. Não vamos fingir
   que dá para pular: seu percurso começa pelo <b>Batismo</b>, a trilha de entrada, que leva cerca de
   ${c.mesesBt} ${c.mesesBt===1?"mês":"meses"} no seu ritmo. Ela termina com você construindo um
   sistema que lê um dado seu, decide algo e devolve resultado — e é isso que destrava
   ${c.t.n}. Mergulhador nenhum desce sem batismo.`)));
 b.appendChild(stg(el("div","nota",`<b>Seu Projeto Farol</b>"${esc((resp.farol||"").slice(0,320))}"<br><br>
  A partir do primeiro dia, toda aula termina com uma pergunta ligando o conteúdo a isso. Ao fim do
  primeiro estrato, você tem cerca de 30 anotações que, juntas, são a especificação do seu projeto.`)));
 b.appendChild(stg(el("div","eyebrow",c.ponte
  ?"Seus quatro primeiros mergulhos — no Batismo"
  :"Seus quatro primeiros mergulhos")));
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

/* ---------- diagnóstico sob demanda ----------
   O questionário não abre sozinho: ele é a emersão do mergulho (fase 6).
   Ver docs/metodo-abissal.md, Lei 5 — tudo aterrissa no Projeto Farol. */
function iniciarDiagnostico(){
 const s=$("#diag");
 s.hidden=false;
 if(passo===0&&!Object.keys(resp).length)renderDiag();
 requestAnimationFrame(()=>s.scrollIntoView({behavior:RM?"auto":"smooth"}));
}

renderCurriculo();renderVerdades();renderForm(null);gauge();
