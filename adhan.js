/* 🕌 الأذان (v8.0): إذا كان التطبيق مفتوحًا عند دخول وقت الصلاة يُرفع الأذان، ويضيء مسجد الطفل، ويظهر شريطٌ «حان وقت الصلاة».
   - ثلاثة أوقات أذان: الفجر والظهر والمغرب. الحساب على طريقة الشيخ (الفجر ١٦°، المغرب بعد ذهاب الحمرة ٤° تحت الأفق)، بلا ذكر مذهب.
   - الأوقات تُحسب في الجهاز بلا إنترنت، حسب المدينة التي تختارها العائلة (الافتراضي بغداد).
   - الصوت: audio/adhan.mp3 إن وُجد (يضعه الشيخ)، وإلا نغمة هادئة. يمكن للأهل إطفاء الصوت.
   - لا يوقف اللعبة: شريط في أعلى الشاشة يختفي وحده. */
(function(){
const KEY='usul5_adhan_v1';
let st={city:'baghdad',snd:1,fired:{}};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)st=Object.assign(st,s)}catch(e){}
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const CITIES=[['baghdad','بغداد',33.315,44.366],['najaf','النجف الأشرف',31.996,44.315],['karbala','كربلاء المقدّسة',32.616,44.024],['kadhimiya','الكاظمية',33.380,44.338],
  ['samarra','سامراء',34.198,43.874],['basra','البصرة',30.508,47.783],['hilla','الحلّة',32.483,44.433],['diwaniya','الديوانية',31.990,44.925],['kut','الكوت',32.510,45.820],
  ['amara','العمارة',31.836,47.144],['nasiriya','الناصرية',31.044,46.257],['samawa','السماوة',31.318,45.280],['baquba','بعقوبة',33.750,44.640],['kirkuk','كركوك',35.468,44.392],
  ['mosul','الموصل',36.340,43.130],['tikrit','تكريت',34.600,43.680],['ramadi','الرمادي',33.420,43.300],['erbil','أربيل',36.190,44.010],['sulaymaniyah','السليمانية',35.560,45.430],['duhok','دهوك',36.867,42.950]];
