/* 🛡️ الإدارة (لصاحب التطبيق فقط) + رسائل الإدارة وجوائزها للأطفال + جائزة بطل الأسبوع + الليل والنهار للبيت.
   - الدخول: (v22.4) «☰ المزيد» ← «👑 أدوات المدير» (يظهر للمدير فقط). لا يكتب إلا من كان معرّفه في admins/$uid (يُضاف من لوحة Firebase فقط).
   - news/$id: رسالة لكل الأطفال {title,msg,j,ts}. prizes/$uid/$id: جائزة لطفل واحد {msg,j,ts}.
   - كل طفل يستلم الرسالة مرة واحدة، والجواهر تُضاف لبيته. يعتمد على online.js (OnlineAPI) و jannah.js (Deco). */
(function(){
const O=()=>window.OnlineAPI;
const esc=v=>String(v==null?'':v).replace(/[<>&"'`]/g,'');
const boy=()=>!window.Cups||Cups.sex!='g';
const B=(m,f)=>boy()?m:f;
const D=()=>Aamal.d;

/* ---------- 🌙 الليل والنهار: من ٦ مساءً إلى ٥ فجرًا يصير البيت ليليًّا ---------- */
const css=document.createElement('style');
css.textContent=`
body.night .bhouse{position:relative}
body.night .bhouse svg{filter:brightness(.45) saturate(1.3) hue-rotate(-18deg) contrast(1.1);transition:filter .8s}
body.night .bhouse::after{content:'';position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;
 background:radial-gradient(ellipse 34% 26% at 50% 74%,rgba(255,206,90,.6),transparent 70%),
 radial-gradient(1.6px 1.6px at 12% 14%,#fff,transparent),radial-gradient(1.6px 1.6px at 24% 30%,#fff,transparent),radial-gradient(2px 2px at 38% 10%,#fff,transparent),
 radial-gradient(1.6px 1.6px at 52% 22%,#fff,transparent),radial-gradient(2px 2px at 64% 8%,#fff,transparent),radial-gradient(1.6px 1.6px at 72% 32%,#fff,transparent),
 radial-gradient(1.6px 1.6px at 6% 40%,#fff,transparent),radial-gradient(2px 2px at 30% 46%,#fff,transparent),radial-gradient(1.6px 1.6px at 58% 40%,#fff,transparent);animation:idnt 3s ease-in-out infinite}
body.night .bhouse::before{content:'🌙';position:absolute;right:3%;top:1%;width:16%;aspect-ratio:1;display:grid;place-items:center;border-radius:50%;z-index:1;pointer-events:none;
 background:radial-gradient(circle,#1b2a5c 52%,rgba(27,42,92,0) 72%);font-size:clamp(14px,6vw,34px)}
@keyframes idnt{50%{opacity:.75}}
.idgate{text-align:center}.idbox{background:#fff;border:2px solid var(--line);border-radius:20px;padding:12px;margin-bottom:12px}
.idbox h3{margin:0 0 6px;font-size:18px;color:var(--deep)}
.idbox textarea.inp{min-height:90px;text-align:right;font-size:17px;resize:vertical}
.idbox select.inp{font-size:17px}
.idrow{display:flex;align-items:center;gap:8px;border-bottom:1px dashed var(--line);padding:6px 0;font-size:14px}.idrow:last-child{border:0}
.idrow b{flex:1;min-width:0}.idrow .av{font-size:24px}
.idban{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#0e5a3a,#14794f 60%,#1fa463);color:#fff;border-radius:22px;padding:14px 16px;margin-bottom:12px;box-shadow:0 6px 0 #0a3d27,0 10px 24px rgba(10,60,40,.25);position:relative;overflow:hidden}
.idban::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 15% 0,rgba(255,226,140,.35),transparent 55%);pointer-events:none}
.idban .sh{font-size:44px;line-height:1;filter:drop-shadow(0 3px 4px rgba(0,0,0,.3))}.idban b{display:block;font-size:22px;color:#ffe08a;letter-spacing:.3px}.idban small{font-size:14px;opacity:.95}
.idbox{border:2px solid #cfe2d6;border-radius:22px;box-shadow:0 5px 0 #e1eee6;background:linear-gradient(#fff,#fbfefc)}
.idbox h3{font-size:20px;border-bottom:2px solid #eef5f0;padding-bottom:8px;margin-bottom:10px}
.idk{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #e6efe9;border-radius:18px;padding:8px 10px;margin-bottom:8px;cursor:pointer;box-shadow:0 3px 0 #eef5f0}
.idk:active{transform:translateY(2px);box-shadow:0 1px 0 #eef5f0}
.idk.top1{border-color:#e9c14a;background:linear-gradient(#fffbea,#fff)}.idk.top2{border-color:#b9c3cc}.idk.top3{border-color:#d6a27a}
.idk .rk{width:30px;text-align:center;font-weight:800;font-size:21px;color:#6b7f74;flex:none}
.idk .av{position:relative;font-size:38px;line-height:1;flex:none}.idk .av i.on{position:absolute;bottom:0;left:-2px;width:12px;height:12px;border-radius:50%;background:#1fa463;border:2px solid #fff}
.idk .nm{flex:1;min-width:0}.idk .nm b{display:block;font-size:20px;font-weight:800;color:#0b3d27;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.idk .nm small{display:block;font-size:13.5px;color:#8a5a00;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.idk.gone{background:#f4f4f2;border-style:dashed;border-color:#c4c9c6}.idk.gone .av{filter:grayscale(.8);opacity:.75}.idk .nm small.gn{color:#8a8f8c;font-size:13.5px}
.idk .nm small.st1{color:#14794f;font-size:14.5px;white-space:pre}
.idk .stt{font-size:14px;font-weight:800;color:#3d5a4b;text-align:center;white-space:pre;flex:none;background:#f1f7f3;border-radius:12px;padding:4px 8px}
.idk .gb{flex:none;width:44px;height:44px;border-radius:14px;border:0;font-size:22px;background:linear-gradient(#f59a3c,#e0731f);box-shadow:0 3px 0 #a8551a;color:#fff}
.idfh{font-size:17px;font-weight:800;color:#0b3d27;background:linear-gradient(160deg,#fff,#e8f6ee);border:1.5px solid #bfe3cc;box-shadow:0 3px 0 #bfe3cc;border-radius:14px;padding:6px 10px;margin-bottom:8px;text-align:center}
.idsubs{display:flex;align-items:center;gap:12px;width:100%;margin-bottom:12px;padding:10px 14px;border-radius:20px;text-align:right;color:inherit;
 background:linear-gradient(160deg,#fff 0%,#e7f1fd 90%);border:2px solid #bcd5f3;box-shadow:0 5px 0 #bcd5f3,0 8px 14px rgba(20,60,90,.1),inset 0 1px 0 #fff}
.idst:active{transform:translateY(2px);box-shadow:0 1px 0 var(--d)}
.idsubs:active{transform:translateY(3px);box-shadow:0 2px 0 #bcd5f3}
.idsubs .e{font-size:38px;line-height:1}.idsubs .t{flex:1;min-width:0}.idsubs b{display:block;font-size:21px;color:#1d4e9e}.idsubs small{display:block;font-size:13.5px;font-weight:700;color:#3d5a4b}.idsubs .go{font-size:28px;color:#2f6fd0}
.idkg{display:grid;grid-template-columns:1fr 1fr;gap:7px}
/* v7.3: بطاقات الأطفال صغيرة، اثنتان في كل سطر، مجسّمة بألوان خفيفة */
.idkg .idk{--c:#e8f6ee;--d:#bfe3cc;position:relative;flex-direction:column;gap:0;margin:0;padding:6px 4px 6px;text-align:center;border-radius:14px;min-width:0;
 background:linear-gradient(160deg,#fff 0%,var(--c) 90%);border:1.5px solid var(--d);box-shadow:0 3px 0 var(--d),0 5px 8px rgba(20,60,40,.08),inset 0 1px 0 #fff}
.idkg .idk:nth-child(6n+2){--c:#e7f1fd;--d:#bcd5f3}.idkg .idk:nth-child(6n+3){--c:#fdeaf2;--d:#f2c3d6}.idkg .idk:nth-child(6n+4){--c:#fff5dc;--d:#efd99a}
.idkg .idk:nth-child(6n+5){--c:#efe9fb;--d:#d3c6f0}.idkg .idk:nth-child(6n){--c:#e3f6f6;--d:#b4e0df}
.idkg .idk.top1{--c:#fff1c2;--d:#e9c14a}.idkg .idk.top2{--c:#eef1f4;--d:#b9c3cc}.idkg .idk.top3{--c:#f8e6d8;--d:#d6a27a}
.idkg .idk.gone{--c:#f1f1ef;--d:#c4c9c6}
.idkg .idk .rk{position:absolute;top:3px;right:5px;width:auto;font-size:15px}
.idkg .idk .gb{position:absolute;top:4px;left:4px;width:30px;height:30px;border-radius:10px;font-size:15px;box-shadow:0 2px 0 #a8551a}
.idkg .idk .av{font-size:28px;line-height:1.15}
.idkg .idk .nm{width:100%}.idkg .idk .nm b{font-size:15px;line-height:1.3;padding:0 2px}
.idkg .idk .nm small,.idkg .idk .nm small.st1{font-size:12px;line-height:1.35;white-space:nowrap}
.idsts{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.idst{font:inherit;color:inherit;width:100%;cursor:pointer;display:block;--c:#e8f6ee;--d:#bfe3cc;background:linear-gradient(160deg,#fff 0%,var(--c) 85%);border:1.5px solid var(--d);border-radius:12px;padding:3px 2px 4px;text-align:center;min-width:0;box-shadow:0 3px 0 var(--d),0 5px 8px rgba(20,60,40,.08),inset 0 1px 0 #fff}
/* v7.2: مجسّمة بألوان خفيفة متناوبة */
.idst:nth-child(6n+2){--c:#e7f1fd;--d:#bcd5f3}.idst:nth-child(6n+3){--c:#fdeaf2;--d:#f2c3d6}.idst:nth-child(6n+4){--c:#fff5dc;--d:#efd99a}
.idst:nth-child(6n+5){--c:#efe9fb;--d:#d3c6f0}.idst:nth-child(6n){--c:#e3f6f6;--d:#b4e0df}
.idst div{display:flex;align-items:center;justify-content:center;gap:4px;line-height:1.25}.idst span{font-size:15px}.idst b{font-size:19px;color:#0b3d27}
.idst small{display:block;font-size:13.5px;font-weight:700;color:#3d5a4b;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* v10.4: هيبة لوحة الإدارة — شارة ملكية خضراء وذهبية بنقش إسلامي، وأرقام كبيرة واضحة */
.idroy{position:relative;overflow:hidden;border-radius:24px;padding:14px 14px 12px;margin-bottom:12px;color:#fff;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cg fill='none' stroke='%23f3d27a' stroke-opacity='.13' stroke-width='1.2'%3E%3Cpath d='M22 4l5 13 13 5-13 5-5 13-5-13-13-5 13-5z'/%3E%3Crect x='13' y='13' width='18' height='18' transform='rotate(45 22 22)'/%3E%3C/g%3E%3C/svg%3E"),
 radial-gradient(circle at 85% 0,rgba(255,215,120,.28),transparent 50%),linear-gradient(150deg,#06341f 0%,#0b4d30 45%,#116b42 100%);
 border:2px solid #d9b45a;box-shadow:0 6px 0 #6e5418,0 12px 26px rgba(8,45,28,.35),inset 0 0 0 4px rgba(6,52,31,.9),inset 0 0 0 5px rgba(243,210,122,.55)}
.idroy::after{content:'';position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,240,190,.22),transparent);transform:skewX(-18deg);animation:idshine 6s ease-in-out infinite;pointer-events:none}
@keyframes idshine{0%,60%{left:-60%}100%{left:130%}}
.idroy .hd{display:flex;align-items:center;gap:12px;position:relative;z-index:1}
.idroy .md{flex:none;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;font-size:32px;position:relative;
 background:radial-gradient(circle at 35% 30%,#1a7a4c,#08402a 70%);border:3px solid #e9c768;box-shadow:0 0 0 3px #08402a,0 0 0 5px rgba(233,199,104,.6),0 6px 14px rgba(0,0,0,.35)}
.idroy .md i{position:absolute;top:-15px;left:50%;transform:translateX(-50%);font-style:normal;font-size:20px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))}
.idroy .tt{flex:1;min-width:0}
.idroy .tt b{display:block;font-size:25px;font-weight:900;line-height:1.3;background:linear-gradient(180deg,#fff3c4,#f0c75a 55%,#c9962c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(0,0,0,.35))}
.idroy .tt small{display:block;font-size:13.5px;font-weight:700;color:#f6e3a8}
.idroy .tt em{display:block;font-style:normal;font-size:12.5px;color:#cfe8da;margin-top:1px}
.idroy .orn{position:relative;z-index:1;height:12px;margin:8px 6px 9px;background:linear-gradient(90deg,transparent,#e9c768 20%,#e9c768 80%,transparent) center/100% 1.5px no-repeat}
.idroy .orn::before{content:'۞';position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);font-size:16px;line-height:1;color:#f0c75a;background:#0c5133;padding:0 8px}
.idroy .kp{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;position:relative;z-index:1}
.idroy .kp button{font:inherit;color:#fff;cursor:pointer;min-width:0;border-radius:15px;padding:6px 2px 5px;text-align:center;
 background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.05));border:1.5px solid rgba(233,199,104,.75);box-shadow:0 3px 0 rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.25)}
.idroy .kp button:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(0,0,0,.28)}
.idroy .kp b{display:block;font-size:24px;font-weight:900;line-height:1.2;color:#ffe08a}
.idroy .kp small{display:block;font-size:12.5px;font-weight:700;color:#e8f5ee;white-space:nowrap}
.idroy .nw{position:relative;z-index:1;display:block;width:100%;margin-top:8px;font:inherit;font-size:14px;font-weight:800;color:#3b2a00;cursor:pointer;border-radius:14px;padding:6px 8px;
 background:linear-gradient(180deg,#fff0b8,#f0c75a);border:1.5px solid #fff3c4;box-shadow:0 3px 0 #9a7420,0 0 14px rgba(255,214,110,.45)}
.idroy .nw[hidden]{display:none}
.idroy .nw:active{transform:translateY(2px);box-shadow:0 1px 0 #9a7420}
.idroy .nw .bl{display:inline-block;animation:idbell 1.4s ease-in-out infinite}
@keyframes idbell{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(-18deg)}80%{transform:rotate(14deg)}90%{transform:rotate(-8deg)}}
.idroy .ft{position:relative;z-index:1;text-align:center;font-size:12.5px;color:#cfe8da;margin-top:8px}
.idroy .on{display:inline-block;width:9px;height:9px;border-radius:50%;background:#3ee07f;box-shadow:0 0 0 0 rgba(62,224,127,.7);animation:idpul 1.6s infinite;vertical-align:middle}
@keyframes idpul{70%{box-shadow:0 0 0 8px rgba(62,224,127,0)}100%{box-shadow:0 0 0 0 rgba(62,224,127,0)}}
#idara.on{background:radial-gradient(120% 60% at 50% 0,#fff9e8,transparent 70%),linear-gradient(#fbf7ec,#f1ede0)}
.idsect{text-align:center;font-weight:900;font-size:17px;color:#8a6414;letter-spacing:.5px;margin:2px 0 8px}
.idtools{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}
.idtools button{font:inherit;cursor:pointer;min-width:0;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center;text-align:right;
 padding:9px 10px;border-radius:18px;color:#fff;border:1.5px solid #d9b45a;background:linear-gradient(160deg,#17734b,#0b4d31 70%);
 box-shadow:0 4px 0 #8a6414,0 8px 16px rgba(10,60,35,.22),inset 0 1px 0 rgba(255,240,190,.45)}
.idtools button:active{transform:translateY(3px);box-shadow:0 1px 0 #8a6414,inset 0 1px 0 rgba(255,240,190,.45)}
.idtools span{grid-row:1/3;font-size:30px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))}
.idtools b{font-size:16.5px;font-weight:900;color:#ffe9a8;line-height:1.3}.idtools small{font-size:12px;font-weight:700;color:#cfe8da;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.idtools #idSubs{background:linear-gradient(160deg,#c9962c,#8a6414 75%);border-color:#ffe08a;box-shadow:0 4px 0 #5e420a,0 8px 16px rgba(80,50,10,.25),inset 0 1px 0 rgba(255,250,220,.6)}
.idtools #idSubs b{color:#fff7d6}.idtools #idSubs small{color:#fff0c2}
.idgrp{margin-bottom:10px}.idgrp:last-of-type{margin-bottom:4px}.idgrp .gh{font-size:14.5px;font-weight:900;color:#8a6414;margin:0 2px 5px;display:flex;align-items:center;gap:6px}
.idgrp .gh::after{content:'';flex:1;height:1.5px;background:linear-gradient(90deg,#e3cf95,transparent)}
.idmain .idbox{background:linear-gradient(#fffdf7,#fff)}
.idsig{text-align:center;font-size:12.5px;color:#a08440;font-weight:700;margin:4px 0 0}
.idlb{display:block;text-align:right;font-weight:800;font-size:14.5px;margin:6px 2px -4px;color:#0b4d31}
.idrep{white-space:pre-wrap;text-align:right;direction:rtl;font:inherit;font-size:14px;line-height:1.8;background:#f8f5ea;border:1.5px solid #e3d3a2;border-radius:14px;padding:8px 10px;max-height:46vh;overflow:auto}
#idPin{grid-column:1/-1;display:flex;align-items:center;gap:10px;width:100%;font:inherit;text-align:right;cursor:pointer;padding:8px 12px;border-radius:18px;color:#5a3d00;
 border:1.5px solid #e9c14a;background:linear-gradient(160deg,#fff8dc,#ffe7a0);box-shadow:0 4px 0 #d8a52a,0 6px 12px rgba(150,100,10,.15),inset 0 1px 0 #fff;animation:idpin 2.6s ease-in-out infinite}
#idPin .e{font-size:28px}#idPin .t{flex:1;min-width:0}#idPin b{display:block;font-size:16px}#idPin small{display:block;font-size:12.5px;font-weight:700;color:#7a5a12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#idPin .go{font-size:24px;color:#c98a12}
@keyframes idpin{50%{transform:translateY(-2px)}}
.idmain .idbox{border-color:#e3d3a2;box-shadow:0 5px 0 #eadfbd,0 8px 16px rgba(80,60,10,.06)}
.idmain .idbox h3{color:#0b4d30;border-bottom:0;padding-bottom:10px;background:linear-gradient(90deg,transparent,#d9b45a 25%,#d9b45a 75%,transparent) bottom/100% 2px no-repeat}
.idmain .idst b{font-size:21px}.idmain .idst span{font-size:16px}
.idmain .idst small{font-size:13px;white-space:normal;overflow:visible}
.idmsg .em{font-size:60px;line-height:1.2}.idmsg p{white-space:pre-wrap;text-align:right;line-height:1.9}
`;
document.head.appendChild(css);
// (v19.4) طلب الشيخ: الليل والنهار حسب الوقت الحقيقي لمدينة الطفل — الليل من المغرب إلى الفجر (يتغيّر مع الفصول)، لا ساعات ثابتة
function dayNight(){const now=new Date(),h=now.getHours()+now.getMinutes()/60;let f=5,m=18;
  try{const t=Adhan.times(now),a=new Date(+t.fajr),b=new Date(+t.maghrib),x=a.getHours()+a.getMinutes()/60,y=b.getHours()+b.getMinutes()/60;if(x>2&&x<8)f=x;if(y>15&&y<21.5)m=y}catch(e){}
  const n=h>=m||h<f;document.body.classList.toggle('night',n);return n}
dayNight();setInterval(dayNight,60000);
// عرض البيت ثلاثي الأبعاد يبدأ ليليًّا في الليل
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.classList&&n.classList.contains('v3ov')&&dayNight()){n.classList.add('night');const b=n.querySelector('#v3n');if(b)b.textContent='☀️'}}))).observe(document.body,{childList:true});

