/* 🏙️ مدينتي (v9.6): مدينة حول بيت الطفل في الجنة.
   - ٥ بنايات، لكلٍّ ٣ مستويات: 🕌 الجامع، 📚 المكتبة، 🏫 مدرسة القرآن، 💧 سبيل الماء، 🌳 الحديقة العامة.
   - كل مستوى يُفتح بعمل حقيقي في التطبيق (صلاة مسجّلة، مراحل الكتاب، سور محفوظة، صلوات وتسبيح بالصوت)،
     ثم يُبنى مثل ورشة البيت: بعمل صالح بالصوت أو بالجواهر 💎 (سريع)، أو مجانًا بالانتظار. ورشة واحدة للمدينة.
   - المدينة تكبر: قرية ← بلدة ← مدينة الخير، وبالليل تضيء مصابيحها ونوافذها.
   - «حيّ الأصدقاء»: بيوت أصدقاء الطفل (حتى ٦) تظهر في المدينة، ولمسها يزور البيت.
   - الحالة محلية (usul5_madina_v1)، والرمز m (٥ أرقام) يُنشر مع البيت في houses/$uid فيرى الأصدقاء المدينة (بلا تغيير في القواعد). */
(function(){
const KEY='usul5_madina_v1',MIN=60e3,ORDER=['m','k','q','s','h'];
let st={lv:{m:0,k:0,q:0,s:0,h:0},job:null};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.lv)st=Object.assign(st,s)}catch(e){}
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const esc=v=>String(v==null?'':v).replace(/[<>&"]/g,'');
const SAL={k:'sal',p:'اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',e:'💚',n:'صلِّ على محمد وآل محمد'},TAS={k:'tas',p:'سُبْحَانَ اللهِ',e:'📿',n:'سبّح الله'};
const C=()=>{try{return Alqab.snap().c}catch(e){return {}}};
// شرط فتح كل مستوى: [المفتاح في عدّادات الملف، العدد، كيف]
const PARTS={
  m:{n:'جامع المدينة',e:'🕌',k:'pray',at:[1,10,30],how:n=>`سجّل ${ar(n)} ${n==1?'صلاة':'صلوات'} في «🕌 وضوئي وصلاتي» ← سجلّ صلاتي`,
     lv:[['مصلّى صغير',60,SAL,10,5],['جامع بقبّة ومنارة',150,TAS,10,30],['جامع كبير بقبّة ذهبية ومنارتين',350,SAL,30,120]]},
  k:{n:'مكتبة المدينة',e:'📚',k:'stages',at:[1,3,6],how:n=>`أكمل ${ar(n)} ${n==1?'مرحلة':'مراحل'} من دروس الكتاب`,
     lv:[['ركن كتب صغير',60,TAS,10,5],['مكتبة بأعمدة',150,SAL,10,30],['مكتبة كبيرة بقبّة زجاجية',350,TAS,30,120]]},
  q:{n:'مدرسة القرآن',e:'🏫',k:'hifz',at:[1,3,6],how:n=>`احفظ ${ar(n)} ${n==1?'سورة':'سور'} في «⭐ أنا حافظ صغير»`,
     lv:[['حلقة قرآن صغيرة',60,SAL,10,5],['مدرسة قرآن',150,TAS,10,30],['مدرسة قرآن كبيرة بحديقة',350,SAL,30,120]]},
  s:{n:'سبيل الماء',e:'💧',k:'sal',at:[10,100,300],how:n=>`صلِّ على محمد وآل محمد ${ar(n)} مرة بصوتك (من ملفّي أو من ورشة البيت)`,
     lv:[['جرّة ماء للعطشى',60,TAS,10,5],['سبيل من الحجر',150,SAL,10,30],['سبيل مزخرف بالقاشاني',350,TAS,30,120]]},
  h:{n:'الحديقة العامة',e:'🌳',k:'tas',at:[10,100,300],how:n=>`سبّح الله ${ar(n)} مرة بصوتك (من ملفّي أو من ورشة البيت)`,
     lv:[['عشب وشجرتان',60,SAL,10,5],['أشجار وورود ومقاعد',150,TAS,10,30],['حديقة بنافورة وأرجوحة',350,SAL,30,120]]}};
const STAGES_C=[['قرية صغيرة','🏡',0],['قرية','🏘️',3],['بلدة','🏙️',7],['مدينة الخير','🌟',11]];
const total=lv=>ORDER.reduce((s,k)=>s+(lv[k]|0),0);
const stageOf=lv=>{const t=total(lv);let r=STAGES_C[0];STAGES_C.forEach(x=>{if(t>=x[2])r=x});return r};
const code=()=>ORDER.map(k=>st.lv[k]|0).join('');
const fromCode=c=>{const lv={};ORDER.forEach((k,i)=>lv[k]=Math.max(0,Math.min(3,+String(c||'')[i]||0)));return lv};
const mmss=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${ar(h)}:${ar(String(m).padStart(2,'0'))}:${ar(String(x).padStart(2,'0'))}`:`${ar(m)}:${ar(String(x).padStart(2,'0'))}`};
const tm=m=>m>=60?(m==60?'ساعة':m==120?'ساعتان':`${ar(m/60)} ساعات`):m==1?'دقيقة':m==2?'دقيقتان':m<=10?`${ar(m)} دقائق`:`${ar(m)} دقيقة`;
// هل المستوى التالي مفتوح؟ يرجع '' أو نص ما يجب فعله
function needFor(p,L){const P=PARTS[p];if(L>=3)return '';const have=C()[P.k]|0,n=P.at[L];return have>=n?'':P.how(n)+` (عندك ${ar(have)})`}

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
.mdhead{background:linear-gradient(160deg,#fff,#eef7ff 90%);border:1.5px solid #bcd5f3;border-radius:20px;padding:10px 12px;box-shadow:0 4px 0 #bcd5f3;margin-bottom:10px;text-align:center}
.mdhead b{display:block;font-size:20px;color:#1d4e9e}.mdhead small{font-size:13.5px;font-weight:700;color:#4a5d72}
.mdhead .pb{height:12px;border-radius:8px;background:#e3ecf7;overflow:hidden;margin:6px 0 2px}.mdhead .pb i{display:block;height:100%;background:linear-gradient(90deg,#f6b33d,#1fa463);border-radius:8px}
.mdmap{border-radius:22px;overflow:hidden;border:3px solid #cfe2d6;box-shadow:0 5px 0 #cfe2d6;background:#bfe7a4}
.mdmap svg{display:block;width:100%;height:auto}
.mdmap [data-md]{cursor:pointer}
.mdmap .md-bob{animation:mdbob .5s ease-in-out infinite alternate}@keyframes mdbob{to{transform:translateY(-2px)}}
.mdmap .md-mk{animation:mdmk 1.3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes mdmk{50%{transform:translateY(-3px) scale(1.12)}}
.mdmap .md-cl{animation:mdcl 40s linear infinite}@keyframes mdcl{from{transform:translateX(-80px)}to{transform:translateX(420px)}}
.mdmap .md-wt{animation:mdwt 1.2s ease-in-out infinite}@keyframes mdwt{50%{opacity:.35}}
.mdmap .md-pop{animation:mdpop 1.1s cubic-bezier(.2,1.6,.4,1) both;transform-box:fill-box;transform-origin:50% 100%}@keyframes mdpop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
.mdmap .md-night{display:none}body.night .mdmap .md-night{display:inline}body.night .mdmap .md-day{display:none}
body.night .mdmap .md-win{fill:#ffd45a}body.night .mdmap .md-glow{opacity:.85}.mdmap .md-glow{opacity:0}
body.night .mdmap{background:#24402f;border-color:#3a5a7a;box-shadow:0 5px 0 #1d2f4a}
.mdhint{display:flex;align-items:center;gap:8px;margin-top:10px;padding:7px 12px;border-radius:16px;background:linear-gradient(160deg,#fff,#fff5dc 90%);border:1.5px solid #efd99a;box-shadow:0 3px 0 #efd99a;font-weight:800;font-size:14px;color:#7a5200}
.mdhint .e{font-size:24px}.mdhint.job{background:linear-gradient(160deg,#fff,#e7f1fd 90%);border-color:#bcd5f3;box-shadow:0 3px 0 #bcd5f3;color:#1d4e9e;cursor:pointer}
.mdbtn{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;border:0;border-radius:20px;padding:12px 14px;font:inherit;color:#fff;text-align:right;
  background:linear-gradient(135deg,#2f6fd0,#13958c);box-shadow:0 5px 0 #1d4e7e}
.mdbtn .e{font-size:34px}.mdbtn b{display:block;font-size:19px}.mdbtn small{font-size:13px;font-weight:700;opacity:.92}.mdbtn .go{margin-inline-start:auto;font-size:26px}
.mdbtn:active{transform:translateY(3px);box-shadow:0 2px 0 #1d4e7e}
`;
document.head.appendChild(css);

const sec=document.createElement('section');sec.className='screen';sec.id='madina';
sec.innerHTML=`<div class="bar"><button class="back" id="mdBack">›</button><div class="ttl" id="mdTitle">🏙️ مدينتي</div></div><div id="mdBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
let backFn=null;
$('#mdBack').onclick=()=>{stopVc();if(backFn){const f=backFn;backFn=null;f()}else{show('bayt');window.Bayt&&Bayt.menu()}};

/* ---------- رسم المدينة (SVG) ---------- */
const W=360;
const win=(x,y,w=8,h=10)=>`<rect class="md-win" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#bfe3f7" stroke="#7a8f9a" stroke-width=".8"/>`;
const glow=(x,y,r=16)=>`<circle class="md-glow" cx="${x}" cy="${y}" r="${r}" fill="url(#mdGl)"/>`;
const label=(x,y,t)=>`<g><rect x="${x-34}" y="${y-9}" width="68" height="15" rx="7" fill="rgba(255,255,255,.9)" stroke="#d8c58a"/><text x="${x}" y="${y+2}" font-size="9" font-weight="800" text-anchor="middle" fill="#5a4a1a">${t}</text></g>`;
const lamp=(x,y)=>`<g><rect x="${x-1}" y="${y-22}" width="2" height="22" fill="#5b5b66"/><circle cx="${x}" cy="${y-24}" r="3.2" class="md-win" fill="#f1efe6" stroke="#5b5b66" stroke-width=".8"/>${glow(x,y-24,13)}</g>`;
// أرض فارغة: سياج صغير ولافتة
function plotEmpty(cx,by,w,locked){return `<rect x="${cx-w/2}" y="${by-34}" width="${w}" height="34" rx="6" fill="#c9a774" opacity=".75"/>
  ${[0,1,2,3,4,5].map(i=>`<rect x="${cx-w/2+4+i*(w-8)/5}" y="${by-40}" width="3" height="10" fill="#9a7444"/>`).join('')}
  <rect x="${cx-w/2+4}" y="${by-37}" width="${w-8}" height="2.5" fill="#9a7444"/>
  <g class="md-mk"><circle cx="${cx}" cy="${by-60}" r="15" fill="${locked?'#e8eef0':'#ffd23f'}" stroke="${locked?'#9aa8b0':'#c98a12'}" stroke-width="2.5"/>
  <text x="${cx}" y="${by-(locked?54:53)}" font-size="${locked?15:22}" font-weight="900" text-anchor="middle" fill="#7a4a00">${locked?'🔒':'+'}</text></g>`}
function scaffold(cx,by,w,h,left,frac){return `<g>
  <rect x="${cx-w/2}" y="${by-h}" width="${w}" height="${h}" fill="#e9dcc3" opacity=".9"/>
  ${[0,1,2,3].map(i=>`<rect x="${cx-w/2+i*w/3-1}" y="${by-h-6}" width="3" height="${h+6}" fill="#b07a3a"/>`).join('')}
  ${[1,2].map(i=>`<rect x="${cx-w/2-2}" y="${by-i*h/3}" width="${w+4}" height="3" fill="#b07a3a"/>`).join('')}
  <text x="${cx-w/4}" y="${by-4}" font-size="16" class="md-bob">👷</text><text x="${cx+w/5}" y="${by-h/2}" font-size="15" class="md-bob" style="animation-delay:.2s">👷‍♀️</text>
  <text x="${cx+w/2-6}" y="${by-h-8}" font-size="16">🏗️</text>
  <rect x="${cx-34}" y="${by+4}" width="68" height="15" rx="7" fill="#1d4e9e"/><text x="${cx}" y="${by+15}" font-size="10" font-weight="800" text-anchor="middle" fill="#fff" data-mdtimer>${left}</text>
  <rect x="${cx-30}" y="${by+21}" width="60" height="4" rx="2" fill="#cfe0f5"/><rect x="${cx-30}" y="${by+21}" width="${(60*frac).toFixed(1)}" height="4" rx="2" fill="#4fb3f0" data-mdbar="60"/></g>`}
function readyMark(cx,by){return `<g class="md-mk"><circle cx="${cx}" cy="${by-70}" r="16" fill="#1fa463" stroke="#fff" stroke-width="3"/><text x="${cx}" y="${by-64}" font-size="17" font-weight="900" text-anchor="middle" fill="#fff">✔</text></g>
  <text x="${cx-30}" y="${by-60}" font-size="14" class="md-wt">✨</text><text x="${cx+24}" y="${by-50}" font-size="12" class="md-wt" style="animation-delay:.4s">✨</text>`}

// البنايات حسب المستوى (cx = المنتصف، by = خط الأرض)
const DRAW={
  m(cx,by,L){if(L==1)return `<rect x="${cx-26}" y="${by-30}" width="52" height="30" fill="#f4ead2" stroke="#c9b48a"/><path d="M${cx-14} ${by-30} A14 14 0 0 1 ${cx+14} ${by-30}Z" fill="#2fa36b"/>
      <rect x="${cx-6}" y="${by-16}" width="12" height="16" rx="6" fill="#8a5a2b"/>${win(cx-20,by-22)}${win(cx+12,by-22)}<text x="${cx}" y="${by-46}" font-size="10" text-anchor="middle">☪️</text>`;
    const gold=L==3,dome=gold?'#e7b416':'#2fa36b',w=gold?100:76;
    const minar=x=>`<rect x="${x-4}" y="${by-(gold?92:76)}" width="8" height="${gold?92:76}" fill="#f4ead2" stroke="#c9b48a"/><rect x="${x-6}" y="${by-(gold?70:58)}" width="12" height="4" fill="#c9b48a"/><path d="M${x-5} ${by-(gold?92:76)} L${x} ${by-(gold?104:88)} L${x+5} ${by-(gold?92:76)}Z" fill="${dome}"/>${win(x-2,by-(gold?60:48),4,7)}`;
    return `${gold?`<rect x="${cx-w/2-8}" y="${by-6}" width="${w+16}" height="6" fill="#e6dcc4"/>`:''}${minar(cx+w/2-2)}${gold?minar(cx-w/2+2):''}
      <rect x="${cx-w/2+8}" y="${by-44}" width="${w-16}" height="44" fill="#fbf3df" stroke="#c9b48a"/>
      <path d="M${cx-24} ${by-44} A24 26 0 0 1 ${cx+24} ${by-44}Z" fill="${dome}"/>${gold?`<path d="M${cx-24} ${by-44} A24 26 0 0 1 ${cx+24} ${by-44}" fill="none" stroke="#fff3b0" stroke-width="2"/>`:''}
      <rect x="${cx-1}" y="${by-80}" width="2" height="12" fill="${dome}"/><text x="${cx}" y="${by-80}" font-size="10" text-anchor="middle">☪️</text>
      <path d="M${cx-9} ${by} V${by-18} A9 9 0 0 1 ${cx+9} ${by-18} V${by}Z" fill="#8a5a2b"/>
      ${[-1,1].map(s=>win(cx+s*(w/2-22)-4,by-30,9,14)).join('')}${gold?[-1,1].map(s=>win(cx+s*(w/2-36)-4,by-30,9,14)).join(''):''}${glow(cx,by-30,40)}`},
  k(cx,by,L){if(L==1)return `<rect x="${cx-24}" y="${by-28}" width="48" height="28" fill="#f7e9d4" stroke="#b98d5a"/><path d="M${cx-30} ${by-28} L${cx} ${by-44} L${cx+30} ${by-28}Z" fill="#c0563b"/>
      <rect x="${cx-16}" y="${by-22}" width="32" height="18" fill="#fff" stroke="#b98d5a"/><text x="${cx}" y="${by-8}" font-size="13" text-anchor="middle">📚</text>`;
    const big=L==3,w=big?96:80,h=big?54:46;
    return `<rect x="${cx-w/2}" y="${by-h}" width="${w}" height="${h}" fill="#f3efe6" stroke="#b9b09a"/>
      <path d="M${cx-w/2-6} ${by-h} L${cx} ${by-h-18} L${cx+w/2+6} ${by-h}Z" fill="#d9cfb8" stroke="#b9b09a"/>
      ${big?`<path d="M${cx-18} ${by-h-12} A18 20 0 0 1 ${cx+18} ${by-h-12}Z" fill="#9fd3f0" stroke="#5b9fc8" stroke-width="1.5"/><path d="M${cx} ${by-h-32} V${by-h-12} M${cx-12} ${by-h-26} L${cx} ${by-h-12} M${cx+12} ${by-h-26} L${cx} ${by-h-12}" stroke="#5b9fc8" stroke-width="1"/>`:''}
      ${[0,1,2,3,4].map(i=>`<rect x="${cx-w/2+6+i*(w-12)/4-3}" y="${by-h+6}" width="6" height="${h-6}" fill="#fff" stroke="#c9c0aa"/>`).join('')}
      ${[0,1,2,3].map(i=>win(cx-w/2+12+i*(w-12)/4,by-h+12,8,14)).join('')}
      <rect x="${cx-8}" y="${by-18}" width="16" height="18" fill="#7a5230"/><text x="${cx}" y="${by-h-(big?36:4)}" font-size="12" text-anchor="middle">📚</text>${glow(cx,by-24,38)}`},
  q(cx,by,L){if(L==1)return `<path d="M${cx-30} ${by} L${cx} ${by-36} L${cx+30} ${by}Z" fill="#f0d98a" stroke="#c9a640"/><path d="M${cx-8} ${by} L${cx} ${by-14} L${cx+8} ${by}Z" fill="#8a5a2b"/>
      <text x="${cx-20}" y="${by+2}" font-size="11">🧒</text><text x="${cx+12}" y="${by+2}" font-size="11">👧</text><text x="${cx}" y="${by-38}" font-size="12" text-anchor="middle">📖</text>`;
    const big=L==3,w=big?100:80,h=big?50:42;
    return `${big?`<text x="${cx-w/2-4}" y="${by}" font-size="16">🌴</text><text x="${cx+w/2-12}" y="${by}" font-size="16">🌴</text>`:''}
      <rect x="${cx-w/2+6}" y="${by-h}" width="${w-12}" height="${h}" fill="#e9f5ec" stroke="#8fc4a2"/>
      <rect x="${cx-w/2+2}" y="${by-h-6}" width="${w-4}" height="7" fill="#2fa36b"/>
      <path d="M${cx-14} ${by} V${by-24} A14 14 0 0 1 ${cx+14} ${by-24} V${by}Z" fill="#2fa36b"/><path d="M${cx-9} ${by} V${by-22} A9 9 0 0 1 ${cx+9} ${by-22} V${by}Z" fill="#8a5a2b"/>
      ${[-1,1].map(s=>win(cx+s*(w/2-20)-5,by-h+10,10,12)).join('')}${big?[-1,1].map(s=>win(cx+s*(w/2-20)-5,by-h+26,10,12)).join(''):''}
      <rect x="${cx-26}" y="${by-h-20}" width="52" height="13" rx="4" fill="#fff" stroke="#2fa36b"/><text x="${cx}" y="${by-h-10}" font-size="8.5" font-weight="800" text-anchor="middle" fill="#14794f">مدرسة القرآن</text>${glow(cx,by-24,36)}`},
  s(cx,by,L){if(L==1)return `<ellipse cx="${cx}" cy="${by-2}" rx="18" ry="4" fill="#a98a5e"/><text x="${cx}" y="${by-4}" font-size="26" text-anchor="middle">🏺</text><text x="${cx+20}" y="${by-2}" font-size="10">🥛</text>`;
    const deco=L==3;
    return `<rect x="${cx-34}" y="${by-44}" width="68" height="44" fill="${deco?'#eaf4fb':'#e2d6c0'}" stroke="${deco?'#2f7fc0':'#a98a5e'}"/>
      ${deco?[0,1,2,3,4,5].map(i=>`<rect x="${cx-34+i*11.3}" y="${by-44}" width="11.3" height="7" fill="${i%2?'#2f7fc0':'#5fb0e6'}"/>`).join(''):''}
      <path d="M${cx-18} ${by-6} V${by-26} A18 16 0 0 1 ${cx+18} ${by-26} V${by-6}Z" fill="${deco?'#1d5f9a':'#8f7650'}"/>
      <rect x="${cx-2}" y="${by-24}" width="4" height="6" fill="#c0c7cc"/><rect x="${cx-1}" y="${by-18}" width="2" height="9" fill="#6ec3f5" class="md-wt"/>
      <rect x="${cx-22}" y="${by-6}" width="44" height="6" fill="${deco?'#5fb0e6':'#a98a5e'}"/><text x="${cx+22}" y="${by-8}" font-size="10">🥛</text>
      ${glow(cx,by-20,30)}`},
  h(cx,by,L){const t=(x,y,s,e='🌳')=>`<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle">${e}</text>`;
    let s=`<ellipse cx="${cx}" cy="${by-6}" rx="${L==1?40:48}" ry="12" fill="#7fcf6a"/>`+t(cx-24,by-2,24)+t(cx+24,by-2,24);
    if(L>=2)s+=t(cx,by-14,22)+`<rect x="${cx-12}" y="${by-6}" width="24" height="4" rx="1" fill="#8a5a2b"/><rect x="${cx-10}" y="${by-2}" width="2" height="4" fill="#8a5a2b"/><rect x="${cx+8}" y="${by-2}" width="2" height="4" fill="#8a5a2b"/>`+t(cx-40,by+2,11,'🌷')+t(cx+40,by+2,11,'🌸')+t(cx-6,by+4,10,'🌼');
    if(L>=3)s+=`<ellipse cx="${cx}" cy="${by+6}" rx="13" ry="4" fill="#5fb0e6" stroke="#fff"/><rect x="${cx-1.5}" y="${by-4}" width="3" height="10" fill="#9fd3f0" class="md-wt"/>`+t(cx+34,by-26,11,'🐦')+t(cx-30,by-30,10,'🦋')
      +`<path d="M${cx+30} ${by} V${by-24} H${cx+46} V${by}" fill="none" stroke="#c0563b" stroke-width="2"/><rect x="${cx+34}" y="${by-8}" width="8" height="2.5" fill="#8a5a2b"/>`;
    return s}};

// بيت مصغّر (لبيت الطفل والأصدقاء): الطوابق حسب f
function miniHouse(cx,by,f,col,big){f=Math.max(1,Math.min(5,f|0||1));const w=big?78:34,fh=big?19:10,h=f*fh;
  let s=`<rect x="${cx-w/2}" y="${by-h}" width="${w}" height="${h}" fill="${col||'#fbf3df'}" stroke="#b9a57a"/>`;
  for(let i=0;i<f;i++){const y=by-(i+1)*fh+3;s+=big?win(cx-w/2+8,y,9,fh-6)+win(cx+w/2-17,y,9,fh-6):win(cx-w/2+5,y,6,fh-5)+win(cx+w/2-11,y,6,fh-5)}
  s+=`<path d="M${cx-w/2-5} ${by-h} L${cx} ${by-h-(big?22:14)} L${cx+w/2+5} ${by-h}Z" fill="${big?'#1f8a55':'#c0563b'}"/>`;
  s+=`<rect x="${cx-(big?7:4)}" y="${by-(big?14:9)}" width="${big?14:8}" height="${big?14:9}" fill="#8a5a2b"/>`;
  return s}
const WALLC={cream:'#fbf3df',white:'#ffffff',pink:'#ffe1ea',blue:'#dff0ff',green:'#e2f6e6',gold:'#fff0c2',purple:'#efe4ff'};

/* opts: {lv, view:boolean, home:{f}, friends:[{id,nick,f,w}]|null|'off'} */
function citySVG(o){const lv=o.lv,stg=stageOf(lv),t=total(lv),job=o.view?null:st.job,now=Date.now();
  const H=o.view?620:770;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs><linearGradient id="mdSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd4ff"/><stop offset="1" stop-color="#e3f6ff"/></linearGradient>
  <linearGradient id="mdSkN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1640"/><stop offset="1" stop-color="#2a3f78"/></linearGradient>
  <radialGradient id="mdGl"><stop offset="0" stop-color="#ffe27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs>
  <rect class="md-day" width="${W}" height="120" fill="url(#mdSk)"/><rect class="md-night" width="${W}" height="120" fill="url(#mdSkN)"/>
  <g class="md-day"><circle cx="318" cy="34" r="17" fill="#ffd84a"/><g class="md-cl"><text x="0" y="40" font-size="24">☁️</text></g><g class="md-cl" style="animation-delay:-18s"><text x="0" y="70" font-size="18">☁️</text></g></g>
  <g class="md-night"><text x="312" y="44" font-size="24">🌙</text>${[[40,20],[90,50],[150,26],[210,60],[260,18],[30,80],[190,90]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" class="md-wt" style="animation-delay:${i*.3}s"/>`).join('')}</g>
  <path d="M0 120 Q60 98 120 112 T240 108 T360 116 V130 H0Z" fill="#9bd27f"/>
  <rect y="124" width="${W}" height="${H-124}" fill="#bfe7a4"/>`;
  // لافتة المدينة
  s+=`<g><rect x="96" y="8" width="168" height="26" rx="13" fill="rgba(255,255,255,.92)" stroke="#e7b416" stroke-width="2"/><text x="180" y="26" font-size="13" font-weight="900" text-anchor="middle" fill="#7a5200">${stg[1]} ${stg[0]}</text></g>`;
  // الطرق
  const road=(x,y,w,h,v)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#8e949c"/><line x1="${v?x+w/2:x}" y1="${v?y:y+h/2}" x2="${v?x+w/2:x+w}" y2="${v?y+h:y+h/2}" stroke="#fff" stroke-width="2" stroke-dasharray="8 7"/>`;
  s+=road(167,124,26,H-124,1)+road(0,300,W,24)+(o.view?'':road(0,598,W,22));
  // مصابيح الشارع تزيد مع تطوّر المدينة
  const nl=t>=11?8:t>=7?6:t>=3?4:2,LP=[[150,300],[210,300],[150,598],[210,598],[60,300],[300,300],[60,598],[300,598]].filter(p=>!o.view||p[1]<560);
  LP.slice(0,nl).forEach(([x,y])=>s+=lamp(x,y));
  // القطع: [مفتاح، المنتصف، خط الأرض، العرض]
  const PL={m:[85,290,140],home:[275,290,140],k:[85,445,140],q:[275,445,140],h:[85,580,140],s:[275,580,140]};
  if(o.view){PL.h=[85,590,140];PL.s=[275,590,140]}
  // بيت الطفل
  {const [cx,by]=PL.home;s+=`<g ${o.view?'':'data-md="home"'}><rect x="${cx-70}" y="${by-120}" width="140" height="124" fill="transparent"/><text x="${cx-56}" y="${by}" font-size="22">🌳</text><text x="${cx+38}" y="${by}" font-size="22">🌴</text>${miniHouse(cx,by,o.home.f,WALLC[o.home.w]||'#fbf3df',true)}${glow(cx,by-30,44)}${label(cx,by+14,o.view?'🏡 بيته':'🏡 بيتي')}</g>`}
  ORDER.forEach(p=>{const [cx,by,w]=PL[p],L=lv[p]|0,P=PARTS[p];let g='';
    if(job&&job.p==p){g=job.ready?DRAW[p](cx,by,job.to)+readyMark(cx,by):scaffold(cx,by,72,40,mmss(job.end-now),Math.min(1,(now-job.start)/(job.end-job.start||1)))}
    else if(L>0){const pop=fx&&fx.p==p&&fx.until>now;g=`<g${pop?' class="md-pop"':''}>${DRAW[p](cx,by,L)}</g>`;
      if(!o.view&&L<3&&!job&&!needFor(p,L))g+=`<g class="md-mk"><circle cx="${cx+w/2-16}" cy="${by-70}" r="11" fill="#ffd23f" stroke="#c98a12" stroke-width="2"/><text x="${cx+w/2-16}" y="${by-65}" font-size="14" font-weight="900" text-anchor="middle" fill="#7a4a00">⬆</text></g>`}
    else g=o.view?plotEmpty(cx,by,w-40,false).replace(/<g class="md-mk">[\s\S]*<\/g>$/,''):plotEmpty(cx,by,w-40,!!needFor(p,0));
    s+=`<g ${o.view?'':`data-md="${p}"`}><rect x="${cx-w/2}" y="${by-112}" width="${w}" height="${by<300?114:124}" fill="transparent"/>${g}${label(cx,by+(p=='h'||p=='s'?13:14),`${P.e} ${P.n}`)}</g>`});
  // حيّ الأصدقاء
  if(!o.view){s+=`<g><rect x="104" y="628" width="152" height="20" rx="10" fill="rgba(255,255,255,.92)" stroke="#9fd3f0"/><text x="180" y="642" font-size="11" font-weight="900" text-anchor="middle" fill="#1d4e9e">🏘️ حيّ الأصدقاء</text></g>`;
    const FP=[[40,718],[100,718],[140,718],[220,718],[260,718],[320,718]].map((p,i)=>[[30,85,140,220,275,330][i],p[1]]);
    const fr=Array.isArray(o.friends)?o.friends:[];
    FP.forEach(([cx,by],i)=>{const f=fr[i];
      if(f)s+=`<g data-mdf="${esc(f.id)}"><rect x="${cx-26}" y="${by-70}" width="52" height="96" fill="transparent"/>${miniHouse(cx,by,f.f,WALLC[f.w]||'#fbf3df',false)}
        <rect x="${cx-27}" y="${by+4}" width="54" height="14" rx="7" fill="rgba(255,255,255,.92)" stroke="#9fd3f0"/><text x="${cx}" y="${by+14}" font-size="8.5" font-weight="800" text-anchor="middle" fill="#1d4e9e">${esc(String(f.nick).slice(0,9))}</text>${f.m&&total(fromCode(f.m))?`<text x="${cx+20}" y="${by-36}" font-size="10">🏙️</text>`:''}</g>`;
      else if(i==fr.length&&o.friends!=='off'&&o.friends!==null)s+=`<g data-mdadd="1"><rect x="${cx-26}" y="${by-60}" width="52" height="86" fill="transparent"/><rect x="${cx-18}" y="${by-26}" width="36" height="26" rx="5" fill="#c9a774" opacity=".6"/>
        <circle cx="${cx}" cy="${by-42}" r="13" fill="#4fb3f0" stroke="#fff" stroke-width="2.5" class="md-mk"/><text x="${cx}" y="${by-37}" font-size="16" font-weight="900" text-anchor="middle" fill="#fff">+</text>
        <text x="${cx}" y="${by+14}" font-size="8.5" font-weight="800" text-anchor="middle" fill="#1d4e9e">أضف صديقًا</text></g>`;
      else s+=`<rect x="${cx-18}" y="${by-22}" width="36" height="22" rx="5" fill="#c9a774" opacity=".45"/>${i==0&&o.friends===null?`<text x="${cx}" y="${by-28}" font-size="12" text-anchor="middle">⏳</text>`:''}${i==0&&o.friends==='off'?`<text x="${cx}" y="${by-28}" font-size="12" text-anchor="middle">📡</text>`:''}`});
    s+=`<text x="180" y="${H-12}" font-size="10" font-weight="700" text-anchor="middle" fill="#3d6b4a">${o.friends==='off'?'بيوت أصدقائك تظهر هنا عند الاتصال بالإنترنت':fr.length?'المس بيت صديقك لتزوره 🤍':''}</text>`}
  return s+'</svg>'}

/* ---------- الشاشة ---------- */
let friendsCache=null,friendsT=0,fx=null;
async function loadFriends(){const A=window.OnlineAPI;
  if(!navigator.onLine||!A)return 'off';
  if(friendsCache&&Date.now()-friendsT<120e3)return friendsCache;
  try{await A.init();const ids=(await A.friendIds()).slice(0,6);
    const rows=await Promise.all(ids.map(async id=>{try{const [h,p]=await Promise.all([A.db.ref('houses/'+id).get(),A.db.ref('profiles/'+id).get()]);
      const hv=h.val()||{},pv=p.val()||{};return {id,nick:pv.nick||hv.n||'صديق',av:pv.av||'',adm:pv.adm===true,f:hv.f|0,w:hv.w,m:/^[0-3]{5}$/.test(hv.m||'')?hv.m:'',h:hv,p:pv}}catch(e){return null}}));
    friendsCache=rows.filter(Boolean);friendsT=Date.now();return friendsCache}catch(e){return 'off'}}
let curFriends=null;
function myHome(){let w='cream';try{w=Deco.myLook().w}catch(e){}return {f:window.Bayt?Bayt.done:1,w}}
function draw(){const Bd=$('#mdBody');if(!Bd||!$('#madina').classList.contains('on')||backFn)return;
  const stg=stageOf(st.lv),t=total(st.lv),nx=STAGES_C.find(x=>x[2]>t),j=st.job;
  Bd.innerHTML=`<div class="mdhead"><b>${stg[1]} ${B('مدينتك','مدينتكِ')}: ${stg[0]}</b><div class="pb"><i style="width:${(t/15*100).toFixed(0)}%"></i></div>
    <small>${nx?`باقي ${ar(nx[2]-t)} ${nx[2]-t==1?'بناء':'بناءات'} لتصير ${nx[1]} ${nx[0]}`:'ما شاء الله! اكتملت مدينة الخير 🌟'} · 💎 ${ar(window.Deco?(Deco.j>99999?'∞':Deco.j):0)}</small></div>
    <div class="mdmap">${citySVG({lv:st.lv,home:myHome(),friends:curFriends})}</div>
    ${j?`<div class="mdhint job" id="mdJob"><span class="e">${j.ready?'🎉':'👷'}</span><span id="mdJobLine">…</span></div>`
      :`<div class="mdhint"><span class="e">👆</span><span>${B('المس','المسي')} الأرض الفارغة لتبني عليها، و${B('المس','المسي')} البناية لتطوّرها.<br><small style="font-weight:700">🔒 كل بناية تُفتح بعملٍ صالح: صلاتك، دروسك، حفظك، صلواتك وتسبيحك</small></span></div>`}
    <button class="btn gold" id="md3d" style="margin:8px auto 0;display:block">🧊 شاهد مدينتك مجسّمة</button>
    <p class="bcap" style="text-align:center;margin:8px 0 14px">«من بنى مسجدًا بنى الله له بيتًا في الجنة» 🤍</p>`;
  const b3=$('#md3d');if(b3)b3.onclick=()=>window.City3D&&City3D.open();
  const jb=$('#mdJob');if(jb)jb.onclick=jobModal;tick()}
async function openCity(){backFn=null;show('madina');$('#mdTitle').textContent='🏙️ مدينتي';curFriends=friendsCache||null;draw();
  const f=await loadFriends();curFriends=f;draw()}
// مدينة صديق (للمشاهدة فقط)
function view(m,nick,f,w,back){show('madina');backFn=back||null;$('#mdTitle').textContent=`🏙️ مدينة ${esc(nick)}`;const lv=fromCode(m),stg=stageOf(lv);
  $('#mdBody').innerHTML=`<div class="mdhead"><b>${stg[1]} مدينة ${esc(nick)}: ${stg[0]}</b><div class="pb"><i style="width:${(total(lv)/15*100).toFixed(0)}%"></i></div><small>${ORDER.filter(k=>lv[k]).map(k=>PARTS[k].e).join(' ')||'لم يبنِ شيئًا بعد'}</small></div>
    <div class="mdmap">${citySVG({lv,view:true,home:{f,w}})}</div>
    <p class="bcap" style="text-align:center;margin:10px 0">${B('ابنِ','ابني')} ${B('مدينتك','مدينتكِ')} أنت أيضًا بأعمالك الصالحة 🤍</p>
    <div class="nav"><button class="btn sec" id="mdVBack">رجوع</button></div>`;
  $('#mdVBack').onclick=()=>$('#mdBack').click()}

sec.addEventListener('click',e=>{if(backFn)return;const t=e.target.closest('[data-md],[data-mdf],[data-mdadd]');if(!t)return;
  try{window.Bayt&&Bayt.sTap()}catch(x){}
  if(t.dataset.md=='home'){show('bayt');Bayt.menu();return}
  if(t.dataset.md)return open(t.dataset.md);
  if(t.dataset.mdadd){const A=window.OnlineAPI;if(A){window.onlineReturn=openCity;A.openAdd()}return}
  const r=(Array.isArray(curFriends)?curFriends:[]).find(x=>x.id==t.dataset.mdf);if(r&&window.Deco&&Deco.visit)Deco.visit({id:r.id,h:r.h,p:r.p},openCity)});

/* ---------- نافذة البناء (مثل ورشة البيت) ---------- */
let vc=null;const stopVc=()=>{if(vc){vc.stop();vc=null}};
const FAST=12/60;
function open(p){const P=PARTS[p];if(!P)return;stopVc();const L=st.lv[p]|0,job=st.job;
  const lvs=`<div class="lvs">${P.lv.map((x,i)=>`<span class="${L>i?'on':''}">${ar(i+1)}. ${x[0]}</span>`).join('')}</div>`;
  if(job&&job.p==p)return job.ready?collect():jobModal();
  if(L>=3)return modal(`<div class="bnm"><div style="font-size:48px">${P.e}</div><h3 style="margin:2px 0">${P.n}</h3>${lvs}<p>🌟 وصلت إلى أعلى مستوى! ما شاء الله</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div></div>`);
  const why=needFor(p,L);
  if(why)return modal(`<div class="bnm"><div style="font-size:48px">🔒</div><h3 style="margin:2px 0">${L?'تطوير':'بناء'} ${P.n}</h3>${lvs}
    <div class="nx"><b>⬆️ المستوى ${ar(L+1)}: ${P.lv[L][0]}</b><small>حتى ${B('تفتحه','تفتحيه')}: ${why}</small></div>
    <p style="font-size:14px;color:var(--muted)">المدينة تُبنى بالأعمال الصالحة الحقيقية 🤍</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div></div>`);
  const [nm,jw,D,n,mins]=P.lv[L],busy=!!job,have=window.Deco?Deco.j:0;
  modal(`<div class="bnm"><div style="font-size:48px">${P.e}</div><h3 style="margin:2px 0">${L?'طوّر':'ابنِ'} ${P.n}</h3>${lvs}
    <div class="nx"><b>⬆️ المستوى ${ar(L+1)}: ${nm}</b><small>👷 ${B('اختر','اختاري')} طريقة البناء 👇</small></div>
    ${busy?`<p style="font-weight:800;color:#b06a2c">👷 العمّال يبنون الآن ${PARTS[job.p].n}. ${job.ready?'استلمه أولًا ✔':'انتظر حتى ينتهوا، أو عجّل البناء.'}</p>`:''}
    <div id="mdVc"></div>
    <div class="pay" id="mdPay">
      <button class="pd" id="mdD" ${busy?'disabled':''}>🤲 ${D.n} ${ar(n)} ${n<=10?"مرات":"مرة"} بصوتك ← يُبنى بسرعة</button>
      <button class="pj" id="mdJ" ${busy||have<jw?'disabled':''}>💎 ${ar(jw)} جوهرة ← يُبنى بسرعة ${have<jw?`(عندك ${ar(have)})`:''}</button>
      <button class="pw" id="mdW" ${busy?'disabled':''}>⏳ مجانًا: ${B('انتظر','انتظري')} ${tm(mins)}</button></div>
    <div class="nav"><button class="btn sec" id="mdX">إلغاء</button></div></div>`,()=>{
    $('#mdX').onclick=()=>{stopVc();closeModal()};
    $('#mdW').onclick=()=>start(p,L+1,mins);
    $('#mdJ').onclick=()=>{if(!window.Deco||Deco.j<jw)return;Deco.takeJ(jw);start(p,L+1,FAST)};
    $('#mdD').onclick=()=>{$('#mdPay').style.display='none';
      vc=Voice.counter($('#mdVc'),{phrase:D.p,target:n,emoji:D.e,onDone:k=>{vc=null;try{Aamal.add(D.k,k);Aamal.grow(D.k)}catch(e){}setTimeout(()=>start(p,L+1,FAST),700)}})}})}
function start(p,to,mins){stopVc();st.job={p,to,start:Date.now(),end:Date.now()+mins*MIN};sv();closeModal();
  try{tone(660,.08,'triangle',.1);setTimeout(()=>tone(880,.1,'triangle',.1),120)}catch(e){}
  draw();toast(mins<1?`👷 هيّا يا عمّال! ${PARTS[p].n} يُبنى الآن 🔨`:`👷 بدأ البناء! ${PARTS[p].n} يكتمل بعد ${tm(mins)}`)}
function jobModal(){const j=st.job;if(!j)return;if(j.ready)return collect();const P=PARTS[j.p],price=P.lv[j.to-1][1],have=window.Deco?Deco.j:0;stopVc();
  modal(`<div class="bnm"><div style="font-size:48px">👷</div><h3 style="margin:2px 0">العمّال يبنون ${P.n}</h3>
    <div class="nx"><b>⬆️ المستوى ${ar(j.to)}: ${P.lv[j.to-1][0]}</b></div>
    <div class="clock" id="mdClock">${mmss(j.end-Date.now())}</div><div class="pbar"><i id="mdBar" style="width:0"></i></div>
    <div id="mdVc"></div>
    <div class="pay" id="mdPay"><button class="pf" id="mdF">⚡ عجّل: ${SAL.n} ١٠ مرات بصوتك</button>
      <button class="pj" id="mdFJ" ${have<price?'disabled':''}>⚡ عجّل بـ 💎 ${ar(price)} جوهرة</button></div>
    <div class="nav"><button class="btn gold" id="mdOk">سأنتظر ⏳</button></div></div>`,()=>{
    $('#mdOk').onclick=()=>{stopVc();closeModal()};
    const hurry=()=>{if(st.job){st.job.end=Math.min(st.job.end,Date.now()+8000);sv()}closeModal();draw();tick()};
    $('#mdFJ').onclick=()=>{if(!window.Deco||Deco.j<price)return;Deco.takeJ(price);hurry()};
    $('#mdF').onclick=()=>{$('#mdPay').style.display='none';
      vc=Voice.counter($('#mdVc'),{phrase:SAL.p,target:10,emoji:SAL.e,onDone:k=>{vc=null;try{Aamal.add('sal',k);Aamal.grow('sal')}catch(e){}setTimeout(hurry,700)}})};
    tick()})}
function toast(t){const d=document.createElement('div');d.className='ctbanner b3';d.style.cssText='font-size:17px;top:16%;white-space:normal;max-width:90vw;text-align:center';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function collect(){const j=st.job;if(!j||!j.ready)return;st.job=null;st.lv[j.p]=Math.max(st.lv[j.p]|0,j.to);sv();try{Deco.pub&&Deco.pub()}catch(e){}
  const P=PARTS[j.p],before=stageOf(Object.assign({},st.lv,{[j.p]:j.to-1})),after=stageOf(st.lv);
  closeModal();fx={p:j.p,until:Date.now()+3800};draw();try{fanfare();confetti()}catch(e){}
  setTimeout(()=>{fx=null;draw();modal(`<div class="bnm"><div style="font-size:54px">🎉</div><h3 style="margin:2px 0">اكتمل البناء!</h3><p style="font-size:17px">${P.e} ${P.n}: <b>${P.lv[j.to-1][0]}</b></p>
    ${after[0]!=before[0]?`<p style="font-size:18px;font-weight:900;color:#1d4e9e">${after[1]} ${B('مدينتك','مدينتكِ')} صارت: ${after[0]}!</p>`:''}
    <div class="nav"><button class="btn gold" data-close>الحمد لله 🤍</button></div></div>`)},3900)}

/* ---------- الساعة ---------- */
function tick(){const j=st.job;if(!j)return;const now=Date.now(),left=j.end-now,fr=Math.min(1,(now-j.start)/(j.end-j.start||1));
  document.querySelectorAll('#madina [data-mdtimer]').forEach(t=>{t.textContent=mmss(left)});
  document.querySelectorAll('#madina [data-mdbar]').forEach(r=>r.setAttribute('width',(+r.dataset.mdbar*fr).toFixed(1)));
  const c=$('#mdClock');if(c){c.textContent=mmss(left);$('#mdBar').style.width=(fr*100)+'%'}
  const h=$('#mdJobLine');if(h)h.textContent=j.ready?`🎉 انتهى العمّال! ${B('المس','المسي')} ${PARTS[j.p].n} لتستلمه ✔`:`👷 ${PARTS[j.p].n}: باقي ${mmss(left)}`;
  if(left<=0&&!j.ready){j.ready=1;sv();if($('#mdClock'))closeModal();draw();try{tone(784,.12,'triangle',.12);setTimeout(()=>tone(1046,.16,'triangle',.12),150)}catch(e){}
    toast(`🎉 انتهى العمّال من ${PARTS[j.p].n} في ${B('مدينتك','مدينتكِ')}! ✔`)}}
setInterval(tick,1000);

/* ---------- زر «مدينتي» في صفحة البيت ---------- */
if(window.Deco&&Deco.menuHook){const orig=Deco.menuHook;Deco.menuHook=function(B0){orig.apply(this,arguments);
  const at=B0.querySelector('.bnhint')||B0.querySelector('.bhouse');if(!at)return;const stg=stageOf(st.lv),j=st.job;
  at.insertAdjacentHTML('afterend',`<button class="mdbtn" id="mdOpen"><span class="e">🏙️</span><span><b>${B('مدينتي','مدينتي')}: ${stg[0]}</b><small>${j?(j.ready?'🎉 بناء جاهز للاستلام!':'👷 العمّال يبنون '+PARTS[j.p].n):'ابنِ جامعًا ومكتبةً ومدرسة قرآن وسبيلًا وحديقة 🤍'}</small></span><span class="go">‹</span></button>`);
  $('#mdOpen').onclick=()=>{try{Bayt.sTap()}catch(e){}openCity()}}}

window.Madina={code,open:openCity,view,get st(){return st},stageOf,fromCode};
})();
