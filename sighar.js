/* 🎨 ركن الصغار (v23.0) — من كتاب «أنا أعرف ديني» للشيخ علاء المطوري:
   ١) لوّن: صور خطّية يلوّنها الطفل بإصبعه (المس اللون ثم المس الجزء) وتُحفظ، ويمكن حفظها صورة.
   ٢) صِلْ كل صورة بجملتها (نشاط الكتاب ص٢٢).
   ٣) أسئلة بالصور للصغار (الجواب صورة كبيرة + كلمة).
   ٤) شهادة «البطل الصغير» صورةً، وحفظ شهادة الكتاب الكبير صورةً (Sighar.saveBigCert).
   كل النصوص من الكتابين، ولا آيات هنا. */
(function(){
const K='usul5_sighar_v1';
let sg={col:{},done:{},match:0,quiz:-1};try{const s=JSON.parse(localStorage.getItem(K)||'null');if(s)sg=Object.assign(sg,s)}catch(e){}
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(sg))}catch(e){}};
const boy=()=>!window.Cups||Cups.sex!='g';
const T=(b,g)=>boy()?b:g;
const ding=(ok)=>{try{typeof tone=='function'&&(ok?[660,880].forEach((f,k)=>tone(f,.1,'triangle',.12,k*.08)):tone(220,.15,'sine',.1))}catch(e){}};
const cheer=()=>{try{typeof tone=='function'&&[523,659,784,1047].forEach((f,k)=>tone(f,.15,'triangle',.14,k*.11))}catch(e){}try{typeof confetti=='function'&&confetti()}catch(e){}};
function reward(key,n){if(sg.done[key])return '';sg.done[key]=1;sv();let h='';
  if(window.Deco&&Deco.addJ){Deco.addJ(n);h=`<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(n)}</b>جواهر لبيتك في الجنة!</div>`}
  try{window.Aamal&&Aamal.grow('dars')}catch(e){}return h}

/* ---------- الصور الخطّية (كل عنصر class="f" يُلوَّن) ---------- */
const st=(cx,cy,r1,r2,n,rot=0)=>{let p='';for(let i=0;i<n*2;i++){const a=rot+Math.PI*i/n,r=i%2?r2:r1;p+=(i?'L':'M')+(cx+r*Math.sin(a)).toFixed(1)+' '+(cy-r*Math.cos(a)).toFixed(1)}return p+'Z'};
const rays=()=>{let s='';for(let k=0;k<12;k++){const a=k*Math.PI/6,d=.2;const P=(r,b)=>(150+r*Math.sin(b)).toFixed(1)+' '+(150-r*Math.cos(b)).toFixed(1);
  s+=`<path class="f" d="M${P(136,a)} L${P(80,a-d)} L${P(80,a+d)}Z"/>`}return s};