/* ---------- الاستلام: رسائل الإدارة، جوائز الطفل، جائزة بطل الأسبوع ---------- */
const queue=[];let showing=false;
function nextMsg(){if(showing||!queue.length||$('#modal').classList.contains('on')||document.querySelector('.v3ov'))return;
  const m=queue.shift();showing=true;
  try{fanfare();if(m.j)confetti()}catch(e){}
  if(m.j&&window.Deco)Deco.addJ(m.j);
  if(m.jm&&window.Deco)Deco.takeJ(m.jm);
  modal(`<div class="idmsg"><div class="em">${m.em||'📢'}</div><h3 style="margin:2px 0">${esc(m.title||'رسالة من إدارة جنّتي الصغيرة')}</h3>${m.msg?`<p>${esc(m.msg)}</p>`:''}
    ${m.jm?`<div class="cupbox"><b>💎 −${ar(m.jm)}</b>خصمتها الإدارة من جواهرك</div>`:''}${m.x?`<div class="cupbox ${m.x>0?'win':''}"><b>✨ ${m.x>0?'+':'−'}${ar(Math.abs(m.x))} نقطة</b>${m.x>0?'أضافتها الإدارة لك':'خصمتها الإدارة'}</div>`:''}${m.j?`<div class="cupbox win" style="border-color:#9fd3f0;background:linear-gradient(160deg,#eaf6ff,#fff);color:#1d4e9e"><b>💎 +${ar(m.j)}</b>${B('هديتك','هديتكِ')} لتزيين بيتك في الجنة!</div>`:''}
    <div class="nav"><button class="btn gold" id="idOk">${m.j?'جزاكم الله خيرًا 🤍':'حسنًا 🌷'}</button></div></div>`,()=>{
    $('#idOk').onclick=()=>{closeModal();showing=false;m.done&&m.done();setTimeout(nextMsg,400)}})}
setInterval(nextMsg,3000);
async function inbox(){const API=O();if(!API||!navigator.onLine)return;
  try{await API.init()}catch(e){return}
  if(!API.db||!API.me)return;const d=D();d.newsSeen=d.newsSeen||{};if(!d.newsFrom){d.newsFrom=Date.now()-14*864e5;Aamal.save()}
  try{const s=(await API.db.ref('news').orderByChild('ts').limitToLast(10).get()).val()||{};
    Object.entries(s).sort((a,b)=>(a[1].ts||0)-(b[1].ts||0)).forEach(([id,v])=>{if(!v||d.newsSeen[id]||(v.ts||0)<d.newsFrom)return;
      d.newsSeen[id]=1;const x=Math.max(0,Math.min(500,v.x|0));if(x){d.xpAdj=(d.xpAdj|0)+x;try{Alqab.soon()}catch(e){}}Aamal.save();queue.push({title:v.title,msg:v.msg,j:Math.min(500,v.j|0),x,em:v.x||v.j&&!v.msg?'🎁':'📢'})});
    pinShow(Object.values(s).filter(v=>v&&+v.pin>Date.now()).sort((a,b)=>(b.ts||0)-(a.ts||0))[0])}catch(e){}
  try{const p=(await API.db.ref('prizes/'+API.me).get()).val()||{};
    Object.entries(p).forEach(([id,v])=>{if(!v||d.newsSeen['p'+id])return;d.newsSeen['p'+id]=1;Aamal.save();
      const done=()=>API.db.ref(`prizes/${API.me}/${id}`).remove().catch(()=>{});
      // (v18.4) أوامر المدير: cl = نظّف بيته عنه، bd = بناية هدية في مدينته، cr = تذكير بتنظيف البيت
      if(v.cl){try{Aamal.cleanAll()}catch(e){}queue.push({em:'🧽',title:'🧽 نظّفت الإدارة بيتك هدية!',msg:(v.msg?v.msg+'\n':'')+B('حافظ','حافظي')+' على نظافته بأعمالك الصالحة كل يوم 🤍',j:Math.max(0,Math.min(1000,v.j|0)),done});return}
      if(typeof v.bd=='string'&&window.Madina&&Madina.PARTS[v.bd]){const ok=Madina.giftLv(v.bd),P=Madina.PARTS[v.bd];queue.push({em:'🏗️',title:'🏗️ هدية من الإدارة لمدينتك!',msg:ok?`بنت لك الإدارة مستوى جديدًا من ${P.e} ${P.n} 🌟${v.msg?'\n'+v.msg:''}`:`${P.e} ${P.n} عندك كاملة، ${B('أحسنت','أحسنتِ')}! 🌟${v.msg?'\n'+v.msg:''}`,j:ok?0:Math.max(0,Math.min(1000,v.j|0))||30,done});return}
      if(v.cr){queue.push({em:'🧹',title:v.title||'🧹 تذكير من الإدارة',msg:v.msg,done});return}
      // (v21.2) الإدارة رفضت طلب تغيير الاسم: نحرّر الاسم المحجوز ونخبر الطفل
      if(typeof v.nrej=='string'){try{API.releaseNick&&API.releaseNick(v.nrej)}catch(e){}queue.push({em:'✏️',title:'✏️ عن طلب تغيير اسمك',msg:v.msg,done});return}
      if(typeof v.rn=='string'&&v.rn.trim().length>=2){renameMe(API,v.rn);queue.push({em:'✏️',title:v.ok?'✅ وافقت الإدارة على اسمك الجديد':'✏️ غيّرت الإدارة اسمك',msg:`اسمك الآن: «${v.rn.trim()}»${v.msg?'\n'+v.msg:''}`,done});return}
      const x=Math.max(-5000,Math.min(5000,v.x|0)),j=v.j|0;
      if(x||j<0){if(x){d.xpAdj=(d.xpAdj|0)+x;Aamal.save();try{Alqab.soon()}catch(e){}}
        queue.push({em:x<0||j<0?'⚖️':'🎁',title:x<0||j<0?'تعديل من الإدارة':'🎁 هدية من الإدارة!',msg:v.msg,x,j:Math.max(0,Math.min(1000,j)),jm:Math.max(0,-j),done});return}
      queue.push({title:v.w?'⚠️ تنبيه من الإدارة':(v.title||'🎁 جائزة خاصة لك من الإدارة!'),msg:v.msg,j:v.w?0:Math.min(1000,v.j|0),em:v.w?'⚠️':'🎁',done:()=>API.db.ref(`prizes/${API.me}/${id}`).remove().catch(()=>{})})})}catch(e){}
  try{const b=(await API.db.ref('bans/'+API.me).get()).val();if(b&&b.until>API.now()&&d.banSeen!==b.until){d.banSeen=b.until;Aamal.save();const t=new Date(b.until);
    queue.unshift({em:'⛔',title:'توقّف لعبك أونلاين مؤقتًا',msg:`أوقفت الإدارة اللعب أونلاين حتى ${t.toLocaleDateString('ar-IQ',{weekday:'long',day:'numeric',month:'long'})}.${b.why?`\nالسبب: ${b.why}`:''}\nتستطيع أن تتعلّم وتحفظ وتبني بيتك كالعادة 🤍`})}}catch(e){}
  try{if(API.profile)await weekPrize(API)}catch(e){}
  // 📨 (v21.2) للمدير فقط: رسالة إذا وصلت طلبات تغيير أسماء جديدة، وزر يفتحها مباشرة
  try{if(API.profile&&API.profile.adm){await loadReqs(API);const ids=Object.keys(nreqs),nw=ids.filter(i=>!d.nreqSeen||!d.nreqSeen[i+(nreqs[i].to||'')]);
    if(nw.length){d.nreqSeen=d.nreqSeen||{};nw.forEach(i=>d.nreqSeen[i+(nreqs[i].to||'')]=1);Aamal.save();
      const v=nreqs[nw[0]];queue.push({em:'📨',title:'📨 طلب تغيير اسم',msg:nw.length==1?`«${v.from}» يريد أن يغيّر اسمه إلى «${v.to}».\nاضغط «حسنًا» لتوافق أو ترفض.`:`عندك ${ar(ids.length)} طلبات تغيير أسماء تنتظر موافقتك.\nاضغط «حسنًا» لتراها.`,done:()=>{openAdmin().then(()=>openReqs()).catch(()=>{})}})}}}catch(e){}
  nextMsg()}
