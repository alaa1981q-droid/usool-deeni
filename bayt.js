/* ابنِ بيتك في الجنة — سباق بناء البيت
   الطوب ينزل وعليه كلمات، والطفل يلمس الكلمة الصحيحة التالية بالترتيب قبل أن ينتهي الوقت.
   الخطأ أو فوات الكلمة الصحيحة يُسقط طوبتين ويُنقص قلبًا، وإذا نفدت القلوب أو الوقت انهدم الطابق.
   كل طابق ينتهي تبدأ بعده المرحلة التالية تلقائيًا، والنقاط تتجمّع في سباق واحد.
   نصوص السور مأخوذة كما هي من دروس الكتاب (STAGES) ولا تُكتب هنا يدويًا. */
(function(){
const BKEY='usul5_bayt_v1';
let bs={done:0,best:0,stars:[0,0,0,0]};
try{const s=JSON.parse(localStorage.getItem(BKEY)||'null');if(s&&typeof s.done=='number')bs=Object.assign(bs,s)}catch(e){}
const bsave=()=>{try{localStorage.setItem(BKEY,JSON.stringify(bs))}catch(e){}};

/* ---------- الكؤوس 🏆 (مشتركة بين: بيتك في الجنة، اختبر نفسك، مسابقة الأبطال) ---------- */
const CKEY='usul5_cups_v1';
let cs={n:0,sex:'',day:'',daily:{}};
try{const s=JSON.parse(localStorage.getItem(CKEY)||'null');if(s&&typeof s.n=='number')cs=Object.assign(cs,s)}catch(e){}
const csave=()=>{try{localStorage.setItem(CKEY,JSON.stringify(cs))}catch(e){}};
const RANKS=[
 {at:0, icon:'🌱',name:'بنّاء صغير',color:'#5d6f66'},
 {at:3, icon:'🥉',name:'البنّاء البرونزي',color:'#b06a2c',gift:'flowers',giftName:'حديقة ورود ملوّنة حول بيتك 🌷'},
 {at:8, icon:'🥈',name:'البنّاء الفضّي',color:'#6f7f8f',gift:'fountain',giftName:'نافورة ماء جميلة أمام بيتك ⛲'},
 {at:15,icon:'🥇',name:'البنّاء الذهبي',color:'#c98a12',gift:'lanterns',giftName:'فوانيس ذهبية مضيئة على بيتك 🏮'},
 {at:25,icon:'💎',name:'البنّاء الماسي',color:'#2f8fd0',gift:'rainbow',giftName:'قوس قزح فوق بيتك 🌈'},
 {at:40,icon:'👑',name:'بطل الجنة',color:'#7c4dc4',gift:'crown',giftName:'تاج مضيء فوق بيتك 👑'}
];
const FLOOR_CUPS=[0,3,8,20]; // كم كأسًا يحتاج كل طابق ليُفتح
const DAILY={contest:3,nafsak:3}; // كم جولة في اليوم تعطي كؤوسًا
const rankOf=n=>RANKS.filter(r=>n>=r.at).pop();
const nextRank=n=>RANKS.find(r=>r.at>n);
const hasGift=g=>RANKS.some(r=>r.gift==g&&cs.n>=r.at);
const cupWord=n=>n==1?'كأس':n==2?'كأسان':n<=10?'كؤوس':'كأسًا';
function cupsAdd(n,src){const today=new Date().toDateString();if(cs.day!=today){cs.day=today;cs.daily={}}
  if(n>0&&src&&DAILY[src]){const c=cs.daily[src]||0;if(c>=DAILY[src])return {got:0,capped:true};cs.daily[src]=c+1}
  const before=cs.n;cs.n+=Math.max(0,n);csave();updHome();if(n>0&&window.Deco)Deco.addJ(n*10);return {got:Math.max(0,n),before,after:cs.n}}
function cupsHTML(r,n){if(r.capped)return `<div class="cupbox"><b>🏆</b>جمعتَ كؤوس اليوم من هنا. ارجع غدًا لكؤوس جديدة 🌙</div>`;
  if(!r.got)return `<div class="cupbox"><b>🏆</b>لم تربح كأسًا هذه المرة، حاول مرة أخرى 💪</div>`;
  const nx=nextRank(cs.n);
  return `<div class="cupbox win"><b>${'🏆'.repeat(Math.min(r.got,5))}</b>ربحتَ ${r.got>2?ar(r.got)+' ':''}${cupWord(r.got)}! عندك الآن ${ar(cs.n)} ${cupWord(cs.n)}${nx?`<small>باقي ${ar(nx.at-cs.n)} لتصير ${nx.icon} ${nx.name}</small>`:''}</div>`}
const isRankUp=r=>!!(r&&r.got&&rankOf(r.before)!==rankOf(r.after));
function rankUp(r,cont){if(!isRankUp(r))return false;const b=rankOf(r.after);
  setTimeout(()=>{fanfare();confetti();
    modal(`<div style="font-size:64px;line-height:1.2">${b.icon}</div><h3 style="margin:2px 0;color:${b.color}">مبروك! صرتَ ${b.name}</h3>
    <p style="margin:4px 0">🎁 هديتك: <b>${b.giftName}</b></p><div class="bhouse" style="margin:6px 0">${houseSVG(Math.max(1,bs.done),-1,0,true)}</div>
    <div class="nav">${cont?`<button class="btn gold" id="rkGo">أكمل البناء ⬆️</button><button class="btn sec" data-close>لاحقًا</button>`:`<button class="btn gold" data-close>الحمد لله 🤲</button>`}</div>`,
    ()=>{if(cont)$('#rkGo').onclick=()=>{closeModal();cont()}})},1500);return true}
/* تستعملها الفقرات الأخرى: يضيف الكؤوس ويعرضها داخل العنصر el */
window.cupsAward=function(n,src,el){const r=cupsAdd(n,src);if(el)el.insertAdjacentHTML('beforeend',cupsHTML(r,n));if(r.got)rankUp(r);return r};
window.Cups={get n(){return cs.n},get sex(){return cs.sex},setSex(s){cs.sex=s;csave()},rankOf,houseSVG:(...a)=>houseSVG(...a)};
function updHome(){const st=document.querySelector('.stats');if(!st)return;let b=document.getElementById('stCups');
  if(!b){st.insertAdjacentHTML('beforeend',`<div class="stat"><b id="stCups"></b><span id="stRank"></span></div>`);b=document.getElementById('stCups')}
  const r=rankOf(cs.n);b.textContent=`${ar(cs.n)} 🏆`;document.getElementById('stRank').textContent=`${r.icon} ${r.name}`}

const L0=STAGES[0].lessons;
const surah=h=>L0.find(l=>l.h==h).surah.map(v=>v[0].split(' '));
// الطابق الرابع: «آيةٌ أحفظها» من كل مرحلة، كما هي في الكتاب (علامات الوقف تبقى مع الكلمة التي قبلها)
const words=a=>a.split(' ').reduce((o,w)=>{if(/^[\u06D6-\u06ED\u06DD]+$/.test(w)&&o.length)o[o.length-1]+=' '+w;else if(w)o.push(w);return o},[]);
const MEMO=STAGES.filter(s=>s.memo).map(s=>({w:words(s.memo.a)}));
const EXTRA=(()=>{const inSeq=new Set(MEMO.flatMap(m=>m.w));const all=[];STAGES.forEach(s=>s.lessons.forEach(l=>(l.verses||[]).forEach(v=>words(v.a).forEach(w=>{if(!inSeq.has(w)&&w.length>3&&!/[\u06D6-\u06ED\u06DD]/.test(w))all.push(w)}))));
  return [...new Set(all)].slice(0,40)})();
const LEVELS=[
 {name:'أصول الدين الخمسة',floor:'الطابق الأول',icon:'🏠',color:'#14794f',quran:false,
  lines:[['التوحيد','العدل','النبوّة','الإمامة','المعاد']],extra:['الصلاة','الصوم','الحج','الزكاة'],
  speed:46,accel:2,spawn:1.1,maxOn:3,lives:3,time:35,
  tip:'انتبه! الصلاة والصوم والحج والزكاة من فروع الدين، ليست من الأصول.'},
 {name:'سورة التوحيد',floor:'الطابق الثاني',icon:'🏡',color:'#2f6fd0',quran:true,
  lines:surah('سورة التوحيد'),extra:[],speed:54,accel:1.3,spawn:.95,maxOn:4,lives:4,time:75,
  tip:'اجمع كلمات السورة بالترتيب. الكلمات التي بعدها تنزل معها لتخدعك!'},
 {name:'سورة الحمد',floor:'الطابق الثالث',icon:'🏰',color:'#e57c1f',quran:true,
  lines:surah('سورة الحمد'),extra:[],speed:62,accel:.8,spawn:.85,maxOn:4,lives:5,time:140,
  tip:'أطول سورة وأسرع طوب. سابق الوقت!'},
 {name:'آياتٌ أحفظها',floor:'الطابق الرابع',icon:'👑',color:'#7c4dc4',quran:true,hard:true,
  lines:MEMO.map(m=>m.w),extra:EXTRA,speed:70,accel:.9,spawn:.75,maxOn:5,lives:4,time:120,hints:1,
  tip:'أصعب طابق! آيات الحفظ من المراحل الخمس بالترتيب، والطوب أسرع، وكلماتٌ من آياتٍ أخرى تنزل لتخدعك. مساعدة واحدة فقط 💡'}
];
LEVELS.forEach(l=>{l.seq=[];l.lineOf=[];l.lines.forEach((ln,i)=>ln.forEach(w=>{l.seq.push(w);l.lineOf.push(i)}));
  l.pool=[...new Set(l.seq.concat(l.extra))]});
const FLOORMSG=[
 ['مبروك! صار لك بيت 🏠','جمعتَ أصول الدين الخمسة بالترتيب، فبنيتَ الطابق الأول.'],
 ['صار بيتك طابقين! 🏡','جمعتَ سورة التوحيد كاملة، فارتفع بيتك طابقًا جديدًا.'],
 ['بيتك ثلاثة طوابق! 🏰','جمعتَ سورة الحمد كاملة. بارك الله فيك يا بطل!'],
 ['قصرك أربعة طوابق! 👑','جمعتَ آيات الحفظ من المراحل الخمس بالترتيب. ما شاء الله، أنت بطلٌ حقيقي!']
];

/* ---------- styles ---------- */
const css=document.createElement('style');
css.textContent=`
.baytcard{border-color:#3fbf6f;box-shadow:0 5px 0 #a9e2bd}
.baytcard:active{box-shadow:0 2px 0 #a9e2bd}
.baytcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.bhouse{position:relative;border-radius:22px;border:2px solid var(--line);overflow:hidden;background:#cfeeff}
.bhouse svg .hcl,.bhouse svg .hbd{transform-box:fill-box}.bhouse svg .hcl{animation:hcl 14s ease-in-out infinite alternate}.bhouse svg .hbd{animation:hbd 6s ease-in-out infinite alternate}.bhouse svg .hwv{stroke-dasharray:10 6;animation:hwv 2.5s linear infinite}@keyframes hcl{to{transform:translateX(26px)}}@keyframes hbd{to{transform:translate(40px,-10px)}}@keyframes hwv{to{stroke-dashoffset:-32}}
.bhouse svg{display:block;width:100%;height:auto}
.bhouse.sm{height:200px}.bhouse.sm svg{height:100%;width:100%}
.bhouse.shake{animation:bshake .5s}
@keyframes bshake{0%,100%{transform:none}20%{transform:translateX(-8px) rotate(-1.2deg)}40%{transform:translateX(7px) rotate(1deg)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
.bhouse.fall svg .fl-part{animation:bcol 1s ease-in forwards}
@keyframes bcol{to{transform:translateY(110px) rotate(9deg);opacity:0}}
.bhouse.grow svg .fl-new{animation:bgrow .7s cubic-bezier(.3,1.6,.5,1)}
@keyframes bgrow{from{transform:translateY(-40px);opacity:0}}
.bdeb{position:absolute;width:20px;height:11px;background:linear-gradient(#f7d18e,#d99a4c);border:1px solid #9a6528;border-radius:2px;pointer-events:none;animation:bfall 1s ease-in forwards}
@keyframes bfall{to{transform:translateY(170px) rotate(240deg);opacity:0}}
.bcap{text-align:center;color:var(--muted);font-size:15px;margin:8px 0 2px}
.bbest{display:flex;gap:8px;margin:10px 0 0}
.bbest div{flex:1;background:#fff;border:1px solid var(--line);border-radius:16px;text-align:center;padding:6px}
.bbest b{display:block;font-size:20px;color:var(--green)}.bbest span{font-size:13px;color:var(--muted)}
.brace{width:100%;margin-top:12px;font-size:20px;padding:15px}
.blv{display:flex;align-items:center;gap:12px;width:100%;background:#fff;border-radius:20px;padding:10px 12px;margin:10px 0 0;border:2px solid var(--line);text-align:right;color:inherit}
.blv:active{transform:scale(.98)}
.blv .ic{width:54px;height:54px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:28px;box-shadow:0 4px 0 rgba(0,0,0,.15)}
.blv b{display:block;font-size:18px}.blv small{color:var(--muted);font-size:14px;line-height:1.5;display:block}
.blv .mk{margin-inline-start:auto;font-size:22px;flex:none}
.blv.locked{opacity:.5;filter:grayscale(.8)}
.bhud{display:flex;align-items:center;gap:6px;margin:8px 0 4px;flex-wrap:wrap}
.bhud .nm{flex:1;font-weight:800;font-size:15px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bhud .lives{font-size:16px;direction:ltr}
.bhud .pts{background:#14794f;color:#fff;border-radius:12px;padding:0 10px;font-weight:800;font-size:16px}
.bhud .combo{background:#e57c1f;color:#fff;border-radius:12px;padding:0 8px;font-weight:800;font-size:15px;animation:pulse .6s infinite}
.bhud .hintb{border:2px solid var(--gold);background:#fff8e6;border-radius:14px;padding:0 8px;font-size:14px;font-weight:800;color:#8a5a00}
.bhud .hintb:disabled{opacity:.4}
.btime{position:relative;height:16px;background:#dcebe2;border-radius:10px;overflow:hidden;margin-bottom:6px}
.btime i{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,#1fa463,#7bd88f);border-radius:10px;transition:background .3s}
.btime.warn i{background:linear-gradient(90deg,#e2504a,#f2b632)}
.btime.warn{animation:pulse .5s infinite}
.btime span{position:absolute;inset:0;text-align:center;font-size:12px;font-weight:800;line-height:16px;color:#123}
.bstrip{background:#fff;border:2px solid var(--line);border-radius:18px;padding:2px 10px;text-align:center;min-height:56px}
.bstrip .lb{font-size:13px;color:var(--muted)}
.bstrip .q{font-size:20px;line-height:1.9;color:var(--deep);font-weight:800}
.bstrip .q.qf{font-family:'Amiri Quran',serif;font-weight:400;font-size:21px}
.bstrip .w{display:inline-block;margin:0 3px}
.bstrip .w.hid{color:#b9cfc2;font-family:'Tajawal',sans-serif}
.bstrip .w.hint{color:#e57c1f;animation:pulse .5s infinite}
.bstrip .w.new{animation:bpopin .35s}
@keyframes bpopin{from{scale:1.6;color:#1fa463}}
.bboard{position:relative;height:min(42vh,330px);min-height:240px;background:linear-gradient(#d9f0ff,#fff8e6);border-radius:20px;border:2px solid var(--line);overflow:hidden;touch-action:manipulation;margin-top:6px}
.bboard::after{content:'';position:absolute;left:0;right:0;bottom:0;height:9px;background:repeating-linear-gradient(45deg,#e2504a 0 10px,#f2b632 10px 20px);opacity:.75}
.bboard.hurt{animation:bhurt .45s}
@keyframes bhurt{50%{box-shadow:inset 0 0 0 7px #e2504a;background:#ffe3e1}}
.bk{position:absolute;left:0;top:0;border:none;border-radius:10px;padding:5px 13px;font-size:20px;font-weight:800;color:#4a2e00;white-space:nowrap;will-change:transform;
  background:linear-gradient(#f7d18e,#e7ac5c);box-shadow:0 4px 0 #a8742f,inset 0 0 0 2px rgba(255,255,255,.45)}
.bk.qf{font-family:'Amiri Quran',serif;font-weight:400;font-size:22px;padding:0 13px;line-height:1.9}
.bk.star{background:radial-gradient(circle at 35% 30%,#fff6c2,#f2b632 60%,#c98a12);box-shadow:0 4px 0 #9a6a00,0 0 14px #ffd54a;color:#6b4300;font-family:'Tajawal',sans-serif;font-weight:800;font-size:17px;padding:5px 10px;animation:bglow .6s infinite alternate}
@keyframes bglow{to{box-shadow:0 4px 0 #9a6a00,0 0 26px #ffe57a}}
.bk.ok{animation:bok .3s forwards;pointer-events:none}
@keyframes bok{to{scale:1.5;opacity:0;filter:brightness(1.6)}}
.bk.no{background:#e2504a;color:#fff;box-shadow:0 4px 0 #a8332e;animation:bno .45s forwards;pointer-events:none}
@keyframes bno{30%{scale:1.15}to{scale:.6;opacity:0}}
.bfly{position:absolute;font-weight:800;font-size:18px;color:#14794f;pointer-events:none;animation:bfly .8s forwards;z-index:3;text-shadow:0 1px 0 #fff}
@keyframes bfly{to{transform:translateY(-50px);opacity:0}}
.bmsg{position:absolute;top:38%;left:0;right:0;text-align:center;font-weight:800;font-size:22px;pointer-events:none;animation:bmsg 1.1s forwards;z-index:3}
.bmsg.bad{color:#c43d38}.bmsg.good{color:#14794f}.bmsg.gold{color:#c98a12}
@keyframes bmsg{0%{opacity:0;scale:.7}15%{opacity:1;scale:1.1}75%{opacity:1}to{opacity:0;transform:translateY(-30px)}}
.bover{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(255,255,255,.88);text-align:center;padding:16px;z-index:4}
.bover p{margin:0;font-size:16px;color:var(--ink);line-height:1.7}
.bover .btn{flex:none;padding:12px 26px}
.bres{display:flex;gap:6px;justify-content:center;margin:6px 0}
.bres div{background:#f3faf6;border:1px solid var(--line);border-radius:14px;padding:4px 10px;font-size:13px;color:var(--muted)}
.bres b{display:block;font-size:18px;color:var(--green)}
.cupbox{background:linear-gradient(160deg,#fff8e1,#fff);border:2px solid #f2d27a;border-radius:16px;padding:8px 10px;margin:8px 0;text-align:center;font-size:15px;font-weight:700;color:#6b4b00}
.cupbox b{display:block;font-size:26px;line-height:1.3}.cupbox small{display:block;font-weight:500;color:var(--muted);font-size:13px}
.cupbox.win{animation:bpopin .5s;box-shadow:0 0 0 4px rgba(242,182,50,.2)}
.brank{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--line);border-radius:18px;padding:8px 12px;margin-top:10px}
.brank .ri{font-size:38px;line-height:1}.brank b{display:block;font-size:17px}.brank small{color:var(--muted);font-size:13px;display:block;line-height:1.5}
.brank .bar2{height:8px;background:#eef3ef;border-radius:8px;overflow:hidden;margin-top:4px}.brank .bar2 i{display:block;height:100%;background:var(--gold);border-radius:8px}
.bauto{height:8px;background:#dcebe2;border-radius:8px;overflow:hidden;margin:8px 0 4px}
.bauto i{display:block;height:100%;background:var(--gold);width:0;animation:bauto 4s linear forwards}
@keyframes bauto{to{width:100%}}
`;
document.head.appendChild(css);

/* ---------- sounds (Web Audio, respects state.mute) ---------- */
function ctx(){if(state.mute)return null;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state=='suspended')actx.resume();return actx}catch(e){return null}}
function noise(d=.3,vol=.25,at=0,lp=900){const a=ctx();if(!a)return;try{const n=Math.floor(a.sampleRate*d),buf=a.createBuffer(1,n,a.sampleRate),ch=buf.getChannelData(0);
  for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=buf;f.type='lowpass';f.frequency.value=lp;g.gain.value=vol;
  s.connect(f).connect(g).connect(a.destination);s.start(a.currentTime+at)}catch(e){}}
