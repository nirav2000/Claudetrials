/**
 * Service Worker for Offline Support
 * Enables the Fraction Worksheet App to work offline using caching strategies
 */

const CACHE_NAME = 'fraction-worksheet-v2.9.0';
const DYNAMIC_CACHE = 'fraction-worksheet-dynamic-v2.9.0';

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/layout/base.css',
    '/css/layout/header.css',
    '/css/layout/main-container.css',
    '/css/utilities/utilities.css',
    '/css/components/buttons.css',
    '/css/components/forms.css',
    '/css/components/modals.css',
    '/css/components/cards.css',
    '/css/components/auth-integration.css',
    '/css/features/problem-grid.css',
    '/css/features/input-methods.css',
    '/css/features/visual-aids.css',
    '/css/features/carousel.css',
    '/css/features/educational-content.css',
    '/css/features/mistake-feedback.css',
    '/css/features/mobile-optimized.css',
    '/js/app.js',
    '/js/auth-integration.js',
    '/js/core/config.js',
    '/js/core/domHelpers.js',
    '/js/core/utils.js',
    '/js/features/carousel.js',
    '/js/features/checkAnswers.js',
    '/js/features/drawingRecognition.js',
    '/js/features/educationalContent.js',
    '/js/features/educationalVisuals.js',
    '/js/features/inputMethods.js',
    '/js/features/mistakeDetection.js',
    '/js/features/printExport.js',
    '/js/features/problemGenerator.js',
    '/js/features/visualAids.js',
    '/js/features/voiceRecognition.js',
    '/js/utils/circleChart.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...', CACHE_NAME);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch(error => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...', CACHE_NAME);

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => {
                            // Delete old caches
                            return name !== CACHE_NAME && name !== DYNAMIC_CACHE;
                        })
                        .map(name => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim(); // Take control of all clients
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // For Firebase/Google APIs, always go to network
        if (url.origin.includes('firebase') ||
            url.origin.includes('googleapis') ||
            url.origin.includes('google')) {
            return;
        }
    }

    // Skip POST, PUT, DELETE requests
    if (request.method !== 'GET') {
        return;
    }

    // Use cache-first strategy for static assets
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', request.url);
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                console.log('[Service Worker] Fetching from network:', request.url);
                return fetch(request)
                    .then(networkResponse => {
                        // Don't cache if not a success response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                            return networkResponse;
                        }

                        // Clone the response (can only be consumed once)
                        const responseToCache = networkResponse.clone();

                        // Cache the fetched response for future use
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                console.log('[Service Worker] Caching new resource:', request.url);
                                cache.put(request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('[Service Worker] Fetch failed:', error);

                        // Return offline page if available
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }

                        // Return a fallback response
                        return new Response('Offline - Resource not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Message event - for communicating with the app
self.addEventListener('message', event => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('[Service Worker] Clearing cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
});

// Background sync event (for future use - saving data when back online)
self.addEventListener('sync', event => {
    console.log('[Service Worker] Sync event:', event.tag);

    if (event.tag === 'sync-worksheets') {
        event.waitUntil(
            // Future: Sync worksheet data with Firestore when back online
            Promise.resolve()
        );
    }
});

// Push notification event (for future use)
self.addEventListener('push', event => {
    console.log('[Service Worker] Push notification received');

    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('Fraction Worksheet App', options)
    );
});

console.log('[Service Worker] Loaded successfully');
