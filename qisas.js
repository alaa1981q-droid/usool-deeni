/* 📚 قصص الأنبياء للصغار: قصة قصيرة لكل نبي، مشاهد مرسومة بلا وجوه (رموز وألوان فقط)، ثم ٣ أسئلة وجائزة 💎.
   المحتوى كتبه المساعد للمراجعة وليس من الكتاب: لا يظهر للأطفال إلا ما وافق عليه الشيخ (حقل ok:true).
   لا آيات في المتن حاليًا. إن أُضيفت آية فتُنقل حرفيًا من المصحف بعد تدقيق الشيخ. */
(function(){
const QKEY='usul5_qisas_v1';
let qs={done:{}};try{const s=JSON.parse(localStorage.getItem(QKEY)||'null');if(s&&s.done)qs=s}catch(e){}
const qsave=()=>{try{localStorage.setItem(QKEY,JSON.stringify(qs))}catch(e){}};
const boy=()=>!window.Cups||Cups.sex!='g';

/* مشهد: خلفية متدرّجة + رموز (رمز، x، y، حجم) على لوحة ٣٠٠×١٦٠ */
function art(c1,c2,items){return `<svg viewBox="0 0 300 160" class="qsart" role="img" aria-hidden="true"><defs><linearGradient id="g${c1.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="300" height="160" rx="18" fill="url(#g${c1.slice(1)})"/>${items.map(([e,x,y,s])=>`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle">${e}</text>`).join('')}</svg>`}

const STORIES=[
 {id:'adam',n:'آدم',e:'🌍',col:'#8a5a2b',ok:true,
  scenes:[
   {a:art('#7ec8f5','#d9f0ff',[['☀️',250,45,40],['☁️',60,50,44],['🌍',150,115,70],['⭐',100,30,18],['🌊',40,140,34],['🌳',260,140,34]]),
    t:'خلق الله كل شيء جميل: السماء والأرض والشمس والنجوم والبحار والأشجار. وكل ما في الكون يسبّح الله ويطيعه.'},
   {a:art('#ffe29a','#fff6d8',[['✨',80,60,34],['✨',220,50,30],['🌍',150,110,64],['🌿',60,140,32],['🌿',240,140,32]]),
    t:'وأراد الله أن يجعل في الأرض إنسانًا يعمّرها ويكون خليفةً فيها، وأخبر الملائكة بذلك.'},
   {a:art('#d9b38c','#f4e4d2',[['🟤',150,110,60],['✨',90,50,30],['✨',210,55,30],['💧',60,120,30],['🌱',240,130,36]]),
    t:'فخلق الله آدم من طين، ونفخ فيه من روحه، فصار إنسانًا يسمع ويرى ويفكّر ويتكلّم.'},
   {a:art('#b9e6c4','#eafaf0',[['📚',70,60,38],['💡',150,50,38],['🐘',60,130,40],['🦁',130,135,36],['🌳',200,130,38],['🌊',260,135,36]]),
    t:'وعلّم الله آدم أسماء الأشياء كلّها. فعرف الملائكة أن العلم نعمة كبيرة، وأن الله هو العليم الحكيم.'},
   {a:art('#2b2d6e','#5a4a9a',[['🌙',240,40,36],['✨',70,50,26],['🔥',90,125,56],['🚫',200,115,48]]),
    t:'وأمر الله الملائكة أن يسجدوا لآدم تكريمًا له، فأطاعوا كلّهم. أمّا إبليس فتكبّر وقال: أنا خير منه! فعصى أمر الله، فطرده الله من رحمته. فلنتعلّم أن التكبّر يُبعدنا عن الله.'},
   {a:art('#9fe0a8','#e6f8d9',[['🌴',50,70,44],['⛲',150,60,40],['🦋',230,60,30],['🌳',90,135,46],['🍎',150,135,36],['🚫',215,135,34]]),
    t:'وسكن آدم وزوجته حوّاء في الجنة، وكان لهما فيها كل ما يحبّان، ونصحهما الله ألا يقتربا من شجرة واحدة. فوسوس لهما إبليس وهو يريد أن يُحزنهما، فنسيا نصيحة ربّهما.'},
   {a:art('#8fb8e8','#e4f0ff',[['🤲',150,95,64],['🌧️',70,45,38],['🌈',230,60,40],['💚',150,145,28]]),
    t:'فحزن آدم وحوّاء، وطلبا من الله أن يغفر لهما، وقبل الله توبتهما لأنه التوّاب الرحيم.'},
   {a:art('#ffd0a0','#fff0dc',[['🏔️',70,75,50],['🌅',230,60,46],['🌾',60,140,36],['🏡',150,130,46],['🌳',250,140,36]]),
    t:'ثم عاش آدم وحوّاء على الأرض، وعلّم آدم أولاده الخير وعبادة الله. ومن قصّته نتعلّم: نطلب العلم، ولا نتكبّر، وإذا أخطأنا نتوب ونعتذر ونرجع إلى الله.'}],
  q:[{q:'من الذي رفض السجود لآدم تكبّرًا؟',o:['جبريل','إبليس','حوّاء'],a:1},
     {q:'ماذا علّم الله آدم؟',o:['أسماء الأشياء كلّها','الطيران','بناء السفن'],a:0},
     {q:'ماذا نفعل إذا أخطأنا؟',o:['نُخفي الخطأ','نغضب','نتوب ونعتذر ونرجع إلى الله'],a:2}]},
 {id:'nuh',n:'نوح',e:'🚢'},{id:'ibrahim',n:'إبراهيم',e:'⭐'},{id:'musa',n:'موسى',e:'🌊'},{id:'yusuf',n:'يوسف',e:'🌙'},{id:'muhammad',n:'محمد ﷺ',e:'🕌'}];

const css=document.createElement('style');
css.textContent=`
.qscard{border-color:#8a5a2b!important;box-shadow:0 5px 0 #e3cfae!important}.qscard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.qshead{text-align:center;background:linear-gradient(180deg,#fff3dc,#fff);border:3px solid #8a5a2b;border-radius:24px;padding:12px 14px;margin-bottom:12px}
.qshead .em{font-size:50px;line-height:1.2}.qshead h2{margin:2px 0;color:#6b4519;font-size:22px}.qshead p{margin:2px 0;font-size:15px;color:var(--muted);line-height:1.7}
.qsgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.qst{background:#fff;border:2px solid #e3cfae;border-radius:18px;padding:14px 8px;text-align:center;color:inherit;box-shadow:0 4px 0 #e3cfae;position:relative}
.qst:active{transform:translateY(3px);box-shadow:0 1px 0 #e3cfae}.qst .e{font-size:40px;display:block}.qst b{font-size:20px;color:#6b4519}.qst small{display:block;color:var(--muted);font-size:13px}
.qst.soon{opacity:.55;box-shadow:none}.qst.done{border-color:var(--gold);background:#fffbef}.qst .ok{position:absolute;top:-8px;left:-6px;font-size:24px}
.qsart{width:100%;display:block;border-radius:18px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
.qstxt{font-size:21px;line-height:2.1;color:#0b3d27;background:#fff;border:2px solid #efe3cc;border-radius:18px;padding:12px 14px;margin:12px 0;text-align:right;font-weight:600}
.qsdots{display:flex;gap:6px;justify-content:center;margin:6px 0}.qsdots i{width:10px;height:10px;border-radius:50%;background:#e3cfae}.qsdots i.on{background:#8a5a2b;transform:scale(1.25)}
.qsopt{display:block;width:100%;text-align:right;background:#fff;border:3px solid var(--line);border-radius:16px;padding:12px 14px;margin:8px 0;font-size:19px;font-weight:700;color:var(--ink)}
.qsopt.ok{background:#e3f7ea;border-color:#1fa463}.qsopt.no{background:#fde7e7;border-color:#d64545}
`;
document.head.appendChild(css);

const sec=document.createElement('section');sec.className='screen';sec.id='qisas';
sec.innerHTML=`<div class="bar"><button class="back" id="qsBack">›</button><div class="ttl" id="qsTitle">📚 قصص الأنبياء</div></div><div id="qsBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard qscard';card.id='openQisas';
card.innerHTML=`<span class="cup">📚</span><span><b>قصص الأنبياء</b><small id="qsLine">قصص قصيرة وجميلة عن الأنبياء</small></span><span class="go">‹</span>`;
const anchor=$('#openHifz')||$('#openBook');anchor.after(card);
const body=()=>$('#qsBody');
let inStory=false;
function line(){const n=Object.keys(qs.done).length,t=STORIES.filter(s=>s.ok).length;$('#qsLine').textContent=n?`قرأتَ ${ar(n)} من ${ar(t)} قصص. ما شاء الله 🌟`:'قصة آدم عليه السلام، بالصور والأسئلة'}
line();
card.onclick=()=>{list();show('qisas')};
$('#qsBack').onclick=()=>{if(inStory){list()}else{renderHome&&renderHome();show('home')}};

function list(){inStory=false;$('#qsTitle').textContent='📚 قصص الأنبياء';
  body().innerHTML=`<div class="qshead"><div class="em">📚</div><h2>قصص الأنبياء</h2><p>${boy()?'اختر':'اختاري'} قصة، واقرأها، ثم أجب عن ٣ أسئلة واربح 💎</p></div>
   <div class="qsgrid">${STORIES.map(s=>`<button class="qst ${s.ok?'':'soon'} ${qs.done[s.id]?'done':''}" data-s="${s.id}"><span class="e">${s.e}</span><b>${s.n}</b><small>${s.ok?(qs.done[s.id]?'قرأتها ✓':'ابدأ القصة'):'قريبًا 🔒'}</small>${qs.done[s.id]?'<span class="ok">✅</span>':''}</button>`).join('')}</div>`;
  body().querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const s=STORIES.find(x=>x.id==b.dataset.s);if(!s.ok){modal(`<div style="font-size:50px">${s.e}</div><h3 style="margin:4px 0">قصة ${s.n}</h3><p>قريبًا إن شاء الله 🌙</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}read(s,0)});
  window.scrollTo(0,0)}

