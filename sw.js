// AIIST Islamic Studies Department: phone notifications
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'AIIST Islamic Studies Department';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || 'You have an update in your portal.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'aiist-update',
    data: { url: data.url || './' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil((async () => {
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow(target);
  })());
});
