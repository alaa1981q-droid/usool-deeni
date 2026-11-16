/* 🛡️ الإدارة (لصاحب التطبيق فقط) + رسائل الإدارة وجوائزها للأطفال + جائزة بطل الأسبوع + الليل والنهار للبيت.
   - الدخول: اضغط سطر «الإصدار» أسفل الواجهة ٥ مرات. لا يكتب إلا من كان معرّفه في admins/$uid (يُضاف من لوحة Firebase فقط).
   - news/$id: رسالة لكل الأطفال {title,msg,j,ts}. prizes/$uid/$id: جائزة لطفل واحد {msg,j,ts}.
   - كل طفل يستلم الرسالة مرة واحدة، والجواهر تُضاف لبيته. يعتمد على online.js (OnlineAPI) و jannah.js (Deco). */
(function(){
const O=()=>window.OnlineAPI;
const esc=v=>String(v==null?'':v).replace(/[<>&"]/g,'');
const boy=()=>!window.Cups||Cups.sex!='g';
const B=(m,f)=>boy()?m:f;
const D=()=>Aamal.d;

/* ---------- 🌙 الليل والنهار: من ٦ مساءً إلى ٥ فجرًا يصير البيت ليليًّا ---------- */
const css=document.createElement('style');
css.textContent=`
body.night .bhouse{position:relative}
body.night .bhouse svg{filter:brightness(.45) saturate(1.3) hue-rotate(-18deg) contrast(1.1);transition:filter .8s}
body.night .bhouse::after{content:'';position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;
 background:radial-gradient(ellipse 34% 26% at 50% 74%,rgba(255,206,90,.6),transparent 70%),
 radial-gradient(1.6px 1.6px at 12% 14%,#fff,transparent),radial-gradient(1.6px 1.6px at 24% 30%,#fff,transparent),radial-gradient(2px 2px at 38% 10%,#fff,transparent),
 radial-gradient(1.6px 1.6px at 52% 22%,#fff,transparent),radial-gradient(2px 2px at 64% 8%,#fff,transparent),radial-gradient(1.6px 1.6px at 72% 32%,#fff,transparent),
 radial-gradient(1.6px 1.6px at 6% 40%,#fff,transparent),radial-gradient(2px 2px at 30% 46%,#fff,transparent),radial-gradient(1.6px 1.6px at 58% 40%,#fff,transparent);animation:idnt 3s ease-in-out infinite}
body.night .bhouse::before{content:'🌙';position:absolute;right:3%;top:1%;width:16%;aspect-ratio:1;display:grid;place-items:center;border-radius:50%;z-index:1;pointer-events:none;
 background:radial-gradient(circle,#1b2a5c 52%,rgba(27,42,92,0) 72%);font-size:clamp(14px,6vw,34px)}
@keyframes idnt{50%{opacity:.75}}
.idgate{text-align:center}.idbox{background:#fff;border:2px solid var(--line);border-radius:20px;padding:12px;margin-bottom:12px}
.idbox h3{margin:0 0 6px;font-size:18px;color:var(--deep)}
.idbox textarea.inp{min-height:90px;text-align:right;font-size:17px;resize:vertical}
.idbox select.inp{font-size:17px}
.idrow{display:flex;align-items:center;gap:8px;border-bottom:1px dashed var(--line);padding:6px 0;font-size:14px}.idrow:last-child{border:0}
.idrow b{flex:1;min-width:0}.idrow .av{font-size:24px}
.idmsg .em{font-size:60px;line-height:1.2}.idmsg p{white-space:pre-wrap;text-align:right;line-height:1.9}
`;
document.head.appendChild(css);
function dayNight(){const h=new Date().getHours(),n=h>=18||h<5;document.body.classList.toggle('night',n);return n}
dayNight();setInterval(dayNight,5*60000);
// عرض البيت ثلاثي الأبعاد يبدأ ليليًّا في الليل
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.classList&&n.classList.contains('v3ov')&&dayNight()){n.classList.add('night');const b=n.querySelector('#v3n');if(b)b.textContent='☀️'}}))).observe(document.body,{childList:true});

