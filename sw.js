// QuantifyOps Service Worker
const CACHE = 'qops-v1';
const STATIC = ['/icons/icon-192.png', '/icons/icon-512.png', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;

  // Navigation requests (loading the app page) — always go to network first.
  // If offline, fall back to cached index.html so the app still opens.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Skip non-GET and cross-origin requests (Supabase, Google Fonts, CDN scripts)
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  // Static assets (icons etc.) — cache first
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