// (v13.3) 📌 إعلان مثبّت من المدير: شريط ذهبي أعلى الواجهة حتى ينتهي وقته (news.pin = وقت الانتهاء)
function pinShow(v){let el=$('#idPin');if(!v){if(el)el.remove();return}
  if(!el){el=document.createElement('button');el.id='idPin';const h=$('#home .hero');if(!h)return;h.after(el)}
  el.innerHTML=`<span class="e">📌</span><span class="t"><b>${esc(v.title||'إعلان من الإدارة')}</b>${v.msg?`<small>${esc(v.msg).slice(0,70)}</small>`:''}</span><span class="go">‹</span>`;
  el.onclick=()=>modal(`<div class="idmsg"><div class="em">📌</div><h3 style="margin:2px 0">${esc(v.title||'إعلان من الإدارة')}</h3>${v.msg?`<p>${esc(v.msg)}</p>`:''}<small style="color:var(--muted)">من إدارة جنّتي الصغيرة 🤍</small></div><div class="nav"><button class="btn gold" data-close>حسنًا 🌷</button></div>`)}
// ✏️ الإدارة غيّرت اسم الطفل: يُحفظ في ملفّه، ويُثبَّت أسبوعًا
async function renameMe(API,n){n=String(n).trim().replace(/\s+/g,' ').slice(0,16);if(!API.profile)return;
  const old=API.profile.nick;if(old===n)return;
  try{if(API.claimNick)await API.claimNick(n)}catch(e){}   // (v21.2) يحجز الاسم الجديد ويحرّر القديم
  API.profile.nick=n;state.nick=n;save();D().nickLock=Date.now()+7*864e5;Aamal.save();
  const hist=[old].concat(String(API.profile.hist||'').split('|').filter(Boolean)).filter(x=>x&&x!==n).slice(0,5).join('|');API.profile.hist=hist;
  const nc=(API.profile.nc|0)+1;API.profile.nc=nc;   // (v21.2) عدد مرات تغيير الاسم (قواعد Firebase تتحقق منه)
  try{await API.db.ref('profiles/'+API.me).update({nick:n,hist,nts:API.now(),byAdmin:true,nc})}catch(e){}
  try{API.refreshLeader()}catch(e){}try{renderHome()}catch(e){}}
// 🏆 بطل الأسبوع الماضي: الأول ١٠٠ جوهرة، الثاني ٦٠، الثالث ٣٠ (مرة واحدة لكل أسبوع)
const WKJ=[100,60,30];
async function weekPrize(API){const d=D(),last=API.week()-1;if(d.wkPrize===last)return;
  const s=(await API.db.ref('leader/'+last).get()).val()||{};
  const key=r=>Math.max(r.xp|0,(r.wins|0)*10);
  const rows=Object.entries(s).map(([id,v])=>({id,...v})).filter(r=>key(r)>0&&!r.adm).sort((a,b)=>key(b)-key(a));
  d.wkPrize=last;Aamal.save();
  const i=rows.findIndex(r=>r.id==API.me);if(i<0||i>2)return;
  queue.unshift({em:['🥇','🥈','🥉'][i],title:i==0?B('🏆 أنت بطل الأسبوع!','🏆 أنتِ بطلة الأسبوع!'):`${B('أنت','أنتِ')} ${i==1?'الثاني':'الثالث'} بين أبطال الأسبوع!`,
    msg:`ما شاء الله! ${B('كنتَ','كنتِ')} من أكثر الأطفال تعلّمًا وعملًا للخير في الأسبوع الماضي.`,j:WKJ[i]})}
setTimeout(()=>{if(state.online||navigator.onLine)inbox()},5000);
setInterval(()=>{if(document.visibilityState=='visible')inbox()},10*60000);

/* ---------- 🛡️ صفحة الإدارة ---------- */
const sec=document.createElement('section');sec.className='screen';sec.id='idara';
sec.innerHTML=`<div class="bar"><button class="back" id="idBack">›</button><div class="ttl">👑 الإدارة</div></div><div id="idBody" style="flex:1;display:flex;flex-direction:column"></div>`;
document.querySelector('.app').appendChild(sec);
$('#idBack').onclick=()=>{if(view=='kids'||view=='reqs'){backMain();return}renderHome();show('home')};
// الدخول: ٥ ضغطات على سطر الإصدار
// (v22.4) طلب الشيخ: أُلغي فتح الإدارة بالضغط ٥ مرات على رقم النسخة — الإدارة الآن في «☰ المزيد» ← «👑 أدوات المدير»
const body=()=>$('#idBody');
async function openAdmin(go){show('idara');body().innerHTML=`<div class="handoff"><div class="big spin">🛡️</div><p>جارٍ الاتصال…</p></div>`;
  const API=O();try{await API.init()}catch(e){body().innerHTML=`<div class="handoff"><div class="big">📡</div><h2>لا يوجد اتصال</h2><p>الإدارة تحتاج إنترنت.</p></div>`;return}
  let ok=false;try{ok=!!(await API.db.ref('admins/'+API.me).get()).val()}catch(e){}
  if(!ok){body().innerHTML=`<div class="idbox idgate"><div style="font-size:54px">🔒</div><h3>هذه الصفحة لمدير التطبيق فقط</h3>
      <p style="font-size:14px;color:var(--muted)">معرّف هذا الجهاز (يحتاجه المدير مرة واحدة ليفعّل الإدارة):</p>
      <div class="code-card" style="justify-content:center"><b dir="ltr" style="font-size:15px;letter-spacing:0;word-break:break-all" id="idUid">${esc(API.me)}</b></div>
      <button class="btn sec" id="idCp" style="flex:none;width:100%">📋 نسخ المعرّف</button></div>`;
    $('#idCp').onclick=()=>{try{navigator.clipboard.writeText(API.me).then(()=>API.toast('نُسخ ✓'))}catch(e){API.toast(API.me)}};return}
  if(go=='kids'){view='kids';body().innerHTML='<div class="handoff"><div class="big spin">🏙️</div><p>جارٍ التحميل…</p></div>';await loadKids(API);openKids('all');return}
  if(go=='fb')return openFb();
  try{lastV=+localStorage.getItem('usul5_admSeen')||0;localStorage.setItem('usul5_admSeen',Date.now())}catch(e){}
  panel()}
let lastV=0;
// v10.8: «أونلاين» = يلعب مباراة أونلاين الآن (profiles.pl يكتبه تطبيق الطفل عند بدء المباراة)
const plNow=p=>p.pl&&Date.now()-p.pl<20*60000;
// v17.7: «أونلاين» = داخل التطبيق الآن (profiles.on نبضة كل ٤ دقائق، تُحذف عند الخروج) أو يلعب مباراة
const onNow=p=>(p.on&&Date.now()-p.on<10*60000)||plNow(p);
// v10.7: «الجديد» = سجّل خلال آخر ٢٤ ساعة فقط
const fresh=p=>p.since>Math.max(lastV,Date.now()-864e5);
const JOPT=[0,10,25,50,100,200,500,1000].map(n=>`<option value="${n}">${n?`💎 ${ar(n)} جوهرة`:'بلا جواهر'}</option>`).join('');
let all=null,heroes=null,tab='all',q='';
const key=r=>Math.max(r.xp|0,(r.wins|0)*10);
async function loadKids(API){
  if(!heroes){try{const s=(await API.db.ref('leader/'+API.week()).get()).val()||{};heroes=Object.entries(s).map(([id,v])=>({id,...v})).filter(r=>!r.adm&&r.id!=API.me).sort((a,b)=>key(b)-key(a)).slice(0,15)}catch(e){heroes=[]}}
  if(!all){try{const s=(await API.db.ref('profiles').get()).val()||{};all=Object.entries(s).map(([id,v])=>({id,nick:v.nick||'؟',av:v.av||'❔',lv:v.lv|0,tt:v.tt||'',wins:v.wins|0,games:v.games|0,code:v.code||'',seen:+v.seen||0,acc:v.acc||{},md:v.md||'',hist:typeof v.hist=='string'?v.hist:'',nts:+v.nts||0,sx:v.sx||sexOf(v.av),since:+v.since||0,pl:+v.pl||0,on:+v.on||0,hz:(v.sm&&v.sm.hz)|0,pr:(v.sm&&v.sm.pr)|0}))}catch(e){all=[]}}
  try{bans=(await API.db.ref('bans').get()).val()||{}}catch(e){bans={}}
  try{reps=(await API.db.ref('reports').get()).val()||{}}catch(e){reps={}}}
// 🚩 بلاغات الأسماء (v20.7): reports/{الطفل}/{المبلِّغ} = {n: الاسم وقت البلاغ, t}
let reps={};const repN=id=>Object.keys(reps[id]||{}).length;
async function clearReps(id){await O().db.ref('reports/'+id).remove();delete reps[id];const c=$('#idRepN');if(c)c.textContent=repSum()}
const repSum=()=>{const n=Object.keys(reps).filter(repN).length;return n?`🔴 ${ar(n)} ${n==1?'اسم':n==2?'اسمان':n<=10?'أسماء':'اسمًا'} تنتظرك`:'لا توجد بلاغات 👍'};
let bans={};
// ولد أو بنت: من اختياره، وإلا من صورته
const sexOf=av=>/👧|🧕|👩|👸/.test(av||'')?'g':/👦|🧒|👨|👲|🤴/.test(av||'')?'b':'';
const banOf=id=>{const b=bans[id];return b&&b.until>Date.now()?b:null};
// يتعمّد الأخطاء؟ دقّة أقل من ٣٥٪ بعد ١٦ سؤالًا أونلاين، أو مباراتان بلا أي إجابة صحيحة
const accOf=p=>{const a=accToday(p);return a.q?a.r/a.q:null};
const MONTH=30*864e5,gone=p=>!!(p&&p.seen&&Date.now()-p.seen>MONTH),goneDays=p=>Math.floor((Date.now()-p.seen)/864e5);
const today=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
// v25.2 (الشيخ): «يتعمّدون الغلط» لليوم فقط؛ في اليوم التالي يخرج من القائمة إلا إذا كرّر الغلط
const accToday=p=>{const a=p.acc||{};return a.d===today()?a:{}};
const wrong=p=>{const a=accToday(p);return (a.q>=16&&a.r/a.q<.35)||(a.z|0)>=2}; // v21.3: يتعمّد الغلط بالأونلاين
const sus=p=>wrong(p)||cheat(p);
const cheat=p=>((p.sm&&p.sm.tp)|0)>0; // v20.9: غيّر أرقامه من خارج التطبيق (seal.js)
function ago(t){if(!t)return 'لم يُسجَّل بعد';const m=Math.round((Date.now()-t)/60000);
  const w=(n,one,two,few,many)=>n==1?one:n==2?two:n<=10?`${ar(n)} ${few}`:`${ar(n)} ${many}`;
  if(m<2)return 'الآن';if(m<60)return 'قبل '+w(m,'دقيقة','دقيقتين','دقائق','دقيقة');const h=Math.round(m/60);if(h<24)return 'قبل '+w(h,'ساعة','ساعتين','ساعات','ساعة');
  const d=Math.round(h/24);return d<30?'قبل '+w(d,'يوم','يومين','أيام','يومًا'):new Date(t).toLocaleDateString('ar-IQ')}
