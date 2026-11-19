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
const TREES=[[-21,-3],[-21,4],[12,-3],[12,4],[-2.8,-28],[2.8,14],[-13,12],[13,-12],[-13,-12],[13,12],[-22,0],[16,0]];
const FARM=[-14.5,0],FARM_IN={x:-14.5,z:2.2,via:4.6};
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
  // (v11.4) ألوان أزهى: أرض خضراء حتى الأفق، تلال، زهور، فراشات وطيور بالنهار، يراعات بالليل
  const WN=winter();S.background=new T.Color(night?0x1a2a5e:WN?0xb7c4d0:0x9fdcff);S.fog=new T.Fog(night?0x1a2a5e:WN?0xc9d3dc:0xc8ecff,night?110:130,night?480:560);
  S.add(new T.HemisphereLight(night?0x9aa8e0:0xffffff,night?0x335533:0x6fb04a,night?.8:.62));
  const sun=new T.DirectionalLight(night?0xb8c6ff:0xfff2d6,night?.5:.95);sun.position.set(14,24,12);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});S.add(sun);
  const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o||{}));
  const add=(geo,mat,x,y,z,p)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(p||S).add(m);return m};
  const box=(w,h,d,mat,x,y,z,p)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z,p);
  const prism=(w,h,d,mat,x,y,z,p)=>{const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,h);sh.lineTo(-w/2,0);
    const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return add(g,mat,x,y,z,p)};
  const winM=M(night?0xffd86b:0x9fd8ff,night?{emissive:0xffc940,emissiveIntensity:.9}:{roughness:.3});
  const wood=M(0x8b5a2b),stone=M(0xf4efe4),green=M(0x2fa36b),tr=M(0x7a4b25),lf=M(0x3fbf5a);
  const LF=[M(0x3fbf5a),M(0x5fd36a),M(0x2fae62),M(0xff9ec7),M(0x7fd85a)];
  const water=M(0x5fb0e6,{roughness:.15,metalness:.1,emissive:night?0x1d4e7e:0x000000});
  const tree=(x,z,p,s=1)=>{const h=Math.abs(Math.round(x*7+z*13))%LF.length;add(new T.CylinderGeometry(.18*s,.22*s,1.2*s,8),tr,x,.6*s,z,p);
    add(new T.SphereGeometry(.9*s,14,10),LF[h],x,1.8*s,z,p);add(new T.SphereGeometry(.6*s,12,8),LF[h],x+.35*s,2.35*s,z+.1*s,p)};
  const anim=[];S.userData.anim=anim;
  const palm=(x,z,p)=>{add(new T.CylinderGeometry(.1,.16,2.4,8),tr,x,1.2,z,p);const c=add(new T.SphereGeometry(.9,10,8),lf,x,2.5,z,p);c.scale.set(1,.35,1)};
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
    const pine=M(night?0x1f5a34:0x2e7d45),ptr=M(0x6b4423);
    for(let i=0;i<70;i++){const z=-420+i*9+(i*37%7),x=X0-5-(i*53%14),d=X0-x,y=Math.min(1,d/55)**2*(5+16*FBM(x*.035,z*.035,4))-.4,s=1.4+(i%4)*.35;
      add(new T.CylinderGeometry(.18*s,.24*s,1*s,6),ptr,x,y+.5*s,z).castShadow=false;add(new T.ConeGeometry(1.1*s,3*s,8),pine,x,y+2.4*s,z).castShadow=false}
    for(let i=0;i<14;i++){const z=-120+i*12,x=-28-(i%3)*2;if(Math.abs(z+22)<9)continue;tree(x,z,null,1.3+(i%3)*.2)}}
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
  [[-10,-36],[8,-34],[-16,-48],[12,-52],[-6,-62],[10,-72],[-14,-80],[6,-92],[-9,24],[9,28],[-15,34],[13,40]].forEach(([x,z])=>tree(x,z,null,1.3));
  for(let i=0;i<40;i++){const z=-110-i*8,x=(i%2?1:-1)*(6+(i*29%12));tree(x,z,null,1.2+(i%3)*.2)}
  // الطرق بلون دافئ وأرصفة بيضاء — الطريق الرئيسي طويل جدًا يغيب في الضباب
  const road=M(night?0xb9ad96:0xd9c49c),curb=M(0xffffff),line=M(night?0xfff3c4:0xffffff);
  const RL=1400,RZ=-500;
  const rd=add(new T.PlaneGeometry(4,RL),road,0,.01,RZ);rd.rotation.x=-Math.PI/2;rd.castShadow=false;
  [-2.1,2.1].forEach(x=>{const c=add(new T.BoxGeometry(.18,.08,RL),curb,x,.04,RZ);c.castShadow=false});
  [-4.6,4.6].forEach(z=>{const r=add(new T.PlaneGeometry(28,1.8),road,0,.012,z);r.rotation.x=-Math.PI/2});
  {const lg=new T.PlaneGeometry(.18,1.4);lg.rotateX(-Math.PI/2);const n=Math.floor(RL/3),im=new T.InstancedMesh(lg,line,n),o=new T.Object3D();
    for(let i=0;i<n;i++){o.position.set(0,.02,RZ+RL/2-1-i*3);o.updateMatrix();im.setMatrixAt(i,o.matrix)}S.add(im)}
  // زهور ملوّنة كثيرة على العشب
  {const fl=[0xff5c8a,0xffd23f,0xb07cff,0xff8c42,0xffffff,0x4fc3ff,0xff4f4f],geo=new T.SphereGeometry(.24,8,6),im=new T.InstancedMesh(geo,new T.MeshStandardMaterial({roughness:.6}),240);
    const o=new T.Object3D(),col=new T.Color();let n=0,k=0;
    const bad=(x,z)=>Math.abs(x)<2.8||x<-2.4&&x>-11.2&&z<-14.8&&z>-25||Math.abs(Math.abs(z)-4.6)<1.4&&Math.abs(x)<15||Object.values(SPOT).some(([a,b])=>Math.hypot(x-a,z-b)<3.9)||Math.hypot(x,z)>34||x>17||Math.abs(x-FARM[0])<3.6&&Math.abs(z-FARM[1])<3.8;
    while(n<240&&k<4000){k++;const a=Math.random()*Math.PI*2,r=3+Math.random()*31,x=Math.cos(a)*r,z=Math.sin(a)*r;if(bad(x,z))continue;
      o.position.set(x,.14,z);o.scale.setScalar(.7+Math.random()*.6);o.updateMatrix();im.setMatrixAt(n,o.matrix);im.setColorAt(n,col.setHex(fl[n%fl.length]));n++}
    im.count=n;S.add(im)}
  // شجيرات صغيرة على أطراف الطرق
  const bush=M(0x4cc35e);[[-3,10.5],[3,-10.5],[-3,-11.5],[3,11.5],[-12,6.2],[12,-6.2],[-7,6.2],[7,-6.2],[7,6.2],[-7,-6.2]].forEach(([x,z])=>{const b=add(new T.SphereGeometry(.55,12,8),bush,x,.35,z);b.scale.set(1.3,.8,1)});
  if(!night){
    // غيوم تتحرك
    const cw=M(0xffffff,{roughness:1});for(let i=0;i<6;i++){const c=new T.Group();[[0,0,1.6],[1.4,.2,1.2],[-1.4,.1,1.1],[.5,.8,1]].forEach(([x,y,r])=>{const s=new T.Mesh(new T.SphereGeometry(r,12,8),cw);s.position.set(x,y,0);c.add(s)});
      const ca=i/6*Math.PI*2,cr=58+i%2*8;c.scale.setScalar(2.2);S.add(c);anim.push(t=>{const a=ca+t*.01;c.position.set(Math.cos(a)*cr,14+i%3*3,Math.sin(a)*cr)})}
    // طيور تحلّق
    const bm=M(0x445566);for(let i=0;i<4;i++){const b=new T.Group();const w1=add(new T.BoxGeometry(.7,.05,.25),bm,-.35,0,0,b),w2=add(new T.BoxGeometry(.7,.05,.25),bm,.35,0,0,b);
      S.add(b);const r=14+i*4,sp=.25+i*.05,ph=i*1.7;anim.push(t=>{const a=t*sp+ph;b.position.set(Math.cos(a)*r,10+i,Math.sin(a)*r);b.rotation.y=-a;const f=Math.sin(t*8+i)*.5;w1.rotation.z=f;w2.rotation.z=-f})}
    // فراشات ملوّنة
    [0xff6fb5,0xffd23f,0x8f6bff,0x4fc3ff,0xff8c42,0x6fe38a].forEach((c,i)=>{const b=new T.Group(),wm=new T.MeshStandardMaterial({color:c,side:T.DoubleSide});
      const w1=new T.Mesh(new T.CircleGeometry(.22,8),wm),w2=new T.Mesh(new T.CircleGeometry(.22,8),wm);w1.position.x=-.2;w2.position.x=.2;b.add(w1,w2);S.add(b);
      const cx=[-9,9,-9,9,-12,12][i],cz=[-2,-2,4,3,-12,12][i];anim.push(t=>{const a=t*.7+i;b.position.set(cx+Math.cos(a)*2.2,1.2+Math.sin(t*2+i)*.4,cz+Math.sin(a*1.3)*2.2);b.rotation.y=-a;const f=Math.sin(t*14+i)*1.1;w1.rotation.y=f;w2.rotation.y=-f})})}
  else{
    // يراعات مضيئة بالليل
    const ff=new T.MeshBasicMaterial({color:0xfff27a});for(let i=0;i<40;i++){const f=new T.Mesh(new T.SphereGeometry(.08,6,4),ff);const a=Math.random()*6.28,r=4+Math.random()*26,y0=.6+Math.random()*1.8;
      f.position.set(Math.cos(a)*r,y0,Math.sin(a)*r);S.add(f);const ph=Math.random()*6;anim.push(t=>{f.position.y=y0+Math.sin(t*1.5+ph)*.3;f.visible=Math.sin(t*2.2+ph)>-.4})}
    // قمر
    const moon=new T.Mesh(new T.SphereGeometry(4,20,14),new T.MeshBasicMaterial({color:0xfff3b0}));moon.position.set(-40,45,-80);S.add(moon)}
  // مصابيح الشوارع: بالليل تضيء وتنير الطريق حولها
  const pole=M(0x4a4f5a),bulb=M(night?0xfff1b0:0xf1efe6,night?{emissive:0xffd860,emissiveIntensity:1.6}:{});
  const pool=new T.MeshBasicMaterial({color:0xffd870,transparent:true,opacity:.28,depthWrite:false});
  const LAMPS=[[-2.8,-13],[2.5,-13],[-2.8,-7.5],[2.5,-7.5],[-2.8,-1.8],[2.5,-1.8],[-2.8,7.5],[2.5,7.5],[-2.8,13],[2.5,13],[-10,5.8],[10,5.8],[-10,-5.8],[10,-5.8]];
  // (v13.5) رصيف حجري على جانبي الطريق الرئيسي داخل المدينة (الطفل يمشي على الأيسر)، وممرّات مشاة مخطّطة عند التقاطعين
  {const sw=M(night?0x9a958c:0xd8d3c8);[-2.5,2.5].forEach(x=>{const r=add(new T.PlaneGeometry(.8,60),sw,x,.015,-2);r.rotation.x=-Math.PI/2;r.castShadow=false});
    const zb=M(0xffffff);[-4.6,4.6].forEach(z=>{for(let x=-1.65;x<=1.66;x+=.55){const s=add(new T.PlaneGeometry(.3,1.3),zb,x,.022,z);s.rotation.x=-Math.PI/2;s.castShadow=false}})}
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
    for(let r=0;r<2;r++)for(let i=0;i<6;i++){const x=-W/2+.75+i*(W-1.5)/5;if(r===0&&Math.abs(x)<1)continue;box(.7,.85,.06,winM,x,1.05+r*2.2,D/2+.03,G);box(.8,.08,.1,white,x,.58+r*2.2,D/2+.06,G)}
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
  function home(G){const fh=1.6,hw=4,hd=3.4,wallC=[0xffe08a,0xffc2d6,0xb8e6ff,0xc9f2b4];
    for(let i=0;i<floors;i++){box(hw,fh,hd,M(wallC[i]),0,fh/2+i*fh,0,G);
      for(let k=-1;k<=1;k+=2){box(.7,.6,.06,winM,k*1.1,fh/2+i*fh+.1,hd/2+.03,G);box(.06,.6,.7,winM,hw/2+.03,fh/2+i*fh+.1,k*.9,G)}}
    box(.8,1.1,.06,wood,0,.55,hd/2+.04,G);
    const roof=add(new T.ConeGeometry(3.3,1.8,4),M(0xff5a5a),0,floors*fh+.9,0,G);roof.rotation.y=Math.PI/4;
    tree(-2.8,-1.4,G,.8);palm(-2.8,1.4,G);return floors*fh+2}
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
    lb.position.set(0,top+.7,0);G.add(lb);G.scale.setScalar(p==='m'?mScale(LV('m')||1):(BS[p]||1));if(p==='sc'){const k=BS.sc-1;G.position.x-=k*4.6;G.position.z-=k*4.4}});
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
    const fl=textSprite(T,V?'🐄 المزرعة':'🐄 مزرعتي','rgba(255,255,255,.92)','#5a4a1a');fl.scale.set(3.4,.74,1);fl.position.set(1.3,3.2,-2.2);F.add(fl)}
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
function winter(){const d=window.City3D&&City3D.debugSnow;if(d!=null)return !!d;return [11,0,1].includes(new Date().getMonth())}
function hourNow(){const d=window.City3D&&City3D.debugHour;if(d!=null)return d;const n=new Date();return n.getHours()+n.getMinutes()/60}
// (v13.5) وقت النوم: من ١٢ ليلًا حتى أذان الفجر (أو ٥ صباحًا إن لم يُعرف)
function sleepNow(){const h=hourNow();let f=5;try{const d=new Date(+Adhan.times(new Date()).fajr);const x=d.getHours()+d.getMinutes()/60;if(x>3&&x<7)f=x}catch(e){}return h>=0&&h<f}
function makeLife(night){const T=THREE,g=new T.Group(),M=c=>new T.MeshStandardMaterial({color:c,roughness:.75});
  const add=(geo,m,x,y,z,p)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o};
  const skinC=[0xf6cfa6,0xe8b48a,0xd9a072,0xf2c9a0];
  // شخص بسيط: kid (طالب) / man (ثوب أبيض) / woman (عباءة) / guard (حارس)
  function person(kind,i){const P=new T.Group(),sk=M(skinC[i%4]);let s=1;
    if(kind==='kid'){s=.62;const sh=M([0xff6b6b,0x4fc3ff,0xffd23f,0x7be37b,0xb07cff,0xff9f43][i%6]);
      add(new T.CylinderGeometry(.22,.26,.6,10),sh,0,.75,0,P);[-.1,.1].forEach(x=>add(new T.CylinderGeometry(.08,.08,.45,6),M(0x2b3a55),x,.23,0,P));
      add(new T.BoxGeometry(.36,.4,.16),M([0x2f6fd0,0xd94f8a,0x1fa463][i%3]),0,.85,-.24,P); // حقيبة
      add(new T.SphereGeometry(.24,12,10),sk,0,1.28,0,P);
      if(i%2)add(new T.SphereGeometry(.27,12,10,0,Math.PI*2,0,Math.PI*.55),M(0xffffff),0,1.3,-.03,P).rotation.x=-.5;
      else add(new T.SphereGeometry(.25,12,8,0,Math.PI*2,0,Math.PI*.5),M(0x3b2414),0,1.3,-.02,P).rotation.x=-.3}
    else{const robe=kind==='man'?M(i%3?0xf5f5f0:0xd8d8d0):kind==='woman'?M(0x1d1d24):M(0x1f3a6b);
      add(new T.CylinderGeometry(.24,.34,1.25,12),robe,0,.63,0,P);add(new T.SphereGeometry(.2,12,10),sk,0,1.45,0,P);
      [-.09,.09].forEach(x=>add(new T.SphereGeometry(.03,6,4),M(0x222222),x,1.48,.18,P));
      if(kind==='man')add(new T.SphereGeometry(.2,12,8,0,Math.PI*2,0,Math.PI/2),M(0xffffff),0,1.5,-.01,P);
      if(kind==='woman'){add(new T.SphereGeometry(.24,12,10,0,Math.PI*2,0,Math.PI*.6),M(0x1d1d24),0,1.46,-.04,P).rotation.x=-.55;add(new T.SphereGeometry(.25,12,10,Math.PI,Math.PI,Math.PI*.5,Math.PI*.5),M(0x1d1d24),0,1.46,-.05,P)}
      if(kind==='guard'){add(new T.CylinderGeometry(.22,.22,.14,12),M(0x152a4f),0,1.62,0,P);add(new T.BoxGeometry(.3,.03,.18),M(0x101010),0,1.56,.17,P);
        const ln=add(new T.SphereGeometry(.11,10,8),new T.MeshStandardMaterial({color:0xfff1b0,emissive:0xffd860,emissiveIntensity:1.6}),.32,.8,.15,P);
        const pl=new T.PointLight(0xffd27a,1.2,9,1.4);pl.position.set(.32,1,.3);P.add(pl)}}
    P.scale.setScalar(s*1.35*PS);g.add(P);return P}
  // مركبات: باص مدرسة أصفر وسيارات
  function wheels(V,w,l){const wm=M(0x222222);[[-w,l],[w,l],[-w,-l],[w,-l]].forEach(([x,z])=>{const c=add(new T.CylinderGeometry(.34,.34,.25,14),wm,x,.34,z,V);c.rotation.z=Math.PI/2})}
  function bus(){const V=new T.Group(),y=M(0xffc21a),gl=M(0x9fd8ff);add(new T.BoxGeometry(1.8,1.55,4.6),y,0,1.15,0,V);add(new T.BoxGeometry(1.82,.12,4.62),M(0x222222),0,.95,0,V);
    [-.91,.91].forEach(x=>add(new T.BoxGeometry(.02,.5,3.4),gl,x,1.5,.2,V));add(new T.BoxGeometry(1.5,.6,.02),gl,0,1.5,-2.31,V);
    add(new T.BoxGeometry(.04,.3,.3),M(0xe2504a),-.93,1.1,-1.6,V);wheels(V,.85,1.5);g.add(V);return V}
  function car(c){const V=new T.Group();add(new T.BoxGeometry(1.4,.6,2.6),M(c),0,.65,0,V);add(new T.BoxGeometry(1.2,.5,1.4),M(0x9fd8ff),0,1.18,.1,V);wheels(V,.68,.85);V.scale.setScalar(.95);g.add(V);return V}
  const cars=[{v:bus(),stop:-17.6,off:0},{v:car(0xe2504a),stop:-12.4,off:1.6},{v:car(0x4f8fe0),stop:-8.6,off:3.2}];
  cars.forEach(c=>{c.v.rotation.y=Math.PI;c.v.visible=false});
  // طلاب الساحة
  const YX=[-12.6,-4.3],YZ=[-19.7,-15.2],yard=[];
  for(let i=0;i<10;i++){const p=person('kid',i);p.position.set(YX[0]+Math.random()*(YX[1]-YX[0]),0,YZ[0]+Math.random()*(YZ[1]-YZ[0]));p.userData={tx:p.position.x,tz:p.position.z,w:Math.random()*3,j:0};yard.push(p)}
  const guard=person('guard',1);guard.position.set(-2.5,0,-17);
  // (v12.1) 💬 فقاعات الكلام تتبع صاحبها
  const bubs=[];function say(o,txt,dur,h){const s=speech(T,txt);g.add(s);const b={s,o,k:dur,h};bubs.push(b);return b}
  function unsay(b){if(!b)return;const i=bubs.indexOf(b);if(i>=0)bubs.splice(i,1);g.remove(b.s);b.s.material.map.dispose();b.s.material.dispose()}
  // (v12.1) 🚶 جيران يمشون على الأرصفة، وأحيانًا يُلقي أحدهم «السلام عليكم» (الأول والثاني يبقيان بالليل)
  // (v13.4) على الطرق الجانبية z=±4.6 (حافتها الخارجية ±5) لأن البنايات الكبيرة تملأ أرصفة الطريق الرئيسي
  const ROUTES=[['x',5,3,13,'man'],['x',-5,-12,-3,'woman'],['x',-5,3,13,'kid'],['x',5,-12,-3,'man']];
  const peds=ROUTES.map((r,i)=>{const P=person(r[4],i+3);P.userData.ped=i+1;
    P.userData.u={ax:r[0],fix:r[1],a:r[2],b:r[3],kind:r[4],h:r[4]==='kid'?1.7:2.3,pos:Math.min(r[2],r[3])+Math.random()*Math.abs(r[3]-r[2]),dir:Math.random()<.5?1:-1,sp:.9+Math.random()*.4,w:0,greet:0,hold:0,bub:null};return P});
  let gT=5;
  function endGreet(i){const u=peds[i]&&peds[i].userData.u;if(!u)return;u.greet=0;unsay(u.bub);u.bub=null}
  // (v12.1) 🚗 سيارات تمرّ طول اليوم في الاتجاهين، وتقف إذا كان الطفل أمامها في الطريق
  const CC=[0x1fa463,0xff8c42,0xb07cff,0xffffff,0xe2504a,0x4fc3ff];
  const hlM=new T.MeshStandardMaterial({color:0xfff6c0,emissive:0xffe680,emissiveIntensity:night?2:.3});
  // (v13.5) السيارات تأتي من بعيد وتذهب بعيدًا حتى تختفي في الأفق (بلا اختفاء مفاجئ): الطريق من Z0 إلى Z1
  const Z0=-240,Z1=190,TN=night?2:6;
  const traffic=[];[1,-1].forEach(dir=>{for(let k=0;k<TN;k++){const v=car(CC[traffic.length%CC.length]),z=Z0+(k+(dir<0?.5:0))*(Z1-Z0)/TN;
    [-.45,.45].forEach(x=>add(new T.BoxGeometry(.25,.15,.05),hlM,x,.7,1.31,v));v.rotation.y=dir>0?0:Math.PI;v.position.set(dir,0,z);traffic.push({v,dir,z,sp:7+Math.random()*2})}});
  // مشاة (طلاب ينزلون/يصعدون، ومصلّون)
  let walkers=[];
  function walk(P,pts,sp,end){P.position.set(pts[0][0],0,pts[0][1]);walkers.push({P,pts:pts.slice(1),sp,end,k:0})}
  function dropKids(stopZ,leave){for(let i=0;i<3;i++){const p=person('kid',Math.floor(Math.random()*12));const a=[-1.9,stopZ+(i-1)*.7],b=[-2.6,-17.6],c=[-4.6,-17.4];
    p.visible=false;setTimeout(()=>{p.visible=true;walk(p,leave?[c,b,a]:[a,b,c],1.6,'gone')},i*450)}}
  const PR=[[.6,30],[.6,-30],[-14,4.6],[14,4.6],[-14,-4.6]];let prT=0,prN=0;
  function worshipper(){const s=PR[Math.floor(Math.random()*PR.length)],p=person(Math.random()<.6?'man':'woman',Math.floor(Math.random()*9));
    const pts=[s];if(s[1]!==4.6){if(s[1]===-4.6)pts.push([.6,-4.6]);pts.push([.6,4.6])}pts.push([6+(Math.random()-.5)*.8,4.6],[6,3.75]);walk(p,pts,1.5+Math.random()*.4,'enter');prN++}
  let lastCycle=-1;
  function update(t,dt,o){const h=hourNow(),day=!night;
    // الساحة والحارس
    yard.forEach(p=>{p.visible=day;if(!day)return;const u=p.userData;
      if(u.w>0){u.w-=dt;if(u.j>0){u.j-=dt;p.position.y=Math.abs(Math.sin(u.j*9))*.25}else p.position.y=0;
        if(u.w<=0){u.tx=YX[0]+Math.random()*(YX[1]-YX[0]);u.tz=YZ[0]+Math.random()*(YZ[1]-YZ[0]);if(Math.random()<.3)u.j=1}}
      else{const dx=u.tx-p.position.x,dz=u.tz-p.position.z,d=Math.hypot(dx,dz);if(d<.05){u.w=1+Math.random()*3}else{const sp=Math.min(d,dt*1.3);p.position.x+=dx/d*sp;p.position.z+=dz/d*sp;p.rotation.y=Math.atan2(dx,dz);p.position.y=Math.abs(Math.sin(t*6+p.id))*.06}}});
    guard.visible=night;if(night){const z=-17+Math.sin(t*.15)*1.4;guard.rotation.y=Math.cos(t*.15)>0?0:Math.PI;guard.position.z=z;guard.position.y=Math.abs(Math.sin(t*3))*.03}
    // الباص والسيارات: صباحًا يجلبون الطلاب، وظهرًا يأخذونهم
    // (v13.5) يأتون من بعيد (z=150) ويذهبون بعيدًا (z=-150)؛ إذا انتهى الوقت أثناء الطريق يكملون حتى الأفق، ولا يظهرون فجأة في منتصف الطريق
    const phase=day&&h>=6&&h<8?'arrive':day&&h>=13&&h<14.5?'leave':'';const P=45,away=c=>{if(c.v.visible){c.v.position.z-=12*dt;if(c.v.position.z<-150)c.v.visible=false}};
    cars.forEach(c=>{const cyc=Math.floor(((t/3)+c.off)/P);if(!phase){c.skip=cyc;away(c);return}if(c.skip===cyc){away(c);return}
      const ct=((t/3)+c.off)%P,sp=12,t1=(150-c.stop)/sp,t2=t1+5,t3=t2+(c.stop+150)/sp;
      c.v.position.x=-1;if(ct<t1){c.v.visible=true;c.v.position.z=150-ct*sp}else if(ct<t2){c.v.position.z=c.stop;
        const k=cyc+':'+c.stop;if(c.done!==k){c.done=k;dropKids(c.stop,phase==='leave')}}
      else if(ct<t3){c.v.position.z=c.stop-(ct-t2)*sp}else c.v.visible=false});
    // السيارات العادية: تقف خلف السيارة التي أمامها (ومنها الباص)، وتقف للطفل إذا عبر أمامها
    const K=o.kid;traffic.forEach(c=>{let block=false;
      if(K&&Math.abs(K.x-c.dir)<1&&o.kidOn){const ah=(K.z-c.z)*c.dir;if(ah>0&&ah<3.2)block=true}
      traffic.concat(c.dir<0?cars.filter(s=>s.v.visible).map(s=>({dir:-1,z:s.v.position.z,v:s.v})):[]).forEach(d=>{if(d!==c&&d.dir===c.dir&&d.v.visible){const gp=(d.z-c.z)*c.dir;if(gp>0&&gp<(d.v===cars[0].v?4.6:3.6))block=true}});
      if(c.dir<0&&phase&&c.z>=Z1)block=true; // وقت المدرسة: لا تدخل سيارة جديدة إلى مسار الباص
      if(!block)c.z+=c.dir*c.sp*dt;
      if(c.dir>0&&c.z>Z1)c.z=Z0;if(c.dir<0&&c.z<Z0)c.z=Z1;c.v.position.z=c.z});
    // الجيران على الأرصفة
    peds.forEach((P,i)=>{const u=P.userData.u,vis=(day||i<2)&&!o.sleep;P.visible=vis;if(!vis){if(u.bub)endGreet(i);if(u.hold)u.hold=0;return}
      if(u.hold>0){u.hold-=dt;if(K)P.rotation.y=Math.atan2(K.x-P.position.x,K.z-P.position.z);P.position.y=0}
      else if(u.greet>0){u.greet-=dt;P.position.y=Math.abs(Math.sin(t*2))*.04;if(u.greet<=0)endGreet(i)}
      else if(u.w>0){u.w-=dt;P.position.y=0}
      else{u.pos+=u.dir*u.sp*dt;if(u.pos>u.b||u.pos<u.a){u.pos=Math.max(u.a,Math.min(u.b,u.pos));u.dir*=-1;u.w=1+Math.random()*2}else if(Math.random()<dt*.05)u.w=1.5+Math.random()*2;
        P.position.y=Math.abs(Math.sin(t*6+i))*.05}
      if(u.ax==='z'){P.position.x=u.fix;P.position.z=u.pos;if(!(u.hold>0))P.rotation.y=u.dir>0?0:Math.PI}
      else{P.position.z=u.fix;P.position.x=u.pos;if(!(u.hold>0))P.rotation.y=u.dir>0?Math.PI/2:-Math.PI/2}});
    gT-=dt;if(gT<=0){gT=9+Math.random()*7;if(!peds.some(P=>P.userData.u.greet>0||P.userData.u.hold>0)){const c=peds.filter(P=>P.visible);
      if(c.length){const P=c[Math.floor(Math.random()*c.length)],u=P.userData.u;u.greet=16;u.bub=say(P,'السلام عليكم 👋',1e9,u.h)}}}
    bubs.slice().forEach(b=>{b.k-=dt;b.s.position.set(b.o.position.x,b.o.position.y+b.h,b.o.position.z);if(b.k<=0)unsay(b)});
    // المصلّون وقت الصلاة (إذا بُني الجامع)
    if(o.prayer&&o.mosque){prT-=dt;if(prT<=0&&prN<14){prT=2.2+Math.random()*2;worshipper()}}else{prN=0}
    // حركة المشاة
    walkers=walkers.filter(w=>{const P=w.P;if(!w.pts.length){if(w.end==='enter'||w.end==='gone'){w.k+=dt*3;P.scale.multiplyScalar(Math.max(.01,1-dt*3));if(w.k>1){g.remove(P);P.traverse(x=>{x.geometry&&x.geometry.dispose();x.material&&x.material.dispose()});return false}}return true}
      const [tx,tz]=w.pts[0],dx=tx-P.position.x,dz=tz-P.position.z,d=Math.hypot(dx,dz),sp=w.sp*dt;
      if(d<=sp){P.position.x=tx;P.position.z=tz;w.pts.shift()}else{P.position.x+=dx/d*sp;P.position.z+=dz/d*sp;P.rotation.y=Math.atan2(dx,dz)}
      P.position.y=Math.abs(Math.sin(t*6+P.id))*.05;return true})}
  return {g,update,count:()=>walkers.length,peds,say,endGreet,traffic}}

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
  return {tick(dt){if(ctx.state==='suspended')ctx.resume().catch(()=>{});master.gain.value=sndOn()?1:0;if(!sndOn())return;
      tb-=dt;tc-=dt;if(tb<=0){tb=1.2+Math.random()*3.5;chirp()}if(tc<=0){tc=6+Math.random()*9;carPass()}},
    stop(){try{src.stop()}catch(e){}try{ctx.close()}catch(e){}}}}

