/* ابنِ بيتك في الجنة — لعبة بناء البيت
   الطوب ينزل من السماء وعليه كلمات، والطفل يلمس الكلمة الصحيحة التالية بالترتيب.
   الخطأ أو فوات الكلمة الصحيحة يُسقط طوبتين من البيت، وإذا نفدت القوة انهدم الطابق.
   نصوص السور مأخوذة كما هي من دروس الكتاب (STAGES) ولا تُكتب هنا يدويًا. */
(function(){
const BKEY='usul5_bayt_v1';
let bs={done:0};
try{const s=JSON.parse(localStorage.getItem(BKEY)||'null');if(s&&typeof s.done=='number')bs=s}catch(e){}
const bsave=()=>{try{localStorage.setItem(BKEY,JSON.stringify(bs))}catch(e){}};

const L0=STAGES[0].lessons;
const surah=h=>L0.find(l=>l.h==h).surah.map(v=>v[0].split(' '));
const LEVELS=[
 {name:'أصول الدين الخمسة',floor:'الطابق الأول',icon:'🏠',color:'#14794f',quran:false,
  lines:[['التوحيد','العدل','النبوّة','الإمامة','المعاد']],extra:['الصلاة','الصوم','الحج','الزكاة'],
  speed:44,accel:2,spawn:1.15,maxOn:3,lives:3,
  tip:'انتبه! الصلاة والصوم والحج والزكاة من فروع الدين، ليست من الأصول.'},
 {name:'سورة التوحيد',floor:'الطابق الثاني',icon:'🏡',color:'#2f6fd0',quran:true,
  lines:surah('سورة التوحيد'),extra:[],speed:52,accel:1.3,spawn:1.0,maxOn:4,lives:4,
  tip:'اجمع كلمات السورة كلمةً كلمة بالترتيب. الكلمات التي بعدها تنزل معها لتخدعك!'},
 {name:'سورة الحمد',floor:'الطابق الثالث',icon:'🏰',color:'#e57c1f',quran:true,
  lines:surah('سورة الحمد'),extra:[],speed:60,accel:.8,spawn:.9,maxOn:4,lives:5,
  tip:'أطول سورة وأصعب مرحلة: الطوب أسرع، فركّز جيدًا.'}
];
LEVELS.forEach(l=>{l.seq=[];l.lineOf=[];l.lines.forEach((ln,i)=>ln.forEach(w=>{l.seq.push(w);l.lineOf.push(i)}));
  l.pool=[...new Set(l.seq.concat(l.extra))]});
const FLOORMSG=[
 ['مبروك! صار لك بيت 🏠','جمعتَ أصول الدين الخمسة بالترتيب، فبنيتَ الطابق الأول.'],
 ['صار بيتك طابقين! 🏡','جمعتَ سورة التوحيد كاملة، فارتفع بيتك طابقًا جديدًا.'],
 ['بيتك ثلاثة طوابق! 🏰','جمعتَ سورة الحمد كاملة. بارك الله فيك يا بطل!']
];

/* ---------- styles ---------- */
const css=document.createElement('style');
css.textContent=`
.baytcard{border-color:#3fbf6f;box-shadow:0 5px 0 #a9e2bd}
.baytcard:active{box-shadow:0 2px 0 #a9e2bd}
.baytcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.bhouse{position:relative;background:#fff;border-radius:22px;border:2px solid var(--line);overflow:hidden}
.bhouse svg{display:block;width:100%;height:auto}
.bhouse.sm{height:150px}.bhouse.sm svg{height:100%;width:auto;margin:0 auto}
.bhouse.shake{animation:bshake .5s}
@keyframes bshake{0%,100%{transform:none}20%{transform:translateX(-7px) rotate(-1deg)}40%{transform:translateX(6px) rotate(1deg)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
.bhouse.fall svg .fl-part{animation:bcol 1s ease-in forwards}
@keyframes bcol{to{transform:translateY(90px) rotate(8deg);opacity:0}}
.bdeb{position:absolute;width:18px;height:10px;background:#e9b265;border:1px solid #a8742f;border-radius:2px;pointer-events:none;animation:bfall 1s ease-in forwards}
@keyframes bfall{to{transform:translateY(150px) rotate(220deg);opacity:0}}
.bcap{text-align:center;color:var(--muted);font-size:15px;margin:8px 0 2px}
.blv{display:flex;align-items:center;gap:12px;width:100%;background:#fff;border-radius:20px;padding:10px 12px;margin:10px 0 0;border:2px solid var(--line);text-align:right;color:inherit}
.blv:active{transform:scale(.98)}
.blv .ic{width:54px;height:54px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:28px;box-shadow:0 4px 0 rgba(0,0,0,.15)}
.blv b{display:block;font-size:18px}.blv small{color:var(--muted);font-size:14px;line-height:1.5;display:block}
.blv .mk{margin-inline-start:auto;font-size:22px;flex:none}
.blv.locked{opacity:.5;filter:grayscale(.8)}
.bhud{display:flex;align-items:center;gap:8px;margin:8px 0 6px}
.bhud .nm{flex:1;font-weight:800;font-size:16px}
.bhud .lives{font-size:18px;letter-spacing:1px;direction:ltr}
.bhud .hintb{border:2px solid var(--gold);background:#fff8e6;border-radius:14px;padding:2px 10px;font-size:15px;font-weight:800;color:#8a5a00}
.bhud .hintb:disabled{opacity:.4}
.bstrip{background:#fff;border:2px solid var(--line);border-radius:18px;padding:4px 10px;text-align:center;min-height:58px}
.bstrip .lb{font-size:13px;color:var(--muted)}
.bstrip .q{font-size:20px;line-height:1.9;color:var(--deep);font-weight:800}
.bstrip .q.qf{font-family:'Amiri Quran',serif;font-weight:400;font-size:21px}
.bstrip .w{display:inline-block;margin:0 3px}
.bstrip .w.hid{color:#b9cfc2;font-family:'Tajawal',sans-serif}
.bstrip .w.hint{color:#e57c1f;animation:pulse .5s infinite}
.bstrip .w.new{animation:bpopin .35s}
@keyframes bpopin{from{scale:1.6;color:#1fa463}}
.bboard{position:relative;height:min(46vh,340px);min-height:250px;background:linear-gradient(#e3f4ff,#fff8e6);border-radius:20px;border:2px solid var(--line);overflow:hidden;touch-action:manipulation;margin-top:8px}
.bboard::after{content:'';position:absolute;left:0;right:0;bottom:0;height:9px;background:repeating-linear-gradient(45deg,#e2504a 0 10px,#f2b632 10px 20px);opacity:.75}
.bboard.hurt{animation:bhurt .45s}
@keyframes bhurt{50%{box-shadow:inset 0 0 0 7px #e2504a;background:#ffe3e1}}
.bk{position:absolute;left:0;top:0;border:none;border-radius:10px;padding:5px 13px;font-size:20px;font-weight:800;color:#4a2e00;white-space:nowrap;will-change:transform;
  background:linear-gradient(#f7d18e,#e7ac5c);box-shadow:0 4px 0 #a8742f,inset 0 0 0 2px rgba(255,255,255,.45)}
.bk.qf{font-family:'Amiri Quran',serif;font-weight:400;font-size:22px;padding:0 13px;line-height:1.9}
.bk.ok{animation:bok .3s forwards;pointer-events:none}
@keyframes bok{to{scale:1.5;opacity:0;filter:brightness(1.6)}}
.bk.no{background:#e2504a;color:#fff;box-shadow:0 4px 0 #a8332e;animation:bno .45s forwards;pointer-events:none}
@keyframes bno{30%{scale:1.15}to{scale:.6;opacity:0}}
.bmsg{position:absolute;top:38%;left:0;right:0;text-align:center;font-weight:800;font-size:22px;pointer-events:none;animation:bmsg 1.1s forwards;z-index:3}
.bmsg.bad{color:#c43d38}.bmsg.good{color:#14794f}
@keyframes bmsg{0%{opacity:0;scale:.7}15%{opacity:1;scale:1.1}75%{opacity:1}to{opacity:0;transform:translateY(-30px)}}
.bover{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(255,255,255,.85);text-align:center;padding:16px;z-index:4}
.bover p{margin:0;font-size:16px;color:var(--ink);line-height:1.7}
.bover .btn{flex:none;padding:12px 26px}
`;
document.head.appendChild(css);

/* ---------- sounds (Web Audio, respects state.mute) ---------- */
function ctx(){if(state.mute)return null;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state=='suspended')actx.resume();return actx}catch(e){return null}}
function noise(d=.3,vol=.25,at=0,lp=900){const a=ctx();if(!a)return;try{const n=Math.floor(a.sampleRate*d),buf=a.createBuffer(1,n,a.sampleRate),ch=buf.getChannelData(0);
  for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=buf;f.type='lowpass';f.frequency.value=lp;g.gain.value=vol;
  s.connect(f).connect(g).connect(a.destination);s.start(a.currentTime+at)}catch(e){}}