const NOTES=[523,587,659,784,880,1047,1175,1319];
const sBrick=(i,c)=>{tone(150,.06,'square',.09);noise(.05,.12,0,2500);tone(NOTES[i%NOTES.length]*(c>=10?1.5:c>=5?1.25:1),.16,'triangle',.15,.04)};
const sLine=()=>[659,784,988,1319].forEach((f,i)=>tone(f,.18,'triangle',.15,i*.09));
const sStar=()=>[1319,1568,2093,2637].forEach((f,i)=>tone(f,.12,'sine',.12,i*.06));
const sBad=()=>{noise(.45,.35,0,700);tone(160,.32,'sawtooth',.11);tone(105,.42,'sawtooth',.11,.14)};
const sCollapse=()=>{noise(1.4,.45,0,500);[392,330,262,196,147,110].forEach((f,i)=>tone(f,.3,'sawtooth',.1,i*.2))};
const sTick=()=>tone(1400,.04,'square',.07);
const sTap=()=>tone(880,.05,'sine',.08);

/* ---------- 3D house drawing ---------- */
const VW=360,VH=330,GY=292,FH=60,FX=78,FW=170,DX=46,DY=-24,SK=Math.atan2(DY,DX)*180/Math.PI;
const fy=i=>GY-FH*(i+1);
function defs(){return `<defs>
<linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd4ff"/><stop offset=".65" stop-color="#d8f1ff"/><stop offset="1" stop-color="#fff3d1"/></linearGradient>
<radialGradient id="hSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9d6"/><stop offset=".45" stop-color="#ffe066"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
<linearGradient id="hGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ee09a"/><stop offset="1" stop-color="#4fb86a"/></linearGradient>
<linearGradient id="hRiver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4aa3e8"/><stop offset=".5" stop-color="#7cc8ff"/><stop offset="1" stop-color="#4aa3e8"/></linearGradient>
<linearGradient id="hFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe6bd"/><stop offset="1" stop-color="#efc98a"/></linearGradient>
<linearGradient id="hSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a560"/><stop offset="1" stop-color="#b98445"/></linearGradient>
<linearGradient id="hRoofF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3cc47a"/><stop offset="1" stop-color="#16804a"/></linearGradient>
<linearGradient id="hRoofS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f9658"/><stop offset="1" stop-color="#0e6438"/></linearGradient>
<linearGradient id="hGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".5" stop-color="#f2b632"/><stop offset="1" stop-color="#b9851a"/></linearGradient>
<radialGradient id="hWin" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#bfe7ff"/><stop offset="1" stop-color="#6fbde8"/></radialGradient>
<pattern id="hStone" width="34" height="15" patternUnits="userSpaceOnUse"><rect width="34" height="15" fill="url(#hFront)"/><path d="M0 14.5H34M17 0V7.5M0 7.5H34M0 7.5V15M34 7.5V15" stroke="#dcae6a" stroke-width="1"/></pattern>
<pattern id="hStoneS" width="23" height="15" patternUnits="userSpaceOnUse"><rect width="23" height="15" fill="#c9924f"/><path d="M0 14.5H23M11.5 0V7.5M0 7.5H23" stroke="#a87436" stroke-width="1"/></pattern>
</defs>`}
function scene(){let s=`<rect width="${VW}" height="${VH}" fill="url(#hSky)"/>
<g opacity=".35" fill="#fff8c8">${[0,1,2,3,4].map(k=>`<polygon points="318,30 ${80+k*48},${GY} ${104+k*48},${GY}"/>`).join('')}</g>
<circle cx="318" cy="30" r="40" fill="url(#hSun)"/><circle cx="318" cy="30" r="16" fill="#ffd54a"/>
<g fill="#fff" opacity=".95" class="hcl"><ellipse cx="54" cy="44" rx="30" ry="11"/><ellipse cx="76" cy="36" rx="18" ry="12"/><ellipse cx="200" cy="26" rx="22" ry="8"/><ellipse cx="214" cy="21" rx="12" ry="8"/></g>
<g class="hbd"><path d="M150 60 q5 -5 10 0 q5 -5 10 0" stroke="#3b5560" stroke-width="1.6" fill="none"/><path d="M118 74 q4 -4 8 0 q4 -4 8 0" stroke="#3b5560" stroke-width="1.4" fill="none"/></g>
<path d="M0 ${GY-18} Q90 ${GY-34} 180 ${GY-20} T360 ${GY-22} V${VH} H0Z" fill="#a6e6ae"/>
<rect y="${GY-6}" width="${VW}" height="${VH-GY+6}" fill="url(#hGrass)"/>
<path d="M0 ${GY+22} Q90 ${GY+12} 180 ${GY+22} T360 ${GY+20} V${GY+34} Q270 ${GY+26} 180 ${GY+34} T0 ${GY+34}Z" fill="url(#hRiver)"/>
<path d="M30 ${GY+26} h18 M120 ${GY+28} h24 M230 ${GY+25} h16 M300 ${GY+28} h22" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8" class="hwv"/>
<path d="M${FX+FW/2-14} ${GY} L${FX+FW/2+14} ${GY} L${FX+FW/2+30} ${GY+22} L${FX+FW/2-30} ${GY+22}Z" fill="#f3dfb5"/>
<g transform="translate(${FX+FW/2} ${GY+28})"><path d="M-34 6 Q0 -8 34 6 L34 10 Q0 -3 -34 10Z" fill="#b07a3e" stroke="#7a4f22" stroke-width="1.2"/>
${[-26,-13,0,13,26].map(x=>`<line x1="${x}" y1="${(-1+7*(x/34)**2).toFixed(1)}" x2="${x}" y2="${(-11+7*(x/30)**2).toFixed(1)}" stroke="#7a4f22" stroke-width="2"/>`).join('')}
<path d="M-30 ${-4} Q0 -18 30 -4" stroke="#8a5a2b" stroke-width="2.4" fill="none"/></g>`;
  s+=palm(30,GY+4,1)+palm(336,GY+2,.9);
  [[20,GY+14,'#e2504a'],[60,GY+10,'#f2b632'],[300,GY+12,'#c45bd1'],[270,GY+8,'#e2504a'],[120,GY+12,'#fff'],[250,GY+14,'#f2b632']].forEach(([x,y,c])=>
    s+=`<g><circle cx="${x}" cy="${y}" r="3.2" fill="${c}"/><circle cx="${x+5}" cy="${y+2}" r="2.6" fill="${c}"/><circle cx="${x+2}" cy="${y-3}" r="2.4" fill="${c}"/></g>`);
  return s}