/* ---------- الاستلام: رسائل الإدارة، جوائز الطفل، جائزة بطل الأسبوع ---------- */
const queue=[];let showing=false;
function nextMsg(){if(showing||!queue.length||$('#modal').classList.contains('on')||document.querySelector('.v3ov'))return;
  const m=queue.shift();showing=true;
  try{fanfare();if(m.j)confetti()}catch(e){}
  if(m.j&&window.Deco)Deco.addJ(m.j);
  modal(`<div class="idmsg"><div class="em">${m.em||'📢'}</div><h3 style="margin:2px 0">${esc(m.title||'رسالة من إدارة جنّتي الصغيرة')}</h3>${m.msg?`<p>${esc(m.msg)}</p>`:''}
    ${m.j?`<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(m.j)}</b>${B('هديتك','هديتكِ')} لتزيين بيتك في الجنة!</div>`:''}
    <div class="nav"><button class="btn gold" id="idOk">${m.j?'جزاكم الله خيرًا 🤍':'حسنًا 🌷'}</button></div></div>`,()=>{
    $('#idOk').onclick=()=>{closeModal();showing=false;m.done&&m.done();setTimeout(nextMsg,400)}})}
setInterval(nextMsg,3000);
async function inbox(){const API=O();if(!API||!navigator.onLine)return;
  try{await API.init()}catch(e){return}
  if(!API.db||!API.me)return;const d=D();d.newsSeen=d.newsSeen||{};if(!d.newsFrom){d.newsFrom=Date.now()-14*864e5;Aamal.save()}
  try{const s=(await API.db.ref('news').orderByChild('ts').limitToLast(10).get()).val()||{};
    Object.entries(s).sort((a,b)=>(a[1].ts||0)-(b[1].ts||0)).forEach(([id,v])=>{if(!v||d.newsSeen[id]||(v.ts||0)<d.newsFrom)return;
      d.newsSeen[id]=1;Aamal.save();queue.push({title:v.title,msg:v.msg,j:Math.min(500,v.j|0),em:'📢'})})}catch(e){}
  try{const p=(await API.db.ref('prizes/'+API.me).get()).val()||{};
    Object.entries(p).forEach(([id,v])=>{if(!v||d.newsSeen['p'+id])return;d.newsSeen['p'+id]=1;Aamal.save();
      queue.push({title:v.w?'⚠️ تنبيه من الإدارة':(v.title||'🎁 جائزة خاصة لك من الإدارة!'),msg:v.msg,j:v.w?0:Math.min(1000,v.j|0),em:v.w?'⚠️':'🎁',done:()=>API.db.ref(`prizes/${API.me}/${id}`).remove().catch(()=>{})})})}catch(e){}
  try{const b=(await API.db.ref('bans/'+API.me).get()).val();if(b&&b.until>API.now()&&d.banSeen!==b.until){d.banSeen=b.until;Aamal.save();const t=new Date(b.until);
    queue.unshift({em:'⛔',title:'توقّف لعبك أونلاين مؤقتًا',msg:`أوقفت الإدارة اللعب أونلاين حتى ${t.toLocaleDateString('ar-IQ',{weekday:'long',day:'numeric',month:'long'})}.${b.why?`\nالسبب: ${b.why}`:''}\nتستطيع أن تتعلّم وتحفظ وتبني بيتك كالعادة 🤍`})}}catch(e){}
  try{if(API.profile)await weekPrize(API)}catch(e){}
  nextMsg()}
