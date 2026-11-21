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
#bayt #mdOpen,#bayt #v3Open,#bayt #jFr,#madina #md3d{display:none!important}
#wjMoreBody,#wjDurBody{flex:1;padding:4px 2px 18px;display:flex;flex-direction:column;gap:10px}
#wjMoreBody .bookcard,#wjMoreBody .wdcard{margin:0}
#wjMoreBody .hfbtn{margin:0}
#wjGamesBody{flex:1;padding:4px 2px 18px;display:flex;flex-direction:column;gap:10px}#wjGamesBody .bookcard{margin:0}
#bayt.wj-deco .bnhint,#bayt.wj-deco #msqB,#bayt.wj-deco .brank,#bayt.wj-deco #rcOpen,#bayt.wj-deco .dbuild,#bayt.wj-deco .jvis,#bayt.wj-deco #jVis,
#bayt.wj-deco .bbest,#bayt.wj-deco #byRace,#bayt.wj-deco .blvg,#bayt.wj-deco #byHow,
#bayt.wj-game .bnhint,#bayt.wj-game #msqB,#bayt.wj-game .jbar,#bayt.wj-game .dbuild,#bayt.wj-game .jvis,#bayt.wj-game #jVis{display:none!important}
.wjstats{margin:10px 0 4px}
.wjhp{display:flex;align-items:center;gap:10px;margin:10px 4px;padding:8px 12px;border-radius:16px;background:#fffaf0;border:1.5px solid #ecdcb8;text-align:right}
.wjhp .e{font-size:34px}.wjhp b{display:block}.wjhp .hb{height:10px;border-radius:8px;background:#efe6d2;overflow:hidden;margin-top:4px}.wjhp .hb i{display:block;height:100%}`;
document.head.appendChild(css);

/* ---------- شاشتا «المزيد» و«دروس الكتاب» ---------- */
const app=$q('.app');
function screen(id,title){const s=document.createElement('section');s.className='screen';s.id=id;
  s.innerHTML=`<div class="bar"><button class="back">›</button><div class="ttl">${title}</div></div><div id="${id}Body"></div>`;
  app.appendChild(s);s.querySelector('.back').onclick=()=>{snd();try{renderHome()}catch(e){}show('home')};return s}
screen('wjMore','☰ المزيد');screen('wjGames','🎮 ألعابي');screen('wjDur','📚 دروس الكتاب');
$q('#wjDur .ttl').id='wjDurT';
const moreB=$q('#wjMoreBody'),durB=$q('#wjDurBody');
durB.innerHTML=`<p class="bcap" style="text-align:center;margin:6px 0 2px">${B('اختر','اختاري')} المرحلة، وكل مرحلة تفتح التي بعدها 🌟</p>`;
const map=$q('#map');if(map)durB.appendChild(map);
// (v13.0) «المزيد» أقصر: 🎮 ألعابي (كل الألعاب في شاشة واحدة)، الكتاب، تحميله، القصص، الأصدقاء، الأبطال، كيف ألعب.
// البيت لم يعد هنا: يُفتح من بيت الطفل داخل المدينة فقط، حتى لا يتشتّت بين المدينة والبيت.
$q('#wjGames .back').onclick=()=>{snd();show('wjMore');scrollTo(0,0)};
const gamesB=$q('#wjGamesBody');
gamesB.innerHTML=`<p class="bcap" style="text-align:center;margin:6px 0 2px">${B('العب','العبي')} ${B('واربح','واربحي')} الكؤوس والجواهر 🏆💎</p>`;
['#openContest','#openNafsak'].forEach(s=>{const e=$q(s);if(e)gamesB.appendChild(e)});
gamesB.insertAdjacentHTML('beforeend',`<button class="bookcard baytcard" id="wjOld"><span class="cup">🏗️</span><span><b>لعبة طوابق البيت</b><small>المس الكلمات بالترتيب وابنِ طوابق بيتك، أو سابق صديقك</small></span><span class="go">‹</span></button>`);
{const e=$q('#openReview');if(e)gamesB.appendChild(e)}
$q('#wjOld').onclick=()=>{snd();if(window.City3D&&City3D.oldHouse)City3D.oldHouse('game');else{try{Bayt.menu();show('bayt')}catch(e){}}};
moreB.insertAdjacentHTML('beforeend',`<button class="bookcard" id="wjGm" style="border-color:#f0a020;box-shadow:0 5px 0 #f3c56a"><span class="cup">🎮</span><span><b>ألعابي ومسابقاتي</b><small>مسابقة الأبطال، اختبر نفسك، لعبة الطوابق، راجع أخطائي</small></span><span class="go">‹</span></button>`);
$q('#wjGm').onclick=()=>{snd();show('wjGames');scrollTo(0,0)};
['#openBook','#dlBook','#openQisas'].forEach(s=>{const e=$q(s);if(e)moreB.appendChild(e)});
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
more.innerHTML=`<span class="cup">☰</span><span><b>المزيد</b><small>الألعاب، الكتاب، القصص، الأصدقاء</small></span>`;
dur.onclick=()=>{snd();try{renderHome()}catch(e){}show('wjDur');scrollTo(0,0)};
more.onclick=()=>{snd();show('wjMore');scrollTo(0,0)};
hp.onclick=()=>{snd();const b=$q('#hProf');b&&b.click()};
/* ---------- (v17.3) 🔍 البحث العامّ: طلب الشيخ — يبحث الطفل عن أيّ شيء في التطبيق (تعليم الصلاة، القراءة، الوِرد، القصص، أماكن المدينة…) ---------- */
const gs=document.createElement('button');gs.id='gSearch';gs.type='button';gs.innerHTML=`<span>🔍</span><b>${B('ابحث','ابحثي')} عن أيّ شيء…</b><small>الصلاة، الوضوء، سورة، قصة، المسبح…</small>`;
const gN=t=>String(t||'').replace(/[ً-ْٰـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[^؀-ۿa-z0-9 ]/gi,' ').replace(/\s+/g,' ').trim().toLowerCase();
const clk=sel=>()=>{const e=$q(sel);if(e)e.click()};
const sal=k=>()=>{try{Salah.open()}catch(e){const b=$q('#openSalah');b&&b.click()}setTimeout(()=>{const b=document.querySelector('#salah [data-go="'+k+'"]');b&&b.click()},120)};
const prof=then=>()=>{const b=$q('#hProf');b&&b.click();if(then)setTimeout(()=>{const x=$q(then);x&&x.click()},250)};
const city=(k,a)=>()=>{try{City3D.goTo(k,a)}catch(e){}};
function gIndex(){const L=[
  ['🏙️','مدينتي المجسّمة','بيتي في الجنة المدينة البيت','',clk('#openBayt')],
  ['📖','وِردي اليومي','ورد خمسة اسئلة يومي','',clk('#openWird')],
  ['📚','دروس الكتاب','دروس الكتاب اصول الدين مراحل تعلم','📚 الكتاب',()=>{show('wjDur');scrollTo(0,0)}],
  ['🕌','وضوئي وصلاتي','صلاة وضوء تعليم','🕌 الصلاة',clk('#openSalah')],
  ['💧','تعلّم الوضوء','وضوء تعليم خطوات طهارة غسل','🕌 الصلاة',sal('lw')],['🕌','تعلّم الصلاة','صلاة تعليم ركعة سجود ركوع صبح','🕌 الصلاة',sal('ls')],
  ['🧩','رتّب الوضوء','ترتيب وضوء تدريب','🕌 الصلاة',sal('ow')],['🧩','رتّب الصلاة','ترتيب صلاة تدريب','🕌 الصلاة',sal('os')],
  ['🎤','أذكار الصلاة بصوتي','صوت قراءة اذكار تسميع الحمد','🕌 الصلاة',sal('v')],['🤲','سجلّ صلاتي','صليت سجل الصلوات الخمس','🕌 الصلاة',sal('pr')],
  ['📝','اختبار الوضوء','امتحان وضوء','🕌 الصلاة',sal('tw')],['📝','اختبار الصلاة','امتحان صلاة','🕌 الصلاة',sal('ts')],
  ['🕰️','أوقات الأذان','اذان اوقات الصلاة فجر ظهر مغرب','🕌 الصلاة',()=>{try{Adhan.settings()}catch(e){}}],
  ['⭐','أنا حافظ صغير','حفظ قران سور قراءة تلاوة الحمد الفاتحة التوحيد الاخلاص الناس الفلق المسد النصر الكافرون الكوثر الماعون قريش الفيل العصر','📖 القرآن',clk('#openHifz')],
  ['📗','الكتاب المصوّر','كتاب قراءة صفحات صور','📚 الكتاب',clk('#openBook')],['⬇️','حمّل الكتاب','تحميل pdf الكتاب','📚 الكتاب',clk('#dlBook')],
  ['📜','قصص الأنبياء','قصص قصة ادم نوح ابراهيم موسى يوسف محمد انبياء','📜 القصص',clk('#openQisas')],
  ['🏆','مسابقة الأبطال','مسابقة لعبة صديق اونلاين تحدي','🎮 الألعاب',clk('#openContest')],['🧠','اختبر نفسك','اختبار امتحان اسئلة','🎮 الألعاب',clk('#openNafsak')],
  ['🔁','مراجعة أخطائي','مراجعة اخطاء تصحيح','🎮 الألعاب',clk('#openReview')],['🎮','ألعابي ومسابقاتي','العاب لعبة','🎮 الألعاب',()=>{show('wjGames');scrollTo(0,0)}],
  ['🏗️','لعبة طوابق البيت','طوابق البيت لعبة كلمات سباق','🎮 الألعاب',clk('#wjOld')],
  ['👥','أصدقائي','اصدقاء صديق رمز اضافة','👥 الأصدقاء',clk('#hFrBtn')],['🏅','أبطال هذا الأسبوع','ابطال ترتيب نقاط','👥 الأصدقاء',clk('#hHeBtn')],
  ['🏅','ملفّي','ملفي اسمي صورتي مستوى اوسمة القاب نقاط','👤 ملفّي',prof()],['📍','دولتي ومدينتي','دولة مدينة علم بلد اذان طقس','👤 ملفّي',prof('#aqLoc')],
  ['💚','الصلاة على النبي بصوتي','صلوات صلاة على النبي محمد وال محمد صوت','🤲 أعمالي',prof()],['📿','التسبيح بصوتي','تسبيح سبحان الله صوت','🤲 أعمالي',prof()],
  ['🔑','رمز الحفظ','رمز حفظ موبايل جديد استرجاع','👤 ملفّي',prof()],['❓','كيف ألعب؟','شرح مساعدة طريقة','❓',clk('#howBtn')],['👨‍👩‍👧','للأهل','الاهل تقرير اب ام','👨‍👩‍👧',clk('#parentBtn')]];
  ['الحمد','الناس','الفلق','التوحيد','المسد','النصر','الكافرون','الكوثر','الماعون','قريش','الفيل','العصر'].forEach(n=>L.push(['⭐','سورة '+n,'سوره حفظ قران '+(n==='الحمد'?'الفاتحة':n==='التوحيد'?'الاخلاص':''),'📖 القرآن',clk('#openHifz')]));
  try{STAGES.forEach((st,i)=>L.push([st.icon&&st.icon.length<3?'📘':st.icon,`المرحلة ${typeof ar=='function'?ar(i+1):i+1}: ${st.title}`,st.title+' '+st.sub+' درس مرحلة','📚 الكتاب',()=>{show('wjDur');scrollTo(0,0);setTimeout(()=>{const b=document.querySelector('#map .node[data-i="'+i+'"]');b&&b.click()},120)}]))}catch(e){}
  [['🕌','الجامع','مسجد صلاة جماعة','mosque'],['🎒','مدرستي','مدرسة','mySchool'],['🏫','مدرسة القرآن','قران حفظ','school'],['📚','المكتبة','مكتبة كتب','library'],['🏥','المستشفى','مستشفى مريض','hospital'],
   ['🎡','مدينة الألعاب','العاب ملاهي','park'],['🐄','المزرعة','بقر دجاج حيوانات','farm','any'],['🦆','البطّ في النهر','بط نهر','ducks'],['🐑','المرعى','غنم خراف','sheep'],['⛲','النافورة','نافورة ماء','plaza'],
   ['🔥','التنّور','خبز تنور','tannour'],['⚽','الملعب','كرة قدم','football'],['🚌','موقف الباص','باص','busStop'],['👮','مركز الشرطة','شرطة شرطي امن محفظة','police'],['⚡','محطة الكهرباء','كهرباء طاقة','power'],
   ['📜','شيخ المكتبة','شيخ سؤال اليوم','sheikh'],['👴','بيت جدّو','جد جدي حكاية','grandpa'],['📖','حلقة القرآن','حلقة قران مسجد','halaqa'],['🔭','النجوم','منظار نجوم سماء','stars'],
   ['🚦','تعليم السياقة','سياقة قيادة رخصة سيارة','drvs'],['🚗','معرض السيارات','سيارات سيارة شراء','showroom'],['🚙','سيارتي','سيارتي اسوق','mycar'],['🏊',B('مسبح الأولاد','مسبح البنات'),'مسبح سباحة','pool'],
   ['☕','الدربونة القديمة','مقهى دربونة','cafe'],['🐾','حيواني الأليف','قطة عصفور ارنب','pet'],['💧','اسقِ الأشجار','سقي شجر ماء','water'],['🧹','نظّف الطريق','تنظيف نظافة','clean'],['💝','صندوق الصدقات','صدقة','sadaqa']
  ].forEach(([e,n,k,a,x])=>L.push([e,n,k+' مدينة','🏙️ في مدينتي',city(a,x)]));
  return L}
const gsCss=document.createElement('style');gsCss.textContent=`#gSearch{grid-column:1/-1;display:flex;align-items:center;gap:8px;width:100%;border:0;border-radius:18px;padding:9px 14px;font:inherit;text-align:right;color:#24402f;background:linear-gradient(160deg,#fff,#eef8f1);box-shadow:0 4px 0 #b9dcc6,0 6px 14px rgba(31,164,99,.12),inset 0 2px 0 #fff;cursor:pointer}
#gSearch span{font-size:24px}#gSearch b{font-size:15.5px;white-space:nowrap}#gSearch small{flex:1;min-width:0;text-align:left;font-size:12px;font-weight:700;color:#6b7d72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gsov{position:fixed;inset:0;z-index:99980;background:#f4fbf6;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) 12px 10px}
.gsov .top{display:flex;gap:8px;align-items:center}.gsov input{flex:1;min-width:0;border:2px solid #1fa463;border-radius:16px;padding:11px 14px;font:inherit;font-weight:800;font-size:17px;background:#fff;box-shadow:0 3px 0 #9fd3aa;direction:rtl}
.gsov .cl{border:0;border-radius:14px;padding:10px 14px;font:inherit;font-weight:900;font-size:15px;background:#e3ecf7;color:#1d4e9e;box-shadow:0 3px 0 #a9bcd6}
.gsov .res{flex:1;overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:9px;align-content:start;padding:12px 2px 6px}
.gsov .res button{display:flex;align-items:center;gap:8px;border:0;border-radius:16px;padding:9px 10px;font:inherit;font-weight:900;font-size:14px;text-align:right;color:#2b3550;background:var(--c);box-shadow:0 4px 0 var(--d),0 4px 8px #0002,inset 0 2px 0 #fff9}
.gsov .res button b{font-size:26px}.gsov .res button small{display:block;font-size:11.5px;font-weight:700;color:#5a6b62}.gsov .res button:active{transform:translateY(3px)}
.gsov .hint{grid-column:1/-1;text-align:center;font-weight:800;color:#5a6b62;margin:4px 0}`;document.head.appendChild(gsCss);
function openSearch(){snd();const L=gIndex(),C=[['#dff5e3','#9fd3aa'],['#dcecff','#9dbde6'],['#ffe1ec','#e6a9bf'],['#fff3c4','#e3c56e'],['#ece3ff','#b9a6e6'],['#d9f5f1','#94d1c8']];
  const ov=document.createElement('div');ov.className='gsov';ov.innerHTML=`<div class="top"><input type="search" placeholder="🔍 ${B('اكتب','اكتبي')}: الصلاة، الوضوء، سورة الناس، المسبح…" aria-label="بحث"><button class="cl">✖</button></div><div class="res"></div>`;
  document.body.appendChild(ov);const q=ov.querySelector('input'),R=ov.querySelector('.res');
  const draw=()=>{const v=gN(q.value),w=v.split(' ').filter(Boolean);let m=L.map((x,i)=>{const t=gN(x[1]),k=gN(x[2]+' '+x[3]);if(!w.length)return i<12?[i,1]:null;
      let sc=0;for(const y of w){if(t.includes(y))sc+=t.startsWith(y)?3:2;else if(k.includes(y))sc+=1;else return null}return [i,sc]}).filter(Boolean);
    m.sort((a,b)=>b[1]-a[1]||a[0]-b[0]);m=m.slice(0,40);
    R.innerHTML=(w.length?'':`<div class="hint">${B('اكتب','اكتبي')} ما ${B('تريده','تريدينه')}، أو ${B('اختر','اختاري')} من هنا 👇</div>`)+(m.length?m.map(([i],j)=>{const x=L[i];return `<button data-i="${i}" style="--c:${C[j%6][0]};--d:${C[j%6][1]}"><b>${x[0]}</b><span>${x[1]}${x[3]?`<small>${x[3]}</small>`:''}</span></button>`}).join(''):`<div class="hint">🤍 ما وجدنا شيئًا بهذا الاسم… ${B('جرّب','جرّبي')} كلمة أخرى</div>`)};
  draw();q.oninput=draw;q.onkeydown=e=>{if(e.key==='Enter'){const b=R.querySelector('button');b&&b.click()}};setTimeout(()=>q.focus(),60);
  ov.querySelector('.cl').onclick=()=>{snd();ov.remove()};
  R.onclick=e=>{const b=e.target.closest('button');if(!b)return;snd();const x=L[+b.dataset.i];ov.remove();try{x[4]()}catch(er){console.error(er)}}}
gs.onclick=openSearch;window.gSearch=openSearch;
function order(){const seq=['#openBayt','#homeSocial','#openWird',dur,'#openSalah','#openHifz',more];
  const ft=$q('#home>.footer-links')||$q('#verLine');
  seq.forEach(x=>{const e=typeof x=='string'?$q(x):x;if(e&&ft)home.insertBefore(e,ft)});
  // بيتي في الجنة يبقى أول شيء تحت اللافتة
  const hero=$q('#home .hero'),bt=$q('#openBayt');if(hero&&bt&&hero.nextElementSibling!==bt)hero.after(bt);
  if(bt&&bt.nextElementSibling!==gs)bt.after(gs)}
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