const PICS=[
 {id:'sun',n:'الشمس الواحدة',e:'☀️',t:'لوّن الشمس الواحدة. اللهُ واحدٌ، لا شريك له.',
  svg:()=>`<rect class="f" x="2" y="2" width="296" height="296" rx="20"/>${rays()}<circle class="f" cx="150" cy="150" r="72"/><path class="f" d="M140 104 L160 104 L160 186 L140 198Z"/>`},
 {id:'lantern',n:'الفانوس والنجوم',e:'🏮',t:'لوّن الفانوس والنجوم. الأئمة يهدوننا مثل الفانوس يُضيء الطريق.',
  svg:()=>`<rect class="f" x="2" y="2" width="296" height="296" rx="20"/><path d="M135 62 Q150 30 165 62" fill="none"/><path class="f" d="M118 72 Q150 44 182 72Z"/><rect class="f" x="104" y="72" width="92" height="22" rx="9"/>
  <path class="f" d="M108 94 L128 94 L124 222 L96 222Z"/><path class="f" d="M128 94 L172 94 L176 222 L124 222Z"/><path class="f" d="M172 94 L192 94 L204 222 L176 222Z"/><path class="f" d="M150 126 Q174 162 150 198 Q126 162 150 126Z"/>
  <rect class="f" x="86" y="222" width="128" height="26" rx="10"/>${[[52,70],[250,84],[56,236],[248,236]].map(([x,y])=>`<path class="f" d="${st(x,y,24,9,4)}"/>`).join('')}`},
 {id:'tree',n:'الشجرة',e:'🌳',t:'خلق اللهُ الشجرَ والزهرَ. أشكرُ اللهَ على نِعَمه.',
  svg:()=>`<rect class="f" x="2" y="2" width="296" height="214" rx="20"/><rect class="f" x="2" y="214" width="296" height="84" rx="6"/><circle class="f" cx="250" cy="52" r="28"/>
  <rect class="f" x="134" y="150" width="32" height="96" rx="6"/><circle class="f" cx="108" cy="132" r="46"/><circle class="f" cx="192" cy="132" r="46"/><circle class="f" cx="150" cy="92" r="52"/>
  ${[[150,70],[112,128],[188,124],[150,124],[128,92]].map(([x,y])=>`<circle class="f" cx="${x}" cy="${y}" r="10"/>`).join('')}
  ${[[44,250],[256,256]].map(([x,y])=>`<path d="M${x} ${y} L${x} ${y+30}" fill="none"/><circle class="f" cx="${x}" cy="${y}" r="13"/><circle class="f" cx="${x}" cy="${y}" r="5"/>`).join('')}`},
 {id:'scale',n:'الميزان',e:'⚖️',t:'اللهُ عادلٌ، لا يظلمُ أحدًا أبدًا.',
  svg:()=>`<rect class="f" x="2" y="2" width="296" height="296" rx="20"/><path d="M70 86 L38 176 M70 86 L102 176 M230 86 L198 176 M230 86 L262 176" fill="none"/>
  <rect class="f" x="140" y="76" width="20" height="174" rx="6"/><rect class="f" x="92" y="248" width="116" height="22" rx="9"/><rect class="f" x="46" y="72" width="208" height="16" rx="8"/><circle class="f" cx="150" cy="64" r="15"/>
  <path class="f" d="M26 176 Q70 222 114 176Z"/><path class="f" d="M186 176 Q230 222 274 176Z"/>`},
 {id:'house',n:'بيت ديني',e:'🏛️',t:'بيتُ ديني يقومُ على خمسةِ أعمدة: التوحيد، العدل، النبوّة، الإمامة، المعاد.',
  svg:()=>`<rect class="f" x="2" y="2" width="296" height="296" rx="20"/><rect class="f" x="2" y="258" width="296" height="40" rx="6"/><path class="f" d="M28 110 L150 34 L272 110Z"/><circle class="f" cx="150" cy="84" r="14"/>
  <rect class="f" x="28" y="110" width="244" height="18" rx="6"/>${[0,1,2,3,4].map(i=>`<rect class="f" x="${44+i*46}" y="128" width="28" height="112" rx="6"/>`).join('')}<rect class="f" x="22" y="240" width="256" height="20" rx="7"/>`},
 {id:'book',n:'القرآن الكريم',e:'📖',t:'نبيُّنا محمدٌ صلى الله عليه وآله جاءنا بالقرآن.',
  svg:()=>`<rect class="f" x="2" y="2" width="296" height="296" rx="20"/><path class="f" d="${st(150,58,30,14,8)}"/>
  <path class="f" d="M34 112 Q92 92 148 118 L148 246 Q92 222 34 240Z"/><path class="f" d="M266 112 Q208 92 152 118 L152 246 Q208 222 266 240Z"/>
  ${[0,1,2,3].map(i=>`<path d="M54 ${134+i*24} Q96 ${124+i*24} 132 ${138+i*24} M246 ${134+i*24} Q204 ${124+i*24} 168 ${138+i*24}" fill="none" stroke-width="3"/>`).join('')}
  <path class="f" d="M96 278 L150 250 L204 278Z"/>`}];