function read(s,i){inStory=true;const sc=s.scenes[i],last=i==s.scenes.length-1;$('#qsTitle').textContent=s.e+' قصة '+s.n;
  body().innerHTML=`<div class="qsdots">${s.scenes.map((_,k)=>`<i class="${k==i?'on':''}"></i>`).join('')}</div>${sc.a}<div class="qstxt">${sc.t}</div>
   <div class="nav">${i?'<button class="btn sec" id="qsPrev">‹ السابق</button>':''}<button class="btn gold" id="qsNext">${last?'الأسئلة 📝':'التالي ›'}</button></div>`;
  if(i)$('#qsPrev').onclick=()=>read(s,i-1);
  $('#qsNext').onclick=()=>{(typeof tone=='function')&&tone(660,.06,'sine',.1);last?quiz(s,0,0):read(s,i+1)};window.scrollTo(0,0)}

function quiz(s,i,score){const q=s.q[i];$('#qsTitle').textContent='📝 أسئلة قصة '+s.n;
  body().innerHTML=`<div class="qsdots">${s.q.map((_,k)=>`<i class="${k==i?'on':''}"></i>`).join('')}</div><div class="qstxt" style="font-size:22px">${q.q}</div>
   ${q.o.map((o,k)=>`<button class="qsopt" data-k="${k}">${o}</button>`).join('')}<div class="fb" id="qsFb"></div>`;
  let locked=false;
  body().querySelectorAll('.qsopt').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const k=+b.dataset.k,ok=k==q.a;
    b.classList.add(ok?'ok':'no');if(!ok)body().querySelectorAll('.qsopt')[q.a].classList.add('ok');
    $('#qsFb').className='fb '+(ok?'ok':'bad');$('#qsFb').textContent=ok?'أحسنت! 🌟':'الجواب الصحيح باللون الأخضر 💪';
    try{window.onAnswer&&onAnswer({id:'qisas:'+s.id+':'+i,g:1,q:q.q},ok,'qisas')}catch(e){}
    setTimeout(()=>{i+1<s.q.length?quiz(s,i+1,score+(ok?1:0)):finish(s,score+(ok?1:0))},1100)})}

