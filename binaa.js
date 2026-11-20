/* 🧱 ورشة بناء البيت (v8.2): أجزاء البيت تُلمَس كلٌّ وحده وتتطوّر بمستويات، والبناء يأخذ وقتًا والعمّال يعملون بجانبه.
   - السور (٣ مستويات: خشب ← حجر ← رخام بذهب)، ثم حديقة البيت (عشب ← ورود وممرّ ← نافورة)، ثم ٣ أشجار (شتلة ← شجرة ← شجرة مثمرة).
   - كل ترقية: إمّا بالجواهر 💎، وإمّا بعمل صالح (تسبيح أو صلاة على محمد وآل محمد بالصوت). بعدها يبدأ البناء بوقت، وعدد العمّال = المستوى.
   - «⚡ عجّل»: صلِّ على محمد وآل محمد ١٠ مرات فينتهي البناء فورًا. ورشة واحدة في الوقت نفسه.
   - الحالة محلية (usul5_binaa_v1)، والرمز u (٥ أرقام) يُنشر مع البيت فيراه الأصدقاء. الرسم في bayt.js (houseSVG). */
(function(){
const KEY='usul5_binaa_v1',MIN=60e3;
let st={w:0,g:0,t:[0,0,0],hp:0,job:null};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)st=Object.assign(st,s)}catch(e){}
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const SAL={k:'sal',p:'اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',e:'💚',n:'صلِّ على محمد وآل محمد'},TAS={k:'tas',p:'سُبْحَانَ اللَّهِ',e:'📿',n:'سبّح الله'};
// [اسم المستوى، الجواهر، العمل الصالح، عدد المرات، الوقت بالدقائق]
const PARTS={
  w:{n:'سور البيت',e:'🧱',lv:[['سور خشبي',40,TAS,10,1],['سور من الحجر',120,SAL,10,15],['سور رخام بزخارف ذهبية',300,SAL,30,60]]},
  g:{n:'بستان البيت',e:'🌳',need:()=>st.w>=1?'':'ابنِ السور أولًا 🧱',lv:[['بستان أخضر بسياج من الشجيرات',40,TAS,10,2],['ورود وممرّ حجري',120,SAL,10,20],['نافورة وفوانيس',300,SAL,30,60]]},
  t0:{n:'شجرة التفّاح',e:'🍎',need:()=>st.g>=1?'':'ازرع البستان أولًا 🌳',lv:[['شتلة صغيرة',20,TAS,10,1],['شجرة خضراء',60,SAL,10,10],['شجرة تفّاح مثمرة',150,TAS,30,40]]},
  t1:{n:'شجرة الرمّان',e:'🍒',need:()=>st.g>=1?'':'ازرع البستان أولًا 🌳',lv:[['شتلة صغيرة',20,TAS,10,1],['شجرة خضراء',60,SAL,10,10],['شجرة رمّان مثمرة',150,TAS,30,40]]},
  t2:{n:'شجرة البرتقال',e:'🍊',need:()=>st.g>=1?'':'ازرع البستان أولًا 🌳',lv:[['شتلة صغيرة',20,TAS,10,1],['شجرة خضراء',60,SAL,10,10],['شجرة برتقال مثمرة',150,TAS,30,40]]},
  // (v15.2) طلب الشيخ: 🏥 مستشفى المدينة يُبنى بعمل صالح أو بالجواهر (أو مجانًا بالانتظار)، ويظهر في المدينة المجسّمة
  hp:{n:'مستشفى المدينة',e:'🏥',lv:[['مستوصف صغير',60,SAL,10,5],['مستشفى بطابقين',150,TAS,30,20],['مستشفى كبير بسيارة إسعاف',300,SAL,30,60]]}};
