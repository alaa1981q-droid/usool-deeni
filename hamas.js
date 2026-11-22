/* ✨ حماس (v18.3) — أشياء تحمّس الطفل وتعلّقه بالتطبيق، طلبها الشيخ («كلهم حلوين… اعمل مقترحاتك، بس لا تصير ثقيلة أو تعلّق»):
   ١) 🎙️ صوت الشيخ: المدير يسجّل من صفحة الإدارة (العبارة مكتوبة أمامه ويضغط المايك ويقرأ)، ويسمعها الطفل عند الإنجاز.
      voices/$k {a:dataURL,t} + voicesIdx/$k = t. الطفل يحمّل الصوت مرة واحدة ويحفظه في IndexedDB (لا يدخل في نسخة رمز الحفظ).
   ٢) 📜 شهاداتي: شهادة باسم الطفل (canvas، تُرسم عند الطلب فقط) لكل مرحلة، كل سورة، الكتاب كله، رمضان، البطاقات، الورد.
   ٣) 🌙 أبواب رمضان: ٣٠ بابًا، باب كل يوم (مهمة / سؤال / ذكر بالصوت)، جائزة العيد.
   ٤) 📝 مهمة من الأهل (من «للأهل»): الأهل يكتبون مهمة وجائزة، والطفل يضغط «خلّصتها» والأهل يؤكّدون.
   ٥) 🃏 بطاقاتي: ٣٠ بطاقة (أنبياء، أخلاق، أماكن مقدّسة) تنفتح بطاقة كل ٤ أعمال صالحة.
   ٦) 🎂 يوم ميلادي: من «ملفّي»، وفي يومه تهنئة + 💎٥٠ + بالونات.
   ٧) 🏫 صفّي: المعلّم ينشئ صفًّا برمز ٥ أرقام (classes/$c {n,t}) والطلاب ينضمّون (classm/$c/$uid {n,a,x,l,ts}).
   ٨) 🔔 تذكير يومي (تطبيق الأندرويد فقط، window.JannahApp) من «للأهل».
   كل شيء خفيف: لا مؤقّتات ثقيلة (فحص واحد كل ٥ ثوانٍ)، والرسم والتحميل عند الحاجة فقط. النصوص كتبها Claude والشيخ يراجعها. */
