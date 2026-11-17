/* بيتك في الجنة — الزينة والجواهر والأصدقاء (يعتمد على bayt.js و online.js)
   💎 الجواهر: تُربح من بناء الطوابق، ومن كل كأس، ومن صندوق اليوم، ومن إعجاب الأصدقاء ببيتك، ومن الإهداء.
   تُصرف في «زيّن بيتك». هدايا الأصدقاء لا تُشترى، تأتي من صديق فقط.
   أونلاين: houses/$uid (شكل البيت)، gifts/$to/$id، hlikes/$uid/$from، hvisit/$uid/$from — انظر database.rules.json */
(function(){
const JKEY='usul5_jannah_v1';
let js={j:0,own:{},on:{},paint:'sand',chest:'',likesSeen:-1,gave:{},liked:{},seeded:false};
try{const s=JSON.parse(localStorage.getItem(JKEY)||'null');if(s&&typeof s.j=='number')js=Object.assign(js,s)}catch(e){}
// من اختار لونًا قبل v6.5 يبقى لونه كما هو
if(js.pick==null&&js.paint&&js.paint!='sand')js.pick=1;if(js.wpick==null&&js.wall&&js.wall!='cream')js.wpick=1;
const jsave=()=>{try{localStorage.setItem(JKEY,JSON.stringify(js))}catch(e){}};
const today=()=>new Date().toDateString();
const O=()=>window.OnlineAPI;
const boy=()=>!window.Cups||Cups.sex!='g';
const esc=v=>String(v==null?'':v).replace(/[<>&"]/g,'');

/* ---------- الكتالوج: [x,y,size] بإحداثيات رسم البيت (عرض ٣٦٠ × ارتفاع ٣٣٠، الأرض عند y=292) ---------- */
const CATS=[['deeds','🤲','جوائز الأعمال'],['inside','🛋️','داخل البيت'],['onhouse','🪟','على البيت'],['garden','🌳','الأشجار والورد'],['light','💡','الإنارة'],['car','🚗','السيارات'],['animals','🦚','الحيوانات'],['sky','🕊️','السماء'],['deco','✨','الزينة'],['paint','🎨','الألوان'],['gift','🎁','هدايا الأصدقاء']];
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
 // على جدران البيت نفسه
 {id:'fbox',   cat:'onhouse',name:'أحواض ورد تحت الشبابيك',e:'🌺',price:40,layer:'front',svg:'fbox'},
 {id:'curt',   cat:'onhouse',name:'ستائر ملوّنة',e:'🎀',price:35,layer:'front',svg:'curt'},
 {id:'gdoor',  cat:'onhouse',name:'باب ذهبي مزخرف',e:'🚪',price:60,layer:'front',svg:'door'},
 {id:'ivy',    cat:'onhouse',name:'نبتة متسلّقة',e:'🌿',price:30,layer:'front',svg:'ivy'},
 // داخل البيت: r = رقم الغرفة (الطابق)، والإحداثيات داخل رسم الغرفة ٣٦٠×١٧٠
 {id:'carpet', cat:'inside',r:0,name:'سجّادة ملوّنة',e:'🟥',price:30,layer:'room',svg:'carpet'},
 {id:'sofa',   cat:'inside',r:0,name:'كنبة مريحة',e:'🛋️',price:40,layer:'room',at:[[105,146,58]]},
 {id:'frame',  cat:'inside',r:0,name:'لوحة طبيعة',e:'🖼️',price:30,layer:'room',at:[[100,72,34]]},
 {id:'clock',  cat:'inside',r:0,name:'ساعة حائط',e:'🕰️',price:30,layer:'room',at:[[262,70,30]]},
 {id:'plantin',cat:'inside',r:0,name:'نبتة داخلية',e:'🪴',price:25,layer:'room',at:[[306,148,40]]},
 {id:'fruits', cat:'inside',r:0,name:'صحن فواكه',e:'🍇',price:20,layer:'room',at:[[208,146,24]],svg:'table'},
 {id:'shelf',  cat:'inside',r:1,name:'رفوف كتب',e:'📚',price:45,layer:'room',svg:'shelf'},
 {id:'desk',   cat:'inside',r:1,name:'مكتب وكرسي',e:'🪑',price:30,layer:'room',at:[[250,150,38]],svg:'desk'},
 {id:'quran',  cat:'inside',r:1,name:'مصحف على المكتب',e:'📖',price:30,layer:'room',at:[[226,122,24]],need:'desk'},
 {id:'globe',  cat:'inside',r:1,name:'مجسّم الأرض',e:'🌍',price:30,layer:'room',at:[[310,146,30]]},
 {id:'candle', cat:'inside',r:1,name:'قنديل',e:'🕯️',price:20,layer:'room',at:[[180,86,20]],anim:'twinkle'},
 {id:'bed',    cat:'inside',r:2,name:'سرير جميل',e:'🛏️',price:50,layer:'room',at:[[240,148,70]]},
 {id:'teddy',  cat:'inside',r:2,name:'دبّ لعبة',e:'🧸',price:25,layer:'room',at:[[88,150,32]]},
 {id:'train',  cat:'inside',r:2,name:'قطار لعبة',e:'🚂',price:30,layer:'room',at:[[150,156,26]],anim:'swim'},
 {id:'nlight', cat:'inside',r:2,name:'مصباح النوم',e:'🌙',price:20,layer:'room',at:[[300,62,26]],anim:'bob'},
 {id:'kite_r', cat:'inside',r:2,name:'طائرة ورقية على الجدار',e:'🪁',price:20,layer:'room',at:[[96,74,30]]},
 {id:'prayrug',cat:'inside',r:3,name:'سجّادة صلاة',e:'🕌',price:40,layer:'room',svg:'prayrug'},
 {id:'rahl',   cat:'inside',r:3,name:'مصحف على رَحْل',e:'📖',price:35,layer:'room',svg:'rahl'},
 {id:'misbaha',cat:'inside',r:3,name:'مسبحة',e:'📿',price:20,layer:'room',at:[[118,146,24]]},
 {id:'lant_r', cat:'inside',r:3,name:'فانوس معلّق',e:'🏮',price:30,layer:'room',at:[[300,52,28]],anim:'bob'},
 {id:'aqua',   cat:'inside',r:3,name:'حوض أسماك',e:'🐠',price:50,layer:'room',svg:'aqua'},
 // جوائز الأعمال الصالحة: لا تُشترى، تأتي بالعمل (تمنحها salah.js و alqab.js عبر Deco.grant)
 {id:'d_rose',  cat:'deeds',name:'ورود الصلاة على النبي',e:'🌹',deed:'صلِّ على محمد وآل محمد ١٠ مرات بصوتك',layer:'front',at:[[112,312,14],[214,312,14],[62,314,13]]},
 {id:'d_birds', cat:'deeds',name:'طيور التسبيح',e:'🐦',deed:'سبّح الله ١٠ مرات بصوتك',layer:'back',at:[[236,150,15],[96,146,13]],anim:'fly'},
 {id:'d_lamps', cat:'deeds',name:'قناديل المصلّين',e:'🪔',deed:'سجّل ٥ صلوات صلّيتها في «سجلّ صلاتي»',layer:'front',at:[[146,302,14],[180,302,14]]},
 {id:'d_star',  cat:'deeds',name:'نجوم القرآن',e:'🌠',deed:'سمّع ١٠ آيات بصوتك في «أنا حافظ صغير»',layer:'back',at:[[44,62,18],[300,96,16]],anim:'twinkle'},
 {id:'d_spring',cat:'deeds',name:'عين ماء جارية',e:'💧',deed:'انجح في اختبار الوضوء',layer:'front',at:[[98,300,20],[88,306,12]],anim:'bob'},
 {id:'d_mosque',cat:'deeds',name:'مسجد جميل بجانب بيتك',e:'🕌',deed:'تعلّم الصلاة، وقلها بصوتك، وانجح في اختبارها',layer:'back',svg:'mosque',at:[[320,254,40]]},
 {id:'d_street',cat:'deeds',name:'مصابيح شارع بيتك',e:'🏮',deed:'صلِّ على محمد وآل محمد ٥٠٠ مرة بصوتك خلال شهر واحد',layer:'front',svg:'street',at:[[20,300,16]]},
 {id:'d_street2',cat:'deeds',name:'مصابيح الشارع الكاملة',e:'🏮',deed:'صلِّ على محمد وآل محمد ١٠٠٠ مرة بصوتك خلال شهر واحد',layer:'front',svg:'street2',need:'d_street',at:[[280,300,16]]},
 {id:'d_palms', cat:'deeds',name:'نخيل الجنة',e:'🌴',deed:'صلِّ على محمد وآل محمد ١٠٠ مرة',layer:'back',at:[[8,288,34],[352,290,30]]},
 {id:'d_fruit', cat:'deeds',name:'بستان المصلّي',e:'🍊',deed:'سجّل ٣٥ صلاة صلّيتها',layer:'front',at:[[38,270,16],[326,264,15],[52,258,14]]},
 {id:'d_h1',    cat:'deeds',name:'حمامات الحافظ',e:'🕊️',deed:'احفظ سورة واحدة',layer:'back',at:[[200,70,18],[226,58,15],[178,84,14]],anim:'fly'},
 {id:'d_h3',    cat:'deeds',name:'قوس قزح الحافظ',e:'🌈',deed:'احفظ ٣ سور',layer:'back',at:[[90,118,54]]},
 {id:'d_h6',    cat:'deeds',name:'برج الحافظ الذهبي',e:'🏯',deed:'احفظ ٦ سور',layer:'back',at:[[34,250,38]]},
 {id:'d_h12',   cat:'deeds',name:'تاج حافظ القرآن',e:'👑',deed:'احفظ السور الاثنتي عشرة كلّها',layer:'back',at:[[260,46,30]],anim:'bob'},
 {id:'d_noor',  cat:'deeds',name:'نورٌ على بيتك',e:'✨',deed:'صلِّ على محمد وآل محمد ٥٠٠ مرة',layer:'back',at:[[110,130,18],[250,120,16],[180,58,22],[60,92,14]],anim:'twinkle'},
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
const WALLS=[{id:'cream',name:'كريمي',col:'#fbefd6',price:0},{id:'mint',name:'نعناعي',col:'#d6f3e4',price:25},{id:'peach',name:'خوخي',col:'#fde1cf',price:25},{id:'lav',name:'ليلكي',col:'#e7defa',price:25},{id:'skyw',name:'سماوي',col:'#d8ecfb',price:25}];
const ROOMS=[['غرفة الجلوس','🛋️'],['المكتبة','📚'],['غرفة النوم','🛏️'],['غرفة الصلاة','🤲']];
// لون البيت الأوّل حسب الطفل: البنت وردي وجدران ليلكية، والولد سماوي وجدران سماوية — مجانًا، حتى يختار هو لونًا آخر (js.pick / js.wpick)
const SEXP=()=>window.Cups&&Cups.sex=='g'?'rose':window.Cups&&Cups.sex=='b'?'sky':'sand',SEXW=()=>window.Cups&&Cups.sex=='g'?'lav':window.Cups&&Cups.sex=='b'?'skyw':'cream';
const myPaint=()=>js.pick?js.paint:SEXP(),myWall=()=>js.wpick?(js.wall||'cream'):SEXW();
const IT=Object.fromEntries(ITEMS.map(i=>[i.id,i])),PT=Object.fromEntries(PAINTS.map(p=>[p.id,p]));
const GIFTS=ITEMS.filter(i=>i.gift);

/* ---------- رسم الزينة داخل SVG البيت ---------- */
function kwrap(x){const k=Bayt.hk;if(k>=1)return x;const c=Bayt.FX+Bayt.FW/2+Bayt.DX/2;return `<g transform="translate(${c} ${Bayt.GY}) scale(${k}) translate(${-c} ${-Bayt.GY})">${x}</g>`}
function wins(full){const B=Bayt,out=[];for(let i=0;i<full;i++){const y=B.fy(i);
  if(i==0)out.push([B.FX+20,y+18],[B.FX+B.FW-46,y+18]);else out.push([B.FX+18,y+16],[B.FX+B.FW/2-13,y+16],[B.FX+B.FW-44,y+16])}return out}
function houseItem(t,full){const B=Bayt;if(!(full>0))return '';let s='';
  if(t=='fbox')s=wins(full).map(([x,y])=>`<rect x="${x-3}" y="${y+34}" width="32" height="6" rx="1.5" fill="#9a6a3a" stroke="#6f4a22" stroke-width=".8"/>${[0,1,2,3,4].map(k=>`<circle cx="${x+1+k*6}" cy="${y+33}" r="2.8" fill="${['#e2504a','#ff8ac2','#f2b632','#c45bd1','#fff'][k]}"/><circle cx="${x+3+k*6}" cy="${y+35}" r="1.8" fill="#2e9c55"/>`).join('')}`).join('');
  if(t=='curt')s=wins(full).map(([x,y])=>`<path d="M${x+2} ${y+6} Q${x+10} ${y+14} ${x+4} ${y+29} L${x+1.5} ${y+29}Z" fill="#ff8ac2" opacity=".9"/><path d="M${x+24} ${y+6} Q${x+16} ${y+14} ${x+22} ${y+29} L${x+24.5} ${y+29}Z" fill="#ff8ac2" opacity=".9"/>`).join('');
  if(t=='door'){const dx=B.FX+B.FW/2,g=B.GY;s=`<path d="M${dx-24} ${g} V${g-36} a24 24 0 0 1 48 0 V${g}" fill="none" stroke="#ffd54a" stroke-width="3.5"/><path d="M${dx-24} ${g} V${g-36} a24 24 0 0 1 48 0 V${g}" fill="none" stroke="#b9851a" stroke-width="1" stroke-dasharray="2 3"/>${[-24,-12,0,12,24].map(k=>`<circle cx="${dx+k*.9}" cy="${g-36-Math.sqrt(Math.max(0,576-k*k))+2}" r="2.4" fill="#fff6b0" class="dk-tw"/>`).join('')}<text x="${dx}" y="${g-64}" font-size="13" text-anchor="middle" class="dk-tw">✨</text>`}
  if(t=='ivy'){const top=B.fy(full-1)+10;for(let y=B.GY-4;y>top;y-=9){const x=B.FX+3+Math.sin(y/9)*3;s+=`<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3" fill="#2e9c55" transform="rotate(${(y%3)*25-20} ${x} ${y})"/><ellipse cx="${x+4}" cy="${y-4}" rx="3.5" ry="2.4" fill="#3fbf6f"/>`}
    s=`<path d="M${B.FX+3} ${B.GY} Q${B.FX+8} ${(B.GY+top)/2} ${B.FX+3} ${top}" stroke="#4a7a2a" stroke-width="1.6" fill="none"/>`+s}
  return kwrap(s)}
function mosqueSVG(){const g=292;
  return `<g class="dk-msq"><defs><linearGradient id="hMsqWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f1dfbc"/></linearGradient>
  <radialGradient id="hMsqDome" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#5fd49a"/><stop offset=".55" stop-color="#1fa463"/><stop offset="1" stop-color="#0e6438"/></radialGradient></defs>
  <ellipse cx="322" cy="${g+3}" rx="42" ry="6" fill="#2f7a45" opacity=".32"/>
  <rect x="344" y="${g-86}" width="10" height="86" fill="url(#hMsqWall)" stroke="#d9a85e" stroke-width="1"/><rect x="342" y="${g-62}" width="14" height="5" rx="1.5" fill="url(#hGold)"/>
  <path d="M344 ${g-86} q5 -16 10 0z" fill="url(#hMsqDome)"/><line x1="349" y1="${g-94}" x2="349" y2="${g-100}" stroke="#b9851a" stroke-width="1.6"/><circle cx="349" cy="${g-103}" r="3" fill="#ffd54a"/>
  <path d="M346.5 ${g-74} a2.5 4 0 0 1 5 0v6h-5z" fill="#3a5a6a"/><path d="M346.5 ${g-48} a2.5 4 0 0 1 5 0v6h-5z" fill="#3a5a6a"/>
  <rect x="291" y="${g-32}" width="53" height="32" fill="url(#hMsqWall)" stroke="#d9a85e" stroke-width="1.2"/><rect x="291" y="${g-32}" width="53" height="4" fill="url(#hGold)"/>
  <rect x="302" y="${g-42}" width="30" height="11" fill="url(#hMsqWall)" stroke="#d9a85e" stroke-width="1"/>
  <path d="M300 ${g-42} Q317 ${g-82} 334 ${g-42}Z" fill="url(#hMsqDome)" stroke="#0e6438" stroke-width="1"/><path d="M306 ${g-50} Q310 ${g-66} 318 ${g-70}" stroke="#fff" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>
  <line x1="317" y1="${g-62}" x2="317" y2="${g-74}" stroke="#b9851a" stroke-width="2"/><path d="M317 ${g-86} a6 6 0 1 0 5 8 a4.6 4.6 0 1 1 -5 -8z" fill="url(#hGold)"/>
  <path d="M310 ${g} V${g-14} a7 7 0 0 1 14 0 V${g}Z" fill="#8a4f22" stroke="url(#hGold)" stroke-width="1.6"/>
  ${[296,330].map(x=>`<path d="M${x} ${g-8} V${g-17} a4 4 0 0 1 8 0 V${g-8}Z" fill="#9fdcff" stroke="#e6c07a" stroke-width="1.4"/>`).join('')}
  <circle cx="317" cy="${g-26}" r="3" fill="#ffd54a" opacity=".9" class="dk-tw"/></g>`}
function streetSVG(xs){const g=292;xs=xs||[10,42,74];
  return xs.map((x,k)=>`<g class="dk-st"><ellipse cx="${x}" cy="${g+12}" rx="7" ry="2.6" fill="#2f4a52" opacity=".5"/>
    <rect x="${x-1.6}" y="${g-38}" width="3.2" height="50" rx="1.2" fill="#37515a"/><rect x="${x-4}" y="${g+6}" width="8" height="6" rx="2" fill="#2d434a"/>
    <path d="M${x} ${g-34} q0 -8 7 -8" stroke="#37515a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="${x+7}" cy="${g-33}" r="17" fill="#ffe27a" opacity=".28" class="dk-tw" style="animation-delay:${k*.25}s"/><circle cx="${x+7}" cy="${g-33}" r="9" fill="#ffe27a" opacity=".38"/>
    <path d="M${x+2} ${g-39} h10 l-1.5 9 h-7z" fill="url(#hGold)" stroke="#9a6a00" stroke-width=".8"/><rect x="${x+3.6}" y="${g-31}" width="6.8" height="6" rx="2" fill="#fff6b8"/><circle cx="${x+7}" cy="${g-28}" r="2.4" fill="#fffbe0"/>
    <path d="M${x+1} ${g-40} h12 l-6 -5z" fill="#37515a"/></g>`).join('')}
function itemSVG(it,full,withRoof){
  if(it.svg=='street')return streetSVG();
  if(it.svg=='street2')return streetSVG([266,288]);
  if(it.svg=='mosque')return mosqueSVG();
  if(['fbox','curt','door','ivy'].includes(it.svg))return houseItem(it.svg,full);
  const cls=it.anim?` class="dk-${it.anim}"`:'';
  if(it.svg=='lights'){if(!(full>0&&withRoof))return '';const B=Bayt,y=B.fy(full-1),L=B.FX-12,R=B.FX+B.FW+12,M=B.FX+B.FW/2,H=66,C=['#e2504a','#f2b632','#3fbf6f','#2f8fd0','#c45bd1'];
    let s='<g>';for(let k=0;k<=10;k++){const t=k/10,x1=L+(M-L)*t,y1=y-H*t,x2=M+(R-M)*t,y2=y-H+H*t;
      s+=`<circle cx="${x1}" cy="${y1-3}" r="3.4" fill="${C[k%5]}" class="dk-tw" style="animation-delay:${k*.15}s"/><circle cx="${x2}" cy="${y2-3}" r="3.4" fill="${C[(k+2)%5]}" class="dk-tw" style="animation-delay:${k*.15+.07}s"/>`}
    return kwrap(s+'</g>')}
  let s='';
  if(it.extra=='stars')s+=[[70,24],[96,52],[20,76],[130,22]].map(([x,y],k)=>`<text x="${x}" y="${y}" font-size="10" text-anchor="middle" class="dk-tw" style="animation-delay:${k*.3}s">⭐</text>`).join('');
  return s+it.at.map(([x,y,z],k)=>`<text x="${x}" y="${y}" font-size="${z}" text-anchor="middle"${cls} style="animation-delay:${k*.4}s">${it.e}</text>`).join('')}
/* 🌱 حديقة الأعمال: حرف لكل عمل صالح (sawt.js Aamal.grow)، يُرسم في أماكن ثابتة حول البيت وفي السماء */
const GL={a:'🌹',b:'🐦',c:'🌷',d:'⭐',e:'🌳',f:'🌴',g:'🦋',h:'🍎',i:'🌻',j:'🏵️',k:'🎈'},SKY='bdgk';
const cleanG=g=>String(g||'').replace(/[^a-k]/g,'').slice(-80);
const SLOTS=(()=>{let s=7;const r=()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const gr=[],sk=[];while(gr.length<60){let x,y;if(r()<.68){y=297+r()*14;x=6+r()*348;if(x>124&&x<202)continue}else{y=262+r()*28;x=r()<.5?4+r()*62:298+r()*56}gr.push([x,y])}
  while(sk.length<30){const x=14+r()*332,y=40+r()*150;if(x>270&&y<80)continue;sk.push([x,y])}return {gr,sk}})();
function gardenSVG(g,layer){g=cleanG(g);let gi=0,si=0;const out=[];
  for(const c of g){const sky=SKY.includes(c),p=sky?SLOTS.sk[si++%30]:SLOTS.gr[gi++%60];if((layer=='back')!=sky)continue;
    const big=c=='e'||c=='f',z=big?(p[1]<292?24:19):sky?(c=='k'?15:12):13,an=c=='b'?'fly':c=='g'?'flut':c=='d'?'twinkle':c=='k'?'bob':'';
    out.push([p[1],`<text x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" font-size="${z}" text-anchor="middle"${an?` class="dk-${an}" style="animation-delay:${(out.length%7)*.3}s"`:''}>${GL[c]}</text>`])}
  return out.sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join('')}
function lookItems(L){return String(L.i||'').split(',').filter(id=>IT[id])}
const Deco={
  myLook(){return {c:Bayt.cups,p:myPaint(),w:myWall(),f:Bayt.done,i:Object.keys(js.on).filter(id=>js.on[id]&&js.own[id]).join(','),g:window.Aamal?cleanG(Aamal.d.gl):''}},
  svg(L,layer,full,withRoof){const ids=lookItems(L);let s='';
    if(layer=='back')s+='<style>.dk-bob,.dk-fly,.dk-flut,.dk-swim,.dk-drift,.dk-twinkle,.dk-tw{transform-box:fill-box;transform-origin:center}.dk-bob{animation:dkbob 2.2s ease-in-out infinite}.dk-fly{animation:dkfly 3s ease-in-out infinite}.dk-flut{animation:dkflut 1.6s ease-in-out infinite}.dk-swim{animation:dkswim 4s ease-in-out infinite}.dk-drift{animation:dkdrift 7s ease-in-out infinite}.dk-twinkle,.dk-tw{animation:dktw 1.4s ease-in-out infinite}@keyframes dkbob{50%{transform:translateY(-4px)}}@keyframes dkfly{50%{transform:translate(8px,-6px)}}@keyframes dkflut{50%{transform:translate(4px,-5px) rotate(-12deg)}}@keyframes dkswim{50%{transform:translateX(-14px)}}@keyframes dkdrift{50%{transform:translateX(16px)}}@keyframes dktw{50%{opacity:.35}}</style>';
    ids.forEach(id=>{const it=IT[id];if(it.layer==layer&&it.layer!='room'&&(!it.need||ids.includes(it.need)))s+=itemSVG(it,full,withRoof)});
    if(layer=='back'||layer=='front')s+=gardenSVG(L.g,layer);return s},
  paintFilter(L){const p=PT[L.p];if(!p||!p.f)return '';return `url(#pf_${p.id})`},
  addJ(n){js.j+=Math.max(0,Math.round(n));jsave();updJ()},
  takeJ(n){js.j=Math.max(0,js.j-Math.max(0,Math.round(n)));jsave();updJ()},get jewels(){return js.j},
  floorJewels(score){const n=Math.max(5,Math.round(score/10));Deco.addJ(n);return `<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(n)}</b>جواهر لتزيين بيتك! عندك الآن ${ar(js.j)} 💎</div>`},
  // ماسات لكل سباق أو تحدٍّ (contest / online / nafsak)، بحدّ يومي حتى لا تُجمع بلا تعلّم
  challenge(n,src){const d=today();if(js.cday!=d){js.cday=d;js.cnt={}}js.cnt=js.cnt||{};const c=js.cnt[src]||0;
    if(c>=8||n<=0){jsave();return ''}js.cnt[src]=c+1;Deco.addJ(n);
    return `<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(n)}</b>ماسات لبيتك في الجنة! عندك ${ar(js.j)} 💎</div>`},
  setBack:f=>{backTo=f},
  // جائزة عمل صالح: تُضاف للبيت وتظهر فورًا. ترجع true إذا كانت جديدة
  grant(id){if(!IT[id]||js.own[id])return false;js.own[id]=1;js.on[id]=1;jsave();publishSoon();return true},
  owns:id=>!!js.own[id],item:id=>IT[id],deeds:()=>ITEMS.filter(i=>i.deed),
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
.jbar{flex-wrap:wrap}.jbtn{flex:1 1 40%}.jbtn.in{background:linear-gradient(160deg,#ffb36b,#c96a2a)}
.jroom{display:block;width:100%;padding:0;border:3px solid #e6c07a;border-radius:18px;overflow:hidden;background:#fff;margin:0 0 10px;position:relative;color:inherit}
.jroom svg{display:block;width:100%;height:auto}.jroom .lb{position:absolute;top:6px;right:8px;background:rgba(255,255,255,.9);border-radius:12px;padding:0 10px;font-weight:800;font-size:14px;z-index:1}.jroom .lb small{color:var(--muted);font-weight:500}
.jrooms{display:flex;gap:6px;margin:0 0 8px}.jrooms button{flex:1;border:2px solid var(--line);background:#fff;border-radius:14px;font-size:13px;font-weight:700;padding:4px 2px}.jrooms button.on{border-color:#c96a2a;background:#fff4e6}
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

/* ---------- داخل البيت: غرفة لكل طابق ---------- */
function roomItem(it){
  if(it.svg=='carpet')return `<g><polygon points="70,128 290,128 318,160 42,160" fill="#c43d38"/><polygon points="80,132 280,132 304,156 56,156" fill="none" stroke="#f2b632" stroke-width="2.5" stroke-dasharray="6 3"/><polygon points="150,136 210,136 222,152 138,152" fill="#2f6fd0" opacity=".8"/></g>`;
  if(it.svg=='prayrug')return `<g><polygon points="120,126 230,126 246,162 104,162" fill="#14794f"/><path d="M134 158 L137 138 Q175 116 213 138 L216 158Z" fill="#1f9a66" stroke="#f2b632" stroke-width="2"/><polygon points="120,126 230,126 246,162 104,162" fill="none" stroke="#f2b632" stroke-width="2.5"/></g>`;
  if(it.svg=='rahl')return `<g><path d="M268 158 L292 126 M316 158 L292 126" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><path d="M276 126 L292 116 L308 126 L292 132Z" fill="#14794f" stroke="#f2b632" stroke-width="1.5"/><text x="292" y="126" font-size="9" text-anchor="middle" fill="#f2b632">✦</text></g>`;
  if(it.svg=='aqua')return `<g><rect x="34" y="104" width="62" height="40" rx="4" fill="#9fd9ff" stroke="#5c8ea8" stroke-width="2.5" opacity=".9"/><rect x="34" y="104" width="62" height="7" fill="#fff" opacity=".4"/><rect x="38" y="144" width="54" height="16" fill="#8a5a2b"/><text x="58" y="132" font-size="14" class="dk-swim">🐠</text><text x="80" y="124" font-size="11" class="dk-swim" style="animation-delay:1s">🐟</text><text x="44" y="142" font-size="12">🌿</text></g>`;
  if(it.svg=='shelf')return `<g><rect x="34" y="40" width="74" height="112" fill="#a8743e" stroke="#7a4f22" stroke-width="2"/>${[0,1,2].map(k=>`<rect x="38" y="${44+k*36}" width="66" height="32" fill="#7a4f22"/><text x="71" y="${72+k*36}" font-size="26" text-anchor="middle">${['📚','📗','📘'][k]}${k==0?'':'📕'}</text>`).join('')}</g>`;
  let s='';
  if(it.svg=='desk')s+=`<g><rect x="190" y="128" width="78" height="7" rx="2" fill="#a8743e"/><rect x="196" y="135" width="5" height="25" fill="#7a4f22"/><rect x="258" y="135" width="5" height="25" fill="#7a4f22"/></g>`;
  if(it.svg=='table')s+=`<g><ellipse cx="208" cy="148" rx="30" ry="6" fill="#a8743e"/><rect x="205" y="148" width="6" height="12" fill="#7a4f22"/></g>`;
  if(it.id=='desk')return s+`<text x="282" y="160" font-size="34" text-anchor="middle">🪑</text>`;
  return s+(it.at||[]).map(([x,y,z])=>`<text x="${x}" y="${y}" font-size="${z}" text-anchor="middle"${it.anim?` class="dk-${it.anim}"`:''}>${it.e}</text>`).join('')}
function roomSVG(r,L){const ids=lookItems(L),built=r<(L.f|0),wall=(WALLS.find(w=>w.id==L.w)||WALLS[0]).col;
  let s=`<svg viewBox="0 0 360 170" xmlns="http://www.w3.org/2000/svg"><style>.dk-bob,.dk-swim,.dk-twinkle{transform-box:fill-box;transform-origin:center}.dk-bob{animation:dkbob 2.2s ease-in-out infinite}.dk-swim{animation:dkswim 4s ease-in-out infinite}.dk-twinkle{animation:dktw 1.4s infinite}@keyframes dkbob{50%{transform:translateY(-4px)}}@keyframes dkswim{50%{transform:translateX(-12px)}}@keyframes dktw{50%{opacity:.4}}</style>
  <polygon points="0,0 360,0 320,12 40,12" fill="#fff8ec"/>
  <rect x="40" y="12" width="280" height="112" fill="${wall}"/>
  <polygon points="0,0 40,12 40,124 0,170" fill="${wall}"/><polygon points="0,0 40,12 40,124 0,170" fill="#000" opacity=".1"/>
  <polygon points="320,12 360,0 360,170 320,124" fill="${wall}"/><polygon points="320,12 360,0 360,170 320,124" fill="#000" opacity=".05"/>
  <polygon points="40,124 320,124 360,170 0,170" fill="#d9a85e"/>${[1,2,3,4,5,6,7].map(k=>`<line x1="${40+k*35}" y1="124" x2="${k*45}" y2="170" stroke="#b9853f" stroke-width="1"/>`).join('')}
  <rect x="40" y="118" width="280" height="6" fill="#fff" opacity=".6"/>
  <g transform="translate(160 22)"><path d="M0 50 V18 a20 18 0 0 1 40 0 V50Z" fill="#bfe7ff" stroke="#e6c07a" stroke-width="3"/><circle cx="30" cy="16" r="5" fill="#ffd54a"/><line x1="20" y1="2" x2="20" y2="50" stroke="#fff" stroke-width="1.5"/></g>`;
  if(built){ids.forEach(id=>{const it=IT[id];if(it.layer=='room'&&it.r==r&&(!it.need||ids.includes(it.need)))s+=roomItem(it)})}
  else s+=`<rect width="360" height="170" fill="#5d6f66" opacity=".55"/><text x="180" y="92" font-size="16" font-weight="800" text-anchor="middle" fill="#fff" font-family="Tajawal,sans-serif">🔒 ابنِ ${Bayt.LEVELS[r].floor} لتفتح هذه الغرفة</text>`;
  return s+'</svg>'}
function inside(L,who){show('jannah');$('#jTitle').textContent=who?`🏠 داخل بيت ${who}`:'🛋️ داخل بيتي';updJ();const B=$('#jBody');
  if(!who)backTo=null;
  B.innerHTML=`<p class="bcap" style="margin:0 0 6px">${who?'هذه غرف بيت صديقك 🤍':`كل طابق تبنيه يفتح لك غرفة جديدة. ${boy()?'اضغط':'اضغطي'} على الغرفة لتزيّنها 🛠️`}</p>
    ${[3,2,1,0].map(r=>`<button class="jroom" data-r="${r}" ${who?'disabled':''}><span class="lb">${ROOMS[r][1]} ${ROOMS[r][0]} <small>· ${Bayt.LEVELS[r].floor}</small></span>${roomSVG(r,L)}</button>`).join('')}`;
  if(!who)B.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=+b.dataset.r;if(r>=Bayt.done){tone(200,.15,'square',.08);modal(`<div style="font-size:50px">🔒</div><h3 style="margin:4px 0">${ROOMS[r][0]} مقفولة</h3><p>${boy()?'ابنِ':'ابني'} ${Bayt.LEVELS[r].floor} في السباق لتفتحها 🏗️</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
    Bayt.sTap();tab='inside';room=r;backTo=()=>inside(Deco.myLook());shop(true)});
  window.scrollTo(0,0)}
let room=0;

/* ---------- قائمة البيت: أزرار جديدة ---------- */
function menuHook(B){
  const chestReady=js.chest!=today();
  const rk=B.querySelector('.brank');
  const html=`<div class="jbar">
    <button class="jbtn shop" id="jShop"><span>🎨</span>زيّن بيتك</button>
    <button class="jbtn in" id="jIn"><span>🛋️</span>ادخل بيتك</button>
    <button class="jbtn fr" id="jFr"><span>👥</span>بيوت أصدقائي</button>
    <button class="jbtn ch ${chestReady?'ready':''}" id="jCh">${chestReady?'<i class="dot">!</i>':''}<span>🎁</span>صندوق اليوم</button></div>
    <div style="text-align:center;margin-top:8px"><span class="jj" id="jMenuJ">💎 ${ar(js.j)}</span></div>${goal()}<div id="jVis"></div>`;
  if(rk)rk.insertAdjacentHTML('afterend',html);else B.insertAdjacentHTML('afterbegin',html);
  $('#jShop').onclick=()=>{Bayt.sTap();shop()};
  $('#jIn').onclick=()=>{Bayt.sTap();inside(Deco.myLook())};
  const hb=B.querySelector('.bhouse');if(hb){hb.style.cursor='pointer';hb.onclick=()=>{Bayt.sTap();inside(Deco.myLook())}}
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
let tab='deeds';
function shop(keepBack){show('jannah');if(!keepBack)backTo=null;$('#jTitle').textContent='🎨 زيّن بيتك';updJ();drawShop();window.scrollTo(0,0)}
function drawShop(){const B=$('#jBody');const L=Deco.myLook();
  let grid='';
  if(tab=='paint')grid=PAINTS.map(p=>{const own=p.price==0||p.id==SEXP()||js.own['p_'+p.id],on=myPaint()==p.id;
    return `<button class="jit ${own?'own':''} ${on?'on':''} ${!own&&js.j<p.price?'poor':''}" data-p="${p.id}"><span class="e"><span style="display:inline-block;width:34px;height:34px;border-radius:10px;background:${p.col};border:2px solid #0002;vertical-align:middle"></span></span><b>${p.name}</b><span class="pr">${on?'✓ الآن':own?'اختر':'💎 '+ar(p.price)}</span></button>`}).join('');
  else if(tab=='inside')grid=WALLS.map(w=>{const own=w.price==0||w.id==SEXW()||js.own['w_'+w.id],on=myWall()==w.id;
    return `<button class="jit ${own?'own':''} ${on?'on':''} ${!own&&js.j<w.price?'poor':''}" data-w="${w.id}"><span class="e"><span style="display:inline-block;width:34px;height:34px;border-radius:8px;background:${w.col};border:2px solid #0002;vertical-align:middle"></span></span><b>جدران ${w.name}</b><span class="pr">${on?'✓ الآن':own?'اختر':'💎 '+ar(w.price)}</span></button>`}).join('')+gridOf(ITEMS.filter(i=>i.cat=='inside'&&i.r==room));
  else grid=gridOf(ITEMS.filter(i=>i.cat==tab));
  function gridOf(list){return list.map(i=>{const own=js.own[i.id],on=own&&js.on[i.id],nd=i.need&&!js.own[i.need];
    const pr=i.deed?(own?(on?'✓ في بيتي':'أظهِر'):'🤲 بالعمل'):i.gift?(own?(on?'✓ في بيتي':'أظهِر'):'🎁 من صديق'):own?(on?'✓ في بيتي':'أظهِر'):nd?`يحتاج ${IT[i.need].name}`:'💎 '+ar(i.price);
    return `<button class="jit ${own?'own':''} ${on?'on':''} ${!own&&(i.gift||i.deed||nd)?'lock':''} ${!own&&!i.gift&&!nd&&js.j<i.price?'poor':''}" data-i="${i.id}"><span class="e">${i.e}</span><b>${i.name}</b><span class="pr">${pr}</span></button>`}).join('')}
  if(tab=='inside'&&room>=Math.max(1,Bayt.done))room=Math.max(0,Bayt.done-1);
  const prev=tab=='inside'?`<div class="jroom" style="margin:0"><span class="lb">${ROOMS[room][1]} ${ROOMS[room][0]}</span>${roomSVG(room,{...L,f:Math.max(1,Bayt.done)})}</div>
    <div class="jrooms" style="margin-top:6px">${ROOMS.map((r,k)=>`<button data-room="${k}" class="${k==room?'on':''}" ${k>=Math.max(1,Bayt.done)?'disabled style="opacity:.45"':''}>${r[1]} ${r[0]}</button>`).join('')}</div>`
    :`<div class="bhouse">${Bayt.houseSVG(Bayt.done,-1,0,true,false,L)}</div>`;
  B.innerHTML=`<div class="jprev">${prev}
    <div class="jtabs">${CATS.map(([id,e,n])=>`<button data-t="${id}" class="${tab==id?'on':''}">${e} ${n}</button>`).join('')}</div></div>
    ${tab=='gift'?`<p class="bcap" style="margin:0 0 8px">هذه الزينة لا تُشترى! تأتيك هديةً من أصدقائك 🎁<br>${boy()?'أهدِ':'أهدي'} أصدقاءك أيضًا من «بيوت أصدقائي».</p>`:''}
    <div class="jgrid">${grid}</div>
    <p class="bcap" style="margin-top:12px">💎 ${boy()?'اربح':'اربحي'} الجواهر من بناء الطوابق، والكؤوس، وصندوق اليوم، وإعجاب أصدقائك ببيتك.<br>اضغط على الزينة التي عندك لتُظهرها أو تُخفيها.</p>`;
  B.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;Bayt.sTap();drawShop()});
  B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>tapItem(IT[b.dataset.i]));
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>tapPaint(PT[b.dataset.p]));
  B.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{room=+b.dataset.room;Bayt.sTap();drawShop()});
  B.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>tapWall(WALLS.find(w=>w.id==b.dataset.w)));
}
function tapWall(w){const k='w_'+w.id;
  if(w.price==0||w.id==SEXW()||js.own[k]){js.wall=w.id;js.wpick=1;jsave();Bayt.sTap();drawShop();publishSoon();return}
  if(js.j<w.price){tone(200,.15,'square',.08);modal(`<h3 style="margin:4px 0">جدران ${w.name}</h3><p>تحتاج ${ar(w.price-js.j)} 💎 أخرى.</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  modal(`<div style="width:70px;height:70px;border-radius:18px;margin:0 auto;background:${w.col};border:3px solid #0002"></div><h3 style="margin:6px 0">لوّن جدران غرفك ${w.name}</h3><p>السعر: <b>💎 ${ar(w.price)}</b></p><div class="nav"><button class="btn sec" data-close>لا</button><button class="btn gold" id="jBuy">لوّن 🎨</button></div>`,()=>{
    $('#jBuy').onclick=()=>{closeModal();js.j-=w.price;js.own[k]=1;js.wall=w.id;js.wpick=1;jsave();updJ();sparkle();drawShop();publishSoon()}})}
function popAfter(sel){const e=$(sel);if(e){e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}}
function tapItem(i){
  if(js.own[i.id]){js.on[i.id]=js.on[i.id]?0:1;jsave();Bayt.sTap();drawShop();popAfter(`[data-i="${i.id}"]`);publishSoon();return}
  if(i.deed){modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>هذه جائزةٌ لا تُشترى بالجواهر 🤲<br>تربحها بعملٍ صالح: <b>${i.deed}</b></p><div class="nav"><button class="btn gold" id="jDeedGo">هيّا أعمل 💪</button><button class="btn sec" data-close>لاحقًا</button></div>`,()=>{$('#jDeedGo').onclick=()=>{closeModal();if(window.Alqab)Alqab.deedFor(i.id)}});return}
  if(i.gift){modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>هذه هديةٌ لا تُشترى 🎁<br>تحصل عليها عندما يهديك إياها صديق.</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  if(i.cat=='inside'&&i.r>=Bayt.done){modal(`<div style="font-size:60px">🔒</div><h3 style="margin:4px 0">${ROOMS[i.r][0]} مقفولة</h3><p>${boy()?'ابنِ':'ابني'} ${Bayt.LEVELS[i.r].floor} أولًا</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  if(i.need&&!js.own[i.need]){modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>${boy()?'اشترِ':'اشتري'} «${IT[i.need].name}» أولًا ثم ${boy()?'علّق':'علّقي'} عليها ${i.name} 😊</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  if(js.j<i.price){tone(200,.15,'square',.08);modal(`<div style="font-size:60px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>تحتاج ${ar(i.price-js.j)} 💎 أخرى.<br>${boy()?'ابنِ':'ابني'} طابقًا في السباق لتربح جواهر كثيرة! 🏗️</p><div class="nav"><button class="btn gold" id="jGoRace">إلى السباق 🏁</button><button class="btn sec" data-close>لاحقًا</button></div>`,()=>{$('#jGoRace').onclick=()=>{closeModal();toBayt()}});return}
  modal(`<div style="font-size:64px">${i.e}</div><h3 style="margin:4px 0">${i.name}</h3><p>السعر: <b>💎 ${ar(i.price)}</b> · عندك ${ar(js.j)}</p><div class="nav"><button class="btn sec" data-close>لا</button><button class="btn gold" id="jBuy">اشترِ وزيّن 🏡</button></div>`,()=>{
    $('#jBuy').onclick=()=>{closeModal();js.j-=i.price;js.own[i.id]=1;js.on[i.id]=1;jsave();updJ();sparkle();if(typeof confetti=='function')confetti();drawShop();popAfter(`[data-i="${i.id}"]`);publishSoon()}})}
function tapPaint(p){const k='p_'+p.id;
  if(p.price==0||p.id==SEXP()||js.own[k]){js.paint=p.id;js.pick=1;jsave();Bayt.sTap();drawShop();publishSoon();return}
  if(js.j<p.price){tone(200,.15,'square',.08);modal(`<h3 style="margin:4px 0">لون ${p.name}</h3><p>تحتاج ${ar(p.price-js.j)} 💎 أخرى.</p><div class="nav"><button class="btn gold" data-close>حسنًا</button></div>`);return}
  modal(`<div style="width:70px;height:70px;border-radius:18px;margin:0 auto;background:${p.col};border:3px solid #0002"></div><h3 style="margin:6px 0">لوّن بيتك ${p.name}</h3><p>السعر: <b>💎 ${ar(p.price)}</b></p><div class="nav"><button class="btn sec" data-close>لا</button><button class="btn gold" id="jBuy">لوّن 🎨</button></div>`,()=>{
    $('#jBuy').onclick=()=>{closeModal();js.j-=p.price;js.own[k]=1;js.paint=p.id;js.pick=1;jsave();updJ();sparkle();drawShop();publishSoon()}})}

/* ---------- أونلاين ---------- */
const ready=()=>O()&&O().db&&O().me&&O().profile;
let pubT=0;
function publishSoon(){clearTimeout(pubT);pubT=setTimeout(publish,1200)}
function publish(){if(!ready())return;const A=O(),L=Deco.myLook();
  A.db.ref('houses/'+A.me).set({f:Bayt.done,c:Bayt.cups,p:L.p,w:L.w,i:L.i,g:L.g||'',n:A.profile.nick,a:A.profile.av,t:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{})}
const clean=h=>({w:WALLS.some(w=>w.id==(h&&h.w))?h.w:'cream',f:Math.max(0,Math.min(4,h&&h.f|0)),c:Math.max(0,+(h&&h.c)||0),p:PT[h&&h.p]?h.p:'sand',i:lookItems({i:h&&h.i}).join(','),g:cleanG(h&&h.g)});

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
    return `<button class="jfc" data-f="${r.id}"><div class="bhouse">${Bayt.houseSVG(L.f,-1,0,true,false,L)}</div><b>${esc(r.p.av)} ${esc(r.p.nick)}</b><small>${r.h?`${['لم يبنِ بعد','طابق واحد','طابقان','ثلاثة طوابق','أربعة طوابق','خمسة طوابق'][L.f]}${js.gave[r.id]==today()?' · 🎁 أهديتَه اليوم':''}`:'لم يفتح بيته بعد'}</small></button>`}).join('')}</div>
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
    <div class="nav"><button class="btn" id="jInF" style="background:linear-gradient(160deg,#ffb36b,#c96a2a)">🛋️ ادخل بيته</button></div>
    <p class="bcap">${boy()?'تستطيع':'تستطيعين'} أن ${boy()?'تعجب':'تعجبي'} ببيت كل صديق، و${boy()?'تهديه':'تهديه'} هديةً واحدة كل يوم 🤍</p>
    <div class="nav"><button class="btn sec" id="jBackFr">بيوت أصدقائي</button></div></div>`;
  $('#jBackFr').onclick=friends;
  $('#jInF').onclick=()=>{Bayt.sTap();inside(L,r.p.nick);backTo=()=>visit(r)};
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
