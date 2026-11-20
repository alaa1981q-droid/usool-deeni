/* ابنِ بيتك في الجنة — سباق بناء البيت
   الطوب ينزل وعليه كلمات، والطفل يلمس الكلمة الصحيحة التالية بالترتيب قبل أن ينتهي الوقت.
   الخطأ أو فوات الكلمة الصحيحة يُسقط طوبتين ويُنقص قلبًا، وإذا نفدت القلوب أو الوقت انهدم الطابق.
   كل طابق ينتهي تبدأ بعده المرحلة التالية تلقائيًا، والنقاط تتجمّع في سباق واحد.
   نصوص السور مأخوذة كما هي من دروس الكتاب (STAGES) ولا تُكتب هنا يدويًا. */
(function(){
const BKEY='usul5_bayt_v1';
let bs={done:0,best:0,stars:[0,0,0,0,0]};
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
const FLOOR_CUPS=[0,3,8,20,35]; // كم كأسًا يحتاج كل طابق ليُفتح
const DAILY={contest:3,nafsak:3,fiqh:4,prayer:1,tilawa:2,deeds:2}; // كم جولة في اليوم تعطي كؤوسًا
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
  lines:surah('سورة التوحيد'),extra:[],speed:38,accel:.5,spawn:1.15,maxOn:4,lives:4,time:90,
  tip:'اجمع كلمات السورة بالترتيب. الكلمات التي بعدها تنزل معها لتخدعك!'},
 {name:'سورة الحمد',floor:'الطابق الثالث',icon:'🏰',color:'#e57c1f',quran:true,
  lines:surah('سورة الحمد'),extra:[],speed:40,accel:.35,spawn:1.05,maxOn:4,lives:5,time:170,
  tip:'أطول سورة وأسرع طوب. سابق الوقت!'},
 {name:'آياتٌ أحفظها',floor:'الطابق الرابع',icon:'👑',color:'#7c4dc4',quran:true,hard:true,
  lines:MEMO.map(m=>m.w),extra:EXTRA,speed:46,accel:.4,spawn:.95,maxOn:4,lives:4,time:300,hints:1,
  tip:'أصعب طابق! آيات الحفظ من المراحل الخمس بالترتيب، والطوب أسرع، وكلماتٌ من آياتٍ أخرى تنزل لتخدعك. مساعدة واحدة فقط 💡'},
 // الطابق الخامس: خطوات صلاة الصبح بالترتيب (الركعتان)، وكل خطوة باسم مميّز حتى لا يلتبس الأمر
 {name:'ترتيب الصلاة',floor:'الطابق الخامس',icon:'🕌',color:'#0e7fa6',quran:false,
  lines:[['النيّة','تكبيرة الإحرام','سورة الحمد','سورة التوحيد','الركوع','القيام بعد الركوع','السجدة الأولى','الجلوس بين السجدتين','السجدة الثانية'],
         ['القيام للركعة الثانية','الحمد ٢','سورة بعدها','الركوع ٢','القيام ٢','السجدة الأولى ٢','الجلوس ٢','السجدة الثانية ٢','التشهّد','التسليم']],
  extra:['الأذان','الإقامة','الصوم','الحج'],
  speed:44,accel:.4,spawn:1,maxOn:4,lives:4,time:150,hints:2,
  tip:'رتّب الصلاة كما تعلّمتها: الركعة الأولى ثم الثانية. وكلمات ليست من الصلاة تنزل لتخدعك!'}
];
LEVELS.forEach(l=>{l.seq=[];l.lineOf=[];l.lines.forEach((ln,i)=>ln.forEach(w=>{l.seq.push(w);l.lineOf.push(i)}));
  l.pool=[...new Set(l.seq.concat(l.extra))]});
const FLOORMSG=[
 ['مبروك! صار لك بيت 🏠','جمعتَ أصول الدين الخمسة بالترتيب، فبنيتَ الطابق الأول.'],
 ['صار بيتك طابقين! 🏡','جمعتَ سورة التوحيد كاملة، فارتفع بيتك طابقًا جديدًا.'],
 ['بيتك ثلاثة طوابق! 🏰','جمعتَ سورة الحمد كاملة. بارك الله فيك يا بطل!'],
 ['قصرك أربعة طوابق! 👑','جمعتَ آيات الحفظ من المراحل الخمس بالترتيب. ما شاء الله، أنت بطلٌ حقيقي!'],
 ['قصرك خمسة طوابق! 🕌','رتّبتَ الصلاة كلّها بالترتيب. ما شاء الله، بنيتَ أعلى طابق في بيتك!']
];

