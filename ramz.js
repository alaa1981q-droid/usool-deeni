/* 🔑 رمز الحفظ (v11.0): تقدّم الطفل كلّه يُحفظ أونلاين، ورمز قصير (مثل K7MQ-29QX) يرجعه على موبايل جديد.
   الحساب المجهول يُربط بحساب بريد/كلمة سرّ مخفيَّين مبنيَّين من الرمز، فيرجع نفس الـuid: الملف والأصدقاء والإدارة والبيت.
   النسخة الاحتياطية: كل مفاتيح usul5_* في saves/$uid (لا يقرؤها غير صاحبها). */
(function(){
'use strict';
const RK='usul5_ramz_v1',CH='ABCDEFGHJKMNPQRSTUVWXYZ23456789',SKIP={usul5_adm:1,usul5_admSeen:1,usul5_social_v1:1,[RK]:1};
const A=()=>window.OnlineAPI;
const B=(m,f)=>(window.Cups&&Cups.sex==='g')?f:m;
const esc=v=>String(v==null?'':v).replace(/[<>&"]/g,'');
const load=()=>{try{return JSON.parse(localStorage.getItem(RK)||'null')||{}}catch(e){return {}}};
let rs=load();
const keep=()=>{try{localStorage.setItem(RK,JSON.stringify(rs))}catch(e){}};
const norm=s=>String(s||'').toUpperCase().replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/O/g,'0').replace(/[^A-Z0-9]/g,'');
const pretty=c=>c.slice(0,4)+'-'+c.slice(4);
const mail=c=>c.toLowerCase()+'@hifz.usool-deeni.app';
const pass=c=>'Jn#'+c+'#usl5';
const newCode=()=>{const a=new Uint32Array(8);crypto.getRandomValues(a);return Array.from(a,x=>CH[x%CH.length]).join('')};
const fa=()=>window.firebase&&firebase.apps.length?firebase.auth():null;
const linked=()=>{const u=fa()&&fa().currentUser;return !!(u&&!u.isAnonymous)};

/* ---------- النسخة الاحتياطية ---------- */
function collect(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('usul5_')===0&&!SKIP[k])o[k]=localStorage.getItem(k)}return JSON.stringify(o)}
const hash=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h+':'+s.length};
let busy=false;
async function backup(force){
  if(busy||!rs.c||!navigator.onLine)return false;
  try{if(!localStorage.getItem(RK))return false}catch(e){return false} // التخزين انمسح والتطبيق مفتوح: لا نكتب نسخة فارغة فوق الجيدة
  const api=A();if(!api||!api.db||!api.me||!linked())return false;
  let d;try{d=collect()}catch(e){return false}const h=hash(d);if(!force&&h===rs.h)return true;
  busy=true;
  try{await api.db.ref('saves/'+api.me).set({d,t:firebase.database.ServerValue.TIMESTAMP,v:typeof APP_VER!=='undefined'?String(APP_VER):''});rs.h=h;rs.t=Date.now();keep();return true}
  catch(e){return false}finally{busy=false}}
setInterval(()=>backup(),3*60e3);
document.addEventListener('visibilitychange',()=>{if(document.hidden)backup()});
window.addEventListener('load',()=>setTimeout(()=>{if(rs.c&&state.online&&navigator.onLine&&A())A().init().then(()=>backup()).catch(()=>{})},8000));

/* ---------- إنشاء الرمز (أول مرة) ---------- */
async function create(){
  const api=A();await api.init();const u=fa().currentUser;
  if(!u)throw new Error('nouser');
  if(!u.isAnonymous){ // مربوط من قبل (رمز من موبايل آخر)، نأخذ الرمز من البريد
    const c=norm(String(u.email||'').split('@')[0]);if(c.length===8){rs.c=c;keep();return c}throw new Error('noemail')}
  let last;
  for(let i=0;i<4;i++){const c=newCode();
    try{await u.linkWithCredential(firebase.auth.EmailAuthProvider.credential(mail(c),pass(c)));rs.c=c;rs.h='';keep();await backup(true);return c}
    catch(e){last=e;if(e&&e.code==='auth/email-already-in-use')continue;throw e}}
  throw last}

