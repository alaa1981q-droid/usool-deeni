/* maydan.js (v26.2) — ربط لعبة «ميادين النصر» (للأشبال ٩ سنين فما فوق) ببيت الطفل في الجنة.
   اللعبة على نفس الموقع (alaa1981q-droid.github.io/maydan/) تكتب مفاتيح ما ربحه الطفل في localStorage «maydan_gifts».
   هنا نقرأها ونعطي لكل مفتاح معروف هديته مرة واحدة فقط (المحفوظ في Aamal.d.mdg المختوم بـ seal.js)،
   والجوائز ثابتة في الجدول R، فلا يقدر أحد أن يزيدها بتعديل القائمة. في تطبيق الأندرويد (APK) اللعبة تفتح من الموقع،
   فهداياها لا تصل إلا لمن يستعمل الرابط (الموقع)، لأن ذاكرة التطبيق منفصلة. */
(function(){
const URL='https://alaa1981q-droid.github.io/maydan/?from=app',QK='maydan_gifts';
// المفتاح: [جواهر، النص، الرمز، هدية للبيت]
const R={
  badr_shura:[10,['عملتَ بالشورى عند آبار بدر','عملتِ بالشورى عند آبار بدر'],'💧','d_shura'],
  badr_win:[20,'نصرٌ في بدر بالصبر وحسن التدبير','⚔️'],
  badr_quiz:[10,['تعلّمتَ سيرة غزوة بدر','تعلّمتِ سيرة غزوة بدر'],'📖'],
  uhud_arch:[10,['وضعتَ الرماة حيث أمر النبيّ ﷺ','وضعتِ الرماة حيث أمر النبيّ ﷺ'],'🏹'],
  uhud_held:[20,['ثبتَّ مع المؤمنين في أُحُد','ثبتِّ مع المؤمنين في أُحُد'],'🛡️','d_thabat'],
  uhud_quiz:[10,['تعلّمتَ سيرة غزوة أُحُد','تعلّمتِ سيرة غزوة أُحُد'],'📖'],
  khandaq_dig:[10,['تعاونتَ مع المسلمين في حفر الخندق','تعاونتِ مع المسلمين في حفر الخندق'],'⛏️','d_khandaq'],
  khandaq_win:[20,['صبرتَ وحرستَ الخندق يوم الأحزاب','صبرتِ وحرستِ الخندق يوم الأحزاب'],'🌪️'],
  khandaq_quiz:[10,['تعلّمتَ سيرة غزوة الخندق','تعلّمتِ سيرة غزوة الخندق'],'📖'],
  fath_rahma:[10,['اخترتَ الرحمة يوم فتح مكة','اخترتِ الرحمة يوم فتح مكة'],'🕊️','d_rahma'],
  fath_aman:[20,['أدخلتَ أهل مكة في الأمان','أدخلتِ أهل مكة في الأمان'],'🕋'],
  fath_quiz:[10,['تعلّمتَ سيرة فتح مكة','تعلّمتِ سيرة فتح مكة'],'📖']
};
const $q=s=>document.querySelector(s),Bx=(m,g)=>window.Cups&&Cups.sex==='g'?g:m;
let wait=null;
function busy(){const m=$q('#modal'),c=$q('#celebrate');if((m&&m.classList.contains('on'))||(c&&c.classList.contains('on')))return true;
  const on=$q('.screen.on');return !!(on&&['quiz','contest','online','baytrace'].includes(on.id))}
function take(){
  if(!window.Aamal||!window.Deco||typeof modal!=='function')return;
  let q=[];try{q=JSON.parse(localStorage.getItem(QK)||'[]')||[]}catch(e){}
  const d=Aamal.d;d.mdg=d.mdg||{};const fresh=q.filter(k=>R[k]&&!d.mdg[k]);if(!fresh.length)return;
  if(busy()){clearTimeout(wait);wait=setTimeout(take,4000);return}
  let j=0;const rows=[];
  fresh.forEach(k=>{const r=R[k];d.mdg[k]=1;j+=r[0];rows.push(`<div class="row"><span>${r[2]}</span>${Array.isArray(r[1])?Bx(r[1][0],r[1][1]):r[1]} · 💎 ${r[0]}</div>`);
    if(r[3]&&Deco.grant(r[3])){const it=Deco.item(r[3]);rows.push(`<div class="row" style="background:#e3f7ea"><span>${it.e}</span>جائزة لبيتك: ${it.name} 🏡</div>`)}});
  Aamal.save();Deco.addJ(j);
  try{Aamal.grow('dars',Math.min(3,fresh.length))}catch(e){}   // 🌻 «درس نجحت فيه» في حديقة الأعمال + النقاط
  modal(`<div class="lvup"><div class="big">🏡</div><h3 style="margin:2px 0;color:#14794f">هدايا من «ميادين النصر»!</h3>
    <p style="margin:0 0 6px;color:#8a5a00">${Bx("تعلّمتَ","تعلّمتِ")} سيرة نبيّك ﷺ فكبر بيتك في الجنة 💎 +${j}</p>${rows.join('')}
    <p style="margin:8px 0 0;font-size:13px;color:#5a4a2a">🌱 طلب العلم عملٌ صالح، والجنة الحقيقية بالصلاة والصدق وبرّ الوالدين.</p>
    <div class="nav"><button class="btn gold" data-close>الحمد لله 🤲</button></div></div>`);
}
function card(){const body=$q('#wjGamesBody');if(!body||$q('#wjMaydan'))return;
  const b=document.createElement('button');b.className='bookcard';b.id='wjMaydan';b.style.cssText='border-color:#c9962b;box-shadow:0 5px 0 #e0bb6a';
  b.innerHTML='<span class="cup">⚔️</span><span><b>ميادين النصر</b><small>عِش غزوات النبيّ ﷺ، وتعلّم الشورى والطاعة والثبات، وابنِ بيتك في الجنة · للأشبال من ٩ سنين فما فوق</small></span><span class="go">‹</span>';
  b.onclick=()=>{location.href=URL};
  const first=body.querySelector('.bookcard');body.insertBefore(b,first||null)}
function boot(){card();setTimeout(take,2500)}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(take,800)});
window.Maydan={take,URL};
})();