/* ---------- styles ---------- */
const css=document.createElement('style');
css.textContent=`
.baytcard{border-color:#3fbf6f;box-shadow:0 5px 0 #a9e2bd}
.baytcard:active{box-shadow:0 2px 0 #a9e2bd}
.baytcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.bhouse{position:relative;border-radius:22px;border:2px solid var(--line);overflow:hidden;background:linear-gradient(#8fd4ff,#d8f1ff 62%,#a6e6ae 84%,#4fb86a)}
/* v8.1: في الليل تصير حواف الصورة ليلية أيضًا، وتختفي الشمس */
body.night .bhouse{background:linear-gradient(#16244a,#24365e 62%,#24402f 84%,#1a3324)}
body.night .bhouse svg .hsun{display:none}
body.night .bhouse svg .bn-mk,body.night .bhouse svg .bn-rdy{filter:brightness(2.3)}
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
.blvg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.blvg .blv{margin:0;flex-direction:column;justify-content:center;text-align:center;gap:4px;padding:10px 6px;min-width:0}
.blvg .blv b{font-size:16px}.blvg .blv small{font-size:12.5px;line-height:1.4}.blvg .blv .ic{width:46px;height:46px;font-size:24px}.blvg .blv .mk{margin:0;font-size:18px}
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
<radialGradient id="hHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
<radialGradient id="hSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9d6"/><stop offset=".45" stop-color="#ffe066"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
<linearGradient id="hGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ee09a"/><stop offset="1" stop-color="#4fb86a"/></linearGradient>
<linearGradient id="hRiver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4aa3e8"/><stop offset=".5" stop-color="#7cc8ff"/><stop offset="1" stop-color="#4aa3e8"/></linearGradient>
<linearGradient id="hFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe6bd"/><stop offset="1" stop-color="#efc98a"/></linearGradient>
<linearGradient id="hSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a560"/><stop offset="1" stop-color="#b98445"/></linearGradient>
<linearGradient id="hRoofF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3cc47a"/><stop offset="1" stop-color="#16804a"/></linearGradient>
<linearGradient id="hRoofS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f9658"/><stop offset="1" stop-color="#0e6438"/></linearGradient>
<linearGradient id="hGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".5" stop-color="#f2b632"/><stop offset="1" stop-color="#b9851a"/></linearGradient>
<radialGradient id="hWin" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#bfe7ff"/><stop offset="1" stop-color="#6fbde8"/></radialGradient>
<linearGradient id="hLight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a2410" stop-opacity=".22"/></linearGradient>
<linearGradient id="hAO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1800" stop-opacity=".0"/><stop offset="1" stop-color="#2a1800" stop-opacity=".28"/></linearGradient>
<linearGradient id="hEave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0f00" stop-opacity=".42"/><stop offset="1" stop-color="#1a0f00" stop-opacity="0"/></linearGradient>
<linearGradient id="hLedge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d2"/><stop offset="1" stop-color="#e2b46f"/></linearGradient>
<pattern id="hStone" width="34" height="15" patternUnits="userSpaceOnUse"><rect width="34" height="15" fill="url(#hFront)"/><path d="M0 14.5H34M17 0V7.5M0 7.5H34M0 7.5V15M34 7.5V15" stroke="#dcae6a" stroke-width="1"/></pattern>
<pattern id="hStoneS" width="23" height="15" patternUnits="userSpaceOnUse"><rect width="23" height="15" fill="#c9924f"/><path d="M0 14.5H23M11.5 0V7.5M0 7.5H23" stroke="#a87436" stroke-width="1"/></pattern>
</defs>`}
function scene(){let s=`<rect x="-500" width="${VW+1100}" height="${GY-6}" fill="url(#hSky)"/>
<g class="hsun"><g opacity=".35" fill="#fff8c8">${[0,1,2,3,4].map(k=>`<polygon points="318,30 ${80+k*48},${GY} ${104+k*48},${GY}"/>`).join('')}</g>
<circle cx="318" cy="30" r="40" fill="url(#hSun)"/><circle cx="318" cy="30" r="16" fill="#ffd54a"/></g>
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
  s+=`<g fill="#fff3d6">${Array.from({length:Math.floor((FW-16)/8)},(_,k)=>`<rect x="${FX+10+k*8}" y="${y+6}" width="5" height="4" rx="1"/>`).join('')}</g><rect x="${FX}" y="${y+10}" width="${FW}" height="1.2" fill="#c99a52"/>`;
  s+=`<rect x="${FX-1}" y="${y+6}" width="10" height="4" fill="url(#hGold)"/><rect x="${FX+FW-9}" y="${y+6}" width="10" height="4" fill="url(#hGold)"/>`;
  s+=`<rect x="${FX}" y="${y+11}" width="${FW}" height="4" fill="#8a5a2b" opacity=".1"/><rect x="${FX+FW-3}" y="${y}" width="3" height="${FH}" fill="#000" opacity=".12"/>`;
  s+=`<rect x="${FX}" y="${y}" width="${FW}" height="${FH}" fill="url(#hLight)"/><rect x="${FX}" y="${y+FH-16}" width="${FW}" height="16" fill="url(#hAO)"/>`;
  s+=side(i,`<rect y="${FH-20}" width="${DX}" height="20" fill="url(#hAO)"/><rect width="${DX}" height="${FH}" fill="#000" opacity=".10"/>`);
  if(i==0){const dx=FX+FW/2;
    s+=winF(FX+20,y+18)+winF(FX+FW-46,y+18)+
     `<path d="M${dx-19} ${GY} V${GY-34} a19 19 0 0 1 38 0 V${GY}Z" fill="url(#hGold)"/>
      <path d="M${dx-15} ${GY} V${GY-33} a15 15 0 0 1 30 0 V${GY}Z" fill="#8a4f22"/><line x1="${dx}" y1="${GY-48}" x2="${dx}" y2="${GY}" stroke="#5e3414" stroke-width="2"/>
      <circle cx="${dx-4}" cy="${GY-17}" r="2.2" fill="#ffd54a"/><circle cx="${dx+4}" cy="${GY-17}" r="2.2" fill="#ffd54a"/>
      <rect x="${dx-26}" y="${GY}" width="52" height="5" fill="#f4ede0"/><rect x="${dx-32}" y="${GY+5}" width="64" height="5" fill="#e3d8c4"/><rect x="${dx-26}" y="${GY}" width="52" height="1.2" fill="#fff"/>
      ${[dx-31,dx+25].map(x=>`<g><rect x="${x}" y="${GY-44}" width="6" height="44" fill="#fbf7ee"/><rect x="${x+4}" y="${GY-44}" width="2" height="44" fill="#d8cdb8"/><line x1="${x+2}" y1="${GY-42}" x2="${x+2}" y2="${GY-2}" stroke="#e6dccb" stroke-width=".8"/><rect x="${x-2}" y="${GY-48}" width="10" height="4" rx="1" fill="url(#hGold)"/><rect x="${x-1.5}" y="${GY-3}" width="9" height="3" fill="#e3d8c4"/></g>`).join('')}
      <path d="M${dx-28} ${GY-50} Q${dx} ${GY-66} ${dx+28} ${GY-50}" stroke="url(#hGold)" stroke-width="3" fill="none"/><circle cx="${dx}" cy="${GY-60}" r="2.6" fill="#fff6b0"/>`}
  else{s+=winF(FX+18,y+16)+winF(FX+FW/2-13,y+16)+winF(FX+FW-44,y+16)+
     `<rect x="${FX+FW/2-36}" y="${y+FH-14}" width="72" height="4" fill="url(#hGold)"/>${[0,1,2,3,4,5,6].map(k=>`<rect x="${FX+FW/2-34+k*11}" y="${y+FH-10}" width="3" height="10" fill="#e6c07a"/>`).join('')}<rect x="${FX+FW/2-38}" y="${y+FH-1}" width="76" height="3" fill="#c99a52"/>`}
  s+=`<rect x="${FX-2}" y="${y+7}" width="${FW+4}" height="9" fill="url(#hEave)" opacity=".55"/>`;
  s+=`<rect x="${FX-5}" y="${y-4}" width="${FW+10}" height="9" rx="1.5" fill="url(#hLedge)" stroke="#c99a52" stroke-width="1"/><rect x="${FX-5}" y="${y+3}" width="${FW+10}" height="2" fill="#a8742f" opacity=".5"/>`;
  s+=side(i,`<polygon points="-5,-4 ${DX},-4 ${DX},5 -5,5" fill="#d9a85e" stroke="#b98445" stroke-width="1"/><rect x="-5" y="3" width="${DX+5}" height="2" fill="#7a4f22" opacity=".5"/>`);
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
  return `<g class="${cls}"><rect x="${L+6}" y="${y}" width="${R-L-12}" height="14" fill="url(#hEave)"/><polygon points="${L},${y+1} ${R},${y+1} ${R+DX},${y+1+DY} ${L+DX*.2},${y+1}" fill="#000" opacity="0"/><polygon points="${M},${y-H} ${M+DX},${y-H+DY} ${R+DX},${y+DY} ${R},${y}" fill="url(#hRoofS)"/>
  ${[1,2,3,4].map(k=>`<line x1="${M+(R-M)*k/5}" y1="${y-H+H*k/5}" x2="${M+(R-M)*k/5+DX}" y2="${y-H+H*k/5+DY}" stroke="#0b5a32" stroke-width="1.2" opacity=".6"/>`).join('')}
  <polygon points="${L},${y} ${M},${y-H} ${R},${y}" fill="url(#hRoofF)" stroke="#0e6438" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="${L+18},${y-4} ${M},${y-H+16} ${R-18},${y-4}" fill="#f6e3b8"/>
  <polyline points="${L-1},${y+1} ${M},${y-H-1} ${R+1},${y+1}" fill="none" stroke="url(#hGold)" stroke-width="2.6" stroke-linejoin="round"/>
  <circle cx="${M}" cy="${y-24}" r="12" fill="#fff"/>${['#e2504a','#f2b632','#3fbf6f','#2f8fd0','#c45bd1','#ff8ac2','#13958c','#f2b632'].map((c,k)=>{const a1=k*Math.PI/4,a2=(k+1)*Math.PI/4;return `<path d="M${M} ${y-24} L${M+11*Math.cos(a1)} ${y-24+11*Math.sin(a1)} A11 11 0 0 1 ${M+11*Math.cos(a2)} ${y-24+11*Math.sin(a2)}Z" fill="${c}" opacity=".85"/>`}).join('')}<circle cx="${M}" cy="${y-24}" r="3.5" fill="#fff6b0"/><circle cx="${M}" cy="${y-24}" r="12" fill="none" stroke="url(#hGold)" stroke-width="3"/>
  <line x1="${M}" y1="${y-H}" x2="${M+DX}" y2="${y-H+DY}" stroke="url(#hGold)" stroke-width="4" stroke-linecap="round"/>
  <path d="M${M} ${y-H-2} q-9 -4 -7 -14 a9 9 0 0 0 14 0 q2 10 -7 14z" fill="url(#hGold)"/><circle cx="${M}" cy="${y-H-22}" r="3" fill="#ffd54a"/></g>`}
let HK=1;
function houseSVG(full,part,frac,withRoof,anim,look){
  const L=look||(window.Deco?Deco.myLook():{c:cs.n}),D=window.Deco,hasGift=g=>RANKS.some(r=>r.gift==g&&(L.c||0)>=r.at);
  // 🕌 من ربح المسجد: الصورة تتّسع لليمين ويقف المسجد الكبير بجانب البيت
  const MQ=String(L.i||'').split(',').includes('d_mosque'),MW=MQ?100:0,W=VW+MW,MM=VW+20;
  // الخلفية تمتدّ خارج حدود الصورة: إذا كان الإطار أعرض من الصورة لا تظهر حواف فارغة (ولا «نصّ ليل ونصّ نهار»)
  // 🌳 v9.3: البستان يوسّع الصورة لليسار (كما يوسّعها المسجد لليمين)
  const OW=full>0?orchW(L.u,L.ed):0;
  let s=`<svg viewBox="${-OW} 0 ${W+OW} ${VH}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">${defs()}<g><rect x="-500" y="-200" width="${W+1000}" height="201" fill="#8fd4ff"/><rect x="-500" width="${W+1000}" height="${VH}" fill="url(#hSky)"/><rect x="-500" y="${GY-20}" width="${W+1000}" height="20" fill="#a6e6ae"/><rect x="-500" y="${GY-6}" width="${W+1000}" height="${VH-GY+6}" fill="url(#hGrass)"/><rect x="-500" y="${GY+21}" width="${W+1000}" height="12" fill="#5fb3ee"/></g>${scene()}`;
  if(MQ)s+=`
    <path d="M${VW-2} ${GY-22} Q${VW+60} ${GY-36} ${VW+110} ${GY-22} T${W} ${GY-20} V${VH} H${VW-2}Z" fill="#a6e6ae"/>
    <rect x="${VW-3}" y="${GY-6}" width="${MW+3}" height="${VH-GY+6}" fill="url(#hGrass)"/>
    <path d="M${VW-4} ${GY+20} Q${VW+40} ${GY+14} ${VW+70} ${GY+21} T${W} ${GY+20} V${GY+34} Q${VW+60} ${GY+28} ${VW-4} ${GY+34}Z" fill="url(#hRiver)"/>
    <path d="M200 ${GY+8} H${MM-20} L${MM-14} ${GY} H${MM+14} L${MM+20} ${GY+8} V${GY+17} H200Z" fill="#f3dfb5" opacity=".95"/>
    <g transform="translate(${MM} ${GY}) scale(.8) translate(${-MM} ${-GY})">${mosqueParts(MM,GY)}</g>`;
  if(D)s+=D.svg(L,'back');
  if(hasGift('rainbow'))s+=`<g fill="none" stroke-width="7" opacity=".55">${['#e2504a','#f2b632','#ffe066','#3fbf6f','#2f8fd0','#7c4dc4'].map((c,k)=>`<path d="M-10 ${GY-10} A190 170 0 0 1 370 ${GY-10}" stroke="${c}" transform="translate(0 ${k*7}) scale(1 ${1-k*.03})"/>`).join('')}</g>`;
  const top=Math.max(full,part+1);
  // v8.7: البيت العالي كان نحيفًا جدًّا؛ نصغّر الطول كما كان لكن العرض أقل، فيصير البيت أعرض وأوضح (HKX)
  HK=top>=5?.66:top>=4?.8:1;const HKX=top>=5?.8:top>=4?.9:1,HCX=FX+FW/2+DX/2;if(HK<1)s+=`<g transform="translate(${HCX} ${GY}) scale(${HKX} ${HK}) translate(${-HCX} ${-GY})">`;
  // تجسيم: ظلّ ناعم خلف البيت كلّه يفصله عن الخلفية
  if(top>0)s+=`<defs><filter id="hDrop" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="5" dy="3" stdDeviation="3.5" flood-color="#1b3a2a" flood-opacity=".38"/></filter></defs>`;
  if(top>0)s+=`<ellipse cx="${FX+FW/2+DX/2}" cy="${fy(top-1)+FH*top/2-10}" rx="${FW/2+DX+40}" ry="${FH*top/2+60}" fill="url(#hHalo)"/>`;
  if(top>0)s+=`<ellipse cx="${FX+FW/2+DX/2}" cy="${GY+3}" rx="${FW/2+DX}" ry="9" fill="#2f7a45" opacity=".35"/><polygon points="${FX-4},${GY+1} ${FX-62},${GY+14} ${FX+FW-30},${GY+15} ${FX+FW+DX},${GY+4} ${FX+FW},${GY}" fill="#1d5a30" opacity=".22"/>`;
  const paint=D?D.paintFilter(L):'';const dt=Math.max(0,Math.min(4,L.dt|0))*(full>0?1:0);
  if(dt>=3)s+=`<defs><filter id="hOldF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${dt>=4?'.48 .4 .14 0 0 .4 .42 .14 0 0 .3 .32 .18 0 0 0 0 0 1 0':'.62 .3 .1 0 0 .3 .58 .1 0 0 .22 .26 .4 0 0 0 0 0 1 0'}"/></filter></defs><g filter="url(#hOldF)">`;
  if(full>0)s+=`<g filter="url(#hDrop)">`;
  if(paint)s+=`<g filter="${paint}">`;
  for(let i=0;i<full;i++)s+=floorFull(i,anim&&i==full-1?'fl-new':'');
  if(paint)s+='</g>';
  if(full>0)s+='</g>';
  if(dt)s+=dirtWalls(full,dt);
  if(dt>=3)s+='</g>';
  if(part>=0){s+=topSlab(part);s+=floorPart(part,frac)}
  if(withRoof&&full>0)s+=roof(full,anim?'fl-new':'');
  if(full>0)s+=[[FX+2,14],[FX+38,0],[FX+FW-38,0],[FX+FW-2,14]].filter(([x,w])=>true).map(([x])=>`<g><ellipse cx="${x}" cy="${GY+1}" rx="13" ry="8" fill="#2a8a4a"/><ellipse cx="${x-3}" cy="${GY-2}" rx="8" ry="5" fill="#3fbf6f"/><circle cx="${x+5}" cy="${GY-3}" r="1.6" fill="#fff"/></g>`).join('');
  if(hasGift('lanterns')&&full>0){const dx=FX+FW/2;s+=[dx-34,dx+34].map(x=>`<g><line x1="${x}" y1="${GY-56}" x2="${x}" y2="${GY-48}" stroke="#8a5a00" stroke-width="1.5"/><circle cx="${x}" cy="${GY-40}" r="11" fill="#ffe066" opacity=".45"/><rect x="${x-5}" y="${GY-48}" width="10" height="14" rx="3" fill="url(#hGold)" stroke="#8a5a00"/><rect x="${x-3}" y="${GY-45}" width="6" height="8" rx="2" fill="#fff6b0"/></g>`).join('')}
  if(hasGift('crown')&&withRoof&&full>0){const y=fy(full-1)-66-40,M=FX+FW/2;s+=`<g><circle cx="${M}" cy="${y+6}" r="22" fill="#ffe066" opacity=".35"/><path d="M${M-16} ${y+14} L${M-18} ${y-2} L${M-8} ${y+6} L${M} ${y-8} L${M+8} ${y+6} L${M+18} ${y-2} L${M+16} ${y+14}Z" fill="url(#hGold)" stroke="#9a6a00" stroke-width="1.5"/><circle cx="${M}" cy="${y+8}" r="2.6" fill="#e2504a"/><circle cx="${M-9}" cy="${y+10}" r="2" fill="#2f8fd0"/><circle cx="${M+9}" cy="${y+10}" r="2" fill="#3fbf6f"/></g>`}
  if(full>0)s+=`<g class="hyard">${yard(L.u,L.job,L.ed,L.fx)}</g>`;
  if(HK<1)s+='</g>';
  const OTOP2=OTOP;if(full>0&&ORCH)s+=`<g class="hyard horch" transform="${OTR}">${ORCH}</g>`;ORCH='';
  if(dt)s+=trashSVG(dt);
  if(MQ)s+=walkers(196,GY+15-192*.75,(MM-215)/.75,.75,'msq-walk');
  if(hasGift('flowers'))s+=[[FX-14,GY+2],[FX+10,GY+4],[FX+FW-6,GY+4],[FX+FW+DX-10,GY-2],[FX+FW+24,GY+2]].map(([x,y])=>`<g><ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="#2e9c55"/>${[[-6,-3,'#e2504a'],[1,-6,'#ff8ac2'],[7,-2,'#f2b632'],[-1,1,'#fff']].map(([a,b,c])=>`<circle cx="${x+a}" cy="${y+b}" r="2.8" fill="${c}"/>`).join('')}</g>`).join('');
  if(hasGift('fountain')){const x=0,y=0;s+=`<g transform="translate(${L.wide?-226:50} ${GY+14}) scale(1.5)"><ellipse cx="${x}" cy="${y}" rx="20" ry="6" fill="#bfc9cf" stroke="#8b979e"/><ellipse cx="${x}" cy="${y-1}" rx="16" ry="4" fill="#7cc8ff"/><rect x="${x-2.5}" y="${y-22}" width="5" height="21" fill="#bfc9cf"/><ellipse cx="${x}" cy="${y-22}" rx="9" ry="3" fill="#bfc9cf"/><path d="M${x} ${y-24} q-10 -12 -14 4 M${x} ${y-24} q10 -12 14 4 M${x} ${y-24} v-10" stroke="#7cc8ff" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`}
  if(D)s+=D.svg(L,'front',full,withRoof);
  if(full>0&&YTOP){const HCX=FX+FW/2+DX/2,HKX=top>=5?.8:top>=4?.9:1;s+=HK==1?YTOP:`<g transform="translate(${HCX} ${GY}) scale(${HKX} ${HK}) translate(${-HCX} ${-GY})">${YTOP}</g>`;YTOP=''}
  if(full>0&&OTOP2)s+=`<g transform="${OTR}">${OTOP2}</g>`;OTOP='';
  if(full==0&&part<0)s+=floorPart(0,0)+`<text x="${FX+FW/2}" y="${fy(0)-14}" text-anchor="middle" font-size="16" font-weight="800" fill="#3d5a4a" font-family="Tajawal,sans-serif">هنا سيُبنى بيتك</text>`;
  // معرّفات فريدة لكل رسمة: إذا تكرّرت ووقعت الأولى في شاشة مخفية تختفي الألوان من الباقي
  const k=++svgN;return (s+'</svg>').replace(/(id="|url\(#)(h[A-Z]\w*)/g,`$1$2_${k}`)}
let svgN=0;
/* 🧱 الفناء (v8.2): السور والحديقة والأشجار أمام البيت، وكلّ جزء يُلمَس وحده (data-up). u = «سور حديقة شجرة١ شجرة٢ شجرة٣» */
const YFY=GY+13,YXL=FX-50,YXR=FX+FW+DX+4,YCX=FX+FW/2,YTS=[[58,GY+6],[232,GY+7],[306,GY-3]],YFR=['#e2504a','#c2185b','#f39c12'];
const YXL0=YXL,YXR0=YXR,YCX0=YCX,YTS0=YTS;
function ySeg(x1,y1,x2,y2,lv){const d=Math.hypot(x2-x1,y2-y1);let s='';
  if(lv==1){const n=Math.max(2,Math.round(d/8));s+=`<line x1="${x1}" y1="${y1-4}" x2="${x2}" y2="${y2-4}" stroke="#8a5a2b" stroke-width="1.6"/><line x1="${x1}" y1="${y1-8.5}" x2="${x2}" y2="${y2-8.5}" stroke="#8a5a2b" stroke-width="1.6"/>`;
    for(let k=0;k<=n;k++){const x=x1+(x2-x1)*k/n,y=y1+(y2-y1)*k/n;s+=`<path d="M${x-1.7} ${y} V${y-10} L${x} ${y-12.5} L${x+1.7} ${y-10} V${y}Z" fill="#c08a4c" stroke="#7a4f22" stroke-width=".6"/>`}}
  else if(lv==2){s+=`<polygon points="${x1},${y1} ${x2},${y2} ${x2},${y2-9} ${x1},${y1-9}" fill="#bdb6a8" stroke="#857d6f" stroke-width=".8"/><polygon points="${x1},${y1-9} ${x2},${y2-9} ${x2},${y2-11} ${x1},${y1-11}" fill="#9a9284"/>`;
    const n=Math.max(2,Math.round(d/10));for(let k=1;k<n;k++){const x=x1+(x2-x1)*k/n,y=y1+(y2-y1)*k/n;s+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y-4.5}" stroke="#857d6f" stroke-width=".7"/><line x1="${x+5*(x2-x1)/d}" y1="${y-4.5+5*(y2-y1)/d}" x2="${x+5*(x2-x1)/d}" y2="${y-9+5*(y2-y1)/d}" stroke="#857d6f" stroke-width=".7"/>`}
    s+=`<line x1="${x1}" y1="${y1-4.5}" x2="${x2}" y2="${y2-4.5}" stroke="#857d6f" stroke-width=".7"/>`}
  else if(lv>=3){s+=`<polygon points="${x1},${y1} ${x2},${y2} ${x2},${y2-10} ${x1},${y1-10}" fill="#fbf7ee" stroke="#d8cdb8" stroke-width=".8"/><polygon points="${x1},${y1-10} ${x2},${y2-10} ${x2},${y2-12.5} ${x1},${y1-12.5}" fill="url(#hGold)"/>`;
    const n=Math.max(1,Math.round(d/28));for(let k=0;k<=n;k++){const x=x1+(x2-x1)*k/n,y=y1+(y2-y1)*k/n;s+=`<rect x="${x-2.5}" y="${y-15}" width="5" height="15" fill="#fffaf0" stroke="#d8cdb8" stroke-width=".6"/><circle cx="${x}" cy="${y-16.5}" r="2.4" fill="url(#hGold)"/>`}
    s+=`<path d="M${x1} ${y1-5} L${x2} ${y2-5}" stroke="#e9dcc0" stroke-width=".8" stroke-dasharray="3 3"/>`}
  return s}
