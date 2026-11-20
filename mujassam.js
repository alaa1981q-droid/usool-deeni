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
#m3d .m3card .row{display:flex;gap:8px;justify-content:center;margin-top:8px}#m3d .m3card .row button{border:0;border-radius:14px;padding:8px 14px;font:inherit;font-weight:800;background:#1fa463;color:#fff}
#m3d .m3card .row button.sec{background:#e3ecf7;color:#1d4e9e}
#m3d .m3j{position:absolute;top:66px;left:12px;z-index:2;background:#fff;border-radius:14px;padding:4px 10px;font-weight:900;color:#1d4e9e;box-shadow:0 3px 0 #c9d6e3,0 3px 10px #0002}
#m3d .m3fly{position:absolute;z-index:3;left:50%;top:45%;transform:translateX(-50%);font-size:30px;font-weight:900;color:#1d7ad0;text-shadow:0 2px 0 #fff;pointer-events:none;animation:m3fly 1.4s ease forwards}
@keyframes m3fly{to{transform:translate(-50%,-90px);opacity:0}}
#m3d .m3hp{position:absolute;top:12px;right:12px;z-index:2;display:flex;align-items:center;gap:6px;background:#fffffff2;border-radius:22px;padding:4px 12px 4px 8px;box-shadow:0 3px 0 #c9d6e3,0 3px 10px #0002;min-height:40px}#m3d .m3hp>b{font-size:18px!important;color:#1d4e9e!important}#m3d .m3hp>.e{font-size:24px!important}
#m3d .m3wx{position:absolute;top:60px;right:12px;z-index:2;display:flex;align-items:center;gap:4px;border:0;background:#fffffff2;border-radius:18px;padding:3px 10px;font:inherit;font-weight:900;color:#1d4e9e;box-shadow:0 3px 0 #c9d6e3,0 3px 10px #0002}#m3d .m3wx[hidden]{display:none}#m3d .m3wx span{font-size:20px}#m3d .m3wx b{font-size:15px}
#m3d .m3hos{position:absolute;left:12px;z-index:2;display:flex;align-items:center;gap:4px;border:0;border-radius:22px;padding:5px 12px 5px 9px;font:inherit;font-weight:900;font-size:14px;color:#b0262c;background:linear-gradient(160deg,#fff,#ffe9ea);box-shadow:0 3px 0 #e8b8bb,0 3px 10px #0002}#m3d .m3hos b{font-size:22px;line-height:1}#m3d .m3hos[hidden]{display:none}
#m3d .m3snd{position:absolute;top:108px;left:12px;z-index:2;width:42px;height:42px;border-radius:50%;border:0;background:#fffd;font-size:20px;box-shadow:0 2px 6px #0003}
#m3d .m3msg:empty{display:none}#m3d .m3hp:empty{display:none}#m3d .m3hp .e{font-size:30px;line-height:1}#m3d .m3hp .t{flex:1;min-width:0}#m3d .m3hp b{display:block;font-size:14.5px;color:#5a4a1a}#m3d .m3hp small{display:block;font-size:12px;font-weight:700;color:#7a6a3a}
#m3d .m3hp .hb{height:9px;border-radius:6px;background:#efe6d2;overflow:hidden;margin-top:3px}#m3d .m3hp .hb i{display:block;height:100%;border-radius:6px;transition:width .6s}`;
document.head.appendChild(css);
const cam0={th:.35,ph:.62,dist:0};let cur=null;
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const arn=n=>typeof ar=='function'?ar(n):n;