function kidRow(r,i){const p=all&&all.find(x=>x.id==r.id)||{};const lv=r.lv||p.lv,tt=r.tt||p.tt,b=banOf(r.id),w=r.wins||p.wins,on=onNow(p)||(p.seen&&Date.now()-p.seen<180000);
  const rk=i!=null?(['🥇','🥈','🥉'][i]||ar(i+1)):'';
  const sub=esc(tt||'');
  const st=[lv?`⭐ ${ar(lv)}`:'',r.xp?`✨ ${ar(r.xp)}`:'',w?`🏆 ${ar(w)}`:''].filter(Boolean).join('  ');
  const gn=gone(p);
  return `<div class="idk ${i!=null&&i<3?'top'+(i+1):''} ${gn?'gone':''}" data-k="${esc(r.id)}"><span class="rk">${rk}</span><span class="av">${esc(p.av||r.av)}${on?'<i class="on"></i>':''}</span>
    <span class="nm"><b>${esc(p.nick||r.nick)}${b?' ⛔':''}${cheat(p)?' 🔢':''}${wrong(p)?' ⚠️':''}${gn?' 💤':''}</b>${gn?`<small class="gn">💤 غائب منذ ${ar(goneDays(p))} يومًا</small>`:''}${tab=='pnow'?(plNow(p)?`<small class="gn" style="color:#14794f">🎮 يلعب مباراة الآن · بدأ ${ago(p.pl)}</small>`:`<small class="gn" style="color:#14794f">🟢 داخل التطبيق الآن</small>`):''}${tab=='hz'?`<small class="gn" style="color:#14794f">📖 حفظ ${ar(p.hz)} ${p.hz>2&&p.hz<11?'سور':'سورة'}</small>`:''}${tab=='pr'?`<small class="gn" style="color:#14794f">🕌 ${ar(p.pr)} صلاة</small>`:''}${(tab=='new'||tab=='fresh')&&p.since?`<small class="gn" style="color:#14794f">🆕 سجّل ${ago(p.since)}</small>`:''}${repN(r.id)?`<small class="gn" style="color:#c43d38">🚩 بلّغ عن اسمه ${ar(repN(r.id))}</small>`:''}${tab=='names'&&p.hist?`<small class="gn">✏️ كان: ${esc(p.hist.split('|').join('، '))} · ${ago(p.nts)}</small>`:''}${st?`<small class="st1">${st}</small>`:''}${sub?`<small>${sub}</small>`:''}</span>
    <button class="gb" data-g="${esc(r.id)}" aria-label="جائزة">🎁</button></div>`}
/* 📋 تفاصيل تقدّم الطفل للمدير: مربعات صغيرة مجسّمة */
function kidDetails(sm,HL){const u=String((sm&&sm.u)||(HL&&HL.u)||'00000'),W=['لا يوجد','خشبي','حجري','رخامي'],G=['لم تُزرع','خضراء','ورود وممرّ','نافورة'];
  const RK=HL&&window.Bayt&&Bayt.rankOf?Bayt.rankOf(HL.c):null;
  if(!sm&&!HL)return `<p class="tip" style="margin:6px 0">📋 تظهر تفاصيل تقدّمه بعد أن يفتح التطبيق المحدّث مع الإنترنت</p>`;
  const t=(e,v,l)=>`<div class="idst"><div><span>${e}</span><b>${v}</b></div><small>${l}</small></div>`,T=[+u[2],+u[3],+u[4]].filter(x=>x>0);
  return `<div class="idsts" style="margin:6px 0">
    ${t('🏠',ar(HL?HL.f:(sm?sm.fl:0))+' / ٥','طوابق بيته')}${t('🏆',ar(HL?Math.round(HL.c):(sm?sm.cu:0)),RK?RK.name:'كؤوس')}${sm?t('💎',ar(sm.j),'جواهره'):''}
    ${sm?t('📚',ar(sm.st)+' / ٦','مراحل الكتاب'):''}${sm?t('⭐',ar(sm.sr),'نجوم الدروس'):''}${sm?t('✨',ar(sm.xp),'نقاطه'):''}
    ${sm?t('📖',ar(sm.hz),'سور حفظها'):''}${sm?t('🤲',ar(sm.pr),'صلوات سجّلها'):''}${sm?t('🕌',ar(sm.fq),'تعلّم الصلاة'):''}
    ${sm?t('💚',ar(sm.sl),'صلاة على النبي'):''}${sm?t('📿',ar(sm.ts),'تسبيح'):''}${sm?t('🔥',ar(sm.wd),'أطول ورد'):''}
    ${sm?t('🌷',ar(sm.ak),'أخلاق'):''}${sm?t('🏅',ar(sm.ttl),'إنجازات'):''}${t('🕌',(sm?sm.mq:(HL&&HL.i.includes('d_mosque')))?'✓':'—','عنده مسجد')}
    ${t('🧱',W[+u[0]],'سور البيت')}${t('🌳',G[+u[1]],'الحديقة')}${t('🍎',ar(T.length)+' / ٣','أشجاره')}
    ${sm?t(sm.dt?'🧹':'✨',sm.dt?'متّسخ':'نظيف','بيته الآن'):''}</div>`}
/* 👁 بطاقة الطفل: كل معلوماته، وأزرار التنبيه والحظر والجائزة */
async function kidCard(id){const API=O();let p=(all||[]).find(x=>x.id==id);
  try{const v=(await API.db.ref('profiles/'+id).get()).val();if(v)p=Object.assign({id},p||{},{nick:v.nick,av:v.av,lv:v.lv|0,tt:v.tt||'',wins:v.wins|0,games:v.games|0,code:v.code||'',seen:+v.seen||0,acc:v.acc||{},md:v.md||'',hist:typeof v.hist=='string'?v.hist:'',nts:+v.nts||0,since:+v.since||0,sx:v.sx||sexOf(v.av)})}catch(e){}
  if(!p)return;let on=false;try{on=!!(await API.db.ref('presence/'+id).get()).val()}catch(e){}
  // v8.2: بيت الطفل كما يراه، وملخّص تقدّمه (sm)
  let hv=null,sm=null,pf=null;try{pf=(await API.db.ref('profiles/'+id).get()).val()}catch(e){}try{hv=(await API.db.ref('houses/'+id).get()).val()}catch(e){}try{sm=(await API.db.ref('profiles/'+id+'/sm').get()).val()}catch(e){}
  const HL=hv&&window.Deco&&Deco.cleanLook?Deco.cleanLook(hv):null;
  const b=banOf(id),a=accToday(p),ac=accOf(p);
  const md=String(p.md||'').split(',').filter(Boolean).map(x=>{const [k,t]=x.split(':');return `${['','🥉','🥈','🥇','💎'][t|0]||''}${{usul:'📚',pray:'🤲',fiqh:'🕌',hifz:'📖',tilawa:'🎤',sal:'💚',tas:'📿',champ:'⚔️',akhlaq:'🌷',wird:'🔥',banna:'🏡',garden:'🌱'}[k]||''}`}).join(' ');
  modal(`${HL&&window.Bayt?`<div class="bhouse" style="height:170px;margin-bottom:6px">${Bayt.houseSVG(HL.f,-1,0,true,false,HL)}</div>`:''}
    <div style="font-size:${HL?40:56}px;line-height:1.2">${esc(p.av)}</div><h3 style="margin:2px 0">${esc(p.nick)}</h3>
    <p style="margin:2px 0">${p.lv?`<span class="aqlv">⭐ المستوى ${ar(p.lv)}</span>`:''} ${p.tt?`<span class="aqtt">${esc(p.tt)}</span>`:''}</p>
    ${md?`<p style="font-size:20px;margin:4px 0">${md}</p>`:''}
    ${kidDetails(sm,HL)}
    <div style="text-align:right;font-size:15px;line-height:1.9;background:#f6fbf8;border-radius:14px;padding:6px 10px">
      ${on?'🟢 متصل الآن':`🕒 آخر دخول: <b>${ago(p.seen)}</b>`}<br>
      🏆 ${ar(p.wins)} فوز من ${ar(p.games)} مباراة أونلاين<br>
      🎯 دقّة إجاباته اليوم: <b>${ac!=null?ar(Math.round(ac*100))+'٪':'—'}</b>${a.q?` (${ar(a.r|0)} صحيحة من ${ar(a.q)})`:''}${a.z?`<br>⚠️ ${ar(a.z)} مباراة بلا أي إجابة صحيحة`:''}<br>
      🔑 الرمز: <b dir="ltr">${esc(p.code)}</b>${p.sx?` · ${p.sx=='g'?'👧 بنت':'👦 ولد'}`:''}
      ${p.since?`<br>📅 سجّل: ${new Date(p.since).toLocaleDateString('ar-IQ')}`:''}
      ${p.hist?`<br>✏️ أسماؤه السابقة: <b>${esc(p.hist.split('|').join('، '))}</b>${p.nts?` (آخر تغيير ${ago(p.nts)})`:''}`:''}
      ${b?`<br>⛔ <b style="color:#c43d38">محظور حتى ${new Date(b.until).toLocaleString('ar-IQ',{weekday:'long',hour:'numeric',minute:'2-digit'})}</b>${b.why?` — ${esc(b.why)}`:''}`:''}
      ${cheat(p)?`<br><b style="color:#c0392b">🔢 غيّر أرقامه من خارج التطبيق (${ar(p.sm.tp)} مرّة) ورجّعناها</b>`:''}${wrong(p)?`<br><b style="color:#b06a2c">⚠️ قد يتعمّد الإجابات الخاطئة</b>`:''}</div>
    ${repN(id)?`<div style="text-align:right;font-size:15px;line-height:1.8;background:#fdecea;border:2px solid #e2504a;border-radius:14px;padding:6px 10px;margin-top:6px">
      🚩 <b style="color:#c43d38">بلّغ عن اسمه ${repN(id)==1?'طفل واحد':repN(id)==2?'طفلان':ar(repN(id))+(repN(id)<=10?' أطفال':' طفلًا')}</b><br>
      <small>الاسم وقت البلاغ: <b>${esc([...new Set(Object.values(reps[id]).map(v=>v&&v.n).filter(Boolean))].join('، ')||p.nick)}</b> · آخر بلاغ ${ago(Math.max(...Object.values(reps[id]).map(v=>+(v&&v.t)||0)))}</small>
      <div class="nav" style="margin-top:4px"><button class="btn" id="kRepName" style="background:#2f6fd0;box-shadow:0 5px 0 #1d4e9e">✏️ غيّر اسمه</button><button class="btn sec" id="kRepOk">✓ الاسم عادي</button></div></div>`:''}
    <div class="nav"><button class="btn" id="kCity" style="background:linear-gradient(135deg,#1fa463,#14794f);box-shadow:0 5px 0 #0c5a39;font-size:17px">🏙️ ادخل مدينته وشاهد بيته</button></div>
    ${sm&&sm.dt?`<div class="nav"><button class="btn" id="kDirt" style="background:#8a5a2b;box-shadow:0 5px 0 #5e3b1a">🧹 نبّهه: بيته متّسخ (${ar(sm.dt)} من ٤)</button></div>`:''}
    <div class="nav"><button class="btn gold" id="kGift">🎁 جائزة</button><button class="btn" id="kWarn" style="background:#e57c1f;box-shadow:0 5px 0 #a8551a">⚠️ تنبيه</button></div>
    <div class="nav">${b?`<button class="btn" id="kUnban">✅ رفع الحظر</button>`:`<button class="btn" id="kBan1" style="background:#c43d38;box-shadow:0 5px 0 #8a2a26">⛔ حظر ٢٤ ساعة</button><button class="btn" id="kBan7" style="background:#7a1f1b;box-shadow:0 5px 0 #4a1210">⛔ حظر أسبوع</button>`}</div>
    <div class="nav"><button class="btn" id="kName" style="background:#2f6fd0;box-shadow:0 5px 0 #1d4e9e">✏️ غيّر اسمه</button><button class="btn" id="kAdj" style="background:#7c4dc4;box-shadow:0 5px 0 #4f2e86">💎 جواهر ونقاط</button></div>
    <div class="nav"><button class="btn" id="kBuild" style="background:#0f8f86;box-shadow:0 5px 0 #0a6660">🏗️ ابنِ له بناية</button><button class="btn" id="kMsg" style="background:#d0569a;box-shadow:0 5px 0 #993c70">📩 رسالة خاصة</button></div>
    <div class="nav"><button class="btn" id="kClean" style="background:#4e8fd6;box-shadow:0 5px 0 #2f63a0">🧽 نظّف بيته هدية</button><button class="btn" id="kCheer" style="background:#e3a21a;box-shadow:0 5px 0 #a8730c">🌟 شجّعه</button></div>
    <div class="nav"><button class="btn sec" id="kHero">🗑️ شيله من أبطال الأسبوع</button></div>
    <div class="nav"><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    $('#kGift').onclick=()=>{closeModal();giftTo(id,p.nick,p.av)};
    $('#kWarn').onclick=()=>warnTo(id,p);
    $('#kName').onclick=()=>renameKid(id,p);
    const rn=$('#kRepName');if(rn)rn.onclick=()=>renameKid(id,p);
    const ro=$('#kRepOk');if(ro)ro.onclick=async()=>{try{await clearReps(id);closeModal();API.toast('حُذف البلاغ ✓');drawKids()}catch(e){API.toast('تعذّر')}};
    $('#kAdj').onclick=()=>adjustKid(id,p);
    const r={id,nick:p.nick,av:p.av,m:hv&&/^[0-3]{5}$/.test(hv.m||'')?hv.m:'',u:hv&&hv.u||'',f:hv?hv.f|0:1,h:hv,p:{nick:p.nick,av:p.av},flg:pf&&pf.flg,dt:sm?sm.dt|0:0,sm,lv:p.lv};
    $('#kCity').onclick=()=>{closeModal();if(!(window.City3D&&City3D.adminVisit&&City3D.adminVisit(r)))API.toast('هذا الجهاز لا يعرض المدينة المجسّمة')};
    const kd=$('#kDirt');if(kd)kd.onclick=()=>kidDo(id,'clean',p);
    $('#kBuild').onclick=()=>buildFor(id,p,hv);$('#kMsg').onclick=()=>kidDo(id,'msg',p);
    $('#kClean').onclick=()=>kidDo(id,'wash',p);$('#kCheer').onclick=()=>kidDo(id,'cheer',p);
    const ban=(h,label)=>modal(`<div style="font-size:50px">⛔</div><h3 style="margin:4px 0">حظر ${esc(p.nick)} ${label}؟</h3><p style="font-size:15px">يُمنع من اللعب أونلاين فقط، ويبقى يتعلّم ويبني بيته.</p>
      <input class="inp" id="bWhy" maxlength="80" placeholder="السبب (يراه الطفل)، مثل: تعمّد الإجابات الخاطئة" style="text-align:right;font-size:16px">
      <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn" id="bYes" style="background:var(--bad)">حظر</button></div>`,()=>{
      $('#bYes').onclick=async()=>{const why=$('#bWhy').value.trim();try{const until=API.now()+h*3600e3;await API.db.ref('bans/'+id).set({until,why,ts:firebase.database.ServerValue.TIMESTAMP});bans[id]={until,why};
        await API.db.ref(`leader/${API.week()}/${id}`).remove().catch(()=>{});closeModal();API.toast(`تم حظر ${p.nick} ${label} ✓`);drawKids()}catch(e){API.toast('تعذّر الحظر')}}});
    const b1=$('#kBan1');if(b1)b1.onclick=()=>ban(24,'٢٤ ساعة');
    const b7=$('#kBan7');if(b7)b7.onclick=()=>ban(24*7,'أسبوعًا');
    const ub=$('#kUnban');if(ub)ub.onclick=async()=>{try{await API.db.ref('bans/'+id).remove();delete bans[id];closeModal();API.toast('رُفع الحظر ✓');drawKids()}catch(e){API.toast('تعذّر')}};
    $('#kHero').onclick=async()=>{try{await API.db.ref(`leader/${API.week()}/${id}`).remove();heroes=(heroes||[]).filter(x=>x.id!=id);closeModal();API.toast('شيل من أبطال الأسبوع ✓');drawKids()}catch(e){API.toast('تعذّر')}}})}
