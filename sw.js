const CACHE_NAME = 'coursealign-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/screens/courses.html',
  '/screens/ai-chat.html',
  '/screens/bookmark.html',
  '/screens/settings.html',
  '/screens/splash-screen.html',
  '/screens/login.html',
  '/screens/signup.html',
  '/screens/exam.html',
  '/screens/filter.html',
  '/css/index.css',
  '/scripts/index.js',
  '/scripts/auth.js',
  '/scripts/courses.js',
  '/assets/courses.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('CourseAlign SW: Install event triggered');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('CourseAlign SW: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('CourseAlign SW: All files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('CourseAlign SW: Cache failed:', error);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('CourseAlign SW: Activate event triggered');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('CourseAlign SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('CourseAlign SW: Cache cleanup complete');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Cache First Strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('CourseAlign SW: Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              console.log('CourseAlign SW: Caching new resource:', event.request.url);
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.error('CourseAlign SW: Fetch failed:', error);
          
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          // For other requests, you might want to return a default offline resource
          throw error;
        });
      })
  );
});

// Background Sync (for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('CourseAlign SW: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  // For example, sync bookmarks, user progress, etc.
  return Promise.resolve();
}

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('CourseAlign SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Courses',
        icon: '/assets/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CourseAlign', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('CourseAlign SW: Notification clicked');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/screens/courses.html')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message Handler (for communication with main app)
self.addEventListener('message', (event) => {
  console.log('CourseAlign SW: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});