(function(){
const K='usul5_hamas_v1';
let hs={};try{hs=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(e){hs={}}
const hsave=()=>{try{localStorage.setItem(K,JSON.stringify(hs))}catch(e){}};
const $q=s=>document.querySelector(s);
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const esc=s=>String(s==null?'':s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'})[c]);
const arn=n=>typeof ar=='function'?ar(n):String(n);
const dk=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const API=()=>window.OnlineAPI;
const nick=()=>{const p=API()&&API().profile;return (p&&p.nick)||state.nick||state.name||''};
const C6=[['#dff5e3','#9fd3aa'],['#dcecff','#9dbde6'],['#ffe1ec','#e6a9bf'],['#fff3c4','#e3c56e'],['#ece3ff','#b9a6e6'],['#d9f5f1','#94d1c8']];
const PAL=i=>`--c:${C6[i%6][0]};--d:${C6[i%6][1]}`;
const addJ=n=>{try{Deco.addJ(n)}catch(e){}};
const grow=t=>{try{Aamal.grow(t)}catch(e){}};
const party=()=>{try{fanfare();confetti()}catch(e){}};
const isOn=id=>{const e=document.getElementById(id);return !!(e&&e.classList.contains('on'))};
const busy=()=>isOn('modal')||isOn('celebrate')||['quiz','contest','online','result'].some(isOn)||document.body.classList.contains('m3on')||!!$q('.gsov');
function toast(html,onTap){const d=document.createElement('button');d.className='hmtoast';d.innerHTML=html;document.body.appendChild(d);
  d.onclick=()=>{d.remove();onTap&&onTap()};setTimeout(()=>d.classList.add('on'),30);setTimeout(()=>{d.classList.remove('on');setTimeout(()=>d.remove(),400)},onTap?7000:3200)}

/* ---------- 🌙 التاريخ الهجري ---------- */
function hij(t=Date.now()){if(H.debugHij)return H.debugHij;
  try{const p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(new Date(t));
    const g=k=>parseInt((p.find(x=>x.type==k)||{}).value,10);return {d:g('day'),m:g('month'),y:g('year')}}catch(e){return null}}

const css=document.createElement('style');
css.textContent=`
.hmtoast{position:fixed;left:50%;bottom:96px;transform:translate(-50%,140%);z-index:100001;font:inherit;font-weight:800;font-size:15.5px;border:0;border-radius:18px;padding:10px 16px;max-width:92vw;
 background:linear-gradient(#fff6d6,#ffe9a3);color:#6b4a00;box-shadow:0 4px 0 #d9b552,0 10px 22px rgba(0,0,0,.22),inset 0 2px 0 #fff;transition:transform .35s cubic-bezier(.3,1.4,.5,1);cursor:pointer}
.hmtoast.on{transform:translate(-50%,0)}
.hvb{width:min(380px,94vw);box-sizing:border-box;position:fixed;left:50%;bottom:16px;transform:translate(-50%,160%);z-index:100000;display:flex;align-items:center;gap:10px;direction:rtl;
 background:linear-gradient(#1f7a50,#0e5a3a);color:#fff;border-radius:22px;padding:9px 12px 9px 10px;box-shadow:0 4px 0 #083b26,0 12px 26px rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.25);
 transition:transform .4s cubic-bezier(.3,1.4,.5,1);max-width:94vw}
.hvb.on{transform:translate(-50%,0)}
.hvb .av{width:44px;height:44px;border-radius:50%;background:radial-gradient(#fff3c4,#e3c56e);display:grid;place-items:center;font-size:26px;box-shadow:0 0 0 3px #f2d27a;flex:none}
.hvb.pl .av{animation:hvpulse 1s ease-in-out infinite}@keyframes hvpulse{50%{box-shadow:0 0 0 7px rgba(242,210,122,.45)}}
.hvb>div:nth-child(2){flex:1;min-width:0}.hvb b{display:block;font-size:15px;line-height:1.3}.hvb small{display:block;font-size:12.5px;color:#cfeedd;line-height:1.3}
.hvb .wv{display:flex;gap:3px;align-items:center;height:22px}.hvb .wv i{width:4px;height:6px;background:#ffe39a;border-radius:3px}
.hvb.pl .wv i{animation:hvw .9s ease-in-out infinite}.hvb .wv i:nth-child(2){animation-delay:.15s}.hvb .wv i:nth-child(3){animation-delay:.3s}.hvb .wv i:nth-child(4){animation-delay:.45s}
@keyframes hvw{50%{height:20px}}
.hvb button{font:inherit;border:0;border-radius:12px;background:rgba(255,255,255,.16);color:#fff;font-size:17px;width:34px;height:34px;cursor:pointer;flex:none}
.hmgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}
.hmgrid.c2{grid-template-columns:1fr 1fr}
.hmt{font:inherit;cursor:pointer;border:0;border-radius:16px;padding:8px 4px 7px;background:var(--c);color:#1d2b24;font-weight:800;font-size:13.5px;line-height:1.35;
 box-shadow:0 4px 0 var(--d),0 7px 14px rgba(0,0,0,.08),inset 0 2px 0 rgba(255,255,255,.8);display:flex;flex-direction:column;align-items:center;gap:2px;min-width:0}
.hmt:active{transform:translateY(3px);box-shadow:0 1px 0 var(--d)}
.hmt .e{font-size:28px;line-height:1.15}.hmt small{font-size:11.5px;font-weight:700;color:#4d5c54}
.hmt.lock{filter:grayscale(.85);opacity:.6}.hmt.today{outline:3px solid #f2b632;outline-offset:1px;animation:hmb 1.6s ease-in-out infinite}
@keyframes hmb{50%{transform:translateY(-3px)}}
.hmrow{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:10px 0 4px}
.hmrow .hmt{font-size:12.5px;padding:7px 2px 6px}.hmrow .hmt .e{font-size:24px}
.hmcard{width:210px;margin:6px auto;border-radius:22px;padding:16px 12px;background:linear-gradient(160deg,var(--c),#fff);box-shadow:0 6px 0 var(--d),0 14px 26px rgba(0,0,0,.15),inset 0 2px 0 #fff;
 animation:hmflip .8s cubic-bezier(.3,1.3,.5,1)}
@keyframes hmflip{from{transform:rotateY(90deg) scale(.6)}to{transform:none}}
.hmcard .e{font-size:64px;line-height:1.1}.hmcard b{display:block;font-size:20px;margin:6px 0 2px}.hmcard p{margin:0;font-size:15px;line-height:1.6}
.hmtile{grid-column:1/-1;font:inherit;cursor:pointer;display:flex;align-items:center;gap:10px;text-align:right;border:0;border-radius:18px;padding:9px 12px;
 background:linear-gradient(160deg,#1d3f74,#3a2a78);color:#fff;box-shadow:0 4px 0 #14254a,0 8px 16px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.25)}
.hmtile .e{font-size:30px}.hmtile b{display:block;font-size:15.5px}.hmtile small{display:block;font-size:12.5px;font-weight:700;color:#ffe39a}
.hmtile.ahl{background:linear-gradient(160deg,#fff3c4,#ffe39a);color:#5a3c00;box-shadow:0 4px 0 #e3c56e,0 8px 16px rgba(0,0,0,.1),inset 0 2px 0 #fff}.hmtile.ahl small{color:#7a5a10}
.hminp{font:inherit;width:100%;box-sizing:border-box;border:2px solid var(--line,#d8e5dc);border-radius:14px;padding:9px 12px;font-size:17px;margin:6px 0}
.hmsel{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0}
.hmsel button{font:inherit;font-weight:800;border:0;border-radius:12px;padding:6px 12px;background:#eef5f0;box-shadow:0 3px 0 #c9d8cf;cursor:pointer}
.hmsel button.on{background:#ffe39a;box-shadow:0 3px 0 #d9b552}
.hmlist{text-align:right;max-height:50vh;overflow:auto;margin:6px 0}
.hmlist div{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:12px;margin:4px 0;background:#f6faf7;font-weight:700}
.hmlist div.me{background:#fff3c4}.hmlist div span.n{flex:1}.hmlist div i{font-style:normal;color:#14794f;font-size:14px}
.hmlist div button{font:inherit;border:0;background:#ffe1ec;border-radius:10px;padding:2px 8px;cursor:pointer}
.hmcert{width:100%;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.2);margin:6px 0}
body.hbday #home .hero::after{content:'🎈🎂🎈';position:absolute;top:6px;left:10px;font-size:26px;animation:hmb 2s ease-in-out infinite;z-index:3}
/* 🎙️ مسجّل الشيخ */
.hvr{position:fixed;inset:0;z-index:100002;background:linear-gradient(#fbf6e8,#f3ead0);overflow:auto;direction:rtl;padding:12px 12px 30px;box-sizing:border-box}
.hvr h2{margin:4px 0;text-align:center;color:#5a3c00}.hvr .x{position:sticky;top:0;float:left;font:inherit;border:0;border-radius:12px;background:#0e5a3a;color:#fff;font-weight:800;padding:6px 12px;box-shadow:0 3px 0 #083b26;z-index:2}
.hvr .note{background:#fff;border-radius:14px;padding:8px 12px;font-size:14.5px;line-height:1.7;box-shadow:0 3px 0 #e6d9b0;margin:8px 0}
.hvr .hmt .st{font-size:11.5px;font-weight:800}.hvr .hmt.ok .st{color:#14794f}.hvr .hmt .st.no{color:#b5523a}
.hvtext{background:#fff;border-radius:18px;padding:14px 16px;font-size:23px;line-height:1.9;font-weight:800;color:#1d2b24;box-shadow:0 4px 0 #e6d9b0,inset 0 2px 0 #fff;margin:10px 0;text-align:center}
.hvmic{display:block;margin:14px auto 6px;width:120px;height:120px;border-radius:50%;border:0;font-size:52px;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;
 background:radial-gradient(#ff7a6b,#d63a2b);color:#fff;box-shadow:0 6px 0 #9c2418,0 14px 26px rgba(0,0,0,.25),inset 0 3px 0 rgba(255,255,255,.35)}
.hvmic.rec{animation:hvrec 1s ease-in-out infinite;background:radial-gradient(#ff4a3b,#b5170b)}@keyframes hvrec{50%{box-shadow:0 6px 0 #9c2418,0 0 0 16px rgba(255,74,59,.25)}}
.hvst{text-align:center;font-weight:800;font-size:17px;color:#5a3c00;min-height:28px}
.hvlv{height:10px;border-radius:6px;background:#eadfbf;overflow:hidden;margin:4px 30px}.hvlv i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3fbf6f,#f2b632);transition:width .08s}
.hvr .nav{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:8px}
`;
document.head.appendChild(css);

/* =====================================================================
   ١) 🎙️ صوت الشيخ
   ===================================================================== */
const VO=[
 ['wel','👋','أول ما يدخل التطبيق',
  'السلام عليكم يا بطل، أنا الشيخ علاء. أهلًا بك في جنّتي الصغيرة. تعلّم دينك، وابنِ بيتك في الجنة بأعمالك الصالحة.',
  'السلام عليكم يا بطلة، أنا الشيخ علاء. أهلًا بكِ في جنّتي الصغيرة. تعلّمي دينكِ، وابني بيتكِ في الجنة بأعمالكِ الصالحة.'],
 ['back','💚','يرجع بعد غياب ٣ أيام',
  'اشتقنا لك يا بطل! بيتك ومدينتك ينتظرونك. تعال نكمل رحلتنا.',
  'اشتقنا لكِ يا بطلة! بيتكِ ومدينتكِ ينتظرونكِ. تعالي نكمل رحلتنا.'],
 ['stage','🏅','ينجح في مرحلة من الكتاب',
  'ما شاء الله! نجحتَ في المرحلة يا بطل. أنا فخورٌ بك، واصل إلى المرحلة التالية.',
  'ما شاء الله! نجحتِ في المرحلة يا بطلة. أنا فخورٌ بكِ، واصلي إلى المرحلة التالية.'],
 ['all','🏆','يكمّل الكتاب كلّه',
  'مبارك يا بطل! أكملتَ أصول دينك الخمسة كلّها. صرتَ تعرف ربّك ونبيّك وإمامك. بارك الله فيك.',
  'مبارك يا بطلة! أكملتِ أصول دينكِ الخمسة كلّها. صرتِ تعرفين ربّكِ ونبيّكِ وإمامكِ. بارك الله فيكِ.'],
 ['hifz','📖','يحفظ سورة',
  'أحسنت يا بطل! حفظتَ سورةً جديدة من القرآن. القرآن نورٌ في قلبك، بارك الله فيك.',
  'أحسنتِ يا بطلة! حفظتِ سورةً جديدة من القرآن. القرآن نورٌ في قلبكِ، بارك الله فيكِ.'],
 ['level','⬆️','يرتفع مستواه',
  'مبروك! ارتفعت درجتك يا بطل. كل عملٍ صالح يرفعك، فاستمرّ.',
  'مبروك! ارتفعت درجتكِ يا بطلة. كل عملٍ صالح يرفعكِ، فاستمرّي.'],
 ['pray','🤲','يسجّل صلاته (مرة باليوم)',
  'تقبّل الله صلاتك يا بطل. حافظ على صلاتك في وقتها، فالله يحبّ المصلّين.',
  'تقبّل الله صلاتكِ يا بطلة. حافظي على صلاتكِ في وقتها، فالله يحبّ المصلّين.'],
 ['wird7','🔥','يداوم على الورد ٧ أيام',
  'ما شاء الله! سبعة أيامٍ وأنت مداومٌ على وردك. هكذا يكون الأبطال.',
  'ما شاء الله! سبعة أيامٍ وأنتِ مداومةٌ على وردكِ. هكذا تكون البطلات.'],
 ['hero','👑','يصير من أبطال الأسبوع',
  'مبارك! أنت من أبطال هذا الأسبوع. أنا فخورٌ بك جدًّا يا بطل.',
  'مبارك! أنتِ من بطلات هذا الأسبوع. أنا فخورٌ بكِ جدًّا يا بطلة.'],
 ['ahl','👨‍👩‍👧','يخلّص مهمة من أهله',
  'أحسنت يا بطل! أطعتَ أهلك وأسعدتهم، والله يحبّ من يبرّ والديه.',
  'أحسنتِ يا بطلة! أطعتِ أهلكِ وأسعدتِهم، والله يحبّ من يبرّ والديه.'],
 ['card','🃏','يجمع كل البطاقات',
  'ما شاء الله! جمعتَ كلّ البطاقات. أنت بطلٌ مجتهد، بارك الله فيك.',
  'ما شاء الله! جمعتِ كلّ البطاقات. أنتِ بطلةٌ مجتهدة، بارك الله فيكِ.'],
 ['bday','🎂','يوم ميلاده',
  'كل عامٍ وأنت بخير يا بطل! أسأل الله أن يجعل عمرك كلّه طاعةً وسعادة.',
  'كل عامٍ وأنتِ بخير يا بطلة! أسأل الله أن يجعل عمركِ كلّه طاعةً وسعادة.'],
 ['ram','🌙','أول ما يفتح التطبيق في رمضان',
  'رمضان كريم يا بطل! هذا شهر الخير. افتح باب رمضان كلّ يوم، واربح الجوائز.',
  'رمضان كريم يا بطلة! هذا شهر الخير. افتحي باب رمضان كلّ يوم، واربحي الجوائز.'],
 ['eid','🎉','في العيد',
  'عيدكم مبارك يا بطل! تقبّل الله صيامك وأعمالك، وكل عامٍ وأنت بخير.',
  'عيدكم مبارك يا بطلة! تقبّل الله صيامكِ وأعمالكِ، وكل عامٍ وأنتِ بخير.']];
const VK=k=>VO.find(v=>v[0]==k);
let vidx=hs.vi||{};   // آخر فهرس معروف: {key: time}
let idxLoaded=false;
/* IndexedDB صغير للأصوات */
let dbp=null;
const idb=()=>dbp||(dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('jannah_voice',1);r.onupgradeneeded=()=>r.result.createObjectStore('v');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}}));
async function iget(k){try{const d=await idb();return await new Promise(r=>{const q=d.transaction('v').objectStore('v').get(k);q.onsuccess=()=>r(q.result||null);q.onerror=()=>r(null)})}catch(e){return null}}
async function iput(k,v){try{const d=await idb();await new Promise(r=>{const t=d.transaction('v','readwrite');t.objectStore('v').put(v,k);t.oncomplete=r;t.onerror=r})}catch(e){}}
const vKey=k=>(!boy()&&vidx[k+'_g'])?k+'_g':k;
const hasV=k=>!!vidx[vKey(k)];
async function getAudio(k){const id=vKey(k),t=vidx[id];if(!t)return null;
  const c=await iget(id);if(c&&c.t===t)return c.a;
  const A=API();if(!A||!A.db||!navigator.onLine)return c?c.a:null;
  try{const v=(await A.db.ref('voices/'+id).get()).val();if(v&&v.a){await iput(id,{t:v.t||t,a:v.a});return v.a}}catch(e){}
  return c?c.a:null}
async function loadIdx(){const A=API();if(!A||!A.db||!A.me)return false;
  try{vidx=(await A.db.ref('voicesIdx').get()).val()||{};hs.vi=vidx;hsave();idxLoaded=true;prefetch();return true}catch(e){return false}}
async function prefetch(){for(const v of VO){const id=vKey(v[0]);if(!vidx[id])continue;const c=await iget(id);if(c&&c.t===vidx[id])continue;
  await getAudio(v[0]);await new Promise(r=>setTimeout(r,1200))}}
let cur=null,lastPlay=0;
/* play(k): يُسمِع الطفل صوت الشيخ لهذه المناسبة (إن كان مسجّلًا). يرجع true إذا بدأ. */
async function play(k,force){if(!hasV(k))return false;if(!force&&Date.now()-lastPlay<15000)return false;
  const a=await getAudio(k);if(!a)return false;lastPlay=Date.now();
  if(cur){try{cur.au.pause()}catch(e){}cur.el.remove();cur=null}
  const v=VK(k)||['','🎙️',''],el=document.createElement('div');el.className='hvb';
  el.innerHTML=`<div class="av">🎙️</div><div><b>🎙️ رسالة من الشيخ علاء</b><small>${v[1]} ${B('اسمع','اسمعي')} ما يقوله لك</small></div><div class="wv"><i></i><i></i><i></i><i></i></div><button class="pp" aria-label="تشغيل">▶</button><button class="cl" aria-label="إغلاق">✖</button>`;
  document.body.appendChild(el);setTimeout(()=>el.classList.add('on'),30);
  const au=new Audio(a);cur={au,el};
  const pp=el.querySelector('.pp'),end=()=>{el.classList.remove('on');setTimeout(()=>el.remove(),450);if(cur&&cur.el===el)cur=null};
  const go=()=>au.play().then(()=>{el.classList.add('pl');pp.textContent='⏸'}).catch(()=>{el.classList.remove('pl');pp.textContent='▶'});
  pp.onclick=()=>{if(au.paused)go();else{au.pause();el.classList.remove('pl');pp.textContent='▶'}};
  el.querySelector('.cl').onclick=()=>{try{au.pause()}catch(e){}end()};
  au.onended=()=>{el.classList.remove('pl');setTimeout(end,1200)};
  if(!state.mute)go();else setTimeout(end,12000);
  return true}

/* المسجّل (للمدير فقط) */
function recorder(){const A=API();if(!A||!A.db){toast('⚠️ تحتاج إنترنت');return}
  const ov=document.createElement('div');ov.className='hvr';document.body.appendChild(ov);
  let stream=null,mr=null,chunks=[],blob=null,url='',tStart=0,tick=null,ac=null,an=null,sx='b',curK='',mode='';
  const stopAll=()=>{clearInterval(tick);try{mr&&mr.state!='inactive'&&mr.stop()}catch(e){}try{stream&&stream.getTracks().forEach(t=>t.stop())}catch(e){}try{ac&&ac.close()}catch(e){}stream=null;ac=null};
  const close=()=>{stopAll();ov.remove()};
  async function list(){stopAll();let ix={};try{ix=(await A.db.ref('voicesIdx').get()).val()||{}}catch(e){}vidx=ix;hs.vi=ix;hsave();
    const n=VO.filter(v=>ix[v[0]]).length;
    ov.innerHTML=`<button class="x">✖ رجوع</button><h2>🎙️ صوتي للأطفال</h2>
     <div class="note">اختر المناسبة، ستظهر لك العبارة مكتوبة، <b>اضغط على المايك مع الاستمرار واقرأها</b>، ثم ارفع إصبعك. تسمعها، وإذا أعجبتك اضغط «احفظ» فتصل لكل الأطفال.<br>تستطيع أن تقول كلامك أنت أيضًا، العبارة للمساعدة فقط. 👦 للأولاد، و👧 للبنات (اختياري: إذا لم تسجّل للبنات يسمعن تسجيل الأولاد).<br>سجّلتَ <b>${arn(n)}</b> من ${arn(VO.length)}.</div>
     <div class="hmgrid">${VO.map((v,i)=>`<button class="hmt ${ix[v[0]]?'ok':''}" style="${PAL(i)}" data-k="${v[0]}"><span class="e">${v[1]}</span>${v[2]}<span class="st ${ix[v[0]]?'':'no'}">${ix[v[0]]?'✅ مسجّل':'⏺ لم يُسجّل'}${ix[v[0]+'_g']?' · 👧✅':''}</span></button>`).join('')}</div>`;
    ov.querySelector('.x').onclick=close;
    ov.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{sx='b';one(b.dataset.k)})}
  function one(k){stopAll();curK=k;blob=null;mode='';const v=VK(k),id=k+(sx=='g'?'_g':''),has=!!vidx[id];
    ov.innerHTML=`<button class="x">› القائمة</button><h2>${v[1]} ${v[2]}</h2>
     <div class="hmsel"><button data-sx="b" class="${sx=='b'?'on':''}">👦 للأولاد</button><button data-sx="g" class="${sx=='g'?'on':''}">👧 للبنات</button></div>
     <div class="hvtext">${esc(sx=='g'?v[4]:v[3])}</div>
     <button class="hvmic" id="hvMic" aria-label="سجّل">🎤</button>
     <div class="hvlv"><i id="hvLv"></i></div>
     <div class="hvst" id="hvSt">${has?'✅ عندك تسجيل محفوظ لهذه المناسبة':'اضغط المايك مع الاستمرار واقرأ العبارة'}</div>
     <div class="nav" id="hvNav">${has?`<button class="btn sec" id="hvOld">▶️ اسمع المحفوظ</button><button class="btn sec" id="hvDel">🗑️ احذفه</button>`:''}</div>`;
    ov.querySelector('.x').onclick=list;
    ov.querySelectorAll('[data-sx]').forEach(b=>b.onclick=()=>{sx=b.dataset.sx;one(k)});
    const old=$q('#hvOld');if(old)old.onclick=async()=>{old.disabled=true;try{const s=(await A.db.ref('voices/'+id).get()).val();if(s&&s.a)new Audio(s.a).play().catch(()=>{})}catch(e){}old.disabled=false};
    const del=$q('#hvDel');if(del)del.onclick=()=>{if(!confirm('تحذف هذا التسجيل؟'))return;Promise.all([A.db.ref('voices/'+id).remove(),A.db.ref('voicesIdx/'+id).remove()]).then(()=>{toast('حُذف ✓');delete vidx[id];one(k)}).catch(()=>toast('تعذّر الحذف'))};
    const mic=$q('#hvMic');let downAt=0;
    mic.onpointerdown=e=>{e.preventDefault();if(mode=='rec'){if(Date.now()-tStart>500)stop();return}downAt=Date.now();start()};
    const up=()=>{if(mode!='rec'||!downAt)return;const held=Date.now()-downAt;downAt=0;
      if(held<600){$q('#hvSt').textContent='🔴 يسجّل الآن… اضغط المايك مرة ثانية حتى توقف';return}stop()};
    mic.onpointerup=up;mic.onpointercancel=up;mic.oncontextmenu=e=>e.preventDefault()}
  async function start(){if(mode=='rec')return;mode='rec';chunks=[];
    try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1}})}
    catch(e){mode='';$q('#hvSt').textContent='⚠️ لم يُسمح بالمايك. اسمح للتطبيق باستعمال الميكروفون ثم جرّب';return}
    if(mode!='rec'){stopAll();return}
    const types=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4','audio/webm'];const mt=window.MediaRecorder&&types.find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t));
    try{mr=new MediaRecorder(stream,mt?{mimeType:mt,audioBitsPerSecond:24000}:{audioBitsPerSecond:24000})}catch(e){mode='';stopAll();$q('#hvSt').textContent='⚠️ هذا الجهاز لا يدعم التسجيل';return}
    mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
    mr.onstop=()=>{blob=new Blob(chunks,{type:mr.mimeType||mt||'audio/webm'});review()};
    mr.start(250);tStart=Date.now();$q('#hvMic').classList.add('rec');
    try{ac=new (window.AudioContext||window.webkitAudioContext)();an=ac.createAnalyser();an.fftSize=256;ac.createMediaStreamSource(stream).connect(an)}catch(e){an=null}
    const buf=new Uint8Array(128);
    tick=setInterval(()=>{const s=(Date.now()-tStart)/1000;const st=$q('#hvSt');if(st&&!/مرة ثانية/.test(st.textContent))st.textContent=`🔴 يسجّل… ${arn(Math.floor(s))} ثانية (ارفع إصبعك عند الانتهاء)`;
      if(an){an.getByteTimeDomainData(buf);let m=0;for(const x of buf)m=Math.max(m,Math.abs(x-128));const l=$q('#hvLv');if(l)l.style.width=Math.min(100,m*1.6)+'%'}
      if(s>=25)stop()},100)}
  function stop(){if(mode!='rec')return;mode='done';clearInterval(tick);const m=$q('#hvMic');if(m)m.classList.remove('rec');
    if(Date.now()-tStart<1000){stopAll();mode='';$q('#hvSt').textContent='قصير جدًا… اضغط مع الاستمرار وتكلّم';return}
    try{mr.stop()}catch(e){}try{stream.getTracks().forEach(t=>t.stop())}catch(e){}try{ac&&ac.close()}catch(e){}stream=null;ac=null}
  function review(){if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);const sec=Math.round((Date.now()-tStart)/1000);
    $q('#hvSt').textContent=`🎧 سجّلت ${arn(sec)} ثانية. اسمعه، ثم احفظه أو أعده`;
    $q('#hvNav').innerHTML=`<button class="btn sec" id="hvPl">▶️ اسمع</button><button class="btn gold" id="hvSv">✅ احفظ وأرسل للأطفال</button><button class="btn sec" id="hvRe">🔁 أعد</button>`;
    let au=null;$q('#hvPl').onclick=()=>{if(au)au.pause();au=new Audio(url);au.play().catch(()=>{})};
    $q('#hvRe').onclick=()=>{if(au)au.pause();one(curK)};
    $q('#hvSv').onclick=()=>{if(au)au.pause();const b=$q('#hvSv');b.disabled=true;b.textContent='⏳ يُرسل…';
      const fr=new FileReader();fr.onload=async()=>{const a=fr.result,id=curK+(sx=='g'?'_g':''),t=Date.now();
        if(a.length>240000){b.disabled=false;b.textContent='✅ احفظ وأرسل للأطفال';$q('#hvSt').textContent='⚠️ التسجيل طويل، اجعله أقصر';return}
        try{await A.db.ref('voices/'+id).set({a,t});await A.db.ref('voicesIdx/'+id).set(t);vidx[id]=t;hs.vi=vidx;hsave();await iput(id,{t,a});
          toast('✅ حُفظ صوتك ووصل للأطفال');list()}
        catch(e){b.disabled=false;b.textContent='✅ احفظ وأرسل للأطفال';$q('#hvSt').textContent='⚠️ تعذّر الحفظ. هل نشرت القواعد الجديدة في Firebase؟'}};
      fr.readAsDataURL(blob)}}
  list()}

