/* 🎤 صوتي — الطفل يقرأ بصوته والتطبيق يصحّح له.
   - التصحيح بالكلمات: يستعمل التعرّف على الكلام في المتصفح (Chrome/Android مع إنترنت). إذا لم يتوفّر (مثل تطبيق الأندرويد)
     نسمع الصوت فقط ونشجّع الطفل، ولا ندّعي أننا صحّحنا الكلمات.
   - العدّاد الصوتي (الصلاة على النبي، التسبيح): يعدّ كل مرة يتكلم فيها الطفل ثم يسكت، ويعمل بلا إنترنت.
   - Aamal: مخزن الأعمال الصالحة المشترك (salah.js و alqab.js و jannah.js تقرأ منه). */
(function(){
/* ---------- مخزن الأعمال ---------- */
const AKEY='usul5_aamal_v1';
let as={sal:0,tas:0,tilawa:0,surOk:{},pray:{},prayN:0,fiqh:{},akhlaq:0,way:'',deedDay:'',deedDone:{}};
try{const s=JSON.parse(localStorage.getItem(AKEY)||'null');if(s&&typeof s.sal=='number')as=Object.assign(as,s)}catch(e){}
const asave=()=>{try{localStorage.setItem(AKEY,JSON.stringify(as))}catch(e){}};
const today=()=>new Date().toDateString();
window.Aamal={get d(){return as},save:asave,add(k,n){as[k]=(as[k]||0)+n;asave();window.Alqab&&Alqab.soon()},
  // عمل يومي واحد يعطي جائزة مرة في اليوم
  firstToday(k){if(as.deedDay!=today()){as.deedDay=today();as.deedDone={}}if(as.deedDone[k])return false;as.deedDone[k]=1;asave();return true},
  doneToday(k){return as.deedDay==today()&&!!as.deedDone[k]},
  /* 🌱 حديقة الأعمال: كل عملٍ صالح يضيف شيئًا جميلًا إلى البيت (يظهر للأصدقاء أيضًا).
     الحرف يُحفظ في gl (آخر ٨٠ عملًا تظهر في البيت)، وgN = مجموع الأعمال، وgc = عدد كل نوع. */
  get GROW(){return GROW},grow(k,n=1){const g=GROW[k];if(!g)return 0;const d=today();if(as.gDay!=d){as.gDay=d;as.gToday={}}as.gToday=as.gToday||{};
    const room=Math.max(0,(g[3]||5)-(as.gToday[k]||0)),m=Math.min(n,room);
    if(m>0){as.gToday[k]=(as.gToday[k]||0)+m;as.gl=((as.gl||'')+g[2].repeat(m)).slice(-80);as.gN=(as.gN||0)+m;as.gc=as.gc||{};as.gc[k]=(as.gc[k]||0)+m;asave();
      setTimeout(()=>{grownBanner(g,m);window.Alqab&&Alqab.soon()},350)}
    return m}};
// [الرمز، الاسم، حرف الحفظ، الحد اليومي، اسم العمل]
const GROW={sal:['🌹','وردة','a',3,'الصلاة على النبي وآله'],tas:['🐦','عصفور','b',3,'التسبيح'],pray:['🌷','زهرة','c',5,'صلاة صلّيتها'],
  ayah:['⭐','نجمة','d',4,'آيات قرأتها بصوتك'],fiqh:['🌳','شجرة','e',3,'تعلّم الوضوء والصلاة'],hifz:['🌴','نخلة','f',2,'سورة حفظتها'],
  akhlaq:['🦋','فراشة','g',2,'خُلقٌ جميل'],wird:['🍎','تفاحة','h',1,'الورد اليومي'],dars:['🌻','دوّار شمس','i',3,'درس نجحت فيه'],win:['🏵️','وردة الأبطال','j',3,'فوز في تحدٍّ'],ctst:['🎈','بالون','k',4,'تحدٍّ لعبته']};
function grownBanner(g,m){const d=document.createElement('div');d.className='ctbanner b3';d.style.cssText='font-size:18px;top:14%;white-space:normal;max-width:90vw;text-align:center';
  d.textContent=`🏡 أُضيف إلى بيتك في الجنة: ${g[0]} ${g[1]}${m>1?' ×'+ar(m):''}`;document.body.appendChild(d);setTimeout(()=>d.remove(),1500);
  try{[1047,1319].forEach((f,i)=>tone(f,.12,'sine',.1,i*.08))}catch(e){}}

const boy=()=>!window.Cups||Cups.sex!='g';
const B=(m,f)=>boy()?m:f;

/* ---------- توحيد الكتابة للمقارنة: بلا تشكيل، والألفات واحدة، والتاء المربوطة هاء ---------- */
function norm(t){return String(t||'').replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/[^ء-ي\s]/g,' ').replace(/\s+/g,' ').trim()}
const words=t=>norm(t).split(' ').filter(Boolean);
function lev(a,b){if(a==b)return 0;const m=a.length,n=b.length;if(!m||!n)return m+n;let p=[...Array(n+1).keys()];
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]==b[j-1]?0:1));p=c}return p[n]}
// تشابه كلمتين: نفس الكلمة، أو فرق حرف واحد في الكلمات الطويلة (أخطاء التعرّف على الكلام)
function same(a,b){if(a==b)return true;const s=x=>x.replace(/^(و|ف)?(ال)?/,'');if(s(a)==s(b)&&s(a).length>1)return true;
  const L=Math.max(a.length,b.length);return L>=4&&lev(a,b)<=(L>=7?2:1)}
