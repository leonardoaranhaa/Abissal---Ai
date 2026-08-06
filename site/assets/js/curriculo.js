/* Catálogo completo do currículo (site/curriculo.html).
   Usa DADOS.trilhas / DADOS.estratos de data/curriculo.js — não duplicar
   o currículo aqui. ROTAS e METODO são conteúdo próprio desta página. */

const ROTAS=[
 {k:"Percurso 01",n:"Do zero ao Engenheiro de Agentes",
  d:"Para quem programa pouco ou nada e quer chegar ao cargo com maior demanda não atendida hoje. Cerca de 12 meses em ritmo de 10 h por semana.",
  s:["EP · E1 — como o modelo decide","EP · E2 — prompt como código e avaliação","AD · E1 — modelagem e ingestão","EA · E1 — o laço, ferramentas e MCP","RC · E1 — recuperação ancorada","EA · E2 — memória, planejamento e falha","AV · E2 — evals de agente","EA · E3 — multiagente, segurança e observabilidade"]},
 {k:"Percurso 02",n:"Analista de dados que vira Cientista de IA",
  d:"Você já vive de SQL e planilha. Falta o método científico e a profundidade técnica que separam análise de pesquisa.",
  s:["CI · E1 — matemática e aprendizado supervisionado","AD · E2 — contratos, qualidade e linhagem","CI · E2 — redes, treino e arquiteturas","AV · E2 — estatística da avaliação","CI · E3 — transformers, alinhamento, interpretabilidade","AD · E3 — dados de treino e reprodutibilidade","CI · E4 — pesquisa e experimento original"]},
 {k:"Percurso 03",n:"Dev backend que vira AI Engineer",
  d:"Você já entrega software. O que falta é a camada probabilística e a operação de sistemas que não são determinísticos.",
  s:["EP · E1–E2 — instrução, avaliação e custo","EA · E1 — laço e ferramentas","RC · E1–E2 — RAG e recuperação avançada","OI · E1 — inferência, servir e gateway","EA · E2 — memória, planejamento, falha","OI · E2 — confiabilidade e implantação","SR · E1 — superfície de ataque e injeção","AV · E3 — avaliação em produção"]},
 {k:"Percurso 04",n:"Gestor ou consultor que lidera IA",
  d:"Você não vai escrever o código, mas precisa saber quando estão te vendendo fumaça e como decidir com número.",
  s:["PD · E1 — onde IA cria valor e descoberta","EP · E1 — como o modelo decide","PD · E2 — experiência, economia unitária e piloto","AV · E1 — o que significa avaliar","GE · E1 — LGPD e classificação de risco","PD · E3 — provar retorno e defensabilidade","GE · E4 — comitê e política","PD · E4 — estratégia de 18 meses"]},
 {k:"Percurso 05",n:"TI corporativa que assume risco e conformidade",
  d:"Para quem vai responder pelo sistema quando o auditor, o jurídico ou a autoridade perguntarem.",
  s:["GE · E1 — inventário e classificação de risco","SR · E1 — superfície de ataque de aplicações com IA","GE · E2 — regulação e frameworks de risco","SR · E2 — red teaming e defesa em profundidade","AV · E3 — avaliação de risco e dano","GE · E3 — auditoria de viés e explicabilidade","SR · E4 — programa de segurança de IA"]},
 {k:"Percurso 06",n:"Operações que vira automação inteligente",
  d:"O caminho mais curto entre estudar e devolver horas para a empresa. Muitos alunos pagam o curso com a primeira entrega.",
  s:["AU · E1 — ler o processo e integrar sistemas","EP · E1 — instrução e formato de saída","AU · E2 — documentos, exceção e operação","RC · E1 — recuperar da base da empresa","AU · E3 — de fluxo fixo a agente","PD · E3 — provar retorno","AU · E4 — programa de automação"]}
];