/* =====================================================================
   ٢) 📜 الشهادات
   ===================================================================== */
const SURN={1:'الحمد',114:'الناس',113:'الفلق',112:'التوحيد',111:'المسد',110:'النصر',109:'الكافرون',108:'الكوثر',107:'الماعون',106:'قريش',105:'الفيل',103:'العصر'};
const ORD=['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة'];
function certs(){const L=[];
  try{STAGES.forEach((s,i)=>{if(state.stars[s.id]>0)L.push({id:'st'+i,e:'🏅',t:'المرحلة '+(ORD[i]||arn(i+1)),l:`${B('أتمّ','أتمّت')} المرحلة ${ORD[i]||arn(i+1)} من كتاب «أصول ديني الخمسة»: ${s.title}`})})}catch(e){}
  try{if(allDone())L.push({id:'all',e:'🏆',t:'الكتاب كلّه',l:`${B('أتمّ','أتمّت')} رحلة «أصول ديني الخمسة» كلّها: التوحيد والعدل والنبوّة والإمامة والمعاد`})}catch(e){}
  try{const h=JSON.parse(localStorage.getItem('usul5_hifz_v1')||'{}').done||{};Object.keys(h).forEach(n=>{if(SURN[n])L.push({id:'hz'+n,e:'📖',t:'سورة '+SURN[n],l:`${B('حفظ','حفظت')} سورة ${SURN[n]} من القرآن الكريم`})})}catch(e){}
  const w=(state.wird&&state.wird.best)||0;if(w>=7)L.push({id:'wd'+(w>=30?30:7),e:'🔥',t:'الورد اليومي',l:`${B('داوم','داومت')} على الورد اليومي ${arn(w>=30?30:7)} أيام متتالية`});
  Object.entries(hs.ramY||{}).forEach(([y,n])=>{if(n>=15)L.push({id:'rm'+y,e:'🌙',t:'أبواب رمضان '+arn(y),l:`${B('فتح','فتحت')} ${arn(n)} بابًا من أبواب رمضان بالأعمال الصالحة (${arn(y)} هـ)`})});
  if(cardsN()>=CARDS.length)L.push({id:'cards',e:'🃏',t:'البطاقات كلّها',l:`${B('جمع','جمعت')} بطاقات «جنّتي الصغيرة» كلّها بأعماله الصالحة`.replace('بأعماله',B('بأعماله','بأعمالها'))});
  return L}
