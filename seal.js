/* seal.js (v20.9) — ختم على التقدّم المحفوظ في الجهاز.
   كل مرّة يحفظ التطبيق التقدّم نحفظ معه «ختمًا» ونسخة احتياطية مخفية.
   إذا غيّر أحد الأرقام بيده (من أدوات المتصفح) يختلف الختم، فنرجّع النسخة الصحيحة
   ونعدّ المحاولة في usul5_tmp_v1 (تظهر للمدير في تبويب «⚠️ مشبوه»).
   يُحمَّل قبل كل ملفات التطبيق حتى يصحّح التقدّم قبل أن يقرأه أحد. */
(function(){
let ls;try{ls=window.localStorage;if(!ls)return}catch(e){return}
const KEYS=['usul5_progress_v1','usul5_aamal_v1','usul5_jannah_v1','usul5_cups_v1','usul5_bayt_v1','usul5_hifz_v1','usul5_binaa_v1','usul5_madina_v1','usul5_qasr_v1','usul5_hamas_v1'];
const SK='jn_seal',BP='jn_sb_',TK='usul5_tmp_v1',isK=k=>KEYS.indexOf(k)>=0;
const P=Storage.prototype,_set=P.setItem,_get=P.getItem,_rm=P.removeItem;
const h=s=>{let a=0x811c9dc5,b=0x9e3779b1;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^(c+(a>>>11)),2246822519)}return (a>>>0).toString(36)+'.'+(b>>>0).toString(36)};
const sig=(k,v)=>h('جنّتي|'+k+'|'+v.length+'|'+v);
const enc=v=>{let o='';for(let i=0;i<v.length;i++)o+=String.fromCharCode(v.charCodeAt(i)^(23+i%7));return o};
let seal={};try{seal=JSON.parse(_get.call(ls,SK)||'{}')||{}}catch(e){seal={}}
const saveSeal=()=>{try{_set.call(ls,SK,JSON.stringify(seal))}catch(e){}};
const stamp=(k,v)=>{seal[k]=sig(k,v);try{_set.call(ls,BP+k,enc(v))}catch(e){}};
const bad=[];
KEYS.forEach(k=>{let v;try{v=_get.call(ls,k)}catch(e){return}
  if(v==null){delete seal[k];try{_rm.call(ls,BP+k)}catch(e){}return}
  if(!seal[k]){stamp(k,v);return}            // أول مرّة بعد التحديث: نثق بالموجود ونختمه
  if(seal[k]===sig(k,v))return;
  bad.push(k);let b=null;try{b=_get.call(ls,BP+k)}catch(e){}
  const o=b==null?null:enc(b);
  if(o!=null&&sig(k,o)===seal[k]){try{_set.call(ls,k,o)}catch(e){}}   // رجّع النسخة الصحيحة
  else stamp(k,v)});                          // ما في نسخة صالحة: نقبل ونختم من جديد (لكن نعدّها)
saveSeal();
if(bad.length){try{const t=JSON.parse(_get.call(ls,TK)||'{}')||{};t.n=(t.n|0)+1;t.t=Date.now();t.k=bad.join(',').replace(/usul5_|_v1/g,'');_set.call(ls,TK,JSON.stringify(t))}catch(e){}
  window.__sealFixed=bad.length}
// كل حفظ عادي من التطبيق يحدّث الختم
P.setItem=function(k,v){_set.call(this,k,v);if(this===ls&&isK(k)){stamp(k,String(v));saveSeal()}};
P.removeItem=function(k){_rm.call(this,k);if(this===ls&&isK(k)){delete seal[k];try{_rm.call(ls,BP+k)}catch(e){}saveSeal()}};
window.Seal={tampered:()=>{try{return (JSON.parse(_get.call(ls,TK)||'{}')||{}).n|0}catch(e){return 0}}};
// رسالة لطيفة للطفل بعد ما يفتح التطبيق
if(bad.length)window.addEventListener('load',()=>setTimeout(()=>{try{const m=document.createElement('div');
  m.style.cssText='position:fixed;left:12px;right:12px;bottom:20px;z-index:99999;background:#fff8e6;color:#6b4a12;border:2px solid #e8b84a;border-radius:16px;padding:12px 14px;font:16px/1.6 inherit;text-align:center;box-shadow:0 6px 20px #0003';
  m.textContent='🌷 لاحظنا أن أرقامك تغيّرت من خارج التطبيق، فرجّعناها كما كانت. النقاط الحقيقية تأتي من الأعمال الصالحة 💚';
  document.body.appendChild(m);setTimeout(()=>m.remove(),7000)}catch(e){}},1500));
})();
