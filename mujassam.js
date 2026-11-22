/* مجسّم ثلاثي الأبعاد للمدينة كلها (v11.1)
   - البيت + الجامع + المكتبة + مدرسة القرآن + السبيل + الحديقة، كلٌّ حسب مستواه في Madina.st.lv (والورشة 👷 / الجاهز ✔ من Madina.st.job).
   - لمس البناية يفتح نافذة البناء/التطوير نفسها التي في الرسم العادي (Madina.part)، وبعد أي تغيير يُعاد رسم المشهد (City3D.refresh).
   - شخصية الطفل (ولد/بنت) تمشي في الطرق:
       🕌 وقت الأذان (من adhan.js) تذهب للجامع: 💎10 مرة لكل صلاة في اليوم، وتدعو الطفل ليصلّي فعلًا ويسجّل صلاته (Salah.openPray).
       💧 تسقي الأشجار العطشى (٥ كل يوم): 💎2 لكل شجرة.  🧹 تلتقط النفايات (٣ كل يوم): 💎1.  🐱 تسقي القطة العطشى عند السبيل (إذا بُني): 💎3 مرة يوميًا.
       🏫 تذهب لمدرسة القرآن ← «أنا حافظ صغير».  📚 تذهب للمكتبة ← «وِردي اليومي». (الجوائز هناك من العمل الحقيقي نفسه)
   - الحالة اليومية محلية: usul5_m3d_v1. Three.js r128 يُحمَّل عند الطلب فقط. */
(function(){
let loading=null;
function loadThree(){if(window.THREE)return Promise.resolve();if(loading)return loading;
  loading=new Promise((ok,no)=>{const s=document.createElement('script');s.src='vendor/three.min.js';s.onload=ok;s.onerror=()=>{loading=null;no()};document.head.appendChild(s)});return loading}
function webgl(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}}
const css=document.createElement('style');
css.textContent=`body.m3on .modal{z-index:9100}body.m3on #confetti{z-index:9150}body.m3on .ctbanner{z-index:9200}
#m3d .m3bar{position:absolute;left:8px;right:8px;bottom:max(10px,env(safe-area-inset-bottom));z-index:2;display:grid;grid-template-columns:repeat(6,1fr);gap:4px}
#m3d .m3bar button{border:0;border-radius:16px;padding:7px 2px 6px;font:inherit;font-weight:800;font-size:11px;line-height:1.2;background:#fff;color:#1d4e9e;box-shadow:0 4px 0 #9fb7d8}
#m3d .m3bar button b{display:block;font-size:22px}#m3d .m3bar button:active{transform:translateY(3px);box-shadow:0 1px 0 #9fb7d8}
#m3d .m3bar button.hot{background:linear-gradient(135deg,#ffe48a,#ffc53a);color:#6a4300;box-shadow:0 4px 0 #c98a12;animation:m3hot 1s ease-in-out infinite alternate}
@keyframes m3hot{to{transform:scale(1.06)}}
#m3d .m3card{position:absolute;left:12px;right:12px;bottom:calc(max(10px,env(safe-area-inset-bottom)) + 84px);z-index:2;background:#fffffff2;border-radius:18px;padding:10px 12px;text-align:center;font-weight:800;font-size:15px;box-shadow:0 4px 14px #0003;display:none}
#m3d .m3card.on{display:block;animation:m3in .3s ease}@keyframes m3in{from{transform:translateY(20px);opacity:0}}
#m3d .m3card .row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px}#m3d .m3card .row button{border:0;border-radius:14px;padding:8px 14px;font:inherit;font-weight:800;background:#1fa463;color:#fff}
#m3d .m3card .row button.sec{background:#e3ecf7;color:#1d4e9e}
#m3d .m3j{position:absolute;top:66px;left:12px;z-index:2;background:#fff;border-radius:14px;padding:4px 10px;font-weight:900;color:#1d4e9e;box-shadow:0 3px 0 #c9d6e3,0 3px 10px #0002}
#m3d .m3fly{position:absolute;z-index:3;left:50%;top:45%;transform:translateX(-50%);font-size:30px;font-weight:900;color:#1d7ad0;text-shadow:0 2px 0 #fff;pointer-events:none;animation:m3fly 1.4s ease forwards}
@keyframes m3fly{to{transform:translate(-50%,-90px);opacity:0}}
#m3d .m3hp{position:absolute;top:12px;right:12px;z-index:2;display:flex;align-items:center;gap:6px;background:#fffffff2;border-radius:22px;padding:4px 12px 4px 8px;box-shadow:0 3px 0 #c9d6e3,0 3px 10px #0002;min-height:40px}#m3d .m3hp>b{font-size:18px!important;color:#1d4e9e!important}#m3d .m3hp>.e{font-size:24px!important}
#m3d .m3wx{position:absolute;top:60px;right:12px;z-index:2;display:flex;align-items:center;gap:4px;border:0;background:#fffffff2;border-radius:18px;padding:3px 10px;font:inherit;font-weight:900;color:#1d4e9e;box-shadow:0 3px 0 #c9d6e3,0 3px 10px #0002}#m3d .m3wx[hidden]{display:none}#m3d .m3wx span{font-size:20px}#m3d .m3wx b{font-size:15px}
#m3d .m3hos{position:absolute;left:12px;z-index:2;display:flex;align-items:center;gap:4px;border:0;border-radius:22px;padding:5px 12px 5px 9px;font:inherit;font-weight:900;font-size:14px;color:#b0262c;background:linear-gradient(160deg,#fff,#ffe9ea);box-shadow:0 3px 0 #e8b8bb,0 3px 10px #0002}#m3d .m3hos b{font-size:22px;line-height:1}#m3d .m3hos.go{font-size:17px;padding:8px 16px 8px 12px;color:#6a4300;background:linear-gradient(160deg,#fff3b8,#ffc53a);box-shadow:0 4px 0 #c98a12,0 4px 12px #0003;animation:m3gob 1.6s ease-in-out infinite}#m3d .m3hos.go b{font-size:26px}@keyframes m3gob{50%{transform:scale(1.07)}}#m3d .m3go{position:absolute;inset:0;z-index:5;background:#0006;display:flex;align-items:center;justify-content:center;padding:14px}#m3d .m3go[hidden]{display:none}#m3d .m3go .in{background:#fffdf5;border-radius:22px;padding:12px 10px 10px;width:100%;max-width:440px;max-height:92%;overflow:auto;box-shadow:0 6px 0 #d9c58a,0 10px 30px #0005;animation:m3in .25s ease}#m3d .m3go h4{margin:0 0 10px;text-align:center;font-size:19px;color:#5a3d00}#m3d .m3go .g{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}#m3d .m3go .g button{border:0;border-radius:16px;padding:9px 2px 8px;font:inherit;font-weight:900;font-size:13.5px;line-height:1.25;color:#2b3550;background:var(--c);box-shadow:0 4px 0 var(--d),0 4px 8px #0002,inset 0 2px 0 #fff9}#m3d .m3go .g button b{display:block;font-size:30px;line-height:1.15;margin-bottom:2px}#m3d .m3go .g button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--d)}#m3d .m3go h5{margin:2px 0 8px;font-size:15px;color:#1f7a4a;text-align:center}#m3d .m3go .tk{display:grid;gap:8px;margin-bottom:12px}#m3d .m3go .tk button{display:flex;align-items:center;gap:10px;border:0;border-radius:16px;padding:9px 12px;font:inherit;font-weight:900;font-size:15.5px;text-align:right;color:#24402f;background:var(--c);box-shadow:0 4px 0 var(--d),0 4px 8px #0002,inset 0 2px 0 #fff9}#m3d .m3go .tk button b{font-size:30px}#m3d .m3go .tk button small{display:block;font-size:12.5px;color:#4b5b52}#m3d .m3go .tk button i{margin-inline-start:auto;font-style:normal;font-size:20px}#m3d .m3go .tk button.ok{opacity:.6}#m3d .m3sal{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(max(10px,env(safe-area-inset-bottom)) + 88px);z-index:3;border:0;border-radius:24px;padding:10px 18px;font:inherit;font-weight:900;font-size:17px;color:#fff;background:linear-gradient(160deg,#3cc47c,#1f9a5b);box-shadow:0 5px 0 #157244,0 6px 16px #0004;white-space:nowrap;animation:m3sb 1s ease-in-out infinite alternate}#m3d .m3sal[hidden]{display:none}#m3d .m3dbar{grid-template-columns:1fr 1fr!important}#m3d .m3dbar button{font-size:14px}#m3d .m3dbar button[data-d=park]{background:linear-gradient(160deg,#5aa8ff,#2f6fd0);color:#fff;box-shadow:0 4px 0 #1d4e9e}#m3d .m3ck{position:absolute;left:0;right:0;bottom:0;height:calc(max(10px,env(safe-area-inset-bottom)) + 190px);z-index:1;pointer-events:none}#m3d .m3ck[hidden]{display:none}#m3d .m3ck .dash{position:absolute;left:-10%;right:-10%;bottom:0;height:100%;border-radius:50% 50% 0 0/38% 38% 0 0;background:linear-gradient(#3b3d45,#1f2026 40%);box-shadow:0 -4px 0 #55575f inset,0 -6px 18px #0006}#m3d .m3ck .whl{position:absolute;left:30%;bottom:calc(max(10px,env(safe-area-inset-bottom)) + 52px);width:150px;height:150px;transform:translateX(-50%);filter:drop-shadow(0 4px 4px #0008)}#m3d .m3ck .spd{position:absolute;right:16%;bottom:calc(max(10px,env(safe-area-inset-bottom)) + 96px);padding:6px 12px;border-radius:14px;background:#0b2a1a;color:#7dffb0;font-weight:900;font-size:16px;box-shadow:0 0 10px #2ecc7166 inset}#m3d .m3fade{position:absolute;inset:0;z-index:6;background:#0b1a2e;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:20px;text-align:center;padding:20px;transition:opacity .6s}#m3d .m3fade[hidden]{display:none}@keyframes m3sb{to{transform:translateX(-50%) scale(1.08)}}#m3d .m3go .st{margin:-4px 0 10px;text-align:center;font-weight:900;font-size:14px;color:#8a5a00;background:#fff3c4;border-radius:12px;padding:6px 8px;box-shadow:0 3px 0 #e3c56e}#m3d .m3cam{position:absolute;top:108px;right:12px;z-index:2;width:46px;height:46px;border-radius:50%;border:0;font-size:22px;background:#fff;box-shadow:0 3px 0 #c9d6e8,0 3px 8px #0002}#m3d .m3flash{position:absolute;inset:0;z-index:6;background:#fff;opacity:.9;pointer-events:none;animation:m3fl .5s ease forwards}@keyframes m3fl{to{opacity:0}}#m3d .m3alb .g{grid-template-columns:repeat(2,1fr)!important}#m3d .m3alb .g button{padding:5px!important;font-size:12px!important}#m3d .m3alb .g img{display:block;width:100%;border-radius:10px;margin-bottom:3px}#m3d .m3big{position:absolute;inset:0;z-index:7;background:#000d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px}#m3d .m3big img{max-width:100%;max-height:72%;border-radius:14px;box-shadow:0 6px 20px #0008}#m3d .m3big .r{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}#m3d .m3big .r>*{border:0;border-radius:14px;padding:9px 16px;font:inherit;font-weight:900;font-size:15px;background:#fff;color:#1d4e9e;text-decoration:none;box-shadow:0 3px 0 #a9bcd6}#m3d .m3go .x{display:block;margin:12px auto 0;border:0;border-radius:14px;padding:9px 26px;font:inherit;font-weight:900;font-size:15px;background:#e3ecf7;color:#1d4e9e;box-shadow:0 3px 0 #a9bcd6}#m3d .m3hos[hidden]{display:none}#m3d .m3near{background:linear-gradient(160deg,#5aa8ff,#2f6fd0)!important;box-shadow:0 5px 0 #1d4e9e,0 6px 16px #0004!important}#m3d .m3r2 .m3run{width:38px;height:38px;border-radius:50%;border:0;font-size:19px;background:#fff;box-shadow:0 3px 0 #c9d6e3,0 3px 8px #0002}#m3d .m3r2 .m3run.on{background:#ffd84a;box-shadow:0 3px 0 #c98a12,0 3px 8px #0002}#m3d .m3run[hidden]{display:none!important}#m3d .m3go .srch{display:block;width:100%;box-sizing:border-box;border:2px solid #e3c56e;border-radius:16px;padding:10px 14px;margin:0 0 10px;font:inherit;font-weight:800;font-size:16px;background:#fff;box-shadow:inset 0 2px 4px #0001;direction:rtl}#m3d .m3go .nores{text-align:center;font-weight:800;color:#8a5a00;margin:6px 0 10px}#m3d .m3go [hidden]{display:none!important}#m3d .m3gt .tabs{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin:0 0 10px}#m3d .m3gt .tabs button{border:0;border-radius:13px;padding:5px 0 4px;font:inherit;font-weight:900;font-size:11.5px;line-height:1.2;color:#5a4a20;background:#f5eed6;box-shadow:0 3px 0 #d9c58a,inset 0 2px 0 #fff9}#m3d .m3gt .tabs button b{display:block;font-size:20px;line-height:1.2}#m3d .m3gt .tabs button.on{background:linear-gradient(160deg,#fff3b8,#ffc53a);color:#6a4300;box-shadow:0 3px 0 #c98a12,inset 0 2px 0 #fff9}#m3d .m3gt .g{gap:8px}#m3d .m3gt .g button{padding:7px 2px 6px;font-size:13px}#m3d .m3gt .g button b{font-size:25px}#m3d .m3gt .tk{grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}#m3d .m3gt .tk button{position:relative;flex-direction:column;justify-content:center;gap:1px;padding:7px 5px 6px;font-size:12.5px;line-height:1.3;text-align:center}#m3d .m3gt .tk button b{font-size:24px}#m3d .m3gt .tk button small{font-size:11px;margin-top:2px}#m3d .m3gt .tk button i{display:none}#m3d .m3gt .tk button.ok:after{content:'✔';position:absolute;top:4px;left:7px;font-size:14px;color:#1f9a5b}#m3d .m3gt .st{font-size:13px;padding:5px 8px;margin:0 0 8px}#m3d .m3gt .srch{padding:8px 12px;margin-bottom:8px}#m3d .m3gt .bot{display:flex;gap:8px;justify-content:center;margin-top:10px}#m3d .m3gt .bot button{margin:0!important}#m3d .m3hint{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;background:#0009;color:#fff;border-radius:20px;padding:14px 18px;font-weight:900;font-size:15.5px;line-height:1.9;text-align:center;pointer-events:none;transition:opacity .6s;white-space:nowrap}#m3d .m3go .lite{display:block;margin:12px auto 0;border:0;border-radius:14px;padding:8px 16px;font:inherit;font-weight:900;font-size:14px;background:#eef6e4;color:#3a5a1a;box-shadow:0 3px 0 #b9cc9a}
#m3d .m3snd{position:absolute;top:108px;left:12px;z-index:2;width:42px;height:42px;border-radius:50%;border:0;background:#fffd;font-size:20px;box-shadow:0 2px 6px #0003}
#m3d .m3msg:empty{display:none}#m3d .m3hp:empty{display:none}#m3d .m3hp .e{font-size:30px;line-height:1}#m3d .m3hp .t{flex:1;min-width:0}#m3d .m3hp b{display:block;font-size:14.5px;color:#5a4a1a}#m3d .m3hp small{display:block;font-size:12px;font-weight:700;color:#7a6a3a}
#m3d .m3hp .hb{height:9px;border-radius:6px;background:#efe6d2;overflow:hidden;margin-top:3px}#m3d .m3hp .hb i{display:block;height:100%;border-radius:6px;transition:width .6s}
/* (v16.8) أزرار الأعلى في صفّين صغيرين مرتّبين؛ زر الصوت يختفي ليلًا (كان يُظهر هلالًا ثانيًا) */
#m3d .m3tl,#m3d .m3tr,#m3d .m3r2{position:absolute;z-index:2;display:flex;align-items:center;gap:6px}
#m3d .m3tl{top:10px;left:10px}#m3d .m3tr{top:10px;right:10px}#m3d .m3r2{top:56px;right:10px}
#m3d .m3tl>*,#m3d .m3tr>*,#m3d .m3r2>*{position:static!important;margin:0}
#m3d .m3x{width:38px;height:38px;border-radius:50%;border:0;background:#fff;font-size:18px;box-shadow:0 3px 0 #c9d6e3,0 3px 8px #0003}
#m3d .m3tl .m3j{height:38px;box-sizing:border-box;display:flex;align-items:center;padding:0 10px;font-size:15px;border-radius:19px}
#m3d .m3tr .m3hp{min-height:38px;box-sizing:border-box;padding:2px 10px 2px 7px;gap:4px}#m3d .m3tr .m3hp>.e{font-size:20px!important}#m3d .m3tr .m3hp>b{font-size:15px!important}
#m3d .m3tr .m3wx{height:38px;box-sizing:border-box;padding:0 9px}#m3d .m3tr .m3wx span{font-size:17px}#m3d .m3tr .m3wx b{font-size:14px}
#m3d .m3r2 .m3cam,#m3d .m3r2 .m3snd{width:38px;height:38px;font-size:18px;background:#fff;box-shadow:0 3px 0 #c9d6e3,0 3px 8px #0002}
#m3d .m3hos{top:56px}#m3d .m3hos.go{padding:6px 13px 6px 10px;font-size:15px}#m3d .m3hos.go b{font-size:21px}
#m3d .m3x[hidden],#m3d .m3snd[hidden],#m3d .m3cam[hidden]{display:none!important}`;
document.head.appendChild(css);
const cam0={th:.35,ph:.62,dist:0};let cur=null;
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const arn=n=>typeof ar=='function'?ar(n):n;

/* ---------- الحالة اليومية ---------- */
const DKEY='usul5_m3d_v1',today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
let ds={};try{ds=JSON.parse(localStorage.getItem(DKEY)||'{}')||{}}catch(e){}
function day(){if(ds.d!==today())ds={d:today(),pr:{},tr:{},lt:{},cat:0};return ds}
const dsv=()=>{try{localStorage.setItem(DKEY,JSON.stringify(ds))}catch(e){}};
// (v15.9) اختيارات الطفل في مدينته: أسماء الشوارع وألوان بيوت الجيران
const CKEY='usul5_city_v1';let CITY={};try{CITY=JSON.parse(localStorage.getItem(CKEY)||'{}')||{}}catch(e){}
const csv=()=>{try{localStorage.setItem(CKEY,JSON.stringify(CITY))}catch(e){}};
const HCOL=[0xf3e3c3,0xe6efe0,0xffd6dc,0xd6eaff,0xfff0b3,0xe6dcff,0xffdfc4,0xffffff];
const HCN=['رملي','نعناعي','وردي','سماوي','أصفر','بنفسجي','مشمشي','أبيض'];
// (v15.9) ٦ اسم الطفل: الجيران ينادونه باسمه
const kidN=()=>{try{const p=window.OnlineAPI&&OnlineAPI.profile,st=typeof state!=='undefined'?state:null,n=(p&&p.nick)||(st&&(st.nick||st.name))||'';return String(n).replace(/[👑\s]+$/,'').replace(/^[👑\s]+/,'').slice(0,16)}catch(e){return ''}};
const yaN=()=>kidN()?' يا '+kidN():'';
// (v15.9) ٩ المدينة تزهر بالأعمال الصالحة: كل عمل = وردة، وكل ١٠ أعمال = شجرة جديدة (usul5_bloom_v1)
const BLK='usul5_bloom_v1';let BLOOM={n:0};try{BLOOM=JSON.parse(localStorage.getItem(BLK)||'{"n":0}')||{n:0}}catch(e){}
function bloomAdd(){BLOOM.n=(BLOOM.n|0)+1;try{localStorage.setItem(BLK,JSON.stringify(BLOOM))}catch(e){}}
// (v15.9) ٧ الحيوان الأليف (usul5_pet_v1): {k,f: عدد مرات الإطعام, d: آخر يوم}
const PTK='usul5_pet_v1';let PET={};try{PET=JSON.parse(localStorage.getItem(PTK)||'{}')||{}}catch(e){}
const ptsv=()=>{try{localStorage.setItem(PTK,JSON.stringify(PET))}catch(e){}};
const PETS={cat:['🐱','بسبوسة','قطّتي','🐟','she'],bird:['🐦','زقزوق','عصفوري','🌾','he'],rab:['🐰','أرنوب','أرنبي','🥕','he']};
// (v15.9) ٨ هدية اليوم المخفية: مكان يتغيّر كل يوم، مع تلميح
const GIFTS=[[-23.6,7.6,'قرب المرعى حيث ترعى الأغنام 🐑'],[-10.6,17.1,'عند طرف الجسر الخشبي فوق النهر 🌉'],[21.6,-5.4,'على الشاطئ قرب برج الساعة 🕰️'],[-4.4,-30.5,'قرب بوّابة مدينة الألعاب 🎡'],
  [-22,-6.6,'خلف المزرعة قرب الدجاج 🐔'],[17.2,-13.4,'قرب ملعب كرة القدم ⚽'],[-19.9,35.4,'في آخر الدربونة القديمة 🏮'],[6.4,31,'أمام المستشفى 🏥'],[18.4,3.8,'قرب ساحة النافورة ⛲'],[-14.4,13.6,'تحت شجرة كبيرة قرب المكتبة 📚']];
// (v15.9) ١٢ ألبوم الصور: خارج نسخة «رمز الحفظ» لأن الصور كبيرة (مفتاح لا يبدأ بـ usul5_)
const ALK='jannah_album_v1';const albGet=()=>{try{return JSON.parse(localStorage.getItem(ALK)||'[]')||[]}catch(e){return []}};
function albPut(a){for(let i=0;i<6;i++){try{localStorage.setItem(ALK,JSON.stringify(a));return true}catch(e){if(a.length<=2)return false;a.splice(1,1)}}return false}
const seed=()=>{let h=0;for(const c of today())h=(h*31+c.charCodeAt(0))>>>0;return h};
// (v12.1) ثلاث أشجار يسار البيت أُبعدت قليلًا لتتّسع المزرعة (FARM)
const TREES=[[-23.4,-3],[-23.4,6.2],[12,-3],[12,4],[-2.8,-25.6],[3.6,12.9],[-13,12],[13,-12],[-13,-12],[13,12],[-23.6,0],[16.5,-8]];
// (v15.0) المزرعة أُبعدت يسارًا لتتّسع حديقة البيت وسوره
const FARM=[-17.8,0],FARM_IN={x:-17.8,z:2.2,via:4.6};
// (v15.0) أرض البيت: من السور الأمامي XF إلى الخلفي XL، وعرضها ±HZ
const XF=-2.95,XL=-14.4,HZ=3.55;
// (v16.2) طلب الشيخ: «كبّر الشارع، والرصيف صغير، واجعل الشارع أربع سايدات». كل إحداثيات المدينة والمنطق بقيت كما هي (القديمة)،
// وتُرسم عبر خريطة fX: داخل الشارع (|x|≤R0) يتّسع ×R1/R0 (حارتان لكل اتجاه)، والرصيف (R0..S0) يتّسع إلى (R1..S1)، وكل ما بعده يُزاح DX للخارج.
// المشهد يُزاح مرة عند البناء (shiftScene)، والناس والسيارات والطفل عند كل رسم (viewMap في run)، والسرعة تُعدَّل في منطقة الشارع (spF) فلا يسرعون.
const R0=2.1,S0=2.9,R1=4.1,S1=6.6,DX=S1-S0,LI=R1*.25,LO=R1*.75;
function fX(x){const a=Math.abs(x),s=x<0?-1:1;return a<=R0?x*R1/R0:a<=S0?s*(R1+(a-R0)*(S1-R1)/(S0-R0)):s*(a+DX)}
// (v17.0) عكس fX: من إحداثيات الرسم إلى إحداثيات المنطق القديمة (للمس الأرض وصناديق البنايات)
function fXi(x){const a=Math.abs(x),s=x<0?-1:1;return a<=R1?x*R0/R1:a<=S1?s*(R0+(a-R1)*(S0-R0)/(S1-R1)):s*(a-DX)}
const fXd=x=>{const a=Math.abs(x);return a<R0?R1/R0:a<S0?(S1-R1)/(S0-R0):1};
// (v16.3) 🚦 إشارات مرور حقيقية عند ممرّي المشاة (z=±4.6): دورة ٢٤ ثانية — أخضر للسيارات ١٢، أصفر ٢، ثم أحمر ١٠ (والمشاة: الرجل الأخضر)
const SIGC=24;function sig(){const d=window.City3D&&City3D.debugSig;const u=d!=null?d:(Date.now()/1000)%SIGC;return u<12?'g':u<14?'y':'r'}
const pedGo=()=>sig()==='r';const nearZeb=(x,z)=>Math.abs(Math.abs(z)-4.9)<1&&Math.abs(x)>1.6&&Math.abs(x)<3.4;
const spF=(x,ux,uz)=>1/Math.max(.3,Math.hypot(ux*fXd(x),uz));
// (v13.7) أماكن جديدة: النهر (RVZ) والجسر الخشبي (FBX)، السوق (MKX/MKT)، ساحة النافورة (PLZ)، بيوت الجيران (NBZ)
// (v14.3) قرى قريبة: [x,z,الاسم]
const VIL=[[-24,-82,'قرية النخيل'],[-25,64,'قرية الرمّان'],[-28,-150,'قرية البساتين']];
const nearVil=(x,z)=>VIL.some(v=>Math.abs(x-v[0])<12&&Math.abs(z-v[1])<12);
const RVZ=20,RVW=3.2,FBX=-9,MKX=4.6,PLZ=[14.6,0],NBZ=27;
const FLK=[-27,10]; // (v13.8) مرعى الأغنام
const MKT=[["bak",-16.5,"#c0392b","#ffffff","🍞 الخبّاز"],["fru",-20.5,"#1fa463","#ffffff","🍊 الفاكهة"],["swe",-24.5,"#2f6fd0","#ffffff","🍬 الحلويات"]];
const FB=[13.6,-19.5];
const HSP=[10.5,36];
const PKC=[-12.5,-37]; // (v15.4) 🎡 مدينة الألعاب يسار الطريق بعد المدرسة، بوابتها على الرصيف (x≈-5) // (v15.2) 🏥 مستشفى المدينة: يمين الطريق بعد النهر وبيوت الجيران، بابه نحو الطريق
// (v14.7) 🚌 موقفا باص المدينة على جانبي الشارع الرئيسي (قبل الجسر): [اتجاه الحارة، z، رصيف الانتظار x، مكان الوقوف داخل المظلّة x]
const BSTOP=[[1,16.6,2.85,3.45],[-1,16.6,-2.75,-3.45]]; // (v14.5) ملعب كرة القدم
// (v16.9) طلب الشيخ: 👮 مركز الشرطة يمين الطريق مقابل مدينة الألعاب، و⚡ محطة الكهرباء (شمس ورياح) في السهل الغربي
const POL=[10.5,-34],PWR=[-34,-17],TAPP=[3.25,-6.6],IFT=[9.6,3.7],SHK=[-2.95,8.3];
const WALLETS=[[-2.5,-9.5],[2.6,-12.5],[-2.5,14.5],[2.6,10.5],[-2.5,-27],[2.6,-27.5]];
const LKEY='usul5_m3lite';function liteOn(){try{return localStorage.getItem(LKEY)==='1'}catch(e){return false}}
// حكايات جدّو (يوم الجمعة) — كتبها Claude، والشيخ يراجعها
const GST=['رأى رجلٌ شيخًا كبيرًا يغرس نخلة، فقال له: لماذا تغرسها وأنت لن تأكل منها؟ فقال: غرس مَن قبلنا فأكلنا، ونغرس ليأكل مَن بعدنا 🌴',
  'قالت أمٌّ لابنتها: اخلطي الحليب بالماء، فلا أحد يرانا. فقالت البنت: إن لم يرنا أحد، فاللَّهُ يرانا 🥛',
  'كسر صبيٌّ زجاج جاره بالكرة، فذهب إليه وقال: أنا كسرته وسأصلحه. فابتسم الجار وسامحه وأحبّه لصدقه ⚽',
  'رأى رجلٌ في طريقه كلبًا يلهث من العطش، فنزل البئر وملأ خفّه ماءً وسقاه، فشكر اللَّهُ له وغفر له 🐕',
  'كان ولدٌ يحمل الماء لجارته العجوز كلّ صباح ولا يخبر أحدًا، فلمّا مرض جاء أهل الحيّ كلّهم يزورونه ويدعون له 🤍'];
// (v17.1) طلب الشيخ: «مدينة معقولة» — أحياء سكنية فيها بيوت للناس، ومسبحان للأطفال (الأولاد مكشوف / البنات مسقّف ومستور)،
// ومدرسة تعليم السياقة (دروس + اختبار عملي ← رخصة ← سيارة بشرط عمل صالح بالصوت)، ومعرض سيارات تُشترى بالأعمال الصالحة الصوتية.
const POOLB=[-9.5,-51],POOLG=[-9,-59.5],DRV=[11.5,-51],SHOW=[10.5,-65.5];
const HOUSES=(()=>{const L=[];const row=(x,za,zb)=>{const n=Math.floor(Math.abs(zb-za)/6.6+1e-6);for(let i=0;i<=n;i++){const z=za+Math.sign(zb-za)*i*6.6;if(nearVil(x,z))continue;const h=Math.abs(Math.round(x*13+z*7));L.push([x,z,1+h%3,h%8,x>0?-1:1])}};
  row(8.6,-74,-114);row(15.2,-74,-114);row(-8.6,-67,-114);row(-15.2,-67,-114);row(8.6,48,88);row(15.2,48,88);row(-8.6,47,88);row(-15.2,47,88);return L})();
const nearHs=(x,z)=>HOUSES.some(h=>Math.abs(x-h[0])<3.6&&Math.abs(z-h[1])<3.6)||x<-3&&x>-16&&z<-45&&z>-64||x>4&&x<18.5&&z<-43.5&&z>-71;
const CRK='usul5_cars_v1';let CARS={};try{CARS=JSON.parse(localStorage.getItem(CRK)||'{}')||{}}catch(e){}
const crsv=()=>{try{localStorage.setItem(CRK,JSON.stringify(CARS))}catch(e){}};
const VSAL={k:'sal',p:'اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',e:'💚',n:'الصلاة على محمد وآل محمد'},VTAS={k:'tas',p:'سُبْحَانَ اللَّهِ',e:'📿',n:'التسبيح'};
// [id، رمز، الاسم، الشكل، العمل الصوتي، العدد] — الأولى جائزة الرخصة
const CARL=[['c1','🚙','سيارتي الصغيرة','mini',VSAL,10],['c2','🚗','سيارة العائلة','sedan',VTAS,33],['c3','🏎️','السيارة الرياضية','sport',VSAL,33],['c4','🚙','الجيب الكبير','suv',VTAS,50],['c5','✨','السيارة الذهبية','gold',VSAL,100]];
const CCOL=[[0xe2504a,'أحمر'],[0x2f6fd0,'أزرق'],[0x1fa463,'أخضر'],[0xffc21a,'أصفر'],[0xf4f4f4,'أبيض'],[0x26282c,'أسود'],[0xff8fb8,'وردي'],[0x8f6bff,'بنفسجي']];
function poolOpen(){const d=window.City3D&&City3D.debugPool;if(d!=null)return !!d;const h=hourNow();return h>=9&&h<19&&!rainNow()}
const NOFL=(x,z)=>nearHs(x,z)||Math.abs(x-POL[0])<5.5&&Math.abs(z-POL[1])<5||x<-24&&z>-36&&z<-3||x>9.6&&x<17.6&&z<-14&&z>-25||Math.abs(z-RVZ)<2.6||x>3&&x<11&&z<-13&&z>-28||Math.hypot(x-PLZ[0],z-PLZ[1])<3.9||Math.abs(z-NBZ)<2.6&&Math.abs(Math.abs(x)-7)<2.6;
const LITTER=[[-9,4.6],[9,-4.6],[-10,-4.6],[10,4.6],[-2.5,-15],[2.75,15]]; // (v13.9) آخر اثنتين على الرصيف لا في الشارع
const thirsty=()=>{const s=seed(),r=[];for(let i=0;i<5;i++)r.push((s+i*7)%TREES.length);return r};
const litter=()=>{const s=seed(),r=[];for(let i=0;i<3;i++)r.push((s+i*5)%LITTER.length);return r};
const PNAME={fajr:'الفجر',dhuhr:'الظهر',maghrib:'المغرب'};
function prayerNow(){try{const t=Adhan.times(new Date()),n=Date.now();for(const p of ['fajr','dhuhr','maghrib']){const a=+t[p];if(n>=a&&n<a+90*60e3)return p}}catch(e){}return null}
function nextPrayer(){try{return Adhan.next()}catch(e){return null}}
const hm=d=>{let h=d.getHours(),m=d.getMinutes();return arn(h)+':'+arn(String(m).padStart(2,'0'))};

/* ---------- لافتات ---------- */
function textSprite(T,t,bg,fg){const c=document.createElement('canvas');c.width=512;c.height=112;const x=c.getContext('2d');
  x.fillStyle=bg;x.strokeStyle='#d8c58a';x.lineWidth=6;const r=50;x.beginPath();x.moveTo(r+4,4);x.lineTo(508-r,4);x.arc(508-r,56,r-2,-Math.PI/2,Math.PI/2);x.lineTo(r+4,108);x.arc(r+4,56,r-2,Math.PI/2,Math.PI*1.5);x.closePath();x.fill();x.stroke();
  x.fillStyle=fg;x.font='800 50px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';try{x.direction='rtl'}catch(e){}x.fillText(t,256,60,468);
  const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(4.4,.96,1);s.renderOrder=10;return s}
function markSprite(T,e,col,sc){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  x.fillStyle=col;x.strokeStyle='#fff';x.lineWidth=9;x.beginPath();x.arc(64,64,54,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='#fff';x.font='900 64px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,64,70);
  const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(sc||1.2,sc||1.2,1);s.renderOrder=11;return s}
// (v12.1) فقاعة كلام (السلام عليكم…) بعرض يناسب النص
function speech(T,t){const c=document.createElement('canvas'),x=c.getContext('2d'),f='800 44px system-ui,"Segoe UI",sans-serif';x.font=f;
  const w=Math.ceil(x.measureText(t).width)+90,h=92,r=h/2;c.width=w;c.height=122;x.font=f;
  x.fillStyle='rgba(255,255,255,.97)';x.strokeStyle='#1fa463';x.lineWidth=6;x.beginPath();x.moveTo(r+4,4);x.lineTo(w-r-4,4);x.arc(w-r-4,4+r,r,-Math.PI/2,Math.PI/2);
  x.lineTo(w/2+16,4+h);x.lineTo(w/2,118);x.lineTo(w/2-16,4+h);x.lineTo(r+4,4+h);x.arc(r+4,4+r,r,Math.PI/2,Math.PI*1.5);x.closePath();x.fill();x.stroke();
  x.fillStyle='#14794f';x.textAlign='center';x.textBaseline='middle';try{x.direction='rtl'}catch(e){}x.fillText(t,w/2,52);
  const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(w/122*.8,.8,1);s.renderOrder=12;return s}

/* ---------- المشهد ---------- */
const SPOT={home:[-6,0],m:[6,0],k:[-6,9],q:[6,9],h:[-6,-9],s:[6,-9],sc:[-7,-22]};
const CAT=[3.4,-10.6];
// (v12.2) المقياس: الولد أصغر (طوله أقل من نصف باب المدرسة) والناس معه، والجامع والمدرسة أكبر.
// الجامع محصور بين طريقين (z=±4.6) فعمقه لا يتجاوز 7.2 (mScale).
const KS=.85,PS=.7,BS={m:1.85,sc:1.45,home:1.25,k:1.3,q:1.3,s:1.25,h:1.15};
const mScale=l=>Math.min(BS.m,7.2/(3*(l===2?1.25:l>=3?1.5:1)));
// (v17.1) صورة علم من رمزه (emoji): يُرسم كبيرًا ثم يُقصّ على حدود الألوان ويُمدّ ليملأ القماش
function flagTex(e){const T=THREE,a=document.createElement('canvas');a.width=a.height=320;const x=a.getContext('2d');x.font='260px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,160,170);
  let X0=320,Y0=320,X1=0,Y1=0;try{const d=x.getImageData(0,0,320,320).data;for(let y=0;y<320;y+=2)for(let k=0;k<320;k+=2)if(d[(y*320+k)*4+3]>200){if(k<X0)X0=k;if(k>X1)X1=k;if(y<Y0)Y0=y;if(y>Y1)Y1=y}}catch(er){}
  const c=document.createElement('canvas');c.width=256;c.height=160;const y=c.getContext('2d');y.fillStyle='#fff';y.fillRect(0,0,256,160);
  if(X1-X0>40&&Y1-Y0>20)y.drawImage(a,X0+3,Y0+3,X1-X0-6,Y1-Y0-6,0,0,256,160);else{y.font='120px sans-serif';y.textAlign='center';y.textBaseline='middle';y.fillText(e,128,84)}
  const t=new T.CanvasTexture(c);return t}
function makeScene(night,V){const T=THREE,S=new T.Scene(),D=day();
  const Md=window.Madina,lv=V?V.lv:(Md?Md.st.lv:{}),job=V?null:(Md?Md.st.job:null),need=(p,l)=>Md&&Md.need?Md.need(p,l):'';
  const LV=p=>Math.max(0,Math.min(3,lv[p]|0));
  const floors=Math.max(1,Math.min(4,(V?V.f:(window.Bayt&&Bayt.done))|0||1));
  const RN=rainNow(),RBW=rainbowNow(),OC=occNow(),FEST=OC&&OC.k==='sad'?null:festNow(),JOY=!FEST&&OC&&OC.k==='joy'?OC:null;
  // (v11.4) ألوان أزهى: أرض خضراء حتى الأفق، تلال، زهور، فراشات وطيور بالنهار، يراعات بالليل
  const WN=winter();S.background=new T.Color(night?0x1a2a5e:WN?0xb7c4d0:0x9fdcff);S.fog=new T.Fog(night?0x1a2a5e:WN?0xc9d3dc:0xc8ecff,night?110:130,night?480:560);
  S.add(new T.HemisphereLight(night?0x9aa8e0:0xffffff,night?0x335533:0x6fb04a,night?.8:RN?.5:.62));
  const sun=new T.DirectionalLight(night?0xb8c6ff:0xfff2d6,night?.5:.95);sun.position.set(14,24,12);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});S.add(sun);
  const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o||{}));
  const add=(geo,mat,x,y,z,p)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(p||S).add(m);return m};
  const box=(w,h,d,mat,x,y,z,p)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z,p);
  const prism=(w,h,d,mat,x,y,z,p)=>{const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,h);sh.lineTo(-w/2,0);
    const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return add(g,mat,x,y,z,p)};
  const winM=M(night?0xffd86b:0x9fd8ff,night?{emissive:0xffc940,emissiveIntensity:.9}:{roughness:.3});
  const wood=M(0x8b5a2b),stone=M(0xf4efe4),green=M(0x2fa36b),tr=M(0x7a4b25),lf=M(0x3fbf5a);
  const water=M(0x5fb0e6,{roughness:.15,metalness:.1,emissive:night?0x1d4e7e:0x000000});
  // (v13.6) أشجار أكثر واقعية (طلب الشيخ): جذع متدرّج بلحاء وأغصان، وتاج من كتل أوراق متعرّجة بدرجات أخضر طبيعية.
  // ثلاثة أنواع حسب المكان: شجرة مستديرة، شجرة طويلة (كالكالبتوس)، وشجرة برتقال بثمارها. وقليل منها مزهر بالوردي.
  const tgMk=dt=>[1,2.7,4.3].map(sd=>{const g=new T.IcosahedronGeometry(1,dt),p=g.attributes.position,v=new T.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);v.multiplyScalar(1+.13*Math.sin(v.x*5.3+sd)*Math.cos(v.y*4.1+sd*2)+.07*Math.sin(v.z*9+sd));p.setXYZ(i,v.x,v.y,v.z)}
    g.computeVertexNormals();return g});
  // (v17.8) فحص التعليق: أوراق الشجر كانت أثقل شيء في المدينة (٣٢٠ مثلثًا لكل كتلة، ×٢ للظل) ← الأشجار البعيدة والسياج بكتل أخفّ (٨٠)
  const TG=tgMk(2),TGL=tgMk(1);
  const TRK=new T.CylinderGeometry(.13,.22,1,8),BRG=new T.CylinderGeometry(.045,.085,1,6),FRG=new T.SphereGeometry(.075,8,6);
  const bark=M(night?0x4a3626:0x6b4a2f,{roughness:1});
  const LVm=n=>({color:n,roughness:.85,flatShading:true});
  // (v14.5) ألوان الأوراق حسب الفصل الحقيقي: خريف أصفر وبرتقالي، شتاء أخضر هادئ، ربيع وصيف أخضر زاهٍ (وأزهار أكثر في الربيع)
  const SEA=season(),SCL={au:[[0xd9a23a,0x9a9e3c,0xe0802c,0x6f9a3a],[0xf0c445,0xc98f2e,0xd8622a,0xa8b04a]],wi:[[0x4a7d42,0x557f3e,0x3d6e3d,0x5f8a48],[0x5f8f4e,0x6a9450,0x4f8048,0x76a058]]}[SEA]||[[0x3f8f3a,0x4f9e3c,0x2f7d3a,0x5aa845],[0x5aa848,0x66b34a,0x449545,0x74bd52]];
  const nC=c=>night?new T.Color(c).multiplyScalar(.66).getHex():c;
  const LF=SCL[0].map(c=>new T.MeshStandardMaterial(LVm(nC(c)))),LF2=SCL[1].map(c=>new T.MeshStandardMaterial(LVm(nC(c))));
  const BLS=new T.MeshStandardMaterial(LVm(night?0xc0789a:0xf590b8)),FRT=M(0xff9a1f,{roughness:.5});
  const tree=(x,z,p,s=1)=>{const h=Math.abs(Math.round(x*7+z*13)),kind=h%3,bl=h%(SEA==='sp'?3:9)===0,G=new T.Group();G.position.set(x,0,z);G.scale.setScalar(s);G.rotation.y=h*.7;(p||S).add(G);
    const tall=kind===1,th=tall?1.75:1.15,m1=LF[h%4],m2=bl?BLS:LF2[(h>>2)%4];
    const tk=add(TRK,bark,0,th/2,0,G);tk.scale.set(1,th,1);
    [[.55,0],[-.5,2.2],[.45,4.1]].forEach(([lean,ry])=>{const b=new T.Group();b.position.set(0,th*.82,0);b.rotation.set(0,ry,0);G.add(b);const m=add(BRG,bark,0,.3,0,b);m.scale.set(1,.65,1);b.children[0].rotation.z=lean;m.position.x=-Math.sin(lean)*.3});
    const cl=tall?[[0,2.35,0,.72,1.35],[.32,1.85,.18,.58,1],[-.3,1.95,-.2,.58,1],[0,3.05,0,.48,.9],[.1,2.6,-.35,.45,.9]]
      :[[0,1.95,0,.95,.78],[.55,1.75,.2,.65,.72],[-.5,1.8,-.25,.7,.72],[.1,1.72,-.55,.6,.72],[-.15,1.78,.55,.6,.72],[.05,2.45,.05,.62,.72]];
    const tg=Math.hypot(x,z)>26?TGL:TG;cl.forEach(([a,b,c,r,sy],i)=>{const m=add(tg[(h+i)%3],i%2||(bl&&i>2)?m2:m1,a,b,c,G);m.scale.set(r,r*sy,r);m.rotation.y=i*1.3});
    if(kind===2&&!bl)for(let i=0;i<9;i++){const a=i*2.4+h,y=1.45+(i*37%10)/10*.95,r=Math.sqrt(Math.max(.05,1-((y-1.95)/.8)**2))*.98;add(FRG,FRT,Math.cos(a)*r,y,Math.sin(a)*r,G)}};
  const anim=[];S.userData.anim=anim;
  // (v13.6) نخلة واقعية: جذع منحنٍ بحلقات، وسعف متدلٍّ، وعذوق تمر
  const PTG=new T.CylinderGeometry(.11,.14,.52,8),PRG=new T.TorusGeometry(.125,.025,3,8),FRDG=new T.SphereGeometry(1,8,3),DTG=new T.SphereGeometry(.06,5,3); // (v17.8) أخفّ: السعف مسطّح فلا تظهر الفروق
  const ptr=M(night?0x5a4630:0x8a6a45,{roughness:1}),frd=M(night?0x2d6b30:0x3f9a3c,{roughness:.8,side:T.DoubleSide}),frd2=M(night?0x3a7a35:0x5aac45,{roughness:.8,side:T.DoubleSide}),dtm=M(0xb5651d,{roughness:.6});
  const palm=(x,z,p)=>{const h=Math.abs(Math.round(x*11+z*5)),G=new T.Group();G.position.set(x,0,z);G.rotation.y=h*.9;(p||S).add(G);
    let px=0,py=0;for(let i=0;i<5;i++){const lx=.018*i*i,m=add(PTG,ptr,lx,py+.26,0,G);m.rotation.z=-.035*i;const r=add(PRG,ptr,lx,py+.5,0,G);r.rotation.x=Math.PI/2;px=lx;py+=.5}
    const C=new T.Group();C.position.set(px+.05,py,0);G.add(C);
    for(let k=0;k<10;k++){const f=new T.Group();f.rotation.y=k/10*Math.PI*2+(k%2)*.2;f.rotation.x=k%2?.55:.25;C.add(f);
      const l1=add(FRDG,k%2?frd:frd2,0,0,.62,f);l1.scale.set(.2,.03,.68);l1.castShadow=true;
      const f2=new T.Group();f2.position.z=1.2;f2.rotation.x=.55;f.add(f2);const l2=add(FRDG,k%2?frd:frd2,0,0,.5,f2);l2.scale.set(.16,.025,.55)}
    for(let i=0;i<7;i++){const a=i*.9;add(DTG,dtm,Math.cos(a)*.16,-.12-(i%3)*.06,Math.sin(a)*.16,C)}};
  // الأرض والطرق
  const g=add(new T.CircleGeometry(900,64),M(night?0x3f9149:0x5cc455),0,-.06,0); // (v17.6) أخفض قليلًا: من مقعد السائق كان العشب يظهر فوق الإسفلت (دقّة العمق)
 g.rotation.x=-Math.PI/2;
  // بقع عشب بدرجات مختلفة
  const pM=[M(night?0x4aa052:0x72d460),M(night?0x37853f:0x4fb44c)];
  for(let i=0;i<26;i++){const a=i*2.4,r=8+(i*37%22);if(Math.abs(Math.cos(a)*r)<S0+2+i%3+.3)continue;const p=add(new T.CircleGeometry(2+i%3,20),pM[i%2],Math.cos(a)*r,.004,Math.sin(a)*r);p.rotation.x=-Math.PI/2;p.receiveShadow=true;p.castShadow=false}
  // (v12.4) سهل أخضر ممتد بلا نهاية: سلسلة جبال واقعية غربًا (عشب ← صخر ← ثلج)، وبحر متدرّج شرقًا، والطريق يغيب في الأفق
  const WIN=winter();
  const NS=(x,z)=>{const h=(i,j)=>{const t=Math.sin(i*127.1+j*311.7)*43758.5453;return t-Math.floor(t)},xi=Math.floor(x),zi=Math.floor(z),fx=x-xi,fz=z-zi,
    u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz),a=h(xi,zi),b=h(xi+1,zi),c=h(xi,zi+1),d=h(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const FBM=(x,z,o)=>{let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*NS(x*f,z*f);a*=.5;f*=2.03}return s};
  {const X0=-46,W=260,L=1200,g=new T.PlaneGeometry(W,L,60,160);g.rotateX(-Math.PI/2);g.translate(X0-W/2,0,-200);
    const P=g.attributes.position,col=[],C=new T.Color(),cG=new T.Color(night?0x2f6a3a:0x5f9e4c),cG2=new T.Color(night?0x3a5a3a:0x8a9a5a),
      cR=new T.Color(night?0x55606e:0x8d8478),cR2=new T.Color(night?0x6a7280:0xa9a196),cS=new T.Color(night?0xdfe8f5:0xffffff),cH=new T.Color(night?0x2a3a6e:0xb8d8f0);
    for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i),d=X0-x,rise=Math.min(1,Math.max(0,d/55));
      const r=1-Math.abs(2*FBM(x*.012+7,z*.012,4)-1),n=FBM(x*.035,z*.035,4),far=Math.min(1,Math.max(0,(d-18)/90));
      const y=d<=0?0:rise*rise*(5+far*(26+66*r*r)+14*n)-.4;P.setY(i,y);
      const SL=WIN?14:0,sn=y>46-SL+12*n?1:y>36-SL+12*n?(y-36+SL-12*n)/10:0,rk=Math.min(1,Math.max(0,(y-7-6*n)/14));
      C.copy(cG).lerp(cG2,n);C.lerp(n>.5?cR2:cR,rk);C.lerp(cS,sn);C.lerp(cH,Math.min(.5,Math.max(0,(d-30)/260)));col.push(C.r,C.g,C.b)}
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeVertexNormals();
    const mt=new T.MeshStandardMaterial({vertexColors:true,roughness:.95,flatShading:false,fog:false,emissive:night?0x1c2a40:0x000000});
    const m=new T.Mesh(g,mt);m.receiveShadow=false;S.add(m);
    // صنوبر على سفوح الجبال وصفّ أشجار بين السهل والجبل
    const pine=M(night?0x1f5a34:0x2e7d45,{flatShading:true}),pine2=M(night?0x24653a:0x37904f,{flatShading:true}),ptr=M(0x6b4423);
    for(let i=0;i<70;i++){const z=-420+i*9+(i*37%7),x=X0-5-(i*53%14),d=X0-x,y=Math.min(1,d/55)**2*(5+16*FBM(x*.035,z*.035,4))-.4,s=1.4+(i%4)*.35;
      add(new T.CylinderGeometry(.18*s,.24*s,1*s,6),ptr,x,y+.5*s,z).castShadow=false;
      // (v13.6) صنوبر بطبقات (ثلاث مخاريط متدرّجة) بدل مخروط واحد
      [[1.2,1.5,1.45],[.95,1.3,2.25],[.65,1.1,3]].forEach(([r,hh,yy],k)=>{const c=add(new T.ConeGeometry(r*s,hh*s,9),k===1?pine2:pine,x,y+yy*s,z);c.castShadow=false;c.rotation.y=i+k})}
    for(let i=0;i<14;i++){const z=-120+i*12,x=-28-(i%3)*2;if(Math.abs(z+22)<9||z>-31&&z<-5||nearVil(x,z))continue;tree(x,z,null,1.3+(i%3)*.2)}}
  // البحر والشاطئ (لون متدرّج: فيروزي قرب الشاطئ ← أزرق عميق)
  {const SX=22,LL=1600,sand=M(night?0xb8a675:0xf2dca0);
    const b=add(new T.PlaneGeometry(6,LL),sand,SX-1,.012,0);b.rotation.x=-Math.PI/2;b.castShadow=false;
    const sg=new T.PlaneGeometry(700,LL,40,1);sg.rotateX(-Math.PI/2);sg.translate(SX+350,.03,0);
    const sc=[],c1=new T.Color(night?0x1f4f6e:0x5fd0e0),c2=new T.Color(night?0x0c2440:0x1e6fc0),c3=new T.Color(night?0x081a30:0x15529a),C=new T.Color(),SP=sg.attributes.position;
    for(let i=0;i<SP.count;i++){const u=Math.min(1,(SP.getX(i)-SX)/60);C.copy(c1).lerp(c2,u);if(u>=1)C.lerp(c3,Math.min(1,(SP.getX(i)-SX-60)/200));sc.push(C.r,C.g,C.b)}
    sg.setAttribute('color',new T.Float32BufferAttribute(sc,3));
    const w=new T.Mesh(sg,new T.MeshStandardMaterial({vertexColors:true,roughness:.25,metalness:.1}));S.add(w);
    const foam=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75});
    for(let k=0;k<3;k++){const f=new T.Mesh(new T.PlaneGeometry(.35,LL),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75}));f.rotation.x=-Math.PI/2;S.add(f);anim.push(t=>{const u=(t*.25+k/3)%1;f.position.set(fX(SX+2.2+u*5),.04,0);f.material.opacity=(night?.4:.75)*(1-u)})}
    // قوارب شراعية تتهادى
    [[34,-20,0xff6b6b],[46,6,0xffd23f],[30,22,0x4fc3ff],[70,-70,0xffffff],[90,30,0xff9f43]].forEach(([x,z,c],k)=>{const B=new T.Group();B.position.set(x,0,z);S.add(B);
      add(new T.BoxGeometry(1.2,.5,3),M(0x8b5a2b),0,.25,0,B);add(new T.CylinderGeometry(.06,.06,3,6),M(0xeeeeee),0,1.8,0,B);
      const sl=add(new T.ConeGeometry(1,2.4,3),M(c,{side:T.DoubleSide}),0,1.9,.4,B);sl.scale.set(.1,1,1);if(x>60)B.scale.setScalar(1.6);
      anim.push(t=>{B.position.y=Math.sin(t*1.2+k)*.15;B.rotation.z=Math.sin(t*.9+k)*.06;B.position.z=z+Math.sin(t*.05+k)*6})});
    // نخيل على الشاطئ
    for(let z=-150;z<=80;z+=11)if(Math.abs(z+4.6)>3)palm(SX-2.2,z,null)}
  // (v12.4) ثلج يتساقط في أيام الشتاء (كانون الأول، كانون الثاني، شباط) — City3D.debugSnow للتجربة
  if(WIN){const N=2000,pos=new Float32Array(N*3),sp=new Float32Array(N),cv=document.createElement('canvas');cv.width=cv.height=32;
    const cx=cv.getContext('2d'),gr=cx.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,'rgba(255,255,255,.8)');gr.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=gr;cx.fillRect(0,0,32,32);
    for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*110;pos[i*3+1]=Math.random()*40;pos[i*3+2]=(Math.random()-.5)*110-8;sp[i]=1.2+Math.random()*1.6}
    const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(pos,3));
    const pm=new T.PointsMaterial({size:.95,map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,color:0xffffff});
    const flakes=new T.Points(sg,pm);flakes.frustumCulled=false;S.add(flakes);let last=0;
    anim.push(t=>{const dt=Math.min(.1,last?t-last:0);last=t;for(let i=0;i<N;i++){let y=pos[i*3+1]-sp[i]*dt;if(y<0)y+=40;pos[i*3+1]=y;pos[i*3]+=Math.sin(t*.8+i)*dt*.35}sg.attributes.position.needsUpdate=true});
    // طبقة ثلج خفيفة على العشب
    for(let i=0;i<30;i++){const a=i*2.1,r=6+(i*41%40),p=add(new T.CircleGeometry(1.5+i%4,18),M(0xf4f8ff,{transparent:true,opacity:.75}),Math.cos(a)*r,.008,Math.sin(a)*r-6);p.rotation.x=-Math.PI/2;p.castShadow=false}}
  // أشجار متفرقة على طول السهل
  [[-23,-36],[16.5,-41],[-16,-48],[12,-52],[-6,-62],[10,-72],[-14,-80],[6,-92],[-12,24.5],[16,27.5],[-15,34],[17,45]].forEach(([x,z])=>nearVil(x,z)||nearHs(x,z)||tree(x,z,null,1.3));
  for(let i=0;i<40;i++){const z=-110-i*8,x=(i%2?1:-1)*(6+(i*29%12));if(!nearVil(x,z)&&!nearHs(x,z))tree(x,z,null,1.2+(i%3)*.2)}
  // (v14.8) أشجار على جانبي الشارع جنوبًا أيضًا حتى يمتدّ المنظر
  for(let i=0;i<34;i++){const z=48+i*9,x=(i%2?1:-1)*(6+(i*23%11));if(!nearVil(x,z)&&!nearHs(x,z)&&Math.abs(z-NBZ)>4&&Math.abs(z-RVZ)>4)tree(x,z,null,1.2+(i%3)*.2)}
  // الطرق بلون دافئ وأرصفة بيضاء — الطريق الرئيسي طويل جدًا يغيب في الضباب
  // (v14.9) طلب الشيخ: الشارع أسود (إسفلت)، والخطوط بيضاء، والرصيف مخطّط أسود وأبيض
  const road=M(night?0x2a2c31:0x3b3e44,{roughness:.95}),curb=M(0xffffff),line=M(night?0xe8e8e8:0xffffff);
  // (v14.8) طلب الشيخ: شارع ممتد لا تُرى نهايته — يمتد ١٢٠٠ في كل اتجاه فيغيب في الضباب من الجهتين
  const RL=2400,RZ=0;
  const RDf=m=>{m.userData.rd=1;return m};const rd=RDf(add(new T.PlaneGeometry(2*R1,RL),road,0,.01,RZ));rd.rotation.x=-Math.PI/2;rd.castShadow=false;
  {const cg=new T.BoxGeometry(.2,.14,1),n=1400,o=new T.Object3D(),cB=new T.Color(0x1c1c1c),cW=new T.Color(night?0xcfcfcf:0xffffff);
    [-R1,R1].forEach(x=>{const im=RDf(new T.InstancedMesh(cg,M(0xffffff),n));for(let i=0;i<n;i++){o.position.set(x,.07,RZ-n/2+.5+i);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,i%2?cB:cW)}
      im.instanceColor.needsUpdate=true;im.receiveShadow=true;im.frustumCulled=false;S.add(im)})}
  [-4.6,4.6].forEach(z=>{const r=RDf(add(new T.PlaneGeometry(28+2*DX,1.8),road,0,.012,z));r.rotation.x=-Math.PI/2});
  // (v16.2) أربع حارات: خط متقطّع بين حارتي كل اتجاه، وخطّان متصلان في الوسط
  {const lg=new T.PlaneGeometry(.16,1.4);lg.rotateX(-Math.PI/2);const n=Math.floor(RL/3);[-R1/2,R1/2].forEach(x=>{const im=RDf(new T.InstancedMesh(lg,line,n)),o=new T.Object3D();
    for(let i=0;i<n;i++){o.position.set(x,.02,RZ+RL/2-1-i*3);o.updateMatrix();im.setMatrixAt(i,o.matrix)}S.add(im)});
    [-.13,.13].forEach(x=>{const l=RDf(add(new T.PlaneGeometry(.09,RL),line,x,.021,RZ));l.rotation.x=-Math.PI/2;l.castShadow=false})}
  // زهور ملوّنة كثيرة على العشب
  {const fl=[0xff5c8a,0xffd23f,0xb07cff,0xff8c42,0xffffff,0x4fc3ff,0xff4f4f],geo=new T.SphereGeometry(.13,6,4),im=new T.InstancedMesh(geo,new T.MeshStandardMaterial({roughness:.6}),240);
    const o=new T.Object3D(),col=new T.Color();let n=0,k=0;
    const bad=(x,z)=>x<-2.6&&x>XL-.4&&Math.abs(z)<HZ+.35||Math.abs(x)<2.8||x<-2.4&&x>-11.2&&z<-14.8&&z>-25||Math.abs(Math.abs(z)-4.6)<1.4&&Math.abs(x)<15||Object.values(SPOT).some(([a,b])=>Math.hypot(x-a,z-b)<3.9)||Math.hypot(x,z)>34||x>17||NOFL(x,z)||Math.abs(x-FARM[0])<3.6&&Math.abs(z-FARM[1])<3.8;
    while(n<240&&k<4000){k++;const a=Math.random()*Math.PI*2,r=3+Math.random()*31,x=Math.cos(a)*r,z=Math.sin(a)*r;if(bad(x,z))continue;
      o.position.set(x,.09,z);o.scale.setScalar(.7+Math.random()*.6);o.updateMatrix();im.setMatrixAt(n,o.matrix);im.setColorAt(n,col.setHex(fl[n%fl.length]));n++}
    im.count=n;S.add(im)}
  // شجيرات صغيرة على أطراف الطرق
  const bush=M(0x4cc35e);[[-3,10.5],[3,-10.5],[-3,-11.5],[3,11.5],[-12,6.2],[12,-6.2],[-7,6.2],[7,-6.2],[7,6.2],[-7,-6.2]].forEach(([x,z])=>{const b=add(new T.SphereGeometry(.55,12,8),bush,x,.35,z);b.scale.set(1.3,.8,1)});
  if(!night){
    // غيوم تتحرك
    // (v13.8) غيوم أكثر واقعية: كتل منتفخة كثيرة بأحجام مختلفة وقاعدة أغمق قليلًا؛ يوم المطر غيوم رمادية أكثر وأكبر
    // (v14.0) طلب الشيخ: غيوم بيضاء جميلة. كتل ناعمة مستديرة (قاعدة عريضة مسطّحة وقمّة منتفخة) بمادة تكاد تضيء بنفسها فلا يظهر عليها رمادي الظل.
    // عددها من طقس المدينة الحقيقي: صافٍ ٤، عادي ٨، غائم ١٣؛ ويوم المطر رمادية أكبر.
    // (v16.0) طلب الشيخ: غيوم أقرب للواقع. بدل الكرات صارت غيومًا ركامية ناعمة مرسومة (قمّة بيضاء مضيئة، قاعدة مسطّحة رمادية قليلًا،
    // حواف ضبابية)، كل غيمة من ٣–٥ طبقات متداخلة تتحرّك ببطء عالية في السماء؛ يوم المطر رمادية داكنة وأكثر، وفي الليل خافتة زرقاء
    const CLV=cloudLv(),CN=Math.round((RN?16:CLV===2?16:CLV===0?5:10)*(liteOn()?.5:1));
    const ctex=(seed,dark)=>{const W=256,H=160,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');let sd=seed*9301+49297;const r=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
      const blobs=[];for(let k=0;k<22;k++){const u=r(),cx=W*(.15+.7*u),top=1-Math.abs(u-.5)*1.6,rad=18+r()*26+top*20,cy=H*.66-r()*top*H*.32;blobs.push([cx,cy,rad])}
      for(let k=0;k<10;k++)blobs.push([W*(.12+.76*r()),H*.68+r()*6,14+r()*14]);
      blobs.forEach(([cx,cy,rad])=>{const g=x.createRadialGradient(cx,cy-rad*.25,rad*.1,cx,cy,rad);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.55,'rgba(255,255,255,.92)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,rad,0,7);x.fill()});
      // تظليل: القاعدة أغمق (رمادي مزرق) والقمّة بيضاء
      x.globalCompositeOperation='source-atop';const sh=x.createLinearGradient(0,H*.25,0,H*.82);
      sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(.6,dark?'rgba(90,98,112,.55)':'rgba(170,184,204,.35)');sh.addColorStop(1,dark?'rgba(70,76,88,.8)':'rgba(140,155,180,.55)');x.fillStyle=sh;x.fillRect(0,0,W,H);
      // قاعدة مسطّحة: نمحو ما تحت خط القاعدة بنعومة
      x.globalCompositeOperation='destination-out';const cut=x.createLinearGradient(0,H*.72,0,H*.84);cut.addColorStop(0,'rgba(0,0,0,0)');cut.addColorStop(1,'rgba(0,0,0,1)');x.fillStyle=cut;x.fillRect(0,H*.72,W,H*.28);
      const t=new T.CanvasTexture(c);return t};
    const TX=[0,1,2,3].map(k=>ctex(k+1,RN)),tint=night?0x6d7896:RN?0xc3c9d2:0xffffff,op=night?.55:RN?.95:.97;
    for(let i=0;i<CN;i++){const c=new T.Group(),rs=k=>{const x=Math.sin(i*12.9898+k*78.233)*43758.5453;return x-Math.floor(x)},n=3+(i%3),W0=(RN?46:30)+rs(1)*22;
      for(let j=0;j<n;j++){const m=new T.SpriteMaterial({map:TX[(i+j)%4],color:tint,transparent:true,opacity:op*(j?.85:1),depthWrite:false,fog:false}),sp=new T.Sprite(m),w=W0*(j?.55+rs(j+5)*.35:1);
        sp.scale.set(w,w*.625,1);sp.position.set(j?(rs(j+10)-.5)*W0*.7:0,j?(rs(j+20)-.3)*W0*.12:0,j?(rs(j+30)-.5)*8:0);c.add(sp)}
      const ca=i/CN*Math.PI*2+rs(40),cr=70+rs(41)*90,cy=(RN?30:38)+rs(42)*14,spd=.004+rs(43)*.003;S.add(c);
      anim.push(t=>{const a=ca+t*spd;c.position.set(Math.cos(a)*cr,cy,Math.sin(a)*cr)})}
    // طيور تحلّق
    const bm=M(0x445566);for(let i=0;i<4;i++){const b=new T.Group();const w1=add(new T.BoxGeometry(.7,.05,.25),bm,-.35,0,0,b),w2=add(new T.BoxGeometry(.7,.05,.25),bm,.35,0,0,b);
      S.add(b);const r=14+i*4,sp=.25+i*.05,ph=i*1.7;anim.push(t=>{const a=t*sp+ph;b.position.set(Math.cos(a)*r,10+i,Math.sin(a)*r);b.rotation.y=-a;const f=Math.sin(t*8+i)*.5;w1.rotation.z=f;w2.rotation.z=-f})}
    // فراشات ملوّنة
    // (v13.8) في الربيع (آذار–أيار) فراشات أكثر، وفي المطر تختبئ
    const SPR=[2,3,4].includes(new Date().getMonth());
    (RN?[]:SPR?[0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a,0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a]:[0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a]).forEach((c,i)=>{const b=new T.Group(),wm=new T.MeshStandardMaterial({color:c,side:T.DoubleSide});
      const w1=new T.Mesh(new T.CircleGeometry(.22,8),wm),w2=new T.Mesh(new T.CircleGeometry(.22,8),wm);w1.position.x=-.2;w2.position.x=.2;b.add(w1,w2);S.add(b);
      const cx=[-9,9,-9,9,-12,12][i%6]+(i>5?3:0),cz=[-2,-2,4,3,-12,12][i%6]+(i>5?-6:0);anim.push(t=>{const a=t*.7+i;b.position.set(fX(cx+Math.cos(a)*2.2),1.2+Math.sin(t*2+i)*.4,cz+Math.sin(a*1.3)*2.2);b.rotation.y=-a;const f=Math.sin(t*14+i)*1.1;w1.rotation.y=f;w2.rotation.y=-f})})}
  else{
    // يراعات مضيئة بالليل
    const ff=new T.MeshBasicMaterial({color:0xfff27a});for(let i=0;i<40;i++){const f=new T.Mesh(new T.SphereGeometry(.08,6,4),ff);const a=Math.random()*6.28,r=4+Math.random()*26,y0=.6+Math.random()*1.8;
      f.position.set(Math.cos(a)*r,y0,Math.sin(a)*r);S.add(f);const ph=Math.random()*6;anim.push(t=>{f.position.y=y0+Math.sin(t*1.5+ph)*.3;f.visible=Math.sin(t*2.2+ph)>-.4})}
    // قمر
    // (v14.5) 🌙 القمر حسب الشهر الهجري: هلال في أوله، بدر في منتصفه، ثم يصغر. المسه لتعرف الشهر
    const hj=hijri();if(hj&&hj.d>=2&&hj.d<=28){const mc=document.createElement('canvas');mc.width=mc.height=128;const cx=mc.getContext('2d'),im=cx.createImageData(128,128),pp=Math.min(.985,(hj.d-.5)/29.5);
      for(let j=0;j<128;j++)for(let i=0;i<128;i++){const X=(i-64)/58,Y=(j-64)/58,r2=X*X+Y*Y;if(r2>1)continue;const o=(j*128+i)*4,sy=Math.sqrt(1-Y*Y),e=Math.min(1,(1-Math.sqrt(r2))*25);
        const lit=pp<=.5?X>Math.cos(2*Math.PI*pp)*sy:-X>Math.cos(2*Math.PI*(1-pp))*sy;if(lit){im.data[o]=255;im.data[o+1]=244;im.data[o+2]=196;im.data[o+3]=255*e}else{im.data[o]=70;im.data[o+1]=82;im.data[o+2]=120;im.data[o+3]=55*e}}
      cx.putImageData(im,0,0);const ms=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(mc),fog:false,transparent:true,depthWrite:false}));ms.scale.set(34,34,1);ms.position.set(-150,135,-260);ms.userData.act='moon';S.add(ms)}}
  // مصابيح الشوارع: بالليل تضيء وتنير الطريق حولها
  const pole=M(0x4a4f5a),bulb=M(night?0xfff1b0:0xf1efe6,night?{emissive:0xffd860,emissiveIntensity:1.6}:{});
  const pool=new T.MeshBasicMaterial({color:0xffd870,transparent:true,opacity:.28,depthWrite:false});
  const LAMPS=[[-2.8,-13],[2.82,-13],[-2.8,-7.5],[2.82,-7.5],[-2.8,-1.8],[2.82,-1.8],[-2.8,7.5],[2.82,7.5],[-2.8,13],[2.82,13],[-10,5.8],[10,5.8],[-10,-5.8],[10,-5.8]];
  // (v13.5) رصيف حجري على جانبي الطريق الرئيسي داخل المدينة (الطفل يمشي على الأيسر)، وممرّات مشاة مخطّطة عند التقاطعين
  {const sw=M(night?0x9a958c:0xd8d3c8);[-1,1].forEach(k=>{const r=RDf(add(new T.PlaneGeometry(S1-R1,140),sw,k*(R1+S1)/2,.015,-2));r.rotation.x=-Math.PI/2;r.castShadow=false});
    const zb=M(0xffffff);[-4.6,4.6].forEach(z=>{for(let x=-R1+.45;x<=R1-.44;x+=.55){const s=RDf(add(new T.PlaneGeometry(.3,1.3),zb,x,.022,z));s.rotation.x=-Math.PI/2;s.castShadow=false}})
    // (v13.9) إشارة «🚸 عبور المشاة» على جانبي كل ممرّ
    const sp=M(0x4a4f5a);[-4.6,4.6].forEach(z=>[-1,1].forEach(k=>{const x=k*2.95,zz=z+k*.95;add(new T.CylinderGeometry(.04,.05,2,6),sp,x,1,zz);
      const s=textSprite(T,'🚸 عبور','rgba(30,90,200,.95)','#ffffff');s.scale.set(1.5,.33,1);s.position.set(x,2.15,zz);S.add(s)}))}
  LAMPS.forEach(([x,z])=>{const s=x<0?1:-1,LG=new T.Group();LG.position.set(x,0,z);S.add(LG);add(new T.CylinderGeometry(.07,.1,3.2,8),pole,0,1.6,0,LG);add(new T.BoxGeometry(.9,.07,.07),pole,s*.43,3.18,0,LG);
    const b=add(new T.SphereGeometry(.19,12,8),bulb,s*.85,3.06,0,LG);b.castShadow=false;
    if(night){const p=new T.Mesh(new T.CircleGeometry(2.3,24),pool);p.rotation.x=-Math.PI/2;p.position.set(s*.85,.03,0);LG.add(p)}});
  if(night)[[0,-10],[0,-1.8],[0,7.5],[-9,0],[9,0]].forEach(([x,z])=>{const l=new T.PointLight(0xffd27a,1.1,15,1.6);l.position.set(x,2.8,z);S.add(l)});
  const marks=[];const mark=(G,e,col,y,x,sc)=>{const s=markSprite(T,e,col,sc);s.position.set(x||0,y,0);s.userData.y=y;G.add(s);marks.push(s)};

  // ---- البنايات ----
  function plot(G){box(4.6,.1,4.6,M(0xc9a774),0,.05,0,G);const fm=M(0xa0703c);
    for(let i=-2.3;i<=2.31;i+=.575){box(.1,.7,.1,fm,i,.35,2.3,G);box(.1,.7,.1,fm,i,.35,-2.3,G);box(.1,.7,.1,fm,2.3,.35,i,G);box(.1,.7,.1,fm,-2.3,.35,i,G)}
    [2.3,-2.3].forEach(z=>box(4.6,.08,.08,fm,0,.55,z,G));[2.3,-2.3].forEach(x=>box(.08,.08,4.6,fm,x,.55,0,G));return 1.4}
  function scaffold(G){const m=add(new T.BoxGeometry(3.2,2.2,3.2),M(0xe9dcc3,{transparent:true,opacity:.75}),0,1.1,0,G);m.castShadow=false;
    const w=M(0xb07a3a);[[-1.7,-1.7],[1.7,-1.7],[-1.7,1.7],[1.7,1.7]].forEach(([x,z])=>box(.12,3,.12,w,x,1.5,z,G));
    [1,2].forEach(y=>{box(3.5,.1,.1,w,0,y,1.7,G);box(3.5,.1,.1,w,0,y,-1.7,G);box(.1,.1,3.5,w,1.7,y,0,G);box(.1,.1,3.5,w,-1.7,y,0,G)});
    box(.15,4,.15,M(0xf0b429),2.2,2,-1.2,G);box(2.4,.15,.15,M(0xf0b429),1.2,4,-1.2,G);return 4.3}
  const DRAW={
    m(G,l){const dome=M(l>=3?0xffc53a:0x3aa39a,l>=3?{metalness:.6,roughness:.3}:{});
      const s=l===1?1:l===2?1.25:1.5,bw=3*s,bh=1.8*s;
      box(bw,bh,bw,stone,0,bh/2,0,G);
      add(new T.SphereGeometry(bw*.38,24,16,0,Math.PI*2,0,Math.PI/2),dome,0,bh,0,G);
      add(new T.ConeGeometry(.08,.5,8),M(0xffd34d),0,bh+bw*.38+.25,0,G);
      box(.9,1.3,.06,M(0x2f7d5a),0,.65,bw/2+.04,G);
      for(let k=-1;k<=1;k+=2)box(.5,.7,.06,winM,k*bw*.3,bh*.6,bw/2+.03,G);
      let top=bh+bw*.38+.6;
      (l===2?[1]:l===3?[1,-1]:[]).forEach(k=>{const x=k*(bw/2-.35),z=bw/2-.35,mh=bh*2.2; // (v16.3) المآذن على زوايا الجامع نفسه (كانت إحداها على الرصيف)
        add(new T.CylinderGeometry(.32,.4,mh,16),stone,x,mh/2,z,G);
        add(new T.CylinderGeometry(.5,.5,.18,16),stone,x,mh*.82,z,G);
        add(new T.ConeGeometry(.36,.9,16),dome,x,mh+.45,z,G)});
      return top},
    k(G,l){if(l===1){box(3,1.6,2.6,M(0xf7e9d4),0,.8,0,G);prism(3.4,1.1,2.9,M(0xc0563b),0,1.6,0,G);
        box(.7,1,.06,wood,0,.5,1.33,G);box(.6,.5,.06,winM,-.95,.95,1.33,G);box(.6,.5,.06,winM,.95,.95,1.33,G);return 2.7}
      const s=l===3?1.2:1,w=4*s,h=2.2*s,d=3*s,wall=M(0xf3efe6),col=M(0xffffff);
      box(w,h,d,wall,0,h/2,0,G);
      for(let i=0;i<5;i++)add(new T.CylinderGeometry(.14,.16,h,10),col,-w/2+.35+i*(w-.7)/4,h/2,d/2+.45,G);
      box(w+.3,.25,d+1.1,M(0xd9cfb8),0,h+.12,.25,G);prism(w+.3,.9*s,d+1.1,M(0xd9cfb8),0,h+.25,.25,G);
      box(.8,1.2,.06,M(0x7a5230),0,.6,d/2+.03,G);[-1,1].forEach(k=>box(.55,.8,.06,winM,k*w*.3,h*.55,d/2+.03,G));
      if(l===3){add(new T.SphereGeometry(1.1,20,12,0,Math.PI*2,0,Math.PI/2),M(0x9fd3f0,{transparent:true,opacity:.65,roughness:.1,metalness:.3}),0,h+.25,-.4,G);return h+1.6}
      return h+1.3},
    q(G,l){if(l===1){add(new T.CylinderGeometry(1.7,1.7,.06,24),M(0x2fa36b),0,.03,0,G);
        [[-1.1,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]].forEach(([x,z])=>add(new T.CylinderGeometry(.06,.06,1.6,6),wood,x,.8,z,G));
        const c=add(new T.ConeGeometry(2,1,4),M(0xf0d98a),0,2.1,0,G);c.rotation.y=Math.PI/4;
        box(.5,.35,.35,wood,0,.2,0,G);prism(.6,.25,.4,M(0xfff3d0),0,.38,0,G);return 3}
      const s=l===3?1.2:1,w=4*s,h=2*s,d=3*s;
      box(w,h,d,M(0xe9f5ec),0,h/2,0,G);box(w+.2,.35,d+.2,green,0,h+.17,0,G);
      box(1.1,1.4,.08,green,0,.7,d/2+.04,G);box(.75,1.2,.1,wood,0,.6,d/2+.06,G);
      [-1,1].forEach(k=>box(.7,.6,.06,winM,k*w*.3,h*.6,d/2+.03,G));
      if(l===3){palm(-w/2+.2,d/2+1,G);palm(w/2-.2,d/2+1,G);box(w*.6,h*.6,d*.7,M(0xe9f5ec),0,h+.35+h*.3,0,G);box(w*.6+.2,.25,d*.7+.2,green,0,h+.35+h*.6+.12,0,G);return h*1.65+1.2}
      return h+1.3},
    s(G,l){if(l===1){add(new T.CylinderGeometry(1.2,1.3,.2,20),M(0xa98a5e),0,.1,0,G);
        const pts=[[0,0],[.35,0],[.55,.3],[.6,.65],[.45,1],[.25,1.15],[.28,1.35],[0,1.35]].map(([a,b])=>new T.Vector2(a,b));
        add(new T.LatheGeometry(pts,20),M(0xc9874a),0,.2,0,G);add(new T.CylinderGeometry(.12,.1,.22,10),M(0xffffff),.75,.31,.2,G);return 2.1}
      const deco=l===3,wall=M(deco?0xeaf4fb:0xe2d6c0);
      box(3,2.4,1.6,wall,0,1.2,0,G);box(1.5,1.7,.1,M(deco?0x1d5f9a:0x8f7650),0,1.15,.81,G);
      box(.12,.3,.25,M(0xc0c7cc),0,1.5,.9,G);const st=box(.06,.7,.06,water,0,1.05,.95,G);st.castShadow=false;
      box(2.4,.45,.8,M(deco?0x5fb0e6:0xa98a5e),0,.22,1.3,G);const wt=add(new T.PlaneGeometry(2.2,.6),water,0,.46,1.3,G);wt.rotation.x=-Math.PI/2;
      if(deco)for(let i=0;i<6;i++)box(.5,.3,.08,M(i%2?0x2f7fc0:0x5fb0e6),-1.25+i*.5,2.25,.82,G);
      return 3.2},
    h(G,l){add(new T.CylinderGeometry(3,3,.08,32),M(night?0x3a8a3a:0x8fdc72),0,.04,0,G);tree(-1.6,-1.1,G);tree(1.6,-1.1,G);
      if(l>=2){tree(0,-1.9,G,1.2);box(1.4,.1,.45,wood,0,.45,.6,G);box(1.4,.4,.08,wood,0,.7,.4,G);[-.6,.6].forEach(x=>box(.08,.4,.4,wood,x,.2,.6,G));
        const fc=[0xff6b8a,0xffd23f,0xb07cff,0xff9f43,0xffffff];for(let i=0;i<14;i++){const a=i/14*Math.PI*2;add(new T.SphereGeometry(.14,8,6),M(fc[i%5]),Math.cos(a)*2.6,.15,Math.sin(a)*2.6,G)}}
      if(l>=3){add(new T.CylinderGeometry(.9,1,.35,24),stone,-1.2,.2,1.5,G);const w=add(new T.CylinderGeometry(.8,.8,.04,24),water,-1.2,.37,1.5,G);w.castShadow=false;
        add(new T.CylinderGeometry(.1,.14,.8,10),stone,-1.2,.6,1.5,G);add(new T.SphereGeometry(.28,12,8),water,-1.2,1.05,1.5,G);
        const rm=M(0xc0563b);[1.4,2.6].forEach(x=>{const a=box(.08,1.8,.08,rm,x,.9,1.3,G),b=box(.08,1.8,.08,rm,x,.9,1.9,G);a.rotation.x=.18;b.rotation.x=-.18});
        box(1.3,.08,.08,rm,2,1.75,1.6,G);box(.5,.06,.25,wood,2,.5,1.6,G);[1.85,2.15].forEach(x=>box(.02,1.2,.02,M(0x666666),x,1.1,1.6,G))}
      return l>=2?3.6:3}};
  // (v11.9) 🎒 مدرستي كبيرة (هكذا يراها الطفل): طابقان، ساعة كبيرة، برج جرس، علم، وساحة مسوّرة أمامها (الساحة خارج المجموعة لأنها أمام البناية)
  function school(G){const wall=M(0xffd166),wall2=M(0xffe39a),roofM=M(0xff6b6b),blue=M(0x4f8fe0),white=M(0xffffff),dk=M(0x222222);
    const W=7.4,H=4.4,D=4.6;box(W,H,D,wall,0,H/2,0,G);box(W+.1,.25,D+.1,white,0,H/2,0,G);box(W+.3,.3,D+.3,white,0,H+.15,0,G);
    prism(W+.6,1.8,D+.6,roofM,0,H+.3,0,G);
    // (v15.0) طلب الشيخ: مدرسة أكثر واقعية — قاعدة حجرية، نوافذ بإطارات بيضاء على كل الجهات، أعمدة عند المدخل، مكيّفات، وحزام أخضر
    box(W+.16,.32,D+.16,M(night?0x8a8070:0xb7a990),0,.16,0,G);box(W+.04,.14,D+.04,M(0x1fa463),0,H-.35,0,G);
    for(let r=0;r<2;r++)for(let i=0;i<6;i++){const x=-W/2+.75+i*(W-1.5)/5;[1,-1].forEach(sd=>{if(sd>0&&r===0&&Math.abs(x)<1)return;const zz=sd*(D/2+.03);
        box(.84,.99,.05,white,x,1.05+r*2.2,zz,G);box(.7,.85,.06,winM,x,1.05+r*2.2,zz+sd*.01,G);box(.03,.85,.07,white,x,1.05+r*2.2,zz+sd*.015,G);box(.9,.08,.14,white,x,.56+r*2.2,zz+sd*.05,G)})}
    for(let r=0;r<2;r++)[-1,0,1].forEach(k=>[1,-1].forEach(sd=>{const z=k*1.3,xx=sd*(W/2+.03);box(.05,.99,.84,white,xx,1.05+r*2.2,z,G);box(.06,.85,.7,winM,xx+sd*.01,1.05+r*2.2,z,G)}));
    [-.95,.95].forEach(x=>add(new T.CylinderGeometry(.11,.13,2.0,12),white,x,1.0,D/2+.52,G));
    [[-W/2-.18,2.9],[-W/2-.18,.9]].forEach(([x,y])=>{box(.32,.38,.75,white,x,y,-.6,G);box(.03,.26,.55,M(0x9aa3ab),x-.17,y,-.6,G)});
    box(1.7,2,.1,blue,0,1,D/2+.05,G);box(.05,2,.12,white,0,1,D/2+.08,G);box(2.2,.35,.6,white,0,2.15,D/2+.3,G);
    const ck=add(new T.CylinderGeometry(.6,.6,.12,24),white,0,H+.9,D/2+.32,G);ck.rotation.x=Math.PI/2;
    const rim=add(new T.TorusGeometry(.6,.06,8,24),blue,0,H+.9,D/2+.38,G);
    box(.06,.4,.05,dk,0,H+1.05,D/2+.4,G);box(.3,.06,.05,dk,.12,H+.9,D/2+.4,G);
    box(1.4,1.4,1.4,wall2,0,H+2.2,-.6,G);const bt=add(new T.ConeGeometry(1.15,1.1,4),roofM,0,H+3.45,-.6,G);bt.rotation.y=Math.PI/4;
    add(new T.SphereGeometry(.32,12,10),M(0xffc53a,{metalness:.5,roughness:.3}),0,H+2.15,.12,G);
    add(new T.CylinderGeometry(.07,.07,6,8),M(0xdddddd),W/2+.8,3,D/2+.6,G);
    // (v17.1) علم دولة الطفل (Flag من alqab.js) يرفرف على سارية المدرسة
    {const fe=V?(V.flg||'🇮🇶'):(window.Flag?Flag.get():'🇮🇶'),fg=new T.PlaneGeometry(1.5,.95,10,1),fm=new T.MeshStandardMaterial({map:flagTex(fe),side:T.DoubleSide,roughness:.7});
      if(night)fm.emissive=new T.Color(0x333333);const F=new T.Mesh(fg,fm);F.position.set(W/2+1.57,5.35,D/2+.6);G.add(F);const pa=fg.attributes.position,bx=[];for(let i=0;i<pa.count;i++)bx.push(pa.getX(i));
      anim.push(t=>{for(let i=0;i<pa.count;i++){const u=(bx[i]+.75)/1.5;pa.setZ(i,Math.sin(t*2.2-u*4)*.09*u)}pa.needsUpdate=true})}
    // الساحة أمام المدرسة: أرضية ملوّنة، سياج، بوابة نحو الطريق، زحليقة وأرجوحة
    const yz=D/2,yd=4.4;const yard=add(new T.PlaneGeometry(W+.6,yd),M(0xf3e2b3),0,.02,yz+yd/2,G);yard.rotation.x=-Math.PI/2;yard.castShadow=false;
    const c=add(new T.CircleGeometry(.9,24),M(0xff9f43),-1.6,.03,yz+2.2,G);c.rotation.x=-Math.PI/2;c.castShadow=false;
    const fc=[0xff6b6b,0xffd23f,0x4fc3ff,0x7be37b];let k=0;
    for(let x=-W/2-.3;x<=W/2+.31;x+=.55)box(.12,.6,.12,M(fc[k++%4]),x,.3,yz+yd,G);box(W+.6,.07,.07,white,0,.55,yz+yd,G);
    for(let z=yz;z<=yz+yd;z+=.55){if(z>yz+1.2&&z<yz+3)continue;box(.12,.6,.12,M(fc[k++%4]),W/2+.3,.3,z,G);box(.12,.6,.12,M(fc[k++%4]),-W/2-.3,.3,z,G)}
    const sl=box(.55,.07,2.2,M(0xff9f43),-2.6,.7,yz+2.3,G);sl.rotation.x=-.5;box(.1,1.4,.1,blue,-2.85,.7,yz+1.25,G);box(.1,1.4,.1,blue,-2.35,.7,yz+1.25,G);
    const rm=M(0xc0563b);[1.6,2.8].forEach(x=>{const a=box(.08,1.8,.08,rm,x,.9,yz+2.1,G),b=box(.08,1.8,.08,rm,x,.9,yz+2.7,G);a.rotation.x=.18;b.rotation.x=-.18});
    box(1.3,.08,.08,rm,2.2,1.75,yz+2.4,G);box(.5,.06,.25,wood,2.2,.5,yz+2.4,G);
    return H+3.6}
  // (v15.0) طلب الشيخ: بيت الطفل أجمل وأكثر واقعية وأضخم (أعرض وأقلّ ارتفاعًا): قاعدة حجرية، أحزمة بيضاء بين الطوابق، نوافذ بإطارات وعتبات،
  // شرفات بدرابزين في الطوابق العليا، باب خشبي بإطار ودرجتين ومصباح، مكيّفات على الجدار الجانبي، وسقف جملوني بقرميد أحمر وحافة بارزة ومدخنة.
  // الواجهة نحو الشارع (+x). المجموعة مكبّرة ×1.25 (BS.home).
  function home(G){const fh=1.42,hw=4.2,hd=4.2,wallC=[0xf6e3b4,0xf9d9d0,0xd8e9f3,0xdff0d2],wh=M(0xffffff),stn=M(night?0x8a8070:0xb7a990),frm=M(0xf4f1ea),dk=M(0x4a3426);
    box(hw+.16,.32,hd+.16,stn,0,.16,0,G);
    const win=(x,y,z,ax)=>{const w=.7,h=.62;if(ax==='x'){box(.06,h+.12,w+.12,frm,x,y,z,G);box(.07,h,w,winM,x+(x>0?.01:-.01),y,z,G);box(.16,.06,w+.2,wh,x,y-h/2-.07,z,G);box(.07,.03,w,frm,x+(x>0?.02:-.02),y,z,G)}
      else{box(w+.12,h+.12,.06,frm,x,y,z,G);box(w,h,.07,winM,x,y,z+(z>0?.01:-.01),G);box(w+.2,.06,.16,wh,x,y-h/2-.07,z,G);box(.03,h,.07,frm,x,y,z+(z>0?.02:-.02),G)}};
    for(let i=0;i<floors;i++){const y0=.32+i*fh,yc=y0+fh/2;box(hw,fh,hd,M(wallC[i%4]),0,yc,0,G);box(hw+.14,.1,hd+.14,wh,0,y0+fh-.02,0,G);
      [-1.25,1.25].forEach(z=>{if(!(i===0&&z>0))win(hw/2+.03,yc+.08,z,'x');win(-hw/2-.03,yc+.08,z,'x')});
      [-1.15,1.15].forEach(x=>{win(x,yc+.08,hd/2+.03,'z');win(x,yc+.08,-hd/2-.03,'z')});
      if(i>0){box(.35,.06,1.9,wh,hw/2+.2,y0+.06,0,G);for(let k=-4;k<=4;k++)box(.03,.42,.03,frm,hw/2+.36,y0+.27,k*.22,G);box(.04,.04,1.9,frm,hw/2+.36,y0+.48,0,G);
        box(.06,.95,.62,dk,hw/2+.02,y0+.5,0,G)}
      if(i<floors-1||floors===1){const ac=box(.32,.38,.75,wh,0,yc+.25,-hd/2-.2,G);ac.rotation.y=Math.PI/2;box(.03,.26,.55,M(0x9aa3ab),.17,yc+.25,-hd/2-.2,G)}}
    // الباب الأمامي (نحو الشارع) بإطار ودرجتين ومصباح
    box(.08,1.35,1.05,frm,hw/2+.04,.32+.68,1.0,G);box(.07,1.2,.85,M(0x7a4a26),hw/2+.06,.32+.62,1.0,G);add(new T.SphereGeometry(.035,8,6),M(0xffd23f,{metalness:.6}),hw/2+.12,.32+.62,.7,G);
    box(.5,.12,1.3,stn,hw/2+.25,.06,1.0,G);box(.28,.12,1.3,stn,hw/2+.14,.18,1.0,G);
    add(new T.SphereGeometry(.09,10,8),M(0xfff1b0,{emissive:0xffd860,emissiveIntensity:night?1.6:.2}),hw/2+.12,1.65,.35,G);
    // السقف: جملوني رباعي بقرميد أحمر، حافة بارزة، ومدخنة
    const top=.32+floors*fh;box(hw+.5,.12,hd+.5,M(0xe9e2d4),0,top+.06,0,G);
    const roof=add(new T.ConeGeometry((hw/2+.32)*Math.SQRT2,1.55,4),M(night?0x8a3a2c:0xc4513b,{roughness:.7}),0,top+.12+.775,0,G);roof.rotation.y=Math.PI/4;
    box(.4,.9,.4,M(0xb07a5a),-1,top+1.15,-.9,G);box(.5,.1,.5,wh,-1,top+1.62,-.9,G);
    return top+1.9}
  // (v18.4) 🧹 وسخ البيت يظهر في المدينة: أكياس نفايات وعلب وأوراق وبقع وذباب حسب الدرجة (١–٤)،
  // للطفل في مدينته، وللمدير حين يدخل مدينة أي طفل (V.dt). الأصدقاء لا يرونه.
  const DL=Math.max(0,Math.min(4,V?(V.dt|0):dirtLv()));
  function dirtHome(G,n,top){const bag=M(0x2b2b2b,{roughness:.6}),bag2=M(0x3d4a3a,{roughness:.6}),tie=M(0xd9c24a),can=M(0xb33a2a,{metalness:.4,roughness:.4}),can2=M(0x2f6fd0,{metalness:.4,roughness:.4}),pap=M(0xf2efe6),brn=M(0x6b5536,{roughness:1}),fly=new T.MeshBasicMaterial({color:0x111111});
    const SP=[[2.32,1.6],[2.32,-1.7],[1.2,2.6],[-1,-2.6],[2.32,-.95],[-2.6,1.4],[.3,2.62],[1.6,-2.6],[-2.6,-1.5],[2.32,1],[-1.8,2.6],[-.2,-2.62]],k=Math.min(SP.length,n*3),fl=[];
    for(let i=0;i<k;i++){const [x,z]=SP[i],t=i%4;
      if(t===0){const b=add(new T.SphereGeometry(.28,8,6),i%8?bag:bag2,x,.22,z,G);b.scale.set(1,.85,1);add(new T.ConeGeometry(.08,.16,6),tie,x,.48,z,G);fl.push([x,z])}
      else if(t===1){const c=add(new T.CylinderGeometry(.07,.07,.22,8),i%2?can:can2,x,.07,z,G);c.rotation.z=Math.PI/2;c.rotation.y=i}
      else if(t===2){const q=add(new T.BoxGeometry(.32,.02,.24),pap,x,.02,z,G);q.rotation.y=i*.7}
      else{const q=add(new T.CircleGeometry(.5,10),brn,x,.015,z,G);q.rotation.x=-Math.PI/2;q.castShadow=false}}
    if(n>=3){const st=M(0x5a4630,{transparent:true,opacity:.35,depthWrite:false});[[2.11,.9,1.3],[2.11,1.2,-1.5],[2.11,2.4,.2]].slice(0,n-1).forEach(([x,y,z])=>{const q=add(new T.CircleGeometry(.45,9),st,x,y,z,G);q.rotation.y=Math.PI/2;q.castShadow=false})}
    fl.slice(0,3).forEach(([x,z],j)=>{for(let q=0;q<2;q++){const f=add(new T.SphereGeometry(.035,4,3),fly,x,.7,z,G),ph=j*2.1+q*3.3;f.castShadow=false;anim.push(t=>{f.position.set(x+Math.cos(t*4+ph)*.3,.62+Math.sin(t*6+ph)*.1,z+Math.sin(t*4+ph)*.3)})}});
    mark(G,'🧹','#8a6dd6',top+1.3,0,1)}
  const P=Md&&Md.PARTS||{};
  Object.keys(SPOT).forEach(p=>{const G=new T.Group();G.position.set(SPOT[p][0],0,SPOT[p][1]);G.userData.p=p;S.add(G);let top,lb;
    if(p==='sc'){top=school(G);lb=textSprite(T,V?'🎒 المدرسة':'🎒 مدرستي','rgba(255,255,255,.92)','#5a4a1a')}
    else if(p==='home'){top=home(G);if(DL)dirtHome(G,DL,top);lb=textSprite(T,V?'🏡 بيت '+V.nick:'🏡 بيتي','rgba(255,255,255,.92)','#5a4a1a')}
    else{const l=LV(p);let mk=null;
      if(job&&job.p===p){if(job.ready){top=DRAW[p](G,job.to);mk=['✔','#1fa463']}else{top=scaffold(G);mk=['👷','#2f6fd0']}}
      else if(l>0){top=DRAW[p](G,l);if(l<3&&!job&&!need(p,l))mk=['⬆','#f0a020']}
      else{top=plot(G);mk=need(p,0)?['🔒','#9aa8b0']:['+','#f0a020']}
      const pr=P[p]||{};lb=textSprite(T,`${pr.e||''} ${pr.n||''}`,'rgba(255,255,255,.92)','#5a4a1a');
      if(mk&&!V)mark(G,mk[0],mk[1],top+.4,1.9)}
    // (v14.5) 🕌 نور أخضر هادئ يخرج من قمّة الجامع وقت الأذان (٢٠ دقيقة)
    if(p==='m'&&LV('m')>0){const gc=document.createElement('canvas');gc.width=gc.height=64;const gx=gc.getContext('2d'),gr=gx.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(200,255,220,1)');gr.addColorStop(.4,'rgba(80,230,150,.6)');gr.addColorStop(1,'rgba(40,200,120,0)');gx.fillStyle=gr;gx.fillRect(0,0,64,64);
      const hs=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc),transparent:true,depthWrite:false}));hs.scale.set(5,5,1);hs.position.set(0,top-.2,0);G.add(hs);
      const gl=new T.PointLight(0x7dffb0,1.6,16,1.5);gl.position.set(0,top,0);G.add(gl);hs.visible=gl.visible=false;let ck=-9,on=false;
      anim.push(t=>{if(t-ck>4){ck=t;on=adhanGlow()}hs.visible=gl.visible=on;if(on){const k=.75+Math.sin(t*2.2)*.25;hs.scale.set(5*k+1,5*k+1,1);gl.intensity=1.2+k}})}
    lb.position.set(0,top+.7,0);if(V||!(p==='home'||p==='m'&&LV('m')>0||p==='sc'))G.add(lb); // (v15.5) طلب الشيخ: لا نكتب أسماء الأشياء الواضحة (بيتي، الجامع، مدرستي)
   G.scale.setScalar(p==='m'?mScale(LV('m')||1):(BS[p]||1));if(p==='sc'){const k=BS.sc-1;G.position.x-=k*4.6;G.position.z-=k*4.4}});
  // أشجار المدينة (العطشى عليها 💧)
  const th=thirsty(),trees=[];
  TREES.forEach(([x,z],i)=>{const G=new T.Group();G.position.set(x,0,z);G.userData.t=i;S.add(G);tree(0,0,G);trees[i]=G;
    if(!V&&th.includes(i)&&!D.tr[i])mark(G,'💧','#3b9be0',3.3,0,.9)});
  // نفايات اليوم
  const lit=[];(V?[]:litter()).forEach(i=>{if(D.lt[i])return;const [x,z]=LITTER[i],G=new T.Group();G.position.set(x,0,z);G.userData.l=i;S.add(G);
    add(new T.SphereGeometry(.18,6,5),M(0xf4f4f4),-.15,.16,0,G);add(new T.CylinderGeometry(.1,.1,.3,8),M(0xd94040),.2,.1,.1,G).rotation.z=Math.PI/2;
    add(new T.BoxGeometry(.3,.04,.22),M(0xc9a774),0,.03,-.2,G);mark(G,'🧹','#8a6dd6',1.2,0,.8);lit[i]=G});
  // القطة العطشى (إذا بُني السبيل)
  let cat=null;if(!V&&LV('s')>=1&&!D.cat){cat=new T.Group();cat.position.set(CAT[0],0,CAT[1]);cat.userData.cat=1;S.add(cat);const fur=M(0xf2a65a),dk=M(0x333333);
    const b=add(new T.SphereGeometry(.28,10,8),fur,0,.3,0,cat);b.scale.set(1,.85,1.4);add(new T.SphereGeometry(.2,10,8),fur,0,.55,.35,cat);
    [-.1,.1].forEach(x=>{add(new T.ConeGeometry(.07,.15,4),fur,x,.75,.35,cat);add(new T.SphereGeometry(.03,6,4),dk,x,.58,.53,cat)});
    const tl=add(new T.CylinderGeometry(.04,.04,.5,6),fur,0,.5,-.45,cat);tl.rotation.x=-.6;
    add(new T.CylinderGeometry(.18,.14,.08,12),M(0x9aa8b0),0,.04,.75,cat);mark(cat,'🐱','#f08a3a',1.4,0,.9)}
  // (v12.1) 🐄 مزرعة بجانب البيت: بقرتان ودجاجات وحوض ماء وحظيرة. الطفل يطعم البقر والدجاج ويسقيها كل يوم (💎2 لكل عمل)
  {const FM=V?{}:(D.fm||{}),F=new T.Group();F.position.set(FARM[0],0,FARM[1]);F.userData.fk='any';S.add(F);
    const dirt=add(new T.PlaneGeometry(6,6.4),M(night?0x9c8a5c:0xd9c28a),0,.02,0,F);dirt.rotation.x=-Math.PI/2;dirt.castShadow=false;
    const fw=M(0xf4efe4);
    for(let x=-3;x<=3.01;x+=.6){box(.1,.75,.1,fw,x,.37,-3.2,F);if(Math.abs(x)>.75)box(.1,.75,.1,fw,x,.37,3.2,F)}
    for(let z=-3.2;z<=3.21;z+=.64){box(.1,.75,.1,fw,-3,.37,z,F);box(.1,.75,.1,fw,3,.37,z,F)}
    [.3,.6].forEach(y=>{box(6,.07,.07,fw,0,y,-3.2,F);box(.07,.07,6.4,fw,-3,y,0,F);box(.07,.07,6.4,fw,3,y,0,F);[-1,1].forEach(k=>box(2.25,.07,.07,fw,k*1.875,y,3.2,F))});
    // الحظيرة الحمراء
    const red=M(0xc0392b);box(2.4,1.7,1.6,red,1.3,.85,-2.2,F);prism(2.7,.9,1.8,M(0x8e2b22),1.3,1.7,-2.2,F);
    box(.9,1.1,.06,fw,1.3,.55,-1.38,F);[.9,-.9].forEach(r=>{const b=box(1.3,.08,.04,red,1.3,.55,-1.34,F);b.rotation.z=r});
    // قنّ الدجاج
    [[-2.4,-2.6],[-1.5,-2.6],[-2.4,-2],[-1.5,-2]].forEach(([x,z])=>box(.08,.45,.08,wood,x,.22,z,F));
    box(1.1,.6,.8,M(0xe0b070),-1.95,.75,-2.3,F);prism(1.3,.45,1,M(0xb5652b),-1.95,1.05,-2.3,F);
    const rp=box(.3,.04,.8,wood,-1.95,.25,-1.6,F);rp.rotation.x=.6;
    // قشّ
    [[2.4,-.3],[2.4,.45]].forEach(([x,z])=>{const h=add(new T.CylinderGeometry(.35,.35,.7,14),M(0xe8c25a),x,.35,z,F);h.rotation.x=Math.PI/2});
    // حوض الماء
    const WT=new T.Group();WT.position.set(.2,0,-.9);WT.userData.fk='wat';F.add(WT);box(1.5,.32,.5,wood,0,.16,0,WT);
    const wl=add(new T.PlaneGeometry(1.3,.32),FM.wat?water:M(0x6b4a2a),0,FM.wat?.3:.2,0,WT);wl.rotation.x=-Math.PI/2;wl.castShadow=false;
    if(!V&&!FM.wat)mark(WT,'💧','#3b9be0',1.5,0,.85);
    // (v13.5) حيوانات أكثر واقعية (طلب الشيخ): أجسام مستديرة، بقرة هولشتاين بيضاء ببقع سوداء وضرع، وبقرة بنية بغرّة بيضاء، تَرعيان العشب وتحرّكان الذيل والأذنين
    const ell=(r,sx,sy,sz,mat,x,y,z,p)=>{const m=add(new T.SphereGeometry(r,18,14),mat,x,y,z,p);m.scale.set(sx,sy,sz);return m};
    const CW=new T.Group();CW.position.set(1.4,0,.9);CW.userData.fk='cow';F.add(CW);
    function cow(x,z,ry,brown,ph){const C=new T.Group();C.position.set(x,0,z);C.rotation.y=ry;C.scale.setScalar(.85);CW.add(C);
      const base=M(brown?0x8a4b25:0xf7f4ee,{roughness:.92}),spot=M(brown?0xf4eee2:0x1e1e1e,{roughness:.92}),pk=M(0xf1a7b0,{roughness:.7}),
        hoof=M(0x2a2018),horn=M(0xe8dcc0,{roughness:.5}),dk=M(0x111111,{roughness:.3});
      // الجسم: برميل + صدر + ورك
      ell(.5,.84,.82,1.55,base,0,1,0,C);ell(.36,.98,.95,1.1,base,0,.99,.42,C);ell(.36,1.02,.95,1.1,base,0,.99,-.45,C);
      if(!brown)[[.3,1.12,.25,.24,1],[-.3,1.05,-.3,.26,1],[-.31,1.2,.42,.18,1],[.31,.98,-.56,.17,1],[0,1.38,-.3,.22,0]].forEach(([a,b,c,r,side])=>{const s=ell(r,side?.55:1.3,side?1:.45,1.3,spot,a,b,c,C);s.castShadow=false});
      else{const s=ell(.3,.9,.45,1.4,spot,0,.68,0,C);s.castShadow=false}
      // الرقبة والرأس
      const nk=ell(.25,1,1,1.4,base,0,1.22,.82,C);nk.rotation.x=-.5;
      const H=new T.Group();H.position.set(0,1.32,1.02);C.add(H);
      const sk=ell(.2,1,1.05,1.3,base,0,0,.05,H);sk.rotation.x=.45;
      if(brown){const bl=ell(.1,.8,1.2,1.1,spot,0,.06,.2,H);bl.rotation.x=.45}
      ell(.15,1.15,.85,.9,pk,0,-.17,.28,H);
      [-.06,.06].forEach(a=>ell(.026,1,1,1,dk,a,-.16,.41,H));
      [-1,1].forEach(k=>{ell(.042,1,1,1,dk,k*.14,.06,.13,H);const e=ell(.08,1.6,.4,1,base,k*.25,.1,-.04,H);e.rotation.z=k*.3;e.userData.k=k;H.userData['e'+k]=e;
        const hr=add(new T.ConeGeometry(.03,.15,8),horn,k*.12,.2,-.04,H);hr.rotation.z=-k*.55});
      // الأرجل والحوافر
      [[-.22,.45],[.22,.45],[-.22,-.48],[.22,-.48]].forEach(([a,b])=>{ell(.13,1,1.6,1,base,a,.78,b,C);
        add(new T.CylinderGeometry(.075,.065,.62,10),base,a,.38,b,C);add(new T.CylinderGeometry(.08,.085,.1,10),hoof,a,.05,b,C)});
      if(!brown){ell(.15,1.2,.8,1,pk,0,.62,-.35,C);[[-.06,-.29],[.06,-.29],[-.06,-.41],[.06,-.41]].forEach(([a,b])=>add(new T.CylinderGeometry(.022,.018,.1,6),pk,a,.49,b,C))}
      // الذيل
      const TL=new T.Group();TL.position.set(0,1.25,-.95);C.add(TL);add(new T.CylinderGeometry(.022,.018,.75,6),base,0,-.37,0,TL);ell(.055,1,2.2,1,brown?dk:spot,0,-.78,0,TL);
      anim.push(t=>{const g=Math.max(0,Math.sin(t*.18+ph));H.rotation.x=.1+g*.95;H.position.y=1.32-g*.25;nk.rotation.x=-.5+g*.35;
        TL.rotation.z=Math.sin(t*1.2+ph)*.28;TL.rotation.x=.12;const f=Math.max(0,Math.sin(t*2.3+ph*2))**8*.5;H.userData.e1.rotation.x=f;H.userData['e-1'].rotation.x=-f})}
    cow(-.5,-.2,-.7,false,0);cow(.6,.85,-1.4,true,2.2);
    if(FM.cow){const hy=add(new T.SphereGeometry(.5,12,8),M(0xe8c25a),-.3,.12,.9,CW);hy.scale.set(1.3,.35,.9)}
    if(!V&&!FM.cow)mark(CW,'🌾','#d9961e',2.5,0,.95);
    // الدجاج والديك: أجنحة وذيل مروحي وعرف ودلّاية حمراء، تتجوّل وتنقر الأرض
    const HN=new T.Group();HN.position.set(-1.6,0,.4);HN.userData.fk='hen';F.add(HN);
    [[0xa0522d,0x7a3b1c,0],[0xf5f2ea,0xe6e1d4,0],[0xc0642c,0x8c3f1a,0],[0xd9772b,0x9c3d12,1]].forEach(([c,wc,roo],i)=>{
      const Hn=new T.Group(),b=M(c,{roughness:.95}),wg=M(wc,{roughness:.95}),red=M(0xd8262b,{roughness:.6}),yl=M(0xf2a516,{roughness:.6}),dk=M(0x111111,{roughness:.3});
      Hn.position.set(-.6+i*.45,0,-.8+(i%2)*1.1);HN.add(Hn);
      const Bd=new T.Group();Bd.position.y=.32;Bd.rotation.x=-.15;Hn.add(Bd);
      ell(.2,.85,.85,1.15,b,0,0,0,Bd);ell(.15,.9,1,1,b,0,.02,.14,Bd);
      [-1,1].forEach(k=>{const w=ell(.15,.35,.7,1.15,wg,k*.15,.02,-.03,Bd);w.rotation.y=k*.08});
      const n=roo?5:3,tc=roo?M(0x1d3b2a,{roughness:.4,metalness:.2}):wg;
      for(let j=0;j<n;j++){const f=ell(.12,.25,roo?1.7:1,.5,tc,(j-(n-1)/2)*.04,.15,-.22,Bd);f.rotation.x=-.55;f.rotation.z=(j-(n-1)/2)*.28}
      const nk=ell(.085,1,1.5,1,b,0,.47,.15,Hn);
      const hd=new T.Group();hd.position.set(0,.6,.2);Hn.add(hd);ell(.1,.9,1,1,b,0,0,0,hd);
      const cn=roo?4:3,cr=roo?.045:.032;for(let j=0;j<cn;j++)ell(cr,.6,1,1,red,0,.1+(j%2?.01:0),-.04+j*.035,hd);
      ell(roo?.045:.032,.8,1.5,.8,red,0,-.09,.08,hd);
      const bk=add(new T.ConeGeometry(.03,.08,8),yl,0,-.01,.12,hd);bk.rotation.x=Math.PI/2;
      [-.07,.07].forEach(a=>ell(.018,1,1,1,dk,a,.03,.05,hd));
      [-.06,.06].forEach(a=>{add(new T.CylinderGeometry(.015,.015,.2,5),yl,a,.1,0,Hn);[-.45,0,.45].forEach(r=>{const t=add(new T.BoxGeometry(.015,.01,.09),yl,a+Math.sin(r)*.04,.01,.04,Hn);t.rotation.y=r})});
      Hn.scale.setScalar(roo?1.3:1.1);
      let tx=Hn.position.x,tz=Hn.position.z,w=Math.random()*2;
      const pose=p=>{hd.position.y=.6-p*.3;hd.position.z=.2+p*.14;hd.rotation.x=p*1.1;nk.position.y=.47-p*.15;nk.position.z=.15+p*.07;Bd.rotation.x=-.15+p*.2};
      anim.push((t,dt)=>{if(w>0){w-=dt;pose(Math.max(0,Math.sin(t*2.5+i))**2);return}pose(0);
        const dx=tx-Hn.position.x,dz=tz-Hn.position.z,d=Math.hypot(dx,dz);
        if(d<.05){w=1+Math.random()*2.5;tx=-1+Math.random()*1.9;tz=-1.9+Math.random()*3;return}
        const sp=Math.min(d,dt*.7);Hn.position.x+=dx/d*sp;Hn.position.z+=dz/d*sp;Hn.rotation.y=Math.atan2(dx,dz);hd.position.z=.2+Math.sin(t*7+i)*.03;Hn.position.y=Math.abs(Math.sin(t*5+i))*.02})});
    if(FM.hen)for(let i=0;i<18;i++){const s=add(new T.SphereGeometry(.04,5,4),M(0xffd23f),(Math.random()-.5)*1.6,.05,(Math.random()-.5)*2,HN);s.castShadow=false}
    if(!V&&!FM.hen)mark(HN,'🌽','#e0a020',1.7,0,.9);
    const fl=textSprite(T,V?'🐄 المزرعة':'🐄 مزرعتي','rgba(255,255,255,.92)','#5a4a1a');fl.scale.set(3.4,.74,1);fl.position.set(1.3,3.2,-2.2);if(V)F.add(fl)}
  // ================= (v13.7) اقتراحات تجميل المدينة (وافق عليها الشيخ) =================
  const ell=(r,sx,sy,sz,mat,x,y,z,p)=>{const m=add(new T.SphereGeometry(r,14,10),mat,x,y,z,p);m.scale.set(sx,sy,sz);return m};
  const flat=(m)=>{m.rotation.x=-Math.PI/2;m.castShadow=false;return m};
  const stripes=(c1,c2)=>{const cv=document.createElement('canvas');cv.width=64;cv.height=8;const x=cv.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?c2:c1;x.fillRect(i*8,0,8,8)}return new T.CanvasTexture(cv)};
  const label=(t,x,y,z,sc,p)=>{const l=textSprite(T,t,'rgba(255,255,255,.92)','#5a4a1a');l.scale.set(4.4*(sc||.7),.96*(sc||.7),1);l.position.set(x,y,z);(p||S).add(l);return l};
  // ---- 🌊 النهر: من الجبال غربًا إلى البحر شرقًا، يمرّ تحت جسر الطريق، وعليه جسر خشبي للمشاة ----
  {const wm=M(night?0x24507a:0x4aa8dc,{roughness:.1,metalness:.2,emissive:night?0x0d2a44:0x0b3550,emissiveIntensity:.35});
    [[-62,-3],[3,23]].forEach(([a,b])=>flat(add(new T.PlaneGeometry(b-a,RVW),wm,(a+b)/2,.035,RVZ)));
    const bank=M(night?0x8f8463:0xcdbb8a),stn=M(0x9aa0a6,{roughness:.95});
    [-1,1].forEach(k=>[[-62,-3.1],[3.1,21]].forEach(([a,b])=>{const e=box(b-a,.12,.32,bank,(a+b)/2,.06,RVZ+k*(RVW/2+.12));e.castShadow=false}));
    for(let i=0;i<26;i++){const x=-58+i*3.1+(i*7%3),k=i%2?1:-1;if(Math.abs(x)<4||Math.abs(x+9)<1.4)continue;const s=ell(.22+(i%3)*.06,1.3,.55,1,stn,x,.08,RVZ+k*(RVW/2+.3));s.castShadow=false}
    // قصب وبردي على الضفّتين
    const reed=M(0x5d8f3a),cat=M(0x6b4423);
    for(let i=0;i<22;i++){const x=-50+i*3.3+(i*13%4)*.4,k=i%3?1:-1;if(Math.abs(x)<4.5||Math.abs(x+9)<2||x>17)continue;
      for(let j=0;j<4;j++){const h=.8+((i+j)%3)*.25,dx=(j-1.5)*.13,r=add(new T.CylinderGeometry(.018,.025,h,4),reed,x+dx,h/2,RVZ+k*(RVW/2-.05)+(j%2)*.1);r.rotation.z=(j-1.5)*.08;
        if(j%2===0){const c=add(new T.CylinderGeometry(.045,.045,.22,6),cat,x+dx+Math.sin((j-1.5)*.08)*-h/2,h,RVZ+k*(RVW/2-.05));c.castShadow=false}}}
    // أوراق زنبق على الماء
    const lily=M(0x3f9a3c,{side:T.DoubleSide}),lp=M(0xff9ec7);
    [[-20,.6],[-16,-.8],[-13.5,.9],[-4.8,-.7],[7,.8],[11,-.6],[15,.7]].forEach(([x,dz],i)=>{flat(add(new T.CircleGeometry(.32,12,.3,5.7),lily,x,.045,RVZ+dz));if(i%2===0)ell(.08,1,.6,1,lp,x+.08,.08,RVZ+dz)});
    // تموّجات الماء تتحرّك مع التيار
    for(let i=0;i<10;i++){const r=new T.Mesh(new T.PlaneGeometry(.9,.05),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));flat(r);S.add(r);
      const z=RVZ+((i*37)%10/10-.5)*2.4,x0=-40+i*6;anim.push(t=>{let x=x0+(t*.6)%60;if(Math.abs(x)<3.2)x+=6.4;r.position.set(fX(x>22?x-62:x),.05,z);r.material.opacity=.25+.25*Math.sin(t*1.5+i)})}
    // جسر الطريق: حاجزان حجريان وأعمدة إنارة صغيرة
    // (v13.9) الحاجزان على جانبي الطريق بطول الجسر (لا يقطعان الشارع)، مع أعمدة في الأطراف والوسط وواجهة حجرية فوق الماء
    const brg=M(night?0xbfb6a2:0xe6dcc6),BL=RVW+1.4;[-1,1].forEach(k=>{const x=k*3.05;box(.2,.5,BL,brg,x,.25,RVZ);[-1,0,1].forEach(j=>box(.34,.72,.34,brg,x,.36,RVZ+j*BL/2));
      const f=box(.12,.4,RVW+.2,M(0x8f8a80),k*3.2,-.02,RVZ);f.castShadow=false});
    // الجسر الخشبي المقوّس للمشاة
    const wd=M(0xa0703c),wd2=M(0x7a5230);for(let i=0;i<=12;i++){const z=RVZ-2.3+i*4.6/12,y=.15+.6*Math.sin(Math.PI*i/12),pk=box(1.5,.08,.42,i%2?wd:wd2,FBX,y,z);pk.rotation.x=-Math.atan(.6*Math.PI/4.6*Math.cos(Math.PI*i/12))}
    [-1,1].forEach(k=>{for(let i=0;i<=6;i++){const z=RVZ-2.3+i*4.6/6,y=.15+.6*Math.sin(Math.PI*i/6);box(.07,.6,.07,wd2,FBX+k*.72,y+.3,z)}
      for(let i=0;i<6;i++){const z1=RVZ-2.3+i*4.6/6,z2=z1+4.6/6,y1=.75+.6*Math.sin(Math.PI*i/6),y2=.75+.6*Math.sin(Math.PI*(i+1)/6),r=box(.06,.06,Math.hypot(z2-z1,y2-y1),wd,FBX+k*.72,(y1+y2)/2,(z1+z2)/2);r.rotation.x=-Math.atan2(y2-y1,z2-z1)}});
    // قارب تجديف صغير
    const BT=new T.Group();S.add(BT);box(.8,.3,1.8,M(0xc0563b),0,.15,0,BT);box(.66,.06,1.6,M(0xe9d8b4),0,.28,0,BT);box(.7,.05,.2,wd,0,.32,.2,BT);
    [-1,1].forEach(k=>{const o=box(.05,.05,1.4,wd2,k*.55,.3,.2,BT);o.rotation.y=k*.5});
    anim.push(t=>{BT.position.set(fX(12+Math.sin(t*.05)*4),Math.sin(t*1.1)*.04,RVZ+.4);BT.rotation.z=Math.sin(t*.9)*.05;BT.rotation.y=Math.PI/2+Math.cos(t*.05)*.15})}
  // ---- 🦆 البطّ: أمّ وصغارها وبطّتان؛ عند الإطعام تسبح نحو الطفل ----
  {const DK=new T.Group();DK.userData.act='ducks';S.add(DK);const call=S.userData.duckCall={on:0,x:FBX+1.8,z:RVZ-1};
    const mk=(c,head,s,i)=>{const G=new T.Group();G.scale.setScalar(s);DK.add(G);const b=M(c,{roughness:.8}),h=M(head,{roughness:.6}),yl=M(0xf2a516);
      ell(.24,.85,.6,1.25,b,0,.14,0,G);const tl=ell(.1,.6,.5,1,b,0,.24,-.28,G);tl.rotation.x=-.6;ell(.13,1,1,1,h,0,.42,.2,G);
      const bk=ell(.07,1.1,.4,1.4,yl,0,.39,.36,G);[-.07,.07].forEach(a=>ell(.022,1,1,1,M(0x111111),a,.46,.29,G));
      [-1,1].forEach(k=>{const w=ell(.14,.3,.5,1.1,M(new T.Color(c).multiplyScalar(.82).getHex()),k*.17,.18,-.02,G);w.rotation.y=k*.1});
      const st={G,a:i*1.3,ox:(i%3-1)*.5,oz:((i>>1)%2-.5)*.6,k:i};return st};
    const ds=[mk(0x8a6a4a,0x1f6b3a,1.1,0),mk(0xffe066,0xffe066,.55,1),mk(0xffe066,0xffe066,.55,2),mk(0xffe066,0xffe066,.55,3),mk(0xf5f2ea,0xf5f2ea,1,4),mk(0x8a6a4a,0x6b4a2a,1,5)];
    if(!V&&!D.duck){mark(DK,'🦆','#2f9fd0',1.4,0,.9);const dm=marks[marks.length-1];dm.position.set(FBX+2.2,1.4,RVZ-.6);S.userData.duckMark=dm}
    anim.push((t,dt)=>{ds.forEach((d,i)=>{const G=d.G;let x,z;
      if(call.on>0&&i<5){x=call.x+d.ox*1.4;z=call.z+.55+d.oz*.8;}
      else{const a=t*.12+d.a*(i<4?.15:1),cx=i<4?-13:i===4?8:-24,rx=i<4?4:3;x=cx+Math.cos(a)*rx+(i<4&&i>0?-Math.cos(a)*.0:0)-(i>0&&i<4?Math.sin(a)*(.5+i*.45):0);z=RVZ+Math.sin(a*1.7)*.6+(i>0&&i<4?(i%2?.25:-.25):0)}
      x=fX(x);const dx=x-G.position.x,dz=z-G.position.z,dd=Math.hypot(dx,dz);if(dd>.02){const sp=Math.min(dd,dt*(call.on>0?1.6:.8));G.position.x+=dx/dd*sp;G.position.z+=dz/dd*sp;const ta=Math.atan2(dx,dz);let da=ta-G.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));G.rotation.y+=da*Math.min(1,dt*4)}
      G.position.y=.04+Math.sin(t*2+i)*.02;G.rotation.z=Math.sin(t*1.7+i)*.05});if(call.on>0)call.on-=dt});
    ds.forEach((d,i)=>{d.G.position.set(i<4?-13-i*.6:i===4?8:-24,0,RVZ)})}
  // ---- 🏪 سوق المدينة: ثلاثة دكاكين بمظلّات مخطّطة (خبّاز، فاكهة، حلويات) ----
  {const pav=M(night?0xa49c8c:0xe8dcc4);flat(add(new T.PlaneGeometry(7,14),pav,MKX+2.4,.016,-20.5));
    MKT.forEach(([k,z,c1,c2,nm])=>{const G=new T.Group();G.position.set(MKX+1.4,0,z);G.userData.act='mk_'+k;S.add(G);
      const wd=M(0x9a6a3a),wd2=M(0x7a4f2a);box(1.1,.9,3,wd,0,.45,0,G);box(1.2,.08,3.1,wd2,0,.92,0,G);
      [[-.55,-1.45],[-.55,1.45],[1.4,-1.45],[1.4,1.45]].forEach(([x,zz])=>box(.1,2.4,.1,wd2,x,1.2,zz,G));
      const aw=new T.Mesh(new T.BoxGeometry(2.4,.06,3.4),new T.MeshStandardMaterial({map:stripes(c1,c2),roughness:.8}));aw.position.set(.4,2.45,0);aw.rotation.z=.22;aw.castShadow=true;G.add(aw);
      const vl=new T.Mesh(new T.BoxGeometry(.04,.3,3.4),new T.MeshStandardMaterial({map:stripes(c1,c2),roughness:.8}));vl.position.set(-.78,2.12,0);G.add(vl);
      box(.08,1.4,3,wd2,1.45,1.6,0,G);
      if(k==='bak'){const br=M(0xd9a05b),br2=M(0xc98a45);for(let i=0;i<7;i++){const l=ell(.17,1,.55,1.8,i%2?br:br2,-.25+(i%2)*.3,1.05,-1.1+i*.36,G);l.rotation.y=.3}
        for(let i=0;i<4;i++){const f=add(new T.CylinderGeometry(.26,.26,.05,16),M(0xe8c27a),.25,1.0+i*.055,.95,G)}
        const ov=ell(.8,1,.8,1,M(0xb5652b),1.0,.35,-.9,G);ov.material.color.setHex(0xc9744a);box(.5,.45,.1,M(0x2a1a10),.2,.35,-.9,G)}
      if(k==='fru'){const crt=(x,zz,col,r,n)=>{box(.5,.22,.6,wd,x,1.07,zz,G);for(let i=0;i<n;i++)ell(r,1,1,1,M(col,{roughness:.5}),x-.15+(i%3)*.15,1.22+Math.floor(i/6)*.08,zz-.2+(Math.floor(i/3)%2)*.4,G)};
        crt(-.2,-1.05,0xff9a1f,.08,9);crt(-.2,-.35,0xd62828,.08,9);crt(-.2,.35,0xffd23f,.07,9);crt(-.2,1.05,0x7cc242,.08,9);
        [[.8,-.9],[1.05,-.5],[.85,-.1]].forEach(([x,zz])=>ell(.3,1,.85,1.25,M(0x2f7d32),x,.27,zz,G));
        for(let i=0;i<8;i++)ell(.05,1,1,1,M(0x6a2a8a),.95+(i%3)*.06,1.0-Math.floor(i/3)*.07,1,G)}
      if(k==='swe'){const cols=[0xff6b8a,0xffd23f,0x8f6bff,0x4fc3ff,0x7be37b,0xff9f43];for(let j=0;j<3;j++){add(new T.CylinderGeometry(.42,.42,.05,20),M(0xd8d8d8,{metalness:.6,roughness:.3}),-.15,.97,-1+j,G);
          for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=.25,b=box(.12,.08,.12,M(j===1?0xd9a05b:cols[(i+j)%6]),-.15+Math.cos(a)*r*(i%2?.5:1),1.04,-1+j+Math.sin(a)*r*(i%2?.5:1),G);b.rotation.y=a}}
        [-.9,.9].forEach(zz=>{add(new T.CylinderGeometry(.14,.14,.4,12),M(0xbfe6ff,{transparent:true,opacity:.6,roughness:.1}),1.2,1.3,zz,G);for(let i=0;i<6;i++)ell(.05,1,1,1,M(cols[i]),1.2+(i%2-.5)*.1,1.18+Math.floor(i/2)*.1,zz,G)})}
      label(nm,.4,3.3,0,.62,G);if(!V&&!(D.mk&&D.mk[k])){mark(G,'⭐','#f0a020',4,0,.8);(S.userData.mkMark=S.userData.mkMark||{})[k]=marks[marks.length-1]}});
    }
  // ---- ⛲ ساحة النافورة قرب الجامع: نافورة ومقاعد وحمام ----
  {const P=new T.Group();P.position.set(PLZ[0],0,PLZ[1]);P.userData.act='plaza';S.add(P);const st=M(night?0xb4ab98:0xeae0cb),st2=M(night?0x9a917e:0xd4c7a8);
    flat(add(new T.CircleGeometry(3.4,40),st,0,.018,0,P));const rg=flat(add(new T.RingGeometry(2.2,2.45,40),st2,0,.022,0,P));
    add(new T.CylinderGeometry(1.45,1.55,.42,28),st2,0,.21,0,P);const w=flat(add(new T.CircleGeometry(1.32,28),M(0x5fb8e8,{roughness:.1,metalness:.2,emissive:night?0x1d4e7e:0x0b3550,emissiveIntensity:.4}),0,.38,0,P));
    add(new T.CylinderGeometry(.16,.22,1.2,12),st,0,.9,0,P);add(new T.CylinderGeometry(.62,.2,.22,20),st,0,1.45,0,P);add(new T.CylinderGeometry(.08,.12,.5,10),st,0,1.75,0,P);add(new T.CylinderGeometry(.28,.08,.12,14),st,0,2.02,0,P);
    // نوافير الماء: قطرات تتطاير وتسقط في الحوض
    const N=60,dm=new T.InstancedMesh(new T.SphereGeometry(.045,5,4),new T.MeshBasicMaterial({color:night?0x9fd0ff:0xd8f2ff}),N),o=new T.Object3D();dm.position.y=0;P.add(dm);
    anim.push(t=>{for(let i=0;i<N;i++){const top=i<20,u=((t*.55+i/N*3.1)%1),a=i*2.39,r=(top?.05+u*.55:.6+u*.75),y=top?2.08+u*.9-u*u*1.35:1.52+u*.25-u*u*1.35;
      o.position.set(Math.cos(a)*r,Math.max(.4,y),Math.sin(a)*r);o.updateMatrix();dm.setMatrixAt(i,o.matrix)}dm.instanceMatrix.needsUpdate=true});
    // (v15.9) 🌈 في الليل تضيء النافورة بألوان تتبدّل بهدوء
    if(night){const pl=new T.PointLight(0xff66aa,1.6,10,1.5);pl.position.set(0,1.3,0);P.add(pl);const cc=new T.Color(),wh=new T.Color(0xffffff);
      const bulbs=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bulbs.push(add(new T.SphereGeometry(.09,8,6),new T.MeshBasicMaterial({color:0xffffff}),Math.cos(a)*1.45,.44,Math.sin(a)*1.45,P))}
      w.material.emissiveIntensity=.9;anim.push(t=>{cc.setHSL((t*.06)%1,.85,.58);pl.color.copy(cc);w.material.emissive.copy(cc);dm.material.color.copy(cc).lerp(wh,.45);bulbs.forEach((b,i)=>b.material.color.setHSL((t*.06+i/8)%1,.9,.62))})}
    // مقاعد
    const bw=M(0x8b5a2b),bm=M(0x3a3f45);[0,1,2,3].forEach(k=>{const a=k*Math.PI/2+Math.PI/4,G=new T.Group();G.position.set(Math.cos(a)*2.85,0,Math.sin(a)*2.85);G.rotation.y=-a-Math.PI/2;P.add(G);
      box(1.3,.07,.4,bw,0,.45,0,G);box(1.3,.35,.06,bw,0,.7,-.2,G);[-.55,.55].forEach(x=>box(.06,.45,.4,bm,x,.22,0,G))});
    // أحواض زهور
    [[-3,0],[3,0],[0,-3],[0,3]].forEach(([x,z],k)=>{if(k===3)return;add(new T.CylinderGeometry(.45,.5,.3,14),st2,x*1.08,.15,z*1.08,P);for(let i=0;i<7;i++)ell(.09,1,1,1,M([0xff5c8a,0xffd23f,0xffffff,0xb07cff][i%4]),x*1.08+Math.cos(i)*.25,.38,z*1.08+Math.sin(i)*.25,P)});
    // الحمام: يلتقط الحبّ على الأرض، ويطير إذا اقترب أحد ثم يعود
    const PG=S.userData.pigeons={fly:0};const pm=M(0x8e96a3),pm2=M(0x5d6470),pn=M(0x4f8a7a);const birds=[];
    for(let i=0;i<8;i++){const G=new T.Group();P.add(G);ell(.14,.8,.75,1.3,pm,0,.16,0,G);ell(.09,1,1,1,pn,0,.3,.14,G);ell(.08,1,1,1,pm2,0,.38,.18,G);
      const bk=add(new T.ConeGeometry(.02,.06,5),M(0xdddddd),0,.37,.27,G);bk.rotation.x=Math.PI/2;const tl=ell(.07,.7,.25,1.2,pm2,0,.18,-.2,G);
      const w1=ell(.1,.25,.6,1.2,pm2,-.1,.2,-.02,G),w2=ell(.1,.25,.6,1.2,pm2,.1,.2,-.02,G);
      const s={G,w1,w2,hx:Math.cos(i*.8)*(1.9+(i%3)*.25),hz:Math.sin(i*.8)*(1.9+(i%3)*.25),ph:i};G.position.set(s.hx,0,s.hz);G.rotation.y=i;birds.push(s)}
    anim.push((t,dt)=>{if(PG.fly>0)PG.fly-=dt;birds.forEach((b,i)=>{const G=b.G;
      if(PG.fly>0){const k=Math.min(1,(6-PG.fly)/1.2),land=Math.min(1,PG.fly/1.2),h=Math.min(k,land),a=t*.6+i*.8;
        G.position.set(b.hx*(1-h)+Math.cos(a)*5*h,h*(6+i%3),b.hz*(1-h)+Math.sin(a)*5*h);G.rotation.y=-a;const f=Math.sin(t*14+i)*.9*h;b.w1.rotation.z=f+h*.3;b.w2.rotation.z=-f-h*.3}
      else{G.position.y=0;b.w1.rotation.z=b.w2.rotation.z=0;const p=Math.max(0,Math.sin(t*2+b.ph))**4;G.rotation.x=p*.5;if(Math.random()<dt*.3){b.hx+= (Math.random()-.5)*.6;b.hz+=(Math.random()-.5)*.6;const r=Math.hypot(b.hx,b.hz);if(r>2.6||r<1.7){b.hx*=2.1/r;b.hz*=2.1/r}}
        G.position.x+=(b.hx-G.position.x)*Math.min(1,dt*2);G.position.z+=(b.hz-G.position.z)*Math.min(1,dt*2)}})});
    }
  // ---- 🏠 بيوت الجيران خلف النهر (سقف مستوٍ بسياج وخزّان ماء)، والأيسر بيت جدّو ----
  // (v15.9) طلب الشيخ: شناشيل بغدادية — صار بيتا الجيران بطابقين، وفي الطابق العلوي شنشول خشبي بارز بزجاج ملوّن،
  // وأصص ورد على الشبابيك وستائر. لون البيت يختاره الطفل (CITY.hc)
  {[[-1,0xf3e3c3,'🏠 بيت جدّو','l'],[1,0xe6efe0,null,'r']].forEach(([k,c,nm,id])=>{const G=new T.Group();G.position.set(k*7,0,NBZ);G.rotation.y=k<0?Math.PI/2:-Math.PI/2;G.userData.act='nbh_'+id;S.add(G);
      const hc=!V&&CITY.hc&&CITY.hc[id]!=null?HCOL[CITY.hc[id]]:c;const wl=M(hc),tr2=M(0xd8c39a);box(3,2.3,3.2,wl,0,1.15,0,G);box(3.1,.12,3.3,tr2,0,2.36,0,G);
      box(3,1.9,3.2,wl,0,3.37,0,G);box(3.12,.12,3.32,tr2,0,4.38,0,G);
      [[0,1.6],[0,-1.6]].forEach(([x,z])=>box(3.1,.35,.08,tr2,x,4.6,z,G));[-1.5,1.5].forEach(x=>box(.08,.35,3.2,tr2,x,4.6,0,G));
      add(new T.CylinderGeometry(.35,.35,.6,14),M(0x2f6fd0),.8,4.77,-.8,G);
      box(.8,1.4,.08,M(0x7a4f2a),0,.7,1.62,G);ell(.05,1,1,1,M(0xffd23f),.28,.7,1.68,G);
      const cur=M(k<0?0xd94f6a:0x3f7fd0),pot=M(0xb5652b),fl=[0xff4f7a,0xffd23f,0xffffff,0xff8a3d].map(x=>M(x));
      [-1,1].forEach(j=>{box(.6,.55,.06,winM,j*1.05,1.5,1.62,G);box(.08,.6,.08,M(0x2f7d5a),j*1.05-.36,1.5,1.64,G);box(.08,.6,.08,M(0x2f7d5a),j*1.05+.36,1.5,1.64,G);
        box(.2,.5,.02,cur,j*1.05-.18,1.52,1.66,G);box(.7,.06,.2,tr2,j*1.05,1.2,1.72,G);box(.5,.16,.14,pot,j*1.05,1.31,1.74,G);
        for(let i=0;i<4;i++)ell(.07,1,1,1,fl[(i+j+2)%4],j*1.05-.18+i*.12,1.45,1.75,G)});
      // الشنشول: صندوق خشبي بارز بشبّاك مشبّك وزجاج ملوّن، تحته كوابيل وفوقه طنف
      const wd=M(0x8a5a2e),wd2=M(0x6b4423),SZ=1.6+.3;box(2.3,1.3,.6,wd,0,3.35,SZ,G);box(2.5,.12,.78,wd2,0,4.06,SZ+.02,G);box(2.1,.16,.5,wd2,0,2.64,SZ-.02,G);
      [-.85,0,.85].forEach(x=>{const b=box(.12,.35,.3,wd2,x,2.45,1.75,G);b.rotation.x=.5});
      const gl=[0x3f8fd0,0x2fa36b,0xd94f4f,0xffc53a].map(x=>M(x,{emissive:x,emissiveIntensity:night?.9:.15,roughness:.3}));
      for(let i=0;i<4;i++)box(.42,.5,.02,gl[i],-.78+i*.52,3.5,SZ+.31,G);
      for(let i=0;i<=10;i++)box(.04,1.05,.04,wd2,-1.1+i*.22,3.35,SZ+.33,G);[3.05,3.65].forEach(y=>box(2.2,.04,.04,wd2,0,y,SZ+.33,G));
      [-1,1].forEach(x=>{for(let i=0;i<3;i++)box(.02,.9,.04,wd2,x*1.16,3.35,SZ-.15+i*.17,G)});
      add(new T.CylinderGeometry(.06,.06,.05,8),M(0x777777),0,.03,1.9,G);palm(1.9,1.3,G);if(nm)label(nm,0,5.4,0,.62,G)})}
  // ---- 🏘️ (v14.3) طلب الشيخ: قرى قريبة تُرى من بعيد، ومنها يأتي الناس لصلاة الجمعة. بيوت ريفية بسقوف مستوية وخزّانات ماء ونخيل،
  // ودرب ترابي من كل قرية إلى الطريق الرئيسي. (VIL مشترك مع makeLife لطرق المصلّين)
  {const dirt=M(0xd9bf8c,{roughness:1}),HC=[0xf3e3c3,0xe9d8b4,0xf6efe2,0xe2cfa6,0xefe0cc,0xdcc9a3],tank=M(0x2f6fd0),dr=M(0x7a4f2a),tr2=M(0xcdb68c);
    VIL.forEach(([cx,cz,nm],vi)=>{const G=new T.Group();G.position.set(cx,0,cz);S.add(G);let k=0;
      for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++){if(r===0&&c===1)continue;const hh=((vi*13+k*7)%5),w=3+hh*.25,h=2.1+(hh%3)*.55,d=3+((k*3)%4)*.25,x=c*6.2+((k*5)%3-1)*.6,z=r*6.4+((k*7)%3-1)*.6;k++;
        const H=new T.Group();H.position.set(x,0,z);H.rotation.y=(k%4)*Math.PI/2;G.add(H);
        box(w,h,d,M(HC[(k+vi)%HC.length]),0,h/2,0,H);box(w+.1,.12,d+.1,tr2,0,h+.06,0,H);
        if(k%3!==1)add(new T.CylinderGeometry(.3,.3,.55,12),tank,w/4,h+.4,-d/4,H);
        box(.75,1.3,.08,dr,0,.65,d/2+.02,H);[-1,1].forEach(j=>box(.55,.5,.06,winM,j*w*.3,h*.62,d/2+.03,H))}
      [[-9,-7],[9,8],[-8,9],[10,-6],[0,10.5]].forEach(([x,z])=>palm(cx+x,cz+z,null));
      // درب ترابي إلى رصيف الطريق الرئيسي
      const L=Math.abs(cx)-3.2,pth=add(new T.PlaneGeometry(L,1.6),dirt,(cx+(cx<0?-3:3))/2,.025,cz);pth.rotation.x=-Math.PI/2;pth.castShadow=false;
      label('🏘️ '+nm,cx,9.5,cz,2.2)})}
  // ================= (v14.5) إضافات: الفصول، الطيور عند الغروب، الملعب، التنّور، الجار المريض، العصافير، صندوق الصدقات =================
  {const D2=V?{}:day();
    // 🍂 الخريف: أوراق تتساقط حول الأشجار وأوراق على الأرض
    if(SEA==='au'){const lg=new T.PlaneGeometry(.2,.13),lm=[0xe0802c,0xf0c445,0xc9582a,0xd9a23a].map(c=>new T.MeshLambertMaterial({color:nC(c),side:T.DoubleSide}));
      // (v17.5) الأوراق المتساقطة: ٤ قطع مكرّرة (InstancedMesh) بدل ورقة منفصلة لكل واحدة (كانت ≈٤٠ رسمة)
      const FL=[[],[],[],[]];TREES.forEach(([x,z],ti)=>{for(let i=0;i<7;i++)FL[(ti+i)%4].push({x,z,ox:(Math.random()-.5)*2.4,oz:(Math.random()-.5)*2.4,y0:Math.random()*2.6,sp:.35+Math.random()*.3,ph:Math.random()*6})});
      {const dm=new T.Object3D();FL.forEach((L,k)=>{if(!L.length)return;const IM=new T.InstancedMesh(lg,lm[k],L.length);IM.frustumCulled=false;IM.userData.rd=1;S.add(IM);
        anim.push(t=>{L.forEach((q,i)=>{const y=2.6-((t*q.sp+q.y0)%2.6);dm.position.set(fX(q.x+q.ox+Math.sin(t*1.3+q.ph)*.35),y+.05,q.z+q.oz+Math.cos(t*1.1+q.ph)*.25);dm.rotation.set(t*2+q.ph,t*1.5,q.ph);dm.updateMatrix();IM.setMatrixAt(i,dm.matrix)});IM.instanceMatrix.needsUpdate=true})})}
      TREES.forEach(([x,z],ti)=>{
        for(let i=0;i<9;i++){const a=i*.7+ti,r=.6+(i%3)*.55,g=new T.Mesh(lg,lm[(i+ti)%4]);g.rotation.set(-Math.PI/2,0,a);g.position.set(x+Math.cos(a)*r,.03+i*.001,z+Math.sin(a)*r);g.scale.setScalar(1.3);S.add(g)}})}
    // ☀️ الصيف: سراب يلمع على الشارع البعيد وقت الظهيرة
    if(SEA==='su'&&!night&&!RN){[-34,-52,-75,30,48].forEach((z,i)=>{const m=new T.Mesh(new T.PlaneGeometry(2.6,9),new T.MeshBasicMaterial({color:0xe8f4ff,transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(0,.06,z);S.add(m);
        anim.push(t=>{const h=hourNow();m.visible=h>=11&&h<17;m.material.opacity=.18+Math.sin(t*3+i*1.7)*.12})})}
    // 🐦 أسراب الطيور عند الغروب: تطير بشكل V نحو الجبال
    if(!night&&!RN){const fl=new T.Group(),bm2=M(0x2b2b33);S.add(fl);const ws=[];for(let i=0;i<13;i++){const b=new T.Group(),k=Math.ceil(i/2)*(i%2?1:-1);b.position.set(Math.abs(k)*1.6,0,k*1.4);
        const w1=add(new T.BoxGeometry(.6,.04,.2),bm2,-.3,0,0,b),w2=add(new T.BoxGeometry(.6,.04,.2),bm2,.3,0,0,b);fl.add(b);ws.push([w1,w2,i])}
      fl.visible=false;let ck=-9,on=false;anim.push(t=>{if(t-ck>5){ck=t;on=sunsetBirds()}fl.visible=on;if(!on)return;const u=(t%45)/45;fl.position.set(70-u*170,24+Math.sin(t*.5)*1.5,-30+u*10);fl.rotation.y=Math.PI/2;
        ws.forEach(([a,b,i])=>{const f=Math.sin(t*7+i)*.6;a.rotation.z=f;b.rotation.z=-f})})}
    // ⚽ ملعب كرة القدم خلف السوق (الأطفال يلعبون العصر — makeLife)
    {const F=new T.Group();F.position.set(FB[0],0,FB[1]);F.userData.act='football';S.add(F);const gm=M(night?0x2f6a32:0x4fb94a),gm2=M(night?0x2a6030:0x47ad44),wl=M(0xffffff);
      for(let i=0;i<6;i++){const st=new T.Mesh(new T.PlaneGeometry(6.2,1.5),i%2?gm:gm2);st.rotation.x=-Math.PI/2;st.position.set(0,.035,-3.75+i*1.5);st.receiveShadow=true;F.add(st)}
      [[6.2,.06,0,-4.5],[6.2,.06,0,4.5],[.06,9,-3.1,0],[.06,9,3.1,0],[6.2,.06,0,0]].forEach(([w,d,x,z])=>{const l=new T.Mesh(new T.PlaneGeometry(w,d),wl);l.rotation.x=-Math.PI/2;l.position.set(x,.045,z);F.add(l)});
      const cc=new T.Mesh(new T.RingGeometry(.9,.96,32),wl);cc.rotation.x=-Math.PI/2;cc.position.y=.045;F.add(cc);
      [-1,1].forEach(k=>{const z=k*4.5;[-1,1].forEach(j=>add(new T.CylinderGeometry(.05,.05,1,8),wl,j*1,.5,z,F));const cb=add(new T.CylinderGeometry(.05,.05,2,8),wl,0,1,z,F);cb.rotation.z=Math.PI/2;
        const net=new T.Mesh(new T.PlaneGeometry(2,1),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,side:T.DoubleSide,wireframe:true}));net.position.set(0,.5,z+k*.45);net.rotation.x=k*.4;F.add(net)});
      }
    // 🔥 تنّور الجارة بجانب البيت الأيمن خلف النهر، وجارٌ مريض في البيت نفسه في بعض الأيام
    {const TN=new T.Group();TN.position.set(10.2,0,24.8);TN.userData.act='tannour';S.add(TN);const clay=M(0xc9784a,{roughness:1}),clay2=M(0xa85f38,{roughness:1});
      add(new T.CylinderGeometry(.5,.72,1,18,1,true),clay,0,.5,0,TN).material.side=T.DoubleSide;add(new T.TorusGeometry(.5,.08,8,18),clay2,0,1,0,TN).rotation.x=Math.PI/2;
      const fire=new T.Mesh(new T.CircleGeometry(.42,16),new T.MeshBasicMaterial({color:night?0x803010:0xff7a1a}));fire.rotation.x=-Math.PI/2;fire.position.y=.25;TN.add(fire);
      box(.9,.08,.6,M(0x8b5a2b),1,.55,0,TN);[[.8,.05],[1.1,-.12],[1.2,.14]].forEach(([x,z])=>{const b=add(new T.CylinderGeometry(.2,.2,.04,14),M(0xe9b46a),x,.62,z,TN)});
      if(!night){const sm=new T.MeshBasicMaterial({color:0xdddddd,transparent:true,opacity:.35,depthWrite:false});for(let i=0;i<6;i++){const p=new T.Mesh(new T.SphereGeometry(.28,8,6),sm.clone());TN.add(p);const o=i/6;anim.push(t=>{const u=(t*.25+o)%1;p.position.set(Math.sin(t+i)*.25*u,1.1+u*3.2,u*.4);p.scale.setScalar(.6+u*1.8);p.material.opacity=.4*(1-u)})}}
      if(!V&&!night&&!D2.tn)mark(TN,'🍞','#e0802c',2.3,0,.85);label('🔥 تنّور الجارة',0,3.4,0,.55,TN)}
    // 🏘️ دخان تنانير في القرى البعيدة
    if(!night)VIL.forEach(([cx,cz],vi)=>{const sm=new T.MeshBasicMaterial({color:0xe6e6e6,transparent:true,opacity:.3,depthWrite:false});for(let i=0;i<5;i++){const p=new T.Mesh(new T.SphereGeometry(.5,8,6),sm.clone());S.add(p);const o=i/5;
        anim.push(t=>{const u=(t*.12+o)%1;p.position.set(fX(cx+4+Math.sin(t*.5+i)*.6),1.5+u*7,cz-4+u*2);p.scale.setScalar(.7+u*2.2);p.material.opacity=.32*(1-u)})}});
    {const SK=new T.Group();SK.position.set(7,0,NBZ);SK.userData.act='sick';S.add(SK);if(!V&&sickDay()&&!D2.sick)mark(SK,'🤒','#8f6bff',5.4,0,.95)}
    // 🐦 مُطعِم العصافير أمام البيت (الشتاء) + عصافير تنزل لتأكل
    {const FD=new T.Group();FD.position.set(-4.3,0,-3.1);FD.userData.act='birds';S.add(FD);add(new T.CylinderGeometry(.05,.05,1.1,8),M(0x6b4423),0,.55,0,FD);box(.6,.05,.6,M(0x8b5a2b),0,1.12,0,FD);
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([a,b])=>box(a?0.05:.6,.1,b?.05:.6,M(0x8b5a2b),a*.28,1.18,b*.28,FD));prism(.8,.3,.8,M(0xc0563b),0,1.5,0,FD);
      if(!V&&birdMonths()&&!D2.bf)mark(FD,'🐦','#3b9be0',2.3,0,.8);
      const SP=S.userData.sparrows={on:0,x:fX(-3.6),z:-3.2,b:[]};const brown=M(0x8a5a3a),cream=M(0xf0e0c0);
      for(let i=0;i<7;i++){const b=new T.Group();ell(.1,1,.9,1.4,brown,0,.1,0,b);ell(.07,1,1,1,brown,0,.18,.12,b);ell(.07,1,.6,1,cream,0,.06,.04,b);add(new T.ConeGeometry(.025,.06,6),M(0xe0a020),0,.17,.2,b).rotation.x=Math.PI/2;
        b.visible=false;S.add(b);SP.b.push({b,a:i/7*Math.PI*2,r:.4+(i%3)*.3,ph:i})}
      anim.push((t,dt)=>{if(SP.on<=0){SP.b.forEach(o=>o.b.visible=false);return}SP.on-=dt;const k=Math.min(1,Math.min(SP.on,24-SP.on)/2.5);
        SP.b.forEach(o=>{o.b.visible=true;const y=(1-k)*7;o.b.position.set(SP.x+Math.cos(o.a)*o.r*(1+(1-k)*6),y+Math.max(0,Math.sin(t*9+o.ph))*.05,SP.z+Math.sin(o.a)*o.r);o.b.rotation.y=o.a+Math.PI;o.b.rotation.x=k>.99?Math.max(0,Math.sin(t*5+o.ph))*.6:0})})}
    // 💝 صندوق الصدقات عند باب الجامع
    if(LV('m')>0){const SB=new T.Group();SB.position.set(7.6,0,3.3);SB.userData.act='sadaqa';S.add(SB);box(.12,.6,.12,M(0x777777),0,.3,0,SB);box(.55,.45,.4,M(0x1f8a5a),0,.82,0,SB);box(.3,.03,.06,M(0x151515),0,1.055,0,SB);box(.57,.08,.42,M(0xc9a227,{metalness:.6,roughness:.35}),0,1.06,0,SB);
      if(!V&&!D2.sdq)mark(SB,'💝','#d94f8a',1.9,0,.75)}
    // ❤️ علامة فوق الوالدين عند باب البيت حتى يبرّهما الطفل اليوم
    if(!V&&!night){const br=D2.br||{};if(!(br.s&&br.b&&br.h)){const PM=new T.Group();PM.position.set(-3.1,0,1);PM.userData.act='parents';S.add(PM);mark(PM,'❤️','#e2504a',2.9,0,.85)}}}
  // ---- (v16.9) طلب الشيخ: 👮 مركز الشرطة، ⚡ محطة الكهرباء، وأماكن الأعمال الجديدة ----
  {const D3=V?{}:day();
    // 👮 مركز الشرطة: مبنى أبيض بطابقين وأشرطة زرقاء، واجهته (محليًا +z) نحو الطريق، وسيارة شرطة بأضواء تومض
    {const G=new T.Group();G.position.set(POL[0],0,POL[1]);G.rotation.y=-Math.PI/2;G.userData.act='police';S.add(G);
      const wh=M(0xf4f6fa),bl=M(0x1f4e9e),gl=M(night?0xffe08a:0x9fd8ff,night?{emissive:0xffc940,emissiveIntensity:.8}:{roughness:.2,metalness:.2});
      box(7.6,.12,6,M(night?0x7d828a:0xb9bec6),0,.06,.2,G);box(6,3.4,3.6,wh,0,1.82,-.2,G);box(6.06,.26,3.66,bl,0,1.82,-.2,G);box(6.12,.34,3.72,bl,0,3.6,-.2,G);
      [-2.2,-1.2,1.2,2.2].forEach(x=>[1.05,2.75].forEach(y=>box(.72,.75,.06,gl,x,y+.12,1.62,G)));
      [-1,1].forEach(k=>[1.05,2.75].forEach(y=>[-1.1,.6].forEach(z=>box(.06,.75,.7,gl,k*3.02,y+.12,z,G))));
      box(1.3,1.5,.08,M(0x7fb8e0,{roughness:.15,metalness:.3}),0,.87,1.62,G);box(2.4,.1,1.1,bl,0,1.85,2.1,G);
      [-1.1,1.1].forEach(x=>add(new T.CylinderGeometry(.05,.05,1.7,8),M(0xdddddd),x,.97,2.55,G));box(1.7,.16,1.1,M(0xd8dce2),0,.2,2.1,G);
      {const c=document.createElement('canvas');c.width=512;c.height=112;const x=c.getContext('2d');x.fillStyle='#1f4e9e';x.fillRect(0,0,512,112);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(8,8,496,96);
        x.fillStyle='#fff';x.font='900 58px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🚓 مركز الشرطة',256,60);
        const sg=new T.Mesh(new T.PlaneGeometry(3.4,.74),new T.MeshBasicMaterial({map:new T.CanvasTexture(c)}));sg.position.set(0,2.42,1.64);G.add(sg)}
      const rOn=new T.MeshBasicMaterial({color:0xff3030}),bOn=new T.MeshBasicMaterial({color:0x2f7bff}),off=M(0x555a66);
      box(.5,.4,.5,M(0xe8eaef),1.8,3.97,-.9,G);const rl=add(new T.SphereGeometry(.2,10,8),bOn,1.8,4.32,-.9,G);
      const C=new T.Group();C.position.set(-4.7,0,.6);G.add(C);const cw=M(0xffffff,{roughness:.3,metalness:.3}),cb=M(0x1f4e9e,{roughness:.3,metalness:.3});
      box(1.3,.5,2.7,cw,0,.55,0,C);box(1.32,.16,2.72,cb,0,.62,0,C);box(1.14,.34,1.3,M(0x1d2b3a,{roughness:.1,metalness:.5}),0,.97,-.1,C);box(1.16,.08,1.34,cw,0,1.18,-.1,C);
      [[-.62,.85],[.62,.85],[-.62,-.85],[.62,-.85]].forEach(([x,z])=>{const w=add(new T.CylinderGeometry(.27,.27,.2,14),M(0x1a1a1a),x,.27,z,C);w.rotation.z=Math.PI/2});
      box(.9,.08,.26,M(0x222222),0,1.26,-.1,C);const L1=add(new T.BoxGeometry(.4,.12,.22),rOn,-.22,1.36,-.1,C),L2=add(new T.BoxGeometry(.4,.12,.22),bOn,.22,1.36,-.1,C);
      anim.push(t=>{const k=(t*1.6|0)%2;L1.material=k?rOn:off;L2.material=k?off:bOn;rl.material=(t*.9|0)%2?bOn:rOn});
      palm(3.6,2.6,G);palm(-3.4,-2.4,G);
      if(!V&&!D3.pol)mark(G,'👮','#1f4e9e',5.2,0,.9)}
    // ⚡ محطة الكهرباء: ألواح شمسية، ثلاث مراوح رياح تدور، محوّلات، غرفة تحكّم، وأبراج أسلاك نحو المدينة. البوابة نحو الطريق (+x)
    {const G=new T.Group();G.position.set(PWR[0],0,PWR[1]);G.userData.act='power';S.add(G);
      box(14,.08,14,M(night?0x8d887a:0xc9c2ae,{roughness:1}),0,.04,0,G);
      const fm=M(0x9aa3ad,{metalness:.6,roughness:.4});
      const fence=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(len/1.6));for(let i=0;i<=n;i++)add(new T.CylinderGeometry(.04,.04,1.3,6),fm,x0+(x1-x0)*i/n,.65,z0+(z1-z0)*i/n,G);
        [.45,1.15].forEach(y=>{const r=box(x0===x1?.04:len,.04,x0===x1?len:.04,fm,(x0+x1)/2,y,(z0+z1)/2,G);r.castShadow=false})};
      fence(-7,-7,7,-7);fence(-7,7,7,7);fence(-7,-7,-7,7);fence(7,-7,7,2.3);fence(7,5.3,7,7);
      [2.3,5.3].forEach(z=>box(.22,1.6,.22,M(0xf0c419),7,.8,z,G));
      // ألواح شمسية بنقوش خلايا
      {const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#1b3a8f';x.fillRect(0,0,64,64);x.strokeStyle='#8fb4ff';x.lineWidth=2;for(let i=0;i<=64;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,64);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(64,i);x.stroke()}
        const pm=new T.MeshStandardMaterial({map:new T.CanvasTexture(c),roughness:.25,metalness:.4,emissive:night?0x0a1430:0x000000});
        [-5.6,-3.4,-1.2,1].forEach(z=>[-5.6,-3.8,-2,-.2].forEach(x=>{const P=add(new T.BoxGeometry(1.6,.05,1.3),pm,x,.75,z,G);P.rotation.x=.5;add(new T.CylinderGeometry(.04,.04,.7,5),fm,x,.36,z-.3,G)}))}
      // غرفة التحكّم وبابها نحو البوابة
      {const wl=M(0xece7dc),ro=M(0xe0802c);box(3.4,2.3,2.6,wl,3.4,1.15,4.4,G);box(3.6,.22,2.8,ro,3.4,2.4,4.4,G);box(.08,1.3,.9,M(0x6b7b8c),5.12,.65,4.4,G);
        [3.3,5.5].forEach(z=>box(.06,.6,.7,winM,5.12,1.45,z,G));box(.06,.6,1.4,winM,1.68,1.45,4.4,G);
        const lp=add(new T.SphereGeometry(.12,8,6),M(0xfff1b0,night?{emissive:0xffd860,emissiveIntensity:1.6}:{}),5.25,1.75,4.4,G);label('⚡ محطة الكهرباء',3.4,3.6,4.4,.62,G)}
      // محوّلات
      [-2.4,-4.8].forEach(z=>{box(1.5,1.3,1,M(0x7d8792),3.6,.75,z,G);for(let i=0;i<5;i++)box(.04,1.1,1.05,M(0x5f6872),2.9+i*.36,.75,z,G);
        [-.45,0,.45].forEach(x=>{add(new T.CylinderGeometry(.07,.09,.5,8),M(0xc9784a),3.6+x,1.65,z,G)})});
      // مراوح الرياح
      const tw=M(0xf4f6f8,{roughness:.5}),bladeG=new T.BoxGeometry(.06,3.3,.32);bladeG.translate(0,1.65,0);
      [[-9.5,-10],[-10.5,0],[-9.5,10]].forEach(([x,z],i)=>{add(new T.CylinderGeometry(.16,.32,9,10),tw,x,4.5,z,G);box(.55,.55,1.2,tw,x,9.1,z,G);
        const R2=new T.Group();R2.position.set(x+.75,9.1,z);G.add(R2);add(new T.SphereGeometry(.24,10,8),tw,0,0,0,R2);for(let b=0;b<3;b++){const B2=new T.Mesh(bladeG,tw);B2.castShadow=true;B2.rotation.x=b*Math.PI*2/3;R2.add(B2)}
        const rd=add(new T.SphereGeometry(.1,8,6),new T.MeshBasicMaterial({color:0xff2020}),x,9.45,z,G);
        anim.push((t,dt)=>{R2.rotation.x+=dt*(1.1+i*.15);rd.visible=night&&(t*.8+i*.3)%2<1})});
      // أبراج الأسلاك نحو المدينة
      const pyl=(x,z)=>{add(new T.CylinderGeometry(.08,.42,6.4,4),fm,x,3.2,z,G);[5.6,4.7].forEach(y=>box(.1,.1,2.4,fm,x,y,z,G))};
      const wire=(a,b)=>{const d=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),m=new T.Mesh(new T.CylinderGeometry(.018,.018,d.length(),4),M(0x2a2a2a));
        m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());m.castShadow=false;G.add(m)};
      pyl(10.5,6.4);pyl(16.5,6.4);[-1.1,1.1].forEach(k=>{wire([3.4,2.5,4.4+k*.6],[10.5,5.55,6.4+k]);wire([10.5,5.55,6.4+k],[16.5,5.55,6.4+k])});
      if(!V&&!D3.pw)mark(G,'⚡','#f0a020',4.6,3.4,.9)}
    // 🚰 حنفية عامّة على الرصيف الأيمن قرب السبيل: في بعض الأيام تبقى مفتوحة والماء يضيع
    {const G=new T.Group();G.position.set(TAPP[0],0,TAPP[1]);G.userData.act='leak';S.add(G);const mt=M(0x9aa3ad,{metalness:.7,roughness:.3});
      add(new T.CylinderGeometry(.06,.06,.95,8),mt,0,.47,0,G);const sp=add(new T.CylinderGeometry(.04,.04,.32,8),mt,-.15,.88,0,G);sp.rotation.z=Math.PI/2;
      add(new T.CylinderGeometry(.09,.09,.05,10),M(0xc0392b),0,.98,0,G);box(.5,.08,.5,M(0x9a9a9a),-.3,.04,0,G);
      if(!V&&leakDay()&&!D3.lk){mark(G,'🚰','#3b9be0',1.9,0,.75);const pd=new T.Mesh(new T.CircleGeometry(.5,16),new T.MeshStandardMaterial({color:0x5fb0e6,transparent:true,opacity:.6,roughness:.1}));pd.rotation.x=-Math.PI/2;pd.position.set(-.35,.09,.15);G.add(pd);
        const dm=new T.MeshBasicMaterial({color:0x7cc8ff});for(let i=0;i<3;i++){const d=new T.Mesh(new T.SphereGeometry(.04,6,5),dm);G.add(d);anim.push(t=>{const u=(t*.9+i/3)%1;d.position.set(-.31,.84-u*.76,0)})}}}
    // 🔭 منظار أمام البيت في الليل: ينظر الطفل إلى النجوم ويتفكّر في خلق اللَّه
    if(night&&!V){const G=new T.Group();G.position.set(-3.6,0,3.15);G.userData.act='stars';S.add(G);const dk=M(0x30343c),wt=M(0xf4f6fa);
      [0,2.1,4.2].forEach(a=>{const l=add(new T.CylinderGeometry(.025,.025,.95,6),dk,Math.sin(a)*.16,.44,Math.cos(a)*.16,G);l.rotation.set(Math.cos(a)*.33,0,-Math.sin(a)*.33)});
      const tb=add(new T.CylinderGeometry(.1,.07,.85,12),wt,0,1.02,0,G);tb.rotation.z=-.95;add(new T.CylinderGeometry(.11,.11,.06,12),dk,.36,1.27,0,G).rotation.z=-.95;
      if(!D3.stg)mark(G,'🔭','#6b5bd6',2,0,.75)}
    // 🌴 مائدة إفطار الصائم قرب الجامع في رمضان قبل المغرب
    if(!V&&iftarNow()){const G=new T.Group();G.position.set(IFT[0],0,IFT[1]);G.userData.act='iftar';S.add(G);const br=M(0x5a2e12);
      box(2.2,.08,.8,M(0xffffff),0,.72,0,G);[[-1,-.3],[1,-.3],[-1,.3],[1,.3]].forEach(([x,z])=>add(new T.CylinderGeometry(.04,.04,.7,6),M(0x8b5a2b),x,.35,z,G));
      [-.7,0,.7].forEach(x=>{add(new T.CylinderGeometry(.22,.18,.05,14),M(0xe9d8b4),x,.78,-.12,G);for(let i=0;i<5;i++)ell(.05,1,.7,1.6,br,x+(i%3-1)*.08,.82,-.12+(i>2?.07:-.03),G)});
      [-.9,-.35,.35,.9].forEach(x=>add(new T.CylinderGeometry(.06,.05,.15,10),M(0xbfe6ff,{transparent:true,opacity:.75,roughness:.1}),x,.83,.2,G));
      if(!D3.ift)mark(G,'🌙','#c98a12',2,0,.8)}
    // 📖 حلقة القرآن في الجامع بعد المغرب
    if(!V&&LV('m')>0&&halaqaNow()&&!D3.hq){const G=new T.Group();G.position.set(4.7,0,3.5);G.userData.act='halaqa';S.add(G);mark(G,'📖','#1f8a5a',3.4,0,.9)}
    // 👴 بيت جدّو: زيارة الجمعة (صلة الرحم)، وفي العيد العيدية
    if(!V){const ed=festNow()==='eid'&&!D3.eid,fr=wDay()===5&&!D3.gp;if(ed||fr){const G=new T.Group();G.position.set(-4.7,0,NBZ-.2);G.userData.act='grandpa';S.add(G);mark(G,ed?'🎁':'👴',ed?'#e2504a':'#8a5a00',3.2,0,.9)}}
    // ---- (v17.1) 🏘️ أحياء سكنية: بيوت بطابق إلى ثلاثة، بألوان مختلفة، نوافذ تضيء ليلًا، خزّان ماء ومكيّف — مرسومة بـ InstancedMesh (خفيفة)
    {const n=HOUSES.length,HC=[0xf3e3c3,0xe6efe0,0xffe2d6,0xd6eaff,0xfff0b3,0xeadcf5,0xf6d7b0,0xffffff],o=new T.Object3D(),col=new T.Color(),fh=1.45,hw=4,hd=4.4;
      let nw=0;HOUSES.forEach(h=>nw+=h[2]*4);
      const mk=(geo,mat,cnt)=>{const m=new T.InstancedMesh(geo,mat,cnt);m.castShadow=m.receiveShadow=!liteOn();m.userData.act='house';S.add(m);return m};
      const BX=new T.BoxGeometry(1,1,1),wI=mk(BX,new T.MeshStandardMaterial({roughness:.85}),n),pI=mk(BX,M(0xffffff),n),dI=mk(BX,M(0x6b4a2f),n),aI=mk(BX,M(0xe8eaee),n),
        tI=mk(new T.CylinderGeometry(.42,.42,.8,12),M(0x2f6fd0),n),gI=mk(BX,winM,nw),sI=mk(BX,M(night?0x8a8070:0xb7a990),n);let gi=0;
      const put=(I,i,x,y,z,sx,sy,sz)=>{o.position.set(x,y,z);o.rotation.set(0,0,0);o.scale.set(sx,sy,sz);o.updateMatrix();I.setMatrixAt(i,o.matrix)};
      HOUSES.forEach(([x,z,f,c,fc],i)=>{const H=f*fh;put(wI,i,x,H/2+.25,z,hw,H,hd);col.setHex(HC[c]);if(night)col.multiplyScalar(.8);wI.setColorAt(i,col);
        put(sI,i,x,.13,z,hw+.18,.26,hd+.18);put(pI,i,x,H+.36,z,hw+.14,.24,hd+.14);put(dI,i,x+fc*(hw/2+.02),.85,z+.9,.06,1.2,.75);
        put(aI,i,x-fc*(hw/2+.18),1.2,z-1.2,.32,.38,.7);put(tI,i,x-fc*.8,H+.78,z-1,1,1,1);
        for(let k=0;k<f;k++){const y=.25+fh*k+.85;[-1.1,1.1].forEach(dz=>{if(k===0&&dz>0)return;put(gI,gi++,x+fc*(hw/2+.03),y,z+dz,.05,.62,.7)});put(gI,gi++,x,y,z+hd/2+.03,.8,.62,.05);put(gI,gi++,x,y,z-hd/2-.03,.8,.62,.05)}});
      gI.count=gi;wI.instanceColor.needsUpdate=true}
    // ---- 🏊 مسبح الأولاد (مكشوف): ماء أزرق، حافة بيضاء، سلّم، كرسي المنقذ، مظلّات، زحليقة، وسبّاحون صغار حين يكون مفتوحًا
    {const G=new T.Group();G.position.set(POOLB[0],0,POOLB[1]);G.userData.act='poolB';S.add(G);const wh=M(0xffffff),tl=M(night?0x9aa6b0:0xd8e6ee);
      box(9.4,.1,7.6,tl,0,.05,0,G);box(6.6,.14,4.4,wh,-.6,.12,0,G);const wt=new T.Mesh(new T.BoxGeometry(6,.06,3.8),new T.MeshStandardMaterial({color:0x3fb6ff,roughness:.08,metalness:.1,emissive:night?0x0a3a6a:0x0a4a7a,emissiveIntensity:.5,transparent:true,opacity:.92}));wt.position.set(-.6,.2,0);G.add(wt);
      [[-1.8,0],[.6,0]].forEach(([x])=>{});for(let i=0;i<5;i++)box(.04,.03,3.7,M(0xffffff),-3.2+i*1.3,.24,0,G); // حبال الممرّات
      [-1,1].forEach(k=>add(new T.TorusGeometry(.18,.03,6,12,Math.PI),M(0xc0c8d0,{metalness:.7,roughness:.3}),2.5,.4,k*.35,G).rotation.y=Math.PI/2);
      {const ch=new T.Group();ch.position.set(3.6,0,-2.6);G.add(ch);[[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]].forEach(([a,b])=>box(.06,1.6,.06,M(0xffffff),a,.8,b,ch));box(.6,.06,.6,M(0xe2504a),0,1.6,0,ch);box(.6,.6,.06,M(0xe2504a),0,1.9,-.28,ch)}
      [[3.5,2.4,0xff6b6b],[-4.2,2.9,0xffd23f]].forEach(([x,z,c])=>{add(new T.CylinderGeometry(.04,.04,2,6),M(0xdddddd),x,1,z,G);add(new T.ConeGeometry(1.1,.5,10),M(c),x,2.1,z,G);box(.5,.08,1.2,M(0xffffff),x+.7,.35,z,G)});
      {const sl=box(.6,.08,2.4,M(0x4fc3ff),-3.6,.85,-2.6,G);sl.rotation.x=.45;box(.12,1.7,.12,M(0xffd23f),-3.85,.85,-3.7,G);box(.12,1.7,.12,M(0xffd23f),-3.35,.85,-3.7,G)}
      for(let x=-4.6;x<=4.61;x+=.6)[-3.75,3.75].forEach(z=>box(.07,.8,.07,M(0xffffff),x,.4,z,G));for(let z=-3.75;z<=3.76;z+=.6){if(Math.abs(z)<.9)continue;[-4.65,4.65].forEach(x=>box(.07,.8,.07,M(0xffffff),x,.4,z,G))}
      [-3.75,3.75].forEach(z=>box(9.3,.05,.05,M(0xffffff),0,.78,z,G));label('🏊 مسبح الأولاد',3,2.6,0,.6,G);
      if(!night&&poolOpen()){const cap=[0xe2504a,0x2f6fd0,0xffd23f,0x1fa463],sk=M(0xf2c9a0);for(let i=0;i<4;i++){const K=new T.Group();G.add(K);add(new T.SphereGeometry(.17,12,10),sk,0,0,0,K);add(new T.SphereGeometry(.175,12,8,0,Math.PI*2,0,Math.PI/2),M(cap[i]),0,.02,0,K);
          const ring=add(new T.TorusGeometry(.26,.08,8,16),M(i%2?0xff6b6b:0xffd23f),0,-.12,0,K);ring.rotation.x=Math.PI/2;anim.push(t=>{const a=t*.25+i*1.6;K.position.set(-.6+Math.cos(a)*2.2,.36+Math.sin(t*2+i)*.04,Math.sin(a)*1.3)})}}
      if(!V&&!(day().pool))mark(G,'🏊','#2f8fe0',3.4,0,.85)}
    // ---- 🧕 مسبح البنات: بناية مسقّفة ومستورة بنوافذ عالية، وقبّة زجاجية للضوء، ولافتة
    {const G=new T.Group();G.position.set(POOLG[0],0,POOLG[1]);G.userData.act='poolG';S.add(G);const wl=M(0xf6e0ec),tr=M(0xd94f8a);
      box(8,3,5.6,wl,0,1.5,0,G);box(8.1,.3,5.7,tr,0,3.1,0,G);box(8.1,.22,5.7,M(0xffffff),0,.11,0,G);
      const dm=add(new T.SphereGeometry(1.4,20,12,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:0xbfe6ff,transparent:true,opacity:.75,roughness:.1,emissive:night?0x335577:0x000000}),0,3.2,0,G);
      for(let i=0;i<5;i++)[-1,1].forEach(k=>box(.9,.35,.05,winM,-3.2+i*1.6,2.45,k*2.83,G));
      box(.06,1.6,1.2,M(0xb83a72),4.02,.8,0,G);box(.5,.08,1.8,tr,4.25,1.75,0,G);label('🧕 مسبح البنات',0,4.9,0,.6,G);
      if(!V&&!(day().pool))mark(G,'🏊','#d94f8a',5.6,0,.85)}
    // ---- 🚦 مدرسة تعليم السياقة: ساحة بمسار، أقماع، علامة «قف»، إشارة ضوئية صغيرة، ومكتب على الطريق
    {const G=new T.Group();G.position.set(DRV[0],0,DRV[1]);G.userData.act='drvs';S.add(G);
      box(13,.08,12,M(night?0x8f8f86:0xcfcbbd),0,.04,0,G);const tr=new T.Mesh(new T.RingGeometry(3.2,5.0,40),M(night?0x2a2c31:0x3b3e44));tr.rotation.x=-Math.PI/2;tr.scale.set(1.12,1,1);tr.position.y=.09;G.add(tr);
      const dl=new T.Mesh(new T.RingGeometry(4.05,4.15,40),new T.MeshBasicMaterial({color:0xffffff}));dl.rotation.x=-Math.PI/2;dl.scale.set(1.12,1,1);dl.position.y=.1;G.add(dl);
      const cone=M(0xff7a1a);for(let i=0;i<14;i++){const a=i/14*Math.PI*2;[5.25,2.95].forEach(r=>{add(new T.ConeGeometry(.16,.42,10),cone,Math.cos(a)*r*1.12,.29,Math.sin(a)*r,G)})}
      {const sp=new T.Group();sp.position.set(-5.4*1.12*0+0,0,-5.4);G.add(sp);add(new T.CylinderGeometry(.04,.04,1.6,6),M(0x9a9a9a),0,.8,0,sp);
        const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#d32020';x.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;x.lineTo(64+60*Math.cos(a),64+60*Math.sin(a))}x.fill();x.fillStyle='#fff';x.font='900 46px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('قف',64,68);
        const st=new T.Mesh(new T.CircleGeometry(.4,8),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.DoubleSide}));st.position.set(0,1.7,0);st.rotation.y=Math.PI/2;sp.add(st)}
      {const L=new T.Group();L.position.set(5.9,0,0);G.add(L);add(new T.CylinderGeometry(.05,.05,1.8,6),M(0x333333),0,.9,0,L);box(.3,.8,.3,M(0x222222),0,2,0,L);
        const lm=[0xff3030,0xffc21a,0x30d060].map((c,i)=>add(new T.SphereGeometry(.09,8,6),new T.MeshBasicMaterial({color:c}),-.16,2.25-i*.25,0,L));anim.push(()=>{const q=sig();lm[0].visible=q==='r';lm[1].visible=q==='y';lm[2].visible=q==='g'})}
      {const wl=M(0xfff3c4),rf=M(0xe2504a);box(3,2.2,2.6,wl,-5.2,1.1,4.2,G);box(3.2,.2,2.8,rf,-5.2,2.3,4.2,G);box(.06,1.3,.8,M(0x6b4a2f),-6.72,.65,4.2,G);[3.3,5.1].forEach(z=>box(.06,.6,.6,winM,-6.72,1.4,z,G));
        label('🚦 مدرسة تعليم السياقة',-5.2,3.4,4.2,.62,G)}
      if(!V&&!CARS.lic)mark(G,'🪪','#2f6fd0',4.2,-5.2,.9)}
    // ---- 🚗 معرض السيارات: قاعة زجاجية، أرضية لامعة، منصّات دوّارة (السيارات نفسها في makeLife/run)، ولافتة
    {const G=new T.Group();G.position.set(SHOW[0],0,SHOW[1]);G.userData.act='showroom';S.add(G);const fr=M(0xf4f6f8,{metalness:.3,roughness:.4});
      box(9.2,.16,7,M(night?0x6f7680:0xe9ecef,{roughness:.2,metalness:.2}),0,.08,0,G);
      const gm=new T.MeshStandardMaterial({color:0xbfe6ff,transparent:true,opacity:.28,roughness:.05,metalness:.3,side:T.DoubleSide,depthWrite:false});
      [[0,3.5,9.2,0],[0,-3.5,9.2,0]].forEach(([x,z,w])=>{const m=new T.Mesh(new T.PlaneGeometry(w,2.8),gm);m.position.set(x,1.55,z);G.add(m)});[[-4.6],[4.6]].forEach(([x])=>{const m=new T.Mesh(new T.PlaneGeometry(7,2.8),gm);m.rotation.y=Math.PI/2;m.position.set(x,1.55,0);G.add(m)});
      [[-4.6,-3.5],[4.6,-3.5],[-4.6,3.5],[4.6,3.5],[-4.6,0],[0,-3.5],[0,3.5]].forEach(([x,z])=>box(.14,2.9,.14,fr,x,1.5,z,G));[[0,3.55,9.5,.2],[0,-3.55,9.5,.2],[-4.65,0,.2,7.3],[4.65,0,.2,7.3]].forEach(([x,z,w,d])=>box(w,.3,d,fr,x,3.05,z,G));{const rf=new T.Mesh(new T.PlaneGeometry(9.2,7),gm);rf.rotation.x=-Math.PI/2;rf.position.y=3.02;G.add(rf)}
      [[-2.6,-1.5],[0,-1.5],[2.6,-1.5],[-1.3,1.6],[1.3,1.6]].forEach(([x,z])=>{const d=add(new T.CylinderGeometry(1.05,1.05,.08,24),M(0xd4af37,{metalness:.7,roughness:.3}),x,.2,z,G);d.castShadow=false});
      {const c=document.createElement('canvas');c.width=512;c.height=112;const x=c.getContext('2d');x.fillStyle='#1d2b3a';x.fillRect(0,0,512,112);x.fillStyle='#ffd84a';x.font='900 56px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🚗 معرض السيارات',256,60);
        const sg=new T.Mesh(new T.PlaneGeometry(4,.85),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.DoubleSide}));sg.position.set(-4.68,3.6,0);sg.rotation.y=Math.PI/2;G.add(sg)}
      if(!V&&CARS.lic&&(CARS.own||[]).length<CARL.length)mark(G,'🚗','#c98a12',4.6,0,.85)}
    // 👛 محفظة ضائعة على الرصيف (مرة في اليوم): يسلّمها الطفل لمركز الشرطة
    if(!V&&!night&&!D3.wl&&!D3.wlc){const [x,z]=WALLETS[seed()%WALLETS.length],G=new T.Group();G.position.set(x,0,z);G.userData.act='wallet';S.add(G);S.userData.wallet=G;
      box(.34,.07,.24,M(0x7a4a22),0,.05,0,G);box(.1,.075,.1,M(0xc9a227,{metalness:.6}),.11,.055,0,G);mark(G,'👛','#c98a12',1.3,0,.7)}}
  // ---- 🚌 (v14.7) مظلّتا موقف الباص: سقف، أعمدة، لوح زجاجي خلفي، مقعد، ولافتة ----
  BSTOP.forEach(([dir,z,sx,wx])=>{const G=new T.Group(),k=sx>0?1:-1;G.position.set(wx+k*.35,0,z);G.userData.act='busStop';S.add(G);const pm=M(0x5d6670,{metalness:.4,roughness:.5});
    [[-1.3,-.4],[1.3,-.4],[-1.3,.4],[1.3,.4]].forEach(([a,b])=>add(new T.CylinderGeometry(.05,.05,2.2,8),pm,k*b,1.1,a,G));
    box(1.15,.08,3,M(0x2f7d5a),0,2.24,0,G);const gl=new T.Mesh(new T.PlaneGeometry(2.6,1.5),new T.MeshStandardMaterial({color:0xbfe6ff,transparent:true,opacity:.35,side:T.DoubleSide,roughness:.1}));gl.rotation.y=Math.PI/2;gl.position.set(k*.42,1.3,0);G.add(gl);
    box(.38,.06,2.2,M(0x8b5a2b),k*.15,.48,0,G);[-.9,.9].forEach(a=>box(.06,.45,.06,pm,k*.15,.24,a,G));
    add(new T.CylinderGeometry(.04,.04,2.6,8),pm,-k*.55,1.3,-1.75,G);const sg=markSprite(T,'🚌','#2f6fd0',.9);sg.position.set(-k*.55,2.85,-1.75);G.add(sg);
    });
  // ---- 🏥 (v15.2) طلب الشيخ: مستشفى المدينة. يُبنى بثلاث مراحل من binaa.js (الجزء hp): ٠ أرض فارغة بلوحة «هنا يُبنى» ← ١ مستوصف ← ٢ مستشفى بطابقين ← ٣ مستشفى كبير بسيارة إسعاف.
  // واجهته (محليًا +z) تُدار نحو الطريق (−x). المس الأرض الفارغة لتبنيه، والمستشفى المبني لتزور المرضى (A.hospital).
  const hpL=(()=>{const uc=V?String(V.u||''):(window.Binaa?Binaa.code():'');return Math.max(0,Math.min(3,+uc[5]||0))})(),hpJob=!V&&window.Binaa&&Binaa.job&&Binaa.job.p==='hp';
  const HG=new T.Group();HG.position.set(HSP[0],0,HSP[1]);HG.rotation.y=-Math.PI/2;HG.userData.act=hpL&&!hpJob?'hospital':'bn_hp';S.add(HG);let hpTop=2.4;
  {const G=HG,wh=M(night?0xd9dde2:0xf7f8fa,{roughness:.6}),bl=M(0x7fc4e8),gr=M(0x1fa463),rd=M(0xd8282d),dk=M(0x2b3440),
      gl=new T.MeshStandardMaterial({color:night?0xffe6a0:0x9ccbe6,roughness:.15,metalness:.3,emissive:night?0xffd27a:0x000000,emissiveIntensity:night?.9:0});
    const lot=add(new T.PlaneGeometry(11,12),M(hpL?(night?0x8f8a80:0xd9d3c4):0xb08a5c,{roughness:1,polygonOffset:true,polygonOffsetFactor:-2}),0,.05,0,G);lot.rotation.x=-Math.PI/2;lot.receiveShadow=true;
    const cres=(x,y,z,r,p)=>{const a=add(new T.CircleGeometry(r,24),rd,x,y,z,p);const b=add(new T.CircleGeometry(r*.82,24),wh,x+r*.38,y+r*.08,z+.005,p);[a,b].forEach(m=>m.castShadow=false)};
    if(!hpL){ // أرض فارغة بأوتاد ولوحة
      [[-5,-4],[5,-4],[-5,4],[5,4],[0,-4],[0,4],[-5,0],[5,0]].forEach(([x,z])=>box(.12,.6,.12,M(0xc98a3a),x,.3,z,G));
      [[-5,-4,-5,4],[5,-4,5,4],[-5,-4,5,-4],[-5,4,5,4]].forEach(([x1,z1,x2,z2])=>box(Math.abs(x2-x1)||.03,.04,Math.abs(z2-z1)||.03,M(0xff6b3a),(x1+x2)/2,.5,(z1+z2)/2,G));
      box(.12,1.6,.12,M(0x8f6238),-1,.8,4.3,G);box(.12,1.6,.12,M(0x8f6238),1,.8,4.3,G);box(2.6,1.2,.08,wh,0,1.8,4.32,G);cres(0,1.8,4.37,.36,G);hpTop=3.2;
      label(V?'🏥 أرض المستشفى':'🏥 هنا يُبنى مستشفى المدينة',0,2.9,4.3,.62,G)}
    else{const W=hpL>=3?8.4:hpL>=2?7.4:6,D=hpL>=3?5.2:4.6,FH=2.1,fl=hpL,H=fl*FH;
      box(W,.3,D,M(0xbfb6a6),0,.15,0,G);box(W-.1,H,D-.1,wh,0,.3+H/2,0,G);
      for(let f=0;f<fl;f++){const y=.3+f*FH;box(W,.12,D,bl,0,y+FH-.06,0,G); // شريط أزرق بين الطوابق
        for(let x=-W/2+.8;x<W/2-.5;x+=1.15){if(f===0&&Math.abs(x)<1)continue;[1,-1].forEach(k=>{const w=box(.75,.9,.05,gl,x,y+1.05,k*(D/2-.03),G);w.castShadow=false})}
        for(let z=-D/2+.9;z<D/2-.6;z+=1.2)[1,-1].forEach(k=>{const w=box(.05,.9,.75,gl,k*(W/2-.03),y+1.05,z,G);w.castShadow=false})}
      box(W+.2,.25,D+.2,M(0xe8ecef),0,.3+H+.12,0,G); // حافة السطح
      // المدخل: باب زجاجي، مظلّة، درجات، لوحة بالهلال الأحمر
      box(1.6,1.6,.06,gl,0,1.1,D/2+.01,G);box(.08,1.6,.08,dk,0,1.1,D/2+.04,G);box(2.4,.12,1.3,wh,0,2.0,D/2+.6,G);[-1.1,1.1].forEach(x=>box(.1,1.7,.1,wh,x,1.15,D/2+1.15,G));
      box(2.2,.12,.5,M(0xd9d3c4),0,.06,D/2+.4,G);box(2.6,.7,.08,wh,0,2.55,D/2+.02,G);cres(-.8,2.55,D/2+.07,.25,G);
      const nm=hpL>=3?'مستشفى المدينة':hpL>=2?'مستشفى المدينة':'مستوصف المدينة';const sg=new T.Mesh(new T.PlaneGeometry(2.1,.46),new T.MeshBasicMaterial({map:textSprite(T,nm,'rgba(255,255,255,0)','#c0392b').material.map,transparent:true}));sg.position.set(.3,2.55,D/2+.07);G.add(sg);
      cres(0,.3+H-.75,-D/2-.03,.45,G);G.children[G.children.length-1].rotation.y=Math.PI;G.children[G.children.length-2].rotation.y=Math.PI; // هلال على الظهر
      // أصص ومقاعد انتظار
      [-2,2].forEach(x=>{add(new T.CylinderGeometry(.25,.2,.4,10),M(0xc9784a),x,.2,D/2+.6,G);const b=add(TG[0],LF[1],x,.6,D/2+.6,G);b.scale.setScalar(.3)});
      box(1.2,.08,.35,M(0x8f6238),-3,.45,D/2+.9,G);[-3.5,-2.5].forEach(x=>box(.06,.45,.3,dk,x,.22,D/2+.9,G));
      if(hpL>=2){box(1.6,.9,1,wh,W/2+.75,.75,-D/2+.8,G);cres(W/2+1.56,1,-D/2+.8,.2,G);G.children[G.children.length-1].rotation.y=Math.PI/2;G.children[G.children.length-2].rotation.y=Math.PI/2}
      if(hpL>=3){ // مهبط على السطح وسيارة إسعاف بضوء يومض
        const hp=add(new T.CylinderGeometry(1.3,1.3,.05,28),M(0x2f8f5a),0,.3+H+.27,0,G);hp.castShadow=false;const hr=add(new T.TorusGeometry(1.05,.06,6,28),M(0xffffff),0,.3+H+.31,0,G);hr.rotation.x=Math.PI/2;
        const A=new T.Group();A.position.set(3,0,D/2+2.3);G.add(A);
        box(2.6,1.3,1.3,wh,-.2,.95,0,A);box(.9,.95,1.25,wh,1.4,.78,0,A);box(.05,.5,1.1,gl,1.86,1.0,0,A);box(3.4,.16,1.32,rd,.1,.65,0,A);
        cres(-.2,1.1,.66,.22,A);[[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([x,k])=>{const w=add(new T.CylinderGeometry(.27,.27,.2,14),M(0x1e1e1e),x*.95,.27,k*.6,A);w.rotation.x=Math.PI/2});
        const lr=add(new T.BoxGeometry(.25,.14,.35),new T.MeshStandardMaterial({color:0xff2a2a,emissive:0xff0000,emissiveIntensity:1}),.3,1.67,-.25,A),lb=add(new T.BoxGeometry(.25,.14,.35),new T.MeshStandardMaterial({color:0x2a6aff,emissive:0x0040ff,emissiveIntensity:1}),.3,1.67,.25,A);
        anim.push(t=>{const on=Math.sin(t*5)>0;lr.material.emissiveIntensity=on?1.6:.1;lb.material.emissiveIntensity=on?.1:1.6})}
      hpTop=.3+H+1.2}}
  // ---- 🧱🌳 (v15.0) سور البيت وبستانه وأشجاره الثلاث، كلٌّ بثلاث مراحل (binaa.js: نفس مستويات البيت القديم) ----
  // السور: ١ خشبي ← ٢ حجر ← ٣ رخام أبيض بحافة ذهبية وفوانيس. البستان خلف البيت: ١ عشب وسياج شجيرات ← ٢ ورود وممرّ حجري ← ٣ نافورة وفوانيس.
  // الأشجار: ١ شتلة ← ٢ شجرة ← ٣ شجرة مثمرة (تفّاح، رمّان، برتقال). المس أيّ جزء لتبنيه أو تطوّره (Binaa.open).
  {const uc=V?String(V.u||''):(window.Binaa?Binaa.code():''),BL=k=>Math.max(0,Math.min(3,+uc[k]||0)),wL=BL(0),gL=BL(1),tL=[BL(2),BL(3),BL(4)];
    const job=V||!window.Binaa?null:Binaa.job;
    const WG=new T.Group();WG.userData.act='bn_w';S.add(WG);
    const segs=[[XF,-HZ,XF,-.8],[XF,2.9,XF,HZ],[XF,HZ,XL,HZ],[XF,-HZ,XL,-HZ],[XL,-HZ,XL,HZ]],pil=[[XF,-HZ],[XF,-.8],[XF,2.9],[XF,HZ],[XL,HZ],[XL,-HZ],[XL,0],[-8.7,HZ],[-8.7,-HZ]];
    const along=(a,b,f)=>{const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);f((a[0]+b[0])/2,(a[1]+b[1])/2,L,Math.abs(dx)>Math.abs(dz)?'x':'z',dx,dz)};
    if(wL===1){const wd=M(0xb98552),wd2=M(0x8f6238);segs.forEach(([x1,z1,x2,z2])=>along([x1,z1],[x2,z2],(cx,cz,L,ax,dx,dz)=>{
        const n=Math.max(1,Math.round(L/.26));for(let i=0;i<=n;i++){const u=i/n,x=x1+dx*u,z=z1+dz*u;box(.08,.72,.08,wd,x,.36,z,WG);const tp=add(new T.ConeGeometry(.06,.1,4),wd,x,.77,z,WG)}
        [.25,.55].forEach(y=>box(ax==='x'?L:.05,.07,ax==='x'?.05:L,wd2,cx,y,cz,WG))}));pil.forEach(([x,z])=>box(.16,.9,.16,M(0x8f6238),x,.45,z,WG))}
    if(wL===2){const sm=M(night?0x9a9282:0xcfc3a8),cap=M(night?0x7f7768:0xa89a7c);segs.forEach(([x1,z1,x2,z2])=>along([x1,z1],[x2,z2],(cx,cz,L,ax)=>{
        box(ax==='x'?L:.24,.85,ax==='x'?.24:L,sm,cx,.425,cz,WG);box(ax==='x'?L+.06:.32,.08,ax==='x'?.32:L+.06,cap,cx,.89,cz,WG)}));
      pil.forEach(([x,z])=>{box(.38,1.1,.38,sm,x,.55,z,WG);box(.46,.1,.46,cap,x,1.13,z,WG)})}
    if(wL>=3){const mb=M(0xf7f5f0,{roughness:.35}),gd=M(0xd4a520,{metalness:.7,roughness:.3}),lmp=M(0xfff1b0,{emissive:0xffd860,emissiveIntensity:night?1.8:.35});
      segs.forEach(([x1,z1,x2,z2])=>along([x1,z1],[x2,z2],(cx,cz,L,ax)=>{box(ax==='x'?L:.26,.95,ax==='x'?.26:L,mb,cx,.475,cz,WG);box(ax==='x'?L+.04:.32,.06,ax==='x'?.32:L+.04,gd,cx,.98,cz,WG);box(ax==='x'?L:.28,.05,ax==='x'?.28:L,gd,cx,.15,cz,WG)}));
      pil.forEach(([x,z])=>{box(.42,1.25,.42,mb,x,.625,z,WG);box(.5,.06,.5,gd,x,1.28,z,WG);add(new T.SphereGeometry(.13,12,10),lmp,x,1.43,z,WG)});
      const ar=new T.Mesh(new T.TorusGeometry(1.85,.09,8,28,Math.PI),gd);ar.position.set(XF,1.25,1.05);ar.rotation.y=Math.PI/2;WG.add(ar)}
    if(wL===0){[[XF,-.8],[XF,2.9]].forEach(([x,z])=>box(.14,.5,.14,M(0xb98552),x,.25,z,WG));const pg=add(new T.PlaneGeometry(.04,.04),M(0xffffff),XF,.01,1,WG)}
    // البستان خلف البيت
    const GG=new T.Group();GG.userData.act='bn_g';S.add(GG);const GX0=XL+.3,GX1=-8.75,GCX=(GX0+GX1)/2,GW=GX1-GX0,GD=HZ*2-.4;
    const soil=new T.Mesh(new T.PlaneGeometry(GW,GD),M(gL?(night?0x3f7d3a:0x5cbf4f):0xb08a5c,{roughness:1}));soil.rotation.x=-Math.PI/2;soil.position.set(GCX,.03,0);soil.receiveShadow=true;GG.add(soil);
    if(gL>=1){const hg=M(night?0x2f6a32:0x3f9a3e,{flatShading:true});for(let x=GX0+.3;x<GX1-.2;x+=.62)[-1,1].forEach(k=>{const b=add(TGL[0],hg,x,.32,k*(HZ-.42),GG);b.scale.set(.36,.34,.3)});
      for(let z=-HZ+.8;z<HZ-.7;z+=.62){const b=add(TGL[1],hg,GX0+.15,.32,z,GG);b.scale.set(.3,.34,.36)}}
    if(gL>=2){const pv=M(night?0xa69c88:0xe2d6bd);for(let x=GX1-.4;x>GX0+1.4;x-=.55){const st=add(new T.CylinderGeometry(.24,.24,.05,10),pv,x,.05,0,GG);st.receiveShadow=true}
      const FC=[0xff5c8a,0xffd23f,0xff8c42,0xb07cff,0xffffff,0xe2504a];let k=0;[-1,1].forEach(s2=>{for(let x=GX0+.9;x<GX1-.5;x+=.32){for(let r=0;r<2;r++){const f=add(new T.SphereGeometry(.09,6,5),M(FC[k++%6]),x+(r?.16:0),.2,s2*(HZ-.95-r*.25),GG);f.castShadow=false;
            const st=add(new T.CylinderGeometry(.015,.015,.16,4),M(0x2f7d3a),x+(r?.16:0),.1,s2*(HZ-.95-r*.25),GG);st.castShadow=false}}})}
    if(gL>=3){const FX=GX0+2.1,stn=M(0xe9e2d4),wtr=new T.MeshStandardMaterial({color:0x5fb8ee,roughness:.1,metalness:.2,transparent:true,opacity:.85});
      add(new T.CylinderGeometry(.85,.95,.4,24),stn,FX,.2,0,GG);const wv=add(new T.CircleGeometry(.75,24),wtr,FX,.41,0,GG);wv.rotation.x=-Math.PI/2;
      add(new T.CylinderGeometry(.12,.16,.8,10),stn,FX,.6,0,GG);add(new T.CylinderGeometry(.35,.25,.12,14),stn,FX,1.0,0,GG);
      const jet=add(new T.ConeGeometry(.08,.5,8),wtr,FX,1.3,0,GG);anim.push(t=>{jet.scale.y=.8+Math.sin(t*6)*.2;wv.material.opacity=.75+Math.sin(t*2)*.1});
      const lmp=M(0xfff1b0,{emissive:0xffd860,emissiveIntensity:night?1.8:.3});[[GX0+.7,-HZ+.7],[GX0+.7,HZ-.7],[GX1-.6,-HZ+.7],[GX1-.6,HZ-.7]].forEach(([x,z])=>{add(new T.CylinderGeometry(.04,.05,1.1,8),M(0x2b2b2b),x,.55,z,GG);add(new T.SphereGeometry(.12,10,8),lmp,x,1.15,z,GG)})}
    // الأشجار الثلاث
    const TZ=[-2.1,0,2.1],FRC=[0xd8282d,0x9e1b32,0xff9a1f],TGs=[];
    tL.forEach((L,i)=>{const G=new T.Group();G.position.set(XL+1.15,0,TZ[i]);G.userData.act='bn_t'+i;S.add(G);TGs.push(G);
      if(!gL||!L){const m=add(new T.CircleGeometry(.4,14),M(0x8a6a44),0,.04,0,G);m.rotation.x=-Math.PI/2;return}
      if(L===1){add(new T.CylinderGeometry(.03,.04,.7,6),bark,0,.35,0,G);const b=add(TG[i%3],LF2[i%4],0,.8,0,G);b.scale.setScalar(.28);add(new T.CylinderGeometry(.015,.015,.8,4),M(0xc9a26a),.12,.4,0,G)}
      else{tree(0,0,G,L===2?.8:1);if(L>=3)for(let k=0;k<12;k++){const a=k*2.4+i,y=1.55+(k%4)*.18,r=.88;const f=add(new T.SphereGeometry(.09,8,6),M(FRC[i],{roughness:.4}),Math.cos(a)*r,y,Math.sin(a)*r,G);f.castShadow=false}}});
    // علامات الورشة: 👷 أثناء البناء، ✔ عند الاستلام، و⬆/+ على الجزء المقترح التالي
    if(!V&&window.Binaa){const gp={w:[WG,XF,1.6,1],g:[GG,GCX,1.4,0],t0:[TGs[0],0,2.6,0],t1:[TGs[1],0,2.6,0],t2:[TGs[2],0,2.6,0],hp:[HG,0,hpTop,0]},mk=(p,e,c)=>{const [G2,x,y,z]=gp[p];const sp=markSprite(T,e,c,1.1);
        if(G2===WG||G2===GG){const H=new T.Group();H.position.set(x,0,p==='w'?1.05:0);G2.add(H);sp.position.set(0,y,0);sp.userData.y=y;H.add(sp)}else{sp.position.set(0,y,0);sp.userData.y=y;G2.add(sp)}marks.push(sp)};
      if(job){mk(job.p,job.ready?'✔':'👷',job.ready?'#1fa463':'#2f6fd0');
        const [G2,x]=gp[job.p];if(!job.ready){const wk=new T.Group();wk.position.set(G2===HG?HSP[0]-6:G2===WG?XF-.7:G2===GG?GCX:G2.position.x+.8,0,G2===HG?HSP[1]+2.2:G2===WG?-1.8:G2===GG?1.2:G2.position.z+.6);S.add(wk);
          add(new T.CylinderGeometry(.16,.2,.6,10),M(0xff8c1a),0,.5,0,wk);add(new T.SphereGeometry(.14,10,8),M(0xe8b48a),0,.95,0,wk);add(new T.SphereGeometry(.15,10,6,0,Math.PI*2,0,Math.PI/2),M(0xffd23f),0,1.0,0,wk);
          const hm=new T.Group();hm.position.set(.2,.7,0);wk.add(hm);add(new T.CylinderGeometry(.02,.02,.35,5),M(0x6b4423),0,.17,0,hm);box(.12,.07,.07,M(0x555555),0,.35,0,hm);anim.push(t=>{hm.rotation.z=-.4+Math.sin(t*9)*.7;wk.position.y=Math.abs(Math.sin(t*4.5))*.04})}}
      else{const L={w:wL,g:gL,t0:tL[0],t1:tL[1],t2:tL[2]},ok=p=>L[p]<3&&(p==='w'||(p==='g'?wL>=1:gL>=1));const cand=['w','g','t0','t1','t2'].filter(ok).sort((a,b)=>L[a]-L[b]);
        if(cand.length)mk(cand[0],L[cand[0]]?'⬆':'+','#f0a020')}
      if(!job||job.p!=='hp'){if(!hpL)mk('hp','+','#f0a020');else if(!day().hv&&!night)mk('hp','💐','#e2504a')}}}
  // ================= (v13.8) الدفعة الثانية: السماء، المطر وقوس قزح، الأغنام والراعي، زينة رمضان والعيد =================
  // ---- 🌅 قبّة سماء متدرّجة (تتلوّن عند الشروق والغروب — City3D.applySky في run) وقرص شمس قرب الأفق ----
  {const g=new T.SphereGeometry(700,32,20),n=g.attributes.position.count;g.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(n*3),3));
    const sky=new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-10;S.add(sky);
    const tc=new T.Color(),set=(top,hor)=>{const P=g.attributes.position,C=g.attributes.color;for(let i=0;i<n;i++){const f=Math.pow(Math.max(0,P.getY(i))/700,.5);tc.copy(hor).lerp(top,f);C.setXYZ(i,tc.r,tc.g,tc.b)}C.needsUpdate=true};
    S.userData.sky={set};set(new T.Color(night?0x0b1530:0x4aa3e6),new T.Color(night?0x223868:0xcdeeff));
    const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d'),gr=x.createRadialGradient(64,64,0,64,64,64);
    gr.addColorStop(0,'rgba(255,240,200,1)');gr.addColorStop(.25,'rgba(255,200,120,.95)');gr.addColorStop(.5,'rgba(255,150,80,.35)');gr.addColorStop(1,'rgba(255,120,60,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);
    const sd=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),fog:false,depthWrite:false,transparent:true}));sd.scale.set(110,110,1);sd.visible=false;sd.renderOrder=-9;S.add(sd);S.userData.sunDisc=sd;S.userData.sun=sun}
  // ---- 🌧️ المطر: قطرات تتساقط، برك صغيرة بتموّجات، وغيوم رمادية (City3D.debugRain للتجربة) ----
  if(RN){const N=1400,pos=new Float32Array(N*6),sp=[];for(let i=0;i<N;i++){const x=(Math.random()-.5)*110,y=Math.random()*35,z=(Math.random()-.5)*110-8;pos.set([x,y,z,x+.05,y+.75,z],i*6);sp.push(26+Math.random()*10)}
    const rg=new T.BufferGeometry();rg.setAttribute('position',new T.BufferAttribute(pos,3));const rl=new T.LineSegments(rg,new T.LineBasicMaterial({color:0xc6dbee,transparent:true,opacity:.55}));rl.frustumCulled=false;S.add(rl);
    anim.push((t,dt)=>{for(let i=0;i<N;i++){let y=pos[i*6+1]-sp[i]*dt;if(y<0)y+=35;pos[i*6+1]=y;pos[i*6+4]=y+.75}rg.attributes.position.needsUpdate=true});
    const pd=new T.MeshBasicMaterial({color:0x6f8faa,transparent:true,opacity:.35,depthWrite:false});
    [[-1,-9],[1.2,3],[-.8,12],[6,4.6],[-8,-4.6],[10,-4.6],[-2.4,-3],[.5,-20]].forEach(([x,z],i)=>{flat(add(new T.CircleGeometry(.55+(i%3)*.2,18),pd,x,.03,z));
      const rr=new T.Mesh(new T.RingGeometry(.1,.14,18),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.6}));flat(rr);rr.position.set(x,.04,z);S.add(rr);
      anim.push(t=>{const u=(t*.5+i*.37)%1;rr.scale.setScalar(1+u*4);rr.material.opacity=.6*(1-u)})})}
  // ---- 🌈 قوس قزح بعد المطر ----
  if(RBW&&!night){const RB=new T.Group();RB.position.set(20,-8,-210);S.add(RB);[0xff3b30,0xff9500,0xffcc00,0x34c759,0x30b0ff,0x3f51b5,0x9c27b0].forEach((c,i)=>{
      const a=new T.Mesh(new T.TorusGeometry(95-i*2.2,1.15,6,72,Math.PI),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.42,fog:false,depthWrite:false}));RB.add(a)})}
  // ---- 🐑 قطيع أغنام مع حَمَل صغير وكلب حراسة يرعى في المرج (يسار المزرعة) ----
  {const FL=new T.Group();FL.userData.act='sheep';S.add(FL);const wool=new T.MeshStandardMaterial({color:night?0xc9c4b8:0xf3efe6,roughness:1,flatShading:true}),blk=M(0x26221e),wg=new T.IcosahedronGeometry(1,1);
    const sheep=[];for(let i=0;i<11;i++){const lamb=i>=9,G=new T.Group();G.scale.setScalar(lamb?.45:.62);FL.add(G);
      [[0,.95,0,.55,.48,.75],[0,1.02,.35,.42,.4,.4],[0,1.02,-.35,.45,.42,.42],[.2,1.12,0,.35,.3,.45],[-.2,1.12,0,.35,.3,.45]].forEach(([x,y,z,a,b,c])=>{const m=add(wg,wool,x,y,z,G);m.scale.set(a,b,c);m.rotation.set(i,x,z)});
      const H=new T.Group();H.position.set(0,1.05,.72);G.add(H);ell(.17,.85,.95,1.3,blk,0,0,.08,H);[-1,1].forEach(k=>{const e=ell(.08,1.6,.45,.8,blk,k*.19,.06,-.02,H);e.rotation.z=k*-.4});
      add(wg,wool,0,.13,-.02,H).scale.set(.15,.1,.15);[-.06,.06].forEach(a=>ell(.022,1,1,1,M(0xf2f2f2),a,.05,.2,H));
      [[-.2,.3],[.2,.3],[-.2,-.3],[.2,-.3]].forEach(([x,z])=>add(new T.CylinderGeometry(.05,.045,.62,6),blk,x,.31,z,G));
      const s={G,H,x:FLK[0]+Math.cos(i*2.3)*(1+i%4),z:FLK[1]+Math.sin(i*2.3)*(1+i%4)*.7,tx:0,tz:0,w:Math.random()*4,ph:i};s.tx=s.x;s.tz=s.z;G.position.set(s.x,0,s.z);G.rotation.y=i;sheep.push(s)}
    // الكلب
    const DG=new T.Group();DG.scale.setScalar(.75);FL.add(DG);const br=M(0x8a5a2b),wh=M(0xf2ece0);
    ell(.3,.8,.7,1.45,br,0,.62,0,DG);ell(.2,.9,.8,1,wh,0,.6,.32,DG);const DH=new T.Group();DH.position.set(0,.92,.45);DG.add(DH);ell(.17,.95,.95,1.1,br,0,0,0,DH);
    ell(.09,.9,.75,1.3,wh,0,-.05,.17,DH);ell(.04,1,1,1,blk,0,-.02,.29,DH);[-1,1].forEach(k=>{const e=ell(.08,.6,1.3,.5,br,k*.12,.17,-.03,DH);e.rotation.z=k*.35});
    [[-.13,.3],[.13,.3],[-.13,-.3],[.13,-.3]].forEach(([x,z])=>add(new T.CylinderGeometry(.05,.045,.46,6),x<0?wh:br,x,.23,z,DG));
    const DT=new T.Group();DT.position.set(0,.72,-.4);DG.add(DT);const tl=add(new T.CylinderGeometry(.04,.025,.42,6),br,0,.2,0,DT);DT.rotation.x=-.7;
    let dogA=0;
    anim.push((t,dt)=>{sheep.forEach((s,i)=>{const G=s.G;if(s.w>0){s.w-=dt;const g=Math.max(0,Math.sin(t*.4+s.ph));s.H.rotation.x=g*.9;s.H.position.y=1.05-g*.35;
        if(s.w<=0){const a=Math.random()*6.28,r=Math.random()*4.2;s.tx=FLK[0]+Math.cos(a)*r;s.tz=FLK[1]+Math.sin(a)*r*.7;if(i>=9){const m=sheep[i-9];s.tx=m.G.position.x+.6;s.tz=m.G.position.z+.4}}return}
      s.H.rotation.x=0;s.H.position.y=1.05;const dx=s.tx-G.position.x,dz=s.tz-G.position.z,d=Math.hypot(dx,dz);if(d<.05){s.w=2+Math.random()*5;return}
      const v=Math.min(d,dt*(i>=9?.7:.45));G.position.x+=dx/d*v;G.position.z+=dz/d*v;let da=Math.atan2(dx,dz)-G.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));G.rotation.y+=da*Math.min(1,dt*3);G.position.y=Math.abs(Math.sin(t*4+i))*.03});
      dogA+=dt*.35;const r=5.6;DG.position.set(FLK[0]+Math.cos(dogA)*r,Math.abs(Math.sin(t*6))*.05,FLK[1]+Math.sin(dogA)*r*.75);DG.rotation.y=Math.atan2(-Math.sin(dogA),Math.cos(dogA)*.75);DT.rotation.z=Math.sin(t*8)*.5});
    }
  // ---- 🌙 زينة رمضان و🎉 العيد: أضواء ملوّنة فوق الشارع، فوانيس على الأعمدة، هلال ونجمة، ولافتة تهنئة (City3D.debugFest للتجربة) ----
  if(FEST||JOY){const ram=FEST==='ramadan',cols=ram?[0xffd23f,0xffffff,0x3fd27a,0xffb020]:[0xff5c8a,0xffd23f,0x4fc3ff,0x7be37b,0xb07cff,0xff9f43];
    const LM=cols.map(c=>new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:night?1.6:.5})),bg=new T.SphereGeometry(.09,8,6);
    [-13,-7.5,-1.8,7.5,13].forEach((z,r)=>{for(let i=0;i<=12;i++){const u=i/12,x=-2.25+u*4.2,y=2.62-Math.sin(Math.PI*u)*.55;const b=add(bg,LM[(i+r)%LM.length],x,y,z);b.castShadow=false}});
    anim.push(t=>LM.forEach((m,i)=>m.emissiveIntensity=(night?1.2:.35)+Math.max(0,Math.sin(t*2+i*1.7))*(night?1.2:.5)));
    // فوانيس
    const gold=M(0xc9a227,{metalness:.7,roughness:.3}),glow=new T.MeshStandardMaterial({color:0xffe08a,emissive:0xffb030,emissiveIntensity:night?2:.6,transparent:true,opacity:.9});
    LAMPS.forEach(([x,z],i)=>{if(Math.abs(x)>3)return;const s=x<0?1:-1,G=new T.Group();G.position.set(x+s*.22,2.05,z);S.add(G);
      add(new T.CylinderGeometry(.005,.005,.5,4),gold,0,.45,0,G);add(new T.CylinderGeometry(.13,.16,.36,6),glow,0,0,0,G);add(new T.ConeGeometry(.17,.2,6),gold,0,.27,0,G);add(new T.CylinderGeometry(.16,.12,.06,6),gold,0,-.21,0,G);
      anim.push(t=>{G.rotation.z=Math.sin(t*.8+i)*.08})});
    // هلال ونجمة كبيران فوق الشارع
    const cr=new T.Group();cr.position.set(0,5.4,16.6);S.add(cr);const gm=new T.MeshStandardMaterial({color:0xffd23f,emissive:0xffb020,emissiveIntensity:night?1.4:.5,metalness:.5,roughness:.3});
    const ar=new T.Mesh(new T.TorusGeometry(1.1,.2,10,40,Math.PI*1.35),gm);ar.rotation.z=Math.PI*.83;cr.add(ar);
    const st=new T.Mesh(new T.OctahedronGeometry(.35),gm);st.position.set(.55,.15,0);st.scale.z=.3;cr.add(st);[-2.6,2.6].forEach(x=>box(.12,5.4,.12,M(0x4a4f5a),x,2.7,16.6));box(5.3,.08,.08,M(0x4a4f5a),0,5.4,16.6);
    anim.push(t=>{cr.rotation.y=Math.sin(t*.3)*.35});
    const bn=textSprite(T,ram?'🌙 رمضان كريم':JOY?JOY.b:'🎉 عيد مبارك','rgba(255,250,235,.95)',ram||JOY?'#14794f':'#c0392b');bn.scale.set(6.6,1.45,1);bn.position.set(0,7.2,16.6);S.add(bn);
    if(!ram){// بالونات العيد في الساحة والسوق
      [[PLZ[0]-2.2,PLZ[1]+2.6],[PLZ[0]+2.4,PLZ[1]-2.4],[MKX+.6,-14.6],[-3.2,1.6],[-3.3,-12]].forEach(([x,z],k)=>{for(let i=0;i<5;i++){const c=cols[(i+k)%cols.length],h=2.3+(i%3)*.35,b=ell(.24,.85,1,.85,M(c,{roughness:.35}),x+(i-2)*.18,h,z+(i%2)*.15);b.castShadow=false;
        const s=add(new T.CylinderGeometry(.006,.006,h,3),M(0xffffff),x+(i-2)*.09,h/2,z);s.castShadow=false;anim.push(t=>{b.position.y=h+Math.sin(t*1.3+i+k)*.08})}})}}
  // ---- 🖤 (v14.6) المناسبات الحزينة: أقمشة سوداء فوق الشارع، رايات سود على الأعمدة وفوق الجامع، ولافتة سوداء بالأبيض ----
  if(OC&&OC.k==='sad'){const blk=new T.MeshStandardMaterial({color:0x111111,roughness:.9,side:T.DoubleSide}),rope=M(0x333333),pg=new T.BufferGeometry();
    pg.setAttribute('position',new T.Float32BufferAttribute([-.14,0,0,.14,0,0,0,-.34,0],3));pg.computeVertexNormals();
    [-13,-7.5,-1.8,7.5,13].forEach((z,r)=>{for(let i=0;i<12;i++){const u=(i+.5)/12,x=-2.25+u*4.2,y=2.62-Math.sin(Math.PI*u)*.55;const sg=add(new T.BoxGeometry(.36,.02,.02),rope,x,y,z);sg.castShadow=false;
        const pn=new T.Mesh(pg,blk);pn.position.set(x,y,z);S.add(pn);anim.push(t=>{pn.rotation.x=Math.sin(t*1.4+i+r)*.25})}});
    const flag=(x,y,z,s,p)=>{const G=new T.Group();G.position.set(x,y,z);G.scale.setScalar(s||1);(p||S).add(G);add(new T.CylinderGeometry(.025,.025,1.5,6),M(0x8a8a8a),0,.75,0,G);
      const f=new T.Mesh(new T.PlaneGeometry(.9,.55,6,1),blk);f.position.set(.47,1.2,0);G.add(f);const P=f.geometry.attributes.position,X0=[];for(let i=0;i<P.count;i++)X0.push(P.getX(i));
      anim.push(t=>{for(let i=0;i<P.count;i++){const xx=X0[i]+.45;P.setZ(i,Math.sin(t*3-xx*5+x)*.08*xx)}P.needsUpdate=true})};
    LAMPS.forEach(([x,z])=>flag(x+(x<0?.15:-.15),2.3,z,.9));
    if(LV('m')>0)flag(6,3.4*mScale(LV('m')),0,1.2);flag(-3.7,0,-1.9,1.3);
    const ab=new T.Group();ab.position.set(0,0,16.6);S.add(ab);[-2.6,2.6].forEach(x=>box(.12,5.4,.12,M(0x4a4f5a),x,2.7,0,ab));box(5.3,.08,.08,M(0x4a4f5a),0,5.4,0,ab);
    const cl=new T.Mesh(new T.PlaneGeometry(5.1,1.1),blk);cl.position.set(0,4.8,0);ab.add(cl);
    const bn=textSprite(T,OC.b,'rgba(18,18,18,.94)','#ffffff');bn.scale.set(6.6,1.45,1);bn.position.set(0,7.2,16.6);S.add(bn)}
  // نجوم الليل
  if(night){const sg=new T.BufferGeometry(),p=[];for(let i=0;i<300;i++){const a=Math.random()*6.28,b=Math.random()*1.3+.15,r=95;p.push(r*Math.cos(a)*Math.cos(b),r*Math.sin(b),r*Math.sin(a)*Math.cos(b))}
    sg.setAttribute('position',new T.Float32BufferAttribute(p,3));S.add(new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:.5})))}
  // ===== (v15.9) جمال المدينة: مشحوف ونخيل وفوانيس على النهر، برج ساعة، نافورة ملوّنة ليلًا، ألعاب نارية بالعيد، والدربونة القديمة =====
  {// 🛶 مشحوف عراقي: قارب طويل ضيّق مقيّر بطرفين مرفوعين، يدفعه رجل بالمردي (عصا طويلة)
    const tar=M(0x2e2218,{roughness:.6}),robe=M(0xf4f1ea),skin=M(0xc68b59),shm=M(0xd23b3b);
    const boat=(G,man)=>{ell(.3,1,.5,7.2,tar,0,.06,0,G);box(.44,.04,3.4,M(0x5a4230),0,.13,0,G);
      [-1,1].forEach(k=>{const p=add(new T.CylinderGeometry(.05,.11,1.1,6),tar,0,.42,k*2.25,G);p.rotation.x=k*-.95});
      if(man){const P=new T.Group();P.position.set(0,.13,-.9);G.add(P);add(new T.CylinderGeometry(.16,.26,1.15,10),robe,0,.6,0,P);ell(.15,1,1.1,1,skin,0,1.33,0,P);
        const h=ell(.17,1.05,.55,1.05,shm,0,1.46,0,P);h.material=shm;box(.3,.05,.3,M(0x111111),0,1.52,0,P);
        const pole=add(new T.CylinderGeometry(.025,.025,4.2,5),M(0x8b6a3e),.32,1.1,.5,P);pole.rotation.x=.45;P.userData.pole=pole;G.userData.man=P}};
    const MB=new T.Group();S.add(MB);boat(MB,1);MB.userData.act='mashhoof';
    anim.push(t=>{const u=(t*.018)%2,f=u<1?u:2-u,x=-47+f*17,dir=u<1?1:-1;MB.position.set(fX(x),.02+Math.sin(t*1.3)*.02,RVZ+.35);MB.rotation.y=dir>0?Math.PI/2:-Math.PI/2;MB.rotation.z=Math.sin(t*1.1)*.03;
      const pl=MB.userData.man&&MB.userData.man.userData.pole;if(pl)pl.rotation.x=.3+Math.sin(t*1.4)*.25});
    const MB2=new T.Group();MB2.position.set(-21,.02,RVZ-1.05);MB2.rotation.y=Math.PI/2+.08;S.add(MB2);boat(MB2,0);MB2.userData.act='mashhoof';
    // نخيل على ضفّتي النهر
    [[-44,RVZ-3],[-36,RVZ+3],[-30,RVZ-3.1],[-17.5,RVZ+3],[10,RVZ-3],[15,RVZ+3],[18,RVZ-3]].forEach(([x,z])=>palm(x,z,null));
    // فوانيس على الجسر الخشبي وعلى جسر الطريق
    const pm=M(0x2b2b33),lm=M(0xfff1b0,{emissive:0xffc940,emissiveIntensity:night?2:.35});
    const lan=(x,z,h)=>{box(.08,h,.08,pm,x,h/2,z);box(.26,.32,.26,pm,x,h+.12,z);box(.2,.26,.2,lm,x,h+.12,z);add(new T.ConeGeometry(.2,.18,4),pm,x,h+.37,z).rotation.y=Math.PI/4};
    [[FBX-.85,RVZ-2.75],[FBX+.85,RVZ-2.75],[FBX-.85,RVZ+2.75],[FBX+.85,RVZ+2.75]].forEach(([x,z])=>lan(x,z,1.5));
    [-1,1].forEach(k=>[-1,1].forEach(j=>lan(k*3.05,RVZ+j*(RVW+1.4)/2,1.25)));
    if(night){const l=new T.PointLight(0xffcf70,1,7,1.6);l.position.set(FBX,1.8,RVZ);S.add(l)}}
  {// 🕰️ برج ساعة المدينة على الكورنيش قرب ساحة النافورة؛ عقارب حقيقية، ويدقّ كل ساعة بهدوء
    const CT=new T.Group();CT.position.set(20.4,0,-2.2);CT.userData.act='clock';S.add(CT);const st=M(night?0xcfc6b2:0xf1e7d2),st2=M(night?0xa99d84:0xcdbb95),gd=M(0xd4a520,{metalness:.6,roughness:.35});
    box(1.7,.35,1.7,st2,0,.17,0,CT);box(1.2,5,1.2,st,0,2.85,0,CT);[1.4,2.6,3.8].forEach(y=>box(1.28,.1,1.28,st2,0,y,0,CT));
    for(let i=0;i<4;i++){const a=i*Math.PI/2;const w=box(.34,.7,.04,M(0x3a5a7a),Math.sin(a)*.61,3.2,Math.cos(a)*.61,CT);w.rotation.y=a}
    box(1.5,1.5,1.5,st,0,6.1,0,CT);box(1.62,.12,1.62,st2,0,6.9,0,CT);box(1.62,.12,1.62,st2,0,5.3,0,CT);
    const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d'),tex=new T.CanvasTexture(cv);let lastM=-1;
    const draw=()=>{const d=new Date(),h=d.getHours()%12,m=d.getMinutes();lastM=m;cx.fillStyle='#fffdf3';cx.beginPath();cx.arc(64,64,60,0,7);cx.fill();cx.lineWidth=6;cx.strokeStyle='#c9a227';cx.stroke();
      cx.fillStyle='#333';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;cx.fillRect(64+Math.sin(a)*48-3,64-Math.cos(a)*48-3,6,6)}
      cx.lineCap='round';const hand=(a,l,w)=>{cx.lineWidth=w;cx.beginPath();cx.moveTo(64,64);cx.lineTo(64+Math.sin(a)*l,64-Math.cos(a)*l);cx.stroke()};
      cx.strokeStyle='#222';hand((h+m/60)/12*Math.PI*2,30,7);hand(m/60*Math.PI*2,46,4);cx.fillStyle='#c9a227';cx.beginPath();cx.arc(64,64,6,0,7);cx.fill();tex.needsUpdate=true};draw();
    const fm=new T.MeshStandardMaterial({map:tex,roughness:.5,emissive:night?0xfff1c0:0x000000,emissiveIntensity:night?.55:0,emissiveMap:night?tex:null});
    for(let i=0;i<4;i++){const a=i*Math.PI/2,f=new T.Mesh(new T.CircleGeometry(.6,32),fm);f.position.set(Math.sin(a)*.76,6.1,Math.cos(a)*.76);f.rotation.y=a;CT.add(f)}
    add(new T.SphereGeometry(.7,20,10,0,Math.PI*2,0,Math.PI/2),M(0x2fa39a),0,6.95,0,CT);add(new T.CylinderGeometry(.03,.05,.7,6),gd,0,7.95,0,CT);
    const cr=add(new T.TorusGeometry(.16,.04,6,16,Math.PI*1.4),gd,0,8.4,0,CT);cr.rotation.z=-.7;
    let lastH=new Date().getHours();
    anim.push(()=>{const d=new Date();if(d.getMinutes()!==lastM)draw();const h=d.getHours();if(h!==lastH){lastH=h;if(!V&&h>=6&&h<=22&&sndOn()&&typeof tone=='function'){const n=h%12||12;for(let i=0;i<n;i++){tone(587,1.2,'sine',.05,i*1.3);tone(880,.7,'sine',.025,i*1.3)}}}})}
  {// 🎆 ألعاب نارية في ليالي العيد والمناسبات السعيدة (City3D.debugFireworks للتجربة)
    const fw=window.City3D&&City3D.debugFireworks;if(night&&(fw||FEST==='eid'||JOY)){const pool=[],CL=[0xff4f7a,0xffd23f,0x4fc3ff,0x7be37b,0xff9f43,0xc58bff,0xffffff];
      for(let k=0;k<5;k++){const N=70,g=new T.BufferGeometry(),pos=new Float32Array(N*3),vel=[];for(let i=0;i<N;i++){const a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1),sp=5+Math.random()*2;vel.push([Math.sin(b)*Math.cos(a)*sp,Math.cos(b)*sp,Math.sin(b)*Math.sin(a)*sp])}
        g.setAttribute('position',new T.BufferAttribute(pos,3));const m=new T.PointsMaterial({color:CL[k],size:1.1,transparent:true,opacity:0,depthWrite:false,fog:false,blending:T.AdditiveBlending});const P=new T.Points(g,m);P.frustumCulled=false;S.add(P);
        const rk=new T.Mesh(new T.SphereGeometry(.15,6,4),new T.MeshBasicMaterial({color:0xfff1b0}));rk.visible=false;S.add(rk);pool.push({P,g,pos,vel,m,rk,st:0,k:0,o:[0,0,0],wait:k*1.1})}
      anim.push((t,dt)=>{pool.forEach(f=>{if(f.st===0){f.wait-=dt;if(f.wait<=0){f.st=1;f.k=0;f.o=[-12+Math.random()*30,15+Math.random()*7,-48+Math.random()*26];f.rk.visible=true;f.m.color.setHex(CL[(Math.random()*CL.length)|0])}}
        else if(f.st===1){f.k+=dt/1.1;f.rk.position.set(f.o[0],f.o[1]*Math.min(1,f.k),f.o[2]);if(f.k>=1){f.st=2;f.k=0;f.rk.visible=false;try{if(sndOn()&&typeof tone=='function')tone(90+Math.random()*40,.35,'triangle',.06)}catch(e){}}}
        else{f.k+=dt;const k=f.k;for(let i=0;i<f.vel.length;i++){const v=f.vel[i];f.pos[i*3]=f.o[0]+v[0]*k*(1-k*.25);f.pos[i*3+1]=f.o[1]+v[1]*k*(1-k*.25)-2.2*k*k;f.pos[i*3+2]=f.o[2]+v[2]*k*(1-k*.25)}
          f.g.attributes.position.needsUpdate=true;f.m.opacity=Math.max(0,1-k/1.8);if(k>1.8){f.st=0;f.wait=.6+Math.random()*2.2;f.m.opacity=0}}})})}}
  {// 🏮 الدربونة القديمة: زقاق مبلّط بالحجر بين بيوت بشناشيل، فوانيس معلّقة، ومقهى صغير للجيران عند مدخله
    const AZ=36,AX0=-4.4,AX1=-19,AW=2.6,G=new T.Group();S.add(G);
    const sc=document.createElement('canvas');sc.width=sc.height=128;const sx=sc.getContext('2d');sx.fillStyle=night?'#8f8576':'#cbbd9f';sx.fillRect(0,0,128,128);
    for(let r=0;r<8;r++)for(let c=0;c<4;c++){const o=r%2?16:0;sx.fillStyle=['#d8ccb0','#c2b292','#d2c3a3','#bfae8c'][(r+c)%4];if(night)sx.fillStyle='#9a8f7c';sx.fillRect(c*32+o-14,r*16+1,30,14)}
    const stx=new T.CanvasTexture(sc);stx.wrapS=stx.wrapT=T.RepeatWrapping;stx.repeat.set(7,1.3);
    flat(add(new T.PlaneGeometry(AX0-AX1,AW),new T.MeshStandardMaterial({map:stx,roughness:.95}),(AX0+AX1)/2,.02,AZ,G)).receiveShadow=true;
    // بوّابة قديمة بقوس عند المدخل
    const brk=M(night?0xa8875a:0xd9b77a),brk2=M(night?0x8f7048:0xc29a5e);[-1,1].forEach(k=>box(.45,3,.45,brk,AX0+.1,1.5,AZ+k*(AW/2+.2),G));
    const ar=add(new T.TorusGeometry(AW/2+.2,.2,8,20,Math.PI),brk2,AX0+.1,3,AZ,G);ar.rotation.y=Math.PI/2;label('🏮 الدربونة القديمة',AX0+.1,4.35,AZ,.6,G);
    // البيوت على الجانبين (طابوق قديم بشناشيل تطلّ على الزقاق)
    const HC2=[0xd9b77a,0xe9d8b4,0xd2a76a,0xf0e2c4,0xdcbf8e,0xe5c99a],wd=M(0x8a5a2e),wd2=M(0x6b4423);
    const gl=[0x3f8fd0,0x2fa36b,0xd94f4f,0xffc53a].map(x=>M(x,{emissive:x,emissiveIntensity:night?.9:.15,roughness:.3}));
    for(let i=0;i<3;i++)[-1,1].forEach((k,j)=>{if(i===0&&k===-1)return;if(k>0&&i<2){const wx=AX0-2.4-i*4.6,wz=AZ+AW/2+.25;box(4.4,.75,.3,brk,wx,.37,wz,G);box(4.5,.08,.36,brk2,wx,.78,wz,G);palm(wx+(i?1.2:-1.2),wz+1.4,G);return}const low=k>0,x=AX0-2.4-i*4.6,z=AZ+k*(AW/2+1.6),h=low?2.7:4.3+((i+j)%2)*.5,H=new T.Group();H.position.set(x,0,z);G.add(H);
      box(4.2,h,3,M(HC2[(i*2+j)%6]),0,h/2,0,H);box(4.3,.14,3.1,brk2,0,h+.07,0,H);const fz=-k*1.52;[-1,1].forEach(q=>box(4.3,.3,.08,brk2,0,h+.28,q*1.5,H));
      box(.8,1.5,.06,M(0x6b3f22),-.9,.75,fz,H);box(.6,.55,.06,winM,1.1,1.4,fz,H);box(.7,.06,.2,brk2,1.1,1.1,fz-k*.1,H);
      for(let q=0;q<4;q++)ell(.07,1,1,1,M([0xff4f7a,0xffd23f,0xffffff,0xff8a3d][q]),.92+q*.12,1.18,fz-k*.12,H);
      [-1.2,1.2].forEach(q=>box(.55,.55,.06,winM,q,h-1.1,-fz,H));
      if(low){box(1.2,.08,.6,wd2,-.9,1.7,fz-k*.3,H);return}
      const sz=fz-k*.3;box(2.2,1.2,.6,wd,.2,h-1.35,sz,H);box(2.4,.1,.76,wd2,.2,h-.7,sz,H);box(2,.14,.5,wd2,.2,h-2.0,sz,H);
      for(let q=0;q<4;q++)box(.4,.45,.02,gl[(q+i+j)%4],-.55+q*.5,h-1.25,sz-k*.31,H);for(let q=0;q<=9;q++)box(.04,.95,.04,wd2,-.8+q*.22,h-1.35,sz-k*.33,H)});
    // حبال فوانيس معلّقة عبر الزقاق
    const lm=M(0xffe9a8,{emissive:0xffb830,emissiveIntensity:night?2.2:.4}),cm=M(0x3a3a3a),LC=[0xff5c5c,0xffd23f,0x4fc3ff,0x7be37b];
    [-7.6,-12.2,-16.8].forEach((x,q)=>{const r=box(.03,.03,AW+3,cm,x,3.55,AZ,G);r.castShadow=false;for(let i=0;i<3;i++){const z=AZ-1+i;box(.02,.35,.02,cm,x,3.35,z,G);
      ell(.17,1,1.25,1,i===1?lm:M(LC[(i+q)%4],{emissive:LC[(i+q)%4],emissiveIntensity:night?1.4:.25}),x,3.05,z,G)}});
    if(night)[-8,-15].forEach(x=>{const l=new T.PointLight(0xffc870,1.1,9,1.6);l.position.set(x,2.8,AZ);G.add(l)});
    // ☕ مقهى الحيّ (في الجهة البعيدة عن الكاميرا ليُرى من الداخل): مفتوح على الزقاق، فيه سماور واستكانات شاي وطاولتان ورجلان كبيران يجلسان
    const CF=new T.Group();CF.position.set(AX0-2.2,0,AZ-AW/2-.1);CF.rotation.y=Math.PI;CF.userData.act='cafe';G.add(CF);
    const cw=M(night?0xb08a5a:0xe2c08a);box(4.2,2.6,.15,cw,0,1.3,2.9,CF);[-1,1].forEach(k=>box(.15,2.6,3,cw,k*2.1,1.3,1.45,CF));box(4.5,.16,3.3,brk2,0,2.68,1.45,CF);
    const aw=new T.Mesh(new T.BoxGeometry(4.4,.06,1.3),new T.MeshStandardMaterial({map:(()=>{const c=document.createElement('canvas');c.width=128;c.height=16;const x=c.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffffff':'#c0392b';x.fillRect(i*16,0,16,16)}return new T.CanvasTexture(c)})(),roughness:.8}));
    aw.position.set(0,2.4,-.5);aw.rotation.x=-.28;aw.castShadow=true;CF.add(aw);box(2.4,.95,.5,M(0x7a4f2a),.6,.47,1.9,CF);
    const tw=M(0x8b5a2b),ms=M(0xc0c0c8,{metalness:.7,roughness:.3}),tea=M(0xb34a12,{transparent:true,opacity:.85});
    [[-1.1,-1.75],[1.1,-1.75]].forEach(([x,z])=>{add(new T.CylinderGeometry(.42,.42,.05,16),tw,x,.72,z,CF);add(new T.CylinderGeometry(.05,.06,.7,6),tw,x,.36,z,CF);
      for(let i=0;i<3;i++){add(new T.CylinderGeometry(.045,.035,.11,8),tea,x-.15+i*.15,.8,z+.08*(i%2),CF)}
      [-1,1].forEach(k=>{add(new T.CylinderGeometry(.17,.17,.06,10),M(0xb3542a),x+k*.62,.45,z,CF);add(new T.CylinderGeometry(.03,.03,.43,5),tw,x+k*.62,.21,z,CF)})});
    add(new T.CylinderGeometry(.22,.28,.6,12),ms,1.2,1.25,1.9,CF);add(new T.CylinderGeometry(.1,.2,.2,10),ms,1.2,1.65,1.9,CF);
    if(!night&&!RN){const robe=M(0xf4f1ea),robe2=M(0x8c7a5c),skin=M(0xc68b59),shm=M(0xd23b3b),sh2=M(0xf7f7f7),agal=M(0x111111);
      [[-1.72,-1.75,1],[1.72,-1.75,-1]].forEach(([x,z,f],i)=>{const P=new T.Group();P.position.set(x,0,z);P.rotation.y=f>0?Math.PI/2:-Math.PI/2;CF.add(P);
        add(new T.CylinderGeometry(.2,.26,.62,10),i?robe2:robe,0,.78,0,P);box(.42,.12,.5,i?robe2:robe,0,.5,.18,P);[-.1,.1].forEach(q=>box(.12,.45,.12,i?robe2:robe,q,.25,.38,P));
        ell(.15,1,1.1,1,skin,0,1.24,0,P);ell(.17,1.05,.55,1.05,i?sh2:shm,0,1.37,0,P);add(new T.TorusGeometry(.13,.025,5,14),agal,0,1.42,0,P).rotation.x=Math.PI/2;ell(.09,1,.8,.7,M(0xdddddd),0,1.12,.09,P)})}
    if(!V&&!(D.cf))mark(CF,'☕','#8a5a2e',3.2,0,.85)}
  {// 🪧 (v15.9) ١٠ لوحات أسماء الشوارع: الطفل يختار اسم كل شارع (CITY.st)
    const NM={m:'الشارع الكبير',f:'شارع الجامع',b:'شارع الحديقة'},sp=M(0x4a5560,{metalness:.5,roughness:.4});
    const plate=t=>{const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='#1f5fae';x.fillRect(0,0,512,128);x.strokeStyle='#fff';x.lineWidth=8;x.strokeRect(10,10,492,108);
      x.fillStyle='#fff';x.font='900 56px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';try{x.direction='rtl'}catch(e){}x.fillText(t,256,68,460);return new T.MeshBasicMaterial({map:new T.CanvasTexture(c)})};
    [['m',-3.05,-1.9,Math.PI/2],['f',-8.6,5.75,0],['b',-8.6,-5.75,0]].forEach(([k,x,z,r])=>{const G=new T.Group();G.position.set(x,0,z);G.rotation.y=r;G.userData.act='st_'+k;S.add(G);
      box(.09,2.6,.09,sp,0,1.3,0,G);const mt=plate((!V&&CITY.st&&CITY.st[k])||NM[k]);[1,-1].forEach(q=>{const pl=new T.Mesh(new T.PlaneGeometry(1.9,.48),mt);pl.position.set(0,2.45,q*.03);if(q<0)pl.rotation.y=Math.PI;G.add(pl)});
      box(1.96,.54,.04,M(0xffffff),0,2.45,0,G)})}
  // 🎁 (v15.9) ٨ هدية اليوم المخفية (صندوق صغير بشريط ذهبي، نصفه خلف شيء)
  if(!V&&!D.gf){const g=GIFTS[seed()%GIFTS.length],G=new T.Group();G.position.set(g[0],0,g[1]);G.rotation.y=.5;G.userData.act='gift';S.add(G);
    const rb=M(0xffd23f,{metalness:.4,roughness:.3});box(.5,.42,.5,M(0xe2304a),0,.21,0,G);box(.54,.1,.54,M(0xc81f38),0,.44,0,G);box(.1,.47,.54,rb,0,.235,0,G);box(.54,.47,.1,rb,0,.235,0,G);
    [-1,1].forEach(k=>{const l=ell(.11,1.3,.6,.6,rb,k*.1,.54,0,G);l.rotation.z=k*.5});anim.push(t=>{G.position.y=Math.max(0,Math.sin(t*2.2))*.06;G.rotation.y=.5+Math.sin(t*.8)*.15})}
  // 🌷 (v15.9) ٩ المدينة تزهر بأعمال الطفل: وردة لكل عمل صالح (حتى ٤٠٠) وشجرة صغيرة لكل ١٠ أعمال (حتى ٣٠)
  {const n=V?0:Math.min(400,BLOOM.n|0),nt=V?0:Math.min(30,Math.floor((BLOOM.n|0)/10));let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
    const bad=(x,z)=>x<-2.6&&x>XL-.4&&Math.abs(z)<HZ+.35||Math.abs(x)<3||x<-2.4&&x>-11.2&&z<-14.8&&z>-25||Math.abs(Math.abs(z)-4.6)<1.4&&Math.abs(x)<16||Object.values(SPOT).some(([a,b])=>Math.hypot(x-a,z-b)<3.9)||x>17.5||NOFL(x,z)||Math.abs(x-FARM[0])<3.8&&Math.abs(z-FARM[1])<4||x<-3&&x>-21&&z>32&&z<41||Math.hypot(x-PKC[0],z-PKC[1])<9||Math.hypot(x-HSP[0],z-HSP[1])<6||Math.hypot(x-FLK[0],z-FLK[1])<6||Math.abs(z-NBZ)<3&&Math.abs(Math.abs(x)-7)<3;
    if(n){const fl=[0xff4f7a,0xffd23f,0xc58bff,0xff8c42,0xffffff,0xff6fb5,0x4fc3ff],hd=new T.InstancedMesh(new T.SphereGeometry(.15,8,6),new T.MeshStandardMaterial({roughness:.5}),n),
        lv=new T.InstancedMesh(new T.SphereGeometry(.2,6,4),M(0x3f9a3e),n),o=new T.Object3D(),col=new T.Color();let k=0,i=0;
      while(i<n&&k<20000){k++;const a=rnd()*Math.PI*2,r=4+rnd()*36,x=Math.cos(a)*r,z=Math.sin(a)*r;if(bad(x,z))continue;
        o.position.set(x,.2,z);o.rotation.set(0,0,0);o.scale.setScalar(1);o.updateMatrix();hd.setMatrixAt(i,o.matrix);hd.setColorAt(i,col.setHex(fl[i%fl.length]));
        o.position.set(x,.07,z);o.scale.set(1.4,.35,1.4);o.updateMatrix();lv.setMatrixAt(i,o.matrix);i++}
      hd.count=lv.count=i;S.add(hd,lv);S.userData.bloomN=i}
    let k=0,i=0;sd=99;while(i<nt&&k<5000){k++;const a=rnd()*Math.PI*2,r=12+rnd()*30,x=Math.cos(a)*r,z=Math.sin(a)*r;if(bad(x,z)||Math.abs(x)<5)continue;tree(x,z,null,.75+((i*7)%4)*.08);i++}}
  // 🚦 (v16.3) أعمدة الإشارات: لكل ممرّ عمودان (واحد لكل اتجاه) بذراع فوق الحارتين، وإشارة المشاة (رجل أحمر/أخضر) تواجه الطرف الآخر
  {const pm=M(0x3a3f47,{metalness:.5,roughness:.4}),hm=M(0x15171a),L=[];
    const lamp=(c,G,x,y,z)=>{const m=new T.MeshBasicMaterial({color:0x2a2a2a});m.userData.c=c;const b=new T.Mesh(new T.CylinderGeometry(.13,.13,.06,14),m);b.rotation.x=Math.PI/2;b.position.set(x,y,z);G.add(b);return m};
    const man=(c,G,x,y,z,ry)=>{const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');g.fillStyle='#111';g.fillRect(0,0,64,64);g.font='44px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillText('🚶',32,36);
      const im=g.getImageData(0,0,64,64);for(let i=0;i<im.data.length;i+=4){if(im.data[i+3]>0&&(im.data[i]+im.data[i+1]+im.data[i+2])>60){im.data[i]=c[0];im.data[i+1]=c[1];im.data[i+2]=c[2]}}g.putImageData(im,0,0);
      const m=new T.MeshBasicMaterial({map:new T.CanvasTexture(cv),color:0x444444});const pl=new T.Mesh(new T.PlaneGeometry(.34,.34),m);pl.position.set(x,y,z);pl.rotation.y=ry;G.add(pl);return m};
    [-4.6,4.6].forEach(zc=>[1,-1].forEach(dir=>{const sx=dir*(R1+.45),sz=zc-dir*1.9,G=new T.Group();G.userData.rd=1;G.position.set(sx,0,sz);S.add(G);
      box(.14,4.2,.14,pm,0,2.1,0,G);const arm=box(R1-.2,.12,.12,pm,-dir*(R1-.2)/2,4.05,0,G);arm.castShadow=false;
      // رأس إشارة السيارات فوق منتصف الحارتين، يواجه السيارات القادمة
      const hx=-dir*(R1*.5+.45),fz=-dir*.2;box(.42,1.2,.32,hm,hx,3.45,0,G);box(.5,.08,.4,hm,hx,4.08,0,G);
      const r=lamp(0xff2a2a,G,hx,3.82,fz),y=lamp(0xffb020,G,hx,3.45,fz),gr=lamp(0x22dd55,G,hx,3.08,fz);
      // إشارة أصغر على العمود نفسه
      box(.3,.85,.24,hm,-dir*.25,2.4,0,G);const r2=lamp(0xff2a2a,G,-dir*.25,2.66,fz*.9),y2=lamp(0xffb020,G,-dir*.25,2.4,fz*.9),g2=lamp(0x22dd55,G,-dir*.25,2.14,fz*.9);
      // إشارة المشاة تواجه الطرف الآخر من الشارع
      box(.12,.85,.42,hm,-dir*.13,1.75,dir*.35,G);const pr=man([255,50,50],G,-dir*.2,1.96,dir*.35,dir>0?-Math.PI/2:Math.PI/2),pg=man([60,230,110],G,-dir*.2,1.56,dir*.35,dir>0?-Math.PI/2:Math.PI/2);
      L.push({r,y,gr,r2,y2,g2,pr,pg})}));
    // خطوط التوقّف البيضاء قبل كل ممرّ
    [-4.6,4.6].forEach(zc=>[1,-1].forEach(dir=>{const l=add(new T.PlaneGeometry(R1-.2,.22),line,dir*R1/2,.023,zc-dir*1.3);l.rotation.x=-Math.PI/2;l.castShadow=false;l.userData.rd=1}));
    const on=(m,k)=>{m.color.setHex(k?m.userData.c:0x2a2a2a)};
    anim.push(t=>{const s=sig(),bl=Math.sin(t*8)>0;L.forEach(o=>{on(o.r,s==='r');on(o.y,s==='y');on(o.gr,s==='g');on(o.r2,s==='r');on(o.y2,s==='y');on(o.g2,s==='g');
      const pg=s==='r',pr=!pg;o.pg.color.setHex(pg?0xffffff:0x333333);o.pr.color.setHex(pr?0xffffff:0x333333)})})}
  shiftScene(S);
  Object.assign(S.userData,{marks,trees,lit,cat});try{mergeStatic(S)}catch(e){console.error('merge',e)}return S}
// (v16.2) يزيح كل ما في المشهد حسب fX (ما عدا الشارع الجديد المعلَّم rd): الأشياء التي في جهة واحدة تُزاح، والمجموعات الممتدّة على الجهتين
// يُزاح أبناؤها كلٌّ وحده، وزهور InstancedMesh كلّ زهرة وحدها، والأشياء الضيّقة فوق الشارع (لافتات، حبال زينة) تتّسع معه
// (v17.4) طلب الشيخ: «اللعبة صارت تعلق». كان المشهد ≈١٠٤٠٠ قطعة و≈٢٧٦٠ رسمة في كل إطار (+ الظلال)، وفي الليل ٦٦ ضوءًا.
// الحلّ: دمج القطع الثابتة. داخل كل مجموعة يلمسها الطفل (act/p/t/l/fk…) تُدمج القطع التي لها نفس المادّة في قطعة واحدة،
// فيبقى اللمس والإخفاء والتكبير على مستوى المجموعة كما هو. ما يتحرّك أو يتغيّر لونه/ظهوره يُكتشف بتشغيل حركات المشهد
// عدّة مرّات (وبتبديل إشارة المرور) قبل الدمج، فلا يُدمج. لا تُدمج: الشفّافة، ذات الخامة المرسومة (canvas)، المخفيّة، وما في userData.
// يدمج قائمة قطع (لها نفس المادّة) في هندسة واحدة؛ mxOf(m) = مصفوفة القطعة بالنسبة للمجموعة التي ستحمل الناتج
function bakeMerge(L,mxOf){const T=THREE,P=[],N=[],Cc=[],col=!!L[0].geometry.attributes.color;let cs=false,rs=false;
  L.forEach(m=>{let g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();if(!g.attributes.normal)g.computeVertexNormals();const mx=mxOf(m);g.applyMatrix4(mx);
    const p=g.attributes.position.array,n=g.attributes.normal.array,c=col&&g.attributes.color?g.attributes.color.array:null,flip=mx.determinant()<0;
    for(let i=0;i+8<p.length;i+=9){const ord=flip?[0,6,3]:[0,3,6];for(const q of ord){P.push(p[i+q],p[i+q+1],p[i+q+2]);N.push(n[i+q],n[i+q+1],n[i+q+2]);if(col)Cc.push(c?c[i+q]:1,c?c[i+q+1]:1,c?c[i+q+2]:1)}}
    g.dispose();cs=cs||m.castShadow;rs=rs||m.receiveShadow;m.parent.remove(m)});
  const G=new T.BufferGeometry();G.setAttribute('position',new T.Float32BufferAttribute(P,3));G.setAttribute('normal',new T.Float32BufferAttribute(N,3));if(col)G.setAttribute('color',new T.Float32BufferAttribute(Cc,3));G.computeBoundingSphere();
  const M2=new T.Mesh(G,L[0].material);M2.castShadow=cs;M2.receiveShadow=rs;return M2}
// (v17.4) دمج داخل سيارة أو شخص: لكل مجموعة (الجسم، الرأس، الذراعين، الساقين…) تُدمج قطعها المباشرة التي تشترك في نفس المادّة نفسها.
// الحركة على مستوى المجموعات فتبقى كما هي، والقطعة الأولى في الجذر (الجسم/الثوب الذي يُلوَّن) لا تُمسّ، ولا ما يُشار إليه في userData.
// (v17.5) مفتاح خصائص المادّة: قطعتان بمادّتين مختلفتين لكن متطابقتين في الخصائص تُدمجان معًا
function matKey(a){if(!a||Array.isArray(a))return null;if(a.transparent||a.map||a.alphaMap||a.envMap||a.onBeforeCompile&&a.onBeforeCompile.toString().length>20)return null;
  return [a.type,a.color&&a.color.getHex(),a.emissive&&a.emissive.getHex(),a.emissiveIntensity,a.roughness,a.metalness,a.side,a.flatShading,a.vertexColors,a.fog,a.depthWrite,a.depthTest,a.polygonOffset,a.polygonOffsetFactor,a.wireframe,a.toneMapped].join('/')}
// (v17.5) مدينة الألعاب كانت ≈٣٩٠ رسمة في كل إطار (كل عمود وراية وحصان قطعة بمادّة خاصّة) لأنها خارج الدمج الثابت.
// هنا: داخل كل مجموعة (ما عدا الأشخاص) تُدمج القطع المباشرة المتشابهة في الخصائص؛ الحركة على مستوى المجموعات (الدولاب، الدوّامة، الخيول، الميزان) تبقى كما هي.
function mergeProps(G){const refs=new Set();G.traverse(o=>{const u=o.userData;if(u)Object.values(u).forEach(v=>(Array.isArray(v)?v:[v]).forEach(x=>{if(x&&x.isObject3D)refs.add(x)}))});
  const XS=[];const walk=X=>{if(X.isLOD||(X!==G&&X.userData&&(X.userData.arms||X.userData.legs||X.userData.head)))return;if(X.children.length>1)XS.push(X);X.children.forEach(walk)};walk(G);
  XS.forEach(X=>{const by=new Map();X.children.forEach(c=>{if(!c.isMesh||c.isInstancedMesh||c.children.length||refs.has(c)||!c.visible||Object.keys(c.userData).length)return;
      const k0=matKey(c.material);if(!k0||!c.geometry||!c.geometry.attributes.position)return;const k=k0+(c.geometry.attributes.color?'c':'');if(!by.has(k))by.set(k,[]);by.get(k).push(c)});
    by.forEach(L=>{if(L.length<2)return;L.forEach(m=>m.updateMatrix());X.add(bakeMerge(L,m=>m.matrix))})});return G}
function mergeKids(G){const refs=new Set();G.traverse(o=>{const u=o.userData;if(u)Object.values(u).forEach(v=>(Array.isArray(v)?v:[v]).forEach(x=>{if(x&&x.isObject3D)refs.add(x)}))});
  const XS=[];G.traverse(X=>{if(!X.isLOD&&X.children.length>1)XS.push(X)});
  XS.forEach(X=>{const by=new Map();X.children.forEach((c,i)=>{if(!c.isMesh||c.isInstancedMesh||c.children.length||refs.has(c)||(X===G&&i===0)||!c.visible)return;const a=c.material;
      if(!a||Array.isArray(a)||a.transparent||a.map||!c.geometry||!c.geometry.attributes.position||Object.keys(c.userData).length)return;const k=a.uuid+(c.geometry.attributes.color?'c':'');if(!by.has(k))by.set(k,[]);by.get(k).push(c)});
    by.forEach(L=>{if(L.length<2)return;L.forEach(m=>m.updateMatrix());X.add(bakeMerge(L,m=>m.matrix))})});return G}
function mergeStatic(S){if(window.City3D&&City3D.noMerge)return;const T=THREE,anim=S.userData.anim||[],skip=new Set();
  const ud=(v,d)=>{if(!v||d>3)return;if(v.isObject3D){v.traverse(o=>skip.add(o));return}if(Array.isArray(v))v.forEach(x=>ud(x,d+1));else if(typeof v==='object'&&!v.isColor&&!v.isVector3)Object.values(v).forEach(x=>ud(x,d+1))};
  Object.keys(S.userData).forEach(k=>{if(k!=='anim'&&k!=='trees'&&k!=='lit')ud(S.userData[k],0)});
  const MS=[];S.traverse(o=>{if(o.isLOD){o.traverse(c=>skip.add(c));return}if(o.isMesh&&!o.isInstancedMesh)MS.push(o)});
  const visOK=o=>{for(let x=o;x;x=x.parent)if(!x.visible)return false;return true};
  const key=m=>{const a=m.material;return m.matrixWorld.elements.map(v=>v.toFixed(4)).join(',')+'|'+visOK(m)+'|'+(a&&a.uuid)+'|'+(a&&a.color?a.color.getHex():'')+'|'+(a&&a.opacity)+'|'+(a&&a.emissive?a.emissive.getHex()+':'+a.emissiveIntensity:'')+'|'+(m.geometry&&m.geometry.attributes.position?m.geometry.attributes.position.version:'')};
  S.updateMatrixWorld(true);const s0=MS.map(key),dyn=new Set(),C3=window.City3D,ds=C3?C3.debugSig:undefined;
  [[.37,0],[1.13,13],[2.71,20],[5.9,5],[13.3,22.5],[29.7,12.5]].forEach(([tt,sg])=>{if(C3)C3.debugSig=sg;try{anim.forEach(f=>f(tt,.05))}catch(e){}S.updateMatrixWorld(true);MS.forEach((m,i)=>{if(!dyn.has(m)&&key(m)!==s0[i])dyn.add(m)})});
  if(C3){if(ds===undefined)delete C3.debugSig;else C3.debugSig=ds}
  const PK=o=>{const u=o.userData;return u&&(u.p||u.t!=null||u.l!=null||u.cat||u.ped||u.fk||u.act)};
  const mk=matKey;
  const B=new Map();
  MS.forEach(m=>{if(dyn.has(m)||skip.has(m)||!visOK(m)||Object.keys(m.userData).some(k=>k!=='rd')||m.renderOrder||m.frustumCulled===false||m.morphTargetInfluences||m.onBeforeRender.toString().length>20||!mk(m.material))return;
    const g=m.geometry;if(!g||!g.attributes.position)return;const k0=mk(m.material);if(!k0)return;
    let o=m.parent;while(o&&o!==S&&!PK(o))o=o.parent;if(!o)return;
    const k=o.uuid+'#'+k0+'#'+(g.attributes.color?1:0);if(!B.has(k))B.set(k,{o,L:[]});B.get(k).L.push(m)});
  const inv=new T.Matrix4(),mx=new T.Matrix4();
  B.forEach(({o,L})=>{if(L.length<2)return;o.updateMatrixWorld(true);inv.copy(o.matrixWorld).invert();const M2=bakeMerge(L,m=>mx.multiplyMatrices(inv,m.matrixWorld));M2.matrixAutoUpdate=false;o.add(M2)});
  S.updateMatrixWorld(true)}
function shiftScene(S){const T=THREE,bx=new T.Box3();S.updateMatrixWorld(true);
  const one=(c,dep)=>{if(c.userData&&c.userData.rd)return;if(c.isLight){if(!c.isDirectionalLight&&!c.isHemisphereLight)c.position.x=fX(c.position.x);return}
    // (v16.2b) مجموعة لها موضع (بناية، شجرة، نخلة، عمود…) تُزاح كلّها معًا حسب موضعها — لا تُفكَّك (كانت نخلة بناية المستوى ٣ تقع في الشارع)
    if(!c.isMesh&&!c.isPoints&&Math.abs(c.position.x)>.3){c.position.x=fX(c.position.x);return}
    if(c.isInstancedMesh){const m=new T.Matrix4();for(let i=0;i<c.count;i++){c.getMatrixAt(i,m);m.elements[12]=fX(m.elements[12]);c.setMatrixAt(i,m)}c.instanceMatrix.needsUpdate=true;return}
    bx.setFromObject(c);if(bx.isEmpty())return;const a=bx.min.x,b=bx.max.x;
    if(a>-.2||b<.2){const cx=(a+b)/2;c.position.x+=fX(cx)-cx;return}
    if(c.children.length&&!c.isMesh&&dep<3&&c.scale.x===1&&!c.rotation.y){c.children.slice().forEach(k=>one(k,dep+1));return}
    if(b-a>2*S0+2.5)return;
    if(c.isMesh&&!c.isSprite)c.scale.x*=R1/R0};
  S.children.slice().forEach(c=>one(c,0))}

/* ---------- شخصية الطفل ---------- */
function makeKid(){const T=THREE,G=new T.Group(),M=(c)=>new T.MeshStandardMaterial({color:c,roughness:.7});
  const add=(geo,m,x,y,z,p)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;(p||G).add(o);return o};
  const girl=!boy(),skin=M(0xf2c9a0),shirt=M(girl?0xd94f8a:0x2f6fd0),pants=M(girl?0xd94f8a:0x2b3a55),shoe=M(0x3a2a1a),dk=M(0x222222);
  const legs=[-1,1].map(k=>{const L=new T.Group();L.position.set(k*.11,.5,0);G.add(L);add(new T.CylinderGeometry(.08,.08,.45,8),pants,0,-.22,0,L);add(new T.BoxGeometry(.14,.08,.22),shoe,0,-.46,.04,L);return L});
  if(girl)add(new T.CylinderGeometry(.2,.34,.6,14),shirt,0,.62,0);else add(new T.CylinderGeometry(.2,.24,.5,14),shirt,0,.72,0);
  const arms=[-1,1].map(k=>{const A=new T.Group();A.position.set(k*.27,.92,0);G.add(A);add(new T.CylinderGeometry(.06,.06,.42,8),shirt,0,-.2,0,A);add(new T.SphereGeometry(.065,8,6),skin,0,-.43,0,A);return A});
  // (v11.4) وجه أوضح: رأس أكبر، عيون كبيرة لامعة، خدود وردية وابتسامة
  const face=new T.MeshStandardMaterial({color:0xf6cfa6,roughness:.6,emissive:0x4a3020,emissiveIntensity:.35});
  const n0=G.children.length;add(new T.SphereGeometry(.32,20,16),face,0,1.32,0);
  const wh=new T.MeshBasicMaterial({color:0xffffff}),pu=new T.MeshBasicMaterial({color:0x1a1a2a});
  [-.115,.115].forEach(x=>{add(new T.SphereGeometry(.085,12,10),wh,x,1.35,.24);add(new T.SphereGeometry(.052,10,8),pu,x,1.35,.31);add(new T.SphereGeometry(.018,6,4),wh,x-.018,1.375,.36)});
  const ck=new T.MeshBasicMaterial({color:0xff9aa8});[-.2,.2].forEach(x=>{const c=add(new T.SphereGeometry(.055,10,8),ck,x,1.25,.24);c.scale.z=.4});
  const sm=add(new T.TorusGeometry(.085,.02,6,14,Math.PI),new T.MeshBasicMaterial({color:0xc0343a}),0,1.22,.285);sm.rotation.z=Math.PI;
  if(girl){const hj=M(0xffffff);const h=add(new T.SphereGeometry(.36,20,14,0,Math.PI*2,0,Math.PI*.6),hj,0,1.33,-.04);h.rotation.x=-.55;
    add(new T.SphereGeometry(.37,20,14,Math.PI,Math.PI,Math.PI*.5,Math.PI*.5),hj,0,1.33,-.06);
    add(new T.ConeGeometry(.4,.4,20,1,true),hj,0,1.05,-.02);add(new T.TorusGeometry(.31,.035,8,24),M(0xff7fb0),0,1.36,.06).rotation.x=-.3}
  else{const hair=M(0x3b2414);const hr=add(new T.SphereGeometry(.335,20,12,0,Math.PI*2,0,Math.PI*.5),hair,0,1.33,-.03);hr.rotation.x=-.35;
    add(new T.SphereGeometry(.26,16,8,0,Math.PI*2,0,Math.PI/2),M(0xffffff),0,1.5,-.04)}
  const H=new T.Group();H.position.y=1.08;G.children.slice(n0).forEach(c=>{G.remove(c);c.position.y-=1.08;H.add(c)});G.add(H);
  G.scale.setScalar(KS);G.userData={legs,arms,head:H};return G}

/* ---------- (v11.9) حياة المدينة: طلاب في ساحة المدرسة نهارًا، حارس ليلًا، باص وسيارات صباحًا وعند الانصراف، ومصلّون وقت الصلاة ---------- */
// الأوقات حسب ساعة الجهاز: الوصول ٦–٨ صباحًا، الانصراف ١–٢:٣٠ ظهرًا. (City3D.debugHour للتجربة فقط)
// (v13.8) الطقس والمناسبات: يوم ممطر واحد من كل ٥ أيام تقريبًا (ليس في الشتاء لأن فيه ثلجًا)، مطر ٧–١٥ ثم قوس قزح حتى ١٦:٣٠
// (v14.0) 🌦️ طلب الشيخ: طقس محافظة الطفل الحقيقي. المدينة = مدينة الأذان التي اختارتها العائلة (Adhan.city).
// نجلب الطقس من open-meteo (مجاني بلا مفتاح) كل ٣٠ دقيقة؛ إذا لا إنترنت يرجع للطريقة القديمة (يوم مطر من كل خمسة تقريبًا).
const WXK='usul5_wx_v1';let WX=null,wxBusy=0;try{WX=JSON.parse(localStorage.getItem(WXK)||'null')}catch(e){}
function wxCity(){try{return Adhan.city}catch(e){return null}}
function wxNow(){if(window.City3D&&City3D.debugWx)return City3D.debugWx;const c=wxCity();return WX&&c&&WX.c===c[0]&&Date.now()-WX.t<3*3600e3?WX:null}
const wRainy=w=>w.code>=51&&w.code<=67||w.code>=80&&w.code<=82||w.code>=95||w.pr>.15,wSnowy=w=>w.code>=71&&w.code<=77||w.code===85||w.code===86;
function wxFetch(){const c=wxCity();if(!c||wxBusy||navigator.onLine===false||WX&&WX.c===c[0]&&Date.now()-WX.t<30*60e3||!window.fetch)return;wxBusy=1;
  fetch('https://api.open-meteo.com/v1/forecast?latitude='+c[2]+'&longitude='+c[3]+'&current=temperature_2m,weather_code,cloud_cover,precipitation&hourly=precipitation&past_hours=3&forecast_hours=1&timezone=auto')
    .then(r=>r.ok?r.json():null).then(j=>{if(!j||!j.current)return;const u=j.current,pp=(j.hourly&&j.hourly.precipitation)||[];
      WX={c:c[0],t:Date.now(),code:u.weather_code|0,cc:u.cloud_cover|0,tp:Math.round(u.temperature_2m),pr:+u.precipitation||0,past:pp.slice(0,-1).reduce((a,b)=>a+(+b||0),0)};
      try{localStorage.setItem(WXK,JSON.stringify(WX))}catch(e){}}).catch(()=>{}).then(()=>{wxBusy=0})}
// كثرة الغيوم: 0 صافية، 1 عادية، 2 غائمة
function cloudLv(){const w=wxNow();if(!w)return 1;return w.cc>=60?2:w.cc<15?0:1}
function rainyDay(){const d=new Date(),k=d.getFullYear()*372+d.getMonth()*31+d.getDate();return (k*2654435761>>>0)%5===0&&!winter()}
function rainNow(){const d=window.City3D&&City3D.debugRain;if(d!=null)return !!d;const w=wxNow();if(w)return wRainy(w);const h=hourNow();return rainyDay()&&h>=7&&h<15}
function rainbowNow(){const d=window.City3D&&City3D.debugRainbow;if(d!=null)return !!d;const h=hourNow(),w=wxNow();if(w)return !wRainy(w)&&!wSnowy(w)&&w.past>.2&&w.cc<85&&h>=7&&h<17.5;return rainyDay()&&h>=15&&h<16.5}
// رمضان (الشهر ٩) والعيدان (١–٣ شوال، ١٠–١٣ ذو الحجة) بالتقويم الهجري (أم القرى) — قد يختلف يومًا عن الرؤية المحلية
function festNow(){const d=window.City3D&&City3D.debugFest;if(d!=null)return d||null;try{const p=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{month:"numeric",day:"numeric"}).formatToParts(new Date()),m=+p.find(x=>x.type==="month").value,dd=+p.find(x=>x.type==="day").value;
  if(m===9)return "ramadan";if(m===10&&dd<=3||m===12&&dd>=10&&dd<=13)return "eid"}catch(e){}return null}
// (v14.6) طلب الشيخ: زينة المناسبات الدينية المعروفة. sad = سواد ورايات سود (محرّم…)، joy = أضواء وأعلام وفرح.
// [الشهر الهجري، من يوم، إلى يوم، النوع، لافتة الشارع، عنوان البطاقة، درس البطاقة] — الأيام بتقويم أم القرى (قد يفرق يومًا عن الرؤية)
const OCC=[[1,1,9,'sad','🖤 أيام محرّم الحرام','🖤 أيام محرّم الحرام','في هذه الأيام نتذكّر الإمام الحسين عليه السلام، الذي ضحّى من أجل الحقّ والإصلاح، ونتعلّم منه الصبر والشجاعة والثبات 🤍'],
  [1,10,10,'sad','🖤 ذكرى عاشوراء','🖤 ذكرى عاشوراء: استشهاد الإمام الحسين عليه السلام','في مثل هذا اليوم استُشهد الإمام الحسين عليه السلام وأهل بيته وأصحابه، فتعلّمنا منهم أن نقف مع الحقّ ولا نخاف 🤍'],
  [1,11,13,'sad','🖤 أيام محرّم الحرام','🖤 أيام محرّم الحرام','نتذكّر الإمام الحسين عليه السلام وأهل بيته، ونتعلّم منهم الصبر والوفاء 🤍'],
  [2,18,20,'sad','🖤 ذكرى الأربعين','🖤 ذكرى أربعين الإمام الحسين عليه السلام','بعد أربعين يومًا نتذكّر الإمام الحسين عليه السلام وأصحابه، ونتعلّم منهم الوفاء والثبات على الحقّ 🤍'],
  [2,28,28,'sad','🖤 ذكرى وفاة النبي ﷺ','🖤 ذكرى وفاة النبي محمد ﷺ','نتذكّر رسول اللَّه ﷺ الذي جاء رحمةً للناس، ونقتدي بأخلاقه الكريمة ونصلّي عليه 🤍'],
  [3,12,17,'joy','🌹 المولد النبوي الشريف','🌹 المولد النبوي الشريف','نفرح بمولد رسول اللَّه محمد ﷺ، نصلّي عليه ونقتدي بأخلاقه: الصدق والرحمة والأمانة 🌹'],
  [6,20,20,'joy','🌸 مولد السيدة الزهراء','🌸 مولد السيدة فاطمة الزهراء عليها السلام','نفرح بمولد السيدة فاطمة الزهراء عليها السلام، بنت رسول اللَّه ﷺ، قدوتنا في العبادة والطهر 🌸'],
  [7,13,13,'joy','🌟 مولد الإمام علي','🌟 مولد الإمام علي عليه السلام','نفرح بمولد أمير المؤمنين الإمام علي عليه السلام، مثال الشجاعة والعدل والعلم 🌟'],
  [7,27,27,'joy','✨ المبعث النبوي الشريف','✨ المبعث النبوي الشريف','في هذا اليوم بُعث النبي محمد ﷺ رسولًا إلى الناس، ونزل عليه الوحي ليعلّمهم الخير ✨'],
  [8,3,3,'joy','🌟 مولد الإمام الحسين','🌟 مولد الإمام الحسين عليه السلام','نفرح بمولد الإمام الحسين عليه السلام، سبط رسول اللَّه ﷺ وريحانته 🌟'],
  [8,15,15,'joy','🌕 مولد الإمام المهدي','🌕 مولد الإمام المهدي عليه السلام','نفرح بمولد الإمام المهدي عليه السلام في ليلة النصف من شعبان المباركة 🌕'],
  [9,19,21,'sad','🖤 ذكرى استشهاد الإمام علي','🖤 ذكرى استشهاد الإمام علي عليه السلام','نتذكّر أمير المؤمنين الإمام علي عليه السلام الذي استُشهد في محرابه، وهو مثال العدل والتقوى 🤍'],
  [12,9,9,'joy','🤲 يوم عرفة','🤲 يوم عرفة','يوم عرفة يوم الدعاء والتوبة، والحجّاج يقفون على جبل عرفات يدعون اللَّه 🤲'],
  [12,18,18,'joy','💚 عيد الغدير','💚 عيد الغدير الأغرّ','نفرح بعيد الغدير، ونتذكّر خطبة رسول اللَّه ﷺ في غدير خمّ 💚']];
function occNow(){const d=window.City3D&&City3D.debugOcc;let h;if(d!=null){if(!d)return null;h=d}else h=hijri();if(!h)return null;
  const o=OCC.find(o=>o[0]===h.m&&h.d>=o[1]&&h.d<=o[2]);return o?{k:o[3],b:o[4],t:o[5],msg:o[6],id:o[0]+'-'+o[1]}:null}
function winter(){const d=window.City3D&&City3D.debugSnow;if(d!=null)return !!d;const w=wxNow();if(w)return wSnowy(w);return [11,0,1].includes(new Date().getMonth())}
function dirtLv(){try{return window.Aamal&&Aamal.dirt?Aamal.dirt()|0:0}catch(e){return 0}}
function hourNow(){const d=window.City3D&&City3D.debugHour;if(d!=null)return d;const n=new Date();return n.getHours()+n.getMinutes()/60}
// (v13.5) وقت النوم: من ١٢ ليلًا حتى أذان الفجر (أو ٥ صباحًا إن لم يُعرف)
// (v14.1) وقت الزحام: ذهاب الطلاب والموظفين صباحًا ورجوعهم ظهرًا (ليس الجمعة والسبت)
// (v14.3) صلاة الجمعة: يأتي الناس قبل الظهر بـ٤٥ دقيقة حتى بعده بـ١٠، ثم الصلاة، ثم يرجعون بعد الظهر بـ٣٥ إلى ٦٠ دقيقة
function jumuaNow(){if(wDay()!==5)return '';let d=12.2;try{const x=new Date(+Adhan.times(new Date()).dhuhr);d=x.getHours()+x.getMinutes()/60}catch(e){}
  const h=hourNow();return h>=d-.75&&h<d+1/6?'come':h>=d+35/60&&h<d+1?'go':''}
// ===== (v14.5) إضافات الشيخ العشر =====
// الفصول الحقيقية: ربيع (آذار–أيار) / صيف (حزيران–أيلول) / خريف (تشرين ١–٢) / شتاء (كانون ١ – شباط)
function season(){const d=window.City3D&&City3D.debugSeason;if(d)return d;const m=new Date().getMonth();return m>=2&&m<=4?'sp':m>=5&&m<=8?'su':m<=10&&m>=9?'au':'wi'}
// إطعام العصافير في البرد: تشرين الثاني إلى شباط
function birdMonths(){const d=window.City3D&&City3D.debugBirds;if(d!=null)return !!d;return [10,11,0,1].includes(new Date().getMonth())}
const HM=['محرّم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوّال','ذو القعدة','ذو الحجّة'];
function hijri(){const d=window.City3D&&City3D.debugHijri;if(d)return d;try{const p=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{month:"numeric",day:"numeric"}).formatToParts(new Date());return {m:+p.find(x=>x.type==="month").value,d:+p.find(x=>x.type==="day").value}}catch(e){return null}}
function adhanGlow(){if(window.City3D&&City3D.debugGlow)return true;try{const t=Adhan.times(new Date()),n=Date.now();return ['fajr','dhuhr','maghrib'].some(p=>n>=+t[p]&&n<+t[p]+20*60e3)}catch(e){return false}}
function maghribH(){try{const x=new Date(+Adhan.times(new Date()).maghrib);return x.getHours()+x.getMinutes()/60}catch(e){return 17.3}}
function sunsetBirds(){const h=hourNow(),m=maghribH();return h>=m-.9&&h<m+.2}
// جار مريض: يوم من كل ثلاثة تقريبًا
function sickDay(){const d=window.City3D&&City3D.debugSick;if(d!=null)return !!d;const n=new Date(),k=n.getFullYear()*372+n.getMonth()*31+n.getDate();return (k*40503>>>0)%3===0}
// وقت لعب الكرة: العصر، وصباح الجمعة والسبت أيضًا
// (v16.4) طلب الشيخ: في العطل (الجمعة والسبت، الصيفية، نصف السنة، العيد والمناسبات السعيدة) يلعب الأطفال صباحًا وعصرًا، وفي باقي الأيام عصرًا فقط
const footHol=()=>{try{return !!parkWhy()}catch(e){return false}};
function footNow(){const h=hourNow(),M=maghribH()-.15;if(rainNow())return false;return footHol()?(h>=8.5&&h<M):(h>=13.5&&h<M)} // (v16.5) الشيخ وجد الملعب فارغًا ظهر يوم عطلة: في العطل يلعبون من ٨:٣٠ صباحًا حتى المغرب بلا انقطاع، وفي باقي الأيام بعد المدرسة ١:٣٠ حتى المغرب
// (v15.4) طلب الشيخ: 🎡 مدينة الألعاب يحضرها الأطفال الجمعة والسبت، والعطل (الصيفية ١٥ حزيران–آخر آب، ونصف السنة ٢٠ ك٢–٥ شباط)، والعيدين والمناسبات السعيدة.
// مغلقة في أيام الحزن (محرّم…). تعمل من ٩ صباحًا حتى ٩ مساءً، ولا تعمل وقت المطر.
function parkWhy(){const d=window.City3D&&City3D.debugPark;if(d!=null)return d?'🎉 يوم عطلة':null;const o=occNow();if(o&&o.k==='sad')return null;if(festNow()==='eid')return '🎉 اليوم عيد';if(o&&o.k==='joy')return o.t;
  const w=wDay();if(w===5)return '🕌 اليوم الجمعة';if(w===6)return '🌞 اليوم السبت';const n=new Date(),m=n.getMonth(),dd=n.getDate();
  if(m===5&&dd>=15||m===6||m===7)return '☀️ العطلة الصيفية';if(m===0&&dd>=20||m===1&&dd<=5)return '📚 عطلة نصف السنة';return null}
// (v16.9) الحنفية التي تخرّ (يوم بعد يوم تقريبًا)، ومائدة الإفطار في رمضان قبل المغرب، وحلقة القرآن بعد المغرب، وسؤال شيخ المكتبة من الكتاب
function leakDay(){const d=window.City3D&&City3D.debugLeak;if(d!=null)return !!d;return (seed()>>>3)%2===0}
function iftarNow(){const d=window.City3D&&City3D.debugIftar;if(d!=null)return !!d;if(festNow()!=='ramadan')return false;const h=hourNow(),m=maghribH();return h>=m-.75&&h<m+.35}
function halaqaNow(){const d=window.City3D&&City3D.debugHalaqa;if(d!=null)return !!d;const h=hourNow(),m=maghribH();return h>=m+.1&&h<m+1.5}
function qDay(){try{const L=QBANK.filter(q=>q.t==='mcq'&&q.o&&q.o.length>1||q.t==='tf');return L.length?L[seed()%L.length]:null}catch(e){return null}}
function parkOpen(){const h=hourNow();return !!parkWhy()&&h>=9&&h<21&&!rainNow()&&!sleepNow()}
// (v18.0) طلب الشيخ: «الطفل يداوم في المدرسة مثل الطلاب من ٨ إلى ١٢» — أيام الدوام = ليست عطلة (parkWhy)
function schoolDay(){const d=window.City3D&&City3D.debugSchool;if(d!=null)return !!d;return parkWhy()==null}
function schoolNow(){const h=hourNow();return schoolDay()&&h>=7.75&&h<12}
function wDay(){const d=window.City3D&&City3D.debugWd;return d!=null?d:new Date().getDay()}
function rushNow(){const h=hourNow();return wDay()<5&&(h>=7.5&&h<8.5||h>=11.75&&h<12.75)}
function sleepNow(){const h=hourNow();let f=5;try{const d=new Date(+Adhan.times(new Date()).fajr);const x=d.getHours()+d.getMinutes()/60;if(x>3&&x<7)f=x}catch(e){}return h>=0&&h<f}
function makeLife(night){const T=THREE,g=new T.Group(),M=c=>new T.MeshStandardMaterial({color:c,roughness:.75});
  const add=(geo,m,x,y,z,p)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o};
  const skinC=[0xf6cfa6,0xe8b48a,0xd9a072,0xf2c9a0];
  // (v14.0) طلب الشيخ: تجسيم الناس أكثر. أشخاص بأجسام منحنية (ثوب/عباءة بشكل الجسم)، أكتاف، رقبة، يدان تتأرجحان عند المشي،
  // أحذية، ورأس فيه عينان ببؤبؤ، حاجبان، أنف، أذنان وفم؛ لبعض الرجال لحية، ويشماغ بعقال أو طاقية بيضاء؛ والنساء بحجاب يغطّي الرأس والكتفين.
  // kid (طالب) / man (ثوب أبيض) / woman (عباءة) / guard (حارس) / shep (راعٍ). أوّل جزء دائمًا هو الثوب (يغيّر جدّو لونه).
  const PG={hd:new T.SphereGeometry(1,18,14),sm:new T.SphereGeometry(1,10,8)};
  const lathe=(pts,seg)=>new T.LatheGeometry(pts.map(([r,y])=>new T.Vector2(r,y)),seg||18);
  const BODY={man:lathe([[.001,0],[.3,.02],[.29,.35],[.25,.75],[.24,1.0],[.27,1.16],[.22,1.24],[.1,1.3],[.001,1.31]]),
    woman:lathe([[.001,0],[.36,.02],[.32,.4],[.26,.8],[.24,1.0],[.26,1.15],[.2,1.24],[.1,1.3],[.001,1.31]]),
    kid:lathe([[.001,.45],[.25,.45],[.26,.62],[.23,.85],[.25,.98],[.2,1.04],[.08,1.08],[.001,1.09]])};
  function person(kind,i){const P=new T.Group(),sk=M(skinC[i%4]),dk=M(0x2a1d14),kid=kind==='kid';let s=1;
    const ball=(m,r,x,y,z,sx,sy,sz,p)=>{const o=add(r>.12?PG.hd:PG.sm,m,x,y,z,p||P);o.scale.set(r*(sx||1),r*(sy||1),r*(sz||1));return o};
    const robeC=kind==='man'?(i%3?0xf5f5f0:0xd8d8d0):kind==='woman'?0x1d1d24:kind==='shep'?0x7a5a3a:kind==='guard'?0x1f3a6b:[0xff6b6b,0x4fc3ff,0xffd23f,0x7be37b,0xb07cff,0xff9f43][i%6];
    const robe=M(robeC);add(kid?BODY.kid:kind==='woman'?BODY.woman:BODY.man,robe,0,0,0,P);
    const shoe=M(kid?[0xffffff,0x2b3a55,0xe2504a][i%3]:0x3a2a1e);
    if(kid){const pant=M(0x2b3a55);P.userData.legs=[-.1,.1].map(x=>{const L=new T.Group();L.position.set(x,.48,0);P.add(L);add(new T.CylinderGeometry(.085,.075,.42,8),pant,0,-.21,0,L);ball(shoe,.1,0,-.44,.04,1,.55,1.4,L);return L});
      P.userData.bag=add(new T.BoxGeometry(.34,.38,.16),M([0x2f6fd0,0xd94f8a,0x1fa463][i%3]),0,.8,-.25,P)} // حقيبة
    else[-.1,.1].forEach(x=>ball(shoe,.09,x,.04,.08,1,.5,1.5));
    // اليدان: محور عند الكتف حتى تتأرجحا
    const sh=kid?.97:1.18,sw=kid?.22:.27,al=kid?.4:.55;
    P.userData.arms=[-1,1].map(k=>{const A=new T.Group();A.position.set(k*sw,sh,0);P.add(A);ball(robe,kid?.085:.1,0,0,0,1,1,1,A);
      const sl=add(new T.CylinderGeometry(kid?.065:.075,kid?.075:.095,al,8),kind==='guard'||kind==='woman'||kind==='shep'||kind==='man'?robe:M(robeC),0,-al/2,0,A);sl.rotation.z=k*.08;
      ball(sk,kid?.06:.07,k*.02,-al-.04,0,1,1.1,1,A);return A});
    // الرقبة والرأس
    const hy=kid?1.3:1.52,hr=kid?.24:.19;add(new T.CylinderGeometry(hr*.38,hr*.42,.14,8),sk,0,hy-hr*.95,0,P);const n0=P.children.length;
    ball(sk,hr,0,hy,0,1,1.08,1);
    [-1,1].forEach(k=>{ball(M(0xffffff),hr*.2,k*hr*.38,hy+hr*.12,hr*.84,1,1.1,.6);ball(dk,hr*.11,k*hr*.38,hy+hr*.11,hr*.95);
      add(new T.BoxGeometry(hr*.32,hr*.06,hr*.06),dk,k*hr*.38,hy+hr*.4,hr*.86,P).rotation.z=k*-.15;
      ball(sk,hr*.22,k*hr*.98,hy,0,.6,1,1)});
    ball(M(skinC[(i+1)%4]),hr*.13,0,hy-hr*.12,hr*1.0,1,1,1);
    add(new T.BoxGeometry(hr*.38,hr*.06,hr*.05),M(0xb5524a),0,hy-hr*.45,hr*.9,P);
    if(kid){if(i%2){const kc=new T.Mesh(new T.SphereGeometry(hr*1.05,16,8,0,Math.PI*2,0,Math.PI*.42),M(0xffffff));kc.position.set(0,hy+.03,-.01);kc.castShadow=true;P.add(kc)}else{const hc=new T.Mesh(new T.SphereGeometry(hr*1.06,16,10,0,Math.PI*2,0,Math.PI*.5),M(0x3b2414));hc.position.set(0,hy+.02,-.03);hc.rotation.x=-.3;hc.castShadow=true;P.add(hc)}}
    if(kind==='man'||kind==='guard'||kind==='shep'){
      if((kind==='man'&&i%2===0)||kind==='shep'){const bd=new T.Mesh(new T.SphereGeometry(hr*1.02,16,10,0,Math.PI*2,Math.PI*.55,Math.PI*.45),M(i%4===0?0xdedede:0x2a1d14));bd.position.set(0,hy+.01,.02);bd.rotation.x=.35;P.add(bd)}
      if(kind==='shep'||kind==='man'&&i%3===0){const gh=new T.Mesh(new T.SphereGeometry(hr*1.12,16,12,Math.PI/2+.85,Math.PI*2-1.7,0,Math.PI*.7),M(kind==='shep'||i%2?0xf4f0e6:0xf2f2f2,{side:T.DoubleSide}));gh.position.set(0,hy+.02,-.01);P.add(gh);
        add(new T.CylinderGeometry(hr*1.0,hr*1.15,hr*.95,14,1,true,.95,Math.PI*2-1.9),M(0xf4f0e6,{side:T.DoubleSide}),0,hy-hr*.55,-hr*.1,P);
        add(new T.TorusGeometry(hr*.92,.025,6,18),M(0x151515),0,hy+hr*.62,-.01,P).rotation.x=Math.PI/2}
      else if(kind==='man'){const kc=new T.Mesh(new T.SphereGeometry(hr*1.04,16,8,0,Math.PI*2,0,Math.PI*.42),M(0xffffff));kc.position.set(0,hy+.02,-.01);kc.castShadow=true;P.add(kc)}}
    if(kind==='woman'){const hj=M(0x1d1d24,{side:T.DoubleSide});const hd=new T.Mesh(new T.SphereGeometry(hr*1.16,18,12,Math.PI/2+.75,Math.PI*2-1.5,0,Math.PI*.78),hj);hd.position.set(0,hy+.01,-.01);hd.castShadow=true;P.add(hd);
      add(new T.CylinderGeometry(hr*1.05,.3,.3,18,1,true),hj,0,hy-hr*.9-.15,-.01,P)}
    // (v16.6) الرأس مجموعة وحدها محورها الرقبة: يلتفت الرأس وحده (يمينًا ويسارًا) والجسم ثابت، بحدّ أقصى طبيعي
    {const H=new T.Group(),py=hy-hr*.8;H.position.set(0,py,0);P.children.slice(n0).forEach(c=>{P.remove(c);c.position.y-=py;H.add(c)});P.add(H);P.userData.head=H}
    if(kind==='shep'){add(new T.CylinderGeometry(.025,.025,1.9,6),M(0x6b4423),.34,.95,.12,P);add(new T.TorusGeometry(.1,.025,5,10,Math.PI),M(0x6b4423),.44,1.9,.12,P)}
    if(kind==='guard'){add(new T.CylinderGeometry(.22,.22,.14,12),M(0x152a4f),0,hy+.13,0,P);add(new T.BoxGeometry(.3,.03,.18),M(0x101010),0,hy+.07,.17,P);
      add(new T.SphereGeometry(.11,10,8),new T.MeshStandardMaterial({color:0xfff1b0,emissive:0xffd860,emissiveIntensity:1.6}),.32,.8,.15,P);
      const pl=new T.PointLight(0xffd27a,1.2,9,1.4);pl.position.set(.32,1,.3);P.add(pl)}
    if(kid)s=.62;P.userData.lp=null;P.userData.ph=Math.random()*6;
    mergeKids(P);P.scale.setScalar(s*1.35*PS);g.add(P);return P}
  // (v14.0) تأرجح اليدين (والرجلين للأطفال) حين يتحرّك الشخص، ويسكنان حين يقف
  function swing(dt){g.children.forEach(P=>{const u=P.userData;if(!u.arms||!P.visible)return;const x=P.position.x,z=P.position.z,lp=u.lp;
    const mv=lp?Math.hypot(x-lp[0],z-lp[1])/Math.max(dt,1e-3):0;u.lp=[x,z];const on=mv>.08&&mv<10;u.ph+=dt*(on?Math.min(11,2.5+mv*4.8):0);
    u.am=(u.am||0)+((on?Math.min(.6,.15+mv*.35):0)-(u.am||0))*Math.min(1,dt*5);const a=Math.sin(u.ph)*u.am;u.arms[0].rotation.x=a;u.arms[1].rotation.x=-a;
    if(u.legs){u.legs[0].rotation.x=-a;u.legs[1].rotation.x=a}
    if(u.head){let ht=u.hyT||0;u.hyT=0;
      if(!ht&&!on){u.gl=(u.gl==null?2+Math.random()*5:u.gl)-dt;if(u.gl<0){u.gla=u.gla?0:(Math.random()-.5)*1.3;u.gl=u.gla?1+Math.random()*1.5:3+Math.random()*6}ht=u.gla||0}else u.gla=0;
      ht=Math.max(-1.05,Math.min(1.05,ht));u.head.rotation.y+=(ht-u.head.rotation.y)*Math.min(1,dt*4);u.head.rotation.x=on?Math.sin(u.ph*2)*.03:0}})}
  // (v13.7) 🏪 باعة السوق خلف دكاكينهم (بالنهار)، يلتفتون يمينًا ويسارًا
  const sellers={};MKT.forEach(([k,z],i)=>{const P=person('man',i+1);P.position.set(MKX+2.45,0,z);P.rotation.y=-Math.PI/2;P.userData.act='mk_'+k;
    if(k==='bak')add(new T.CylinderGeometry(.19,.21,.28,12),M(0xffffff),0,1.68,0,P);sellers[k]=P});
  // (v13.7) 👴 جدّو: رجل كبير بلحية بيضاء وعصا، يحمل كيسين ثقيلين من السوق
  const elder=person('man',0);elder.userData.act='elder';
  {const add2=(geo,m,x,y,z)=>add(geo,m,x,y,z,elder);elder.children[0].material.color.setHex(0xc9b48f);
    add2(new T.SphereGeometry(.15,10,8),M(0xf4f4f4),0,1.33,.1);const c=add2(new T.CylinderGeometry(.025,.025,1.15,6),M(0x5a3a1f),.33,.57,.18);c.rotation.z=-.08;
    const bags=[-1,1].map(k=>add2(new T.BoxGeometry(.24,.28,.14),M(k<0?0xe9e2cf:0xd6e8f5),k*.36,.5,0));elder.userData.bags=bags;
    const mk=markSprite(T,'🤝','#1fa463',.9);mk.position.set(0,2.2,0);elder.add(mk);elder.userData.mk=mk;elder.visible=false}
  // (v15.2) 🤕 رجل يقع في الشارع (مرة في اليوم بعد بناء المستشفى): الطفل يسنده ويوصله إلى المستشفى
  const faller=person('man',5);faller.userData.act='fall';faller.visible=false;const fallMk=markSprite(T,'🤕','#e2504a',.9);fallMk.visible=false;fallMk.userData.act='fall';g.add(fallMk);
  // مركبات: باص مدرسة أصفر وسيارات
  function wheels(V,w,l){const wm=M(0x222222);[[-w,l],[w,l],[-w,-l],[w,-l]].forEach(([x,z])=>{const c=add(new T.CylinderGeometry(.34,.34,.25,14),wm,x,.34,z,V);c.rotation.z=Math.PI/2})}
  function bus(){const V=new T.Group(),y=M(0xffc21a),gl=M(0x9fd8ff);add(new T.BoxGeometry(1.8,1.55,4.6),y,0,1.15,0,V);add(new T.BoxGeometry(1.82,.12,4.62),M(0x222222),0,.95,0,V);
    [-.91,.91].forEach(x=>add(new T.BoxGeometry(.02,.5,3.4),gl,x,1.5,.2,V));add(new T.BoxGeometry(1.5,.6,.02),gl,0,1.5,-2.31,V);
    add(new T.BoxGeometry(.04,.3,.3),M(0xe2504a),-.93,1.1,-1.6,V);wheels(V,.85,1.5);g.add(V);return V}
  // (v13.6) سيارات أجمل (طلب الشيخ): هيكل انسيابي بحواف ناعمة وطلاء لامع، زجاج داكن، أضواء أمامية وخلفية، صدّامات، مرايا، وعجلات بأغطية فضية.
  // نوعان: صالون (سيدان) ودفع رباعي (SUV). الواجهة نحو +z.
  const CW=1.36,carG={},glassM=new T.MeshStandardMaterial({color:night?0x0b1420:0x1d2b3a,roughness:.08,metalness:.6});
  const headM=new T.MeshStandardMaterial({color:0xfffbe6,emissive:0xfff1b0,emissiveIntensity:night?2.2:.35}),tailM=new T.MeshStandardMaterial({color:0xc4161c,emissive:0xff2020,emissiveIntensity:night?1.4:.25});
  const trimM=M(0x26282c),hubM=new T.MeshStandardMaterial({color:0xd8dde2,roughness:.25,metalness:.85}),tireM=M(0x1a1a1a);
  function prof(pts,w,bev){const sh=new T.Shape();pts.forEach(([z,y],i)=>i?sh.lineTo(z,y):sh.moveTo(z,y));
    const g=new T.ExtrudeGeometry(sh,{depth:w,bevelEnabled:!!bev,bevelThickness:bev||0,bevelSize:bev||0,bevelSegments:3,curveSegments:4});g.rotateY(-Math.PI/2);g.translate(w/2,0,0);return g}
  function carGeo(suv){const k=suv?'s':'c';if(carG[k])return carG[k];const r=suv?1.42:1.22;
    const body=suv?[[-1.3,.32],[1.3,.32],[1.36,.6],[1.28,.86],[.6,.92],[.35,r],[-1.22,r],[-1.32,.95],[-1.36,.55]]
      :[[-1.3,.32],[1.3,.32],[1.36,.55],[1.26,.74],[.48,.82],[.12,r],[-.6,r],[-1.0,.86],[-1.32,.78],[-1.36,.5]];
    const glass=suv?[[.64,.9],[.43,r-.02],[-1.25,r-.02],[-1.34,.95]]:[[.53,.8],[.17,r-.02],[-.66,r-.02],[-1.04,.84]];
    const side=suv?[[.5,.94],[.33,r-.08],[-1.15,r-.08],[-1.22,.96]]:[[.38,.86],[.12,r-.07],[-.6,r-.07],[-.9,.87]];
    return carG[k]={body:prof(body,CW-.12,.06),glass:prof(glass,CW-.2,.04),side:prof(side,CW+.02,0)}}
  // (v14.8) كل سيارة بمستويين (LOD): تفصيلية قريبًا، ومجسّم بسيط من بعيد حتى تبقى خفيفة مع سيارات كثيرة على الشارع الطويل
  const lodG={b:new T.BoxGeometry(1.36,.55,2.7),c:new T.BoxGeometry(1.2,.42,1.4),w:new T.BoxGeometry(1.4,.3,2.2)};
  function lodWrap(V,simple,d){const W=new T.Group(),L=new T.LOD();L.addLevel(V,0);L.addLevel(simple,d||50);W.add(L);W.scale.copy(V.scale);V.scale.setScalar(1);g.add(W);return W}
  function car(c,suv){const V=new T.Group(),G=carGeo(suv),paint=new T.MeshStandardMaterial({color:c,roughness:.3,metalness:.45});
    const tw=(o,x,y,z)=>{o.position.set(x,y,z);o.castShadow=true;V.add(o);return o};
    tw(new T.Mesh(G.body,paint),0,0,0);tw(new T.Mesh(G.glass,glassM),0,0,0);tw(new T.Mesh(G.side,glassM),0,0,0);
    const r=suv?1.42:1.22;add(new T.BoxGeometry(CW+.04,r-.95,.07),paint,0,(r+.95)/2-.03,suv?-.35:-.22,V); // العمود الأوسط
    [[1.37,headM],[-1.37,tailM]].forEach(([z,m])=>[-.42,.42].forEach(x=>add(new T.BoxGeometry(.32,.12,.05),m,x,.58,z,V)));
    [1.36,-1.37].forEach(z=>add(new T.BoxGeometry(CW+.02,.14,.1),trimM,0,.36,z,V));
    add(new T.BoxGeometry(.5,.1,.03),trimM,0,.46,1.39,V);
    [-1,1].forEach(k=>add(new T.BoxGeometry(.12,.08,.14),paint,k*(CW/2+.04),.9,.42,V));
    [[-1,.86],[1,.86],[-1,-.86],[1,-.86]].forEach(([k,z])=>{const t=add(new T.CylinderGeometry(.3,.3,.22,18),tireM,k*(CW/2-.08),.3,z,V);t.rotation.z=Math.PI/2;
      const h=add(new T.CylinderGeometry(.17,.17,.24,14),hubM,k*(CW/2-.08),.3,z,V);h.rotation.z=Math.PI/2});
    mergeKids(V);V.scale.setScalar(.95);const Sm=new T.Group(),b=new T.Mesh(lodG.b,paint);b.position.y=.6;const cb=new T.Mesh(lodG.c,glassM);cb.position.set(0,1.05,-.2);const wh=new T.Mesh(lodG.w,tireM);wh.position.y=.3;Sm.add(b,cb,wh);
    return lodWrap(V,Sm)}
  const cars=[{v:bus(),stop:-17.6,off:0},{v:car(0xe2504a),stop:-12.4,off:1.6},{v:car(0x4f8fe0),stop:-8.6,off:3.2}];cars.forEach(c=>c.v.userData.lane=1);
  cars.forEach(c=>{c.v.rotation.y=Math.PI;c.v.visible=false});
  // طلاب الساحة
  const YX=[-12.6,-4.3],YZ=[-19.7,-15.2],yard=[];
  for(let i=0;i<10;i++){const p=person('kid',i);p.position.set(YX[0]+Math.random()*(YX[1]-YX[0]),0,YZ[0]+Math.random()*(YZ[1]-YZ[0]));Object.assign(p.userData,{tx:p.position.x,tz:p.position.z,w:Math.random()*3,j:0});yard.push(p)}
  const guard=person('guard',1);guard.position.set(-2.5,0,-17);
  // (v12.1) 💬 فقاعات الكلام تتبع صاحبها
  const bubs=[];function say(o,txt,dur,h){const s=speech(T,txt);g.add(s);const b={s,o,k:dur,h};bubs.push(b);return b}
  function unsay(b){if(!b)return;const i=bubs.indexOf(b);if(i>=0)bubs.splice(i,1);g.remove(b.s);b.s.material.map.dispose();b.s.material.dispose()}
  // (v12.1) 🚶 جيران يمشون على الأرصفة، وأحيانًا يُلقي أحدهم «السلام عليكم» (الأول والثاني يبقيان بالليل)
  // (v13.4) على الطرق الجانبية z=±4.6 (حافتها الخارجية ±5) لأن البنايات الكبيرة تملأ أرصفة الطريق الرئيسي
  // (v15.1) طلب الشيخ: حركة الناس انسيابية طبيعية، لا أحد يروح ويرجع بنفس المكان. كل جار يخرج من مكان (باب بيت، قرية، سوق، أول الشارع)
  // ويمشي إلى مكان معيّن (الجامع، السوق، القرى، المزرعة، آخر الشارع) ثم يغيب، وبعد قليل يخرج شخص غيره من مكان آخر.
  // TRIPS: [نقاط المسار [x,z,وقفة]], شرط (m = يحتاج الجامع), يظهر من باب (1) أو من بعيد (0)، يدخل/يغيب في النهاية
  const VL=VIL.map(([x,z])=>[x+4,z]),L2=-2.6,R2=2.8,Ze=4.95;
  const TRIPS=[
    {p:[[-4.5,NBZ],[L2,NBZ],[L2,6],[L2,Ze,1.5],[R2,Ze],[R2,4.1],[6,4.1],[6,3.75]],m:1},            // بيت جدّو ← الجامع
    {p:[[6,3.75],[6,4.1],[R2,4.1],[R2,6],[R2,NBZ],[4.6,NBZ]],m:1},                                    // الجامع ← بيت الجار
    {p:[VL[0],[VL[0][0]+4,VL[0][1]],[L2,VL[0][1]],[L2,-6],[L2,-Ze,1.5],[R2,-Ze],[R2,-14],[MKX+.6,-14.6]]}, // قرية النخيل ← السوق
    {p:[[MKX+.6,-14.6],[R2,-14],[R2,-6],[R2,-Ze,1.5],[L2,-Ze],[L2,6],[L2,VL[1][1]],[VL[1][0]+4,VL[1][1]],VL[1]]}, // السوق ← قرية الرمّان
    {p:[[4.6,NBZ],[R2,NBZ],[R2,60],[R2,95]]},                                                          // بيت الجار ← آخر الشارع
    {p:[[L2,-70],[L2,-6],[L2,-Ze],[L2,5.1],[-12,5.1],[FARM[0],5.1],[FARM[0],3.7]]},                     // أول الشارع ← المزرعة
    {p:[[R2,-60],[R2,-6],[R2,-5.1],[11.2,-5.1],[PLZ[0]-3.3,PLZ[1]-3],[PLZ[0]+3.4,PLZ[1]-3],[PLZ[0]+3.4,PLZ[1]+3],[11.2,5.1],[R2,5.1],[R2,60],[R2,95]]}, // يمرّ بساحة النافورة ويمضي
    {p:[[L2,70],[L2,NBZ+1],[-4.5,NBZ]]},                                                                // من بعيد ← بيت جدّو
    {p:[VL[2],[VL[2][0]+4,VL[2][1]],[L2,VL[2][1]],[L2,-30],[L2,-18.4],[-2.4,-17.6]]},                    // قرية البساتين ← باب المدرسة
    {p:[[-2.4,-17.6],[L2,-16],[L2,-6],[L2,-Ze,1.5],[R2,-Ze],[R2,-5.1],[11.2,-5.1],[PLZ[0]-3.3,PLZ[1]-3]],end:1}, // المدرسة ← ساحة النافورة
    {p:[[FARM[0],3.7],[FARM[0],5.1],[-12,5.1],[L2,5.1],[L2,VL[1][1]],[VL[1][0]+4,VL[1][1]],VL[1]]},         // المزرعة ← قرية الرمّان
    {p:[[R2,95],[R2,40],[R2,6],[R2,4.1],[6,4.1],[6,3.75]],m:1},                                         // من آخر الشارع ← الجامع
    {p:[[R2,95],[R2,37.2],[HSP[0]-4.2,36.6]],hp:1},                                                     // (v15.2) من بعيد ← المستشفى
    {p:[[HSP[0]-4.2,35.4],[R2,35.2],[R2,6],[R2,-70]],hp:1},                                             // المستشفى ← أول الشارع
    {p:[[-4.5,NBZ],[L2,NBZ],[L2,22],[L2,Ze+.3],[L2,Ze,1.5],[R2,Ze],[R2,6],[R2,36.6],[HSP[0]-4.2,36.6]],hp:1} // بيت جدّو ← المستشفى
  ];
  const near=(q)=>Math.hypot(q[0],q[1])<45; // البداية/النهاية قريبة (باب) ← يكبر/يصغر بلطف
  const NP=6,KINDS=['man','woman','man','kid','woman','man'];
  function umbrella(P,i){const U=new T.Group();U.visible=false;P.add(U);P.userData.umb=U;add(new T.CylinderGeometry(.02,.02,1.15,5),M(0x333333),.24,1.55,.05,U);
    const c=add(new T.SphereGeometry(.7,14,6,0,Math.PI*2,0,Math.PI/2.6),new T.MeshStandardMaterial({color:UMC[i%5],roughness:.6,side:T.DoubleSide}),.24,1.85,.05,U);c.castShadow=true}
  const UMC=[0xe2504a,0x2f6fd0,0x1fa463,0xffc21a,0x8f6bff];
  const peds=[];
  for(let i=0;i<NP;i++){const P=person(KINDS[i],i+3);P.userData.ped=i+1;P.visible=false;
    P.userData.u={kind:KINDS[i],h:KINDS[i]==='kid'?1.7:2.3,pts:[],sp:1,v:0,gap:.5+i*1.6,greet:0,hold:0,bub:null,bs:P.scale.x,gr:1,out:0,trip:-1};umbrella(P,i);peds.push(P)}
  {const P=person('shep',7);P.userData.ped=NP+1;P.position.set(FLK[0],0,FLK[1]-3.2);
    P.userData.u={kind:'shep',h:2.3,pts:[],sp:.6,v:0,gap:0,greet:0,hold:0,bub:null,bs:P.scale.x,gr:1,out:0,shep:1,w:2};umbrella(P,NP);peds.push(P)}
  // (v15.1) دوران ناعم: يلتفت الشخص تدريجيًا نحو اتجاهه بدل القفز المفاجئ
  // (v16.6) طلب الشيخ: لا التفات مفاجئ ١٨٠° → سرعة دوران الجسم محدودة (نصف لفّة في ثانية تقريبًا)، ويرجع فرق الزاوية
  function turn(P,a,dt,k,mx){let d=a-P.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));const m=(mx||3.2)*dt;P.rotation.y+=Math.max(-m,Math.min(m,d*Math.min(1,dt*(k||6))));return Math.abs(d)}
  // يبطئ وهو يستدير (لا يمشي جانبيًا أو للخلف)
  const tf=df=>Math.max(.12,1-df/1.7);
  // (v16.0) طلب الشيخ: حركة الأطفال أكثر انسيابية — يبدأ المشي ويتوقّف بالتدريج، يبطئ قبل الوصول، يستدير بنعومة،
  // ولا يمشي «بالعرض»: ينتظر حتى يلتفت نحو هدفه ثم يسرع. يرجع true عند الوصول
  function glide(P,u,tx,tz,max,dt,t){const dx=tx-P.position.x,dz=tz-P.position.z,d=Math.hypot(dx,dz);u.v=u.v||0;
    if(d<.06&&u.v<.15){u.v=0;P.position.y*=.7;return true}const a=Math.atan2(dx,dz);turn(P,a,dt,4.5);let df=a-P.rotation.y;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));
    const want=max*Math.min(1,d/1.1)*Math.max(.15,1-df/1.6);u.v+=(want-u.v)*Math.min(1,dt*2.4);const sp=Math.min(d,u.v*dt);if(d>1e-4){P.position.x+=dx/d*sp;P.position.z+=dz/d*sp}
    P.position.y=Math.abs(Math.sin((u.st=(u.st||0)+sp*4.2)))*.055*Math.min(1,u.v/max*1.4);return false}
  // هدف قريب للتجوّل (لا يقطع الساحة كلها بخطّ مستقيم)
  // (v16.1) طلب الشيخ: الناس لا يختفون فجأة → يظهرون ويغيبون بالتدريج (شفافية) وهم يمشون، لا بالتصغير المفاجئ
  function setOp(P,a){a=Math.max(0,Math.min(1,a));const u=P.userData;if(u.opa===a)return;u.opa=a;if(!u.mats){u.mats=[];P.traverse(m=>{if(m.material&&!m.isSprite)u.mats.push(m.material)})}
    u.mats.forEach(m=>{m.transparent=a<.999;m.opacity=a;m.depthWrite=a>.6});P.visible=a>.01}
  const nearPt=(x,z,X0,X1,Z0,Z1,r)=>{const a=Math.random()*Math.PI*2,q=.8+Math.random()*r;return [Math.max(X0,Math.min(X1,x+Math.cos(a)*q)),Math.max(Z0,Math.min(Z1,z+Math.sin(a)*q))]};
  // يبدأ رحلة جديدة بشخص جديد (شكل مختلف كل مرة)
  function newTrip(i,o){const old=peds[i],u=old.userData.u,busy=peds.map(P=>P.userData.u.trip);
    const ok=TRIPS.map((r,k)=>k).filter(k=>!busy.includes(k)&&(!TRIPS[k].m||o.mosque)&&(!TRIPS[k].hp||o.hosp));if(!ok.length){u.gap=3;return}
    const k=ok[Math.floor(Math.random()*ok.length)],r=Math.random(),kind=r<.45?'man':r<.82?'woman':'kid';
    const P=person(kind,Math.floor(Math.random()*12));P.userData.ped=i+1;umbrella(P,i);
    g.remove(old);old.traverse(x=>{x.geometry&&x.geometry.dispose()});peds[i]=P;
    const off=(Math.random()-.5)*.35,pts=TRIPS[k].p.map(q=>[q[0]+(Math.abs(q[0])<4?off:0),q[1]+(Math.abs(Math.abs(q[1])-5)<.3?off:0),q[2]]);
    Object.assign(u,{kind,h:kind==='kid'?1.7:2.3,trip:k,pts:pts.slice(1),sp:(kind==='kid'?1.15:1)*(.85+Math.random()*.35),v:0,bs:P.scale.x,gr:near(pts[0])?0:1,
      out:near(pts[pts.length-1])||TRIPS[k].end?1:0,fade:0,look:0,greet:0,hold:0,bub:null});P.userData.u=u;
    P.position.set(pts[0][0],0,pts[0][1]);const n=pts[1];P.rotation.y=Math.atan2(n[0]-pts[0][0],n[1]-pts[0][1]);P.scale.setScalar(u.bs);setOp(P,Math.max(.02,u.gr))}
  let gT=120,quiet=0; // (v17.8) طلب الشيخ مرة ثانية: «السلام مبالغ بيه» → أول سلام بعد دقيقتين، ثم كل ٤–٦ دقائق، وبعد ٥ سلامات في اليوم لا سلام
  // (v15.8) طلب الشيخ: السلام كثير → جار واحد يسلّم كل دقيقة تقريبًا، وبعد ٥ سلامات في اليوم نادرًا (كل ٣–٤ دقائق)
  function endGreet(i){const u=peds[i]&&peds[i].userData.u;if(!u)return;u.greet=0;unsay(u.bub);u.bub=null}
  // (v12.1) 🚗 سيارات تمرّ طول اليوم في الاتجاهين، وتقف إذا كان الطفل أمامها في الطريق
  // ألوان سيارات حقيقية: أبيض، فضي، أسود، كحلي، أحمر، بيج، أخضر غامق، برتقالي
  const CC=[0xf2f2f2,0xb8bec6,0x1f2833,0x1d3f7a,0xb3262e,0xd9c9a3,0x2f6b4f,0xe07b24];
  // (v13.5) السيارات تأتي من بعيد وتذهب بعيدًا حتى تختفي في الأفق (بلا اختفاء مفاجئ): الطريق من Z0 إلى Z1
  // (v14.1) طلب الشيخ: زحام وقت المدرسة. سيارات إضافية (rush) تدخل الطريق فقط بين ٧:٣٠–٨:٣٠ و١١:٤٥–١٢:٤٥ وتمشي أبطأ فتتزاحم
  const Z0=-600,Z1=600,TN=night?5:liteOn()?14:40,RU=night?0:liteOn()?8:25; // (v14.8) تظهر وتختفي على بُعد ٦٠٠ (داخل الضباب) فلا يُرى ظهورها
  const traffic=[];[1,-1].forEach(dir=>{for(let k=0;k<TN;k++){const v=car(CC[(traffic.length*3)%CC.length],traffic.length%3===1),z=Z0+(k+(dir<0?.5:0))*(Z1-Z0)/TN;
    v.rotation.y=dir>0?0:Math.PI;v.position.set(dir,0,z);v.userData.lane=k%2;const ru=RU>0&&![0,3,5].includes(k%8);traffic.push({v,dir,z,sp:(k%2?6.5:7.5)+Math.random()*2,ru})}});
  traffic.forEach(c=>{if(c.ru){c.on=rushNow();c.v.visible=c.on}});
  // (v14.7) طلب الشيخ: 🚌 باصات المدينة تقف عند الموقف، ينزل ناس ويصعد آخرون. باص أبيض بخطّ أخضر، نوافذ على الجانبين، وباب على جهة الرصيف.
  function cityBus(col){const V=new T.Group(),w=M(0xf4f4f0,{roughness:.4}),st=M(col),gl=new T.MeshStandardMaterial({color:night?0x3a4a5a:0x223344,roughness:.1,metalness:.5});
    add(new T.BoxGeometry(2,1.9,6.2),w,0,1.35,0,V);add(new T.BoxGeometry(2.02,.25,6.22),st,0,.75,0,V);add(new T.BoxGeometry(2.02,.12,6.22),st,0,2.12,0,V);
    [-1,1].forEach(k=>add(new T.BoxGeometry(.03,.7,5),gl,k*1.01,1.6,-.4,V));add(new T.BoxGeometry(1.8,.9,.03),gl,0,1.55,3.11,V);add(new T.BoxGeometry(1.7,.6,.03),gl,0,1.65,-3.11,V);
    add(new T.BoxGeometry(.03,1.5,.9),M(0x3a4a5a),1.02,1.1,2.2,V); // الباب (جهة اليمين)
    add(new T.BoxGeometry(1.2,.22,.04),new T.MeshStandardMaterial({color:0x111111,emissive:0xffb020,emissiveIntensity:.8}),0,2.3,3.12,V); // لوحة الخطّ
    [[3.13,headM],[-3.13,tailM]].forEach(([z,m])=>[-.7,.7].forEach(x=>add(new T.BoxGeometry(.3,.16,.05),m,x,.7,z,V)));
    [[-1,2],[1,2],[-1,-2],[1,-2]].forEach(([k,z])=>{const t2=add(new T.CylinderGeometry(.42,.42,.3,18),tireM,k*.88,.42,z,V);t2.rotation.z=Math.PI/2;const h2=add(new T.CylinderGeometry(.22,.22,.32,12),hubM,k*.88,.42,z,V);h2.rotation.z=Math.PI/2});

    V.scale.setScalar(.95);const Sm=new T.Group(),b=new T.Mesh(new T.BoxGeometry(2,2,6.2),w);b.position.y=1.4;const sb=new T.Mesh(new T.BoxGeometry(2.04,.3,6.24),st);sb.position.y=.75;Sm.add(b,sb);return lodWrap(V,Sm,80)}
  const stops=BSTOP.map(([dir,z,sx,wx])=>({dir,z,sx,wx,q:[],t:2+Math.random()*4}));
  {const L=Z1-Z0;[1,-1].forEach(dir=>[0,1,2].forEach(j=>{const v=cityBus([0x1fa463,0x2f6fd0,0x1fa463][j]),z=Z0+((j*13+(dir>0?.5:1))*(L/TN))%L;v.rotation.y=dir>0?0:Math.PI;v.position.set(dir,0,z);v.userData.lane=1;
    traffic.push({v,dir,z,sp:6,cb:1,st:stops.find(o=>o.dir===dir)})}))}
  const ppl=()=>{const r=Math.random();return person(r<.5?'man':r<.85?'woman':'kid',Math.floor(Math.random()*12))};
  function busArrive(c){const st=c.st,dx=st.dir*2.05;
    const n=Math.floor(Math.random()*4);for(let i=0;i<n;i++)setTimeout(()=>{const p=ppl();if(p.userData.bag)p.userData.bag.visible=false;p.userData.bs=p.scale.x;p.scale.setScalar(.01);
        const away=st.z+(Math.random()<.5?-1:1)*(16+Math.random()*14),o=(Math.random()-.5)*.5;walk(p,[[dx,st.z+.3],[st.sx,st.z+.3+o],[st.sx,away]],1.3+Math.random()*.3,'gone');walkers[walkers.length-1].grow=0},400+i*750);
    st.q.forEach((w,i)=>setTimeout(()=>{w.pts=[[st.sx,st.z+.3],[dx,st.z+.3]];w.end='enter';w.sp=1.5},900+i*650));st.q=[]}

  // مشاة (طلاب ينزلون/يصعدون، ومصلّون)
  let walkers=[];
  function walk(P,pts,sp,end){P.position.set(pts[0][0],0,pts[0][1]);walkers.push({P,pts:pts.slice(1),sp,end,k:0})}
  function dropKids(stopZ,leave){for(let i=0;i<3;i++){const p=person('kid',Math.floor(Math.random()*12));const a=[-1.9,stopZ+(i-1)*.7],b=[-2.6,-17.6],c=[-4.6,-17.4];
    p.visible=false;setTimeout(()=>{p.visible=true;walk(p,leave?[c,b,a]:[a,b,c],1.6,'gone')},i*450)}}
  // (v13.9) طرق الطلاب: كلها تعبر الشارع من ممرّ المشاة (z=±4.95) مع وقفة «انظر يمينًا ويسارًا» عند الرصيف
  const CROSS=[
    {pts:[[-2.4,-17.6],[-2.6,-6],[-2.6,-4.95,1.6],[2.8,-4.95],[3.3,-6],[3.3,-70]],end:'gone',grow:1},
    {pts:[[2.6,10],[2.8,9.2],[2.8,4.95,1.6],[-2.6,4.95],[-2.6,60]],end:'gone',grow:1},
    {pts:[[3.3,-70],[3.3,-6],[2.8,-4.95,1.6],[-2.6,-4.95],[-2.6,-16],[-2.4,-17.6]],end:'enter'},
    {pts:[[-2.6,60],[-2.6,6],[-2.6,4.95,1.6],[2.8,4.95],[2.8,9.2],[2.6,10]],end:'enter'}];
  let crT=4,crI=0;
  function crossers(r){const n=2+Math.floor(Math.random()*2);for(let i=0;i<n;i++){const p=person('kid',Math.floor(Math.random()*12));p.userData.bs=p.scale.x;p.visible=false;
    const off=(i-(n-1)/2)*.3,pts=r.pts.map(q=>{const dx=Math.abs(q[0])<4?0:off;return [q[0]+(Math.abs(q[0])<4&&Math.abs(Math.abs(q[1])-4.95)<.1?0:0)+dx,q[1]+(Math.abs(Math.abs(q[1])-4.95)<.1?off:0),q[2]]});
    setTimeout(()=>{p.visible=true;if(r.grow)p.scale.setScalar(.01);walk(p,pts,1.5,r.end);const w=walkers[walkers.length-1];w.cross=1;if(r.grow)w.grow=0},i*650)}}
  // (v14.0) طلب الشيخ: المصلّون لا يمشون في وسط الشارع. يمشون على الأرصفة (x=±2.7)، وإذا جاؤوا من يسار الطريق الرئيسي
  // يقفون عند ممرّ المشاة (z=4.95) وينظرون يمينًا ويسارًا ثم يعبرون، والسيارات تقف لهم، ثم يمشون على رصيف الجامع إلى بابه.
  const PR=[[[2.8,30]],[[2.8,-30]],[[14,4.1]],[[-14,5.1],[-2.6,5.1]],[[-14,-5.1],[-2.6,-5.1]],[[-2.6,30]],[[-2.6,-30]]];let prT=0,prN=0;
  // (v14.3) يوم الجمعة: يأتي ناس كثيرون، كثير منهم من القرى القريبة (VIL) عبر الدرب الترابي ثم الرصيف، وبعد الصلاة يرجعون إلى قراهم
  const VR=VIL.map(([x,z])=>x<0?[[x+8,z],[-2.6,z]]:[[x-8,z],[2.8,z]]);
  function worshipper(jum,back){const far=jum&&Math.random()<.6,r=far?VR[Math.floor(Math.random()*VR.length)]:PR[Math.floor(Math.random()*PR.length)],
      p=person(Math.random()<.65?'man':'woman',Math.floor(Math.random()*9)),o=(Math.random()-.5)*.3;
    let pts=r.map(q=>[q[0]+(Math.abs(q[0])<3?o:0),q[1]]);const left=pts[pts.length-1][0]<0;
    if(left)pts.push([-2.6+o,4.95,1.4],[2.8+o,4.95]);if(pts[pts.length-1][0]<5)pts.push([2.8+o,4.1]);pts.push([6+(Math.random()-.5)*.8,4.1],[6,3.75]);
    if(back){pts=pts.map(q=>[q[0],q[1]]).reverse();if(left){const k=pts.findIndex(q=>q[0]>2&&Math.abs(q[1]-4.95)<.01);if(k>=0)pts[k][2]=1.4}
      p.userData.bs=p.scale.x;p.scale.setScalar(.01)}
    walk(p,pts,1.4+Math.random()*.4,back?'gone':'enter');const w=walkers[walkers.length-1];w.wor=1;if(left)w.cross=1;if(back)w.grow=0;prN++}
  // (v14.5) 👨‍👩‍👦 والدا الطفل عند باب البيت (بالنهار): الأمّ تحمل أكياسًا، والأب يستقبله
  const father=person('man',2),mother=person('woman',5);father.position.set(-3.15,0,-.35);mother.position.set(-3.15,0,2.35);[father,mother].forEach(P=>{P.rotation.y=Math.PI/2;P.userData.act='parents'});
  mother.userData.bags=[-1,1].map(k=>add(new T.BoxGeometry(.24,.28,.14),M(k<0?0xe9e2cf:0xd6e8f5),k*.36,.5,0,mother));
  // ⚽ (v16.4) مباراة حقيقية: فريق أحمر وفريق أزرق بحارسين (حارس أصفر وحارس أخضر). في العطل ٥ ضد ٥ ومتفرّجون، وفي الأيام العادية ٣ ضد ٣.
  // اللاعب يراوغ بالكرة أمام قدميه، يمرّر لزميل متقدّم، يسدّد قرب المرمى، والحارس يصدّ أحيانًا؛ المنافس يلاحق ويخطف الكرة؛
  // رمية تماس وضربة مرمى، والهدف: احتفال وصافرة ولوحة نتيجة، ثم ضربة بداية من الوسط
  let life_fb=null;const FW=3.1,FL=4.5,TC=[0xd63b3b,0x2f6fd0],KC=[0xffc53a,0x3fbf6a],FBK=[];
  const FORM={5:[[0,-4.1],[-1.5,-2.5],[1.5,-2.5],[-.9,-.4],[1,.7]],3:[[0,-4.1],[-1.2,-1.9],[1.1,-.1]]};
  for(let i=0;i<10;i++){const tm=i<5?0:1,k=i%5,p=person('kid',i*3+1);if(p.userData.bag)p.userData.bag.visible=false;p.userData.act='football';
    try{p.children[0].material.color.setHex(k?TC[tm]:KC[tm])}catch(e){}p.userData.fb={tm,k,v:0,st:0};p.visible=false;FBK.push(p)}
  const FAN=['man','woman','kid','kid'].map((k,i)=>{const p=person(k,i+7);if(p.userData.bag)p.userData.bag.visible=false;p.position.set(FB[0]+FW+.9,0,FB[1]-1.8+i*1.2);p.rotation.y=-Math.PI/2;p.visible=false;return p});
  const ball=new T.Mesh(new T.SphereGeometry(.15,14,10),new T.MeshStandardMaterial({color:0xffffff,roughness:.5}));[[0,.15,0],[0,-.15,0],[.15,0,0],[-.15,0,0],[0,0,.15],[0,0,-.15]].forEach(q=>{const d=new T.Mesh(new T.SphereGeometry(.05,6,4),M(0x222222));d.position.set(...q);ball.add(d)});
  ball.position.set(FB[0],.15,FB[1]);ball.userData.act='football';g.add(ball);
  // لوحة النتيجة خلف المرمى
  const sbc=document.createElement('canvas');sbc.width=256;sbc.height=96;const sbx=sbc.getContext('2d'),sbt=new T.CanvasTexture(sbc);
  const SB=new T.Group();SB.position.set(FB[0],0,FB[1]-FL-1.1);g.add(SB);[-1,1].forEach(k=>{const p=new T.Mesh(new T.CylinderGeometry(.05,.05,1.9,6),M(0x555555));p.position.set(k*.9,.95,0);SB.add(p)});
  const sbm=new T.Mesh(new T.PlaneGeometry(2,.75),new T.MeshBasicMaterial({map:sbt}));sbm.position.y=1.75;SB.add(sbm);SB.visible=false;
  const FG={sc:[0,0],own:-1,last:0,st:'kick',tt:1.2,b:[0,0,.15],v:[0,0,0],dec:1,save:0,fall:-1,n:3,hold:0};
  function sbDraw(){sbx.fillStyle='#1d2430';sbx.fillRect(0,0,256,96);sbx.strokeStyle='#ffc53a';sbx.lineWidth=5;sbx.strokeRect(3,3,250,90);sbx.font='900 52px system-ui';sbx.textAlign='center';sbx.textBaseline='middle';
    sbx.fillStyle='#ff6b6b';sbx.fillText(String(FG.sc[0]),70,52);sbx.fillStyle='#fff';sbx.fillText('-',128,50);sbx.fillStyle='#6fa8ff';sbx.fillText(String(FG.sc[1]),186,52);
    sbx.fillStyle='#d63b3b';sbx.fillRect(14,14,20,20);sbx.fillStyle='#2f6fd0';sbx.fillRect(222,14,20,20);sbt.needsUpdate=true}sbDraw();
  const whistle=n=>{try{if(sndOn()&&typeof tone=='function')for(let i=0;i<n;i++)tone(2300,.16,'square',.025,i*.22)}catch(e){}};
  // 🔥 الجارة عند التنّور
  const baker=person('woman',6);baker.position.set(11.1,0,25.5);baker.rotation.y=-Math.PI*.7;baker.userData.act='tannour';
  let lastCycle=-1;
  function football(t,dt){const n=footHol()?5:3,F=FORM[n];if(FG.n!==n){FG.n=n;FG.own=-1;FG.st='kick';FG.tt=1}
    const act=FBK.filter(p=>p.userData.fb.k<n),L=p=>[p.position.x-FB[0],p.position.z-FB[1]],gz=tm=>tm?-FL:FL,dz=tm=>tm?-1:1,B=FG.b,V=FG.v;
    FBK.forEach(p=>{const on=p.userData.fb.k<n;if(on&&!p.visible){const u=p.userData.fb,f=F[u.k],s=u.tm?-1:1;p.position.set(FB[0]+f[0]*s,0,FB[1]+f[1]*s);p.rotation.set(0,u.tm?Math.PI:0,0)}p.visible=on});
    const mv=(p,x,z,sp)=>{x=Math.max(-FW+.15,Math.min(FW-.15,x));z=Math.max(-FL-.1,Math.min(FL+.1,z));return glide(p,p.userData.fb,FB[0]+x,FB[1]+z,sp,dt,t)};
    const kick=(tx,tz,spd,lift)=>{const dx=tx-B[0],dz2=tz-B[1],d=Math.hypot(dx,dz2)||1;V[0]=dx/d*spd;V[1]=dz2/d*spd;V[2]=lift;FG.own=-1;FG.cool=.35};
    const near=(tm,x,z,ex)=>{let bi=null,bd=1e9;act.forEach(p=>{const u=p.userData.fb;if(u.tm!==tm||p===ex||u.k===0&&tm!==null&&ex!=='gk')return;const [px,pz]=L(p),d=Math.hypot(px-x,pz-z);if(d<bd){bd=d;bi=p}});return [bi,bd]};
    if(FG.fall>=0){const P=FBK[FG.fall];P.rotation.z=1.45;P.position.y=.18;act.forEach(p=>{if(p!==P){const [px,pz]=L(p);mv(p,px*.98,pz*.98,.6)}});return}
    // الهدف: احتفال ثم ضربة بداية
    if(FG.st==='goal'){FG.tt-=dt;act.forEach(p=>{const u=p.userData.fb,[px,pz]=L(p);if(u.tm===FG.last&&u.k){mv(p,px+(B[0]-px)*.02,pz+(B[1]-pz)*.02,1.2);p.position.y=Math.abs(Math.sin(t*7+u.k))*.35}else{const f=F[u.k],s=u.tm?-1:1;mv(p,f[0]*s,f[1]*s,1.3)}});
      ball.position.set(FB[0]+B[0],.15,FB[1]+B[1]);if(FG.tt<=0){FG.st='kick';FG.tt=1.4;B[0]=0;B[1]=0;B[2]=.15;V[0]=V[1]=V[2]=0}return}
    if(FG.st==='kick'){FG.tt-=dt;const kt=1-FG.last;act.forEach(p=>{const u=p.userData.fb,f=F[u.k],s=u.tm?-1:1;mv(p,u.tm===kt&&u.k===n-1?0:f[0]*s,u.tm===kt&&u.k===n-1?-.35*dz(kt):Math.min(-.6,f[1])*s,1.4)});
      ball.position.set(FB[0],.15,FB[1]);if(FG.tt<=0){whistle(1);FG.st='play';FG.own=FBK.indexOf(act.find(p=>p.userData.fb.tm===kt&&p.userData.fb.k===n-1));FG.dec=.5}return}
    // الكرة: مع لاعب أو حرّة (تتدحرج وتتباطأ، وترتفع وتسقط)
    if(FG.cool>0)FG.cool-=dt;
    if(FG.own>=0){const P=FBK[FG.own],u=P.userData.fb,[px,pz]=L(P),a=P.rotation.y;B[0]=px+Math.sin(a)*.34;B[1]=pz+Math.cos(a)*.34;B[2]=.15;V[0]=V[1]=V[2]=0;FG.last=u.tm;
      if(FG.hold>0){FG.hold-=dt;if(FG.hold<=0){const [mt]=near(u.tm,0,dz(u.tm)*-1,P);if(mt){const [mx,mz]=L(mt);kick(mx,mz,Math.hypot(mx-B[0],mz-B[1])*1.5+2,1.6)}}}
      else{FG.dec-=dt;const G2=gz(u.tm),dG=Math.abs(G2-pz);
        if(u.k===0){FG.dec=Math.min(FG.dec,.4)}
        if(FG.dec<=0){const [op,od]=near(1-u.tm,px,pz);
          if(u.k&&dG<2.9&&od>.7&&Math.random()<.45){const ax=(Math.random()-.5)*3;FG.save=Math.random()<.68;kick(ax,G2+dz(u.tm)*.6,7+Math.random()*1.5,.6+Math.random()*1.8)}
          else if(od<1.2||Math.random()<.5||u.k===0){let best=null,bs=-1e9;act.forEach(m=>{const mu=m.userData.fb;if(mu.tm!==u.tm||m===P||mu.k===0)return;const [mx,mz]=L(m),[,mo]=near(1-u.tm,mx,mz),sc2=mz*dz(u.tm)+Math.min(mo,2)*1.2-Math.hypot(mx-px,mz-pz)*.15;if(sc2>bs){bs=sc2;best=m}});
            if(best){const [mx,mz]=L(best),ld=Math.hypot(mx-B[0],mz-B[1]);kick(mx+Math.sin(best.rotation.y)*.4,mz+Math.cos(best.rotation.y)*.4,ld*1.55+1.8,ld>3?2.4:.25)}}
          FG.dec=.7+Math.random()*1.2}
        if(FG.own>=0)mv(P,Math.max(-2.4,Math.min(2.4,px*.5+Math.sin(t*.8+u.k)*1.3)),G2-dz(u.tm)*.9,2.05)}}
    else{B[0]+=V[0]*dt;B[1]+=V[1]*dt;V[2]-=9.8*dt;B[2]+=V[2]*dt;if(B[2]<.15){B[2]=.15;V[2]=Math.abs(V[2])>1.2?-V[2]*.45:0}const fr=Math.max(0,1-(B[2]>.2?.2:1.3)*dt);V[0]*=fr;V[1]*=fr;
      ball.rotation.x+=V[1]*dt*5;ball.rotation.z-=V[0]*dt*5;
      if(Math.abs(B[1])>FL){const side=B[1]>0?1:0;if(Math.abs(B[0])<.95&&B[2]<1.05){FG.sc[1-side]++;FG.last=1-side;sbDraw();whistle(2);FG.st='goal';FG.tt=3.2;
          const sc=act.find(p=>p.userData.fb.tm===FG.last&&p.userData.fb.k===n-1);if(sc)say(sc,'⚽ هدف!',2.4,1.8);FAN.forEach((p,i)=>{if(p.visible&&i<2)say(p,'👏👏',2,2.2)});B[1]=Math.sign(B[1])*(FL+.3);V[0]=V[1]=V[2]=0;return}
        const gk=act.find(p=>p.userData.fb.tm===(B[1]>0?1:0)&&p.userData.fb.k===0);B[1]=Math.sign(B[1])*(FL-.5);B[0]=0;V[0]=V[1]=V[2]=0;if(gk){FG.own=FBK.indexOf(gk);FG.hold=.9}}
      else if(Math.abs(B[0])>FW){B[0]=Math.sign(B[0])*(FW-.1);V[0]=V[1]=V[2]=0;const [tk]=near(1-FG.last,B[0],B[1]);if(tk){FG.own=FBK.indexOf(tk);FG.hold=.8;tk.position.x=FB[0]+B[0];tk.position.z=FB[1]+B[1]}}}
    ball.position.set(FB[0]+B[0],B[2],FB[1]+B[1]);
    // اللاعبون: الأقرب من كل فريق يلاحق الكرة، والحارس يتحرّك على خطّه ويصدّ، والباقون يأخذون مواقعهم مع حركة اللعب
    const free=FG.own<0,ow=FG.own>=0?FBK[FG.own]:null,owT=ow?ow.userData.fb.tm:-1,chs=[0,1].map(tm=>near(tm,B[0]+V[0]*.25,B[1]+V[1]*.25)[0]);
    act.forEach(p=>{const u=p.userData.fb,[px,pz]=L(p),s=u.tm?-1:1;if(p===ow)return;
      if(u.k===0){const gl=-gz(u.tm)+dz(u.tm)*.35,tx=Math.max(-.85,Math.min(.85,B[0]*.45));mv(p,tx,gl,1.9);
        if(free&&FG.cool<=0&&Math.hypot(px-B[0],pz-B[1])<.75&&B[2]<1.2&&(Math.abs(B[1]+gz(u.tm))<1.6)&&(FG.save||Math.hypot(V[0],V[1])<4)){FG.own=FBK.indexOf(p);FG.hold=1;FG.save=0;say(p,'🧤',1.2,1.8)}return}
      if(p===chs[u.tm]&&(free||owT!==u.tm)){mv(p,B[0],B[1],2.15);const d=Math.hypot(px-B[0],pz-B[1]);
        if(free&&FG.cool<=0&&d<.4&&B[2]<.6){FG.own=FBK.indexOf(p);FG.dec=.4+Math.random()*.6}
        else if(ow&&d<.45&&Math.random()<dt*2){FG.own=FBK.indexOf(p);FG.dec=.6;FG.cool=.4}return}
      const f=F[u.k],atk=owT===u.tm?.9:owT>=0?-.5:0;mv(p,f[0]*s+B[0]*.25,Math.max(-FL+.6,Math.min(FL-.6,f[1]*s+B[1]*.55+atk*s)),1.5)})}
  life_fb={fall(){const c=FBK.filter(p=>p.visible&&p.userData.fb.k);if(!c.length)return;const P=c[Math.floor(Math.random()*c.length)];FG.fall=FBK.indexOf(P);FG.own=-1},
    up(){if(FG.fall<0)return;const P=FBK[FG.fall];P.rotation.z=0;P.position.y=0;FG.fall=-1;say(P,'شكرًا 🤍',2,1.8)}};
  function update(t,dt,o){const h=hourNow(),day=!night;
    // الساحة والحارس
    Object.values(sellers).forEach((P,i)=>{P.visible=day&&!o.sleep;P.rotation.y=-Math.PI/2+Math.sin(t*.3+i*2)*.12;P.userData.hyT=Math.sin(t*.45+i*2)*.6;P.position.y=Math.abs(Math.sin(t*.9+i))*.02});
    // (v14.3) طلب الشيخ: الطلاب في ساحة المدرسة فقط وقت الدوام (٨ صباحًا – ١٢:٤٥ ظهرًا) من الأحد إلى الخميس؛ الجمعة والسبت المدرسة فارغة
    const dawam=day&&wDay()<5&&h>=7.75&&h<12.75,road=day&&wDay()<5&&h>=7.4&&h<13.2;
    // (v16.1) الطلاب لا يختفون فجأة: كل طالب يدخل من بوابة الساحة صباحًا (واحدًا بعد واحد) ويخرج منها قبل الانصراف
    yard.forEach((p,i)=>{const u=p.userData,inW=dawam&&h>=7.75+i*.03&&h<12.25+i*.05,GT=[-4.7,-17.6];
      if(!u.ini){u.ini=1;if(!inW)p.visible=false;else setOp(p,1);u.fi=inW?1:0}
      if(inW&&!p.visible){p.position.set(GT[0],0,GT[1]);[u.tx,u.tz]=nearPt(GT[0]-1.5,GT[1],YX[0],YX[1],YZ[0],YZ[1],1.5);u.w=0;u.lv=0;u.fi=0;u.v=0;setOp(p,.02)}
      if(!p.visible)return;if(u.fi<1){u.fi=Math.min(1,u.fi+dt*1.1);setOp(p,u.fi)}
      if(!inW){if(u.lv>0||glide(p,u,GT[0],GT[1],1.25,dt,t)){u.lv=(u.lv||0)+dt*1.1;setOp(p,1-u.lv);if(u.lv>=1){p.visible=false;u.lv=0;u.fi=0}}return}
      if(u.w>0){u.w-=dt;if(u.j>0){u.j-=dt;p.position.y=Math.abs(Math.sin(u.j*9))*.25}else p.position.y*=.8;
        if(u.w<=0){[u.tx,u.tz]=nearPt(p.position.x,p.position.z,YX[0],YX[1],YZ[0],YZ[1],2.6);if(Math.random()<.3)u.j=1}}
      else if(glide(p,u,u.tx,u.tz,1.25,dt,t))u.w=1+Math.random()*3});
    guard.visible=night;if(night){const z=-17+Math.sin(t*.15)*1.4;turn(guard,Math.cos(t*.15)>0?0:Math.PI,dt,3,2);guard.position.z=z;guard.position.y=Math.abs(Math.sin(t*3))*.03}
    // الباص والسيارات: صباحًا يجلبون الطلاب، وظهرًا يأخذونهم
    // (v13.5) يأتون من بعيد (z=150) ويذهبون بعيدًا (z=-150)؛ إذا انتهى الوقت أثناء الطريق يكملون حتى الأفق، ولا يظهرون فجأة في منتصف الطريق
    // (v14.1) طلب الشيخ: الباص يجلب الطلاب الساعة ٨ صباحًا، ويأخذهم الساعة ١٢ ظهرًا
    const fri=wDay()>=5,phase=fri?'':day&&h>=7.75&&h<8.5?'arrive':day&&h>=12&&h<12.75?'leave':'',rush=day&&rushNow();const P=110,away=c=>{if(c.v.visible){c.v.position.z-=12*dt;if(c.v.position.z<-580)c.v.visible=false}};
    cars.forEach(c=>{const cyc=Math.floor(((t/3)+c.off)/P);if(!phase){c.skip=cyc;away(c);return}if(c.skip===cyc){away(c);return}
      const ct=((t/3)+c.off)%P,sp=12,t1=(560-c.stop)/sp,t2=t1+5,t3=t2+(c.stop+560)/sp;
      c.v.position.x=-1;if(ct<t1){c.v.visible=true;c.v.position.z=560-ct*sp}else if(ct<t2){c.v.position.z=c.stop;
        const k=cyc+':'+c.stop;if(c.done!==k){c.done=k;dropKids(c.stop,phase==='leave')}}
      else if(ct<t3){c.v.position.z=c.stop-(ct-t2)*sp}else c.v.visible=false});
    // السيارات العادية: تقف خلف السيارة التي أمامها (ومنها الباص)، وتقف للطفل إذا عبر أمامها
    const K=o.kid,KCV={visible:true,userData:{lane:1}};traffic.forEach(c=>{let block=false;
      if(K&&Math.abs(K.x-c.dir)<1&&o.kidOn){const ah=(K.z-c.z)*c.dir;if(ah>0&&ah<3.2)block=true}
      // (v13.9) تقف للمشاة على ممرّ العبور أو الواقفين عند حافته (ومنهم الطفل إذا وقف ينظر يمينًا ويسارًا)
      const yz=(x,z,wait)=>{if(Math.abs(Math.abs(z)-4.8)>.8)return;if(!wait&&Math.abs(x-c.dir)>1.3)return;const ah=(z-c.z)*c.dir;if(wait?ah>1.5&&ah<7:ah>-.2&&ah<4)block=true};
      walkers.forEach(w=>{if(w.cross&&w.P.visible&&(Math.abs(w.P.position.x)<2.2||w.pause>0))yz(w.P.position.x,w.P.position.z,w.pause>0)});
      peds.forEach(P=>{const u=P.userData.u;if(P.visible&&(Math.abs(P.position.x)<2.2||u.look>0))yz(P.position.x,P.position.z,u.look>0)});
      if(K&&o.kidWait)yz(K.x,K.z,true);
      traffic.concat(c.dir<0?cars.filter(s=>s.v.visible).map(s=>({dir:-1,z:s.v.position.z,v:s.v})):[]).concat(o.kcar&&o.kcar.on?[{dir:o.kcar.dir,z:o.kcar.z,v:KCV}]:[]).forEach(d=>{if(d!==c&&d.dir===c.dir&&d.v.visible&&(d.v.userData.lane|0)===(c.v.userData.lane|0)){const gp=(d.z-c.z)*c.dir;if(gp>0&&gp<(c.cb?3:1.4)+(d.cb?3:d.v===cars[0].v?2.3:1.4)+.8)block=true}});
      // (v14.7) 🚌 باص المدينة يقف عند الموقف ٧ ثوانٍ (من ٦ صباحًا إلى ١١ ليلًا): ينزل ركّاب ويصعد المنتظرون
      if(c.cb){const sc=c.st.z-2.1*c.dir;if(c.hold>0){c.hold-=dt;block=true}else if(!c.done&&!block&&h>=6&&h<23&&!o.sleep){const ah=(sc-c.z)*c.dir;if(ah>=0&&ah<=c.sp*dt*1.6+.05){c.z=sc;c.hold=7;c.done=1;block=true;busArrive(c)}}}
      if(c.dir<0&&phase&&c.z>=Z1&&cars.some(s=>s.v.visible&&s.v.position.z>530))block=true; // لا تدخل سيارة فوق الباص لحظة ظهوره
      {const L=sig();if(L!=='g'&&!o.sleep)[-4.6,4.6].forEach(zc=>{const stop=zc-c.dir*1.35,front=c.z+c.dir*(c.cb?3:1.4),ah=(stop-front)*c.dir;if(ah>-.05&&ah<(L==='y'?2.2:3.2)&&!(L==='y'&&ah<.6))block=true})}
      if(!block)c.z+=c.dir*c.sp*(rush?.45:1)*dt;
      if(c.dir>0&&c.z>Z1||c.dir<0&&c.z<Z0){c.z=c.dir>0?Z0:Z1;c.done=0;if(c.ru){c.on=rush;c.v.visible=rush}}c.v.position.z=c.z});
    // (v14.5) الوالدان والجارة بالنهار، والأطفال يلعبون الكرة العصر
    [father,mother].forEach(P=>{P.visible=day&&!o.sleep});mother.userData.bags.forEach(b=>b.visible=!o.bagsDone);baker.visible=day&&!o.sleep;
    if(baker.visible)baker.rotation.x=Math.max(0,Math.sin(t*.9))*.25;
    {const play=day&&!o.sleep&&footNow();ball.visible=play;SB.visible=play;if(!play)FBK.forEach(p=>p.visible=false);FAN.forEach(p=>p.visible=play&&footHol());if(play)football(t,dt);}
    // (v14.7) 🚌 ناس يأتون إلى الموقف وينتظرون الباص (حتى ٤ في كل موقف)
    stops.forEach(st=>{st.t-=dt;if(st.t>0)return;st.t=6+Math.random()*8;if(h<6||h>=22.5||o.sleep||st.q.length>=4)return;
      const p=ppl();if(p.userData.bag)p.userData.bag.visible=false;const from=st.z+(Math.random()<.5?-1:1)*(18+Math.random()*12),i=st.q.length;
      walk(p,[[st.sx,from],[st.sx,st.z+(i-1.5)*.62],[st.wx,st.z+(i-1.5)*.62]],1.2+Math.random()*.3,'wait');st.q.push(walkers[walkers.length-1])});
    // الجيران على الأرصفة
    // (v15.1) الجيران: كل واحد في رحلة من مكان إلى مكان، يمشي بانسيابية (يبدأ ببطء ويقف بلطف، يلتفت تدريجيًا، يقطع الزوايا)
    peds.forEach((P,i)=>{const u=P.userData.u,on=u.shep?day&&!o.sleep:(day||i<2)&&!o.sleep;if(P.userData.umb)P.userData.umb.visible=!!o.rain;
      if(!on){if(P.visible&&(u.off=(u.off||0)+dt*1.2)<1){setOp(P,1-u.off);P.position.x+=Math.sin(P.rotation.y)*dt*.4*(1-u.off);P.position.z+=Math.cos(P.rotation.y)*dt*.4*(1-u.off);return}
        P.visible=false;u.off=0;if(u.bub)endGreet(i);u.hold=0;if(!u.shep&&u.trip>=0){u.trip=-1;u.gap=1+Math.random()*3}return}
      if(u.off){u.off=0;setOp(P,1)}
      if(!u.shep&&u.trip<0){P.visible=false;u.gap-=dt;if(u.gap<=0)newTrip(i,o);return}
      if(u.gr<1){u.gr=Math.min(1,u.gr+dt*.9);setOp(P,u.gr)}else if(!P.visible)setOp(P,1);
      if(u.hold>0){u.hold-=dt;u.v=0;if(K)turn(P,Math.atan2(K.x-P.position.x,K.z-P.position.z),dt,5);P.position.y=0;return}
      if(u.greet>0){u.greet-=dt;u.v=Math.max(0,u.v-dt*2);P.position.y=Math.abs(Math.sin(t*2))*.04;if(u.greet<=0)endGreet(i);if(u.v<=0)return}
      if(u.look>0){u.look-=dt;if(u.look<=0&&nearZeb(P.position.x,P.position.z)&&!pedGo())u.look=.25;u.v=Math.max(0,u.v-dt*3);const q=u.pts[0];if(q)turn(P,Math.atan2(q[0]-P.position.x,q[1]-P.position.z),dt,4);u.lph=(u.lph||0)+dt*2.3;P.userData.hyT=Math.sin(u.lph)*1;P.position.y=0;return}
      if(u.shep&&!u.pts.length){u.w-=dt;P.position.y=0;if(u.w<=0){u.pts=[[FLK[0]+(Math.random()-.5)*7,FLK[1]+(Math.random()-.5)*7]];u.w=2+Math.random()*4}return}
      if(!u.pts.length){ // وصل: يدخل الباب ويغيب، أو يبتعد في آخر الشارع
        u.fade+=dt*.9;const dr=dt*.45*(1-u.fade);P.position.x+=Math.sin(P.rotation.y)*dr;P.position.z+=Math.cos(P.rotation.y)*dr;setOp(P,1-u.fade);P.position.y=0;if(u.fade>=1){P.visible=false;if(u.bub)endGreet(i);u.trip=-1;u.gap=2+Math.random()*6}return}
      const q=u.pts[0],dx=q[0]-P.position.x,dz=q[1]-P.position.z,d=Math.hypot(dx,dz),last=u.pts.length===1;
      const want=u.sp*(last&&u.out?Math.min(1,.35+d/1.6):1);u.v+=(want-u.v)*Math.min(1,dt*1.8);const st=u.v*dt*(d>1e-4?spF(P.position.x,dx/d,dz/d):1);
      u.stk=d<.7?(u.stk||0)+dt:0;
      if(d<=Math.max(st,last||q[2]?(u.stk>1.5?.32:0):.45)){u.stk=0;if(last||q[2]){P.position.x=q[0];P.position.z=q[1]}u.pts.shift();if(q[2])u.look=q[2]}
      else{const df=turn(P,Math.atan2(dx,dz),dt),k=tf(df);P.position.x+=dx/d*st*k;P.position.z+=dz/d*st*k;if(df>.5)u.v*=1-Math.min(1,dt*2)}
      if(!u.shep&&!last&&!q[2]&&Math.random()<dt*.012)u.look=.9+Math.random()*.8; // أحيانًا يقف لحظة ويتلفّت
      P.position.y=Math.abs(Math.sin(t*6.5+i))*.035*Math.min(1,u.v)});
    gT-=dt;if(gT<=0){gT=240+Math.random()*120;if(!quiet&&!peds.some(P=>P.userData.u.greet>0||P.userData.u.hold>0)){const c=peds.filter(P=>{const u=P.userData.u;return P.visible&&u.gr>=1&&!u.fade&&u.pts.length>(u.shep?-1:1)&&Math.hypot(P.position.x,P.position.z)<30});
      if(c.length){const P=c[Math.floor(Math.random()*c.length)],u=P.userData.u;u.greet=16;u.bub=say(P,'السلام عليكم'+yaN()+' 👋',1e9,u.h)}}}
    bubs.slice().forEach(b=>{b.k-=dt;b.s.position.set(b.o.position.x,b.o.position.y+b.h,b.o.position.z);if(b.k<=0)unsay(b)});
    // المصلّون وقت الصلاة (إذا بُني الجامع)
    const jum=day&&jumuaNow();
    if(jum&&o.mosque){prT-=dt;if(prT<=0&&walkers.filter(w=>w.wor).length<36){prT=.6+Math.random()*.7;worshipper(1,jum==='go')}}
    else if(o.prayer&&o.mosque){prT-=dt;if(prT<=0&&prN<14){prT=2.2+Math.random()*2;worshipper()}}else{prN=0}
    // حركة المشاة
    // (v13.9) 🚸 طلاب يعبرون من ممرّ المشاة بالنهار: يقفون عند الرصيف، ينظرون يمينًا ويسارًا، ثم يعبرون والسيارات تقف لهم
    if(road&&!o.sleep){crT-=dt;if(crT<=0){crT=(phase?8:16)+Math.random()*8;crossers(CROSS[crI++%CROSS.length])}}
    parkTick(t,dt,o,h);
    walkers=walkers.filter(w=>{const P=w.P;if(w.grow!=null&&w.grow<1){w.grow=Math.min(1,w.grow+dt*1.1);P.scale.setScalar(P.userData.bs);setOp(P,Math.max(.02,w.grow))}
      if(!w.pts.length){if(w.end==='enter'||w.end==='gone'){w.k+=dt*1.1;const dr=dt*.5*(1-w.k);P.position.x+=Math.sin(P.rotation.y)*dr;P.position.z+=Math.cos(P.rotation.y)*dr;setOp(P,1-w.k);if(w.k>1){g.remove(P);P.traverse(x=>{x.geometry&&x.geometry.dispose();x.material&&x.material.dispose()});return false}}return true}
      if(w.pause>0||w.sigW){w.pause-=dt;if(w.pause<=0){w.sigW=nearZeb(P.position.x,P.position.z)&&!pedGo();if(w.sigW)w.pause=.25}const [nx,nz]=w.pts[0];turn(P,Math.atan2(nx-P.position.x,nz-P.position.z),dt,4);w.lph=(w.lph||0)+dt*2.3;P.userData.hyT=Math.sin(w.lph);P.position.y=0;return true}
      const [tx,tz,wt]=w.pts[0],dx=tx-P.position.x,dz=tz-P.position.z,d=Math.hypot(dx,dz);w.v=(w.v||0)+(w.sp-(w.v||0))*Math.min(1,dt*2.2);const sp=w.v*dt*(d>1e-4?spF(P.position.x,dx/d,dz/d):1),cut=w.pts.length>1&&!wt?.4:0;
      // (v16.7) لا يعلق أحد: إذا تزاحم اثنان على نفس النقطة (مثلًا باب الباص) ودفع كلٌّ منهما الآخر، تُعدّ النقطة وصولًا
      w.stk=d<.7?(w.stk||0)+dt:0;const tol=w.stk>1.5||(w.pts.length===1&&(w.end==='enter'||w.end==='gone'))?.32:0;
      if(d<=Math.max(sp,cut,tol)){w.stk=0;if(!cut){P.position.x=tx;P.position.z=tz}w.pts.shift();if(wt)w.pause=wt}else{const df=turn(P,Math.atan2(dx,dz),dt,7),k=tf(df);P.position.x+=dx/d*sp*k;P.position.z+=dz/d*sp*k;if(df>.5)w.v*=1-Math.min(1,dt*2)}
      P.position.y=Math.abs(Math.sin(t*6+P.id))*.05*Math.min(1,(w.v||0)/Math.max(.1,w.sp));return true});try{separate(o)}catch(e){}swing(dt)}
  // (v16.1) طلب الشيخ: الناس كانوا يدخلون في بعض. الآن لكل شخص مساحة: إذا اقترب اثنان يتنحّى كلٌّ منهما قليلًا (ويميل لليمين)
  // فيمرّان بجانب بعض كما في الواقع. الواقفون (الباعة، الأب والأم، الحارس…) لا يتحرّكون، والآخرون يلتفّون حولهم. والطفل كذلك
  function separate(o){const L=[],add=(P,mv,ox,oz)=>L.push({P,mv,ox:ox||0,oz:oz||0,r:.27*(P.userData.bs||P.scale.x)});
    walkers.forEach(w=>{if(w.P.visible&&!(w.k>0)&&!(w.end==='enter'&&w.pts.length<=1))add(w.P,w.pause>0?.5:1)});
    peds.forEach(P=>{const u=P.userData.u;if(P.visible&&!u.fade&&!u.off)add(P,u.hold>0||u.greet>0?0:1)});
    yard.forEach(p=>{if(p.visible&&!(p.userData.lv>0))add(p,1)});FBK.forEach(p=>{if(p.visible&&!p.rotation.z)add(p,.6)});wand.forEach(P=>{if(P.visible)add(P,1,PKC[0],PKC[1])});
    [father,mother,elder,baker,guard,faller,sheikh,police,lostKid,lostMom].concat(Object.values(sellers)).forEach(P=>{if(P&&P.visible&&P.parent===g)add(P,0)});
    if(o.kid&&o.kidOn)L.push({K:o.kid,mv:0,ox:0,oz:0,r:.24});const n=L.length,X=i=>L[i].K?L[i].K.x:L[i].P.position.x+L[i].ox,Z=i=>L[i].K?L[i].K.z:L[i].P.position.z+L[i].oz;
    for(let i=0;i<n;i++){const a=L[i],ax=X(i),az=Z(i);for(let j=i+1;j<n;j++){const b=L[j];if(!a.mv&&!b.mv)continue;let dx=X(j)-ax,dz=Z(j)-az;const md=a.r+b.r+.08;
      if(Math.abs(dx)>md||Math.abs(dz)>md)continue;let d=Math.hypot(dx,dz);if(d>=md)continue;if(d<1e-3){dx=Math.random()-.5;dz=Math.random()-.5;d=Math.hypot(dx,dz)}
      const ux=dx/d,uz=dz/d,ov=(md-d),k=Math.min(1,ov),sx=(ux+uz*.45)*k,sz=(uz-ux*.45)*k,wa=a.mv/(a.mv+b.mv),wb=b.mv/(a.mv+b.mv),f=.35;
      if(a.P){a.P.position.x-=sx*wa*f;a.P.position.z-=sz*wa*f}if(b.P){b.P.position.x+=sx*wb*f;b.P.position.z+=sz*wb*f}}}}
  // ================= (v15.4) 🎡 مدينة الألعاب =================
  // دولاب هواء كبير، دوّامة بخيول، زحليقة، ميزان (سيسو)، كشك غزل البنات، أعلام ملوّنة وبالونات عند البوابة.
  // يوم الفتح: الألعاب تدور والأطفال يركبون ويلعبون، وعائلات تأتي من الطريق والقرية وتدخل، وأخرى تخرج. غير ذلك: متوقفة ولوحة «مغلقة».
  const PKG=new T.Group();PKG.position.set(PKC[0],0,PKC[1]);PKG.userData.act='park';g.add(PKG);
  const pkM=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.6},o||{})),bx=(w,h,d,m,x,y,z,p)=>add(new T.BoxGeometry(w,h,d),m,x,y,z,p||PKG);
  const PC=[0xff5c8a,0xffd23f,0x4fc3ff,0x7be37b,0xb07cff,0xff8c42];
  {const gr=new T.Mesh(new T.PlaneGeometry(15,14),pkM(night?0x8a7f9c:0xf3e3c8,{roughness:1,polygonOffset:true,polygonOffsetFactor:-2}));gr.rotation.x=-Math.PI/2;gr.position.y=.05;gr.receiveShadow=true;PKG.add(gr);
    [[3.5,3.5,1.6],[-1,4.2,1.4]].forEach(([x,z,r])=>{const c=new T.Mesh(new T.CircleGeometry(r,24),pkM(0x6fcf8a,{polygonOffset:true,polygonOffsetFactor:-3}));c.rotation.x=-Math.PI/2;c.position.set(x,.06,z);PKG.add(c)});
    // السياج: أعمدة ملوّنة وقضبان، والبوابة على جهة الطريق (+x)
    const rail=pkM(0xffffff);for(let i=0;i<=20;i++){const u=i/20,pts=[[-7.5+15*u,-7],[-7.5+15*u,7],[-7.5,-7+14*u],[7.5,-7+14*u]];pts.forEach(([x,z],k)=>{if(k===3&&Math.abs(z)<2)return;bx(.12,.8,.12,pkM(PC[(i+k)%6]),x,.4,z)})}
    [[0,-7,15,0],[0,7,15,0],[-7.5,0,0,14]].forEach(([x,z,w,d])=>{bx(w||.06,.06,d||.06,rail,x,.72,z);bx(w||.06,.06,d||.06,rail,x,.35,z)});
    [-1,1].forEach(k=>{bx(.06,.06,5,rail,7.5,.72,k*4.5);bx(.06,.06,5,rail,7.5,.35,k*4.5)});
    // البوابة
    [-1,1].forEach(k=>{for(let j=0;j<6;j++)add(new T.CylinderGeometry(.22,.22,.55,12),pkM(j%2?0xffffff:0xff5c8a),7.5,.28+j*.55,k*2,PKG);add(new T.SphereGeometry(.3,12,10),pkM(0xffd23f,{metalness:.4}),7.5,3.55,k*2,PKG)});
    const ar=new T.Mesh(new T.TorusGeometry(2,.16,8,30,Math.PI),pkM(0x4fc3ff));ar.position.set(7.5,3.1,0);ar.rotation.y=Math.PI/2;PKG.add(ar);
    
    // بالونات عند البوابة
    const bal=[];[-1,1].forEach(k=>{for(let j=0;j<4;j++){const b=add(new T.SphereGeometry(.26,12,10),pkM(PC[(j+(k>0?2:0))%6],{roughness:.3}),7.9,4.2+j%2*.4,k*(2.4+j*.25),PKG);b.scale.y=1.2;bal.push(b);
      add(new T.CylinderGeometry(.008,.008,1,3),pkM(0xffffff),7.9,3.7,k*(2.2+j*.12),PKG)}});
    PKG.userData.bal=bal;
    // أعمدة الأعلام عند الزوايا وخيوط الرايات المثلثة
    const cor=[[-7.5,-7],[7.5,-7],[7.5,7],[-7.5,7]];cor.forEach(([x,z])=>bx(.12,3.6,.12,pkM(0xeeeeee),x,1.8,z));
    const tri=new T.ConeGeometry(.16,.32,3);for(let k=0;k<4;k++){const [a,b]=[cor[k],cor[(k+1)%4]],n=Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/.55);
      for(let i=1;i<n;i++){const u=i/n,y=3.5-Math.sin(u*Math.PI)*.6,f=add(tri,pkM(PC[i%6]),a[0]+(b[0]-a[0])*u,y,a[1]+(b[1]-a[1])*u,PKG);f.rotation.x=Math.PI;f.castShadow=false}}
    // لوحة «مغلقة»
    const cl=textSprite(T,'🔒 مغلقة اليوم','rgba(255,255,255,.95)','#8a2b2b');cl.scale.set(2.2,.48,1);cl.position.set(8,1.6,0);PKG.add(cl);PKG.userData.closed=cl}
  // 🎡 دولاب الهواء (وجهه نحو الطريق): يدور ببطء، والمقصورات تبقى معتدلة
  const WH=new T.Group(),WR=new T.Group(),cabs=[];WH.position.set(-4.2,0,-2.4);PKG.add(WH);
  {const st=pkM(0xdfe6ee,{metalness:.4});[-1,1].forEach(k=>[-1,1].forEach(s2=>{const L=add(new T.CylinderGeometry(.09,.12,5.6,8),st,k*.55,2.65,s2*1.25,WH);L.rotation.x=-s2*.45}));
    bx(1.4,.15,3.4,pkM(0x9aa6b2),0,.08,0,WH);WR.position.set(0,5,0);WH.add(WR);add(new T.CylinderGeometry(.25,.25,1.3,12),st,0,0,0,WR).rotation.z=Math.PI/2;
    const R=3.7;[0,.35].forEach(x=>{const ri=new T.Mesh(new T.TorusGeometry(R,.07,6,48),pkM(0xff5c8a));ri.rotation.y=Math.PI/2;ri.position.x=x-.17;WR.add(ri)});
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,sp=bx(.05,R,.05,st,0,Math.sin(a)*R/2,Math.cos(a)*R/2,WR);sp.rotation.x=-a+Math.PI/2;
      const C=new T.Group();C.position.set(0,Math.sin(a)*R,Math.cos(a)*R);WR.add(C);const cb=new T.Group();cb.position.y=-.55;C.add(cb);
      bx(.85,.55,.8,pkM(PC[i%6]),0,0,0,cb);bx(.95,.1,.9,pkM(0xffffff),0,.45,0,cb);bx(.04,.4,.04,st,0,.15,0,C);cabs.push({C,cb})}
    if(night)for(let i=0;i<16;i++){const a=i/16*Math.PI*2;add(new T.SphereGeometry(.09,8,6),new T.MeshStandardMaterial({color:0xfff1b0,emissive:0xffd860,emissiveIntensity:1.8}),.2,Math.sin(a)*R,Math.cos(a)*R,WR)}}
  // 🎠 الدوّامة: ٦ خيول تصعد وتنزل، وسقف مخطّط
  const CR=new T.Group(),horses=[];CR.position.set(2.6,0,-3.4);PKG.add(CR);
  {add(new T.CylinderGeometry(2.5,2.6,.3,28),pkM(0xffffff),0,.15,0,CR);const top=new T.Group();top.position.y=.3;CR.add(top);CR.userData.top=top;
    add(new T.CylinderGeometry(2.4,2.4,.08,28),pkM(0xffd23f),0,.04,0,top);add(new T.CylinderGeometry(.18,.18,3,10),pkM(0xffd23f,{metalness:.5}),0,1.5,0,top);
    for(let i=0;i<8;i++)add(new T.ConeGeometry(2.8,1.3,6,1,false,i*Math.PI/4,Math.PI/4),pkM(i%2?0xffffff:0xe2504a),0,3.55,0,top);
    add(new T.CylinderGeometry(2.8,2.8,.3,32,1,true),pkM(0xffd23f),0,2.85,0,top);add(new T.SphereGeometry(.2,10,8),pkM(0xffd23f,{metalness:.5}),0,4.3,0,top);
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2,x=Math.cos(a)*1.75,z=Math.sin(a)*1.75;add(new T.CylinderGeometry(.03,.03,2.7,6),pkM(0xffd23f,{metalness:.6}),x,1.4,z,top);
      const H=new T.Group();H.position.set(x,.9,z);H.rotation.y=-a;top.add(H);const hc=pkM([0xffffff,0x8d6e63,0xffd0e0][i%3]);
      bx(.22,.28,.72,hc,0,0,0,H);bx(.18,.38,.18,hc,0,.25,.32,H);bx(.16,.14,.3,hc,0,.42,.45,H);bx(.08,.32,.08,hc,.07,-.26,.25,H);bx(.08,.32,.08,hc,-.07,-.26,-.25,H);bx(.24,.04,.2,pkM(0xe2504a),0,.16,0,H);horses.push(H)}
    if(night)for(let i=0;i<12;i++){const a=i/12*Math.PI*2;add(new T.SphereGeometry(.08,8,6),new T.MeshStandardMaterial({color:0xfff1b0,emissive:0xffd860,emissiveIntensity:1.8}),Math.cos(a)*2.82,2.72,Math.sin(a)*2.82,top)}}
  // 🛝 زحليقة، ⚖️ ميزان، 🍭 كشك غزل البنات، مقاعد
  {const SL=new T.Group();SL.position.set(3.4,0,3.6);SL.rotation.y=Math.PI/2;PKG.add(SL);bx(1.2,.12,1.2,pkM(0x4fc3ff),0,2,-1.2,SL);[-1,1].forEach(k=>[-1,1].forEach(s2=>bx(.08,2,.08,pkM(0xffd23f),k*.55,1,-1.2+s2*.55,SL)));
    for(let j=0;j<6;j++)bx(.9,.06,.08,pkM(0xffffff),0,.3+j*.32,-1.85,SL);const ch=bx(.9,.08,3,pkM(0xff8c42),0,1.05,.65,SL);ch.rotation.x=.62;[-1,1].forEach(k=>{const e=bx(.06,.22,3,pkM(0xff8c42),k*.45,1.15,.65,SL);e.rotation.x=.62});
    const SS=new T.Group();SS.position.set(-1,.45,4.2);PKG.add(SS);bx(.3,.45,.3,pkM(0x7be37b),0,-.22,0,SS);const pl=new T.Group();SS.add(pl);bx(3,.08,.32,pkM(0xb07cff),0,.05,0,pl);[-1,1].forEach(k=>bx(.06,.3,.3,pkM(0xffd23f),k*1.3,.22,0,pl));PKG.userData.saw=pl;
    const K=new T.Group();K.position.set(-5.4,0,4.4);PKG.add(K);bx(1.8,1.1,1.2,pkM(0xffffff),0,.55,0,K);for(let i=0;i<6;i++)bx(.32,.08,1.5,pkM(i%2?0xffffff:0xff5c8a),-.75+i*.3,1.95,.1,K);
    [-1,1].forEach(k=>bx(.06,.9,.06,pkM(0xdddddd),k*.85,1.5,.7,K));[[-.5,0xffb3d1],[0,0xb3e5ff],[.5,0xffb3d1]].forEach(([x,c])=>{add(new T.SphereGeometry(.18,10,8),pkM(c),x,1.35,.45,K);add(new T.CylinderGeometry(.02,.02,.3,4),pkM(0xffffff),x,1.1,.45,K)});
    
    [[1.2,6],[-3,6]].forEach(([x,z])=>{bx(1.4,.08,.4,pkM(0x8f6238),x,.45,z);[-.6,.6].forEach(o2=>bx(.06,.45,.35,pkM(0x444444),x+o2,.22,z))})}
  // الأطفال والأهل داخل مدينة الألعاب (يظهرون يوم الفتح فقط)
  const pkPeople=[],sit=P=>{const L=P.userData.legs;if(L)L.forEach(l=>l.rotation.x=-1.3)};
  horses.forEach((H,i)=>{if(i===4)return;const P=person('kid',i+2);H.add(P);P.position.set(0,.05,-.05);P.scale.setScalar(P.scale.x*.95);sit(P);pkPeople.push(P)});
  cabs.forEach(({cb},i)=>{if(i%2)return;const P=person('kid',i+5);cb.add(P);P.position.set(0,-.25,0);P.rotation.y=Math.PI/2;sit(P);pkPeople.push(P)});
  [-1,1].forEach(k=>{const P=person('kid',k>0?3:8);PKG.userData.saw.add(P);P.position.set(k*1.25,.05,0);P.rotation.y=k>0?-Math.PI/2:Math.PI/2;sit(P);pkPeople.push(P)});
  const slider=person('kid',6);PKG.add(slider);pkPeople.push(slider);
  let pkF=0;const PKW=[[.5,.2],[-1,1.6],[5.2,.6],[-5.5,.8],[1.6,5.4],[-3.2,5.8],[5.6,-6],[-.6,-6],[-6,-6],[4.6,3.2],[0,2.6],[-2.5,2.2]],wand=[];
  for(let i=0;i<6;i++){const P=person(i<4?'kid':i===4?'woman':'man',i+1);PKG.add(P);const q=PKW[i*2%PKW.length];P.position.set(q[0],0,q[1]);P.userData.pk={t:PKW[(i*5+3)%PKW.length],w:Math.random()*3};pkPeople.push(P);wand.push(P)}
  {const P=person('woman',4);PKG.add(P);P.position.set(-5.4,0,3.3);pkPeople.push(P)}{const P=person('man',3);PKG.add(P);P.position.set(1.2,0,5.6);P.rotation.y=Math.PI;sit(P);P.position.y=-.05;pkPeople.push(P)}
  const pkMk=markSprite(T,'🎡','#e2504a',1);pkMk.position.set(8.6,5.6,0);pkMk.visible=false;pkMk.userData.act='park';PKG.add(pkMk);if(!(window.City3D&&City3D.noMerge))mergeProps(PKG);
  let pkSp=0,pkA=0,pkT=3;
  function parkTick(t,dt,o,h){const op=parkOpen(),day0=!night;pkSp+=((op?1:0)-pkSp)*Math.min(1,dt*.8);pkA+=pkSp*dt;
    WR.rotation.x=pkA*.22;cabs.forEach(({C})=>C.rotation.x=-WR.rotation.x);CR.userData.top.rotation.y=pkA*.9;horses.forEach((H,i)=>H.position.y=.9+Math.sin(pkA*3+i*1.3)*.22*pkSp);
    PKG.userData.saw.rotation.z=Math.sin(pkA*1.8)*.28*pkSp;PKG.userData.bal.forEach((b,i)=>b.position.y=4.2+(i%2)*.4+Math.sin(t*1.5+i)*.08);
    PKG.userData.closed.visible=!op;pkMk.visible=op&&!o.v&&!o.pkDone;pkMk.position.y=5.6+Math.sin(t*2)*.12;
    pkF+=((op?1:0)-pkF)*Math.min(1,dt*1.3);if(Math.abs(pkF-(op?1:0))<.02)pkF=op?1:0;pkPeople.forEach(P=>setOp(P,pkF));if(!op)return; // (v16.1) يظهرون ويغيبون بالتدريج
    // الطفل على الزحليقة: يصعد السلّم ثم ينزلق
    {const u=(t*.16)%1,SL=[3.4,3.6],e=k=>k*k*(3-2*k);if(u<.32){const k=e(u/.32);slider.position.set(SL[0]-1.85,.05+k*1.95,SL[1]);slider.rotation.y=Math.PI/2}else if(u<.36){const k=e((u-.32)/.04);slider.position.set(SL[0]-1.85+k*.65,2.0,SL[1])}else if(u<.62){const k=(u-.36)/.26,kk=k*k;slider.position.set(SL[0]-1.2+kk*2.9,2.05-kk*1.9,SL[1]);slider.rotation.y=Math.PI/2}else{const k=e((u-.62)/.38),z=SL[1]+.7*Math.sin(k*Math.PI);slider.position.set(SL[0]+1.7-k*3.55,Math.abs(Math.sin(k*18))*.05,z);slider.rotation.y=-Math.PI/2+Math.cos(k*Math.PI)*.5}}
    wand.forEach(P=>{const u=P.userData.pk;if(u.w>0){u.w-=dt;return}const dx=u.t[0]-P.position.x,dz=u.t[1]-P.position.z,d=Math.hypot(dx,dz);
      if(glide(P,u,u.t[0],u.t[1],P.userData.legs?1.15:.85,dt,t)){u.w=1+Math.random()*3;u.t=PKW[Math.floor(Math.random()*PKW.length)]}});
    // 👨‍👧‍👦 عائلات تأتي إلى مدينة الألعاب (من الطريق والقرية) وأخرى ترجع
    pkT-=dt;if(pkT<=0&&h<20.3){pkT=6+Math.random()*6;if(walkers.filter(w=>w.pk).length<14){const back=Math.random()<.35,n=1+Math.floor(Math.random()*2),GX=PKC[0]+8.6,GZ=PKC[1];
      const r=Math.random(),src=r<.4?[[L2,-75]]:r<.75?[[L2,8],[L2,-6]]:[VL[0],[VL[0][0]+4,VL[0][1]],[L2,VL[0][1]]];
      for(let i=0;i<=n;i++){const kid2=i>0,P=person(kid2?'kid':Math.random()<.55?'man':'woman',Math.floor(Math.random()*12)),o2=(i-.5)*.32;
        let pts=src.map(q=>[q[0]+(Math.abs(q[0])<4?o2:0),q[1]]).concat([[L2+o2,GZ+.3*i],[GX,GZ+o2],[GX-2.4,GZ+o2*2]]);if(back)pts=pts.reverse();
        P.userData.bs=P.scale.x;if(back)P.scale.setScalar(.01);walk(P,pts,kid2?1.35:1.2,back?'gone':'enter');const w=walkers[walkers.length-1];w.pk=1;if(back)w.grow=0}}}}
  // (v16.9) 📜 شيخ المكتبة، 👮 شرطي عند باب المركز، 😢 طفل ضائع عند بوابة مدينة الألعاب وأمّه
  // (v17.1) سيارة الطفل وسيارات المعرض: نفس سيارات المدينة بأشكال (صغيرة/عائلية/رياضية/جيب/ذهبية)
  function mkCar(c,k){const W=car(k==='gold'?0xd4af37:c,k==='suv');if(k==='mini')W.scale.set(.86,.9,.76);if(k==='sport'){W.scale.set(1,.8,1.06);add(new T.BoxGeometry(1.2,.06,.3),M(0x222222),0,1.05,-1.3,W);[-.45,.45].forEach(x=>add(new T.BoxGeometry(.06,.25,.2),M(0x222222),x,.92,-1.3,W))}
    if(k==='gold')W.traverse(m=>{if(m.isMesh&&m.material&&m.material.color&&m.material.color.getHex()===0xd4af37){m.material=m.material.clone();m.material.metalness=.9;m.material.roughness=.2}});
    if(k==='suv')box2(1.1,.06,1.5,M(0x333333),0,1.55,-.2,W);return W}
  const box2=(w,h,d,m,x,y,z,p)=>add(new T.BoxGeometry(w,h,d),m,x,y,z,p);
  const sheikh=person('man',4);sheikh.userData.act='sheikh';sheikh.position.set(SHK[0],0,SHK[1]);sheikh.rotation.y=Math.PI/2;
  {sheikh.children[0].material.color.setHex(0x5a4632);add(new T.SphereGeometry(.15,10,8),M(0xf4f4f4),0,1.33,.1,sheikh);add(new T.BoxGeometry(.22,.28,.06),M(0x1f6b45),.18,.95,.2,sheikh);
    const mk=markSprite(T,'📜','#8a5a00',.85);mk.position.set(0,2.35,0);mk.userData.act='sheikh';sheikh.add(mk);sheikh.userData.mk=mk}
  const police=person('guard',2);police.userData.act='police';police.position.set(POL[0]-2.5,0,POL[1]-1.1);police.rotation.y=-Math.PI/2;
  {const mk=markSprite(T,'👛','#c98a12',.8);mk.position.set(0,2.3,0);mk.visible=false;police.add(mk);police.userData.mk=mk}
  const lostKid=person('kid',4);lostKid.userData.act='lost';lostKid.visible=false;if(lostKid.userData.bag)lostKid.userData.bag.visible=false;
  {const mk=markSprite(T,'😢','#3b9be0',.8);mk.position.set(0,1.9,0);mk.userData.act='lost';lostKid.add(mk);lostKid.userData.mk=mk}
  const lostMom=person('woman',2);lostMom.visible=false;
  return {g,update,mkCar,sheikh,police,lostKid,lostMom,fb:life_fb,fbs:()=>FG,setQuiet:q=>{quiet=q},stops,count:()=>walkers.length,peds,say,endGreet,traffic,sellers,elder,faller,fallMk,father,mother,baker,FBK}}

/* ---------- (v11.9) أصوات المدينة: نهارًا عصافير وحركة سير هادئة، وليلًا هدوء. تُصنع بالكود (بلا ملفات)، وتحترم كتم صوت التطبيق ---------- */
const SKEY='usul5_m3snd';
function sndOn(){try{return localStorage.getItem(SKEY)!=='0'&&!(window.state&&state.mute)}catch(e){return true}}
function makeSounds(night){if(night)return {tick(){},stop(){},quiet:true};
  let ctx=null;try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return {tick(){},stop(){}}}
  const master=ctx.createGain();master.gain.value=sndOn()?1:0;master.connect(ctx.destination);
  // ضجيج بنّي ناعم = حركة سير بعيدة
  const len=ctx.sampleRate*3,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5}
  const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=380;
  const hum=ctx.createGain();hum.gain.value=.05;src.connect(lp);lp.connect(hum);hum.connect(master);try{src.start()}catch(e){}
  const pan=v=>{if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=v;p.connect(master);return p}return master};
  function chirp(){const t0=ctx.currentTime+.02,n=2+Math.floor(Math.random()*3),base=2400+Math.random()*1600,out=pan(Math.random()*1.6-.8);
    for(let i=0;i<n;i++){const o=ctx.createOscillator(),g=ctx.createGain(),t=t0+i*.16;o.type='sine';
      o.frequency.setValueAtTime(base,t);o.frequency.exponentialRampToValueAtTime(base*1.6,t+.05);o.frequency.exponentialRampToValueAtTime(base*1.1,t+.11);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(out);o.start(t);o.stop(t+.14)}}
  function carPass(){const s=ctx.createBufferSource();s.buffer=buf;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=.8;const g=ctx.createGain(),t=ctx.currentTime+.02,out=pan(Math.random()<.5?-.6:.6);
    bp.frequency.setValueAtTime(250,t);bp.frequency.linearRampToValueAtTime(700,t+1.2);bp.frequency.linearRampToValueAtTime(260,t+2.6);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+1.2);g.gain.linearRampToValueAtTime(0,t+2.6);s.connect(bp);bp.connect(g);g.connect(out);s.start(t,Math.random()*2);s.stop(t+2.7)}
  let tb=1,tc=4;
  // (v13.8) صوت المطر: ضجيج أبيض مُرشَّح، يعلو وقت المطر فقط (والعصافير تسكت)
  const rs=ctx.createBufferSource();{const b2=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d2=b2.getChannelData(0);for(let i=0;i<d2.length;i++)d2[i]=Math.random()*2-1;rs.buffer=b2}rs.loop=true;
  const hp=ctx.createBiquadFilter();hp.type='bandpass';hp.frequency.value=2600;hp.Q.value=.5;const rgn=ctx.createGain();rgn.gain.value=0;rs.connect(hp);hp.connect(rgn);rgn.connect(master);try{rs.start()}catch(e){}
  let rc=0;
  return {tick(dt){if(ctx.state==='suspended')ctx.resume().catch(()=>{});master.gain.value=sndOn()?1:0;if(!sndOn())return;
      rc-=dt;if(rc<=0){rc=2;this.rn=rainNow()}rgn.gain.value+=((this.rn?.16:0)-rgn.gain.value)*Math.min(1,dt*.8);
      tb-=dt;tc-=dt;if(tb<=0){tb=1.2+Math.random()*3.5;if(!this.rn)chirp()}if(tc<=0){tc=6+Math.random()*9;carPass()}},
    stop(){try{src.stop()}catch(e){}try{ctx.close()}catch(e){}}}}

/* ---------- التشغيل ---------- */
function run(ov,ui){const T=THREE,night=document.body.classList.contains('night');
  const W=innerWidth,H=innerHeight;
  const LITE=liteOn(),R=new T.WebGLRenderer({antialias:!LITE,logarithmicDepthBuffer:true}); // (v15.3) يمنع الوميض (تداخل الأسطح) أثناء تقليب المدينة
  const PRM=LITE?1:Math.min(2,devicePixelRatio||1);let PR=PRM;R.setPixelRatio(PR);R.setSize(W,H);
  R.shadowMap.enabled=!LITE;R.shadowMap.type=T.PCFSoftShadowMap;
  ov.insertBefore(R.domElement,ov.firstChild);R.domElement.style.display='block';R.domElement.style.touchAction='none';
  const cam=new T.PerspectiveCamera(45,W/H,.5,950);let S=makeScene(night);
  if(!cam0.dist)cam0.dist=Math.min(92,Math.max(48,40/(W/H))); // (v15.5) طلب الشيخ: الكاميرا أبعد قليلًا لتُرى المدينة أكثر، والطفل يقرّب بإصبعيه
  let {th,ph,dist}=cam0,drag=null,pinch=0,down=null;const pts=new Map(),MAXD=110;let mid=null;
  // City3D.debugLook=[x,y,z,dist] للتجربة فقط: يدور حول نقطة قريبة (مثل المزرعة)
  // (v15.3) طلب الشيخ: تقليب المدينة صعب على الموبايل → الكاميرا تطير بنعومة إلى مكان (flyTo) ثم تدور حوله، وترجع للمدينة كلها
  const C0=[0,0,0],LK0=[0,1.5,-5],CC=C0.slice(),LK=LK0.slice();let goal=null,foc=null;
  function flyTo(g){goal=g}
  function stepFly(dt){if(!goal)return;const k=Math.min(1,dt*2.6),lr=(a,b)=>a+(b-a)*k;for(let i=0;i<3;i++){CC[i]=lr(CC[i],goal.c[i]);LK[i]=lr(LK[i],goal.l[i])}
    let da=goal.th-th;da=Math.atan2(Math.sin(da),Math.cos(da));th+=da*k;ph=lr(ph,goal.ph);dist=lr(dist,goal.dist);
    if(Math.abs(da)<.003&&Math.abs(dist-goal.dist)<.05&&Math.hypot(CC[0]-goal.c[0],CC[2]-goal.c[2])<.03)goal=null}
  const place=()=>{const L=window.City3D&&City3D.debugLook,c=L||CC,d=L?L[3]:dist;cam.position.set(c[0]+d*Math.sin(th)*Math.sin(ph),c[1]+d*Math.cos(ph),c[2]+d*Math.cos(th)*Math.sin(ph));L?cam.lookAt(c[0],c[1],c[2]):cam.lookAt(LK[0],LK[1],LK[2])};
  // الشخصية: تبدأ عند باب البيت
  let bKey=(window.Binaa?Binaa.code()+'|'+(Binaa.job?Binaa.job.p+(Binaa.job.ready?'r':''):''):'')+'|'+dirtLv();
  const life=makeLife(night);S.add(life.g);let prC=null,prAt=0;const sounds=makeSounds(night);if(window.City3D)City3D._life=life;
  if(ui.snd){const upd=()=>{ui.snd.hidden=!!sounds.quiet;ui.snd.textContent=sndOn()?"🔊":"🔇"};upd();ui.snd.onclick=()=>{if(sounds.quiet){card("🌙 الليل هادئ… المدينة نائمة 😴");setTimeout(()=>card(""),2200);return}try{localStorage.setItem(SKEY,sndOn()?"0":"1")}catch(e){}upd()}}
  const kid=makeKid();S.add(kid);let at={x:-3.4,z:1,via:null},path=[],onArrive=null,busy=0;kid.position.set(at.x,0,at.z);kid.rotation.y=Math.PI/2;
  // (v13.7) سرعة مشي الطفل (تبطؤ حين يرافق جدّو) وكيسان يحملهما عنه
  // (v13.8) ☂️ مظلّة الطفل وقت المطر، وألوان السماء حسب الوقت: فجر وردي-برتقالي، نهار أزرق، غروب برتقالي فوق الجبال، ليل كحلي
  let wKey=rainNow()+'|'+rainbowNow()+'|'+festNow()+'|'+(occNow()||{}).id+'|'+winter()+'|'+cloudLv()+'|'+iftarNow()+'|'+halaqaNow()+'|'+poolOpen(),wRain=rainNow();
  const kidUmb=new T.Group();kidUmb.visible=false;kid.add(kidUmb);
  {const p=new T.Mesh(new T.CylinderGeometry(.02,.02,1.1,5),new T.MeshStandardMaterial({color:0x333333}));p.position.set(.28,1.35,.08);kidUmb.add(p);
    const c=new T.Mesh(new T.SphereGeometry(.75,16,6,0,Math.PI*2,0,Math.PI/2.6),new T.MeshStandardMaterial({color:boy()?0x2f6fd0:0xd94f8a,roughness:.6,side:T.DoubleSide}));c.position.set(.28,1.68,.08);c.castShadow=true;kidUmb.add(c)}
  function applySky(){const U=S.userData;if(!U.sky)return;const h=hourNow();let F=5.2,Mg=17;
    try{const a=Adhan.times(new Date()),f=new Date(+a.fajr),m=new Date(+a.maghrib);F=f.getHours()+f.getMinutes()/60;Mg=m.getHours()+m.getMinutes()/60}catch(e){}
    const SR=F+1.3,rn=rainNow(),wn=winter(),C=(a,b,k)=>new T.Color(a).lerp(new T.Color(b),Math.max(0,Math.min(1,k)));let top,hor,sc=0xfff2d6,si=.95,disc=null;
    if(night){top=new T.Color(0x0b1530);hor=new T.Color(0x223868);sc=0xb8c6ff;si=.5}
    else{const dT=rn?0x8b97a5:wn?0x9fb3c6:0x4aa3e6,dH=rn?0xb9c3cc:wn?0xd2dbe3:0xcdeeff;top=new T.Color(dT);hor=new T.Color(dH);if(rn)si=.45;
      if(!rn&&h<SR+.8){const k=1-Math.max(0,Math.min(1,(h-SR+.1)/.9));top=C(dT,0x7488c8,k);hor=C(dH,0xffae86,k);sc=C(0xfff2d6,0xffc58a,k).getHex();si=.95-.3*k;disc={x:330,y:14+(1-k)*45,z:-140,k}}
      else if(!rn&&h>Mg-1.2){const k=Math.min(1,(h-(Mg-1.2))/1.2);top=C(dT,0x4f5f9c,k);hor=C(dH,0xff8a58,k);sc=C(0xfff2d6,0xffa060,k).getHex();si=.95-.35*k;disc={x:-330,y:55-42*k,z:-140,k}}}
    U.sky.set(top,hor);if(S.fog)S.fog.color.copy(hor);if(S.background&&S.background.copy)S.background.copy(hor);if(U.sun){U.sun.color.setHex(sc);U.sun.intensity=si}
    const d=U.sunDisc;if(d){d.visible=!!disc&&disc.k>.05;if(disc)d.position.set(disc.x,disc.y,disc.z)}}
  if(window.City3D)City3D.applySky=()=>applySky();
  let lostS=0,pkO=parkOpen(),kidSp=4.2,fol=0,fast=0,escort=0,lookT=0,carry=0,fallEsc=0,fallT=25+Math.random()*40;const FALLP=[-3.4,11.2];
  const hpLv=()=>{const c=window.Binaa?Binaa.code():'';return Math.max(0,Math.min(3,+c[5]||0))};
const kidBags=[-1,1].map(k=>{const b=new T.Mesh(new T.BoxGeometry(.2,.24,.12),new T.MeshStandardMaterial({color:k<0?0xe9e2cf:0xd6e8f5,roughness:.8}));b.position.set(k*.34,.42,.06);b.visible=false;kid.add(b);return b});
  const sign=v=>v<0?-1:1;
  const door=p=>{if(p==='sc')return {x:-2.4,z:-17.6,via:null};if(p==='m')return {x:6,z:3.95,via:4.6};const [x,z]=SPOT[p];return {x:x-sign(x)*(2.2+(BS[p]||1)),z:z+1,via:null}};
  const treeSpot=i=>{const [x,z]=TREES[i];return Math.abs(x)<4?{x:x+sign(x)*.9,z,via:null}:{x:x-sign(x)*1.2,z,via:sign(z)*4.6}};
  const litSpot=i=>{const [x,z]=LITTER[i];return {x,z,via:Math.abs(x)<4?null:z}};
  // (v11.4) الطفل يتجوّل وحده بفرح، ويلتفت إليك عندما يقف، ويقفز فرحًا عند الجوائز
  let wander=false,still=0,joyT=0,waveT=0,sparks=[];
  if(night){const kl=new T.PointLight(0xffe2b0,.9,6,1.5);kl.position.set(0,1.6,1);kid.add(kl)}
  // (v13.5) طلب الشيخ: الطفل لا يمشي ولا يقف في وسط الشارع. يمشي على الرصيف الأيسر (SW) ويعبر من ممرّ المشاة عند التقاطع،
  // ويتجوّل وحده في أماكن آمنة: الرصيف، أمام بيته، قرب المزرعة، وطرف الحديقة.
  const SW=-2.5;
  // (v13.5) 😴 من منتصف الليل حتى الفجر: الطفل نائم في بيته، والجيران في بيوتهم، وفوق البيت «Zzz»
  let sleeping=false;const zz=textSprite(T,'😴 Zzz','rgba(255,255,255,.9)','#3a4a8a');zz.material.transparent=true;zz.scale.set(2.6,.57,1);zz.visible=false;life.g.add(zz);
  {const fl=Math.max(1,Math.min(4,(window.Bayt&&Bayt.done)|0||1));zz.userData.y=(fl*1.6+2)*(BS.home||1)+3.3;zz.position.set(SPOT.home[0]+1.5,zz.userData.y,SPOT.home[1])}
  const sleepCard=()=>card(`😴 ${B('أنت','أنتِ')} ${B('نائم','نائمة')} في ${B('بيتك','بيتكِ')}… الوقت متأخر 🌙<br><small>النوم مبكرًا يقوّي الجسم، ونستيقظ لصلاة الفجر إن شاء الله 🤲</small>`,[[B('تصبح','تصبحين')+' على خير 🌙',null]]);
  function startSleep(now){try{leaveCar(1)}catch(e){}sleeping=true;zz.visible=true;
    if(now){kid.visible=false;path=[];sleepCard();return}
    busy=0;path=[];wander=false;at=here();go(door('home'),()=>{busy=1;let k=0;const s=setInterval(()=>{k++;kid.scale.setScalar(KS*Math.max(0,1-k/10));
      if(k>=10){clearInterval(s);kid.visible=false;kid.scale.setScalar(KS);busy=0;sleepCard()}},40)});
    card(`🌙 الساعة ١٢ ليلًا… حان وقت النوم 😴<br><small>${B('تذهب','تذهبين')} إلى ${B('بيتك','بيتكِ')} ${B('لتنام','لتنامي')}</small>`)}
  function wake(){sleeping=false;zz.visible=false;at=door('home');kid.position.set(at.x,0,at.z);kid.visible=true;path=[];
    card(`☀️ صباح الخير! ${B('استيقظتَ','استيقظتِ')} لصلاة الفجر 🤲`);setTimeout(()=>{if(ui.card.textContent.includes('صباح الخير'))card('')},3500)}
  // 🎒 الدوام: من ٧:٤٥ إلى ١٢ في أيام الدراسة يذهب الطفل إلى المدرسة ويبقى في الساحة مع زملائه، وفي ١٢ يرنّ الجرس ويخرج
  let inSchool=false,schOK=0;const SCP={x:-6.6,z:-17.3};
  const schoolCard=()=>card(`🎒 ${B('أنت','أنتِ')} الآن في الدوام مع ${B('زملائك','زميلاتك')} 📚<br><small>الدوام من الساعة ٨ صباحًا إلى ١٢ ظهرًا · ${B('تخرج','تخرجين')} مع الجرس 🔔</small>`,
    [['📚 درس اليوم',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['⭐ '+B('احفظ','احفظي')+' سورة',()=>closeTo(()=>{const b=document.getElementById('openHifz');b&&b.click()}),'sec'],['حسنًا',null,'sec']]);
  function inYard(){kid.position.set(SCP.x,0,SCP.z);kid.rotation.y=Math.PI;kid.visible=true;at=here();path=[];wander=false;
    const D=day();if(!D.sch){D.sch=1;dsv();setTimeout(()=>{jewels(5);card(`🎒 ${B('وصلتَ','وصلتِ')} إلى المدرسة في وقت الدوام! 💎 +٥<br><small>طلب العلم من أجمل الأعمال · الدوام من ٨ إلى ١٢ 🔔</small>`,[['📚 درس اليوم',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['حسنًا',null,'sec']])},300)}else schoolCard()}
  function startSchool(now){try{leaveCar(1)}catch(e){}inSchool=true;fol=1;foc='kid';
    if(now){busy=0;inYard();return}
    busy=0;path=[];wander=false;at=here();card(`🔔 صار وقت الدوام… ${B('هيّا إلى مدرستك','هيّا إلى مدرستكِ')} 🎒`);schOK=1;
    go(door('sc'),()=>{schOK=0;let k=0;const x0=kid.position.x,z0=kid.position.z,s=setInterval(()=>{k++;const f=k/20;kid.position.set(x0+(SCP.x-x0)*f,0,z0+(SCP.z-z0)*f);kid.rotation.y=Math.atan2(SCP.x-x0,SCP.z-z0);if(k>=20){clearInterval(s);inYard()}},60)});schOK=0}
  function endSchool(){inSchool=false;if(sleeping)return;card(`🔔 رنّ الجرس… انتهى الدوام! ${B('أحسنتَ','أحسنتِ')} 🌟<br><small>${B('تستطيع','تستطيعين')} الآن أن ${B('تتجوّل','تتجوّلي')} في المدينة</small>`);
    setTimeout(()=>{if(ui.card.textContent.includes('رنّ الجرس'))card('')},3500);kid.position.set(-2.4,0,-17.6);at=here();path=[]}
  const WP=[{x:SW,z:-6},{x:SW,z:7},{x:SW,z:12},{x:SW,z:-12},{x:-5,z:4.05,via:4.6},{x:-10.3,z:4.05,via:4.6},{x:-5.5,z:-5.9,via:-4.6}];
  const here=()=>{const x=kid.position.x,z=kid.position.z;return {x,z,via:Math.abs(x)>2.6&&Math.abs(Math.abs(z)-4.6)<1.2?sign(z)*4.6:null}};
  // (v13.9) طلب الشيخ: الطفل يعبر الشارع الرئيسي من ممرّ المشاة فقط (z=±4.6)، ويقف عند الرصيف ينظر يمينًا ويسارًا (النقطة الثالثة =1)
  // الأماكن يمين الشارع بلا via يصلها عبر الممرّ الأقرب ثم الرصيف الأيمن (x=2.8)
  function go(to,done,w){if(busy)return;if(inSchool&&!schOK){if(!w)schoolCard();return}if(drv)leaveCar(1);if(window.City3D&&City3D.debugTp&&!w){path=[];at=to;kid.position.set(to.x,0,to.z);card('');if(done)setTimeout(done,50);return} // للتجربة فقط: وصول فوري
if(path.length&&wander){at=here();path=[]}wander=!!w;const p=[],R=2.8,zb=z=>z>=0?4.6:-4.6,rt=a=>a.via==null&&a.x>2.2;
    if(rt(at)&&rt(to)&&(at.z>=0)===(to.z>=0))p.push([R,at.z],[R,to.z],[to.x,to.z]);
    else{if(at.via!=null){p.push([at.x,at.via]);if(at.x>0)p.push([R,at.via,1])}
      else if(rt(at))p.push([R,at.z],[R,zb(at.z),1]);
      p.push([SW,at.via!=null?at.via:rt(at)?zb(at.z):at.z]);
      if(to.via!=null)p.push([SW,to.via,to.x>0?1:0],[to.x,to.via],[to.x,to.z]);
      else if(rt(to)){const z1=zb(to.z);p.push([SW,z1,1],[R,z1],[R,to.z],[to.x,to.z])}
      else p.push([SW,to.z],[to.x,to.z])}
    path=p;at=to;onArrive=done;card('')}
  function card(html,btns){const c=ui.card;if(!html){c.classList.remove('on');return}c.innerHTML=html+(btns?`<div class="row">${btns.map((b,i)=>`<button data-i="${i}" class="${b[2]||''}">${b[0]}</button>`).join('')}</div>`:'');
    c.classList.add('on');c.querySelectorAll('button').forEach(b=>b.onclick=()=>{const f=btns[+b.dataset.i][1];card('');f&&f()})}
  // نجوم وقلوب تتطاير حول الطفل عند الفرح
  function burst(){const C=[0xffd23f,0xff6fb5,0x4fc3ff,0x7be37b,0xffffff];for(let i=0;i<16;i++){const s=new T.Mesh(new T.OctahedronGeometry(.16),new T.MeshBasicMaterial({color:C[i%5],transparent:true}));
    s.position.set(fX(kid.position.x),1.4,kid.position.z);const a=i/16*Math.PI*2;s.userData={k:0,v:new T.Vector3(Math.cos(a)*2.2,2.5+Math.random()*1.5,Math.sin(a)*2.2)};S.add(s);sparks.push(s)}}
  function jewels(n){joyT=1.1;burst();bloomAdd();bloomPop();try{Deco.addJ(n)}catch(e){}try{tone(988,.08,'triangle',.1);setTimeout(()=>tone(1318,.12,'triangle',.1),110)}catch(e){}
    const f=document.createElement('div');f.className='m3fly';f.textContent='💎 +'+arn(n);ov.appendChild(f);setTimeout(()=>f.remove(),1500);showJ()}
  // (v11.7) «سعادة مدينتي» أعلى المدينة: ترتفع بالأعمال الصالحة اليوم وتنخفض إذا غاب الطفل (wajiha.js)
  function drawHp(){const el=ov.querySelector(".m3hp");if(!el||!window.Wajiha)return;const h=Wajiha.happy(),c=Wajiha.barCol(h);
    const m=h>=80?["😄","مدينتك سعيدة جدًا! ما شاء الله"]:h>=55?["🙂",`مدينتك سعيدة، ${B("زِدها","زيديها")} بعمل صالح`]:h>=30?["😐","مدينتك تنتظر أعمالك اليوم"]:["😟",`مدينتك مشتاقة لك! ${B("صلِّ","صلّي")} أو ${B("اسقِ","اسقي")} الشجر لتفرح`];
    el.title=m[1];el.setAttribute('aria-label','سعادة مدينتي '+h+'٪');el.innerHTML=`<span class="e">${m[0]}</span><b>${arn(h)}٪</b>`}
  // (v14.0) 🌦️ شارة صغيرة بطقس مدينة الطفل الحقيقي الآن (تظهر فقط إذا جُلب الطقس)
  function showWx(){const el=ov.querySelector('.m3wx'),w=wxNow(),c=wxCity();if(!el)return;if(!w||!c||V){el.hidden=true;return}
    const e=w.code>=95?'⛈️':wSnowy(w)?'❄️':wRainy(w)?'🌧️':w.cc>=60?'☁️':w.cc>=25?(night?'☁️':'⛅'):(night?'🌙':'☀️');
    const tx=w.code>=95?'رعد ومطر':wSnowy(w)?'ثلج':wRainy(w)?'مطر':w.cc>=60?'غائم':w.cc>=25?'غيوم قليلة':night?'صافٍ':'مشمس';
    el.hidden=false;el.innerHTML=`<span>${e}</span><b dir="ltr">${arn(w.tp)}°</b>`;el.onclick=()=>card(`<b>${e} الجوّ الآن في ${c[1]}: ${tx}، ${arn(w.tp)}°</b><br><small>مدينتك هنا تعيش نفس الجوّ الحقيقي عندكم 🌍 — إذا أمطرت عندكم تمطر هنا.<br>تتغيّر المدينة من «🕌 أوقات الأذان».</small>`,[['حسنًا']])}
  wxFetch();setTimeout(showWx,50);
  const showJ=()=>{ui.j.textContent="💎 "+arn(window.Deco?Deco.j:0);drawHp()};showJ();
  const closeTo=f=>{ui.close();setTimeout(f,60)};
  // الأعمال
  const A={
    mosque(){const p=prayerNow(),D=day();go(door('m'),()=>{
      if(!(window.Madina&&Madina.st.lv.m)){card(`🕌 هنا أرض الجامع. ${B('ابنِ','ابني')} الجامع أولًا ${B('بصلاتك','بصلاتكِ')} الحقيقية لتدخله 🤍`,[['ابنِ الجامع',()=>Madina.part('m')],['حسنًا',null,'sec']]);return}
      if(p&&!D.pr[p]){D.pr[p]=1;dsv();enter(()=>{jewels(10);card(`🕌 حان وقت صلاة ${PNAME[p]}! ${B('دخلتَ','دخلتِ')} الجامع 💎 +١٠<br><small>الآن ${B('قم وصلِّ','قومي وصلّي')} صلاتك الحقيقية، ثم ${B('سجّلها','سجّليها')} 🤲</small>`,[['🤲 '+B('سأصلّي الآن','سأصلّي الآن'),()=>closeTo(()=>window.Salah&&Salah.openPray())],['لاحقًا',null,'sec']])});return}
      if(p){card(`🕌 ${B('زرتَ','زرتِ')} الجامع في صلاة ${PNAME[p]} ✔<br><small>هل ${B('صلّيتَ','صلّيتِ')}؟ ${B('سجّل','سجّلي')} صلاتك في «وضوئي وصلاتي»</small>`,[['🤲 سجلّ صلاتي',()=>closeTo(()=>window.Salah&&Salah.openPray())],['حسنًا',null,'sec']]);return}
      const n=nextPrayer();card(`🕌 الجامع ينتظرك${n?`<br><small>الأذان القادم: صلاة ${PNAME[n.p]} الساعة ${hm(n.t)} ⏰<br>${B('تعال','تعالي')} وقت الأذان ${B('وخذ','وخذي')} 💎١٠</small>`:''}`,[['حسنًا',null,'sec']])})},
    water(){const D=day(),i=thirsty().find(k=>!D.tr[k]);if(i==null){card(`🌳 كل الأشجار شربت اليوم! ${B('أحسنت','أحسنتِ')} 💚<br><small>${B('تعال','تعالي')} غدًا، ستعطش أشجار جديدة</small>`,[['حسنًا',null,'sec']]);return}A.tree(i)},
    tree(i){const D=day();if(D.tr[i]||!thirsty().includes(i)){card('🌳 هذه الشجرة ليست عطشى الآن 💚');setTimeout(()=>card(''),1800);return}
      go(treeSpot(i),()=>{D.tr[i]=1;dsv();splash(S.userData.trees[i]);jewels(2);
        const left=thirsty().filter(k=>!D.tr[k]).length;card(`💧 ${B('سقيتَ','سقيتِ')} الشجرة فكبرت وفرحت! 🌳${left?`<br><small>باقي ${arn(left)} ${left==1?'شجرة عطشى':'أشجار عطشى'} (عليها 💧)</small>`:'<br><small>كل الأشجار شربت اليوم 💚</small>'}`,left?[['💧 الشجرة التالية',()=>follow(()=>A.water())],['حسنًا',null,'sec']]:[['الحمد لله',null]]);refresh()})},
    litter(i){const D=day();if(D.lt[i])return;go(litSpot(i),()=>{D.lt[i]=1;dsv();jewels(1);refresh();
      const left=litter().filter(k=>!D.lt[k]).length;card(`🧹 ${B('رفعتَ','رفعتِ')} النفايات ووضعتها في السلّة 🗑️<br><small>${left?`باقي ${arn(left)} في الطرق (عليها 🧹)`:'مدينتك نظيفة جميلة! ✨'}</small>`,left?[['🧹 التالية',()=>follow(()=>A.clean())],['حسنًا',null,'sec']]:[['الحمد لله',null]])})},
    clean(){const D=day(),i=litter().find(k=>!D.lt[k]);if(i==null){card(`✨ ${B('مدينتك','مدينتكِ')} نظيفة اليوم! ${B('أحسنت','أحسنتِ')} 💚`,[['حسنًا',null,'sec']]);return}A.litter(i)},
    // (v15.7) 👋 سلّم على أقرب جار (أو ردّ على من يسلّم عليك الآن)
    salamNear(){const ps=life.peds,kp=kid.position;let bi=-1,bd=1e9;ps.forEach((P,i)=>{const u=P.userData.u;if(!P.visible||u.fade||u.trip<0&&!u.shep)return;const d=Math.hypot(P.position.x-kp.x,P.position.z-kp.z)-(u.greet>0?1e3:0);if(d<bd){bd=d;bi=i}});
      if(bi<0){card(`🙂 لا أحد في الشارع الآن… ${B('انتظر','انتظري')} قليلًا حتى يمرّ أحد الجيران 👋`);setTimeout(()=>card(''),2400);return}A.salam(bi)},
    cat(){const D=day();if(D.cat)return;go(door('s'),()=>{busy=1;card(`🥛 ${B('ملأتَ','ملأتِ')} الإناء من السبيل…`);setTimeout(()=>{busy=0;go({x:CAT[0]-.2,z:CAT[1]+1.3,via:null},()=>{D.cat=1;dsv();jewels(3);
      card(`🐱 شربت القطة وقالت: مياو! شكرًا 🤍<br><small>الرحمة بالحيوان من الأخلاق الجميلة</small>`,[['حسنًا',null,'sec']]);refresh()})},1200)})},
    school(){go(door('q'),()=>card(`🏫 مدرسة القرآن: هيّا ${B('احفظ','احفظي')} سورة مع الشيخ عبد الباسط ⭐`,[['⭐ أنا حافظ صغير',()=>closeTo(()=>{const b=document.getElementById('openHifz');b&&b.click()})],['لاحقًا',null,'sec']]))},
    // (v11.8) 🎒 مدرستي: الذهاب للمدرسة مرة في اليوم 💎5، ثم دعوة لدرس حقيقي من الكتاب
    mySchool(){if(inSchool){schoolCard();return}const h=hourNow();
      {const L=[['📚 دروس الكتاب',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['حسنًا',null,'sec']];
       card(!schoolDay()?`🎒 اليوم عطلة، لا دوام في المدرسة 🌞<br><small>الدوام في أيام الدراسة من ٨ صباحًا إلى ١٢ ظهرًا · ${B('تعلّم','تعلّمي')} درسًا من البيت 📚</small>`
         :h<7.75?`🎒 الدوام يبدأ الساعة ٨ صباحًا 🔔<br><small>${B('ستذهب','ستذهبين')} إلى المدرسة وحدك حين يحين الوقت</small>`
         :`🎒 انتهى دوام اليوم 🔔<br><small>الدوام غدًا من ٨ صباحًا إلى ١٢ ظهرًا إن شاء الله · ${B('راجع','راجعي')} درسك الآن 📚</small>`,L);return}
      const D=day();go(door('sc'),()=>{
      if(!D.sch){D.sch=1;dsv();enter(()=>{jewels(5);card(`🎒 ${B('وصلتَ','وصلتِ')} إلى ${B('مدرستك','مدرستكِ')}! 💎 +٥<br><small>طلب العلم من أجمل الأعمال، ${B('تعلّم','تعلّمي')} اليوم درسًا جديدًا 📚</small>`,
        [['📚 دروس الكتاب',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['حسنًا',null,'sec']])});return}
      card(`🎒 ${B('ذهبتَ','ذهبتِ')} إلى المدرسة اليوم ✔<br><small>${B('تعال','تعالي')} غدًا ${B('وخذ','وخذي')} 💎٥ مرة أخرى</small>`,[['📚 دروس الكتاب',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['حسنًا',null,'sec']])})},
    // (v12.1) 👋 السلام: الطفل يُلقي السلام على جاره، أو يردّ على من سلّم عليه ← «هذا عمل صالح» (💎1، حتى ٥ مرات يوميًا)
    salam(i){const P=life.peds[i];if(!P||!P.visible)return;const u=P.userData.u,greeted=u.greet>0,she=u.kind==='woman';u.hold=25;
      const px=P.position.x,pz=P.position.z,to=u.kind==='shep'?{x:px+1.1,z:pz,via:4.6}:Math.abs(px)<4.5?(px<0?{x:-2.3,z:pz-.9,via:null}:{x:2.3,z:pz-.9,via:null}):Math.abs(Math.abs(pz)-4.8)<1.2?{x:px-sign(px)*.9,z:sign(pz)*4.6,via:sign(pz)*4.6}:{x:px+(px<0?1:-1),z:pz,via:null};
      const who=she?'جارتك':u.kind==='kid'?B('صديقك','صديقتك'):'جارك',rel=()=>{u.hold=Math.min(u.hold,2.5)};
      const RD='وعليكم السلام ورحمة الله وبركاته';
      const reply=()=>{life.endGreet(i);life.say(kid,RD,3.5,2.4);setTimeout(()=>{life.say(P,'بارك اللَّهُ فيك'+yaN()+' 🤍',3,u.h);reward('rd');rel()},700)};
      go(to,()=>{if(greeted){card(`👋 ${she?'قالت':'قال'} لك ${who}: «السلام عليكم»<br><small>بماذا ${B('تردّ','تردّين')}؟</small>`,
          [[RD,reply],['مرحبا 🙂',()=>card(`🤍 الأجمل أن ${B('تردّ','تردّي')} بتحية الإسلام`,[[RD,reply]]),'sec']]);return}
        card(`🙂 هذا ${who}… ${B('سلّم','سلّمي')} ${she?'عليها':'عليه'}`,[['👋 السلام عليكم',()=>{life.say(kid,'السلام عليكم 👋',3,2.4);
          setTimeout(()=>{life.say(P,RD+yaN(),3.5,u.h);reward('sl');rel()},1300)}],['لاحقًا',rel,'sec']])})},
    // (v12.1) 🐄 المزرعة: إطعام البقر، إطعام الدجاج، سقي الحيوانات — كلٌّ مرة يوميًا 💎2
    farm(k){const D=day(),F=D.fm=D.fm||{},ks=['cow','hen','wat'];if(!k||k==='any')k=ks.find(x=>!F[x]);
      const FD={cow:{btn:'🌾 '+B('أطعم','أطعمي')+' البقر',doing:`🌾 ${B('تضع','تضعين')} العلف للبقرات…`,done:'🐄 أكلت البقرات وقالت: مووو! شكرًا',full:'🐄 البقرات شبعانة اليوم 💚'},
        hen:{btn:'🌽 '+B('أطعم','أطعمي')+' الدجاج',doing:`🌽 ${B('تنثر','تنثرين')} الحَبّ للدجاج…`,done:'🐔 فرح الدجاج وقال: كو كو كو!',full:'🐔 الدجاج شبعان اليوم 💚'},
        wat:{btn:'💧 '+B('اسقِ','اسقي')+' الحيوانات',doing:`💧 ${B('تملأ','تملئين')} حوض الماء…`,done:'💧 شربت الحيوانات الماء البارد',full:'💧 الحوض مليء بالماء اليوم 💚'}};
      if(!k){card(`🐄 كل حيوانات ${B('مزرعتك','مزرعتكِ')} أكلت وشربت اليوم! ${B('أحسنت','أحسنتِ')} 💚<br><small>${B('تعال','تعالي')} غدًا ${B('لترعاها','لترعيها')} من جديد</small>`,[['حسنًا',null,'sec']]);return}
      if(F[k]){card(FD[k].full);setTimeout(()=>card(''),1800);return}
      go(FARM_IN,()=>{busy=1;card(FD[k].doing);setTimeout(()=>{busy=0;F[k]=1;dsv();jewels(2);refresh();const left=ks.filter(x=>!F[x]);
        card(`${FD[k].done} 💎 +٢<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الرحمة بالحيوان ورعايته من أخلاق المسلم 🤍</small>`,
          left.length?[[FD[left[0]].btn,()=>A.farm(left[0])],['حسنًا',null,'sec']]:[['الحمد لله',null]])},1300)})},
    // ===== (v13.7) 🦆 إطعام البطّ، 🏪 آداب السوق، ⛲ النافورة، 👴 مساعدة جدّو =====
    ducks(){const D=day();if(D.duck){card(`🦆 البطّ شبعان اليوم 💚<br><small>${B('تعال','تعالي')} غدًا ${B('وأطعمه','وأطعميه')} من جديد</small>`,[['حسنًا',null,'sec']]);return}
      go({x:FBX+1.8,z:RVZ-RVW/2-.5,via:null},()=>{busy=1;const call=S.userData.duckCall;if(call){call.x=FBX+1.8;call.z=RVZ-1;call.on=8}
        card(`🍞 ${B('ترمي','ترمين')} فتات الخبز في الماء… البطّ قادم! 🦆`);
        for(let i=0;i<12;i++){const d=new T.Mesh(new T.SphereGeometry(.05,5,4),new T.MeshStandardMaterial({color:0xe0b070}));d.position.set(FBX+1.8+(Math.random()-.5)*1.6,1.4+Math.random()*.6,RVZ-.8+(Math.random()-.5)*.6);S.add(d);drops.push(d)}
        setTimeout(()=>{busy=0;D.duck=1;dsv();jewels(2);const m=S.userData.duckMark;if(m)m.visible=false;
          card(`🦆 أكلت البطّة وصغارها وقالوا: كواك كواك! شكرًا 💎 +٢<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الرحمة بالحيوان من أخلاق المسلم 🤍</small>`,[['الحمد لله',null]])},2800)})},
    mk(k){const D=day();D.mk=D.mk||{};const P=life.sellers[k],z=(MKT.find(m=>m[0]===k)||[])[1];if(z==null)return;
      if(night||sleeping){card(`🌙 السوق مغلق الآن… ${B('تعال','تعالي')} في النهار 🏪`);setTimeout(()=>card(''),2000);return}
      const say=(o,t,h)=>life.say(o,t,3,h||2.3),done=(msg,lesson,n)=>{const first=!D.mk[k];D.mk[k]=1;dsv();if(first)jewels(n);else{joyT=1.1;burst()}
        const m=S.userData.mkMark&&S.userData.mkMark[k];if(m)m.visible=false;
        card(`${msg}${first?` 💎 +${arn(n)}`:''}<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>${lesson}</small>`,[['الحمد لله',null]])};
      go({x:MKX+.15,z,via:null},()=>{if(P)say(P,'السلام عليكم 👋');
        if(k==='bak'){const RQ='وعليكم السلام، أريد خبزًا من فضلك 🙏',ok=()=>{say(kid,'أريد خبزًا من فضلك',2.4);setTimeout(()=>{if(P)say(P,'تفضّل، خبز حارّ 🍞');
              card(`🍞 أعطاك الخبّاز خبزًا حارًّا طيّبًا`,[['شكرًا، جزاك الله خيرًا 🤍',()=>{say(kid,'جزاك الله خيرًا 🤍',2.4);done(`🍞 ${B('شكرتَ','شكرتِ')} الخبّاز بأدب`,'«من فضلك» و«شكرًا» والكلمة الطيبة من آداب المسلم 🤍',1)}]])},1200)};
          card(`🍞 الخبّاز: السلام عليكم! ماذا ${B('تريد','تريدين')}؟`,[[RQ,ok],['أعطني خبزًا!',()=>card(`🤍 الأجمل أن ${B('تردّ','تردّي')} السلام ${B('وتقول','وتقولي')} «من فضلك»`,[[RQ,ok]]),'sec']])}
        if(k==='fru'){const ret=()=>{say(kid,'يا عمّ، أعطيتني مالًا زائدًا',2.4);setTimeout(()=>{if(P)say(P,'بارك الله فيك، ما أصدقك! 🌟');done(`💰 ${B('أرجعتَ','أرجعتِ')} المال الزائد للبائع`,'الصدق والأمانة من أجمل أخلاق المسلم 🤍',2)},1300)};
          card(`🍊 ${B('اشتريتَ','اشتريتِ')} برتقالًا… لكن البائع أخطأ وأعطاك دينارًا زائدًا! 💰<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['أرجعه له، ليس لي ✋',ret],['آخذه وأسكت',()=>card(`🤍 المال الزائد ليس لنا، والمسلم صادق وأمين`,[['أرجعه له ✋',ret]]),'sec']])}
        if(k==='swe'){const share=()=>{say(kid,'تفضّل، نصفها لك 🍬',2.4);setTimeout(()=>done(`🍬 ${B('شاركتَ','شاركتِ')} صديقك الحلوى ففرح كثيرًا`,'الكرم والمشاركة يزرعان المحبة بين الناس 🤍',1),1200)};
          card(`🍬 ${B('اشتريتَ','اشتريتِ')} حلوى لذيذة… وصديقك بجانبك ينظر إليها 👀`,[['أعطيه نصفها 🤝',share],['آكلها وحدي',()=>card(`🤍 ما رأيك أن ${B('تشاركه','تشاركيه')}؟ الهدية تزرع المحبة`,[['أعطيه نصفها 🤝',share]]),'sec']])}})},
    // (v13.8) 🐑 زيارة المرعى
    sheep(){go({x:FLK[0]+4.2,z:FLK[1]-3.6,via:4.6},()=>card(`🐑 الأغنام ترعى العشب مع الراعي وكلبه… ماااع! 🐕<br><small>الرفق بالحيوان ورعايته من أخلاق المسلم 🤍<br>${B('سلّم','سلّمي')} على الراعي إذا رأيته 👋</small>`,[['حسنًا',null,'sec']]))},
    plaza(){go({x:PLZ[0]-.6,z:3.75,via:4.6},()=>{const p=S.userData.pigeons;if(p&&p.fly<=0)p.fly=6;
      card(`⛲ ${B('وصلتَ','وصلتِ')} ساحة النافورة… وطار الحمام! 🕊️<br><small>الماء نعمة من الله، نشربه ولا نُسرف فيه 💧</small>`,[['حسنًا',null,'sec']])})},
    elder(){const D=day(),E=life.elder;if(!E.visible)return;
      if(D.eld){card(`👴 جدّو في بيته يدعو لك 🤲`);setTimeout(()=>card(''),1800);return}
      go({x:E.position.x-1,z:E.position.z,via:null},()=>{life.say(E,'السلام عليكم يا '+B('ولدي','ابنتي'),3,2.4);
        card(`👴 جدّو يحمل كيسين ثقيلين من السوق، وبيته بعيد خلف النهر…`,[['🤝 أساعدك يا جدّي',()=>{escort=1;kidSp=1.3;
          card(`🚶 ${B('تحمل','تحملين')} الأكياس ${B('وتمشي','وتمشين')} مع جدّو بهدوء…`);
          go({x:-4.3,z:NBZ,via:null},()=>{escort=0;kidSp=4.2;busy=0;D.eld=1;dsv();jewels(3);life.say(E,'جزاك الله خيرًا'+yaN()+' 🤲',3.5,2.4);
            card(`👴 جدّو: جزاك الله خيرًا يا ${B('ولدي','ابنتي')}، الله يحفظك 🤲 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>احترام الكبير ومساعدته من أخلاق المسلم 🤍</small>`,[['الحمد لله',null]])});busy=1}],['لاحقًا',null,'sec']])})},
    // ===== (v14.5) 👨‍👩‍👦 بِرّ الوالدين، ⚽ الملعب، 🔥 التنّور، 🤒 الجار المريض، 🐦 العصافير، 💝 الصدقة، 🌙 القمر =====
    parents(){if(night||sleeping){card(`🌙 ${B('أبوك','أبوكِ')} و${B('أمّك','أمّكِ')} يرتاحان داخل البيت الآن… ${B('ادعُ','ادعي')} لهما: «اللَّهمّ احفظهما» 🤲`);setTimeout(()=>card(''),2600);return}
      const D=day(),br=D.br=D.br||{},L=life,ok=(k,n,msg,lesson)=>{const first=!br[k];br[k]=1;dsv();if(first)jewels(n);else{joyT=1.1;burst()}
        const left=[['s','👋 السلام عليكم يا أمّي ويا أبي'],['b','🛍️ أحمل الأغراض عن أمّي'],['h','🤲 أقبّل يد أبي']].filter(x=>!br[x[0]]);
        card(`${msg}${first?' 💎 +'+arn(n):''}`+(left.length?'':`<br><b style="color:#1fa463;font-size:18px">🌟 ${B('أنت','أنتِ')} ${B('بارّ','بارّة')} بوالديك!</b>`)+`<br><small>${lesson}</small>`,left.length?left.map(x=>[x[1],()=>act(x[0])]).concat([['لاحقًا',refresh,'sec']]):[['الحمد لله',refresh]])};
      const act=k=>{if(k==='s'){L.say(kid,'السلام عليكم يا أمّي ويا أبي 👋',3,2.4);setTimeout(()=>{L.say(L.mother,'وعليكم السلام يا '+B('حبيبي','حبيبتي')+' 🤍',3,2.3);ok('s',2,`👋 ${B('سلّمتَ','سلّمتِ')} على والديك ففرحا بك`,'السلام على الوالدين أوّل البرّ بهما 🤍')},1200)}
        if(k==='b'){L.say(kid,'عنكِ يا أمّي 🛍️',2.5,2.4);br.b=br.b||0;setTimeout(()=>{carry=1;kidBags.forEach(b=>b.visible=true);L.say(L.mother,'اللَّه يرضى عليك 🤲',3,2.3);
          setTimeout(()=>{carry=0;kidBags.forEach(b=>b.visible=false);ok('b',2,`🛍️ ${B('حملتَ','حملتِ')} الأغراض عن ${B('أمّك','أمّكِ')} وأدخلتها البيت`,'مساعدة الأمّ من أحبّ الأعمال إلى اللَّه 🤍')},1500)},600)}
        if(k==='h'){L.say(kid,'🤲',2,2.4);joyT=1.1;setTimeout(()=>{L.say(L.father,'رضي اللَّهُ عنك يا '+B('ولدي','ابنتي')+' 🤲',3.2,2.4);ok('h',2,`🤲 ${B('قبّلتَ','قبّلتِ')} يد ${B('أبيك','أبيكِ')} فدعا لك`,'احترام الوالدين وطاعتهما بابٌ إلى الجنّة 🤍')},1000)}};
      go(door('home'),()=>{const left=[['s','👋 السلام عليكم يا أمّي ويا أبي'],['b','🛍️ أحمل الأغراض عن أمّي'],['h','🤲 أقبّل يد أبي']].filter(x=>!br[x[0]]);
        if(!left.length){card(`👨‍👩‍👦 والداك يدعوان لك ويقولان: الله يحفظك 🤲<br><small>${B('برَرتَ','برَرتِ')} بهما اليوم، ${B('تعال','تعالي')} غدًا من جديد 🤍</small>`,[['الحمد لله',null]]);return}
        card(`👨‍👩‍👦 ${B('أبوك','أبوكِ')} و${B('أمّك','أمّكِ')} عند باب البيت… ${B('أمّك','أمّكِ')} تحمل أكياسًا ثقيلة 🛍️<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,left.map(x=>[x[1],()=>act(x[0])]).concat([['لاحقًا',null,'sec']]))})},
    football(){const D=day();if(night||sleeping||!footNow()){card(`⚽ الملعب فارغ الآن… ${rainNow()?'الجوّ ممطر اليوم 🌧️':'يلعب أطفال الحيّ بعد المدرسة حتى المغرب، وفي العطل من الصباح'} 🙂`);setTimeout(()=>card(''),2400);return}
      go({x:FB[0]-3.5,z:-18.5,via:null},()=>{try{life.fb.fall()}catch(e){}const help=()=>{try{life.fb.up()}catch(e){}const first=!D.fb;D.fb=1;dsv();if(first)jewels(2);else{joyT=1.1;burst()}
          card(`🤝 ${B('ساعدتَ','ساعدتِ')} اللاعب على النهوض، فقال: شكرًا يا ${B('صديقي','صديقتي')}!${first?' 💎 +٢':''}<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الروح الرياضية: نلعب بمحبّة، ونساعد من يقع، ولا نغضب إذا خسرنا 🤍</small>`,[['الحمد لله',null]])};
        card(`⚽ أطفال الحيّ يلعبون… فجأة وقع لاعبٌ من الفريق الآخر 🤕<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['🤝 أساعده على النهوض',help],['أكمل اللعب وأسجّل هدفًا',()=>card(`🤍 الهدف يستطيع أن ينتظر… الأجمل أن ${B('تساعده','تساعديه')} أوّلًا`,[['🤝 أساعده',help]]),'sec']])})},
    tannour(){const D=day();if(night||sleeping){card('🔥 التنّور بارد الآن… الجارة تخبز في النهار 🍞');setTimeout(()=>card(''),2200);return}
      if(D.tn){card(`🍞 ${B('أوصلتَ','أوصلتِ')} الخبز اليوم، وجدّو يدعو لك 🤲`);setTimeout(()=>card(''),2000);return}
      go({x:9.1,z:24.4,via:null},()=>{life.say(life.baker,'السلام عليكم يا '+B('ولدي','ابنتي')+' 🍞',3,2.3);
        card(`🔥 جارتك تخبز خبز التنّور الحارّ… أعطتك خبزات وقالت: «${B('أوصلها','أوصليها')} إلى بيت جدّو» 🍞`,[['🍞 أوصلها لجدّو',()=>{carry=1;kidBags.forEach(b=>b.visible=true);
          go({x:-4.3,z:NBZ,via:null},()=>{carry=0;kidBags.forEach(b=>b.visible=false);D.tn=1;dsv();jewels(2);
            card(`👴 جدّو: جزاك اللَّهُ خيرًا، وجزى جارتنا خيرًا 🤲 💎 +٢<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الإحسان إلى الجار وإهداؤه من أخلاق المسلم 🤍</small>`,[['الحمد لله',refresh]])})}],['لاحقًا',null,'sec']])})},
    // ===== (v15.2) 🏥 المستشفى: زيارة طفل مريض (💎3 مرة يوميًا)، و🤕 رجل وقع في الشارع: يسنده الطفل ويوصله إلى المستشفى (💎4) =====
    // ===== (v15.4) 🎡 مدينة الألعاب: في أيام الفتح يذهب الطفل ويختار التصرّف الصحيح (الدور، النظافة، مساعدة الصغير) 💎3 مرة يوميًا =====
    park(){const D=day(),why=parkWhy(),h=hourNow();viewAt('pk');
      if(!parkOpen()){const o=occNow();card(o&&o.k==='sad'?`🎡 مدينة الألعاب مغلقة في هذه الأيام احترامًا للمناسبة 🖤`:
          why&&rainNow()?`🎡 مدينة الألعاب مغلقة الآن بسبب المطر 🌧️… ${B('ارجع','ارجعي')} بعد أن يتوقف`:
          why?`🎡 مدينة الألعاب تفتح اليوم من ٩ صباحًا حتى ٩ مساءً 🕘`:
          `🎡 مدينة الألعاب مغلقة اليوم<br><small>تفتح يوم <b>الجمعة والسبت</b>، وفي <b>العطل والأعياد والمناسبات السعيدة</b> 🎉<br>من ٩ صباحًا حتى ٩ مساءً</small>`,[['حسنًا',null,'sec']]);return}
      go({x:PKC[0]+8.3,z:PKC[1]+.9,via:null},()=>{
        if(D.pk){card(`🎡 ${B('لعبتَ','لعبتِ')} اليوم في مدينة الألعاب 😊<br><small>${why} · الأطفال يلعبون ويفرحون 🎠</small>`,[['حسنًا',null,'sec']]);return}
        const good=(msg,lesson)=>()=>{D.pk=1;dsv();jewels(3);try{Aamal.grow('akhlaq')}catch(e){}card(`${msg} 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>${lesson}</small>`,[['الحمد لله',null]])};
        const SC=[
          [`🎠 ${why}… والأطفال ${B('ينتظرون','ينتظرون')} دورهم في طابور الدوّامة. ماذا ${B('تفعل','تفعلين')}؟`,
            ['👫 أقف في الطابور وأنتظر دوري',good(`🎠 ${B('انتظرتَ','انتظرتِ')} دورك ثم ${B('ركبتَ','ركبتِ')} الدوّامة وفرحت كثيرًا`,'انتظار الدور واحترام الآخرين من الأخلاق الحسنة 🤍')],
            ['🏃 أتقدّم على الأطفال',`🤍 الأجمل أن ${B('تنتظر','تنتظري')} دورك مثل أصدقائك… فالكلّ يحبّ أن يلعب`]],
          [`🍭 ${why}… ${B('أكلتَ','أكلتِ')} غزل البنات وبقي العود والكيس في يدك. ماذا ${B('تفعل','تفعلين')}؟`,
            ['🗑️ أضعهما في سلّة المهملات',good(`🗑️ ${B('وضعتَ','وضعتِ')} المهملات في السلّة فبقيت مدينة الألعاب نظيفة جميلة`,'المسلم يحافظ على نظافة الأماكن التي يلعب فيها الناس 🤍')],
            ['أرميهما على الأرض',`🤍 لو رمى كلّ طفل كيسه لامتلأت مدينة الألعاب بالأوساخ… ${B('ضعه','ضعيه')} في السلّة`]],
          [`🛝 ${why}… طفل صغير خائف من الزحليقة ويبكي. ماذا ${B('تفعل','تفعلين')}؟`,
            ['🤝 أمسك يده وأشجّعه',good(`🤝 ${B('أمسكتَ','أمسكتِ')} يده ${B('وشجّعتَه','وشجّعتِه')} فانزلق وضحك فرحًا 😊`,'الرحمة بالصغير ومساعدته من أخلاق المسلم 🤍')],
            ['أضحك عليه',`🤍 الضحك على الخائف يحزنه… ${B('ساعده','ساعديه')} حتى يفرح`]]];
        const sc=SC[Math.floor(Date.now()/864e5)%3],ask=()=>card(sc[0],[sc[1],[sc[2][0],()=>card(sc[2][1],[[sc[1][0],sc[1][1]]]),'sec']]);ask()})},
    hospital(){hosView();const D=day(),L=hpLv(),up=L<3?[['⬆️ '+B('طوّر','طوّري')+' المستشفى',()=>{try{Binaa.open('hp')}catch(e){}}]]:[];
      if(night||sleeping){card(`🏥 المستشفى يعمل في الليل والنهار… الأطباء والممرّضون يسهرون على المرضى 🩺<br><small>${B('ادعُ','ادعي')} للمرضى بالشفاء 🤲</small>`,up.concat([['حسنًا',null,'sec']]));return}
      go({x:HSP[0]-4.6,z:HSP[1],via:null},()=>{
        if(D.hv){card(`🏥 ${B('زرتَ','زرتِ')} المرضى اليوم ✔ وهم يدعون لك 🤲`,up.concat([['حسنًا',null,'sec']]));return}
        const visit=()=>{life.say(kid,'شفاك اللَّهُ وعافاك 🤲',3,2.4);setTimeout(()=>{D.hv=1;dsv();jewels(3);try{Aamal.grow('akhlaq')}catch(e){}
          card(`💐 ${B('زرتَ','زرتِ')} الطفل المريض ${B('وأهديتَه','وأهديتِه')} وردة ${B('ودعوتَ','ودعوتِ')} له بالشفاء، فابتسم 😊 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>زيارة المريض والدعاء له بالشفاء من الأعمال الصالحة، وتُدخل الفرح على قلبه 🤍</small>`,[['الحمد لله',refresh]])},1300)};
        card(`🏥 ${B('دخلتَ','دخلتِ')} ${L>=2?'المستشفى':'المستوصف'}… في إحدى الغرف طفلٌ مريض في سريره 🤒<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,
          [['💐 أزوره بوردة وأدعو له بالشفاء',visit],['🔊 ألعب وأضحك بصوت عالٍ',()=>card(`🤫 في المستشفى نتكلّم بهدوء حتى يرتاح المرضى… ما رأيك أن ${B('تزوره','تزوريه')}؟`,[['💐 أزوره وأدعو له',visit]]),'sec']].concat(up))})},
    fall(){const D=day(),F=life.faller;if(!F.visible||fallEsc||D.fall)return;
      go({x:-2.3,z:FALLP[1]-.8,via:null},()=>{life.say(F,'آخ… رجلي! 🤕',2.5,1);
        const help=()=>{life.say(kid,'لا تخف يا عمّ، أنا '+B('أساعدك','أساعدك')+' 🤝',2.6,2.4);setTimeout(()=>{fallEsc=1;kidSp=1.5;
          card(`🚶 ${B('تسند','تسندين')} الرجل ${B('وتمشي','وتمشين')} معه بهدوء إلى المستشفى 🏥`);
          go({x:HSP[0]-4.6,z:HSP[1],via:null},()=>{hosView();fallEsc=0;kidSp=4.2;busy=0;D.fall=1;dsv();F.visible=false;life.fallMk.visible=false;jewels(4);try{Aamal.grow('akhlaq')}catch(e){}
            card(`🏥 ${B('أوصلتَ','أوصلتِ')} الرجل إلى المستشفى، والطبيب يعالج رجله الآن 🩺 💎 +٤<br>قال لك: «جزاك اللَّهُ خيرًا يا ${B('ولدي','ابنتي')}» 🤲<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>مساعدة المصاب والمحتاج من أخلاق المسلم 🤍</small>`,[['الحمد لله',null]])});busy=1},1400)};
        card(`🤕 رجلٌ وقع في الشارع وتأذّت رجله، ولا يستطيع المشي وحده…<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,
          [['🤝 أسنده وأوصله إلى المستشفى',help],['أكمل طريقي',()=>card(`🤍 المسلم يساعد من يحتاج إليه… ${B('ساعده','ساعديه')} حتى يصل إلى المستشفى 🏥`,[['🤝 أسنده وأوصله',help]]),'sec']])})},
    sick(){const D=day();if(!sickDay()){card('🏠 جارك بخير والحمد لله 💚');setTimeout(()=>card(''),1800);return}
      if(D.sick){card('🤒 جارك يرتاح، ويدعو لك 🤲');setTimeout(()=>card(''),1800);return}
      go({x:4.8,z:NBZ,via:null},()=>card(`🤒 جارك مريض في فراشه اليوم…<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['🍎 أزوره بفاكهة وأدعو له',()=>{life.say(kid,'شفاك اللَّهُ وعافاك 🤲',3,2.4);
          setTimeout(()=>{D.sick=1;dsv();jewels(3);card(`🍎 ${B('زرتَ','زرتِ')} جارك ${B('ودعوتَ','ودعوتِ')} له بالشفاء، ففرح كثيرًا 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>زيارة المريض من حقّ المسلم على أخيه 🤍</small>`,[['الحمد لله',refresh]])},1300)}],['لاحقًا',null,'sec']]))},
    birds(){const D=day();if(!birdMonths()){card('🐦 العصافير تجد طعامها بنفسها في هذا الفصل… نطعمها في أيام البرد ❄️');setTimeout(()=>card(''),2400);return}
      if(D.bf){card('🐦 العصافير شبعانة اليوم 💚');setTimeout(()=>card(''),1800);return}
      go({x:-2.7,z:-3.1,via:null},()=>{busy=1;card(`🌾 ${B('تضع','تضعين')} الحَبّ للعصافير في البرد… انظر، إنها قادمة! 🐦`);const SP=S.userData.sparrows;if(SP)SP.on=24;
        setTimeout(()=>{busy=0;D.bf=1;dsv();jewels(2);card(`🐦 أكلت العصافير وزقزقت: شكرًا! 💎 +٢<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>في البرد يقلّ طعام الطيور، والرحمة بها من أخلاق المسلم 🤍</small>`,[['الحمد لله',null]])},3500)})},
    sadaqa(){const D=day();if(D.sdq){card(`💝 ${B('تصدّقتَ','تصدّقتِ')} اليوم، تقبّل اللَّهُ منك 🤲`);setTimeout(()=>card(''),2000);return}
      go(door('m'),()=>card(`💝 صندوق الصدقات عند باب الجامع… ما فيه يصل إلى الفقراء والمحتاجين<br><small>هل ${B('تتصدّق','تتصدّقين')} بجوهرة من جواهرك؟</small>`,[['🤲 أتصدّق بـ💎١',()=>{try{Deco.takeJ(1)}catch(e){}D.sdq=1;dsv();joyT=1.1;burst();showJ();try{Aamal.grow('akhlaq')}catch(e){}
          card(`💝 ${B('وضعتَ','وضعتِ')} جوهرة في الصندوق سرًّا، ولم يرَك أحد إلا اللَّه 🤲<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>«صدقة السرّ تطفئ غضب الربّ» — الصدقة تزيد المال بركة 🤍</small>`,[['الحمد لله',refresh]])}],['لاحقًا',null,'sec']]))},
    busStop(){const D=day(),st=BSTOP[1];go({x:-2.6,z:st[1]-1.6,via:null},()=>{if(D.bs){card(`🚌 موقف الباص… ننتظر بدورنا ونصعد بهدوء 🤍`);setTimeout(()=>card(''),2000);return}
      const give=()=>{D.bs=1;dsv();jewels(2);card(`🧓 ${B('أعطيتَ','أعطيتِ')} مقعدك لجدّو الكبير، فدعا لك: «اللَّه يحفظك» 💎 +٢<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>في الباص ننتظر بدورنا، ونصعد بهدوء، ونترك المقعد للكبير والمريض 🤍</small>`,[['الحمد لله',null]])};
      card(`🚌 ${B('صعدتَ','صعدتِ')} الباص ${B('وجلستَ','وجلستِ')}… ثم صعد رجل كبير في السنّ ولم يجد مقعدًا 🧓<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['🪑 أعطيه مقعدي',give],['أبقى جالسًا',()=>card(`🤍 الكبير يتعب من الوقوف… الأجمل أن ${B('تعطيه','تعطيه')} مقعدك`,[['🪑 أعطيه مقعدي',give]]),'sec']])})},
    moon(){const h=hijri();if(!h)return;const d=h.d,ph=d<=3?'هلال':d<=7?'هلال يكبر':d<=12?'القمر يكبر':d<=16?'بدر كامل 🌕':d<=22?'القمر يصغر':'هلال آخر الشهر';
      card(`🌙 هذا ${ph} — شهر <b>${HM[h.m-1]}</b><br>اليوم ${arn(d)} من الشهر الهجري<br><small>القمر يعلّمنا الشهور: يبدأ الشهر بهلال صغير، وفي منتصفه يصير بدرًا، ثم يصغر حتى يختفي 🤍</small>`,[['سبحان اللَّه 🤍',null]])},
    // ===== (v15.9) أماكن جديدة وأفعال «يحبّ مدينته» =====
    cafe(){const D=day();go({x:-4.9,z:36.6,via:null},()=>{if(night||sleeping){card('☕ مقهى الحيّ مغلق الآن… الجيران نائمون 🌙');setTimeout(()=>card(''),2200);return}
      if(D.cf){card(`☕ الجدّان يشربان الشاي ويدعوان لك: «اللَّهُ يحفظك${yaN()}» 🤍`);setTimeout(()=>card(''),2600);return}
      card(`☕ في مقهى الحيّ جدّان كبيران يشربان الشاي…<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['👋 السلام عليكم يا عمّي',()=>{life.say(kid,'السلام عليكم يا عمّي 👋',3,2.4);
        setTimeout(()=>{D.cf=1;dsv();jewels(1);try{Aamal.grow('akhlaq')}catch(e){}refresh();card(`<b style="color:#1fa463;font-size:19px">🌟 هذا عمل صالح!</b><br>قالا: «وعليكم السلام، هلا${yaN()}! اللَّهُ يحفظك» 🤍<br><small>احترام الكبار وتوقيرهم من أخلاق المسلم 💎 +١</small>`,[['الحمد لله',null]])},1200)}],
        ['🏃 أمرّ مسرعًا',()=>card(`🤍 الأجمل أن ${B('تسلّم','تسلّمي')} على الكبار ${B('وتبتسم','وتبتسمي')} لهم`,[['👋 السلام عليكم يا عمّي',()=>A.cafe()]]),'sec']])})},
    mashhoof(){card('🛶 هذا مشحوف! قارب أهل الأهوار في جنوب العراق، يدفعه صاحبه بعصا طويلة اسمها «المردي» 🌾<br><small>نحافظ على أنهارنا نظيفة، فالماء نعمة 💧</small>',[['حسنًا',null,'sec']])},
    clock(){const d=new Date(),np=nextPrayer();card(`🕰️ ساعة المدينة: الساعة الآن ${hm(d)}<br><small>الوقت نعمة من اللَّه، والمسلم يحافظ على وقته وصلاته ⏰${np&&np.t?`<br>🕌 الصلاة القادمة: ${PNAME[np.p]||''} ${hm(new Date(+np.t))}`:''}</small>`,[['حسنًا',null,'sec']])},
    gift(){const D=day();if(D.gf)return;const g=GIFTS[seed()%GIFTS.length];go({x:g[0]+(g[0]>0?-.7:.7),z:g[1],via:null},()=>{D.gf=1;dsv();jewels(5);refresh();
      card(`🎁 ${B('وجدتَ','وجدتِ')} هدية اليوم المخفية! 💎 +٥<br><small>${B('تعال','تعالي')} غدًا، ستُخبَّأ هدية جديدة في مكان آخر 🔍</small>`,[['🤍 الحمد لله',null]])})},
    giftHint(){const D=day();if(D.gf){card(`🎁 ${B('وجدتَ','وجدتِ')} هدية اليوم ✔<br><small>غدًا هدية جديدة في مكان آخر 🔍</small>`,[['حسنًا',null,'sec']]);return}const g=GIFTS[seed()%GIFTS.length];
      card(`🎁 هدية اليوم مخبّأة ${g[2]}<br><small>${B('ابحث','ابحثي')} عن صندوق أحمر صغير ${B('والمسه','والمسيه')} 🔍</small>`,[['🔍 '+B('دلّني','دلّيني'),()=>lookPt(g[0],g[1])],[B('سأبحث بنفسي','سأبحث بنفسي'),null,'sec']])},
    pet(){const P=PETS[PET.k];if(!P){card(`🐾 ${B('اختر','اختاري')} حيوانك الأليف: يمشي معك في المدينة، ${B('وتطعمه','وتطعميه')} كل يوم فيكبر 💚`,[['🐱 قطّة',()=>setPet('cat')],['🐦 عصفور',()=>setPet('bird')],['🐰 أرنب',()=>setPet('rab')],['لاحقًا',null,'sec']]);return}
      const fed=PET.d===today(),she=P[4]==='she',big=Math.min(10,PET.f|0);
      if(fed){card(`${P[0]} ${P[1]} ${she?'شبعانة':'شبعان'} اليوم ${she?'وسعيدة':'وسعيد'} 💚<br><small>${she?'كبرت':'كبر'} ${arn(big)} من ${arn(10)} · ${B('تعال','تعالي')} غدًا ${B('وأطعمه','وأطعميه')} من جديد</small>`,[['حسنًا',null],['🔄 '+B('غيّر','غيّري')+' حيواني',()=>{PET={};ptsv();A.pet()},'sec']]);return}
      card(`${P[0]} ${P[1]} ${she?'جائعة':'جائع'}… ${she?'تنظر':'ينظر'} إليك 🥺`,[[P[3]+' '+B('أطعم','أطعمي')+' '+P[1],()=>{PET.f=(PET.f|0)+1;PET.d=today();ptsv();jewels(2);petLook();
        life.say(petG,'💚',2,1.2);card(`${P[0]} ${she?'أكلت':'أكل'} ${P[1]} ${she?'وشكرتك':'وشكرك'} 💚 💎 +٢<br><small>الرحمة بالحيوان من أخلاق المسلم · ${she?'كبرت':'كبر'} ${arn(Math.min(10,PET.f))} من ${arn(10)}</small>`,[['الحمد لله',null]])}],['لاحقًا',null,'sec']])},
    paint(){const nm=k=>(CITY.st&&CITY.st[k])||{m:'الشارع الكبير',f:'شارع الجامع',b:'شارع الحديقة'}[k];
      card(`🎨 ${B('سمِّ','سمّي')} شوارع ${B('مدينتك','مدينتكِ')} ${B('ولوّن','ولوّني')} بيوت الجيران`,[['🪧 '+nm('m'),()=>A.st('m')],['🪧 '+nm('f'),()=>A.st('f')],['🪧 '+nm('b'),()=>A.st('b')],['🏠 بيت جدّو',()=>A.nbh('l')],['🏠 بيت الجار',()=>A.nbh('r',1)],['لاحقًا',null,'sec']])},
    st(k){const P={m:[-3.05,-1.9],f:[-8.6,5.75],b:[-8.6,-5.75]}[k];lookPt(P[0],P[1]);const n=kidN(),L=['شارع الرحمة','شارع النور','شارع الأمل','شارع الصدق','شارع الياسمين','شارع النخيل','شارع السلام','شارع الوفاء'];if(n)L.unshift('شارع '+n);
      setTimeout(()=>card(`🪧 ${B('اختر','اختاري')} اسمًا لهذا الشارع`,L.map(t=>[t,()=>{CITY.st=CITY.st||{};CITY.st[k]=t;csv();refresh();card(`🪧 صار اسمه «${t}» ✨`);setTimeout(()=>card(''),2000)}]).concat([['لاحقًا',null,'sec']])),500)},
    st_m(){A.st('m')},st_f(){A.st('f')},st_b(){A.st('b')},
    nbh(id,noSick){const D=day();if(id==='r'&&!noSick&&sickDay()&&!D.sick&&!night){A.sick();return}lookPt(id==='l'?-7:7,NBZ);
      setTimeout(()=>card(`🎨 ${B('اختر','اختاري')} لونًا ${id==='l'?'لبيت جدّو':'لبيت الجار'}`,HCN.map((t,i)=>[['🟫','🟩','🩷','🟦','🟨','🟪','🟧','⬜'][i]+' '+t,()=>{CITY.hc=CITY.hc||{};CITY.hc[id]=i;csv();refresh();card(`🎨 صار البيت ${t}! جميل 🤍`);setTimeout(()=>card(''),2000)}]).concat([['لاحقًا',null,'sec']])),500)},
    nbh_l(){A.nbh('l')},nbh_r(){A.nbh('r')},
    // ===== (v17.1) السياقة، معرض السيارات، سيارتي، المسبحان، بيوت الجيران =====
    drvs(){go({x:4.3,z:DRV[1]+4.2,via:null},()=>{if(CARS.lic){const has=(CARS.own||[]).length;card(`🪪 ${B('عندك','عندكِ')} رخصة سياقة ✔${has?'':'<br><small>جائزتك سيارة تنتظرك… بعمل صالح بصوتك 🎁</small>'}`,[[has?'🚗 إلى معرض السيارات':'🎁 استلم سيارتك',()=>has?follow(()=>A.showroom()):giftCar()],['🔁 راجع الدروس',()=>lesson(0),'sec'],['لاحقًا',null,'sec']]);return}
      card(`🚦 مدرسة تعليم السياقة: ${B('تعلّم','تعلّمي')} قواعد الطريق في ${arn(DL.length)} دروس قصيرة، ثم اختبار عملي في الساحة، ${B('وتأخذ','وتأخذين')} رخصة سياقة 🪪 وجائزة سيارة 🚙`,[['📘 ابدأ الدروس',()=>lesson(0)],['لاحقًا',null,'sec']])})},
    showroom(){go({x:5.3,z:SHOW[1],via:null},()=>openShow())},
    mycar(){if(!myCar){card(CARS.lic?'🎁 سيارتك جائزة تنتظرك في مدرسة تعليم السياقة':`🚦 ${B('تعلّم','تعلّمي')} السياقة أوّلًا في مدرسة تعليم السياقة، ${B('وخذ','وخذي')} سيارتك جائزة 🚙`,[['🚦 اذهب إليها',()=>follow(()=>A.drvs())],['لاحقًا',null,'sec']]);return}
      const side=!cS.pd&&Math.abs(cS.x)>2.3,to=cS.pd?{x:sign(cS.x)*2.5,z:cS.z+1.6,via:null}:side?{x:cS.x,z:cS.z-sign(cS.z)*.7,via:sign(cS.z)*4.6}:{x:(cS.x<0?-1:1)*2.5,z:cS.z,via:null};
      go(to,()=>card(`🚗 ${B('سيارتك','سيارتكِ')} ${CARL.find(c=>c[0]===CARS.cur)[2]}`,[['🚗 أسوق في المدينة',enterCar],['🎨 لون أو سيارة أخرى',()=>follow(()=>A.showroom()),'sec'],['لاحقًا',null,'sec']]))},
    poolB(){if(!boy()){card('🧕 هذا مسبح الأولاد 🤍 مسبح البنات المسقّف قريب منه',[['🏊 إلى مسبح البنات',()=>follow(()=>A.poolG())],['حسنًا',null,'sec']]);return}pool(1)},
    poolG(){if(boy()){card('🏊 هذا مسبح البنات 🤍 مسبح الأولاد بجانبه',[['🏊 إلى مسبح الأولاد',()=>follow(()=>A.poolB())],['حسنًا',null,'sec']]);return}pool(0)},
    pool(){boy()?A.poolB():A.poolG()},
    house(){card('🏠 بيت من بيوت جيرانك في الحيّ 🤍<br><small>الجار له حقّ: نسلّم عليه، ولا نزعجه، ونساعده إذا احتاج</small>');setTimeout(()=>card(''),2600)},
    // ===== (v16.9) أعمال جديدة (النصوص كتبها Claude والشيخ يراجعها): شيخ المكتبة، النجوم، حلقة القرآن، الطفل الضائع، جدّو، الحنفية، إفطار الصائم، العيدية، الشرطة، المحفظة، الكهرباء =====
    sheikh(){const D=day(),Sh=life.sheikh;if(!Sh.visible){card(`📜 شيخ المكتبة يجلس هنا في النهار… ${B('تعال','تعالي')} صباحًا 🌞`);setTimeout(()=>card(''),2200);return}
      go({x:-2.45,z:SHK[1]-.5,via:null},()=>{life.say(Sh,'السلام عليكم'+yaN()+' 📜',3,2.4);
        if(D.shq){card(`📜 الشيخ: بارك اللَّهُ فيك… ${B('تعال','تعالي')} غدًا لسؤال جديد من كتاب «أصول ديني الخمسة» 🤍`,[['إن شاء اللَّه',null]]);return}
        const q=qDay();if(!q){card('📜 الشيخ يقرأ في كتابه… 📖');setTimeout(()=>card(''),2000);return}
        const ok=()=>{D.shq=2;dsv();jewels(3);card(`📜 الشيخ: أحسنت ${B('يا بطل','يا بطلة')}! جوابك صحيح ✔ 💎 +٣<br><small>${B('تعال','تعالي')} غدًا لسؤال جديد 🤍</small>`,[['الحمد لله',refresh]])};
        const no=c=>{D.shq=1;dsv();jewels(1);card(`📜 الشيخ: لا بأس ${B('يا ولدي','يا ابنتي')} 🤍 الجواب الصحيح: <b>${c}</b> 💎 +١<br><small>${B('اقرأ','اقرئي')} الدرس في «📚 دروس الكتاب» ${B('وستعرفه','وستعرفينه')} جيدًا</small>`,[['حسنًا',refresh]])};
        let opts;if(q.t==='tf')opts=[['✔ صحيح',q.a===true?ok:()=>no('صحيح')],['✖ خطأ',q.a===false?ok:()=>no('خطأ')]];
        else{const ord=q.o.map((o,i)=>i),sd=seed();for(let i=ord.length-1;i>0;i--){const j=(sd>>>i)%(i+1);const tt=ord[i];ord[i]=ord[j];ord[j]=tt}opts=ord.map(i=>[q.o[i],i===q.a?ok:()=>no(q.o[q.a])])}
        card(`📜 شيخ المكتبة: سؤال اليوم من كتاب «أصول ديني الخمسة»${q.t==='tf'?' (صحيح أم خطأ؟)':''}<br><b style="font-size:17px">${q.q}</b>`,opts)})},
    stars(){const D=day();if(!night){card(`🔭 المنظار أمام بيتك في الليل… ${B('تعال','تعالي')} بعد المغرب ${B('لتنظر','لتنظري')} إلى النجوم ✨`);setTimeout(()=>card(''),2400);return}
      go({x:-3.3,z:3.1,via:null},()=>{const right=()=>{const f=!D.stg;D.stg=1;dsv();if(f)jewels(2);else{joyT=1.1;burst()}
          card(`✨ سبحان اللَّه! اللَّهُ الواحد خلق النجوم والقمر والسماء كلّها${f?' 💎 +٢':''}<br><small>كلّ شيء في الكون يدلّ على خالقٍ عظيمٍ واحد، وهذا هو التوحيد: أوّل أصول ديننا 🤍</small>`,[['سبحان اللَّه 🤍',refresh]])};
        card(`🔭 ${B('تنظر','تنظرين')} في المنظار… نجوم كثيرة لا نستطيع عدّها، وقمر منير ✨<br><small>مَن خلق هذه النجوم وزيّن بها السماء؟</small>`,[['🤲 اللَّهُ تعالى',right],['خلقت نفسها',()=>card('🤍 لا شيء يخلق نفسه… حتى البيت الصغير له بانٍ بناه',[['🤲 إذن خلقها اللَّه',right]]),'sec'],['صنعها الناس',()=>card('🤍 الناس لا يستطيعون أن يصنعوا نجمة واحدة!',[['🤲 إذن خلقها اللَّه',right]]),'sec']])})},
    halaqa(){const D=day();if(!(window.Madina&&Madina.st.lv.m)){card(`📖 حلقة القرآن تكون في الجامع… ${B('ابنِ','ابني')} الجامع أوّلًا 🕌`);setTimeout(()=>card(''),2400);return}
      if(!halaqaNow()){card(`📖 حلقة القرآن في الجامع كلّ يوم بعد صلاة المغرب… ${B('تعال','تعالي')} وقتها 🕌`);setTimeout(()=>card(''),2600);return}
      go(door('m'),()=>{const f=!D.hq;if(f){D.hq=1;dsv();jewels(3)}
        card(`📖 ${B('جلستَ','جلستِ')} في حلقة القرآن مع أطفال الحيّ بعد صلاة المغرب 🕌${f?' 💎 +٣':''}<br><small>الشيخ يقول: ${B('اقرأ','اقرئي')} معنا بصوتك، ومَن يحفظ آيةً يفرح بها 🤍</small>`,[['📖 أقرأ وأحفظ معهم',()=>closeTo(()=>{const b=document.getElementById('openHifz');b&&b.click()})],['لاحقًا',f?refresh:null,'sec']])})},
    lost(){const D=day();if(D.lost||lostS>0)return;go({x:-4.2,z:-36.6,via:null},()=>{life.say(life.lostKid,'ماما… أين أنتِ؟ 😢',3,1.6);
      const help=()=>{lostS=7;D.lost=1;dsv();jewels(3);try{Aamal.grow('akhlaq')}catch(e){}life.say(life.lostMom,'الحمد لله! وجدتُك يا حبيبي 🤍',4,2.3);
        card(`🤝 ${B('أخذتَ','أخذتِ')} الطفل إلى حارس البوابة فنادى على أمّه، فجاءت مسرعة وضمّته 🤍 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>وإذا ${B('ضعتَ','ضعتِ')} يومًا: ${B('قف','قفي')} مكانك، ${B('واطلب','واطلبي')} المساعدة من الحارس أو الشرطي، ولا ${B('تذهب','تذهبي')} مع غريب 👮</small>`,[['الحمد لله',null]])};
      card(`😢 طفل صغير يبكي عند بوابة مدينة الألعاب: «ضاعت ماما!»<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['🤝 آخذه إلى حارس البوابة',help],['أتركه وأذهب ألعب',()=>card(`🤍 هو خائف ووحيد… الأجمل أن ${B('تساعده','تساعديه')} حتى يجد أمّه`,[['🤝 أساعده',help]]),'sec']])})},
    grandpa(){const D=day(),eid=festNow()==='eid';go({x:-4.3,z:NBZ,via:null},()=>{
      if(eid&&!D.eid){D.eid=1;dsv();jewels(10);const give=()=>{try{Deco.takeJ(3)}catch(e){}D.eidg=1;dsv();joyT=1.1;burst();showJ();try{Aamal.grow('akhlaq')}catch(e){}
          card(`🤲 ${B('أعطيتَ','أعطيتِ')} الطفل 💎٣ من عيديتك، ففرح وقال: عيدك مبارك! 🎉<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>فرحة العيد تكبر حين نشارك غيرنا 🤍</small>`,[['الحمد لله',refresh]])};
        card(`🎉 عيد مبارك! ${B('زرتَ','زرتِ')} جدّو وأهلك فأعطوك العيدية 💎 +١٠<br><small>وفي الطريق طفلٌ محتاج ليس عنده عيدية… هل ${B('تعطيه','تعطينه')} من عيديتك؟</small>`,[['🤲 أعطيه 💎٣',give],['لاحقًا',refresh,'sec']]);return}
      const st=GST[seed()%GST.length],fr=wDay()===5,f=fr&&!D.gp;if(f){D.gp=1;dsv();jewels(3);try{Aamal.grow('akhlaq')}catch(e){}}
      card(`👴 جدّو فرح بزيارتك${fr?' يوم الجمعة':''} وحكى لك حكاية 🤍${f?' 💎 +٣':''}<br><small>${st}</small><br>ثم دعا لك: «اللَّهُ يحفظك ويجعلك من الصالحين» 🤲${fr?'':'<br><small>🕌 زيارة جدّو يوم الجمعة لها هدية خاصة</small>'}`,[['آمين 🤲',f?refresh:null]])})},
    leak(){const D=day();if(D.lk||!leakDay()){card('🚰 الحنفية مغلقة جيدًا… الماء محفوظ 💧');setTimeout(()=>card(''),1800);return}
      go({x:2.75,z:TAPP[1],via:null},()=>card(`🚰 الحنفية مفتوحة والماء ينزل ويضيع على الأرض 💧<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['🚰 أغلقها',()=>{D.lk=1;dsv();jewels(2);
        card(`🚰 ${B('أغلقتَ','أغلقتِ')} الحنفية ${B('وحفظتَ','وحفظتِ')} الماء 💎 +٢<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الماء نعمة من اللَّه، لا نسرف فيه ولو كان كثيرًا، ونغلق الحنفية دائمًا 🤍</small>`,[['الحمد لله',refresh]])}],['لاحقًا',null,'sec']]))},
    iftar(){const D=day();if(festNow()!=='ramadan'){card('🌴 مائدة إفطار الصائم تكون في شهر رمضان 🌙');setTimeout(()=>card(''),2200);return}
      if(D.ift){card(`🌴 ${B('وزّعتَ','وزّعتِ')} التمر اليوم، تقبّل اللَّهُ منك 🤲`);setTimeout(()=>card(''),2000);return}
      if(!iftarNow()){card('🌙 مائدة الإفطار تُفرش قرب الجامع قبل أذان المغرب بقليل…');setTimeout(()=>card(''),2400);return}
      go({x:IFT[0],z:4.4,via:4.6},()=>{busy=1;card(`🌴 ${B('توزّع','توزّعين')} التمر والماء على الصائمين في الطريق قبل الأذان… 🌙`);setTimeout(()=>{busy=0;D.ift=1;dsv();jewels(3);try{Aamal.grow('akhlaq')}catch(e){}
        card(`🌙 الصائمون أفطروا على تمرك وقالوا: تقبّل اللَّهُ منك 🤲 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>إفطار الصائم له أجرٌ عظيم عند اللَّه 🤍</small>`,[['الحمد لله',refresh]])},3500)})},
    police(){const D=day(),P=life.police;go({x:POL[0]-3.3,z:POL[1],via:null},()=>{
      if(D.wlc&&!D.wl){D.wl=1;dsv();jewels(3);try{Aamal.grow('akhlaq')}catch(e){}life.say(P,'شكرًا يا '+B('أمين','أمينة')+'! 👮',3,2.4);
        card(`👮 ${B('سلّمتَ','سلّمتِ')} المحفظة للشرطي، فاتّصل بصاحبها، فجاء فرحًا يدعو لك 🤲 💎 +٣<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الأمانة من أخلاق المسلم: ما ليس لنا نردّه إلى صاحبه 🤍</small>`,[['الحمد لله',refresh]]);return}
      life.say(P,'وعليكم السلام'+yaN()+' 👮',3,2.4);const f=!D.pol;if(f){D.pol=1;dsv();jewels(1)}
      card(`👮 مركز الشرطة: الشرطة يحفظون أمن المدينة ويساعدون الناس ليلًا ونهارًا${f?' 💎 +١':''}<br><small>${B('سلّمتَ','سلّمتِ')} على الشرطي ${B('وشكرتَه','وشكرتِه')}. إذا ${B('ضعتَ','ضعتِ')} أو ${B('احتجتَ','احتجتِ')} مساعدة ${B('فاطلبها','فاطلبيها')} من الشرطي 🤍</small>`,[['حسنًا',f?refresh:null]])})},
    wallet(){const D=day();if(D.wl||D.wlc)return;const [x,z]=WALLETS[seed()%WALLETS.length];
      const take=()=>{D.wlc=1;dsv();const W=S.userData.wallet;if(W)W.visible=false;card(`👛 ${B('أخذتَ','أخذتِ')} المحفظة… هيّا إلى مركز الشرطة 👮`);setTimeout(()=>follow(()=>A.police()),1000)};
      go({x,z,via:null},()=>card(`👛 ${B('وجدتَ','وجدتِ')} محفظة على الرصيف فيها نقود وبطاقة باسم صاحبها!<br><small>ماذا ${B('تفعل','تفعلين')}؟</small>`,[['👮 أسلّمها لمركز الشرطة',take],['آخذها لنفسي',()=>card('🤍 هذه ليست لنا… صاحبها حزين يبحث عنها، والأمانة أن نردّها',[['👮 أسلّمها للشرطة',take]]),'sec']]))},
    power(){const D=day();go({x:PWR[0]+6.6,z:PWR[1]+3.8,via:null},()=>{const ok=()=>{const f=!D.pw;D.pw=1;dsv();if(f)jewels(2);else{joyT=1.1;burst()}
        card(`💡 أحسنت! ${B('أطفأتَ','أطفأتِ')} المصباح الذي لا ${B('تحتاجه','تحتاجينه')}${f?' 💎 +٢':''}<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الكهرباء نعمة من اللَّه، وتوفيرها شكرٌ للنعمة، ويبقى منها لغيرنا 🤍</small>`,[['الحمد لله',f?refresh:null]])};
      card(`⚡ محطة الكهرباء: ألواح الشمس ☀️ ومراوح الريح 🌬️ تصنع الكهرباء لبيوت المدينة ومصابيحها<br><small>سؤال المهندس: ${B('خرجتَ','خرجتِ')} من غرفتك والمصباح ما زال مضاءً… ماذا ${B('تفعل','تفعلين')}؟</small>`,[['💡 أطفئه',ok],['أتركه مضاءً',()=>card(`🤍 المصباح المضاء بلا حاجة يضيّع الكهرباء… ${B('أطفئه','أطفئيه')} عند الخروج`,[['💡 أطفئه',ok]]),'sec']])})},
    library(){go(door('k'),()=>card(`📚 المكتبة: ${B('اقرأ','اقرئي')} ${B('وِردك','وِردكِ')} اليومي (٥ أسئلة) 📖`,[['📖 وِردي اليومي',()=>closeTo(()=>{const b=document.getElementById('openWird');b&&b.click()})],['لاحقًا',null,'sec']]))}};
  function reward(kind){const D=day();D.sl=D.sl|0;const give=D.sl<5;D.sl++;dsv();if(give)jewels(1);else{joyT=1.1;burst()}
    card(`<b style="color:#1fa463;font-size:19px">🌟 هذا عمل صالح!</b><br>${kind==='rd'?B('رددتَ','رددتِ'):B('ألقيتَ','ألقيتِ')} السلام${give?' 💎 +١':''}<br><small>${kind==='rd'?'ردّ السلام من آداب الإسلام الجميلة 🤍':'إفشاء السلام يزرع المحبة بين الناس 🤍'}</small>`,[['الحمد لله',null]])}
  function enter(f){busy=1;let k=0;const s=setInterval(()=>{k++;kid.scale.setScalar(KS*Math.max(0,1-k/10));if(k>=10){clearInterval(s);
    setTimeout(()=>{kid.scale.setScalar(KS);busy=0;f()},1500)}},40)}
  let drops=[];function splash(G){if(!G)return;for(let i=0;i<14;i++){const d=new T.Mesh(new T.SphereGeometry(.07,6,4),new T.MeshStandardMaterial({color:0x5fb0e6}));
      d.position.set(G.position.x+(Math.random()-.5)*1.4,2.8+Math.random(),G.position.z+(Math.random()-.5)*1.4);S.add(d);drops.push(d)}
    G.userData.grow=1}
  /* ---- زيارة مدن الأصدقاء (v11.2): 💎5 لكل صديق مرة في اليوم، حتى ٣ أصدقاء ---- */
  let V=null,vr=null,adm=null;const FV_J=5,FV_MAX=3;
  const fv=()=>{const D=day();D.fv=D.fv||{};return D.fv};
  const short=n=>String(n||'صديق').replace(/[<>&"]/g,'').slice(0,12);
  Object.assign(A,{
    async friends(){card('⏳ أبحث عن أصدقائك…');let f='off';try{f=await Madina.friends()}catch(e){}
      if(f==='off'||!Array.isArray(f)){card(`📡 زيارة مدن الأصدقاء تحتاج إنترنت`,[['حسنًا',null,'sec']]);return}
      if(!f.length){card(`👥 ما عندك أصدقاء بعد<br><small>${B('أضف','أضيفي')} صديقًا ثم ${B('زر','زوري')} مدينته ${B('وخذ','وخذي')} 💎</small>`,[['➕ أضف صديقًا',()=>closeTo(()=>window.OnlineAPI&&OnlineAPI.openAdd())],['لاحقًا',null,'sec']]);return}
      const v=fv(),n=Object.keys(v).length;
      card(`👥 ${B('اختر','اختاري')} صديقًا ${B('لتزور','لتزوري')} مدينته<br><small>كل زيارة لصديق جديد اليوم 💎${arn(FV_J)} (حتى ${arn(FV_MAX)} أصدقاء)</small>`,
        f.slice(0,6).map(r=>[`${v[r.id]?'✔':n<FV_MAX?'💎':'🏙️'} ${short(r.nick)}`,()=>A.visit(r)]).concat([['إلغاء',null,'sec']]));
      ui.card.querySelector('.row').style.flexWrap='wrap'},
    visit(r,byCar){if(drv&&carTrip){carTrip=0;carAway(r);return}carTrip=0;adm=null;vr=r;V={lv:Madina.fromCode(r.m||'00000'),f:r.f,u:r.u||'',nick:short(r.nick),flg:r.p&&r.p.flg};
      at=byCar?{x:-10.2,z:3.9,via:4.6}:{x:0,z:-15,via:null};kid.position.set(at.x,0,at.z);kid.visible=true;path=[];refresh();setBar();
      ui.msg.textContent=`🏙️ ${B('أنت','أنتِ')} الآن في مدينة ${V.nick} 🤍`;
      go({x:-2.6,z:1,via:null},()=>{const v=fv();
        const give=!v[r.id]&&Object.keys(v).length<FV_MAX;if(give){v[r.id]=1;dsv();jewels(FV_J)}
        card(`🤝 ${B('زرتَ','زرتِ')} ${V.nick} في ${B('مدينته','مدينته')}${give?` 💎 +${arn(FV_J)}`:''}<br><small>زيارة الصديق والجار وصلة الأرحام من الأخلاق الجميلة 🤍${!give&&v[r.id]?'<br>('+B('أخذتَ','أخذتِ')+' جواهر هذه الزيارة اليوم)':''}</small>`,
          [['🏡 ادخل بيته',()=>A.fhouse()],['🏙️ ارجع لمدينتي',()=>A.back()]])})},
    fhouse(){const r=vr;if(!r)return;closeTo(()=>{if(window.Deco&&Deco.visit)Deco.visit({id:r.id,h:r.h,p:r.p},()=>{show('bayt');Bayt.menu()})})},
    // (v18.4) 👑 المدير يدخل مدينة أي مشترك: يرى بناياته وبيته وسوره وحديقته ووسخ بيته، بلا جواهر ولا مهمّات
    aVisit(r){if(drv)leaveCar(1);adm=r;vr={id:r.id,h:r.h,p:r.p,nick:r.nick};V={lv:Madina.fromCode(r.m||'00000'),f:r.f|0||1,u:r.u||'',nick:short(r.nick),flg:r.flg,dt:r.dt|0};
      at={x:-2.6,z:6,via:null};kid.position.set(at.x,0,at.z);kid.visible=true;path=[];busy=0;refresh();setBar();try{cityView()}catch(e){}
      ui.msg.textContent=`👑 مدينة ${V.nick} · ${B('أنت','أنتِ')} تشاهدها كمدير`;setTimeout(()=>A.aInfo(),700)},
    aInfo(){const r=adm;if(!r||!V)return;const s=r.sm||{},lv=V.lv,P=Madina.PARTS,u=String(V.u||''),n=x=>arn(x|0),st=Madina.stageOf?Madina.stageOf(lv):null;
      const bl=Object.keys(P).map(k=>`${P[k].e}${(lv[k]|0)?'★'.repeat(lv[k]|0):'—'}`).join(' '),W=['لا سور','سور خشبي','سور حجري','سور رخامي'],G=['بلا حديقة','حديقة خضراء','ورود وممرّ','نافورة'],tr=[2,3,4].filter(i=>+u[i]>0).length,hp=+u[5]||0;
      card(`<b>👑 مدينة ${V.nick}</b>${st?` <small>· ${st[1]} ${st[0]}</small>`:''}<br><small style="line-height:1.8">${bl}${hp?` 🏥${'★'.repeat(hp)}`:''}<br>🏠 ${n(V.f)} ${V.f>2&&V.f<11?'طوابق':'طابق'} · 🧱 ${W[+u[0]||0]} · 🌳 ${G[+u[1]||0]} · 🍎 ${n(tr)}/٣
        ${r.sm?`<br>⭐ ${n(r.lv)} · 📚 ${n(s.st)}/٦ · 📖 ${n(s.hz)} سورة · 🤲 ${n(s.pr)} صلاة · 💎 ${n(s.j)}`:''}<br>${V.dt?`<b style="color:#8a5a2b">🧹 بيته متّسخ (${n(V.dt)} من ٤) — ${V.dt>=3?'منذ أيام بلا عمل صالح':'قلّت أعماله'}</b>`:'<b style="color:#1fa463">✨ بيته نظيف</b>'}</small>`,
        [V.dt?['🧹 نبّهه ينظّف',()=>{try{Idara.kidDo(r.id,'clean',r)}catch(e){}}]:['🌟 شجّعه',()=>{try{Idara.kidDo(r.id,'cheer',r)}catch(e){}}],['🎁 جائزة',()=>{try{Idara.gift(r.id,r.nick,r.av)}catch(e){}}],['🏡 بيته',()=>A.fhouse()],['🛡️ الإدارة',()=>A.aBack(),'sec']]);
      ui.card.querySelector('.row').style.flexWrap='wrap'},
    aBack(){const id=adm&&adm.id;adm=null;V=null;vr=null;try{ui.close()}catch(e){}if(id&&window.Idara&&Idara.card)setTimeout(()=>Idara.card(id),200)},
    back(){V=null;vr=null;adm=null;at={x:-3.4,z:1,via:null};kid.position.set(-3.4,0,1);path=[];refresh();setBar();card('');
      ui.msg.textContent=""}});
  const BAR_ME=ui.bar.innerHTML,BAR_V=`<button data-a="back"><b>🏙️</b>مدينتي</button><button data-a="fhouse"><b>🏡</b>ادخل بيته</button><button data-a="friends"><b>👥</b>صديق آخر</button>`;
  const BAR_A=`<button data-a="aBack"><b>🛡️</b>الإدارة</button><button data-a="aInfo"><b>📋</b>إنجازاته</button><button data-a="fhouse"><b>🏡</b>بيته</button>`;
  function setBar(){ui.bar.innerHTML=adm?BAR_A:V?BAR_V:BAR_ME;ui.bar.style.gridTemplateColumns=V?'repeat(3,1fr)':'';
    ui.bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping&&b.dataset.a!=="back"&&!adm){sleepCard();return}if(inSchool&&!V&&b.dataset.a!=='school'){schoolCard();return}const a=b.dataset.a;if(adm){A[a]();return}if(busy||path.length&&!wander)return;if(a==='back'||a==='friends'){if(foc&&a!=='back')cityView();A[a]();return}follow(()=>A[a]())});
    const p=prayerNow();if(!V&&p&&!day().pr[p])ui.bar.querySelector('[data-a=mosque]').classList.add('hot');try{if(V&&foc)cityView();hosLbl()}catch(e){}}
  // (v15.3) 🏥 زر المستشفى (يسار الشاشة): الكاميرا تطير وتعرض المستشفى بعرض الشاشة من جهة الشارع، ومرة ثانية «🏙️ مدينتي» ترجع للمدينة كلها
  const hosBtn=ui.hos,HOME={th:cam0.th,ph:cam0.ph,dist:cam0.dist};
  // (v15.4) صار زر «📍 الأماكن»: المستشفى ومدينة الألعاب، كلٌّ يُعرض بعرض الشاشة
  const VIEWS={hp:{P:[HSP[0]-1,1.8,HSP[1]+.6],th:-1.2,ph:.95,w:15},pk:{P:[PKC[0]+.5,2.6,PKC[1]],th:1.2,ph:1,w:18}};
  function viewAt(k){const v0=VIEWS[k],v=Object.assign({},v0,{P:[fX(v0.P[0]),v0.P[1],v0.P[2]]}),hf=Math.atan(Math.tan(22.5*Math.PI/180)*cam.aspect),d=Math.max(24,Math.min(MAXD,v.w/(2*Math.tan(hf))));fol=0;flyTo({c:v.P,l:v.P,th:v.th,ph:v.ph,dist:d});foc=k;hosLbl()}
  function hosView(){viewAt('hp')}
  function cityView(){fol=0;if(!foc)return;flyTo({c:C0,l:LK0,th:HOME.th,ph:HOME.ph,dist:HOME.dist});foc=null;hosLbl()}
  function hosLbl(){if(!hosBtn)return;hosBtn.hidden=!!V;let d=0;try{d=drv}catch(e){}hosBtn.innerHTML=d?'<b>🗺️</b>مشاويري':'<b>🗺️</b>إلى أين؟';hosBtn.classList.add('go');} // (v17.9) طلب الشيخ: لا زر «🏙️ مدينتي» — الزر دائمًا «إلى أين؟»، وعرض المدينة كلها صار مربّعًا في اللوحة
  // (v15.6) طلب الشيخ: الوصول إلى الأماكن صعب على الطفل → زر كبير «🗺️ إلى أين؟» يفتح لوحة صور لكل الأماكن،
  // يلمس الطفل المكان فيمشي إليه وحده (أسرع في الرحلات) والكاميرا تتبعه، ثم يبدأ العمل الصالح هناك
  function follow(f){if(busy)return;fol=1;fast=1;foc='kid';hosLbl();f();if(!path.length)fast=0}
  const PLACES=()=>[['🏡','بيتي',()=>go({x:-3.4,z:1,via:null},()=>tap({p:'home'}))],['🕌','الجامع',()=>A.mosque()],['🎒','مدرستي',()=>A.mySchool()],
    ['🏫','مدرسة القرآن',()=>A.school()],['📚','المكتبة',()=>A.library()],['🏥','المستشفى',()=>{if(hpLv()>0)A.hospital();else{hosView();setTimeout(()=>{try{Binaa.open('hp')}catch(e){}},700)}},1],
    ['🎡','مدينة الألعاب',()=>A.park(),1],['🛒','السوق',()=>card('🛒 أيّ دكّان؟',[...MKT.map(m=>[m[4],()=>follow(()=>A.mk(m[0]))]),['لاحقًا',null,'sec']])],
    ['🐄','المزرعة',()=>A.farm('any')],['🦆','البطّ في النهر',()=>A.ducks()],['🐑','المرعى',()=>A.sheep()],['⛲','النافورة',()=>A.plaza()],
    ['🔥','التنّور',()=>A.tannour()],['⚽','الملعب',()=>A.football()],['🚌','موقف الباص',()=>A.busStop()],
    ['👮','مركز الشرطة',()=>A.police()],['⚡','محطة الكهرباء',()=>A.power()],['📜','شيخ المكتبة',()=>A.sheikh()],['👴','بيت جدّو',()=>A.grandpa()],['📖','حلقة القرآن',()=>A.halaqa()],['🔭','النجوم',()=>A.stars()],
    ...(festNow()==='ramadan'?[['🌴','إفطار صائم',()=>A.iftar()]]:[]),
    ['🏙️','المدينة كلها',()=>{goBox.hidden=true;cityView()},1],['🏳️','علم مدرستي',()=>{try{Flag.pick(()=>{})}catch(e){}},1],['🚦','تعليم السياقة',()=>A.drvs()],['🚗','معرض السيارات',()=>A.showroom()],...(CARS.cur?[['🚙','سيارتي',()=>A.mycar()]]:[]),['🏊',B('مسبح الأولاد','مسبح البنات'),()=>A.pool()],
    ['☕','الدربونة القديمة',()=>A.cafe()],['🕰️','برج الساعة',()=>go({x:19.2,z:-.9,via:null},()=>A.clock())],['🐾','حيواني الأليف',()=>A.pet(),1],['🎨','سمِّ ولوّن',()=>A.paint(),1],['🖼️','ألبومي',()=>openAlbum(),1]];
  const goBox=document.createElement('div');goBox.className='m3go';goBox.hidden=true;ov.appendChild(goBox);
  const srN=t=>String(t||'').replace(/[\u064B-\u0652\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[^\u0600-\u06FFa-z0-9 ]/gi,' ').replace(/\s+/g,' ').trim().toLowerCase();
  // كلمات إضافية يبحث بها الطفل عن كل مكان
  const SKW={'بيتي':'البيت منزل دار','الجامع':'مسجد صلاة اذان','مدرستي':'المدرسة دراسة صف','مدرسة القرآن':'قران حفظ سور','المكتبة':'كتب وردي قراءة','المستشفى':'مرض طبيب دكتور اسعاف',
    'مدينة الألعاب':'العاب ملاهي دولاب حديقة','السوق':'خباز فاكهة حلويات دكان','المزرعة':'بقر دجاج حيوانات','البطّ في النهر':'بط نهر ماء','المرعى':'غنم خراف راعي','النافورة':'ماء حمام','التنّور':'خبز','الملعب':'كرة قدم رياضة',
    'موقف الباص':'باص حافلة','مركز الشرطة':'شرطي امن محفظة','محطة الكهرباء':'كهرباء طاقة شمس رياح','شيخ المكتبة':'شيخ سؤال كتاب','بيت جدّو':'جد جدي حكاية','حلقة القرآن':'قران حلقة','النجوم':'منظار سماء قمر',
    'تعليم السياقة':'سياقة سيارة رخصة قيادة','معرض السيارات':'سيارة سيارات شراء معرض','سيارتي':'سيارة اركب سوق قيادة','مسبح الأولاد':'مسبح سباحة ماء','مسبح البنات':'مسبح سباحة ماء','علم مدرستي':'علم دولة',
    'الدربونة القديمة':'مقهى شاي دربونة','برج الساعة':'ساعة وقت','حيواني الأليف':'قطة عصفور ارنب','سمِّ ولوّن':'الوان شارع اسم','المدينة كلها':'مدينتي منظر كامل','ألبومي':'صور كاميرا','إفطار صائم':'رمضان تمر افطار'};
  // (v18.2) مجموعات اللوحة: 1 أماكني · 2 المدينة · 3 ألعاب · 4 طبيعة · 5 أشيائي
  const GRP={'بيتي':1,'الجامع':1,'مدرستي':1,'مدرسة القرآن':1,'المكتبة':1,'حلقة القرآن':1,'شيخ المكتبة':1,'بيت جدّو':1,
    'السوق':2,'المستشفى':2,'مركز الشرطة':2,'موقف الباص':2,'الدربونة القديمة':2,'برج الساعة':2,'النافورة':2,'التنّور':2,'محطة الكهرباء':2,'إفطار صائم':2,
    'مدينة الألعاب':3,'الملعب':3,'مسبح الأولاد':3,'مسبح البنات':3,'تعليم السياقة':3,'معرض السيارات':3,'سيارتي':3,
    'المزرعة':4,'المرعى':4,'البطّ في النهر':4,'النجوم':4,'حيواني الأليف':4,
    'سمِّ ولوّن':5,'ألبومي':5,'علم مدرستي':5,'المدينة كلها':2};
  function openGo(){goBox.classList.remove('m3alb');const L=PLACES(),C=[['#dff5e3','#9fd3aa'],['#dcecff','#9dbde6'],['#ffe1ec','#e6a9bf'],['#fff3c4','#e3c56e'],['#ece3ff','#b9a6e6'],['#d9f5f1','#94d1c8']];
    const D=day(),tl=thirsty().filter(k=>!D.tr[k]).length,ll=litter().filter(k=>!D.lt[k]).length,sl=Math.min(5,D.sl|0);
    const TK=[['💧',B('اسقِ','اسقي')+' الأشجار العطشى',tl?`باقي ${arn(tl)} 🌳`:'كلها شربت اليوم ✔',!tl,()=>A.water(),'#dcf0ff','#93bfe6'],
      ['👋',B('سلّم','سلّمي')+' على جيرانك '+B('وردّ','وردّي')+' السلام',sl<5?`${arn(sl)} من ${arn(5)} اليوم`:'أكملتها اليوم ✔ (والسلام دائمًا جميل)',sl>=5,()=>A.salamNear(),'#dff5e3','#9fd3aa'],
      ['🧹',B('نظّف','نظّفي')+' الطريق',ll?`باقي ${arn(ll)} 🗑️`:'المدينة نظيفة ✔',!ll,()=>A.clean(),'#fff3c4','#e3c56e'],
      ['🎁',B('ابحث','ابحثي')+' عن هدية اليوم المخفية',D.gf?'وجدتها اليوم ✔':'صندوق أحمر صغير في مكانٍ ما 🔍',!!D.gf,()=>A.giftHint(),'#ffe1ec','#e6a9bf'],
      PETS[PET.k]?[PETS[PET.k][0],B('أطعم','أطعمي')+' '+PETS[PET.k][1],PET.d===today()?'شبعان اليوم ✔':'جائع ينتظرك 🥺',PET.d===today(),()=>A.pet(),'#ece3ff','#b9a6e6']
        :['🐾',B('اختر','اختاري')+' حيوانك الأليف','قطّة أو عصفور أو أرنب يمشي معك 💚',false,()=>A.pet(),'#ece3ff','#b9a6e6']];
    // (v16.9) مهمّات إضافية: سؤال شيخ المكتبة، والمحفظة الضائعة، والحنفية المفتوحة
    TK.push(['📜','سؤال شيخ المكتبة من الكتاب',D.shq?'أجبت اليوم ✔':'سؤال جديد كلّ يوم 📖',!!D.shq,()=>A.sheikh(),'#fff3c4','#e3c56e']);
    if(!night&&!D.wl)TK.push(['👛',D.wlc?B('سلّم','سلّمي')+' المحفظة للشرطة':'محفظة ضائعة على الرصيف',D.wlc?'هيّا إلى مركز الشرطة 👮':B('ابحث','ابحثي')+' عنها '+B('وردّها','وردّيها')+' لصاحبها',false,()=>D.wlc?A.police():A.wallet(),'#dcecff','#9dbde6']);
    if(leakDay()&&!D.lk)TK.push(['🚰','حنفية مفتوحة والماء يضيع','قرب سبيل الماء على الرصيف 💧',false,()=>A.leak(),'#d9f5f1','#94d1c8']);
    const hero=D.hero?`🌟 ${B('أنت','أنتِ')} بطل المدينة اليوم!`.replace('بطل',B('بطل','بطلة')):`🌟 ${B('أكمل','أكملي')} السقي والسلام والتنظيف ${B('لتصير','لتصيري')} ${B('بطل','بطلة')} المدينة اليوم`;
    const bl=`🌷 ${B('مدينتك','مدينتكِ')} أزهرت بـ ${arn(BLOOM.n|0)} ${(BLOOM.n|0)===1?'عمل صالح':'من أعمالك الصالحة'}`;
    // (v18.2) طلب الشيخ: «القائمة صارت كبيرة، اختصرها ورتّبها» → تبويبات صغيرة، كل تبويب يعرض مجموعة واحدة فقط
    const TABS=[['✅','مهمّاتي'],['🕌','أماكني'],['🏙️','المدينة'],['🎡','ألعاب'],['🌳','طبيعة'],['🎨','أشيائي']];
    let tab=0;try{tab=Math.min(5,+localStorage.getItem('usul5_m3tab')||0)}catch(e){}
    goBox.innerHTML=`<div class="in m3gt"><input class="srch" type="search" placeholder="🔍 ابحث: الشرطة، المسبح، جدّو…" aria-label="بحث"><div class="nores" hidden>🤍 ما وجدنا مكانًا بهذا الاسم… ${B('جرّب','جرّبي')} كلمة أخرى</div><div class="tabs">${TABS.map((t,i)=>`<button data-tab="${i}"><b>${t[0]}</b>${t[1]}</button>`).join('')}</div><div class="pane" data-p="0"><div class="st">${hero}<br><small>${bl}</small></div><div class="tk">${TK.map((t,i)=>`<button data-t="${i}" class="${t[3]?'ok':''}" style="--c:${t[5]};--d:${t[6]}"><b>${t[0]}</b><span>${t[1]}<small>${t[2]}</small></span><i>${t[3]?'✔':'◀'}</i></button>`).join('')}</div></div><div class="pane g" data-p="x">${L.map((p,i)=>`<button data-i="${i}" data-g="${GRP[p[1]]||2}" style="--c:${C[i%6][0]};--d:${C[i%6][1]}"><b>${p[0]}</b>${p[1]}</button>`).join('')}</div><div class="bot"><button class="lite">📱 ${liteOn()?'الوضع الخفيف ✔':'جهازي بطيء'}</button><button class="x">✖ إغلاق</button></div></div>`;
    goBox.hidden=false;card('');
    {const q=goBox.querySelector('.srch'),nr=goBox.querySelector('.nores'),tbs=goBox.querySelector('.tabs'),p0=goBox.querySelector('[data-p="0"]'),st=p0.querySelector('.st');
      const tiles=[...goBox.querySelectorAll('.g button[data-i]')],tks=[...goBox.querySelectorAll('.tk button')];
      const show=()=>{tbs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.tab===tab));p0.hidden=tab!==0;st.hidden=false;tks.forEach(b=>b.hidden=false);tiles.forEach(b=>b.hidden=+b.dataset.g!==tab);nr.hidden=true;tbs.hidden=false};
      tbs.onclick=e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();try{window.Bayt&&Bayt.sTap()}catch(x){}tab=+b.dataset.tab;try{localStorage.setItem('usul5_m3tab',tab)}catch(x){}show()};
      // 🔍 البحث يبحث في كل التبويبات معًا (بلا تشكيل، أ/إ/آ=ا، ة=ه، ى=ي)
      const doS=()=>{const v=srN(q.value);if(!v){show();return}let n=0;tbs.hidden=true;st.hidden=true;tiles.forEach(b=>{const p=L[+b.dataset.i],ok=srN(p[1]+' '+(SKW[p[1]]||'')).includes(v);b.hidden=!ok;if(ok)n++});
        tks.forEach(b=>{const ok=srN(b.textContent).includes(v);b.hidden=!ok;if(ok)n++});p0.hidden=!tks.some(b=>!b.hidden);nr.hidden=n>0};
      show();q.oninput=doS;q.onkeydown=e=>{if(e.key==='Enter'){const f=tiles.find(b=>!b.hidden)||tks.find(b=>!b.hidden);if(f&&q.value)f.click()}}}
    goBox.onclick=e=>{const b=e.target.closest('button');if(e.target===goBox||b&&b.classList.contains('x')){goBox.hidden=true;return}if(!b)return;
      if(b.classList.contains('lite')){try{localStorage.setItem(LKEY,liteOn()?'0':'1')}catch(x){}goBox.hidden=true;ui.close();setTimeout(()=>open(),120);return}
      try{window.Bayt&&Bayt.sTap()}catch(x){}goBox.hidden=true;const p=b.dataset.t!=null?[0,0,TK[+b.dataset.t][4]]:L[+b.dataset.i];if(sleeping){sleepCard();return}if(inSchool&&!(p&&p[3])){schoolCard();return}
      if(busy||path.length&&!wander){card('🚶 '+B('انتظر','انتظري')+' قليلًا حتى '+B('تصل','تصلي')+' 🙂');setTimeout(()=>card(''),1600);return}
      if(p[3]){p[2]();return}follow(p[2])}}
  // ===== (v17.1) 🚗 سيارة الطفل: يتعلّم السياقة ← رخصة ← سيارة بشرط عمل صالح بصوته ← يسوقها في شوارع المدينة =====
  // تسير السيارة في المسار الخارجي للشارع الرئيسي (x=±LX قديمًا = ±3.08 بعد التوسيع) وفي الشارعين الفرعيين z=±4.6،
  // تقف عند الإشارة الحمراء وخلف السيارات، وتدخل الشارع الرئيسي من الفرعي حين يقف السير. المس الشارع لتذهب، و«🅿️ انزل» لتنزل.
  const LX=1.578;let myCar=null,drv=0;const cS={x:-11,z:4.75,h:Math.PI/2,path:[],wait:0,park:1,said:0,pd:null,go:null,gw:0,sp:0,st:0};
  // (v17.6) طلب الشيخ: «السيارة تقف في الشارع وتسحقها السيارات» ← السيارة لا تقف في الشارع الرئيسي أبدًا:
  // مواقف 🅿️ خارج الشارع عند الأماكن (مدخل يعبر الرصيف)، والشارعان الفرعيان z=±4.6 (لا سير فيهما). «انزل» في الشارع = تذهب لأقرب موقف أوّلًا.
  const PADS={sc:{x:-4.75,z:-13},mk:{x:4.75,z:-27.75},pk:{x:-4.75,z:-28.85},hp:{x:4.75,z:43.7}};
  const SIDEP={home:{x:-11,z:4.6,side:1},m:{x:11,z:4.6,side:1},bl:{x:-12,z:-4.6,side:1},br:{x:12,z:-4.6,side:1}};
  if(!V)Object.values(PADS).forEach(p=>{const s=p.x<0?-1:1,G=new T.Group(),nc=Math.abs(fX(p.x)),asp=new T.MeshLambertMaterial({color:night?0x34363b:0x4a4d54}),wl=new T.MeshBasicMaterial({color:night?0xb8b8b8:0xffffff});
    const pl=(w,d,m,x,y,z)=>{const o=new T.Mesh(new T.PlaneGeometry(w,d),m);o.rotation.x=-Math.PI/2;o.position.set(x,y,z);o.receiveShadow=true;G.add(o);return o};
    pl(3.6,2.5,asp,0,.02,0);pl(S1-R1+.1,2.3,asp,-s*((S1+R1)/2-nc),.026,0);
    [-1.18,1.18].forEach(z=>pl(3.4,.09,wl,0,.03,z));pl(.09,2.45,wl,s*1.72,.03,0);
    const pole=new T.Mesh(new T.CylinderGeometry(.05,.06,2.2,6),new T.MeshLambertMaterial({color:0x4a4f5a}));pole.position.set(s*1.95,1.1,1.35);G.add(pole);
    const sg=textSprite(T,'🅿️ موقف','rgba(30,90,200,.95)','#ffffff');sg.scale.set(1.5,.33,1);sg.position.set(s*1.95,2.35,1.35);G.add(sg);
    G.position.set(p.x,0,p.z);G.userData.pad=1;life.g.add(G)});
  const KC={on:false,dir:1,z:0};
  function placeCar(){if(myCar){life.g.remove(myCar);myCar=null}if(V||!CARS.cur)return;const d=CARL.find(c=>c[0]===CARS.cur);if(!d)return;
    myCar=life.mkCar(CCOL[CARS.col|0][0],d[3]);myCar.userData.act='mycar';life.g.add(myCar);if(drv)return;cS.x=-11;cS.z=4.75;cS.h=Math.PI/2;cS.path=[];cS.park=1;cS.pd=null}
  // معرض السيارات: نماذج على المنصّات تدور ببطء، وسيارة التعليم في الساحة
  const shows=[];if(!V){[[-2.6,-1.5],[0,-1.5],[2.6,-1.5],[-1.3,1.6],[1.3,1.6]].forEach(([x,z],i)=>{const c=CARL[i],v=life.mkCar(CCOL[[0,1,0,2,0][i]][0],c[3]);v.position.set(SHOW[0]+x,.24,SHOW[1]+z);v.scale.multiplyScalar(.9);life.g.add(v);shows.push(v)})}
  const tCar=V?null:life.mkCar(0xffffff,'sedan');if(tCar){const sg=new T.Mesh(new T.BoxGeometry(.7,.3,.4),new T.MeshStandardMaterial({color:0xffd23f}));sg.position.set(0,1.42,0);tCar.add(sg);tCar.position.set(DRV[0]+4.6*1.12*.9,0,DRV[1]);life.g.add(tCar)}
  placeCar();
  const roadPt=(x,z)=>{if(Math.abs(Math.abs(z)-4.6)<2.2&&Math.abs(x)>2.3)return {x:Math.max(-15.5,Math.min(15.5,x)),z:sign(z)*4.6,side:1};return {x:0,z:Math.max(-280,Math.min(280,z)),side:0}};
  // driveTo(x,z) مكان في الشارع، أو driveTo(0,0,موقف) — الخروج من الموقف بالرجوع للخلف ثم انتظار فراغ في السير
  function driveTo(tx,tz,pad,go){const t=pad?{x:pad.x,z:pad.z,pad:!pad.side,side:!!pad.side}:roadPt(tx,tz),P=[];const cz=cS.z,onSide=!cS.pd&&Math.abs(cS.x)>2.3;
    if(cS.pd&&t.pad&&Math.abs(t.z-cz)<.3&&Math.abs(t.x-cS.x)<.3){}
    else if(onSide&&t.side&&Math.abs(t.z-cz)<.5&&sign(t.x)===sign(cS.x)){P.push([t.x,t.z])}
    else{const dir=t.z>=cz?1:-1,lx=dir*LX;
      if(cS.pd){const s=sign(cS.x);P.push([s*2.45,cz,'rev']);P.push([s*2.25,cz,'gap',dir])}else if(onSide)P.push([sign(cS.x)*2.45,cz,'in']);
      P.push([lx,cz+dir*.8]);
      if(t.pad){P.push([lx,t.z-dir*1.8]);P.push([sign(t.x)*2.45,t.z]);P.push([t.x,t.z,'park'])}
      else{P.push([lx,t.z-(t.side?dir*.9:0)]);if(t.side){P.push([sign(t.x)*2.45,t.z]);P.push([t.x,t.z])}}}
    cS.path=P;cS.park=0;cS.said=0;cS.go=go||null;cS.gw=0;if(P.length&&P[0][2]!=='rev'&&P[0][2]!=='gap')cS.pd=null;
    tgtM.position.set(fX(t.pad||t.side?t.x:LX*(t.z>=cz?1:-1)),.06,t.z);if(tgtM.parent!==S)S.add(tgtM);tgtK=1;if(!P.length&&go)setTimeout(go,50)}
  const trafNear=(z,dir)=>life.traffic.some(c=>c.v.visible&&c.dir===dir&&(c.v.userData.lane|0)===1&&(z-c.z)*dir>-2.5&&(z-c.z)*dir<9);
  // أقرب موقف (الأفضل أمام السيارة في اتجاه سيرها)
  function nearPark(){const L=Object.values(PADS).concat(Object.values(SIDEP)),dir=Math.cos(cS.h)>=0?1:-1;let b=null,bd=1e9;
    L.forEach(p=>{const dz=(p.z-cS.z)*dir,d=Math.abs(p.z-cS.z)+(dz<2.5?40:0);if(d<bd){bd=d;b=p}});return b}
  function carTick(dt,t){if(!myCar)return;KC.on=false;myCar.visible=!(drv&&camIn);
    if(!drv||!cS.path.length){myCar.position.set(cS.x,0,cS.z);myCar.rotation.y=cS.h;if(drv&&Math.abs(cS.x)<2.3){KC.on=true;KC.z=cS.z;KC.dir=Math.cos(cS.h)>=0?1:-1}return}
    const [tx,tz,fl]=cS.path[0],dx=tx-cS.x,dz=tz-cS.z,d=Math.hypot(dx,dz),main=Math.abs(cS.x)<2.3;let wait=false;
    const dirz=Math.abs(dz)>Math.abs(dx)?(dz>0?1:-1):0;
    if(main&&dirz){const L=sig();if(L!=='g')[-4.6,4.6].forEach(zc=>{const stop=zc-dirz*1.35,front=cS.z+dirz*1.4,ah=(stop-front)*dirz;if(ah>-.05&&ah<1.1&&!(L==='y'&&ah<.4))wait='light'});
      life.traffic.forEach(c=>{if(c.dir===dirz&&c.v.visible&&(c.v.userData.lane|0)===1){const gp=(c.z-cS.z)*dirz;if(gp>0&&gp<3.4)wait=wait||'car'}})}
    if(fl==='in'&&!main&&d<.35&&sig()!=='r')wait='light';
    if(fl==='gap'&&d<.35){cS.gw+=dt;if(cS.gw<6&&trafNear(cS.z,cS.path[0][3]))wait='gap'}
    if(wait){if(wait==='light'&&!cS.said){cS.said=1;life.say(myCar,'🚦 '+B('أقف','أقف')+' عند الإشارة الحمراء',3,2.2)}}
    else{cS.said=wait?cS.said:0;const rv=fl==='rev',vmax=rv?1.6:fl==='park'||!main?2.6:cS.go?6.2:runOn?5.6:4.2;cS.sp+=(vmax-cS.sp)*Math.min(1,dt*2.2);if(d<1.2&&(fl==='park'||cS.path.length===1))cS.sp=Math.min(cS.sp,1.2+d*2);
      const sp=cS.sp*dt,mv=Math.min(sp,d);if(d>1e-4){cS.x+=dx/d*mv;cS.z+=dz/d*mv;if(!rv){let a=Math.atan2(dx,dz)-cS.h;a=Math.atan2(Math.sin(a),Math.cos(a));const r=Math.max(-3.2*dt,Math.min(3.2*dt,a));cS.h+=r;cS.st+=((r/dt)*.35-cS.st)*Math.min(1,dt*6)}}
      if(d<=sp+1e-3){const last=cS.path.shift();if(!cS.path.length){cS.sp=0;cS.st=0;if(last&&last[2]==='park')cS.pd={x:cS.x,z:cS.z};const g=cS.go;cS.go=null;
        if(g)g();else{card(`🚗 ${B('وصلتَ','وصلتِ')}! ${B('المس','المسي')} الشارع ${B('لتذهب','لتذهبي')} لمكان آخر، أو «🗺️ مشاويري»`);setTimeout(()=>{if(drv)card('')},2200)}}}}
    if(wait){cS.sp=0;cS.st*=.9}
    myCar.position.set(cS.x,0,cS.z);myCar.rotation.y=cS.h;if(main){KC.on=true;KC.z=cS.z;KC.dir=dirz||(Math.cos(cS.h)>=0?1:-1)}}
  // (v17.6) أثناء السياقة: شريط سفلي بزرّين (🎥 الكاميرا / 🅿️ انزل)، وزر «🗺️ مشاويري» في مكان «إلى أين؟»
  const dbar=document.createElement('div');dbar.className='m3bar m3dbar';dbar.style.display='none';dbar.innerHTML='<button data-d="cam"></button><button data-d="park"><b>🅿️</b>انزل من السيارة</button>';ov.appendChild(dbar);
  const ck=document.createElement('div');ck.className='m3ck';ck.hidden=true;
  ck.innerHTML='<div class="dash"></div><svg class="whl" viewBox="-60 -60 120 120"><circle r="50" fill="none" stroke="#2b2b30" stroke-width="13"/><circle r="50" fill="none" stroke="#45454d" stroke-width="5"/><path d="M-46-8Q0-20 46-8M0 6V46" stroke="#2b2b30" stroke-width="11" fill="none" stroke-linecap="round"/><circle r="15" fill="#3a3a42"/><text y="6" text-anchor="middle" font-size="15">⭐</text></svg><div class="spd"></div>';ov.appendChild(ck);
  const CAMK='usul5_m3cam';let camIn=(()=>{try{return localStorage.getItem(CAMK)!=='0'}catch(e){return true}})(),ch=0,fov0=cam.fov;
  function dUI(){const on=!!drv;dbar.style.display=on?'':'none';ui.bar.style.display=on?'none':'';ck.hidden=!(on&&camIn);
    dbar.querySelector('[data-d=cam]').innerHTML=camIn?'<b>🛰️</b>شاهد من فوق':'<b>🎥</b>من داخل السيارة';if(on)ch=cS.h;
    if(!(on&&camIn)){ckLbl(0);if(cam.fov!==fov0){cam.fov=fov0;cam.updateProjectionMatrix()}}try{hosLbl()}catch(e){}}
  dbar.querySelectorAll('button').forEach(b=>b.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(b.dataset.d==='park'){leaveCar();return}
    camIn=!camIn;try{localStorage.setItem(CAMK,camIn?'1':'0')}catch(e){}fol=1;foc='kid';dUI()});
  // الكاميرا من مقعد السائق (يسار السيارة) تنظر إلى الأمام، والسيارة نفسها مخفية فلا تحجب الطريق
  // اللافتات الكبيرة (أسماء الأماكن) تُخفى في منظر السائق لأنها تملأ الشاشة، وترجع حين يخرج منه
  let ckS=null,ckL=[];function ckLbl(on){if(on){if(ckS===S)return;ckLbl(0);ckS=S;S.traverse(o=>{if(o.isSprite&&o.visible&&o.scale.x>2.2){o.visible=false;ckL.push(o)}})}else{ckL.forEach(o=>o.visible=true);ckL=[];ckS=null}}
  function cockpit(dt){ckLbl(1);let a=cS.h-ch;a=Math.atan2(Math.sin(a),Math.cos(a));ch+=a*Math.min(1,dt*5);const fx=Math.sin(ch),fz=Math.cos(ch),X=fX(cS.x),Z=cS.z,o=.3;
    if(cam.fov!==64){cam.fov=64;cam.updateProjectionMatrix()}cam.position.set(X+fz*o-fx*.15,1.08,Z-fx*o-fz*.15);cam.lookAt(X+fx*14+fz*o,.8,Z+fz*14-fx*o);
    const w=ck.querySelector('.whl');w.style.transform=`translateX(-50%) rotate(${Math.max(-140,Math.min(140,-cS.st*90)).toFixed(1)}deg)`;ck.querySelector('.spd').textContent=`${arn(Math.round(cS.sp*9))} كم/س`}
  // 🗺️ مشاويري بالسيارة: يختار الطفل المكان فتسوق السيارة وحدها إليه، تقف في موقفه، ينزل ويكمل مشيًا
  const CTRIP=()=>[['🏡','بيتي',SIDEP.home,()=>go({x:-3.4,z:1,via:null},()=>tap({p:'home'}))],['🕌','الجامع',SIDEP.m,()=>A.mosque()],['🎒','مدرستي',PADS.sc,()=>A.mySchool()],
    ['🛒','السوق',PADS.mk,()=>card('🛒 أيّ دكّان؟',[...MKT.map(m=>[m[4],()=>follow(()=>A.mk(m[0]))]),['لاحقًا',null,'sec']])],['🎡','مدينة الألعاب',PADS.pk,()=>A.park()],
    ...(hpLv()>0?[['🏥','المستشفى',PADS.hp,()=>A.hospital()]]:[])];
  function trips(){if(!drv)return;card(`🗺️ إلى أين ${B('تذهب','تذهبين')} بالسيارة؟`,CTRIP().map(([e,n,p,f])=>[`${e} ${n}`,()=>{life.say(myCar,`🚗 إلى ${n}`,2.5,2.2);fol=1;foc='kid';
      driveTo(0,0,p,()=>{leaveCar();setTimeout(()=>follow(f),350)})}]).concat([['👥 مدينة صديق',()=>{carTrip=1;A.friends()}],['لاحقًا',null,'sec']]));ui.card.querySelector('.row').style.flexWrap='wrap'}
  let carTrip=0;
  // إلى مدينة صديق: السيارة تخرج من المدينة في الشارع الطويل، ثم تظهر واقفة قرب بيت الصديق
  const fade=document.createElement('div');fade.className='m3fade';fade.hidden=true;ov.appendChild(fade);
  function carAway(r){card('');life.say(myCar,`🚗 إلى مدينة ${short(r.nick)}`,3,2.2);fol=1;foc='kid';driveTo(0,Math.min(cS.z,0)-38,null,()=>{
    fade.innerHTML=`<div>🚗 ${B('في الطريق','في الطريق')} إلى مدينة ${short(r.nick)}…</div>`;fade.hidden=false;fade.style.opacity=0;requestAnimationFrame(()=>fade.style.opacity=1);
    setTimeout(()=>{drv=0;cS.path=[];cS.go=null;cS.sp=0;cS.pd=null;cS.park=1;cS.x=-11;cS.z=4.6;cS.h=Math.PI/2;dUI();A.visit(r,1);fade.style.opacity=0;setTimeout(()=>fade.hidden=true,700)},1300)})}
  function enterCar(){if(!myCar||busy)return;if(V){A.back();return}drv=1;kid.visible=false;path=[];wander=false;manual=1;fol=1;foc='kid';nearBtn.hidden=true;salBtn.hidden=true;cS.sp=0;
    if(cS.park&&!cS.pd&&Math.abs(cS.x)>2.3){cS.z=sign(cS.z)*4.6}dUI();
    card(`🚗 ${B('لبستَ','لبستِ')} حزام الأمان ✔ ${B('اختر','اختاري')} مشوارك، أو ${B('المس','المسي')} الشارع ${B('لتذهب','لتذهبي')} إليه 🚦`,[['🗺️ مشاويري',trips],['حسنًا',null,'sec']])}
  // النزول: لا تقف السيارة في الشارع الرئيسي أبدًا ← تذهب إلى أقرب موقف ثم ينزل الطفل على الرصيف (force: فورًا، للنوم أو المشي)
  function leaveCar(force){if(!drv)return;const main=!cS.pd&&Math.abs(cS.x)<2.3;
    if(main||(cS.path.length&&!cS.pd&&Math.abs(Math.abs(cS.z)-4.6)>1)){const p=nearPark();
      if(!force){card(`🅿️ ${B('السائق','السائقة')} لا يوقف سيارته في الشارع… نذهب إلى أقرب موقف`);setTimeout(()=>card(''),2600);driveTo(0,0,p,()=>leaveCar());return}
      cS.x=p.x;cS.z=p.z;cS.h=p.side?(p.x<0?Math.PI/2:-Math.PI/2):(p.x<0?-Math.PI/2:Math.PI/2);cS.pd=p.side?null:{x:p.x,z:p.z}}
    drv=0;cS.path=[];cS.go=null;cS.park=1;cS.sp=0;cS.st=0;let kx,kz;
    if(cS.pd){kx=sign(cS.x)*2.5;kz=cS.z+1.6}else{cS.z=sign(cS.z)*4.6;kx=cS.x;kz=cS.z-sign(cS.z)*.7}
    kid.position.set(kx,0,kz);kid.visible=!sleeping;at=here();path=[];card('');dUI()}
  // مربّع العمل الصوتي (الصلاة على النبي وآله / التسبيح) — Voice.counter من sawt.js
  function voiceDeed(D,n,title,done){const o=document.createElement('div');o.className='m3go';
    o.innerHTML=`<div class="in"><h4>${title}</h4><div class="st">${B('قل','قولي')} بصوتك ${arn(n)} ${n>10?'مرّة':'مرّات'}:<br><b style="font-size:19px">${D.p}</b></div><div class="m3vc"></div><button class="x">لاحقًا</button></div>`;ov.appendChild(o);
    let vc=null;const end=()=>{try{vc&&vc.stop()}catch(e){}o.remove()};o.querySelector('.x').onclick=end;
    try{vc=Voice.counter(o.querySelector('.m3vc'),{phrase:D.p,target:n,emoji:D.e,onDone:k=>{vc=null;try{Aamal.add(D.k,k);Aamal.grow(D.k)}catch(e){}setTimeout(()=>{end();done()},700)}})}catch(e){end();done()}}
  // الاختبار العملي: سيارة التعليم تلفّ حول المسار، وعند علامة «قف» يختار الطفل
  let prac=null;function pracTick(dt){if(!prac||!tCar)return;const P=prac;if(P.hold)return;P.a+=dt*.75;const a=P.a,rx=4.6*1.12*.9,rz=4.1*.97;
    tCar.position.set(DRV[0]+Math.cos(a)*rx,0,DRV[1]+Math.sin(a)*rz);tCar.rotation.y=Math.atan2(-Math.sin(a)*rx,Math.cos(a)*rz);
    if(!P.st&&a>Math.PI*1.45){P.st=1;P.hold=1;const ok=()=>{P.hold=0;card(`🛑 ${B('وقفتَ','وقفتِ')} تمامًا ثم ${B('أكملتَ','أكملتِ')} بحذر ✔`);setTimeout(()=>card(''),1600)};
      card(`🛑 أمامك علامة «قف»! ماذا ${B('تفعل','تفعلين')}؟`,[['🛑 أقف تمامًا ثم أكمل',ok],['أكمل بسرعة',()=>card(`🤍 علامة «قف» تعني: نقف تمامًا وننظر يمينًا ويسارًا`,[['🛑 أقف',ok]]),'sec']])}
    if(a>=Math.PI*2.5){prac=null;tCar.position.set(DRV[0]+4.6*1.12*.9,0,DRV[1]);tCar.rotation.y=0;kid.visible=true;busy=0;
      CARS.lic=1;crsv();jewels(5);try{Aamal.grow('akhlaq')}catch(e){}
      card(`🪪 مبروك! ${B('نجحتَ','نجحتِ')} في اختبار السياقة، وهذه رخصتك${yaN()} 💎 +٥<br><small>${B('السائق','السائقة')} الأمين يحفظ نفسه والناس 🤍</small>`,[['🎁 استلم جائزتك: سيارة',()=>giftCar()]])}}
  function giftCar(){voiceDeed(VSAL,10,'🎁 جائزتك سيارة… بشرط عمل صالح بصوتك',()=>{CARS.own=['c1'];CARS.cur='c1';CARS.col=CARS.col|0;crsv();jewels(5);placeCar();refresh();
    card(`🚙 مبروك! سيارتك واقفة في الشارع قرب ${B('بيتك','بيتكِ')} 🏡<br><small>${B('المسها','المسيها')} ${B('واركبها','واركبيها')}، ${B('وسُق','وسوقي')} في شوارع المدينة ${B('والتزم','والتزمي')} بالإشارة 🚦</small>`,[['🚗 خذني إليها',()=>follow(()=>A.mycar())],['حسنًا',null,'sec']])})}
  const DL=[['🔒 أوّل شيء نفعله حين نركب السيارة؟','نلبس حزام الأمان','نشغّل الأغاني بصوت عالٍ','حزام الأمان يحمينا بإذن اللَّه في الطريق.'],
    ['🚦 صارت الإشارة حمراء… ماذا يفعل السائق؟','يقف وينتظر الضوء الأخضر','يُسرع حتى يلحق','نحترم الإشارة لأنها تحفظ أرواح الناس.'],
    ['🚸 ناسٌ يعبرون من ممرّ المشاة…','أقف وأنتظرهم حتى يعبروا','أضرب المنبّه ليُسرعوا','الماشي له حقّ الطريق، والرفق بالناس من أخلاق المسلم.'],
    ['🏫 قرب المدرسة وفيها أطفال…','أمشي على مهل وأنتبه','أمشي بسرعة','قرب المدارس والبيوت نمشي ببطء شديد.'],
    ['📱 وأنت تسوق رنّ الهاتف…','لا أنشغل به حتى أقف','أردّ وأكتب رسالة','الانتباه للطريق أمانة.']];
  function lesson(i){if(i>=DL.length){card(`📘 ${B('أنهيتَ','أنهيتِ')} الدروس! الآن الاختبار العملي في الساحة 🚗<br><small>${B('اركب','اركبي')} سيارة التعليم ${B('ولفّ','ولفّي')} حول المسار</small>`,[['🚗 ابدأ الاختبار',()=>{busy=1;kid.visible=false;lookPt(DRV[0],DRV[1]);prac={a:Math.PI*.5}}]]);return}
    const L=DL[i],ok=()=>card(`✔ ${L[3]}`,[['التالي ◀',()=>lesson(i+1)]]),no=()=>card(`🤍 ليس هكذا… ${L[3]}`,[['🔁 أعد',()=>lesson(i)]]);
    const op=[[L[1],ok],[L[2],no,'sec']];if((seed()+i)%2)op.reverse();card(`📘 الدرس ${arn(i+1)} من ${arn(DL.length)}<br><b style="font-size:17px">${L[0]}</b>`,op)}
  // 🏊 المسبح: آداب المسبح، ثم يسبح الولد في المسبح المكشوف، والبنت تدخل مسبحها المسقّف (💎2 مرة في اليوم)
  function pool(b){const D=day(),Pc=b?POOLB:POOLG;if(night||sleeping||!poolOpen()){card(`🏊 المسبح مغلق الآن… يفتح من ٩ صباحًا إلى ٧ مساءً${rainNow()?'، وليس وقت المطر 🌧️':''}`);setTimeout(()=>card(''),2400);return}
    go({x:-4.3,z:Pc[1],via:null},()=>{const swim=()=>{busy=1;const f=!D.pool;
        const fin=()=>{busy=0;kid.visible=true;kid.position.set(-4.3,0,Pc[1]);at=here();if(f){D.pool=1;dsv();jewels(2)}else{joyT=1.1;burst()}
          card(`🏊 ${B('سبحتَ','سبحتِ')} وفرحت 😊${f?' 💎 +٢':''}<br><b style="color:#1fa463;font-size:18px">🌟 هذا عمل صالح!</b><br><small>الرياضة تقوّي الجسم، والجسم أمانة من اللَّه نحافظ عليه 🤍</small>`,[['الحمد لله',f?refresh:null]])};
        if(b){kid.position.set(-9.6,-.62,Pc[1]);let k=0;const iv=setInterval(()=>{k++;kid.position.x=-9.6+Math.sin(k*.08)*1.6;kid.position.y=-.62+Math.sin(k*.4)*.04;kid.rotation.y=Math.cos(k*.08)>0?Math.PI/2:-Math.PI/2;if(k>=90){clearInterval(iv);kid.position.y=0;fin()}},50)}
        else{kid.visible=false;card('🧕 مسبح البنات مسقّف ومستور… '+B('تسبح','تسبحين')+' براحتك 💦');setTimeout(fin,3800)}};
      card(`🏊 ${b?'مسبح الأولاد':'مسبح البنات'}: قبل السباحة… ماذا ${B('تفعل','تفعلين')}؟`,[['🛟 أسمع كلام المنقذ وأسبح في المكان المناسب لعمري',swim],['أركض حول المسبح وأدفع أصحابي',()=>card(`🤍 الأرض مبلّلة وزلقة، والدفع خطر… نمشي بهدوء ونسمع كلام المنقذ`,[['🛟 حسنًا، أسمع الكلام',swim]]),'sec']])})}
  // 🚗 لوحة المعرض: السيارات وأثمانها بالأعمال الصالحة الصوتية، وألوان مجانية
  function openShow(){goBox.classList.add('m3alb');const own=CARS.own||[],C=[['#dff5e3','#9fd3aa'],['#dcecff','#9dbde6'],['#ffe1ec','#e6a9bf'],['#fff3c4','#e3c56e'],['#ece3ff','#b9a6e6']];
    goBox.innerHTML=`<div class="in"><h4>🚗 معرض السيارات</h4><div class="st">${CARS.lic?'السيارة هنا لا تُشترى بالجواهر… تُشترى بعملٍ صالح بصوتك 🤍':'🪪 '+B('تعلّم','تعلّمي')+' السياقة أوّلًا في مدرسة تعليم السياقة'}</div>
      <div class="g" style="grid-template-columns:repeat(2,1fr)!important">${CARL.map((c,i)=>{const o=own.includes(c[0]),cu=CARS.cur===c[0];return `<button data-c="${i}" style="--c:${C[i][0]};--d:${C[i][1]}"><b>${c[1]}</b>${c[2]}<small style="display:block;font-size:12px;color:#4b5b52">${cu?'✔ '+B('تقودها','تقودينها')+' الآن':o?'✔ لك · '+B('اخترها','اختاريها'):(i===0?'🎁 جائزة الرخصة':`${c[4].e} ${c[4].n} ×${arn(c[5])}`)}</small></button>`}).join('')}</div>
      ${own.length?`<h5 style="margin:10px 0 6px">🎨 لون سيارتك (مجّانًا)</h5><div class="r" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${CCOL.map((c,i)=>`<button data-k="${i}" aria-label="${c[1]}" style="width:36px;height:36px;border-radius:50%;border:3px solid ${(CARS.col|0)===i?'#1fa463':'#fff'};background:#${c[0].toString(16).padStart(6,'0')};box-shadow:0 3px 0 #0003"></button>`).join('')}</div>`:''}
      <button class="x">✖ إغلاق</button></div>`;
    goBox.hidden=false;card('');
    goBox.onclick=e=>{const b=e.target.closest('button');if(e.target===goBox||b&&b.classList.contains('x')){goBox.hidden=true;goBox.classList.remove('m3alb');return}if(!b)return;try{window.Bayt&&Bayt.sTap()}catch(x){}
      if(b.dataset.k!=null){CARS.col=+b.dataset.k;crsv();placeCar();openShow();return}
      const c=CARL[+b.dataset.c];if(!CARS.lic){goBox.hidden=true;card(`🪪 ${B('تعلّم','تعلّمي')} السياقة أوّلًا، ${B('وخذ','وخذي')} رخصتك من مدرسة تعليم السياقة 🚦`,[['🚦 اذهب إليها',()=>follow(()=>A.drvs())],['لاحقًا',null,'sec']]);return}
      if(own.includes(c[0])){CARS.cur=c[0];crsv();placeCar();openShow();return}
      if(c[0]==='c1'){goBox.hidden=true;giftCar();return}
      goBox.hidden=true;voiceDeed(c[4],c[5],`${c[1]} ${c[2]}: ثمنها عمل صالح بصوتك`,()=>{CARS.own=own.concat([c[0]]);CARS.cur=c[0];crsv();placeCar();jewels(3);refresh();
        card(`${c[1]} مبروك! «${c[2]}» صارت ${B('لك','لكِ')}، وهي واقفة قرب ${B('بيتك','بيتكِ')} 🏡<br><small>ثمنها عمل صالح ${B('قلته','قلتِه')} بصوتك، تقبّل اللَّهُ منك 🤲</small>`,[['🚗 خذني إليها',()=>follow(()=>A.mycar())],['حسنًا',null,'sec']])})}}
  // ===== (v17.0) طلب الشيخ: الطفل يحرّك نفسه بلمس الأرض =====
  // يلمس الطفل الأرض فتمشي الشخصية إلى هناك (والكاميرا تتبعها). الشارع لا يُعبر إلا من ممرّ المشاة وبالضوء الأخضر (من go)،
  // والبنايات تحجز الطريق (صناديق OB) فيلتفّ حولها، ومن يقترب من مكان فيه عمل صالح يظهر زر كبير «👋 سلّم / 🤝 ساعد…».
  let OB=null,OBm=new Map(),manual=0,runOn=0;
  const NOOB=/^(house|parents|halaqa|grandpa|wallet|stars|busStop|leak|sadaqa|birds|gift|iftar|moon|sick|lost|fall|mashhoof|clock|st_.*|nbh_.*|bn_.*|mk_.*)$/;
  function obst(){OB=[];OBm=new Map();S.updateMatrixWorld(true);const bb=new T.Box3();
    const take=o=>{const u=o.userData||{};if(!(u.p||u.act||u.fk==='any'))return;if(u.act&&NOOB.test(u.act))return;const B=new T.Box3();
      o.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||!m.geometry||m.material&&m.material.transparent&&m.material.opacity<.5)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();bb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);if(bb.max.y-bb.min.y>.04)B.union(bb)});
      if(B.isEmpty()||B.max.y<.7)return;let x0=fXi(B.min.x)+.35,x1=fXi(B.max.x)-.35,z0=B.min.z+.35,z1=B.max.z-.35;
      if(u.act==='power'){x0=PWR[0]-7;x1=PWR[0]+6.3;z0=PWR[1]-7;z1=PWR[1]+7} // السياج فقط (لا الأبراج والمراوح)
      if(x1>0&&x0<3.05)x0=3.05;if(x0<0&&x1>-3.05)x1=-3.05;if(x1-x0<.4||z1-z0<.4||(x1-x0)*(z1-z0)<1.2)return;const b=[x0,x1,z0,z1,u];OB.push(b);OBm.set(u,b)};
    S.children.forEach(take);life.g.children.forEach(o=>{if(o.userData&&o.userData.act==='park')take(o)});HOUSES.forEach(h=>OB.push([h[0]-2.3,h[0]+2.3,h[1]-2.5,h[1]+2.5,{act:'house'}]))}
  const obIn=(x,z,m)=>{m=m||0;if(!OB)obst();return OB.find(b=>x>b[0]-m&&x<b[1]+m&&z>b[2]-m&&z<b[3]+m)};
  function segHit(x0,z0,x1,z1){const n=Math.max(4,Math.ceil(Math.hypot(x1-x0,z1-z0)/.4));for(let i=1;i<n;i++){const k=i/n,b=obIn(x0+(x1-x0)*k,z0+(z1-z0)*k,.15);if(b&&!(x0>b[0]&&x0<b[1]&&z0>b[2]&&z0<b[3])&&!(x1>b[0]&&x1<b[1]&&z1>b[2]&&z1<b[3]))return b}return null}
  function detour(){for(let pass=0;pass<4;pass++){let ch=0;let px=kid.position.x,pz=kid.position.z;
      for(let i=0;i<path.length;i++){const [x1,z1]=path[i],b=segHit(px,pz,x1,z1);
        if(b){const m=.75,hz=Math.abs(x1-px)>=Math.abs(z1-pz),opts=hz?[[[px,b[2]-m],[x1,b[2]-m]],[[px,b[3]+m],[x1,b[3]+m]]]:[[[b[0]-m,pz],[b[0]-m,z1]],[[b[1]+m,pz],[b[1]+m,z1]]];
          const ln=o=>Math.hypot(o[0][0]-px,o[0][1]-pz)+Math.hypot(o[1][0]-o[0][0],o[1][1]-o[0][1])+Math.hypot(x1-o[1][0],z1-o[1][1]);
          const good=opts.filter(o=>o.every(q=>Math.abs(q[0])>2.3||Math.abs(q[0])<2.3&&false)).sort((a,c)=>ln(a)-ln(c));const o=good[0];
          if(o){path.splice(i,0,[o[0][0],o[0][1]],[o[1][0],o[1][1]]);ch=1;break}}
        px=x1;pz=z1}
      if(!ch)break}}
  const tgtM=new T.Mesh(new T.RingGeometry(.28,.46,24),new T.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:0,depthWrite:false}));tgtM.rotation.x=-Math.PI/2;tgtM.renderOrder=5;let tgtK=0;
  function groundTap(cx,cy){if(V)return;if(sleeping){sleepCard();return}if(inSchool){schoolCard();return}
    if(drv){const r0=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((cx-r0.left)/r0.width*2-1,-(cy-r0.top)/r0.height*2+1),cam);const v0=new T.Vector3();if(ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),v0)){driveTo(fXi(v0.x),v0.z);fol=1;foc='kid';try{hosLbl()}catch(e){}}return}
    if(busy||escort||fallEsc||carry){card(`🙂 ${B('أكمل','أكملي')} ما ${B('تفعله','تفعلينه')} أوّلًا`);setTimeout(()=>card(''),1500);return}
    const r=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1),cam);const v=new T.Vector3();
    if(!ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),v))return;let x=fXi(v.x),z=v.z;const R=Math.hypot(x,z);if(R>75){x*=75/R;z*=75/R}
    const lf=x=>x<0||Math.abs(x)<.6&&kid.position.x<0;if(Math.abs(x)<R0+.25)x=lf(x)?SW:2.75; // لا نقف في الشارع: إلى الرصيف الأقرب
    let b=obIn(x,z,.25);if(b){const c=[[b[0]-.6,z,x-b[0]],[b[1]+.6,z,b[1]-x],[x,b[2]-.6,z-b[2]],[x,b[3]+.6,b[3]-z]].filter(q=>Math.abs(q[0])>2.3).sort((p,q)=>p[2]-q[2])[0];if(c){x=c[0];z=c[1]}}
    if(Math.abs(x)<R0+.25)x=x<0?SW:2.75;
    manual=1;card('');if(path.length){at=here();path=[];onArrive=null}wander=false;
    go({x,z,via:Math.abs(x)>2.6&&Math.abs(Math.abs(z)-4.6)<.9?sign(z)*4.6:null},null);detour();
    fol=1;foc='kid';fast=runOn?1:0;try{hosLbl()}catch(e){}
    if(tgtM.parent!==S)S.add(tgtM);tgtM.position.set(fX(x),.06,z);tgtK=1;try{window.Bayt&&Bayt.sTap()}catch(e){}}
  // زرّ الركض 🏃 (بجانب الكاميرا)
  const runBtn=document.createElement('button');runBtn.className='m3run';runBtn.setAttribute('aria-label','الركض');runBtn.hidden=!!V;
  const runLbl=()=>{runBtn.textContent=runOn?'🏃':'🚶';runBtn.classList.toggle('on',!!runOn)};runLbl();
  runBtn.onclick=()=>{runOn=runOn?0:1;runLbl();if(path.length&&manual)fast=runOn;card(runOn?`🏃 ${B('تركض','تركضين')} الآن… ${B('انتبه','انتبهي')} عند الشارع 🚸`:`🚶 ${B('تمشي','تمشين')} على مهل`);setTimeout(()=>card(''),1500)};
  {const r2=ov.querySelector('.m3r2');r2?r2.appendChild(runBtn):ov.appendChild(runBtn)}
  // (v17.2) 🔍 زر البحث: يفتح «إلى أين؟» والمؤشّر في خانة البحث
  const srBtn=document.createElement('button');srBtn.className='m3run m3sr';srBtn.textContent='🔍';srBtn.setAttribute('aria-label','بحث');srBtn.hidden=!!V;
  srBtn.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping){sleepCard();return}openGo();const q=goBox.querySelector('.srch');if(q)setTimeout(()=>q.focus(),60)};
  {const r2=ov.querySelector('.m3r2');r2?r2.prepend(srBtn):ov.appendChild(srBtn)}
  // زرّ «قريب منك»: يظهر حين يقف الطفل قرب مكان أو شخص
  const NL={sheikh:'📜 اسأل الشيخ',police:'👮 سلّم على الشرطي',power:'⚡ محطة الكهرباء',leak:'🚰 أغلق الحنفية',wallet:'👛 خذ المحفظة',lost:'🤝 ساعد الطفل الضائع',grandpa:'👴 زر جدّو',stars:'🔭 انظر إلى النجوم',iftar:'🌴 وزّع التمر',halaqa:'📖 حلقة القرآن',elder:'🤝 ساعد جدّو',parents:'❤️ بِرّ والديك',tannour:'🔥 التنّور',sadaqa:'💝 صندوق الصدقات',birds:'🐦 أطعم العصافير',busStop:'🚌 موقف الباص',park:'🎡 مدينة الألعاب',hospital:'🏥 المستشفى',fall:'🤕 ساعده على النهوض',sick:'🤒 زر الجار المريض',cafe:'☕ سلّم على الكبار',ducks:'🦆 أطعم البطّ',plaza:'⛲ النافورة',football:'⚽ الملعب',sheep:'🐑 المرعى',clock:'🕰️ برج الساعة',gift:'🎁 افتح الهدية',pet:'🐾 حيواني',drvs:'🚦 مدرسة تعليم السياقة',showroom:'🚗 معرض السيارات',poolB:'🏊 مسبح الأولاد',poolG:'🧕 مسبح البنات',mycar:'🚗 اركب سيارتك'};
  function nearLbl(u,D){if(u.ped)return '👋 سلّم على جارك';if(u.t!=null)return thirsty().includes(u.t)&&!D.tr[u.t]?'💧 اسقِ الشجرة':'';if(u.l!=null)return '🧹 نظّف الطريق';if(u.cat)return '🐱 القطّة';if(u.fk)return '🐄 المزرعة';
    if(u.p)return ''; // (v18.1) طلب الشيخ: لا زر أزرق باسم البيت/البنايات (كان يظهر «🏡 بيتي» دائمًا) — البنايات تُلمس مباشرة أو من «إلى أين؟»
    const a=u.act||'';if(a.indexOf('mk_')===0)return '🛒 الدكّان';if(a.indexOf('bn_')===0)return '🔨 ابنِ هنا';return NL[a]||''}
  const nearBtn=document.createElement('button');nearBtn.className='m3sal m3near';nearBtn.hidden=true;ov.appendChild(nearBtn);let nearU=null,nearT=0;
  nearBtn.onclick=()=>{const u=nearU;nearBtn.hidden=true;try{window.Bayt&&Bayt.sTap()}catch(e){}if(u)tap(u)};
  function nearTick(dt){if(tgtK>0){tgtK=Math.max(0,tgtK-dt*.7);tgtM.material.opacity=tgtK*.9;tgtM.scale.setScalar(1+(1-tgtK)*.6)}
    nearT-=dt;if(nearT>0)return;nearT=.3;let best=null,bd=1e9,lb='';
    if(!drv&&!V&&!sleeping&&!inSchool&&!busy&&!path.length&&goBox.hidden&&!ui.card.classList.contains('on')&&salBtn.hidden&&kid.visible){const kx=kid.position.x,kz=kid.position.z,D=day();
      const cons=(u,d)=>{if(d>=bd||d>1.3)return;const l=nearLbl(u,D);if(l){bd=d;best=u;lb=l}};
      life.g.children.forEach(P=>{const u=P.userData;if(P.visible&&u.act&&u.act!=='pet')cons(u,Math.hypot(P.position.x-kx,P.position.z-kz)-1.2)});
      if(!OB)obst();S.children.forEach(o=>{const u=o.userData;if(!u||o===kid||o===life.g||o===tgtM||!(u.act||u.p||u.t!=null||u.l!=null||u.cat||u.fk))return;const b=OBm.get(u);
        if(b)cons(u,Math.hypot(Math.max(b[0]-kx,0,kx-b[1]),Math.max(b[2]-kz,0,kz-b[3]))-.4);else cons(u,Math.hypot(fXi(o.position.x)-kx,o.position.z-kz)-(u.p?.4:1.2))})}
    if(best){if(nearU!==best||nearBtn.hidden){nearU=best;nearBtn.textContent=lb}nearBtn.hidden=false}else{nearBtn.hidden=true;nearU=null}}
  // (v15.7) حين يسلّم جارٌ يظهر زر أخضر كبير «👋 ردّ السلام»: لمسة واحدة ويذهب الطفل إليه
  const salBtn=document.createElement('button');salBtn.className='m3sal';salBtn.hidden=true;ov.appendChild(salBtn);let salI=-1,salT=0;
  salBtn.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}const i=salI;salBtn.hidden=true;if(i<0||busy||path.length&&!wander)return;follow(()=>A.salam(i))};
  function salTick(dt){salT-=dt;if(salT>0)return;salT=.3;try{life.setQuiet((day().sl|0)>=5)}catch(e){}let i=-1;if(!V&&!drv&&!sleeping&&!inSchool&&!busy&&!(path.length&&!wander)&&goBox.hidden&&!ui.card.classList.contains('on'))i=life.peds.findIndex(P=>P.visible&&P.userData.u.greet>0&&!(P.userData.u.hold>0));
    salI=i;if(i<0){salBtn.hidden=true;return}const u=life.peds[i].userData.u,she=u.kind==='woman',w=she?'جارتك تسلّم':u.kind==='kid'?B('صديقك يسلّم','صديقتك تسلّم'):'جارك يسلّم';
    salBtn.innerHTML=`👋 ${w} عليك… ${B('ردّ','ردّي')} السلام`;salBtn.hidden=false}
  // ===== (v15.9) «طفل يحبّ مدينته» =====
  // (v16.2) الرسم عبر خريطة الشارع العريض: الناس والسيارات والطفل يتحرّكون بالإحداثيات القديمة، وتُرسم مواضعهم بعد fX
  // (السيارات: حارة داخلية LI أو خارجية LO لكل اتجاه)، ثم تُعاد مواضعهم فورًا (اللمس يستعمل مصفوفات الرسم)
  // (v17.4) الظلال تُرسم كل ثالث إطار (الشمس ثابتة، والفرق لا يُرى) — كانت تضاعف الرسم في كل إطار
  R.shadowMap.autoUpdate=false;R.shadowMap.needsUpdate=true;let shF=0;
  // (v17.4) دقّة تتكيّف وحدها: إذا بطؤ الجهاز (أقلّ من ٤٠ إطارًا/ث) تنزل الدقّة قليلًا، وإذا ارتاح (فوق ٥٥) ترجع
  let fpN=0,fpT=performance.now(),fpGood=0;function adapt(){fpN++;const n=performance.now();if(n-fpT<2500)return;const fps=fpN*1000/(n-fpT);fpN=0;fpT=n;
    if(fps<40&&PR>1){PR=Math.max(1,+(PR-.25).toFixed(2));R.setPixelRatio(PR);fpGood=0}else if(fps>55&&PR<PRM){if(++fpGood>=3){PR=Math.min(PRM,+(PR+.25).toFixed(2));R.setPixelRatio(PR);fpGood=0}}else fpGood=0}
  // الناس البعيدون جدًا عن الكاميرا (أكثر من ٥٥) لا يُرسمون (صغار جدًا لا يُرَون)، ويُعادون بعد الرسم
  const HV=[];
  // (v17.5) «المناطق»: ما هو بعيد جدًّا عن الكاميرا (حسب حجمه) لا يُرسم، ويرجع حين تقترب. القائمة تُبنى مرّة لكل مشهد.
  let ZS=null,ZN=[];const ZH=[],zsp=new T.Sphere(),zb=new T.Box3();
  function zones(){if(ZS!==S){ZS=S;ZN=[];S.updateMatrixWorld(true);S.children.forEach(o=>{if(o===life.g||o===kid||o.isLight||o.isPoints||(o.userData&&o.userData.rd)||o.frustumCulled===false)return;
      zb.setFromObject(o);if(zb.isEmpty())return;zb.getBoundingSphere(zsp);if(zsp.radius>22||zsp.radius<.01)return;ZN.push([o,zsp.center.clone(),zsp.radius])});
      life.g.children.forEach(o=>{if(o.userData.act==='park'){zb.setFromObject(o);zb.getBoundingSphere(zsp);ZN.push([o,zsp.center.clone(),zsp.radius])}})}
    ZH.length=0;const p=cam.position,F=LITE?95:125;for(const [o,c,r] of ZN){if(!o.visible)continue;const lim=F+r*6;if(c.distanceToSquared(p)>lim*lim){o.visible=false;ZH.push(o)}}}
  const RM=[];function rMap(){zones();adapt();if(R.shadowMap.enabled&&++shF>=3){shF=0;R.shadowMap.needsUpdate=true}RM.length=0;HV.length=0;const g=life.g;for(const c of g.children){const x=c.position.x;RM.push(c,x);c.position.x=c.userData.lane!=null?(x<0?-1:1)*(c.userData.lane?LO:LI):fX(x)}
    {const cx=cam.position.x,cz=cam.position.z;for(const c of life.g.children){if(c.visible&&c.userData.arms){const dx=c.position.x-cx,dz=c.position.z-cz;if(dx*dx+dz*dz>3025){c.visible=false;HV.push(c)}}}}
    RM.push(kid,kid.position.x);kid.position.x=fX(kid.position.x);R.render(S,cam);for(let i=0;i<RM.length;i+=2)RM[i].position.x=RM[i+1];for(const c of HV)c.visible=true;for(const o of ZH)o.visible=true}
  function lookPt(x,z){x=fX(x);fol=0;flyTo({c:[x,0,z],l:[x,.6,z],th,ph:Math.min(ph,.9),dist:20});foc='spot';hosLbl()}
  // ٩ وردة تنبت أمام الطفل مع كل عمل صالح
  function bloomPop(){try{const f=new T.Group(),a=Math.random()*Math.PI*2;f.position.set(fX(kid.position.x+Math.cos(a)*.9),0,kid.position.z+Math.sin(a)*.9);
    const c=[0xff4f7a,0xffd23f,0xc58bff,0xff8c42,0xff6fb5][(BLOOM.n|0)%5],st=new T.Mesh(new T.CylinderGeometry(.03,.03,.5,5),new T.MeshStandardMaterial({color:0x3f9a3e}));st.position.y=.25;f.add(st);
    for(let i=0;i<5;i++){const p=new T.Mesh(new T.SphereGeometry(.11,8,6),new T.MeshStandardMaterial({color:c}));p.position.set(Math.cos(i*1.26)*.12,.55,Math.sin(i*1.26)*.12);f.add(p)}
    const cc=new T.Mesh(new T.SphereGeometry(.07,8,6),new T.MeshStandardMaterial({color:0xffe066}));cc.position.y=.57;f.add(cc);f.scale.setScalar(.01);S.add(f);
    let k=0;const iv=setInterval(()=>{k++;f.scale.setScalar(Math.min(1.3,k/8*1.3));if(k>=8)clearInterval(iv)},40);
    const t=document.createElement('div');t.className='m3fly';t.style.top='38%';t.style.color='#d94f8a';t.textContent='🌷 '+(BLOOM.n%10===0?'شجرة جديدة في مدينتك!':'نبتت وردة في مدينتك');ov.appendChild(t);setTimeout(()=>t.remove(),1600)}catch(e){}}
  // ٧ الحيوان الأليف يتبع الطفل
  let petG=null;
  function makePet(k){const G=new T.Group(),m=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.7},o||{})),e=(r,sx,sy,sz,mt,x,y,z,p)=>{const q=new T.Mesh(new T.SphereGeometry(r,14,10),mt);q.scale.set(sx,sy,sz);q.position.set(x,y,z);q.castShadow=true;(p||G).add(q);return q};
    const eye=m(0x151515),body=new T.Group();G.add(body);G.userData.body=body;
    if(k==='cat'){const o=m(0xf0a040),w=m(0xfff3e0);e(.2,1,.85,1.6,o,0,.3,0,body);e(.17,1,.95,1,o,0,.48,.32,body);e(.1,1,.7,1,w,0,.43,.45,body);
      [-1,1].forEach(q=>{const ear=new T.Mesh(new T.ConeGeometry(.07,.14,4),o);ear.position.set(q*.09,.65,.3);body.add(ear);e(.025,1,1,1,eye,q*.065,.52,.47,body)});
      const tl=new T.Mesh(new T.CylinderGeometry(.03,.04,.45,6),o);tl.position.set(0,.45,-.38);tl.rotation.x=-.7;body.add(tl);G.userData.tail=tl;
      [[-.1,.18],[.1,.18],[-.1,-.18],[.1,-.18]].forEach(([x,z])=>e(.05,1,1.8,1,w,x,.1,z,body))}
    else if(k==='rab'){const o=m(0xf4f4f4),pk=m(0xffb6c8);e(.22,1,.9,1.3,o,0,.27,0,body);e(.16,1,1,1,o,0,.46,.25,body);e(.07,1,1,1,o,0,.3,-.3,body);
      [-1,1].forEach(q=>{const ea=e(.05,.9,3.3,.6,o,q*.07,.72,.22,body);ea.rotation.z=q*.15;e(.03,.6,2.6,.3,pk,q*.07,.72,.25,body);e(.024,1,1,1,eye,q*.07,.5,.39,body)});e(.025,1,1,1,pk,0,.45,.41,body)}
    else{const o=m(0x8fd14f),y=m(0xffd23f),og=m(0xff8a3d);e(.14,1,.95,1.3,o,0,0,0,body);e(.11,1,1,1,y,0,.12,.14,body);const bk=new T.Mesh(new T.ConeGeometry(.035,.09,6),og);bk.rotation.x=Math.PI/2;bk.position.set(0,.11,.27);body.add(bk);
      [-1,1].forEach(q=>e(.02,1,1,1,eye,q*.06,.15,.22,body));const wl=e(.1,.25,.6,1.1,o,-.14,.02,0,body),wr=e(.1,.25,.6,1.1,o,.14,.02,0,body);G.userData.wings=[wl,wr];e(.07,.5,.3,1.3,m(0x5fa83a),0,0,-.2,body)}
    G.userData.act='pet';G.userData.k=k;
    const P=PETS[k],sp=markSprite(T,P[3],'#8f6bff',.7);sp.position.y=k==='bird'?.55:1;G.add(sp);G.userData.mk=sp;return G}
  function petLook(){if(!petG)return;const f=Math.min(10,PET.f|0);petG.scale.setScalar(.8+.05*f);petG.userData.mk.visible=PET.d!==today()}
  function setPet(k){PET={k,f:0,d:''};ptsv();if(petG){life.g.remove(petG);petG=null}petG=makePet(k);life.g.add(petG);petG.position.set(kid.position.x-1,0,kid.position.z);petLook();
    const P=PETS[k];life.say(petG,P[0]+' 💚',2.5,1.2);card(`${P[0]} هذا ${P[2]} «${P[1]}»! ${P[4]==='she'?'ستمشي':'سيمشي'} معك في كل مكان 💚<br><small>${B('أطعمه','أطعميه')} كل يوم ${P[3]} فيكبر قليلًا قليلًا</small>`,[[P[3]+' '+B('أطعمه','أطعميه')+' الآن',()=>A.pet()],['حسنًا',null,'sec']])}
  if(PET.k&&PETS[PET.k]&&!V){petG=makePet(PET.k);life.g.add(petG);petG.position.set(kid.position.x-1,0,kid.position.z+.6);petLook()}
  function petTick(dt,t){if(!petG)return;petG.visible=!V&&!sleeping&&kid.visible;if(!petG.visible)return;const k=petG.userData.k,a=kid.rotation.y,tx=kid.position.x-Math.sin(a)*1.05+Math.cos(a)*.55,tz=kid.position.z-Math.cos(a)*1.05-Math.sin(a)*.55;
    const dx=tx-petG.position.x,dz=tz-petG.position.z,d=Math.hypot(dx,dz),b=petG.userData.body;if(d>14){petG.position.x=tx;petG.position.z=tz}
    if(d>.12){const sp=Math.min(d,Math.max(1.2,d*2.4)*dt);petG.position.x+=dx/d*sp;petG.position.z+=dz/d*sp;let da=Math.atan2(dx,dz)-petG.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));petG.rotation.y+=da*Math.min(1,dt*6)}
    else{const ta=Math.atan2(cam.position.x-petG.position.x,cam.position.z-petG.position.z);let da=ta-petG.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));petG.rotation.y+=da*Math.min(1,dt*2)}
    const mv=d>.12;if(k==='bird'){petG.position.y=1.5+Math.sin(t*3)*.15;const w=petG.userData.wings,f=Math.sin(t*(mv?22:9))*.7;w[0].rotation.z=f;w[1].rotation.z=-f}
    else if(k==='rab'){b.position.y=mv?Math.abs(Math.sin(t*9))*.22:0}else{b.position.y=mv?Math.abs(Math.sin(t*12))*.04:0;if(petG.userData.tail)petG.userData.tail.rotation.z=Math.sin(t*3)*.4}}
  // ١١ بطل المدينة اليوم: يكمل السقي والسلام (٥) والتنظيف ← الجيران يصفّقون، تاج نجمة فوق الطفل، 💎10
  const crown=markSprite(T,'⭐','#f0a020',.75);crown.position.y=2.35;crown.visible=!!day().hero;kid.add(crown);
  function heroTick(){const D=day();crown.visible=!!D.hero&&!V;if(D.hero||V||sleeping||busy||path.length&&!wander||ui.card.classList.contains('on')||!goBox.hidden)return;
    if(thirsty().some(k=>!D.tr[k])||litter().some(k=>!D.lt[k])||(D.sl|0)<5)return;D.hero=1;dsv();crown.visible=true;
    life.peds.filter(P=>P.visible).slice(0,4).forEach((P,i)=>setTimeout(()=>life.say(P,'👏 '+B('أحسنت','أحسنتِ')+yaN()+'!',3,P.userData.u.h),i*350));
    jewels(10);setTimeout(()=>burst(),500);try{if(sndOn()&&typeof tone=='function')[523,659,784,1046].forEach((f,i)=>tone(f,.2,'triangle',.1,i*.15))}catch(e){}
    card(`<b style="color:#c98a12;font-size:21px">🌟 ${B('أنت','أنتِ')} ${B('بطل','بطلة')} المدينة اليوم! 🌟</b><br>أهل المدينة يصفّقون لك 👏👏 💎 +١٠<br><small>سقيتَ الأشجار، وسلّمت على الجيران، ونظّفت الطريق 🤍</small>`.replace('سقيتَ',B('سقيتَ','سقيتِ')).replace('وسلّمت',B('وسلّمتَ','وسلّمتِ')).replace('ونظّفت',B('ونظّفتَ','ونظّفتِ')),[['🤍 الحمد لله',null]])}
  // ١٢ 📷 ألبوم الصور
  const camBtn=document.createElement('button');camBtn.className='m3cam';camBtn.textContent='📷';camBtn.setAttribute('aria-label','صوّر مدينتك');{const r2=ov.querySelector('.m3r2');r2?r2.prepend(camBtn):ov.appendChild(camBtn)}camBtn.hidden=!!V;
  function snap(auto){try{rMap();const src=R.domElement,w=Math.min(540,src.width),h=Math.round(src.height*w/src.width),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(src,0,0,w,h);
    const url=c.toDataURL('image/jpeg',.72),a=albGet();a.push({t:Date.now(),d:url,f:a.length?0:1});if(a.length>16)a.splice(1,1);if(!albPut(a))throw 0;
    if(!auto){const f=document.createElement('div');f.className='m3flash';ov.appendChild(f);setTimeout(()=>f.remove(),600);try{if(sndOn()&&typeof tone=='function'){tone(1800,.04,'square',.05);tone(900,.06,'square',.04,.06)}}catch(e){}
      card(`📸 ${B('حفظتُ','حفظتُ')} الصورة في ${B('ألبومك','ألبومكِ')}! ${B('صوّر','صوّري')} ${B('مدينتك','مدينتكِ')} كل فترة ${B('وشاهد','وشاهدي')} كيف تكبر 🌱`,[['🖼️ ألبومي',()=>openAlbum()],['حسنًا',null,'sec']])}}
    catch(e){if(!auto)card('📷 لم أستطع حفظ الصورة… ربما الذاكرة ممتلئة');}}
  camBtn.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}snap(0)};
  if(!V&&!albGet().length)setTimeout(()=>{if(alive&&!albGet().length)snap(1)},7000);
  function openAlbum(){const a=albGet(),fd=x=>{try{return new Date(x).toLocaleDateString('ar-IQ',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}};
    goBox.classList.add('m3alb');goBox.innerHTML=`<div class="in"><h4>🖼️ ${B('ألبوم مدينتي','ألبوم مدينتي')}</h4>${a.length?`<div class="st">${a.length>1?`من ${fd(a[0].t)} إلى اليوم… ${B('شاهد','شاهدي')} كيف كبرت ${B('مدينتك','مدينتكِ')} 🌱`:B('صوّر مدينتك كل فترة بزر 📷 وشاهد كيف تكبر','صوّري مدينتكِ كل فترة بزر 📷 وشاهدي كيف تكبر')}</div>`:''}
      <div class="g">${a.length?a.map((p,i)=>`<button data-a="${i}" style="--c:#fff;--d:#d9c58a"><img src="${p.d}" alt="">${p.f?'🌱 أول يوم · ':''}${fd(p.t)}</button>`).reverse().join(''):`<p style="grid-column:1/-1;text-align:center">${B('لم تصوّر','لم تصوّري')} بعد… ${B('اضغط','اضغطي')} 📷</p>`}</div><button class="x">✖ إغلاق</button></div>`;
    goBox.hidden=false;card('');goBox.onclick=e=>{const b=e.target.closest('button');if(e.target===goBox||b&&b.classList.contains('x')){goBox.hidden=true;goBox.classList.remove('m3alb');return}if(!b||b.dataset.a==null)return;
      const i=+b.dataset.a,p=a[i],v=document.createElement('div');v.className='m3big';v.innerHTML=`<img src="${p.d}" alt=""><b style="color:#fff">${fd(p.t)}</b><div class="r"><a href="${p.d}" download="madinati-${i+1}.jpg">⬇️ احفظها</a><button data-d>🗑️ احذفها</button><button data-c>✖ رجوع</button></div>`;ov.appendChild(v);
      v.onclick=ev=>{if(ev.target.closest('[data-d]')){a.splice(i,1);albPut(a);v.remove();openAlbum()}else if(ev.target.closest('[data-c]')||ev.target===v)v.remove()}}}
  // ٦ أهل المدينة يرحّبون بالطفل باسمه عند الدخول
  setTimeout(()=>{if(!alive||V||sleeping||!kidN())return;const F=life.father&&life.father.visible?life.father:life.peds.find(P=>P.visible);if(F)life.say(F,'أهلًا'+yaN()+'! '+B('نوّرت','نوّرتِ')+' مدينتك 🌷',3.5,F.userData&&F.userData.u?F.userData.u.h:2.4)},2600);
  if(hosBtn){hosBtn.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(drv){trips();return}if(V)return;openGo()};hosLbl()}
  setBar();const pn=prayerNow();if(window.City3D){City3D._A=A;City3D._sc=()=>({S,cam,life,R});City3D._info=()=>{let m=0,l=0;S.traverse(o=>{if(o.isMesh)m++;if(o.isLight)l++});life.g.traverse(o=>{if(o.isLight)l++});let lg=0,lgv=0,tr=0;life.g.traverse(o=>{if(o.isMesh){lg++;let v=true;for(let x=o;x;x=x.parent)if(!x.visible){v=false;break}if(v)lgv++}});life.traffic.forEach(c=>{if(c.v.visible)tr++});const top={};S.children.forEach(c=>{let n=0;c.traverse(o=>{if(o.isMesh)n++});const k=(c.userData&&(c.userData.act||c.userData.p))||c.type;top[k]=(top[k]||0)+n});return {calls:R.info.render.calls,tris:R.info.render.triangles,meshes:m,lights:l,lifeMeshes:lg,lifeVisible:lgv,trafficVisible:tr,top:Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,14)}};City3D._walk=(x,z)=>{const v=new T.Vector3(fX(x),0,z).project(cam),r=cv.getBoundingClientRect();groundTap(r.left+(v.x+1)/2*r.width,r.top+(1-v.y)/2*r.height)};City3D._probe=(x,y)=>{const r=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),cam);return ray.intersectObjects(S.children,true).slice(0,4).map(h=>{const o=h.object;let a=o,path=[];while(a&&a!==S){path.push(a.type+(a.userData&&Object.keys(a.userData).length?JSON.stringify(a.userData).slice(0,30):''));a=a.parent}return {c:o.material&&o.material.color&&o.material.color.getHexString(),op:o.material&&o.material.opacity,tr:o.material&&o.material.transparent,geo:o.geometry&&o.geometry.type,pos:o.position.toArray().map(v=>+v.toFixed(2)),sc:o.scale.toArray().map(v=>+v.toFixed(2)),path:path.join('<')}})};City3D._st2=()=>({drv,x:+cS.x.toFixed(2),z:+cS.z.toFixed(2),h:+cS.h.toFixed(2),n:cS.path.length,pd:!!cS.pd,sp:+cS.sp.toFixed(2),sig:sig(),kid:[+kid.position.x.toFixed(2),+kid.position.z.toFixed(2)],V:!!V});City3D._car={enter:enterCar,leave:leaveCar,trips,cam:v=>{camIn=v;dUI()}};City3D._st=()=>({path:path.map(q=>[+q[0].toFixed(2),+q[1].toFixed(2)]),kid:[+kid.position.x.toFixed(2),+kid.position.z.toFixed(2)],OB:(OB||[]).map(b=>b.slice(0,4).map(v=>+v.toFixed(1)).concat([b[4].p||b[4].act||b[4].fk])),near:nearBtn.hidden?'':nearBtn.textContent})} // للتجربة فقط
  // (v13.8) تهنئة مرة في اليوم أيام رمضان والعيد
  {const oc=occNow(),D=day();if(oc&&!V&&D.oc!==oc.id&&!sleepNow()){D.oc=oc.id;D.fs=1;dsv();setTimeout(()=>card(`<b>${oc.t}</b><br><small>${oc.msg}</small><br><small>${oc.k==='sad'?'لبست '+B('مدينتك','مدينتكِ')+' السواد في هذه الأيام 🖤':'زُيّنت '+B('مدينتك','مدينتكِ')+' بالأضواء والفوانيس والبالونات ✨'}</small>`,[[oc.k==='sad'?'🤍 حسنًا':'🤍 الحمد لله',null]]),900)}}
  {const f=occNow()&&occNow().k==='sad'?null:festNow(),D=day();if(f&&!V&&!D.fs&&!sleepNow()){D.fs=1;dsv();setTimeout(()=>card(f==='ramadan'?`🌙 رمضان كريم! تقبّل الله صيامكم 🤲<br><small>زُيّنت ${B('مدينتك','مدينتكِ')} بالفوانيس والأضواء ✨</small>`:`🎉 عيد مبارك! كل عام ${B('وأنت','وأنتِ')} بخير 🤍<br><small>زُيّنت ${B('مدينتك','مدينتكِ')} بالبالونات والأضواء 🎈</small>`,[['🤍 آمين',null]]),900)}}
  // اللمس
  const cv=R.domElement,ray=new T.Raycaster();
  function pick(x,y){const r=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),cam);
    for(const h of ray.intersectObjects(S.children,true)){let o=h.object;while(o&&!(o.userData&&(o.userData.p||o.userData.t!=null||o.userData.l!=null||o.userData.cat||o.userData.ped||o.userData.fk||o.userData.act)))o=o.parent;if(o)return o.userData}return null}
  function tap(u){if(!u)return;try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping&&!adm){sleepCard();return}if(inSchool&&!V&&u.p!=='sc'){schoolCard();return}
    if(u.ped){if(!busy&&(!path.length||wander))A.salam(u.ped-1);return}
    if(u.act){if(V&&u.act==='mycar'){card(`🚗 ${B('سيارتك','سيارتكِ')} واقفة قرب بيت ${V.nick}`,[['🏙️ ارجع لمدينتي',()=>A.back()],['لاحقًا',null,'sec']]);return}if(V){card('🤍 هذا في مدينة '+V.nick);setTimeout(()=>card(''),1600);return}if(!busy&&(!path.length||wander)){const a=u.act;if(a.indexOf('bn_')===0){try{Bayt.sTap()}catch(e){}if(window.Binaa)Binaa.open(a.slice(3));return}if(a.indexOf('mk_')===0)A.mk(a.slice(3));else if(A[a])A[a]()}return}
    if(u.fk){if(V){card(`🐄 مزرعة ${V.nick} 🤍`);setTimeout(()=>card(''),1800);return}if(!busy&&(!path.length||wander))A.farm(u.fk);return}
    if(adm&&u.p==='home'){A.aInfo();return}
    if(V){if(u.p==='home')card(`🏡 بيت ${V.nick}`,[['🏡 ادخل بيته',()=>A.fhouse()],['حسنًا',null,'sec']]);
      else if(u.p&&Madina.PARTS[u.p])card(`${Madina.PARTS[u.p].e} ${Madina.PARTS[u.p].n} في مدينة ${V.nick} 🤍`);return}
    if(u.t!=null){if(!busy&&(!path.length||wander))A.tree(u.t);return}
    if(u.l!=null){if(!busy&&(!path.length||wander))A.litter(u.l);return}
    if(u.cat){if(!busy&&(!path.length||wander))A.cat();return}
    if(u.p==='sc'){if(!busy&&(!path.length||wander))A.mySchool();return}
    if(u.p==='home'){const dl=dirtLv();card(dl?`🧹 <b style="color:#8a5a2b">${B('بيتك','بيتكِ')} اتّسخ!</b><br><small>كل عمل صالح (صلاة، ورد، تسبيح، حفظ…) ينظّف جزءًا منه ✨</small>`:`🏡 هذا ${B('بيتك','بيتكِ')} في الجنة · ${B('ابنِ','ابني')} طوابقه بالأعمال الصالحة 🤍`,[['🎨 '+B('زيّن','زيّني')+' بيتك '+B('وادخله','وادخليه'),()=>closeTo(()=>oldHouse('deco'))],['حسنًا',null,'sec']]);return}
    window.Madina&&Madina.part&&Madina.part(u.p)}
  // (v18.2) طلب الشيخ: التحكم بالأصابع مثل الألعاب، لا بالأزرار:
  //  إصبع واحد يسحب الأرض (يتجوّل في المدينة) · إصبعان: قرصة = تقريب/تبعيد نحو مكان الإصبعين، لفّ الإصبعين = تدوير،
  //  سحب الإصبعين معًا للأعلى/الأسفل = إمالة الكاميرا · الحاسوب: سحب = تجوّل، زر الفأرة الأيمن = تدوير وإمالة، العجلة = تقريب
  const gRay=new T.Raycaster(),gPl=new T.Plane(new T.Vector3(0,1,0),0);
  function gp(x,y){place();cam.updateMatrixWorld();const r0=cv.getBoundingClientRect();gRay.setFromCamera(new T.Vector2((x-r0.left)/r0.width*2-1,-(y-r0.top)/r0.height*2+1),cam);const v=new T.Vector3();
    if(!gRay.ray.intersectPlane(gPl,v))return null;if(Math.hypot(v.x-cam.position.x,v.z-cam.position.z)>dist*4)return null;return v}
  function shift(ox,oz){const m=dist*.6,l=Math.hypot(ox,oz);if(l>m){ox*=m/l;oz*=m/l}
    let nx=Math.max(-75,Math.min(48,CC[0]+ox)),nz=Math.max(-175,Math.min(125,CC[2]+oz));ox=nx-CC[0];oz=nz-CC[2];CC[0]+=ox;CC[2]+=oz;LK[0]+=ox;LK[2]+=oz;
    if(!foc&&Math.hypot(ox,oz)>.01)foc='pan'}
  function rot(a){const dx=CC[0]-LK[0],dz=CC[2]-LK[2],c=Math.cos(a),n=Math.sin(a);CC[0]=LK[0]+dx*c+dz*n;CC[2]=LK[2]-dx*n+dz*c;th+=a;if(!foc)foc='pan'}
  function zoomAt(f,x,y){const d0=dist,d1=Math.max(10,Math.min(MAXD,dist*f));if(d1===d0)return;const p0=gp(x,y);dist=d1;if(!p0)return;const p1=gp(x,y);if(p1)shift(p0.x-p1.x,p0.z-p1.z)}
  let g2=null,touched=0,rmb=0;
  const g2st=()=>{const [a,b]=[...pts.values()];return{d:Math.hypot(a[0]-b[0],a[1]-b[1]),an:Math.atan2(b[1]-a[1],b[0]-a[0]),mx:(a[0]+b[0])/2,my:(a[1]+b[1])/2}};
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);try{cv.setPointerCapture(e.pointerId)}catch(x){}touched=1;rmb=e.pointerType==='mouse'&&(e.button===2||e.ctrlKey);hint(0);
    if(pts.size===1){drag=[e.clientX,e.clientY];down=[e.clientX,e.clientY,Date.now()];g2=null}else{drag=null;down=null;g2=Object.assign(g2st(),{m:null,acc:[0,0,0,0]})}});
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1&&drag){const dx=e.clientX-drag[0],dy=e.clientY-drag[1];if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<8)return;goal=null;fol=0;
      if(rmb){rot(dx*.008);ph=Math.max(.25,Math.min(1.38,ph-dy*.006))}
      else{const p0=gp(drag[0],drag[1]),p1=gp(e.clientX,e.clientY);if(p0&&p1)shift(p0.x-p1.x,p0.z-p1.z);else{const k=dist*.0017;shift(-dx*k*Math.cos(th)-dy*k*Math.sin(th),dx*k*Math.sin(th)-dy*k*Math.cos(th))}}
      drag=[e.clientX,e.clientY]}
    else if(pts.size===2&&g2){goal=null;fol=0;const n=g2st();let da=n.an-g2.an;da=Math.atan2(Math.sin(da),Math.cos(da));const f=g2.d/Math.max(1,n.d),mdx=n.mx-g2.mx,mdy=n.my-g2.my;
      const A2=g2.acc;A2[0]+=Math.abs(Math.log(f));A2[1]+=Math.abs(da);A2[2]+=mdx;A2[3]+=mdy;
      // نقرّر نوع الحركة بعد قليل: إصبعان يتحرّكان معًا للأعلى/الأسفل (بلا قرصة ولا لفّ) = إمالة، وإلا تقريب + تدوير + تجوّل
      if(!g2.m&&Math.hypot(A2[2],A2[3])+A2[0]*120+A2[1]*120>14)g2.m=Math.abs(A2[3])>Math.abs(A2[2])*1.6&&A2[0]<.08&&A2[1]<.12?'tilt':'free';
      if(g2.m==='tilt')ph=Math.max(.25,Math.min(1.38,ph-mdy*.006));
      else if(g2.m==='free'){if(Math.abs(da)>.002)rot(da);zoomAt(f,n.mx,n.my);const p0=gp(g2.mx,g2.my),p1=gp(n.mx,n.my);if(p0&&p1)shift(p0.x-p1.x,p0.z-p1.z)}
      Object.assign(g2,{d:n.d,an:n.an,mx:n.mx,my:n.my})}});
  const up=e=>{const was=pts.has(e.pointerId)&&pts.size===1;pts.delete(e.pointerId);g2=null;drag=pts.size===1?[...pts.values()][0]:null;
    if(was&&down&&e.type==='pointerup'&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<10&&Date.now()-down[2]<600){const u=pick(e.clientX,e.clientY);if(u)tap(u);else groundTap(e.clientX,e.clientY)}down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();goal=null;fol=0;touched=1;zoomAt(e.deltaY>0?1.1:.9,e.clientX,e.clientY)},{passive:false});
  // تلميح صغير أوّل مرّة فقط: كيف يتحرّك الطفل في المدينة بأصابعه
  const hintEl=document.createElement('div');hintEl.className='m3hint';hintEl.hidden=true;ov.appendChild(hintEl);let hintT=0;
  function hint(on){if(!on){if(!hintEl.hidden){hintEl.style.opacity=0;setTimeout(()=>hintEl.hidden=true,600)}return}
    hintEl.innerHTML='👆 اسحب بإصبع: '+B('تتجوّل','تتجوّلين')+' في المدينة<br>🤏 افتح إصبعين: تقريب<br>🔄 لُفّ إصبعين: تدوير';hintEl.style.opacity=1;hintEl.hidden=false;hintT=setTimeout(()=>hint(0),5000)}
  try{if(!V&&!localStorage.getItem('usul5_m3hint')){localStorage.setItem('usul5_m3hint','1');setTimeout(()=>{if(!touched)hint(1)},1500)}}catch(e){}
  const rs=()=>{const w=innerWidth,h=innerHeight;cam.aspect=w/h;cam.updateProjectionMatrix();R.setSize(w,h)};addEventListener('resize',rs);
  // الحلقة
  let alive=true,idle=0,t=0,last=performance.now(),lastF=0;(function loop(now){if(!alive)return;if(LITE&&now&&now-lastF<31){requestAnimationFrame(loop);return}lastF=now||0;const dt=Math.min(.05,((now||performance.now())-last)/1000)*(window.City3D&&City3D.debugSpeed||1);last=now||performance.now();t+=dt*3;
    if(!touched&&!pts.size&&!document.querySelector('#modal.on')&&++idle>240)th+=.002;else idle=0; // (v18.2) بعد أن يلمس الطفل المدينة لا تدور وحدها
    (S.userData.marks||[]).forEach((m,i)=>m.position.y=m.userData.y+Math.sin(t+i)*.18);
    const L=kid.userData;
    if(L.head){L.head.rotation.y+=((L.hyT||0)-L.head.rotation.y)*Math.min(1,dt*5);L.hyT=0}
    if(path.length&&lookT>0){// 🚸 يقف عند حافة الرصيف وينظر يمينًا ويسارًا قبل العبور
      lookT-=dt;if(lookT<=0&&nearZeb(kid.position.x,kid.position.z)&&!pedGo()){lookT=.3;if(!kid.userData.sw){kid.userData.sw=1;life.say(kid,'🚦 أنتظر الضوء الأخضر',3,2.4)}}else if(lookT<=0)kid.userData.sw=0;const [nx,nz]=path[0];{let da=Math.atan2(nx-kid.position.x,nz-kid.position.z)-kid.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));kid.rotation.y+=Math.max(-5*dt,Math.min(5*dt,da*Math.min(1,dt*6)))}L.lph=(L.lph||0)+dt*2.6;L.hyT=Math.sin(L.lph)*.95;
      L.legs.forEach(l=>l.rotation.x*=.7);L.arms.forEach(a=>a.rotation.x*=.7);kid.position.y=0;still=0}
    else if(path.length){const [tx,tz,lk]=path[0],dx=tx-kid.position.x,dz=tz-kid.position.z,d=Math.hypot(dx,dz),sp=kidSp*dt*(fast&&!escort&&!fallEsc&&!carry?2.6:1)*(d>1e-4?spF(kid.position.x,dx/d,dz/d):1);
      if(d<=sp){kid.position.x=tx;kid.position.z=tz;path.shift();if(lk&&path.length)lookT=fast?.9:1.6;if(!path.length)fast=0;if(!path.length&&onArrive){const f=onArrive;onArrive=null;setTimeout(f,150)}}
      else{let da=Math.atan2(dx,dz)-kid.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));const m=(fast?9:6)*dt;kid.rotation.y+=Math.max(-m,Math.min(m,da*Math.min(1,dt*10)));const k=Math.max(.2,1-Math.abs(da)/1.8);kid.position.x+=dx/d*sp*k;kid.position.z+=dz/d*sp*k}
      const sw=Math.sin(t*4)*.6;L.legs[0].rotation.x=sw;L.legs[1].rotation.x=-sw;L.arms[0].rotation.x=-sw;L.arms[1].rotation.x=sw;kid.position.y=Math.abs(Math.sin(t*4))*.06}
    else{L.legs.forEach(l=>l.rotation.x*=.8);L.arms.forEach(a=>a.rotation.x*=.8);still+=dt;waveT+=dt;
      // يلتفت نحوك ليظهر وجهه
      const ta=Math.atan2(cam.position.x-kid.position.x,cam.position.z-kid.position.z);let da=ta-kid.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));kid.rotation.y+=da*Math.min(1,dt*4);
      if(joyT>0){joyT-=dt;const k=1.1-joyT;kid.position.y=Math.abs(Math.sin(k*Math.PI*2.7))*.45;L.arms[0].rotation.z=-2.6;L.arms[1].rotation.z=2.6}
      else{kid.position.y=0;const w=waveT%6;L.arms[0].rotation.z*=.85;L.arms[1].rotation.z=w<1.4?2.5+Math.sin(w*12)*.35:L.arms[1].rotation.z*.85}
      // يتجوّل وحده إذا تُرك قليلًا
      if(still>8&&!manual&&!busy&&!sleeping&&!inSchool&&!ui.card.classList.contains('on')&&!document.querySelector('#modal.on')){still=0;go(WP[Math.floor(Math.random()*WP.length)],null,true)}}
    if(path.length){still=0;L.arms.forEach(a=>a.rotation.z*=.7)}
    // (v13.7) 👴 جدّو: بالنهار (٨–١٧) ينتظر عند السوق بكيسيه، وأثناء المساعدة يمشي بجانب الطفل، وبعدها يقف عند باب بيته
    {const E=life.elder,hh=hourNow();if(V||sleeping||night||hh<8||hh>=17){E.visible=false}else{E.visible=true;const DD=day(),bg=E.userData.bags;
      if(escort){const a=kid.rotation.y;E.position.set(kid.position.x+Math.cos(a)*.75,Math.abs(Math.sin(t*3))*.03,kid.position.z-Math.sin(a)*.75);E.rotation.y=a;bg.forEach(b=>b.visible=false);kidBags.forEach(b=>b.visible=true);E.userData.mk.visible=false}
      else if(DD.eld){E.position.set(-4.85,0,NBZ-.7);E.rotation.y=Math.PI/2;bg.forEach(b=>b.visible=false);kidBags.forEach(b=>b.visible=carry>0);E.userData.mk.visible=false}
      else{E.position.set(MKX+.6,0,-13.7);if(!path.length)E.rotation.y=-Math.PI/2+Math.sin(t*.2)*.5;bg.forEach(b=>b.visible=true);kidBags.forEach(b=>b.visible=carry>0);E.userData.mk.visible=true}}}
    // (v15.2) 🤕 الرجل الذي وقع: يظهر مرة في اليوم (٨–١٨) بعد بناء المستشفى، وأثناء المساعدة يعرج بجانب الطفل
    {const F=life.faller,fm=life.fallMk,DD=day(),hh=hourNow(),can=!V&&!sleeping&&!night&&hh>=8&&hh<18&&!DD.fall&&hpLv()>0;
      if(fallEsc){const a=kid.rotation.y;F.visible=true;fm.visible=false;F.rotation.set(0,a,0);F.position.set(kid.position.x+Math.cos(a)*.7,Math.abs(Math.sin(t*2.2))*.06,kid.position.z-Math.sin(a)*.7)}
      else if(can&&fallT<=0){F.visible=true;F.rotation.set(-Math.PI/2,0,0);F.position.set(FALLP[0],.16,FALLP[1]);fm.visible=true;fm.position.set(FALLP[0],1.5+Math.sin(t*2)*.08,FALLP[1])}
      else{F.visible=false;fm.visible=false;if(can)fallT-=window.City3D&&City3D.debugFall?99:dt}}
    // (v16.9) شيخ المكتبة (٧–٢١)، الشرطي، والطفل الضائع في أيام فتح مدينة الألعاب
    {const DD=day(),hh=hourNow(),Sh=life.sheikh,Po=life.police,Lk=life.lostKid,Lm=life.lostMom;Sh.visible=!V&&!sleeping&&hh>=7&&hh<21;Sh.userData.mk.visible=Sh.visible&&!DD.shq;
      Po.visible=!sleeping||!!V;Po.userData.mk.visible=!V&&!!DD.wlc&&!DD.wl;
      if(lostS>0){lostS-=dt;Lk.visible=Lm.visible=lostS>0;Lk.userData.mk.visible=false;Lm.position.set(-5.3,0,-37.4);Lm.rotation.y=Math.PI/2;Lk.position.set(-4.75,0,-37.4);Lk.rotation.y=-Math.PI/2}
      else{const sh=!V&&!sleeping&&!night&&pkO&&!DD.lost;Lk.visible=sh;Lm.visible=false;Lk.userData.mk.visible=sh;if(sh){Lk.position.set(-4.7,Math.abs(Math.sin(t*5))*.03,-37.4);Lk.rotation.y=Math.PI/2+Math.sin(t*.6)*.5}}}
    (S.userData.anim||[]).forEach(f=>f(t,dt));
    if(performance.now()-prAt>2000){prAt=performance.now();prC=prayerNow();const sl=sleepNow();if(sl&&!sleeping&&!V)startSleep(t<1);else if(!sl&&sleeping)wake();{const sc=!sl&&!V&&schoolNow();if(sc&&!inSchool&&!sleeping)startSchool(t<1);else if(!sc&&inSchool)endSchool()}
      // (v13.8) إذا بدأ المطر أو توقّف أو ظهر قوس قزح أو بدأت المناسبة: يُعاد رسم المشهد، وتتلوّن السماء حسب الوقت
      {const bk=(window.Binaa?Binaa.code()+'|'+(Binaa.job?Binaa.job.p+(Binaa.job.ready?'r':''):''):'')+'|'+dirtLv();if(!V&&bk!==bKey){bKey=bk;refresh()}}wxFetch();showWx();const wk=rainNow()+'|'+rainbowNow()+'|'+festNow()+'|'+(occNow()||{}).id+'|'+winter()+'|'+cloudLv()+'|'+iftarNow()+'|'+halaqaNow()+'|'+poolOpen();wRain=rainNow();pkO=parkOpen();if(wk!==wKey){wKey=wk;refresh()}applySky();kidUmb.visible=wRain&&!night}
    if(zz.visible){zz.position.y=zz.userData.y+Math.sin(t*.8)*.25;zz.material.opacity=.75+Math.sin(t*1.3)*.25}
    life.update(t,dt,{kcar:KC,v:!!V,pkDone:!!day().pk,hosp:V?0:hpLv(),prayer:sleeping?null:prC,mosque:V?(V.lv.m|0):(window.Madina?Madina.st.lv.m|0:0),kid:kid.position,kidOn:kid.visible,kidWait:lookT>0,sleep:sleeping,rain:wRain&&!night,bagsDone:!!(day().br&&day().br.b)});sounds&&sounds.tick(dt);
    sparks=sparks.filter(s=>{s.userData.k+=dt;const k=s.userData.k;s.position.addScaledVector(s.userData.v,dt);s.rotation.y+=dt*6;s.material.opacity=Math.max(0,1-k/1.3);
      if(k>1.3){S.remove(s);s.geometry.dispose();s.material.dispose();return false}return true});
    drops=drops.filter(d=>{d.position.y-=dt*4;if(d.position.y<.1){S.remove(d);d.geometry.dispose();d.material.dispose();return false}return true});
    (S.userData.trees||[]).forEach(G=>{if(G&&G.userData.grow){G.userData.grow+=dt;const k=G.userData.grow-1;G.scale.setScalar(k<.6?1+Math.sin(k/.6*Math.PI)*.25:1.08);if(k>.6)G.userData.grow=0}});
    try{salTick(dt)}catch(e){}try{nearTick(dt)}catch(e){}try{carTick(dt,t);pracTick(dt);shows.forEach((v,i)=>v.rotation.y+=dt*(.25+i*.03))}catch(e){console.error(e)}try{petTick(dt,t)}catch(e){}if((t*10|0)%5===0)try{heroTick()}catch(e){}
    if(fol){goal=null;const kp=drv&&myCar?{x:fX(cS.x),z:cS.z}:{x:fX(kid.position.x),z:kid.position.z},k=Math.min(1,dt*2.4);CC[0]+=(kp.x-CC[0])*k;CC[2]+=(kp.z-CC[2])*k;LK[0]+=(kp.x-LK[0])*k;LK[1]+=(1.2-LK[1])*k;LK[2]+=(kp.z-LK[2])*k;CC[1]+=(0-CC[1])*k;dist+=(34-dist)*k*.6;ph+=(Math.min(ph,1.05)-ph)*k}
    stepFly(dt);place();if(drv&&camIn&&myCar)cockpit(dt);rMap();requestAnimationFrame(loop)})();
  // عند وقت الأذان: الشخصية تذهب للجامع وحدها
  if(pn&&!day().pr[pn]&&window.Madina&&Madina.st.lv.m)setTimeout(()=>{if(alive&&!V&&!path.length&&!busy&&!sleeping&&!inSchool){card(`🕌 الله أكبر! حان وقت صلاة ${PNAME[pn]}… هيّا إلى الجامع`);setTimeout(()=>A.mosque(),1200)}},1500);
  function refresh(){const old=S;old.remove(kid);old.remove(life.g);S=makeScene(night,V);S.add(kid);S.add(life.g);applySky();OB=null;
    // الأشجار التي تكبر الآن تبقى بحجمها
    old.userData.trees.forEach((G,i)=>{if(G&&S.userData.trees[i])S.userData.trees[i].scale.copy(G.scale)});
    drops.concat(sparks).forEach(d=>{old.remove(d);S.add(d)});dispose(old);showJ()}
  return {refresh,aVisit:r=>A.aVisit(r),act(k,a){if(V||!A[k])return;if(sleeping){sleepCard();return}if(inSchool){schoolCard();return}try{goBox.hidden=true}catch(e){}follow(()=>A[k](a))},stop(){alive=false;try{sounds.stop()}catch(e){}Object.assign(cam0,foc?HOME:{th,ph,dist});removeEventListener('resize',rs);dispose(S);R.dispose();R.forceContextLoss&&R.forceContextLoss()}}}

function dispose(S){S.traverse(o=>{o.geometry&&o.geometry.dispose();const m=o.material;if(m){(Array.isArray(m)?m:[m]).forEach(x=>{x.map&&x.map.dispose();x.dispose()})}})}

async function open(){if(document.getElementById('m3d'))return;const ov=document.createElement('div');ov.id='m3d';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#aee3ff;overflow:hidden';
  ov.innerHTML=`<div class="m3tl"><div class="m3j"></div><button class="m3x" aria-label="إغلاق">✖</button></div>
    <div class="m3tr"><div class="m3hp"></div><button class="m3wx" hidden aria-label="الطقس"></button></div>
    <button class="m3hos" hidden aria-label="الأماكن"></button><div class="m3r2"><button class="m3snd" aria-label="الصوت"></button></div>
    <div class="m3msg" style="position:absolute;top:104px;right:12px;left:12px;z-index:2;background:#fffd;border-radius:14px;padding:6px 10px;font-weight:800;text-align:center;font-size:13px">⏳ لحظة…</div>
    <div class="m3card"></div>
    <div class="m3bar" style="display:none"><button data-a="mosque"><b>🕌</b>إلى الجامع</button><button data-a="water"><b>💧</b>اسقِ الشجر</button><button data-a="school"><b>🏫</b>احفظ القرآن</button><button data-a="library"><b>📚</b>المكتبة</button><button data-a="mySchool"><b>🎒</b>مدرستي</button><button data-a="friends"><b>👥</b>زيارة صديق</button></div>`;
  document.body.appendChild(ov);document.body.classList.add('m3on');const msg=ov.querySelector('.m3msg');
  const close=()=>{try{cur&&cur.stop()}catch(e){}cur=null;ov.remove();document.body.classList.remove('m3on')};
  ov.querySelector('.m3x').onclick=close;
  const fail=()=>{msg.innerHTML='😔 هذا الجهاز لا يعرض المجسّمات.<br><small>لا تقلق، مدينتك محفوظة وتراها بالرسم العادي.</small>'};
  if(!webgl())return fail();
  try{await loadThree();if(!ov.isConnected)return;
    msg.textContent="";
    ov.querySelector('.m3bar').style.display='';
    cur=run(ov,{msg,hos:ov.querySelector('.m3hos'),snd:ov.querySelector('.m3snd'),card:ov.querySelector('.m3card'),bar:ov.querySelector('.m3bar'),j:ov.querySelector('.m3j'),close})}catch(e){console.error(e);fail()}}
// (v11.6) طلب الشيخ: «المدينة هي الأساس». زر «بيتي في الجنة» يفتح المدينة المجسّمة فقط، و✖ يرجع للواجهة.
// صفحة البيت القديمة (الطوابق، الزينة، السباق…) صارت داخل «☰ المزيد» (wajiha.js). وإذا الجهاز لا يعرض المجسّمات تُفتح الصفحة القديمة.
// (v13.0) صفحة البيت بوضعين بسيطين: 'deco' من بيت المدينة (زيّن وادخل فقط، والرجوع إلى المدينة)، و'game' من «ألعابي» (لعبة الطوابق فقط).
// بلا وضع (جهاز بلا WebGL) تظهر الصفحة كاملة لأنها البيت الوحيد.
function oldHouse(mode){try{Bayt.menu();const s=document.getElementById('bayt');s.classList.remove('wj-deco','wj-game');if(mode)s.classList.add('wj-'+mode);
  const t=s.querySelector('.bar .ttl');if(t)t.textContent=mode==='deco'?'🎨 بيتي':mode==='game'?'🏗️ لعبة طوابق البيت':'بيتي في الجنة 🏡';show('bayt');scrollTo(0,0)}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#byBack'),s=document.getElementById('bayt');
  if(b&&s&&s.classList.contains('wj-deco')&&webgl()){e.stopImmediatePropagation();e.preventDefault();try{renderHome()}catch(x){}show('home');open()}},true);
// (v11.3) طلب الشيخ: «بيتي في الجنة» في أعلى الشاشة الرئيسية تحت اللافتة مباشرة، كبيرًا وواضحًا.
const css2=document.createElement('style');
css2.textContent=`#home #openBayt.btop{grid-column:1/-1;flex-direction:row;text-align:right;gap:12px;margin-top:2px;padding:12px 14px;border-width:2.5px;background:linear-gradient(135deg,#fff8dc,#e6f9ec 55%,#dff1ff);box-shadow:0 6px 0 #a9e2bd,0 10px 22px rgba(31,164,99,.18)}
#home #openBayt.btop .go{display:block;font-size:26px}#home #openBayt.btop .cup{font-size:54px;width:72px;animation:btopb 1.6s ease-in-out infinite}@keyframes btopb{50%{transform:translateY(-4px) scale(1.06)}}
#home #openBayt.btop b{font-size:22px;color:#14794f}#home #openBayt.btop small{font-size:14px}
#openBayt.btop .bt3d{display:inline-block;margin-top:5px;padding:3px 10px;border-radius:12px;background:#1fa463;color:#fff;font-size:12.5px;font-weight:800;font-style:normal}
#openBayt.btop:active{transform:translateY(3px);box-shadow:0 2px 0 #a9e2bd}#openBayt.btop #baytLine{display:none}`;
document.head.appendChild(css2);
function moveHouse(){const c=document.getElementById('openBayt'),h=document.querySelector('#home .hero');if(!c||!h)return;
  if(h.nextElementSibling!==c)h.after(c);
  c.onclick=()=>{try{Bayt.sTap()}catch(e){}if(webgl())open();else oldHouse()};
  if(!c.classList.contains('btop')){c.classList.add('btop');
    const s=c.querySelector('span:not(.cup):not(.go)');if(s&&!s.querySelector('.bt3d'))s.insertAdjacentHTML('beforeend','<small class="bt3s">مدينتك: جامع، مكتبة، مدرسة قرآن، وأصدقاء 🤍</small><i class="bt3d">🏙️ مدينتي المجسّمة · '+B('ادخل','ادخلي')+' الآن</i>')}}
moveHouse();addEventListener('load',moveHouse);
// تستدعيها madina.js بعد كل تغيير في المدينة
function refresh(){if(cur)try{cur.refresh()}catch(e){console.error(e)}}
// (v15.9) ٩ الأعمال الصالحة خارج المدينة (صلاة، حفظ، تسبيح…) تُنبت وردًا في المدينة أيضًا
function hookBloom(){if(window.Aamal&&Aamal.grow&&!Aamal._bh){const g=Aamal.grow;Aamal.grow=function(){if(!cur)bloomAdd();return g.apply(this,arguments)};Aamal._bh=1}}
hookBloom();setTimeout(hookBloom,0);addEventListener('load',hookBloom);
// (v17.3) البحث العامّ في التطبيق (wajiha.js) يفتح المدينة ويأخذ الطفل إلى المكان: City3D.goTo('police')
let pendGo=null;function goTo(k,a){if(!webgl())return oldHouse();if(cur){try{cur.act(k,a)}catch(e){}return}pendGo=[k,a];open();const w=()=>{if(cur&&pendGo){const q=pendGo;pendGo=null;setTimeout(()=>{try{cur&&cur.act(q[0],q[1])}catch(e){}},1400)}else if(pendGo&&document.getElementById('m3d'))setTimeout(w,300)};setTimeout(w,300)}
// (v18.4) المدير يدخل مدينة أي طفل من بطاقته في الإدارة
function adminVisit(r){if(!webgl())return false;if(!cur&&!document.getElementById('m3d'))open();let n=0;const w=()=>{if(cur){setTimeout(()=>{try{cur&&cur.aVisit(r)}catch(e){console.error(e)}},cur._a?0:900);cur._a=1;return}if(document.getElementById('m3d')&&n++<60)setTimeout(w,300)};w();return true}
window.City3D={open,refresh,oldHouse,goTo,adminVisit};
})();