function askName(then){modal(`<div style="font-size:46px">✏️</div><h3 style="margin:2px 0">ما ${B('اسمك','اسمكِ')}؟</h3><p>نكتبه على ${B('شهادتك','شهادتكِ')}</p><input class="hminp" id="hmNm" maxlength="30" placeholder="الاسم">
  <div class="nav"><button class="btn gold" id="hmNmOk">اكتب شهادتي</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{
  $q('#hmNmOk').onclick=()=>{const v=$q('#hmNm').value.trim();if(!v)return;state.name=v;save();closeModal();then()}})}
async function drawCert(c){const W=1400,H=990,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  try{await Promise.all([document.fonts.load('800 60px Tajawal'),document.fonts.load('700 30px Tajawal')])}catch(e){}
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#fffdf4');g.addColorStop(1,'#fbf0d2');x.fillStyle=g;x.fillRect(0,0,W,H);
  const rr=(a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
  x.lineWidth=14;x.strokeStyle='#c9a227';rr(28,28,W-56,H-56,30);x.stroke();
  x.lineWidth=4;x.strokeStyle='#14794f';rr(52,52,W-104,H-104,22);x.stroke();
  x.lineWidth=2;x.strokeStyle='#e3c56e';rr(64,64,W-128,H-128,18);x.stroke();
  // نجوم الزوايا
  const star=(cx,cy,r,col)=>{x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,rad=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad)}x.closePath();x.fillStyle=col;x.fill()};
  [[100,100],[W-100,100],[100,H-100],[W-100,H-100]].forEach(([a,b])=>{star(a,b,34,'#c9a227');star(a,b,16,'#14794f')});
  // زخرفة خفيفة
  x.globalAlpha=.07;for(let i=0;i<9;i++)star(W/2+(i-4)*150,H/2+((i%2)?140:-140),60,'#14794f');x.globalAlpha=1;
  x.direction='rtl';x.textAlign='center';x.textBaseline='alphabetic';
  x.fillStyle='#14794f';x.font='700 30px Tajawal, sans-serif';x.fillText('🌙 جنّتي الصغيرة · أصول ديني الخمسة',W/2,140);
  const tg=x.createLinearGradient(0,170,0,260);tg.addColorStop(0,'#e0b330');tg.addColorStop(1,'#9a6f0c');
  x.fillStyle=tg;x.font='800 92px Tajawal, sans-serif';x.fillText('شهادة تقدير',W/2,255);
  x.fillStyle='#3d4a43';x.font='700 34px Tajawal, sans-serif';x.fillText(`يسرّ الشيخ علاء المطوري أن يمنح ${B('البطل','البطلة')}`,W/2,340);
  const nm=nick()||state.name||'';x.font='800 84px Tajawal, sans-serif';let fs=84;while(x.measureText(nm).width>W-300&&fs>40){fs-=4;x.font=`800 ${fs}px Tajawal, sans-serif`}
  x.fillStyle='#0e5a3a';x.fillText(nm,W/2,455);
  x.strokeStyle='#e3c56e';x.lineWidth=3;x.beginPath();x.moveTo(W/2-330,485);x.lineTo(W/2+330,485);x.stroke();
  x.fillStyle='#3d4a43';x.font='700 34px Tajawal, sans-serif';x.fillText('هذه الشهادة لأنّه'.replace('لأنّه',B('لأنّه','لأنّها')),W/2,550);
  // سطر الإنجاز (يلفّ على سطرين)
  x.fillStyle='#1d2b24';x.font='800 42px Tajawal, sans-serif';const words=c.l.split(' '),lines=[];let ln='';
  words.forEach(w=>{const t=ln?ln+' '+w:w;if(x.measureText(t).width>W-280){lines.push(ln);ln=w}else ln=t});if(ln)lines.push(ln);
  lines.slice(0,3).forEach((l,i)=>x.fillText(l,W/2,620+i*60));
  x.fillStyle='#5a6b62';x.font='700 32px Tajawal, sans-serif';x.fillText(`${B('بارك الله فيه','بارك الله فيها')}، وجعله من أهل العلم والعمل الصالح`.replace('وجعله',B('وجعله','وجعلها')),W/2,735);
  let hd='',gd='';try{hd=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){}
  try{gd=new Intl.DateTimeFormat('ar-IQ',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){}
  x.textAlign='right';x.fillStyle='#14794f';x.font='700 26px Tajawal, sans-serif';x.fillText(hd,W-140,850);x.fillStyle='#5a6b62';x.fillText(gd,W-140,885);
  // الختم والتوقيع
  x.textAlign='center';const sx=250,sy=845;x.beginPath();x.arc(sx,sy,64,0,7);const sg=x.createRadialGradient(sx-15,sy-15,8,sx,sy,64);sg.addColorStop(0,'#f6dc7c');sg.addColorStop(1,'#b8860b');x.fillStyle=sg;x.fill();
  x.lineWidth=4;x.strokeStyle='#fff3c4';x.beginPath();x.arc(sx,sy,52,0,7);x.stroke();x.font='54px sans-serif';x.fillText(c.e,sx,sy+19);
  x.strokeStyle='#c9a227';x.lineWidth=2;x.beginPath();x.moveTo(W/2-170,815);x.lineTo(W/2+170,815);x.stroke();x.fillStyle='#0e5a3a';x.font='800 36px Tajawal, sans-serif';x.fillText('الشيخ علاء المطوري',W/2,860);x.fillStyle='#8a7a50';x.font='700 22px Tajawal, sans-serif';x.fillText('مؤلّف كتاب «أصول ديني الخمسة»',W/2,895);
  return cv}
async function showCert(c){if(!nick()&&!state.name)return askName(()=>showCert(c));
  modal(`<div style="font-size:40px">📜</div><p>⏳ تُكتب ${B('شهادتك','شهادتكِ')}…</p>`);
  const cv=await drawCert(c),url=cv.toDataURL('image/jpeg',.9);party();
  modal(`<h3 style="margin:2px 0">📜 ${B('شهادتك','شهادتكِ')}: ${esc(c.t)}</h3><img class="hmcert" src="${url}" alt="شهادة">
   <p class="tip" style="margin:4px 0">${B('أرسلها','أرسليها')} لأهلك، أو ${B('احتفظ','احتفظي')} بها 🌟</p>
   <div class="nav"><button class="btn gold" id="hmShare">📤 أرسل الشهادة</button><button class="btn sec" id="hmSave">⬇️ احفظها</button></div><div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`,()=>{
    const file=()=>new Promise(r=>cv.toBlob(b=>r(new File([b],'shahada.jpg',{type:'image/jpeg'})),'image/jpeg',.9));
    const dl=()=>{const a=document.createElement('a');a.href=url;a.download='shahada.jpg';document.body.appendChild(a);a.click();a.remove();toast(B('📸 إذا لم تُحفظ، صوّر الشاشة','📸 إذا لم تُحفظ، صوّري الشاشة'))};
    $q('#hmShare').onclick=async()=>{try{const f=await file();if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'شهادة تقدير',text:'🌙 شهادتي من «جنّتي الصغيرة»'});return}}catch(e){if(e&&e.name=='AbortError')return}dl()};
    $q('#hmSave').onclick=dl})}
function openCerts(){const L=certs();
  modal(`<div style="font-size:44px">📜</div><h3 style="margin:2px 0">${B('شهاداتي','شهاداتي')}</h3>
   ${L.length?`<p style="margin:2px 0 4px;font-size:15px">${B('اضغط','اضغطي')} على الشهادة لتراها ${B('وترسلها','وترسليها')} لأهلك</p><div class="hmgrid">${L.map((c,i)=>`<button class="hmt" style="${PAL(i)}" data-c="${i}"><span class="e">${c.e}</span>${esc(c.t)}</button>`).join('')}</div>`
   :`<p>${B('انجح','انجحي')} في مرحلة من دروس الكتاب، أو ${B('احفظ','احفظي')} سورة، لتحصل على أول شهادة باسمك 🌟</p>`}
   <div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`,()=>{
    document.querySelectorAll('#modalIn [data-c]').forEach(b=>b.onclick=()=>showCert(L[+b.dataset.c]))})}
function certCheck(){const L=certs();hs.cs=hs.cs||null;
  if(!hs.cs){hs.cs=L.map(c=>c.id);hsave();return}
  const nw=L.filter(c=>!hs.cs.includes(c.id));if(!nw.length)return;
  hs.cs=hs.cs.concat(nw.map(c=>c.id));hsave();
  const c=nw[nw.length-1];setTimeout(()=>toast(`📜 ${B('شهادة جديدة باسمك','شهادة جديدة باسمكِ')}: ${esc(c.t)} ← ${B('اضغط','اضغطي')} هنا`,()=>showCert(c)),2500)}

/* =====================================================================
   ٥) 🃏 البطاقات
   ===================================================================== */
const CARDS=[
 ['🌍','آدم عليه السلام','أوّل إنسان وأوّل نبي، خلقه الله وعلّمه الأسماء كلّها.'],
 ['💛','الصدق','الصادق يحبّه الله والناس، ولا يقول إلّا الحقّ.'],
 ['🕋','الكعبة المشرّفة','بيت الله الحرام في مكّة، نتّجه إليها في صلاتنا.'],
 ['⛵','نوح عليه السلام','صنع السفينة بأمر الله، فنجّى الله المؤمنين من الطوفان.'],
 ['🤝','الأمانة','الأمين يحفظ ما يُعطى له، ويُرجع الأشياء لأصحابها.'],
 ['🔥','إبراهيم عليه السلام','خليل الله، نجّاه الله من النار، وبنى الكعبة مع ابنه إسماعيل.'],
 ['❤️','برّ الوالدين','نطيع أبوينا ونحسن إليهما، ونقول لهما الكلمة الطيّبة.'],
 ['🌙','المسجد النبوي','مسجد النبي محمد ﷺ في المدينة المنوّرة.'],
 ['🐑','إسماعيل عليه السلام','ابن إبراهيم، كان صابرًا مطيعًا لأبيه ولربّه.'],
 ['🐱','الرحمة بالحيوان','نُطعم الحيوان ونسقيه ولا نؤذيه، والله يحبّ الرحماء.'],
 ['🌾','يوسف عليه السلام','صبر على ما أصابه، ثم عفا عن إخوته وسامحهم.'],
 ['👋','إفشاء السلام','نبدأ الناس بالسلام: السلام عليكم ورحمة الله.'],
 ['🔦','غار حراء','الغار الذي كان النبي ﷺ يتعبّد فيه، وفيه نزل عليه الوحي.'],
 ['🪄','موسى عليه السلام','كليم الله، أرسله إلى فرعون، ونجّاه الله وقومه.'],
 ['🙏','الشكر','نشكر الله على نعمه، ونشكر كلّ من يُحسن إلينا.'],
 ['📜','داود عليه السلام','آتاه الله الزبور، وكان يسبّح الله بصوتٍ جميل.'],
 ['⏳','الصبر','الصابر لا يغضب ولا ييأس، والله مع الصابرين.'],
 ['🐜','سليمان عليه السلام','آتاه الله ملكًا عظيمًا، وعلّمه منطق الطير.'],
 ['🧼','النظافة','نظافة الجسم والثياب والبيت من الإيمان.'],
 ['🐋','يونس عليه السلام','دعا ربّه في بطن الحوت، فنجّاه الله.'],
 ['🏡','الإحسان إلى الجار','نُكرم جارنا ولا نؤذيه، ونساعده إذا احتاج.'],
 ['🏛️','المسجد الأقصى','في القدس، أولى القبلتين، أسرى الله بنبيّه إليه.'],
 ['🌿','أيّوب عليه السلام','صبر على المرض سنين طويلة، فشفاه الله وأكرمه.'],
 ['👴','احترام الكبير','نوقّر الكبير ونساعده، ونعطف على الصغير.'],
 ['🕊️','عيسى عليه السلام','آتاه الله الإنجيل، وكان رحيمًا يشفي المرضى بإذن الله.'],
 ['🤐','حفظ اللسان','لا نقول كلمةً سيّئة، ولا نكذب ولا نغتاب أحدًا.'],
 ['⛰️','جبل عرفات','يقف عليه الحجّاج يوم عرفة يدعون الله.'],
 ['🌸','التواضع','المتواضع لا يتكبّر على أحد، ويحبّ الناس جميعًا.'],
 ['👪','صلة الرحم','نزور أقاربنا ونسأل عنهم: الجدّ والجدّة والأعمام والأخوال.'],
 ['🌟','محمد ﷺ','خاتم الأنبياء ورحمة للعالمين، أرسله الله بالإسلام.']];
const deeds=()=>{try{return (Aamal.d&&Aamal.d.gN)||0}catch(e){return 0}};
const cardsN=()=>Math.min(CARDS.length,1+Math.floor(deeds()/4)+((hs.cb|0)));
function showCard(i,isNew){const c=CARDS[i];
  modal(`${isNew?`<h3 style="margin:2px 0;color:#14794f">🃏 ${B('ربحتَ','ربحتِ')} بطاقة جديدة!</h3>`:''}<div class="hmcard" style="${PAL(i)}"><div class="e">${c[0]}</div><b>${c[1]}</b><p>${c[2]}</p></div>
   <p style="font-size:14px;color:var(--muted);margin:4px 0">البطاقة ${arn(i+1)} من ${arn(CARDS.length)}</p>
   <div class="nav">${isNew?`<button class="btn gold" id="hmAlb">🃏 ألبومي</button>`:''}<button class="btn sec" data-close>${isNew?'الحمد لله 🤲':'إغلاق'}</button></div>`,()=>{const a=$q('#hmAlb');if(a)a.onclick=openCards});
  if(isNew)party()}
function openCards(){const n=cardsN(),left=4-deeds()%4;
  modal(`<div style="font-size:40px">🃏</div><h3 style="margin:2px 0">بطاقاتي: ${arn(n)} من ${arn(CARDS.length)}</h3>
   <p style="margin:2px 0;font-size:14.5px">${n<CARDS.length?`كل ٤ أعمال صالحة تفتح بطاقة جديدة · باقي ${arn(left)} 🤲`:'ما شاء الله! جمعتَ البطاقات كلّها 🌟'.replace('جمعتَ',B('جمعتَ','جمعتِ'))}</p>
   <div class="hmgrid">${CARDS.map((c,i)=>i<n?`<button class="hmt" style="${PAL(i)}" data-cd="${i}"><span class="e">${c[0]}</span>${c[1]}</button>`:`<button class="hmt lock" style="${PAL(i)}" disabled><span class="e">🔒</span>؟</button>`).join('')}</div>
   <div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`,()=>{document.querySelectorAll('#modalIn [data-cd]').forEach(b=>b.onclick=()=>showCard(+b.dataset.cd))})}
function cardCheck(){const n=cardsN();if(hs.cn==null){hs.cn=n;hsave();return}
  if(n<=hs.cn||busy()||!isOn('home'))return;
  const i=hs.cn;hs.cn=i+1;hsave();showCard(i,1);
  if(hs.cn>=CARDS.length&&!hs.cdone){hs.cdone=1;hsave();addJ(100);setTimeout(()=>{toast('🃏 جمعتَ كل البطاقات! 💎 +١٠٠'.replace('جمعتَ',B('جمعتَ','جمعتِ')));play('card',1)},1500)}}

/* =====================================================================
   ٣) 🌙 أبواب رمضان
   ===================================================================== */
const RT=[ // [نوع، نص] — do: مهمة يقوم بها، q: سؤال، sal/tas: ذكر بالصوت ×١٠
 ['do','🍽️ ساعد أهلك في تحضير مائدة الإفطار'],['sal',''],['q',''],
 ['do','🤲 ادعُ لأمّك وأبيك قبل أذان المغرب'],['tas',''],['q',''],
 ['do','💝 تصدّق بشيءٍ ولو قليل، أو أعطِ لعبةً لمن يحتاج'],['sal',''],['q',''],
 ['do','🧹 رتّب غرفتك بنفسك بلا أن يطلب منك أحد'],['tas',''],['q',''],
 ['do','📞 اتّصل بجدّك أو جدّتك وسلّم عليهما'],['sal',''],['q',''],
 ['do','😊 ابتسم في وجه كلّ من تلقاه اليوم'],['tas',''],['q',''],
 ['do','🤐 احفظ لسانك اليوم من كلّ كلمةٍ سيّئة'],['sal',''],['q',''],
 ['do','🌴 قدّم التمر والماء لأهلك عند الإفطار'],['tas',''],['q',''],
 ['do','🍲 لا تُسرف في الطعام، واترك صحنك نظيفًا'],['sal',''],['q',''],
 ['do','🎁 ساعد أهلك في ترتيب البيت استعدادًا للعيد'],['tas',''],['q','']];
const girlT=t=>t.replace('ساعد','ساعدي').replace('ادعُ','ادعي').replace('تصدّق','تصدّقي').replace('أعطِ','أعطي').replace('رتّب','رتّبي').replace('غرفتك','غرفتكِ').replace('يطلب منك','يطلب منكِ')
  .replace('اتّصل','اتّصلي').replace('جدّك','جدّكِ').replace('جدّتك','جدّتكِ').replace('سلّم','سلّمي').replace('ابتسم','ابتسمي').replace('تلقاه','تلقينه').replace('احفظ لسانك','احفظي لسانكِ')
  .replace('قدّم','قدّمي').replace('لأهلك','لأهلكِ').replace('لا تُسرف','لا تُسرفي').replace('اترك صحنك','اتركي صحنكِ').replace('أهلك','أهلكِ').replace('لأمّك','لأمّكِ').replace('أبيك','أبيكِ').replace('وجه كلّ','وجه كلّ');
const ramNow=()=>{const h=hij();return h&&h.m==9?h:null};
const eidNow=()=>{const h=hij();return h&&h.m==10&&h.d<=3?h:null};
const preRam=()=>{const h=hij();return h&&h.m==8&&h.d>=20?h:null};
function ramDoors(y){hs.ram=hs.ram||{};if(hs.ram.y!==y){hs.ram={y,o:{}}}return hs.ram.o}
function openRam(){const h=ramNow();if(!h){const p=preRam();modal(`<div style="font-size:50px">🌙</div><h3 style="margin:2px 0">أبواب رمضان</h3><p>${p?`باقي ${arn(30-p.d)} يوم تقريبًا على رمضان 🌙<br>`:''}في رمضان ينفتح كل يوم بابٌ فيه عملٌ صالح وجائزة 🎁</p><div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`);return}
  const o=ramDoors(h.y),n=Object.keys(o).length;
  modal(`<div style="font-size:40px">🌙</div><h3 style="margin:2px 0">أبواب رمضان · اليوم ${arn(h.d)}</h3>
   <p style="margin:2px 0;font-size:14.5px">${B('فتحتَ','فتحتِ')} ${arn(n)} من ٣٠ بابًا · إذا ${B('فتحتَ','فتحتِ')} ١٥ بابًا أو أكثر ${B('تربح','تربحين')} 💎١٠٠ وشهادة في العيد 🎉</p>
   <div class="hmgrid" style="grid-template-columns:repeat(5,1fr);gap:6px">${Array.from({length:30},(_,i)=>{const d=i+1,dn=o[d],fu=d>h.d;
     return `<button class="hmt ${fu?'lock':''} ${d==h.d&&!dn?'today':''}" style="${PAL(i)};padding:6px 2px" data-d="${d}" ${fu?'disabled':''}><span class="e" style="font-size:22px">${dn?'⭐':fu?'🔒':'🚪'}</span>${arn(d)}</button>`}).join('')}</div>
   <div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`,()=>{document.querySelectorAll('#modalIn [data-d]').forEach(b=>b.onclick=()=>door(+b.dataset.d))})}
function door(d){const h=ramNow();if(!h||d>h.d)return;const o=ramDoors(h.y);
  if(o[d]){toast(`⭐ ${B('فتحتَ','فتحتِ')} هذا الباب من قبل`);return}
  const late=d<h.d,J=late?5:10,[ty,tx]=RT[(d-1)%RT.length];
  const finish=()=>{o[d]=1;hs.ramY=hs.ramY||{};hs.ramY[h.y]=Object.keys(o).length;hsave();addJ(J);if(ty=='do')grow('akhlaq');party();
    modal(`<div style="font-size:54px">⭐</div><h3 style="margin:2px 0">ما شاء الله! ${B('فتحتَ','فتحتِ')} باب اليوم ${arn(d)}</h3><p>💎 +${arn(J)} ${late?'(باب متأخّر)':''}<br>تقبّل الله ${B('منك','منكِ')} 🤍</p><div class="nav"><button class="btn gold" id="hmRB">🌙 الأبواب</button><button class="btn sec" data-close>الحمد لله 🤲</button></div>`,()=>{$q('#hmRB').onclick=openRam})};
  if(ty=='do'){modal(`<div style="font-size:46px">🚪</div><h3 style="margin:2px 0">باب اليوم ${arn(d)}</h3><div class="hvtext" style="font-size:20px">${esc(boy()?tx:girlT(tx))}</div>
     <p style="font-size:14px;margin:2px 0">${B('اعمله','اعمليه')}، ثم ${B('اضغط','اضغطي')} «${B('عملتُه','عملتُه')}». الله يراك ويحبّ الصادقين 🤍</p>
     <div class="nav"><button class="btn gold" id="hmDo">✅ عملتُه</button><button class="btn sec" id="hmRB">رجوع</button></div>`,()=>{$q('#hmDo').onclick=finish;$q('#hmRB').onclick=openRam});return}
  if(ty=='q'){let pool=[];try{pool=ALLQ.filter(q=>q.t=='mcq'&&q.o&&q.o.length>=2)}catch(e){}
    if(!pool.length){finish();return}const q=pool[(h.y*31+d*7)%pool.length],opts=q.o.map((t,k)=>({t,ok:k==q.a})).sort((a,b)=>((a.t.length*7+d)%5)-((b.t.length*7+d)%5));
    modal(`<div style="font-size:42px">❓</div><h3 style="margin:2px 0">سؤال الباب ${arn(d)}</h3><div class="hvtext" style="font-size:19px">${esc(q.q)}</div>
     <div class="hmgrid c2" style="grid-template-columns:1fr">${opts.map((x,k)=>`<button class="hmt" style="${PAL(k)};font-size:16px;padding:10px" data-o="${k}">${esc(x.t)}</button>`).join('')}</div><div class="fb" id="hmFb"></div>`,()=>{
      document.querySelectorAll('#modalIn [data-o]').forEach(b=>b.onclick=()=>{const x=opts[+b.dataset.o];
        if(x.ok){try{Voice.chime()}catch(e){}setTimeout(finish,300)}else{b.disabled=true;b.style.opacity=.45;const f=$q('#hmFb');f.className='fb bad';f.textContent=B('حاول مرة ثانية 🌱','حاولي مرة ثانية 🌱')}})});return}
  const sal=ty=='sal',ph=sal?'اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ':'سُبْحَانَ اللَّهِ';
  modal(`<h3 style="margin:2px 0">🚪 باب اليوم ${arn(d)}: ${sal?'الصلاة على محمد وآل محمد':'التسبيح'} ×١٠</h3><div id="hmVc"></div><div class="nav"><button class="btn sec" id="hmRB">رجوع</button></div>`,()=>{
    $q('#hmRB').onclick=()=>{try{Voice.stop()}catch(e){}openRam()};
    try{Voice.counter($q('#hmVc'),{phrase:ph,target:10,emoji:sal?'💚':'📿',onDone:()=>{try{Voice.stop()}catch(e){}try{Aamal.add&&Aamal.add(sal?'sal':'tas',10)}catch(e){}setTimeout(finish,500)}})}catch(e){finish()}})}
function ramTile(){let t=$q('#hmRam');const h=ramNow(),p=preRam();
  if(!h&&!p){if(t)t.remove();return}
  if(!t){t=document.createElement('button');t.id='hmRam';t.className='hmtile';t.onclick=openRam}
  const o=h?ramDoors(h.y):{},td=h&&o[h.d];
  t.innerHTML=`<span class="e">🌙</span><span><b>${h?'أبواب رمضان':'رمضان قادم'}</b><small>${h?(td?`⭐ ${B('فتحتَ','فتحتِ')} باب اليوم · ${arn(Object.keys(o).length)} من ٣٠`:`🚪 باب اليوم ${arn(h.d)} ينتظرك!`):`باقي ${arn(30-p.d)} يوم تقريبًا 🌙`}</small></span>`;
  place(t)}
function place(t){const home=$q('#home');if(!home)return;const ref=$q('#gSearch')||$q('#openBayt');if(ref&&ref.parentNode===home){if(t.previousElementSibling!==ref&&!(t.previousElementSibling&&t.previousElementSibling.classList.contains('hmtile')))ref.after(t)}else if(!t.parentNode)home.prepend(t)}
function feasts(){const h=ramNow();if(h&&hs.vram!==h.y){if(play('ram',1)){}hs.vram=h.y;hsave()}
  const e=eidNow();if(e){if(hs.veid!==e.y){hs.veid=e.y;hsave();play('eid',1)}
    const n=(hs.ramY||{})[e.y]|0;if(n>=15&&hs.eidJ!==e.y&&!busy()){hs.eidJ=e.y;hsave();addJ(100);party();
      modal(`<div style="font-size:56px">🎉</div><h3 style="margin:2px 0">عيدكم مبارك!</h3><p>${B('فتحتَ','فتحتِ')} ${arn(n)} بابًا من أبواب رمضان 🌙<br>هذه ${B('جائزتك','جائزتكِ')}: 💎 ١٠٠ وشهادة باسمك</p><div class="nav"><button class="btn gold" id="hmEc">📜 شهادتي</button><button class="btn sec" data-close>الحمد لله 🤲</button></div>`,
        ()=>{$q('#hmEc').onclick=()=>{const c=certs().find(c=>c.id=='rm'+e.y);if(c)showCert(c)}})}}}

/* =====================================================================
   ٤) 📝 مهمة من الأهل
   ===================================================================== */
function mathGate(title,then){const a=6+Math.floor(Math.random()*4),b=6+Math.floor(Math.random()*4);
  modal(`<div style="font-size:42px">👨‍👩‍👧</div><h3 style="margin:2px 0">${title}</h3><p>للكبار فقط، اكتب الجواب:<br><b style="font-size:24px">${arn(a)} × ${arn(b)} = ؟</b></p>
   <input class="hminp" id="hmG" inputmode="numeric" autocomplete="off" style="width:120px;text-align:center"><div class="fb" id="hmGm"></div>
   <div class="nav"><button class="btn gold" id="hmGo">تأكيد</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    const go=()=>{const v=String($q('#hmG').value).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).trim();if(+v===a*b){closeModal();then()}else{const m=$q('#hmGm');m.className='fb bad';m.textContent='جواب غير صحيح'}};
    $q('#hmGo').onclick=go;$q('#hmG').onkeydown=e=>{if(e.key=='Enter')go()};setTimeout(()=>$q('#hmG')&&$q('#hmG').focus(),80)})}
