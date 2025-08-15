const CACHE_NAME = 'colorblind-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/js/main.js',
  '/js/camera-simulator.js',
  '/js/picture-simulator.js',
  '/js/website-simulator.js',
  '/js/color-picker.js',
  '/js/ishihara-test.js',
  '/js/hrr-test.js',
  'https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return caches.match('/index.html');
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});