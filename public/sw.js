/**
* CalendaLav
* © 2026 Domenico Marzo. Tutti i diritti riservati.
* È vietata la copia, la distribuzione e la modifica non autorizzata del codice.
**/
/* CalendaLav - service worker minimo per l'avvio offline della "shell" dell'app.
   Va servito dalla stessa cartella di index.html (stessa origine).
   I dati restano su Google Drive: questo SW NON mette in cache le chiamate a Google. */
const CACHE = 'CalendaLav-v4.4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './icon-maskable.png', './app.css', './sql-wasm.js'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // Le API Google (Drive/OAuth/font) devono sempre passare dalla rete
    if (/googleapis\.com$|google\.com$|gstatic\.com$|accounts\.google\.com$/.test(url.hostname)) return;

    // Navigazioni: network-first con fallback alla shell in cache (avvio offline)
    if (req.mode === 'navigate') {
        e.respondWith(
            fetch(req)
                .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Altri GET (CDN, librerie): stale-while-revalidate
    e.respondWith(
        caches.match(req).then(cached => {
            const network = fetch(req)
                .then(res => { if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
                .catch(() => cached);
            return cached || network;
        })
    );
});
