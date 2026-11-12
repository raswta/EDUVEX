// sw.js - EDUVEX: notifications, offline support
const CACHE = 'eduvex-v8';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const r = event.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.hostname.endsWith('supabase.co')) return;
  if (u.origin !== location.origin) {
    event.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
      const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res;
    })));
    return;
  }
  event.respondWith(fetch(r, { cache: 'no-cache' }).then(res => {
    const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res;
  }).catch(() => caches.match(r)));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(l => l.length ? l[0].focus() : clients.openWindow('./')));
});

// Handle incoming notification requests from index.html
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_STOPWATCH_NOTIFICATION') {
    const subject = event.data.subject || 'Study Session';
    self.registration.showNotification('EDUVEX - Session in Progress', {
      body: `Currently studying: ${subject}. Keep focusing!`,
      icon: 'icon.png',
      badge: 'icon.png',
      tag: 'eduvex-stopwatch',
      renotify: true,
      requireInteraction: true
    });
  } else if (event.data && event.data.type === 'STOP_STOPWATCH_NOTIFICATION') {
    self.registration.getNotifications({ tag: 'eduvex-stopwatch' }).then((notifications) => {
      notifications.forEach((notification) => notification.close());
    });
  }
});