const lvOf=p=>p=='w'?st.w:p=='g'?st.g:p=='hp'?(st.hp|0):st.t[+p[1]];
const setLv=(p,v)=>{if(p=='w')st.w=v;else if(p=='g')st.g=v;else if(p=='hp')st.hp=v;else st.t[+p[1]]=v};
const code=()=>`${st.w}${st.g}${st.t.join('')}${st.hp?st.hp:''}`; // الرقم السادس (إن وُجد) = المستشفى
const mmss=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${ar(h)}:${ar(String(m).padStart(2,'0'))}:${ar(String(x).padStart(2,'0'))}`:`${ar(m)}:${ar(String(x).padStart(2,'0'))}`};
const tm=m=>m>=60?(m==60?'ساعة':`${ar(m/60)} ساعات`):m==1?'دقيقة':m==2?'دقيقتان':m<=10?`${ar(m)} دقائق`:`${ar(m)} دقيقة`;

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
.bnhint{display:flex;align-items:center;gap:8px;margin-top:8px;padding:7px 12px;border-radius:16px;background:linear-gradient(160deg,#fff,#fff5dc 90%);border:1.5px solid #efd99a;box-shadow:0 3px 0 #efd99a;font-weight:800;font-size:14px;color:#7a5200}
.bnhint .e{font-size:24px}.bnhint.job{background:linear-gradient(160deg,#fff,#e7f1fd 90%);border-color:#bcd5f3;box-shadow:0 3px 0 #bcd5f3;color:#1d4e9e;cursor:pointer}
.bnm .lvs{display:flex;gap:6px;justify-content:center;margin:6px 0}.bnm .lvs span{flex:1;border-radius:12px;padding:5px 2px;font-size:12.5px;font-weight:800;background:#f1f4f2;border:1.5px solid #dde6e0;color:#8a958f}
.bnm .lvs span.on{background:linear-gradient(160deg,#fff,#e8f6ee);border-color:#1fa463;color:#0b5a32;box-shadow:0 3px 0 #bfe3cc}
.bnm .nx{background:linear-gradient(160deg,#fff,#fff5dc);border:1.5px solid #efd99a;border-radius:16px;padding:8px;margin:6px 0;box-shadow:0 3px 0 #efd99a}
.bnm .nx b{display:block;font-size:17px;color:#7a5200}.bnm .nx small{font-size:13.5px;font-weight:700;color:#5e4a33}
.bnm .pay{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.bnm .pay button{border:0;border-radius:16px;padding:10px;font:inherit;font-weight:800;font-size:16px;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.25)}
.bnm .pay .pw{background:linear-gradient(160deg,#a7b4ad,#6f8078)}.bnm .pay .pj{background:linear-gradient(160deg,#4fb3f0,#2f6fd0)}.bnm .pay .pd{background:linear-gradient(160deg,#3fbf6f,#14794f)}.bnm .pay .pf{background:linear-gradient(160deg,#f6b33d,#e0731f)}
.bnm .pay button[disabled]{opacity:.45}
.bnm .clock{font-size:30px;font-weight:900;color:#1d4e9e;margin:4px 0}.bnm .pbar{height:12px;border-radius:8px;background:#e3ecf7;overflow:hidden}.bnm .pbar i{display:block;height:100%;background:linear-gradient(90deg,#4fb3f0,#2f6fd0);border-radius:8px}
.bhouse [data-up]{cursor:pointer}
/* v8.8: الزينة الكثيرة (ورود، سيارة، مصابيح…) كانت تغطّي السور فلا يُلمس، خاصة عند المدير. الآن لا يلتقط اللمس إلا أجزاء الورشة */
#byBody .bhouse svg *,.wv .bhouse svg *{pointer-events:none}#byBody .bhouse svg [data-up],#byBody .bhouse svg [data-up] *,.wv .bhouse svg [data-up],.wv .bhouse svg [data-up] *{pointer-events:auto}
.bhouse .bn-mk{animation:bnmk 1.3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes bnmk{50%{transform:translateY(-3px) scale(1.12)}}
.bhouse .bn-hm{animation:bnhm .45s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:0% 100%}@keyframes bnhm{from{transform:rotate(-35deg)}to{transform:rotate(25deg)}}
.bhouse .bn-dust{animation:bndu 1.1s ease-out infinite;transform-box:fill-box;transform-origin:center}@keyframes bndu{0%{opacity:.8;transform:scale(.4)}100%{opacity:0;transform:scale(1.6) translateY(-6px)}}
.bhouse .bn-bob{animation:bnbob .38s ease-in-out infinite alternate}@keyframes bnbob{to{transform:translateY(-1.4px)}}
.bhouse .bn-walk{animation:bnwalk 5s linear infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes bnwalk{0%{transform:translateX(0) scaleX(1)}44%{transform:translateX(24px) scaleX(1)}50%{transform:translateX(24px) scaleX(-1)}94%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}
.bhouse .bn-jump{animation:bnjump .6s ease-in-out infinite alternate}@keyframes bnjump{to{transform:translateY(-6px)}}
.bhouse .bn-pop{animation:bnpop 1.1s cubic-bezier(.2,1.6,.4,1) both;transform-box:fill-box;transform-origin:50% 100%}@keyframes bnpop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
.bhouse .bn-spk{animation:bnspk 1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes bnspk{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(45deg)}}
.bhouse .bn-rdy{animation:bnrdy 1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes bnrdy{50%{transform:scale(1.15)}}
`;
document.head.appendChild(css);