// v8.5: الدائرة الصفراء نفسها تُلمَس (كانت خارج data-up فلا يحدث شيء)، وأكبر، وتبقى مضيئة في الليل
function yMark(x,y,plus,p){return `<g data-up="${p}"><circle cx="${x}" cy="${y}" r="18" fill="#000" opacity="0"/><g class="bn-mk"><circle cx="${x}" cy="${y}" r="14" fill="#ffe066" opacity=".45"/><circle cx="${x}" cy="${y}" r="11" fill="#ffd21f" stroke="#fff" stroke-width="2.2"/><text x="${x}" y="${y+5.5}" text-anchor="middle" font-size="16" font-weight="900" fill="#7a4f00" font-family="Tajawal,sans-serif">${plus?'+':'⬆'}</text></g></g>`}
// عامل بلا ملامح: role = hammer (يطرق) | walk (يمشي رايح جاي شايل طابوقة) | cheer (يقفز فرحًا بعد الانتهاء)
function yWorker(x,y,k=1,role='hammer'){
  const legs=`<rect x="-3" y="-6" width="2.2" height="6" rx="1" fill="#3d4a5a"/><rect x=".8" y="-6" width="2.2" height="6" rx="1" fill="#3d4a5a"/>`;
  const body=`<path d="M-4.5 -6 L-4 -14 Q0 -16 4 -14 L4.5 -6Z" fill="#f28c28"/><rect x="-4" y="-12" width="8" height="1.6" fill="#ffe066"/><circle cx="0" cy="-18" r="3.6" fill="#f1c7a0"/>
    <path d="M-4.2 -18.4 a4.2 4 0 0 1 8.4 0 z" fill="#ffd21f" stroke="#c9a000" stroke-width=".5"/><rect x="-5" y="-18.8" width="10" height="1.2" rx=".6" fill="#ffd21f"/>`;
  let arms='';
  if(role=='hammer')arms=`<g class="bn-hm"><line x1="3.5" y1="-12" x2="9" y2="-17" stroke="#f1c7a0" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="-17" x2="9" y2="-23" stroke="#7a4f22" stroke-width="1.3"/><rect x="6.5" y="-25" width="5" height="3" rx=".6" fill="#6b7680"/></g>`;
  if(role=='walk')arms=`<line x1="-3" y1="-13" x2="-5" y2="-20" stroke="#f1c7a0" stroke-width="1.8" stroke-linecap="round"/><line x1="3" y1="-13" x2="5" y2="-20" stroke="#f1c7a0" stroke-width="1.8" stroke-linecap="round"/><rect x="-6.5" y="-25" width="13" height="5" rx="1" fill="#c0563b" stroke="#8a3a26" stroke-width=".6"/><line x1="0" y1="-25" x2="0" y2="-20" stroke="#8a3a26" stroke-width=".5"/>`;
  if(role=='cheer')arms=`<line x1="-3.5" y1="-13" x2="-7" y2="-22" stroke="#f1c7a0" stroke-width="1.8" stroke-linecap="round"/><line x1="3.5" y1="-13" x2="7" y2="-22" stroke="#f1c7a0" stroke-width="1.8" stroke-linecap="round"/>`;
  const inner=`<g class="${role=='cheer'?'bn-jump':'bn-bob'}">${legs}${body}${arms}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${k})">${role=='walk'?`<g class="bn-walk">${inner}</g>`:inner}</g>`}