/* ✏️ تغيير اسم الطفل: يصله أمرٌ يطبّقه تطبيقه عند فتحه، ويُثبَّت اسمه أسبوعًا. ويتغيّر فورًا في أبطال الأسبوع */
function renameKid(id,p){const API=O();
  modal(`<div style="font-size:50px">${esc(p.av)}</div><h3 style="margin:4px 0">تغيير اسم «${esc(p.nick)}»</h3>
    <input class="inp" id="rnN" maxlength="16" placeholder="الاسم الجديد" style="text-align:right;font-size:18px">
    <p style="font-size:14px;color:var(--muted)">يتغيّر في جهاز الطفل عندما يفتح التطبيق مع الإنترنت، ولا يستطيع تغييره لمدة أسبوع.</p>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="rnY">✏️ غيّر</button></div>`,()=>{
    $('#rnN').focus();
    $('#rnY').onclick=async()=>{const n=$('#rnN').value.trim().replace(/\s+/g,' ');if(n.length<2){API.toast('اكتب الاسم');return}$('#rnY').disabled=true;
      try{await API.db.ref('nok/'+id).set(n);   // (v21.2) إذن من الإدارة بهذا الاسم (قواعد Firebase)
        await API.db.ref('prizes/'+id).push({msg:'',j:0,rn:n,ts:firebase.database.ServerValue.TIMESTAMP});
        const lr=API.db.ref(`leader/${API.week()}/${id}`);try{if((await lr.get()).exists())await lr.update({nick:n})}catch(e){}
        await clearReps(id).catch(()=>{});   // تغيّر الاسم ← البلاغ انتهى
        [all,heroes].forEach(L=>(L||[]).forEach(x=>{if(x.id==id){x.hist=[x.nick].concat(String(x.hist||'').split('|').filter(Boolean)).slice(0,5).join('|');x.nick=n;x.nts=Date.now()}}));
        closeModal();API.toast(`تغيّر الاسم إلى ${n} ✓`);drawKids()}catch(e){$('#rnY').disabled=false;API.toast('تعذّر')}}})}
/* 💎✨ زيادة أو خصم الجواهر والنقاط */
function adjustKid(id,p){const API=O();let j=0,x=0;
  const steps=[-100,-50,-10,10,50,100];
  const row=(k,v)=>`<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0">${steps.map(n=>`<button class="mini" data-${k}="${n}" style="background:${n<0?'#c43d38':'#14794f'};min-width:52px">${n>0?'+':'−'}${ar(Math.abs(n))}</button>`).join('')}</div>`;
  modal(`<div style="font-size:46px">${esc(p.av)}</div><h3 style="margin:2px 0">${esc(p.nick)}</h3>
    <div class="idbox" style="margin:6px 0"><b>💎 الجواهر: <span id="ajJ">٠</span></b>${row('aj')}</div>
    <div class="idbox" style="margin:6px 0"><b>✨ النقاط: <span id="ajX">٠</span></b>${row('ax')}<small style="color:var(--muted)">النقاط ترفع مستواه وترتيبه في أبطال الأسبوع</small></div>
    <input class="inp" id="ajM" maxlength="200" placeholder="رسالة له (اختياري)، مثل: أحسنت في حفظك 🌟" style="text-align:right;font-size:16px">
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="ajY">✓ أرسل</button></div>`,()=>{
    const upd=()=>{$('#ajJ').textContent=(j>0?'+':j<0?'−':'')+ar(Math.abs(j));$('#ajX').textContent=(x>0?'+':x<0?'−':'')+ar(Math.abs(x))};
    document.querySelectorAll('[data-aj]').forEach(b=>b.onclick=()=>{j=Math.max(-1000,Math.min(1000,j+ +b.dataset.aj));upd()});
    document.querySelectorAll('[data-ax]').forEach(b=>b.onclick=()=>{x=Math.max(-5000,Math.min(5000,x+ +b.dataset.ax));upd()});
    $('#ajY').onclick=async()=>{if(!j&&!x){API.toast('اختر كمية الجواهر أو النقاط');return}$('#ajY').disabled=true;
      try{await API.db.ref('prizes/'+id).push({msg:$('#ajM').value.trim(),j,x,ts:firebase.database.ServerValue.TIMESTAMP});
        if(x){const lr=API.db.ref(`leader/${API.week()}/${id}`);try{await lr.transaction(v=>v?Object.assign({},v,{xp:Math.max(0,(v.xp|0)+x)}):v)}catch(e){}
          (heroes||[]).forEach(h=>{if(h.id==id)h.xp=Math.max(0,(h.xp|0)+x)});heroes&&heroes.sort((a,b)=>key(b)-key(a))}
        closeModal();API.toast('أُرسل ✓ يصله عند فتح التطبيق');drawKids()}catch(e){$('#ajY').disabled=false;API.toast('تعذّر')}}})}
function warnTo(id,p){const API=O();
  modal(`<div style="font-size:50px">⚠️</div><h3 style="margin:4px 0">تنبيه إلى ${esc(p.nick)}</h3>
    <textarea class="inp" id="wMsg" maxlength="400" style="min-height:80px;text-align:right;font-size:16px">نرجو منك أن تلعب بصدق وأمانة، وأن تجيب بانتباه في التحديات. إذا تكرّر تعمّد الأخطاء سيتوقّف لعبك أونلاين 🤍</textarea>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn" id="wSend" style="background:#e57c1f">⚠️ أرسل التنبيه</button></div>`,()=>{
    $('#wSend').onclick=async()=>{const msg=$('#wMsg').value.trim();if(!msg)return;try{await API.db.ref('prizes/'+id).push({msg,j:0,w:1,ts:firebase.database.ServerValue.TIMESTAMP});closeModal();API.toast('أُرسل التنبيه ✓')}catch(e){API.toast('تعذّر الإرسال')}}})}
/* (v18.4) صلاحيات أكثر للمدير على الطفل: تذكير بالتنظيف، رسالة خاصة، تشجيع، تنظيف البيت هدية، بناية هدية */
const SEXK=p=>p&&(p.sx=='g'||sexOf&&sexOf(p.av)=='g');
function kidDo(id,k,p){const API=O();p=p||{};const g=SEXK(p),G=(m,f)=>g?f:m,nm=esc(p.nick||'');
  const T={clean:['🧹','تذكير بتنظيف البيت',`السلام عليكم يا ${nm} 🤍 زرتُ مدينتك فوجدت بيتك في الجنة ${G('متّسخًا','متّسخًا')}… ${G('صلِّ','صلّي')} ${G('واقرأ وردك وسبّح','واقرئي وردك وسبّحي')} لينظف بيتك ويلمع من جديد ✨`,{cr:1,title:'🧹 تذكير من الإدارة'}],
    msg:['📩','رسالة خاصة','',{cr:1,title:'📩 رسالة من الإدارة'}],
    cheer:['🌟','تشجيع',`ما شاء الله يا ${nm}! زرتُ مدينتك وأعجبتني أعمالك الصالحة، ${G('استمرّ يا بطل','استمرّي يا بطلة')} 🌟`,{j:20,title:'🌟 الإدارة فخورة بك!'}],
    wash:['🧽','تنظيف بيته هدية',`${G('أهديناك','أهديناكِ')} تنظيف بيتك 🧽`,{cl:1}]}[k];if(!T)return;
  modal(`<div style="font-size:50px">${T[0]}</div><h3 style="margin:4px 0">${T[1]} · ${nm}</h3>
    <textarea class="inp" id="kdM" maxlength="400" placeholder="اكتب رسالتك" style="min-height:80px;text-align:right;font-size:16px">${T[2]}</textarea>
    ${k=='cheer'?`<p style="font-size:14px;margin:4px 0">ومعها 💎 ٢٠ جوهرة</p>`:''}
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="kdY">${T[0]} أرسل</button></div>`,()=>{
    $('#kdY').onclick=async()=>{const msg=$('#kdM').value.trim();if(!msg&&k=='msg'){API.toast('اكتب الرسالة');return}$('#kdY').disabled=true;
      try{await API.db.ref('prizes/'+id).push(Object.assign({msg,j:0,ts:firebase.database.ServerValue.TIMESTAMP},T[3]));closeModal();API.toast('أُرسل ✓ يصله عند فتح التطبيق')}catch(e){$('#kdY').disabled=false;API.toast('تعذّر الإرسال')}}})}
function buildFor(id,p,hv){const API=O(),M=window.Madina;if(!M)return;const lv=M.fromCode(hv&&hv.m||'00000'),P=M.PARTS;
  modal(`<div style="font-size:50px">🏗️</div><h3 style="margin:4px 0">ابنِ لـ${esc(p.nick)} بناية في مدينته</h3><p style="font-size:14px;margin:2px 0">ترتفع البناية مستوى واحدًا حين يفتح التطبيق</p>
    <div class="idsts" style="margin:8px 0">${Object.keys(P).map(k=>`<button class="idst" data-bd="${k}" ${(lv[k]|0)>=3?'disabled style="opacity:.45"':''}><div><span>${P[k].e}</span><b>${'★'.repeat(lv[k]|0)||'—'}</b></div><small>${esc(P[k].n)}</small></button>`).join('')}</div>
    <div class="nav"><button class="btn sec" data-close>رجوع</button></div>`,()=>{
    document.querySelectorAll('[data-bd]').forEach(b=>b.onclick=async()=>{const k=b.dataset.bd;b.disabled=true;
      try{await API.db.ref('prizes/'+id).push({msg:'',j:0,bd:k,ts:firebase.database.ServerValue.TIMESTAMP});closeModal();API.toast(`أُرسلت ${P[k].e} ${P[k].n} هدية ✓`)}catch(e){b.disabled=false;API.toast('تعذّر')}})})}
function drawKids(){const el=$('#idKids');if(!el)return;let rows=[],num=false;
  const fl=FL[tab],hd=$('#kHd');if(hd)hd.remove();
  if(fl)el.insertAdjacentHTML('beforebegin',`<div id="kHd" class="idfh">${fl[0]}</div>`);
  if(tab=='dl'&&dlSet===false){el.innerHTML=`<p class="tip">لرؤية أسماء من نزّلوا الكتاب يجب تحديث قواعد Firebase مرة واحدة (أرسلها لك Claude).<br>العدد الكلّي ظاهر في الإحصائيات.</p>`;return}
  if(tab=='dl'&&dlSet===null){el.innerHTML='<p class="tip">⏳</p>';return}
  if(fl){rows=(all||[]).filter(fl[1]).sort(fl[2]);num=tab=='lv'||tab=='play';$('#kHd').textContent=`${fl[0]} · ${ar(rows.length)}`}
  else if(tab=='heroes'){rows=heroes||[];num=true}
  else if(tab=='top'){rows=(all||[]).slice().sort((a,b)=>(b.lv-a.lv)||(b.wins-a.wins)).slice(0,20);num=true}
  else if(tab=='sus'){rows=(all||[]).filter(wrong).sort((a,b)=>(accOf(a)||0)-(accOf(b)||0))}
  else if(tab=='cheat'){rows=(all||[]).filter(cheat).sort((a,b)=>(b.sm.tp|0)-(a.sm.tp|0))}
  else if(tab=='gone'){rows=(all||[]).filter(gone).sort((a,b)=>a.seen-b.seen)}
  else if(tab=='names'){rows=(all||[]).filter(p=>p.hist).sort((a,b)=>b.nts-a.nts)}
  else if(tab=='rep'){rows=(all||[]).filter(p=>repN(p.id)).sort((a,b)=>repN(b.id)-repN(a.id))}
  else if(tab=='recent'){rows=(all||[]).filter(p=>p.seen).sort((a,b)=>b.seen-a.seen).slice(0,30)}
  else{const t=q.trim().replace(/[أإآ]/g,'ا');rows=(all||[]).filter(r=>!t||String(r.nick).replace(/[أإآ]/g,'ا').includes(t)||String(r.code).toUpperCase()==t.toUpperCase()).sort((a,b)=>(b.seen||0)-(a.seen||0))}
  const total=rows.length;rows=rows.slice(0,lim);
  el.innerHTML=rows.length?'<div class="idkg">'+rows.map((r,i)=>kidRow(r,num?i:null)).join('')+'</div>'+(total>rows.length?`<button class="btn sec" id="kMore" style="flex:none;width:100%;margin-top:8px">⬇️ عرض المزيد (باقي ${ar(total-rows.length)})</button>`:'')+(tab=='all'?`<p class="tip" style="margin:4px 0">${q.trim()?`النتائج: ${ar(total)}`:`كل المشتركين: ${ar(total)} · الأحدث دخولًا أولًا`}</p>`:''):`<p class="tip">${tab=='all'?(q?'لا يوجد طفل بهذا الاسم':`عدد الأطفال: ${ar((all||[]).length)} — اكتب اسمًا للبحث`):tab=='sus'?'لا أحد مشبوه 👍':tab=='gone'?'لا أحد غائب أكثر من شهر 👍':tab=='names'?'لم يغيّر أحد اسمه بعد':tab=='rep'?'لا توجد بلاغات 👍':'لا أحد بعد'}</p>`;
  const mo=$('#kMore');if(mo)mo.onclick=()=>{lim+=40;drawKids()};
  el.querySelectorAll('[data-k]').forEach(b=>b.onclick=e=>{if(e.target.closest('[data-g]'))return;kidCard(b.dataset.k)});
  el.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const id=b.dataset.g,r=rows.find(x=>x.id==id)||{},p=(all||[]).find(x=>x.id==id)||{};giftTo(id,r.nick||p.nick,r.av||p.av)})}
