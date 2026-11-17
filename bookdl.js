/* ⬇️ تحميل الكتاب (PDF من صفحات الكتاب) + عدّاد عدد الأشخاص الذين حمّلوه.
   كل جهاز يُحسب مرة واحدة فقط (stats/bookDlBy/$uid)، والعدّاد في stats/bookDl على Firebase (يحتاج قواعد جديدة في database.rules.json).
   لا يُرسل أي اسم أو بيانات شخصية، فقط +١ للعدّاد. */
(function(){
const PDF='usool-deeni-book.pdf',LIVE='https://alaa1981q-droid.github.io/usool-deeni/'+PDF,CK='usul5_bookdl_v1';
let st={done:0,n:0};try{const s=JSON.parse(localStorage.getItem(CK)||'null');if(s)st=Object.assign(st,s)}catch(e){}
const sv=()=>{try{localStorage.setItem(CK,JSON.stringify(st))}catch(e){}};
const css=document.createElement('style');
css.textContent=`.dlcard{border-color:#1fa463!important;box-shadow:0 5px 0 #bfe8cf!important}.dlcard .cup{font-size:40px;width:62px;text-align:center;flex:none}`;
document.head.appendChild(css);
const card=document.createElement('button');card.className='bookcard dlcard';card.id='dlBook';
function line(){const n=st.n;return n>0?`حمّله ${ar(n)} ${n==1?'شخص':n==2?'شخصان':n<=10?'أشخاص':'شخصًا'} حتى الآن 🌟`:'ملف PDF تحفظه في هاتفك وتقرأه بلا إنترنت'}
function draw(){card.innerHTML=`<span class="cup" style="line-height:0"><svg viewBox="0 0 50 70" width="50" height="70" aria-hidden="true" style="border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.18)"><defs><linearGradient id="dlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fbf6f"/><stop offset="1" stop-color="#14794f"/></linearGradient></defs><rect width="50" height="70" rx="8" fill="url(#dlg)"/><path d="M25 12v26M14 28l11 12 11-12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="11" y="48" width="28" height="4" rx="2" fill="#fff"/><text x="25" y="63" font-size="9" font-weight="800" text-anchor="middle" fill="#fff">PDF</text></svg></span><span><b>حمّل الكتاب</b><small id="dlLine">${line()}</small></span><span class="go">‹</span>`}
draw();$('#openBook').after(card);
async function sync(add){
  if(!navigator.onLine||!window.OnlineAPI)return;
  try{await OnlineAPI.init();const db=OnlineAPI.db,me=OnlineAPI.me;if(!db||!me)return;
    if(add&&!st.done){try{await db.ref('stats/bookDlBy/'+me).set(true);await db.ref('stats/bookDl').transaction(v=>(v||0)+1)}catch(e){}st.done=1;sv()}
    const v=(await db.ref('stats/bookDl').get()).val();if(typeof v=='number'){st.n=v;sv();draw()}
  }catch(e){}}
card.onclick=()=>{
  if(location.host=='appassets.androidplatform.net'){location.href=LIVE}   // في تطبيق الأندرويد يُفتح الرابط في المتصفح فينزّل
  else{const a=document.createElement('a');a.href=PDF;a.download='أصول-ديني-الخمسة.pdf';document.body.appendChild(a);a.click();a.remove()}
  st.pending=1;sv();
  modal(`<div style="font-size:52px">⬇️</div><h3 style="margin:4px 0">جاري تحميل الكتاب</h3><p>سيُحفظ في هاتفك. ${st.n?'انضمّ إلى '+ar(st.n)+' شخص حمّلوه 🌟':''}</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);
  sync(true)};
addEventListener('load',()=>setTimeout(()=>sync(!!st.pending&&!st.done),3500));
})();