/* ---------- الحالة اليومية ---------- */
const DKEY='usul5_m3d_v1',today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
let ds={};try{ds=JSON.parse(localStorage.getItem(DKEY)||'{}')||{}}catch(e){}
function day(){if(ds.d!==today())ds={d:today(),pr:{},tr:{},lt:{},cat:0};return ds}
const dsv=()=>{try{localStorage.setItem(DKEY,JSON.stringify(ds))}catch(e){}};
const seed=()=>{let h=0;for(const c of today())h=(h*31+c.charCodeAt(0))>>>0;return h};
// (v12.1) ثلاث أشجار يسار البيت أُبعدت قليلًا لتتّسع المزرعة (FARM)
const TREES=[[-23.4,-3],[-23.4,6.2],[12,-3],[12,4],[-2.8,-28],[3.6,12.9],[-13,12],[13,-12],[-13,-12],[13,12],[-23.6,0],[16.5,-8]];
// (v15.0) المزرعة أُبعدت يسارًا لتتّسع حديقة البيت وسوره
const FARM=[-17.8,0],FARM_IN={x:-17.8,z:2.2,via:4.6};
// (v15.0) أرض البيت: من السور الأمامي XF إلى الخلفي XL، وعرضها ±HZ
const XF=-2.95,XL=-14.4,HZ=3.55;
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
const NOFL=(x,z)=>x>9.6&&x<17.6&&z<-14&&z>-25||Math.abs(z-RVZ)<2.6||x>3&&x<11&&z<-13&&z>-28||Math.hypot(x-PLZ[0],z-PLZ[1])<3.9||Math.abs(z-NBZ)<2.6&&Math.abs(Math.abs(x)-7)<2.6;
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
  const TG=[1,2.7,4.3].map(sd=>{const g=new T.IcosahedronGeometry(1,2),p=g.attributes.position,v=new T.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);v.multiplyScalar(1+.13*Math.sin(v.x*5.3+sd)*Math.cos(v.y*4.1+sd*2)+.07*Math.sin(v.z*9+sd));p.setXYZ(i,v.x,v.y,v.z)}
    g.computeVertexNormals();return g});
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
    cl.forEach(([a,b,c,r,sy],i)=>{const m=add(TG[(h+i)%3],i%2||(bl&&i>2)?m2:m1,a,b,c,G);m.scale.set(r,r*sy,r);m.rotation.y=i*1.3});
    if(kind===2&&!bl)for(let i=0;i<9;i++){const a=i*2.4+h,y=1.45+(i*37%10)/10*.95,r=Math.sqrt(Math.max(.05,1-((y-1.95)/.8)**2))*.98;add(FRG,FRT,Math.cos(a)*r,y,Math.sin(a)*r,G)}};
  const anim=[];S.userData.anim=anim;
  // (v13.6) نخلة واقعية: جذع منحنٍ بحلقات، وسعف متدلٍّ، وعذوق تمر
  const PTG=new T.CylinderGeometry(.11,.14,.52,8),PRG=new T.TorusGeometry(.125,.025,5,10),FRDG=new T.SphereGeometry(1,10,6),DTG=new T.SphereGeometry(.06,6,5);
  const ptr=M(night?0x5a4630:0x8a6a45,{roughness:1}),frd=M(night?0x2d6b30:0x3f9a3c,{roughness:.8,side:T.DoubleSide}),frd2=M(night?0x3a7a35:0x5aac45,{roughness:.8,side:T.DoubleSide}),dtm=M(0xb5651d,{roughness:.6});
  const palm=(x,z,p)=>{const h=Math.abs(Math.round(x*11+z*5)),G=new T.Group();G.position.set(x,0,z);G.rotation.y=h*.9;(p||S).add(G);
    let px=0,py=0;for(let i=0;i<5;i++){const lx=.018*i*i,m=add(PTG,ptr,lx,py+.26,0,G);m.rotation.z=-.035*i;const r=add(PRG,ptr,lx,py+.5,0,G);r.rotation.x=Math.PI/2;px=lx;py+=.5}
    const C=new T.Group();C.position.set(px+.05,py,0);G.add(C);
    for(let k=0;k<10;k++){const f=new T.Group();f.rotation.y=k/10*Math.PI*2+(k%2)*.2;f.rotation.x=k%2?.55:.25;C.add(f);
      const l1=add(FRDG,k%2?frd:frd2,0,0,.62,f);l1.scale.set(.2,.03,.68);l1.castShadow=true;
      const f2=new T.Group();f2.position.z=1.2;f2.rotation.x=.55;f.add(f2);const l2=add(FRDG,k%2?frd:frd2,0,0,.5,f2);l2.scale.set(.16,.025,.55)}
    for(let i=0;i<7;i++){const a=i*.9;add(DTG,dtm,Math.cos(a)*.16,-.12-(i%3)*.06,Math.sin(a)*.16,C)}};
  // الأرض والطرق
  const g=add(new T.CircleGeometry(900,64),M(night?0x3f9149:0x5cc455),0,0,0);g.rotation.x=-Math.PI/2;
  // بقع عشب بدرجات مختلفة
  const pM=[M(night?0x4aa052:0x72d460),M(night?0x37853f:0x4fb44c)];
  for(let i=0;i<26;i++){const a=i*2.4,r=8+(i*37%22),p=add(new T.CircleGeometry(2+i%3,20),pM[i%2],Math.cos(a)*r,.004,Math.sin(a)*r);p.rotation.x=-Math.PI/2;p.receiveShadow=true;p.castShadow=false}
  // (v12.4) سهل أخضر ممتد بلا نهاية: سلسلة جبال واقعية غربًا (عشب ← صخر ← ثلج)، وبحر متدرّج شرقًا، والطريق يغيب في الأفق
  const WIN=winter();
  const NS=(x,z)=>{const h=(i,j)=>{const t=Math.sin(i*127.1+j*311.7)*43758.5453;return t-Math.floor(t)},xi=Math.floor(x),zi=Math.floor(z),fx=x-xi,fz=z-zi,
    u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz),a=h(xi,zi),b=h(xi+1,zi),c=h(xi,zi+1),d=h(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const FBM=(x,z,o)=>{let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*NS(x*f,z*f);a*=.5;f*=2.03}return s};
  {const X0=-46,W=260,L=1200,g=new T.PlaneGeometry(W,L,92,240);g.rotateX(-Math.PI/2);g.translate(X0-W/2,0,-200);
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
    for(let i=0;i<14;i++){const z=-120+i*12,x=-28-(i%3)*2;if(Math.abs(z+22)<9||nearVil(x,z))continue;tree(x,z,null,1.3+(i%3)*.2)}}
  // البحر والشاطئ (لون متدرّج: فيروزي قرب الشاطئ ← أزرق عميق)
  {const SX=22,LL=1600,sand=M(night?0xb8a675:0xf2dca0);
    const b=add(new T.PlaneGeometry(6,LL),sand,SX-1,.012,0);b.rotation.x=-Math.PI/2;b.castShadow=false;
    const sg=new T.PlaneGeometry(700,LL,40,1);sg.rotateX(-Math.PI/2);sg.translate(SX+350,.03,0);
    const sc=[],c1=new T.Color(night?0x1f4f6e:0x5fd0e0),c2=new T.Color(night?0x0c2440:0x1e6fc0),c3=new T.Color(night?0x081a30:0x15529a),C=new T.Color(),SP=sg.attributes.position;
    for(let i=0;i<SP.count;i++){const u=Math.min(1,(SP.getX(i)-SX)/60);C.copy(c1).lerp(c2,u);if(u>=1)C.lerp(c3,Math.min(1,(SP.getX(i)-SX-60)/200));sc.push(C.r,C.g,C.b)}
    sg.setAttribute('color',new T.Float32BufferAttribute(sc,3));
    const w=new T.Mesh(sg,new T.MeshStandardMaterial({vertexColors:true,roughness:.25,metalness:.1}));S.add(w);
    const foam=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75});
    for(let k=0;k<3;k++){const f=new T.Mesh(new T.PlaneGeometry(.35,LL),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75}));f.rotation.x=-Math.PI/2;S.add(f);anim.push(t=>{const u=(t*.25+k/3)%1;f.position.set(SX+2.2+u*5,.04,0);f.material.opacity=(night?.4:.75)*(1-u)})}
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
  [[-23,-36],[8,-34],[-16,-48],[12,-52],[-6,-62],[10,-72],[-14,-80],[6,-92],[-12,24.5],[16,27.5],[-15,34],[17,45]].forEach(([x,z])=>nearVil(x,z)||tree(x,z,null,1.3));
  for(let i=0;i<40;i++){const z=-110-i*8,x=(i%2?1:-1)*(6+(i*29%12));if(!nearVil(x,z))tree(x,z,null,1.2+(i%3)*.2)}
  // (v14.8) أشجار على جانبي الشارع جنوبًا أيضًا حتى يمتدّ المنظر
  for(let i=0;i<34;i++){const z=48+i*9,x=(i%2?1:-1)*(6+(i*23%11));if(!nearVil(x,z)&&Math.abs(z-NBZ)>4&&Math.abs(z-RVZ)>4)tree(x,z,null,1.2+(i%3)*.2)}
  // الطرق بلون دافئ وأرصفة بيضاء — الطريق الرئيسي طويل جدًا يغيب في الضباب
  // (v14.9) طلب الشيخ: الشارع أسود (إسفلت)، والخطوط بيضاء، والرصيف مخطّط أسود وأبيض
  const road=M(night?0x2a2c31:0x3b3e44,{roughness:.95}),curb=M(0xffffff),line=M(night?0xe8e8e8:0xffffff);
  // (v14.8) طلب الشيخ: شارع ممتد لا تُرى نهايته — يمتد ١٢٠٠ في كل اتجاه فيغيب في الضباب من الجهتين
  const RL=2400,RZ=0;
  const rd=add(new T.PlaneGeometry(4,RL),road,0,.01,RZ);rd.rotation.x=-Math.PI/2;rd.castShadow=false;
  {const cg=new T.BoxGeometry(.2,.14,1),n=RL,o=new T.Object3D(),cB=new T.Color(0x1c1c1c),cW=new T.Color(night?0xcfcfcf:0xffffff);
    [-2.1,2.1].forEach(x=>{const im=new T.InstancedMesh(cg,M(0xffffff),n);for(let i=0;i<n;i++){o.position.set(x,.07,RZ-RL/2+.5+i);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,i%2?cB:cW)}
      im.instanceColor.needsUpdate=true;im.receiveShadow=true;S.add(im)})}
  [-4.6,4.6].forEach(z=>{const r=add(new T.PlaneGeometry(28,1.8),road,0,.012,z);r.rotation.x=-Math.PI/2});
  {const lg=new T.PlaneGeometry(.18,1.4);lg.rotateX(-Math.PI/2);const n=Math.floor(RL/3),im=new T.InstancedMesh(lg,line,n),o=new T.Object3D();
    for(let i=0;i<n;i++){o.position.set(0,.02,RZ+RL/2-1-i*3);o.updateMatrix();im.setMatrixAt(i,o.matrix)}S.add(im)}
  // زهور ملوّنة كثيرة على العشب
  {const fl=[0xff5c8a,0xffd23f,0xb07cff,0xff8c42,0xffffff,0x4fc3ff,0xff4f4f],geo=new T.SphereGeometry(.13,8,6),im=new T.InstancedMesh(geo,new T.MeshStandardMaterial({roughness:.6}),240);
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
    const CLV=cloudLv(),LM=(c,e,k)=>new T.MeshLambertMaterial({color:c,emissive:e,emissiveIntensity:k}),
      cw=RN?LM(0xb9c1ca,0x3a4048,.35):LM(0xffffff,0xffffff,.55),cs=RN?LM(0x9aa3ad,0x30363d,.3):LM(0xf2f6fb,0xdfe8f2,.45),
      CN=RN?12:CLV===2?13:CLV===0?4:8,cg=new T.SphereGeometry(1,20,14);
    for(let i=0;i<CN;i++){const c=new T.Group(),n=4+i%3,mid=(n-1)/2,rs=k=>{const x=Math.sin(i*12.9898+k*78.233)*43758.5453;return x-Math.floor(x)};
      for(let j=0;j<n;j++){const r=1.15+(1-Math.abs(j-mid)/(mid+1))*.9+rs(j)*.25,b=new T.Mesh(cg,cs);b.position.set((j-mid)*1.35,r*.25,(rs(j+9)-.5)*.8);b.scale.set(r*1.15,r*.55,r);c.add(b)}
      for(let j=0;j<n-1;j++){const r=.95+(1-Math.abs(j+.5-mid)/(mid+1))*1.05+rs(j+20)*.3,u=new T.Mesh(cg,cw);u.position.set((j+.5-mid)*1.3+(rs(j+30)-.5)*.4,.75+r*.45,(rs(j+40)-.5)*.6);u.scale.set(r,r*.9,r*.95);c.add(u)}
      const ca=i/CN*Math.PI*2,cr=52+i%3*10;c.scale.setScalar((RN?3:2.4)*(.85+rs(50)*.35));S.add(c);anim.push(t=>{const a=ca+t*.008;c.position.set(Math.cos(a)*cr,(RN?12:16)+i%3*3,Math.sin(a)*cr);c.rotation.y=-a})}
    // طيور تحلّق
    const bm=M(0x445566);for(let i=0;i<4;i++){const b=new T.Group();const w1=add(new T.BoxGeometry(.7,.05,.25),bm,-.35,0,0,b),w2=add(new T.BoxGeometry(.7,.05,.25),bm,.35,0,0,b);
      S.add(b);const r=14+i*4,sp=.25+i*.05,ph=i*1.7;anim.push(t=>{const a=t*sp+ph;b.position.set(Math.cos(a)*r,10+i,Math.sin(a)*r);b.rotation.y=-a;const f=Math.sin(t*8+i)*.5;w1.rotation.z=f;w2.rotation.z=-f})}
    // فراشات ملوّنة
    // (v13.8) في الربيع (آذار–أيار) فراشات أكثر، وفي المطر تختبئ
    const SPR=[2,3,4].includes(new Date().getMonth());
    (RN?[]:SPR?[0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a,0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a]:[0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a]).forEach((c,i)=>{const b=new T.Group(),wm=new T.MeshStandardMaterial({color:c,side:T.DoubleSide});
      const w1=new T.Mesh(new T.CircleGeometry(.22,8),wm),w2=new T.Mesh(new T.CircleGeometry(.22,8),wm);w1.position.x=-.2;w2.position.x=.2;b.add(w1,w2);S.add(b);
      const cx=[-9,9,-9,9,-12,12][i%6]+(i>5?3:0),cz=[-2,-2,4,3,-12,12][i%6]+(i>5?-6:0);anim.push(t=>{const a=t*.7+i;b.position.set(cx+Math.cos(a)*2.2,1.2+Math.sin(t*2+i)*.4,cz+Math.sin(a*1.3)*2.2);b.rotation.y=-a;const f=Math.sin(t*14+i)*1.1;w1.rotation.y=f;w2.rotation.y=-f})})}
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
  const LAMPS=[[-2.8,-13],[2.5,-13],[-2.8,-7.5],[2.5,-7.5],[-2.8,-1.8],[2.5,-1.8],[-2.8,7.5],[2.5,7.5],[-2.8,13],[2.5,13],[-10,5.8],[10,5.8],[-10,-5.8],[10,-5.8]];
  // (v13.5) رصيف حجري على جانبي الطريق الرئيسي داخل المدينة (الطفل يمشي على الأيسر)، وممرّات مشاة مخطّطة عند التقاطعين
  {const sw=M(night?0x9a958c:0xd8d3c8);[-2.5,2.5].forEach(x=>{const r=add(new T.PlaneGeometry(.8,60),sw,x,.015,-2);r.rotation.x=-Math.PI/2;r.castShadow=false});
    const zb=M(0xffffff);[-4.6,4.6].forEach(z=>{for(let x=-1.65;x<=1.66;x+=.55){const s=add(new T.PlaneGeometry(.3,1.3),zb,x,.022,z);s.rotation.x=-Math.PI/2;s.castShadow=false}})
    // (v13.9) إشارة «🚸 عبور المشاة» على جانبي كل ممرّ
    const sp=M(0x4a4f5a);[-4.6,4.6].forEach(z=>[-1,1].forEach(k=>{const x=k*2.95,zz=z+k*.95;add(new T.CylinderGeometry(.04,.05,2,6),sp,x,1,zz);
      const s=textSprite(T,'🚸 عبور','rgba(30,90,200,.95)','#ffffff');s.scale.set(1.5,.33,1);s.position.set(x,2.15,zz);S.add(s)}))}
  LAMPS.forEach(([x,z])=>{const s=x<0?1:-1;add(new T.CylinderGeometry(.07,.1,2.8,8),pole,x,1.4,z);add(new T.BoxGeometry(.6,.07,.07),pole,x+s*.28,2.78,z);
    const b=add(new T.SphereGeometry(.17,12,8),bulb,x+s*.55,2.66,z);b.castShadow=false;
    if(night){const p=new T.Mesh(new T.CircleGeometry(2.1,24),pool);p.rotation.x=-Math.PI/2;p.position.set(x+s*.55,.03,z);S.add(p)}});
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
      (l===2?[1]:l===3?[1,-1]:[]).forEach(k=>{const x=k*(bw/2+.6),z=bw/2-.4,mh=bh*2.2;
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
      if(l===3){palm(-w/2-.8,d/2,G);palm(w/2+.8,d/2,G);box(w*.6,h*.6,d*.7,M(0xe9f5ec),0,h+.35+h*.3,0,G);box(w*.6+.2,.25,d*.7+.2,green,0,h+.35+h*.6+.12,0,G);return h*1.65+1.2}
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
    add(new T.CylinderGeometry(.07,.07,6,8),M(0xdddddd),W/2+.8,3,D/2+.6,G);box(1.4,.85,.05,M(0x1fa463),W/2+1.5,5.4,D/2+.6,G);
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
  const P=Md&&Md.PARTS||{};
  Object.keys(SPOT).forEach(p=>{const G=new T.Group();G.position.set(SPOT[p][0],0,SPOT[p][1]);G.userData.p=p;S.add(G);let top,lb;
    if(p==='sc'){top=school(G);lb=textSprite(T,V?'🎒 المدرسة':'🎒 مدرستي','rgba(255,255,255,.92)','#5a4a1a')}
    else if(p==='home'){top=home(G);lb=textSprite(T,V?'🏡 بيت '+V.nick:'🏡 بيتي','rgba(255,255,255,.92)','#5a4a1a')}
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
      const z=RVZ+((i*37)%10/10-.5)*2.4,x0=-40+i*6;anim.push(t=>{let x=x0+(t*.6)%60;if(Math.abs(x)<3.2)x+=6.4;r.position.set(x>22?x-62:x,.05,z);r.material.opacity=.25+.25*Math.sin(t*1.5+i)})}
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
    anim.push(t=>{BT.position.set(12+Math.sin(t*.05)*4,Math.sin(t*1.1)*.04,RVZ+.4);BT.rotation.z=Math.sin(t*.9)*.05;BT.rotation.y=Math.PI/2+Math.cos(t*.05)*.15})}
  // ---- 🦆 البطّ: أمّ وصغارها وبطّتان؛ عند الإطعام تسبح نحو الطفل ----
  {const DK=new T.Group();DK.userData.act='ducks';S.add(DK);const call=S.userData.duckCall={on:0,x:FBX+1.8,z:RVZ-1};
    const mk=(c,head,s,i)=>{const G=new T.Group();G.scale.setScalar(s);DK.add(G);const b=M(c,{roughness:.8}),h=M(head,{roughness:.6}),yl=M(0xf2a516);
      ell(.24,.85,.6,1.25,b,0,.14,0,G);const tl=ell(.1,.6,.5,1,b,0,.24,-.28,G);tl.rotation.x=-.6;ell(.13,1,1,1,h,0,.42,.2,G);
      const bk=ell(.07,1.1,.4,1.4,yl,0,.39,.36,G);[-.07,.07].forEach(a=>ell(.022,1,1,1,M(0x111111),a,.46,.29,G));
      [-1,1].forEach(k=>{const w=ell(.14,.3,.5,1.1,M(new T.Color(c).multiplyScalar(.82).getHex()),k*.17,.18,-.02,G);w.rotation.y=k*.1});
      const st={G,a:i*1.3,ox:(i%3-1)*.5,oz:((i>>1)%2-.5)*.6,k:i};return st};
    const ds=[mk(0x8a6a4a,0x1f6b3a,1.1,0),mk(0xffe066,0xffe066,.55,1),mk(0xffe066,0xffe066,.55,2),mk(0xffe066,0xffe066,.55,3),mk(0xf5f2ea,0xf5f2ea,1,4),mk(0x8a6a4a,0x6b4a2a,1,5)];
    if(!V&&!D.duck){mark(DK,'🦆','#2f9fd0',1.4,0,.9);S.userData.duckMark=marks[marks.length-1]}
    anim.push((t,dt)=>{ds.forEach((d,i)=>{const G=d.G;let x,z;
      if(call.on>0&&i<5){x=call.x+d.ox*1.4;z=call.z+.55+d.oz*.8;}
      else{const a=t*.12+d.a*(i<4?.15:1),cx=i<4?-13:i===4?8:-24,rx=i<4?4:3;x=cx+Math.cos(a)*rx+(i<4&&i>0?-Math.cos(a)*.0:0)-(i>0&&i<4?Math.sin(a)*(.5+i*.45):0);z=RVZ+Math.sin(a*1.7)*.6+(i>0&&i<4?(i%2?.25:-.25):0)}
      const dx=x-G.position.x,dz=z-G.position.z,dd=Math.hypot(dx,dz);if(dd>.02){const sp=Math.min(dd,dt*(call.on>0?1.6:.8));G.position.x+=dx/dd*sp;G.position.z+=dz/dd*sp;const ta=Math.atan2(dx,dz);let da=ta-G.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));G.rotation.y+=da*Math.min(1,dt*4)}
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
  {[[-1,0xf3e3c3,'🏠 بيت جدّو'],[1,0xe6efe0,null]].forEach(([k,c,nm])=>{const G=new T.Group();G.position.set(k*7,0,NBZ);G.rotation.y=k<0?Math.PI/2:-Math.PI/2;S.add(G);
      const wl=M(c),tr2=M(0xd8c39a);box(3,2.3,3.2,wl,0,1.15,0,G);box(3.1,.12,3.3,tr2,0,2.36,0,G);
      [[0,1.6],[0,-1.6]].forEach(([x,z])=>box(3.1,.35,.08,tr2,x,2.58,z,G));[-1.5,1.5].forEach(x=>box(.08,.35,3.2,tr2,x,2.58,0,G));
      add(new T.CylinderGeometry(.35,.35,.6,14),M(0x2f6fd0),.8,2.75,-.8,G);
      box(.8,1.4,.08,M(0x7a4f2a),0,.7,1.62,G);ell(.05,1,1,1,M(0xffd23f),.28,.7,1.68,G);
      [-1,1].forEach(j=>{box(.6,.55,.06,winM,j*1.05,1.5,1.62,G);box(.08,.6,.08,M(0x2f7d5a),j*1.05-.36,1.5,1.64,G);box(.08,.6,.08,M(0x2f7d5a),j*1.05+.36,1.5,1.64,G)});
      add(new T.CylinderGeometry(.06,.06,.05,8),M(0x777777),0,.03,1.9,G);palm(1.9,1.3,G);if(nm)label(nm,0,3.6,0,.62,G)})}
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
      TREES.forEach(([x,z],ti)=>{for(let i=0;i<7;i++){const l=new T.Mesh(lg,lm[(ti+i)%4]);const ox=(Math.random()-.5)*2.4,oz=(Math.random()-.5)*2.4,y0=Math.random()*2.6,sp=.35+Math.random()*.3,ph=Math.random()*6;S.add(l);
          anim.push(t=>{let y=2.6-((t*sp+y0)%2.6);l.position.set(x+ox+Math.sin(t*1.3+ph)*.35,y+.05,z+oz+Math.cos(t*1.1+ph)*.25);l.rotation.set(t*2+ph,t*1.5,ph)})}
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
        anim.push(t=>{const u=(t*.12+o)%1;p.position.set(cx+4+Math.sin(t*.5+i)*.6,1.5+u*7,cz-4+u*2);p.scale.setScalar(.7+u*2.2);p.material.opacity=.32*(1-u)})}});
    {const SK=new T.Group();SK.position.set(7,0,NBZ);SK.userData.act='sick';S.add(SK);if(!V&&sickDay()&&!D2.sick)mark(SK,'🤒','#8f6bff',3.9,0,.95)}
    // 🐦 مُطعِم العصافير أمام البيت (الشتاء) + عصافير تنزل لتأكل
    {const FD=new T.Group();FD.position.set(-4.3,0,-3.1);FD.userData.act='birds';S.add(FD);add(new T.CylinderGeometry(.05,.05,1.1,8),M(0x6b4423),0,.55,0,FD);box(.6,.05,.6,M(0x8b5a2b),0,1.12,0,FD);
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([a,b])=>box(a?0.05:.6,.1,b?.05:.6,M(0x8b5a2b),a*.28,1.18,b*.28,FD));prism(.8,.3,.8,M(0xc0563b),0,1.5,0,FD);
      if(!V&&birdMonths()&&!D2.bf)mark(FD,'🐦','#3b9be0',2.3,0,.8);
      const SP=S.userData.sparrows={on:0,x:-3.6,z:-3.2,b:[]};const brown=M(0x8a5a3a),cream=M(0xf0e0c0);
      for(let i=0;i<7;i++){const b=new T.Group();ell(.1,1,.9,1.4,brown,0,.1,0,b);ell(.07,1,1,1,brown,0,.18,.12,b);ell(.07,1,.6,1,cream,0,.06,.04,b);add(new T.ConeGeometry(.025,.06,6),M(0xe0a020),0,.17,.2,b).rotation.x=Math.PI/2;
        b.visible=false;S.add(b);SP.b.push({b,a:i/7*Math.PI*2,r:.4+(i%3)*.3,ph:i})}
      anim.push((t,dt)=>{if(SP.on<=0){SP.b.forEach(o=>o.b.visible=false);return}SP.on-=dt;const k=Math.min(1,Math.min(SP.on,24-SP.on)/2.5);
        SP.b.forEach(o=>{o.b.visible=true;const y=(1-k)*7;o.b.position.set(SP.x+Math.cos(o.a)*o.r*(1+(1-k)*6),y+Math.max(0,Math.sin(t*9+o.ph))*.05,SP.z+Math.sin(o.a)*o.r);o.b.rotation.y=o.a+Math.PI;o.b.rotation.x=k>.99?Math.max(0,Math.sin(t*5+o.ph))*.6:0})})}
    // 💝 صندوق الصدقات عند باب الجامع
    if(LV('m')>0){const SB=new T.Group();SB.position.set(7.6,0,3.3);SB.userData.act='sadaqa';S.add(SB);box(.12,.6,.12,M(0x777777),0,.3,0,SB);box(.55,.45,.4,M(0x1f8a5a),0,.82,0,SB);box(.3,.03,.06,M(0x151515),0,1.055,0,SB);box(.57,.08,.42,M(0xc9a227,{metalness:.6,roughness:.35}),0,1.06,0,SB);
      if(!V&&!D2.sdq)mark(SB,'💝','#d94f8a',1.9,0,.75)}
    // ❤️ علامة فوق الوالدين عند باب البيت حتى يبرّهما الطفل اليوم
    if(!V&&!night){const br=D2.br||{};if(!(br.s&&br.b&&br.h)){const PM=new T.Group();PM.position.set(-3.1,0,1);PM.userData.act='parents';S.add(PM);mark(PM,'❤️','#e2504a',2.9,0,.85)}}}
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
    if(gL>=1){const hg=M(night?0x2f6a32:0x3f9a3e,{flatShading:true});for(let x=GX0+.3;x<GX1-.2;x+=.62)[-1,1].forEach(k=>{const b=add(TG[0],hg,x,.32,k*(HZ-.42),GG);b.scale.set(.36,.34,.3)});
      for(let z=-HZ+.8;z<HZ-.7;z+=.62){const b=add(TG[1],hg,GX0+.15,.32,z,GG);b.scale.set(.3,.34,.36)}}
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
  Object.assign(S.userData,{marks,trees,lit,cat});return S}

/* ---------- شخصية الطفل ---------- */
function makeKid(){const T=THREE,G=new T.Group(),M=(c)=>new T.MeshStandardMaterial({color:c,roughness:.7});
  const add=(geo,m,x,y,z,p)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;(p||G).add(o);return o};
  const girl=!boy(),skin=M(0xf2c9a0),shirt=M(girl?0xd94f8a:0x2f6fd0),pants=M(girl?0xd94f8a:0x2b3a55),shoe=M(0x3a2a1a),dk=M(0x222222);
  const legs=[-1,1].map(k=>{const L=new T.Group();L.position.set(k*.11,.5,0);G.add(L);add(new T.CylinderGeometry(.08,.08,.45,8),pants,0,-.22,0,L);add(new T.BoxGeometry(.14,.08,.22),shoe,0,-.46,.04,L);return L});
  if(girl)add(new T.CylinderGeometry(.2,.34,.6,14),shirt,0,.62,0);else add(new T.CylinderGeometry(.2,.24,.5,14),shirt,0,.72,0);
  const arms=[-1,1].map(k=>{const A=new T.Group();A.position.set(k*.27,.92,0);G.add(A);add(new T.CylinderGeometry(.06,.06,.42,8),shirt,0,-.2,0,A);add(new T.SphereGeometry(.065,8,6),skin,0,-.43,0,A);return A});
  // (v11.4) وجه أوضح: رأس أكبر، عيون كبيرة لامعة، خدود وردية وابتسامة
  const face=new T.MeshStandardMaterial({color:0xf6cfa6,roughness:.6,emissive:0x4a3020,emissiveIntensity:.35});
  add(new T.SphereGeometry(.32,20,16),face,0,1.32,0);
  const wh=new T.MeshBasicMaterial({color:0xffffff}),pu=new T.MeshBasicMaterial({color:0x1a1a2a});
  [-.115,.115].forEach(x=>{add(new T.SphereGeometry(.085,12,10),wh,x,1.35,.24);add(new T.SphereGeometry(.052,10,8),pu,x,1.35,.31);add(new T.SphereGeometry(.018,6,4),wh,x-.018,1.375,.36)});
  const ck=new T.MeshBasicMaterial({color:0xff9aa8});[-.2,.2].forEach(x=>{const c=add(new T.SphereGeometry(.055,10,8),ck,x,1.25,.24);c.scale.z=.4});
  const sm=add(new T.TorusGeometry(.085,.02,6,14,Math.PI),new T.MeshBasicMaterial({color:0xc0343a}),0,1.22,.285);sm.rotation.z=Math.PI;
  if(girl){const hj=M(0xffffff);const h=add(new T.SphereGeometry(.36,20,14,0,Math.PI*2,0,Math.PI*.6),hj,0,1.33,-.04);h.rotation.x=-.55;
    add(new T.SphereGeometry(.37,20,14,Math.PI,Math.PI,Math.PI*.5,Math.PI*.5),hj,0,1.33,-.06);
    add(new T.ConeGeometry(.4,.4,20,1,true),hj,0,1.05,-.02);add(new T.TorusGeometry(.31,.035,8,24),M(0xff7fb0),0,1.36,.06).rotation.x=-.3}
  else{const hair=M(0x3b2414);const hr=add(new T.SphereGeometry(.335,20,12,0,Math.PI*2,0,Math.PI*.5),hair,0,1.33,-.03);hr.rotation.x=-.35;
    add(new T.SphereGeometry(.26,16,8,0,Math.PI*2,0,Math.PI/2),M(0xffffff),0,1.5,-.04)}
  G.scale.setScalar(KS);G.userData={legs,arms};return G}

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
function footNow(){const h=hourNow(),we=wDay()>=5;return !rainNow()&&(h>=15&&h<maghribH()-.15||we&&h>=9.5&&h<11.8)}
// (v15.4) طلب الشيخ: 🎡 مدينة الألعاب يحضرها الأطفال الجمعة والسبت، والعطل (الصيفية ١٥ حزيران–آخر آب، ونصف السنة ٢٠ ك٢–٥ شباط)، والعيدين والمناسبات السعيدة.
// مغلقة في أيام الحزن (محرّم…). تعمل من ٩ صباحًا حتى ٩ مساءً، ولا تعمل وقت المطر.
function parkWhy(){const d=window.City3D&&City3D.debugPark;if(d!=null)return d?'🎉 يوم عطلة':null;const o=occNow();if(o&&o.k==='sad')return null;if(festNow()==='eid')return '🎉 اليوم عيد';if(o&&o.k==='joy')return o.t;
  const w=wDay();if(w===5)return '🕌 اليوم الجمعة';if(w===6)return '🌞 اليوم السبت';const n=new Date(),m=n.getMonth(),dd=n.getDate();
  if(m===5&&dd>=15||m===6||m===7)return '☀️ العطلة الصيفية';if(m===0&&dd>=20||m===1&&dd<=5)return '📚 عطلة نصف السنة';return null}