const NOTES=[523,587,659,784,880,1047,1175,1319];
const sBrick=i=>{tone(150,.06,'square',.09);noise(.05,.12,0,2500);tone(NOTES[i%NOTES.length],.16,'triangle',.15,.04)};
const sLine=()=>[659,784,988,1319].forEach((f,i)=>tone(f,.18,'triangle',.15,i*.09));
const sBad=()=>{noise(.45,.35,0,700);tone(160,.32,'sawtooth',.11);tone(105,.42,'sawtooth',.11,.14)};
const sCollapse=()=>{noise(1.4,.45,0,500);[392,330,262,196,147,110].forEach((f,i)=>tone(f,.3,'sawtooth',.1,i*.2))};
const sTap=()=>tone(880,.05,'sine',.08);

/* ---------- house drawing ---------- */
const HW=320,HH=250,G0=226,FH=50,FX=70,FW=180;
function floorFull(i){const y=G0-FH*(i+1);let s=`<rect x="${FX}" y="${y}" width="${FW}" height="${FH}" fill="url(#bkp)" stroke="#a8742f" stroke-width="2"/>`+
  `<rect x="${FX-4}" y="${y+FH-5}" width="${FW+8}" height="5" fill="#d79d4c"/>`;
  const win=x=>`<rect x="${x}" y="${y+10}" width="26" height="24" rx="4" fill="#8fd3ff" stroke="#fff" stroke-width="3"/><line x1="${x+13}" y1="${y+10}" x2="${x+13}" y2="${y+34}" stroke="#fff" stroke-width="2"/>`;
  if(i==0)s+=win(FX+16)+win(FX+FW-42)+`<path d="M${FX+FW/2-15} ${G0} v-26 a15 15 0 0 1 30 0 v26z" fill="#8a5a2b"/><circle cx="${FX+FW/2+8}" cy="${G0-14}" r="2.5" fill="#f2b632"/>`;
  else s+=win(FX+16)+win(FX+FW/2-13)+win(FX+FW-42);
  return s}