function finish(s,score){inStory=false;const first=!qs.done[s.id];let jw='';
  if(first){qs.done[s.id]=1;qsave();if(window.Deco&&Deco.addJ){Deco.addJ(10+score*5);jw=`<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(10+score*5)}</b>جواهر لبيتك في الجنة!</div>`}
    try{window.Aamal&&Aamal.grow('dars')}catch(e){}}
  line();try{typeof tone=='function'&&[523,659,784].forEach((f,k)=>tone(f,.15,'triangle',.14,k*.12))}catch(e){}
  body().innerHTML=`<div class="qshead"><div class="em">${score==s.q.length?'🌟':'👏'}</div><h2>${score==s.q.length?'ما شاء الله! أجبتَ على كل الأسئلة':'أحسنت! ('+ar(score)+' من '+ar(s.q.length)+')'}</h2><p>${boy()?'أنهيتَ':'أنهيتِ'} قصة ${s.n} عليه السلام</p></div>${jw}
   <div class="nav"><button class="btn gold" id="qsAgain">أقرأها مرة ثانية 📖</button><button class="btn sec" id="qsList">كل القصص</button></div>`;
  $('#qsAgain').onclick=()=>read(s,0);$('#qsList').onclick=list;window.scrollTo(0,0)}
window.Qisas={stories:STORIES,get done(){return qs.done}};
})();
