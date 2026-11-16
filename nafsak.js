/* اختبر نفسك — مواقف من الحياة: الأهل، الجار، الصديق، المدرسة، الأمانة...
   الطفل يختار ماذا يفعل، فيعرف الصواب بلطف. النتيجة مشجّعة دائمًا، وتعطي كؤوسًا 🏆 (تعتمد على bayt.js). */
(function(){
// [رمز، الموقف، [[الجواب، صحيح؟], ...]، لماذا]
const SITS=[
 ['👩','أمّك تحمل أكياسًا ثقيلة من السوق. ماذا تفعل؟',[['أُسرع وأساعدها في حملها',1],['أكمل اللعب ولا أنتبه لها',0]],'مساعدة الأمّ من برّ الوالدين، والله يحبّ البارّين بأهلهم.'],
 ['👨','أبوك متعب ويطلب منك كأس ماء. ماذا تفعل؟',[['أُحضر له الماء فورًا وبابتسامة',1],['أقول له: خذه بنفسك',0]],'طاعة الأب وخدمته تُفرح قلبه، ويرضى الله عنك.'],
 ['💵','وجدتَ مالًا في الطريق. ماذا تفعل؟',[['آخذه وأشتري به حلوى',0],['أعطيه لأبي أو للمعلّم ليبحث عن صاحبه',1],['أخبّئه ولا أخبر أحدًا',0]],'هذا المال ليس لنا، والأمانة أن نردّه لصاحبه.'],
 ['🔥','احترق بيت جاركم. ماذا تفعل؟',[['أطلب من أهلي أن نساعدهم ونتّصل بالإطفاء',1],['أتفرّج من بعيد وأضحك',0],['أقول: هذا ليس شأني',0]],'الجار له حقٌّ كبير، ومساعدته في الشدّة من أخلاق المؤمن.'],
 ['🍲','جاركم الكبير مريضٌ وحده في البيت. ماذا تفعل؟',[['أطلب من أمّي أن نأخذ له طعامًا ونزوره',1],['لا أهتمّ به',0]],'زيارة المريض والإحسان إلى الجار يحبّهما الله كثيرًا.'],
 ['🧒','صديقك وقع وجُرح في المدرسة. ماذا تفعل؟',[['أساعده وأُخبر المعلّم',1],['أضحك عليه مع الأولاد',0]],'الصديق الحقيقي يقف مع صديقه حين يحتاجه.'],
 ['✏️','صديقك نسي قلمه في الامتحان. ماذا تفعل؟',[['أُعيره قلمًا عندي',1],['أقول له: هذه مشكلتك',0]],'التعاون على الخير يجعل القلوب متحابّة.'],
 ['🍫','عندك حلوى وأخوك الصغير ينظر إليها. ماذا تفعل؟',[['أشاركه وأعطيه منها',1],['آكلها كلّها أمامه',0]],'المشاركة تجعل الإخوة متحابّين، والكرم خُلقٌ جميل.'],
 ['👴','جدّك يكلّمك وأنت تلعب بالهاتف. ماذا تفعل؟',[['أترك الهاتف وأستمع له باحترام',1],['أكمل اللعب ولا أردّ عليه',0]],'احترام الكبير والجدّ والجدّة من الأخلاق التي يحبّها الله.'],
 ['🏺','كسرتَ مزهرية في البيت بالخطأ. ماذا تفعل؟',[['أخبر أمّي بالصدق وأعتذر',1],['أقول: أخي هو الذي كسرها',0],['أخبّئها حتى لا يعرف أحد',0]],'الصدق نجاة، والاعتذار من الشجاعة، والكذب على غيرنا ظلم.'],
 ['🕌','سمعتَ الأذان وأنت تلعب. ماذا تفعل؟',[['أترك اللعب وأتوضّأ للصلاة',1],['أقول: أصلّي بعد ساعة أو ساعتين',0]],'الصلاة في وقتها من أحبّ الأعمال إلى الله.'],
 ['👨‍🏫','المعلّم يشرح الدرس. ماذا تفعل؟',[['أنتبه وأستمع جيدًا',1],['أتكلّم مع زميلي وأشاغب',0]],'احترام المعلّم وطلب العلم يرفعان الإنسان.'],
 ['🐱','قطّةٌ صغيرة جائعة عند الباب. ماذا تفعل؟',[['أعطيها طعامًا وماءً',1],['أرميها بالحجارة',0]],'الرحمة بالحيوان خُلقٌ عظيم، والله يرحم الرحماء.'],
 ['🧎','رجلٌ فقير يطلب المساعدة. ماذا تفعل؟',[['أطلب من أهلي أن نساعده، أو أعطيه من مصروفي',1],['أسخر منه',0]],'الصدقة تُفرح الفقير، ولا نسخر من أحدٍ أبدًا.'],
 ['🙋','طالبٌ جديد في الصف يجلس وحيدًا. ماذا تفعل؟',[['أسلّم عليه وأدعوه للّعب معنا',1],['أتركه وحده وأسخر منه',0]],'إدخال السرور على قلب الآخرين عملٌ يحبّه الله.'],
 ['😠','أخوك أخذ لعبتك. ماذا تفعل؟',[['أطلب منه بهدوء أن يعيدها، أو أخبر أمّي',1],['أضربه',0]],'الهدوء والكلام اللطيف أفضل من الغضب والضرب.'],
 ['🗑️','أكلتَ شيئًا في الشارع وبقي الكيس بيدك. ماذا تفعل؟',[['أضعه في سلّة النفايات',1],['أرميه على الأرض',0]],'النظافة من الإيمان، والشارع للجميع.'],
 ['🍽️','حان وقت الطعام. ماذا تفعل أولًا؟',[['أغسل يديّ وأقول: بسم الله',1],['آكل مباشرةً بلا غسلٍ ولا تسمية',0]],'التسمية تجعل الطعام مباركًا، والنظافة تحفظ صحّتنا.'],
 ['😴','أمّك تقول: حان وقت النوم. ماذا تفعل؟',[['أطيعها وأذهب للنوم',1],['أصرخ وأرفض',0]],'طاعة الوالدين في الخير من برّهما.'],
 ['🧓','رجلٌ كبير في السن يريد أن يعبر الشارع. ماذا تفعل؟',[['أساعده، أو أطلب من شخصٍ كبير أن يساعده',1],['أتجاهله',0]],'مساعدة كبار السنّ من احترامهم والإحسان إليهم.'],
 ['📝','صديقك يطلب أن تغشّشه في الامتحان. ماذا تفعل؟',[['أقول له: الغشّ لا يجوز، وأساعده يدرس بعد ذلك',1],['أعطيه الأجوبة',0]],'الغشّ خيانة، والصديق الحقيقي يساعدك على الخير.'],
 ['🗣️','سمعتَ أولادًا يتكلّمون بسوءٍ عن زميلٍ غائب. ماذا تفعل؟',[['أقول لهم بلطف: هذا لا يجوز، وأدافع عنه',1],['أشاركهم الكلام',0]],'الغيبة لا يحبّها الله، والدفاع عن الغائب خُلقٌ نبيل.'],
 ['🎁','أعطاك عمّك هدية. ماذا تقول؟',[['شكرًا يا عمّي، جزاك الله خيرًا',1],['آخذها ولا أقول شيئًا',0]],'شكر الناس على إحسانهم من شكر الله.'],
 ['👋','دخلتَ البيت فوجدتَ أهلك. ماذا تفعل؟',[['أقول: السلام عليكم',1],['أدخل غرفتي بلا سلام',0]],'السلام ينشر المحبّة بين الناس.'],
 ['🧹','أمّك تنظّف البيت. ماذا تفعل؟',[['أرتّب غرفتي وأساعدها',1],['أزيد الفوضى وألعب',0]],'المساعدة في البيت تُخفّف التعب عن الأمّ وتُفرحها.'],
 ['📱','وجدتَ هاتف صديقك مفتوحًا. ماذا تفعل؟',[['لا ألمس أشياءه بلا إذنه',1],['أقرأ رسائله',0]],'احترام خصوصيّة الآخرين من الأمانة.'],
 ['💧','انتهيتَ من الوضوء والماء ما زال يجري. ماذا تفعل؟',[['أغلق الحنفيّة ولا أُسرف',1],['أتركه يجري',0]],'الإسراف لا يحبّه الله، حتى في الماء.'],
 ['👵','جدّتك جاءت لزيارتكم. ماذا تفعل؟',[['أرحّب بها وأجلس معها',1],['أختبئ في غرفتي',0]],'صلة الرحم وإكرام الجدّة تُفرح قلبها ويحبّها الله.'],
 ['🛒','البائع أعطاك نقودًا زائدة بالخطأ. ماذا تفعل؟',[['أُرجع الزيادة له',1],['آخذها وأسكت',0]],'الأمانة أن نُرجع ما ليس لنا، حتى لو لم يعرف أحد.'],
 ['📚','أمّك سألتك: هل أنهيتَ واجبك؟ ولم تُنهه بعد. ماذا تقول؟',[['أقول الصدق وأُكمله الآن',1],['أقول: نعم، وأنا لم أُنهه',0]],'الصادق يحبّه الله والناس، والكذب يُتعب صاحبه.'],
 ['👶','أخوك الصغير يبكي. ماذا تفعل؟',[['ألاعبه وأهدّئه',1],['أصرخ عليه',0]],'الرحمة بالصغير من أخلاق النبي صلى الله عليه وآله.'],
 ['🌳','صديقك يكسر أغصان شجرة الحديقة. ماذا تفعل؟',[['أنصحه بلطف أن يتوقّف',1],['أكسر معه',0]],'الأشجار نعمة، والنصيحة بلطف من حبّ الخير للصديق.'],
 ['🤲','صديقك لا يعرف كيف يتوضّأ. ماذا تفعل؟',[['أعلّمه بلطف، أو نسأل الكبار معًا',1],['أسخر منه',0]],'تعليم الخير للآخرين له أجرٌ كبير.'],
 ['😢','صديقك حزين لأن عصفوره مات. ماذا تفعل؟',[['أواسيه وأقف معه',1],['أضحك عليه',0]],'مواساة الحزين تُخفّف عنه وتجعله يحبّك.'],
 ['🚪','أبوك نائم وأنت تلعب. ماذا تفعل؟',[['ألعب بهدوء حتى لا أُزعجه',1],['أصرخ وأشغّل صوتًا عاليًا',0]],'مراعاة راحة الوالدين من برّهما.'],
 ['🤝','تشاجرتَ مع صديقك أمس. ماذا تفعل اليوم؟',[['أبدأ بالسلام وأصالحه',1],['لا أكلّمه أبدًا',0]],'الذي يبدأ بالصلح والسلام هو الأفضل عند الله.']
];
const N=10;
const css=document.createElement('style');
css.textContent=`
.nfcard{border-color:#7c4dc4;box-shadow:0 5px 0 #d4c2f0}.nfcard:active{box-shadow:0 2px 0 #d4c2f0}
.nfcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.nfq{background:#fff;border:3px solid #7c4dc4;border-radius:24px;padding:14px 14px 12px;text-align:center}
.nfq .em{font-size:64px;line-height:1.2;animation:bpopin .4s}
.nfq h2{font-size:20px;margin:6px 0 12px;color:#3b2470;line-height:1.7}
.nfo{display:block;width:100%;text-align:right;background:#f7f3fd;border:2px solid #e2d8f5;border-radius:16px;padding:11px 14px;margin:8px 0;font-size:17px;font-weight:700;color:var(--ink);transition:transform .1s}
.nfo:active{transform:scale(.98)}.nfo:disabled{opacity:1}
.nfo.ok{background:#e3f7ea;border-color:#1fa463}.nfo.bad{background:#fde7e6;border-color:#e2504a}.nfo.dim{opacity:.45}
.nffb{border-radius:16px;padding:10px 12px;margin-top:10px;font-size:16px;line-height:1.7;text-align:right;animation:bpopin .35s}
.nffb.ok{background:#e3f7ea;color:#0e5a3a}.nffb.bad{background:#fff3e0;color:#7a4a00}
.nfprog{display:flex;gap:4px;justify-content:center;margin:2px 0 10px}.nfprog i{width:18px;height:8px;border-radius:6px;background:#e2d8f5}
.nfprog i.ok{background:#1fa463}.nfprog i.bad{background:#f2b632}.nfprog i.cur{background:#7c4dc4}
.nfres{text-align:center;background:#fff;border-radius:24px;border:3px solid #7c4dc4;padding:16px}
.nfres .big{font-size:72px;line-height:1.2}.nfres h2{margin:4px 0;font-size:24px}
.nfres .tips{text-align:right;background:#f7f3fd;border-radius:14px;padding:8px 12px;margin:10px 0;font-size:15px;line-height:1.8}
.nfsex{display:flex;gap:10px;margin:14px 0}.nfsex button{flex:1;font-size:20px;padding:18px 6px;border-radius:20px;border:3px solid #e2d8f5;background:#fff;font-weight:800}
.nfsex button span{display:block;font-size:54px}
`;
document.head.appendChild(css);

const sec=document.createElement('section');sec.className='screen';sec.id='nafsak';
sec.innerHTML=`<div class="bar"><button class="back" id="nfBack">›</button><div class="ttl">اختبر نفسك 💚</div></div><div id="nfBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard nfcard';card.id='openNafsak';
card.innerHTML=`<span class="cup">💚</span><span><b>اختبر نفسك</b><small>مواقف من حياتك: ماذا تفعل؟ واربح الكؤوس 🏆</small></span><span class="go">‹</span>`;
($('#openBayt')||$('#openContest')).after(card);
const boy=()=>Cups.sex!='g';
card.onclick=()=>{tone(880,.05,'sine',.08);intro();show('nafsak')};
$('#nfBack').onclick=()=>{renderHome&&renderHome();show('home')};

let Q=null;
function intro(){const B=$('#nfBody');
  if(!Cups.sex){B.innerHTML=`<div class="nfq"><div class="em">💚</div><h2>أهلًا بك! قبل أن نبدأ:</h2><div class="nfsex"><button data-s="b"><span>👦</span>أنا ولد</button><button data-s="g"><span>👧</span>أنا بنت</button></div></div>`;
    B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{Cups.setSex(b.dataset.s);intro()});return}
  B.innerHTML=`<div class="nfq"><div class="em">🪞</div><h2>${boy()?'هل أنت ولدٌ صالح؟':'هل أنتِ بنتٌ صالحة؟'}</h2>
    <p style="margin:0 0 6px;font-size:16px;line-height:1.8">ستمرّ ${boy()?'بك':'بكِ'} ${ar(N)} مواقف من الحياة: مع الأهل والجيران والأصدقاء والمدرسة.<br>${boy()?'اختر':'اختاري'} ماذا ${boy()?'تفعل':'تفعلين'} <b>بصدق</b>، فالله يرى كل شيء 🤍</p>
    <p style="margin:0;font-size:14px;color:var(--muted)">🏆 الإجابات الجميلة تربحك كؤوسًا لبيتك في الجنة</p>
    <div class="nav" style="margin-top:12px"><button class="btn gold" id="nfGo" style="flex:1">ابدأ</button></div>
    <button class="link-btn" id="nfSex" style="margin-top:8px">${boy()?'أنا بنت 👧':'أنا ولد 👦'}</button></div>`;
  $('#nfGo').onclick=start;$('#nfSex').onclick=()=>{Cups.setSex(boy()?'g':'b');intro()}}
function start(){Q={qs:shuffle(SITS.slice()).slice(0,N).map(s=>({s,opts:shuffle(s[2].map(o=>({t:o[0],ok:!!o[1]})))})),i:0,good:0,res:[],wrong:[]};ask()}
function ask(){const q=Q.qs[Q.i],[em,txt,,why]=q.s,B=$('#nfBody');
  B.innerHTML=`<div class="nfprog">${Q.qs.map((x,k)=>`<i class="${k<Q.i?(Q.res[k]?'ok':'bad'):k==Q.i?'cur':''}"></i>`).join('')}</div>
   <div class="nfq"><div class="em">${em}</div><h2>${txt}</h2>${q.opts.map((o,k)=>`<button class="nfo" data-k="${k}">${o.t}</button>`).join('')}<div id="nfFb"></div></div>`;
  const btns=[...B.querySelectorAll('.nfo')];
  btns.forEach((b,k)=>b.onclick=()=>{const o=q.opts[k];btns.forEach((x,j)=>{x.disabled=true;x.onclick=null;
      if(q.opts[j].ok)x.classList.add('ok');else if(j==k)x.classList.add('bad');else x.classList.add('dim')});
    Q.res[Q.i]=o.ok;if(o.ok){Q.good++;[784,988,1319].forEach((f,i)=>tone(f,.14,'triangle',.13,i*.08))}
    else{Q.wrong.push(q);tone(330,.18,'sine',.1);tone(262,.25,'sine',.1,.15)}
    const best=q.opts.find(x=>x.ok).t;
    $('#nfFb').innerHTML=`<div class="nffb ${o.ok?'ok':'bad'}">${o.ok?`👍 <b>${boy()?'أحسنت!':'أحسنتِ!'}</b> ${why}`:`💭 <b>الأفضل:</b> ${best}.<br>${why}`}</div>
      <div class="nav" style="margin-top:10px"><button class="btn" id="nfNext" style="flex:1">${Q.i==Q.qs.length-1?'النتيجة 🏆':'التالي'}</button></div>`;
    $('#nfNext').onclick=()=>{Q.i++;Q.i<Q.qs.length?ask():end()}})}
function end(){const f=Q.good/Q.qs.length,b=boy(),B=$('#nfBody');
  let big,title,col,msg;
  if(f>=.8){big='🌟';col='#14794f';title=b?'ما شاء الله! أنت ولدٌ صالح':'ما شاء الله! أنتِ بنتٌ صالحة';
    msg=b?'أخلاقك جميلة، والله يحبّ المحسنين. استمرّ هكذا يا بطل! 💚':'أخلاقكِ جميلة، والله يحبّ المحسنين. استمرّي هكذا يا بطلة! 💚'}
  else if(f>=.5){big='🌷';col='#2f6fd0';title=b?'أنت ولدٌ طيّب، وتقدر تصير أحسن':'أنتِ بنتٌ طيّبة، وتقدرين تصيرين أحسن';
    msg=b?'عندك أخلاقٌ جميلة كثيرة، وبقيت أشياءٌ صغيرة تتعلّمها. حاول مرة أخرى!':'عندكِ أخلاقٌ جميلة كثيرة، وبقيت أشياءٌ صغيرة تتعلّمينها. حاولي مرة أخرى!'}
  else{big='💚';col='#b06a2c';title=b?'تحتاج أن تتحسّن يا بطل':'تحتاجين أن تتحسّني يا بطلة';
    msg=b?'لا تحزن! كل يوم فرصةٌ جديدة، والله يحبّ من يرجع إلى الصواب. تعلّم من هذه المواقف وجرّب مرة أخرى 🤍':'لا تحزني! كل يوم فرصةٌ جديدة، والله يحبّ من يرجع إلى الصواب. تعلّمي من هذه المواقف وجرّبي مرة أخرى 🤍'}
  const tips=Q.wrong.slice(0,3).map(q=>`• ${q.s[0]} ${q.opts.find(x=>x.ok).t}`).join('<br>');
  B.innerHTML=`<div class="nfres"><div class="big">${big}</div><h2 style="color:${col}">${title}</h2>
    <p style="margin:4px 0;font-size:17px">${b?'اخترتَ':'اخترتِ'} الصواب في <b>${ar(Q.good)} من ${ar(Q.qs.length)}</b> مواقف</p><p style="margin:4px 0 0;line-height:1.8">${msg}</p>
    ${tips?`<div class="tips"><b>${b?'تذكّر':'تذكّري'}:</b><br>${tips}</div>`:''}<div id="nfCups"></div>
    <div class="nav"><button class="btn gold" id="nfAgain">مواقف جديدة 🔁</button></div><div class="nav"><button class="btn sec" id="nfBayt">🏡 إلى بيتي في الجنة</button></div></div>`;
  if(f>=.8){fanfare();confetti()}
  const n=f>=1?3:f>=.8?2:f>=.6?1:0;if(window.cupsAward)cupsAward(n,'nafsak',$('#nfCups'));if(window.Deco){const jw=Deco.challenge(Math.max(3,Q.good*3),'nafsak');if(jw)$('#nfCups').insertAdjacentHTML('beforeend',jw)}
  $('#nfAgain').onclick=start;$('#nfBayt').onclick=()=>{$('#openBayt')&&$('#openBayt').click()}}
})();