/* ---------- نافذة الترقية ---------- */
let vc=null;const stopVc=()=>{if(vc){vc.stop();vc=null}};
const FAST=12/60; // البناء السريع (بعد عمل صالح أو جواهر): ١٢ ثانية حتى يرى الطفل عمّاله يعملون
function open(p){const P=PARTS[p];if(!P)return;stopVc();const L=lvOf(p),job=st.job;
  const lvs=`<div class="lvs">${P.lv.map((x,i)=>`<span class="${L>i?'on':''}">${ar(i+1)}. ${x[0]}</span>`).join('')}</div>`;
  if(job&&job.p==p)return job.ready?collect():jobModal();
  if(L>=3)return modal(`<div class="bnm"><div style="font-size:48px">${P.e}</div><h3 style="margin:2px 0">${P.n}</h3>${lvs}<p>🌟 وصل إلى أعلى مستوى! ما شاء الله</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div></div>`);
  const why=P.need?P.need():'';
  if(why)return modal(`<div class="bnm"><div style="font-size:48px">🔒</div><h3 style="margin:2px 0">${P.n}</h3><p>${why}</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div></div>`);
  const [nm,j,D,n,mins]=P.lv[L],busy=!!job,have=window.Deco?Deco.j:0;
  modal(`<div class="bnm"><div style="font-size:48px">${P.e}</div><h3 style="margin:2px 0">${L?'طوّر':'ابنِ'} ${P.n}</h3>${lvs}
    <div class="nx"><b>⬆️ المستوى ${ar(L+1)}: ${nm}</b><small>👷 ${ar(L+1)} ${L?'عمّال':'عامل'} · ${B('اختر','اختاري')} طريقة البناء 👇</small></div>
    ${busy?`<p style="font-weight:800;color:#b06a2c">👷 عمّالك يبنون الآن ${PARTS[job.p].n}. ${job.ready?'استلمه أولًا ✔':'انتظر حتى ينتهوا، أو عجّل البناء.'}</p>`:''}
    <div id="bnVc"></div>
    <div class="pay" id="bnPay">
      <button class="pd" id="bnD" ${busy?'disabled':''}>🤲 ${D.n} ${ar(n)} مرة بصوتك ← يُبنى بسرعة</button>
      <button class="pj" id="bnJ" ${busy||have<j?'disabled':''}>💎 ${ar(j)} جوهرة ← يُبنى بسرعة ${have<j?`(عندك ${ar(have)})`:''}</button>
      <button class="pw" id="bnW" ${busy?'disabled':''}>⏳ مجانًا: ${B('انتظر','انتظري')} ${tm(mins)}</button></div>
    <div class="nav"><button class="btn sec" id="bnX">إلغاء</button></div></div>`,()=>{
    $('#bnX').onclick=()=>{stopVc();closeModal()};
    $('#bnW').onclick=()=>start(p,L+1,mins);
    $('#bnJ').onclick=()=>{if(!window.Deco||Deco.j<j)return;Deco.takeJ(j);start(p,L+1,FAST)};
    $('#bnD').onclick=()=>{$('#bnPay').style.display='none';
      vc=Voice.counter($('#bnVc'),{phrase:D.p,target:n,emoji:D.e,onDone:k=>{vc=null;try{Aamal.add(D.k,k);Aamal.grow(D.k)}catch(e){}setTimeout(()=>start(p,L+1,FAST),700)}})}})}
