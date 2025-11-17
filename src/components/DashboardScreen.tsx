import { User } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Receipt,
  Users,
  Package,
  Calendar,
  History
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ReconciliationModal } from './ReconciliationModal';
import { ZReport } from './ZReport';
import { ReconciliationHistory } from './ReconciliationHistory';

interface DashboardScreenProps {
  user: User;
  onBack: () => void;
}

export function DashboardScreen({ user, onBack }: DashboardScreenProps) {
  // Mock data - in real app, would fetch from API
  const todayStats = {
    totalSales: 2450.75,
    totalTransactions: 23,
    averageTransaction: 106.55,
    totalDiscount: 125.50,
    cashSales: 1200.00,
    cardSales: 950.75,
    transferSales: 300.00,
    customersServed: 18,
    itemsSold: 156
  };

  const recentTransactions = [
    { id: 'RCP-001', time: '14:35', amount: 45.99, items: 5, method: 'Cash' },
    { id: 'RCP-002', time: '14:28', amount: 123.50, items: 12, method: 'Card' },
    { id: 'RCP-003', time: '14:15', amount: 67.25, items: 8, method: 'Transfer' },
    { id: 'RCP-004', time: '13:58', amount: 89.00, items: 6, method: 'Cash' },
    { id: 'RCP-005', time: '13:42', amount: 234.75, items: 18, method: 'Card' }
  ];

  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [showZReport, setShowZReport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [zReportData, setZReportData] = useState<any>(null);

  useEffect(() => {
    // Set up global callback for showing Z-Report from reconciliation modal
    (window as any).showZReport = (data: any) => {
      setZReportData(data);
      setShowZReport(true);
    };

    return () => {
      delete (window as any).showZReport;
    };
  }, []);

  // Show Reconciliation History screen
  if (showHistory) {
    return <ReconciliationHistory user={user} onBack={() => setShowHistory(false)} />;
  }

  // Show Z-Report
  if (showZReport && zReportData) {
    return (
      <ZReport
        onClose={() => {
          setShowZReport(false);
          setZReportData(null);
        }}
        onViewHistory={() => {
          setShowZReport(false);
          setShowHistory(true);
        }}
        user={user}
        reconciliationData={zReportData}
      />
    );
  }

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
            <h2 className="text-white">Sales Dashboard</h2>
            <p className="text-[#95bf46] text-sm">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Today's Performance</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Sales</p>
            <p className="text-gray-900 text-xl">₦{todayStats.totalSales.toFixed(2)}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#f1f8f5] flex items-center justify-center border border-[#b4e4d4]">
                <Receipt className="w-5 h-5 text-[#008060]" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#008060]" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Transactions</p>
            <p className="text-gray-900 text-xl">{todayStats.totalTransactions}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Avg Transaction</p>
            <p className="text-gray-900 text-xl">₦{todayStats.averageTransaction.toFixed(2)}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Customers</p>
            <p className="text-gray-900 text-xl">{todayStats.customersServed}</p>
          </Card>
        </div>

        {/* Payment Methods Breakdown */}
        <Card className="p-4">
          <h3 className="text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600 text-sm">Cash</span>
              </div>
              <span className="text-gray-900">₦{todayStats.cashSales.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-gray-600 text-sm">Card</span>
              </div>
              <span className="text-gray-900">₦{todayStats.cardSales.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-gray-600 text-sm">Transfer</span>
              </div>
              <span className="text-gray-900">₦{todayStats.transferSales.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-sm">Items Sold</span>
            </div>
            <p className="text-gray-900 text-xl">{todayStats.itemsSold}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-sm">Discounts</span>
            </div>
            <p className="text-gray-900 text-xl">₦{todayStats.totalDiscount.toFixed(2)}</p>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-gray-900 mb-3">Recent Transactions</h3>
          <div className="space-y-2">
            {recentTransactions.map(transaction => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 mb-1">{transaction.id}</p>
                    <p className="text-gray-500 text-sm">
                      {transaction.time} • {transaction.items} items • {transaction.method}
                    </p>
                  </div>
                  <span className="text-green-600">₦{transaction.amount.toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* End of Day Button */}
        <Card className="p-4 bg-[#f1f8f5] border-[#b4e4d4]">
          <h3 className="text-gray-900 mb-2">End of Day Reconciliation</h3>
          <p className="text-gray-600 text-sm mb-3">
            Close the day and reconcile all transactions
          </p>
          <Button className="w-full bg-[#008060] hover:bg-[#006e52]" onClick={() => setIsReconciliationModalOpen(true)}>
            Start Reconciliation
          </Button>
        </Card>

        {/* View Reconciliation History Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowHistory(true)}
        >
          <History className="w-4 h-4 mr-2" />
          View Reconciliation History
        </Button>
      </div>

      {/* Reconciliation Modal */}
      <ReconciliationModal
        isOpen={isReconciliationModalOpen}
        onClose={() => setIsReconciliationModalOpen(false)}
        user={user}
        todayStats={todayStats}
        recentTransactions={recentTransactions}
      />
    </div>
  );
}