function yBricks(x,y){return `<g>${[[0,0],[7,0],[3.5,-4]].map(([a,b])=>`<rect x="${x+a}" y="${y+b-4}" width="7" height="4" rx=".6" fill="#c0563b" stroke="#8a3a26" stroke-width=".6"/>`).join('')}</g>`}
function ySpark(x,y){return [[-14,-10],[12,-16],[-6,-24],[16,-4],[0,-32],[-18,-20]].map(([a,b],i)=>`<g class="bn-spk" style="animation-delay:${i*.15}s"><path d="M${x+a} ${y+b-4} l1.2 2.8 l2.8 1.2 l-2.8 1.2 l-1.2 2.8 l-1.2 -2.8 l-2.8 -1.2 l2.8 -1.2z" fill="#ffd54a"/></g>`).join('')}
function yReady(x,y,p){return `<g data-up="${p}" class="bn-rdy"><circle cx="${x}" cy="${y}" r="13" fill="#000" opacity="0"/><circle cx="${x}" cy="${y}" r="10" fill="#1fa463" stroke="#fff" stroke-width="2"/><path d="M${x-4.5} ${y} l3 3.2 l6 -6.4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="${x-17}" y="${y+11}" width="34" height="11" rx="5.5" fill="#fffbe9" stroke="#1fa463" stroke-width="1"/><text x="${x}" y="${y+19}" text-anchor="middle" font-size="7.5" font-weight="900" fill="#0b5a32" font-family="Tajawal,sans-serif">استلم ✔</text></g>`}
function yDust(x,y){return `<g class="bn-dust"><circle cx="${x}" cy="${y}" r="3" fill="#e7d9bf" opacity=".8"/><circle cx="${x+3}" cy="${y-2}" r="2.2" fill="#efe4cf" opacity=".8"/></g>`}
function ySign(x,y,w=44){return `<g><line x1="${x}" y1="${y+7}" x2="${x}" y2="${y+16}" stroke="#7a4f22" stroke-width="1.4"/><rect x="${x-w/2}" y="${y-8}" width="${w}" height="16" rx="4" fill="#fffbe9" stroke="#e0a21b" stroke-width="1.2"/>
  <text data-timer="1" x="${x}" y="${y+2.4}" text-anchor="middle" font-size="8.5" font-weight="900" fill="#7a4f00" font-family="Tajawal,sans-serif">⏳</text>
  <rect x="${x-w/2+3}" y="${y+4.2}" width="${w-6}" height="2.2" rx="1" fill="#f2e5c3"/><rect data-tbar="${w-6}" x="${x-w/2+3}" y="${y+4.2}" width="0" height="2.2" rx="1" fill="#2f8fd0"/></g>`}