const PAL=['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#f06292','#8d6e63','#26c6da','#7cb342','#212121','#ffffff'];
const svgOf=(p,cls='')=>`<svg viewBox="0 0 300 300" class="${cls}" xmlns="http://www.w3.org/2000/svg"><g stroke="#2b2b2b" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" fill="#fff">${p.svg()}</g></svg>`;
function paintSaved(svgEl,p){const m=sg.col[p.id]||{};svgEl.querySelectorAll('.f').forEach((e,i)=>e.setAttribute('fill',m[i]||'#fff'))}

/* ---------- الشاشة ---------- */
const css=document.createElement('style');
css.textContent=`
.sgcard{border-color:#f06292!important;box-shadow:0 5px 0 #f8c8d8!important}.sgcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.sghead{text-align:center;background:linear-gradient(180deg,#ffe9f1,#fff);border:3px solid #f06292;border-radius:24px;padding:10px 14px;margin-bottom:12px}
.sghead .em{font-size:46px;line-height:1.2}.sghead h2{margin:2px 0;color:#b0306a;font-size:22px}.sghead p{margin:2px 0;font-size:15px;color:var(--muted);line-height:1.7}
.sggrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sgt{background:#fff;border:2px solid #f8c8d8;border-radius:18px;padding:12px 8px;text-align:center;color:inherit;box-shadow:0 4px 0 #f8c8d8;position:relative}
.sgt:active{transform:translateY(3px);box-shadow:0 1px 0 #f8c8d8}.sgt .e{font-size:42px;display:block;line-height:1.3}.sgt b{font-size:19px;color:#8a1f52}.sgt small{display:block;color:var(--muted);font-size:13px;line-height:1.5}
.sgt .ok{position:absolute;top:-8px;left:-6px;font-size:24px}.sgt svg{width:100%;height:auto;border-radius:12px;display:block}
.sgcap{font-size:19px;font-weight:700;text-align:center;color:#0b3d27;margin:6px 0 8px;line-height:1.8}
.sgcanvas{width:100%;max-width:440px;margin:0 auto;display:block;background:#fff;border-radius:20px;box-shadow:0 4px 14px rgba(0,0,0,.12);touch-action:manipulation}
.sgcanvas .f{cursor:pointer;transition:fill .15s}
.sgpal{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:12px 0 6px}
.sgpal button{width:42px;height:42px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #cfd8d3;padding:0}
.sgpal button.on{box-shadow:0 0 0 4px #1f2d27;transform:scale(1.12)}
.sgmt{display:grid;grid-template-columns:1fr 1.5fr;gap:12px 40px;position:relative;margin-top:8px}
.sgmt button{background:#fff;border:3px solid var(--line);border-radius:16px;min-height:72px;font-size:18px;font-weight:800;color:var(--ink);padding:6px;position:relative;z-index:1}
.sgmt .pic{font-size:44px}.sgmt button.sel{border-color:#1e88e5;background:#e8f2ff}.sgmt button.ok{border-color:#1fa463;background:#e3f7ea}.sgmt button.no{border-color:#d64545;background:#fde7e7;animation:sgsh .35s}
@keyframes sgsh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.sgmt svg.ln{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
.sgq{font-size:23px;font-weight:800;text-align:center;color:#0b3d27;background:#fff;border:2px solid #f8c8d8;border-radius:18px;padding:12px;margin:8px 0;line-height:1.8}
.sgops{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.sgops button{background:#fff;border:3px solid var(--line);border-radius:18px;padding:10px 4px;font-size:15px;font-weight:800;color:var(--ink)}
.sgops button .pic{font-size:46px;display:block;line-height:1.25}.sgops button.ok{border-color:#1fa463;background:#e3f7ea}.sgops button.no{border-color:#d64545;background:#fde7e7}
.sgsay{background:#fff3f8;border:2px solid #f06292;border-radius:14px;padding:4px 12px;font-size:16px;font-weight:800;color:#b0306a}
.sgchk{background:#fff;border-radius:16px;padding:10px 14px;margin:10px 0;text-align:right;line-height:2}
`;
document.head.appendChild(css);

