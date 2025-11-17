import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User as UserIcon,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { User } from '../App';

interface ReconciliationRecord {
  id: string;
  date: string;
  time: string;
  cashier: string;
  expectedTotal: number;
  actualTotal: number;
  variance: number;
  transactionCount: number;
  status: 'balanced' | 'variance' | 'pending-approval';
  notes?: string;
}

interface ReconciliationHistoryProps {
  user: User;
  onBack: () => void;
}

export function ReconciliationHistory({ user, onBack }: ReconciliationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'balanced' | 'variance'>('all');

  // Mock data - in real app, would fetch from API
  const reconciliations: ReconciliationRecord[] = [
    {
      id: 'REC-2024-001',
      date: '2024-11-17',
      time: '22:15',
      cashier: 'John Doe',
      expectedTotal: 2450.75,
      actualTotal: 2450.75,
      variance: 0,
      transactionCount: 23,
      status: 'balanced'
    },
    {
      id: 'REC-2024-002',
      date: '2024-11-16',
      time: '21:45',
      cashier: 'Jane Smith',
      expectedTotal: 3125.50,
      actualTotal: 3100.00,
      variance: -25.50,
      transactionCount: 31,
      status: 'variance',
      notes: 'Small variance in cash drawer, investigated and documented.'
    },
    {
      id: 'REC-2024-003',
      date: '2024-11-15',
      time: '22:30',
      cashier: 'John Doe',
      expectedTotal: 1890.25,
      actualTotal: 1890.25,
      variance: 0,
      transactionCount: 18,
      status: 'balanced'
    },
    {
      id: 'REC-2024-004',
      date: '2024-11-14',
      time: '21:20',
      cashier: 'Sarah Johnson',
      expectedTotal: 4250.00,
      actualTotal: 4275.00,
      variance: 25.00,
      transactionCount: 42,
      status: 'variance',
      notes: 'Found extra cash, customer may have overpaid.'
    },
    {
      id: 'REC-2024-005',
      date: '2024-11-13',
      time: '22:00',
      cashier: 'Jane Smith',
      expectedTotal: 2890.50,
      actualTotal: 2890.50,
      variance: 0,
      transactionCount: 27,
      status: 'balanced'
    }
  ];

  const filteredReconciliations = reconciliations.filter(rec => {
    const matchesSearch = rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.cashier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.date.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'balanced' && rec.status === 'balanced') ||
                         (filterStatus === 'variance' && rec.status === 'variance');
    return matchesSearch && matchesFilter;
  });

  const totalRecords = reconciliations.length;
  const balancedCount = reconciliations.filter(r => r.status === 'balanced').length;
  const varianceCount = reconciliations.filter(r => r.status === 'variance').length;

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
            <h2 className="text-white">Reconciliation History</h2>
            <p className="text-[#95bf46] text-sm">View all end-of-day reports</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <p className="text-gray-500 text-xs mb-1">Total</p>
            <p className="text-gray-900 text-xl">{totalRecords}</p>
          </Card>
          <Card className="p-3 bg-green-50 border-green-200">
            <p className="text-green-600 text-xs mb-1">Balanced</p>
            <p className="text-green-900 text-xl">{balancedCount}</p>
          </Card>
          <Card className="p-3 bg-amber-50 border-amber-200">
            <p className="text-amber-600 text-xs mb-1">Variance</p>
            <p className="text-amber-900 text-xl">{varianceCount}</p>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by ID, cashier, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex gap-2 flex-1">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className="flex-1"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'balanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('balanced')}
                  className="flex-1"
                >
                  Balanced
                </Button>
                <Button
                  variant={filterStatus === 'variance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('variance')}
                  className="flex-1"
                >
                  Variance
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Records List */}
        <div className="space-y-3">
          {filteredReconciliations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No reconciliation records found</p>
            </Card>
          ) : (
            filteredReconciliations.map(record => (
              <Card key={record.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">{record.id}</p>
                      {record.status === 'balanced' ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Balanced
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Variance
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.time}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#008060] hover:text-[#006e52]"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-gray-500 text-xs">Cashier</p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {record.cashier}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Transactions</p>
                    <p className="text-gray-900">{record.transactionCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expected</p>
                    <p className="text-gray-900">₦{record.expectedTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Actual</p>
                    <p className="text-gray-900">₦{record.actualTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Variance</span>
                    <span className={`font-mono ${Math.abs(record.variance) > 0.01 ? 'text-amber-600' : 'text-green-600'}`}>
                      {record.variance > 0 ? '+' : ''}₦{record.variance.toFixed(2)}
                    </span>
                  </div>
                  {record.notes && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                      {record.notes}
                    </p>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Export All Button */}
        <Button className="w-full bg-[#008060] hover:bg-[#006e52]">
          <Download className="w-4 h-4 mr-2" />
          Export All Records
        </Button>
      </div>
    </div>
  );
}