function yTree(i,lv,ed,canPlant,ts=YTS,tk=1.65){const [x,y]=ts[i],c=YFR[i];let s=`<g data-up="t${i}"><g transform="translate(${x} ${y}) scale(${tk}) translate(${-x} ${-y})"><circle cx="${x}" cy="${y-12}" r="15" fill="#000" opacity="0"/>`;
  if(lv==0&&ed&&canPlant)s+=`<ellipse cx="${x}" cy="${y}" rx="8" ry="2.8" fill="#8a5a2b"/><ellipse cx="${x}" cy="${y-.8}" rx="5" ry="1.6" fill="#a8742a"/>`;
  if(lv==1)s+=`<ellipse cx="${x}" cy="${y}" rx="6" ry="2" fill="#7a4f22" opacity=".5"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y-9}" stroke="#5e8f2e" stroke-width="1.4"/><path d="M${x} ${y-7} q-6 -3 -6 -7 q5 1 6 6z M${x} ${y-8} q6 -3 6 -7 q-5 1 -6 6z" fill="#3fbf6f"/>`;
  if(lv==2)s+=`<ellipse cx="${x}" cy="${y+.5}" rx="9" ry="2.6" fill="#2f7a45" opacity=".35"/><rect x="${x-1.6}" y="${y-13}" width="3.2" height="13" rx="1" fill="#8a5a2b"/><circle cx="${x}" cy="${y-19}" r="9" fill="#2fae5f"/><circle cx="${x-3}" cy="${y-22}" r="4" fill="#5fd48a" opacity=".7"/>`;
  if(lv>=3)s+=`<ellipse cx="${x}" cy="${y+.5}" rx="13" ry="3.4" fill="#2f7a45" opacity=".35"/><rect x="${x-2.2}" y="${y-17}" width="4.4" height="17" rx="1.4" fill="#7a4f22"/><circle cx="${x-7}" cy="${y-22}" r="8" fill="#239a52"/><circle cx="${x+7}" cy="${y-22}" r="8" fill="#239a52"/><circle cx="${x}" cy="${y-29}" r="10" fill="#2fae5f"/><circle cx="${x-4}" cy="${y-32}" r="4.5" fill="#5fd48a" opacity=".6"/>
    ${[[-8,-20],[6,-18],[-2,-27],[8,-27],[-9,-29],[2,-21]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="2.1" fill="${c}" stroke="#fff" stroke-width=".4"/>`).join('')}`;
  return s+'</g></g>'}
/* 🌳 v9.3: البستان — الحديقة والأشجار صارت بستانًا واضحًا على يسار البيت (مثل المسجد على يمينه)، لا يصغر مع طوابق البيت.
   السور يبقى أمام البيت. يظهر البستان في بيت الطفل دائمًا (أرض فارغة ودائرة +) وعند الأصدقاء إذا زرعه. */
const OX0=-114,OX1=-8,OCX=(OX0+OX1)/2,OTS=[[-95,GY-5],[-61,GY-9],[-27,GY-5]],OTK=1.8;
// البستان يُكبَّر ١٫٤ مرة حول طرفه الأيمن السفلي حتى يكون واضحًا مثل المسجد
const OK=1.4,OTR=`translate(-6 ${GY+13}) scale(${OK}) translate(6 ${-GY-13})`;
const orchW=(u,ed)=>{u=/^[0-3]{5,6}$/.test(u||'')?u:'00000';return (+u[1]>=1||ed)?185:0};
// الدوائر الصفراء وشارة «استلم» تُرسم في آخر الصورة (فوق الزينة): YTOP للسور (داخل مقياس البيت) و OTOP للبستان
let YTOP='',OTOP='',ORCH='';
function yard(u,job,ed,fx){YTOP='';OTOP='';ORCH='';if(job&&job.p=='hp')job=null;if(fx&&fx.p=='hp')fx=null; /* v15.2: المستشفى يُرسم في المدينة المجسّمة فقط */const YXL=YXL0,YXR=YXR0,YCX=YCX0;
  u=/^[0-3]{5,6}$/.test(u||'')?u:'00000';const w=+u[0],g=+u[1],T=[+u[2],+u[3],+u[4]];
  const busy=!!(job&&!job.ready),rdy=!!(job&&job.ready),pop=(p,html)=>fx&&fx.p==p?`<g class="bn-pop">${html}</g>`:html;
  // ---------- البستان ----------
  let O='';const GF=GY+13,GB=GY-9;
  if(g>=1||ed){
    const poly=`${OX0},${GF} ${OX1},${GF} ${OX1-7},${GB} ${OX0+7},${GB}`;
    let G=`<g data-up="g"><polygon points="${poly}" fill="#000" opacity="0"/>`;
    if(g==0)G+=`<polygon points="${poly}" fill="#a8742a" opacity=".45"/><polygon points="${poly}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 3"/>`
      +[0,1,2].map(k=>`<line x1="${OX0+10}" y1="${GB+5+k*6}" x2="${OX1-10}" y2="${GB+5+k*6}" stroke="#8a5a2b" stroke-width="1" opacity=".45"/>`).join('');
    if(g>=1){G+=`<polygon points="${poly}" fill="#4fbf68"/><polygon points="${OX0+4},${GF-3} ${OX1-4},${GF-3} ${OX1-9},${GB+3} ${OX0+9},${GB+3}" fill="#6fd47f" opacity=".55"/>`;
      // سياج شجيرات حول البستان
      for(let x=OX0+3;x<=OX1-3;x+=9)G+=`<ellipse cx="${x}" cy="${GF}" rx="5.5" ry="4" fill="#2e9c55"/><circle cx="${x-1.5}" cy="${GF-1.5}" r="1.6" fill="#5fd48a" opacity=".8"/>`;
      for(let k=0;k<4;k++){const t=k/3;G+=`<ellipse cx="${OX0+t*7}" cy="${GF-t*(GF-GB)}" rx="4" ry="3.4" fill="#2a8a4a"/><ellipse cx="${OX1-t*7}" cy="${GF-t*(GF-GB)}" rx="4" ry="3.4" fill="#2a8a4a"/>`}}
    if(g>=2){// ورود ملوّنة وممرّ حجري في الوسط
      G+=Array.from({length:7},(_,k)=>`<ellipse cx="${OCX}" cy="${GF-2-k*3}" rx="${4.2-k*.25}" ry="1.5" fill="#e7e1d3" stroke="#b5ad9c" stroke-width=".5"/>`).join('');
      for(let x=OX0+9;x<OX1-8;x+=6){if(Math.abs(x-OCX)<7)continue;const k=Math.abs(Math.round(x*7))%4;G+=`<circle cx="${x}" cy="${GF-5}" r="2" fill="${['#e2504a','#ff8ac2','#f2b632','#fff'][k]}"/><circle cx="${x+3}" cy="${GB+4}" r="1.6" fill="${['#ff8ac2','#f2b632','#e2504a','#c45bd1'][k]}"/>`}}
    if(g>=3){// نافورة وفوانيس
      const fy0=GF-4;G+=`<g><ellipse cx="${OCX}" cy="${fy0}" rx="12" ry="4" fill="#cfd8dc" stroke="#90a4ae" stroke-width=".8"/><ellipse cx="${OCX}" cy="${fy0-.5}" rx="9.5" ry="2.7" fill="#7cc8ff"/><rect x="${OCX-1.3}" y="${fy0-12}" width="2.6" height="11" fill="#cfd8dc"/>
        <path d="M${OCX} ${fy0-12} q-6 -7 -10 2 M${OCX} ${fy0-12} q6 -7 10 2" stroke="#9fdcff" stroke-width="1.5" fill="none" class="hwv"/></g>`;
      G+=[[OX0+3,GF-2],[OX1-3,GF-2],[OX0+9,GB+1],[OX1-9,GB+1]].map(([x,y])=>`<g><rect x="${x-.8}" y="${y-13}" width="1.6" height="13" fill="#6b5a3a"/><circle cx="${x}" cy="${y-15}" r="5.5" fill="#ffe066" opacity=".4" class="dk-tw"/><rect x="${x-2.2}" y="${y-17}" width="4.4" height="4.4" rx="1" fill="#ffd54a" stroke="#b9851a" stroke-width=".5"/></g>`).join('')}
    // لوحة «بستاني»
    const SIGN=`<g><line x1="${OX0+6}" y1="${GF+4}" x2="${OX0+6}" y2="${GF-10}" stroke="#7a4f22" stroke-width="1.6"/><rect x="${OX0-11}" y="${GF-22}" width="34" height="13" rx="3" fill="#fffbe9" stroke="#8a5a2b" stroke-width="1"/><text x="${OX0+6}" y="${GF-12.5}" text-anchor="middle" font-size="8" font-weight="900" fill="#2a6a3a" font-family="Tajawal,sans-serif">🌳 بستاني</text></g>`;
    G+='</g>';O+=pop('g',G);
    // الأشجار
    T.forEach((lv,i)=>{O+=pop('t'+i,yTree(i,lv,ed,g>=1,OTS,OTK))});O+=SIGN}
  // ---------- السور: أمامي بفتحة الباب + جانبان ----------
  let s='';
  let Wl=`<g data-up="w" transform="translate(0 ${YFY}) scale(1 1.55) translate(0 ${-YFY})"><rect x="${YXL-4}" y="${YFY-16}" width="${YXR-YXL+8}" height="19" fill="#000" opacity="0"/>`;
  const segs=[[YXL+20,YFY-14,YXL,YFY],[YXL,YFY,YCX-23,YFY],[YCX+23,YFY,YXR,YFY],[YXR,YFY,YXR+24,YFY-14]];
  if(w==0&&ed)Wl+=`<polyline points="${YXL+20},${YFY-14} ${YXL},${YFY} ${YCX-23},${YFY}" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 3"/><polyline points="${YCX+23},${YFY} ${YXR},${YFY} ${YXR+24},${YFY-14}" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 3"/>`;
  if(w>=1){Wl+=segs.map(([a,b,c,d])=>ySeg(a,b,c,d,w)).join('');
    const ph=w==1?14:w==2?13:17,pc=w==1?'#8a5a2b':w==2?'#857d6f':'#fffaf0';Wl+=[YCX-24,YCX+21].map(x=>`<rect x="${x}" y="${YFY-ph}" width="3.4" height="${ph}" fill="${pc}" stroke="${w>=3?'#d8cdb8':'none'}" stroke-width=".6"/>${w>=3?`<circle cx="${x+1.7}" cy="${YFY-ph-2}" r="2.6" fill="url(#hGold)"/><circle cx="${x+1.7}" cy="${YFY-ph-8}" r="4" fill="#ffe066" opacity=".35"/>`:''}`).join('')}
  Wl+='</g>';s+=pop('w',Wl);
  // ---------- العمّال واللوحات والدوائر ----------
  const inO=p=>p!='w';
  const spots=p=>{if(p=='w')return [[YXL+16,YFY+4],[YCX-52,YFY+4],[YCX+44,YFY+4]];if(p=='g')return [[OX0+8,GY+17],[OCX+4,GY+18],[OX1-6,GY+17]];const [x,y]=OTS[+p[1]];return [[x-15,y+5],[x+9,y+7],[x+17,y+4]]};
  const signAt=p=>p=='w'?[YXL+44,YFY-44]:p=='g'?[OCX,GY-58]:[OTS[+p[1]][0],OTS[+p[1]][1]-70];
  const put=(p,html)=>{if(inO(p))O+=html;else s+=html},putTop=(p,html)=>{if(inO(p))OTOP+=html;else YTOP+=html};
  if(busy){const p=job.p,n=Math.max(1,Math.min(3,job.to|0)),P=spots(p);
    put(p,yBricks(P[0][0]-16,P[0][1])+P.slice(0,n).map(([x,y],i)=>(i==1?'':yDust(x+10,y-4))+yWorker(x,y,1.6,i==1?'walk':'hammer')).join(''));
    const [sx,sy]=signAt(p);put(p,ySign(sx,sy,50))}
  else if(rdy){const p=job.p,n=Math.max(1,Math.min(3,job.to|0)),P=spots(p);
    put(p,P.slice(0,n).map(([x,y],i)=>`<g style="animation-delay:${i*.2}s">${yWorker(x,y,1.6,'cheer')}</g>`).join(''));
    const [sx,sy]=signAt(p);putTop(p,yReady(sx,sy+6,p))}
  else if(ed){if(w<3)YTOP+=yMark(YXL+60,YFY-26,w==0,'w');
    if(g<3)OTOP+=yMark(OCX-20,GF+6,g==0,'g');
    if(g>=1)T.forEach((lv,i)=>{if(lv<3){const [x,y]=OTS[i];OTOP+=yMark(x+13,y-(lv==2?54:lv==1?30:16),lv==0,'t'+i)}})}
  if(fx){if(fx.p=='w')s+=ySpark(YCX-60,YFY)+ySpark(YCX+70,YFY-6);else{const [x,y]=fx.p=='g'?[OCX,GY+6]:OTS[+fx.p[1]];O+=ySpark(x,y)+ySpark(x+4,y-6)}}
  ORCH=O;return s}

/* 🕌 المسجد الكبير (v7.9): يُرسم بجانب البيت إذا ربحه الطفل (d_mosque)، فيراه الأصدقاء أيضًا. وأهل الحيّ يمشون إليه بلا ملامح وجه. */
const SKIN='#f1c7a0';
// شخص بلا ملامح: x,y = موضع القدمين، h = الطول، o = الشكل
function person(x,y,h,o){const k=h/34,hd=4.6*k,top=y-h,lg=`<g class="msq-lg"><rect x="${x-3.2*k}" y="${y-6*k}" width="${2.4*k}" height="${6*k}" rx="${k}" fill="${o.leg||'#5b4636'}"/><rect x="${x+0.8*k}" y="${y-6*k}" width="${2.4*k}" height="${6*k}" rx="${k}" fill="${o.leg||'#5b4636'}"/></g>`;
  const robe=`<path d="M${x-4.5*k} ${top+2*hd+1} Q${x} ${top+2*hd-1} ${x+4.5*k} ${top+2*hd+1} L${x+(o.w||7)*k} ${y-5*k} Q${x} ${y-3.5*k} ${x-(o.w||7)*k} ${y-5*k}Z" fill="${o.c}" stroke="${o.s||'rgba(0,0,0,.18)'}" stroke-width="${.8*k}"/>`;
  let head=`<circle cx="${x}" cy="${top+hd}" r="${hd}" fill="${SKIN}"/>`;
  if(o.hat=='cap')head+=`<path d="M${x-hd} ${top+hd-.6} a${hd} ${hd*.9} 0 0 1 ${2*hd} 0z" fill="#fff" stroke="#ddd" stroke-width=".6"/>`;
  if(o.hat=='turban')head+=`<path d="M${x-hd-.6} ${top+hd-.2} a${hd+.6} ${hd*1.05} 0 0 1 ${2*hd+1.2} 0z" fill="${o.t||'#fff'}"/><rect x="${x-hd-.6}" y="${top+hd-1.2}" width="${2*hd+1.2}" height="1.6" rx=".8" fill="${o.t2||'#e8e1d0'}"/>`;
  if(o.hat=='hijab')head=`<path d="M${x-hd-1.4} ${top+2*hd+2} Q${x-hd-1.8} ${top-1} ${x} ${top-.8} Q${x+hd+1.8} ${top-1} ${x+hd+1.4} ${top+2*hd+2}Z" fill="${o.t}"/><ellipse cx="${x}" cy="${top+hd+.6}" rx="${hd*.62}" ry="${hd*.78}" fill="${SKIN}"/>`;
  const cane=o.cane?`<line x1="${x+6*k}" y1="${top+2*hd+5*k}" x2="${x+9*k}" y2="${y}" stroke="#7a4f22" stroke-width="${1.3*k}" stroke-linecap="round"/>`:'';
  return `<g>${lg}${robe}${head}${cane}</g>`}
// مجموعات تمشي من اليسار إلى باب المسجد، كل واحدة بتأخير مختلف حتى لا ينقطع الطريق
const MGROUPS=[
  // أبٌ يمسك يد ابنه
  ()=>person(14,192,36,{c:'#fbfbf6',hat:'cap'})+`<line x1="20" y1="174" x2="27" y2="178" stroke="${SKIN}" stroke-width="2" stroke-linecap="round"/>`+person(31,193,22,{c:'#3f8fd8',hat:'cap'}),
  // جدٌّ بعصاه وحفيده
  ()=>person(14,191,34,{c:'#d9cfb8',hat:'turban',t:'#fff',cane:1})+person(36,193,20,{c:'#2fae5f',hat:'cap'}),
  // أمٌّ وابنتها
  ()=>person(14,192,33,{c:'#2b2b38',hat:'hijab',t:'#2b2b38',w:8,leg:'#2b2b38'})+person(32,193,21,{c:'#f08ab6',hat:'hijab',t:'#fff',leg:'#c25b8a'}),
  // صديقان مسرعان
  ()=>person(14,193,23,{c:'#f2a33a',hat:'cap'})+person(32,193,22,{c:'#7c5ac8',hat:'cap'}),
  // شابّ وحده
  ()=>person(14,192,35,{c:'#e9eef2',hat:'turban',t:'#fff'})];
function mosqueParts(M,g){return `<defs>
  <linearGradient id="hMbWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#ecd7ae"/></linearGradient>
  <linearGradient id="hMbSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6e6c4"/><stop offset="1" stop-color="#e2c48e"/></linearGradient>
  <radialGradient id="hMbDome" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#7fe0b0"/><stop offset=".5" stop-color="#1fa463"/><stop offset="1" stop-color="#0b5a32"/></radialGradient>
  <linearGradient id="hMbGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".5" stop-color="#f2b632"/><stop offset="1" stop-color="#b9851a"/></linearGradient>
  <linearGradient id="hMbWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc3f0"/><stop offset="1" stop-color="#2c6f9e"/></linearGradient>