const METODO=[
 {k:"Fase 0 · Briefing",t:"A demanda chega antes do conceito",d:"Nenhuma aula começa explicando. Começa com um problema real que você ainda não resolve: uma mensagem de cliente, um chamado, uma planilha suja. Instrução antes da tentativa produz reconhecimento; depois da tentativa, produz aprendizado."},
 {k:"Fase 1 · Tentativa cega",t:"Você tenta e falha primeiro",d:"Dez minutos resolvendo com o que já tem. Roda de verdade e costuma quebrar. Essa falha é o material didático da fase seguinte — sem ela, o conceito não gruda."},
 {k:"Fase 2 · Descida",t:"O conceito responde à sua falha",d:"Quinze minutos densos, com fonte declarada, endereçando exatamente o que acabou de dar errado nas suas mãos. Libera com duas perguntas de checagem, não com um botão de próximo."},
 {k:"Fase 3 · Trabalho no fundo",t:"Bancada, com verificação executável",d:"Trinta a quarenta minutos construindo, com testes automáticos rodando ao lado. Não se avança marcando concluído: avança-se passando na verificação. Você nunca se ilude sobre o próprio nível."},
 {k:"Fase 4 · Pressão",t:"O que você fez quebra",d:"O dado muda, o custo estoura, alguém injeta instrução no seu prompt, o provedor cai. Quem só viu o caminho feliz não sabe fazer o trabalho. Consertar sob pressão é parte da aula, não bônus."},
 {k:"Fase 5 · Descompressão",t:"Explique por escrito por que funcionou",d:"Recuperação ativa, sem consultar. Qual decisão mudou o resultado e qual foi o custo dela. Vai para o Caderno de Bordo, que o mentor lê e que vira portfólio."},
 {k:"Fase 6 · Emersão",t:"Aterrissa no seu Projeto Farol",d:"Toda aula termina ligando o que você aprendeu ao projeto real que você declarou no primeiro dia. Ao fim de um estrato, essas anotações são a especificação do seu projeto."},
 {k:"Ambientes",t:"Seis lugares de trabalho, não uma videoaula",d:"Bancada (código e teste), Mesa de Ensaio (prompt e avaliação ao vivo), Sala de Situação (incidente cronometrado), Cabine (defender decisão diante de interlocutor difícil), Prancheta (arquitetura) e Campo — a fase que sai da tela e coleta dado do mundo real."},
 {k:"Projeto Farol",t:"Sua ideia entra no primeiro dia",d:"Antes de qualquer aula, você declara um projeto real: o negócio que quer abrir, o problema do seu trabalho, a ideia que carrega há anos. Ele reaparece em toda aula e, ao fim da trilha, é a entrega — funcionando, medido, com limitação declarada."},
 {k:"Evidência",t:"Reproduzir, transferir, defender",d:"Fazer funcionar no caso dado é o mínimo. Fazer funcionar num caso novo separa quem copiou de quem entendeu. Só fecha módulo quem defende a escolha, a alternativa descartada e o custo — com rubrica e revisão de mentor em E3 e E4."},
 {k:"Retomada",t:"O conteúdo volta quando você já esqueceu",d:"D+2 em caso novo, D+10 como pré-requisito silencioso de outro módulo, D+30 como dependência de um estrato acima. Sem retomada espaçada, a maior parte evapora em duas semanas."},
 {k:"Honestidade",t:"O que não se promete",d:"Não se promete emprego, salário, nem que o seu Farol vai dar certo. Muitos não vão. Promete-se que você vai descobrir isso construindo e medindo — e sai com a habilidade de construir e medir a próxima ideia."}
];

/* ---------- estado ---------- */
let feito=new Set(), atual=0, filtro="all", termo="";
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const aulaId=(t,e,m,a)=>`${t}.${e}.${m}.${a}`;

function carregar(){
  try{const v=localStorage.getItem("abissal:progresso");
    if(v)feito=new Set(JSON.parse(v));}catch(e){}
}
function salvar(){
  try{localStorage.setItem("abissal:progresso",JSON.stringify([...feito]));}catch(e){}
}

/* ---------- métricas ---------- */
const totMods=t=>t.est.reduce((s,e)=>s+e.m.length,0);
const totHoras=t=>t.est.reduce((s,e)=>s+e.m.reduce((a,m)=>a+m.h,0),0);
const totAulas=t=>t.est.reduce((s,e)=>s+e.m.reduce((a,m)=>a+m.a.length,0),0);
function feitasTrilha(t){let n=0;
  t.est.forEach((e,ei)=>e.m.forEach((m,mi)=>m.a.forEach((_,ai)=>{
    if(feito.has(aulaId(t.c,ei,mi,ai)))n++;})));return n;}

function stats(){
  $("#sTrilhas").textContent=DADOS.trilhas.length;
  $("#sModulos").textContent=DADOS.trilhas.reduce((s,t)=>s+totMods(t),0);
  $("#sHoras").textContent=DADOS.trilhas.reduce((s,t)=>s+totHoras(t),0);
}