function giftTo(uid,nick,av){const API=O();
  modal(`<div style="font-size:50px;line-height:1.2">${esc(av||'🎁')}</div><h3 style="margin:2px 0">جائزة إلى ${esc(nick||'')}</h3>
    <textarea class="inp" id="gMsg" maxlength="400" placeholder="رسالة له، مثل: أحسنت يا بطل! 🌟" style="min-height:70px;text-align:right;font-size:16px"></textarea>
    <select class="inp" id="gJ">${JOPT.replace('value="50"','value="50" selected')}</select>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="gSend">🎁 أرسل</button></div>`,()=>{
    $('#gSend').onclick=async()=>{const msg=$('#gMsg').value.trim(),j=+$('#gJ').value;$('#gSend').disabled=true;
      try{await API.db.ref('prizes/'+uid).push({msg,j,ts:firebase.database.ServerValue.TIMESTAMP});closeModal();API.toast(`أُرسلت الجائزة إلى ${nick||''} ✓`)}catch(e){$('#gSend').disabled=false;API.toast('تعذّر الإرسال')}}})}
async function panel(){const API=O();heroes=null;all=null;view='main';
  const now=new Date(),day=now.toLocaleDateString('ar-IQ',{weekday:'long'}),dt=now.toLocaleDateString('ar-IQ',{day:'numeric',month:'long',year:'numeric'});
  const hr=now.getHours(),greet=hr<12?'صباح الخير':'مساء الخير';
  body().innerHTML=`<div class="idmain"><div class="idroy"><div class="hd"><span class="md"><i>👑</i>🛡️</span><span class="tt"><b>لوحة الإدارة</b><small>السلام عليكم يا شيخنا · ${greet} 🌷</small><em>${day} · ${dt}</em></span></div>
      <div class="orn"></div>
      <div class="kp"><button data-k0="all"><b id="idK1">…</b><small>👥 المشتركون</small></button><button data-k0="new"><b id="idK2">…</b><small>🆕 الجدد</small></button><button data-k0="pnow"><b id="idK3">…</b><small><span class="on"></span> أونلاين</small></button></div>
      <button class="nw" id="idNew" hidden></button>
      <div class="ft" id="idCnt">جارٍ التحميل…</div></div>
    <div class="idsect">⚜️ صلاحيات المدير ⚜️</div>
    <div class="idtools">
      <button id="tMsg"><span>📢</span><b>رسالة للجميع</b><small>تصل لكل طفل مرة واحدة</small></button>
      <button id="tGift"><span>🎁</span><b>هدية للجميع</b><small>جواهر ونقاط لكل الأطفال</small></button>
      <button id="tPin"><span>📌</span><b>إعلان مثبّت</b><small>شريط ذهبي في واجهتهم</small></button>
      <button id="tFind"><span>🔍</span><b>ابحث عن طفل</b><small>بالاسم أو الرمز</small></button>
      <button id="tRep"><span>📋</span><b>تقرير التطبيق</b><small>انسخه أو شاركه</small></button>
      <button id="idSubs"><span>👥</span><b>المشتركون</b><small id="idSubsN">⏳</small></button>
      <button id="tNreq" style="grid-column:1/-1"><span>📨</span><b>طلبات تغيير الأسماء</b><small id="idNreqN">⏳</small></button>
      <button id="tFb" style="grid-column:1/-1"><span>📬</span><b>رسائل الأطفال</b><small id="idFbN">⏳</small></button>
      <button id="tReps" style="grid-column:1/-1"><span>🚩</span><b>بلاغات الأسماء</b><small id="idRepN">⏳</small></button>
      <button id="tYt" style="grid-column:1/-1"><span>📺</span><b>أحدث فيديو للأهل</b><small>ضع رابط فيديو يوتيوب فيظهر في صفحة «للأهل»</small></button>
      <button id="tVoice" style="grid-column:1/-1"><span>🎙️</span><b>صوتي للأطفال</b><small>اقرأ العبارة بصوتك فيسمعها الأطفال عند كل إنجاز</small></button>
    </div>
    <div class="idbox"><h3>📊 إحصائيات التطبيق</h3><div id="idStats"><p class="tip">⏳</p></div></div>
    <div class="idbox"><h3>📜 آخر ما أرسلته</h3><div id="idNews"><p class="tip">⏳</p></div></div>
    <p class="idsig">👑 جنّتي الصغيرة · بإشراف الشيخ علاء المطوري</p></div>`;
  body().querySelectorAll('[data-k0]').forEach(b=>b.onclick=()=>{if(all)openKids(b.dataset.k0)});
  $('#idSubs').onclick=()=>{if(all)openKids()};
  $('#tReps').onclick=()=>{if(all)openKids('rep')};
  $('#tNreq').onclick=()=>openReqs();
  $('#tFb').onclick=()=>openFb();loadFb(API).then(()=>{const e=$('#idFbN');if(e)e.textContent=fbSum()});
  loadReqs(API).then(()=>{const e=$('#idNreqN');if(e)e.textContent=reqSum()});
  $('#tFind').onclick=()=>{if(!all)return;openKids();setTimeout(()=>{const i=$('#kQ');if(i)i.focus()},150)};
  $('#tMsg').onclick=()=>sendNews(API,0);$('#tPin').onclick=()=>sendNews(API,1);$('#tGift').onclick=()=>giftAll(API);$('#tRep').onclick=()=>report(API);$('#tVoice').onclick=()=>{if(window.Hamas)Hamas.recorder()};$('#tYt').onclick=()=>ytSet(API);
  await loadKids(API);{const c=$('#idCnt'),n=(all||[]).length,g=(all||[]).filter(gone).length,u=(all||[]).filter(x=>!x.seen).length;
    const k=(i,v)=>{const e=$('#idK'+i);if(e)e.textContent=ar(v)};k(1,n);k(2,(all||[]).filter(p=>p.since&&Date.now()-p.since<864e5).length);k(3,(all||[]).filter(onNow).length);
    const fr=lastV?(all||[]).filter(fresh).length:0,nb=$('#idNew');
    if(nb&&fr){nb.hidden=false;nb.innerHTML=`<span class="bl">🔔</span> ${fr==1?'مشترك جديد واحد':fr==2?'مشتركان جديدان':ar(fr)+(fr<=10?' مشتركين جدد':' مشتركًا جديدًا')} من آخر مرة فتحت الإدارة ‹`;nb.onclick=()=>openKids('fresh')}
    if(c)c.innerHTML=`💤 غائبون شهرًا أو أكثر: ${ar(g)}${u?` · ❔ بلا تسجيل دخول: ${ar(u)}`:''}`;
    const rq=$('#idRepN');if(rq)rq.textContent=repSum();
    const sn=$('#idSubsN');if(sn)sn.textContent=`${ar(n)} طفل · ☀️ ${ar((all||[]).filter(p=>p.seen&&Date.now()-p.seen<864e5).length)} اليوم`}
  stats(API);
  // الرسائل
  try{const s=(await API.db.ref('news').orderByChild('ts').limitToLast(10).get()).val()||{};const rows=Object.entries(s).sort((a,b)=>(b[1].ts||0)-(a[1].ts||0));
    $('#idNews').innerHTML=rows.length?rows.map(([id,v])=>`<div class="idrow"><b>${+v.pin>Date.now()?'📌':v.x?'🎁':'📢'} ${esc(v.title||v.msg||'').slice(0,40)}</b><small>${v.j?'💎'+ar(v.j):''}${v.x?' ✨'+ar(v.x):''} ${v.ts?new Date(v.ts).toLocaleDateString('ar-IQ'):''}</small><button class="mini" style="background:#e2504a" data-del="${esc(id)}">🗑️</button></div>`).join(''):'<p class="tip">لم تُرسل رسائل بعد</p>';
    $('#idNews').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>modal(`<h3 style="margin:4px 0">حذف هذه الرسالة؟</h3><p>لن يراها الأطفال الذين لم يفتحوها بعد.</p><div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn" id="dYes" style="background:var(--bad)">حذف</button></div>`,()=>{
      $('#dYes').onclick=async()=>{closeModal();try{await API.db.ref('news/'+b.dataset.del).remove();panel()}catch(e){API.toast('تعذّر الحذف')}}}))}catch(e){$('#idNews').innerHTML='<p class="tip">تعذّر التحميل</p>'}}
/* (v13.3) ⚜️ صلاحيات المدير — كلها عبر news (لا تحتاج تغيير القواعد): رسالة، إعلان مثبّت (pin = وقت الانتهاء)، هدية للجميع (j جواهر + x نقاط)، تقرير */
function sendNews(API,pin){
  modal(`<div style="font-size:46px">${pin?'📌':'📢'}</div><h3 style="margin:2px 0">${pin?'إعلان مثبّت في واجهة الأطفال':'رسالة لكل الأطفال'}</h3>
    <input class="inp" id="nTitle" maxlength="60" placeholder="العنوان، مثل: عيد مبارك 🌙" style="text-align:right">
    <textarea class="inp" id="nMsg" maxlength="600" placeholder="نص الرسالة" style="min-height:90px;text-align:right"></textarea>
    ${pin?`<select class="inp" id="nPin"><option value="1">📌 يبقى يومًا واحدًا</option><option value="3" selected>📌 يبقى ٣ أيام</option><option value="7">📌 يبقى أسبوعًا</option><option value="30">📌 يبقى شهرًا</option></select>`:''}
    <select class="inp" id="nJ">${JOPT.replace(/<option value="1000">[^<]*<\/option>/,'')}</select>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="nSend">${pin?'📌 ثبّت الإعلان':'📢 أرسل للجميع'}</button></div>`,()=>{
    $('#nSend').onclick=async()=>{const title=$('#nTitle').value.trim(),msg=$('#nMsg').value.trim(),j=+$('#nJ').value;
      if(!title||!msg){API.toast('اكتب العنوان والرسالة');return}
      const o={title,msg,j,ts:firebase.database.ServerValue.TIMESTAMP};if(pin)o.pin=Date.now()+(+$('#nPin').value)*864e5;
      try{await API.db.ref('news').push(o);closeModal();API.toast(pin?'ثُبّت الإعلان ✓':'أُرسلت ✓');panel()}catch(e){API.toast('تعذّر الإرسال')}}})}
function giftAll(API){const n=(all||[]).length,opt=(a,u)=>a.map(v=>`<option value="${v}">${v?`${u} ${ar(v)}`:'بلا'}</option>`).join('');
  modal(`<div style="font-size:50px">🎁</div><h3 style="margin:2px 0">هدية لكل الأطفال</h3><p style="font-size:14.5px;margin:2px 0">تصل لكل طفل مرة واحدة حين يفتح التطبيق${n?` (${ar(n)} مشترك)`:''}</p>
    <label class="idlb">💎 جواهر</label><select class="inp" id="gJ">${opt([10,25,50,100,200,500],'💎')}</select>
    <label class="idlb">✨ نقاط (ترفع مستواه)</label><select class="inp" id="gX">${opt([0,20,50,100,200,500],'✨')}</select>
    <input class="inp" id="gT" maxlength="60" value="🎁 هدية من المدير" style="text-align:right">
    <textarea class="inp" id="gM" maxlength="600" style="min-height:70px;text-align:right">بارك الله فيكم يا أحبّتي، استمرّوا في التعلّم وعمل الخير 🤍</textarea>
    <div class="nav"><button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="gGo">🎁 أرسل الهدية</button></div>`,()=>{
    $('#gGo').onclick=async()=>{const j=+$('#gJ').value,x=+$('#gX').value,title=$('#gT').value.trim()||'🎁 هدية من المدير',msg=$('#gM').value.trim()||'هدية من الإدارة 🤍';
      try{await API.db.ref('news').push({title,msg,j,x,ts:firebase.database.ServerValue.TIMESTAMP});closeModal();API.toast('أُرسلت الهدية ✓');panel()}catch(e){API.toast('تعذّر الإرسال')}}})}