function start(p,to,mins){stopVc();st.job={p,to,start:Date.now(),end:Date.now()+mins*MIN};sv();pub();closeModal();
  try{tone(660,.08,'triangle',.1);setTimeout(()=>tone(880,.1,'triangle',.1),120)}catch(e){}
  redraw();toast(mins<1?`👷 هيّا يا عمّال! ${PARTS[p].n} يُبنى الآن 🔨`:`👷 بدأ البناء! ${PARTS[p].n} يكتمل بعد ${tm(mins)}`)}
function jobModal(){const j=st.job;if(!j)return;if(j.ready)return collect();const P=PARTS[j.p],[,price]=P.lv[j.to-1],have=window.Deco?Deco.j:0;stopVc();
  modal(`<div class="bnm"><div style="font-size:48px">👷</div><h3 style="margin:2px 0">${B('عمّالك','عمّالكِ')} يبنون ${P.n}</h3>
    <div class="nx"><b>⬆️ المستوى ${ar(j.to)}: ${P.lv[j.to-1][0]}</b></div>
    <div class="clock" id="bnClock">${mmss(j.end-Date.now())}</div><div class="pbar"><i id="bnBar" style="width:0"></i></div>
    <div id="bnVc"></div>
    <div class="pay" id="bnPay"><button class="pf" id="bnF">⚡ عجّل: ${SAL.n} ١٠ مرات بصوتك</button>
      <button class="pj" id="bnFJ" ${have<price?'disabled':''}>⚡ عجّل بـ 💎 ${ar(price)} جوهرة</button></div>
    <div class="nav"><button class="btn gold" id="bnOk">${B('سأنتظر','سأنتظر')} ⏳</button></div></div>`,()=>{
    $('#bnOk').onclick=()=>{stopVc();closeModal()};
    const hurry=()=>{if(st.job){st.job.end=Math.min(st.job.end,Date.now()+8000);sv()}closeModal();redraw();tick()};
    $('#bnFJ').onclick=()=>{if(!window.Deco||Deco.j<price)return;Deco.takeJ(price);hurry()};
    $('#bnF').onclick=()=>{$('#bnPay').style.display='none';
      vc=Voice.counter($('#bnVc'),{phrase:SAL.p,target:10,emoji:SAL.e,onDone:k=>{vc=null;try{Aamal.add('sal',k);Aamal.grow('sal')}catch(e){}setTimeout(hurry,700)}})};
    tick()})}
