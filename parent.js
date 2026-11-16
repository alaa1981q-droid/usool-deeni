/* 👨‍👩‍👧 تقرير الأهل: يسجّل عدد الأسئلة وصحّتها كل يوم (على هذا الجهاز فقط)، ويعرض للأهل ملخّص آخر ٧ أيام.
   الزر في أسفل الرئيسية، ويحميه سؤال حساب بسيط حتى لا يفتحه الطفل بالغلط. لا يرسل شيئًا إلى الإنترنت. */
(function(){
const DAY=864e5,KEEP=21;
state.act=state.act||{};state.stat=state.stat||{};
const dkey=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const esc2=s=>String(s).replace(/[<>&]/g,'');
const prev=window.onAnswer;
window.onAnswer=function(q,ok,mode){
  try{const k=dkey(),a=state.act[k]=state.act[k]||{q:0,ok:0};a.q++;if(ok)a.ok++;
    const ks=Object.keys(state.act);if(ks.length>KEEP){ks.sort((x,y)=>new Date(x)-new Date(y));ks.slice(0,ks.length-KEEP).forEach(x=>delete state.act[x])}
    if(q&&typeof q.st=='number'&&!q.g){const s=state.stat[q.st]=state.stat[q.st]||{q:0,ok:0};s.q++;if(ok)s.ok++}
    save()}catch(e){}
  return prev&&prev.apply(this,arguments)};

const css=document.createElement('style');
css.textContent=`
.pgate{display:flex;gap:8px;justify-content:center;margin:12px 0}.pgate input{width:110px;text-align:center;font-size:22px;border:2px solid var(--line);border-radius:14px;padding:8px}
.prow{display:flex;justify-content:space-between;gap:8px;padding:9px 4px;border-bottom:1px dashed var(--line);font-size:16px}.prow b{color:var(--ink);direction:rtl;unicode-bidi:isolate}
.pbars{display:flex;gap:5px;justify-content:center;align-items:flex-end;height:70px;margin:8px 0 2px}.pbars span{flex:1;max-width:34px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;font-size:11px;color:var(--muted);height:100%}
.pbars i{display:block;width:100%;border-radius:8px 8px 3px 3px;background:#c9d8cf;min-height:4px}.pbars span.on i{background:linear-gradient(#3fbf6f,#14794f)}
.ptip{background:#fff8e6;border:2px solid #f2d88a;border-radius:16px;padding:10px 12px;margin:10px 0;font-size:15px;line-height:1.8;text-align:right}
`;
document.head.appendChild(css);

function data(){
  const L=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'],days=[];let q=0,ok=0,active=0;
  const pray=(window.Aamal&&Aamal.d.pray)||{},wd=(state.wird&&state.wird.days)||[];let prayN=0,wirdN=0;
  for(let k=6;k>=0;k--){const t=Date.now()-k*DAY,key=dkey(t),a=state.act[key]||{q:0,ok:0},p=(pray[key]||[]).filter(Boolean).length;
    q+=a.q;ok+=a.ok;if(a.q)active++;prayN+=p;if(wd.includes(new Date(t).toDateString()))wirdN++;days.push({n:L[new Date(t).getDay()],q:a.q})}
  const weak=Object.entries(state.stat).filter(([i,s])=>s.q>=5&&STAGES[i]).map(([i,s])=>({t:STAGES[i].title,p:Math.round(100*s.ok/s.q)})).sort((a,b)=>a.p-b.p)[0];
  const A=(window.Aamal&&Aamal.d)||{};
  return {days,q,ok,acc:q?Math.round(100*ok/q):0,active,prayN,wirdN,weak,
    done:STAGES.filter(s=>state.stars[s.id]>0).length,stars:Object.values(state.stars).reduce((a,b)=>a+b,0),
    miss:Object.keys(state.miss||{}).length,streak:(state.wird&&state.wird.streak)||0,
    hifz:Object.keys(A.surOk||{}).length,sal:A.sal||0,tas:A.tas||0,name:(window.myName&&myName())||state.nick||state.name||'طفلكم'}}

function text(d){
  return `تقرير «جنّتي الصغيرة» لهذا الأسبوع 🌙\nالطفل: ${d.name}\n`+
    `• أيام النشاط: ${ar(d.active)} من ٧\n• الأسئلة: ${ar(d.q)} (الصحيح ${ar(d.acc)}٪)\n• أيام الورد اليومي: ${ar(d.wirdN)}\n• الصلوات المسجّلة: ${ar(d.prayN)}\n`+
    `• المراحل المكتملة: ${ar(d.done)} من ${ar(STAGES.length)}\n• سور محفوظة: ${ar(d.hifz)}\n`+(d.weak?`• يحتاج مراجعة: ${d.weak.t}\n`:'');
}
function tips(d){
  const t=[];
  if(!d.active)t.push('لم يفتح التطبيق هذا الأسبوع. ١٠ دقائق كل يوم تكفي، اجلسوا معه مرة وشجّعوه 🌱');
  else if(d.active<4)t.push('نشاطه قليل هذا الأسبوع ('+ar(d.active)+' من ٧ أيام). ذكّروه بالورد اليومي قبل النوم 🌙');
  else t.push('ما شاء الله، مواظب على التعلّم. اشكروه وامدحوا جهده 🌟');
  if(d.q>=10&&d.acc<60)t.push('أخطأ بأسئلة كثيرة. اقرؤوا معه الدرس من الكتاب ثم ليجرّب «أراجع أخطائي» 📖');
  if(d.weak)t.push('أضعف مرحلة عنده: «'+esc2(d.weak.t)+'». راجعوها معه بهدوء.');
  if(d.prayN==0)t.push('لم يسجّل صلوات هذا الأسبوع. يمكنكم تشجيعه على «سجلّ صلاتي».');
  return t;
}
function report(){
  const d=data(),mx=Math.max(1,...d.days.map(x=>x.q));
  modal(`<div style="font-size:46px">👨‍👩‍👧</div><h3 style="margin:2px 0">تقرير ${esc2(d.name)} هذا الأسبوع</h3>
    <div class="pbars" dir="ltr">${d.days.map(x=>`<span class="${x.q?'on':''}"><i style="height:${Math.round(8+x.q/mx*52)}px"></i>${x.q?ar(x.q):''}<small>${x.n}</small></span>`).join('')}</div>
    <div style="text-align:center;font-size:12px;color:var(--muted)">عدد الأسئلة كل يوم</div>
    <div class="prow"><span>أيام النشاط</span><b>${ar(d.active)} من ٧</b></div>
    <div class="prow"><span>الأسئلة المجاب عنها</span><b>${ar(d.q)}</b></div>
    <div class="prow"><span>نسبة الإجابات الصحيحة</span><b>${d.q?ar(d.acc)+'٪':'—'}</b></div>
    <div class="prow"><span>أيام الورد اليومي</span><b>${ar(d.wirdN)} من ٧</b></div>
    <div class="prow"><span>أيام متتالية بالورد</span><b>${ar(d.streak)}</b></div>
    <div class="prow"><span>الصلوات المسجّلة</span><b>${ar(d.prayN)}</b></div>
    <div class="prow"><span>المراحل المكتملة</span><b>${ar(d.done)} من ${ar(STAGES.length)}</b></div>
    <div class="prow"><span>سور محفوظة</span><b>${ar(d.hifz)}</b></div>
    <div class="prow"><span>مرات الصلاة على النبي (المجموع)</span><b>${ar(d.sal)}</b></div>
    <div class="prow"><span>مرات التسبيح (المجموع)</span><b>${ar(d.tas)}</b></div>
    <div class="prow"><span>أسئلة تنتظر المراجعة</span><b>${ar(d.miss)}</b></div>
    <div class="ptip">${tips(d).map(x=>'• '+x).join('<br>')}</div>
    <p style="font-size:12px;color:var(--muted);margin:4px 0">الأرقام محفوظة على هذا الجهاز فقط، وتبدأ من يوم تحديث التطبيق.</p>
    <div class="nav"><button class="btn gold" id="pgSend">📤 أرسل التقرير</button><button class="btn sec" data-close>إغلاق</button></div>`,
    ()=>{$('#pgSend').onclick=()=>{const t=text(d);
      if(navigator.share)navigator.share({text:t}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}})}
function gate(){
  const a=6+Math.floor(Math.random()*4),b=6+Math.floor(Math.random()*4);
  modal(`<div style="font-size:46px">👨‍👩‍👧</div><h3 style="margin:2px 0">للأهل فقط</h3><p>اكتب الجواب حتى تفتح التقرير:<br><b style="font-size:24px">${ar(a)} × ${ar(b)} = ؟</b></p>
    <div class="pgate"><input id="pgIn" inputmode="numeric" autocomplete="off"></div><div class="fb" id="pgMsg"></div>
    <div class="nav"><button class="btn gold" id="pgOk">افتح</button><button class="btn sec" data-close>رجوع</button></div>`,
    ()=>{const go=()=>{const v=String($('#pgIn').value).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).trim();
      if(+v===a*b){closeModal();report()}else{$('#pgMsg').className='fb bad';$('#pgMsg').textContent='جواب غير صحيح، جرّب مرة ثانية'}};
      $('#pgOk').onclick=go;$('#pgIn').onkeydown=e=>{if(e.key=='Enter')go()}})}
const btn=document.createElement('button');btn.className='link-btn';btn.id='parentBtn';btn.textContent='👨‍👩‍👧 للأهل';btn.onclick=gate;
const foot=document.querySelector('#home .footer-links');if(foot)foot.appendChild(btn);
window.Parent={report,gate};
})();
