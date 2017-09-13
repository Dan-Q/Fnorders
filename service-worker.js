'use strict'; // ES6

const VERSION        = '7';
const CACHE          = `fnorders-${VERSION}-assets`;
const OFFLINE_ASSETS = [ // things we prefer to store offline
  '/',
  '/fnorders.css',
  '/fnorders.js',
  '/images/icons/32.png',
  '/images/icons/144.png',
  '/images/icons/152.png',
  '/images/icons/180.png',
  '/images/icons/192.png',
  '/images/icons/512.png',
  '/images/icons/scalable.svg',
  '/fonts/montserrat-v10-latin-600.woff',
  '/fonts/montserrat-v10-latin-600.woff2'
];
const ONLINE_ASSETS  = [ // things we prefer to use online but will store offline anyway
  '/manifest.json',
  '/service-worker.js'
];

this.addEventListener('install', event => {
console.log(CACHE);
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      cache.addAll(OFFLINE_ASSETS.concat(ONLINE_ASSETS));
    })
  );
});

this.addEventListener('fetch', event => {
  let request = event.request;
  let url = new URL(request.url);

  if(OFFLINE_ASSETS.indexOf(url.pathname) >= 0) {
    // Assets we prefer to load from the cache
    event.respondWith(caches.match(request));
  } else if(ONLINE_ASSETS.indexOf(url.pathname) >= 0) {
    // Assets we prefer to load online but would from the cache if necessary
    event.respondWith(fetch(request).then(response => {
      return response;
    }).catch(() => {
      return caches.match(request);
    }));
  } else {
    // Non-cached URLs should be fetched as normal
    event.respondWith(fetch(request));
  }
});

