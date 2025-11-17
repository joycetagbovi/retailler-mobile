import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  X, 
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  User as UserIcon,
  DollarSign
} from 'lucide-react';
import { User } from '../App';

interface ZReportProps {
  onClose: () => void;
  onViewHistory: () => void;
  user: User;
  reconciliationData: {
    date: string;
    time: string;
    expectedTotals: {
      cash: number;
      card: number;
      transfer: number;
      total: number;
    };
    actualTotals: {
      cash: number;
      card: number;
      transfer: number;
      total: number;
    };
    variance: {
      cash: number;
      card: number;
      transfer: number;
      total: number;
    };
    transactionCount: number;
    notes: string;
  };
}

export function ZReport({ onClose, onViewHistory, user, reconciliationData }: ZReportProps) {
  const hasVariance = Math.abs(reconciliationData.variance.total) > 0.01;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Z-Report downloaded as PDF');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl my-4">
        {/* Header - Hidden on print */}
        <div className="bg-[#008060] text-white p-4 rounded-t-lg print:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {hasVariance ? (
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-300" />
              )}
              <h2 className="text-white">Z-Report Generated</h2>
            </div>
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
            End of Day Report • {reconciliationData.date}
          </p>
        </div>

        {/* Report Content - Printable */}
        <div className="p-6 space-y-4" id="z-report-content">
          {/* Print Header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h1 className="text-gray-900 text-2xl mb-2">END OF DAY REPORT (Z-REPORT)</h1>
            <p className="text-gray-600">SuperMarket POS System</p>
            <p className="text-gray-600 text-sm">================================</p>
          </div>

          {/* Report Info */}
          <Card className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="text-gray-900">{reconciliationData.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="text-gray-900">{reconciliationData.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Cashier</p>
                  <p className="text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Transactions</p>
                  <p className="text-gray-900">{reconciliationData.transactionCount}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Expected Totals */}
          <div>
            <h3 className="text-gray-900 mb-3 border-b border-gray-200 pb-2">EXPECTED TOTALS (SYSTEM)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Sales</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.expectedTotals.cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Card Sales</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.expectedTotals.card.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Sales</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.expectedTotals.transfer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="text-gray-900">TOTAL EXPECTED</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.expectedTotals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actual Totals */}
          <div>
            <h3 className="text-gray-900 mb-3 border-b border-gray-200 pb-2">ACTUAL TOTALS (COUNTED)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Counted</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.actualTotals.cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Card Counted</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.actualTotals.card.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Counted</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.actualTotals.transfer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="text-gray-900">TOTAL ACTUAL</span>
                <span className="text-gray-900 font-mono">₦{reconciliationData.actualTotals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Variance */}
          <Card className={`p-4 ${hasVariance ? 'bg-amber-50 border-amber-300' : 'bg-green-50 border-green-300'} border-2`}>
            <div className="flex items-center gap-2 mb-3">
              {hasVariance ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
              <h3 className={hasVariance ? 'text-amber-900' : 'text-green-900'}>
                VARIANCE ANALYSIS
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Variance</span>
                <span className={`font-mono ${Math.abs(reconciliationData.variance.cash) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {reconciliationData.variance.cash > 0 ? '+' : ''}₦{reconciliationData.variance.cash.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Card Variance</span>
                <span className={`font-mono ${Math.abs(reconciliationData.variance.card) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {reconciliationData.variance.card > 0 ? '+' : ''}₦{reconciliationData.variance.card.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Variance</span>
                <span className={`font-mono ${Math.abs(reconciliationData.variance.transfer) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {reconciliationData.variance.transfer > 0 ? '+' : ''}₦{reconciliationData.variance.transfer.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-400">
                <span className="text-gray-900">TOTAL VARIANCE</span>
                <Badge className={`${hasVariance ? 'bg-amber-600' : 'bg-green-600'} text-white`}>
                  {reconciliationData.variance.total > 0 ? '+' : ''}₦{reconciliationData.variance.total.toFixed(2)}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {reconciliationData.notes && (
            <div>
              <h3 className="text-gray-900 mb-2 border-b border-gray-200 pb-2">NOTES</h3>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{reconciliationData.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center border-t-2 border-dashed border-gray-300 pt-4 mt-4">
            <p className="text-gray-600 text-sm">================================</p>
            <p className="text-gray-600 text-sm mt-2">Cashier Signature: ___________________</p>
            <p className="text-gray-600 text-sm mt-2">Supervisor Signature: ___________________</p>
            <p className="text-gray-500 text-xs mt-4">Generated by SuperMarket POS System</p>
          </div>
        </div>

        {/* Action Buttons - Hidden on print */}
        <div className="p-4 border-t border-gray-200 space-y-2 print:hidden">
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              className="flex-1 bg-[#008060] hover:bg-[#006e52]"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="w-full"
          >
            View Reconciliation History
          </Button>
          <Button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            Close & Return to Dashboard
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #z-report-content, #z-report-content * {
            visibility: visible;
          }
          #z-report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}