</defs>
  <!-- ظل -->
  <ellipse cx="${M}" cy="${g+2}" rx="100" ry="7" fill="#2f7a45" opacity=".28"/>
  <!-- المنارتان -->
  ${[M-98,M+82].map(x=>`<g><rect x="${x}" y="${g-150}" width="16" height="150" fill="url(#hMbWall)" stroke="#d9a85e" stroke-width="1.2"/><rect x="${x+11}" y="${g-150}" width="5" height="150" fill="#000" opacity=".06"/>
    <rect x="${x-3}" y="${g-112}" width="22" height="6" rx="2" fill="url(#hMbGold)"/><rect x="${x-3}" y="${g-62}" width="22" height="5" rx="2" fill="url(#hMbGold)"/>
    <path d="M${x+4} ${g-96} a4 6 0 0 1 8 0v10h-8z" fill="url(#hMbWin)"/><path d="M${x+4} ${g-44} a4 6 0 0 1 8 0v10h-8z" fill="url(#hMbWin)"/>
    <path d="M${x-1} ${g-150} Q${x+8} ${g-178} ${x+17} ${g-150}Z" fill="url(#hMbDome)" stroke="#0b5a32" stroke-width="1"/>
    <line x1="${x+8}" y1="${g-170}" x2="${x+8}" y2="${g-180}" stroke="#b9851a" stroke-width="1.8"/><path d="M${x+8} ${g-190} a5 5 0 1 0 4 7 a3.8 3.8 0 1 1 -4 -7z" fill="url(#hMbGold)"/></g>`).join('')}
  <!-- البناء الأساسي -->
  <rect x="${M-80}" y="${g-72}" width="160" height="72" fill="url(#hMbWall)" stroke="#d9a85e" stroke-width="1.4"/>
  <polygon points="${M+80},${g-72} ${M+82},${g-72} ${M+82},${g} ${M+80},${g}" fill="url(#hMbSide)"/>
  <rect x="${M-82}" y="${g-76}" width="164" height="7" rx="2" fill="url(#hMbGold)"/>
  <g fill="url(#hMbGold)">${Array.from({length:16},(_,k)=>`<path d="M${M-78+k*10} ${g-76} l5 -6 l5 6z"/>`).join('')}</g>
  <!-- الأسطوانة والقبّة الكبيرة -->
  <rect x="${M-40}" y="${g-96}" width="80" height="22" fill="url(#hMbWall)" stroke="#d9a85e" stroke-width="1.2"/>
  <g fill="url(#hMbWin)">${[-28,-12,4,20].map(d=>`<path d="M${M+d} ${g-78} v-9 a4 4 0 0 1 8 0 v9z"/>`).join('')}</g>
  <path d="M${M-46} ${g-95} C${M-52} ${g-140} ${M-12} ${g-150} ${M} ${g-172} C${M+12} ${g-150} ${M+52} ${g-140} ${M+46} ${g-95}Z" fill="url(#hMbDome)" stroke="#0b5a32" stroke-width="1.4"/>
  <path d="M${M-30} ${g-110} Q${M-28} ${g-138} ${M-8} ${g-150}" stroke="#fff" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
  <rect x="${M-48}" y="${g-98}" width="96" height="5" rx="2" fill="url(#hMbGold)"/>
  <line x1="${M}" y1="${g-172}" x2="${M}" y2="${g-184}" stroke="#b9851a" stroke-width="2.4"/><circle cx="${M}" cy="${g-178}" r="3" fill="url(#hMbGold)"/>
  <path d="M${M} ${g-200} a9 9 0 1 0 7 12 a7 7 0 1 1 -7 -12z" fill="url(#hMbGold)" class="msq-tw"/>
  <!-- الشبابيك -->
  ${[M-62,M-42,M+30,M+50].map(x=>`<path d="M${x} ${g-22} v-22 a6 7 0 0 1 12 0 v22z" fill="url(#hMbWin)" stroke="url(#hMbGold)" stroke-width="1.4"/><line x1="${x+6}" y1="${g-50}" x2="${x+6}" y2="${g-22}" stroke="#fff" stroke-width="1" opacity=".7"/>`).join('')}
  <!-- الباب الكبير -->
  <path d="M${M-20} ${g} V${g-38} Q${M} ${g-64} ${M+20} ${g-38} V${g}Z" fill="#fff4d6" stroke="url(#hMbGold)" stroke-width="2.4"/>
  <path d="M${M-14} ${g} V${g-34} Q${M} ${g-54} ${M+14} ${g-34} V${g}Z" fill="#8a4f22"/>
  <line x1="${M}" y1="${g-48}" x2="${M}" y2="${g}" stroke="#5e3414" stroke-width="1.6"/><circle cx="${M-4}" cy="${g-18}" r="1.8" fill="#ffd54a"/><circle cx="${M+4}" cy="${g-18}" r="1.8" fill="#ffd54a"/>
  <rect x="${M-24}" y="${g}" width="48" height="4" fill="#f4ede0"/><rect x="${M-28}" y="${g+4}" width="56" height="4" fill="#e3d8c4"/>
  <!-- فوانيس -->
  ${[M-30,M+26].map(x=>`<g class="msq-tw"><line x1="${x+2}" y1="${g-58}" x2="${x+2}" y2="${g-52}" stroke="#8a5a00" stroke-width="1"/><circle cx="${x+2}" cy="${g-45}" r="8" fill="#ffe066" opacity=".45"/><rect x="${x-1.5}" y="${g-52}" width="7" height="10" rx="2" fill="#ffd54a" stroke="#b9851a" stroke-width=".8"/></g>`).join('')}
