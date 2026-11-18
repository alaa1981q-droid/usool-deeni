/* مجسّم ثلاثي الأبعاد: البيت + الجامع (Three.js r128 يُحمَّل عند الطلب فقط) */
(function(){
let loading=null;
function loadThree(){if(window.THREE)return Promise.resolve();if(loading)return loading;
  loading=new Promise((ok,no)=>{const s=document.createElement('script');s.src='vendor/three.min.js';s.onload=ok;s.onerror=()=>{loading=null;no()};document.head.appendChild(s)});return loading}
function webgl(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}}

function build(ov){const T=THREE,night=document.body.classList.contains('night');
  const floors=Math.max(1,Math.min(4,(window.Bayt&&Bayt.done)|0||1));
  const mlv=Math.max(0,Math.min(3,((window.Madina&&Madina.st.lv.m)|0)));
  const W=innerWidth,H=innerHeight;
  const R=new T.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.setSize(W,H);
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  ov.appendChild(R.domElement);R.domElement.style.display='block';R.domElement.style.touchAction='none';
  const S=new T.Scene();S.background=new T.Color(night?0x0b1636:0xaee3ff);S.fog=new T.Fog(S.background,40,90);
  const cam=new T.PerspectiveCamera(45,W/H,.1,200);
  S.add(new T.HemisphereLight(night?0x6677bb:0xffffff,night?0x112211:0x88aa66,night?.45:.75));
  const sun=new T.DirectionalLight(night?0x99aaff:0xfff2d6,night?.35:.9);sun.position.set(12,20,10);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});S.add(sun);
  const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o||{}));
  const add=(geo,mat,x,y,z,p)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(p||S).add(m);return m};
  // الأرض والطريق
  const g=add(new T.CircleGeometry(30,48),M(night?0x2e5a2e:0x7ccf6a),0,0,0);g.rotation.x=-Math.PI/2;
  const rd=add(new T.PlaneGeometry(4,60),M(0x8a8f96),0,.01,0);rd.rotation.x=-Math.PI/2;
  const winM=M(night?0xffd86b:0x9fd8ff,night?{emissive:0xffc940,emissiveIntensity:.9}:{roughness:.3});
  // البيت (يسار الطريق)
  const house=new T.Group();house.position.set(-6,0,0);S.add(house);
  const fh=1.6,hw=4,hd=3.4,wallC=[0xfff1d6,0xffe2b8,0xf7d4a8,0xeccaa0];
  for(let i=0;i<floors;i++){add(new T.BoxGeometry(hw,fh,hd),M(wallC[i]),0,fh/2+i*fh,0,house);
    for(let k=-1;k<=1;k+=2){add(new T.BoxGeometry(.7,.6,.06),winM,k*1.1,fh/2+i*fh+.1,hd/2+.03,house);
      const s=add(new T.BoxGeometry(.06,.6,.7),winM,hw/2+.03,fh/2+i*fh+.1,k*.9,house)}}
  add(new T.BoxGeometry(.8,1.1,.06),M(0x8b5a2b),0,.55,hd/2+.04,house);
  const roof=add(new T.ConeGeometry(3.3,1.8,4),M(0xd2553b),0,floors*fh+.9,0,house);roof.rotation.y=Math.PI/4;
  // الجامع (يمين الطريق)
  const mq=new T.Group();mq.position.set(6,0,0);S.add(mq);
  const stone=M(0xf4efe4),dome=M(mlv>=3?0xffc53a:0x3aa39a,mlv>=3?{metalness:.6,roughness:.3}:{});
  if(mlv===0){const plot=add(new T.BoxGeometry(5,.1,5),M(0xc9a774),0,.05,0,mq);
    const fm=M(0xa0703c);for(let i=-2.5;i<=2.5;i+=.5){add(new T.BoxGeometry(.1,.7,.1),fm,i,.35,2.5,mq);add(new T.BoxGeometry(.1,.7,.1),fm,i,.35,-2.5,mq);
      add(new T.BoxGeometry(.1,.7,.1),fm,2.5,.35,i,mq);add(new T.BoxGeometry(.1,.7,.1),fm,-2.5,.35,i,mq)}
    [2.5,-2.5].forEach(z=>add(new T.BoxGeometry(5,.08,.08),fm,0,.55,z,mq));[2.5,-2.5].forEach(x=>add(new T.BoxGeometry(.08,.08,5),fm,x,.55,0,mq))}
  else{const s=mlv===1?1:mlv===2?1.25:1.5,bw=3*s,bh=1.8*s;
    add(new T.BoxGeometry(bw,bh,bw),stone,0,bh/2,0,mq);
    add(new T.SphereGeometry(bw*.38,24,16,0,Math.PI*2,0,Math.PI/2),dome,0,bh,0,mq);
    add(new T.ConeGeometry(.08,.5,8),M(0xffd34d),0,bh+bw*.38+.25,0,mq);
    add(new T.BoxGeometry(.9,1.3,.06),M(0x2f7d5a),0,.65,bw/2+.04,mq);
    for(let k=-1;k<=1;k+=2)add(new T.BoxGeometry(.5,.7,.06),winM,k*bw*.3,bh*.6,bw/2+.03,mq);
    const mins=mlv===2?[1]:mlv===3?[1,-1]:[];
    mins.forEach(k=>{const x=k*(bw/2+.6),z=bw/2-.4,mh=bh*2.2;
      add(new T.CylinderGeometry(.32,.4,mh,16),stone,x,mh/2,z,mq);
      add(new T.CylinderGeometry(.5,.5,.18,16),stone,x,mh*.82,z,mq);
      add(new T.ConeGeometry(.36,.9,16),dome,x,mh+.45,z,mq)})}
  // أشجار
  const tr=M(0x7a4b25),lf=M(night?0x2c7a3c:0x3fae55);
  [[-11,-5],[-10,5],[11,-6],[12,4],[-3,-9],[3,9]].forEach(([x,z])=>{add(new T.CylinderGeometry(.18,.22,1.2,8),tr,x,.6,z);add(new T.SphereGeometry(.9,12,10),lf,x,1.8,z)});
  if(night){const sg=new T.BufferGeometry(),p=[];for(let i=0;i<300;i++){const a=Math.random()*6.28,b=Math.random()*1.3+.15,r=80;p.push(r*Math.cos(a)*Math.cos(b),r*Math.sin(b),r*Math.sin(a)*Math.cos(b))}
    sg.setAttribute('position',new T.Float32BufferAttribute(p,3));S.add(new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:.5})))}
  // تدوير وتكبير
  let th=.35,ph=.8,dist=Math.min(45,24/Math.min(1,W/H*1.4)),drag=null,pinch=0;const pts=new Map();
  const place=()=>{cam.position.set(dist*Math.sin(th)*Math.sin(ph),dist*Math.cos(ph),dist*Math.cos(th)*Math.sin(ph));cam.lookAt(0,2,0)};
  const cv=R.domElement;
  cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);if(pts.size===1)drag=[e.clientX,e.clientY];else{drag=null;pinch=0}});
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1&&drag){th-=(e.clientX-drag[0])*.008;ph=Math.max(.25,Math.min(1.45,ph-(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY]}
    else if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)dist=Math.max(10,Math.min(45,dist*pinch/d));pinch=d}});
  const up=e=>{pts.delete(e.pointerId);pinch=0;drag=pts.size===1?[...pts.values()][0]:null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(10,Math.min(45,dist*(e.deltaY>0?1.1:.9)))},{passive:false});
  const rs=()=>{const w=innerWidth,h=innerHeight;cam.aspect=w/h;cam.updateProjectionMatrix();R.setSize(w,h)};addEventListener('resize',rs);
  let alive=true,idle=0;(function loop(){if(!alive)return;if(!pts.size&&++idle>180)th+=.002;else if(pts.size)idle=0;place();R.render(S,cam);requestAnimationFrame(loop)})();
  return ()=>{alive=false;removeEventListener('resize',rs);S.traverse(o=>{o.geometry&&o.geometry.dispose();o.material&&o.material.dispose()});R.dispose();R.forceContextLoss&&R.forceContextLoss()}}

