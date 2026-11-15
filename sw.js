const CACHE='usul5-v6';
const FILES=["./", "index.html", "questions.js", "online.js", "bayt.js", "nafsak.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "p/01.webp", "p/02.webp", "p/03.webp", "p/04.webp", "p/05.webp", "p/06.webp", "p/07.webp", "p/08.webp", "p/09.webp", "p/10.webp", "p/11.webp", "p/12.webp", "p/13.webp", "p/14.webp", "p/15.webp", "p/16.webp", "p/17.webp", "p/18.webp", "p/19.webp", "p/20.webp", "p/21.webp", "p/22.webp", "p/23.webp", "p/24.webp", "p/25.webp", "p/26.webp", "p/27.webp", "p/28.webp", "p/29.webp", "p/30.webp", "p/31.webp", "p/32.webp", "p/33.webp", "p/34.webp", "p/35.webp", "p/36.webp", "p/37.webp", "p/38.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
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