function floorPart(i,frac){const y=G0-FH*(i+1),cols=6,rows=3,bw=FW/cols,bh=FH/rows,k=Math.floor(frac*cols*rows+1e-9);let s='<g class="fl-part">';
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const idx=r*cols+c,x=FX+FW-bw*(c+1),yy=y+FH-bh*(r+1);
    s+=idx<k?`<rect x="${x+.8}" y="${yy+.8}" width="${bw-1.6}" height="${bh-1.6}" rx="2" fill="${(r+c)%2?'#f2c27b':'#e7ac5c'}" stroke="#a8742f"/>`
            :`<rect x="${x+1}" y="${yy+1}" width="${bw-2}" height="${bh-2}" rx="2" fill="none" stroke="#c9b48c" stroke-dasharray="3 3"/>`}
  return s+'</g>'}
function roof(n){const y=G0-FH*n;return `<polygon points="${FX-16},${y} ${FX+FW/2},${y-58} ${FX+FW+16},${y}" fill="#3fbf6f" stroke="#14794f" stroke-width="3" stroke-linejoin="round"/>`+
  `<circle cx="${FX+FW/2}" cy="${y-64}" r="7" fill="#f2b632" stroke="#b9851a" stroke-width="2"/>`}
function houseSVG(full,part,frac,withRoof){
  const top=Math.max(full,part+1),shift=Math.max(0,top-3)*0; // up to 3 floors fit
  let s=`<svg viewBox="0 0 ${HW} ${HH}" xmlns="http://www.w3.org/2000/svg"><defs>
  <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#fff6dc"/></linearGradient>
  <pattern id="bkp" width="30" height="16.67" patternUnits="userSpaceOnUse"><rect width="30" height="16.67" fill="#f2c27b"/><path d="M0 16.2H30M15 0V8.3M0 8.3H30M0 8.3V16.67M30 8.3V16.67" stroke="#c98d45" stroke-width="1.2"/></pattern></defs>
  <rect width="${HW}" height="${HH}" fill="url(#bsky)"/>
  <circle cx="276" cy="36" r="17" fill="#ffd54a"/><g fill="#fff" opacity=".9"><ellipse cx="60" cy="36" rx="26" ry="10"/><ellipse cx="80" cy="30" rx="16" ry="10"/><ellipse cx="210" cy="22" rx="20" ry="8"/></g>
  <rect y="${G0}" width="${HW}" height="${HH-G0}" fill="#7ccf8f"/><path d="M0 ${G0+14} q80 -10 160 0 t160 0 v10 q-80 -10 -160 0 t-160 0z" fill="#5fa8e8"/>
  ${[30,290].map(x=>`<rect x="${x-3}" y="${G0-38}" width="6" height="40" fill="#8a5a2b"/><circle cx="${x}" cy="${G0-46}" r="18" fill="#35a862"/><circle cx="${x-6}" cy="${G0-50}" r="3.5" fill="#e2504a"/><circle cx="${x+7}" cy="${G0-42}" r="3.5" fill="#f2b632"/>`).join('')}`;
  for(let i=0;i<full;i++)s+=floorFull(i);
  if(part>=0)s+=floorPart(part,frac);
  if(withRoof&&full>0)s+=roof(full);
  if(full==0&&part<0)s+=floorPart(0,0)+`<text x="${HW/2}" y="${G0-FH-12}" text-anchor="middle" font-size="15" font-weight="800" fill="#5d6f66" font-family="Tajawal,sans-serif">هنا سيُبنى بيتك</text>`;
  return s+'</svg>'}