/* ---------- carta batimétrica ---------- */
const TONS=["#16303A","#122932","#0E2129","#0A1A21"];
function renderCarta(){
  const g=$("#cartaGrid");g.innerHTML="";
  g.appendChild(el("div","ch",""));
  DADOS.trilhas.forEach((t)=>{
    const c=el("div","ch",`<b>${t.c}</b>${t.area}`);
    c.title=t.n;g.appendChild(c);
  });
  DADOS.estratos.forEach((es,ei)=>{
    g.appendChild(el("div","rh",`E${es.n} · ${es.nome}<span>${es.d}</span>`));
    DADOS.trilhas.forEach((t,ti)=>{
      const est=t.est[ei];
      const h=est.m.reduce((a,m)=>a+m.h,0);
      const b=el("button","cell",String(est.m.length));
      b.style.background=TONS[ei];
      b.dataset.h=h+"h";
      b.setAttribute("aria-label",`${t.n} — estrato ${es.n}: ${est.m.length} módulos, ${h} horas`);
      b.title=`${t.n}\nE${es.n} ${es.nome} · ${est.m.length} módulos · ${h} h`;
      b.onclick=()=>{abrir(ti,ei);document.getElementById("catalogo").scrollIntoView({behavior:"smooth"});};
      g.appendChild(b);
    });
  });
}

/* ---------- índice ---------- */
function combina(t){
  if(!termo)return true;
  const q=termo.toLowerCase();
  if((t.n+" "+t.c+" "+t.area+" "+t.ementa+" "+t.tese).toLowerCase().includes(q))return true;
  return t.est.some(e=>e.m.some(m=>(m.t+" "+m.o+" "+m.a.join(" ")).toLowerCase().includes(q)));
}
function renderIndex(){
  const nav=$("#indexNav");nav.innerHTML="";
  const lista=DADOS.trilhas.map((t,i)=>({t,i})).filter(o=>combina(o.t));
  if(!lista.length){
    nav.appendChild(el("div","empty","<b>Nada com esse termo</b>Tente uma palavra do vocabulário técnico: agente, embedding, LGPD, avaliação, linhagem."));
    return;
  }
  lista.forEach(({t,i})=>{
    const f=feitasTrilha(t),a=totAulas(t);
    const b=el("button","tnav",
      `<span class="k">${t.c}</span><span class="t">${t.n}</span>
       <span class="m">${totMods(t)} módulos · ${totHoras(t)} h${f?` · ${Math.round(f/a*100)}% concluído`:""}</span>`);
    b.setAttribute("aria-current",i===atual?"true":"false");
    b.onclick=()=>abrir(i);
    nav.appendChild(b);
  });
}