`}
// المشاة: x0,y0 إزاحة، dist مسافة المشي، k الحجم، cls اسم الحركة
function walkers(x0,y0,dist,k,cls){return MGROUPS.map((f,i)=>`<g transform="translate(${x0} ${y0}) scale(${k})"><g class="${cls}" style="--wd:${dist}px;animation-delay:${-i*4.4}s"><g class="msq-bob">${f()}</g></g></g>`).join('')}

/* 🧹 الوسخ على الجدران: غبار (١)، بقع وسيلان (٢)، شقوق وخيوط عنكبوت (٣)، والبيت يصير قديمًا (٣–٤) */
function dirtWalls(full,dt){let s=`<g pointer-events="none">`;
  for(let i=0;i<full;i++){const y=fy(i);
    s+=`<rect x="${FX}" y="${y}" width="${FW}" height="${FH}" fill="#7a5a30" opacity="${.06+.06*dt}"/><polygon points="${FX+FW},${y} ${FX+FW+DX},${y+DY} ${FX+FW+DX},${y+FH+DY} ${FX+FW},${y+FH}" fill="#5e4220" opacity="${.08*dt}"/>`;
    if(dt>=2){s+=[[.18,.35,16,9],[.7,.6,20,10],[.45,.8,14,7],[.86,.25,10,8]].slice(0,dt).map(([a,b,rx,ry])=>`<ellipse cx="${FX+FW*a}" cy="${y+FH*b}" rx="${rx}" ry="${ry}" fill="#6b4a22" opacity=".22"/>`).join('');
      s+=[.22,.5,.78].map(a=>`<path d="M${FX+FW*a-3} ${y+44} q2 8 0 ${12+dt*2} q2 -6 4 0 q-1 -8 0 -${10+dt}" fill="#5e4220" opacity=".25"/>`).join('')}
    if(dt>=3)s+=`<polyline points="${FX+20+i*13},${y+8} ${FX+26+i*13},${y+18} ${FX+21+i*13},${y+27} ${FX+29+i*13},${y+38}" fill="none" stroke="#3d2a12" stroke-width="1.2" opacity=".6"/><polyline points="${FX+FW-30},${y+FH-6} ${FX+FW-36},${y+FH-16} ${FX+FW-31},${y+FH-24}" fill="none" stroke="#3d2a12" stroke-width="1.1" opacity=".55"/>`}
  if(dt>=3){const y=fy(full-1);s+=[[FX+2,y+2,1],[FX+FW-2,y+2,-1]].map(([x,yy,d])=>`<g stroke="#f4f4f4" stroke-width=".8" fill="none" opacity=".9">${[0,25,50,75].map(a=>{const r=a*Math.PI/180;return `<line x1="${x}" y1="${yy}" x2="${x+d*22*Math.cos(r)}" y2="${yy+22*Math.sin(r)}"/>`}).join('')}${[7,13,19].map(r=>`<path d="M${x+d*r} ${yy} Q${x+d*r*.8} ${yy+r*.5} ${x+d*r*.7} ${yy+r*.7} Q${x+d*r*.45} ${yy+r*.85} ${x} ${yy+r}"/>`).join('')}</g>`).join('')}
  return s+'</g>'}
/* 🗑️ النفايات أمام البيت: تكثر كلما زاد الوسخ */
function trashSVG(dt){const G0=GY;
  const bag=(x,y,c='#3a3f44')=>`<g><path d="M${x-9} ${y} Q${x-12} ${y-14} ${x-3} ${y-17} L${x+3} ${y-17} Q${x+12} ${y-14} ${x+9} ${y}Z" fill="${c}"/><path d="M${x-3} ${y-17} l-3 -5 M${x+3} ${y-17} l3 -5" stroke="${c}" stroke-width="2"/><path d="M${x-5} ${y-12} q3 2 1 7" stroke="#fff" stroke-width="1" fill="none" opacity=".3"/></g>`;
  const can=(x,y,c)=>`<g transform="rotate(${x%2?80:-70} ${x} ${y-3})"><rect x="${x-3}" y="${y-9}" width="6" height="9" rx="1.5" fill="${c}"/><rect x="${x-3}" y="${y-9}" width="6" height="1.6" fill="#ccc"/></g>`;
  const paper=(x,y)=>`<path d="M${x-5} ${y} l2 -6 l4 1 l3 -3 l2 5 l-3 3z" fill="#f5f5f0" stroke="#bbb" stroke-width=".7"/>`;
  const leaf=(x,y,r)=>`<path d="M${x} ${y} q5 -6 10 0 q-5 4 -10 0z" fill="#a8742a" transform="rotate(${r} ${x} ${y})" opacity=".9"/>`;
  const bottle=(x,y)=>`<g transform="rotate(-80 ${x} ${y})"><rect x="${x-2.5}" y="${y-12}" width="5" height="12" rx="2" fill="#4fae7a" opacity=".85"/><rect x="${x-1.2}" y="${y-15}" width="2.4" height="4" fill="#4fae7a"/></g>`;
  const items=[bag(FX-36,G0+14),paper(FX+40,G0+12),leaf(FX+FW+10,G0+6,-30),leaf(FX-20,G0+8,20),can(FX+60,G0+16,'#e2504a'),paper(FX+FW+30,G0+14),
    bag(FX+FW+44,G0+16,'#4a4f55'),can(FX-6,G0+18,'#2f8fd0'),bottle(FX+FW+18,G0+20),leaf(FX+52,G0+6,60),paper(FX-50,G0+20),bag(FX+FW+20,G0+10,'#2f3338')];
  let s=`<g pointer-events="none">${items.slice(0,dt*3).join('')}`;
  if(dt>=2)s+=`<g fill="#222">${[[FX-38,G0-6],[FX-30,G0-12],[FX+FW+46,G0-4]].slice(0,dt-1).map(([x,y],k)=>`<circle cx="${x}" cy="${y}" r="1.3"><animateTransform attributeName="transform" type="translate" values="0 0;${4-k*3} -3;-3 2;0 0" dur="${1.2+k*.3}s" repeatCount="indefinite"/></circle>`).join('')}</g>`;
  return s+'</g>'}

/* ---------- screen ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='bayt';
sec.innerHTML=`<div class="bar"><button class="back" id="byBack">›</button><div class="ttl">بيتي في الجنة 🏡</div></div><div id="byBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard baytcard';card.id='openBayt';
card.innerHTML=`<span class="cup">🏡</span><span><b>بيتي في الجنة</b><small id="baytLine"></small></span><span class="go">‹</span>`;
$('#openContest').after(card);
const updCard=()=>{const dtc=window.Aamal&&Aamal.dirt?Aamal.dirt():0;if(dtc&&bs.done){$('#baytLine').textContent='🧹 بيتك اتّسخ! نظّفه بأعمالك الصالحة';return}$('#baytLine').textContent=bs.done>=LEVELS.length?`قصرك خمسة طوابق! أفضل نتيجة: ${ar(bs.best)} نقطة 👑`:bs.done?`بيتك الآن ${['','طابق واحد','طابقان','ثلاثة طوابق','أربعة طوابق'][bs.done]}، أكمل البناء!`:'ابنِ بيتك في الجنة وزيّنه، وسابق أصدقاءك 🏁'};
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
function tilt3d(h){const sv=h&&h.querySelector('svg');if(!sv)return;sv.style.transition='transform .18s ease-out';sv.style.transformOrigin='50% 90%';
  const set=(rx,ry)=>{sv.style.transform=`perspective(700px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale(1.04)`};
  const mv=e=>{const r=h.getBoundingClientRect(),t=e.touches?e.touches[0]:e,x=(t.clientX-r.left)/r.width-.5,y=(t.clientY-r.top)/r.height-.5;set(-y*7,x*12)};
  h.addEventListener('pointermove',mv);h.addEventListener('pointerleave',()=>set(0,0));h.addEventListener('pointerup',()=>setTimeout(()=>set(0,0),500));
  const dev=e=>{if(!document.contains(h)){removeEventListener('deviceorientation',dev);return}if(e.gamma==null)return;set(Math.max(-5,Math.min(5,((e.beta||45)-50)/9)),Math.max(-9,Math.min(9,e.gamma/4)))};
  addEventListener('deviceorientation',dev,{passive:true})}