// v25.3 (الشيخ): «📺 أحدث فيديو» يظهر للأهل في صفحة «للأهل». يُحفظ في voices/yt (مسار يكتبه المدير فقط ويقرؤه الجميع، بلا تغيير في القواعد،
// ولا يُضاف إلى voicesIdx فلا يُعامَل كتسجيل صوتي). الصيغة: a = 'yt:<id>|<العنوان>'
const ytId=u=>{u=(u||'').trim();const m=u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/live\/|\/embed\/)([\w-]{11})/)||u.match(/^([\w-]{11})$/);return m?m[1]:''};
async function ytSet(API){let cur=null;try{cur=(await API.db.ref('voices/yt').get()).val()}catch(e){}
  const c=cur&&typeof cur.a=='string'&&cur.a.startsWith('yt:')?cur.a.slice(3).split('|'):null;
  modal(`<div style="font-size:50px">📺</div><h3 style="margin:2px 0">أحدث فيديو للأهل</h3><p style="font-size:14px;margin:2px 0">يظهر في صفحة «للأهل» بصورته وعنوانه، ويفتح في يوتيوب</p>
    ${c?`<p style="font-size:13.5px;margin:6px 0">الآن: <b>${esc(c[1]||'')}</b></p>`:''}
    <label class="idlb">🔗 رابط الفيديو (انسخه من يوتيوب: مشاركة ← نسخ الرابط)</label><input class="inp" id="ytU" dir="ltr" placeholder="https://youtu.be/..." value="${c?'https://youtu.be/'+esc(c[0]):''}">
    <label class="idlb">📝 عنوان قصير</label><input class="inp" id="ytT" maxlength="80" style="text-align:right" value="${c?esc(c[1]||''):''}" placeholder="مثل: تعليم الوضوء للأطفال">
    <div class="nav">${c?'<button class="btn sec" id="ytDel">🗑️ احذفه</button>':''}<button class="btn sec" data-close>إلغاء</button><button class="btn gold" id="ytGo">✔ احفظ</button></div>`,()=>{
    $('#ytGo').onclick=async()=>{const id=ytId($('#ytU').value),t=$('#ytT').value.replace(/[<>|]/g,'').trim().slice(0,80);if(!id){API.toast('الرابط غير صحيح — انسخه من زر «مشاركة» في يوتيوب');return}
      try{await API.db.ref('voices/yt').set({a:'yt:'+id+'|'+(t||'فيديو جديد من قناتنا'),t:Date.now()});closeModal();API.toast('تمّ ✓ يظهر الآن في صفحة «للأهل»')}catch(e){API.toast('تعذّر الحفظ')}};
    const d=$('#ytDel');if(d)d.onclick=async()=>{try{await API.db.ref('voices/yt').remove();closeModal();API.toast('حُذف ✓')}catch(e){API.toast('تعذّر الحذف')}}})}
async function report(API){const L=all||[],t=Date.now(),D1=864e5,c=f=>ar(L.filter(f).length);
  let dl='—';try{dl=ar((await API.db.ref('stats/bookDl').get()).val()|0)}catch(e){}
  const txt=`📊 تقرير «جنّتي الصغيرة» — ${new Date().toLocaleDateString('ar-IQ',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
👥 المشتركون: ${ar(L.length)} (👦 ${c(p=>p.sx=='b')} · 👧 ${c(p=>p.sx=='g')})
🆕 الجدد آخر ٢٤ ساعة: ${c(p=>p.since&&t-p.since<D1)}
☀️ دخلوا اليوم: ${c(p=>p.seen&&t-p.seen<D1)} · 📅 هذا الأسبوع: ${c(p=>p.seen&&t-p.seen<7*D1)} · 🗓️ هذا الشهر: ${c(p=>p.seen&&t-p.seen<30*D1)}
📖 حفظوا سورًا: ${c(p=>p.hz>0)} · 🕌 سجّلوا صلواتهم: ${c(p=>p.pr>0)}
📥 نزّلوا الكتاب: ${dl}
🎮 لعبوا أونلاين: ${c(p=>p.games>0)}
🔗 https://alaa1981q-droid.github.io/usool-deeni/`;
  modal(`<div style="font-size:46px">📋</div><h3 style="margin:2px 0">تقرير التطبيق</h3><pre class="idrep">${esc(txt)}</pre>
    <div class="nav"><button class="btn sec" id="rCp">📋 نسخ</button><button class="btn gold" id="rSh">📤 مشاركة</button></div>`,()=>{
    $('#rCp').onclick=()=>{try{navigator.clipboard.writeText(txt).then(()=>API.toast('نُسخ ✓'))}catch(e){API.toast('تعذّر النسخ')}};
    $('#rSh').onclick=()=>{if(navigator.share)navigator.share({text:txt}).catch(()=>{});else $('#rCp').click()}})}
/* 👥 صفحة المشتركين: كل الأطفال (حتى لو صاروا ألفًا) بصفحات من ٤٠، مع بحث وتبويبات */
let view='main',lim=40,dlSet=null;
// الفلاتر التي تفتحها مربعات الإحصائيات
const DAY=864e5,ago_=p=>p.seen?Date.now()-p.seen:Infinity,bySeen=(a,b)=>(b.seen||0)-(a.seen||0);
const FL={b:['👦 الأولاد',p=>p.sx=='b',bySeen],g:['👧 البنات',p=>p.sx=='g',bySeen],nosx:['❔ لم يختاروا ولد أو بنت',p=>!p.sx,bySeen],
  now:['🟢 داخلين الآن',onNow,bySeen],d1:['☀️ دخلوا اليوم',p=>ago_(p)<DAY,bySeen],d7:['📅 دخلوا هذا الأسبوع',p=>ago_(p)<7*DAY,bySeen],
  d30:['🗓️ دخلوا هذا الشهر',p=>ago_(p)<30*DAY,bySeen],pnow:['🟢 داخلون التطبيق الآن (🎮 = يلعب مباراة)',onNow,(a,b)=>(plNow(b)?1:0)-(plNow(a)?1:0)||(b.on||b.pl)-(a.on||a.pl)],hz:['📖 حفظوا سورًا (الأكثر حفظًا أولًا)',p=>p.hz>0,(a,b)=>b.hz-a.hz],pr:['🕌 سجّلوا صلواتهم (الأكثر أولًا)',p=>p.pr>0,(a,b)=>b.pr-a.pr],
  fresh:['🔔 الجدد اليوم من آخر مرة فتحت الإدارة',p=>lastV&&fresh(p),(a,b)=>b.since-a.since],new:['🆕 الجدد اليوم (آخر ٢٤ ساعة)',p=>p.since&&Date.now()-p.since<DAY,(a,b)=>b.since-a.since],
  play:['🎮 لعبوا أونلاين (الأكثر لعبًا أولًا)',p=>p.games>0,(a,b)=>b.games-a.games||b.wins-a.wins],
  lv:['⭐ كل الأطفال حسب المستوى',p=>true,(a,b)=>(b.lv-a.lv)||bySeen(a,b)],
  dl:['📥 نزّلوا الكتاب',p=>dlSet&&dlSet[p.id],bySeen],ban:['⛔ المحظورون الآن',p=>!!banOf(p.id),bySeen]};
function openKids(t0){view='kids';tab=t0||'all';q='';lim=40;window.scrollTo(0,0);
  body().innerHTML=`<div class="idban"><span class="sh">👥</span><span><b>المشتركون</b><small>${ar((all||[]).length)} طفل · اضغط على أي طفل لترى ملفّه</small></span></div>
    <input class="inp" id="kQ" placeholder="🔎 ابحث باسم الطفل أو رمزه" style="text-align:right;margin-bottom:6px">
    <div class="jrooms" style="margin-bottom:8px;flex-wrap:wrap"><button data-tab="all">👥 الكل</button><button data-tab="heroes">🏅 الأبطال</button><button data-tab="top">⭐ المميّزون</button><button data-tab="names">✏️ غيّروا أسماءهم</button><button data-tab="gone">💤 غائبون</button><button data-tab="sus">⚠️ يتعمّدون الغلط</button><button data-tab="cheat">🔢 غيّروا أرقامهم</button><button data-tab="rep">🚩 بلاغات</button></div>
    <div id="idKids"></div>
    <p class="tip">بطل الأسبوع يأخذ تلقائيًا 💎١٠٠ (والثاني ٦٠ والثالث ٣٠) عند بداية الأسبوع الجديد.</p>
    <button class="btn sec" id="idKBack" style="flex:none;width:100%">‹ رجوع إلى لوحة الإدارة</button>`;
  const tabs=()=>{body().querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab==tab));lim=40;drawKids()};
  body().querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;tabs()});
  $('#kQ').oninput=e=>{q=e.target.value;if(q.trim())tab='all';tabs()};
  $('#idKBack').onclick=backMain;tabs();
  if(tab=='dl'&&!dlSet)O().db.ref('stats/bookDlBy').get().then(x=>{dlSet=x.val()||{};drawKids()}).catch(()=>{dlSet=false;drawKids()})}
function backMain(){view='main';window.scrollTo(0,0);panel()}
/* 📨 (v21.2) طلبات تغيير الأسماء: الطفل يغيّر اسمه مرة واحدة وحده، والتغيير الثاني يصل هنا: nreq/{الطفل} = {from,to,av,t}
   موافقة ← nok/{الطفل}=الاسم (إذن في قواعد Firebase) + رسالة rn تغيّر اسمه في جهازه. رفض ← رسالة nrej تحرّر الاسم المحجوز. */
let nreqs={};
async function loadReqs(API){try{nreqs=(await API.db.ref('nreq').get()).val()||{}}catch(e){nreqs={}}}
const reqSum=()=>{const n=Object.keys(nreqs).length;return n?`🔴 ${ar(n)} ${n==1?'طلب ينتظر':'طلبات تنتظر'} موافقتك`:'لا توجد طلبات 👍'};
async function openReqs(){const API=O();view='reqs';window.scrollTo(0,0);show('idara');
  body().innerHTML='<div class="handoff"><div class="big spin">📨</div><p>جارٍ التحميل…</p></div>';await loadReqs(API);
  const L=Object.entries(nreqs).sort((a,b)=>(a[1].t||0)-(b[1].t||0));
  body().innerHTML=`<div class="idban"><span class="sh">📨</span><span><b>طلبات تغيير الأسماء</b><small>هؤلاء غيّروا أسماءهم مرة من قبل، ويريدون اسمًا جديدًا</small></span></div>
    ${L.length?L.map(([id,v])=>`<div class="idrow" style="flex-wrap:wrap;gap:6px"><b style="flex:1 1 100%;font-size:17px">${esc(v.av||'')} «${esc(v.from||'')}» ← «${esc(v.to||'')}»</b>
      <small>${v.t?new Date(v.t).toLocaleDateString('ar-IQ',{weekday:'long',day:'numeric',month:'long'}):''}</small>
      <span style="display:flex;gap:6px;margin-inline-start:auto"><button class="btn gold" style="flex:none" data-ok="${esc(id)}">✅ وافق</button><button class="btn sec" style="flex:none" data-no="${esc(id)}">❌ ارفض</button></span></div>`).join('')
      :'<p class="tip">لا توجد طلبات الآن 👍</p>'}
    <button class="btn sec" id="rqBack" style="flex:none;width:100%;margin-top:8px">‹ رجوع إلى لوحة الإدارة</button>`;
  $('#rqBack').onclick=backMain;
  const TS=firebase.database.ServerValue.TIMESTAMP;
  body().querySelectorAll('[data-ok]').forEach(b=>b.onclick=async()=>{const id=b.dataset.ok,v=nreqs[id];if(!v)return;b.disabled=true;
    try{await API.db.ref('nok/'+id).set(v.to);
      await API.db.ref('prizes/'+id).push({msg:'اسمك الجديد جميل 🌷',j:0,rn:v.to,ok:1,ts:TS});
      const lr=API.db.ref(`leader/${API.week()}/${id}`);try{if((await lr.get()).exists())await lr.update({nick:v.to})}catch(e){}
      await API.db.ref('nreq/'+id).remove();delete nreqs[id];API.toast(`✅ صار اسمه «${v.to}»`);openReqs()}catch(e){b.disabled=false;API.toast('تعذّر، هل نشرت قواعد Firebase الجديدة؟')}});
  body().querySelectorAll('[data-no]').forEach(b=>b.onclick=async()=>{const id=b.dataset.no,v=nreqs[id];if(!v)return;b.disabled=true;
    try{await API.db.ref('prizes/'+id).push({msg:`لم توافق الإدارة على تغيير اسمك إلى «${v.to}»، ويبقى اسمك «${v.from}» 🤍`,j:0,nrej:v.to,ts:TS});
      await API.db.ref('nreq/'+id).remove();delete nreqs[id];API.toast('❌ رُفض الطلب');openReqs()}catch(e){b.disabled=false;API.toast('تعذّر')}})}
/* ---------- 📬 رسائل الأطفال للإدارة (v21.8، طلب صاحب التطبيق) ----------
   الطفل يرسل مشكلة أو اقتراحًا مرة واحدة في الأسبوع: msgs/{uid}/{الأسبوع} = {k:'p'|'s', m (٢–٤٠٠ حرف), n, a, t}.
   القواعد: يقرأها المدير فقط، والطفل لا يعدّل رسالة أرسلها (مفتاح الأسبوع مرّة واحدة). المدير يعلّم «قُرئت» (r:1) أو يحذف، ويردّ برسالة خاصة (kidDo msg). */
let fbs=null;
async function loadFb(API){fbs=[];try{const v=(await API.db.ref('msgs').get()).val()||{};
  Object.entries(v).forEach(([uid,ws])=>Object.entries(ws||{}).forEach(([w,m])=>{if(m&&m.m)fbs.push(Object.assign({uid,w},m))}))}catch(e){fbs=null}
  if(fbs)fbs.sort((a,b)=>(b.t||0)-(a.t||0))}
