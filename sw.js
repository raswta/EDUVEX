// sw.js - Service Worker for EDUVEX persistent notifications & offline support
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming notification requests from index.html
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_STOPWATCH_NOTIFICATION') {
    const subject = event.data.subject || 'Study Session';
    self.registration.showNotification('EDUVEX - Session in Progress ⏱️', {
      body: `Currently studying: ${subject}. Keep focusing!`,
      icon: 'https://img.icons8.com/fluency/96/timer.png',
      tag: 'eduvex-stopwatch',
      renotify: true,
      persistent: true,
      requireInteraction: true
    });
  } else if (event.data && event.data.type === 'STOP_STOPWATCH_NOTIFICATION') {
    self.registration.getNotifications({ tag: 'eduvex-stopwatch' }).then((notifications) => {
      notifications.forEach((notification) => notification.close());
    });
  }
});
