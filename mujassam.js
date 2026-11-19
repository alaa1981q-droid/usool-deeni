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
#m3d .m3bar{position:absolute;left:8px;right:8px;bottom:max(10px,env(safe-area-inset-bottom));z-index:2;display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
#m3d .m3bar button{border:0;border-radius:16px;padding:7px 2px 6px;font:inherit;font-weight:800;font-size:12px;line-height:1.2;background:#fff;color:#1d4e9e;box-shadow:0 4px 0 #9fb7d8}
#m3d .m3bar button b{display:block;font-size:24px}#m3d .m3bar button:active{transform:translateY(3px);box-shadow:0 1px 0 #9fb7d8}
#m3d .m3bar button.hot{background:linear-gradient(135deg,#ffe48a,#ffc53a);color:#6a4300;box-shadow:0 4px 0 #c98a12;animation:m3hot 1s ease-in-out infinite alternate}
@keyframes m3hot{to{transform:scale(1.06)}}
#m3d .m3card{position:absolute;left:12px;right:12px;bottom:calc(max(10px,env(safe-area-inset-bottom)) + 84px);z-index:2;background:#fffffff2;border-radius:18px;padding:10px 12px;text-align:center;font-weight:800;font-size:15px;box-shadow:0 4px 14px #0003;display:none}
#m3d .m3card.on{display:block;animation:m3in .3s ease}@keyframes m3in{from{transform:translateY(20px);opacity:0}}
#m3d .m3card .row{display:flex;gap:8px;justify-content:center;margin-top:8px}#m3d .m3card .row button{border:0;border-radius:14px;padding:8px 14px;font:inherit;font-weight:800;background:#1fa463;color:#fff}
#m3d .m3card .row button.sec{background:#e3ecf7;color:#1d4e9e}
#m3d .m3j{position:absolute;top:66px;left:12px;z-index:2;background:#fffd;border-radius:14px;padding:4px 10px;font-weight:900;color:#1d4e9e}
#m3d .m3fly{position:absolute;z-index:3;left:50%;top:45%;transform:translateX(-50%);font-size:30px;font-weight:900;color:#1d7ad0;text-shadow:0 2px 0 #fff;pointer-events:none;animation:m3fly 1.4s ease forwards}
@keyframes m3fly{to{transform:translate(-50%,-90px);opacity:0}}`;
document.head.appendChild(css);
const cam0={th:.35,ph:.8,dist:0};let cur=null;
const boy=()=>!window.Cups||Cups.sex!='g',B=(m,f)=>boy()?m:f;
const arn=n=>typeof ar=='function'?ar(n):n;

/* ---------- الحالة اليومية ---------- */
const DKEY='usul5_m3d_v1',today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
let ds={};try{ds=JSON.parse(localStorage.getItem(DKEY)||'{}')||{}}catch(e){}
function day(){if(ds.d!==today())ds={d:today(),pr:{},tr:{},lt:{},cat:0};return ds}
const dsv=()=>{try{localStorage.setItem(DKEY,JSON.stringify(ds))}catch(e){}};
const seed=()=>{let h=0;for(const c of today())h=(h*31+c.charCodeAt(0))>>>0;return h};
const TREES=[[-12,-3],[-12,4],[12,-3],[12,4],[-2.8,-14],[2.8,14],[-13,12],[13,-12],[-13,-12],[13,12],[-16,0],[16,0]];
const LITTER=[[-9,4.6],[9,-4.6],[-10,-4.6],[10,4.6],[.9,-15],[-.9,15]];
const thirsty=()=>{const s=seed(),r=[];for(let i=0;i<5;i++)r.push((s+i*7)%TREES.length);return r};
const litter=()=>{const s=seed(),r=[];for(let i=0;i<3;i++)r.push((s+i*5)%LITTER.length);return r};
const PNAME={fajr:'الفجر',dhuhr:'الظهر',maghrib:'المغرب'};
function prayerNow(){try{const t=Adhan.times(new Date()),n=Date.now();for(const p of ['fajr','dhuhr','maghrib']){const a=+t[p];if(n>=a&&n<a+90*60e3)return p}}catch(e){}return null}
function nextPrayer(){try{return Adhan.next()}catch(e){return null}}
const hm=d=>{let h=d.getHours(),m=d.getMinutes();return arn(h)+':'+arn(String(m).padStart(2,'0'))};

/* ---------- لافتات ---------- */
function textSprite(T,t,bg,fg){const c=document.createElement('canvas');c.width=512;c.height=112;const x=c.getContext('2d');
  x.fillStyle=bg;x.strokeStyle='#d8c58a';x.lineWidth=6;const r=50;x.beginPath();x.moveTo(r+4,4);x.lineTo(508-r,4);x.arc(508-r,56,r-2,-Math.PI/2,Math.PI/2);x.lineTo(r+4,108);x.arc(r+4,56,r-2,Math.PI/2,Math.PI*1.5);x.closePath();x.fill();x.stroke();
  x.fillStyle=fg;x.font='800 50px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';try{x.direction='rtl'}catch(e){}x.fillText(t,256,60);
  const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(4.4,.96,1);s.renderOrder=10;return s}
function markSprite(T,e,col,sc){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  x.fillStyle=col;x.strokeStyle='#fff';x.lineWidth=9;x.beginPath();x.arc(64,64,54,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='#fff';x.font='900 64px system-ui,"Segoe UI",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,64,70);
  const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.scale.set(sc||1.2,sc||1.2,1);s.renderOrder=11;return s}

/* ---------- المشهد ---------- */
const SPOT={home:[-6,0],m:[6,0],k:[-6,9],q:[6,9],h:[-6,-9],s:[6,-9]};
const CAT=[3.4,-10.6];
function makeScene(night,V){const T=THREE,S=new T.Scene(),D=day();
  const Md=window.Madina,lv=V?V.lv:(Md?Md.st.lv:{}),job=V?null:(Md?Md.st.job:null),need=(p,l)=>Md&&Md.need?Md.need(p,l):'';
  const LV=p=>Math.max(0,Math.min(3,lv[p]|0));
  const floors=Math.max(1,Math.min(4,(V?V.f:(window.Bayt&&Bayt.done))|0||1));
  S.background=new T.Color(night?0x0b1636:0xaee3ff);S.fog=new T.Fog(S.background,75,150);
  S.add(new T.HemisphereLight(night?0x8090cc:0xffffff,night?0x223322:0x88aa66,night?.62:.75));
  const sun=new T.DirectionalLight(night?0xaabbff:0xfff2d6,night?.45:.9);sun.position.set(14,24,12);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});S.add(sun);
  const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o||{}));
  const add=(geo,mat,x,y,z,p)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(p||S).add(m);return m};
  const box=(w,h,d,mat,x,y,z,p)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z,p);
  const prism=(w,h,d,mat,x,y,z,p)=>{const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,h);sh.lineTo(-w/2,0);
    const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return add(g,mat,x,y,z,p)};
  const winM=M(night?0xffd86b:0x9fd8ff,night?{emissive:0xffc940,emissiveIntensity:.9}:{roughness:.3});
  const wood=M(0x8b5a2b),stone=M(0xf4efe4),green=M(0x2fa36b),tr=M(0x7a4b25),lf=M(night?0x2c7a3c:0x3fae55);
  const water=M(0x5fb0e6,{roughness:.15,metalness:.1,emissive:night?0x1d4e7e:0x000000});
  const tree=(x,z,p,s=1)=>{add(new T.CylinderGeometry(.18*s,.22*s,1.2*s,8),tr,x,.6*s,z,p);add(new T.SphereGeometry(.9*s,12,10),lf,x,1.8*s,z,p)};
  const palm=(x,z,p)=>{add(new T.CylinderGeometry(.1,.16,2.4,8),tr,x,1.2,z,p);const c=add(new T.SphereGeometry(.9,10,8),lf,x,2.5,z,p);c.scale.set(1,.35,1)};
  // الأرض والطرق
  const g=add(new T.CircleGeometry(32,48),M(night?0x2e5a2e:0x7ccf6a),0,0,0);g.rotation.x=-Math.PI/2;
  const road=M(0x8a8f96),line=M(0xffffff);
  const rd=add(new T.PlaneGeometry(4,64),road,0,.01,0);rd.rotation.x=-Math.PI/2;
  [-4.6,4.6].forEach(z=>{const r=add(new T.PlaneGeometry(28,1.8),road,0,.012,z);r.rotation.x=-Math.PI/2});
  for(let z=-28;z<=28;z+=3){const l=add(new T.PlaneGeometry(.15,1.4),line,0,.02,z);l.rotation.x=-Math.PI/2}
  // مصابيح الشوارع: بالليل تضيء وتنير الطريق حولها
  const pole=M(0x4a4f5a),bulb=M(night?0xfff1b0:0xf1efe6,night?{emissive:0xffd860,emissiveIntensity:1.6}:{});
  const pool=new T.MeshBasicMaterial({color:0xffd870,transparent:true,opacity:.28,depthWrite:false});
  const LAMPS=[[-2.5,-13],[2.5,-13],[-2.5,-7.5],[2.5,-7.5],[-2.5,-1.8],[2.5,-1.8],[-2.5,7.5],[2.5,7.5],[-2.5,13],[2.5,13],[-10,5.8],[10,5.8],[-10,-5.8],[10,-5.8]];
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
  function home(G){const fh=1.6,hw=4,hd=3.4,wallC=[0xfff1d6,0xffe2b8,0xf7d4a8,0xeccaa0];
    for(let i=0;i<floors;i++){box(hw,fh,hd,M(wallC[i]),0,fh/2+i*fh,0,G);
      for(let k=-1;k<=1;k+=2){box(.7,.6,.06,winM,k*1.1,fh/2+i*fh+.1,hd/2+.03,G);box(.06,.6,.7,winM,hw/2+.03,fh/2+i*fh+.1,k*.9,G)}}
    box(.8,1.1,.06,wood,0,.55,hd/2+.04,G);
    const roof=add(new T.ConeGeometry(3.3,1.8,4),M(0xd2553b),0,floors*fh+.9,0,G);roof.rotation.y=Math.PI/4;
    tree(-2.8,-1.4,G,.8);palm(-2.8,1.4,G);return floors*fh+2}
  const P=Md&&Md.PARTS||{};
  Object.keys(SPOT).forEach(p=>{const G=new T.Group();G.position.set(SPOT[p][0],0,SPOT[p][1]);G.userData.p=p;S.add(G);let top,lb;
    if(p==='home'){top=home(G);lb=textSprite(T,V?'🏡 بيت '+V.nick:'🏡 بيتي','rgba(255,255,255,.92)','#5a4a1a')}
    else{const l=LV(p);let mk=null;
      if(job&&job.p===p){if(job.ready){top=DRAW[p](G,job.to);mk=['✔','#1fa463']}else{top=scaffold(G);mk=['👷','#2f6fd0']}}
      else if(l>0){top=DRAW[p](G,l);if(l<3&&!job&&!need(p,l))mk=['⬆','#f0a020']}
      else{top=plot(G);mk=need(p,0)?['🔒','#9aa8b0']:['+','#f0a020']}
      const pr=P[p]||{};lb=textSprite(T,`${pr.e||''} ${pr.n||''}`,'rgba(255,255,255,.92)','#5a4a1a');
      if(mk&&!V)mark(G,mk[0],mk[1],top+.4,1.9)}
    lb.position.set(0,top+.7,0);G.add(lb)});
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
  add(new T.SphereGeometry(.22,16,12),skin,0,1.18,0);
  [-.08,.08].forEach(x=>add(new T.SphereGeometry(.03,6,4),dk,x,1.21,.2));
  const sm=add(new T.TorusGeometry(.06,.012,4,10,Math.PI),M(0xc0443a),0,1.12,.2);sm.rotation.z=Math.PI;
  if(girl){const h=add(new T.SphereGeometry(.26,16,12,0,Math.PI*2,0,Math.PI*.62),M(0xffffff),0,1.18,-.03);h.rotation.x=-.35;
    add(new T.ConeGeometry(.3,.35,16,1,true),M(0xffffff),0,.98,-.02)}
  else add(new T.SphereGeometry(.2,14,8,0,Math.PI*2,0,Math.PI/2),M(0xffffff),0,1.27,-.02);
  G.scale.setScalar(1.6);G.userData={legs,arms};return G}

/* ---------- التشغيل ---------- */
function run(ov,ui){const T=THREE,night=document.body.classList.contains('night');
  const W=innerWidth,H=innerHeight;
  const R=new T.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.setSize(W,H);
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  ov.insertBefore(R.domElement,ov.firstChild);R.domElement.style.display='block';R.domElement.style.touchAction='none';
  const cam=new T.PerspectiveCamera(45,W/H,.1,250);let S=makeScene(night);
  if(!cam0.dist)cam0.dist=Math.min(70,Math.max(30,29/(W/H)));
  let {th,ph,dist}=cam0,drag=null,pinch=0,down=null;const pts=new Map(),MAXD=80;
  const place=()=>{cam.position.set(dist*Math.sin(th)*Math.sin(ph),dist*Math.cos(ph),dist*Math.cos(th)*Math.sin(ph));cam.lookAt(0,1.5,0)};
  // الشخصية: تبدأ عند باب البيت
  const kid=makeKid();S.add(kid);let at={x:-3.4,z:1,via:null},path=[],onArrive=null,busy=0;kid.position.set(at.x,0,at.z);kid.rotation.y=Math.PI/2;
  const sign=v=>v<0?-1:1;
  const door=p=>{const [x,z]=SPOT[p];return {x:x-sign(x)*3.4,z:z+1,via:null}};
  const treeSpot=i=>{const [x,z]=TREES[i];return Math.abs(x)<4?{x:x-sign(x)*1.1,z,via:null}:{x:x-sign(x)*1.2,z,via:sign(z)*4.6}};
  const litSpot=i=>{const [x,z]=LITTER[i];return {x,z,via:Math.abs(x)<4?null:z}};
  function go(to,done){if(busy)return;const p=[];
    if(at.via!=null)p.push([at.x,at.via]);p.push([0,at.via!=null?at.via:at.z]);
    p.push([0,to.via!=null?to.via:to.z]);if(to.via!=null)p.push([to.x,to.via]);p.push([to.x,to.z]);
    path=p;at=to;onArrive=done;card('')}
  function card(html,btns){const c=ui.card;if(!html){c.classList.remove('on');return}c.innerHTML=html+(btns?`<div class="row">${btns.map((b,i)=>`<button data-i="${i}" class="${b[2]||''}">${b[0]}</button>`).join('')}</div>`:'');
    c.classList.add('on');c.querySelectorAll('button').forEach(b=>b.onclick=()=>{const f=btns[+b.dataset.i][1];card('');f&&f()})}
  function jewels(n){try{Deco.addJ(n)}catch(e){}try{tone(988,.08,'triangle',.1);setTimeout(()=>tone(1318,.12,'triangle',.1),110)}catch(e){}
    const f=document.createElement('div');f.className='m3fly';f.textContent='💎 +'+arn(n);ov.appendChild(f);setTimeout(()=>f.remove(),1500);showJ()}
  const showJ=()=>{ui.j.textContent='💎 '+arn(window.Deco?Deco.j:0)};showJ();
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
    library(){go(door('k'),()=>card(`📚 المكتبة: ${B('اقرأ','اقرئي')} ${B('وِردك','وِردكِ')} اليومي (٥ أسئلة) 📖`,[['📖 وِردي اليومي',()=>closeTo(()=>{const b=document.getElementById('openWird');b&&b.click()})],['لاحقًا',null,'sec']]))}};
  function enter(f){busy=1;let k=0;const s=setInterval(()=>{k++;kid.scale.setScalar(1.6*Math.max(0,1-k/10));if(k>=10){clearInterval(s);
    setTimeout(()=>{kid.scale.setScalar(1.6);busy=0;f()},1500)}},40)}
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
    visit(r){vr=r;V={lv:Madina.fromCode(r.m||'00000'),f:r.f,nick:short(r.nick)};
      at={x:0,z:-15,via:null};kid.position.set(0,0,-15);path=[];refresh();setBar();
      ui.msg.textContent=`🏙️ ${B('أنت','أنتِ')} الآن في مدينة ${V.nick} 🤍`;
      go({x:-2.6,z:1,via:null},()=>{const v=fv();
        const give=!v[r.id]&&Object.keys(v).length<FV_MAX;if(give){v[r.id]=1;dsv();jewels(FV_J)}
        card(`🤝 ${B('زرتَ','زرتِ')} ${V.nick} في ${B('مدينته','مدينته')}${give?` 💎 +${arn(FV_J)}`:''}<br><small>زيارة الصديق والجار وصلة الأرحام من الأخلاق الجميلة 🤍${!give&&v[r.id]?'<br>('+B('أخذتَ','أخذتِ')+' جواهر هذه الزيارة اليوم)':''}</small>`,
          [['🏡 ادخل بيته',()=>A.fhouse()],['🏙️ ارجع لمدينتي',()=>A.back()]])})},
    fhouse(){const r=vr;if(!r)return;closeTo(()=>{if(window.Deco&&Deco.visit)Deco.visit({id:r.id,h:r.h,p:r.p},()=>{show('bayt');Bayt.menu()})})},
    back(){V=null;vr=null;at={x:-3.4,z:1,via:null};kid.position.set(-3.4,0,1);path=[];refresh();setBar();card('');
      ui.msg.textContent=`👆 ${B('المس','المسي')} البناية لتطوّرها، والشجرة 💧 والنفايات 🧹 لتساعد مدينتك`}});
  const BAR_ME=ui.bar.innerHTML,BAR_V=`<button data-a="back"><b>🏙️</b>مدينتي</button><button data-a="fhouse"><b>🏡</b>ادخل بيته</button><button data-a="friends"><b>👥</b>صديق آخر</button>`;
  function setBar(){ui.bar.innerHTML=V?BAR_V:BAR_ME;ui.bar.style.gridTemplateColumns=V?'repeat(3,1fr)':'';
    ui.bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(busy||path.length)return;A[b.dataset.a]()});
    const p=prayerNow();if(!V&&p&&!day().pr[p])ui.bar.querySelector('[data-a=mosque]').classList.add('hot')}
  setBar();const pn=prayerNow();
  // اللمس
  const cv=R.domElement,ray=new T.Raycaster();
  function pick(x,y){const r=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),cam);
    for(const h of ray.intersectObjects(S.children,true)){let o=h.object;while(o&&!(o.userData&&(o.userData.p||o.userData.t!=null||o.userData.l!=null||o.userData.cat)))o=o.parent;if(o)return o.userData}return null}
  function tap(u){if(!u)return;try{window.Bayt&&Bayt.sTap()}catch(e){}
    if(V){if(u.p==='home')card(`🏡 بيت ${V.nick}`,[['🏡 ادخل بيته',()=>A.fhouse()],['حسنًا',null,'sec']]);
      else if(u.p&&Madina.PARTS[u.p])card(`${Madina.PARTS[u.p].e} ${Madina.PARTS[u.p].n} في مدينة ${V.nick} 🤍`);return}
    if(u.t!=null){if(!busy&&!path.length)A.tree(u.t);return}
    if(u.l!=null){if(!busy&&!path.length)A.litter(u.l);return}
    if(u.cat){if(!busy&&!path.length)A.cat();return}
    if(u.p==='home'){card(`🏡 هذا ${B('بيتك','بيتكِ')} في الجنة · ${B('ابنِ','ابني')} طوابقه بالأعمال الصالحة 🤍`,[['🏡 '+B('ادخل','ادخلي')+' بيتي',()=>ui.close()],['حسنًا',null,'sec']]);return}
    window.Madina&&Madina.part&&Madina.part(u.p)}
  cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);
    if(pts.size===1){drag=[e.clientX,e.clientY];down=[e.clientX,e.clientY,Date.now()]}else{drag=null;pinch=0;down=null}});
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1&&drag){th-=(e.clientX-drag[0])*.008;ph=Math.max(.25,Math.min(1.45,ph-(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY]}
    else if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)dist=Math.max(10,Math.min(MAXD,dist*pinch/d));pinch=d}});
  const up=e=>{const was=pts.has(e.pointerId)&&pts.size===1;pts.delete(e.pointerId);pinch=0;drag=pts.size===1?[...pts.values()][0]:null;
    if(was&&down&&e.type==='pointerup'&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<10&&Date.now()-down[2]<600)tap(pick(e.clientX,e.clientY));down=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(10,Math.min(MAXD,dist*(e.deltaY>0?1.1:.9)))},{passive:false});
  const rs=()=>{const w=innerWidth,h=innerHeight;cam.aspect=w/h;cam.updateProjectionMatrix();R.setSize(w,h)};addEventListener('resize',rs);
  // الحلقة
  let alive=true,idle=0,t=0,last=performance.now();(function loop(now){if(!alive)return;const dt=Math.min(.05,((now||performance.now())-last)/1000);last=now||performance.now();t+=dt*3;
    if(!pts.size&&!document.querySelector('#modal.on')&&++idle>240)th+=.002;else idle=0;
    (S.userData.marks||[]).forEach((m,i)=>m.position.y=m.userData.y+Math.sin(t+i)*.18);
    const L=kid.userData;
    if(path.length){const [tx,tz]=path[0],dx=tx-kid.position.x,dz=tz-kid.position.z,d=Math.hypot(dx,dz),sp=4.2*dt;
      if(d<=sp){kid.position.x=tx;kid.position.z=tz;path.shift();if(!path.length&&onArrive){const f=onArrive;onArrive=null;setTimeout(f,150)}}
      else{kid.position.x+=dx/d*sp;kid.position.z+=dz/d*sp;kid.rotation.y=Math.atan2(dx,dz)}
      const sw=Math.sin(t*4)*.6;L.legs[0].rotation.x=sw;L.legs[1].rotation.x=-sw;L.arms[0].rotation.x=-sw;L.arms[1].rotation.x=sw;kid.position.y=Math.abs(Math.sin(t*4))*.06}
    else{L.legs.forEach(l=>l.rotation.x*=.8);L.arms.forEach(a=>a.rotation.x*=.8);kid.position.y=0}
    drops=drops.filter(d=>{d.position.y-=dt*4;if(d.position.y<.1){S.remove(d);d.geometry.dispose();d.material.dispose();return false}return true});
    (S.userData.trees||[]).forEach(G=>{if(G&&G.userData.grow){G.userData.grow+=dt;const k=G.userData.grow-1;G.scale.setScalar(k<.6?1+Math.sin(k/.6*Math.PI)*.25:1.08);if(k>.6)G.userData.grow=0}});
    place();R.render(S,cam);requestAnimationFrame(loop)})();
  // عند وقت الأذان: الشخصية تذهب للجامع وحدها
  if(pn&&!day().pr[pn]&&window.Madina&&Madina.st.lv.m)setTimeout(()=>{if(alive&&!V&&!path.length&&!busy){card(`🕌 الله أكبر! حان وقت صلاة ${PNAME[pn]}… هيّا إلى الجامع`);setTimeout(()=>A.mosque(),1200)}},1500);
  function refresh(){const old=S;old.remove(kid);S=makeScene(night,V);S.add(kid);
    // الأشجار التي تكبر الآن تبقى بحجمها
    old.userData.trees.forEach((G,i)=>{if(G&&S.userData.trees[i])S.userData.trees[i].scale.copy(G.scale)});
    drops.forEach(d=>{old.remove(d);S.add(d)});dispose(old);showJ()}
  return {refresh,stop(){alive=false;Object.assign(cam0,{th,ph,dist});removeEventListener('resize',rs);dispose(S);R.dispose();R.forceContextLoss&&R.forceContextLoss()}}}

function dispose(S){S.traverse(o=>{o.geometry&&o.geometry.dispose();const m=o.material;if(m){(Array.isArray(m)?m:[m]).forEach(x=>{x.map&&x.map.dispose();x.dispose()})}})}

async function open(){if(document.getElementById('m3d'))return;const ov=document.createElement('div');ov.id='m3d';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#aee3ff;overflow:hidden';
  ov.innerHTML=`<button class="m3x" aria-label="إغلاق" style="position:absolute;top:12px;left:12px;z-index:2;width:46px;height:46px;border-radius:50%;border:0;background:#fff;font-size:22px;box-shadow:0 2px 8px #0004">✖</button>
    <div class="m3msg" style="position:absolute;top:14px;right:14px;left:70px;z-index:2;background:#fffd;border-radius:14px;padding:8px 12px;font-weight:800;text-align:center;font-size:14px">⏳ لحظة…</div>
    <div class="m3j"></div><div class="m3card"></div>
    <div class="m3bar" style="display:none"><button data-a="mosque"><b>🕌</b>إلى الجامع</button><button data-a="water"><b>💧</b>اسقِ الشجر</button><button data-a="school"><b>🏫</b>احفظ القرآن</button><button data-a="library"><b>📚</b>المكتبة</button><button data-a="friends"><b>👥</b>زيارة صديق</button></div>`;
  document.body.appendChild(ov);document.body.classList.add('m3on');const msg=ov.querySelector('.m3msg');
  const close=()=>{try{cur&&cur.stop()}catch(e){}cur=null;ov.remove();document.body.classList.remove('m3on')};
  ov.querySelector('.m3x').onclick=close;
  const fail=()=>{msg.innerHTML='😔 هذا الجهاز لا يعرض المجسّمات.<br><small>لا تقلق، مدينتك محفوظة وتراها بالرسم العادي.</small>'};
  if(!webgl())return fail();
  try{await loadThree();if(!ov.isConnected)return;
    msg.textContent=`👆 ${B('المس','المسي')} البناية لتطوّرها، والشجرة 💧 والنفايات 🧹 لتساعد مدينتك`;
    ov.querySelector('.m3bar').style.display='';
    cur=run(ov,{msg,card:ov.querySelector('.m3card'),bar:ov.querySelector('.m3bar'),j:ov.querySelector('.m3j'),close})}catch(e){console.error(e);fail()}}
// (v11.2) طلب الشيخ: أول ما يدخل الطفل «بيتي في الجنة» تفتح المدينة المجسّمة مباشرة، و✖ يرجعه لصفحة البيت.
// لا تفتح إذا ذهب الزر لشاشة أخرى (مثل بيوت الأصدقاء) أو كان الجهاز لا يعرض المجسّمات.
document.addEventListener('click',e=>{if(!e.target.closest||!e.target.closest('#openBayt'))return;
  setTimeout(()=>{const b=document.getElementById('bayt');
    if(b&&b.classList.contains('on')&&document.getElementById('mdOpen')&&!document.querySelector('#modal.on')&&!(window.Bayt&&Bayt.G)&&webgl())open()},250)});
// تستدعيها madina.js بعد كل تغيير في المدينة
function refresh(){if(cur)try{cur.refresh()}catch(e){console.error(e)}}
window.City3D={open,refresh};
})();