const fbSum=()=>{if(!fbs)return 'تحتاج نشر قواعد Firebase الجديدة';const n=fbs.filter(x=>!x.r).length;return n?`🔴 ${ar(n)} ${n==1?'رسالة جديدة':'رسائل جديدة'}`:fbs.length?'لا رسائل جديدة 👍':'لا توجد رسائل بعد'};
async function openFb(){const API=O();view='fb';window.scrollTo(0,0);show('idara');
  body().innerHTML='<div class="handoff"><div class="big spin">📬</div><p>جارٍ التحميل…</p></div>';await loadFb(API);
  const L=fbs||[];
  body().innerHTML=`<div class="idban"><span class="sh">📬</span><span><b>رسائل الأطفال</b><small>مشكلات واقتراحات — كل طفل رسالة واحدة في الأسبوع</small></span></div>
    ${!fbs?'<p class="tip">ما قدرنا نقرأ الرسائل: انشر قواعد Firebase الجديدة (database.rules.json).</p>':L.length?L.map((v,i)=>`<div class="idrow" style="flex-wrap:wrap;gap:6px;${v.r?'':'outline:2px solid #e2504a;'}">
      <b style="flex:1 1 100%;font-size:16px">${esc(v.a||'')} ${esc(v.n||'')} <span style="font-size:13px;padding:1px 8px;border-radius:10px;background:${v.k=='p'?'#ffe1e1':'#e1f3ff'}">${v.k=='p'?'🛠️ مشكلة':'💡 اقتراح'}</span>${v.r?'':' <span style="color:#c43d38;font-size:13px">● جديدة</span>'}</b>
      <p style="flex:1 1 100%;margin:2px 0;font-size:16px;white-space:pre-wrap;line-height:1.7">${esc(v.m)}</p>
      <small>${v.t?new Date(v.t).toLocaleDateString('ar-IQ',{weekday:'long',day:'numeric',month:'long'}):''}</small>
      <span style="display:flex;gap:6px;margin-inline-start:auto;flex-wrap:wrap"><button class="btn gold" style="flex:none" data-fr="${i}">📩 ردّ</button><button class="btn sec" style="flex:none" data-fc="${i}">👤 بطاقته</button><button class="btn sec" style="flex:none" data-fd="${i}">🗑️</button></span></div>`).join('')
      :'<p class="tip">لا توجد رسائل بعد 👍</p>'}
    <button class="btn sec" id="fbBack" style="flex:none;width:100%;margin-top:8px">‹ رجوع إلى لوحة الإدارة</button>`;
  $('#fbBack').onclick=backMain;
  L.filter(v=>!v.r).forEach(v=>API.db.ref(`msgs/${v.uid}/${v.w}/r`).set(1).catch(()=>{})); // فُتحت = قُرئت
  body().querySelectorAll('[data-fr]').forEach(b=>b.onclick=()=>{const v=L[+b.dataset.fr];kidDo(v.uid,'msg',{nick:v.n,av:v.a})});
  body().querySelectorAll('[data-fc]').forEach(b=>b.onclick=()=>{const v=L[+b.dataset.fc];kidCard(v.uid)});
  body().querySelectorAll('[data-fd]').forEach(b=>b.onclick=async()=>{const v=L[+b.dataset.fd];if(!confirm('حذف الرسالة؟'))return;
    try{await API.db.ref(`msgs/${v.uid}/${v.w}`).remove();openFb()}catch(e){API.toast('تعذّر')}})}
// جهة الطفل: «📬 راسل الإدارة» (من «المزيد»)
async function feedback(){const API=O();if(isAdmK())return openFb();
  modal(`<div class="handoff" style="padding:10px"><div class="big spin">📬</div><p>لحظة…</p></div>`);
  try{await API.init()}catch(e){modal(`<div style="font-size:46px">📶</div><h3>${B('اتصل','اتصلي')} بالإنترنت أولًا</h3><div class="nav"><button class="btn sec" data-close>حسنًا</button></div>`);return}
  if(!API.profile){closeModal();return API.editProfile&&API.editProfile()}
  if(API.banned){modal(`<div style="font-size:46px">⛔</div><p>لا يمكنك المراسلة الآن.</p><div class="nav"><button class="btn sec" data-close>حسنًا</button></div>`);return}
  const w=API.week();let old=null;try{old=(await API.db.ref(`msgs/${API.me}/${w}`).get()).val()}catch(e){old=undefined}
  if(old===undefined){modal(`<div style="font-size:46px">🛠️</div><p>المراسلة غير متاحة الآن، ${B('جرّب','جرّبي')} لاحقًا 🤍</p><div class="nav"><button class="btn sec" data-close>حسنًا</button></div>`);return}
  if(old){modal(`<div style="font-size:50px">📬</div><h3 style="margin:4px 0">${B('أرسلتَ','أرسلتِ')} رسالتك هذا الأسبوع 🤍</h3>
    <p style="background:#f4fbf6;border-radius:12px;padding:8px;white-space:pre-wrap">${esc(old.m)}</p><p style="font-size:14px;color:var(--muted)">${old.r?'✅ قرأتها الإدارة':'⏳ ستقرؤها الإدارة قريبًا'} · ${B('تستطيع','تستطيعين')} أن ${B('ترسل','ترسلي')} رسالة جديدة يوم الجمعة</p>
    <div class="nav"><button class="btn sec" data-close>حسنًا</button></div>`);return}
  let k='s';
  modal(`<div style="font-size:50px">📬</div><h3 style="margin:4px 0">راسل الإدارة</h3>
    <p style="font-size:14.5px;margin:2px 0">${B('عندك','عندكِ')} مشكلة في التطبيق أو فكرة جميلة؟ ${B('اكتبها','اكتبيها')} للإدارة 🌷<br><small>رسالة واحدة في الأسبوع، ${B('فاكتب','فاكتبي')} كل ما تريد فيها</small></p>
    <div class="nav" style="position:static"><button class="btn sec" data-fk="p">🛠️ مشكلة</button><button class="btn gold" data-fk="s">💡 اقتراح</button></div>
    <textarea class="inp" id="fbM" maxlength="400" rows="5" style="width:100%;box-sizing:border-box;font:inherit;font-size:16px;resize:vertical" placeholder="${B('اكتب','اكتبي')} هنا…"></textarea>
    <div class="fb" id="fbE" style="font-size:13px">لا ${B('تكتب','تكتبي')} رقم هاتف أو عنوان بيت 🤍</div>
    <div class="nav"><button class="btn sec" data-close>رجوع</button><button class="btn gold" id="fbSend">📨 أرسل</button></div>`,()=>{
    const sel=()=>document.querySelectorAll('#modalIn [data-fk]').forEach(b=>b.className='btn '+(b.dataset.fk==k?'gold':'sec'));sel();
    document.querySelectorAll('#modalIn [data-fk]').forEach(b=>b.onclick=()=>{k=b.dataset.fk;sel()});
    $('#fbSend').onclick=async()=>{const m=$('#fbM').value.trim().replace(/\n{3,}/g,'\n\n'),e=$('#fbE');
      if(m.length<5){e.className='fb bad';e.textContent=B('اكتب','اكتبي')+' رسالتك أولًا (كلمتين على الأقل)';return}
      if(/\d{7,}|https?:|www\./i.test(m.replace(/\s/g,''))){e.className='fb bad';e.textContent='بلا أرقام هواتف أو روابط من فضلك 🤍';return}
      $('#fbSend').disabled=true;
      try{await API.db.ref(`msgs/${API.me}/${w}`).set({k,m:m.replace(/[<>]/g,'').slice(0,400),n:String(API.profile.nick||'').slice(0,40),a:String(API.profile.av||'').slice(0,8),t:firebase.database.ServerValue.TIMESTAMP});
        modal(`<div style="font-size:54px">💌</div><h3 style="margin:4px 0">وصلت رسالتك للإدارة!</h3><p>شكرًا لأنك ${B('تساعدنا','تساعدينا')} نجعل جنّتنا أجمل 🌷</p><div class="nav"><button class="btn gold" data-close>جميل 👍</button></div>`)}
      catch(x){$('#fbSend').disabled=false;e.className='fb bad';e.textContent='تعذّر الإرسال، تأكّد من الإنترنت'}}})}
const isAdmK=()=>window.isAdm&&isAdm();
/* 📊 الإحصائيات */
async function stats(API){const el=$('#idStats');if(!el)return;const L=all||[],t=Date.now(),D1=864e5;
  const n=L.length,b=L.filter(p=>p.sx=='b').length,g=L.filter(p=>p.sx=='g').length;
  const d1=L.filter(p=>p.seen&&t-p.seen<D1).length,d7=L.filter(p=>p.seen&&t-p.seen<7*D1).length,d30=L.filter(p=>p.seen&&t-p.seen<30*D1).length;
  const on=L.filter(onNow).length;
  const games=Math.round(L.reduce((a,p)=>a+(p.games|0),0)/2),players=L.filter(p=>p.games>0).length;
  const lvs=L.filter(p=>p.lv),avg=lvs.length?lvs.reduce((a,p)=>a+p.lv,0)/lvs.length:0,mx=lvs.reduce((m,p)=>p.lv>m.lv?p:m,{lv:0});
  const ren=L.filter(p=>p.hist).length,bn=Object.values(bans).filter(x=>x&&x.until>t).length,sus2=L.filter(wrong).length,ch2=L.filter(cheat).length;
  let dl='—';try{dl=ar((await API.db.ref('stats/bookDl').get()).val()|0)}catch(e){}
  // v7.1: مربعات صغيرة (الأيقونة والرقم في سطر واحد) وكتابة أوضح، حتى لا تطول الصفحة
  const tile=(e,v,l,f)=>`<button class="idst" data-f="${f}"><div><span>${e}</span><b>${v}</b></div><small>${l}</small></button>`;
  const grp=(h,tiles)=>`<div class="idgrp"><div class="gh">${h}</div><div class="idsts">${tiles}</div></div>`;
  el.innerHTML=grp('👥 المشتركون',`${tile('👦',ar(b),'أولاد','b')}${tile('👧',ar(g),'بنات','g')}${n-b-g>0?tile('❔',ar(n-b-g),'لم يحدّد ولد أو بنت','nosx'):tile('✏️',ar(ren),'غيّروا أسماءهم','names')}`)
    +grp('📅 الحضور',`${tile('🟢',ar(on),'داخلين الآن','now')}${tile('☀️',ar(d1),'دخلوا اليوم','d1')}${tile('📅',ar(d7),'دخلوا هذا الأسبوع','d7')}${tile('🗓️',ar(d30),'دخلوا هذا الشهر','d30')}${tile('🏅',ar((heroes||[]).length),'أبطال الأسبوع','heroes')}${tile('📥',dl,'مرّة نُزّل الكتاب','dl')}`)
    +grp('🌟 التعلّم والأعمال',`${tile('📖',ar(L.filter(p=>p.hz>0).length),'حفظوا سورًا','hz')}${tile('🕌',ar(L.filter(p=>p.pr>0).length),'سجّلوا صلواتهم','pr')}${tile('⭐',avg?ar(Math.round(avg*10)/10):'—','متوسط مستوى الأطفال','lv')}`)
    +grp('🎮 أونلاين والأمان',`${tile('⚔️',ar(games),'مباراة لُعبت','play')}${tile('🎮',ar(players),'طفل لعبوا أونلاين','play')}${tile('👑',mx.lv?ar(mx.lv):'—',mx.lv?'👑 الأعلى مستوى:<br>«'+esc(mx.nick)+'»':'أعلى مستوى','max')}${n-b-g>0?tile('✏️',ar(ren),'غيّروا أسماءهم','names'):''}${tile('⚠️',ar(sus2),'يتعمّدون الغلط','sus')}${tile('🔢',ar(ch2),'غيّروا أرقامهم (غش)','cheat')}${tile('⛔',ar(bn),'محظورون الآن','ban')}`)
    +`<p class="tip" style="margin:6px 0 0">👆 اضغط على أي مربع لترى أسماء أصحابه</p>`;
  el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=b.dataset.f;
    if(f=='max'){if(mx.id)kidCard(mx.id);return}openKids(f)})}
/* 🎉 v10.7: رسالة ترحيب باسم الطفل + ١٠ جواهر، مرة واحدة بعد أول تسجيل */
function welcome(nick){const d=D();if(d.welcomed)return;d.welcomed=Date.now();Aamal.save();
  queue.unshift({em:'🎉',title:`أهلًا وسهلًا يا ${String(nick||'').trim()} 🌷`,j:10,
    msg:B('مرحبًا بك في «جنّتي الصغيرة»! سعداء بانضمامك إلينا.\nتعلّم أصول دينك، واحفظ، وصلِّ، وابنِ بيتك في الجنة بأعمالك الصالحة 🤍',
          'مرحبًا بكِ في «جنّتي الصغيرة»! سعداء بانضمامكِ إلينا.\nتعلّمي أصول دينكِ، واحفظي، وصلّي، وابني بيتكِ في الجنة بأعمالكِ الصالحة 🤍')});
  setTimeout(nextMsg,700)}
window.Idara={feedback,fbCount:async()=>{try{await loadFb(O())}catch(e){}return fbs?fbs.filter(x=>!x.r).length:-1},card:id=>{show('idara');kidCard(id)},kidDo,welcome,gift:(id,n,a)=>giftTo(id,n,a),open:openAdmin,inbox,dayNight};
})();