/* ---------- التشغيل ---------- */
function run(ov,ui){const T=THREE,night=document.body.classList.contains('night');
  const W=innerWidth,H=innerHeight;
  const R=new T.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.setSize(W,H);
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  ov.insertBefore(R.domElement,ov.firstChild);R.domElement.style.display='block';R.domElement.style.touchAction='none';
  const cam=new T.PerspectiveCamera(45,W/H,.1,950);let S=makeScene(night);
  if(!cam0.dist)cam0.dist=Math.min(72,Math.max(38,31/(W/H)));
  let {th,ph,dist}=cam0,drag=null,pinch=0,down=null;const pts=new Map(),MAXD=80;
  // City3D.debugLook=[x,y,z,dist] للتجربة فقط: يدور حول نقطة قريبة (مثل المزرعة)
  const place=()=>{const L=window.City3D&&City3D.debugLook,c=L||[0,0,0],d=L?L[3]:dist;cam.position.set(c[0]+d*Math.sin(th)*Math.sin(ph),c[1]+d*Math.cos(ph),c[2]+d*Math.cos(th)*Math.sin(ph));L?cam.lookAt(c[0],c[1],c[2]):cam.lookAt(0,1.5,-5)};
  // الشخصية: تبدأ عند باب البيت
  const life=makeLife(night);S.add(life.g);let prC=null,prAt=0;const sounds=makeSounds(night);if(window.City3D)City3D._life=life;
  if(ui.snd){const upd=()=>{ui.snd.textContent=sounds.quiet?"🌙":sndOn()?"🔊":"🔇"};upd();ui.snd.onclick=()=>{if(sounds.quiet){card("🌙 الليل هادئ… المدينة نائمة 😴");setTimeout(()=>card(""),2200);return}try{localStorage.setItem(SKEY,sndOn()?"0":"1")}catch(e){}upd()}}
  const kid=makeKid();S.add(kid);let at={x:-3.4,z:1,via:null},path=[],onArrive=null,busy=0;kid.position.set(at.x,0,at.z);kid.rotation.y=Math.PI/2;
  const sign=v=>v<0?-1:1;
  const door=p=>{if(p==='sc')return {x:-2.4,z:-17.6,via:null};if(p==='m')return {x:6,z:3.95,via:4.6};const [x,z]=SPOT[p];return {x:x-sign(x)*(2.2+(BS[p]||1)),z:z+1,via:null}};
  const treeSpot=i=>{const [x,z]=TREES[i];return Math.abs(x)<4?{x:x-sign(x)*1.1,z,via:null}:{x:x-sign(x)*1.2,z,via:sign(z)*4.6}};
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
  const WP=[{x:SW,z:-6},{x:SW,z:7},{x:SW,z:12},{x:SW,z:-12},{x:-5,z:3.2,via:4.6},{x:-10.3,z:3.6,via:4.6},{x:-5.5,z:-5.9,via:-4.6}];
  const here=()=>{const x=kid.position.x,z=kid.position.z;return {x,z,via:Math.abs(x)>2.6&&Math.abs(Math.abs(z)-4.6)<1.2?sign(z)*4.6:null}};
  function go(to,done,w){if(busy)return;if(path.length&&wander){at=here();path=[]}wander=!!w;const p=[];
    if(at.via!=null)p.push([at.x,at.via]);p.push([SW,at.via!=null?at.via:at.z]);
    p.push([SW,to.via!=null?to.via:to.z]);if(to.via!=null)p.push([to.x,to.via]);p.push([to.x,to.z]);
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
      const px=P.position.x,pz=P.position.z,to=u.ax==='z'?{x:sign(px)*2.3,z:pz,via:null}:{x:px-sign(px)*.9,z:sign(pz)*4.6,via:sign(pz)*4.6};
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
    visit(r){vr=r;V={lv:Madina.fromCode(r.m||'00000'),f:r.f,nick:short(r.nick)};
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
    ui.bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping&&b.dataset.a!=="back"){sleepCard();return}if(busy||path.length&&!wander)return;A[b.dataset.a]()});
    const p=prayerNow();if(!V&&p&&!day().pr[p])ui.bar.querySelector('[data-a=mosque]').classList.add('hot')}
  setBar();const pn=prayerNow();
  // اللمس
  const cv=R.domElement,ray=new T.Raycaster();
  function pick(x,y){const r=cv.getBoundingClientRect();ray.setFromCamera(new T.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),cam);
    for(const h of ray.intersectObjects(S.children,true)){let o=h.object;while(o&&!(o.userData&&(o.userData.p||o.userData.t!=null||o.userData.l!=null||o.userData.cat||o.userData.ped||o.userData.fk)))o=o.parent;if(o)return o.userData}return null}
  function tap(u){if(!u)return;try{window.Bayt&&Bayt.sTap()}catch(e){}if(sleeping){sleepCard();return}
    if(u.ped){if(!busy&&(!path.length||wander))A.salam(u.ped-1);return}
    if(u.fk){if(V){card(`🐄 مزرعة ${V.nick} 🤍`);setTimeout(()=>card(''),1800);return}if(!busy&&(!path.length||wander))A.farm(u.fk);return}
    if(V){if(u.p==='home')card(`🏡 بيت ${V.nick}`,[['🏡 ادخل بيته',()=>A.fhouse()],['حسنًا',null,'sec']]);
      else if(u.p&&Madina.PARTS[u.p])card(`${Madina.PARTS[u.p].e} ${Madina.PARTS[u.p].n} في مدينة ${V.nick} 🤍`);return}
    if(u.t!=null){if(!busy&&(!path.length||wander))A.tree(u.t);return}
    if(u.l!=null){if(!busy&&(!path.length||wander))A.litter(u.l);return}
    if(u.cat){if(!busy&&(!path.length||wander))A.cat();return}
    if(u.p==='sc'){if(!busy&&(!path.length||wander))A.mySchool();return}
    if(u.p==='home'){card(`🏡 هذا ${B('بيتك','بيتكِ')} في الجنة · ${B('ابنِ','ابني')} طوابقه بالأعمال الصالحة 🤍`,[['🎨 '+B('زيّن','زيّني')+' بيتك '+B('وادخله','وادخليه'),()=>closeTo(()=>oldHouse('deco'))],['حسنًا',null,'sec']]);return}
    window.Madina&&Madina.part&&Madina.part(u.p)}
  cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);
    if(pts.size===1){drag=[e.clientX,e.clientY];down=[e.clientX,e.clientY,Date.now()]}else{drag=null;pinch=0;down=null}});
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1&&drag){th-=(e.clientX-drag[0])*.008;ph=Math.max(.25,Math.min(1.38,ph-(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY]}
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
    else{L.legs.forEach(l=>l.rotation.x*=.8);L.arms.forEach(a=>a.rotation.x*=.8);still+=dt;waveT+=dt;
      // يلتفت نحوك ليظهر وجهه
      const ta=Math.atan2(cam.position.x-kid.position.x,cam.position.z-kid.position.z);let da=ta-kid.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));kid.rotation.y+=da*Math.min(1,dt*4);
      if(joyT>0){joyT-=dt;const k=1.1-joyT;kid.position.y=Math.abs(Math.sin(k*Math.PI*2.7))*.45;L.arms[0].rotation.z=-2.6;L.arms[1].rotation.z=2.6}
      else{kid.position.y=0;const w=waveT%6;L.arms[0].rotation.z*=.85;L.arms[1].rotation.z=w<1.4?2.5+Math.sin(w*12)*.35:L.arms[1].rotation.z*.85}
      // يتجوّل وحده إذا تُرك قليلًا
      if(still>8&&!busy&&!sleeping&&!ui.card.classList.contains('on')&&!document.querySelector('#modal.on')){still=0;go(WP[Math.floor(Math.random()*WP.length)],null,true)}}
    if(path.length){still=0;L.arms.forEach(a=>a.rotation.z*=.7)}
    (S.userData.anim||[]).forEach(f=>f(t,dt));
    if(performance.now()-prAt>2000){prAt=performance.now();prC=prayerNow();const sl=sleepNow();if(sl&&!sleeping&&!V)startSleep(t<1);else if(!sl&&sleeping)wake()}
    if(zz.visible){zz.position.y=zz.userData.y+Math.sin(t*.8)*.25;zz.material.opacity=.75+Math.sin(t*1.3)*.25}
    life.update(t,dt,{prayer:sleeping?null:prC,mosque:V?(V.lv.m|0):(window.Madina?Madina.st.lv.m|0:0),kid:kid.position,kidOn:kid.visible,sleep:sleeping});sounds&&sounds.tick(dt);
    sparks=sparks.filter(s=>{s.userData.k+=dt;const k=s.userData.k;s.position.addScaledVector(s.userData.v,dt);s.rotation.y+=dt*6;s.material.opacity=Math.max(0,1-k/1.3);
      if(k>1.3){S.remove(s);s.geometry.dispose();s.material.dispose();return false}return true});
    drops=drops.filter(d=>{d.position.y-=dt*4;if(d.position.y<.1){S.remove(d);d.geometry.dispose();d.material.dispose();return false}return true});
    (S.userData.trees||[]).forEach(G=>{if(G&&G.userData.grow){G.userData.grow+=dt;const k=G.userData.grow-1;G.scale.setScalar(k<.6?1+Math.sin(k/.6*Math.PI)*.25:1.08);if(k>.6)G.userData.grow=0}});
    place();R.render(S,cam);requestAnimationFrame(loop)})();
  // عند وقت الأذان: الشخصية تذهب للجامع وحدها
  if(pn&&!day().pr[pn]&&window.Madina&&Madina.st.lv.m)setTimeout(()=>{if(alive&&!V&&!path.length&&!busy&&!sleeping){card(`🕌 الله أكبر! حان وقت صلاة ${PNAME[pn]}… هيّا إلى الجامع`);setTimeout(()=>A.mosque(),1200)}},1500);
  function refresh(){const old=S;old.remove(kid);old.remove(life.g);S=makeScene(night,V);S.add(kid);S.add(life.g);
    // الأشجار التي تكبر الآن تبقى بحجمها
    old.userData.trees.forEach((G,i)=>{if(G&&S.userData.trees[i])S.userData.trees[i].scale.copy(G.scale)});
    drops.concat(sparks).forEach(d=>{old.remove(d);S.add(d)});dispose(old);showJ()}
  return {refresh,stop(){alive=false;try{sounds.stop()}catch(e){}Object.assign(cam0,{th,ph,dist});removeEventListener('resize',rs);dispose(S);R.dispose();R.forceContextLoss&&R.forceContextLoss()}}}