/* ---------- الاسترجاع على موبايل جديد ---------- */
async function restore(raw){
  const c=norm(raw);if(c.length!==8)throw {code:'short'};
  const api=A();await api.init();const auth=fa();
  if(linked()&&norm(String(auth.currentUser.email||'').split('@')[0])===c)throw {code:'same'};
  const cr=await auth.signInWithEmailAndPassword(mail(c),pass(c));
  const uid=cr.user.uid;let sv=null;
  try{sv=(await api.db.ref('saves/'+uid).get()).val()}catch(e){}
  if(sv&&typeof sv.d==='string'){const o=JSON.parse(sv.d);
    const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('usul5_')===0)ks.push(k)}
    ks.forEach(k=>localStorage.removeItem(k));
    Object.keys(o).forEach(k=>{if(k.indexOf('usul5_')===0&&!SKIP[k]&&typeof o[k]==='string')localStorage.setItem(k,o[k])})}
  try{const p=JSON.parse(localStorage.getItem('usul5_progress_v1')||'null')||{};p.online=true;localStorage.setItem('usul5_progress_v1',JSON.stringify(p))}catch(e){}
  rs={c,h:'',t:Date.now()};keep();
  return !!sv}

/* ---------- الشاشات ---------- */
const errMsg=e=>{const c=e&&e.code||'';
  if(c==='short')return 'الرمز ٨ حروف وأرقام، مثل: K7MQ-29QX';
  if(c==='same')return 'هذا رمزك أنت، وتقدّمك محفوظ عليه ✓';
  if(/wrong-password|user-not-found|invalid-credential|invalid-login|invalid-email/.test(c))return 'الرمز غير صحيح. تأكّد من كل حرف ورقم ثم حاول مرة أخرى.';
  if(/too-many-requests/.test(c))return 'محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.';
  if(/operation-not-allowed/.test(c))return 'رمز الحفظ غير مفعّل بعد من الإدارة.';
  if(/network|timeout|offline/.test(c+(e&&e.message||'')))return 'لا يوجد اتصال بالإنترنت. اتصل ثم حاول مرة أخرى.';
  return 'تعذّر ذلك، حاول مرة أخرى.'};
const ago=t=>{if(!t)return '';const m=Math.round((Date.now()-t)/60e3);return m<1?'الآن':m<60?`قبل ${ar(m)} دقيقة`:m<1440?`قبل ${ar(Math.round(m/60))} ساعة`:`قبل ${ar(Math.round(m/1440))} يوم`};
const box=c=>`<div dir="ltr" style="font:900 34px/1.3 ui-monospace,Consolas,monospace;letter-spacing:4px;background:#fff8e1;border:3px dashed #e0a526;border-radius:16px;padding:12px 6px;margin:10px 0;color:#7a4b00;user-select:all">${pretty(c)}</div>`;

async function openCode(){
  if(rs.c&&linked()){showCode(rs.c);return}
  modal(`<div style="text-align:center"><div style="font-size:46px">🔑</div><h3 style="margin:4px 0">رمز الحفظ</h3><p>جارٍ تجهيز رمزك…</p></div>`);
  if(!navigator.onLine){$('#modalIn').innerHTML=`<div style="text-align:center"><div style="font-size:46px">📡</div><p>رمز الحفظ يحتاج إنترنت أول مرة. اتصل ثم ارجع هنا.</p><div class="nav"><button class="btn sec" data-close>حسنًا</button></div></div>`;$('#modalIn').querySelector('[data-close]').onclick=closeModal;return}
  try{const c=await create();showCode(c,true)}
  catch(e){const adm=isAdm()&&e&&e.code==='auth/operation-not-allowed';
    $('#modalIn').innerHTML=`<div style="text-align:center"><div style="font-size:46px">😕</div><p>${errMsg(e)}</p>${adm?`<p class="tip" style="text-align:right">للمدير: Firebase ← Authentication ← Sign-in method ← Email/Password ← Enable ← Save</p>`:''}<p class="tip" dir="ltr" style="opacity:.6">${esc(e&&e.code||e&&e.message||'')}</p><div class="nav"><button class="btn sec" data-close>حسنًا</button></div></div>`;
    $('#modalIn').querySelector('[data-close]').onclick=closeModal}}