function parentTask(){const t=hs.task;
  modal(`<div style="font-size:44px">📝</div><h3 style="margin:2px 0">مهمة لطفلي</h3>
   ${t?`<p style="background:#fff3c4;border-radius:12px;padding:6px">المهمة الحالية: <b>${esc(t.t)}</b> · 💎${arn(t.j)}${t.st=='wait'?'<br>⏳ يقول إنّه أنجزها، تنتظر تأكيدكم':''}</p>`:''}
   <p style="margin:2px 0;font-size:15px">اكتبوا مهمة يقوم بها في البيت (مثل: رتّب ألعابك، ساعد أختك، صلِّ الظهر في وقتها). تظهر له في الواجهة، وعندما ينجزها تؤكّدونها فيربح الجائزة.</p>
   <input class="hminp" id="hmTk" maxlength="60" placeholder="المهمة">
   <div class="hmsel" id="hmTj">${[5,10,20,30].map((v,i)=>`<button data-j="${v}" class="${i==1?'on':''}">💎 ${arn(v)}</button>`).join('')}</div>
   <div class="nav"><button class="btn gold" id="hmTs">📝 أرسل المهمة</button>${t?'<button class="btn sec" id="hmTx">🗑️ احذف الحالية</button>':''}</div><div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`,()=>{
    let j=10;document.querySelectorAll('#hmTj button').forEach(b=>b.onclick=()=>{j=+b.dataset.j;document.querySelectorAll('#hmTj button').forEach(x=>x.classList.toggle('on',x===b))});
    $q('#hmTs').onclick=()=>{const v=$q('#hmTk').value.trim();if(!v){$q('#hmTk').focus();return}hs.task={t:v,j,st:'on',ts:Date.now()};hsave();closeModal();toast('✅ وصلت المهمة لطفلكم');taskTile()};
    const x=$q('#hmTx');if(x)x.onclick=()=>{delete hs.task;hsave();closeModal();taskTile()}})}
