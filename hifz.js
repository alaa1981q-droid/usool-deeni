/* أنا حافظ صغير — حفظ سورة الحمد وقصار السور بتلاوة الشيخ عبد الباسط عبد الصمد (مرتّل).
   نص الحمد والتوحيد من الكتاب نفسه، ونص بقية السور من مصحف تنزيل (tanzil.net، النص المبسّط، نسخة 1.0.2) بلا أي تغيير.
   ملفات الصوت في audio/ مأخوذة من everyayah.com (Abdul_Basit_Murattal_64kbps)، واسم الملف = رقم السورة + رقم الآية. */
(function(){
const SUR=[{"n":1,"name":"الحمد","v":["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ","الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ","الرَّحْمَٰنِ الرَّحِيمِ","مَالِكِ يَوْمِ الدِّينِ","إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ","اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ","صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"]},{"n":114,"name":"الناس","v":["قُلْ أَعُوذُ بِرَبِّ النَّاسِ","مَلِكِ النَّاسِ","إِلَٰهِ النَّاسِ","مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ","الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ","مِنَ الْجِنَّةِ وَالنَّاسِ"]},{"n":113,"name":"الفلق","v":["قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ","مِنْ شَرِّ مَا خَلَقَ","وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ","وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ","وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ"]},{"n":112,"name":"التوحيد","v":["قُلْ هُوَ اللَّهُ أَحَدٌ","اللَّهُ الصَّمَدُ","لَمْ يَلِدْ وَلَمْ يُولَدْ","وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ"]},{"n":111,"name":"المسد","v":["تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ","مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ","سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ","وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ","فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ"]},{"n":110,"name":"النصر","v":["إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ","وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا","فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا"]},{"n":109,"name":"الكافرون","v":["قُلْ يَا أَيُّهَا الْكَافِرُونَ","لَا أَعْبُدُ مَا تَعْبُدُونَ","وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ","وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ","وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ","لَكُمْ دِينُكُمْ وَلِيَ دِينِ"]},{"n":108,"name":"الكوثر","v":["إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ","فَصَلِّ لِرَبِّكَ وَانْحَرْ","إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ"]},{"n":107,"name":"الماعون","v":["أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ","فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ","وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ","فَوَيْلٌ لِلْمُصَلِّينَ","الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ","الَّذِينَ هُمْ يُرَاءُونَ","وَيَمْنَعُونَ الْمَاعُونَ"]},{"n":106,"name":"قريش","v":["لِإِيلَافِ قُرَيْشٍ","إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ","فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ","الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ"]},{"n":105,"name":"الفيل","v":["أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ","أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ","وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ","تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ","فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ"]},{"n":103,"name":"العصر","v":["وَالْعَصْرِ","إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ","إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ"]}];
const BASMALA=SUR[0].v[0], HKEY='usul5_hifz_v1';
let hs={done:{}};
try{const s=JSON.parse(localStorage.getItem(HKEY)||'null');if(s&&s.done)hs=s}catch(e){}
const hsave=()=>{try{localStorage.setItem(HKEY,JSON.stringify(hs))}catch(e){}};
const f3=n=>String(n).padStart(3,'0');
const file=(s,a)=>`audio/${f3(s)}${f3(a)}.mp3`;
const boy=()=>!window.Cups||Cups.sex!='g';

const css=document.createElement('style');
css.textContent=`
.hzcard{border-color:#2f6fd0;box-shadow:0 5px 0 #b9cff2}.hzcard:active{box-shadow:0 2px 0 #b9cff2}
.hzcard .cup{font-size:44px;width:62px;text-align:center;flex:none}
.hzhead{text-align:center;background:linear-gradient(180deg,#eaf2ff,#fff);border:3px solid #2f6fd0;border-radius:24px;padding:12px 14px;margin-bottom:12px}
.hzhead .em{font-size:52px;line-height:1.2}.hzhead h2{margin:2px 0;color:#1d4e9e;font-size:22px}.hzhead p{margin:2px 0;font-size:16px;line-height:1.7;color:var(--muted)}
.hzbar{height:12px;background:#dbe6f7;border-radius:10px;overflow:hidden;margin:8px 0 2px}.hzbar i{display:block;height:100%;background:var(--gold);border-radius:10px;transition:width .4s}
.hzlist{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.hzs{background:#fff;border:2px solid #d3e0f5;border-radius:18px;padding:12px 8px;text-align:center;color:inherit;box-shadow:0 4px 0 #d3e0f5;position:relative}
.hzs:active{transform:translateY(3px);box-shadow:0 1px 0 #d3e0f5}
.hzs b{display:block;font-size:19px;color:#1d4e9e}.hzs small{color:var(--muted);font-size:13px}
.hzs.done{border-color:var(--gold);box-shadow:0 4px 0 #e9d49a;background:#fffbef}.hzs .ok{position:absolute;top:-8px;left:-6px;font-size:24px}
.hzsrc{font-size:12px;color:var(--muted);text-align:center;margin-top:14px;line-height:1.7}.hzsrc a{color:var(--muted)}
.hztools{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.hztools button{flex:1;min-width:30%;border:2px solid #d3e0f5;background:#fff;border-radius:16px;padding:8px 4px;font-size:15px;font-weight:700;color:#1d4e9e}
.hztools button.on{background:#2f6fd0;border-color:#2f6fd0;color:#fff}
.hzbism{font-family:'Amiri Quran','Amiri',serif;font-size:23px;text-align:center;color:#0b3d27;margin:4px 0 6px}
.hzay{display:flex;align-items:center;gap:10px;width:100%;background:#f6fbf8;border:2px solid transparent;border-radius:16px;padding:8px 10px;margin:8px 0;text-align:center;color:#0b3d27;transition:background .2s,border-color .2s}
.hzay .t{flex:1;font-family:'Amiri Quran','Amiri',serif;font-size:25px;line-height:2.1;transition:filter .3s}
.hzay .pl{flex:none;width:36px;height:36px;border-radius:50%;background:#e3ecfa;display:grid;place-items:center;font-size:16px}
.hzay.play{background:#fff6d6;border-color:var(--gold)}.hzay.play .pl{background:var(--gold)}
.hid .hzay:not(.show) .t{filter:blur(9px)}
.hzhint{text-align:center;font-size:15px;color:#1d4e9e;background:#eaf2ff;border-radius:14px;padding:6px 10px;margin:4px 0}
.hzwho{text-align:center;font-size:13px;color:var(--muted);margin:2px 0 8px}
`;
document.head.appendChild(css);

const sec=document.createElement('section');sec.className='screen';sec.id='hifz';
sec.innerHTML=`<div class="bar"><button class="back" id="hzBack">›</button><div class="ttl" id="hzTitle">⭐ أنا حافظ صغير</div></div><div id="hzBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
const card=document.createElement('button');card.className='bookcard hzcard';card.id='openHifz';
card.innerHTML=`<span class="cup">⭐</span><span><b>أنا حافظ صغير</b><small id="hzLine">احفظ سورة الحمد وقصار السور بصوت الشيخ عبد الباسط</small></span><span class="go">‹</span>`;
$('#openBook').after(card);
function line(){const n=Object.keys(hs.done).length;$('#hzLine').textContent=n?`حفظتَ ${ar(n)} من ${ar(SUR.length)} سورة، واصل! 🌟`:'احفظ سورة الحمد وقصار السور بصوت الشيخ عبد الباسط'}
line();
card.onclick=()=>{list();show('hifz')};
let inSurah=false;
$('#hzBack').onclick=()=>{stop();if(inSurah){list()}else{renderHome&&renderHome();show('home')}};

/* ---------- player ---------- */
const audio=new Audio();audio.preload='auto';
const urls={};let run=0;
function getURL(f){if(urls[f])return Promise.resolve(urls[f]);
  return fetch(f).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>urls[f]=URL.createObjectURL(b)).catch(()=>f)}
function playOne(f,id){return new Promise(res=>{getURL(f).then(u=>{if(id!==run)return res(false);
  audio.onended=()=>res(id===run);audio.onerror=()=>res(id===run);audio.src=u;audio.currentTime=0;
  const p=audio.play();if(p&&p.catch)p.catch(()=>res(false))})})}
function stop(){run++;try{audio.pause()}catch(e){}document.querySelectorAll('.hzay.play').forEach(e=>e.classList.remove('play'))}
async function playSeq(items){stop();const id=run;
  for(const it of items){if(id!==run)return;
    document.querySelectorAll('.hzay.play').forEach(e=>e.classList.remove('play'));
    if(it.el){it.el.classList.add('play');it.el.scrollIntoView({block:'nearest',behavior:'smooth'})}
    const ok=await playOne(it.f,id);if(!ok||id!==run)break;
    await new Promise(r=>setTimeout(r,350))}
  if(id===run)document.querySelectorAll('.hzay.play').forEach(e=>e.classList.remove('play'))}

/* ---------- list ---------- */
function list(){inSurah=false;stop();$('#hzTitle').textContent='⭐ أنا حافظ صغير';
  const n=Object.keys(hs.done).length,B=$('#hzBody');
  B.innerHTML=`<div class="hzhead"><div class="em">📖✨</div><h2>${boy()?'أنا حافظٌ صغير':'أنا حافظةٌ صغيرة'}</h2>
   <p>${boy()?'اختر':'اختاري'} سورة، واستمع إلى الشيخ عبد الباسط وهو يقرؤها آيةً آية، ثم ${boy()?'ردّد':'ردّدي'} معه حتى ${boy()?'تحفظها':'تحفظيها'} 🌟</p>
   <div class="hzbar"><i style="width:${n/SUR.length*100}%"></i></div><p><b>${ar(n)} من ${ar(SUR.length)}</b> سورة محفوظة</p></div>
   <div class="hzlist">${SUR.map((s,i)=>`<button class="hzs ${hs.done[s.n]?'done':''}" data-i="${i}">${hs.done[s.n]?'<span class="ok">⭐</span>':''}<b>سورة ${s.name}</b><small>${ar(s.v.length)} آيات${hs.done[s.n]?' · حفظتُها':''}</small></button>`).join('')}</div>
   <p class="hzsrc">التلاوة: الشيخ عبد الباسط عبد الصمد (مرتّل)، من everyayah.com<br>نص السور: مصحف تنزيل <a href="https://tanzil.net" target="_blank" rel="noopener">tanzil.net</a>، وسورتا الحمد والتوحيد من الكتاب</p>`;
  B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{tone&&tone(880,.05,'sine',.08);surah(+b.dataset.i)});
  window.scrollTo(0,0)}

/* ---------- one surah ---------- */
let rep=1,hide=false;
function surah(i){inSurah=true;stop();hide=false;const s=SUR[i],B=$('#hzBody');
  $('#hzTitle').textContent='سورة '+s.name;
  const bism=s.n!==1;
  B.innerHTML=`<div class="hztools"><button id="hzAll">▶️ السورة كاملة</button><button id="hzRep">🔁 كرّر ×${ar(3)}</button><button id="hzHide">🙈 اختبر حفظي</button></div>
   <div class="hzhint" id="hzHint">👆 ${boy()?'اضغط':'اضغطي'} على أي آية لتسمعها</div>
   <div class="card" style="--sc:#2f6fd0;flex:none" id="hzWrap">
    ${bism?`<div class="hzbism">${BASMALA}</div>`:''}
    ${s.v.map((v,k)=>`<button class="hzay" data-k="${k}"><span class="t">${v} ﴿${ar(k+1)}﴾</span><span class="pl">🔊</span></button>`).join('')}
   </div>
   <p class="hzwho">بصوت الشيخ عبد الباسط عبد الصمد رحمه الله</p>
   <div class="nav"><button class="btn gold" id="hzDone">${hs.done[s.n]?'⭐ حفظتُها، أراجعها':(boy()?'حفظتُها! ⭐':'حفظتُها! ⭐')}</button></div>
   ${i+1<SUR.length?`<div class="nav"><button class="btn sec" id="hzNext">السورة التالية: ${SUR[i+1].name} ←</button></div>`:''}`;
  const els=[...B.querySelectorAll('.hzay')];
  const item=k=>({f:file(s.n,k+1),el:els[k]});
  const times=it=>Array(rep).fill(it);
  els.forEach((el,k)=>el.onclick=()=>{if(hide&&!el.classList.contains('show')){el.classList.add('show')}playSeq(times(item(k)))});
  $('#hzAll').onclick=()=>{let seq=[];if(bism)seq.push({f:file(1,1)});s.v.forEach((v,k)=>seq=seq.concat(times(item(k))));playSeq(seq)};
  const rb=$('#hzRep');rb.classList.toggle('on',rep>1);
  rb.onclick=()=>{rep=rep>1?1:3;rb.classList.toggle('on',rep>1);
    $('#hzHint').textContent=rep>1?'🔁 كل آية ستُقرأ ثلاث مرات، '+(boy()?'ردّدها':'ردّديها')+' مع الشيخ':'👆 '+(boy()?'اضغط':'اضغطي')+' على أي آية لتسمعها'};
  $('#hzHide').onclick=()=>{hide=!hide;stop();$('#hzWrap').classList.toggle('hid',hide);els.forEach(e=>e.classList.remove('show'));$('#hzHide').classList.toggle('on',hide);
    $('#hzHint').textContent=hide?'🙈 الآيات مخفيّة! '+(boy()?'اقرأ':'اقرئي')+' من حفظك، ثم '+(boy()?'اضغط':'اضغطي')+' على الآية لترى هل أصبت':'👆 '+(boy()?'اضغط':'اضغطي')+' على أي آية لتسمعها'};
  $('#hzDone').onclick=()=>{stop();
    if(hs.done[s.n]){list();return}
    modal(`<div style="font-size:46px">🌟</div><h3 style="margin:4px 0">${boy()?'هل حفظتَ':'هل حفظتِ'} سورة ${s.name}؟</h3><p>${boy()?'جرّب':'جرّبي'} «اختبر حفظي» أولًا، ${boy()?'واقرأها':'واقرئيها'} بلا نظر. هل ${boy()?'قرأتها':'قرأتِها'} كلّها صحيحة؟</p>
      <div class="nav"><button class="btn sec" data-close>ليس بعد</button><button class="btn gold" id="hzYes">نعم، حفظتُها!</button></div>`);
    $('#hzYes').onclick=()=>{hs.done[s.n]=1;hsave();line();
      closeModal();
      if(typeof fanfare==='function')fanfare();if(typeof confetti==='function')confetti();
      const n=Object.keys(hs.done).length;
      modal(`<div style="font-size:56px">🏅</div><h3 style="margin:4px 0">ما شاء الله! ${boy()?'حفظتَ':'حفظتِ'} سورة ${s.name}</h3><p>${n==SUR.length?(boy()?'حفظتَ كل السور! أنت حافظٌ صغير حقًّا 🌟':'حفظتِ كل السور! أنتِ حافظةٌ صغيرة حقًّا 🌟'):`هذه السورة رقم ${ar(n)} ${boy()?'تحفظها':'تحفظينها'}. ${boy()?'اقرأها':'اقرئيها'} في صلاتك 🤍`}</p><div id="hzCups"></div><div class="nav"><button class="btn gold" data-close>رائع!</button></div>`);
      if(window.cupsAward)cupsAward(2,'hifz',$('#hzCups'));
      surah(i)}};
  const nx=$('#hzNext');if(nx)nx.onclick=()=>surah(i+1);
  window.scrollTo(0,0)}
})();
