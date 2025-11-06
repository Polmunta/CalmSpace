
const CACHE_NAME="calmspace-v3";const ASSETS=["/","/manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))) });
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;e.respondWith(caches.match(r).then(c=>c||fetch(r).then(resp=>{const copy=resp.clone();caches.open(CACHE_NAME).then(cache=>cache.put(r,copy));return resp;}))) });
