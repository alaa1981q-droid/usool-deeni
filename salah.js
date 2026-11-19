/* 🕌 وضوئي وصلاتي — تعليم الوضوء والصلاة (طريقة واحدة كما يريد الشيخ، بلا تسمية مذهب في الواجهة).
   تعلّم (خطوة خطوة) ← تدرّب (رتّب الخطوات + قلها بصوتك) ← اختبار ← جوائز لبيتك في الجنة.
   وسجلّ صلاتي اليومي. سورتا الحمد والتوحيد تؤخذان من دروس الكتاب (STAGES) ولا تُكتبان هنا.
   ⚠️ هذا المحتوى ليس من الكتاب: راجعه الشيخ قبل النشر الواسع. يعتمد على sawt.js (Voice, Aamal). */
(function(){
const L0=STAGES[0].lessons,surahText=h=>((L0.find(l=>l.h==h)||{}).surah||[]).map(v=>v[0]);
const FATIHA=surahText('سورة الحمد'),TAWHID=surahText('سورة التوحيد');
const boy=()=>!window.Cups||Cups.sex!='g';
const B=(m,f)=>boy()?m:f;
const D=()=>Aamal.d;

/* ---------- المحتوى: {e: رمز، t: العنوان، d: الشرح، say: ما نقوله، opt: مستحب} ---------- */
const TASH_SH='أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ';
const SALAM_SH='السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ';
const WAYS={
 sh:{color:'#14794f',
  wudu:[
   {e:'🤲',t:'النيّة',d:'ننوي في قلوبنا أننا نتوضّأ طاعةً لله تعالى وقربةً إليه.'},
   {e:'🖐️',t:'قبل الوضوء (مستحب)',d:'يُستحبّ أن نغسل الكفّين، ثم نتمضمض (الماء في الفم)، ثم نستنشق (الماء في الأنف).',opt:1},
   {e:'😊',t:'غسل الوجه',d:'نغسل الوجه من منابت شعر الرأس إلى آخر الذقن طولًا، وما بين الإبهام والإصبع الوسطى عرضًا، ونبدأ <b>من الأعلى إلى الأسفل</b>.'},
   {e:'💪',t:'غسل اليد اليمنى',d:'نغسل اليد اليمنى <b>من المرفق إلى أطراف الأصابع</b>، من الأعلى إلى الأسفل.'},
   {e:'🤚',t:'غسل اليد اليسرى',d:'ثم نغسل اليد اليسرى من المرفق إلى أطراف الأصابع، من الأعلى إلى الأسفل.'},
   {e:'🧠',t:'مسح الرأس',d:'نمسح <b>مقدَّم الرأس</b> (فوق الجبهة) بباطن اليد اليمنى، ببقيّة ماء الوضوء الذي في اليد، بلا ماءٍ جديد.'},
   {e:'🦶',t:'مسح القدم اليمنى',d:'نمسح ظاهر القدم اليمنى باليد اليمنى، <b>من أطراف الأصابع إلى المفصل</b>، ببقيّة الماء.'},
   {e:'🦶',t:'مسح القدم اليسرى',d:'ثم نمسح ظاهر القدم اليسرى باليد اليسرى، من أطراف الأصابع إلى المفصل.'}],
  wuduNote:'الترتيب واجب: الوجه، ثم اليمنى، ثم اليسرى، ثم الرأس، ثم القدمان. ولا نتأخّر بين الأعضاء حتى يجفّ ما قبلها. نغسل الوجه واليدين مرةً واحدة، ويجوز مرتين.',
  salah:[
   {e:'🧭',t:'الاستعداد',d:'نتوضّأ، ونلبس ثيابًا طاهرة، ونتّجه إلى <b>القبلة</b>، ونضع التربة الطاهرة لنسجد عليها.'},
   {e:'🤲',t:'النيّة',d:'ننوي في قلوبنا: أصلّي صلاة الصبح ركعتين قربةً إلى الله تعالى.'},
   {e:'🙌',t:'تكبيرة الإحرام',d:'نرفع اليدين حذاء الأذنين ونقول:',say:'اللَّهُ أَكْبَرُ'},
   {e:'📖',t:'قراءة سورة الحمد',d:'نقف مستقيمين واليدان على الفخذين، ونقرأ <b>سورة الحمد</b>:',read:'f'},
   {e:'📖',t:'قراءة سورة التوحيد',d:'ثم نقرأ <b>سورة كاملة</b> بعد الحمد، مثل سورة التوحيد:',read:'t'},
   {e:'🙇',t:'الركوع',d:'ننحني ونضع الكفّين على الركبتين ونقول:',say:'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ'},
   {e:'🧍',t:'القيام بعد الركوع',d:'نرفع رؤوسنا ونقف مستقيمين، ويُستحبّ أن نقول:',say:'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ'},
   {e:'🧎',t:'السجدة الأولى',d:'نسجد على سبعة أعضاء: <b>الجبهة على التربة</b>، والكفّان، والركبتان، وإبهاما القدمين، ونقول:',say:'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ'},
   {e:'🪑',t:'الجلوس بين السجدتين',d:'نجلس مطمئنّين، ويُستحبّ أن نقول:',say:'أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْهِ'},
   {e:'🧎',t:'السجدة الثانية',d:'نسجد مرةً ثانية ونقول:',say:'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ'},
   {e:'🧍',t:'القيام للركعة الثانية',d:'نقوم للركعة الثانية، ويُستحبّ أن نقول: «بِحَوْلِ اللَّهِ وَقُوَّتِهِ أَقُومُ وَأَقْعُدُ»، ثم نقرأ <b>سورة الحمد</b> وبعدها <b>سورة كاملة</b> كما في الركعة الأولى.'},
   {e:'🤲',t:'القنوت (مستحب)',d:'قبل الركوع نرفع اليدين أمام الوجه وندعو بما نحب، مثل: «اللّهمّ اغفر لي ولوالديّ».',opt:1},
   {e:'🙇',t:'الركوع والسجدتان',d:'نفعل كما في الركعة الأولى بالترتيب: <b>نركع، ثم نقوم، ثم نسجد، ثم نجلس، ثم نسجد السجدة الثانية.</b>'},
   {e:'🪑',t:'التشهّد',d:'نجلس بعد السجدتين ونقول:',say:TASH_SH},
   {e:'👋',t:'التسليم',d:'ثم نسلّم فنقول:',say:SALAM_SH},
   {e:'📿',t:'بعد الصلاة',d:'نكبّر ثلاثًا، ثم نسبّح <b>تسبيح الزهراء</b> عليها السلام: اللَّهُ أكبر ٣٤ مرة، والحمدُ لله ٣٣ مرة، وسبحانَ الله ٣٣ مرة.',opt:1}],
  wq:[
   ['ما أول عملٍ في الوضوء؟','النيّة','مسح الرأس','غسل اليد اليسرى'],
   ['ما الترتيب الصحيح للوضوء؟','الوجه ← اليد اليمنى ← اليد اليسرى ← الرأس ← القدمان','اليدان ← الوجه ← القدمان ← الرأس','الرأس ← الوجه ← القدمان ← اليدان'],
   ['كيف نغسل الوجه؟','من الأعلى إلى الأسفل','من الأسفل إلى الأعلى','نمسحه مسحًا فقط'],
   ['نغسل اليد في الوضوء:','من المرفق إلى أطراف الأصابع','من أطراف الأصابع إلى الكتف','الكفّ فقط'],
   ['أيّ جزء من الرأس نمسح؟','مقدَّم الرأس (فوق الجبهة)','مؤخَّر الرأس','الأذنين فقط'],
   ['بماذا نمسح الرأس والقدمين؟','ببقيّة ماء الوضوء في اليد','بماءٍ جديد','بمنديلٍ مبلول'],
   ['ماذا نفعل بالقدمين في الوضوء؟','نمسحهما','نغسلهما ثلاث مرات','لا نفعل شيئًا'],
   ['نمسح القدم اليمنى من:','أطراف الأصابع إلى المفصل','الكعب إلى الأصابع فقط','الركبة إلى الأصابع'],
   ['ما آخر عملٍ في الوضوء؟','مسح القدم اليسرى','غسل الوجه','غسل اليد اليمنى'],
   ['المضمضة والاستنشاق قبل الوضوء:','مستحبّتان','واجبتان','لا تجوزان'],
   ['بأيّ يدٍ نمسح القدم اليسرى؟','باليد اليسرى','باليد اليمنى','بالقدم الأخرى']],
  sq:[
   ['بماذا نبدأ الصلاة بعد النيّة؟','تكبيرة الإحرام: الله أكبر','التسليم','السجود'],
   ['ماذا نقرأ في الركعة الأولى؟','سورة الحمد ثم سورة كاملة','سورة الحمد فقط','التشهّد'],
   ['ماذا نقول في الركوع؟','سبحان ربّي العظيم وبحمده','سبحان ربّي الأعلى وبحمده','الله أكبر فقط'],
   ['ماذا نقول في السجود؟','سبحان ربّي الأعلى وبحمده','سبحان ربّي العظيم وبحمده','سمع الله لمن حمده'],
   ['كم سجدة في كل ركعة؟','سجدتان','سجدة واحدة','ثلاث سجدات'],
   ['على ماذا نضع الجبهة في السجود؟','على التربة أو الأرض وما ينبت منها','على قطعة قماش','على اليد'],
   ['متى يكون القنوت؟','في الركعة الثانية قبل الركوع','بعد التسليم','في أول الصلاة'],
   ['كم ركعة صلاة الصبح؟','ركعتان','ثلاث ركعات','أربع ركعات'],
   ['كم ركعة صلاة المغرب؟','ثلاث ركعات','ركعتان','أربع ركعات'],
   ['كم ركعة صلاة الظهر؟','أربع ركعات','ركعتان','ثلاث ركعات'],
   ['بماذا نختم الصلاة؟','بالتسليم','بالركوع','بالقنوت'],
   ['تسبيح الزهراء عليها السلام يبدأ بـ:','الله أكبر ٣٤ مرة','سبحان الله ١٠ مرات','لا إله إلا الله مرة']]},
};
const way=()=>WAYS.sh;
const fq=()=>{const d=D();d.fiqh.sh=d.fiqh.sh||{};return d.fiqh.sh};

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
.slcard{border-color:#13958c;box-shadow:0 5px 0 #a8ded9}.slcard:active{box-shadow:0 2px 0 #a8ded9}.slcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.slhead{text-align:center;background:linear-gradient(160deg,#e3f7f4,#fff);border:3px solid #13958c;border-radius:24px;padding:10px 12px;margin-bottom:10px}
.slhead .em{font-size:48px;line-height:1.2}.slhead h2{margin:0;font-size:21px;color:#0d6b65}.slhead p{margin:2px 0;font-size:15px;color:var(--muted);line-height:1.7}
.slway{display:inline-block;border-radius:14px;padding:0 10px;font-size:14px;font-weight:800;color:#fff}
.slgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sli{background:#fff;border:2px solid var(--line);border-radius:18px;padding:10px 6px;text-align:center;color:inherit;box-shadow:0 4px 0 #d6e9de;position:relative}
.sli:active{transform:translateY(3px);box-shadow:0 1px 0 #d6e9de}
.sli .e{font-size:36px;display:block;line-height:1.3}.sli b{display:block;font-size:16px}.sli small{color:var(--muted);font-size:12.5px;line-height:1.5;display:block}
.sli .ok{position:absolute;top:-8px;left:-6px;font-size:22px}
.slpick{display:flex;flex-direction:column;gap:12px;margin-top:8px}
.slpick button{display:flex;align-items:center;gap:12px;background:#fff;border:3px solid var(--line);border-radius:22px;padding:14px;text-align:right;color:inherit}
.slpick button .e{font-size:44px}.slpick button b{display:block;font-size:20px}.slpick button small{color:var(--muted);font-size:14px}
.slstep{background:#fff;border:3px solid var(--sc,#13958c);border-radius:24px;padding:14px;text-align:center;flex:1}
.slstep .em{font-size:76px;line-height:1.15;animation:bpopin .4s}
.slstep .n{display:inline-block;background:var(--sc,#13958c);color:#fff;border-radius:14px;padding:0 12px;font-weight:800;font-size:14px}
.slstep h2{margin:6px 0;font-size:23px;color:var(--sc,#13958c)}.slstep p{font-size:18px;line-height:1.9;margin:4px 0}
.slsay{font-family:'Amiri Quran','Amiri',serif;font-size:23px;line-height:2.1;background:#f6fbf8;border-radius:16px;padding:6px 10px;margin:8px 0;color:#0b3d27}
.slopt{display:inline-block;background:#fff4d6;color:#7a5200;border:1px solid #f2c94c;border-radius:12px;padding:0 8px;font-size:13px;font-weight:800}
.slnote{background:#fff8e3;border:2px solid #f2c94c;border-radius:16px;padding:8px 12px;font-size:15.5px;line-height:1.8;margin-top:10px;text-align:right}
.slord{display:flex;flex-direction:column;gap:8px}
.slord button{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--line);border-radius:16px;padding:10px 12px;font-size:17px;font-weight:700;color:var(--ink);text-align:right}
.slord button .e{font-size:26px}.slord button.done{background:#e3f7ea;border-color:#1fa463;opacity:.6}.slord button.no{animation:shk .4s;border-color:#e2504a;background:#fde7e6}
.slslots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0;min-height:40px}
.slslots span{background:#e3f7ea;border:2px solid #1fa463;border-radius:12px;padding:2px 8px;font-size:14px;font-weight:700;animation:bpopin .3s}
.slpray{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:10px 0}
.slpray button{border:2px solid var(--line);background:#fff;border-radius:16px;padding:8px 2px;font-size:14px;font-weight:800;color:var(--ink);line-height:1.4}
.slpray button span{display:block;font-size:28px}.slpray button.on{background:linear-gradient(160deg,#e3f7ea,#c9f0d6);border-color:#1fa463}
.slweek{display:flex;gap:4px;justify-content:center;margin:8px 0}.slweek span{width:38px;border-radius:10px;background:#eef3ef;font-size:11px;text-align:center;padding:2px 0;line-height:1.5}.slweek span b{display:block;font-size:14px}
`;
document.head.appendChild(css);

/* ---------- الشاشة والبطاقة ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='salah';
sec.innerHTML=`<div class="bar"><button class="back" id="slBack">›</button><div class="ttl" id="slTitle">🕌 وضوئي وصلاتي</div></div><div id="slBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard slcard';card.id='openSalah';
card.innerHTML=`<span class="cup">🕌</span><span><b>وضوئي وصلاتي</b><small id="slLine"></small></span><span class="go">‹</span>`;
($('#openHifz')||$('#openBook')).after(card);
function line(){const d=D(),t=todayPray().filter(Boolean).length;
  $('#slLine').textContent=(d.fiqh&&d.fiqh.sh)||t?`صلّيتُ اليوم ${ar(t)} من ٥ 🤲 · تعلّم وتدرّب واربح الجوائز`:'تعلّم الوضوء والصلاة، وتدرّب، واربح جوائز لبيتك في الجنة'}
let back=null,vbox=null;
const stopV=()=>{if(vbox){vbox.stop();vbox=null}};
$('#slBack').onclick=()=>{stopV();if(back){const f=back;back=null;f()}else{renderHome&&renderHome();show('home')}};
card.onclick=()=>{tone(880,.05,'sine',.08);hub();show('salah')};
const body=()=>$('#slBody');
const title=t=>$('#slTitle').textContent=t;
const setColor=()=>document.documentElement.style.setProperty('--sc',way()?way().color:'#13958c');

/* ---------- الصفحة الرئيسية للصلاة ---------- */
function hub(){stopV();back=null;setColor();const w=way(),f=fq();title('🕌 وضوئي وصلاتي');
  const tk=v=>v?'<span class="ok">✅</span>':'';
  body().innerHTML=`<div class="slhead"><div class="em">🕌💧</div>
    <p>${B('تعلّم','تعلّمي')}، ثم ${B('تدرّب','تدرّبي')}، ثم ${B('ادخل','ادخلي')} الاختبار، ${B('واربح','واربحي')} جوائز لبيتك في الجنة 🏡</p></div>
   <div class="slgrid">
    <button class="sli" data-go="lw">${tk(f.wl)}<span class="e">💧</span><b>تعلّم الوضوء</b><small>${ar(w.wudu.length)} خطوات بالصور</small></button>
    <button class="sli" data-go="ls">${tk(f.sl)}<span class="e">🕌</span><b>تعلّم الصلاة</b><small>صلاة الصبح خطوة خطوة</small></button>
    <button class="sli" data-go="ow">${tk(f.wo)}<span class="e">🧩</span><b>رتّب الوضوء</b><small>تدريب: ضع الخطوات بالترتيب</small></button>
    <button class="sli" data-go="os">${tk(f.so)}<span class="e">🧩</span><b>رتّب الصلاة</b><small>تدريب: خطوات الركعة والتشهّد</small></button>
    <button class="sli" data-go="v">${tk(f.sv)}<span class="e">🎤</span><b>قلها بصوتك</b><small>أذكار الصلاة والحمد، والتطبيق يصحّح</small></button>
    <button class="sli" data-go="pr">${tk(todayPray().every(Boolean))}<span class="e">🤲</span><b>سجلّ صلاتي</b><small>صلّيتُ اليوم ${ar(todayPray().filter(Boolean).length)} من ٥</small></button>
    <button class="sli" data-go="tw">${tk(f.wt>=.75)}<span class="e">📝</span><b>اختبار الوضوء</b><small>${f.wt?`أفضل نتيجة: ${ar(Math.round(f.wt*8))} من ٨`:'٨ أسئلة · الجائزة: 💧 عين ماء لبيتك'}</small></button>
    <button class="sli" data-go="ts">${tk(f.st>=.75)}<span class="e">📝</span><b>اختبار الصلاة</b><small>${f.st?`أفضل نتيجة: ${ar(Math.round(f.st*8))} من ٨`:'٨ أسئلة · بعد التعلّم والتسميع: 🕌 مسجد جميل لبيتك'}</small></button>
   </div>
   <p class="tip">⚠️ اسأل أهلك أو إمام مسجدك عن أيّ شيءٍ لم تفهمه، فهم يعلّمونك بالطريقة الصحيحة 🤍</p>`;
  const go={lw:()=>learn('wudu',0),ls:()=>learn('salah',0),ow:()=>order('wudu'),os:()=>order('salah'),v:voice,pr:pray,tw:()=>test('wudu'),ts:()=>test('salah')};
  body().querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{tone(880,.05,'sine',.08);go[b.dataset.go]()});
  window.scrollTo(0,0)}

/* ---------- تعلّم: خطوة خطوة ---------- */
function learn(kind,k){stopV();back=hub;const w=way(),list=w[kind],s=list[k],last=k==list.length-1;
  title(kind=='wudu'?'💧 تعلّم الوضوء':'🕌 تعلّم الصلاة');
  const read=s.read?`<div class="slsay" style="font-size:20px">${(s.read=='f'?FATIHA:TAWHID).join(' ۝ ')}</div>`:'';
  body().innerHTML=`<div class="prog"><i style="width:${(k+1)/list.length*100}%"></i></div>
   <div class="slstep"><span class="n">الخطوة ${ar(k+1)} من ${ar(list.length)}</span> ${s.opt?'<span class="slopt">مستحب</span>':''}
    <div class="em">${s.e}</div><h2>${s.t}</h2><p>${s.d}</p>${s.say?`<div class="slsay">${s.say}</div><button class="btn" id="slSay" style="background:#13958c;box-shadow:0 5px 0 #0d6b65;flex:none;padding:8px 16px;font-size:16px">🎤 ${B('قلها بصوتك','قوليها بصوتك')}</button><div id="slVx" style="margin-top:8px"></div>`:''}${read}
    ${last&&kind=='wudu'?`<div class="slnote">💡 ${w.wuduNote}</div>`:''}
    ${last&&kind=='salah'?`<div class="slnote">💡 عدد الركعات: الصبح ركعتان، والظهر أربع، والعصر أربع، والمغرب ثلاث، والعشاء أربع. وفي الصلاة الثلاثية والرباعية نتشهّد بعد الركعة الثانية ثم نكمل.</div>`:''}</div>
   <div class="nav"><button class="btn sec" id="slPrev" ${k?'':'disabled'}>السابق</button><button class="btn ${last?'gold':''}" id="slNext">${last?'أكملتُ الدرس ✓':'التالي'}</button></div>`;
  const sb=$('#slSay');if(sb)sb.onclick=()=>{sb.remove();vbox=Voice.reciteBox($('#slVx'),s.say,{pass:.75,onResult:sc=>{if(sc>=.75){fq().sv=1;Aamal.save()}}})};
  $('#slPrev').onclick=()=>learn(kind,k-1);
  $('#slNext').onclick=()=>{if(!last)return learn(kind,k+1);stopV();const f=fq(),key=kind=='wudu'?'wl':'sl',first=!f[key];f[key]=1;Aamal.save();
    modal(`<div style="font-size:56px">${kind=='wudu'?'💧':'🕌'}</div><h3 style="margin:4px 0">${B('أحسنت!','أحسنتِ!')} ${B('تعلّمتَ','تعلّمتِ')} ${kind=='wudu'?'الوضوء':'الصلاة'}</h3><p>الآن ${B('تدرّب','تدرّبي')} على ترتيب الخطوات، ثم ${B('ادخل','ادخلي')} الاختبار لتربح جائزة لبيتك 🏡</p><div id="slCups"></div><div class="nav"><button class="btn gold" id="slGoO">🧩 تدرّب الآن</button><button class="btn sec" data-close>لاحقًا</button></div>`,()=>{
      $('#slGoO').onclick=()=>{closeModal();order(kind)}});
    if(first&&window.cupsAward)cupsAward(1,'fiqh',$('#slCups'));
    Aamal.grow('fiqh');hub();window.Alqab&&Alqab.soon()};
  window.scrollTo(0,0)}

/* ---------- تدرّب: رتّب الخطوات ---------- */
function order(kind){stopV();back=hub;const w=way();let steps=w[kind].filter(s=>!s.opt),label,next2=null;
  if(kind=='salah'){ // ترتيب الشيخ: صلاة الصبح ركعتان، كل ركعة بخطواتها كاملة (أسماء كل جزء فريدة حتى لا يلتبس الضغط)
    const A=[['🤲','النيّة'],['🙌','تكبيرة الإحرام'],['📖','قراءة سورة الحمد'],['📖','قراءة سورة التوحيد'],['🙇','الركوع'],['🧍','القيام بعد الركوع'],['🧎','السجدة الأولى'],['🪑','الجلوس بين السجدتين'],['🧎','السجدة الثانية']],
      Bq=[['🧍','القيام للركعة الثانية'],['📖','قراءة سورة الحمد'],['📖','قراءة سورة بعدها'],['🙇','الركوع'],['🧍','القيام بعد الركوع'],['🧎','السجدة الأولى'],['🪑','الجلوس بين السجدتين'],['🧎','السجدة الثانية'],['🪑','التشهّد'],['👋','التسليم']];
    // v8.6: كانت تختار ركعة واحدة عشوائيًا، فإذا جاءت الثانية غابت النيّة وتكبيرة الإحرام. الآن دائمًا: الركعة الأولى ثم الثانية
    steps=A.map(x=>({e:x[0],t:x[1]}));label='الركعة الأولى';
    next2=()=>{steps=Bq.map(x=>({e:x[0],t:x[1]}));label='الركعة الثانية';pos=0;sh=shuffle(steps.map((s,i)=>({s,i})));
      try{fanfare()}catch(e){}toast2('👏 أحسنت! الآن الركعة الثانية');draw()}}
  else label='كل خطوات الوضوء';
  title(kind=='wudu'?'🧩 رتّب الوضوء':'🧩 رتّب الصلاة');
  let pos=0,miss=0,sh=shuffle(steps.map((s,i)=>({s,i}))),all=[];
  const toast2=t=>{const d=document.createElement('div');d.className='ctbanner b3';d.style.cssText='font-size:18px;top:16%;white-space:normal;max-width:90vw;text-align:center';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};
  const draw=()=>{body().innerHTML=`<div class="slhead" style="padding:8px"><h2 style="font-size:18px">${B('اضغط','اضغطي')} الخطوات بالترتيب الصحيح</h2><p>${label} · ${B('أخطأتَ','أخطأتِ')} ${ar(miss)}</p></div>
     <div class="slslots">${steps.slice(0,pos).map((s,i)=>`<span>${ar(i+1)}. ${s.e} ${s.t}</span>`).join('')||'<span style="background:none;border-style:dashed;border-color:var(--line);color:var(--muted)">الخطوات هنا ⬇️</span>'}</div>
     <div class="slord">${sh.map(x=>`<button data-i="${x.i}" class="${x.i<pos?'done':''}" ${x.i<pos?'disabled':''}><span class="e">${x.s.e}</span>${x.s.t}</button>`).join('')}</div>`;
    body().querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
      if(i==pos){pos++;tone(523+pos*70,.1,'triangle',.14);if(pos==steps.length){if(next2){all=all.concat(steps);const f=next2;next2=null;return setTimeout(f,350)}return finish()}draw()}
      else{miss++;b.classList.remove('no');void b.offsetWidth;b.classList.add('no');tone(220,.15,'square',.08);try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}
        const t=body().querySelector('.slhead p');if(t)t.textContent=`${label} · ${B('أخطأتَ','أخطأتِ')} ${ar(miss)}`}})};
  const finish=()=>{const stars=miss==0?3:miss<=2?2:1,f=fq(),key=kind=='wudu'?'wo':'so';f[key]=Math.max(f[key]||0,stars);Aamal.save();
    try{fanfare();if(stars==3)confetti()}catch(e){}
    body().innerHTML=`<div class="result"><div class="big">${'⭐'.repeat(stars)}</div><h2 style="color:var(--ok)">${miss?`رتّبتها مع ${ar(miss)} ${miss==1?'خطأ':'أخطاء'}`:B('رتّبتها كلّها بلا خطأ!','رتّبتِها كلّها بلا خطأ!')}</h2>
      <div class="slslots">${all.concat(steps).map((s,i)=>`<span>${ar(i+1)}. ${s.e} ${s.t}</span>`).join('')}</div><div id="slCups"></div>
      <div class="nav"><button class="btn gold" id="slTest">📝 إلى الاختبار</button></div><div class="nav"><button class="btn sec" id="slAgain">🔁 مرة أخرى</button></div></div>`;
    if(stars>=2&&window.cupsAward)cupsAward(1,'fiqh',$('#slCups'));if(stars>=2)Aamal.grow('fiqh');
    $('#slTest').onclick=()=>test(kind);$('#slAgain').onclick=()=>order(kind);window.Alqab&&Alqab.soon()};
  draw();window.scrollTo(0,0)}

/* ---------- قلها بصوتك: أذكار الصلاة والحمد ---------- */
function voice(){stopV();back=hub;title('🎤 قلها بصوتك');const w=way();
  const items=[...w.wudu,...w.salah].filter(s=>s.say&&!s.r2).map(s=>({e:s.e,t:s.t,say:s.say})).concat(FATIHA.map((v,k)=>({e:'📖',t:`سورة الحمد · الآية ${ar(k+1)}`,say:v,q:1})));
  let k=0,ok=0;
  const draw=()=>{stopV();const it=items[k];
    body().innerHTML=`<div class="vprog">${items.map((_,j)=>`<i class="${j<k?'ok':j==k?'cur':''}"></i>`).join('')}</div>
     <div class="slhead" style="padding:8px"><div class="em" style="font-size:40px">${it.e}</div><h2 style="font-size:19px">${it.t}</h2></div><div id="slVx"></div>
     <div class="nav"><button class="btn sec" id="slVp" ${k?'':'disabled'}>السابق</button><button class="btn" id="slVn">${k+1<items.length?'التالي':'انتهيت 🏁'}</button></div>`;
    vbox=Voice.reciteBox($('#slVx'),it.say,{quran:it.q,pass:.75,onResult:sc=>{if(sc>=.75){ok++;$('#slVn').classList.add('gold')}}});
    $('#slVp').onclick=()=>{k--;draw()};
    $('#slVn').onclick=()=>{if(k+1<items.length){k++;draw();return}stopV();const f=fq();f.sv=1;Aamal.save();Aamal.add('tilawa',Math.min(ok,items.length));
      body().innerHTML=`<div class="result"><div class="big">🎤</div><h2 style="color:var(--ok)">${B('ما شاء الله! قلتَ أذكار الصلاة بصوتك','ما شاء الله! قلتِ أذكار الصلاة بصوتك')}</h2><p>${B('ردّدها كل يوم حتى تحفظها وتقولها في صلاتك 🤍','ردّديها كل يوم حتى تحفظيها وتقوليها في صلاتك 🤍')}</p><div id="slCups"></div><div class="nav"><button class="btn gold" id="slH">رجوع</button></div></div>`;
      if(window.cupsAward)cupsAward(1,'fiqh',$('#slCups'));if(ok)Aamal.grow('ayah');$('#slH').onclick=hub;window.Alqab&&Alqab.soon()};
    window.scrollTo(0,0)};
  draw()}

/* ---------- الاختبار ---------- */
function test(kind){stopV();back=hub;const w=way(),bank=kind=='wudu'?w.wq:w.sq,N=8;
  title(kind=='wudu'?'📝 اختبار الوضوء':'📝 اختبار الصلاة');
  const qs=shuffle(bank).slice(0,N).map(q=>({q:q[0],ok:q[1],opts:shuffle(q.slice(1))}));let i=0,sc=0;
  const ask=()=>{const q=qs[i];
    body().innerHTML=`<div class="prog"><i style="width:${i/N*100}%"></i></div><div class="qcard" style="--sc:${w.color}"><div class="qn">سؤال ${ar(i+1)} من ${ar(N)}</div><div class="qq">${q.q}</div>
      ${q.opts.map((o,k)=>`<button class="opt" data-k="${k}"><span class="l">${LET[k]}</span><span>${o}</span></button>`).join('')}<div class="fb" id="slFb"></div></div>
      <div class="nav"><button class="btn" id="slQn" disabled>${i+1<N?'التالي':'النتيجة 🏁'}</button></div>`;
    const bs=[...body().querySelectorAll('.opt')];
    bs.forEach((b,k)=>b.onclick=()=>{const good=q.opts[k]==q.ok;bs.forEach((x,j)=>{x.disabled=true;if(q.opts[j]==q.ok)x.classList.add('ok');else if(j==k)x.classList.add('bad')});
      if(good){sc++;beep(true);$('#slFb').className='fb ok';$('#slFb').textContent=B('أحسنت! ✓','أحسنتِ! ✓')}else{beep(false);$('#slFb').className='fb bad';$('#slFb').textContent='الصحيح: '+q.ok}
      $('#slQn').disabled=false});
    $('#slQn').onclick=()=>{i++;i<N?ask():end()}};
  const end=()=>{const f=fq(),key=kind=='wudu'?'wt':'st',frac=sc/N,pass=frac>=.75,firstPass=pass&&!(f[key]>=.75);f[key]=Math.max(f[key]||0,frac);Aamal.save();
    const prize=kind=='wudu'?{id:'d_spring',e:'💧',n:'عين ماء جارية'}:{id:'d_mosque',e:'🕌',n:'مسجد جميل بجانب بيتك'};
    const full=kind=='wudu'||(f.sl&&f.sv);let got=false;if(pass&&full&&window.Deco&&Deco.grant)got=Deco.grant(prize.id);
    body().innerHTML=`<div class="result"><div class="big">${pass?'🎉':'🌱'}</div><h2 style="color:${pass?'var(--ok)':'#b06a2c'}">${pass?(sc==N?'ممتاز! كلّها صحيحة':B('نجحت يا بطل!','نجحتِ يا بطلة!')):'محاولة جيدة!'}</h2>
      <div class="score">${B('أجبتَ','أجبتِ')} عن ${ar(sc)} من ${ar(N)}${pass?'':` — تحتاج ${ar(6)} للنجاح`}</div>
      ${got?`<div class="cupbox win"><b>${prize.e}</b>جائزتك: ${prize.n} في بيتك في الجنة! 🏡</div>`:''}${pass&&!full?`<div class="cupbox"><b>🕌</b>${B('أكمل','أكملي')} ${!f.sl?'«تعلّم الصلاة»':''}${!f.sl&&!f.sv?' و':''}${!f.sv?'«قلها بصوتك»':''} لتربح مسجدًا جميلًا بجانب بيتك!</div>`:''}<div id="slCups"></div>
      ${pass?'':`<p>${B('ارجع','ارجعي')} إلى الدرس ثم ${B('حاول','حاولي')} مرة أخرى 💪</p>`}
      <div class="nav">${pass?`<button class="btn gold" id="slBayt">🏡 شاهد بيتك</button>`:`<button class="btn gold" id="slLearn">📖 الدرس</button>`}</div><div class="nav"><button class="btn sec" id="slAgain">🔁 اختبار جديد</button></div></div>`;
    if(pass){try{fanfare();confetti()}catch(e){}if(window.cupsAward)cupsAward(firstPass?3:1,'fiqh',$('#slCups'));Aamal.grow('fiqh',firstPass?2:1)}
    const bb=$('#slBayt');if(bb)bb.onclick=()=>{$('#openBayt')&&$('#openBayt').click()};
    const bl=$('#slLearn');if(bl)bl.onclick=()=>learn(kind,0);
    $('#slAgain').onclick=()=>test(kind);window.Alqab&&Alqab.soon()};
  ask();window.scrollTo(0,0)}

/* ---------- سجلّ صلاتي ---------- */
const PR=[['🌅','الصبح'],['☀️','الظهر'],['🌤️','العصر'],['🌇','المغرب'],['🌙','العشاء']];
const dkey=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
function todayPray(){const p=D().pray||{};return p[dkey()]||[0,0,0,0,0]}
function pray(){stopV();back=hub;title('🤲 سجلّ صلاتي');const d=D();d.pray=d.pray||{};
  const t=todayPray();const L=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
  let wk='';for(let k=6;k>=0;k--){const ts=Date.now()-k*864e5,n=(d.pray[dkey(ts)]||[]).filter(Boolean).length;wk+=`<span style="${k==0?'outline:2px solid var(--gold)':''}"><b>${n==5?'🌟':n?ar(n):'·'}</b>${L[new Date(ts).getDay()]}</span>`}
  body().innerHTML=`<div class="slhead"><div class="em">🤲</div><h2>أيّ الصلوات ${B('صلّيتَ','صلّيتِ')} اليوم؟</h2><p>${B('اضغط','اضغطي')} على الصلاة <b>بعد أن ${B('تصلّيها','تصلّيها')}</b> فقط. الله يراك ويحبّ الصادقين 🤍</p></div>
   <div class="slpray">${PR.map((p,k)=>`<button data-p="${k}" class="${t[k]?'on':''}"><span>${t[k]?'✅':p[0]}</span>${p[1]}</button>`).join('')}</div>
   <div class="slweek" dir="ltr">${wk}</div>
   <p class="tip">كل صلاةٍ ${B('تصلّيها','تصلّينها')} ترفع درجتك 🏅، والصلوات الخمس كاملة تعطيك كأسًا 🏆 لبيتك في الجنة.<br>مجموع صلواتك المسجّلة: <b>${ar(d.prayN||0)}</b></p>
   <div id="slCups"></div>`;
  body().querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const k=+b.dataset.p,arr=todayPray().slice();if(arr[k])return;
    arr[k]=1;d.pray[dkey()]=arr;d.prayN=(d.prayN||0)+1;
    // نحتفظ بآخر ٦٠ يومًا فقط
    const ks=Object.keys(d.pray);if(ks.length>60)ks.sort((a,b)=>new Date(a)-new Date(b)).slice(0,ks.length-60).forEach(x=>delete d.pray[x]);
    Aamal.save();Voice.chime();Voice.fly('🤲');line();Aamal.grow('pray');
    if(arr.every(Boolean)){setTimeout(()=>{try{fanfare();confetti()}catch(e){}if(window.cupsAward)cupsAward(1,'prayer',$('#slCups'))},300)}
    const keep=$('#slCups').innerHTML;pray();if(keep)$('#slCups').innerHTML=keep;window.Alqab&&Alqab.soon()});
  window.scrollTo(0,0)}

line();
const _rh=window.renderHome;window.renderHome=function(){_rh.apply(this,arguments);line()};
window.Salah={open:()=>{hub();show('salah')},openPray:()=>{show('salah');pray()},todayPray};
})();