function toast(t){const d=document.createElement('div');d.className='ctbanner b3';d.style.cssText='font-size:17px;top:16%;white-space:normal;max-width:90vw;text-align:center';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
const pub=()=>{try{Deco.pub&&Deco.pub()}catch(e){}};
const onBayt=()=>$('#bayt')&&$('#bayt').classList.contains('on')&&$('#byBody .bnhint');
function redraw(){if(onBayt()&&window.Bayt&&!Bayt.G)Bayt.menu()}

/* ---------- الساعة: العدّادات، ثم «جاهز للاستلام» ثم الفعالية ---------- */
function tick(){const j=st.job;if(!j)return;const now=Date.now(),left=j.end-now,fr=Math.min(1,(now-j.start)/(j.end-j.start||1));
  document.querySelectorAll('.bhouse [data-timer]').forEach(t=>{t.textContent=mmss(left)});
  document.querySelectorAll('.bhouse [data-tbar]').forEach(r=>r.setAttribute('width',(+r.dataset.tbar*fr).toFixed(1)));
  const c=$('#bnClock');if(c){c.textContent=mmss(left);$('#bnBar').style.width=(fr*100)+'%'}
  const h=$('#bnJobLine');if(h)h.textContent=j.ready?`🎉 انتهى العمّال! ${B('المس','المسي')} ${PARTS[j.p].n} لتستلمه ✔`:`👷 ${PARTS[j.p].n}: باقي ${mmss(left)}`;
  if(left<=0&&!j.ready){j.ready=1;sv();if($('#bnClock'))closeModal();redraw();try{tone(784,.12,'triangle',.12);setTimeout(()=>tone(1046,.16,'triangle',.12),150)}catch(e){}
    toast(`🎉 انتهى العمّال من ${PARTS[j.p].n}! ${B('افتح بيتك واستلمه','افتحي بيتكِ واستلميه')} ✔`)}}
let fx=null;
function collect(){const j=st.job;if(!j||!j.ready)return;st.job=null;setLv(j.p,Math.max(lvOf(j.p),j.to));sv();pub();try{Alqab.soon()}catch(e){}const P=PARTS[j.p];
  closeModal();fx={p:j.p,until:Date.now()+3800};redraw();
  try{fanfare();confetti()}catch(e){}
  setTimeout(()=>{fx=null;redraw();modal(`<div class="bnm"><div style="font-size:54px">🎉</div><h3 style="margin:2px 0">اكتمل البناء!</h3><p style="font-size:17px">${P.e} ${P.n}: <b>${P.lv[j.to-1][0]}</b></p><p style="font-size:14px;color:var(--muted)">${B('المس','المسي')} أجزاء بيتك لتطوّر غيرها 👆</p><div class="nav"><button class="btn gold" data-close>الحمد لله 🤍</button></div></div>`)},3900)}
setInterval(tick,1000);

/* ---------- تحت البيت: سطر الورشة أو التلميح ---------- */
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('#byBody .bhouse [data-up],.wv .bhouse [data-up]');if(!t)return;e.stopPropagation();
  // v9.1: من شاشة العرض أيضًا: نغلقها ثم نفتح نافذة البناء
  const wv=t.closest('.wv');if(wv&&wv._close)wv._close();try{window.Bayt&&Bayt.sTap()}catch(x){}open(t.dataset.up)},true);
if(window.Deco&&Deco.menuHook){const orig=Deco.menuHook;Deco.menuHook=function(B0){orig.apply(this,arguments);
  const hb=B0.querySelector('.bhouse');if(!hb)return;const j=st.job;
  hb.insertAdjacentHTML('afterend',j?`<div class="bnhint job" id="bnJob"><span class="e">${j.ready?'🎉':'👷'}</span><span id="bnJobLine">…</span></div>`
    :`<div class="bnhint"><span class="e">👆</span><span>${B('المس','المسي')} أجزاء بيتك لتبنيها وتطوّرها: السور، البستان وأشجاره<br><small style="font-weight:700">🔍 ${B('المس','المسي')} البيت نفسه لتراه بالعرض وتكبّره</small></span></div>`);
  const jb=$('#bnJob');if(jb)jb.onclick=jobModal;tick()}}

window.Binaa={code,get job(){return st.job},get fx(){return fx&&fx.until>Date.now()?fx:null},open,tick,lv:lvOf,get st(){return st}};
})();
