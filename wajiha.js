/* 🏠 واجهة أبسط (v11.5) — طلب الشيخ: «قلّل الأزرار في الواجهة».
   - الواجهة: اللافتة، 🏡 بيتي في الجنة، بطاقة الطفل، 😄 سعادة بيتي، وردي اليومي، ثم ٤ أزرار كبيرة:
     📚 دروس الكتاب (الخريطة في شاشتها) · 🕌 وضوئي وصلاتي · ⭐ أنا حافظ صغير · ☰ المزيد.
   - «☰ المزيد»: الكتاب المصوّر، تحميل الكتاب، القصص، المسابقة، اختبر نفسك، مراجعة الأخطاء، أصدقائي، أبطال الأسبوع، كيف ألعب.
     (الأزرار نفسها تُنقل كما هي، فتبقى أعمالها كما كانت.)
   - مراحل مكتملة / النجوم / الكؤوس: انتقلت من الواجهة إلى صفحة «ملفّي».
   - 😄 سعادة بيتي: ترتفع بكل عمل صالح اليوم وتنخفض إذا غاب الطفل يومًا أو أكثر. محلية: usul5_happy_v1 */
(function(){
const $q=s=>document.querySelector(s),home=$q('#home');if(!home)return;
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const arn=n=>typeof ar=='function'?ar(n):n;
const snd=()=>{try{tone(880,.05,'sine',.08)}catch(e){}};

/* ---------- السعادة ---------- */
const HK='usul5_happy_v1',dk=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
let hs={d:{},last:0};try{const v=JSON.parse(localStorage.getItem(HK)||'null');if(v&&v.d)hs=v}catch(e){}
const hsv=()=>{try{localStorage.setItem(HK,JSON.stringify(hs))}catch(e){}};
function deed(){const k=dk(new Date());hs.d[k]=Math.min(30,(hs.d[k]|0)+1);hs.last=Date.now();
  const keep={};Object.keys(hs.d).slice(-10).forEach(x=>keep[x]=hs.d[x]);hs.d=keep;hsv();drawHappy()}
function happy(){const t=hs.d[dk(new Date())]|0;if(t>0)return Math.min(100,55+t*9);if(!hs.last)return 50;
  const a=new Date(hs.last);a.setHours(0,0,0,0);const b=new Date();b.setHours(0,0,0,0);const days=Math.round((b-a)/864e5);
  return days<=1?40:days==2?25:12}
function mood(h){return h>=80?['😄',`${B('بيتك','بيتكِ')} سعيد جدًا! ما شاء الله`]:h>=55?['🙂',`${B('بيتك','بيتكِ')} سعيد، ${B('زِده','زيديه')} بعمل صالح`]:
  h>=30?['😐',`${B('بيتك','بيتكِ')} ينتظر أعمالك اليوم`]:['😟',`${B('بيتك','بيتكِ')} مشتاق لك! ${B('صلِّ','صلّي')} أو ${B('اقرأ','اقرئي')} ${B('وِردك','وِردكِ')} ليفرح`]}
const barCol=h=>h>=80?'#1fa463':h>=55?'#7cc242':h>=30?'#f0b429':'#e2504a';
// كل عمل صالح أو جائزة في التطبيق يُحسب
function hook(){try{if(window.Aamal&&Aamal.grow&&!Aamal.grow._wj){const g=Aamal.grow;Aamal.grow=function(){deed();return g.apply(this,arguments)};Aamal.grow._wj=1}}catch(e){}
  try{if(window.Deco&&Deco.addJ&&!Deco.addJ._wj){const a=Deco.addJ;Deco.addJ=function(n){if(n>0)deed();return a.apply(this,arguments)};Deco.addJ._wj=1}}catch(e){}}
hook();

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
#home #wjHappy{grid-column:1/-1;display:flex;align-items:center;gap:10px;border:0;border-radius:18px;padding:8px 12px;font:inherit;text-align:right;background:linear-gradient(160deg,#fff,#fffaf0);box-shadow:0 4px 0 #ecdcb8;border:1.5px solid #ecdcb8}
#wjHappy .e{font-size:38px;line-height:1}#wjHappy .t{flex:1;min-width:0}#wjHappy b{display:block;font-size:16px;color:#5a4a1a}#wjHappy small{display:block;font-size:13px;font-weight:700;color:#7a6a3a}
#wjHappy .hb{height:12px;border-radius:8px;background:#efe6d2;overflow:hidden;margin-top:4px}#wjHappy .hb i{display:block;height:100%;border-radius:8px;transition:width .6s}
#home .wjtile .cup{font-size:34px}#home .wjmore{background:linear-gradient(160deg,#fff,#eef3ff);border-color:#a9bde8;box-shadow:0 5px 0 #a9bde8}
#home .wjdur{background:linear-gradient(160deg,#fff,#fff4dc);border-color:#efc66a;box-shadow:0 5px 0 #efc66a}
#home>.stats,#home #hFrBtn,#home #hHeBtn,#home>.footer-links{display:none!important}
#wjMoreBody,#wjDurBody{flex:1;padding:4px 2px 18px;display:flex;flex-direction:column;gap:10px}
#wjMoreBody .bookcard,#wjMoreBody .wdcard{margin:0}
#wjMoreBody .hfbtn{margin:0}
.wjstats{margin:10px 0 4px}
.wjhp{display:flex;align-items:center;gap:10px;margin:10px 4px;padding:8px 12px;border-radius:16px;background:#fffaf0;border:1.5px solid #ecdcb8;text-align:right}
.wjhp .e{font-size:34px}.wjhp b{display:block}.wjhp .hb{height:10px;border-radius:8px;background:#efe6d2;overflow:hidden;margin-top:4px}.wjhp .hb i{display:block;height:100%}`;
document.head.appendChild(css);

/* ---------- شاشتا «المزيد» و«دروس الكتاب» ---------- */
const app=$q('.app');
function screen(id,title){const s=document.createElement('section');s.className='screen';s.id=id;
  s.innerHTML=`<div class="bar"><button class="back">›</button><div class="ttl">${title}</div></div><div id="${id}Body"></div>`;
  app.appendChild(s);s.querySelector('.back').onclick=()=>{snd();try{renderHome()}catch(e){}show('home')};return s}
screen('wjMore','☰ المزيد');screen('wjDur','📚 دروس الكتاب');
$q('#wjDur .ttl').id='wjDurT';
const moreB=$q('#wjMoreBody'),durB=$q('#wjDurBody');
durB.innerHTML=`<p class="bcap" style="text-align:center;margin:6px 0 2px">${B('اختر','اختاري')} المرحلة، وكل مرحلة تفتح التي بعدها 🌟</p>`;
const map=$q('#map');if(map)durB.appendChild(map);
// أزرار تنتقل إلى «المزيد» (بترتيب جميل)
['#openBook','#dlBook','#openQisas','#openContest','#openNafsak','#openReview'].forEach(s=>{const e=$q(s);if(e)moreB.appendChild(e)});
// (v11.6) صفحة البيت القديمة صارت هنا: لعبة الطوابق (أسئلة الكتاب)، الزينة، السباق، الكؤوس، صندوق اليوم
moreB.insertAdjacentHTML('afterbegin',`<button class="bookcard baytcard" id="wjOld"><span class="cup">🏗️</span><span><b>طوابق بيتي وزينته</b><small>لعبة الطوابق (أسئلة الكتاب)، زيّن بيتك وادخله، سباق صديق، الكؤوس، صندوق اليوم</small></span><span class="go">‹</span></button>`);
$q('#wjOld').onclick=()=>{snd();if(window.City3D&&City3D.oldHouse)City3D.oldHouse();else{try{Bayt.menu();show('bayt')}catch(e){}}};
moreB.insertAdjacentHTML('beforeend',`<button class="bookcard" id="wjFr"><span class="cup">👥</span><span><b>أصدقائي</b><small>أضف صديقًا، وزُر بيوت أصدقائك ومدنهم</small></span><span class="go">‹</span></button>
  <button class="bookcard" id="wjHe"><span class="cup">🏅</span><span><b>أبطال هذا الأسبوع</b><small>من جمع أكثر النقاط هذا الأسبوع؟</small></span><span class="go">‹</span></button>
  <button class="bookcard" id="wjHow"><span class="cup">❓</span><span><b>كيف ألعب؟</b><small>شرح سريع للتطبيق</small></span><span class="go">‹</span></button>`);
$q('#wjFr').onclick=()=>{const b=$q('#hFrBtn');b&&b.click()};
$q('#wjHe').onclick=()=>{const b=$q('#hHeBtn');b&&b.click()};
$q('#wjHow').onclick=()=>{const b=$q('#howBtn');b&&b.click()};

/* ---------- أزرار الواجهة ---------- */
const hp=document.createElement('button');hp.id='wjHappy';
const dur=document.createElement('button');dur.className='bookcard wjtile wjdur';dur.id='wjDurBtn';
dur.innerHTML=`<span class="cup">📚</span><span><b>دروس الكتاب</b><small id="wjDurLine"></small></span>`;
const more=document.createElement('button');more.className='bookcard wjtile wjmore';more.id='wjMoreBtn';
more.innerHTML=`<span class="cup">☰</span><span><b>المزيد</b><small>الكتاب، القصص، المسابقة، الأصدقاء…</small></span>`;
dur.onclick=()=>{snd();try{renderHome()}catch(e){}show('wjDur');scrollTo(0,0)};
more.onclick=()=>{snd();show('wjMore');scrollTo(0,0)};
hp.onclick=()=>{snd();const b=$q('#hProf');b&&b.click()};
function order(){const seq=['#openBayt','#homeSocial','#openWird',dur,'#openSalah','#openHifz',more];
  const ft=$q('#home>.footer-links')||$q('#verLine');
  seq.forEach(x=>{const e=typeof x=='string'?$q(x):x;if(e&&ft)home.insertBefore(e,ft)});
  // بيتي في الجنة يبقى أول شيء تحت اللافتة
  const hero=$q('#home .hero'),bt=$q('#openBayt');if(hero&&bt&&hero.nextElementSibling!==bt)hero.after(bt)}
function drawHappy(){const h=happy(),m=mood(h);
  hp.innerHTML=`<span class="e">${m[0]}</span><span class="t"><b>سعادة ${B('بيتي','بيتي')}: ${arn(h)}٪</b><small>${m[1]}</small><div class="hb"><i style="width:${h}%;background:${barCol(h)}"></i></div></span>`;
  const l=$q('#wjDurLine'),d=$q('#stDone');if(l&&d)l.textContent='أكملتَ '+d.textContent+' مرحلة'.replace('أكملتَ',B('أكملتَ','أكملتِ'))}
// (v11.7) طلب الشيخ: السعادة داخل المدينة المجسّمة فقط (mujassam.js)، لا في الواجهة ولا في ملفّي
order();drawHappy();
addEventListener('load',()=>{hook();order();drawHappy()});
// بعد كل رسم للواجهة
try{const rh=window.renderHome;if(typeof rh=='function'&&!rh._wj){window.renderHome=function(){const r=rh.apply(this,arguments);try{order();drawHappy()}catch(e){}return r};window.renderHome._wj=1}}catch(e){}
setInterval(()=>{if(home.classList.contains('on'))drawHappy()},60e3);

/* ---------- الأرقام في صفحة «ملفّي» ---------- */
const aq=$q('#aqBody');
if(aq)new MutationObserver(()=>{const hd=aq.querySelector('.aqhead');if(!hd||aq.querySelector('.wjstats')||$q('#aqTitle')&&!/ملف/.test($q('#aqTitle').textContent))return;
  const st=$q('#home .stats');const h=happy(),m=mood(h);
  hd.insertAdjacentHTML('afterend',`
    ${st?`<div class="stats wjstats">${st.innerHTML.replace(/\sid="[^"]*"/g,'')}</div>`:''}`)}).observe(aq,{childList:true});
window.Wajiha={happy,deed,mood,barCol};
})();