// (v17.2) طلب الشيخ: مدن الدول الأخرى (للأذان والطقس) — [المعرّف، الاسم، العرض، الطول، علم الدولة]. مدن العراق بلا علم = 🇮🇶
const MORE={'🇸🇦':[['riyadh','الرياض',24.71,46.68],['makkah','مكّة المكرّمة',21.42,39.83],['madinah','المدينة المنوّرة',24.47,39.61],['jeddah','جدّة',21.49,39.19],['dammam','الدمّام',26.43,50.10],['qatif','القطيف',26.56,50.01],['ahsa','الأحساء',25.38,49.59]],
  '🇰🇼':[['kuwait','الكويت',29.37,47.98],['jahra','الجهراء',29.34,47.66]],'🇧🇭':[['manama','المنامة',26.23,50.59]],'🇶🇦':[['doha','الدوحة',25.29,51.53]],
  '🇦🇪':[['abudhabi','أبوظبي',24.45,54.38],['dubai','دبي',25.20,55.27],['sharjah','الشارقة',25.35,55.42]],'🇴🇲':[['muscat','مسقط',23.59,58.41],['salalah','صلالة',17.02,54.09]],
  '🇾🇪':[['sanaa','صنعاء',15.37,44.19],['aden','عدن',12.79,45.03],['saada','صعدة',16.94,43.76]],'🇯🇴':[['amman','عمّان',31.95,35.93],['irbid','إربد',32.56,35.85]],
  '🇸🇾':[['damascus','دمشق',33.51,36.29],['aleppo','حلب',36.20,37.13],['homs','حمص',34.73,36.71]],'🇱🇧':[['beirut','بيروت',33.89,35.50],['saida','صيدا',33.56,35.37],['tyre','صور',33.27,35.20],['baalbek','بعلبك',34.01,36.21]],
  '🇵🇸':[['quds','القدس',31.78,35.23],['gaza','غزّة',31.50,34.47],['khalil','الخليل',31.53,35.10]],'🇪🇬':[['cairo','القاهرة',30.04,31.24],['alex','الإسكندرية',31.20,29.92]],
  '🇸🇩':[['khartoum','الخرطوم',15.50,32.56]],'🇱🇾':[['tripoli','طرابلس',32.89,13.19],['benghazi','بنغازي',32.12,20.09]],'🇹🇳':[['tunis','تونس',36.81,10.18]],
  '🇩🇿':[['algiers','الجزائر',36.75,3.06],['oran','وهران',35.70,-0.63]],'🇲🇦':[['rabat','الرباط',34.02,-6.84],['casa','الدار البيضاء',33.57,-7.59]],'🇲🇷':[['nouakchott','نواكشوط',18.08,-15.98]],
  '🇸🇴':[['mogadishu','مقديشو',2.05,45.32]],'🇩🇯':[['djibouti','جيبوتي',11.59,43.15]],'🇰🇲':[['moroni','موروني',-11.70,43.26]],
  '🇮🇷':[['tehran','طهران',35.69,51.39],['mashhad','مشهد',36.30,59.61],['qom','قم',34.64,50.88],['isfahan','أصفهان',32.65,51.67],['ahvaz','الأهواز',31.32,48.67],['shiraz','شيراز',29.59,52.58],['tabriz','تبريز',38.08,46.29]],
  '🇹🇷':[['istanbul','إسطنبول',41.01,28.98],['ankara','أنقرة',39.93,32.86]],'🇵🇰':[['islamabad','إسلام آباد',33.68,73.05],['karachi','كراتشي',24.86,67.01],['lahore','لاهور',31.55,74.34]],
  '🇦🇫':[['kabul','كابل',34.56,69.21],['herat','هرات',34.35,62.20]],'🇦🇿':[['baku','باكو',40.41,49.87]],'🇮🇩':[['jakarta','جاكرتا',-6.21,106.85]],'🇲🇾':[['kl','كوالالمبور',3.14,101.69]],
  '🇧🇩':[['dhaka','دكا',23.81,90.41]],'🇧🇳':[['bsb','بندر سري بكاوان',4.90,114.94]],'🇲🇻':[['male','ماليه',4.18,73.51]],'🇰🇿':[['astana','أستانا',51.17,71.45],['almaty','ألماتي',43.24,76.89]],
  '🇺🇿':[['tashkent','طشقند',41.30,69.24]],'🇹🇲':[['ashgabat','عشق آباد',37.96,58.33]],'🇹🇯':[['dushanbe','دوشنبه',38.56,68.79]],'🇰🇬':[['bishkek','بشكيك',42.87,74.59]],
  '🇦🇱':[['tirana','تيرانا',41.33,19.82]],'🇧🇦':[['sarajevo','سراييفو',43.86,18.41]],'🇳🇬':[['abuja','أبوجا',9.08,7.40],['kano','كانو',12.00,8.52],['lagos','لاغوس',6.52,3.38]],
  '🇸🇳':[['dakar','داكار',14.72,-17.47]],'🇲🇱':[['bamako','باماكو',12.64,-8.00]],'🇳🇪':[['niamey','نيامي',13.51,2.11]],'🇹🇩':[['ndjamena','نجامينا',12.13,15.06]],
  '🇬🇳':[['conakry','كوناكري',9.64,-13.58]],'🇬🇲':[['banjul','بانجول',13.45,-16.58]],'🇧🇫':[['ouaga','واغادوغو',12.37,-1.52]],'🇸🇱':[['freetown','فريتاون',8.48,-13.23]],
  '🇨🇲':[['yaounde','ياوندي',3.85,11.50]],'🇺🇬':[['kampala','كمبالا',0.35,32.58]],'🇲🇿':[['maputo','مابوتو',-25.97,32.57]],'🇬🇦':[['libreville','ليبرفيل',0.42,9.47]],
  '🇧🇯':[['portonovo','بورتو نوفو',6.50,2.63]],'🇹🇬':[['lome','لومي',6.13,1.22]],'🇨🇮':[['abidjan','أبيدجان',5.36,-4.01]],'🇬🇼':[['bissau','بيساو',11.86,-15.60]],
  '🇸🇷':[['paramaribo','باراماريبو',5.85,-55.20]],'🇬🇾':[['georgetown','جورج تاون',6.80,-58.16]]};
