var cache_name = 'gih-cache';
var cached_urls = [
  'index.html',
  'optional.html',
  'style.css',
  'images/f.jpg',
  'images/g4.png',
  'project1/add2numbers.js',
  'project1/add2numbers.html',
  'project2/index.html',
  'project2/css/mystyle.css',
  'project3/index.html',
  'project3/css/mystyle.css',
  'project3/data/peta.json',
  'project3/images/ikanbakar.jpg',
  'project3/images/seafood.jpg',
  'project3/images/spanyol.jpg',
  'project3/images/steak.jpg',
  'project3/images/warkop.jpg',
  'project3/js/peta.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name)
    .then(function(cache) {
      return cache.addAll(cached_urls);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('pages-cache-') && staticCacheName !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('404.html');
          }
          return caches.open(cached_urls).then(function(cache) {
           cache.put(event.request.url, response.clone());
            return response;
          });
        });
      }).catch(function(error) {
        console.log('Error, ', error);
        return caches.match('offline.html');
      })
    );
  });