function parkOpen(){const h=hourNow();return !!parkWhy()&&h>=9&&h<21&&!rainNow()&&!sleepNow()}
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
    const hy=kid?1.3:1.52,hr=kid?.24:.19;add(new T.CylinderGeometry(hr*.38,hr*.42,.14,8),sk,0,hy-hr*.95,0,P);
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
    if(kind==='shep'){add(new T.CylinderGeometry(.025,.025,1.9,6),M(0x6b4423),.34,.95,.12,P);add(new T.TorusGeometry(.1,.025,5,10,Math.PI),M(0x6b4423),.44,1.9,.12,P)}
    if(kind==='guard'){add(new T.CylinderGeometry(.22,.22,.14,12),M(0x152a4f),0,hy+.13,0,P);add(new T.BoxGeometry(.3,.03,.18),M(0x101010),0,hy+.07,.17,P);
      add(new T.SphereGeometry(.11,10,8),new T.MeshStandardMaterial({color:0xfff1b0,emissive:0xffd860,emissiveIntensity:1.6}),.32,.8,.15,P);
      const pl=new T.PointLight(0xffd27a,1.2,9,1.4);pl.position.set(.32,1,.3);P.add(pl)}
    if(kid)s=.62;P.userData.lp=null;P.userData.ph=Math.random()*6;
    P.scale.setScalar(s*1.35*PS);g.add(P);return P}
  // (v14.0) تأرجح اليدين (والرجلين للأطفال) حين يتحرّك الشخص، ويسكنان حين يقف
  function swing(dt){g.children.forEach(P=>{const u=P.userData;if(!u.arms||!P.visible)return;const x=P.position.x,z=P.position.z,lp=u.lp;
    const mv=lp?Math.hypot(x-lp[0],z-lp[1])/Math.max(dt,1e-3):0;u.lp=[x,z];const on=mv>.2&&mv<10;u.ph+=dt*(on?7.5:0);
    u.am=(u.am||0)+((on?.55:0)-(u.am||0))*Math.min(1,dt*8);const a=Math.sin(u.ph)*u.am;u.arms[0].rotation.x=a;u.arms[1].rotation.x=-a;
    if(u.legs){u.legs[0].rotation.x=-a;u.legs[1].rotation.x=a}})}
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
  function lodWrap(V,simple,d){const W=new T.Group(),L=new T.LOD();L.addLevel(V,0);L.addLevel(simple,d||70);W.add(L);W.scale.copy(V.scale);V.scale.setScalar(1);g.add(W);return W}
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
    if(night){const l=new T.SpotLight(0xfff1c0,1.2,14,.5,.6);l.position.set(0,.6,1.4);l.target.position.set(0,0,7);V.add(l,l.target)}
    V.scale.setScalar(.95);const Sm=new T.Group(),b=new T.Mesh(lodG.b,paint);b.position.y=.6;const cb=new T.Mesh(lodG.c,glassM);cb.position.set(0,1.05,-.2);const wh=new T.Mesh(lodG.w,tireM);wh.position.y=.3;Sm.add(b,cb,wh);
    return lodWrap(V,Sm)}
  const cars=[{v:bus(),stop:-17.6,off:0},{v:car(0xe2504a),stop:-12.4,off:1.6},{v:car(0x4f8fe0),stop:-8.6,off:3.2}];
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
  function turn(P,a,dt,k){let d=a-P.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));P.rotation.y+=d*Math.min(1,dt*(k||6))}
  // يبدأ رحلة جديدة بشخص جديد (شكل مختلف كل مرة)
  function newTrip(i,o){const old=peds[i],u=old.userData.u,busy=peds.map(P=>P.userData.u.trip);
    const ok=TRIPS.map((r,k)=>k).filter(k=>!busy.includes(k)&&(!TRIPS[k].m||o.mosque)&&(!TRIPS[k].hp||o.hosp));if(!ok.length){u.gap=3;return}
    const k=ok[Math.floor(Math.random()*ok.length)],r=Math.random(),kind=r<.45?'man':r<.82?'woman':'kid';
    const P=person(kind,Math.floor(Math.random()*12));P.userData.ped=i+1;umbrella(P,i);
    g.remove(old);old.traverse(x=>{x.geometry&&x.geometry.dispose()});peds[i]=P;
    const off=(Math.random()-.5)*.35,pts=TRIPS[k].p.map(q=>[q[0]+(Math.abs(q[0])<4?off:0),q[1]+(Math.abs(Math.abs(q[1])-5)<.3?off:0),q[2]]);
    Object.assign(u,{kind,h:kind==='kid'?1.7:2.3,trip:k,pts:pts.slice(1),sp:(kind==='kid'?1.15:1)*(.85+Math.random()*.35),v:0,bs:P.scale.x,gr:near(pts[0])?0:1,
      out:near(pts[pts.length-1])||TRIPS[k].end?1:0,fade:0,look:0,greet:0,hold:0,bub:null});P.userData.u=u;
    P.position.set(pts[0][0],0,pts[0][1]);const n=pts[1];P.rotation.y=Math.atan2(n[0]-pts[0][0],n[1]-pts[0][1]);P.scale.setScalar(u.bs*Math.max(.01,u.gr))}
  let gT=5;
  function endGreet(i){const u=peds[i]&&peds[i].userData.u;if(!u)return;u.greet=0;unsay(u.bub);u.bub=null}
  // (v12.1) 🚗 سيارات تمرّ طول اليوم في الاتجاهين، وتقف إذا كان الطفل أمامها في الطريق
  // ألوان سيارات حقيقية: أبيض، فضي، أسود، كحلي، أحمر، بيج، أخضر غامق، برتقالي
  const CC=[0xf2f2f2,0xb8bec6,0x1f2833,0x1d3f7a,0xb3262e,0xd9c9a3,0x2f6b4f,0xe07b24];
  // (v13.5) السيارات تأتي من بعيد وتذهب بعيدًا حتى تختفي في الأفق (بلا اختفاء مفاجئ): الطريق من Z0 إلى Z1
  // (v14.1) طلب الشيخ: زحام وقت المدرسة. سيارات إضافية (rush) تدخل الطريق فقط بين ٧:٣٠–٨:٣٠ و١١:٤٥–١٢:٤٥ وتمشي أبطأ فتتزاحم
  const Z0=-600,Z1=600,TN=night?5:40,RU=night?0:25; // (v14.8) تظهر وتختفي على بُعد ٦٠٠ (داخل الضباب) فلا يُرى ظهورها
  const traffic=[];[1,-1].forEach(dir=>{for(let k=0;k<TN;k++){const v=car(CC[(traffic.length*3)%CC.length],traffic.length%3===1),z=Z0+(k+(dir<0?.5:0))*(Z1-Z0)/TN;
    v.rotation.y=dir>0?0:Math.PI;v.position.set(dir,0,z);const ru=RU>0&&![0,3,5].includes(k%8);traffic.push({v,dir,z,sp:7+Math.random()*2,ru})}});
  traffic.forEach(c=>{if(c.ru){c.on=rushNow();c.v.visible=c.on}});
  // (v14.7) طلب الشيخ: 🚌 باصات المدينة تقف عند الموقف، ينزل ناس ويصعد آخرون. باص أبيض بخطّ أخضر، نوافذ على الجانبين، وباب على جهة الرصيف.
  function cityBus(col){const V=new T.Group(),w=M(0xf4f4f0,{roughness:.4}),st=M(col),gl=new T.MeshStandardMaterial({color:night?0x3a4a5a:0x223344,roughness:.1,metalness:.5});
    add(new T.BoxGeometry(2,1.9,6.2),w,0,1.35,0,V);add(new T.BoxGeometry(2.02,.25,6.22),st,0,.75,0,V);add(new T.BoxGeometry(2.02,.12,6.22),st,0,2.12,0,V);
    [-1,1].forEach(k=>add(new T.BoxGeometry(.03,.7,5),gl,k*1.01,1.6,-.4,V));add(new T.BoxGeometry(1.8,.9,.03),gl,0,1.55,3.11,V);add(new T.BoxGeometry(1.7,.6,.03),gl,0,1.65,-3.11,V);
    add(new T.BoxGeometry(.03,1.5,.9),M(0x3a4a5a),1.02,1.1,2.2,V); // الباب (جهة اليمين)
    add(new T.BoxGeometry(1.2,.22,.04),new T.MeshStandardMaterial({color:0x111111,emissive:0xffb020,emissiveIntensity:.8}),0,2.3,3.12,V); // لوحة الخطّ
    [[3.13,headM],[-3.13,tailM]].forEach(([z,m])=>[-.7,.7].forEach(x=>add(new T.BoxGeometry(.3,.16,.05),m,x,.7,z,V)));
    [[-1,2],[1,2],[-1,-2],[1,-2]].forEach(([k,z])=>{const t2=add(new T.CylinderGeometry(.42,.42,.3,18),tireM,k*.88,.42,z,V);t2.rotation.z=Math.PI/2;const h2=add(new T.CylinderGeometry(.22,.22,.32,12),hubM,k*.88,.42,z,V);h2.rotation.z=Math.PI/2});
    if(night){const l=new T.SpotLight(0xfff1c0,1.2,16,.5,.6);l.position.set(0,.8,3.2);l.target.position.set(0,0,8);V.add(l,l.target)}
    V.scale.setScalar(.95);const Sm=new T.Group(),b=new T.Mesh(new T.BoxGeometry(2,2,6.2),w);b.position.y=1.4;const sb=new T.Mesh(new T.BoxGeometry(2.04,.3,6.24),st);sb.position.y=.75;Sm.add(b,sb);return lodWrap(V,Sm,80)}
  const stops=BSTOP.map(([dir,z,sx,wx])=>({dir,z,sx,wx,q:[],t:2+Math.random()*4}));
  {const L=Z1-Z0;[1,-1].forEach(dir=>[0,1,2].forEach(j=>{const v=cityBus([0x1fa463,0x2f6fd0,0x1fa463][j]),z=Z0+((j*13+(dir>0?.5:1))*(L/TN))%L;v.rotation.y=dir>0?0:Math.PI;v.position.set(dir,0,z);
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
  // ⚽ أطفال يلعبون الكرة العصر: فريق أحمر وفريق أزرق، والكرة تنتقل بينهم
  const FBK=[],FBH=[[-1.6,-2.6],[1.4,-2.2],[0,-3.6],[-1.4,2.4],[1.5,2.6],[0,3.6]];
  for(let i=0;i<6;i++){const p=person('kid',i<3?i*6:1+(i-3)*6);p.userData.bag.visible=false;p.userData.act='football';p.userData.fh=FBH[i];p.position.set(FB[0]+FBH[i][0],0,FB[1]+FBH[i][1]);FBK.push(p)}
  const ball=new T.Mesh(new T.SphereGeometry(.15,14,10),new T.MeshStandardMaterial({color:0xffffff,roughness:.5}));[[0,.15,0],[0,-.15,0],[.15,0,0],[-.15,0,0],[0,0,.15],[0,0,-.15]].forEach(q=>{const d=new T.Mesh(new T.SphereGeometry(.05,6,4),M(0x222222));d.position.set(...q);ball.add(d)});
  ball.position.set(FB[0],.15,FB[1]);ball.userData.act='football';g.add(ball);const bl={from:null,to:null,k:1,who:0,wait:1};
  // 🔥 الجارة عند التنّور
  const baker=person('woman',6);baker.position.set(11.1,0,25.5);baker.rotation.y=-Math.PI*.7;baker.userData.act='tannour';
  let lastCycle=-1;
  function update(t,dt,o){const h=hourNow(),day=!night;
    // الساحة والحارس
    Object.values(sellers).forEach((P,i)=>{P.visible=day&&!o.sleep;P.rotation.y=-Math.PI/2+Math.sin(t*.3+i*2)*.35;P.position.y=Math.abs(Math.sin(t*.9+i))*.02});
    // (v14.3) طلب الشيخ: الطلاب في ساحة المدرسة فقط وقت الدوام (٨ صباحًا – ١٢:٤٥ ظهرًا) من الأحد إلى الخميس؛ الجمعة والسبت المدرسة فارغة
    const dawam=day&&wDay()<5&&h>=7.75&&h<12.75,road=day&&wDay()<5&&h>=7.4&&h<13.2;
    yard.forEach(p=>{p.visible=dawam;if(!dawam)return;const u=p.userData;
      if(u.w>0){u.w-=dt;if(u.j>0){u.j-=dt;p.position.y=Math.abs(Math.sin(u.j*9))*.25}else p.position.y=0;
        if(u.w<=0){u.tx=YX[0]+Math.random()*(YX[1]-YX[0]);u.tz=YZ[0]+Math.random()*(YZ[1]-YZ[0]);if(Math.random()<.3)u.j=1}}
      else{const dx=u.tx-p.position.x,dz=u.tz-p.position.z,d=Math.hypot(dx,dz);if(d<.05){u.w=1+Math.random()*3}else{const sp=Math.min(d,dt*1.3);p.position.x+=dx/d*sp;p.position.z+=dz/d*sp;p.rotation.y=Math.atan2(dx,dz);p.position.y=Math.abs(Math.sin(t*6+p.id))*.06}}});
    guard.visible=night;if(night){const z=-17+Math.sin(t*.15)*1.4;guard.rotation.y=Math.cos(t*.15)>0?0:Math.PI;guard.position.z=z;guard.position.y=Math.abs(Math.sin(t*3))*.03}
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
    const K=o.kid;traffic.forEach(c=>{let block=false;
      if(K&&Math.abs(K.x-c.dir)<1&&o.kidOn){const ah=(K.z-c.z)*c.dir;if(ah>0&&ah<3.2)block=true}
      // (v13.9) تقف للمشاة على ممرّ العبور أو الواقفين عند حافته (ومنهم الطفل إذا وقف ينظر يمينًا ويسارًا)
      const yz=(x,z,wait)=>{if(Math.abs(Math.abs(z)-4.8)>.8)return;if(!wait&&Math.abs(x-c.dir)>1.3)return;const ah=(z-c.z)*c.dir;if(wait?ah>1.5&&ah<7:ah>-.2&&ah<4)block=true};
      walkers.forEach(w=>{if(w.cross&&w.P.visible&&(Math.abs(w.P.position.x)<2.2||w.pause>0))yz(w.P.position.x,w.P.position.z,w.pause>0)});
      peds.forEach(P=>{const u=P.userData.u;if(P.visible&&(Math.abs(P.position.x)<2.2||u.look>0))yz(P.position.x,P.position.z,u.look>0)});
      if(K&&o.kidWait)yz(K.x,K.z,true);
      traffic.concat(c.dir<0?cars.filter(s=>s.v.visible).map(s=>({dir:-1,z:s.v.position.z,v:s.v})):[]).forEach(d=>{if(d!==c&&d.dir===c.dir&&d.v.visible){const gp=(d.z-c.z)*c.dir;if(gp>0&&gp<(c.cb?3:1.4)+(d.cb?3:d.v===cars[0].v?2.3:1.4)+.8)block=true}});
      // (v14.7) 🚌 باص المدينة يقف عند الموقف ٧ ثوانٍ (من ٦ صباحًا إلى ١١ ليلًا): ينزل ركّاب ويصعد المنتظرون
      if(c.cb){const sc=c.st.z-2.1*c.dir;if(c.hold>0){c.hold-=dt;block=true}else if(!c.done&&!block&&h>=6&&h<23&&!o.sleep){const ah=(sc-c.z)*c.dir;if(ah>=0&&ah<=c.sp*dt*1.6+.05){c.z=sc;c.hold=7;c.done=1;block=true;busArrive(c)}}}
      if(c.dir<0&&phase&&c.z>=Z1&&cars.some(s=>s.v.visible&&s.v.position.z>530))block=true; // لا تدخل سيارة فوق الباص لحظة ظهوره
      if(!block)c.z+=c.dir*c.sp*(rush?.45:1)*dt;
      if(c.dir>0&&c.z>Z1||c.dir<0&&c.z<Z0){c.z=c.dir>0?Z0:Z1;c.done=0;if(c.ru){c.on=rush;c.v.visible=rush}}c.v.position.z=c.z});
    // (v14.5) الوالدان والجارة بالنهار، والأطفال يلعبون الكرة العصر
    [father,mother].forEach(P=>{P.visible=day&&!o.sleep});mother.userData.bags.forEach(b=>b.visible=!o.bagsDone);baker.visible=day&&!o.sleep;
    if(baker.visible)baker.rotation.x=Math.max(0,Math.sin(t*.9))*.25;
    const play=day&&!o.sleep&&footNow();ball.visible=play;FBK.forEach(p=>p.visible=play);
    if(play){bl.wait-=dt;if(bl.k<1){bl.k=Math.min(1,bl.k+dt*1.2);const a=bl.from,b2=bl.to;ball.position.set(a.x+(b2.x-a.x)*bl.k,.15+Math.sin(bl.k*Math.PI)*.9,a.z+(b2.z-a.z)*bl.k);ball.rotation.x+=dt*8}
      else if(bl.wait<=0){const tg=FBK[Math.floor(Math.random()*6)];bl.from=ball.position.clone();bl.to={x:tg.position.x,z:tg.position.z};bl.k=0;bl.wait=1.3+Math.random();bl.who=FBK.indexOf(tg)}
      FBK.forEach((p,i)=>{const h0=p.userData.fh,chase=i===bl.who||Math.hypot(ball.position.x-p.position.x,ball.position.z-p.position.z)<1.6;
        const tx=chase?ball.position.x:FB[0]+h0[0]+Math.sin(t*.4+i)*.8,tz=chase?ball.position.z:FB[1]+h0[1]+Math.cos(t*.3+i)*.6,dx=tx-p.position.x,dz=tz-p.position.z,d=Math.hypot(dx,dz);
        if(d>.35){const sp=Math.min(d-.3,dt*(chase?2.4:1.2));p.position.x+=dx/d*sp;p.position.z+=dz/d*sp;p.rotation.y=Math.atan2(dx,dz);p.position.y=Math.abs(Math.sin(t*9+i))*.06}else{p.rotation.y=Math.atan2(ball.position.x-p.position.x,ball.position.z-p.position.z);p.position.y=0}
        p.position.x=Math.max(FB[0]-2.9,Math.min(FB[0]+2.9,p.position.x));p.position.z=Math.max(FB[1]-4.3,Math.min(FB[1]+4.3,p.position.z))})}
    // (v14.7) 🚌 ناس يأتون إلى الموقف وينتظرون الباص (حتى ٤ في كل موقف)
    stops.forEach(st=>{st.t-=dt;if(st.t>0)return;st.t=6+Math.random()*8;if(h<6||h>=22.5||o.sleep||st.q.length>=4)return;
      const p=ppl();if(p.userData.bag)p.userData.bag.visible=false;const from=st.z+(Math.random()<.5?-1:1)*(18+Math.random()*12),i=st.q.length;
      walk(p,[[st.sx,from],[st.sx,st.z+(i-1.5)*.62],[st.wx,st.z+(i-1.5)*.62]],1.2+Math.random()*.3,'wait');st.q.push(walkers[walkers.length-1])});
    // الجيران على الأرصفة
    // (v15.1) الجيران: كل واحد في رحلة من مكان إلى مكان، يمشي بانسيابية (يبدأ ببطء ويقف بلطف، يلتفت تدريجيًا، يقطع الزوايا)
    peds.forEach((P,i)=>{const u=P.userData.u,on=u.shep?day&&!o.sleep:(day||i<2)&&!o.sleep;if(P.userData.umb)P.userData.umb.visible=!!o.rain;
      if(!on){P.visible=false;if(u.bub)endGreet(i);u.hold=0;if(!u.shep&&u.trip>=0){u.trip=-1;u.gap=1+Math.random()*3}return}
      if(!u.shep&&u.trip<0){P.visible=false;u.gap-=dt;if(u.gap<=0)newTrip(i,o);return}
      P.visible=true;
      if(u.gr<1){u.gr=Math.min(1,u.gr+dt*1.6);P.scale.setScalar(u.bs*u.gr)}
      if(u.hold>0){u.hold-=dt;u.v=0;if(K)turn(P,Math.atan2(K.x-P.position.x,K.z-P.position.z),dt,5);P.position.y=0;return}
      if(u.greet>0){u.greet-=dt;u.v=Math.max(0,u.v-dt*2);P.position.y=Math.abs(Math.sin(t*2))*.04;if(u.greet<=0)endGreet(i);if(u.v<=0)return}
      if(u.look>0){u.look-=dt;u.v=Math.max(0,u.v-dt*3);const q=u.pts[0];if(q)P.rotation.y=Math.atan2(q[0]-P.position.x,q[1]-P.position.z)+Math.sin(u.look*4.2)*1.05;P.position.y=0;return}
      if(u.shep&&!u.pts.length){u.w-=dt;P.position.y=0;if(u.w<=0){u.pts=[[FLK[0]+(Math.random()-.5)*7,FLK[1]+(Math.random()-.5)*7]];u.w=2+Math.random()*4}return}
      if(!u.pts.length){ // وصل: يدخل الباب ويغيب، أو يبتعد في آخر الشارع
        u.fade+=dt*1.8;P.scale.setScalar(u.bs*Math.max(.01,1-u.fade));P.position.y=0;if(u.fade>=1){P.visible=false;if(u.bub)endGreet(i);u.trip=-1;u.gap=2+Math.random()*6}return}
      const q=u.pts[0],dx=q[0]-P.position.x,dz=q[1]-P.position.z,d=Math.hypot(dx,dz),last=u.pts.length===1;
      const want=u.sp*(last&&u.out?Math.min(1,.35+d/1.6):1);u.v+=(want-u.v)*Math.min(1,dt*1.8);const st=u.v*dt;
      if(d<=Math.max(st,last||q[2]?0:.45)){if(last||q[2]){P.position.x=q[0];P.position.z=q[1]}u.pts.shift();if(q[2])u.look=q[2]}
      else{P.position.x+=dx/d*st;P.position.z+=dz/d*st;turn(P,Math.atan2(dx,dz),dt)}
      if(!u.shep&&!last&&!q[2]&&Math.random()<dt*.012)u.look=.9+Math.random()*.8; // أحيانًا يقف لحظة ويتلفّت
      P.position.y=Math.abs(Math.sin(t*6.5+i))*.035*Math.min(1,u.v)});
    gT-=dt;if(gT<=0){gT=9+Math.random()*7;if(!peds.some(P=>P.userData.u.greet>0||P.userData.u.hold>0)){const c=peds.filter(P=>{const u=P.userData.u;return P.visible&&u.gr>=1&&!u.fade&&u.pts.length>(u.shep?-1:1)&&Math.hypot(P.position.x,P.position.z)<30});
      if(c.length){const P=c[Math.floor(Math.random()*c.length)],u=P.userData.u;u.greet=11;u.bub=say(P,'السلام عليكم 👋',1e9,u.h)}}}
    bubs.slice().forEach(b=>{b.k-=dt;b.s.position.set(b.o.position.x,b.o.position.y+b.h,b.o.position.z);if(b.k<=0)unsay(b)});
    // المصلّون وقت الصلاة (إذا بُني الجامع)
    const jum=day&&jumuaNow();
    if(jum&&o.mosque){prT-=dt;if(prT<=0&&walkers.filter(w=>w.wor).length<36){prT=.6+Math.random()*.7;worshipper(1,jum==='go')}}
    else if(o.prayer&&o.mosque){prT-=dt;if(prT<=0&&prN<14){prT=2.2+Math.random()*2;worshipper()}}else{prN=0}
    // حركة المشاة
    // (v13.9) 🚸 طلاب يعبرون من ممرّ المشاة بالنهار: يقفون عند الرصيف، ينظرون يمينًا ويسارًا، ثم يعبرون والسيارات تقف لهم
    if(road&&!o.sleep){crT-=dt;if(crT<=0){crT=(phase?8:16)+Math.random()*8;crossers(CROSS[crI++%CROSS.length])}}
    parkTick(t,dt,o,h);
    walkers=walkers.filter(w=>{const P=w.P;if(w.grow!=null&&w.grow<1){w.grow=Math.min(1,w.grow+dt*2);P.scale.setScalar(P.userData.bs*w.grow)}
      if(!w.pts.length){if(w.end==='enter'||w.end==='gone'){w.k+=dt*3;P.scale.multiplyScalar(Math.max(.01,1-dt*3));if(w.k>1){g.remove(P);P.traverse(x=>{x.geometry&&x.geometry.dispose();x.material&&x.material.dispose()});return false}}return true}
      if(w.pause>0){w.pause-=dt;const [nx,nz]=w.pts[0];P.rotation.y=Math.atan2(nx-P.position.x,nz-P.position.z)+Math.sin(w.pause*4.5)*1.1;P.position.y=0;return true}
      const [tx,tz,wt]=w.pts[0],dx=tx-P.position.x,dz=tz-P.position.z,d=Math.hypot(dx,dz);w.v=(w.v||0)+(w.sp-(w.v||0))*Math.min(1,dt*2.2);const sp=w.v*dt,cut=w.pts.length>1&&!wt?.4:0;
      if(d<=Math.max(sp,cut)){if(!cut){P.position.x=tx;P.position.z=tz}w.pts.shift();if(wt)w.pause=wt}else{P.position.x+=dx/d*sp;P.position.z+=dz/d*sp;turn(P,Math.atan2(dx,dz),dt,7)}
      P.position.y=Math.abs(Math.sin(t*6+P.id))*.05;return true});swing(dt)}
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
  const PKW=[[.5,.2],[-1,1.6],[5.2,.6],[-5.5,.8],[1.6,5.4],[-3.2,5.8],[5.6,-6],[-.6,-6],[-6,-6],[4.6,3.2],[0,2.6],[-2.5,2.2]],wand=[];
  for(let i=0;i<6;i++){const P=person(i<4?'kid':i===4?'woman':'man',i+1);PKG.add(P);const q=PKW[i*2%PKW.length];P.position.set(q[0],0,q[1]);P.userData.pk={t:PKW[(i*5+3)%PKW.length],w:Math.random()*3};pkPeople.push(P);wand.push(P)}
  {const P=person('woman',4);PKG.add(P);P.position.set(-5.4,0,3.3);pkPeople.push(P)}{const P=person('man',3);PKG.add(P);P.position.set(1.2,0,5.6);P.rotation.y=Math.PI;sit(P);P.position.y=-.05;pkPeople.push(P)}
  const pkMk=markSprite(T,'🎡','#e2504a',1);pkMk.position.set(8.6,5.6,0);pkMk.visible=false;pkMk.userData.act='park';PKG.add(pkMk);
  let pkSp=0,pkA=0,pkT=3;
  function parkTick(t,dt,o,h){const op=parkOpen(),day0=!night;pkSp+=((op?1:0)-pkSp)*Math.min(1,dt*.8);pkA+=pkSp*dt;
    WR.rotation.x=pkA*.22;cabs.forEach(({C})=>C.rotation.x=-WR.rotation.x);CR.userData.top.rotation.y=pkA*.9;horses.forEach((H,i)=>H.position.y=.9+Math.sin(pkA*3+i*1.3)*.22*pkSp);
    PKG.userData.saw.rotation.z=Math.sin(pkA*1.8)*.28*pkSp;PKG.userData.bal.forEach((b,i)=>b.position.y=4.2+(i%2)*.4+Math.sin(t*1.5+i)*.08);
    PKG.userData.closed.visible=!op;pkMk.visible=op&&!o.v&&!o.pkDone;pkMk.position.y=5.6+Math.sin(t*2)*.12;
    pkPeople.forEach(P=>P.visible=op);if(!op)return;
    // الطفل على الزحليقة: يصعد السلّم ثم ينزلق
    {const u=(t*.25)%1,SL=[3.4,3.6];if(u<.45){const k=u/.45;slider.position.set(SL[0]-1.85+.0,.05+k*1.95,SL[1]);slider.rotation.y=Math.PI/2}else{const k=(u-.45)/.55;slider.position.set(SL[0]-1.2+k*2.9,2.05-k*1.9,SL[1]);slider.rotation.y=Math.PI/2}}
    wand.forEach(P=>{const u=P.userData.pk;if(u.w>0){u.w-=dt;return}const dx=u.t[0]-P.position.x,dz=u.t[1]-P.position.z,d=Math.hypot(dx,dz);
      if(d<.15){u.w=1+Math.random()*3;u.t=PKW[Math.floor(Math.random()*PKW.length)];return}const sp=Math.min(d,(P.userData.legs?1.2:.9)*dt);P.position.x+=dx/d*sp;P.position.z+=dz/d*sp;turn(P,Math.atan2(dx,dz),dt);P.position.y=Math.abs(Math.sin(t*7+P.id))*.04});
    // 👨‍👧‍👦 عائلات تأتي إلى مدينة الألعاب (من الطريق والقرية) وأخرى ترجع
    pkT-=dt;if(pkT<=0&&h<20.3){pkT=6+Math.random()*6;if(walkers.filter(w=>w.pk).length<14){const back=Math.random()<.35,n=1+Math.floor(Math.random()*2),GX=PKC[0]+8.6,GZ=PKC[1];
      const r=Math.random(),src=r<.4?[[L2,-75]]:r<.75?[[L2,8],[L2,-6]]:[VL[0],[VL[0][0]+4,VL[0][1]],[L2,VL[0][1]]];
      for(let i=0;i<=n;i++){const kid2=i>0,P=person(kid2?'kid':Math.random()<.55?'man':'woman',Math.floor(Math.random()*12)),o2=(i-.5)*.32;
        let pts=src.map(q=>[q[0]+(Math.abs(q[0])<4?o2:0),q[1]]).concat([[L2+o2,GZ+.3*i],[GX,GZ+o2],[GX-2.4,GZ+o2*2]]);if(back)pts=pts.reverse();
        P.userData.bs=P.scale.x;if(back)P.scale.setScalar(.01);walk(P,pts,kid2?1.35:1.2,back?'gone':'enter');const w=walkers[walkers.length-1];w.pk=1;if(back)w.grow=0}}}}
  return {g,update,stops,count:()=>walkers.length,peds,say,endGreet,traffic,sellers,elder,faller,fallMk,father,mother,baker,FBK}}

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
  const R=new T.WebGLRenderer({antialias:true,logarithmicDepthBuffer:true}); // (v15.3) يمنع الوميض (تداخل الأسطح) أثناء تقليب المدينة
  R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.setSize(W,H);
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
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
  let bKey=window.Binaa?Binaa.code()+'|'+(Binaa.job?Binaa.job.p+(Binaa.job.ready?'r':''):''):'';
  const life=makeLife(night);S.add(life.g);let prC=null,prAt=0;const sounds=makeSounds(night);if(window.City3D)City3D._life=life;
  if(ui.snd){const upd=()=>{ui.snd.textContent=sounds.quiet?"🌙":sndOn()?"🔊":"🔇"};upd();ui.snd.onclick=()=>{if(sounds.quiet){card("🌙 الليل هادئ… المدينة نائمة 😴");setTimeout(()=>card(""),2200);return}try{localStorage.setItem(SKEY,sndOn()?"0":"1")}catch(e){}upd()}}
  const kid=makeKid();S.add(kid);let at={x:-3.4,z:1,via:null},path=[],onArrive=null,busy=0;kid.position.set(at.x,0,at.z);kid.rotation.y=Math.PI/2;
  // (v13.7) سرعة مشي الطفل (تبطؤ حين يرافق جدّو) وكيسان يحملهما عنه
  // (v13.8) ☂️ مظلّة الطفل وقت المطر، وألوان السماء حسب الوقت: فجر وردي-برتقالي، نهار أزرق، غروب برتقالي فوق الجبال، ليل كحلي
  let wKey=rainNow()+'|'+rainbowNow()+'|'+festNow()+'|'+(occNow()||{}).id+'|'+winter()+'|'+cloudLv(),wRain=rainNow();
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
  let kidSp=4.2,escort=0,lookT=0,carry=0,fallEsc=0,fallT=25+Math.random()*40;const FALLP=[-3.4,11.2];
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
  const SW=-2.3;
  // (v13.5) 😴 من منتصف الليل حتى الفجر: الطفل نائم في بيته، والجيران في بيوتهم، وفوق البيت «Zzz»
  let sleeping=false;const zz=textSprite(T,'😴 Zzz','rgba(255,255,255,.9)','#3a4a8a');zz.material.transparent=true;zz.scale.set(2.6,.57,1);zz.visible=false;life.g.add(zz);
  {const fl=Math.max(1,Math.min(4,(window.Bayt&&Bayt.done)|0||1));zz.userData.y=(fl*1.6+2)*(BS.home||1)+3.3;zz.position.set(SPOT.home[0]+1.5,zz.userData.y,SPOT.home[1])}
  const sleepCard=()=>card(`😴 ${B('أنت','أنتِ')} ${B('نائم','نائمة')} في ${B('بيتك','بيتكِ')}… الوقت متأخر 🌙<br><small>النوم مبكرًا يقوّي الجسم، ونستيقظ لصلاة الفجر إن شاء الله 🤲</small>`,[[B('تصبح','تصبحين')+' على خير 🌙',null]]);
  function startSleep(now){sleeping=true;zz.visible=true;
    if(now){kid.visible=false;path=[];sleepCard();return}
    busy=0;path=[];wander=false;at=here();go(door('home'),()=>{busy=1;let k=0;const s=setInterval(()=>{k++;kid.scale.setScalar(KS*Math.max(0,1-k/10));
      if(k>=10){clearInterval(s);kid.visible=false;kid.scale.setScalar(KS);busy=0;sleepCard()}},40)});
    card(`🌙 الساعة ١٢ ليلًا… حان وقت النوم 😴<br><small>${B('تذهب','تذهبين')} إلى ${B('بيتك','بيتكِ')} ${B('لتنام','لتنامي')}</small>`)}
  function wake(){sleeping=false;zz.visible=false;at=door('home');kid.position.set(at.x,0,at.z);kid.visible=true;path=[];
    card(`☀️ صباح الخير! ${B('استيقظتَ','استيقظتِ')} لصلاة الفجر 🤲`);setTimeout(()=>{if(ui.card.textContent.includes('صباح الخير'))card('')},3500)}
  const WP=[{x:SW,z:-6},{x:SW,z:7},{x:SW,z:12},{x:SW,z:-12},{x:-5,z:4.05,via:4.6},{x:-10.3,z:4.05,via:4.6},{x:-5.5,z:-5.9,via:-4.6}];
  const here=()=>{const x=kid.position.x,z=kid.position.z;return {x,z,via:Math.abs(x)>2.6&&Math.abs(Math.abs(z)-4.6)<1.2?sign(z)*4.6:null}};
  // (v13.9) طلب الشيخ: الطفل يعبر الشارع الرئيسي من ممرّ المشاة فقط (z=±4.6)، ويقف عند الرصيف ينظر يمينًا ويسارًا (النقطة الثالثة =1)
  // الأماكن يمين الشارع بلا via يصلها عبر الممرّ الأقرب ثم الرصيف الأيمن (x=2.8)
  function go(to,done,w){if(busy)return;if(path.length&&wander){at=here();path=[]}wander=!!w;const p=[],R=2.8,zb=z=>z>=0?4.6:-4.6,rt=a=>a.via==null&&a.x>2.2;
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
    s.position.set(kid.position.x,1.4,kid.position.z);const a=i/16*Math.PI*2;s.userData={k:0,v:new T.Vector3(Math.cos(a)*2.2,2.5+Math.random()*1.5,Math.sin(a)*2.2)};S.add(s);sparks.push(s)}}
  function jewels(n){joyT=1.1;burst();try{Deco.addJ(n)}catch(e){}try{tone(988,.08,'triangle',.1);setTimeout(()=>tone(1318,.12,'triangle',.1),110)}catch(e){}
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
        const left=thirsty().filter(k=>!D.tr[k]).length;card(`💧 ${B('سقيتَ','سقيتِ')} الشجرة فكبرت وفرحت! 🌳${left?`<br><small>باقي ${arn(left)} ${left==1?'شجرة عطشى':'أشجار عطشى'} (عليها 💧)</small>`:'<br><small>كل الأشجار شربت اليوم 💚</small>'}`,left?[['💧 الشجرة التالية',()=>A.water()],['حسنًا',null,'sec']]:[['الحمد لله',null]]);refresh()})},
    litter(i){const D=day();if(D.lt[i])return;go(litSpot(i),()=>{D.lt[i]=1;dsv();jewels(1);refresh();
      const left=litter().filter(k=>!D.lt[k]).length;card(`🧹 ${B('رفعتَ','رفعتِ')} النفايات ووضعتها في السلّة 🗑️<br><small>${left?`باقي ${arn(left)} في الطرق (عليها 🧹)`:'مدينتك نظيفة جميلة! ✨'}</small>`,[['حسنًا',null,'sec']])})},
    cat(){const D=day();if(D.cat)return;go(door('s'),()=>{busy=1;card(`🥛 ${B('ملأتَ','ملأتِ')} الإناء من السبيل…`);setTimeout(()=>{busy=0;go({x:CAT[0]-.2,z:CAT[1]+1.3,via:null},()=>{D.cat=1;dsv();jewels(3);
      card(`🐱 شربت القطة وقالت: مياو! شكرًا 🤍<br><small>الرحمة بالحيوان من الأخلاق الجميلة</small>`,[['حسنًا',null,'sec']]);refresh()})},1200)})},
    school(){go(door('q'),()=>card(`🏫 مدرسة القرآن: هيّا ${B('احفظ','احفظي')} سورة مع الشيخ عبد الباسط ⭐`,[['⭐ أنا حافظ صغير',()=>closeTo(()=>{const b=document.getElementById('openHifz');b&&b.click()})],['لاحقًا',null,'sec']]))},
    // (v11.8) 🎒 مدرستي: الذهاب للمدرسة مرة في اليوم 💎5، ثم دعوة لدرس حقيقي من الكتاب
    mySchool(){const D=day();go(door('sc'),()=>{
      if(!D.sch){D.sch=1;dsv();enter(()=>{jewels(5);card(`🎒 ${B('وصلتَ','وصلتِ')} إلى ${B('مدرستك','مدرستكِ')}! 💎 +٥<br><small>طلب العلم من أجمل الأعمال، ${B('تعلّم','تعلّمي')} اليوم درسًا جديدًا 📚</small>`,
        [['📚 دروس الكتاب',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['حسنًا',null,'sec']])});return}
      card(`🎒 ${B('ذهبتَ','ذهبتِ')} إلى المدرسة اليوم ✔<br><small>${B('تعال','تعالي')} غدًا ${B('وخذ','وخذي')} 💎٥ مرة أخرى</small>`,[['📚 دروس الكتاب',()=>closeTo(()=>{const b=document.getElementById('wjDurBtn');b&&b.click()})],['حسنًا',null,'sec']])})},
    // (v12.1) 👋 السلام: الطفل يُلقي السلام على جاره، أو يردّ على من سلّم عليه ← «هذا عمل صالح» (💎1، حتى ٥ مرات يوميًا)
    salam(i){const P=life.peds[i];if(!P||!P.visible)return;const u=P.userData.u,greeted=u.greet>0,she=u.kind==='woman';u.hold=25;
      const px=P.position.x,pz=P.position.z,to=u.kind==='shep'?{x:px+1.1,z:pz,via:4.6}:Math.abs(px)<4.5?(px<0?{x:-2.3,z:pz-.9,via:null}:{x:2.3,z:pz-.9,via:null}):Math.abs(Math.abs(pz)-4.8)<1.2?{x:px-sign(px)*.9,z:sign(pz)*4.6,via:sign(pz)*4.6}:{x:px+(px<0?1:-1),z:pz,via:null};
      const who=she?'جارتك':u.kind==='kid'?B('صديقك','صديقتك'):'جارك',rel=()=>{u.hold=Math.min(u.hold,2.5)};
      const RD='وعليكم السلام ورحمة الله وبركاته';
      const reply=()=>{life.endGreet(i);life.say(kid,RD,3.5,2.4);setTimeout(()=>{reward('rd');rel()},700)};
      go(to,()=>{if(greeted){card(`👋 ${she?'قالت':'قال'} لك ${who}: «السلام عليكم»<br><small>بماذا ${B('تردّ','تردّين')}؟</small>`,
          [[RD,reply],['مرحبا 🙂',()=>card(`🤍 الأجمل أن ${B('تردّ','تردّي')} بتحية الإسلام`,[[RD,reply]]),'sec']]);return}
        card(`🙂 هذا ${who}… ${B('سلّم','سلّمي')} ${she?'عليها':'عليه'}`,[['👋 السلام عليكم',()=>{life.say(kid,'السلام عليكم 👋',3,2.4);
          setTimeout(()=>{life.say(P,RD,3.5,u.h);reward('sl');rel()},1300)}],['لاحقًا',rel,'sec']])})},
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
          go({x:-4.3,z:NBZ,via:null},()=>{escort=0;kidSp=4.2;busy=0;D.eld=1;dsv();jewels(3);life.say(E,'جزاك الله خيرًا 🤲',3.5,2.4);
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
    football(){const D=day();if(night||sleeping||!footNow()){card(`⚽ الملعب فارغ الآن… يلعب أطفال الحيّ العصر${wDay()>=5?' وصباح العطلة':''} 🙂`);setTimeout(()=>card(''),2400);return}
      go({x:FB[0]-3.5,z:-18.5,via:null},()=>{const help=()=>{const first=!D.fb;D.fb=1;dsv();if(first)jewels(2);else{joyT=1.1;burst()}
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
    library(){go(door('k'),()=>card(`📚 المكتبة: ${B('اقرأ','اقرئي')} ${B('وِردك','وِردكِ')} اليومي (٥ أسئلة) 📖`,[['📖 وِردي اليومي',()=>closeTo(()=>{const b=document.getElementById('openWird');b&&b.click()})],['لاحقًا',null,'sec']]))}};
  function reward(kind){const D=day();D.sl=D.sl|0;const give=D.sl<5;D.sl++;dsv();if(give)jewels(1);else{joyT=1.1;burst()}
    card(`<b style="color:#1fa463;font-size:19px">🌟 هذا عمل صالح!</b><br>${kind==='rd'?B('رددتَ','رددتِ'):B('ألقيتَ','ألقيتِ')} السلام${give?' 💎 +١':''}<br><small>${kind==='rd'?'ردّ السلام من آداب الإسلام الجميلة 🤍':'إفشاء السلام يزرع المحبة بين الناس 🤍'}</small>`,[['الحمد لله',null]])}
  function enter(f){busy=1;let k=0;const s=setInterval(()=>{k++;kid.scale.setScalar(KS*Math.max(0,1-k/10));if(k>=10){clearInterval(s);
    setTimeout(()=>{kid.scale.setScalar(KS);busy=0;f()},1500)}},40)}
  let drops=[];function splash(G){if(!G)return;for(let i=0;i<14;i++){const d=new T.Mesh(new T.SphereGeometry(.07,6,4),new T.MeshStandardMaterial({color:0x5fb0e6}));
      d.position.set(G.position.x+(Math.random()-.5)*1.4,2.8+Math.random(),G.position.z+(Math.random()-.5)*1.4);S.add(d);drops.push(d)}
    G.userData.grow=1}
  /* ---- زيارة مدن الأصدقاء (v11.2): 💎5 لكل صديق مرة في اليوم، حتى ٣ أصدقاء ---- */
  let V=null,vr=null;const FV_J=5,FV_MAX=3;
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
    visit(r){vr=r;V={lv:Madina.fromCode(r.m||'00000'),f:r.f,u:r.u||'',nick:short(r.nick)};
      at={x:0,z:-15,via:null};kid.position.set(0,0,-15);path=[];refresh();setBar();
      ui.msg.textContent=`🏙️ ${B('أنت','أنتِ')} الآن في مدينة ${V.nick} 🤍`;
      go({x:-2.6,z:1,via:null},()=>{const v=fv();
        const give=!v[r.id]&&Object.keys(v).length<FV_MAX;if(give){v[r.id]=1;dsv();jewels(FV_J)}
        card(`🤝 ${B('زرتَ','زرتِ')} ${V.nick} في ${B('مدينته','مدينته')}${give?` 💎 +${arn(FV_J)}`:''}<br><small>زيارة الصديق والجار وصلة الأرحام من الأخلاق الجميلة 🤍${!give&&v[r.id]?'<br>('+B('أخذتَ','أخذتِ')+' جواهر هذه الزيارة اليوم)':''}</small>`,
          [['🏡 ادخل بيته',()=>A.fhouse()],['🏙️ ارجع لمدينتي',()=>A.back()]])})},
    fhouse(){const r=vr;if(!r)return;closeTo(()=>{if(window.Deco&&Deco.visit)Deco.visit({id:r.id,h:r.h,p:r.p},()=>{show('bayt');Bayt.menu()})})},
    back(){V=null;vr=null;at={x:-3.4,z:1,via:null};kid.position.set(-3.4,0,1);path=[];refresh();setBar();card('');
      ui.msg.textContent=""}});
  const BAR_ME=ui.bar.innerHTML,BAR_V=`<button data-a="back"><b>🏙️</b>مدينتي</button><button data-a="fhouse"><b>🏡</b>ادخل بيته</button><button data-a="friends"><b>👥</b>صديق آخر</button>`;
  function setBar(){ui.bar.innerHTML=V?BAR_V:BAR_ME;ui.bar.style.gridTemplateColumns=V?'repeat(3,1fr)':'';
    ui.bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping&&b.dataset.a!=="back"){sleepCard();return}if(busy||path.length&&!wander)return;if(foc&&b.dataset.a!=='back')cityView();A[b.dataset.a]()});
    const p=prayerNow();if(!V&&p&&!day().pr[p])ui.bar.querySelector('[data-a=mosque]').classList.add('hot');try{if(V&&foc)cityView();hosLbl()}catch(e){}}
  // (v15.3) 🏥 زر المستشفى (يسار الشاشة): الكاميرا تطير وتعرض المستشفى بعرض الشاشة من جهة الشارع، ومرة ثانية «🏙️ مدينتي» ترجع للمدينة كلها
  const hosBtn=ui.hos,HOME={th:cam0.th,ph:cam0.ph,dist:cam0.dist};
  // (v15.4) صار زر «📍 الأماكن»: المستشفى ومدينة الألعاب، كلٌّ يُعرض بعرض الشاشة
  const VIEWS={hp:{P:[HSP[0]-1,1.8,HSP[1]+.6],th:-1.2,ph:.95,w:15},pk:{P:[PKC[0]+.5,2.6,PKC[1]],th:1.2,ph:1,w:18}};
  function viewAt(k){const v=VIEWS[k],hf=Math.atan(Math.tan(22.5*Math.PI/180)*cam.aspect),d=Math.max(24,Math.min(MAXD,v.w/(2*Math.tan(hf))));flyTo({c:v.P,l:v.P,th:v.th,ph:v.ph,dist:d});foc=k;hosLbl()}
  function hosView(){viewAt('hp')}
  function cityView(){if(!foc)return;flyTo({c:C0,l:LK0,th:HOME.th,ph:HOME.ph,dist:HOME.dist});foc=null;hosLbl()}
  function hosLbl(){if(!hosBtn)return;hosBtn.hidden=!!V;hosBtn.innerHTML=foc?'<b>🏙️</b>مدينتي':'<b>📍</b>الأماكن';const sb=ui.snd;hosBtn.style.top=(sb&&sb.offsetHeight?sb.offsetTop+sb.offsetHeight+10:160)+'px'}
  if(hosBtn){hosBtn.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(foc){cityView();return}
    card('📍 إلى أين '+B('تريد','تريدين')+' أن '+B('تذهب','تذهبي')+'؟',[['🏥 المستشفى',()=>viewAt('hp')],['🎡 مدينة الألعاب',()=>{viewAt('pk');A.park()}],['حسنًا',null,'sec']])};hosLbl()}
  setBar();const pn=prayerNow();if(window.City3D)City3D._A=A; // للتجربة فقط
  // (v13.8) تهنئة مرة في اليوم أيام رمضان والعيد
  {const oc=occNow(),D=day();if(oc&&!V&&D.oc!==oc.id&&!sleepNow()){D.oc=oc.id;D.fs=1;dsv();setTimeout(()=>card(`<b>${oc.t}</b><br><small>${oc.msg}</small><br><small>${oc.k==='sad'?'لبست '+B('مدينتك','مدينتكِ')+' السواد في هذه الأيام 🖤':'زُيّنت '+B('مدينتك','مدينتكِ')+' بالأضواء والفوانيس والبالونات ✨'}</small>`,[[oc.k==='sad'?'🤍 حسنًا':'🤍 الحمد لله',null]]),900)}}
  {const f=occNow()&&occNow().k==='sad'?null:festNow(),D=day();if(f&&!V&&!D.fs&&!sleepNow()){D.fs=1;dsv();setTimeout(()=>card(f==='ramadan'?`🌙 رمضان كريم! تقبّل الله صيامكم 🤲<br><small>زُيّنت ${B('مدينتك','مدينتكِ')} بالفوانيس والأضواء ✨</small>`:`🎉 عيد مبارك! كل عام ${B('وأنت','وأنتِ')} بخير 🤍<br><small>زُيّنت ${B('مدينتك','مدينتكِ')} بالبالونات والأضواء 🎈</small>`,[['🤍 آمين',null]]),900)}}
  // اللمس
  const cv=R.domElement,ray=new T.Raycaster();
  function pick(x,y){const r=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),cam);
    for(const h of ray.intersectObjects(S.children,true)){let o=h.object;while(o&&!(o.userData&&(o.userData.p||o.userData.t!=null||o.userData.l!=null||o.userData.cat||o.userData.ped||o.userData.fk||o.userData.act)))o=o.parent;if(o)return o.userData}return null}
  function tap(u){if(!u)return;try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping){sleepCard();return}
    if(u.ped){if(!busy&&(!path.length||wander))A.salam(u.ped-1);return}
    if(u.act){if(V){card('🤍 هذا في مدينة '+V.nick);setTimeout(()=>card(''),1600);return}if(!busy&&(!path.length||wander)){const a=u.act;if(a.indexOf('bn_')===0){try{Bayt.sTap()}catch(e){}if(window.Binaa)Binaa.open(a.slice(3));return}if(a.indexOf('mk_')===0)A.mk(a.slice(3));else if(A[a])A[a]()}return}
    if(u.fk){if(V){card(`🐄 مزرعة ${V.nick} 🤍`);setTimeout(()=>card(''),1800);return}if(!busy&&(!path.length||wander))A.farm(u.fk);return}
    if(V){if(u.p==='home')card(`🏡 بيت ${V.nick}`,[['🏡 ادخل بيته',()=>A.fhouse()],['حسنًا',null,'sec']]);
      else if(u.p&&Madina.PARTS[u.p])card(`${Madina.PARTS[u.p].e} ${Madina.PARTS[u.p].n} في مدينة ${V.nick} 🤍`);return}
    if(u.t!=null){if(!busy&&(!path.length||wander))A.tree(u.t);return}
    if(u.l!=null){if(!busy&&(!path.length||wander))A.litter(u.l);return}
    if(u.cat){if(!busy&&(!path.length||wander))A.cat();return}
    if(u.p==='sc'){if(!busy&&(!path.length||wander))A.mySchool();return}
    if(u.p==='home'){card(`🏡 هذا ${B('بيتك','بيتكِ')} في الجنة · ${B('ابنِ','ابني')} طوابقه بالأعمال الصالحة 🤍`,[['🎨 '+B('زيّن','زيّني')+' بيتك '+B('وادخله','وادخليه'),()=>closeTo(()=>oldHouse('deco'))],['حسنًا',null,'sec']]);return}
    window.Madina&&Madina.part&&Madina.part(u.p)}
  cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);try{cv.setPointerCapture(e.pointerId)}catch(x){}
    if(pts.size===1){drag=[e.clientX,e.clientY];down=[e.clientX,e.clientY,Date.now()]}else{drag=null;pinch=0;down=null}});
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1&&drag||pts.size===2)goal=null;
    if(pts.size===1&&drag){th-=(e.clientX-drag[0])*.008;ph=Math.max(.25,Math.min(1.38,ph-(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY]}
    else if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;if(pinch)dist=Math.max(10,Math.min(MAXD,dist*pinch/d));pinch=d;
      // (v15.5) بإصبعين: تقريب/تبعيد، وسحب الإصبعين يحرّك المدينة (يمين/يسار/أمام/خلف) حتى يصل الطفل لأيّ مكان
      if(mid){const k=dist*.0017,dx=(mx-mid[0])*k,dy=(my-mid[1])*k,rx=Math.cos(th),rz=-Math.sin(th),fx=-Math.sin(th),fz=-Math.cos(th);
        const ox=-dx*rx+dy*fx,oz=-dx*rz+dy*fz;CC[0]+=ox;CC[2]+=oz;LK[0]+=ox;LK[2]+=oz;if(!foc&&Math.hypot(ox,oz)>.01){foc='pan';try{hosLbl()}catch(e){}}const r=Math.hypot(CC[0],CC[2]);if(r>70){const q=70/r;const px=CC[0]*q-CC[0],pz=CC[2]*q-CC[2];CC[0]+=px;CC[2]+=pz;LK[0]+=px;LK[2]+=pz}}
      mid=[mx,my]}});
  const up=e=>{const was=pts.has(e.pointerId)&&pts.size===1;pts.delete(e.pointerId);pinch=0;mid=null;drag=pts.size===1?[...pts.values()][0]:null;
    if(was&&down&&e.type==='pointerup'&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<10&&Date.now()-down[2]<600)tap(pick(e.clientX,e.clientY));down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();goal=null;dist=Math.max(10,Math.min(MAXD,dist*(e.deltaY>0?1.1:.9)))},{passive:false});
  const rs=()=>{const w=innerWidth,h=innerHeight;cam.aspect=w/h;cam.updateProjectionMatrix();R.setSize(w,h)};addEventListener('resize',rs);
  // الحلقة
  let alive=true,idle=0,t=0,last=performance.now();(function loop(now){if(!alive)return;const dt=Math.min(.05,((now||performance.now())-last)/1000);last=now||performance.now();t+=dt*3;
    if(!pts.size&&!document.querySelector('#modal.on')&&++idle>240)th+=.002;else idle=0;
    (S.userData.marks||[]).forEach((m,i)=>m.position.y=m.userData.y+Math.sin(t+i)*.18);
    const L=kid.userData;
    if(path.length&&lookT>0){// 🚸 يقف عند حافة الرصيف وينظر يمينًا ويسارًا قبل العبور
      lookT-=dt;const [nx,nz]=path[0];kid.rotation.y=Math.atan2(nx-kid.position.x,nz-kid.position.z)+Math.sin((1.6-lookT)*4)*1.1;
      L.legs.forEach(l=>l.rotation.x*=.7);L.arms.forEach(a=>a.rotation.x*=.7);kid.position.y=0;still=0}
    else if(path.length){const [tx,tz,lk]=path[0],dx=tx-kid.position.x,dz=tz-kid.position.z,d=Math.hypot(dx,dz),sp=kidSp*dt;
      if(d<=sp){kid.position.x=tx;kid.position.z=tz;path.shift();if(lk&&path.length)lookT=1.6;if(!path.length&&onArrive){const f=onArrive;onArrive=null;setTimeout(f,150)}}
      else{kid.position.x+=dx/d*sp;kid.position.z+=dz/d*sp;kid.rotation.y=Math.atan2(dx,dz)}
      const sw=Math.sin(t*4)*.6;L.legs[0].rotation.x=sw;L.legs[1].rotation.x=-sw;L.arms[0].rotation.x=-sw;L.arms[1].rotation.x=sw;kid.position.y=Math.abs(Math.sin(t*4))*.06}
    else{L.legs.forEach(l=>l.rotation.x*=.8);L.arms.forEach(a=>a.rotation.x*=.8);still+=dt;waveT+=dt;
      // يلتفت نحوك ليظهر وجهه
      const ta=Math.atan2(cam.position.x-kid.position.x,cam.position.z-kid.position.z);let da=ta-kid.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));kid.rotation.y+=da*Math.min(1,dt*4);
      if(joyT>0){joyT-=dt;const k=1.1-joyT;kid.position.y=Math.abs(Math.sin(k*Math.PI*2.7))*.45;L.arms[0].rotation.z=-2.6;L.arms[1].rotation.z=2.6}
      else{kid.position.y=0;const w=waveT%6;L.arms[0].rotation.z*=.85;L.arms[1].rotation.z=w<1.4?2.5+Math.sin(w*12)*.35:L.arms[1].rotation.z*.85}
      // يتجوّل وحده إذا تُرك قليلًا
      if(still>8&&!busy&&!sleeping&&!ui.card.classList.contains('on')&&!document.querySelector('#modal.on')){still=0;go(WP[Math.floor(Math.random()*WP.length)],null,true)}}
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
    (S.userData.anim||[]).forEach(f=>f(t,dt));
    if(performance.now()-prAt>2000){prAt=performance.now();prC=prayerNow();const sl=sleepNow();if(sl&&!sleeping&&!V)startSleep(t<1);else if(!sl&&sleeping)wake()
      // (v13.8) إذا بدأ المطر أو توقّف أو ظهر قوس قزح أو بدأت المناسبة: يُعاد رسم المشهد، وتتلوّن السماء حسب الوقت
      {const bk=window.Binaa?Binaa.code()+'|'+(Binaa.job?Binaa.job.p+(Binaa.job.ready?'r':''):''):'';if(!V&&bk!==bKey){bKey=bk;refresh()}}wxFetch();showWx();const wk=rainNow()+'|'+rainbowNow()+'|'+festNow()+'|'+(occNow()||{}).id+'|'+winter()+'|'+cloudLv();wRain=rainNow();if(wk!==wKey){wKey=wk;refresh()}applySky();kidUmb.visible=wRain&&!night}
    if(zz.visible){zz.position.y=zz.userData.y+Math.sin(t*.8)*.25;zz.material.opacity=.75+Math.sin(t*1.3)*.25}
    life.update(t,dt,{v:!!V,pkDone:!!day().pk,hosp:V?0:hpLv(),prayer:sleeping?null:prC,mosque:V?(V.lv.m|0):(window.Madina?Madina.st.lv.m|0:0),kid:kid.position,kidOn:kid.visible,kidWait:lookT>0,sleep:sleeping,rain:wRain&&!night,bagsDone:!!(day().br&&day().br.b)});sounds&&sounds.tick(dt);
    sparks=sparks.filter(s=>{s.userData.k+=dt;const k=s.userData.k;s.position.addScaledVector(s.userData.v,dt);s.rotation.y+=dt*6;s.material.opacity=Math.max(0,1-k/1.3);
      if(k>1.3){S.remove(s);s.geometry.dispose();s.material.dispose();return false}return true});
    drops=drops.filter(d=>{d.position.y-=dt*4;if(d.position.y<.1){S.remove(d);d.geometry.dispose();d.material.dispose();return false}return true});
    (S.userData.trees||[]).forEach(G=>{if(G&&G.userData.grow){G.userData.grow+=dt;const k=G.userData.grow-1;G.scale.setScalar(k<.6?1+Math.sin(k/.6*Math.PI)*.25:1.08);if(k>.6)G.userData.grow=0}});
    stepFly(dt);place();R.render(S,cam);requestAnimationFrame(loop)})();
  // عند وقت الأذان: الشخصية تذهب للجامع وحدها
  if(pn&&!day().pr[pn]&&window.Madina&&Madina.st.lv.m)setTimeout(()=>{if(alive&&!V&&!path.length&&!busy&&!sleeping){card(`🕌 الله أكبر! حان وقت صلاة ${PNAME[pn]}… هيّا إلى الجامع`);setTimeout(()=>A.mosque(),1200)}},1500);
  function refresh(){const old=S;old.remove(kid);old.remove(life.g);S=makeScene(night,V);S.add(kid);S.add(life.g);applySky();
    // الأشجار التي تكبر الآن تبقى بحجمها
    old.userData.trees.forEach((G,i)=>{if(G&&S.userData.trees[i])S.userData.trees[i].scale.copy(G.scale)});
    drops.concat(sparks).forEach(d=>{old.remove(d);S.add(d)});dispose(old);showJ()}
  return {refresh,stop(){alive=false;try{sounds.stop()}catch(e){}Object.assign(cam0,foc?HOME:{th,ph,dist});removeEventListener('resize',rs);dispose(S);R.dispose();R.forceContextLoss&&R.forceContextLoss()}}}

function dispose(S){S.traverse(o=>{o.geometry&&o.geometry.dispose();const m=o.material;if(m){(Array.isArray(m)?m:[m]).forEach(x=>{x.map&&x.map.dispose();x.dispose()})}})}

async function open(){if(document.getElementById('m3d'))return;const ov=document.createElement('div');ov.id='m3d';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#aee3ff;overflow:hidden';
  ov.innerHTML=`<button class="m3x" aria-label="إغلاق" style="position:absolute;top:12px;left:12px;z-index:2;width:46px;height:46px;border-radius:50%;border:0;background:#fff;font-size:22px;box-shadow:0 2px 8px #0004">✖</button>
    <div class="m3hp"></div>
    <div class="m3msg" style="position:absolute;top:74px;right:12px;left:104px;z-index:2;background:#fffd;border-radius:14px;padding:6px 10px;font-weight:800;text-align:center;font-size:13px">⏳ لحظة…</div>
    <div class="m3j"></div><button class="m3wx" hidden aria-label="الطقس"></button><button class="m3snd" aria-label="الصوت"></button><button class="m3hos" hidden aria-label="الأماكن"></button><div class="m3card"></div>
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
window.City3D={open,refresh,oldHouse};
})();