CITIES.forEach(c=>c[4]='🇮🇶');Object.keys(MORE).forEach(f=>MORE[f].forEach(c=>{c[4]=f;CITIES.push(c)}));
const city=()=>CITIES.find(c=>c[0]==st.city)||CITIES[0];
const flagNow=()=>window.Flag?Flag.get():'🇮🇶';
const citiesOf=f=>{const L=CITIES.filter(c=>c[4]===(f||flagNow()));return L.length?L:CITIES.filter(c=>c[4]==='🇮🇶')};
function setCity(id){if(!CITIES.some(c=>c[0]===id))return;st.city=id;st.fired={};sv();try{line()}catch(e){}try{window.City3D&&City3D.refresh()}catch(e){}}
// إذا تغيّرت الدولة ومدينة الأذان ليست منها: أوّل مدينة (العاصمة) من الدولة الجديدة
function fitCountry(f){if(city()[4]!==f){const L=citiesOf(f);if(L[0]&&L[0][4]===f)setCity(L[0][0])}}
// (v17.2) شاشة اختيار المدينة (من «ملفّي»): مدن دولة الطفل فقط
function pickCity(done){const f=flagNow(),L=citiesOf(f),ov=document.createElement('div');ov.className='flgov';
  ov.innerHTML=`<div class="in"><h4>📍 مدينتك في ${window.Flag?Flag.name(f):'العراق'} ${f}</h4><p>للأذان وأوقات الصلاة وطقس المدينة 🕌🌦️</p><div class="g">${L.map((c,i)=>`<button data-i="${i}" class="${c[0]===st.city?'on':''}" style="--c:${['#dff5e3','#dcecff','#ffe1ec','#fff3c4','#ece3ff','#d9f5f1'][i%6]};--d:${['#9fd3aa','#9dbde6','#e6a9bf','#e3c56e','#b9a6e6','#94d1c8'][i%6]}"><b>🏙️</b>${c[1]}</button>`).join('')}</div><button class="x">✖ إغلاق</button></div>`;
  document.body.appendChild(ov);ov.onclick=e=>{const b=e.target.closest('button');if(e.target===ov||b&&b.classList.contains('x')){ov.remove();done&&done();return}if(!b)return;setCity(L[+b.dataset.i][0]);ov.remove();done&&done()}}
const NAMES={fajr:'الفجر',dhuhr:'الظهر',maghrib:'المغرب'};

/* ---------- حساب الأوقات (خوارزمية فلكية معروفة) ---------- */
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
function sun(jd){const D=jd-2451545,g=(357.529+.98560028*D)%360,q=(280.459+.98564736*D)%360,L=(q+1.915*Math.sin(rad(g))+.02*Math.sin(rad(2*g)))%360,e=23.439-.00000036*D;
  const RA=deg(Math.atan2(Math.cos(rad(e))*Math.sin(rad(L)),Math.cos(rad(L))))/15,dec=deg(Math.asin(Math.sin(rad(e))*Math.sin(rad(L))));
  let eqt=q/15-((RA%24)+24)%24;eqt=((eqt+12)%24+24)%24-12;return {dec,eqt}}
// أوقات اليوم بتوقيت UTC (ساعات)، ثم تُحوَّل إلى Date
function times(day){const [,,lat,lng]=city();const y=day.getFullYear(),m=day.getMonth()+1,d=day.getDate();
  const jd=367*y-Math.floor(7*(y+Math.floor((m+9)/12))/4)+Math.floor(275*m/9)+d+1721013.5;
  const s0=sun(jd+.5),noon=12-lng/15-s0.eqt;
  const T=(a,t)=>{const s=sun(jd+t/24);const v=(-Math.sin(rad(a))-Math.sin(rad(s.dec))*Math.sin(rad(lat)))/(Math.cos(rad(s.dec))*Math.cos(rad(lat)));return deg(Math.acos(Math.max(-1,Math.min(1,v))))/15};
  const fajr=noon-T(16,noon-6),magh=noon+T(4,noon+6);
  const at=h=>new Date(Date.UTC(y,m-1,d)+h*3600e3);
  return {fajr:at(fajr),dhuhr:at(noon+1/60),maghrib:at(magh)}}