/* ---------- screen ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='bayt';
sec.innerHTML=`<div class="bar"><button class="back" id="byBack">›</button><div class="ttl">ابنِ بيتك في الجنة</div></div><div id="byBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard baytcard';card.id='openBayt';
card.innerHTML=`<span class="cup">🏡</span><span><b>ابنِ بيتك في الجنة</b><small id="baytLine">اجمع الكلمات بالترتيب وابنِ بيتك طابقًا طابقًا</small></span><span class="go">‹</span>`;
$('#openContest').after(card);
const updCard=()=>{$('#baytLine').textContent=bs.done>=3?'بيتك ثلاثة طوابق! العب مرة أخرى 🏰':bs.done?`بيتك الآن ${['','طابق واحد','طابقان'][bs.done]}، أكمل البناء!`:'اجمع الكلمات بالترتيب وابنِ بيتك طابقًا طابقًا'};
updCard();
card.onclick=()=>{sTap();menu();show('bayt')};
$('#byBack').onclick=()=>{if(G){stop();menu()}else{updCard();renderHome&&renderHome();show('home')}};

function menu(){G=null;const B=$('#byBody');
  B.innerHTML=`<div class="bhouse">${houseSVG(bs.done,-1,0,true)}</div>
  <p class="bcap">${bs.done>=3?'ما شاء الله! بنيتَ بيتك ثلاثة طوابق 🌟':'كل مرحلة تنجح فيها تبني طابقًا جديدًا'}</p>
  ${LEVELS.map((l,i)=>{const lock=i>bs.done,dn=i<bs.done;
    return `<button class="blv ${lock?'locked':''}" data-lv="${i}"><span class="ic" style="background:${l.color}">${lock?'🔒':l.icon}</span>
    <span><b>${l.floor}: ${l.name}</b><small>${lock?'أكمل الطابق الذي قبله أولًا':`${ar(l.seq.length)} ${l.quran?'كلمة':'أصول'} · ${ar(l.lives)} محاولات`}</small></span>
    <span class="mk">${dn?'✅':lock?'':'▶️'}</span></button>`}).join('')}
  <p class="bcap" style="margin-top:12px">الطوب ينزل وعليه كلمات. المس الكلمة <b>التالية</b> بالترتيب.<br>الخطأ أو ترك الكلمة الصحيحة تسقط على الأرض يهدم من بيتك!</p>`;
  B.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{const i=+b.dataset.lv;
    if(i>bs.done){tone(200,.15,'square',.08);return}sTap();play(i)})}

/* ---------- game ---------- */
let G=null;
const need=()=>G.lv.seq[G.p];
function play(i){const lv=LEVELS[i],B=$('#byBody');
  G={i,lv,p:0,lives:lv.lives,hints:2,bricks:[],run:false,spawnT:0,since:0,last:0,raf:0};
  B.innerHTML=`<div class="bhouse sm" id="byHouse"></div>
  <div class="bhud"><span class="nm" style="color:${lv.color}">${lv.floor}: ${lv.name}</span><span class="lives" id="byLives"></span><button class="hintb" id="byHint">💡 تلميح</button></div>
  <div class="bstrip" id="byStrip"></div>
  <div class="bboard" id="byBoard"><div class="bover"><div style="font-size:46px">${lv.icon}</div><p><b>${lv.name}</b><br>${lv.tip}</p><button class="btn gold" id="byGo">ابدأ البناء</button></div></div>`;
  G.board=$('#byBoard');drawHouse();drawHud();drawStrip();
  $('#byGo').onclick=()=>{$('#byGo').parentNode.remove();ctCountdown(()=>{if(!G)return;G.run=true;G.last=performance.now();G.raf=requestAnimationFrame(loop)})};
  $('#byHint').onclick=hint}
