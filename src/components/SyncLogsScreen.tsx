import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SyncLogsScreenProps {
  onBack: () => void;
}

interface SyncLog {
  id: string;
  type: 'sale' | 'inventory' | 'customer';
  status: 'pending' | 'synced' | 'failed';
  timestamp: string;
  data: any;
  error?: string;
}

export function SyncLogsScreen({ onBack }: SyncLogsScreenProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);

  useEffect(() => {
    // Load sync logs
    loadSyncLogs();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadSyncLogs = () => {
    // Load pending sales
    const pendingSales = JSON.parse(localStorage.getItem('pos-pending-sales') || '[]');
    
    const logs: SyncLog[] = pendingSales.map((sale: any, index: number) => ({
      id: `log-${index}`,
      type: 'sale',
      status: sale.synced ? 'synced' : 'pending',
      timestamp: sale.date || sale.timestamp,
      data: sale,
      error: sale.error
    }));

    setSyncLogs(logs);
  };

  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    
    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update all pending to synced
      const updatedLogs = syncLogs.map(log => ({
        ...log,
        status: log.status === 'pending' ? 'synced' as const : log.status
      }));
      
      setSyncLogs(updatedLogs);
      localStorage.setItem('pos-pending-sales', '[]');
      
      toast.success('All data synced successfully');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingCount = syncLogs.filter(log => log.status === 'pending').length;
  const syncedCount = syncLogs.filter(log => log.status === 'synced').length;
  const failedCount = syncLogs.filter(log => log.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#008060] text-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-white">Sync Logs</h2>
            <p className="text-[#95bf46] text-sm">Offline data synchronization</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">Offline</span>
                </>
              )}
            </div>
            <Badge 
              variant="secondary" 
              className={`${isOnline ? 'bg-green-500' : 'bg-orange-500'} text-white border-0`}
            >
              {isOnline ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-gray-500 text-xs mb-1">Pending</p>
              <p className="text-gray-900 text-xl">{pendingCount}</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-gray-500 text-xs mb-1">Synced</p>
              <p className="text-gray-900 text-xl">{syncedCount}</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-gray-500 text-xs mb-1">Failed</p>
              <p className="text-gray-900 text-xl">{failedCount}</p>
            </div>
          </Card>
        </div>

        {/* Sync Button */}
        <Button
          onClick={handleSync}
          disabled={!isOnline || isSyncing || pendingCount === 0}
          className="w-full h-12 bg-[#008060] hover:bg-[#006e52] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : `Sync Now (${pendingCount} pending)`}
        </Button>

        {/* Sync Logs */}
        <div>
          <h3 className="text-gray-900 mb-3">Sync History</h3>
          
          {syncLogs.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sync logs</p>
              <p className="text-gray-400 text-sm">All data is synced</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {syncLogs.map(log => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={
                            log.status === 'synced' ? 'default' : 
                            log.status === 'failed' ? 'destructive' : 
                            'outline'
                          }
                          className="capitalize"
                        >
                          {log.status}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {log.type}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-1">
                        {log.type === 'sale' && `Receipt ${log.data.receiptNumber}`}
                      </p>
                      
                      <p className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>

                      {log.error && (
                        <div className="flex items-center gap-2 mt-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">{log.error}</span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {log.status === 'synced' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {log.status === 'pending' && (
                        <Clock className="w-5 h-5 text-orange-600" />
                      )}
                      {log.status === 'failed' && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-[#f1f8f5] border-[#b4e4d4]">
          <h3 className="text-gray-900 mb-2">About Offline Sync</h3>
          <p className="text-gray-600 text-sm">
            All sales and transactions are saved locally when offline. 
            Once you're back online, tap "Sync Now" to upload all pending data to the server.
          </p>
        </Card>
      </div>
    </div>
  );
}