// 🏆 بطل الأسبوع الماضي: الأول ١٠٠ جوهرة، الثاني ٦٠، الثالث ٣٠ (مرة واحدة لكل أسبوع)
const WKJ=[100,60,30];
async function weekPrize(API){const d=D(),last=API.week()-1;if(d.wkPrize===last)return;
  const s=(await API.db.ref('leader/'+last).get()).val()||{};
  const key=r=>Math.max(r.xp|0,(r.wins|0)*10);
  const rows=Object.entries(s).map(([id,v])=>({id,...v})).filter(r=>key(r)>0).sort((a,b)=>key(b)-key(a));
  d.wkPrize=last;Aamal.save();
  const i=rows.findIndex(r=>r.id==API.me);if(i<0||i>2)return;
  queue.unshift({em:['🥇','🥈','🥉'][i],title:i==0?B('🏆 أنت بطل الأسبوع!','🏆 أنتِ بطلة الأسبوع!'):`${B('أنت','أنتِ')} ${i==1?'الثاني':'الثالث'} بين أبطال الأسبوع!`,
    msg:`ما شاء الله! ${B('كنتَ','كنتِ')} من أكثر الأطفال تعلّمًا وعملًا للخير في الأسبوع الماضي.`,j:WKJ[i]})}
setTimeout(()=>{if(state.online||navigator.onLine)inbox()},5000);
setInterval(()=>{if(document.visibilityState=='visible')inbox()},10*60000);