function drawHouse(){$('#byHouse').innerHTML=houseSVG(G.i,G.i,G.p/G.lv.seq.length,false)}
function drawHud(){$('#byLives').textContent='❤️'.repeat(Math.max(0,G.lives))+'🤍'.repeat(G.lv.lives-Math.max(0,G.lives));$('#byHint').disabled=G.hints<=0;$('#byHint').textContent=`💡 تلميح (${ar(G.hints)})`}
function drawStrip(hintOn,newIdx){const lv=G.lv,p=Math.min(G.p,lv.seq.length-1),li=lv.lineOf[p];let start=lv.lineOf.indexOf(li);
  const ws=lv.lines[li].map((w,k)=>{const gi=start+k;
    if(gi<G.p)return `<span class="w ${gi==newIdx?'new':''}">${w}</span>`;
    if(hintOn&&gi==G.p)return `<span class="w hint">${w}</span>`;
    return `<span class="w hid">◌</span>`}).join(' ');
  const lb=lv.quran?`الآية ${ar(li+1)} من ${ar(lv.lines.length)} · جمعتَ ${ar(G.p)} من ${ar(lv.seq.length)}`:`رتّب أصول الدين · جمعتَ ${ar(G.p)} من ${ar(lv.seq.length)}`;
  $('#byStrip').innerHTML=`<div class="lb">${lb}</div><div class="q ${lv.quran?'qf':''}">${lv.quran?'﴿':''}${ws}${lv.quran?'﴾':''}</div>`}
function hint(){if(!G||!G.run||G.hints<=0)return;G.hints--;drawHud();tone(988,.12,'sine',.12);drawStrip(true);clearTimeout(G.ht);G.ht=setTimeout(()=>G&&drawStrip(),1300)}
function msg(t,cls){const d=document.createElement('div');d.className='bmsg '+cls;d.textContent=t;G.board.appendChild(d);setTimeout(()=>d.remove(),1100)}

function spawn(){const lv=G.lv,n=need();if(G.bricks.length>=lv.maxOn)return;
  const onScreen=G.bricks.some(b=>b.txt==n);let txt;
  if(!onScreen&&(G.since>=2||Math.random()<.45)){txt=n;G.since=0}
  else{const near=lv.seq.slice(G.p+1,G.p+5).filter(w=>w!=n),far=lv.pool.filter(w=>w!=n);
    const src=near.length&&Math.random()<.65?near:far;txt=src[Math.floor(Math.random()*src.length)];if(!onScreen)G.since++}
  const el=document.createElement('button');el.className='bk'+(lv.quran?' qf':'');el.textContent=txt;G.board.appendChild(el);
  const W=G.board.clientWidth,bw=el.offsetWidth,cols=3,colW=W/cols;
  const busy=new Set(G.bricks.filter(b=>b.y<70).map(b=>b.col));let free=[0,1,2].filter(c=>!busy.has(c));if(!free.length)free=[0,1,2];
  const col=free[Math.floor(Math.random()*free.length)];
  const x=Math.max(4,Math.min(W-bw-4,col*colW+(colW-bw)/2+(Math.random()*16-8)));
  const b={el,txt,x,y:-el.offsetHeight,col,h:el.offsetHeight};el.style.transform=`translate(${x}px,${b.y}px)`;
  el.onpointerdown=e=>{e.preventDefault();if(!G||!G.run||!G.bricks.includes(b))return;if(b.txt==need())good(b);else bad(b)};
  G.bricks.push(b)}
