'use strict'; // ES6

const VERSION        = '2';
const CACHE          = `fnorders-${VERSION}-assets`;
const OFFLINE_ASSETS = [ // thiings we prefer to store offline
  '/index.html',
  '/fnorders.css',
  '/fnorders.js',
  '/manifest.json',
  '/images/icons/32.png',
  '/images/icons/144.png',
  '/images/icons/152.png',
  '/images/icons/180.png',
  '/images/icons/192.png',
  '/images/icons/512.png',
  '/images/icons/scalable.svg'
];
const ONLINE_ASSETS  = [ // thiings we prefer to use online but will store offline anyway
  '/manifest.json',
  '/service-worker.js'
];

self.addEventListener('install', event => {
  return caches.open(CACHE).then(cache => {
    return cache.addAll(OFFLINE_ASSETS.concat(ONLINE_ASSETS));
  });
});

self.addEventListener('fetch', event => {
  let request = event.request;
  let url = new URL(request.url);

  if(OFFLINE_ASSETS.indexOf(url.pathname) >= 0) {
    // Assets we prefer to load from the cache
    event.respondWith(caches.match(request).then(response => {
      return response;
    }));
  } else if(ONLINE_ASSETS.indexOf(url.pathname) >= 0) {
    // Assets we prefer to load online but would from the cache if necessary
    event.respondWith(fetch(request).then(response => {
      return response;
    }).catch(() => {
      return caches.match(request);
    }));
  } else {
    // Non-cached URLs should be fetched as normal
    event.respondWith(fetch(request).then(response => {
      return response;
    }));
  }
});