function showCode(c,fresh){
  const done=()=>{const b=$('#rzSaved');if(b)b.textContent=rs.t?`☁️ آخر حفظ: ${ago(rs.t)}`:''};
  modal(`<div style="text-align:center"><div style="font-size:46px">🔑</div><h3 style="margin:4px 0">${fresh?'هذا رمز حفظك!':'رمز حفظك'}</h3>
    <p>${B('اكتبه','اكتبيه')} في دفتر، أو ${B('صوّر','صوّري')} هذه الشاشة 📸<br>إذا تغيّر الموبايل أو انمسح التطبيق، ${B('اكتبه','اكتبيه')} فيرجع كل شيء: بيتك وجواهرك ونجومك وحفظك وأصدقاؤك 🤍</p>
    ${box(c)}
    <p class="tip">🤫 لا ${B('تعطه','تعطيه')} لأحد غير أهلك، فمن يعرفه يدخل بحسابك.</p>
    <small id="rzSaved" style="color:var(--muted)"></small>
    <div class="nav"><button class="btn gold" id="rzNow">☁️ احفظ الآن</button><button class="btn sec" data-close>تمام 👍</button></div></div>`,()=>{
    done();$('#rzNow').onclick=async()=>{const b=$('#rzNow');b.disabled=true;b.textContent='⏳';const ok=await backup(true);b.disabled=false;b.textContent=ok?'✓ حُفظ':'☁️ احفظ الآن';if(!ok&&window.OnlineAPI)OnlineAPI.toast('لا يوجد اتصال');done()}})}

function openRestore(){
  modal(`<div style="text-align:center"><div style="font-size:46px">🔑</div><h3 style="margin:4px 0">عندي رمز حفظ</h3>
    <p>${B('اكتب','اكتبي')} الرمز الذي ${B('حفظته','حفظتِه')} من موبايلك القديم:</p>
    <input class="inp" id="rzIn" dir="ltr" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="K7MQ-29QX" style="text-align:center;font:800 26px ui-monospace,Consolas,monospace;letter-spacing:3px">
    <div class="fb" id="rzMsg" style="font-size:14px;min-height:20px"></div>
    <p class="tip">⚠️ تقدّمك على هذا الموبايل يُستبدل بتقدّمك المحفوظ.</p>
    <div class="nav"><button class="btn gold" id="rzGo">رجّع تقدّمي ✓</button><button class="btn sec" data-close>إلغاء</button></div></div>`,()=>{
    const i=$('#rzIn'),m=$('#rzMsg'),g=$('#rzGo');i.focus();
    i.oninput=()=>{const c=norm(i.value).slice(0,8);const v=c.length>4?pretty(c):c;if(i.value!==v)i.value=v;m.textContent=''};
    g.onclick=async()=>{g.disabled=true;g.textContent='⏳ جارٍ الاسترجاع…';m.className='fb';m.textContent='';
      try{const had=await restore(i.value);$('#modalIn').innerHTML=`<div style="text-align:center"><div style="font-size:56px">🎉</div><h3>رجع تقدّمك!</h3><p>${had?'بيتك وجواهرك ونجومك رجعت كلها 🤍':'رجع حسابك واسمك وأصدقاؤك 🤍'}</p></div>`;setTimeout(()=>location.reload(),1600)}
      catch(e){m.className='fb bad';m.textContent=errMsg(e);g.disabled=false;g.textContent='رجّع تقدّمي ✓'}}})}

// زرّان في «ملفّي»: يُضافان بعد رسم الشاشة
function addToProfile(){const b=$('#aqBody');if(!b||$('#rzCard'))return;const h=b.querySelector('.aqhead');if(!h)return;
  const d=document.createElement('div');d.id='rzCard';d.className='rzcard'+(rs.c?'':' new');
  d.innerHTML=rs.c?`<button class="btn sec" id="rzShow">🔑 أرني رمز الحفظ</button>`:`<b>🔑 ${B('احفظ','احفظي')} تقدّمك!</b><small>رمز صغير يرجع لك بيتك وجواهرك إذا تغيّر الموبايل</small><button class="btn gold" id="rzShow">🔑 أعطني رمز الحفظ</button>`;
  d.insertAdjacentHTML('beforeend',`<button class="rzlink" id="rzHave">عندي رمز من موبايل قديم</button>`);
  h.insertAdjacentElement('afterend',d);$('#rzShow').onclick=openCode;$('#rzHave').onclick=openRestore}
{const st=document.createElement('style');st.textContent=`.rzcard{margin:8px 10px;padding:10px;border-radius:16px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center}
.rzcard.new{background:linear-gradient(160deg,#fff6d8,#ffe9a8);border:2px solid #f0c24a;box-shadow:0 3px 0 #e0a526}
.rzcard small{color:#7a5a12}.rzcard .btn{flex:none;min-width:210px}
.rzlink{background:none;border:0;color:var(--muted);text-decoration:underline;font:inherit;font-size:13px;cursor:pointer;padding:2px}`;document.head.appendChild(st)}
new MutationObserver(()=>{if($('#aqTitle').textContent==='🏅 ملفّي')addToProfile()}).observe($('#aqBody'),{childList:true});

window.Ramz={openCode,openRestore,backup,get code(){return rs.c||''}};
})();