/* ---------- 🛡️ صفحة الإدارة ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='idara';
sec.innerHTML=`<div class="bar"><button class="back" id="idBack">›</button><div class="ttl">🛡️ الإدارة</div></div><div id="idBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
$('#idBack').onclick=()=>{renderHome();show('home')};
// الدخول: ٥ ضغطات على سطر الإصدار
let taps=0,tapT=0;const vl=$('#verLine');if(vl)vl.addEventListener('click',()=>{taps++;clearTimeout(tapT);tapT=setTimeout(()=>taps=0,2500);if(taps>=5){taps=0;openAdmin()}});
const body=()=>$('#idBody');
async function openAdmin(){show('idara');body().innerHTML=`<div class="handoff"><div class="big spin">🛡️</div><p>جارٍ الاتصال…</p></div>`;
  const API=O();try{await API.init()}catch(e){body().innerHTML=`<div class="handoff"><div class="big">📡</div><h2>لا يوجد اتصال</h2><p>الإدارة تحتاج إنترنت.</p></div>`;return}
  let ok=false;try{ok=!!(await API.db.ref('admins/'+API.me).get()).val()}catch(e){}
  if(!ok){body().innerHTML=`<div class="idbox idgate"><div style="font-size:54px">🔒</div><h3>هذه الصفحة لمدير التطبيق فقط</h3>
      <p style="font-size:14px;color:var(--muted)">معرّف هذا الجهاز (يحتاجه المدير مرة واحدة ليفعّل الإدارة):</p>
      <div class="code-card" style="justify-content:center"><b dir="ltr" style="font-size:15px;letter-spacing:0;word-break:break-all" id="idUid">${esc(API.me)}</b></div>
      <button class="btn sec" id="idCp" style="flex:none;width:100%">📋 نسخ المعرّف</button></div>`;
    $('#idCp').onclick=()=>{try{navigator.clipboard.writeText(API.me).then(()=>API.toast('نُسخ ✓'))}catch(e){API.toast(API.me)}};return}
  panel()}
const JOPT=[0,10,25,50,100,200].map(n=>`<option value="${n}">${n?`💎 ${ar(n)} جوهرة`:'بلا جواهر'}</option>`).join('');
let all=null,heroes=null,tab='heroes',q='';
const key=r=>Math.max(r.xp|0,(r.wins|0)*10);
async function loadKids(API){
  if(!heroes){try{const s=(await API.db.ref('leader/'+API.week()).get()).val()||{};heroes=Object.entries(s).map(([id,v])=>({id,...v})).sort((a,b)=>key(b)-key(a)).slice(0,15)}catch(e){heroes=[]}}
  if(!all){try{const s=(await API.db.ref('profiles').get()).val()||{};all=Object.entries(s).map(([id,v])=>({id,nick:v.nick||'؟',av:v.av||'❔',lv:v.lv|0,tt:v.tt||'',wins:v.wins|0,games:v.games|0,code:v.code||'',seen:+v.seen||0,acc:v.acc||{},md:v.md||''}))}catch(e){all=[]}}
  try{bans=(await API.db.ref('bans').get()).val()||{}}catch(e){bans={}}}
let bans={};
const banOf=id=>{const b=bans[id];return b&&b.until>Date.now()?b:null};
// يتعمّد الأخطاء؟ دقّة أقل من ٣٥٪ بعد ١٦ سؤالًا أونلاين، أو مباراتان بلا أي إجابة صحيحة
const accOf=p=>{const a=p.acc||{};return a.q?a.r/a.q:null};
const sus=p=>{const a=p.acc||{};return (a.q>=16&&a.r/a.q<.35)||(a.z|0)>=2};
function ago(t){if(!t)return 'لم يُسجَّل بعد';const m=Math.round((Date.now()-t)/60000);
  const w=(n,one,two,few,many)=>n==1?one:n==2?two:n<=10?`${ar(n)} ${few}`:`${ar(n)} ${many}`;
  if(m<2)return 'الآن';if(m<60)return 'قبل '+w(m,'دقيقة','دقيقتين','دقائق','دقيقة');const h=Math.round(m/60);if(h<24)return 'قبل '+w(h,'ساعة','ساعتين','ساعات','ساعة');
  const d=Math.round(h/24);return d<30?'قبل '+w(d,'يوم','يومين','أيام','يومًا'):new Date(t).toLocaleDateString('ar-IQ')}
function kidRow(r,i){const p=all&&all.find(x=>x.id==r.id)||{};const lv=r.lv||p.lv,tt=r.tt||p.tt,b=banOf(r.id),ac=accOf(p);
  return `<div class="idrow" data-k="${esc(r.id)}" style="cursor:pointer"><span>${i!=null?(['🥇','🥈','🥉'][i]||ar(i+1)):''}</span><span class="av">${esc(r.av||p.av)}</span><b>${esc(r.nick||p.nick)}${b?' ⛔':''}${sus(p)?' ⚠️':''}<small style="display:block;color:#8a5a00;font-weight:500">${lv?`⭐ المستوى ${ar(lv)} `:''}${esc(tt||'')}${r.xp?` · ✨${ar(r.xp)}`:''}${(r.wins||p.wins)?` · 🏆${ar(r.wins||p.wins)}`:''}</small><small style="display:block;color:var(--muted);font-weight:500">🕒 ${ago(p.seen)}${ac!=null?` · 🎯 ${ar(Math.round(ac*100))}٪`:''}</small></b><button class="mini go" data-g="${esc(r.id)}">🎁</button></div>`}
/* 👁 بطاقة الطفل: كل معلوماته، وأزرار التنبيه والحظر والجائزة */
async function kidCard(id){const API=O();let p=(all||[]).find(x=>x.id==id);
  try{const v=(await API.db.ref('profiles/'+id).get()).val();if(v)p=Object.assign({id},p||{},{nick:v.nick,av:v.av,lv:v.lv|0,tt:v.tt||'',wins:v.wins|0,games:v.games|0,code:v.code||'',seen:+v.seen||0,acc:v.acc||{},md:v.md||''})}catch(e){}
  if(!p)return;let on=false;try{on=!!(await API.db.ref('presence/'+id).get()).val()}catch(e){}
  const b=banOf(id),a=p.acc||{},ac=accOf(p);
  const md=String(p.md||'').split(',').filter(Boolean).map(x=>{const [k,t]=x.split(':');return `${['','🥉','🥈','🥇','💎'][t|0]||''}${{usul:'📚',pray:'🤲',fiqh:'🕌',hifz:'📖',tilawa:'🎤',sal:'💚',tas:'📿',champ:'⚔️',akhlaq:'🌷',wird:'🔥',banna:'🏡',garden:'🌱'}[k]||''}`}).join(' ');
  modal(`<div style="font-size:56px;line-height:1.2">${esc(p.av)}</div><h3 style="margin:2px 0">${esc(p.nick)}</h3>
    <p style="margin:2px 0">${p.lv?`<span class="aqlv">⭐ المستوى ${ar(p.lv)}</span>`:''} ${p.tt?`<span class="aqtt">${esc(p.tt)}</span>`:''}</p>
    ${md?`<p style="font-size:20px;margin:4px 0">${md}</p>`:''}
    <div style="text-align:right;font-size:15px;line-height:1.9;background:#f6fbf8;border-radius:14px;padding:6px 10px">
      ${on?'🟢 متصل الآن':`🕒 آخر دخول: <b>${ago(p.seen)}</b>`}<br>
      🏆 ${ar(p.wins)} فوز من ${ar(p.games)} مباراة أونلاين<br>
      🎯 دقّة الإجابات: <b>${ac!=null?ar(Math.round(ac*100))+'٪':'—'}</b>${a.q?` (${ar(a.r|0)} صحيحة من ${ar(a.q)})`:''}${a.z?`<br>⚠️ ${ar(a.z)} مباراة بلا أي إجابة صحيحة`:''}<br>
      🔑 الرمز: <b dir="ltr">${esc(p.code)}</b>
      ${b?`<br>⛔ <b style="color:#c43d38">محظور حتى ${new Date(b.until).toLocaleString('ar-IQ',{weekday:'long',hour:'numeric',minute:'2-digit'})}</b>${b.why?` — ${esc(b.why)}`:''}`:''}
      ${sus(p)?`<br><b style="color:#b06a2c">⚠️ قد يتعمّد الإجابات الخاطئة</b>`:''}</div>
    <div class="nav"><button class="btn gold" id="kGift">🎁 جائزة</button><button class="btn" id="kWarn" style="background:#e57c1f;box-shadow:0 5px 0 #a8551a">⚠️ تنبيه</button></div>
    <div class="nav">${b?`<button class="btn" id="kUnban">✅ رفع الحظر</button>`:`<button class="btn" id="kBan1" style="background:#c43d38;box-shadow:0 5px 0 #8a2a26">⛔ حظر ٢٤ ساعة</button><button class="btn" id="kBan7" style="background:#7a1f1b;box-shadow:0 5px 0 #4a1210">⛔ حظر أسبوع</button>`}</div>
    <div class="nav"><button class="btn sec" id="kHero">🗑️ شيله من أبطال الأسبوع</button></div>
    <div class="nav"><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    $('#kGift').onclick=()=>{closeModal();giftTo(id,p.nick,p.av)};
    $('#kWarn').onclick=()=>warnTo(id,p);
    const ban=(h,label)=>modal(`<div style="font-size:50px">⛔</div><h3 style="margin:4px 0">حظر ${esc(p.nick)} ${label}؟</h3><p style="font-size:15px">يُمنع من اللعب أونلاين فقط، ويبقى يتعلّم ويبني بيته.</p>
      <input class="inp" id="bWhy" maxlength="80" placeholder="السبب (يراه الطفل)، مثل: تعمّد الإجابات الخاطئة" style="text-align:right;font-size:16px">
      <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn" id="bYes" style="background:var(--bad)">حظر</button></div>`,()=>{
      $('#bYes').onclick=async()=>{const why=$('#bWhy').value.trim();try{const until=API.now()+h*3600e3;await API.db.ref('bans/'+id).set({until,why,ts:firebase.database.ServerValue.TIMESTAMP});bans[id]={until,why};
        await API.db.ref(`leader/${API.week()}/${id}`).remove().catch(()=>{});closeModal();API.toast(`تم حظر ${p.nick} ${label} ✓`);drawKids()}catch(e){API.toast('تعذّر الحظر')}}});
    const b1=$('#kBan1');if(b1)b1.onclick=()=>ban(24,'٢٤ ساعة');
    const b7=$('#kBan7');if(b7)b7.onclick=()=>ban(24*7,'أسبوعًا');
    const ub=$('#kUnban');if(ub)ub.onclick=async()=>{try{await API.db.ref('bans/'+id).remove();delete bans[id];closeModal();API.toast('رُفع الحظر ✓');drawKids()}catch(e){API.toast('تعذّر')}};
    $('#kHero').onclick=async()=>{try{await API.db.ref(`leader/${API.week()}/${id}`).remove();heroes=(heroes||[]).filter(x=>x.id!=id);closeModal();API.toast('شيل من أبطال الأسبوع ✓');drawKids()}catch(e){API.toast('تعذّر')}}})}