function taskTile(){let el=$q('#hmTask');const t=hs.task;if(!t){if(el)el.remove();return}
  if(!el){el=document.createElement('button');el.id='hmTask';el.className='hmtile ahl';el.onclick=taskOpen}
  el.innerHTML=`<span class="e">📝</span><span><b>مهمة من أهلك: ${esc(t.t)}</b><small>${t.st=='wait'?'⏳ ينتظر تأكيد بابا أو ماما':`🎁 الجائزة 💎 ${arn(t.j)} · ${B('اضغط','اضغطي')} عندما ${B('تنجزها','تنجزينها')}`}</small></span>`;place(el)}
function taskOpen(){const t=hs.task;if(!t)return;
  if(t.st=='wait'){modal(`<div style="font-size:44px">⏳</div><h3 style="margin:2px 0">${esc(t.t)}</h3><p>${B('نادِ','نادي')} بابا أو ماما ليؤكّدوا أنك ${B('أنجزتها','أنجزتِها')} 🤍</p>
     <div class="nav"><button class="btn gold" id="hmOk">👨‍👩‍👧 تأكيد الأهل</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{$q('#hmOk').onclick=()=>mathGate('هل أنجز المهمة؟',taskDone)});return}
  modal(`<div style="font-size:44px">📝</div><h3 style="margin:2px 0">مهمة من أهلك</h3><div class="hvtext" style="font-size:20px">${esc(t.t)}</div><p>الجائزة: 💎 ${arn(t.j)}</p>
   <div class="nav"><button class="btn gold" id="hmDn">✅ ${B('أنجزتُها','أنجزتُها')}</button><button class="btn sec" data-close>ليس بعد</button></div>`,()=>{
    $q('#hmDn').onclick=()=>{t.st='wait';hsave();taskTile();closeModal();toast(B('👏 الآن نادِ أهلك ليؤكّدوا','👏 الآن نادي أهلكِ ليؤكّدوا'))}})}
function taskDone(){const t=hs.task;if(!t)return;delete hs.task;hs.tasksN=(hs.tasksN|0)+1;hsave();taskTile();addJ(t.j);grow('akhlaq');party();
  modal(`<div style="font-size:56px">🌟</div><h3 style="margin:2px 0">${B('أحسنت','أحسنتِ')}! ${B('أسعدتَ','أسعدتِ')} أهلك</h3><p>💎 +${arn(t.j)}<br>برّ الوالدين من أحبّ الأعمال إلى الله 🤍</p><div class="nav"><button class="btn sec" data-close>الحمد لله 🤲</button></div>`);
  setTimeout(()=>play('ahl',1),700)}

/* =====================================================================
   ٦) 🎂 يوم الميلاد
   ===================================================================== */
const MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function bdayPick(back){const b=hs.bd||{};
  modal(`<div style="font-size:46px">🎂</div><h3 style="margin:2px 0">يوم ميلادي</h3><p style="margin:2px 0">في يوم ميلادك ${B('تصلك','تصلكِ')} تهنئة وهديّة 🎁</p>
   <div style="display:flex;gap:8px;justify-content:center"><select class="hminp" id="hmBd" style="width:90px">${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${b.d==i+1?'selected':''}>${arn(i+1)}</option>`).join('')}</select>
   <select class="hminp" id="hmBm" style="width:140px">${MON.map((m,i)=>`<option value="${i+1}" ${b.m==i+1?'selected':''}>${m}</option>`).join('')}</select></div>
   <div class="nav"><button class="btn gold" id="hmBs">💾 احفظ</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    $q('#hmBs').onclick=()=>{hs.bd={d:+$q('#hmBd').value,m:+$q('#hmBm').value,y:(hs.bd||{}).y||0};
      const n=new Date();if(hs.bd.d==n.getDate()&&hs.bd.m==n.getMonth()+1)hs.bd.y=n.getFullYear(); // لا هدية إذا اختاره اليوم نفسه
      hsave();closeModal();toast('🎂 حُفظ يوم ميلادك');back&&back()}})}
const bdayToday=()=>{const b=hs.bd,n=new Date();return b&&b.d==n.getDate()&&b.m==n.getMonth()+1};
function bdayCheck(){document.body.classList.toggle('hbday',!!bdayToday());
  if(!bdayToday())return;const y=new Date().getFullYear();if(hs.bd.y===y||busy()||!isOn('home'))return;
  hs.bd.y=y;hsave();addJ(50);party();setTimeout(()=>{try{confetti()}catch(e){}},1400);
  const nm=nick();modal(`<div style="font-size:64px">🎂</div><h3 style="margin:2px 0">كل عام ${B('وأنت','وأنتِ')} بخير${nm?' يا '+esc(nm):''}! 🎈</h3><p>اليوم يوم ${B('ميلادك','ميلادكِ')} 🎉<br>هديّة جنّتي الصغيرة: 💎 ٥٠<br>جعل الله عمرك كلّه طاعةً وسعادة 🤍</p><div class="nav"><button class="btn sec" data-close>شكرًا 🤲</button></div>`);
  setTimeout(()=>play('bday',1),900)}

/* =====================================================================
   ٧) 🏫 صفّي
   ===================================================================== */
async function db(){const A=API();if(!A)throw 0;if(!A.db||!A.me){await A.init()}if(!A.db||!A.me)throw 0;return A}
function needName(){toast(B('✏️ اكتب اسمك أولًا من «ملفّي»','✏️ اكتبي اسمكِ أولًا من «ملفّي»'));try{API().editProfile(openClass)}catch(e){}}
async function openClass(){if(!navigator.onLine){toast('⚠️ تحتاج إنترنت');return}
  modal(`<div style="font-size:40px">🏫</div><p>⏳ …</p>`);let A;try{A=await db()}catch(e){modal(`<p>تعذّر الاتصال، جرّب بعد قليل</p><div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`);return}
  const c=hs.cls;if(!c)return classJoin(A);board(A)}
function classJoin(A){
  modal(`<div style="font-size:44px">🏫</div><h3 style="margin:2px 0">صفّي</h3><p style="margin:2px 0">عندك رمز صفّ من ${B('معلّمك','معلّمتك')}؟ ${B('اكتبه','اكتبيه')} هنا وتنافس مع زملائك 🌟</p>
   <input class="hminp" id="hmCc" inputmode="numeric" maxlength="5" placeholder="رمز الصفّ (٥ أرقام)" style="text-align:center;font-size:22px;letter-spacing:4px"><div class="fb" id="hmCm"></div>
   <div class="nav"><button class="btn gold" id="hmCj">🏫 انضمّ للصفّ</button></div>
   <div class="nav"><button class="btn sec" id="hmCt">👩‍🏫 أنا معلّم: أنشئ صفًّا</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    $q('#hmCj').onclick=async()=>{const v=String($q('#hmCc').value).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/\D/g,'');const m=$q('#hmCm');
      if(v.length!=5){m.className='fb bad';m.textContent='الرمز ٥ أرقام';return}
      if(!A.profile)return needName();
      try{const s=(await A.db.ref('classes/'+v).get()).val();if(!s){m.className='fb bad';m.textContent='ما وجدنا صفًّا بهذا الرمز';return}
        hs.cls={c:v,n:s.n};hsave();await pushMe(A);toast('🏫 انضممتَ إلى '.replace('انضممتَ',B('انضممتَ','انضممتِ'))+s.n);board(A)}catch(e){m.className='fb bad';m.textContent='تعذّر الانضمام'}};
    $q('#hmCt').onclick=()=>mathGate('إنشاء صفّ للمعلّم',()=>classMake(A))})}
