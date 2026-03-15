// ─── Arcly Service Worker ────────────────────────────
// Cache-first strategy for offline support

const CACHE_NAME = 'arcly-v1';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/constants.js',
  './js/storage.js',
  './js/time-utils.js',
  './js/clock-renderer.js',
  './js/drag-handler.js',
  './js/modal.js',
  './js/activity-list.js',
  './assets/favicon/favicon-96x96.png',
  './assets/favicon/favicon.svg',
  './assets/favicon/apple-touch-icon.png',
];

// Install — cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Return cached version, but also update cache in background
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {});

        return cached;
      }

      // Not in cache — fetch from network and cache it
      return fetch(event.request).then(response => {
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
