import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  X, 
  DollarSign, 
  CreditCard,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface ReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  todayStats: {
    totalSales: number;
    cashSales: number;
    cardSales: number;
    transferSales: number;
    totalTransactions: number;
  };
  recentTransactions: Array<{
    id: string;
    time: string;
    amount: number;
    items: number;
    method: string;
  }>;
}

export function ReconciliationModal({ isOpen, onClose, user, todayStats, recentTransactions }: ReconciliationModalProps) {
  const [actualCash, setActualCash] = useState('');
  const [actualCard, setActualCard] = useState('');
  const [actualTransfer, setActualTransfer] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const actualCashNum = parseFloat(actualCash) || 0;
  const actualCardNum = parseFloat(actualCard) || 0;
  const actualTransferNum = parseFloat(actualTransfer) || 0;

  const actualTotal = actualCashNum + actualCardNum + actualTransferNum;
  const variance = actualTotal - todayStats.totalSales;

  const cashVariance = actualCashNum - todayStats.cashSales;
  const cardVariance = actualCardNum - todayStats.cardSales;
  const transferVariance = actualTransferNum - todayStats.transferSales;

  const hasVariance = Math.abs(variance) > 0.01;

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call to save reconciliation
    setTimeout(() => {
      // Generate reconciliation data for Z-Report
      const reconciliationData = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        expectedTotals: {
          cash: todayStats.cashSales,
          card: todayStats.cardSales,
          transfer: todayStats.transferSales,
          total: todayStats.totalSales
        },
        actualTotals: {
          cash: actualCashNum,
          card: actualCardNum,
          transfer: actualTransferNum,
          total: actualTotal
        },
        variance: {
          cash: cashVariance,
          card: cardVariance,
          transfer: transferVariance,
          total: variance
        },
        transactionCount: todayStats.totalTransactions,
        notes: notes
      };

      // Close modal and trigger callback to show Z-Report
      onClose();
      // Trigger Z-Report display (parent component will handle this)
      if ((window as any).showZReport) {
        (window as any).showZReport(reconciliationData);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl my-4">
        {/* Header */}
        <div className="bg-[#008060] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white">End of Day Reconciliation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-[#95bf46] text-sm">
            {new Date().toLocaleDateString()} • {todayStats.totalTransactions} Transactions
          </p>
        </div>

        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Expected Totals */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">Expected Totals (System)</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Cash</p>
                <p className="text-gray-900">₦{todayStats.cashSales.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Card</p>
                <p className="text-gray-900">₦{todayStats.cardSales.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Transfer</p>
                <p className="text-gray-900">₦{todayStats.transferSales.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-300">
              <div className="flex items-center justify-between">
                <span className="text-gray-900">Total Expected</span>
                <span className="text-gray-900">₦{todayStats.totalSales.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Actual Amounts Input */}
          <div>
            <h3 className="text-gray-900 mb-3">Enter Actual Amounts</h3>
            <div className="space-y-3">
              {/* Cash */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Cash
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
                  />
                </div>
                {actualCash && Math.abs(cashVariance) > 0.01 && (
                  <p className={`text-xs mt-1 ${cashVariance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Variance: {cashVariance > 0 ? '+' : ''}₦{cashVariance.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Card */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={actualCard}
                    onChange={(e) => setActualCard(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
                  />
                </div>
                {actualCard && Math.abs(cardVariance) > 0.01 && (
                  <p className={`text-xs mt-1 ${cardVariance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Variance: {cardVariance > 0 ? '+' : ''}₦{cardVariance.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Transfer */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Transfer
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={actualTransfer}
                    onChange={(e) => setActualTransfer(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
                  />
                </div>
                {actualTransfer && Math.abs(transferVariance) > 0.01 && (
                  <p className={`text-xs mt-1 ${transferVariance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Variance: {transferVariance > 0 ? '+' : ''}₦{transferVariance.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Variance Summary */}
          {actualTotal > 0 && (
            <Card className={`p-4 ${hasVariance ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                {hasVariance ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                <h3 className={hasVariance ? 'text-amber-900' : 'text-green-900'}>
                  {hasVariance ? 'Variance Detected' : 'Balanced'}
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Actual Total</span>
                  <span className="text-gray-900">₦{actualTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expected Total</span>
                  <span className="text-gray-900">₦{todayStats.totalSales.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className={hasVariance ? 'text-amber-900' : 'text-green-900'}>
                      Variance
                    </span>
                    <Badge className={hasVariance ? 'bg-amber-500' : 'bg-green-500'}>
                      {variance > 0 ? '+' : ''}₦{variance.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about discrepancies or issues..."
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[#008060] hover:bg-[#006e52]"
            disabled={actualTotal === 0 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Reconciliation'}
          </Button>
        </div>
      </div>
    </div>
  );
}