/* ---------- painel ---------- */
function abrir(i,estAberto){
  atual=i;renderIndex();renderPainel(estAberto);
}
function renderPainel(estAberto){
  const t=DADOS.trilhas[atual],p=$("#painel");
  const a=totAulas(t),f=feitasTrilha(t);
  p.innerHTML="";
  const head=el("div","p-head",`
    <div class="p-code">${t.c} · ${t.area} · ${totMods(t)} módulos · ${a} aulas · ${totHoras(t)} horas</div>
    <h2>${t.n}</h2>
    <p class="p-tese">${t.tese}</p>`);
  p.appendChild(head);

  const meta=el("dl","grid2",`
    <div><dt>Ementa</dt><dd style="font-family:var(--body);font-size:15px;font-weight:400;line-height:1.5">${t.ementa}</dd></div>
    <div><dt>Pré-requisitos</dt><dd>${t.pre.join(" · ")}</dd></div>
    <div><dt>Seu progresso</dt><dd>${f} / ${a} aulas<div class="prog"><i style="width:${a?f/a*100:0}%"></i></div>
      <small>marcado neste navegador</small></dd></div>`);
  p.appendChild(meta);

  const fer=el("div","block",`<div class="block-t">Ferramentas de trabalho</div>`);
  const tools=el("div","tools");
  t.fer.forEach(x=>tools.appendChild(el("span","tool",x)));
  fer.appendChild(tools);p.appendChild(fer);

  const prog=el("div","block",`<div class="block-t">Programa por estrato</div>`);
  t.est.forEach((es,ei)=>{
    if(filtro!=="all"&&String(ei+1)!==filtro)return;
    const info=DADOS.estratos[ei];
    const h=es.m.reduce((s,m)=>s+m.h,0);
    const box=el("div","estrato");box.dataset.e=ei+1;
    const hd=el("button","e-head",`
      <span class="e-depth">${info.d}</span>
      <span class="e-name">E${info.n} · ${info.nome}<em>${info.sub}</em></span>
      <span class="e-count">${es.m.length} módulos · ${h} h</span>
      <span class="caret">›</span>`);
    hd.setAttribute("aria-expanded","false");
    const body=el("div","e-body");
    es.m.forEach((m,mi)=>{
      const mod=el("div","mod");
      const mh=el("button","m-head",`
        <span class="m-num">M${String(mi+1).padStart(2,"0")}</span>
        <span class="m-t"><b>${m.t}</b><span>${m.o}</span></span>
        <span class="m-h">${m.h} h · ${m.a.length} aulas</span>`);
      const mb=el("div","m-body");
      m.a.forEach((au,ai)=>{
        const id=aulaId(t.c,ei,mi,ai);
        const row=el("div","aula");
        const cb=el("input");cb.type="checkbox";cb.id=id;cb.checked=feito.has(id);
        cb.onchange=()=>{cb.checked?feito.add(id):feito.delete(id);salvar();
          const na=totAulas(t),nf=feitasTrilha(t);
          const bar=p.querySelector(".prog i");if(bar)bar.style.width=(nf/na*100)+"%";
          const dd=p.querySelectorAll(".grid2 dd")[2];
          if(dd)dd.childNodes[0].nodeValue=`${nf} / ${na} aulas`;
          renderIndex();};
        const lb=el("label",null,au);lb.setAttribute("for",id);
        row.appendChild(cb);row.appendChild(lb);
        row.appendChild(el("span","st","conteúdo em produção"));
        mb.appendChild(row);
      });
      mh.onclick=()=>{mod.classList.toggle("open");
        mh.setAttribute("aria-expanded",mod.classList.contains("open"));};
      mod.appendChild(mh);mod.appendChild(mb);body.appendChild(mod);
    });
    body.appendChild(el("div","entrega",`<b>Entrega avaliativa do estrato</b><p>${es.p}</p>`));
    hd.onclick=()=>{box.classList.toggle("open");
      hd.setAttribute("aria-expanded",box.classList.contains("open"));};
    box.appendChild(hd);box.appendChild(body);
    if(estAberto===ei||(termo&&es.m.some(m=>(m.t+" "+m.o+" "+m.a.join(" ")).toLowerCase().includes(termo.toLowerCase()))))
      {box.classList.add("open");hd.setAttribute("aria-expanded","true");}
    prog.appendChild(box);
  });
  if(!prog.querySelector(".estrato"))
    prog.appendChild(el("div","empty","<b>Nenhum estrato neste filtro</b>Volte para “Todas” no filtro acima para ver o programa completo desta trilha."));
  p.appendChild(prog);

  const car=el("div","block",`<div class="block-t">Para onde esta trilha leva</div>`);
  const cg=el("div","cargos");
  t.cargos.forEach(c=>cg.appendChild(el("div","cargo",
    `<b>${c.t}</b><span class="fx">${c.f} / mês</span><p>${c.d}</p>`)));
  car.appendChild(cg);
  car.appendChild(el("p","cargos-nota","Faixas indicativas de mercado brasileiro, formação CLT e PJ misturadas, coletadas de vagas públicas e conversas de recrutamento. Servem para calibrar expectativa, não como promessa — valide sempre com fontes atuais antes de negociar."));
  p.appendChild(car);
}

/* ---------- percursos e método ---------- */
function renderRotas(){
  const g=$("#rotasGrid");
  ROTAS.forEach(r=>{
    const d=el("div","rota",`<span class="k">${r.k}</span><h3>${r.n}</h3><p>${r.d}</p>`);
    const ol=el("ol");r.s.forEach(s=>ol.appendChild(el("li",null,s)));
    d.appendChild(ol);g.appendChild(d);
  });
}
function renderMetodo(){
  const g=$("#metodoGrid");
  METODO.forEach(m=>g.appendChild(el("div",null,
    `<span class="k">${m.k}</span><h3>${m.t}</h3><p>${m.d}</p>`)));
}

/* ---------- rail de profundidade ---------- */
function rail(){
  const c=$("#railCursor"),d=$("#railDepth");
  if(!c)return;
  const max=document.body.scrollHeight-innerHeight;
  const p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
  const top=40+p*(innerHeight-100);
  c.style.top=top+"px";d.style.top=top+"px";
  d.textContent=Math.round(p*4000).toLocaleString("pt-BR")+" m";
}

/* ---------- eventos ---------- */
$("#busca").addEventListener("input",e=>{
  termo=e.target.value.trim();renderIndex();
  const primeiro=DADOS.trilhas.findIndex(t=>combina(t));
  if(termo&&primeiro>=0){atual=primeiro;renderIndex();renderPainel();}
});
document.querySelectorAll("#filtros .chip").forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll("#filtros .chip").forEach(x=>x.setAttribute("aria-pressed","false"));
    b.setAttribute("aria-pressed","true");filtro=b.dataset.f;renderPainel();
  };
});
addEventListener("scroll",rail,{passive:true});
addEventListener("resize",rail);

carregar();
stats();renderCarta();renderIndex();renderPainel();renderRotas();renderMetodo();rail();
