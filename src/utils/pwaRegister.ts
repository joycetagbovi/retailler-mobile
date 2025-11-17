/**
 * Service Worker Registration
 * Registers the service worker for PWA offline functionality
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is installed, show update notification
                  if (confirm('A new version is available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });

      // Handle service worker controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    });
  }
}

/**
 * Unregister service worker (for development/testing)
 */
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

/**
 * Check if app is running in standalone mode (installed as PWA)
 */
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Request persistent storage (for offline data)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    const granted = await navigator.storage.persist();
    console.log(`Persistent storage ${granted ? 'granted' : 'denied'}`);
    return granted;
  }
  return false;
}

/**
 * Get storage estimate
 */
export async function getStorageEstimate() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    const usageInMB = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) : '0';
    const quotaInMB = estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(2) : '0';
    
    console.log(`Storage used: ${usageInMB} MB of ${quotaInMB} MB`);
    return { usage: usageInMB, quota: quotaInMB };
  }
  return null;
}