function classMake(A){
  modal(`<div style="font-size:44px">👩‍🏫</div><h3 style="margin:2px 0">صفّ جديد</h3><p style="margin:2px 0">اكتب اسم الصفّ، نعطيك رمزًا ترسله لطلّابك</p><input class="hminp" id="hmCn" maxlength="30" placeholder="مثال: الصف الثالث - أ">
   <div class="nav"><button class="btn gold" id="hmCk">✅ أنشئ الصفّ</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    $q('#hmCk').onclick=async()=>{const n=$q('#hmCn').value.trim().slice(0,30);if(!n)return;const b=$q('#hmCk');b.disabled=true;
      try{let code='';for(let i=0;i<6;i++){const k=String(10000+Math.floor(Math.random()*90000));if(!(await A.db.ref('classes/'+k).get()).exists()){code=k;break}}
        if(!code)throw 0;await A.db.ref('classes/'+code).set({n,t:A.me,ts:Date.now()});hs.cls={c:code,n,t:1};hsave();board(A)}
      catch(e){b.disabled=false;toast('تعذّر إنشاء الصفّ')}}})}
async function pushMe(A){const c=hs.cls;if(!c||c.t||!A.profile)return;
  let s={x:0,L:1};try{s=Alqab.snap()}catch(e){}
  try{await A.db.ref('classm/'+c.c+'/'+A.me).set({n:A.profile.nick,a:A.profile.av||'',x:s.x|0,l:s.L|0,ts:Date.now()})}catch(e){}}
async function board(A){const c=hs.cls;await pushMe(A);let rows=[];
  try{const s=(await A.db.ref('classm/'+c.c).get()).val()||{};rows=Object.entries(s).map(([id,v])=>({id,...v})).sort((a,b)=>(b.x|0)-(a.x|0)).slice(0,80)}catch(e){}
  if(!c.t&&!rows.some(r=>r.id==A.me)&&rows.length){/* أُخرج من الصفّ */}
  const md=['🥇','🥈','🥉'];
  modal(`<div style="font-size:40px">🏫</div><h3 style="margin:2px 0">${esc(c.n)}</h3><p style="margin:0;font-size:14px">رمز الصفّ: <b style="font-size:20px;letter-spacing:2px">${arn(c.c)}</b> · ${arn(rows.length)} ${rows.length>10?'طالبًا':'طلّاب'}</p>
   <div class="hmlist">${rows.length?rows.map((r,i)=>`<div class="${r.id==A.me?'me':''}"><span>${md[i]||arn(i+1)}</span><span>${esc(r.a||'🙂')}</span><span class="n">${esc(r.n)}</span><i>✨ ${arn(r.x|0)}</i>${c.t?`<button data-rm="${r.id}" aria-label="أخرجه">✖</button>`:''}</div>`).join(''):'<p style="text-align:center">لا يوجد طلّاب بعد. أرسل الرمز لطلّابك ليكتبوه في «ملفّي ← صفّي».</p>'}</div>
   <div class="nav">${c.t?'<button class="btn gold" id="hmCs">📤 أرسل الرمز للطلّاب</button>':''}<button class="btn sec" id="hmCl">${c.t?'🗑️ اترك إدارة الصفّ':'🚪 اخرج من الصفّ'}</button></div><div class="nav"><button class="btn sec" data-close>إغلاق</button></div>`,()=>{
    const s=$q('#hmCs');if(s)s.onclick=()=>{const t=`🏫 انضمّوا إلى صفّ «${c.n}» في تطبيق جنّتي الصغيرة:\nافتحوا «ملفّي» ← «🏫 صفّي» واكتبوا الرمز: ${c.c}\nhttps://alaa1981q-droid.github.io/usool-deeni/`;
      if(navigator.share)navigator.share({text:t}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')};
    $q('#hmCl').onclick=async()=>{if(!confirm(c.t?'تترك إدارة هذا الصفّ على هذا الجهاز؟':'تخرج من الصفّ؟'))return;if(!c.t){try{await A.db.ref('classm/'+c.c+'/'+A.me).remove()}catch(e){}}delete hs.cls;hsave();closeModal()};
    document.querySelectorAll('#modalIn [data-rm]').forEach(b=>b.onclick=async()=>{if(!confirm('تُخرج هذا الطالب من الصفّ؟'))return;try{await A.db.ref('classm/'+c.c+'/'+b.dataset.rm).remove();board(A)}catch(e){toast('تعذّر')}})})}

