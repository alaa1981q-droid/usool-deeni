/* بيتك في الجنة — الزينة والجواهر والأصدقاء (يعتمد على bayt.js و online.js)
   💎 الجواهر: تُربح من بناء الطوابق، ومن كل كأس، ومن صندوق اليوم، ومن إعجاب الأصدقاء ببيتك، ومن الإهداء.
   تُصرف في «زيّن بيتك». هدايا الأصدقاء لا تُشترى، تأتي من صديق فقط.
   أونلاين: houses/$uid (شكل البيت)، gifts/$to/$id، hlikes/$uid/$from، hvisit/$uid/$from — انظر database.rules.json */
(function(){
const JKEY='usul5_jannah_v1';
let js={j:0,own:{},on:{},paint:'sand',chest:'',likesSeen:-1,gave:{},liked:{},seeded:false};
try{const s=JSON.parse(localStorage.getItem(JKEY)||'null');if(s&&typeof s.j=='number')js=Object.assign(js,s)}catch(e){}
const jsave=()=>{try{localStorage.setItem(JKEY,JSON.stringify(js))}catch(e){}};
const today=()=>new Date().toDateString();
const O=()=>window.OnlineAPI;
const boy=()=>!window.Cups||Cups.sex!='g';
const esc=v=>String(v==null?'':v).replace(/[<>&"]/g,'');

/* ---------- الكتالوج: [x,y,size] بإحداثيات رسم البيت (عرض ٣٦٠ × ارتفاع ٣٣٠، الأرض عند y=292) ---------- */
const CATS=[['garden','🌳','الأشجار والورد'],['light','💡','الإنارة'],['car','🚗','السيارات'],['animals','🦚','الحيوانات'],['sky','🕊️','السماء'],['deco','✨','الزينة'],['paint','🎨','الألوان'],['gift','🎁','هدايا الأصدقاء']];
const ITEMS=[
 {id:'tulips', cat:'garden',name:'صفّ توليب',   e:'🌷',price:20,layer:'front',at:[[118,304,15],[138,306,15],[188,306,15],[208,304,15]]},
 {id:'sunfl',  cat:'garden',name:'دوّار الشمس', e:'🌻',price:25,layer:'front',at:[[300,296,26],[318,300,22]]},
 {id:'tree',   cat:'garden',name:'شجرة كبيرة',  e:'🌳',price:35,layer:'back', at:[[18,286,48]]},
 {id:'grapes', cat:'garden',name:'عنقود عنب',   e:'🍇',price:40,layer:'front',at:[[70,250,20],[256,226,18]]},
 {id:'palm2',  cat:'garden',name:'نخلة جديدة',  e:'🌴',price:40,layer:'back', at:[[292,284,40]]},
 {id:'pine',   cat:'garden',name:'شجرتا صنوبر',e:'🌲',price:45,layer:'back', at:[[62,280,30],[350,268,26]]},
 {id:'apple',  cat:'garden',name:'تفّاح',        e:'🍎',price:30,layer:'front',at:[[12,262,14],[26,250,14],[6,244,13]],need:'tree'},
 {id:'cat',    cat:'animals',name:'قطّة',        e:'🐈',price:30,layer:'front',at:[[216,300,20]],anim:'bob'},
 {id:'fish',   cat:'animals',name:'أسماك ملوّنة',e:'🐠',price:30,layer:'front',at:[[96,322,14],[248,321,13],[300,323,12]],anim:'swim'},
 {id:'swan',   cat:'animals',name:'بجعة',        e:'🦢',price:45,layer:'front',at:[[176,322,20]],anim:'swim'},
 {id:'peacock',cat:'animals',name:'طاووس',       e:'🦚',price:70,layer:'front',at:[[282,302,32]]},
 {id:'deer',   cat:'animals',name:'غزال',        e:'🦌',price:70,layer:'front',at:[[336,306,28]]},
 {id:'horse',  cat:'animals',name:'حصان',        e:'🐎',price:90,layer:'back', at:[[322,280,34]]},
 {id:'birds',  cat:'sky',name:'حمامات بيض',     e:'🕊️',price:30,layer:'back', at:[[150,82,18],[176,96,15],[124,100,14]],anim:'fly'},
 {id:'butter', cat:'sky',name:'فراشات',          e:'🦋',price:25,layer:'front',at:[[46,226,15],[316,236,13],[270,250,12]],anim:'flut'},
 {id:'moon',   cat:'sky',name:'هلال ونجوم',     e:'🌙',price:50,layer:'back', at:[[34,40,28]],extra:'stars'},
 {id:'clouds', cat:'sky',name:'غيوم ناعمة',     e:'☁️',price:20,layer:'back', at:[[262,70,26],[110,40,22]],anim:'drift'},
 {id:'lights', cat:'light',name:'أضواء ملوّنة على السقف',e:'💡',price:60,layer:'front',svg:'lights'},
 {id:'candles',cat:'light',name:'شموع على الشبابيك',e:'🕯️',price:30,layer:'front',at:[[111,252,12],[215,252,12]]},
 {id:'glow',   cat:'light',name:'نجوم مضيئة',e:'🌟',price:55,layer:'back',at:[[60,120,16],[300,110,18],[200,60,14],[30,170,12]],anim:'twinkle'},
 {id:'bench',  cat:'deco',name:'مقعد خشبي',      e:'🪑',price:20,layer:'front',at:[[290,316,18]]},
 {id:'lamps',  cat:'light',name:'فوانيس الطريق',  e:'🏮',price:35,layer:'front',at:[[132,296,16],[194,296,16]]},
 {id:'sparkle',cat:'deco',name:'لمعة ذهبية',     e:'✨',price:45,layer:'front',at:[[90,170,16],[250,150,14],[170,40,16]],anim:'twinkle'},
 {id:'bike',   cat:'car',name:'دراجة',          e:'🚲',price:80, layer:'front',at:[[34,318,24]]},
 {id:'car',    cat:'car',name:'سيارة العائلة',  e:'🚙',price:250,layer:'front',at:[[256,314,40]]},
 {id:'racecar',cat:'car',name:'سيارة سباق',     e:'🏎️',price:400,layer:'front',at:[[322,318,36]]},
 // هدايا الأصدقاء فقط
 {id:'g_balloon',cat:'gift',name:'بالونات',      e:'🎈',gift:1,layer:'front',at:[[72,206,20],[60,218,18],[84,222,17]],anim:'bob'},
 {id:'g_bear',   cat:'gift',name:'دبدوب',        e:'🧸',gift:1,layer:'front',at:[[150,306,18]]},
 {id:'g_rose',   cat:'gift',name:'باقة ورد',     e:'💐',gift:1,layer:'front',at:[[236,306,18]]},
 {id:'g_rabbit', cat:'gift',name:'أرنب',         e:'🐇',gift:1,layer:'front',at:[[100,308,18]],anim:'bob'},
 {id:'g_bird',   cat:'gift',name:'عصفور مغرّد',  e:'🐦',gift:1,layer:'back', at:[[262,190,16]],anim:'bob'},
 {id:'g_kite',   cat:'gift',name:'طائرة ورقية',  e:'🪁',gift:1,layer:'back', at:[[332,168,22]],anim:'drift'}
];
const PAINTS=[
 {id:'sand', name:'رملي ذهبي',price:0, col:'#efc98a'},
 {id:'rose', name:'وردي',     price:40,col:'#f3a7c4',f:'<feColorMatrix type="hueRotate" values="-50"/>'},
 {id:'sky',  name:'سماوي',    price:40,col:'#9fd3f0',f:'<feColorMatrix type="hueRotate" values="170"/>'},
 {id:'emer', name:'زمرّدي',   price:40,col:'#9fe0b4',f:'<feColorMatrix type="hueRotate" values="95"/>'},
 {id:'lilac',name:'بنفسجي',   price:50,col:'#c9b2f0',f:'<feColorMatrix type="hueRotate" values="-110"/>'},
 {id:'pearl',name:'أبيض لؤلؤي',price:60,col:'#f6f1e6',f:'<feColorMatrix type="saturate" values=".15"/><feComponentTransfer><feFuncR type="linear" slope="1.08"/><feFuncG type="linear" slope="1.08"/><feFuncB type="linear" slope="1.1"/></feComponentTransfer>'}
];
const IT=Object.fromEntries(ITEMS.map(i=>[i.id,i])),PT=Object.fromEntries(PAINTS.map(p=>[p.id,p]));
const GIFTS=ITEMS.filter(i=>i.gift);

/* ---------- رسم الزينة داخل SVG البيت ---------- */
function itemSVG(it,full,withRoof){
  const cls=it.anim?` class="dk-${it.anim}"`:'';
  if(it.svg=='lights'){if(!(full>0&&withRoof))return '';const B=Bayt,y=B.fy(full-1),L=B.FX-12,R=B.FX+B.FW+12,M=B.FX+B.FW/2,H=66,C=['#e2504a','#f2b632','#3fbf6f','#2f8fd0','#c45bd1'];
    let s='<g>';for(let k=0;k<=10;k++){const t=k/10,x1=L+(M-L)*t,y1=y-H*t,x2=M+(R-M)*t,y2=y-H+H*t;
      s+=`<circle cx="${x1}" cy="${y1-3}" r="3.4" fill="${C[k%5]}" class="dk-tw" style="animation-delay:${k*.15}s"/><circle cx="${x2}" cy="${y2-3}" r="3.4" fill="${C[(k+2)%5]}" class="dk-tw" style="animation-delay:${k*.15+.07}s"/>`}
    return s+'</g>'}
  let s='';
  if(it.extra=='stars')s+=[[70,24],[96,52],[20,76],[130,22]].map(([x,y],k)=>`<text x="${x}" y="${y}" font-size="10" text-anchor="middle" class="dk-tw" style="animation-delay:${k*.3}s">⭐</text>`).join('');
  return s+it.at.map(([x,y,z],k)=>`<text x="${x}" y="${y}" font-size="${z}" text-anchor="middle"${cls} style="animation-delay:${k*.4}s">${it.e}</text>`).join('')}
function lookItems(L){return String(L.i||'').split(',').filter(id=>IT[id])}
const Deco={
  myLook(){return {c:Bayt.cups,p:js.paint,i:Object.keys(js.on).filter(id=>js.on[id]&&js.own[id]).join(',')}},
  svg(L,layer,full,withRoof){const ids=lookItems(L);let s='';
    if(layer=='back')s+='<style>.dk-bob,.dk-fly,.dk-flut,.dk-swim,.dk-drift,.dk-twinkle,.dk-tw{transform-box:fill-box;transform-origin:center}.dk-bob{animation:dkbob 2.2s ease-in-out infinite}.dk-fly{animation:dkfly 3s ease-in-out infinite}.dk-flut{animation:dkflut 1.6s ease-in-out infinite}.dk-swim{animation:dkswim 4s ease-in-out infinite}.dk-drift{animation:dkdrift 7s ease-in-out infinite}.dk-twinkle,.dk-tw{animation:dktw 1.4s ease-in-out infinite}@keyframes dkbob{50%{transform:translateY(-4px)}}@keyframes dkfly{50%{transform:translate(8px,-6px)}}@keyframes dkflut{50%{transform:translate(4px,-5px) rotate(-12deg)}}@keyframes dkswim{50%{transform:translateX(-14px)}}@keyframes dkdrift{50%{transform:translateX(16px)}}@keyframes dktw{50%{opacity:.35}}</style>';
    ids.forEach(id=>{const it=IT[id];if(it.layer==layer&&(!it.need||ids.includes(it.need)))s+=itemSVG(it,full,withRoof)});return s},
  paintFilter(L){const p=PT[L.p];if(!p||!p.f)return '';return `url(#pf_${p.id})`},
  addJ(n){js.j+=Math.max(0,Math.round(n));jsave();updJ()},
  floorJewels(score){const n=Math.max(5,Math.round(score/10));Deco.addJ(n);return `<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(n)}</b>جواهر لتزيين بيتك! عندك الآن ${ar(js.j)} 💎</div>`},
  // ماسات لكل سباق أو تحدٍّ (contest / online / nafsak)، بحدّ يومي حتى لا تُجمع بلا تعلّم
  challenge(n,src){const d=today();if(js.cday!=d){js.cday=d;js.cnt={}}js.cnt=js.cnt||{};const c=js.cnt[src]||0;
    if(c>=8||n<=0){jsave();return ''}js.cnt[src]=c+1;Deco.addJ(n);
    return `<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(n)}</b>ماسات لبيتك في الجنة! عندك ${ar(js.j)} 💎</div>`},
  menuHook,get j(){return js.j}
};
window.Deco=Deco;
// فلاتر الألوان تُضاف مرة واحدة في الصفحة
document.body.insertAdjacentHTML('beforeend',`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${PAINTS.filter(p=>p.f).map(p=>`<filter id="pf_${p.id}" color-interpolation-filters="sRGB">${p.f}</filter>`).join('')}</defs></svg>`);

// أول مرة: جواهر ترحيبية على قدر ما بناه الطفل من قبل
if(!js.seeded){js.seeded=true;js.j+=30+Bayt.done*40+Bayt.cups*5;jsave()}

/* ---------- styles ---------- */
const css=document.createElement('style');
css.textContent=`
.jbar{display:flex;gap:8px;margin-top:10px}
.jbtn{flex:1;border:none;border-radius:18px;padding:10px 4px 8px;font-weight:800;font-size:15px;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.18);position:relative;line-height:1.3}
.jbtn span{display:block;font-size:30px;line-height:1.2}
.jbtn:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.18)}
.jbtn.shop{background:linear-gradient(160deg,#ff8ac2,#c45bd1)}.jbtn.fr{background:linear-gradient(160deg,#5fb8ff,#2f6fd0)}.jbtn.ch{background:linear-gradient(160deg,#ffd54a,#e57c1f)}
.jbtn.ch.ready span{animation:jshake 1s infinite}.jbtn .dot{position:absolute;top:-6px;left:-4px;background:#e2504a;color:#fff;border-radius:12px;font-size:12px;padding:0 7px;animation:pulse 1s infinite}
@keyframes jshake{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}}
.jj{display:inline-flex;align-items:center;gap:4px;background:#eaf6ff;border:2px solid #9fd3f0;color:#1d4e9e;border-radius:14px;padding:0 10px;font-weight:800;font-size:16px}
.jvis{background:#fff;border:2px dashed #9fd3f0;border-radius:16px;padding:6px 10px;margin-top:10px;font-size:14px;color:#1d4e9e;text-align:center;line-height:1.7}
.jtabs{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none}.jtabs::-webkit-scrollbar{display:none}
.jtabs button{flex:none;border:2px solid var(--line);background:#fff;border-radius:16px;padding:4px 12px;font-size:15px;font-weight:700;color:var(--ink)}
.jtabs button.on{background:#c45bd1;border-color:#c45bd1;color:#fff}
.jgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.jit{background:#fff;border:2px solid var(--line);border-radius:16px;padding:6px 4px;text-align:center;color:inherit;position:relative}
.jit .e{font-size:34px;line-height:1.3;display:block}.jit b{display:block;font-size:13px;line-height:1.4;min-height:36px}
.jit .pr{display:inline-block;margin-top:2px;border-radius:10px;padding:0 8px;font-size:13px;font-weight:800;background:#eaf6ff;color:#1d4e9e}
.jit.own .pr{background:#e3f7ea;color:#14794f}.jit.on{border-color:#c45bd1;background:#fbf2fd}.jit.on .pr{background:#c45bd1;color:#fff}
.jit.poor{opacity:.6}.jit.lock .pr{background:#fff3e0;color:#8a5a00}
.jit.pop{animation:bpopin .45s}
.jprev{position:sticky;top:0;z-index:2;background:var(--bg);padding-bottom:6px}
.jprev .bhouse{height:250px}.jprev .bhouse svg{height:100%}
.jhead{display:flex;align-items:center;gap:8px;margin:6px 0}
.jhead .t{flex:1;font-size:14px;color:var(--muted)}
.jfr{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.jfc{background:#fff;border:2px solid var(--line);border-radius:18px;padding:0 0 6px;overflow:hidden;color:inherit;text-align:center}
.jfc .bhouse{border:none;border-radius:0;height:120px}.jfc .bhouse svg{height:100%}
.jfc b{display:block;font-size:14px;margin-top:4px}.jfc small{color:var(--muted);font-size:12px}
.jvisit .who{display:flex;align-items:center;gap:10px;margin:8px 0}.jvisit .who .av{font-size:40px}.jvisit .who b{font-size:18px;display:block}.jvisit .who small{color:var(--muted)}
.jacts{display:flex;gap:8px;margin-top:8px}.jacts .btn{flex:1}
.jheart{position:fixed;font-size:34px;pointer-events:none;z-index:99;animation:jheart 1.3s ease-out forwards}
@keyframes jheart{to{transform:translateY(-180px) scale(1.6);opacity:0}}
.jbox{font-size:96px;line-height:1.2;display:inline-block;cursor:pointer;animation:jshake 1s infinite}
.jbox.open{animation:jopen .6s forwards}@keyframes jopen{50%{transform:scale(1.4) rotate(10deg)}to{transform:scale(0);opacity:0}}
.jprize{font-size:90px;line-height:1.2;animation:bpopin .6s}
.jglist{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}
.jglist button{background:#fff;border:2px solid var(--line);border-radius:16px;padding:6px 2px;font-size:13px;font-weight:700}
.jglist button span{display:block;font-size:34px;line-height:1.3}
.jcode{background:#fff;border:2px dashed var(--gold);border-radius:16px;padding:6px;text-align:center;margin-bottom:10px;font-size:14px}
.jcode b{font-size:22px;letter-spacing:3px;color:var(--deep)}
`;
document.head.appendChild(css);

/* ---------- screen ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='jannah';
sec.innerHTML=`<div class="bar"><button class="back" id="jBack">›</button><div class="ttl" id="jTitle"></div><span class="jj" id="jJ"></span></div><div id="jBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
let backTo=null;
$('#jBack').onclick=()=>{const f=backTo;if(f){backTo=null;f()}else toBayt()};
function toBayt(){show('bayt');Bayt.menu()}
function updJ(){const e=$('#jJ');if(e)e.textContent=`💎 ${ar(js.j)}`;const m=$('#jMenuJ');if(m)m.textContent=`💎 ${ar(js.j)}`}
function sparkle(){try{Bayt.sStar()}catch(e){}}
function hearts(x,y,n=5){for(let k=0;k<n;k++){const d=document.createElement('div');d.className='jheart';d.textContent=['❤️','💖','💗'][k%3];
  d.style.left=(x-20+Math.random()*40)+'px';d.style.top=(y-10)+'px';d.style.animationDelay=k*.12+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),1700)}}

/* ---------- قائمة البيت: أزرار جديدة ---------- */
function menuHook(B){
  const chestReady=js.chest!=today();
  const rk=B.querySelector('.brank');
  const html=`<div class="jbar">
    <button class="jbtn shop" id="jShop"><span>🎨</span>زيّن بيتك</button>
    <button class="jbtn fr" id="jFr"><span>👥</span>بيوت أصدقائي</button>
    <button class="jbtn ch ${chestReady?'ready':''}" id="jCh">${chestReady?'<i class="dot">!</i>':''}<span>🎁</span>صندوق اليوم</button></div>
    <div style="text-align:center;margin-top:8px"><span class="jj" id="jMenuJ">💎 ${ar(js.j)}</span></div>${goal()}<div id="jVis"></div>`;
  if(rk)rk.insertAdjacentHTML('afterend',html);else B.insertAdjacentHTML('afterbegin',html);
  $('#jShop').onclick=()=>{Bayt.sTap();shop()};
  $('#jFr').onclick=()=>{Bayt.sTap();friends()};
  $('#jCh').onclick=chest;
  publish();inbox();
}

// الهدف الكبير: السيارة ثم سيارة السباق
function goal(){const g=['car','racecar'].map(id=>IT[id]).find(i=>!js.own[i.id]);
  if(!g)return `<div class="jvis" style="border-style:solid;border-color:var(--gold)">🏎️ عندك سيارة السباق! بيتك من أجمل البيوت 🌟</div>`;
  const f=Math.min(1,js.j/g.price);
  return `<div class="jvis" style="border-style:solid">🎯 هدفك الكبير: <b>${g.e} ${g.name}</b> — ${js.j>=g.price?`<b style="color:#14794f">تقدر تشتريها الآن! 🎉</b>`:`باقي ${ar(g.price-js.j)} 💎`}<div class="bauto" style="margin:4px 0 0"><i style="animation:none;width:${f*100}%"></i></div></div>`}
/* ---------- صندوق اليوم ---------- */
function chest(){
  if(js.chest==today()){modal(`<div style="font-size:60px">🎁</div><h3 style="margin:4px 0">${boy()?'فتحتَ':'فتحتِ'} صندوق اليوم</h3><p>${boy()?'ارجع':'ارجعي'} غدًا لصندوقٍ جديد 🌙<br>وتربح الجواهر أيضًا من بناء الطوابق ⬆️</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  modal(`<h3 style="margin:4px 0">🎁 صندوق اليوم</h3><p>${boy()?'اضغط':'اضغطي'} على الصندوق لتفتحه!</p><div class="jbox" id="jBox">🎁</div><div id="jPrize"></div>`,()=>{
    $('#jBox').onclick=()=>{if(js.chest==today())return;js.chest=today();
      const n=10+Math.floor(Math.random()*16);js.j+=n;
      const cheap=ITEMS.filter(i=>!i.gift&&i.price<=30&&!js.own[i.id]);let item=null;
      if(cheap.length&&Math.random()<.2){item=cheap[Math.floor(Math.random()*cheap.length)];js.own[item.id]=1;js.on[item.id]=1}
      jsave();updJ();$('#jBox').classList.add('open');sparkle();setTimeout(()=>{const b=$('#jBox');if(b)b.style.display='none'},520);
      setTimeout(()=>{if(typeof fanfare=='function')fanfare();if(typeof confetti=='function')confetti();
        $('#jPrize').innerHTML=`<div class="jprize">${item?item.e:'💎'}</div><h3 style="margin:2px 0">+${ar(n)} 💎${item?` و${item.name}!`:''}</h3><p style="margin:2px 0">${item?'أُضيفت إلى بيتك 🏡':'زيّن بها بيتك في الجنة'}</p><div class="nav"><button class="btn gold" id="jPrOk">رائع!</button></div>`;
        $('#jPrOk').onclick=()=>{closeModal();Bayt.menu()}},550)}})}

/* ---------- المتجر: زيّن بيتك ---------- */
let tab='garden';
function shop(){show('jannah');backTo=null;$('#jTitle').textContent='🎨 زيّن بيتك';updJ();drawShop();window.scrollTo(0,0)}
function drawShop(){const B=$('#jBody');const L=Deco.myLook();
  let grid='';
  if(tab=='paint')grid=PAINTS.map(p=>{const own=p.price==0||js.own['p_'+p.id],on=js.paint==p.id;
    return `<button class="jit ${own?'own':''} ${on?'on':''} ${!own&&js.j<p.price?'poor':''}" data-p="${p.id}"><span class="e"><span style="display:inline-block;width:34px;height:34px;border-radius:10px;background:${p.col};border:2px solid #0002;vertical-align:middle"></span></span><b>${p.name}</b><span class="pr">${on?'✓ الآن':own?'اختر':'💎 '+ar(p.price)}</span></button>`}).join('');
  else grid=ITEMS.filter(i=>i.cat==tab).map(i=>{const own=js.own[i.id],on=own&&js.on[i.id],nd=i.need&&!js.own[i.need];
    const pr=i.gift?(own?(on?'✓ في بيتي':'أظهِر'):'🎁 من صديق'):own?(on?'✓ في بيتي':'أظهِر'):nd?`يحتاج ${IT[i.need].name}`:'💎 '+ar(i.price);
    return `<button class="jit ${own?'own':''} ${on?'on':''} ${!own&&(i.gift||nd)?'lock':''} ${!own&&!i.gift&&!nd&&js.j<i.price?'poor':''}" data-i="${i.id}"><span class="e">${i.e}</span><b>${i.name}</b><span class="pr">${pr}</span></button>`}).join('');
  B.innerHTML=`<div class="jprev"><div class="bhouse">${Bayt.houseSVG(Bayt.done,-1,0,true,false,L)}</div>
    <div class="jtabs">${CATS.map(([id,e,n])=>`<button data-t="${id}" class="${tab==id?'on':''}">${e} ${n}</button>`).join('')}</div></div>
    ${tab=='gift'?`<p class="bcap" style="margin:0 0 8px">هذه الزينة لا تُشترى! تأتيك هديةً من أصدقائك 🎁<br>${boy()?'أهدِ':'أهدي'} أصدقاءك أيضًا من «بيوت أصدقائي».</p>`:''}
    <div class="jgrid">${grid}</div>
    <p class="bcap" style="margin-top:12px">💎 ${boy()?'اربح':'اربحي'} الجواهر من بناء الطوابق، والكؤوس، وصندوق اليوم، وإعجاب أصدقائك ببيتك.<br>اضغط على الزينة التي عندك لتُظهرها أو تُخفيها.</p>`;
  B.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;Bayt.sTap();drawShop()});
  B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>tapItem(IT[b.dataset.i]));
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>tapPaint(PT[b.dataset.p]));
}
function popAfter(sel){const e=$(sel);if(e){e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}}
function tapItem(i){
  if(js.own[i.id]){js.on[i.id]=js.on[i.id]?0:1;jsave();Bayt.sTap();drawShop();popAfter(`[data-i="${i.id}"]`);publishSoon();return}
  if(i.gift){modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>هذه هديةٌ لا تُشترى 🎁<br>تحصل عليها عندما يهديك إياها صديق.</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  if(i.need&&!js.own[i.need]){modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>${boy()?'اشترِ':'اشتري'} «${IT[i.need].name}» أولًا ثم ${boy()?'علّق':'علّقي'} عليها ${i.name} 😊</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  if(js.j<i.price){tone(200,.15,'square',.08);modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>تحتاج ${ar(i.price-js.j)} 💎 أخرى.<br>${boy()?'ابنِ':'ابني'} طابقًا في السباق لتربح جواهر كثيرة! 🏗️</p><div class="nav"><button class="btn gold" id="jGoRace">إلى السباق 🏁</button><button class="btn sec" data-close>لاحقًا</button></div>`,()=>{$('#jGoRace').onclick=()=>{closeModal();toBayt()}});return}
  modal(`<div style="font-size:64px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>السعر: <b>💎 ${ar(i.price)}</b> · عندك ${ar(js.j)}</p><div class="nav"><button class="btn sec" data-close>لا</button><button class="btn gold" id="jBuy">اشترِ وزيّن 🏡</button></div>`,()=>{
    $('#jBuy').onclick=()=>{closeModal();js.j-=i.price;js.own[i.id]=1;js.on[i.id]=1;jsave();updJ();sparkle();if(typeof confetti=='function')confetti();drawShop();popAfter(`[data-i="${i.id}"]`);publishSoon()}})}
function tapPaint(p){const k='p_'+p.id;
  if(p.price==0||js.own[k]){js.paint=p.id;jsave();Bayt.sTap();drawShop();publishSoon();return}
  if(js.j<p.price){tone(200,.15,'square',.08);modal(`<h3 style="margin:4px 0">لون ${p.name}</h3><p>تحتاج ${ar(p.price-js.j)} 💎 أخرى.</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  modal(`<div style="width:70px;height:70px;border-radius:18px;margin:0 auto;background:${p.col};border:3px solid #0002"></div><h3 style="margin:6px 0">لوّن بيتك ${p.name}</h3><p>السعر: <b>💎 ${ar(p.price)}</b></p><div class="nav"><button class="btn sec" data-close>لا</button><button class="btn gold" id="jBuy">لوّن 🎨</button></div>`,()=>{
    $('#jBuy').onclick=()=>{closeModal();js.j-=p.price;js.own[k]=1;js.paint=p.id;jsave();updJ();sparkle();drawShop();publishSoon()}})}

/* ---------- أونلاين ---------- */
const ready=()=>O()&&O().db&&O().me&&O().profile;
let pubT=0;
function publishSoon(){clearTimeout(pubT);pubT=setTimeout(publish,1200)}
function publish(){if(!ready())return;const A=O(),L=Deco.myLook();
  A.db.ref('houses/'+A.me).set({f:Bayt.done,c:Bayt.cups,p:L.p,i:L.i,n:A.profile.nick,a:A.profile.av,t:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{})}
const clean=h=>({f:Math.max(0,Math.min(3,h&&h.f|0)),c:Math.max(0,+(h&&h.c)||0),p:PT[h&&h.p]?h.p:'sand',i:lookItems({i:h&&h.i}).join(',')});

async function friends(){show('jannah');backTo=null;$('#jTitle').textContent='👥 بيوت أصدقائي';updJ();const B=$('#jBody');
  B.innerHTML=`<div class="handoff"><div class="big spin">🌐</div><p>جارٍ الاتصال…</p></div>`;
  if(!navigator.onLine||!O()){B.innerHTML=offline();return}
  try{await O().init()}catch(e){B.innerHTML=offline();$('#jRetry').onclick=friends;return}
  if(!O().profile){B.innerHTML=`<div class="handoff"><div class="big">🏡</div><h2>${boy()?'زُر':'زوري'} بيوت أصدقائك!</h2><p>${boy()?'اختر':'اختاري'} لقبك أولًا، ثم ${boy()?'أضف':'أضيفي'} أصدقاءك برموزهم، و${boy()?'زُر':'زوري'} بيوتهم و${boy()?'أهدِهم':'أهديهم'} 🎁</p><button class="btn gold" id="jProf" style="flex:none;min-width:200px">اختر لقبي 🌟</button></div>`;
    $('#jProf').onclick=()=>{window.onlineReturn=friends;openOnline()};return}
  publish();
  const A=O();let ids=[];
  try{ids=await A.friendIds()}catch(e){B.innerHTML=offline();$('#jRetry').onclick=friends;return}
  const codeBox=`<div class="jcode">رمزك لأصدقائك: <b dir="ltr">${A.profile.code}</b></div>`;
  if(!ids.length){B.innerHTML=`${codeBox}<div class="handoff"><div class="big">🤝</div><h2>لا أصدقاء بعد</h2><p>${boy()?'أعطِ':'أعطي'} رمزك لصديقك، أو ${boy()?'اكتب':'اكتبي'} رمزه، ثم ${boy()?'زُر':'زوري'} بيته في الجنة!</p><button class="btn gold" id="jAdd" style="flex:none;min-width:200px">➕ أضف صديقًا</button></div>`;
    $('#jAdd').onclick=()=>{window.onlineReturn=friends;A.openAdd()};return}
  const rows=await Promise.all(ids.map(async id=>{try{const [h,p]=await Promise.all([A.db.ref('houses/'+id).get(),A.db.ref('profiles/'+id).get()]);
    return {id,h:h.val(),p:p.val()||{nick:'؟',av:'❔'}}}catch(e){return {id,h:null,p:{nick:'؟',av:'❔'}}}}));
  rows.sort((a,b)=>(b.h?1:0)-(a.h?1:0));
  B.innerHTML=`${codeBox}<div class="jfr">${rows.map(r=>{const L=clean(r.h);
    return `<button class="jfc" data-f="${r.id}"><div class="bhouse">${Bayt.houseSVG(L.f,-1,0,true,false,L)}</div><b>${esc(r.p.av)} ${esc(r.p.nick)}</b><small>${r.h?`${['لم يبنِ بعد','طابق واحد','طابقان','ثلاثة طوابق'][L.f]}${js.gave[r.id]==today()?' · 🎁 أهديتَه اليوم':''}`:'لم يفتح بيته بعد'}</small></button>`}).join('')}</div>
    <div class="nav" style="margin-top:12px"><button class="btn sec" id="jAdd">➕ أضف صديقًا</button></div>`;
  B.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const r=rows.find(x=>x.id==b.dataset.f);Bayt.sTap();visit(r)});
  $('#jAdd').onclick=()=>{window.onlineReturn=friends;A.openAdd()}}
function offline(){return `<div class="handoff"><div class="big">📡</div><h2>لا يوجد اتصال</h2><p>زيارة بيوت الأصدقاء تحتاج إنترنت.<br>${boy()?'تستطيع':'تستطيعين'} تزيين بيتك بلا إنترنت 🎨</p><button class="btn gold" id="jRetry" style="flex:none;min-width:200px">حاول مرة أخرى</button></div>`}

async function visit(r){const A=O(),B=$('#jBody'),L=clean(r.h),day=today();backTo=friends;
  $('#jTitle').textContent=`🏡 بيت ${r.p.nick}`;
  A.db.ref(`hvisit/${r.id}/${A.me}`).set({t:firebase.database.ServerValue.TIMESTAMP,n:A.profile.nick,a:A.profile.av}).catch(()=>{});
  let likes=0;try{const v=(await A.db.ref('hlikes/'+r.id).get()).val()||{};likes=Object.values(v).reduce((s,x)=>s+((x&&x.n)|0),0)}catch(e){}
  const rk=Bayt.rankOf(L.c);
  B.innerHTML=`<div class="jvisit"><div class="bhouse">${Bayt.houseSVG(L.f,-1,0,true,true,L)}</div>
    <div class="who"><span class="av">${esc(r.p.av)}</span><span style="flex:1"><b>${esc(r.p.nick)}</b><small>${rk.icon} ${rk.name} · ❤️ <span id="jLk">${ar(likes)}</span> إعجاب</small></span></div>
    <div class="jacts"><button class="btn" id="jLike" style="background:#e2504a" ${js.liked[r.id]==day?'disabled':''}>${js.liked[r.id]==day?'❤️ أعجبك اليوم':'❤️ أعجبني!'}</button>
    <button class="btn gold" id="jGift" ${js.gave[r.id]==day?'disabled':''}>${js.gave[r.id]==day?'🎁 أهديتَه اليوم':'🎁 أهدِه هدية'}</button></div>
    <p class="bcap">${boy()?'تستطيع':'تستطيعين'} أن ${boy()?'تعجب':'تعجبي'} ببيت كل صديق، و${boy()?'تهديه':'تهديه'} هديةً واحدة كل يوم 🤍</p>
    <div class="nav"><button class="btn sec" id="jBackFr">بيوت أصدقائي</button></div></div>`;
  $('#jBackFr').onclick=friends;
  $('#jLike').onclick=async e=>{const b=e.currentTarget;b.disabled=true;
    try{const ref=A.db.ref(`hlikes/${r.id}/${A.me}`);const cur=(await ref.get()).val();await ref.set({n:((cur&&cur.n)|0)+1,d:day});
      js.liked[r.id]=day;jsave();likes++;$('#jLk').textContent=ar(likes);b.textContent='❤️ أعجبك اليوم';
      const bx=b.getBoundingClientRect();hearts(bx.left+bx.width/2,bx.top);tone(988,.1,'sine',.12);tone(1319,.14,'sine',.12,.1)}
    catch(err){b.disabled=false;A.toast('تعذّر الإرسال، حاول مرة أخرى')}};
  $('#jGift').onclick=()=>giftPick(r)}
function giftPick(r){const A=O();
  modal(`<h3 style="margin:4px 0">🎁 ماذا ${boy()?'تهدي':'تهدين'} ${esc(r.p.nick)}؟</h3><div class="jglist">${GIFTS.map(g=>`<button data-g="${g.id}"><span>${g.e}</span>${g.name}</button>`).join('')}</div><p style="font-size:14px;color:var(--muted);margin:0">الهدية تظهر في بيت صديقك، وتربح أنت ٥ 💎 لأنك أفرحتَه 🤍</p><div class="nav"><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    $('#modalIn').querySelectorAll('[data-g]').forEach(b=>b.onclick=async()=>{const g=IT[b.dataset.g];$('#modalIn').querySelectorAll('[data-g]').forEach(x=>x.disabled=true);
      try{await A.db.ref('gifts/'+r.id).push({f:A.me,n:A.profile.nick,a:A.profile.av,g:g.id,t:firebase.database.ServerValue.TIMESTAMP});
        js.gave[r.id]=today();js.j+=5;jsave();updJ();sparkle();
        modal(`<div style="font-size:70px;line-height:1.2">${g.e}</div><h3 style="margin:4px 0">${boy()?'أرسلتَ':'أرسلتِ'} ${g.name} إلى ${esc(r.p.nick)}!</h3><p>«تهادَوا تحابّوا» 🤍<br>+٥ 💎 لك</p><div class="nav"><button class="btn gold" id="jGOk">رائع!</button></div>`,()=>{$('#jGOk').onclick=()=>{closeModal();visit(r)}})}
      catch(e){closeModal();A.toast('تعذّر إرسال الهدية، حاول مرة أخرى')}})})}

/* ---------- الوارد: هدايا وإعجابات وزوّار ---------- */
let inboxBusy=false,giftQ=[];
async function inbox(){if(inboxBusy)return;const A=O();if(!A)return;
  if(!ready()){try{if(state.online&&navigator.onLine)await A.init()}catch(e){return}if(!ready())return;publish()}
  inboxBusy=true;
  try{const me=A.me,[g,l,v]=await Promise.all([A.db.ref('gifts/'+me).get(),A.db.ref('hlikes/'+me).get(),A.db.ref('hvisit/'+me).get()]);
    const total=Object.values(l.val()||{}).reduce((s,x)=>s+((x&&x.n)|0),0);
    if(js.likesSeen<0)js.likesSeen=total;
    const newL=total-js.likesSeen;if(newL>0){js.likesSeen=total;js.j+=newL*2;jsave();updJ()}
    const vis=Object.values(v.val()||{}).filter(x=>x&&A.now()-(x.t||0)<864e5).sort((a,b)=>b.t-a.t);
    const box=$('#jVis');
    if(box&&(vis.length||total))box.innerHTML=`<div class="jvis">${total?`❤️ ${ar(total)} إعجاب ببيتك${newL>0?` <b>(+${ar(newL)} جديد، +${ar(newL*2)} 💎)</b>`:''}`:''}${vis.length?`<br>👀 زارك اليوم: ${vis.slice(0,6).map(x=>`${esc(x.a)} ${esc(x.n)}`).join('، ')}`:''}</div>`;
    Object.entries(g.val()||{}).forEach(([k,x])=>{if(x&&IT[x.g]&&!giftQ.some(q=>q.k==k))giftQ.push({k,...x})});
    nextGift()}
  catch(e){}finally{inboxBusy=false}}
function nextGift(){if(!giftQ.length||$('#modal').classList.contains('on'))return;const x=giftQ[0],g=IT[x.g],A=O();
  tone(880,.1,'sine');tone(1320,.15,'sine',.16,.12);
  modal(`<h3 style="margin:4px 0">🎉 وصلتك هدية!</h3><p style="margin:2px 0">من ${esc(x.a)} <b>${esc(x.n)}</b></p><div class="jbox" id="jGBox">🎁</div><p style="font-size:14px;color:var(--muted)">${boy()?'اضغط':'اضغطي'} لتفتحها</p><div id="jGPrize"></div>`,()=>{
    $('#jGBox').onclick=()=>{const b=$('#jGBox');if(b.classList.contains('open'))return;b.classList.add('open');sparkle();setTimeout(()=>{b.style.display='none';const h=b.nextElementSibling;if(h)h.style.display='none'},520);
      const dup=!!js.own[g.id];if(dup)js.j+=15;else{js.own[g.id]=1;js.on[g.id]=1}jsave();updJ();
      A.db.ref(`gifts/${A.me}/${x.k}`).remove().catch(()=>{});giftQ.shift();
      setTimeout(()=>{if(typeof fanfare=='function')fanfare();if(typeof confetti=='function')confetti();
        $('#jGPrize').innerHTML=`<div class="jprize">${g.e}</div><h3 style="margin:2px 0">${g.name}!</h3><p style="margin:2px 0">${dup?'عندك مثلها، فصارت +١٥ 💎':'أُضيفت إلى بيتك في الجنة 🏡'}</p><div class="nav"><button class="btn gold" id="jGTy">جزاك الله خيرًا 🤍</button></div>`;
        $('#jGTy').onclick=()=>{closeModal();publishSoon();if($('#bayt').classList.contains('on'))Bayt.menu();setTimeout(nextGift,300)}},550)}})}
// إشعار فوري إذا وصلت هدية والتطبيق مفتوح
let liveOn=false;
function live(){const A=O();if(liveOn||!ready())return;liveOn=true;
  A.db.ref('gifts/'+A.me).on('child_added',s=>{const x=s.val();if(!x||!IT[x.g]||giftQ.some(q=>q.k==s.key))return;
    giftQ.push({k:s.key,...x});
    if($('#bayt').classList.contains('on')||$('#jannah').classList.contains('on'))nextGift();
    else{A.toast(`🎁 وصلتك هدية من ${x.n}!`);const c=$('#openBayt');if(c&&!c.querySelector('.jdot')){c.style.position='relative';c.insertAdjacentHTML('beforeend','<i class="jdot" style="position:absolute;top:-6px;left:8px;background:#e2504a;color:#fff;border-radius:12px;font-style:normal;font-size:13px;padding:0 8px">🎁 هدية</i>')}}})}
setInterval(()=>{if(ready()){live();}},4000);
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#openBayt')){const d=document.querySelector('#openBayt .jdot');if(d)d.remove()}},true);
})();