async function open(){const ov=document.createElement('div');ov.id='m3d';
  ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#aee3ff;overflow:hidden';
  ov.innerHTML=`<button aria-label="إغلاق" style="position:absolute;top:12px;left:12px;z-index:2;width:46px;height:46px;border-radius:50%;border:0;background:#fff;font-size:22px;box-shadow:0 2px 8px #0004">✖</button>
    <div class="m3msg" style="position:absolute;top:14px;right:14px;left:70px;z-index:2;background:#fffd;border-radius:14px;padding:8px 12px;font-weight:800;text-align:center;font-size:15px">⏳ لحظة…</div>`;
  document.body.appendChild(ov);let stop=null;const msg=ov.querySelector('.m3msg');
  ov.querySelector('button').onclick=()=>{try{stop&&stop()}catch(e){}ov.remove()};
  const fail=()=>{msg.innerHTML='😔 هذا الجهاز لا يعرض المجسّمات.<br><small>لا تقلق، مدينتك محفوظة وتراها بالرسم العادي.</small>'};
  if(!webgl())return fail();
  try{await loadThree();if(!ov.isConnected)return;stop=build(ov);msg.innerHTML='👆 حرّك بإصبعك لتدوير المدينة · بإصبعين للتكبير'}catch(e){fail()}}
window.City3D={open};
})();
