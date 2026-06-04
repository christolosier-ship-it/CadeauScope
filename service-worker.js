const CACHE_NAME = 'cadeauscope-v1.0.3';
const ESSENTIAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './css/responsive.css',
  './css/screens.css',
  './css/themes.css',
  './css/variables.css',
  './js/app.js',
  './js/config.js',
  './js/db/db.js',
  './js/db/repositories.js',
  './js/db/schema.js',
  './js/db/seed.js',
  './js/models/categories.model.js',
  './js/models/history.model.js',
  './js/models/ideas.model.js',
  './js/models/occasions.model.js',
  './js/models/people.model.js',
  './js/models/photos.model.js',
  './js/models/settings.model.js',
  './js/router.js',
  './js/screens/home.screen.js',
  './js/screens/idea-detail.screen.js',
  './js/screens/ideas.screen.js',
  './js/screens/occasion-detail.screen.js',
  './js/screens/occasions.screen.js',
  './js/screens/panic.screen.js',
  './js/screens/people.screen.js',
  './js/screens/person-detail.screen.js',
  './js/screens/quick-capture.screen.js',
  './js/screens/settings.screen.js',
  './js/screens/welcome.screen.js',
  './js/services/budget.service.js',
  './js/services/categories.service.js',
  './js/services/dashboard.service.js',
  './js/services/history.service.js',
  './js/services/ideas.service.js',
  './js/services/import-export.service.js',
  './js/services/occasions.service.js',
  './js/services/panic.service.js',
  './js/services/people.service.js',
  './js/services/photos.service.js',
  './js/services/settings.service.js',
  './js/services/validation.service.js',
  './js/state.js',
  './js/ui/dom.js',
  './js/ui/forms.js',
  './js/ui/icons.js',
  './js/ui/idea-card-actions.js',
  './js/ui/modals.js',
  './js/ui/navigation.js',
  './js/ui/render.js',
  './js/ui/toasts.js',
  './js/utils/currency.js',
  './js/utils/dates.js',
  './js/utils/debug.js',
  './js/utils/files.js',
  './js/utils/ids.js',
  './js/utils/numbers.js',
  './js/utils/storage.js',
  './js/utils/strings.js'
];
const OPTIONAL_ASSETS = ['./assets/icons/icon-192.png','./assets/icons/icon-512.png','./assets/icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ESSENTIAL_ASSETS);
    await Promise.all(OPTIONAL_ASSETS.map(async asset => {
      try { await cache.add(asset); } catch (_) { /* icônes PNG absentes en V1: non bloquant */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    const fetchPromise = fetch(event.request).then(response => {
      if (response && response.ok && new URL(event.request.url).origin === location.origin) {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      }
      return response;
    }).catch(() => cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    return cached || fetchPromise;
  })());
});
