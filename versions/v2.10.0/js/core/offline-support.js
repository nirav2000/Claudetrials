/**
 * Offline Support Module
 * Registers service worker and handles offline/online events
 */

/**
 * Register service worker for offline support
 */
export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.log('Service Worker not supported in this browser');
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 Service Worker update found');

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    showUpdateNotification();
                }
            });
        });

        return true;

    } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
        return false;
    }
}

/**
 * Show notification when app update is available
 */
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.innerHTML = `
        <div class="update-banner">
            <span class="update-message">🔄 New version available!</span>
            <button id="update-reload-btn" class="update-btn">Update Now</button>
            <button id="update-dismiss-btn" class="update-btn-dismiss">Later</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Reload to get new version
    document.getElementById('update-reload-btn').addEventListener('click', () => {
        window.location.reload();
    });

    // Dismiss notification
    document.getElementById('update-dismiss-btn').addEventListener('click', () => {
        notification.remove();
    });
}

/**
 * Initialize offline/online detection
 */
export function initializeOfflineDetection() {
    // Create offline indicator
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator';
    indicator.innerHTML = `
        <span class="material-icons">cloud_off</span>
        <span>You're offline. Working in offline mode.</span>
    `;
    indicator.style.display = 'none';
    document.body.appendChild(indicator);

    // Check initial online status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    console.log('📡 Offline detection initialized');
}

/**
 * Update UI based on online/offline status
 */
function updateOnlineStatus() {
    const indicator = document.getElementById('offline-indicator');
    const isOnline = navigator.onLine;

    if (indicator) {
        if (!isOnline) {
            indicator.style.display = 'flex';
            console.log('📵 Offline mode activated');

            // Optionally store worksheets locally when offline
            enableLocalStorage();
        } else {
            indicator.style.display = 'none';
            console.log('📶 Online mode - syncing data...');

            // Sync any pending data when back online
            syncPendingData();
        }
    }

    // Update app state
    document.body.classList.toggle('offline-mode', !isOnline);
}

/**
 * Enable local storage fallback for offline mode
 */
function enableLocalStorage() {
    console.log('💾 Local storage enabled for offline support');
    // Future: Implement IndexedDB for larger data storage
}

/**
 * Sync pending data when back online
 */
async function syncPendingData() {
    // Future: Sync any locally stored worksheets to Firestore
    console.log('🔄 Syncing pending data...');

    // Check for pending worksheets in localStorage
    const pendingWorksheets = localStorage.getItem('pendingWorksheets');
    if (pendingWorksheets) {
        console.log('📤 Found pending worksheets to sync');
        // Future: Upload to Firestore
    }
}

/**
 * Check if app can work offline
 * @returns {Promise<boolean>}
 */
export async function checkOfflineCapability() {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        return registration.active !== null;
    } catch (error) {
        return false;
    }
}

/**
 * Get cache version from service worker
 * @returns {Promise<string>}
 */
export async function getCacheVersion() {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        return 'unknown';
    }

    return new Promise((resolve) => {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
            resolve(event.data.version || 'unknown');
        };

        navigator.serviceWorker.controller.postMessage(
            { type: 'GET_VERSION' },
            [messageChannel.port2]
        );

        // Timeout after 2 seconds
        setTimeout(() => resolve('unknown'), 2000);
    });
}

/**
 * Clear all caches (useful for debugging)
 */
export async function clearAllCaches() {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        console.warn('Cannot clear caches - service worker not available');
        return false;
    }

    try {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        console.log('✅ Cache clear request sent');
        return true;
    } catch (error) {
        console.error('❌ Failed to clear caches:', error);
        return false;
    }
}

// Add CSS styles for offline indicator
const style = document.createElement('style');
style.textContent = `
    #offline-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%);
        color: white;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }

    #offline-indicator .material-icons {
        font-size: 20px;
    }

    #update-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10001;
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .update-banner {
        background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }

    .update-message {
        flex: 1;
        font-weight: 500;
    }

    .update-btn,
    .update-btn-dismiss {
        background: white;
        color: #4CAF50;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .update-btn:hover {
        background: #f1f1f1;
        transform: translateY(-2px);
    }

    .update-btn-dismiss {
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .update-btn-dismiss:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
        #offline-indicator {
            font-size: 13px;
            padding: 10px 16px;
        }

        #update-notification {
            bottom: 10px;
            right: 10px;
            left: 10px;
        }

        .update-banner {
            padding: 12px 16px;
            justify-content: center;
        }

        .update-message {
            flex-basis: 100%;
            text-align: center;
            margin-bottom: 8px;
        }
    }

    @media print {
        #offline-indicator,
        #update-notification {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);
