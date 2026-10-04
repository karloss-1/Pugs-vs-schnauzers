const CACHE='pugs-garden-v3';
const ASSETS=['./','./index.html','./style.css','./manifest.webmanifest','./src/app.js','./src/config.js','./src/engine.js','./src/renderer.js','./src/audio.js','./src/art/characters.png','./assets/art/garden.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png','./assets/icons/maskable-512.png','./assets/icons/apple-touch-icon.png'];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});

self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('pugs-garden-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;

  const isNetworkFirst=request.mode==='navigate'||/\.(html|js|css|webmanifest)$/.test(url.pathname);
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(isNetworkFirst){
      try{
        const response=await fetch(request);
        if(response.ok)await cache.put(request,response.clone());
        return response;
      }catch{
        const cached=await caches.match(request);
        if(cached)return cached;
        if(request.mode==='navigate')return caches.match('./index.html');
        return Response.error();
      }
    }

    const cached=await caches.match(request);
    if(cached)return cached;
    try{
      const response=await fetch(request);
      if(response.ok)await cache.put(request,response.clone());
      return response;
    }catch{return Response.error();}
  })());
});
