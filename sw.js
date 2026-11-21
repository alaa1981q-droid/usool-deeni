const CACHE='usul5-v136';
const FILES=["./", "index.html", "questions.js", "online.js", "bayt.js", "nafsak.js", "hifz.js", "jannah.js", "baytrace.js", "wird.js", "sawt.js", "salah.js", "adhan.js", "alqab.js", "binaa.js", "madina.js", "mujassam.js", "vendor/three.min.js", "idara.js", "parent.js", "qisas.js", "bookdl.js", "ramz.js", "wajiha.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "p/01.webp", "p/02.webp", "p/03.webp", "p/04.webp", "p/05.webp", "p/06.webp", "p/07.webp", "p/08.webp", "p/09.webp", "p/10.webp", "p/11.webp", "p/12.webp", "p/13.webp", "p/14.webp", "p/15.webp", "p/16.webp", "p/17.webp", "p/18.webp", "p/19.webp", "p/20.webp", "p/21.webp", "p/22.webp", "p/23.webp", "p/24.webp", "p/25.webp", "p/26.webp", "p/27.webp", "p/28.webp", "p/29.webp", "p/30.webp", "p/31.webp", "p/32.webp", "p/33.webp", "p/34.webp", "p/35.webp", "p/36.webp", "p/37.webp", "p/38.webp", "audio/001001.mp3", "audio/001002.mp3", "audio/001003.mp3", "audio/001004.mp3", "audio/001005.mp3", "audio/001006.mp3", "audio/001007.mp3", "audio/103001.mp3", "audio/103002.mp3", "audio/103003.mp3", "audio/105001.mp3", "audio/105002.mp3", "audio/105003.mp3", "audio/105004.mp3", "audio/105005.mp3", "audio/106001.mp3", "audio/106002.mp3", "audio/106003.mp3", "audio/106004.mp3", "audio/107001.mp3", "audio/107002.mp3", "audio/107003.mp3", "audio/107004.mp3", "audio/107005.mp3", "audio/107006.mp3", "audio/107007.mp3", "audio/108001.mp3", "audio/108002.mp3", "audio/108003.mp3", "audio/109001.mp3", "audio/109002.mp3", "audio/109003.mp3", "audio/109004.mp3", "audio/109005.mp3", "audio/109006.mp3", "audio/110001.mp3", "audio/110002.mp3", "audio/110003.mp3", "audio/111001.mp3", "audio/111002.mp3", "audio/111003.mp3", "audio/111004.mp3", "audio/111005.mp3", "audio/112001.mp3", "audio/112002.mp3", "audio/112003.mp3", "audio/112004.mp3", "audio/113001.mp3", "audio/113002.mp3", "audio/113003.mp3", "audio/113004.mp3", "audio/113005.mp3", "audio/114001.mp3", "audio/114002.mp3", "audio/114003.mp3", "audio/114004.mp3", "audio/114005.mp3", "audio/114006.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(/\.pdf$/i.test(new URL(e.request.url).pathname))return; // never cache/replace pages with the book PDF
  if(new URL(e.request.url).origin!==location.origin&&!/fonts\.(googleapis|gstatic)\.com$/.test(new URL(e.request.url).hostname))return; // never touch Firebase or other services
  const u=new URL(e.request.url);
  if(u.origin===location.origin&&/\.(js|webmanifest)$/.test(u.pathname)){
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return res})
      .catch(()=>caches.match(e.request,{ignoreSearch:true})));
    return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return res})
      .catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return res;}).catch(()=>caches.match('index.html'))));
});