const sec=document.createElement('section');sec.className='screen';sec.id='sighar';
sec.innerHTML=`<div class="bar"><button class="back" id="sgBack">›</button><div class="ttl" id="sgTitle">🎨 ركن الصغار</div></div><div id="sgBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard sgcard';card.id='openSighar';
card.innerHTML=`<span class="cup">🎨</span><span><b>ركن الصغار</b><small id="sgLine">لوّن، وصِلْ الصور، وأجب بالصور</small></span><span class="go">‹</span>`;
($('#openBook2')||$('#openBook')).after(card);
const body=()=>$('#sgBody');
let where='menu';
const colored=()=>PICS.filter(p=>sg.done['c_'+p.id]).length;
function line(){const n=colored();$('#sgLine').textContent=n?`لوّنتَ ${ar(n)} من ${ar(PICS.length)} صور 🌟`:'لوّن، وصِلْ الصور، وأجب بالصور'}
line();
card.onclick=()=>{menu();show('sighar')};
$('#sgBack').onclick=()=>{if(where=='color')colorList();else if(where!='menu')menu();else{renderHome&&renderHome();show('home')}};

function menu(){where='menu';$('#sgTitle').textContent='🎨 ركن الصغار';
  body().innerHTML=`<div class="sghead"><div class="em">🌈</div><h2>ركن الصغار</h2><p>من كتاب «أنا أعرف ديني». ${T('العب وتعلّم','العبي وتعلّمي')} 💖</p></div>
  <div class="sggrid">
   <button class="sgt" id="sgC"><span class="e">🎨</span><b>لوّن</b><small>${ar(colored())} من ${ar(PICS.length)} صور</small></button>
   <button class="sgt" id="sgM">${sg.match?'<span class="ok">✅</span>':''}<span class="e">🔗</span><b>صِلْ الصورة</b><small>كل صورة بجملتها</small></button>
   <button class="sgt" id="sgQ">${sg.quiz>=0?'<span class="ok">✅</span>':''}<span class="e">🖼️</span><b>أسئلة بالصور</b><small>${sg.quiz>=0?'أفضل نتيجة: '+ar(sg.quiz)+' من '+ar(QZ.length):'١٠ أسئلة سهلة'}</small></button>
   <button class="sgt" id="sgS"><span class="e">🏅</span><b>شهادتي</b><small>شهادة البطل الصغير</small></button>
   <button class="sgt" id="sgB" style="grid-column:1/-1"><span class="e">📖</span><b>اقرأ الكتاب</b><small>«أنا أعرف ديني» بالصور</small></button></div>`;
  $('#sgC').onclick=colorList;$('#sgM').onclick=match;$('#sgQ').onclick=()=>quiz(0,0,shuffle(QZ.map((_,i)=>i)));$('#sgS').onclick=cert;$('#sgB').onclick=()=>openReader(null,1);
  window.scrollTo(0,0)}

/* ---------- ١) التلوين ---------- */
function colorList(){where='list';$('#sgTitle').textContent='🎨 لوّن';
  body().innerHTML=`<div class="sghead"><h2>🎨 ${T('اختر','اختاري')} صورة ${T('ولوّنها','ولوّنيها')}</h2><p>المس اللون، ثم المس الجزء الذي ${T('تريد','تريدين')} تلوينه</p></div><div class="sggrid">${PICS.map(p=>`<button class="sgt" data-p="${p.id}">${sg.done['c_'+p.id]?'<span class="ok">✅</span>':''}${svgOf(p)}<b>${p.n}</b></button>`).join('')}</div>`;
  body().querySelectorAll('[data-p]').forEach(b=>{const p=PICS.find(x=>x.id==b.dataset.p);paintSaved(b.querySelector('svg'),p);b.onclick=()=>colorPic(p)});window.scrollTo(0,0)}
let cur='#fdd835';
function colorPic(p){where='color';$('#sgTitle').textContent='🎨 '+p.n;
  body().innerHTML=`<div class="sgcap">${p.t}</div>${svgOf(p,'sgcanvas')}<div class="sgpal">${PAL.map(c=>`<button data-c="${c}" style="background:${c}" class="${c==cur?'on':''}" aria-label="لون"></button>`).join('')}</div>
   <div class="nav"><button class="btn sec" id="sgClr">🧽 امسح</button><button class="btn gold" id="sgSave">💾 احفظ صورة</button></div><div id="sgRw"></div>`;
  const svg=body().querySelector('.sgcanvas');paintSaved(svg,p);
  body().querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{cur=b.dataset.c;body().querySelectorAll('[data-c]').forEach(x=>x.classList.toggle('on',x==b))});
  const els=[...svg.querySelectorAll('.f')];
  els.forEach((e,i)=>e.addEventListener('click',()=>{e.setAttribute('fill',cur);(sg.col[p.id]=sg.col[p.id]||{})[i]=cur;sv();
    try{typeof tone=='function'&&tone(520+i*20,.05,'sine',.08)}catch(x){}
    const m=sg.col[p.id];if(els.filter((_,k)=>m[k]&&m[k]!='#ffffff').length>=Math.ceil(els.length*.7)&&!sg.done['c_'+p.id]){
      const r=reward('c_'+p.id,5);line();cheer();$('#sgRw').innerHTML=`<p class="sgcap">ما شاء الله! صورة جميلة 🌟</p>${r}`}}));
  $('#sgClr').onclick=()=>{delete sg.col[p.id];sv();paintSaved(svg,p)};
  $('#sgSave').onclick=()=>{const x=new XMLSerializer().serializeToString(svg).replace('class="sgcanvas"','width="900" height="900"');
    const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=900;c.height=1000;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,900,1000);g.drawImage(im,0,0,900,900);
      g.fillStyle='#0b3d27';g.font='700 34px Tajawal, system-ui, sans-serif';g.textAlign='center';g.direction='rtl';g.fillText(p.n+' — جنّتي الصغيرة',450,960);savePNG(c,'تلويني-'+p.id+'.png')};
    im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(x)};
  window.scrollTo(0,0)}

/* ---------- ٢) صِلْ كل صورة بجملتها ---------- */
const MT=[['☀️','اللهُ واحدٌ'],['⚖️','اللهُ عادلٌ'],['📖','نبيُّنا جاءنا بالقرآن'],['🏮','الإمامُ يهدينا'],['🌱','العملُ الطيّبُ مثلُ بذرةٍ تكبر']];
function match(){where='match';$('#sgTitle').textContent='🔗 صِلْ الصورة';
  const R=shuffle(MT.map((_,i)=>i));let sel=null,got=0;
  body().innerHTML=`<div class="sghead"><h2>🔗 صِلْ كلَّ صورةٍ بجملتها</h2><p>المس الصورة، ثم المس الجملة التي تناسبها</p></div>
   <div class="sgmt" id="sgMt"><svg class="ln" id="sgLn"></svg>${MT.map((m,i)=>`<button class="pic" data-i="${i}" style="grid-column:1;grid-row:${i+1}">${m[0]}</button><button data-j="${R[i]}" style="grid-column:2;grid-row:${i+1}">${MT[R[i]][1]}</button>`).join('')}</div><div id="sgRw"></div>`;
  const box=$('#sgMt'),ln=$('#sgLn');
  box.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{if(b.classList.contains('ok'))return;box.querySelectorAll('[data-i]').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b});
  box.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{if(!sel||b.classList.contains('ok'))return;
    if(+b.dataset.j==+sel.dataset.i){sel.classList.remove('sel');sel.classList.add('ok');b.classList.add('ok');ding(true);
      const r0=box.getBoundingClientRect(),a=sel.getBoundingClientRect(),c=b.getBoundingClientRect();
      ln.insertAdjacentHTML('beforeend',`<line x1="${a.left-r0.left}" y1="${a.top+a.height/2-r0.top}" x2="${c.right-r0.left}" y2="${c.top+c.height/2-r0.top}" stroke="#1fa463" stroke-width="5" stroke-linecap="round"/>`);
      sel=null;if(++got==MT.length){sg.match=1;sv();const r=reward('match',10);cheer();$('#sgRw').innerHTML=`<p class="sgcap">${T('أحسنتَ يا بطل','أحسنتِ يا بطلة')}! 🌟</p>${r}<div class="nav"><button class="btn gold" id="sgAg">العب مرة ثانية</button><button class="btn sec" id="sgMn">ركن الصغار</button></div>`;$('#sgAg').onclick=match;$('#sgMn').onclick=menu}}
    else{ding(false);b.classList.add('no');setTimeout(()=>b.classList.remove('no'),450)}});
  window.scrollTo(0,0)}

/* ---------- ٣) أسئلة بالصور ---------- */
const QZ=[
 {q:'أيُّ صورةٍ تذكّرنا أن اللهَ واحدٌ؟',o:[['☀️','الشمس الواحدة'],['⚖️','الميزان'],['🏮','الفانوس']],a:0},
 {q:'أيُّ صورةٍ تذكّرنا أن اللهَ عادلٌ؟',o:[['🏮','الفانوس'],['⚖️','الميزان'],['🌱','البذرة']],a:1},
 {q:'الأئمّةُ يهدوننا مثل…',o:[['🌧️','المطر'],['⚽','الكرة'],['🏮','الفانوس يُضيء الطريق']],a:2},
 {q:'جاءنا نبيُّنا محمدٌ صلى الله عليه وآله بـ…',o:[['📖','القرآن'],['🎈','البالون'],['⚽','الكرة']],a:0},
 {q:'العملُ الطيّبُ مثل…',o:[['🪨','حجر'],['🌱','بذرة تكبر وتصير شجرة'],['💨','ريح']],a:1},
 {q:'الإمامُ المهديُّ مثلُ الشمسِ خلفَ…',o:[['🌊','البحر'],['⛰️','الجبل'],['⛅','السحاب']],a:2},
 {q:'كم أصلًا لديننا؟ ${T("عُدَّها","عُدّيها")} على أصابعك!',o:[['✋','خمسة'],['✌️','اثنان'],['☝️','واحد']],a:0},
 {q:'مَن خلقَ الشمسَ والقمرَ والشجرَ والزهر؟',o:[['✨','الله'],['🧒','الطفل'],['🌳','الشجرة']],a:0},
 {q:'أيُّ هذه عملٌ طيّب؟',o:[['😠','أغضب وأصرخ'],['😊','أبتسم'],['🙈','أختبئ من الصلاة']],a:1},
 {q:'${T("وجدتَ","وجدتِ")} لعبةَ صديقك، ماذا ${T("تفعل","تفعلين")}؟',o:[['🤝','أُرجعها إليه'],['🎒','آخذها لي'],['🗑️','أرميها']],a:0}];
const arVoice=()=>{try{return speechSynthesis.getVoices().find(v=>/^ar/i.test(v.lang))}catch(e){return null}};
function say(t){try{const v=arVoice();if(!v)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/[^؀-ۿ\s؟،]/g,''));u.voice=v;u.lang=v.lang;u.rate=.85;speechSynthesis.speak(u)}catch(e){}}
function quiz(i,score,order){where='quiz';const q=QZ[order[i]],qt=q.q.replace(/\$\{T\("([^"]*)","([^"]*)"\)\}/g,(_,a,b)=>T(a,b));$('#sgTitle').textContent='🖼️ سؤال '+ar(i+1)+' من '+ar(QZ.length);
  const op=shuffle(q.o.map((_,k)=>k));
  body().innerHTML=`<div class="qsdots">${QZ.map((_,k)=>`<i class="${k==i?'on':''}" style="background:${k==i?'#f06292':'#f8c8d8'}"></i>`).join('')}</div><div class="sgq">${qt}</div>
   ${arVoice()?`<div style="text-align:center"><button class="sgsay" id="sgSay">🔊 اسمع السؤال</button></div>`:''}
   <div class="sgops">${op.map(k=>`<button data-k="${k}"><span class="pic">${q.o[k][0]}</span>${q.o[k][1]}</button>`).join('')}</div><div class="fb" id="sgFb"></div>`;
  if($('#sgSay'))$('#sgSay').onclick=()=>say(qt);
  let locked=false;
  body().querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const ok=+b.dataset.k==q.a;b.classList.add(ok?'ok':'no');
    if(!ok)body().querySelector(`[data-k="${q.a}"]`).classList.add('ok');ding(ok);
    $('#sgFb').className='fb '+(ok?'ok':'bad');$('#sgFb').textContent=ok?'أحسنت! 🌟':'الجواب الصحيح باللون الأخضر 💪';
    setTimeout(()=>{i+1<QZ.length?quiz(i+1,score+(ok?1:0),order):quizEnd(score+(ok?1:0))},1100)});
  window.scrollTo(0,0)}
function quizEnd(s){where='qend';sg.quiz=Math.max(sg.quiz,s);sv();const r=s>=7?reward('quiz',s+5):'';if(s>=7)cheer();
  body().innerHTML=`<div class="sghead"><div class="em">${s==QZ.length?'🌟':s>=7?'👏':'💪'}</div><h2>${ar(s)} من ${ar(QZ.length)}</h2><p>${s>=7?T('أحسنتَ يا بطل!','أحسنتِ يا بطلة!'):T('حاول مرة ثانية، أنت تقدر!','حاولي مرة ثانية، أنتِ تقدرين!')}</p></div>${r}
   <div class="nav"><button class="btn gold" id="sgAg">العب مرة ثانية</button><button class="btn sec" id="sgMn">ركن الصغار</button></div>`;
  $('#sgAg').onclick=()=>quiz(0,0,shuffle(QZ.map((_,i)=>i)));$('#sgMn').onclick=menu;window.scrollTo(0,0)}

/* ---------- ٤) الشهادات صورًا ---------- */
function savePNG(c,name){c.toBlob(async b=>{if(!b)return;
  try{const f=new File([b],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(e){if(e&&e.name=='AbortError')return}
  const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);
  modal(`<div style="font-size:48px">💾</div><h3 style="margin:4px 0">تم حفظ الصورة</h3><p>إذا ما لقيتها في الصور أو التحميلات، صوّر الشاشة 📸</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`)},'image/png')}
function wrap(g,t,x,y,w,lh){const ws=t.split(' ');let l='';for(const s of ws){const tt=l?l+' '+s:s;if(g.measureText(tt).width>w&&l){g.fillText(l,x,y);y+=lh;l=s}else l=tt}if(l)g.fillText(l,x,y);return y+lh}
async function drawCert(o){try{await document.fonts.ready}catch(e){}
  const c=document.createElement('canvas'),W=1000,H=1400;c.width=W;c.height=H;const g=c.getContext('2d');g.direction='rtl';g.textAlign='center';
  const F=(w,s)=>`${w} ${s}px Tajawal, system-ui, sans-serif`;
  g.fillStyle='#fff7e6';g.fillRect(0,0,W,H);g.strokeStyle=o.col;g.lineWidth=26;g.strokeRect(30,30,W-60,H-60);g.strokeStyle='#e9b949';g.lineWidth=5;g.strokeRect(64,64,W-128,H-128);
  g.font='120px serif';g.fillText(o.em,W/2,230);
  g.fillStyle=o.col;g.font=F(900,72);g.fillText(o.title,W/2,350);
  g.fillStyle='#0b3d27';g.font=F(700,42);g.fillText(o.sub,W/2,430);g.font=F(500,36);g.fillText(o.pre,W/2,500);
  g.fillStyle='#b8860b';g.font=F(900,78);g.fillText(o.name,W/2,610);g.strokeStyle='#e9b949';g.lineWidth=3;g.beginPath();g.moveTo(220,640);g.lineTo(780,640);g.stroke();
  g.fillStyle='#0b3d27';g.font=F(700,38);let y=720;for(const t of o.lines)y=wrap(g,t,W/2,y,800,60);
  ['#1f8a5a','#2f6fc6','#e07b1a','#7a4fc4','#11908a'].forEach((cc,i)=>{g.fillStyle=cc;g.beginPath();g.arc(W/2+(i-2)*90,y+40,30,0,7);g.fill()});
  y+=140;g.fillStyle='#4a5a52';g.font=F(500,30);if(o.dua)y=wrap(g,o.dua,W/2,y,820,50);
  g.fillStyle='#7a8a82';g.font=F(500,26);g.fillText(o.foot,W/2,H-110);g.fillText(new Date().toLocaleDateString('ar-IQ'),W/2,H-70);
  return c}
const nm=()=>{try{return state.name||state.nick||''}catch(e){return ''}};
function cert(){where='cert';$('#sgTitle').textContent='🏅 شهادتي';
  const ok1=colored()>=1,ok2=!!sg.match,ok3=sg.quiz>=7,all=ok1&&ok2&&ok3;
  body().innerHTML=`<div class="sghead"><div class="em">🏅</div><h2>شهادة البطل الصغير</h2><p>${all?T('مبارك! شهادتك جاهزة','مبارك! شهادتك جاهزة'):'أكمل هذه الثلاثة لتحصل على شهادتك:'}</p></div>
   <div class="sgchk">${ok1?'✅':'⬜'} لوّن صورة واحدة على الأقل<br>${ok2?'✅':'⬜'} صِلْ كل الصور بجملها<br>${ok3?'✅':'⬜'} أجب عن ٧ أسئلة بالصور أو أكثر</div>
   ${all?`<input class="inp" id="sgNm" maxlength="30" placeholder="اكتب اسمك هنا" value="${nm().replace(/["<>&]/g,'')}"><div class="nav"><button class="btn gold" id="sgMk">🏅 اصنع شهادتي</button></div><div id="sgCv" style="margin-top:10px"></div>`:`<div class="nav"><button class="btn gold" id="sgMn">ركن الصغار</button></div>`}`;
  if(!all){$('#sgMn').onclick=menu;return}
  $('#sgMk').onclick=async()=>{const n=$('#sgNm').value.trim();if(!n){$('#sgNm').focus();return}
    const c=await drawCert({em:'🌟',col:'#f06292',title:'شهادة البطل الصغير',sub:T('أحسنتَ يا بطل!','أحسنتِ يا بطلة!'),pre:'هذه الشهادة لـ',name:n,
      lines:['الآن '+T('تعرف','تعرفين')+' أصول دينك الخمسة:','التوحيد، العدل، النبوّة، الإمامة، المعاد'],dua:'',foot:'من كتاب «أنا أعرف ديني» — تأليف الشيخ علاء المطوري'});
    c.style.cssText='width:100%;border-radius:16px;box-shadow:0 4px 14px rgba(0,0,0,.15)';$('#sgCv').innerHTML='';$('#sgCv').appendChild(c);
    $('#sgCv').insertAdjacentHTML('beforeend','<div class="nav"><button class="btn gold" id="sgSv">💾 احفظ الشهادة صورة</button></div>');$('#sgSv').onclick=()=>savePNG(c,'شهادة-البطل-الصغير.png');cheer()};
  window.scrollTo(0,0)}
async function saveBigCert(){const n=nm();const stars=Object.values(state.stars||{}).reduce((a,b)=>a+b,0);
  const c=await drawCert({em:'🏆',col:'#14794f',title:'شهادةُ إتمام',sub:'بارك الله فيك يا بطلنا',pre:'أكمل الطالب المجتهد',name:n,
    lines:['رحلة «أصول ديني الخمسة»','فهو يعرف: التوحيد والعدل والنبوّة والإمامة والمعاد','⭐ '+ar(stars)+' نجمة من '+ar(STAGES.length*3)],
    dua:'اللّهمّ عرّفني نفسك، فإنّك إن لم تعرّفني نفسك لم أعرف نبيّك. اللّهمّ عرّفني نبيّك، فإنّك إن لم تعرّفني نبيّك لم أعرف حجّتك. اللّهمّ عرّفني حجّتك، فإنّك إن لم تعرّفني حجّتك ضللتُ عن ديني.',
    foot:'جنّتي الصغيرة — تصميم الشيخ علاء المطوري'});
  savePNG(c,'شهادة-أصول-ديني.png')}
window.Sighar={pics:PICS,saveBigCert,savePNG,get data(){return sg}};
})();
