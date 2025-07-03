// Service Worker for ToolHub - PWA Capabilities
const CACHE_NAME = 'toolhub-v1.0.0';
const STATIC_CACHE = 'toolhub-static-v1.0.0';
const DYNAMIC_CACHE = 'toolhub-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/tools-data.js',
    '/manifest.json',
    // External resources
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old cache versions
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch event - serve cached content and implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(request)) {
        // Cache First strategy for static assets
        event.respondWith(cacheFirst(request));
    } else if (isApiRequest(request)) {
        // Network First strategy for API calls
        event.respondWith(networkFirst(request));
    } else if (isImageRequest(request)) {
        // Cache First strategy for images
        event.respondWith(cacheFirstWithRefresh(request));
    } else {
        // Stale While Revalidate for everything else
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Cache First Strategy - for static assets
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache First failed:', error);
        return caches.match('/offline.html') || new Response('Offline');
    }
}

// Network First Strategy - for API calls and dynamic content
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
    }
}

// Cache First with Refresh - for images
async function cacheFirstWithRefresh(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Return cached version immediately
        fetchAndCache(request); // Update cache in background
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    return fetchAndCache(request);
}

// Stale While Revalidate - for general content
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    }).catch(() => {
        // Network failed, return cached version if available
        return cachedResponse;
    });
    
    // Return cached version immediately if available, otherwise wait for network
    return cachedResponse || networkPromise;
}

// Helper function to fetch and cache
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}

// Helper functions to identify request types
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_FILES.some(file => url.pathname.endsWith(file)) ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.html');
}

function isApiRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') ||
           url.hostname !== self.location.hostname;
}

function isImageRequest(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');
    
    if (event.tag === 'toolhub-sync') {
        event.waitUntil(
            // Handle offline actions when connection is restored
            handleBackgroundSync()
        );
    }
});

async function handleBackgroundSync() {
    try {
        // Get offline actions from IndexedDB or localStorage
        const offlineActions = getOfflineActions();
        
        for (const action of offlineActions) {
            try {
                await executeOfflineAction(action);
                removeOfflineAction(action.id);
            } catch (error) {
                console.error('Failed to execute offline action:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    const options = {
        body: data.body || 'New tools available!',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        data: data.url || '/',
        actions: [
            {
                action: 'view',
                title: 'View Tools',
                icon: '/icons/view-icon.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/dismiss-icon.png'
            }
        ],
        tag: 'toolhub-notification',
        renotify: true,
        requireInteraction: false,
        silent: false
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'ToolHub', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data || '/')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                // Check if app is already open
                for (let client of windowClients) {
                    if (client.url === self.registration.scope && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window if app not open
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'GET_VERSION':
                event.ports[0].postMessage({ version: CACHE_NAME });
                break;
            case 'CACHE_URLS':
                event.waitUntil(
                    cacheUrls(event.data.urls)
                );
                break;
            case 'CLEAR_CACHE':
                event.waitUntil(
                    clearAllCaches()
                );
                break;
        }
    }
});

// Cache specific URLs
async function cacheUrls(urls) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.addAll(urls);
        console.log('Service Worker: URLs cached successfully');
    } catch (error) {
        console.error('Service Worker: Failed to cache URLs', error);
    }
}

// Clear all caches
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Service Worker: All caches cleared');
    } catch (error) {
        console.error('Service Worker: Failed to clear caches', error);
    }
}

// Utility functions for offline actions
function getOfflineActions() {
    // This would typically use IndexedDB
    try {
        const actions = localStorage.getItem('toolhub-offline-actions');
        return actions ? JSON.parse(actions) : [];
    } catch (error) {
        console.error('Failed to get offline actions:', error);
        return [];
    }
}

function removeOfflineAction(actionId) {
    try {
        const actions = getOfflineActions();
        const filteredActions = actions.filter(action => action.id !== actionId);
        localStorage.setItem('toolhub-offline-actions', JSON.stringify(filteredActions));
    } catch (error) {
        console.error('Failed to remove offline action:', error);
    }
}

async function executeOfflineAction(action) {
    switch (action.type) {
        case 'TOOL_SUBMIT':
            return submitTool(action.data);
        case 'NEWSLETTER_SUBSCRIBE':
            return subscribeToNewsletter(action.data);
        case 'ANALYTICS_EVENT':
            return sendAnalyticsEvent(action.data);
        default:
            console.log('Unknown offline action type:', action.type);
    }
}

// Offline action handlers
async function submitTool(toolData) {
    const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to submit tool');
    }
    
    return response.json();
}

async function subscribeToNewsletter(email) {
    const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
    }
    
    return response.json();
}

async function sendAnalyticsEvent(eventData) {
    // Send to analytics service
    const response = await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to send analytics event');
    }
    
    return response.json();
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'toolhub-update-check') {
        event.waitUntil(checkForUpdates());
    }
});

async function checkForUpdates() {
    try {
        // Check for new tools or updates
        const response = await fetch('/api/tools/updates');
        if (response.ok) {
            const updates = await response.json();
            if (updates.hasNewTools) {
                // Show notification about new tools
                self.registration.showNotification('New Tools Available!', {
                    body: `${updates.count} new tools have been added to ToolHub`,
                    icon: '/icons/icon-192.png',
                    tag: 'new-tools'
                });
            }
        }
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}

console.log('Service Worker: Script loaded');