function warnTo(id,p){const API=O();
  modal(`<div style="font-size:50px">⚠️</div><h3 style="margin:4px 0">تنبيه إلى ${esc(p.nick)}</h3>
    <textarea class="inp" id="wMsg" maxlength="400" style="min-height:80px;text-align:right;font-size:16px">نرجو منك أن تلعب بصدق وأمانة، وأن تجيب بانتباه في التحديات. إذا تكرّر تعمّد الأخطاء سيتوقّف لعبك أونلاين 🤍</textarea>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn" id="wSend" style="background:#e57c1f">⚠️ أرسل التنبيه</button></div>`,()=>{
    $('#wSend').onclick=async()=>{const msg=$('#wMsg').value.trim();if(!msg)return;try{await API.db.ref('prizes/'+id).push({msg,j:0,w:1,ts:firebase.database.ServerValue.TIMESTAMP});closeModal();API.toast('أُرسل التنبيه ✓')}catch(e){API.toast('تعذّر الإرسال')}}})}
function drawKids(){const el=$('#idKids');if(!el)return;let rows=[],num=false;
  if(tab=='heroes'){rows=heroes||[];num=true}
  else if(tab=='top'){rows=(all||[]).slice().sort((a,b)=>(b.lv-a.lv)||(b.wins-a.wins)).slice(0,20);num=true}
  else if(tab=='sus'){rows=(all||[]).filter(p=>sus(p)||banOf(p.id)).sort((a,b)=>(accOf(a)||0)-(accOf(b)||0))}
  else if(tab=='recent'){rows=(all||[]).filter(p=>p.seen).sort((a,b)=>b.seen-a.seen).slice(0,30)}
  else{const t=q.trim().replace(/[أإآ]/g,'ا');rows=(all||[]).filter(r=>!t||String(r.nick).replace(/[أإآ]/g,'ا').includes(t)||String(r.code).toUpperCase()==t.toUpperCase()).slice(0,40)}
  el.innerHTML=rows.length?rows.map((r,i)=>kidRow(r,num?i:null)).join(''):`<p class="tip">${tab=='all'?(q?'لا يوجد طفل بهذا الاسم':`عدد الأطفال: ${ar((all||[]).length)} — اكتب اسمًا للبحث`):tab=='sus'?'لا أحد مشبوه 👍':'لا أحد بعد'}</p>`;
  el.querySelectorAll('[data-k]').forEach(b=>b.onclick=e=>{if(e.target.closest('[data-g]'))return;kidCard(b.dataset.k)});
  el.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const id=b.dataset.g,r=rows.find(x=>x.id==id)||{},p=(all||[]).find(x=>x.id==id)||{};giftTo(id,r.nick||p.nick,r.av||p.av)})}