function palm(x,y,k){return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-3 0 Q-6 -40 2 -78 L7 -78 Q2 -40 4 0Z" fill="#9a6a3a"/>
<g fill="#2fae5f"><path d="M4 -78 Q-22 -92 -40 -70 Q-18 -80 4 -74Z"/><path d="M4 -78 Q30 -94 46 -72 Q24 -82 4 -74Z"/><path d="M4 -78 Q-8 -104 -26 -104 Q-6 -94 4 -76Z"/><path d="M4 -78 Q18 -106 36 -100 Q16 -94 4 -76Z"/></g>
<circle cx="0" cy="-74" r="3.5" fill="#8a4a1a"/><circle cx="7" cy="-73" r="3.5" fill="#8a4a1a"/></g>`}
function side(i,inner){return `<g transform="translate(${FX+FW} ${fy(i)}) skewY(${SK})">${inner}</g>`}
function winF(x,y,w=26,h=30){return `<path d="M${x-3} ${y+h} V${y+w/2} a${w/2+3} ${w/2+3} 0 0 1 ${w+6} 0 V${y+h}Z" fill="#b98a4e" opacity=".55"/><path d="M${x} ${y+h} V${y+w/2} a${w/2} ${w/2} 0 0 1 ${w} 0 V${y+h}Z" fill="url(#hWin)" stroke="url(#hGold)" stroke-width="3"/><path d="M${x+2} ${y+w/2+1} a${w/2-2} ${w/2-2} 0 0 1 ${w-4} 0" stroke="#3a6f8f" stroke-width="3" fill="none" opacity=".35"/><rect x="${x-2}" y="${y+h+4}" width="${w+4}" height="3" fill="#000" opacity=".1"/>
<line x1="${x+w/2}" y1="${y+2}" x2="${x+w/2}" y2="${y+h}" stroke="#fff" stroke-width="1.6" opacity=".8"/><rect x="${x-3}" y="${y+h}" width="${w+6}" height="4" rx="1" fill="#e6c07a"/>`}
function floorFull(i,cls=''){const y=fy(i);let s=`<g class="${cls}">`;
  s+=side(i,`<rect width="${DX}" height="${FH}" fill="url(#hStoneS)"/><rect width="${DX}" height="${FH}" fill="url(#hSide)" opacity=".55"/>
    <rect x="12" y="16" width="20" height="24" rx="3" fill="#5f9fc8" stroke="#e6c07a" stroke-width="2"/><rect y="0" width="${DX}" height="6" fill="#c58e47"/>`);
  s+=`<rect x="${FX}" y="${y}" width="${FW}" height="${FH}" fill="url(#hStone)"/>`;
  s+=`<rect x="${FX}" y="${y}" width="${FW}" height="6" fill="#e9c27c"/><rect x="${FX}" y="${y+FH-3}" width="${FW}" height="3" fill="#d9a85e"/>`;
  s+=`<rect x="${FX}" y="${y}" width="8" height="${FH}" fill="#f6d9a2"/><rect x="${FX+FW-8}" y="${y}" width="8" height="${FH}" fill="#e2b46f"/>`;
  s+=`<rect x="${FX}" y="${y+6}" width="${FW}" height="5" fill="#8a5a2b" opacity=".12"/><rect x="${FX+FW-3}" y="${y}" width="3" height="${FH}" fill="#000" opacity=".12"/>`;
  if(i==0){const dx=FX+FW/2;
    s+=winF(FX+20,y+18)+winF(FX+FW-46,y+18)+
     `<path d="M${dx-19} ${GY} V${GY-34} a19 19 0 0 1 38 0 V${GY}Z" fill="url(#hGold)"/>
      <path d="M${dx-15} ${GY} V${GY-33} a15 15 0 0 1 30 0 V${GY}Z" fill="#8a4f22"/><line x1="${dx}" y1="${GY-48}" x2="${dx}" y2="${GY}" stroke="#5e3414" stroke-width="2"/>
      <circle cx="${dx-4}" cy="${GY-17}" r="2.2" fill="#ffd54a"/><circle cx="${dx+4}" cy="${GY-17}" r="2.2" fill="#ffd54a"/>
      <rect x="${dx-26}" y="${GY}" width="52" height="5" fill="#e8d3a8"/><rect x="${dx-32}" y="${GY+5}" width="64" height="5" fill="#d9c08f"/>`}
  else{s+=winF(FX+18,y+16)+winF(FX+FW/2-13,y+16)+winF(FX+FW-44,y+16)+
     `<rect x="${FX+FW/2-36}" y="${y+FH-14}" width="72" height="4" fill="url(#hGold)"/>${[0,1,2,3,4,5,6].map(k=>`<rect x="${FX+FW/2-34+k*11}" y="${y+FH-10}" width="3" height="10" fill="#e6c07a"/>`).join('')}<rect x="${FX+FW/2-38}" y="${y+FH-1}" width="76" height="3" fill="#c99a52"/>`}
  return s+'</g>'}
function topSlab(n){if(n<=0)return '';const y=fy(n-1);
  return `<polygon points="${FX},${y} ${FX+DX},${y+DY} ${FX+FW+DX},${y+DY} ${FX+FW},${y}" fill="#f8e2b5" stroke="#d9a85e" stroke-width="1"/>`}
function floorPart(i,frac){const y=fy(i),cols=7,rows=3,bw=FW/cols,bh=FH/rows,k=Math.floor(frac*cols*rows+1e-9);let s='<g class="fl-part">';
  const ks=Math.floor(frac*6+1e-9);let sd='';
  for(let r=0;r<rows;r++)for(let c=0;c<2;c++){const idx=r*2+c,x=c*DX/2,yy=FH-bh*(r+1);
    sd+=idx<ks?`<rect x="${x+.6}" y="${yy+.6}" width="${DX/2-1.2}" height="${bh-1.2}" fill="#c48a45" stroke="#94612a"/>`:`<rect x="${x+1}" y="${yy+1}" width="${DX/2-2}" height="${bh-2}" fill="none" stroke="#b9a27a" stroke-dasharray="3 3"/>`}
  s+=side(i,sd);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const idx=r*cols+c,x=FX+FW-bw*(c+1),yy=y+FH-bh*(r+1);
    s+=idx<k?`<rect x="${x+.7}" y="${yy+.7}" width="${bw-1.4}" height="${bh-1.4}" rx="2" fill="${(r+c)%2?'#f4cd8a':'#e9b46a'}" stroke="#a8742f"/><rect x="${x+2}" y="${yy+1.5}" width="${bw-4}" height="3" rx="1" fill="#fff" opacity=".35"/>`
            :`<rect x="${x+1}" y="${yy+1}" width="${bw-2}" height="${bh-2}" rx="2" fill="rgba(255,255,255,.25)" stroke="#b9a27a" stroke-dasharray="3 3"/>`}
  // scaffold
  s+=`<g stroke="#8a5a2b" stroke-width="2.4" opacity=".75"><line x1="${FX-8}" y1="${y-8}" x2="${FX-8}" y2="${y+FH}"/><line x1="${FX+FW+DX+6}" y1="${y+DY-8}" x2="${FX+FW+DX+6}" y2="${y+FH+DY}"/><line x1="${FX-8}" y1="${y+FH/2}" x2="${FX}" y2="${y+FH/2}"/></g>`;
  return s+'</g>'}
function roof(n,cls=''){const y=fy(n-1),L=FX-12,R=FX+FW+12,M=FX+FW/2,H=66;
  return `<g class="${cls}"><polygon points="${M},${y-H} ${M+DX},${y-H+DY} ${R+DX},${y+DY} ${R},${y}" fill="url(#hRoofS)"/>
  ${[1,2,3,4].map(k=>`<line x1="${M+(R-M)*k/5}" y1="${y-H+H*k/5}" x2="${M+(R-M)*k/5+DX}" y2="${y-H+H*k/5+DY}" stroke="#0b5a32" stroke-width="1.2" opacity=".6"/>`).join('')}
  <polygon points="${L},${y} ${M},${y-H} ${R},${y}" fill="url(#hRoofF)" stroke="#0e6438" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="${L+18},${y-4} ${M},${y-H+16} ${R-18},${y-4}" fill="#f6e3b8"/>
  <circle cx="${M}" cy="${y-24}" r="11" fill="url(#hWin)" stroke="url(#hGold)" stroke-width="3"/>
  <line x1="${M}" y1="${y-H}" x2="${M+DX}" y2="${y-H+DY}" stroke="url(#hGold)" stroke-width="4" stroke-linecap="round"/>
  <path d="M${M} ${y-H-2} q-9 -4 -7 -14 a9 9 0 0 0 14 0 q2 10 -7 14z" fill="url(#hGold)"/><circle cx="${M}" cy="${y-H-22}" r="3" fill="#ffd54a"/></g>`}
let HK=1;
function houseSVG(full,part,frac,withRoof,anim,look){
  const L=look||(window.Deco?Deco.myLook():{c:cs.n}),D=window.Deco,hasGift=g=>RANKS.some(r=>r.gift==g&&(L.c||0)>=r.at);
  let s=`<svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${defs()}${scene()}`;
  if(D)s+=D.svg(L,'back');
  if(hasGift('rainbow'))s+=`<g fill="none" stroke-width="7" opacity=".55">${['#e2504a','#f2b632','#ffe066','#3fbf6f','#2f8fd0','#7c4dc4'].map((c,k)=>`<path d="M-10 ${GY-10} A190 170 0 0 1 370 ${GY-10}" stroke="${c}" transform="translate(0 ${k*7}) scale(1 ${1-k*.03})"/>`).join('')}</g>`;
  const top=Math.max(full,part+1);
  HK=top>=4?.8:1;const HCX=FX+FW/2+DX/2;if(HK<1)s+=`<g transform="translate(${HCX} ${GY}) scale(${HK}) translate(${-HCX} ${-GY})">`;
  if(top>0)s+=`<ellipse cx="${FX+FW/2+DX/2}" cy="${GY+3}" rx="${FW/2+DX}" ry="9" fill="#2f7a45" opacity=".35"/>`;
  const paint=D?D.paintFilter(L):'';if(paint)s+=`<g filter="${paint}">`;
  for(let i=0;i<full;i++)s+=floorFull(i,anim&&i==full-1?'fl-new':'');
  if(paint)s+='</g>';
  if(part>=0){s+=topSlab(part);s+=floorPart(part,frac)}
  if(withRoof&&full>0)s+=roof(full,anim?'fl-new':'');
  if(hasGift('lanterns')&&full>0){const dx=FX+FW/2;s+=[dx-34,dx+34].map(x=>`<g><line x1="${x}" y1="${GY-56}" x2="${x}" y2="${GY-48}" stroke="#8a5a00" stroke-width="1.5"/><circle cx="${x}" cy="${GY-40}" r="11" fill="#ffe066" opacity=".45"/><rect x="${x-5}" y="${GY-48}" width="10" height="14" rx="3" fill="url(#hGold)" stroke="#8a5a00"/><rect x="${x-3}" y="${GY-45}" width="6" height="8" rx="2" fill="#fff6b0"/></g>`).join('')}
  if(hasGift('crown')&&withRoof&&full>0){const y=fy(full-1)-66-40,M=FX+FW/2;s+=`<g><circle cx="${M}" cy="${y+6}" r="22" fill="#ffe066" opacity=".35"/><path d="M${M-16} ${y+14} L${M-18} ${y-2} L${M-8} ${y+6} L${M} ${y-8} L${M+8} ${y+6} L${M+18} ${y-2} L${M+16} ${y+14}Z" fill="url(#hGold)" stroke="#9a6a00" stroke-width="1.5"/><circle cx="${M}" cy="${y+8}" r="2.6" fill="#e2504a"/><circle cx="${M-9}" cy="${y+10}" r="2" fill="#2f8fd0"/><circle cx="${M+9}" cy="${y+10}" r="2" fill="#3fbf6f"/></g>`}
  if(HK<1)s+='</g>';
  if(hasGift('flowers'))s+=[[FX-14,GY+2],[FX+10,GY+4],[FX+FW-6,GY+4],[FX+FW+DX-10,GY-2],[FX+FW+24,GY+2]].map(([x,y])=>`<g><ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="#2e9c55"/>${[[-6,-3,'#e2504a'],[1,-6,'#ff8ac2'],[7,-2,'#f2b632'],[-1,1,'#fff']].map(([a,b,c])=>`<circle cx="${x+a}" cy="${y+b}" r="2.8" fill="${c}"/>`).join('')}</g>`).join('');
  if(hasGift('fountain')){const x=0,y=0;s+=`<g transform="translate(50 ${GY+14}) scale(1.5)"><ellipse cx="${x}" cy="${y}" rx="20" ry="6" fill="#bfc9cf" stroke="#8b979e"/><ellipse cx="${x}" cy="${y-1}" rx="16" ry="4" fill="#7cc8ff"/><rect x="${x-2.5}" y="${y-22}" width="5" height="21" fill="#bfc9cf"/><ellipse cx="${x}" cy="${y-22}" rx="9" ry="3" fill="#bfc9cf"/><path d="M${x} ${y-24} q-10 -12 -14 4 M${x} ${y-24} q10 -12 14 4 M${x} ${y-24} v-10" stroke="#7cc8ff" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`}
  if(D)s+=D.svg(L,'front',full,withRoof);
  if(full==0&&part<0)s+=floorPart(0,0)+`<text x="${FX+FW/2}" y="${fy(0)-14}" text-anchor="middle" font-size="16" font-weight="800" fill="#3d5a4a" font-family="Tajawal,sans-serif">هنا سيُبنى بيتك</text>`;
  // معرّفات فريدة لكل رسمة: إذا تكرّرت ووقعت الأولى في شاشة مخفية تختفي الألوان من الباقي
  const k=++svgN;return (s+'</svg>').replace(/(id="|url\(#)(h[A-Z]\w*)/g,`$1$2_${k}`)}
let svgN=0;

/* ---------- screen ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='bayt';
sec.innerHTML=`<div class="bar"><button class="back" id="byBack">›</button><div class="ttl">رحلة دينية مسلّية 🏡</div></div><div id="byBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard baytcard';card.id='openBayt';
card.innerHTML=`<span class="cup">🏡</span><span><b>رحلة دينية مسلّية</b><small id="baytLine"></small></span><span class="go">‹</span>`;
$('#openContest').after(card);
const updCard=()=>{$('#baytLine').textContent=bs.done>=LEVELS.length?`قصرك أربعة طوابق! أفضل نتيجة: ${ar(bs.best)} نقطة 👑`:bs.done?`بيتك الآن ${['','طابق واحد','طابقان','ثلاثة طوابق'][bs.done]}، أكمل البناء!`:'ابنِ بيتك في الجنة وزيّنه، وسابق أصدقاءك 🏁'};
updCard();updHome();
card.onclick=()=>{sTap();menu();show('bayt')};
$('#byBack').onclick=()=>{clearTimeout(autoT);if(G&&G.net){G.net.quit(G);return}if(G){stop();menu()}else{updCard();renderHome&&renderHome();show('home')}};
let autoT=0;

/* سبب قفل الطابق i، أو '' إذا كان مفتوحًا */
function lockWhy(i){if(i>bs.done)return 'أكمل الطابق الذي قبله أولًا';
  if(cs.n<FLOOR_CUPS[i])return `يحتاج ${ar(FLOOR_CUPS[i])} ${cupWord(FLOOR_CUPS[i])} 🏆 — عندك ${ar(cs.n)}`;return ''}
function rankBox(){const r=rankOf(cs.n),nx=nextRank(cs.n),f=nx?(cs.n-r.at)/(nx.at-r.at):1;
  return `<div class="brank"><span class="ri">${r.icon}</span><span style="flex:1"><b style="color:${r.color}">${r.name} · ${ar(cs.n)} 🏆</b>
  <small>${nx?`باقي ${ar(nx.at-cs.n)} ${cupWord(nx.at-cs.n)} لتصير ${nx.icon} ${nx.name}، وهديتك: ${nx.giftName}`:'وصلتَ أعلى رتبة! ما شاء الله 🌟'}</small><div class="bar2"><i style="width:${f*100}%"></i></div></span></div>`}
function menu(){G=null;clearTimeout(autoT);const B=$('#byBody');
  B.innerHTML=`<div class="bhouse">${houseSVG(bs.done,-1,0,true)}</div>
  ${rankBox()}
  <div class="bbest"><div><b>${ar(bs.done)} / ${ar(LEVELS.length)}</b><span>طوابق بيتك</span></div><div><b>${ar(bs.best)}</b><span>أفضل نتيجة ⭐</span></div></div>
  <button class="btn gold brace" id="byRace">🏁 ابدأ السباق من الطابق الأول</button>
  ${LEVELS.map((l,i)=>{const why=lockWhy(i),dn=i<bs.done;
    return `<button class="blv ${why?'locked':''}" data-lv="${i}"><span class="ic" style="background:${l.color}">${why?'🔒':l.icon}</span>
    <span><b>${l.floor}: ${l.name}</b><small>${why||`${ar(l.seq.length)} ${l.quran?'كلمة':'أصول'} · ${ar(l.time)} ثانية · ${ar(l.lives)} قلوب`}</small></span>
    <span class="mk">${dn?'⭐'.repeat(bs.stars[i]||1):why?'':'▶️'}</span></button>`}).join('')}
  <p class="bcap" style="margin-top:12px">المس الكلمة <b>التالية</b> بالترتيب قبل أن ينتهي الوقت ⏱️<br>الصحيح المتتابع يضاعف نقاطك 🔥 والنجمة الذهبية ⭐ تعطيك وقتًا إضافيًا.<br>الخطأ أو ترك الكلمة الصحيحة تسقط يهدم من بيتك!<br>🏆 كل نجمة جديدة تربحها في طابق = كأس، والسباق الكامل لكل الطوابق = كأسان.<br>واجمع كؤوسًا أكثر من «اختبر نفسك» و«مسابقة الأبطال».</p>`;
  $('#byRace').onclick=()=>{sTap();play(0,0,true)};
  if(window.Deco)Deco.menuHook(B);
  B.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{const i=+b.dataset.lv,why=lockWhy(i);
    if(why){tone(200,.15,'square',.08);modal(`<div style="font-size:50px">🔒</div><h3 style="margin:4px 0">${LEVELS[i].floor} مقفول</h3><p>${why}</p>${cs.n<FLOOR_CUPS[i]?'<p style="font-size:15px;color:var(--muted)">اجمع الكؤوس من «اختبر نفسك» و«مسابقة الأبطال»، أو أعد بناء الطوابق بنجوم أكثر ⭐</p>':''}<div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
    sTap();play(i,0)})}

/* ---------- game ---------- */
let G=null;
const need=()=>G.lv.seq[G.p];
function play(i,total,race,net){clearTimeout(autoT);const lv=LEVELS[i],B=$('#byBody');const tmax=net?Math.round(lv.time*1.3):lv.time;
  G={i,lv,race:!!race,net:net||null,tmax,p:0,lives:lv.lives,hints:lv.hints||2,bricks:[],run:false,spawnT:0,since:0,last:0,raf:0,
     time:tmax,score:total||0,start:total||0,combo:0,maxCombo:0,starT:5+Math.random()*4,lastTick:99};
  B.innerHTML=`<div class="bhouse sm" id="byHouse"></div>
  <div class="bhud"><span class="nm" style="color:${lv.color}">${lv.icon} ${lv.floor}</span><span class="pts" id="byPts"></span><span id="byCombo"></span><span class="lives" id="byLives"></span><button class="hintb" id="byHint">💡</button></div>
  <div class="btime" id="byTime"><i id="byTimeBar"></i><span id="byTimeTx"></span></div>
  <div class="bstrip" id="byStrip"></div>${net?'<div id="byOpp"></div>':''}
  <div class="bboard" id="byBoard">${net?'':`<div class="bover"><div style="font-size:46px">${lv.icon}</div><p><b>${lv.floor}: ${lv.name}</b><br>${lv.tip}<br>⏱️ عندك ${ar(lv.time)} ثانية</p><button class="btn gold" id="byGo">ابدأ البناء</button></div>`}</div>`;
  G.board=$('#byBoard');drawHouse();drawHud();drawTime();drawStrip();
  if(net){$('#byHint').onclick=hint;net.ready(G);return}
  $('#byGo').onclick=()=>{$('#byGo').parentNode.remove();begin()};
  $('#byHint').onclick=hint}
function begin(){ctCountdown(()=>{if(!G)return;G.run=true;G.last=performance.now();G.raf=requestAnimationFrame(loop)})}
function drawHouse(){$('#byHouse').innerHTML=houseSVG(G.i,G.i,G.p/G.lv.seq.length,false)}
function drawHud(){$('#byLives').textContent='❤️'.repeat(Math.max(0,G.lives))+'🤍'.repeat(G.lv.lives-Math.max(0,G.lives));
  $('#byPts').textContent=`⭐ ${ar(G.score)}`;$('#byHint').disabled=G.hints<=0;$('#byHint').textContent=`💡${ar(G.hints)}`;
  const m=mult();$('#byCombo').className=m>1?'combo':'';$('#byCombo').textContent=m>1?`🔥×${ar(m)}`:''}
function drawTime(){const f=Math.max(0,G.time)/G.tmax;$('#byTimeBar').style.width=f*100+'%';
  $('#byTimeTx').textContent=`⏱️ ${ar(Math.ceil(Math.max(0,G.time)))}`;$('#byTime').classList.toggle('warn',G.time<=10)}
const mult=()=>1+Math.floor(G.combo/5);
function drawStrip(hintOn,newIdx){const lv=G.lv,p=Math.min(G.p,lv.seq.length-1),li=lv.lineOf[p];const start=lv.lineOf.indexOf(li);
  const ws=lv.lines[li].map((w,k)=>{const gi=start+k;
    if(gi<G.p)return `<span class="w ${gi==newIdx?'new':''}">${w}</span>`;
    if(hintOn&&gi==G.p)return `<span class="w hint">${w}</span>`;
    return `<span class="w hid">◌</span>`}).join(' ');
  const lb=lv.quran?`الآية ${ar(li+1)} من ${ar(lv.lines.length)} · جمعتَ ${ar(G.p)} من ${ar(lv.seq.length)}`:`رتّب أصول الدين · جمعتَ ${ar(G.p)} من ${ar(lv.seq.length)}`;
  $('#byStrip').innerHTML=`<div class="lb">${lb}</div><div class="q ${lv.quran?'qf':''}">${lv.quran?'﴿':''}${ws}${lv.quran?'﴾':''}</div>`}
function hint(){if(!G||!G.run||G.hints<=0)return;G.hints--;G.combo=0;drawHud();tone(988,.12,'sine',.12);drawStrip(true);clearTimeout(G.ht);G.ht=setTimeout(()=>G&&drawStrip(),1300)}
function msg(t,cls){const d=document.createElement('div');d.className='bmsg '+cls;d.textContent=t;G.board.appendChild(d);setTimeout(()=>d.remove(),1100)}
function fly(b,t){const d=document.createElement('div');d.className='bfly';d.textContent=t;d.style.left=b.x+'px';d.style.top=Math.max(0,b.y)+'px';G.board.appendChild(d);setTimeout(()=>d.remove(),800)}

function makeBrick(txt,cls){const el=document.createElement('button');el.className='bk '+cls;el.textContent=txt;G.board.appendChild(el);
  const W=G.board.clientWidth,bw=el.offsetWidth,colW=W/3;
  const busy=new Set(G.bricks.filter(b=>b.y<70).map(b=>b.col));let free=[0,1,2].filter(c=>!busy.has(c));if(!free.length)free=[0,1,2];
  const col=free[Math.floor(Math.random()*free.length)];
  const x=Math.max(4,Math.min(W-bw-4,col*colW+(colW-bw)/2+(Math.random()*16-8)));
  const b={el,txt,x,y:-el.offsetHeight,col,h:el.offsetHeight,star:cls=='star'};el.style.transform=`translate(${x}px,${b.y}px)`;
  el.onpointerdown=e=>{e.preventDefault();if(!G||!G.run||!G.bricks.includes(b))return;if(b.star)gotStar(b);else if(b.txt==need())good(b);else bad(b)};
  G.bricks.push(b);return b}
function spawn(){const lv=G.lv,n=need();if(G.bricks.filter(b=>!b.star).length>=lv.maxOn)return;
  const onScreen=G.bricks.some(b=>b.txt==n);let txt;
  if(!onScreen&&(G.since>=2||Math.random()<.45)){txt=n;G.since=0}
  else{const near=lv.seq.slice(G.p+1,G.p+5).filter(w=>w!=n),far=lv.pool.filter(w=>w!=n);
    const src=near.length&&Math.random()<.65?near:far;txt=src[Math.floor(Math.random()*src.length)];if(!onScreen)G.since++}
  makeBrick(txt,lv.quran?'qf':'')}
function takeOut(b,cls){G.bricks=G.bricks.filter(x=>x!==b);if(cls){b.el.classList.add(cls);setTimeout(()=>b.el.remove(),460)}else b.el.remove()}
function loop(t){if(!G||!G.run)return;const dt=Math.min(.05,(t-G.last)/1000);G.last=t;
  G.time-=dt;const sec=Math.ceil(G.time);if(G.time<=10&&sec!=G.lastTick&&sec>0){G.lastTick=sec;sTick()}
  drawTime();if(G.time<=0){collapse('انتهى الوقت! ⏱️');return}
  G.spawnT-=dt;if(G.spawnT<=0){spawn();G.spawnT=G.lv.spawn*(.8+Math.random()*.4)}
  G.starT-=dt;if(G.starT<=0){makeBrick('⭐ +٥ ث','star');G.starT=9+Math.random()*6}
  const H=G.board.clientHeight-9,sp=G.lv.speed+G.p*G.lv.accel;
  for(const b of [...G.bricks]){b.y+=sp*(b.star?1.25:1)*dt;b.el.style.transform=`translate(${b.x}px,${b.y}px)`;
    if(b.y+b.h>=H){const wasNeed=!b.star&&b.txt==need();takeOut(b,wasNeed?'no':'');if(wasNeed){mistake('فاتتك الكلمة الصحيحة!');if(!G||!G.run)return}}}
  G.raf=requestAnimationFrame(loop)}
function gotStar(b){takeOut(b,'ok');G.time=Math.min(G.tmax,G.time+5);G.score+=25;sStar();fly(b,'+٥ ثوانٍ');drawHud();drawTime()}
function good(b){takeOut(b,'ok');const lv=G.lv,idx=G.p;G.p++;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);
  const m=mult(),pts=10*m;G.score+=pts;sBrick(idx,G.combo);fly(b,`+${ar(pts)}`);
  if(G.combo>0&&G.combo%5==0){msg(`🔥 رائع! ${ar(G.combo)} متتالية`,'gold')}
  const lineDone=G.p==lv.seq.length||lv.lineOf[G.p]!=lv.lineOf[idx];
  drawHouse();drawStrip(false,idx);drawHud();if(G.net)G.net.prog(G);
  if(G.p==lv.seq.length){finish();return}
  if(lineDone&&lv.quran){setTimeout(sLine,150);G.score+=20;if(G.combo%5)msg('أحسنت! آية كاملة ✨ +٢٠','good')}}
function bad(b){takeOut(b,'no');mistake('ليست هذه الكلمة!')}
function mistake(t){G.lives--;G.combo=0;const lose=Math.min(2,G.p);G.p-=lose;G.score=Math.max(G.start,G.score-15);sBad();if(navigator.vibrate)try{navigator.vibrate(120)}catch(e){}
  const h=$('#byHouse');h.classList.remove('shake');void h.offsetWidth;h.classList.add('shake');
  G.board.classList.remove('hurt');void G.board.offsetWidth;G.board.classList.add('hurt');
  const sc=h.clientHeight/VH,ox=(h.clientWidth-VW*sc)/2;
  for(let k=0;k<Math.max(1,lose)+2;k++){const d=document.createElement('div');d.className='bdeb';
    d.style.top=(GY-(GY-fy(G.i)-Math.random()*30)*HK)*sc+'px';d.style.left=ox+(FX+FW/2+DX/2+(FX+20+Math.random()*(FW-20)-FX-FW/2-DX/2)*HK)*sc+'px';d.style.animationDelay=k*.07+'s';h.appendChild(d);setTimeout(()=>d.remove(),1300)}
  drawHouse();drawStrip();drawHud();if(G.net)G.net.prog(G);
  if(G.lives<=0){collapse('انتهت القلوب 💔');return}
  msg(lose?`${t} سقط من بيتك ${lose==2?'طوبتان':'طوبة'} 💥`:t,'bad')}
function stop(){if(!G)return;G.run=false;cancelAnimationFrame(G.raf);clearTimeout(G.ht);G.bricks.forEach(b=>b.el.remove());G.bricks=[]}
function collapse(why){
  if(G.net){const timeUp=G.time<=0;G.run=false;cancelAnimationFrame(G.raf);G.bricks.forEach(b=>b.el.remove());G.bricks=[];sCollapse();
    const h=$('#byHouse');h.innerHTML=houseSVG(G.i,G.i,Math.max(.2,G.p/G.lv.seq.length),false);h.classList.add('fall');
    if(timeUp){G.net.timeout(G);return}
    msg('انهدم! ابنِ من جديد بسرعة 💪','bad');
    setTimeout(()=>{if(!G||!G.net||G.over)return;h.classList.remove('fall');G.p=0;G.lives=G.lv.lives;G.combo=0;drawHouse();drawStrip();drawHud();G.net.prog(G);
      G.run=true;G.last=performance.now();G.raf=requestAnimationFrame(loop)},1500);return}
  const i=G.i,start=G.start,race=G.race;stop();sCollapse();const h=$('#byHouse');h.innerHTML=houseSVG(i,i,.75,false);h.classList.add('fall');
  setTimeout(()=>{if(!G)return;h.classList.remove('fall');G.p=0;G.score=start;drawHouse();drawHud();
    const o=document.createElement('div');o.className='bover';o.innerHTML=`<div style="font-size:46px">🏚️</div><p><b>انهدم الطابق! ${why}</b><br>لا بأس، البنّاء الشاطر لا ييأس. حاول مرة أخرى.</p><button class="btn gold" id="byAgain">ابنِ من جديد</button>`;
    G.board.appendChild(o);$('#byAgain').onclick=()=>{sTap();play(i,start,race)}},1100)}
function finish(){if(G.net){stop();G.net.finish(G);return}
  const i=G.i,lv=G.lv,last=i==LEVELS.length-1;stop();
  const tBonus=Math.ceil(Math.max(0,G.time))*3,lBonus=G.lives*20;G.score+=tBonus+lBonus;
  const stars=G.lives==lv.lives?3:G.lives>=Math.ceil(lv.lives/2)?2:1;
  setTimeout(()=>{fanfare();confetti()},250);
  if(bs.done<i+1)bs.done=i+1;const newBest=last&&G.score>bs.best;if(G.score>bs.best)bs.best=G.score;
  // الكؤوس: كل نجمة جديدة في هذا الطابق = كأس، وإكمال السباق الكامل من الطابق الأول = كأسان
  const newStars=Math.max(0,stars-(bs.stars[i]||0));bs.stars[i]=Math.max(bs.stars[i]||0,stars);bsave();
  const won=newStars+(last&&G.race?2:0),cr=cupsAdd(won);updCard();
  const h=$('#byHouse');h.innerHTML=houseSVG(i+1,-1,0,true,true);h.classList.remove('grow');void h.offsetWidth;h.classList.add('grow');
  const [t,p]=FLOORMSG[i],total=G.score,race=G.race;
  const jw=window.Deco?Deco.floorJewels(G.score-G.start):'';
  const nextWhy=last?'':lockWhy(i+1);
  const res=`<div class="bres"><div><b>${'⭐'.repeat(stars)}</b>التقييم</div><div><b>+${ar(tBonus)}</b>بقية الوقت</div><div><b>+${ar(lBonus)}</b>القلوب</div><div><b>${ar(total)}</b>المجموع</div></div>`;
  const cupNote=cr.got?cupsHTML(cr):`<div class="cupbox"><b>🏆</b>${stars<3?'اربح نجومًا أكثر في هذا الطابق لتربح كأسًا ⭐':'أخذتَ كل كؤوس هذا الطابق. أكمل السباق كاملًا لتربح كأسين!'}</div>`;
  modal(`<div class="bhouse" style="margin-bottom:6px">${houseSVG(i+1,-1,0,true,true)}</div><h3 style="margin:4px 0">${t}</h3><p style="margin:2px 0 4px">${p}</p>${res}${cupNote}${jw}
    ${last?`<p style="margin:4px 0;font-weight:800;color:#14794f">${newBest?'🏆 رقم قياسي جديد!':`أفضل نتيجة: ${ar(bs.best)}`}</p>`:nextWhy?`<p style="margin:4px 0;font-weight:800;color:#b06a2c">🔒 الطابق التالي ${nextWhy}.<br><small style="font-weight:500;color:var(--muted)">اجمع الكؤوس من «اختبر نفسك» و«مسابقة الأبطال»، أو أعد البناء بنجوم أكثر.</small></p>`:`<div style="font-size:14px;color:var(--muted)">المرحلة التالية تبدأ تلقائيًا…</div><div class="bauto"><i></i></div>`}
    <div class="nav">${last?`<button class="btn gold" id="byRe">🏁 سباق جديد</button>`:nextWhy?`<button class="btn gold" id="byRe">🔁 أعد هذا الطابق</button>`:`<button class="btn gold" id="byNext">انطلق الآن ⬆️</button>`}<button class="btn sec" id="byMenu">بيتي</button></div>`,()=>{
    $('#byMenu').onclick=()=>{clearTimeout(autoT);closeModal();menu()};
    if(last)$('#byRe').onclick=()=>{closeModal();play(0,0,true)};
    else if(nextWhy)$('#byRe').onclick=()=>{closeModal();play(i,0)};
    else{const go=()=>{clearTimeout(autoT);if(!$('#modal').classList.contains('on'))return;closeModal();play(i+1,total,race);$('#byGo').parentNode.remove();begin()};
      $('#byNext').onclick=go;if(!isRankUp(cr))autoT=setTimeout(go,4000)}});
  // رتبة جديدة: تظهر الهدية أولًا، ومنها يكمل الطفل للطابق التالي
  rankUp(cr,!last&&!lockWhy(i+1)?()=>{play(i+1,total,race);$('#byGo').parentNode.remove();begin()}:null)}
document.addEventListener('visibilitychange',()=>{if(!G)return;if(document.hidden&&G.run){G.run=false;cancelAnimationFrame(G.raf);G.paused=true}
  else if(!document.hidden&&G.paused){G.paused=false;G.run=true;G.last=performance.now();G.raf=requestAnimationFrame(loop)}});
window.__bayt={get G(){return G},need:()=>G&&need()};
window.Bayt={get hk(){return HK},houseSVG,menu,LEVELS,begin:()=>begin(),stop:()=>{stop();G=null},play:(i,net)=>{show('bayt');play(i,0,false,net)},get G(){return G},get done(){return bs.done},get cups(){return cs.n},rankOf,RANKS,sTap,sStar,sLine,VW,VH,GY,FX,FW,DX,fy};
})();