function takeOut(b,cls){G.bricks=G.bricks.filter(x=>x!==b);if(cls){b.el.classList.add(cls);setTimeout(()=>b.el.remove(),460)}else b.el.remove()}
function loop(t){if(!G||!G.run)return;const dt=Math.min(.05,(t-G.last)/1000);G.last=t;
  G.spawnT-=dt;if(G.spawnT<=0){spawn();G.spawnT=G.lv.spawn*(.8+Math.random()*.4)}
  const H=G.board.clientHeight-9,sp=G.lv.speed+G.p*G.lv.accel;
  for(const b of [...G.bricks]){b.y+=sp*dt;b.el.style.transform=`translate(${b.x}px,${b.y}px)`;
    if(b.y+b.h>=H){const wasNeed=b.txt==need();takeOut(b,wasNeed?'no':'');if(wasNeed){mistake('فاتتك الكلمة الصحيحة!');if(!G||!G.run)return}}}
  G.raf=requestAnimationFrame(loop)}
function good(b){takeOut(b,'ok');const lv=G.lv,idx=G.p;G.p++;sBrick(idx);
  const lineDone=G.p==lv.seq.length||lv.lineOf[G.p]!=lv.lineOf[idx];
  drawHouse();drawStrip(false,idx);
  if(G.p==lv.seq.length){finish();return}
  if(lineDone&&lv.quran){setTimeout(sLine,150);msg('أحسنت! آية كاملة ✨','good')}}
function bad(b){takeOut(b,'no');mistake('ليست هذه الكلمة!')}
function mistake(t){G.lives--;const lose=Math.min(2,G.p);G.p-=lose;sBad();if(navigator.vibrate)try{navigator.vibrate(120)}catch(e){}
  const h=$('#byHouse');h.classList.remove('shake');void h.offsetWidth;h.classList.add('shake');
  G.board.classList.remove('hurt');void G.board.offsetWidth;G.board.classList.add('hurt');
  for(let k=0;k<Math.max(1,lose)+1;k++){const d=document.createElement('div');d.className='bdeb';
    const top=((G0-FH*(G.i+1))/HH*150);d.style.top=top+Math.random()*20+'px';d.style.left=`calc(50% + ${Math.random()*80-40}px)`;d.style.animationDelay=k*.08+'s';h.appendChild(d);setTimeout(()=>d.remove(),1300)}
  drawHouse();drawStrip();drawHud();
  if(G.lives<=0){collapse();return}
  msg(lose?`${t} سقط من بيتك ${lose==2?'طوبتان':'طوبة'} 💥`:t,'bad')}
function stop(){if(!G)return;G.run=false;cancelAnimationFrame(G.raf);clearTimeout(G.ht);G.bricks.forEach(b=>b.el.remove());G.bricks=[]}
function collapse(){const i=G.i;stop();sCollapse();const h=$('#byHouse');h.innerHTML=houseSVG(i,i,.75,false);h.classList.add('fall');
  setTimeout(()=>{if(!G)return;h.classList.remove('fall');G.p=0;drawHouse();
    const o=document.createElement('div');o.className='bover';o.innerHTML=`<div style="font-size:46px">💔</div><p><b>انهدم الطابق!</b><br>لا بأس، البنّاء الشاطر لا ييأس. حاول مرة أخرى.</p><button class="btn gold" id="byAgain">ابنِ من جديد</button>`;
    G.board.appendChild(o);$('#byAgain').onclick=()=>{sTap();play(i)}},1100)}
function finish(){const i=G.i;stop();setTimeout(()=>{fanfare();confetti()},250);
  if(bs.done<i+1){bs.done=i+1;bsave()}updCard();
  const [h,p]=FLOORMSG[i];const last=i==LEVELS.length-1;
  $('#byHouse').innerHTML=houseSVG(i+1,-1,0,true);
  modal(`<div class="bhouse" style="margin-bottom:8px">${houseSVG(i+1,-1,0,true)}</div><h3 style="margin:4px 0">${h}</h3><p style="margin:4px 0 10px">${p}</p>
    <div class="nav">${last?'':`<button class="btn gold" id="byNext">الطابق التالي ⬆️</button>`}<button class="btn sec" id="byMenu">${last?'رائع! 🤲':'بيتي'}</button></div>`,()=>{
    $('#byMenu').onclick=()=>{closeModal();menu()};
    if(!last)$('#byNext').onclick=()=>{closeModal();play(i+1)}})}
document.addEventListener('visibilitychange',()=>{if(!G)return;if(document.hidden&&G.run){G.run=false;cancelAnimationFrame(G.raf);G.paused=true}
  else if(!document.hidden&&G.paused){G.paused=false;G.run=true;G.last=performance.now();G.raf=requestAnimationFrame(loop)}});
})();