function giftTo(uid,nick,av){const API=O();
  modal(`<div style="font-size:50px;line-height:1.2">${esc(av||'🎁')}</div><h3 style="margin:2px 0">جائزة إلى ${esc(nick||'')}</h3>
    <textarea class="inp" id="gMsg" maxlength="400" placeholder="رسالة له، مثل: أحسنت يا بطل! 🌟" style="min-height:70px;text-align:right;font-size:16px"></textarea>
    <select class="inp" id="gJ">${JOPT.replace('value="50"','value="50" selected')}</select>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="gSend">🎁 أرسل</button></div>`,()=>{
    $('#gSend').onclick=async()=>{const msg=$('#gMsg').value.trim(),j=+$('#gJ').value;$('#gSend').disabled=true;
      try{await API.db.ref('prizes/'+uid).push({msg,j,ts:firebase.database.ServerValue.TIMESTAMP});closeModal();API.toast(`أُرسلت الجائزة إلى ${nick||''} ✓`)}catch(e){$('#gSend').disabled=false;API.toast('تعذّر الإرسال')}}})}
async function panel(){const API=O();heroes=null;all=null;
  body().innerHTML=`<div class="idbox"><h3>👥 الأطفال <small style="font-weight:500;color:var(--muted);font-size:13px">اضغط على أي طفل لترى ملفّه</small></h3>
      <div class="jrooms" style="margin-bottom:6px;flex-wrap:wrap"><button data-tab="heroes">🏅 الأبطال</button><button data-tab="top">⭐ المميّزون</button><button data-tab="recent">🕒 دخلوا مؤخرًا</button><button data-tab="sus">⚠️ المشبوهون</button><button data-tab="all">🔎 ابحث</button></div>
      <input class="inp" id="kQ" placeholder="🔎 اكتب اسم الطفل أو رمزه" style="text-align:right;display:none">
      <div id="idKids"><p class="tip">⏳ جارٍ التحميل…</p></div>
      <p class="tip">بطل الأسبوع يأخذ تلقائيًا 💎١٠٠ (والثاني ٦٠ والثالث ٣٠) عند بداية الأسبوع الجديد.</p></div>
    <div class="idbox"><h3>📢 رسالة لكل الأطفال</h3>
      <input class="inp" id="nTitle" maxlength="60" placeholder="العنوان، مثل: عيد مبارك 🌙" style="text-align:right">
      <textarea class="inp" id="nMsg" maxlength="600" placeholder="نص الرسالة"></textarea>
      <select class="inp" id="nJ">${JOPT}</select>
      <button class="btn gold" id="nSend" style="flex:none;width:100%">📢 أرسل للجميع</button></div>
    <div class="idbox"><h3>📜 آخر الرسائل المرسلة</h3><div id="idNews"><p class="tip">⏳</p></div></div>`;
  const tabs=()=>{body().querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab==tab));$('#kQ').style.display=tab=='all'?'':'none';drawKids()};
  body().querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;tabs();if(tab=='all')$('#kQ').focus()});
  $('#kQ').oninput=e=>{q=e.target.value;drawKids()};
  $('#nSend').onclick=()=>{const title=$('#nTitle').value.trim(),msg=$('#nMsg').value.trim(),j=+$('#nJ').value;
    if(!title&&!msg){API.toast('اكتب العنوان أو الرسالة');return}
    modal(`<h3 style="margin:4px 0">إرسال لكل الأطفال؟</h3><p><b>${esc(title)}</b><br>${esc(msg).slice(0,140)}${j?`<br>💎 ${ar(j)} لكل طفل`:''}</p><div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="nYes">نعم، أرسل</button></div>`,()=>{
      $('#nYes').onclick=async()=>{closeModal();try{await API.db.ref('news').push({title,msg,j,ts:firebase.database.ServerValue.TIMESTAMP});API.toast('أُرسلت ✓');panel()}catch(e){API.toast('تعذّر الإرسال')}}})};
  await loadKids(API);tabs();
  // الرسائل
  try{const s=(await API.db.ref('news').orderByChild('ts').limitToLast(10).get()).val()||{};const rows=Object.entries(s).sort((a,b)=>(b[1].ts||0)-(a[1].ts||0));
    $('#idNews').innerHTML=rows.length?rows.map(([id,v])=>`<div class="idrow"><b>📢 ${esc(v.title||v.msg||'').slice(0,40)}</b><small>${v.j?'💎'+ar(v.j):''} ${v.ts?new Date(v.ts).toLocaleDateString('ar-IQ'):''}</small><button class="mini" style="background:#e2504a" data-del="${esc(id)}">🗑️</button></div>`).join(''):'<p class="tip">لم تُرسل رسائل بعد</p>';
    $('#idNews').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>modal(`<h3 style="margin:4px 0">حذف هذه الرسالة؟</h3><p>لن يراها الأطفال الذين لم يفتحوها بعد.</p><div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn" id="dYes" style="background:var(--bad)">حذف</button></div>`,()=>{
      $('#dYes').onclick=async()=>{closeModal();try{await API.db.ref('news/'+b.dataset.del).remove();panel()}catch(e){API.toast('تعذّر الحذف')}}}))}catch(e){$('#idNews').innerHTML='<p class="tip">تعذّر التحميل</p>'}}
window.Idara={open:openAdmin,inbox,dayNight};
})();