/* يقارن النص المطلوب بما سمعناه (عدّة احتمالات)، ويرجع لكل كلمة: هل قيلت؟ */
function compare(target,heards){const T=words(target);let best={ok:T.map(()=>false),score:0};
  (heards||[]).forEach(h=>{const H=words(h);const n=T.length,m=H.length,dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
    for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)dp[i][j]=same(T[i-1],H[j-1])?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
    const ok=T.map(()=>false);let i=n,j=m;while(i>0&&j>0){if(same(T[i-1],H[j-1])&&dp[i][j]==dp[i-1][j-1]+1){ok[i-1]=true;i--;j--}else if(dp[i-1][j]>=dp[i][j-1])i--;else j--}
    const sc=n?ok.filter(Boolean).length/n:0;if(sc>best.score)best={ok,score:sc}});
  return best}

/* ---------- الاستماع ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const canCorrect=()=>!!SR&&navigator.onLine!==false;
let cur=null;
function stopAll(){if(cur){try{cur.stop()}catch(e){}cur=null}}
/* استماع واحد مع التصحيح: يرجع وعدًا بـ {texts:[...]} أو {err} */
function hear(onLevel){stopAll();return new Promise(res=>{let rec;try{rec=new SR()}catch(e){return res({err:'nosr'})}
  rec.lang='ar-SA';rec.interimResults=true;rec.continuous=true;rec.maxAlternatives=4;
  let finals=[],interim=[],done=false,silence=0,heard=false;
  const end=r=>{if(done)return;done=true;clearTimeout(silence);clearTimeout(hard);try{rec.stop()}catch(e){}cur=null;res(r)};
  const out=()=>{const f=finals.length?finals:[];const all=[];
    // نجمع النص كله مع كل الاحتمالات للمقطع الأخير
    const base=f.map(a=>a[0]).join(' '),lastAlt=interim.length?interim:[''];lastAlt.forEach(x=>all.push((base+' '+x).trim()));
    if(f.length){const k=f.length-1;f[k].forEach(x=>all.push(f.slice(0,k).map(a=>a[0]).concat(x).join(' ')))}
    return {texts:[...new Set(all.filter(Boolean))]}};
  rec.onresult=e=>{heard=true;interim=[];for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i],alts=[...r].map(a=>a.transcript);
      if(r.isFinal)finals.push(alts);else interim=alts}
    onLevel&&onLevel(1,norm(finals.map(a=>a[0]).join(' ')+' '+(interim[0]||'')));
    clearTimeout(silence);silence=setTimeout(()=>end(out()),1600)};
  rec.onspeechstart=()=>{onLevel&&onLevel(1)};
  rec.onerror=e=>end(heard?out():{err:e.error||'err'});
  rec.onend=()=>end(heard?out():{err:'no-speech'});
  const hard=setTimeout(()=>end(heard?out():{err:'no-speech'}),20000);
  cur={stop:()=>end(heard?out():{err:'stopped'})};
  try{rec.start()}catch(e){end({err:'start'})}})}

/* كاشف الصوت (بلا إنترنت): يعدّ المقاطع المنطوقة. يرجع كائنًا فيه stop() */
const IN_APK=location.host=='appassets.androidplatform.net';
async function openMic(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw {name:'NoMedia'};
  try{return await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})}
  catch(e){if(e&&(e.name=='NotAllowedError'||e.name=='SecurityError'))throw e;
    return await navigator.mediaDevices.getUserMedia({audio:true})}}