/* =====================================================================
   ٨) 🔔 التذكير اليومي (الأندرويد)
   ===================================================================== */
const RMSG=['🌳 أشجار مدينتك عطشانة، تعال اسقِها!','📖 وِردك اليومي ينتظرك، ٥ أسئلة فقط','🏡 بيتك في الجنة يكبر بأعمالك، تعال نكمل','🤲 هل سجّلت صلواتك اليوم؟','🎁 صندوق اليوم فيه جواهر لك','🃏 بطاقة جديدة قريبة، اعمل عملًا صالحًا'];
function reminder(){const J=window.JannahApp,cur=hs.rem;
  if(!J){modal(`<div style="font-size:44px">🔔</div><h3 style="margin:2px 0">تذكير يومي</h3><p>التذكير اليومي يعمل في <b>تطبيق الأندرويد</b> فقط: يصل لطفلكم إشعار لطيف كل يوم في الوقت الذي تختارونه.<br>من المتصفّح لا يمكن إرسال إشعار والتطبيق مغلق.</p><div class="nav"><button class="btn sec" data-close>حسنًا</button></div>`);return}
  const H=[[16,'٤ العصر'],[17,'٥ العصر'],[18,'٦ المساء'],[19,'٧ المساء'],[20,'٨ المساء']];
  modal(`<div style="font-size:44px">🔔</div><h3 style="margin:2px 0">تذكير يومي لطفلي</h3><p style="margin:2px 0">إشعار لطيف كل يوم يذكّره بورده وأعماله (مثل: «أشجار مدينتك عطشانة»)</p>
   <div class="hmsel">${H.map(([h,n])=>`<button data-h="${h}" class="${cur&&cur.h==h?'on':''}">${n}</button>`).join('')}</div>
   <p style="font-size:14px;margin:4px 0">${cur?`✅ التذكير مفعّل الساعة ${(H.find(x=>x[0]==cur.h)||[0,''])[1]}`:'التذكير مطفأ'}</p>
   <div class="nav">${cur?'<button class="btn sec" id="hmRo">🔕 أطفئ التذكير</button>':''}<button class="btn sec" data-close>إغلاق</button></div>`,()=>{
    document.querySelectorAll('#modalIn [data-h]').forEach(b=>b.onclick=()=>{const h=+b.dataset.h;try{J.remind(h,7,RMSG.join('|'))}catch(e){}hs.rem={h};hsave();closeModal();toast('🔔 فُعّل التذكير اليومي')});
    const o=$q('#hmRo');if(o)o.onclick=()=>{try{J.cancelRemind()}catch(e){}delete hs.rem;hsave();closeModal();toast('🔕 أُطفئ التذكير')}})}

/* =====================================================================
   الربط بالتطبيق
   ===================================================================== */
// المرحلة: celebrate تُنادى عند النجاح
const oCel=window.celebrate;if(typeof oCel=='function')window.celebrate=function(){const r=oCel.apply(this,arguments);setTimeout(()=>play('stage'),900);setTimeout(certCheck,400);return r};
const oCert=window.openCert;if(typeof oCert=='function')window.openCert=function(){const r=oCert.apply(this,arguments);if(!hs.vall){if(hasV('all')){hs.vall=1;hsave();setTimeout(()=>play('all',1),800)}}
  setTimeout(()=>{const b=document.querySelector('#certBody .nav');if(b&&!$q('#hmCertImg')){b.insertAdjacentHTML('afterbegin','<button class="btn gold" id="hmCertImg">📤 شهادة بصورة جميلة</button>');$q('#hmCertImg').onclick=()=>{const c=certs().find(c=>c.id=='all');if(c)showCert(c)}}},50);return r};
// الحفظ والصلاة
function hookGrow(){if(!window.Aamal||Aamal._hm)return;const g=Aamal.grow.bind(Aamal);Aamal._hm=1;
  Aamal.grow=function(k){const r=g.apply(null,arguments);
    try{if(k=='hifz')setTimeout(()=>play('hifz',1),1500);
      if(k=='pray'&&hs.vpr!==dk()&&hasV('pray')){hs.vpr=dk();hsave();setTimeout(()=>play('pray'),1200)}
      setTimeout(certCheck,2500)}catch(e){}return r}}
// المستوى وبطل الأسبوع: من النافذة نفسها
let mo=null;function hookModal(){const m=$q('#modalIn');if(!m||mo)return;mo=new MutationObserver(()=>{const t=m.textContent||'';
  if(m.querySelector('.lvup')&&/ارتفعت درجتك/.test(t))play('level');
  else if(/بطل الأسبوع!|بطلة الأسبوع!|بين أبطال الأسبوع/.test(t)&&hs.vhero!==dk()){hs.vhero=dk();hsave();play('hero',1)}});mo.observe(m,{childList:true})}
// ملفّي: صفّ أزرار صغيرة
function hookProfile(){const b=$q('#aqBody');if(!b||b._hm)return;b._hm=1;
  new MutationObserver(()=>{if($q('#hmProf'))return;const at=b.querySelector('.aqtabs');if(!at)return;
    at.insertAdjacentHTML('beforebegin',`<div class="hmrow" id="hmProf">
      <button class="hmt" style="${PAL(3)}" data-pp="c"><span class="e">📜</span>شهاداتي</button>
      <button class="hmt" style="${PAL(4)}" data-pp="k"><span class="e">🃏</span>بطاقاتي<small>${arn(cardsN())}/${arn(CARDS.length)}</small></button>
      <button class="hmt" style="${PAL(1)}" data-pp="s"><span class="e">🏫</span>صفّي</button>
      <button class="hmt" style="${PAL(2)}" data-pp="b"><span class="e">🎂</span>ميلادي${hs.bd?`<small>${arn(hs.bd.d)} ${MON[hs.bd.m-1]}</small>`:''}</button></div>`);
    $q('#hmProf').onclick=e=>{const x=e.target.closest('[data-pp]');if(!x)return;const k=x.dataset.pp;
      if(k=='c')openCerts();else if(k=='k')openCards();else if(k=='s')openClass();else bdayPick(()=>{try{Alqab.openProfile()}catch(e){}})}}).observe(b,{childList:true})}
// «المزيد»
function hookMore(){const m=$q('#wjMoreBody');if(!m||$q('#hmMore'))return;
  m.insertAdjacentHTML('beforeend',`<div class="hmrow" id="hmMore" style="grid-template-columns:repeat(3,1fr)">
    <button class="hmt" style="${PAL(3)}" data-mm="c"><span class="e">📜</span>شهاداتي</button><button class="hmt" style="${PAL(4)}" data-mm="k"><span class="e">🃏</span>بطاقاتي</button><button class="hmt" style="${PAL(1)}" data-mm="s"><span class="e">🏫</span>صفّي</button></div>`);
  $q('#hmMore').onclick=e=>{const x=e.target.closest('[data-mm]');if(!x)return;const k=x.dataset.mm;if(k=='c')openCerts();else if(k=='k')openCards();else openClass()}}
// الواجهة
function homeBits(){ramTile();taskTile()}
const oRH=window.renderHome;if(typeof oRH=='function')window.renderHome=function(){const r=oRH.apply(this,arguments);try{homeBits()}catch(e){}return r};

// صوت الترحيب / العودة
const lastOpen=hs.lo||0;hs.lo=Date.now();hsave();
function greet(){if(busy()||!isOn('home'))return;
  if(!hs.vwel&&hasV('wel')){if(Date.now()-lastPlay>15000){hs.vwel=1;hsave();play('wel',1)}return}
  if(lastOpen&&Date.now()-lastOpen>3*864e5&&!hs.vback0&&hasV('back')){hs.vback0=1;play('back',1)}}

let ticks=0;
function loop(){ticks++;try{
  if(!idxLoaded&&ticks%2==0&&navigator.onLine)loadIdx();
  if(ticks==2)certCheck();
  if(ticks>=2&&ticks%2==0){cardCheck();bdayCheck()}
  if(ticks>=3)greet();
  if(ticks%6==3)feasts();
  const w=state.wird;if(w&&w.last==(new Date().toDateString())&&w.streak>0&&w.streak%7==0&&hs.vw7!==dk()&&hasV('wird7')&&!busy()){hs.vw7=dk();hsave();play('wird7',1)}
  if(ticks%12==0)homeBits();
  if(ticks%120==10&&hs.cls&&!hs.cls.t){const A=API();if(A&&A.db&&A.profile)pushMe(A)}
}catch(e){}}
function init(){hookGrow();hookModal();hookProfile();hookMore();homeBits();bdayCheck();setInterval(loop,5000)}
if(document.readyState=='complete')setTimeout(init,300);else addEventListener('load',()=>setTimeout(init,300));

const H={play,recorder,openCerts,showCert,certs,openCards,openRam,parentTask,reminder,openClass,bdayPick,debugHij:null,_hs:()=>hs,_reload:loadIdx,VO};
window.Hamas=H;
})();
