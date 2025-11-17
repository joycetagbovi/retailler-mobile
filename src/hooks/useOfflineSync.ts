import { useState, useEffect } from 'react';

export interface SyncStatus {
  lastSync: Date | null;
  pendingItems: number;
  failedItems: number;
  isSyncing: boolean;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    pendingItems: 0,
    failedItems: 0,
    isSyncing: false
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when back online
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingData = async () => {
    if (!isOnline) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Get pending sales from localStorage
      const pendingSales = JSON.parse(localStorage.getItem('pos-pending-sales') || '[]');
      
      if (pendingSales.length > 0) {
        // Simulate API call to sync data
        // In real app, this would call your ERP backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear pending sales after successful sync
        localStorage.setItem('pos-pending-sales', '[]');
        
        setSyncStatus({
          lastSync: new Date(),
          pendingItems: 0,
          failedItems: 0,
          isSyncing: false
        });
      } else {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSync: new Date()
        }));
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        failedItems: prev.failedItems + 1
      }));
    }
  };

  const addPendingSale = (saleData: any) => {
    const pendingSales = JSON.parse(localStorage.getItem('pos-pending-sales') || '[]');
    pendingSales.push({
      ...saleData,
      timestamp: new Date().toISOString(),
      synced: false
    });
    localStorage.setItem('pos-pending-sales', JSON.stringify(pendingSales));
    
    setSyncStatus(prev => ({
      ...prev,
      pendingItems: prev.pendingItems + 1
    }));

    // Try to sync if online
    if (isOnline) {
      syncPendingData();
    }
  };

  return { isOnline, syncStatus, addPendingSale, syncPendingData };
}