/* رسالة واضحة للطفل/الأهل حسب سبب فشل المايك */
function micHelp(e){const n=(e&&e.name)||'err';
  if(n=='NotAllowedError'||n=='SecurityError')return IN_APK
    ?'المايك ممنوع عن التطبيق. افتح إعدادات الهاتف ← التطبيقات ← جنّتي الصغيرة ← الأذونات ← الميكروفون ← سماح'
    :'المتصفح منع المايك. اضغط 🔒 بجانب رابط الموقع ← الأذونات ← الميكروفون ← سماح، ثم أعد فتح الصفحة';
  if(n=='NotFoundError'||n=='OverconstrainedError')return 'لم نجد مايكًا في هذا الجهاز';
  if(n=='NotReadableError'||n=='AbortError')return 'المايك مشغول بتطبيق آخر (مكالمة أو تسجيل). أغلقه وجرّب';
  return 'لم نستطع فتح المايك';}
async function vad({onLevel,onUtter,minMs=650}){
  const stream=await openMic();
  const ac=new (window.AudioContext||window.webkitAudioContext)();
  if(ac.state=='suspended')await Promise.race([ac.resume(),new Promise(r=>setTimeout(r,1500))]);
  const src=ac.createMediaStreamSource(stream),an=ac.createAnalyser();an.fftSize=1024;src.connect(an);
  const buf=new Float32Array(an.fftSize);let floor=[],thr=.02,talking=false,start=0,lastLoud=0,raf=0,stopped=false;const t0=performance.now();
  function loop(){if(stopped)return;an.getFloatTimeDomainData(buf);let s=0;for(const v of buf)s+=v*v;const rms=Math.sqrt(s/buf.length),t=performance.now();
    if(t-t0<500){floor.push(rms)}else if(floor){floor.sort((a,b)=>a-b);thr=Math.max(.012,(floor[Math.floor(floor.length/2)]||0)*3.2);floor=null}
    const loud=!floor&&rms>thr;onLevel&&onLevel(Math.min(1,rms/(thr*3)),loud);
    if(loud){lastLoud=t;if(!talking){talking=true;start=t}}
    else if(talking&&t-lastLoud>480){talking=false;const d=lastLoud-start;if(d>=minMs)onUtter&&onUtter(d)}
    raf=requestAnimationFrame(loop)}
  loop();
  return {stop(){stopped=true;cancelAnimationFrame(raf);try{stream.getTracks().forEach(x=>x.stop())}catch(e){}try{ac.close()}catch(e){}}}}

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
.vx{background:#fff;border:3px solid #13958c;border-radius:24px;padding:12px 12px 10px;text-align:center}
.vx .tx{font-size:21px;line-height:2.1;color:#0b3d27;font-weight:700}
.vx .tx.q{font-family:'Amiri Quran','Amiri',serif;font-weight:400;font-size:25px}
.vx .tx .w{display:inline-block;margin:0 2px;border-radius:8px;padding:0 3px;transition:background .3s,color .3s}
.vx .tx .w.ok{background:#d9f5e3;color:#0e7a3e}.vx .tx .w.no{background:#fde2e0;color:#c43d38}
.vx .tx.hide .w:not(.ok):not(.no){filter:blur(8px)}
.vmic{width:96px;height:96px;border-radius:50%;border:none;background:radial-gradient(circle at 35% 30%,#4fd1c5,#13958c);color:#fff;font-size:44px;margin:8px auto 4px;display:grid;place-items:center;box-shadow:0 6px 0 #0d6b65;position:relative}
.vmic:active{transform:translateY(3px);box-shadow:0 3px 0 #0d6b65}
.vmic.on{background:radial-gradient(circle at 35% 30%,#ff8a80,#e2504a);box-shadow:0 6px 0 #a8332e;animation:pulse 1s infinite}
.vmic .ring{position:absolute;inset:-8px;border-radius:50%;border:4px solid #4fd1c5;opacity:0;transition:transform .08s,opacity .08s;pointer-events:none}
.vmsg{min-height:28px;font-weight:800;font-size:16px;margin:4px 0}
.vmsg.ok{color:#0e7a3e}.vmsg.bad{color:#c43d38}.vmsg.mid{color:#8a5a00}
.vnote{font-size:13px;color:var(--muted);line-height:1.6}
.vprog{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:6px 0}.vprog i{width:16px;height:8px;border-radius:6px;background:#dcebe2}.vprog i.ok{background:#1fa463}.vprog i.mid{background:#f2b632}.vprog i.cur{background:#13958c}
.vcount{font-size:64px;font-weight:800;color:#14794f;line-height:1.1;font-variant-numeric:tabular-nums}
.vbeads{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:8px 0}
.vbeads i{width:24px;height:24px;border-radius:50%;background:#e6efe9;border:2px solid #cfe2d6;font-style:normal;font-size:14px;display:grid;place-items:center}
.vbeads i.on{background:radial-gradient(circle at 35% 30%,#7bf0a8,#14794f);border-color:#0e5a3a;animation:bpopin .4s}
.vfly{position:fixed;left:50%;top:45%;font-size:42px;pointer-events:none;z-index:60;animation:vfly 1.1s ease-out forwards}
@keyframes vfly{from{transform:translate(-50%,0) scale(.6);opacity:1}to{transform:translate(-50%,-160px) scale(1.4);opacity:0}}
`;
document.head.appendChild(css);
function fly(e){const d=document.createElement('div');d.className='vfly';d.textContent=e;document.body.appendChild(d);setTimeout(()=>d.remove(),1200)}
const chime=()=>{try{[784,988,1319].forEach((f,i)=>tone(f,.14,'triangle',.13,i*.07))}catch(e){}};
const buzz=()=>{try{tone(330,.18,'sine',.1);tone(262,.25,'sine',.1,.15)}catch(e){}};

/* ---------- صندوق «اقرأ بصوتك» لنص واحد ----------
   el: العنصر، text: النص، opts: {quran, hide, pass:0.8, onResult(score,mode)} */
function reciteBox(el,text,opts={}){const T=words(text),raw=String(text).split(/\s+/).filter(Boolean);
  const pass=opts.pass||.8;let busy=false,mode=canCorrect()?'sr':'vad';
  el.innerHTML=`<div class="vx"><div class="tx ${opts.quran?'q':''} ${opts.hide?'hide':''}">${raw.map((w,k)=>`<span class="w" data-k="${k}">${w}</span>`).join(' ')}</div>
    <button class="vmic" aria-label="ابدأ القراءة بصوتك"><span class="ring"></span>🎤</button>
    <div class="vmsg">${B('اضغط','اضغطي')} على المايك و${B('اقرأ','اقرئي')} بصوتٍ واضح</div>
    <div class="vnote">${mode=='sr'?'✅ التطبيق يسمعك ويصحّح كلماتك':'🔈 جهازك لا يدعم تصحيح الكلمات (أو لا يوجد إنترنت). سنسمع صوتك فقط، وانتبه أنت للكلمات'}</div></div>`;
  const mic=el.querySelector('.vmic'),msg=el.querySelector('.vmsg'),ring=el.querySelector('.ring'),spans=[...el.querySelectorAll('.w')];
  // الكلمات المعروضة (مع التشكيل) قد تختلف في العدد عن الكلمات الموحّدة إذا كان فيها رموز وقف فقط
  const map=[];raw.forEach((w,k)=>{if(words(w).length)map.push(k)});
  const say=(t,c)=>{msg.className='vmsg '+(c||'');msg.textContent=t};
  const paint=ok=>{spans.forEach(s=>s.classList.remove('ok','no'));ok.forEach((v,i)=>{const s=spans[map[i]];if(s)s.classList.add(v?'ok':'no')})};
  mic.onclick=async()=>{if(busy){stopAll();if(vh){vh.stop();vh=null}return}
    busy=true;mic.classList.add('on');spans.forEach(s=>s.classList.remove('ok','no'));
    if(mode=='sr'){say(B('أسمعك… اقرأ الآن 👂','أسمعكِ… اقرئي الآن 👂'),'mid');
      const r=await hear((lv,partial)=>{ring.style.opacity=.9;ring.style.transform='scale(1.15)';setTimeout(()=>{ring.style.opacity=0;ring.style.transform='none'},180);
        if(partial){const c=compare(text,[partial]);c.ok.forEach((v,i)=>{const s=spans[map[i]];if(s&&v)s.classList.add('ok')})}});
      busy=false;mic.classList.remove('on');
      if(r.err){if(r.err=='not-allowed'||r.err=='service-not-allowed'){say('اسمح للتطبيق باستعمال المايك 🎤','bad')}
        else if(r.err=='network'||r.err=='nosr'||r.err=='start'||r.err=='language-not-supported'){mode='vad';el.querySelector('.vnote').textContent='🔈 تصحيح الكلمات يحتاج إنترنت. سنسمع صوتك فقط الآن.';say(B('اضغط المايك مرة أخرى','اضغطي المايك مرة أخرى'),'mid')}
        else say(B('لم أسمع شيئًا، اقترب من التلفون وارفع صوتك قليلًا','لم أسمع شيئًا، اقتربي من التلفون وارفعي صوتك قليلًا'),'mid');return}
      const c=compare(text,r.texts);paint(c.ok);const miss=c.ok.filter(v=>!v).length;
      if(c.score>=pass){chime();say(c.score==1?B('ممتاز! قرأتَها كلّها صحيحة 🌟','ممتاز! قرأتِها كلّها صحيحة 🌟'):B(`أحسنت! 👍 لكن انتبه ${miss==1?'للكلمة الحمراء':'للكلمات الحمراء'} وأعدها`,`أحسنتِ! 👍 لكن انتبهي ${miss==1?'للكلمة الحمراء':'للكلمات الحمراء'} وأعيديها`),'ok')}
      else{buzz();say(miss<=2?`قريب جدًا! ${B('انتبه','انتبهي')} للكلمات الحمراء ثم ${B('أعد','أعيدي')} 💪`:`${B('حاول','حاولي')} مرة أخرى، ${B('اقرأ','اقرئي')} على مهل 💪`,'bad')}
      opts.onResult&&opts.onResult(c.score,'sr',c)}
    else{say(B('أسمعك… اقرأ الآن، ثم اسكت قليلًا','أسمعكِ… اقرئي الآن، ثم اسكتي قليلًا'),'mid');
      try{vh=await vad({minMs:Math.min(2500,350*T.length),onLevel:(l,loud)=>{ring.style.opacity=loud?.9:0;ring.style.transform=`scale(${1+l*.35})`},
        onUtter:()=>{if(!vh)return;vh.stop();vh=null;busy=false;mic.classList.remove('on');ring.style.opacity=0;chime();
          say(B('سمعتك! أحسنت 👍 هل قرأتَ كل الكلمات صحيحة؟','سمعتكِ! أحسنتِ 👍 هل قرأتِ كل الكلمات صحيحة؟'),'ok');
          el.querySelector('.tx').classList.remove('hide');opts.onResult&&opts.onResult(1,'vad')}})}
      catch(e){busy=false;mic.classList.remove('on');say(micHelp(e)+' 🎤','bad')}}};
  let vh=null;
  return {stop(){stopAll();if(vh){vh.stop();vh=null}}}}

/* ---------- عدّاد صوتي: قلها ١٠ مرات ---------- */
function counter(el,{phrase,target=10,emoji='💚',onDone}){let n=0,vh=null,doneF=false;
  el.innerHTML=`<div class="vx"><div class="tx" style="font-size:24px">${phrase}</div>
    <div class="vcount" id="vcN">${ar(0)}</div><div class="vbeads">${Array.from({length:target},(_,k)=>`<i data-b="${k}"></i>`).join('')}</div>
    <button class="vmic" aria-label="ابدأ"><span class="ring"></span>🎤</button>
    <div class="vmsg">${B('اضغط المايك وقلها بصوتك، ثم اسكت لحظة بين كل مرة','اضغطي المايك وقوليها بصوتك، ثم اسكتي لحظة بين كل مرة')}</div></div>`;
  const mic=el.querySelector('.vmic'),ring=el.querySelector('.ring'),msg=el.querySelector('.vmsg');
  const bump=k=>{for(let i=0;i<k&&n<target;i++){n++;const b=el.querySelector(`[data-b="${n-1}"]`);if(b){b.classList.add('on');b.textContent=emoji}}
    el.querySelector('#vcN').textContent=ar(n);tone(523+n*60,.12,'triangle',.14);if(n%5==0)fly(emoji);
    if(n>=target&&!doneF){doneF=true;if(vh){vh.stop();vh=null}mic.classList.remove('on');msg.className='vmsg ok';msg.textContent=B('ما شاء الله! أكملتَ العدد 🌟','ما شاء الله! أكملتِ العدد 🌟');onDone&&onDone(n)}};
  mic.onclick=async()=>{if(doneF)return;if(vh){vh.stop();vh=null;mic.classList.remove('on');msg.textContent=B('توقّف المايك. اضغط لتكمل','توقّف المايك. اضغطي لتكملي');return}
    try{mic.classList.add('on');msg.className='vmsg mid';msg.textContent=B('أسمعك… قلها الآن 👂','أسمعكِ… قوليها الآن 👂');
      vh=await vad({minMs:600,onLevel:(l,loud)=>{ring.style.opacity=loud?.9:0;ring.style.transform=`scale(${1+l*.35})`},
        onUtter:d=>bump(Math.min(3,Math.max(1,Math.round(d/2600))))})}
    catch(e){mic.classList.remove('on');vh=null;msg.className='vmsg bad';msg.textContent=micHelp(e)}};
  return {stop(){if(vh){vh.stop();vh=null}}}}

window.Voice={norm,compare,hear,vad,reciteBox,counter,canCorrect,stop:stopAll,fly,chime};
})();
