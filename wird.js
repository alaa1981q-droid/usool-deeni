/* الورد اليومي 📅 ومراجعة الأخطاء 🔁
   كل سؤال يخطئ فيه الطفل (في الامتحان أو المسابقة أو الورد) يُحفظ في state.miss، ويعود إليه في «أراجع أخطائي»
   وفي الورد اليومي، حتى يجيب عنه صحيحًا ثلاث مرات متباعدة (بعد يوم، ثم ٣ أيام). يعتمد على index.html (qz, renderQ, prepQ, ALLQ). */
(function(){
const DAY=864e5,STEP=[0,1,3]; // أيام الانتظار بعد كل إجابة صحيحة
state.miss=state.miss||{};state.wird=state.wird||{last:'',streak:0,best:0,days:[]};
const byId=Object.fromEntries(ALLQ.map(q=>[q.id,q]));
const boy=()=>!window.Cups||Cups.sex!='g';
const today=()=>new Date().toDateString();
const yest=()=>new Date(Date.now()-DAY).toDateString();
const due=()=>Object.entries(state.miss).filter(([id,m])=>byId[id]&&m.due<=Date.now()).map(([id])=>byId[id]);
const missN=()=>Object.keys(state.miss).filter(id=>byId[id]).length;

window.onAnswer=function(q,ok,mode){const id=q&&q.id;if(!id||!byId[id])return;const m=state.miss[id];
  if(!ok){state.miss[id]={b:0,due:Date.now()+(mode=='review'?0:60e3)}}
  else if(m){m.b++;if(m.b>=STEP.length)delete state.miss[id];else m.due=Date.now()+STEP[m.b]*DAY}
  save()};

/* ---------- البطاقات في الرئيسية ---------- */
const css=document.createElement('style');
css.textContent=`
.wdcard{display:flex;align-items:center;gap:12px;width:100%;margin-top:12px;border:none;border-radius:20px;padding:12px;text-align:right;color:#fff;
  background:linear-gradient(135deg,#ff9a3c,#e2504a);box-shadow:0 5px 0 #b3402f;position:relative}
.wdcard:active{transform:translateY(3px);box-shadow:0 2px 0 #b3402f}
.wdcard .fl{font-size:44px;width:58px;text-align:center;flex:none;line-height:1.1}
.wdcard.todo .fl{animation:pulse 1.2s infinite}
.wdcard b{display:block;font-size:19px}.wdcard small{display:block;font-size:14px;opacity:.95;line-height:1.5}
.wdcard .go{margin-inline-start:auto;font-size:26px;flex:none}
.wdcard.done{background:linear-gradient(135deg,#3fbf6f,#14794f);box-shadow:0 5px 0 #0e5a3a}
.rvcard{border-color:#7c4dc4!important;box-shadow:0 5px 0 #d4c2f0!important}.rvcard .cup{font-size:40px;width:62px;text-align:center;flex:none}
.rvcard .n{background:#7c4dc4;color:#fff;border-radius:12px;padding:0 9px;font-size:14px;font-weight:800;margin-inline-start:6px}
.wdweek{display:flex;gap:6px;justify-content:center;margin:10px 0}
.wdweek span{width:34px;height:42px;border-radius:12px;background:#f1e9df;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:18px;line-height:1.1}
.wdweek span small{font-size:10px;color:var(--muted)}.wdweek span.on{background:#ffe3c2}.wdweek span.now{outline:3px solid #e57c1f}
`;
document.head.appendChild(css);
const wc=document.createElement('button');wc.className='wdcard';wc.id='openWird';
const rc=document.createElement('button');rc.className='bookcard rvcard';rc.id='openReview';
$('#openBook').before(wc);wc.after(rc);
function streakNow(){const w=state.wird;return (w.last==today()||w.last==yest())?w.streak:0}
function upd(){const w=state.wird,done=w.last==today(),st=streakNow();
  wc.className='wdcard '+(done?'done':'todo');
  wc.innerHTML=`<span class="fl">${done?'✅':'🔥'}</span><span><b>وردي اليومي ${st?`· 🔥 ${ar(st)} ${st==1?'يوم':st==2?'يومان':st<=10?'أيام':'يومًا'}`:''}</b><small>${done?(boy()?'أكملتَ ورد اليوم! ارجع غدًا لتكبر شعلتك 🌙':'أكملتِ ورد اليوم! ارجعي غدًا لتكبر شعلتك 🌙'):'٥ أسئلة قصيرة كل يوم، ولا تقطع السلسلة!'}</small></span><span class="go">‹</span>`;
  const n=missN(),d=due().length;rc.style.display=n?'':'none';
  rc.innerHTML=`<span class="cup">🔁</span><span><b>أراجع أخطائي${d?`<span class="n">${ar(d)}</span>`:''}</b><small>${d?'أسئلة أخطأتَ فيها، صحّحها لتثبت في ذاكرتك 🧠':`أحسنت! ${ar(n)} ${n<=10&&n>2?'أسئلة':'سؤال'} ستعود للمراجعة بعد أيام`}</small></span><span class="go">‹</span>`}
upd();
const _rh=window.renderHome;window.renderHome=function(){_rh.apply(this,arguments);upd()};

function startMode(mode,qs,title){qz={mode,qs:qs.map(prepQ),i:0,score:0,wrong:[],sel:null,checked:false};
  document.documentElement.style.setProperty('--sc',mode=='daily'?'#e57c1f':'#7c4dc4');
  $('#qzTitle').textContent=title;renderQ();show('quiz')}
function maxStage(){let m=0;STAGES.forEach((s,i)=>{if(unlocked(i))m=i});return m}
wc.onclick=()=>{tone(880,.05,'sine',.08);
  if(state.wird.last==today()){week('🔥 أكملتَ ورد اليوم','ارجع غدًا لورد جديد، ولا تقطع السلسلة 🌙');return}
  const d=due().slice(0,2),ms=maxStage(),ids=new Set(d.map(q=>q.id));
  const fresh=pickFresh(ALLQ.filter(q=>!q.g&&q.st<=ms&&!ids.has(q.id)),5-d.length);
  startMode('daily',shuffle(d.concat(fresh)),'📅 وردي اليومي')};
rc.onclick=()=>{tone(880,.05,'sine',.08);const d=due();
  if(!d.length){modal(`<div style="font-size:50px">🧠</div><h3 style="margin:4px 0">لا مراجعة الآن</h3><p>${boy()?'صحّحتَ':'صحّحتِ'} أخطاءك! ستعود بعد أيام لتتأكد أنها ثبتت في ذاكرتك.</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  startMode('review',shuffle(d).slice(0,8),'🔁 أراجع أخطائي')};

function weekHTML(){const days=state.wird.days||[],L=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];let h='';
  for(let k=6;k>=0;k--){const d=new Date(Date.now()-k*DAY),on=days.includes(d.toDateString());h+=`<span class="${on?'on':''} ${k==0?'now':''}">${on?'🔥':'·'}<small>${L[d.getDay()]}</small></span>`}
  return `<div class="wdweek" dir="ltr">${h}</div>`}
function week(t,p){modal(`<div style="font-size:54px">🔥</div><h3 style="margin:4px 0">${t}</h3>${weekHTML()}<p>${p}<br><small style="color:var(--muted)">أطول سلسلة لك: ${ar(state.wird.best||0)}</small></p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`)}

window.wirdFinish=function(){const n=qz.qs.length,sc=qz.score,mode=qz.mode;let h='<div class="result">',jw='';
  if(mode=='daily'){const w=state.wird,first=w.last!=today();
    if(first){w.streak=w.last==yest()?w.streak+1:1;w.last=today();w.best=Math.max(w.best||0,w.streak);w.days=(w.days||[]).concat(today()).slice(-30);save()}
    const st=w.streak,gain=first?10+Math.min(st,10)*2:0;if(gain&&window.Deco)jw=Deco.challenge(gain,'wird');
    h+=`<div class="big">🔥</div><h2 style="color:#e57c1f">${st>1?`${ar(st)} ${st==2?'يومان':st<=10?'أيام':'يومًا'} متتالية!`:(boy()?'بدأتَ سلسلتك!':'بدأتِ سلسلتك!')}</h2>
      <div class="score">أجبتَ عن ${ar(sc)} من ${ar(n)} بشكلٍ صحيح</div>${weekHTML()}${jw}
      ${st&&st%7==0&&first?`<div id="wdCup"></div>`:''}
      <p class="tip">${boy()?'ارجع':'ارجعي'} غدًا لورد جديد. كلما طالت السلسلة زادت الماسات 💎</p>`;
  } else {const left=due().length;if(sc&&window.Deco)jw=Deco.challenge(sc*3,'review');
    h+=`<div class="big">${sc==n?'🌟':'🧠'}</div><h2 style="color:#7c4dc4">${boy()?'صحّحتَ':'صحّحتِ'} ${ar(sc)} من ${ar(n)}</h2>${jw}
      <p class="tip">${left?`بقي ${ar(left)} للمراجعة.`:'كل سؤال صحّحته يعود بعد أيام لنتأكد أنه ثبت 💪'}</p>`}
  h+=`<div class="nav"><button class="btn gold" id="wdHome">الرئيسية</button></div></div>`;
  $('#rsBody').innerHTML=h;show('result');if(sc>=n-1){try{fanfare();confetti()}catch(e){}}
  const c=$('#wdCup');if(c&&window.cupsAward)cupsAward(2,'wird',c);
  $('#wdHome').onclick=()=>{renderHome();show('home')}};
})();