function dispose(S){S.traverse(o=>{o.geometry&&o.geometry.dispose();const m=o.material;if(m){(Array.isArray(m)?m:[m]).forEach(x=>{x.map&&x.map.dispose();x.dispose()})}})}

async function open(){if(document.getElementById('m3d'))return;const ov=document.createElement('div');ov.id='m3d';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#aee3ff;overflow:hidden';
  ov.innerHTML=`<button class="m3x" aria-label="إغلاق" style="position:absolute;top:12px;left:12px;z-index:2;width:46px;height:46px;border-radius:50%;border:0;background:#fff;font-size:22px;box-shadow:0 2px 8px #0004">✖</button>
    <div class="m3hp"></div>
    <div class="m3msg" style="position:absolute;top:74px;right:12px;left:104px;z-index:2;background:#fffd;border-radius:14px;padding:6px 10px;font-weight:800;text-align:center;font-size:13px">⏳ لحظة…</div>
    <div class="m3j"></div><button class="m3snd" aria-label="الصوت"></button><div class="m3card"></div>
    <div class="m3bar" style="display:none"><button data-a="mosque"><b>🕌</b>إلى الجامع</button><button data-a="water"><b>💧</b>اسقِ الشجر</button><button data-a="school"><b>🏫</b>احفظ القرآن</button><button data-a="library"><b>📚</b>المكتبة</button><button data-a="mySchool"><b>🎒</b>مدرستي</button><button data-a="friends"><b>👥</b>زيارة صديق</button></div>`;
  document.body.appendChild(ov);document.body.classList.add('m3on');const msg=ov.querySelector('.m3msg');
  const close=()=>{try{cur&&cur.stop()}catch(e){}cur=null;ov.remove();document.body.classList.remove('m3on')};
  ov.querySelector('.m3x').onclick=close;
  const fail=()=>{msg.innerHTML='😔 هذا الجهاز لا يعرض المجسّمات.<br><small>لا تقلق، مدينتك محفوظة وتراها بالرسم العادي.</small>'};
  if(!webgl())return fail();
  try{await loadThree();if(!ov.isConnected)return;
    msg.textContent="";
    ov.querySelector('.m3bar').style.display='';
    cur=run(ov,{msg,snd:ov.querySelector('.m3snd'),card:ov.querySelector('.m3card'),bar:ov.querySelector('.m3bar'),j:ov.querySelector('.m3j'),close})}catch(e){console.error(e);fail()}}
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
