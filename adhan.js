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
const city=()=>CITIES.find(c=>c[0]==st.city)||CITIES[0];
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
    <div class="adcity">${CITIES.map(c=>`<button data-c="${c[0]}" class="${c[0]==st.city?'on':''}">${c[1]}</button>`).join('')}</div>
    <div class="nav"><button class="btn sec" id="adSnd">${st.snd?'🔊 صوت الأذان: يعمل':'🔇 صوت الأذان: مطفأ'}</button><button class="btn sec" id="adTest">▶️ جرّب الأذان</button></div>
    <div class="nav"><button class="btn gold" data-close>تمّ ✓</button></div>`,()=>{
    document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{st.city=b.dataset.c;sv();line();settings()});
    $('#adSnd').onclick=()=>{st.snd=st.snd?0:1;sv();if(!st.snd)stopSound();$('#adSnd').textContent=st.snd?'🔊 صوت الأذان: يعمل':'🔇 صوت الأذان: مطفأ'};
    $('#adTest').onclick=()=>{closeModal();fire(next()?next().p:'dhuhr',true)}})}
// الضغط على سطر الأذان يفتح الإعدادات بدل شاشة الصلاة
document.addEventListener('click',e=>{if(e.target&&e.target.id=='adNext'){e.stopPropagation();e.preventDefault();settings()}},true);
window.Adhan={times,next,settings,fire,off,get city(){return city()}};
})();