const hm=t=>t.toLocaleTimeString('ar-IQ',{hour:'numeric',minute:'2-digit'});
function next(){const now=new Date();for(let k=0;k<2;k++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+k),t=times(d);
  for(const p of ['fajr','dhuhr','maghrib'])if(t[p]>now)return {p,t:t[p]}}return null}

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
.adb{position:fixed;top:max(8px,env(safe-area-inset-top));left:50%;transform:translate(-50%,-160%);z-index:30;width:min(94vw,430px);display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:20px;
 background:linear-gradient(160deg,#fff 0%,#e8f6ee 90%);border:2px solid #1fa463;box-shadow:0 5px 0 #8fd1a8,0 12px 26px rgba(10,60,40,.28);transition:transform .5s cubic-bezier(.2,1.4,.4,1)}
.adb.on{transform:translate(-50%,0)}
.adb .e{font-size:40px;line-height:1;animation:adbE 1.6s ease-in-out infinite}@keyframes adbE{50%{transform:scale(1.12)}}
.adb .t{flex:1;min-width:0}.adb b{display:block;font-size:18px;color:#0b5a32}.adb small{display:block;font-size:13.5px;font-weight:700;color:#3d5a4b}
.adb .bt{display:flex;flex-direction:column;gap:5px}.adb button{border:0;border-radius:12px;padding:6px 10px;font:inherit;font-weight:800;font-size:14px;color:#fff;background:#14794f;box-shadow:0 3px 0 #0b4a30}
.adb button.x{background:#e9efeb;color:#3d5a4b;box-shadow:0 3px 0 #c9d6ce}
body.adhan-on .bhouse svg .msq-tw{animation:adGlow .8s ease-in-out infinite}@keyframes adGlow{50%{opacity:.35}}
body.adhan-on .bhouse{box-shadow:0 0 0 4px rgba(255,214,90,.65),0 0 28px rgba(255,214,90,.7)}
.adnext{display:block;margin-top:2px;font-size:12px;font-weight:800;color:#0b5a32}
.adcity{display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:46vh;overflow:auto;margin:8px 0}
.adcity button{border:1.5px solid #bfe3cc;border-radius:12px;padding:7px 4px;background:linear-gradient(160deg,#fff,#e8f6ee);box-shadow:0 3px 0 #bfe3cc;font:inherit;font-weight:700;font-size:14.5px;color:#0b3d27}
.adcity button.on{border-color:#e0a21b;background:linear-gradient(160deg,#fff,#fff1c2);box-shadow:0 3px 0 #e9c14a}
.adtimes{display:flex;gap:6px;justify-content:center;margin:6px 0}.adtimes div{flex:1;border-radius:12px;padding:5px 2px;background:#f6fbf8;border:1.5px solid #e1eee6;font-size:13px;font-weight:700;color:#3d5a4b}.adtimes b{display:block;font-size:16px;color:#0b5a32}
`;
document.head.appendChild(css);
const bar=document.createElement('div');bar.className='adb';document.body.appendChild(bar);

/* ---------- الصوت ---------- */
let au=null;
function chime(){try{const C=window.AudioContext||window.webkitAudioContext,c=new C();[523,659,784,659,523].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;
  g.gain.setValueAtTime(0,c.currentTime+i*.55);g.gain.linearRampToValueAtTime(.18,c.currentTime+i*.55+.05);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.55+1.4);o.connect(g);g.connect(c.destination);o.start(c.currentTime+i*.55);o.stop(c.currentTime+i*.55+1.5)})}catch(e){}}
function sound(){if(!st.snd)return;stopSound();au=new Audio('audio/adhan.mp3');au.onerror=()=>{au=null;chime()};au.play().catch(()=>{if(au&&au.error)return;au=null;chime()})}
function stopSound(){if(au){try{au.pause()}catch(e){}au=null}}

/* ---------- الأذان ---------- */
let hideT=0;
function fire(p,test){const boy=!window.Cups||Cups.sex!='g';
  document.body.classList.add('adhan-on');sound();
  bar.innerHTML=`<span class="e">🕌</span><span class="t"><b>حان وقت صلاة ${NAMES[p]}</b><small>الله أكبر 🤍 ${boy?'هيّا إلى الصلاة يا بطل':'هيّا إلى الصلاة يا بطلة'}</small></span>
    <span class="bt"><button id="adPray">🤲 ${boy?'صلّيتُ':'صلّيتُ'}</button><button class="x" id="adX">${au||!st.snd?'🔇 إيقاف':'حسنًا'}</button></span>`;
  bar.classList.add('on');
  $('#adPray').onclick=()=>{off();window.Salah&&Salah.openPray()};
  $('#adX').onclick=off;
  clearTimeout(hideT);hideT=setTimeout(off,test?20000:4*60000)}
function off(){stopSound();bar.classList.remove('on');document.body.classList.remove('adhan-on');clearTimeout(hideT)}
// يُرفع الأذان إذا دخل الوقت قبل أقل من ١٠ دقائق، مرة واحدة لكل صلاة في اليوم
function check(){const now=new Date(),t=times(now),day=now.toDateString();if(st.fired.day!==day)st.fired={day};
  for(const p of ['fajr','dhuhr','maghrib']){const dt=now-t[p];if(dt>=0&&dt<10*60000&&!st.fired[p]){st.fired[p]=1;sv();fire(p);break}}
  line()}
setInterval(check,20000);setTimeout(check,2500);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});

/* ---------- الأذان القادم تحت «وضوئي وصلاتي» + اختيار المدينة ---------- */
function line(){const c=$('#openSalah');if(!c)return;const n=next();if(!n)return;let el=$('#adNext');
  if(!el){el=document.createElement('span');el.className='adnext';el.id='adNext';const sp=c.querySelector('span:nth-child(2)');(sp||c).appendChild(el)}
  el.textContent=`🕌 أذان ${NAMES[n.p]} ${hm(n.t)} · ${city()[1]}`}
function settings(){const t=times(new Date());
  modal(`<div style="font-size:46px">🕌</div><h3 style="margin:2px 0">أوقات الأذان</h3>
    <div class="adtimes">${['fajr','dhuhr','maghrib'].map(p=>`<div><b>${hm(t[p])}</b>${NAMES[p]}</div>`).join('')}</div>
    <p style="font-size:14px;color:var(--muted);margin:4px 0">اختر مدينتك حتى تكون الأوقات صحيحة. إذا كان التطبيق مفتوحًا وقت الأذان يضيء مسجدك ويُرفع الأذان 🤍</p>
    <p style="font-size:13px;margin:2px 0">🌍 ${window.Flag?Flag.get()+' '+Flag.name():''} · تُغيَّر الدولة من «🏅 ملفّي»</p><div class="adcity">${citiesOf().map(c=>`<button data-c="${c[0]}" class="${c[0]==st.city?'on':''}">${c[1]}</button>`).join('')}</div>
    <div class="nav"><button class="btn sec" id="adSnd">${st.snd?'🔊 صوت الأذان: يعمل':'🔇 صوت الأذان: مطفأ'}</button><button class="btn sec" id="adTest">▶️ جرّب الأذان</button></div>
    <div class="nav"><button class="btn gold" data-close>تمّ ✓</button></div>`,()=>{
    document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{st.city=b.dataset.c;sv();line();settings()});
    $('#adSnd').onclick=()=>{st.snd=st.snd?0:1;sv();if(!st.snd)stopSound();$('#adSnd').textContent=st.snd?'🔊 صوت الأذان: يعمل':'🔇 صوت الأذان: مطفأ'};
    $('#adTest').onclick=()=>{closeModal();fire(next()?next().p:'dhuhr',true)}})}
// الضغط على سطر الأذان يفتح الإعدادات بدل شاشة الصلاة
document.addEventListener('click',e=>{if(e.target&&e.target.id=='adNext'){e.stopPropagation();e.preventDefault();settings()}},true);
window.Adhan={times,next,settings,fire,off,setCity,pickCity,fitCountry,citiesOf,get city(){return city()}};
})();
