/* 🏅 ألقابي وأوسمتي — ملفّ الطفل: المستوى (الدرجة) والأوسمة والألقاب، وكل عملٍ صالح يرفعه.
   + في واجهة البرنامج: بطاقتي، أصدقائي (وإضافة صديق)، أبطال هذا الأسبوع.
   + أعمال تبني البيت: الصلاة على النبي والتسبيح بالصوت، وجوائز الأعمال في البيت، وبيت ثلاثي الأبعاد يتحرّك مع الإصبع.
   الأرقام تُحسب من حفظ التطبيق نفسه (state, Aamal, hifz, Cups...) فلا تُفقد. يعتمد على sawt.js و jannah.js و online.js. */
(function(){
const boy=()=>!window.Cups||Cups.sex!='g';
const B=(m,f)=>boy()?m:f;
const A=()=>Aamal.d;
const O=()=>window.OnlineAPI;
const esc=v=>String(v==null?'':v).replace(/[<>&"]/g,'');
const J=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')||{}}catch(e){return {}}};

/* ---------- العدّادات ---------- */
function fiqhPts(){let best=0;Object.values(A().fiqh||{}).forEach(f=>{const p=['wl','sl','wo','so','sv'].filter(k=>f[k]).length+(f.wt>=.75?1:0)+(f.st>=.75?1:0);best=Math.max(best,p)});return best}
function fiqhBoth(){return Object.values(A().fiqh||{}).some(f=>f.wt>=.75&&f.st>=.75)}
function C(){const a=A(),hz=J('usul5_hifz_v1').done||{},w=state.wird||{};
  if(O()&&O().profile)a.wins=O().profile.wins||0;
  return {stars:Object.values(state.stars||{}).reduce((s,x)=>s+x,0),stages:STAGES.filter(s=>state.stars[s.id]>0).length,all:allDone(),
    hifz:Object.keys(hz).length,tilawa:a.tilawa|0,pray:a.prayN|0,fiqh:fiqhPts(),fiqh2:fiqhBoth(),sal:a.sal|0,salM:window.Aamal?Aamal.salWin():0,tas:a.tas|0,
    wins:a.wins|0,akhlaq:a.akhlaq|0,deeds:a.gN|0,wird:w.best|0,cups:window.Cups?Cups.n:0,floors:window.Bayt?Bayt.done:0}}

const TIERS=[{e:'🥉',n:'برونزي',xp:10,c:'#b06a2c'},{e:'🥈',n:'فضّي',xp:25,c:'#6f7f8f'},{e:'🥇',n:'ذهبي',xp:50,c:'#c98a12'},{e:'💎',n:'ماسي',xp:100,c:'#2f8fd0'}];
const MEDALS=[
 {id:'usul',  e:'📚',n:'عالم الأصول',        k:'stars', at:[3,9,15,18],   u:'نجمة في مراحل الكتاب',  go:'map'},
 {id:'pray',  e:'🤲',n:'المصلّي',            k:'pray',  at:[5,35,150,500],u:'صلاة سجّلتها',          go:'pray'},
 {id:'fiqh',  e:'🕌',n:'فقيه الوضوء والصلاة',k:'fiqh',  at:[2,4,6,7],     u:'خطوة في «وضوئي وصلاتي»',go:'salah'},
 {id:'hifz',  e:'📖',n:'الحافظ الصغير',      k:'hifz',  at:[1,3,6,12],    u:'سورة حفظتها',           go:'hifz'},
 {id:'tilawa',e:'🎤',n:'القارئ',             k:'tilawa',at:[10,40,120,300],u:'آية قرأتها بصوتك',      go:'hifz'},
 {id:'sal',   e:'💚',n:'المصلّي على النبي',  k:'sal',   at:[10,100,500,1500],u:'صلاة على النبي وآله', go:'sal'},
 {id:'tas',   e:'📿',n:'المسبّح',            k:'tas',   at:[10,100,330,1000],u:'تسبيحة',              go:'tas'},
 {id:'champ', e:'⚔️',n:'بطل التحديات',       k:'wins',  at:[1,5,15,40],   u:'فوز في التحدّي أونلاين',go:'online'},
 {id:'akhlaq',e:'🌷',n:'صاحب الأخلاق',       k:'akhlaq',at:[1,4,10,25],   u:'جولة ممتازة في «اختبر نفسك»',go:'nafsak'},
 {id:'wird',  e:'🔥',n:'المواظب',            k:'wird',  at:[3,7,15,30],   u:'يومًا متتاليًا في الورد',go:'wird'},
 {id:'banna', e:'🏡',n:'بنّاء الجنة',        k:'cups',  at:[3,15,40,80],  u:'كأس 🏆',                go:'bayt'},
 {id:'garden',e:'🌱',n:'حديقة الأعمال',      k:'deeds', at:[10,50,150,400],u:'عمل صالح زيّن بيتك',   go:'bayt'}];
// مستوى كل نوع من الأعمال في الملف
const DLV=[1,5,15,40,100];
const DGO={ctst:'contest',sal:'sal',tas:'tas',pray:'pray',ayah:'hifz',fiqh:'salah',hifz:'hifz',akhlaq:'nafsak',wird:'wird',dars:'map',win:'online'};
function deedsHTML(){const gc=A().gc||{},G=Aamal.GROW;
  return Object.entries(G).map(([k,g])=>{const n=gc[k]|0,lv=DLV.filter(x=>n>=x).length,nx=DLV[lv],pv=lv?DLV[lv-1]:0,f=nx?(n-pv)/(nx-pv):1;
    return `<button class="dl ${n?'':'z'}" data-dg="${k}"><span class="e">${g[0]}</span><span class="tx"><b>${g[4]}</b><small>${ar(n)} · ${lv?'⭐'.repeat(lv):'لم يبدأ بعد'}</small><div class="bar2"><i style="width:${Math.round(f*100)}%"></i></div></span></button>`}).join('')}
const TITLES=[
 {id:'grad', e:'🎓',n:'خرّيج أصول الدين',     c:c=>c.all,        how:'أكمل مراحل الكتاب الست'},
 {id:'champ',e:'⚔️',n:'قاهر التحديات',         c:c=>c.wins>=3,    how:'افز في ٣ تحدّيات أونلاين'},
 {id:'musal',e:'🕌',n:'المصلّي المواظب',      c:c=>c.pray>=35,   how:'سجّل ٣٥ صلاة صلّيتها'},
 {id:'faqih',e:'💧',n:'يعرف وضوءه وصلاته',    c:c=>c.fiqh2,      how:'انجح في اختبارَي الوضوء والصلاة'},
 {id:'hafiz',e:'📖',n:'حافظ القرآن الصغير',    c:c=>c.hifz>=5,    how:'احفظ ٥ سور'},
 {id:'qari', e:'🎤',n:'القارئ الصغير',         c:c=>c.tilawa>=40, how:'سمّع ٤٠ آية بصوتك'},
 {id:'muhib',e:'💚',n:'كثير الصلوات',       c:c=>c.sal>=100,   how:'صلِّ على النبي وآله ١٠٠ مرة'},
 {id:'khuluq',e:'🌷',n:'صاحب الخُلق الجميل',   c:c=>c.akhlaq>=4,  how:'٤ جولات ممتازة في «اختبر نفسك»'},
 {id:'muwa', e:'🔥',n:'المواظب على الورد',     c:c=>c.wird>=7,    how:'سلسلة ٧ أيام في الورد اليومي'},
 {id:'jannah',e:'👑',n:'جامع الكؤوس',            c:c=>c.cups>=40,   how:'اجمع ٤٠ كأسًا'}];
const LEVELS=[[1,'🌱','برعم الخير'],[3,'🌿','غصن طيّب'],[5,'⭐','نجمة لامعة'],[7,'🌙','قمر منير'],[9,'☀️','شمس مشرقة'],[11,'🏇','فارس الإيمان'],[13,'🦅','صقر الهدى'],[15,'🦁','أسد الحق'],[17,'🏔️','جبل الثبات'],[19,'🛡️','حارس الدين'],[21,'📜','طالب العلم'],[23,'🕯️','سراج الليل'],[25,'💎','جوهرة نادرة'],[28,'🏰','قصر النور'],[31,'🌊','بحر العطاء'],[34,'🕊️','حمامة السلام'],[37,'🚩','راية النصر'],[40,'👑','تاج الجنة']]; // كل لقب مرة واحدة فقط، مرتّبة صعودًا
const tierOf=(m,c)=>m.at.filter(x=>c[m.k]>=x).length; // 0..4
function xpOf(c){let x=c.deeds*3+c.stars*5+c.stages*10+c.hifz*15+c.tilawa*2+c.pray*3+c.fiqh*10+Math.floor(c.sal/10)*4+Math.floor(c.tas/10)*3+c.wins*10+c.akhlaq*8+c.wird*4+c.cups*3;
  MEDALS.forEach(m=>{for(let t=0;t<tierOf(m,c);t++)x+=TIERS[t].xp});TITLES.forEach(t=>{if(t.c(c))x+=30});
  x+=(A().xpAdj|0); // نقاط تضيفها أو تخصمها الإدارة (idara.js)
  return Math.max(0,x)}
const need=L=>15*L*(L-1); // XP لبداية المستوى L
const lvOf=x=>{let L=1;while(x>=need(L+1))L++;return L};
const lvName=L=>{let r=LEVELS[0];LEVELS.forEach(l=>{if(L>=l[0])r=l});return r};
function snap(){const c=C(),x=xpOf(c),L=lvOf(x),tiers={};MEDALS.forEach(m=>tiers[m.id]=tierOf(m,c));
  return {c,x,L,tiers,titles:TITLES.filter(t=>t.c(c)).map(t=>t.id)}}
// الجوائز في البيت بحسب الأعمال
const DEED_ITEMS=[['d_h1',c=>c.hifz>=1],['d_h3',c=>c.hifz>=3],['d_h6',c=>c.hifz>=6],['d_h12',c=>c.hifz>=12],['d_rose',c=>c.sal>=10],['d_birds',c=>c.tas>=10],['d_lamps',c=>c.pray>=5],['d_star',c=>c.tilawa>=10],['d_palms',c=>c.sal>=100],['d_fruit',c=>c.pray>=35],['d_noor',c=>c.sal>=500],['d_street',c=>c.salM>=500],['d_street2',c=>c.salM>=1000],
  ['d_spring',()=>Object.values(A().fiqh||{}).some(f=>f.wt>=.75)],['d_mosque',()=>Object.values(A().fiqh||{}).some(f=>f.st>=.75&&f.sl&&f.sv)]];
/* 💪 اللقب التلقائي: من المجال الذي يتفوّق فيه الطفل، أو لقب جامع إذا تفوّق في عدّة مجالات */
const AREAS=[
 {id:'aq',n:'العقيدة',e:'📚',m:['usul'],t:['شاطر العقيدة','عالم الأصول'],go:'map',how:'أكمل مراحل الكتاب بنجوم كثيرة'},
 {id:'sl',n:'الصلاة',e:'🕌',m:['pray','fiqh'],t:['المصلّي الصغير','حبيب المحراب'],go:'salah',how:'تعلّم الوضوء والصلاة وسجّل صلواتك'},
 {id:'qr',n:'القرآن',e:'📖',m:['hifz','tilawa'],t:['صديق القرآن','حافظ القرآن'],go:'hifz',how:'احفظ السور وسمّعها بصوتك'},
 {id:'ch',n:'التحديات',e:'⚔️',m:['champ'],t:['مقدام التحديات','سيّد الميدان'],go:'contest',how:'العب التحديات أونلاين وافز'},
 {id:'ak',n:'الأخلاق',e:'🌷',m:['akhlaq'],t:['صاحب الخُلق','زينة الأخلاق'],go:'nafsak',how:'أجب إجابات ممتازة في «اختبر نفسك»'},
 {id:'dk',n:'الذكر',e:'💚',m:['sal','tas'],t:['الذاكر الصغير','محبّ النبي وآله'],go:'sal',how:'صلِّ على النبي وآله وسبّح الله بصوتك'}];
const areaTier=(a,s)=>Math.max(...a.m.map(id=>s.tiers[id]|0));
function autoTitle(s){const r=AREAS.map(a=>({a,t:areaTier(a,s)})).filter(x=>x.t>0).sort((x,y)=>y.t-x.t);
  if(!r.length)return null;const strong=r.filter(x=>x.t>=2);
  if(strong.length>=5)return {id:'all',e:'💫',n:'جامع الخيرات'};
  if(strong.length>=3)return {id:'star',e:'🌟',n:'المتألّق الشامل'};
  if(strong.length==2)return {id:'two_'+strong[0].a.id+strong[1].a.id,e:strong[0].a.e,n:`متفوّق ب${strong[0].a.n} و${strong[1].a.n}`};
  const top=r[0];return {id:top.a.id+(top.t>=3?2:1),e:top.a.e,n:top.a.t[top.t>=3?1:0]}}
const shownTitle=s=>autoTitle(s);
const myName=()=>(O()&&O().profile&&O().profile.nick)||state.nick||state.name||B('بطلنا','بطلتنا');
const myAv=()=>(O()&&O().profile&&O().profile.av)||state.av||(boy()?'👦':'👧');

/* ---------- الشكل ---------- */
const css=document.createElement('style');
css.textContent=`
.hpro{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;background:linear-gradient(135deg,#fff8e0,#fff);border:3px solid var(--gold);border-radius:22px;padding:8px 12px;text-align:right;color:inherit;box-shadow:0 5px 0 #e9d49a}
.hpro:active{transform:translateY(3px);box-shadow:0 2px 0 #e9d49a}
.hpro .av{font-size:44px;line-height:1;flex:none;position:relative}
.hpro .lv{position:absolute;bottom:-6px;left:-8px;background:#14794f;color:#fff;border-radius:12px;font-size:12px;font-weight:800;padding:0 6px;line-height:1.6;border:2px solid #fff}
.hpro .nm{flex:1;min-width:0}.hpro .nm b{display:block;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hpro .nm small{display:block;font-size:13px;color:#8a5a00;font-weight:700}
.xpbar{height:9px;background:#efe3c0;border-radius:8px;overflow:hidden;margin-top:3px}.xpbar i{display:block;height:100%;background:linear-gradient(90deg,#f2b632,#e57c1f);border-radius:8px;transition:width .6s}
.hpro .md{font-size:18px;letter-spacing:1px;flex:none;max-width:80px;text-align:center;line-height:1.3}
.hfbtn{display:flex;align-items:center;gap:12px;width:100%;margin-top:10px;background:#fff;border:2px solid #2f6fd0;border-radius:20px;padding:10px 12px;text-align:right;color:inherit;box-shadow:0 5px 0 #b9cff2}
.hhbtn{border-color:#e0a21b;box-shadow:0 5px 0 #f1dba3}.hfbtn.hhbtn b{color:#8a5a00}.hhbtn:active{box-shadow:0 2px 0 #f1dba3}
.hfbtn:active{transform:translateY(3px);box-shadow:0 2px 0 #b9cff2}
.hfbtn .e{font-size:40px;width:58px;text-align:center;flex:none}.hfbtn .nm{flex:1;min-width:0}.hfbtn b{display:block;font-size:19px;color:#1d4e9e}.hfbtn small{display:block;font-size:14px;color:var(--muted);line-height:1.5}
.hfbtn .go{font-size:26px;color:#2f6fd0;flex:none}
#homeHeroes{margin-top:16px}
.pttoast{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:45;width:min(92vw,360px);background:linear-gradient(135deg,#fff8e0,#fff);border:3px solid var(--gold);border-radius:20px;padding:8px 14px;box-shadow:0 8px 24px rgba(0,0,0,.25);text-align:center;animation:ptin .45s cubic-bezier(.2,1.5,.4,1);cursor:pointer}
.pttoast b{display:block;font-size:22px;color:#c98a12}.pttoast span{display:block;font-size:13px;color:#5a3c00;font-weight:700}
.pttoast .xpbar{height:10px;margin-top:4px}.pttoast .xpbar i{animation:ptbar 1s ease-out}
.pttoast.out{opacity:0;transform:translate(-50%,30px);transition:.45s}
@keyframes ptin{from{transform:translate(-50%,60px);opacity:0}}@keyframes ptbar{from{width:0}}
.hbox{background:#fff;border:2px solid var(--line);border-radius:20px;padding:8px 10px;margin-top:10px}
.hbox h4{margin:0 0 6px;font-size:16px;display:flex;align-items:center;gap:6px}.hbox h4 span{flex:1}
.hbox h4 button{border:0;border-radius:12px;padding:2px 10px;font-weight:800;font-size:13px;background:var(--green);color:#fff}
.hbox h4 button.sec{background:#eef6f1;color:var(--deep)}
.hfrs{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:none}.hfrs::-webkit-scrollbar{display:none}
.hfr{flex:none;width:74px;border:2px solid var(--line);background:#fafdfb;border-radius:16px;padding:4px 2px;text-align:center;color:inherit;position:relative}
.hfr .av{font-size:30px;line-height:1.2;display:block}.hfr b{display:block;font-size:11.5px;line-height:1.3;height:30px;overflow:hidden}.hfr small{font-size:11px;color:#14794f;font-weight:800}
.hfr .on{position:absolute;top:2px;right:4px;width:10px;height:10px;border-radius:50%;background:#1fa463;border:2px solid #fff}
.hfr.add{border-style:dashed;color:var(--green)}.hfr.add .av{font-size:28px}
.hher{display:flex;flex-direction:column;gap:5px}
.hher div{display:flex;align-items:center;gap:8px;background:#fafdfb;border-radius:12px;padding:2px 8px;font-size:14px}
.hher div.me{background:#fff8e0;outline:2px solid var(--gold)}
.hher{gap:8px}.hher div{gap:10px;padding:8px 10px;font-size:16px;border:1px solid #e3eee7;background:#fff}
.hher .rk{width:34px;font-size:22px}.hher .av{font-size:36px;line-height:1}
.hher b{font-size:20px;font-weight:800;color:#0b3d27;line-height:1.5}
.hher b small{font-size:13.5px!important;color:#8a5a00!important;white-space:normal}
.hher div>small{font-size:15px;color:#3d5a4b}
.hher .rk{width:24px;text-align:center;font-weight:800}.hher .av{font-size:22px}.hher b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hher small{color:var(--muted);font-weight:700;white-space:nowrap}
.hnote{font-size:13px;color:var(--muted);text-align:center;line-height:1.6;margin:2px 0}
.aqhead{text-align:center;background:linear-gradient(160deg,#fff8e0,#fff);border:3px solid var(--gold);border-radius:26px;padding:12px}
.aqhead .av{font-size:64px;line-height:1.1}.aqloc{display:inline-block;margin:4px 0 2px;border:0;border-radius:14px;padding:5px 12px;font:inherit;font-weight:900;font-size:14px;color:#1d4e9e;background:#eaf3ff;box-shadow:0 3px 0 #a9bcd6,0 3px 8px #0001;cursor:pointer}.aqloc i{font-style:normal;font-size:12px;color:#5a6b80;margin-inline-start:4px}.aqflag{border:0;background:#fff;border-radius:12px;padding:1px 7px;font-size:24px;line-height:1.3;vertical-align:middle;box-shadow:0 3px 0 #e3c56e,0 3px 8px #0002;cursor:pointer}.aqhead h2{margin:2px 0;font-size:22px}
.aqlv{display:inline-block;background:#14794f;color:#fff;border-radius:16px;padding:0 12px;font-weight:800;font-size:16px}
.aqtt{display:inline-block;margin-top:4px;background:#fff4d6;color:#7a5200;border:2px solid var(--gold);border-radius:14px;padding:0 10px;font-weight:800;font-size:14px}
.aqsec{font-weight:800;color:var(--deep);margin:14px 0 6px;font-size:17px}
.aqts{display:flex;flex-wrap:wrap;gap:6px}
.aqts button{border:2px solid var(--line);background:#fff;border-radius:14px;padding:2px 10px;font-size:14px;font-weight:700;color:var(--ink)}
.aqts button.on{border-color:var(--gold);background:#fff4d6;box-shadow:0 0 0 3px rgba(242,182,50,.3)}
.aqts button.lock{opacity:.45;filter:grayscale(1)}
.aqm{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.aqm button{background:#fff;border:2px solid var(--line);border-radius:16px;padding:8px;text-align:center;color:inherit;position:relative}
.aqm .e{font-size:30px;line-height:1.2}.aqm .t{position:absolute;top:4px;left:6px;font-size:20px}
.aqm b{display:block;font-size:14px}.aqm small{display:block;font-size:12px;color:var(--muted);line-height:1.5}
.aqm .bar2{height:7px;background:#eef3ef;border-radius:7px;overflow:hidden;margin-top:3px}.aqm .bar2 i{display:block;height:100%;border-radius:7px}
.aqm button.t0{opacity:.75}.aqm button.t0 .e{filter:grayscale(.7)}
.aqdo{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
/* (v13.2) ملفّي: أزرار مجسّمة بألوان فاتحة */
.aqhead{background:linear-gradient(160deg,#fff8e0,#fff 70%);border:0;box-shadow:0 5px 0 #efd27a,0 10px 20px rgba(200,150,30,.15),inset 0 2px 0 #fff}
.aqhead .av{display:inline-grid;place-items:center;width:86px;height:86px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#ffeec0);box-shadow:0 0 0 4px #f2b632,0 5px 0 4px #d8961e;font-size:56px;margin:4px 0 6px}
.aqlv{box-shadow:0 3px 0 #0b4d31}.aqtt{box-shadow:0 3px 0 #e3b54a}
.aqhead #aqOn{flex:none;margin:0 auto;font-size:15px;padding:6px 14px!important;border-radius:14px;box-shadow:0 3px 0 #b9cfc2}
.aqsec{text-align:center;font-size:18px}
.aqdo{gap:10px}
.aqdo button,.aqm button,.aqts button,.aqtabs button{background:var(--c,#fff);border:0;box-shadow:0 4px 0 var(--d,#c9d6e3),0 6px 12px rgba(0,0,0,.06),inset 0 2px 0 rgba(255,255,255,.85);transition:transform .1s,box-shadow .1s}
.aqdo button:active,.aqm button:active,.aqts button:active,.aqtabs button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--d,#c9d6e3),inset 0 2px 0 rgba(255,255,255,.85)}
.aqdo button{padding:8px 2px 7px;font-size:13.5px;font-weight:800;border-radius:18px}.aqdo button span{font-size:30px}
.aqtabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:16px 0 10px}
.aqtabs button{--c:#fff;--d:#c9d6e3;border-radius:16px;padding:6px 2px;font:inherit;font-weight:800;font-size:15px;color:#3d5a4b}
.aqtabs button span{display:block;font-size:24px;line-height:1.2}
.aqtabs button.on{--c:#fff4d6;--d:#e0a526;color:#7a4b00;outline:2.5px solid #f2b632}
.aqm3{grid-template-columns:repeat(3,1fr)}
.aqm3 button{border-radius:16px;padding:8px 4px 7px}.aqm3 .e{font-size:28px}.aqm3 b{font-size:13px;line-height:1.35}.aqm3 small{font-size:11.5px;font-weight:700}
.aqm3 .t{font-size:17px;top:2px;left:4px}.aqm3 .bar2{background:rgba(255,255,255,.8)}
.aqm button.t0{opacity:1}.aqm button.t0 .e{filter:grayscale(.6);opacity:.75}
.aqts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.aqts button{border-radius:14px;padding:7px 6px;font-size:13.5px;font-weight:800;display:flex;align-items:center;gap:6px;text-align:right}
.aqts button span{font-size:22px;flex:none}
.aqts button.on{outline:2.5px solid #f2b632}.aqts button.lock{opacity:.6;filter:grayscale(.5)}
.aqpane[hidden]{display:none}

.aqdo button{background:#fff;border:2px solid var(--line);border-radius:16px;padding:6px 2px;font-size:13px;font-weight:700;color:var(--ink);position:relative}
.aqdo button span{display:block;font-size:28px;line-height:1.3}.aqdo button i{position:absolute;top:-6px;left:-4px;font-style:normal}
.lvup .big{font-size:70px;line-height:1.1;animation:swing 1.2s ease-in-out infinite}
.lvup .row{display:flex;align-items:center;gap:8px;background:#fff8e0;border-radius:14px;padding:4px 10px;margin:5px 0;text-align:right;font-weight:700;font-size:15px}
.lvup .row span{font-size:26px}
.b3d{perspective:800px}.b3d>svg{transition:transform .25s ease-out;transform-origin:50% 80%;will-change:transform}
.b3d.idle>svg{animation:b3float 5s ease-in-out infinite}
@keyframes b3float{0%,100%{transform:rotateY(-6deg) rotateX(3deg)}50%{transform:rotateY(6deg) rotateX(1deg) translateY(-3px)}}
.b3hint{text-align:center;font-size:12.5px;color:var(--muted);margin-top:2px}
.v3open{width:100%;margin-top:10px;flex:none;font-size:19px;background:linear-gradient(135deg,#7c4dc4,#2f6fd0);box-shadow:0 5px 0 #3b2470;animation:pulse 2.2s infinite}
.v3ov{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;background:linear-gradient(#8fd4ff,#d8f1ff 55%,#bff0c8);padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);transition:background .8s;user-select:none}
.v3ov.night{background:linear-gradient(#0b1640,#1d2f6b 55%,#25466b)}
.v3top{display:flex;align-items:center;gap:10px;padding:10px 12px}.v3top b{flex:1;text-align:center;font-size:20px;color:#0e5a3a}.v3ov.night .v3top b{color:#ffe08a}
.v3b{width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.85);font-size:20px;flex:none}
.v3stage{flex:1;min-height:0;perspective:900px;display:flex;align-items:center;justify-content:center;touch-action:none;overflow:hidden}
.v3world{position:relative;width:min(92vw,520px,calc((100vh - 240px) * 1.09));aspect-ratio:360/330;transform-style:preserve-3d;transition:transform .25s ease-out}
.v3world.sway{animation:v3sway 7s ease-in-out infinite}
@keyframes v3sway{0%,100%{transform:rotateY(-14deg) rotateX(4deg)}50%{transform:rotateY(14deg) rotateX(2deg) translateY(-6px)}}
.v3house{position:absolute;inset:0;transform:translateZ(0);border-radius:26px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.35),0 0 0 4px rgba(255,255,255,.6)}
.v3house svg{display:block;width:100%;height:100%;transition:filter .8s}
.v3ov.night .v3house svg{filter:brightness(.5) saturate(1.3) hue-rotate(-12deg)}
.v3glow{position:absolute;left:18%;right:18%;top:38%;bottom:8%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,214,90,.75),rgba(255,214,90,0));mix-blend-mode:screen;opacity:0;transition:opacity .8s;transform:translateZ(10px);pointer-events:none}
.v3ov.night .v3glow{opacity:1;animation:v3glow 2.4s ease-in-out infinite}
@keyframes v3glow{50%{opacity:.7}}
.v3shadow{position:absolute;left:8%;right:8%;bottom:-26px;height:30px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.35),transparent);transform:translateZ(-40px) rotateX(70deg)}
.v3p{position:absolute;pointer-events:none}.v3p i{display:block;font-style:normal;animation:v3float 3.4s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(0,0,0,.25))}
@keyframes v3float{50%{transform:translateY(-14px) rotate(8deg)}}
.v3stars{position:absolute;inset:-20% -10% 40%;transform:translateZ(-120px);opacity:0;transition:opacity .8s}.v3ov.night .v3stars{opacity:1}
.v3stars i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 6px #fff;animation:v3tw 1.6s ease-in-out infinite}
@keyframes v3tw{50%{opacity:.3}}
.v3hint{text-align:center;font-size:14px;color:#0e5a3a;margin:4px 12px;font-weight:700}.v3ov.night .v3hint{color:#ffe08a}
.v3acts{display:flex;gap:10px;padding:6px 14px 14px}.v3acts .btn{flex:1}
@media (prefers-reduced-motion: reduce){.v3world.sway,.v3p i,.v3open{animation:none}}
#aqHouse svg{height:100%}
.dls{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}
.dl{display:flex;align-items:center;gap:6px;background:#fff;border:2px solid var(--line);border-radius:14px;padding:5px 8px;text-align:right;color:inherit}
.dl .e{font-size:26px;flex:none}.dl .tx{flex:1;min-width:0}.dl b{display:block;font-size:12.5px;line-height:1.4}.dl small{font-size:11.5px;color:#8a5a00;font-weight:700}
.dl .bar2{height:5px;background:#eef3ef;border-radius:5px;overflow:hidden;margin-top:2px}.dl .bar2 i{display:block;height:100%;background:#3fbf6f;border-radius:5px}
.dl.z{opacity:.6}.dl.z .e{filter:grayscale(.6)}
.dbuild{background:linear-gradient(160deg,#eafbf1,#fff);border:3px solid #3fbf6f;border-radius:20px;padding:8px 10px;margin-top:10px}
.dbuild h4{margin:0 0 6px;font-size:16px;color:#14794f;text-align:center}
@media (prefers-reduced-motion: reduce){.b3d.idle>svg,.lvup .big{animation:none}}
`;
document.head.appendChild(css);

/* ---------- واجهة البرنامج: بطاقتي + أصدقائي + أبطال الأسبوع ---------- */
const home=document.createElement('div');home.id='homeSocial';
const stats=document.querySelector('#home .stats');(stats||$('#map')).after(home);
// أبطال الأسبوع: في أسفل الواجهة

let fcache=null,hcache=null,loading=false,lastLoad=0,frOpen=false;
try{const c=J('usul5_social_v1');fcache=c.f||null;hcache=c.h||null}catch(e){}
function drawHome(){const s=snap(),ln=lvName(s.L),t=shownTitle(s),f=(s.x-need(s.L))/(need(s.L+1)-need(s.L));
  const meds=MEDALS.filter(m=>s.tiers[m.id]).sort((a,b)=>s.tiers[b.id]-s.tiers[a.id]).slice(0,3).map(m=>TIERS[s.tiers[m.id]-1].e+m.e).join(' ');
  home.innerHTML=`<button class="hpro" id="hProf"><span class="av">${esc(myAv())}<span class="lv">${ar(s.L)}</span></span>
    <span class="nm"><b>${nameTag(myName(),isAdm())}</b><small>${ln[1]} ${ln[2]} · المستوى ${ar(s.L)}${t?` · ${t.e} ${t.n}`:''}</small><div class="xpbar"><i style="width:${Math.round(f*100)}%"></i></div></span>
    <span class="md">${meds||'🏅'}</span></button>
   <button class="hfbtn" id="hFrBtn"><span class="e">👥</span><span class="nm"><b>أصدقائي</b><small id="hFrSum">${frSum()}</small></span><span class="go">‹</span></button>
   <button class="hfbtn hhbtn" id="hHeBtn"><span class="e">🏅</span><span class="nm"><b>أبطال هذا الأسبوع</b><small id="hHeSum">اضغط لترى الأبطال</small></span><span class="go">‹</span></button>`;
  $('#hProf').onclick=()=>{tone(880,.05,'sine',.08);openProfile()};
  $('#hFrBtn').onclick=()=>{tone(880,.05,'sine',.08);openFriends()};
  $('#hHeBtn').onclick=()=>{tone(880,.05,'sine',.08);openHeroes()};
  drawHeroes();loadSocial()}
function drawHeroes(){const a=$('#hHeSum');if(!a)return;
  a.textContent=hcache&&hcache.length?`🥇 الأول الآن: ${hcache[0].nick}`:'اضغط لترى الأبطال'}
function openHeroes(){stopVc();aqBack=null;show('alqab');$('#aqTitle').textContent='🏅 أبطال هذا الأسبوع';drawHeroesPage();loadSocial(true)}
function drawHeroesPage(){$('#aqBody').innerHTML=`<div class="hbox" style="margin-top:0">${heroesHTML()}</div>`}
function frSum(){const prof=O()&&O().profile;
  if(!state.online&&!prof)return B('اصنع لقبك وأضف أصدقاءك 🌐','اصنعي لقبك وأضيفي أصدقاءك 🌐');
  if(!fcache)return 'اضغط لترى أصدقاءك وتضيف صديقًا';
  const on=fcache.filter(r=>r.on).length;
  const n=fcache.length;
  return n?`${n==1?'صديق واحد':n==2?'صديقان':ar(n)+' '+(n<=10?'أصدقاء':'صديقًا')}${on?` · 🟢 ${ar(on)} متصل الآن`:''} · ➕ أضف صديقًا`:'لا أصدقاء بعد · ➕ أضف صديقًا'}
const goHome=()=>{renderHome();show('home')};
/* ---------- شاشة أصدقائي: القائمة + أضف صديقًا ---------- */
function openFriends(){stopVc();aqBack=null;frOpen=true;show('alqab');$('#aqTitle').textContent='👥 أصدقائي';drawFriends();loadSocial(true)}
function drawFriends(){const prof=O()&&O().profile,el=$('#aqBody');
  if(!state.online&&!prof){el.innerHTML=`<div class="handoff"><div class="big">👥</div><h2>${B('اصنع لقبك أولًا','اصنعي لقبك أولًا')}</h2><p>${B('ثم أضف','ثم أضيفي')} أصدقاءك برموزهم، ${B('وتحدَّهم','وتحدّيهم')} ${B('وزُر','وزوري')} بيوتهم في الجنة 🏡</p><button class="btn gold" id="frOn" style="flex:none;min-width:200px">🌐 اصنع لقبي</button></div>`;
    $('#frOn').onclick=()=>{window.onlineReturn=openFriends;openOnline()};return}
  const code=prof&&prof.code;
  el.innerHTML=`<button class="btn gold" id="frAdd" style="flex:none;width:100%">➕ أضف صديقًا</button>
    ${code?`<div class="code-card" style="margin-top:10px"><small>رمزك — ${B('أعطه','أعطيه')} لصديقك ليضيفك</small><b dir="ltr">${esc(code)}</b></div>`:''}
    <div class="flist" style="margin-top:6px">${!fcache?`<p class="hnote">${navigator.onLine?'<span class="spin">⏳</span> جارٍ تحميل أصدقائك…':'📡 لا يوجد إنترنت الآن'}</p>`
      :fcache.length?fcache.map(r=>`<button class="frow" data-fr="${esc(r.id)}" style="width:100%;text-align:right;color:inherit"><span class="av">${esc(r.av)}</span><span class="who-n"><b>${nameTag(r.nick,r.adm)}</b><small>${r.on?'🟢 متصل الآن':'⚪ غير متصل'}${r.lv?` · ⭐ المستوى ${ar(r.lv)}`:''}${r.tt?' · '+esc(r.tt):''}</small></span><span class="go" style="color:var(--gold);font-size:22px">‹</span></button>`).join('')
      :`<p class="hnote">لا أصدقاء بعد 🤝 ${B('اضغط','اضغطي')} «أضف صديقًا» ${B('واكتب','واكتبي')} رمز صديقك.</p>`}</div>`;
  $('#frAdd').onclick=()=>{window.onlineReturn=openFriends;O().openAdd()};
  el.querySelectorAll('[data-fr]').forEach(b=>b.onclick=()=>friendCard(b.dataset.fr))}
const medal=i=>['🥇','🥈','🥉'][i]||ar(i+1);
function heroesHTML(){if(!hcache)return `<p class="hnote">${state.online?'⏳':'العب وتعلّم واعمل الخير لتصير من أبطال الأسبوع! 🌟'}</p>`;
  if(!hcache.length)return `<p class="hnote">لا أبطال بعد هذا الأسبوع. ${B('كن','كوني')} الأول! 🌟</p>`;
  const me=O()&&O().me;
  return `<div class="hher">${hcache.slice(0,30).map((r,i)=>`<div class="${r.id==me?'me':''}" data-hr="${esc(r.id)}"><span class="rk">${medal(i)}</span><span class="av">${esc(r.av)}</span><b>${nameTag(r.nick,r.adm)}${r.lv||r.tt?`<small style="display:block;color:#8a5a00;font-size:11.5px">${r.lv?`⭐${ar(r.lv)} `:''}${esc(r.tt||'')}</small>`:''}</b><small>${r.xp?`✨ ${ar(r.xp)}`:''}${r.wins?` 🏆 ${ar(r.wins)}`:''}</small></div>`).join('')}</div>
   <p class="hnote">الترتيب بالأعمال الصالحة والتعلّم والانتصارات هذا الأسبوع · يبدأ من جديد كل جمعة</p>`}
async function loadSocial(force){if(loading||!navigator.onLine||!O()||!state.online)return;if(!force&&Date.now()-lastLoad<60000&&fcache)return;
  loading=true;lastLoad=Date.now();
  try{await O().init();const API=O();if(!API.profile)return;publish();
    const ids=await API.friendIds();
    const rows=await Promise.all(ids.slice(0,30).map(async id=>{try{const [p,pr]=await Promise.all([API.db.ref('profiles/'+id).get(),API.db.ref('presence/'+id).get()]);
      const v=p.val()||{};return {id,nick:v.nick||'؟',av:v.av||'❔',lv:v.lv|0,tt:v.tt?String(v.tt).slice(0,30):'',on:!!pr.val(),adm:v.adm===true}}catch(e){return null}}));
    fcache=rows.filter(Boolean).sort((a,b)=>(b.on-a.on)||(b.lv-a.lv));
    const s=(await API.db.ref('leader/'+API.week()).get()).val()||{};
    hcache=Object.entries(s).map(([id,v])=>({id,adm:v.adm===true,nick:v.nick||'؟',av:v.av||'❔',xp:v.xp|0,wins:v.wins|0,lv:v.lv|0,tt:typeof v.tt=='string'?v.tt.slice(0,30):''})).filter(r=>!r.adm&&!(isAdm()&&r.id==API.me)).sort((a,b)=>(Math.max(b.xp,b.wins*10)-Math.max(a.xp,a.wins*10))).slice(0,30);
    try{localStorage.setItem('usul5_social_v1',JSON.stringify({f:fcache,h:hcache}))}catch(e){}
    if($('#home').classList.contains('on')){const a=$('#hFrSum');if(a)a.textContent=frSum();drawHeroes()}
    if(frOpen&&$('#alqab').classList.contains('on')&&$('#aqTitle').textContent=='👥 أصدقائي')drawFriends();
    if($('#alqab').classList.contains('on')&&$('#aqTitle').textContent=='🏅 أبطال هذا الأسبوع')drawHeroesPage()}
  catch(e){}finally{loading=false}}
async function friendCard(id){const r=(fcache||[]).find(x=>x.id==id);if(!r)return;const API=O();
  let p={};try{p=(await API.db.ref('profiles/'+id).get()).val()||{}}catch(e){}
  const md=String(p.md||'').split(',').filter(Boolean).map(x=>{const [k,t]=x.split(':');const m=MEDALS.find(m=>m.id==k);return m&&t>0?`<span title="${m.n}">${TIERS[t-1].e}${m.e}</span>`:''}).join(' ');
  modal(`<div style="font-size:60px;line-height:1.2">${esc(p.av||r.av)}</div><h3 style="margin:2px 0">${nameTag(p.nick||r.nick,p.adm===true)}</h3>
    <p style="margin:2px 0">${p.lv?`<span class="aqlv">⭐ المستوى ${ar(p.lv)}</span>`:''} ${p.tt?`<span class="aqtt">${esc(p.tt)}</span>`:''}</p>
    ${md?`<p style="font-size:22px;margin:6px 0">${md}</p>`:''}<p style="margin:2px 0;color:var(--muted);font-size:14px">${r.on?'🟢 متصل الآن':'⚪ غير متصل'} · 🏆 ${ar(p.wins||0)} فوز</p>
    <div class="nav"><button class="btn gold" id="fcCh" ${r.on?'':'disabled'}>⚔️ تحدَّه</button><button class="btn" id="fcHouse" style="background:#2f6fd0;box-shadow:0 5px 0 #1d4e9e">🏡 بيته</button></div>${isAdm()?`<div class="nav"><button class="btn" id="fcGift" style="background:linear-gradient(160deg,#f6b33d,#e0731f);box-shadow:0 5px 0 #a8551a">👑 💎 أهدِه جواهر من المدير</button></div>`:''}<div class="nav"><button class="btn sec" data-close>رجوع</button></div>${p.adm===true||isAdm()?'':`<button class="rzlink" id="fcRep" style="display:block;margin:6px auto 0;font-size:13px;opacity:.75">🚩 بلّغ عن اسم غير لائق</button>`}`,()=>{
    $('#fcCh').onclick=()=>{closeModal();API.challenge(id)};
    const rp=$('#fcRep');if(rp)rp.onclick=()=>reportName(id,p.nick||r.nick,p.av||r.av);
    const fg=$('#fcGift');if(fg)fg.onclick=()=>{closeModal();window.Idara&&Idara.gift(id,p.nick||r.nick,p.av||r.av)};
    $('#fcHouse').onclick=()=>{closeModal();$('#openBayt')&&$('#openBayt').click();setTimeout(()=>{const b=$('#jFr');b&&b.click()},150)}})}

/* ---------- 🚩 التبليغ عن اسم غير لائق (v20.7) ----------
   يصل للمدير فقط في reports/{الطفل}/{المبلِّغ} — الطفل المبلَّغ عنه لا يعرف من بلّغ، ولا يراه غيره.
   مرة واحدة لكل اسم (القواعد تمنع التكرار)، وحدّ ٣ بلاغات في اليوم حتى لا يصير لعبًا. */
function reportName(id,nick,av){const API=O();if(!API||!API.me||!API.db||id==API.me)return;
  const a=A(),day=new Date().toDateString();a.rep=a.rep&&typeof a.rep=='object'?a.rep:{d:'',n:0,ids:{}};a.rep.ids=a.rep.ids||{};
  if(a.rep.d!==day){a.rep.d=day;a.rep.n=0}
  if(a.rep.ids[id]){API.toast('سبق أن بلّغت عن هذا الاسم 🤍 الإدارة ستراه');return}
  if(a.rep.n>=3){API.toast('تكفي ٣ بلاغات في اليوم 🤍 جرّب غدًا');return}
  modal(`<div style="font-size:50px;line-height:1.2">${esc(av||'❔')}</div><h3 style="margin:4px 0">هل اسم «${esc(nick||'')}» غير لائق؟</h3>
    <p style="font-size:15px;margin:4px 0">يصل بلاغك إلى الإدارة فقط، ولن يعرف ${B('صاحب','صاحبة')} الاسم من بلّغ 🤍<br>${B('بلّغ','بلّغي')} فقط إذا كان الاسم فيه كلمة سيئة أو شتيمة.</p>
    <div class="nav"><button class="btn sec" data-close>لا، رجوع</button><button class="btn" id="rpYes" style="background:#c43d38;box-shadow:0 5px 0 #8a2a26">🚩 نعم، ${B('بلّغ','بلّغي')}</button></div>`,()=>{
    $('#rpYes').onclick=async()=>{$('#rpYes').disabled=true;let ok=true;
      try{await API.init();await API.db.ref(`reports/${id}/${API.me}`).set({n:String(nick||'').slice(0,40),t:firebase.database.ServerValue.TIMESTAMP})}
      catch(e){ok=/permission/i.test(String(e&&(e.code||e.message)))}   // «ممنوع» = بلّغ عنه من قبل
      if(!ok){$('#rpYes').disabled=false;API.toast('تعذّر الإرسال، تأكّد من الإنترنت');return}
      a.rep.ids[id]=1;a.rep.n++;const k=Object.keys(a.rep.ids);if(k.length>60)delete a.rep.ids[k[0]];Aamal.save();
      closeModal();API.toast('وصل بلاغك للإدارة، شكرًا لأنك تحافظ على جنّتنا نظيفة 🌷')}})}
// الضغط على أي بطل في «أبطال هذا الأسبوع» يفتح بطاقة صغيرة فيها زر التبليغ
document.addEventListener('click',e=>{const d=e.target.closest&&e.target.closest('.hher [data-hr]');if(!d)return;
  const API=O(),id=d.dataset.hr,r=(hcache||[]).find(x=>x.id==id);if(!r||!API||id==API.me||r.adm)return;
  const f=(fcache||[]).find(x=>x.id==id);if(f)return friendCard(id);
  modal(`<div style="font-size:60px;line-height:1.2">${esc(r.av)}</div><h3 style="margin:2px 0">${esc(r.nick)}</h3>
    <p style="margin:2px 0">${r.lv?`<span class="aqlv">⭐ المستوى ${ar(r.lv)}</span>`:''} ${r.tt?`<span class="aqtt">${esc(r.tt)}</span>`:''}</p>
    <p style="margin:4px 0;color:var(--muted);font-size:14px">${r.xp?`✨ ${ar(r.xp)} نقطة هذا الأسبوع`:''}${r.wins?` · 🏆 ${ar(r.wins)}`:''}</p>
    <div class="nav"><button class="btn sec" data-close>رجوع</button></div>
    ${isAdm()?'':`<button class="rzlink" id="hrRep" style="display:block;margin:6px auto 0;font-size:13px;opacity:.75">🚩 بلّغ عن اسم غير لائق</button>`}`,()=>{
    const b=$('#hrRep');if(b)b.onclick=()=>reportName(id,r.nick,r.av)})});

/* ---------- نشر المستوى والأوسمة للأصدقاء + نقاط الأسبوع ---------- */
let pubKey='';
function publish(){const API=O();if(!API||!API.profile||!API.db)return;const s=snap(),t=shownTitle(s);
  const md=MEDALS.filter(m=>s.tiers[m.id]).map(m=>m.id+':'+s.tiers[m.id]).join(',');
  const a=A(),w=API.week();if(!a.wk||a.wk.w!==w){a.wk={w,base:s.x};Aamal.save()}
  const wx=Math.max(0,s.x-a.wk.base);
  // ملخّص تقدّم الطفل للمدير (v8.2): يُنشر في profiles/$uid/sm
  const c=s.c,sm={st:c.stages|0,sr:c.stars|0,hz:c.hifz|0,pr:c.pray|0,sl:c.sal|0,ts:c.tas|0,wd:c.wird|0,ak:c.akhlaq|0,fq:c.fiqh|0,cu:c.cups|0,fl:c.floors|0,xp:s.x|0,
    j:window.Deco?Deco.j|0:0,dt:window.Aamal&&Aamal.dirt?Aamal.dirt():0,u:window.Binaa?Binaa.code():'',mq:window.Deco&&Deco.owns('d_mosque')?1:0,ttl:s.titles.length,tp:window.Seal?Seal.tampered():0};
  const flg=window.Flag?Flag.get():'';const key=[s.L,t&&t.id,md,wx,API.profile.nick,API.profile.av,JSON.stringify(sm),flg].join('|');if(key==pubKey)return;pubKey=key;
  const tt=isAdm()?'👑 مدير جنّتي الصغيرة':t?`${t.e} ${t.n}`:'';Object.assign(API.profile,{lv:s.L,tt,md,sm,flg});
  API.db.ref('profiles/'+API.me).update({lv:s.L,tt,md,sm,flg}).catch(()=>{});
  // v8.6: المدير لا يدخل أبطال الأسبوع (طلب صاحب التطبيق)، ويُشال اسمه إذا كان موجودًا
  if(isAdm()){API.db.ref(`leader/${w}/${API.me}`).remove().catch(()=>{});return}
  // v20.9: السيرفر يقبل زيادة محدودة بحسب الوقت (tx = وقت السيرفر)؛ إذا رُفضت نعيد المحاولة لاحقًا
  if(wx>0)API.db.ref(`leader/${w}/${API.me}`).update({nick:API.profile.nick,av:API.profile.av,xp:Math.min(20000,wx),lv:Math.min(200,s.L),tt,tx:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{pubKey=''})}

/* ---------- الاحتفال: ارتفعت درجتك / وسام جديد / لقب جديد / جائزة للبيت ---------- */
let soonT=0,pending=false;
function busy(){const on=document.querySelector('.screen.on');const id=on&&on.id;
  if($('#modal').classList.contains('on')||$('#celebrate').classList.contains('on')||document.querySelector('.countdown'))return true;
  if(['quiz','contest','online'].includes(id))return true;if(id=='bayt'&&window.Bayt&&Bayt.G)return true;if(id=='baytrace')return true;return false}
// النقاط تظهر حتى في شاشة النتيجة، لكن لا تقاطع لعبةً أو امتحانًا جاريًا
function toastBusy(){const on=document.querySelector('.screen.on'),id=on&&on.id;
  if($('#modal').classList.contains('on')||$('#celebrate').classList.contains('on')||document.querySelector('.countdown'))return true;
  if(id=='quiz')return true;if(id=='bayt'&&window.Bayt&&Bayt.G&&Bayt.G.run)return true;if(id=='baytrace'&&!on.querySelector('.result,.bover'))return true;
  if(['contest','online'].includes(id)&&!on.querySelector('.result'))return true;return false}
function pointsToast(d,s){const old=document.getElementById('ptToast');if(old)old.remove();
  const f=(s.x-need(s.L))/(need(s.L+1)-need(s.L)),ln=lvName(s.L),t=document.createElement('div');t.id='ptToast';t.className='pttoast';
  t.innerHTML=`<b>✨ +${ar(d)} نقطة</b><span>${ln[1]} المستوى ${ar(s.L)} · باقي ${ar(need(s.L+1)-s.x)} للمستوى ${ar(s.L+1)}</span><div class="xpbar"><i style="width:${Math.round(f*100)}%"></i></div>`;
  t.onclick=()=>{t.remove();openProfile()};document.body.appendChild(t);
  try{[880,1175,1568].forEach((q,i)=>tone(q,.1,'sine',.09,i*.07))}catch(e){}
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),500)},3200)}
function check(){const s=snap(),a=A();
  if(!a.seen){a.seen={L:s.L,tiers:s.tiers,titles:s.titles,tt:(autoTitle(s)||{}).id||''};Aamal.save()}
  // ✨ النقاط: بعد كل عمل تظهر النقاط التي ربحها الطفل وشريط مستواه
  if(a.lastX==null){a.lastX=s.x;Aamal.save()}
  if(s.x>a.lastX){if(toastBusy()){pending=true;clearTimeout(soonT);soonT=setTimeout(check,3000)}else{pointsToast(s.x-a.lastX,s);a.lastX=s.x;Aamal.save()}}
  else if(s.x<a.lastX){a.lastX=s.x;Aamal.save()}
  // جوائز البيت
  const gifts=[];if(window.Deco&&Deco.grant)DEED_ITEMS.forEach(([id,ok])=>{if(ok(s.c)&&Deco.grant(id))gifts.push(Deco.item(id))});
  const seen=a.seen,rows=[];
  MEDALS.forEach(m=>{const t=s.tiers[m.id],o=(seen.tiers||{})[m.id]|0;if(t>o)rows.push(`<div class="row"><span>${TIERS[t-1].e}${m.e}</span>وسام «${m.n}» ${TIERS[t-1].n}</div>`)});
  const at=autoTitle(s);if(at&&at.id!==(seen.tt||''))rows.unshift(`<div class="row" style="background:#e3f7ea"><span>${at.e}</span>لقبك الجديد: <b>${at.n}</b></div>`);
  s.titles.filter(x=>!(seen.titles||[]).includes(x)).forEach(id=>{const t=TITLES.find(t=>t.id==id);rows.push(`<div class="row"><span>${t.e}</span>إنجاز جديد: ${t.n}</div>`)});
  gifts.forEach(g=>rows.push(`<div class="row"><span>${g.e}</span>جائزة لبيتك: ${g.name} 🏡</div>`));
  const up=s.L>seen.L;
  if(!up&&!rows.length){a.seen={L:s.L,tiers:s.tiers,titles:s.titles,tt:(autoTitle(s)||{}).id||''};Aamal.save();publish();return}
  if(busy()){pending=true;clearTimeout(soonT);soonT=setTimeout(check,3000);return}
  const seenL=seen.L;pending=false;a.seen={L:s.L,tiers:s.tiers,titles:s.titles,tt:(autoTitle(s)||{}).id||''};Aamal.save();publish();
  const ln=lvName(s.L);
  try{fanfare();confetti()}catch(e){}
  modal(`<div class="lvup"><div class="big">${up?ln[1]:'🏅'}</div><h3 style="margin:2px 0;color:#14794f">${up?`ارتفعت درجتك! المستوى ${ar(s.L)}`:B('مبروك! ربحتَ جديدًا','مبروك! ربحتِ جديدًا')}</h3>
    ${up&&lvName(seenL)!==ln?`<p style="margin:0 0 6px;font-weight:800;color:#8a5a00">${B('صرتَ','صرتِ')} ${ln[2]} ${ln[1]}</p>`:up&&LEVELS.find(l=>l[0]>s.L)?`<p style="margin:0 0 6px;color:#8a5a00">${B('استمرّ','استمرّي')} حتى المستوى ${ar(LEVELS.find(l=>l[0]>s.L)[0])} ${B('لتصير','لتصيري')} ${LEVELS.find(l=>l[0]>s.L)[2]} ${LEVELS.find(l=>l[0]>s.L)[1]}</p>`:''}${rows.join('')}
    <div class="nav"><button class="btn gold" id="lvMy">🏅 ملفّي</button><button class="btn sec" data-close>الحمد لله 🤲</button></div></div>`,()=>{$('#lvMy').onclick=()=>{closeModal();openProfile()}});
  if($('#home').classList.contains('on'))drawHome()}
const soon=()=>{clearTimeout(soonT);soonT=setTimeout(check,1200)};

/* ---------- شاشة ملفّي ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='alqab';
sec.innerHTML=`<div class="bar"><button class="back" id="aqBack">›</button><div class="ttl" id="aqTitle">🏅 ملفّي</div></div><div id="aqBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
let aqBack=null,vc=null;
const stopVc=()=>{if(vc){vc.stop();vc=null}};
$('#aqBack').onclick=()=>{stopVc();if(aqBack){const f=aqBack;aqBack=null;f()}else goHome()};
// (v13.2) ملفّي أقصر وأجمل: رأس مجسّم، أعمال اليوم بأزرار ملوّنة مجسّمة، ثم ٣ تبويبات (أوسمتي/قوّتي/إنجازاتي) بدل صفحة طويلة. صورة البيت وقائمة حديقة الأعمال حُذفتا (البيت في المدينة، والأرقام في الأوسمة).
let aqTab='m';
const PAL=i=>['--c:#e6f8ec;--d:#a9e2bd','--c:#e5f1ff;--d:#a9c7ee','--c:#ffe9f2;--d:#f2b3cb','--c:#fff6d6;--d:#efd27a','--c:#f0eaff;--d:#c6b5ee','--c:#e2f7f5;--d:#9fd9d2'][i%6];
function openProfile(){stopVc();aqBack=null;show('alqab');$('#aqTitle').textContent='🏅 ملفّي';const s=snap(),c=s.c,ln=lvName(s.L),t=shownTitle(s),f=(s.x-need(s.L))/(need(s.L+1)-need(s.L));
  const prof=O()&&O().profile;
  $('#aqBody').innerHTML=`<div class="aqhead"><div class="av">${esc(myAv())}</div><h2>${nameTag(myName(),isAdm())} <button class="aqflag" id="aqFlag" aria-label="علم دولتي">${window.Flag?Flag.get():''}</button></h2>
    <button class="aqloc" id="aqLoc">📍 ${window.Flag?Flag.name():'العراق'} · ${window.Adhan&&Adhan.city?Adhan.city[1]:'بغداد'} <i>✏️ دولتي ومدينتي</i></button>
    <span class="aqlv">${ln[1]} المستوى ${ar(s.L)} · ${ln[2]}</span><br>${t?`<span class="aqtt">${t.e} ${t.n}</span>`:''}
    <div class="xpbar" style="margin:8px 10px 2px;height:12px"><i style="width:${Math.round(f*100)}%"></i></div>
    <small style="color:var(--muted)">✨ ${ar(s.x)} نقطة · باقي ${ar(need(s.L+1)-s.x)} للمستوى ${ar(s.L+1)}</small>
    <div class="nav" style="margin-top:6px"><button class="btn sec" id="aqOn" style="padding:8px">${prof||state.nick?'✏️ غيّر اسمي وصورتي':'✏️ اكتب اسمك واختر صورتك'}</button></div></div>
   <div class="aqsec">🤲 ${B('أعمالك','أعمالكِ')} اليوم</div>
   <div class="aqdo">${doBtns()}</div>
   <div class="aqtabs">${[['m','🏅','أوسمتي'],['a','💪','قوّتي'],['t','🏆','إنجازاتي']].map(([k,e,n])=>`<button data-tab="${k}" class="${aqTab==k?'on':''}"><span>${e}</span>${n}</button>`).join('')}</div>
   <div class="aqpane" data-pane="m" ${aqTab=='m'?'':'hidden'}><div class="aqm aqm3">${MEDALS.map((m,i)=>{const tr=s.tiers[m.id],nx=m.at[tr],prev=tr?m.at[tr-1]:0,v=c[m.k],fr=nx?Math.min(1,(v-prev)/(nx-prev)):1,col=tr?TIERS[tr-1].c:'#9fd2b4';
     return `<button class="t${tr}" style="${PAL(i)}" data-m="${m.id}">${tr?`<span class="t">${TIERS[tr-1].e}</span>`:''}<div class="e">${m.e}</div><b>${m.n}</b><small>${ar(v)} ${m.u}</small><div class="bar2"><i style="width:${fr*100}%;background:${col}"></i></div></button>`}).join('')}</div></div>
   <div class="aqpane" data-pane="a" ${aqTab=='a'?'':'hidden'}><p class="hnote">لقبك يأتي من المجال الذي ${B('تتفوّق','تتفوّقين')} فيه 🌟</p><div class="aqm aqm3">${AREAS.map((a,i)=>{const tr=areaTier(a,s);return `<button class="t${tr}" style="${PAL(i+2)}" data-ar="${a.id}">${tr?`<span class="t">${TIERS[tr-1].e}</span>`:''}<div class="e">${a.e}</div><b>${a.n}</b><small>${tr?a.t[tr>=3?1:0]:'لم يبدأ بعد'}</small></button>`}).join('')}</div></div>
   <div class="aqpane" data-pane="t" ${aqTab=='t'?'':'hidden'}><div class="aqts">${TITLES.map((x,i)=>{const own=s.titles.includes(x.id);return `<button data-t="${x.id}" style="${PAL(i)}" class="${own?'on':'lock'}"><span>${own?x.e:'🔒'}</span>${x.n}</button>`}).join('')}</div></div>`;
  $('#aqBody').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tone(880,.05,'sine',.08);aqTab=b.dataset.tab;
    $('#aqBody').querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));$('#aqBody').querySelectorAll('[data-pane]').forEach(x=>x.hidden=x.dataset.pane!==aqTab)});
  bindDo($('#aqBody'),openProfile);
  $('#aqBody').querySelectorAll('[data-dg]').forEach(b=>b.onclick=()=>{tone(880,.05,'sine',.08);goTo(DGO[b.dataset.dg],openProfile)});
  const hh=$('#aqHouse');if(hh){hh.style.cursor='pointer';hh.onclick=()=>view3D()};
  $('#aqBody').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const x=TITLES.find(t=>t.id==b.dataset.t);
    const own=s.titles.includes(x.id);modal(`<div style="font-size:50px">${x.e}</div><h3 style="margin:4px 0">${x.n}</h3><p>${own?B('ما شاء الله! ربحتَ هذا الإنجاز 🌟','ما شاء الله! ربحتِ هذا الإنجاز 🌟'):`${B('كيف تربحه','كيف تربحينه')}؟<br><b>${x.how}</b>`}</p><div class="nav"><button class="btn gold" data-close>حسنًا 💪</button></div>`)});
  $('#aqBody').querySelectorAll('[data-ar]').forEach(b=>b.onclick=()=>{const a=AREAS.find(x=>x.id==b.dataset.ar),tr=areaTier(a,s);
    modal(`<div style="font-size:54px">${a.e}</div><h3 style="margin:4px 0">${a.n}</h3><p>${tr?`درجتك: ${TIERS[tr-1].e} ${TIERS[tr-1].n}<br>لقبك فيه: <b>${a.t[tr>=3?1:0]}</b>`:'لم تبدأ بعد'}</p><p style="font-size:15px">${B('لتتفوّق','لتتفوّقي')} أكثر: <b>${a.how}</b>${tr<3?`<br>عند الدرجة 🥇 يصير لقبك: <b>${a.t[1]}</b>`:''}</p>
      <div class="nav"><button class="btn gold" id="arGo">هيّا 💪</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{$('#arGo').onclick=()=>{closeModal();goTo(a.go,openProfile)}})});
  $('#aqBody').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const m=MEDALS.find(m=>m.id==b.dataset.m),tr=s.tiers[m.id];
    modal(`<div style="font-size:54px">${tr?TIERS[tr-1].e:''}${m.e}</div><h3 style="margin:4px 0">${m.n}</h3><p>${ar(c[m.k])} ${m.u}</p>
      <p style="font-size:15px">${m.at.map((x,k)=>`${TIERS[k].e} ${TIERS[k].n}: ${ar(x)}${c[m.k]>=x?' ✅':''}`).join('<br>')}</p>
      <div class="nav"><button class="btn gold" id="mGo">هيّا أعمل 💪</button><button class="btn sec" data-close>رجوع</button></div>`,()=>{$('#mGo').onclick=()=>{closeModal();goTo(m.go)}})});
  // (v17.2) الدولة ثم المدينة (للأذان والطقس)
  const locPick=()=>{stopVc();Flag.pick(f=>{try{Adhan.fitCountry(f)}catch(e){}publish();if(window.Adhan&&Adhan.pickCity)Adhan.pickCity(()=>{publish();openProfile()});else openProfile()})};
  {const fb=$('#aqFlag');if(fb)fb.onclick=locPick;const lb=$('#aqLoc');if(lb)lb.onclick=locPick}
  const on=$('#aqOn');if(on)on.onclick=()=>{stopVc();if(O()&&O().editProfile)O().editProfile(openProfile);else{window.onlineReturn=openProfile;openOnline()}};
  window.scrollTo(0,0)}
function doBtns(){const a=Aamal,tp=window.Salah?Salah.todayPray().filter(Boolean).length:0;
  let k=0;const P=()=>` style="${PAL(k++)}"`;
  return `<button data-do="sal"${P()}>${a.doneToday('sal')?'<i>✅</i>':''}<span>💚</span>صلِّ على النبي ١٠</button>
   <button data-do="tas"${P()}>${a.doneToday('tas')?'<i>✅</i>':''}<span>📿</span>سبّح الله ١٠</button>
   <button data-do="pray"${P()}>${tp==5?'<i>✅</i>':''}<span>🤲</span>صلّيتُ ${ar(tp)}/٥</button>
   <button data-do="salah"${P()}><span>🕌</span>وضوئي وصلاتي</button>
   <button data-do="hifz"${P()}><span>🎤</span>سمّعني آية</button>
   <button data-do="nafsak"${P()}><span>🌷</span>اختبر أخلاقي</button>`}
function bindDo(el,ret){el.querySelectorAll('[data-do]').forEach(b=>b.onclick=()=>{tone(880,.05,'sine',.08);goTo(b.dataset.do,ret)})}
function goTo(g,ret){const click=s=>{const e=$(s);e&&e.click()};
  ({sal:()=>count('sal',ret),tas:()=>count('tas',ret),pray:()=>window.Salah&&Salah.openPray(),salah:()=>window.Salah&&Salah.open(),
    hifz:()=>click('#openHifz'),contest:()=>click('#openContest'),nafsak:()=>click('#openNafsak'),bayt:()=>click('#openBayt'),wird:()=>click('#openWird'),
    online:()=>{window.onlineReturn=openProfile;openOnline()},map:goHome})[g]()}

/* ---------- عدّاد الصلاة على النبي والتسبيح بالصوت ---------- */
const PHR={sal:{t:'💚 صلِّ على النبي وآله',p:'اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',e:'💚',why:'«من صلّى عليّ صلاةً صلّى الله عليه بها عشرًا»'},
  tas:{t:'📿 سبّح الله',p:'سُبْحَانَ اللَّهِ',e:'📿',why:'التسبيح يملأ بيتك في الجنة بالخير 🌳'}};
function streetLine(){const n=Aamal.salWin(),own=k=>window.Deco&&Deco.owns&&Deco.owns(k);
  const tgt=n>=1000?0:n>=500?1000:500;
  const txt=!tgt?'🏮 مصابيح شارع بيتك كلّها تضيء! ما شاء الله'
    :`🏮 هذا الشهر: <b>${ar(n)} / ${ar(tgt)}</b> صلاة بصوتك<br><small>${tgt==500?'عند ٥٠٠ تضيء ٣ مصابيح أمام بيتك، وعند ١٠٠٠ تكتمل المصابيح':'أحسنت! ٣ مصابيح تضيء. أكمل ١٠٠٠ خلال ٣٠ يومًا لتكتمل مصابيح الشارع'}</small>`;
  return `<div class="cupbox" style="margin:0 0 8px">${txt}</div>`}
function count(k,ret){stopVc();show('alqab');aqBack=ret||null;const P=PHR[k];$('#aqTitle').textContent=P.t;
  $('#aqBody').innerHTML=`<p class="bcap" style="margin:0 0 8px">${B('قلها','قوليها')} <b>١٠ مرات</b> بصوتك، والتطبيق يعدّ لك 🎤<br><small>${P.why}</small></p>${k=='sal'?streetLine():''}<div id="aqVc"></div><div id="aqCups"></div>
    <div class="nav"><button class="btn sec" id="aqDone">رجوع</button></div>`;
  vc=Voice.counter($('#aqVc'),{phrase:P.p,target:10,emoji:P.e,onDone:n=>{Aamal.add(k,n);Aamal.grow(k);const first=Aamal.firstToday(k);
    try{fanfare();confetti()}catch(e){}
    const el=$('#aqCups');el.innerHTML=`<div class="cupbox win"><b>${P.e} +${ar(n)}</b>${B('بارك الله فيك!','بارك الله فيكِ!')} مجموعك: ${ar(A()[k])}</div>`;
    if(first&&window.cupsAward)cupsAward(1,'deeds',el);if(window.Deco)el.insertAdjacentHTML('beforeend',Deco.challenge(5,'deeds'));
    $('#aqDone').textContent='🔁 مرة أخرى';$('#aqDone').className='btn gold';$('#aqDone').onclick=()=>count(k,ret);
    el.insertAdjacentHTML('afterend',`<div class="nav"><button class="btn sec" id="aqBk">رجوع</button></div>`);$('#aqBk').onclick=()=>$('#aqBack').click();
    soon()}});
  $('#aqDone').onclick=()=>$('#aqBack').click();window.scrollTo(0,0)}

/* ---------- البيت: أعمال تبني بيتك + بيت ثلاثي الأبعاد ---------- */
/* ---------- 🏡✨ عرض البيت ثلاثي الأبعاد: يدور مع الإصبع، فيه عمق ولمعات، ووضع ليلي تضيء فيه الشبابيك ---------- */
function view3D(){if(!window.Bayt)return;const ov=document.createElement('div');ov.className='v3ov';
  const P=['✨','🦋','🕊️','🌸','⭐','✨','🦋','🌼','✨','💫','🌸','✨'];
  const parts=P.map((e,k)=>{const x=6+((k*37)%88),y=8+((k*53)%70),z=60+((k*41)%120),d=(k%5)*.6;
    return `<span class="v3p" style="left:${x}%;top:${y}%;transform:translateZ(${z}px)"><i style="animation-delay:${d}s;font-size:${16+(k%3)*6}px">${e}</i></span>`}).join('');
  const stars=Array.from({length:26},(_,k)=>`<i style="left:${(k*29)%100}%;top:${(k*17)%55}%;animation-delay:${(k%7)*.3}s"></i>`).join('');
  ov.innerHTML=`<div class="v3top"><button class="v3b" id="v3x" aria-label="إغلاق">✖</button><b>🏡 بيتي في الجنة</b><button class="v3b" id="v3n" aria-label="ليل ونهار">🌙</button></div>
   <div class="v3stage" id="v3s"><div class="v3world sway" id="v3w">
     <div class="v3stars">${stars}</div>
     <div class="v3house">${Bayt.houseSVG(Bayt.done,-1,0,true,false)}</div>
     <div class="v3glow"></div><div class="v3shadow"></div>${parts}</div></div>
   <p class="v3hint">👆 حرّك إصبعك لتدور حول بيتك · 🌙 للّيل · كل عملٍ صالح يزيّن بيتك أكثر 🌷</p>
   <div class="v3acts"><button class="btn gold" id="v3shop">🎨 زيّن بيتك</button><button class="btn" id="v3in" style="background:linear-gradient(160deg,#ffb36b,#c96a2a);box-shadow:0 5px 0 #8a4a1a">🛋️ ادخل بيتك</button></div>`;
  document.body.appendChild(ov);document.body.style.overflow='hidden';
  const w=$('#v3w'),st=$('#v3s');let ry=0,rx=0,drag=null,idleT=0;
  const apply=()=>{w.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`};
  const idle=()=>{clearTimeout(idleT);idleT=setTimeout(()=>{ry=0;rx=0;w.style.transform='';w.classList.add('sway')},2600)};
  st.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,ry,rx};w.classList.remove('sway');try{st.setPointerCapture(e.pointerId)}catch(x){}};
  st.onpointermove=e=>{if(!drag)return;ry=Math.max(-50,Math.min(50,drag.ry+(e.clientX-drag.x)*.4));rx=Math.max(-14,Math.min(18,drag.rx-(e.clientY-drag.y)*.2));apply()};
  st.onpointerup=st.onpointercancel=()=>{drag=null;idle()};
  const close=()=>{clearTimeout(idleT);ov.remove();document.body.style.overflow=''};
  $('#v3x').onclick=close;
  $('#v3n').onclick=()=>{const n=ov.classList.toggle('night');$('#v3n').textContent=n?'☀️':'🌙';try{(n?[523,659,784]:[784,988,1175]).forEach((f,i)=>tone(f,.15,'sine',.1,i*.09))}catch(e){}};
  const toMenu=()=>{close();if(!$('#bayt').classList.contains('on')){show('bayt');Bayt.menu()}};
  $('#v3shop').onclick=()=>{toMenu();const b=$('#jShop');b&&b.click()};
  $('#v3in').onclick=()=>{toMenu();const b=$('#jIn');b&&b.click()}}
function tilt(el){if(!el||el.dataset.t3)return;el.dataset.t3=1;el.classList.add('b3d','idle');const svg=el.querySelector('svg');if(!svg)return;
  let t=0;const mv=e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.classList.remove('idle');svg.style.transform=`rotateY(${x*24}deg) rotateX(${-y*14}deg) scale(1.04)`;clearTimeout(t);t=setTimeout(()=>{svg.style.transform='';el.classList.add('idle')},1500)};
  el.addEventListener('pointermove',mv);el.addEventListener('pointerdown',mv)}
if(window.Deco&&Deco.menuHook){const orig=Deco.menuHook;Deco.menuHook=function(B0){orig.apply(this,arguments);
  const hb=B0.querySelector('.bhouse');if(hb){hb.insertAdjacentHTML('afterend','<button class="btn v3open" id="v3Open">🏡✨ شاهد بيتك ثلاثي الأبعاد</button>');$('#v3Open').onclick=()=>{tone(880,.05,'sine',.08);view3D()}}
  const own=Deco.deeds().filter(i=>Deco.owns(i.id)).length,all=Deco.deeds().length;
  const box=document.createElement('div');box.className='dbuild';
  box.innerHTML=`<h4>🤲 ${B('ابنِ','ابني')} بيتك بالأعمال الصالحة · ${ar(own)}/${ar(all)} جائزة</h4><div class="aqdo">${doBtns()}</div>`;
  const jb=B0.querySelector('.jbar');(jb||hb).after(box);bindDo(box,()=>{show('bayt');Bayt.menu()});soon()}}
window.Alqab={report:(id,n,a)=>reportName(id,n,a),soon,check,openProfile,snap,deedFor(id){const m={d_rose:'sal',d_palms:'sal',d_noor:'sal',d_birds:'tas',d_lamps:'pray',d_fruit:'pray',d_star:'hifz',d_spring:'salah',d_mosque:'salah'};goTo(m[id]||'salah',()=>{show('bayt');Bayt.menu()})}};

/* ---------- ربط الأحداث ---------- */
// اختبر نفسك: الجولة الممتازة (كأسان أو أكثر) = عمل خُلقي
const _ca=window.cupsAward;if(_ca)window.cupsAward=function(n,src,el){if(src=='nafsak'&&n>=2){Aamal.add('akhlaq',1);Aamal.grow('akhlaq')}const r=_ca.apply(this,arguments);soon();return r};
const _rh=window.renderHome;window.renderHome=function(){_rh.apply(this,arguments);drawHome();soon()};
const _wf=window.wirdFinish;if(_wf)window.wirdFinish=function(){const daily=typeof qz!='undefined'&&qz&&qz.mode=='daily';const r=_wf.apply(this,arguments);if(daily)Aamal.grow('wird');soon();return r};
// كل تحدٍّ يلعبه الطفل (مسابقة الأبطال، أونلاين، سباق البيت، بناء طابق) = بالون في البيت ونقاط
if(window.Deco){const _dc=Deco.challenge,_fj=Deco.floorJewels;
  Deco.challenge=function(n,src){const r=_dc.apply(this,arguments);if(['contest','online','brace'].includes(src))Aamal.grow('ctst');soon();return r};
  Deco.floorJewels=function(){const r=_fj.apply(this,arguments);Aamal.grow('ctst');soon();return r}}
// نجاح في امتحان مرحلة من الكتاب = دوّار شمس في البيت
const _ce=window.celebrate;if(typeof _ce=='function')window.celebrate=function(){const r=_ce.apply(this,arguments);Aamal.grow('dars');return r};
setInterval(()=>{if(pending&&!toastBusy())check()},4000);
drawHome();setTimeout(check,1500);
})();

// ===== (v17.1) طلب الشيخ: علم دولة الطفل — يظهر في «ملفّي» وعلى مدرسته في المدينة. العراق أوّلًا، ثم الدول العربية، ثم الإسلامية =====
(function(){const K='usul5_flag_v1';
  const L=[['🇮🇶','العراق'],['🇸🇦','السعودية'],['🇰🇼','الكويت'],['🇧🇭','البحرين'],['🇶🇦','قطر'],['🇦🇪','الإمارات'],['🇴🇲','عُمان'],['🇾🇪','اليمن'],['🇯🇴','الأردن'],['🇸🇾','سوريا'],['🇱🇧','لبنان'],['🇵🇸','فلسطين'],['🇪🇬','مصر'],['🇸🇩','السودان'],['🇱🇾','ليبيا'],['🇹🇳','تونس'],['🇩🇿','الجزائر'],['🇲🇦','المغرب'],['🇲🇷','موريتانيا'],['🇸🇴','الصومال'],['🇩🇯','جيبوتي'],['🇰🇲','جزر القمر'],
    ['🇮🇷','إيران'],['🇹🇷','تركيا'],['🇵🇰','باكستان'],['🇦🇫','أفغانستان'],['🇦🇿','أذربيجان'],['🇮🇩','إندونيسيا'],['🇲🇾','ماليزيا'],['🇧🇩','بنغلاديش'],['🇧🇳','بروناي'],['🇲🇻','المالديف'],['🇰🇿','كازاخستان'],['🇺🇿','أوزبكستان'],['🇹🇲','تركمانستان'],['🇹🇯','طاجيكستان'],['🇰🇬','قرغيزستان'],['🇦🇱','ألبانيا'],['🇧🇦','البوسنة والهرسك'],
    ['🇳🇬','نيجيريا'],['🇸🇳','السنغال'],['🇲🇱','مالي'],['🇳🇪','النيجر'],['🇹🇩','تشاد'],['🇬🇳','غينيا'],['🇬🇲','غامبيا'],['🇧🇫','بوركينا فاسو'],['🇸🇱','سيراليون'],['🇨🇲','الكاميرون'],['🇺🇬','أوغندا'],['🇲🇿','موزمبيق'],['🇬🇦','الغابون'],['🇧🇯','بنين'],['🇹🇬','توغو'],['🇨🇮','ساحل العاج'],['🇬🇼','غينيا بيساو'],['🇸🇷','سورينام'],['🇬🇾','غيانا']];
  const get=()=>{try{const v=localStorage.getItem(K);if(v&&L.some(f=>f[0]===v))return v}catch(e){}return '🇮🇶'};
  const name=e=>(L.find(f=>f[0]===(e||get()))||L[0])[1];
  const set=e=>{try{localStorage.setItem(K,e)}catch(x){}try{window.City3D&&City3D.refresh()}catch(x){}};
  const st=document.createElement('style');st.textContent=`.flgov{position:fixed;inset:0;z-index:99990;background:#0007;display:flex;align-items:center;justify-content:center;padding:14px}
.flgov .in{background:#fffdf5;border-radius:22px;padding:12px 10px;width:100%;max-width:440px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 6px 0 #d9c58a,0 10px 30px #0005}
.flgov h4{margin:0 0 4px;text-align:center;font-size:19px;color:#5a3d00}.flgov p{margin:0 0 8px;text-align:center;font-size:13px;color:#7a6a3a;font-weight:700}
.flgov .g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;overflow:auto;padding:2px 2px 6px}
.flgov .g button{border:0;border-radius:14px;padding:6px 2px;font:inherit;font-weight:900;font-size:12.5px;line-height:1.2;color:#2b3550;background:var(--c);box-shadow:0 4px 0 var(--d),0 4px 8px #0002,inset 0 2px 0 #fff9}
.flgov .g button b{display:block;font-size:34px;line-height:1.2}.flgov .g button.on{outline:3px solid #1fa463}
.flgov .x{margin:10px auto 0;border:0;border-radius:14px;padding:9px 26px;font:inherit;font-weight:900;font-size:15px;background:#e3ecf7;color:#1d4e9e;box-shadow:0 3px 0 #a9bcd6}`;document.head.appendChild(st);
  function pick(done){const C=[['#dff5e3','#9fd3aa'],['#dcecff','#9dbde6'],['#ffe1ec','#e6a9bf'],['#fff3c4','#e3c56e'],['#ece3ff','#b9a6e6'],['#d9f5f1','#94d1c8']],cur=get();
    const ov=document.createElement('div');ov.className='flgov';
    ov.innerHTML=`<div class="in"><h4>🏳️ ${typeof B=='function'?B('اختر','اختاري'):'اختر'} علم دولتك</h4><p>يظهر في «ملفّي» وعلى مدرستك في المدينة</p><div class="g">${L.map((f,i)=>`<button data-i="${i}" class="${f[0]===cur?'on':''}" style="--c:${C[i%6][0]};--d:${C[i%6][1]}"><b>${f[0]}</b>${f[1]}</button>`).join('')}</div><button class="x">✖ إغلاق</button></div>`;
    document.body.appendChild(ov);
    ov.onclick=e=>{const b=e.target.closest('button');if(e.target===ov||b&&b.classList.contains('x')){ov.remove();return}if(!b)return;try{window.Bayt&&Bayt.sTap()}catch(x){}set(L[+b.dataset.i][0]);ov.remove();done&&done(L[+b.dataset.i][0])}}
  window.Flag={get,set,name,pick,list:L};
})();
