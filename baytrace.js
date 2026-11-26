/* سباق بناء البيت مع صديق — مباشر، كلٌّ من تلفونه (يعتمد على bayt.js و online.js و jannah.js)
   الغرفة: rooms/$id = {type:'bayt', host, guest, state:'wait'|'play'|'gone', lv, start, winner, players:{uid:{nick,av,p,n,on,to}}, cheer:{uid:{e,t}}}
   الفائز أول من يكمل الطابق (transaction على winner)، وإذا انتهى وقت الاثنين فالأكثر طوبًا. لا محادثة: تشجيع بأيقونات ثابتة فقط. */
(function(){
const O=()=>window.OnlineAPI;
const boy=()=>!window.Cups||Cups.sex!='g';
const esc=v=>String(v==null?'':v).replace(/[<>&"'`]/g,'');
const CHEERS=['👏','💪','😄','🌟'];
let R=null; // {id,ref,off,isHost,lv,opp,ended,G,startT,lastCheer,seenCheer}

const css=document.createElement('style');
css.textContent=`
.rcbtn{width:100%;margin-top:10px;border:none;border-radius:20px;padding:12px;font-size:19px;font-weight:800;color:#fff;background:linear-gradient(135deg,#e2504a,#e57c1f 55%,#f2b632);box-shadow:0 6px 0 #a8332e;position:relative;overflow:hidden}
.rcbtn:active{transform:translateY(3px);box-shadow:0 3px 0 #a8332e}
.rcbtn small{display:block;font-size:13px;font-weight:500;opacity:.95}
.rcbtn::after{content:'';position:absolute;top:0;bottom:0;width:40px;left:-60px;background:rgba(255,255,255,.35);transform:skewX(-20deg);animation:rcshine 2.6s infinite}
@keyframes rcshine{60%,100%{left:110%}}
.rclv{display:flex;gap:8px;margin:6px 0 12px}
.rclv button{flex:1;border:2px solid var(--line);background:#fff;border-radius:16px;padding:6px 2px;font-size:13px;font-weight:700;line-height:1.4}
.rclv button span{display:block;font-size:26px}
.rclv button.on{border-color:#e57c1f;background:#fff4e6}
#byOpp{display:flex;align-items:center;gap:8px;background:#fff4e6;border:2px solid #f3c08f;border-radius:16px;padding:4px 8px;margin-top:6px}
#byOpp .h{width:70px;height:58px;flex:none;border-radius:10px;overflow:hidden;background:#cfeeff}
#byOpp .h svg{width:100%;height:100%;display:block}
#byOpp .w{flex:1;min-width:0}#byOpp b{font-size:14px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#byOpp .bar{height:10px;background:#f6dcc0;border-radius:8px;overflow:hidden;margin-top:3px}#byOpp .bar i{display:block;height:100%;background:linear-gradient(90deg,#e57c1f,#e2504a);border-radius:8px;transition:width .3s}
#byOpp .ch{display:flex;gap:2px}#byOpp .ch button{border:none;background:#fff;border-radius:10px;font-size:18px;padding:2px 4px;line-height:1.2}
#byOpp .ch button:disabled{opacity:.4}
.rcfly{position:fixed;left:50%;top:40%;font-size:80px;z-index:60;pointer-events:none;animation:rcfly 1.4s ease-out forwards}
@keyframes rcfly{0%{transform:translate(-50%,20px) scale(.4);opacity:0}25%{transform:translate(-50%,0) scale(1.2);opacity:1}to{transform:translate(-50%,-120px) scale(1);opacity:0}}
.rcwait{text-align:center}.rcwait .vs{font-size:44px;margin:6px 0}
`;
document.head.appendChild(css);

/* زر السباق في قائمة البيت */
const prevHook=Deco.menuHook;
Deco.menuHook=function(B){prevHook(B);const anchor=B.querySelector('.jbar');
  const html=`<button class="rcbtn" id="rcOpen">🏁 سباق مباشر مع صديق<small>${boy()?'ابنِ':'ابني'} أسرع من صديقك، وكلٌّ يرى بيت الآخر يرتفع!</small></button>`;
  if(anchor)anchor.insertAdjacentHTML('beforebegin',html);else B.insertAdjacentHTML('afterbegin',html);
  $('#rcOpen').onclick=()=>{Bayt.sTap();lobby()}};

/* ---------- الدعوة ---------- */
let lvSel=1;
async function lobby(){show('jannah');$('#jTitle').textContent='🏁 سباق مع صديق';const B=$('#jBody');
  Deco.setBack(null);
  B.innerHTML=`<div class="handoff"><div class="big spin">🌐</div><p>جارٍ الاتصال…</p></div>`;
  const A=O();if(!A||!navigator.onLine){B.innerHTML=noNet();return}
  try{await A.init()}catch(e){B.innerHTML=noNet();$('#rcRetry').onclick=lobby;return}
  if(!A.profile){B.innerHTML=`<div class="handoff"><div class="big">🏁</div><h2>${boy()?'اختر':'اختاري'} لقبك أولًا</h2><p>بعدها ${boy()?'أضف':'أضيفي'} أصدقاءك و${boy()?'سابقهم':'سابقيهم'} في البناء!</p><button class="btn gold" id="rcProf" style="flex:none;min-width:200px">اختر لقبي 🌟</button></div>`;
    $('#rcProf').onclick=()=>{window.onlineReturn=lobby;openOnline()};return}
  let ids=[];try{ids=await A.friendIds()}catch(e){B.innerHTML=noNet();$('#rcRetry').onclick=lobby;return}
  const rows=await Promise.all(ids.map(async id=>{try{const [p,pr]=await Promise.all([A.db.ref('profiles/'+id).get(),A.db.ref('presence/'+id).get()]);return {id,p:p.val()||{nick:'؟',av:'❔'},on:!!pr.val()}}catch(e){return {id,p:{nick:'؟',av:'❔'},on:false}}}));
  rows.sort((a,b)=>b.on-a.on);
  const L=Bayt.LEVELS;
  B.innerHTML=`<div class="pick-h" style="text-align:center;font-weight:800">على أيّ طابق تتسابقان؟</div>
    <div class="rclv">${L.map((l,i)=>`<button data-lv="${i}" class="${i==lvSel?'on':''}"><span>${l.icon}</span>${l.name}</button>`).join('')}</div>
    ${rows.length?`<div class="flist">${rows.map(r=>`<div class="frow"><span class="av">${esc(r.p.av)}</span><span class="who-n"><b>${esc(r.p.nick)}</b><small>${r.on?'🟢 متصل الآن':'⚪ غير متصل'}</small></span>
      <button class="mini go" data-r="${r.id}" ${r.on?'':'disabled'}>🏁 سابِقه</button></div>`).join('')}</div>
      <p class="bcap">الصديق يجب أن يكون متصلًا الآن (التطبيق مفتوح عنده).</p>`
    :`<div class="handoff" style="flex:none"><div class="big">🤝</div><h2>لا أصدقاء بعد</h2><p>${boy()?'أعطِ':'أعطي'} رمزك لصديقك: <b dir="ltr">${A.profile.code}</b></p></div>`}
    <div class="nav" style="margin-top:10px"><button class="btn sec" id="rcAdd">➕ أضف صديقًا</button></div>`;
  B.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{lvSel=+b.dataset.lv;B.querySelectorAll('[data-lv]').forEach(x=>x.classList.toggle('on',x===b));Bayt.sTap()});
  B.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>invite(rows.find(r=>r.id==b.dataset.r)));
  $('#rcAdd').onclick=()=>{window.onlineReturn=lobby;A.openAdd()}}
function noNet(){return `<div class="handoff"><div class="big">📡</div><h2>لا يوجد اتصال</h2><p>السباق مع صديق يحتاج إنترنت.</p><button class="btn gold" id="rcRetry" style="flex:none;min-width:200px">حاول مرة أخرى</button></div>`}

async function invite(r){const A=O(),B=$('#jBody');
  const ref=A.db.ref('rooms').push();
  await ref.set({type:'bayt',host:A.me,guest:r.id,state:'wait',lv:lvSel,t:firebase.database.ServerValue.TIMESTAMP,
    players:{[A.me]:{nick:A.profile.nick,av:A.profile.av,p:0,on:true}}});
  await A.db.ref(`invites/${r.id}/${A.me}`).set({room:ref.key,nick:A.profile.nick,av:A.profile.av,kind:'bayt',t:firebase.database.ServerValue.TIMESTAMP});
  B.innerHTML=`<div class="handoff rcwait"><div class="vs">${esc(A.profile.av)} ⚔️ ${esc(r.p.av)}</div><h2>ننتظر ${esc(r.p.nick)} يقبل السباق…</h2>
    <p>${Bayt.LEVELS[lvSel].icon} ${Bayt.LEVELS[lvSel].floor}: ${Bayt.LEVELS[lvSel].name}</p><div class="big spin" style="font-size:40px">⏳</div>
    <button class="btn sec" id="rcCancel" style="flex:none;min-width:200px">إلغاء</button></div>`;
  enter(ref.key,true,r);
  $('#rcCancel').onclick=()=>{A.db.ref(`invites/${r.id}/${A.me}`).remove();R&&R.ref.update({state:'gone'});leave();lobby()};
  setTimeout(()=>{if(R&&R.id==ref.key&&!R.started){A.db.ref(`invites/${r.id}/${A.me}`).remove();R.ref.update({state:'gone'});leave();
    if($('#jannah').classList.contains('on')){B.innerHTML=`<div class="handoff"><div class="big">😴</div><h2>لم يردّ صديقك</h2><p>جرّب مرة أخرى بعد قليل.</p><button class="btn gold" id="rcBack2" style="flex:none;min-width:200px">رجوع</button></div>`;$('#rcBack2').onclick=lobby}}},90000)}

async function join(id){const A=O();
  try{await A.init()}catch(e){A.toast('لا يوجد اتصال');return}
  const r=(await A.db.ref('rooms/'+id).get()).val();
  if(!r||r.type!='bayt'||r.state!='wait'||r.guest!=A.me){A.toast('انتهت هذه الدعوة');return}
  await A.db.ref('rooms/'+id).update({[`players/${A.me}`]:{nick:A.profile.nick,av:A.profile.av,p:0,on:true}});
  show('jannah');$('#jTitle').textContent='🏁 سباق مع صديق';
  $('#jBody').innerHTML=`<div class="handoff rcwait"><div class="vs">🏗️</div><h2>استعدّ للسباق!</h2><div class="big spin" style="font-size:40px">⏳</div></div>`;
  enter(id,false,null)}

/* ---------- الغرفة ---------- */
function enter(id,isHost,friend){leave();const A=O();
  R={id,isHost,ref:A.db.ref('rooms/'+id),started:false,ended:false,lastCheer:0,seenCheer:{},lastP:-1};
  R.ref.child(`players/${A.me}/on`).onDisconnect().set(false);
  const cb=R.ref.on('value',s=>onRoom(s.val()));R.off=()=>R&&R.ref.off('value',cb)}
function leave(){try{O().playing&&O().playing(false)}catch(e){}if(!R)return;try{R.off&&R.off();R.ref.child(`players/${O().me}/on`).onDisconnect().cancel()}catch(e){}clearTimeout(R.goT);clearInterval(R.watch);R=null}

function onRoom(r){if(!R||!r)return;const A=O(),me=A.me;R.data=r;const ids=Object.keys(r.players||{});
  if(r.state=='gone'&&!R.started){if(R.isHost)return;A.toast('أُلغي السباق');leave();show('bayt');Bayt.menu();return}
  if(r.state=='wait'&&R.isHost&&ids.length==2){R.ref.update({state:'play',start:A.now()+5000});return}
  if(r.state=='play'&&!R.started){R.started=true;try{O().playing&&O().playing(true)}catch(e){}R.opp=ids.find(i=>i!=me);R.lv=r.lv|0;R.start=r.start;
    Bayt.play(R.lv,NET);drawOpp();
    // إذا انقطع الخصم طويلًا أثناء السباق فالفوز لك
    R.watch=setInterval(()=>{if(!R||R.ended)return;const o=(R.data.players||{})[R.opp];if(o&&o.on===false){R.offFor=(R.offFor||0)+1;if(R.offFor>=4)claim(me,'gone')}else R.offFor=0},2000)}
  if(!R.started)return;
  drawOpp();
  // تشجيع
  const ch=r.cheer&&r.cheer[R.opp];if(ch&&ch.t&&!R.seenCheer[ch.t]){R.seenCheer[ch.t]=1;if(A.now()-ch.t<6000)flyCheer(ch.e)}
  // انتهاء الوقت عند الاثنين: المضيف يحكم بالأكثر طوبًا
  const pm=r.players[me]||{},po=r.players[R.opp]||{};
  if(!r.winner&&pm.to&&po.to&&R.isHost){claim(pm.p>po.p?me:po.p>pm.p?R.opp:'tie','time')}
  if(r.state=='gone'&&!r.winner&&r.quit&&r.quit!=me)claim(me,'quit');
  if(r.winner&&!R.ended)end(r)}
function claim(w,why){if(!R)return;R.ref.child('winner').transaction(v=>v?undefined:w+'|'+why).catch(()=>{})}

function drawOpp(){const el=$('#byOpp');if(!el||!R||!R.data)return;const o=(R.data.players||{})[R.opp]||{},lv=Bayt.LEVELS[R.lv],n=lv.seq.length,f=Math.min(1,(o.p||0)/n);
  if(!el.dataset.ok){el.dataset.ok=1;el.innerHTML=`<div class="h" id="rcOH"></div><div class="w"><b>${esc(o.av)} ${esc(o.nick)}</b><div class="bar"><i id="rcOB"></i></div></div><div class="ch">${CHEERS.map(c=>`<button data-c="${c}">${c}</button>`).join('')}</div>`;
    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>cheer(b.dataset.c))}
  if(R.lastOppP!==o.p){R.lastOppP=o.p;$('#rcOH').innerHTML=Bayt.houseSVG(R.lv,R.lv,f,false,false,{c:0});$('#rcOB').style.width=f*100+'%'}}
function cheer(e){const A=O(),t=A.now();if(!R||t-R.lastCheer<2500)return;R.lastCheer=t;
  R.ref.child('cheer/'+A.me).set({e,t});document.querySelectorAll('#byOpp [data-c]').forEach(b=>{b.disabled=true;setTimeout(()=>b.disabled=false,2500)});Bayt.sTap()}
function flyCheer(e){const d=document.createElement('div');d.className='rcfly';d.textContent=e;document.body.appendChild(d);setTimeout(()=>d.remove(),1500);try{tone(1047,.1,'sine',.1)}catch(x){}}

/* ---------- ربط محرّك اللعبة ---------- */
const NET={
  ready(G){if(!R)return;R.G=G;const wait=Math.max(0,R.start-O().now()-3050);R.goT=setTimeout(()=>{if(R&&!R.ended)Bayt.begin()},wait)},
  prog(G){if(!R)return;const p=G.p;if(p===R.lastP)return;R.lastP=p;R.ref.child('players/'+O().me).update({p,n:G.lv.seq.length})},
  finish(G){if(!R)return;G.over=true;R.ref.child('players/'+O().me).update({p:G.lv.seq.length,score:G.score});claim(O().me,'built');
    $('#byHouse').innerHTML=Bayt.houseSVG(R.lv+1,-1,0,true,true)},
  timeout(G){if(!R)return;G.over=true;R.ref.child('players/'+O().me).update({to:true,p:G.p});
    const o=document.createElement('div');o.className='bover';o.innerHTML=`<div style="font-size:46px">⏱️</div><p><b>انتهى وقتك!</b><br>ننتظر صديقك…</p>`;G.board.appendChild(o)},
  quit(G){modal(`<h3 style="margin:4px 0">تريد الانسحاب من السباق؟</h3><p>إذا خرجت يفوز صديقك.</p><div class="nav"><button class="btn sec" data-close>أكمل</button><button class="btn" id="rcQuit">انسحاب</button></div>`,()=>{
    $('#rcQuit').onclick=()=>{closeModal();if(R){R.ended=true;R.ref.update({state:'gone',quit:O().me});R.ref.child('winner').transaction(v=>v?undefined:R.opp+'|quit')}leave();Bayt.stop();Bayt.menu()}})}
};

function end(r){const A=O(),me=A.me;try{A.playing&&A.playing(false)}catch(e){}R.ended=true;clearTimeout(R.goT);clearInterval(R.watch);
  const G=Bayt.G;if(G){G.over=true}Bayt.stop();
  const [wid,why]=String(r.winner).split('|'),tie=wid=='tie',win=wid==me,o=(r.players||{})[R.opp]||{},lvi=R.lv,lv=Bayt.LEVELS[lvi];
  const jw=window.Deco?Deco.challenge(win?40:tie?25:15,'brace'):'';
  if(win||tie){try{fanfare();confetti()}catch(e){}}
  const msg=win?(why=='quit'||why=='gone'?'خرج صديقك من السباق، فالفوز لك!':why=='time'?'بنيتَ أكثر من صديقك قبل نهاية الوقت!':'بنيتَ الطابق قبل صديقك! 🏗️'):tie?'بنيتما بالسرعة نفسها!':'صديقك بنى أسرع هذه المرة. المرة القادمة لك إن شاء الله! 💪';
  const friend={id:R.opp,p:{nick:o.nick,av:o.av}},wasHost=R.isHost;
  leave();
  modal(`<div style="font-size:70px;line-height:1.2">${win?'🏆':tie?'🤝':'💪'}</div><h3 style="margin:2px 0">${win?(boy()?'فزتَ بالسباق!':'فزتِ بالسباق!'):tie?'تعادل! كلاكما بطل':'أحسنت المحاولة!'}</h3>
    <p style="margin:4px 0">${msg}</p><p style="margin:2px 0;font-size:14px;color:var(--muted)">${lv.icon} ${lv.floor}: ${lv.name} · ${esc(o.av)} ${esc(o.nick)}</p>${jw}
    <div class="nav"><button class="btn gold" id="rcAgain">🔁 سباق جديد</button><button class="btn sec" id="rcHome">بيتي</button></div>`,()=>{
    $('#rcAgain').onclick=()=>{closeModal();lvSel=lvi;Deco.setBack(null);show('jannah');$('#jTitle').textContent='🏁 سباق مع صديق';invite(friend)};
    $('#rcHome').onclick=()=>{closeModal();show('bayt');Bayt.menu()}})}

window.BaytRace={join,lobby};
})();
