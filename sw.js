// sw.js - EDUVEX: notifications, offline support
const CACHE = 'eduvex-v10';

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
  // Images: show the saved copy instantly, refresh it in the background
  if (/\.(png|jpe?g|webp|svg)$/i.test(u.pathname)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok) cache.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  // Pages and scripts: network first, but use the saved copy if the network takes more than 4 seconds
  const net = fetch(r, { cache: 'no-cache' }).then(res => {
    const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res;
  });
  event.waitUntil(net.catch(() => {}));
  event.respondWith(caches.match(r).then(hit => {
    if (!hit) return net.catch(() => caches.match(r));
    return Promise.race([net.catch(() => hit), new Promise(ok => setTimeout(() => ok(hit), 4000))]);
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(l => l.length ? l[0].focus() : clients.openWindow('./')));
});

// Reminders sent from the server (work even when the app is closed)
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) {}
  event.waitUntil(self.registration.showNotification(d.title || 'EDUVEX', {
    body: d.body || 'Your stopwatch is still running.',
    icon: 'icon.png',
    badge: 'icon.png',
    tag: d.tag || 'eduvex-alert'
  }));
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
