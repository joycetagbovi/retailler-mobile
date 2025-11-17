import { WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { SyncStatus } from '../hooks/useOfflineSync';

interface OfflineIndicatorProps {
  isOnline: boolean;
  syncStatus: SyncStatus;
}

export function OfflineIndicator({ isOnline, syncStatus }: OfflineIndicatorProps) {
  if (isOnline && syncStatus.pendingItems === 0) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      isOnline ? 'bg-[#008060]' : 'bg-[#bf0711]'
    } text-white px-4 py-2 text-sm`}>
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Syncing {syncStatus.pendingItems} items...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode - {syncStatus.pendingItems} items pending</span>
          </>
        )}
      </div>
    </div>
  );
}