function menu(){G=null;clearTimeout(autoT);const B=$('#byBody');
  B.innerHTML=`<div class="bhouse">${houseSVG(bs.done,-1,0,true,false,window.Deco?Object.assign(Deco.myLook(),{ed:1}):undefined)}</div>
  ${rankBox()}
  <div class="bbest"><div><b>${ar(bs.done)} / ${ar(LEVELS.length)}</b><span>طوابق بيتك</span></div><div><b>${ar(bs.best)}</b><span>أفضل نتيجة ⭐</span></div></div>
  ${bs.done<LEVELS.length?`<button class="btn gold brace" id="byRace">▶️ ${bs.done?'أكمل الطوابق: '+LEVELS[bs.done].floor:'ابدأ '+LEVELS[0].floor}</button>`:''}
  <div class="blvg">${LEVELS.map((l,i)=>{const why=lockWhy(i),dn=i<bs.done;
    return `<button class="blv ${why?'locked':''}" data-lv="${i}"><span class="ic" style="background:${l.color}">${why?'🔒':l.icon}</span>
    <span><b>${l.floor}</b><small>${l.name}</small></span>
    <span class="mk">${dn?'⭐'.repeat(bs.stars[i]||1):why?'🔒':'▶️'}</span></button>`}).join('')}</div>
  <button class="link-btn" id="byHow" style="align-self:center;margin-top:10px">❓ كيف ألعب؟</button>`;
  $('#byHow').onclick=()=>modal(`<div style="font-size:46px">🏡</div><h3 style="margin:4px 0">كيف ألعب؟</h3><p class="bcap" style="text-align:right;line-height:1.9">المس الكلمة <b>التالية</b> بالترتيب قبل أن ينتهي الوقت ⏱️<br>الصحيح المتتابع يضاعف نقاطك 🔥 والنجمة الذهبية ⭐ تعطيك وقتًا إضافيًا.<br>الخطأ أو ترك الكلمة الصحيحة تسقط يهدم من بيتك!<br>🏆 كل نجمة جديدة تربحها في طابق = كأس.<br>▶️ زر «أكمل الطوابق» يأخذك إلى الطابق الذي لم تبنِه بعد.<br>واجمع كؤوسًا أكثر من «اختبر نفسك» و«مسابقة الأبطال».</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);
  {const r=$('#byRace');if(r)r.onclick=()=>{const t=B.querySelector('[data-lv="'+bs.done+'"]');if(t)t.click()}}
  if(window.Deco)Deco.menuHook(B);
  // v8.2: لا نُميل الصورة هنا حتى يلمس الطفل كلّ جزء من بيته وحده (السور، الحديقة، الأشجار)
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
/* 🔍 v8.6: البيت بالعرض. لمس صورة البيت (خارج السور/الحديقة/الأشجار) يفتحه على كامل الشاشة بالعرض،
   مع تكبير (أزرار + و −، أو إصبعين، أو لمستين) وسحب بالإصبع حتى تظهر الزينة والهدايا بوضوح.
   يحاول قفل الشاشة بالعرض، وإن لم يقدر الجهاز (آيفون مثلًا) يدير الصورة نفسها ٩٠ درجة. */
const wvCss=document.createElement('style');wvCss.textContent=`
.wv{position:fixed;inset:0;z-index:9000;background:#0d1a2e;touch-action:none;overflow:hidden}
.wv .wvr{position:absolute;left:0;top:0;width:100vw;height:100vh;display:flex;flex-direction:column}
.wv.rot .wvr{width:100vh;height:100vw;transform-origin:0 0;transform:translateX(100vw) rotate(90deg)}
.wv .wvs{flex:1;position:relative;overflow:hidden}
.wv .wvh{position:absolute;inset:0;border:0;border-radius:0}
.wv .wvh svg{width:100%;height:100%;transform-origin:0 0;will-change:transform}
.wv .wvbar{position:absolute;top:8px;left:8px;right:8px;display:flex;gap:8px;align-items:center;z-index:2;pointer-events:none}
.wv .wvbar b{flex:1;text-align:center;color:#fff;font-size:16px;text-shadow:0 2px 4px #000a}
.wv .wvb{pointer-events:auto;width:46px;height:46px;border-radius:50%;border:2px solid #fff;background:rgba(0,0,0,.45);color:#fff;font:inherit;font-size:22px;font-weight:900;display:grid;place-items:center}
.wv .wvhint{position:absolute;bottom:8px;left:0;right:0;text-align:center;color:#fff;font-size:13px;font-weight:700;text-shadow:0 2px 4px #000;pointer-events:none;transition:opacity 1s}`;
document.head.appendChild(wvCss);
function wideView(){const look=window.Deco?Object.assign(Deco.myLook(),{wide:1,ed:1}):undefined;
  const raw=houseSVG(bs.done,-1,0,true,false,look);
  // v9.0: الزينة تتفرّق يمينًا ويسارًا (jannah.js mkSpread)، فنوسّع الإطار ليشملها كلّها (الخلفية مرسومة أصلًا خارج الحدود)
  const svg=raw.replace(/viewBox="(-?\d+) 0 (\d+) (\d+)"/,(m,x0,w,h)=>{w=+x0+ +w;h=+h;let a=-298,b=w>VW?615:490;const need=Math.round(h*1.9);
    if(b-a<need){const e=(need-(b-a))/2;a-=e;b+=e}return `viewBox="${Math.round(a)} 0 ${Math.round(b-a)} ${h}"`}).replace('preserveAspectRatio="xMidYMax meet"','preserveAspectRatio="xMidYMid meet"');
  const ov=document.createElement('div');ov.className='wv';
  ov.innerHTML=`<div class="wvr"><div class="wvs" id="wvS"><div class="bhouse wvh">${svg}</div>
    <div class="wvbar"><button class="wvb" id="wvX" aria-label="إغلاق">✖</button><b>🏡 بيتي في الجنة</b><button class="wvb" id="wvM" aria-label="تصغير">−</button><button class="wvb" id="wvP" aria-label="تكبير">+</button></div>
    <div class="wvhint" id="wvH">🔍 كبّر بالإصبعين أو بزر + · اسحب لترى كل زاوية</div></div></div>`;
  document.body.appendChild(ov);document.body.style.overflow='hidden';
  const sv=ov.querySelector('.wvh svg'),S=$('#wvS');let k=1,tx=0,ty=0;
  const fitSv=()=>{sv.style.width=S.clientWidth+'px';sv.style.height=S.clientHeight+'px'};fitSv();
  const box=()=>({w:S.clientWidth,h:S.clientHeight});
  const clamp=()=>{const {w,h}=box();k=Math.max(1,Math.min(4,k));tx=Math.min(0,Math.max(w-w*k,tx));ty=Math.min(0,Math.max(h-h*k,ty))};
  const apply=()=>{clamp();sv.style.transform=`translate(${tx}px,${ty}px) scale(${k})`};
  const zoomAt=(nk,cx,cy)=>{nk=Math.max(1,Math.min(4,nk));tx=cx-(cx-tx)*nk/k;ty=cy-(cy-ty)*nk/k;k=nk;apply()};
  const mid=()=>{const {w,h}=box();return [w/2,h/2]};
  $('#wvP').onclick=()=>{sTap();zoomAt(k*1.5,...mid())};$('#wvM').onclick=()=>{sTap();zoomAt(k/1.5,...mid())};
  // تحويل حركة الإصبع إلى اتجاه الصورة إذا كانت مُدارة
  const rot=()=>ov.classList.contains('rot');
  const loc=e=>{const r=S.getBoundingClientRect();return rot()?[e.clientY-r.top,r.right-e.clientX]:[e.clientX-r.left,e.clientY-r.top]};
  const pts=new Map();let last=null,pinch=null,tapT=0;
  S.onpointerdown=e=>{if(e.target.closest('.wvb')||e.target.closest('[data-up]'))return;try{S.setPointerCapture(e.pointerId)}catch(x){}pts.set(e.pointerId,loc(e));$('#wvH').style.opacity=0;
    if(pts.size==2){const [a,b]=[...pts.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),k}}else{last=loc(e);
      const now=Date.now();if(now-tapT<300){zoomAt(k>1.5?1:2.2,...last)}tapT=now}};
  S.onpointermove=e=>{if(!pts.has(e.pointerId))return;const p=loc(e);pts.set(e.pointerId,p);
    if(pinch&&pts.size==2){const [a,b]=[...pts.values()];zoomAt(pinch.k*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch.d,(a[0]+b[0])/2,(a[1]+b[1])/2)}
    else if(last){tx+=p[0]-last[0];ty+=p[1]-last[1];last=p;apply()}};
  S.onpointerup=S.onpointercancel=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(!pts.size)last=null;else last=[...pts.values()][0]};
  const fit=()=>{const portrait=innerHeight>innerWidth;ov.classList.toggle('rot',portrait);fitSv();k=1;tx=ty=0;apply()};
  addEventListener('resize',fit);
  const close=()=>{removeEventListener('resize',fit);ov.remove();document.body.style.overflow='';
    try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock()}catch(e){}
    try{document.fullscreenElement&&document.exitFullscreen()}catch(e){}};
  $('#wvX').onclick=()=>{sTap();close()};ov._close=close;
  fit();
  // ملء الشاشة + قفلها بالعرض (يعمل في أندرويد)، وإن فشل تبقى الصورة مُدارة
  try{const fs=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen({navigationUI:'hide'});
    Promise.resolve(fs).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).then(()=>setTimeout(fit,250)).catch(()=>{})}catch(e){}
  setTimeout(()=>{const h=$('#wvH');if(h)h.style.opacity=0},4000)}
document.addEventListener('click',e=>{const h=e.target&&e.target.closest&&e.target.closest('#byBody .bhouse');if(!h||G||e.target.closest('[data-up]'))return;sTap();wideView()});

window.Bayt={get hk(){return HK},houseSVG,wideView,mosqueParts,walkers,menu,LEVELS,begin:()=>begin(),stop:()=>{stop();G=null},play:(i,net)=>{show('bayt');play(i,0,false,net)},get G(){return G},get done(){return bs.done},get cups(){return cs.n},rankOf,RANKS,sTap,sStar,sLine,VW,VH,GY,FX,FW,DX,fy};
})();
