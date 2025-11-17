import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Printer, 
  Mail, 
  MessageSquare,
  Share2,
  Download,
  Home,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { thermalPrinter } from '../utils/thermalPrinter';
import { useState } from 'react';

interface ReceiptScreenProps {
  receiptData: any;
  onNewSale: () => void;
  onViewDashboard: () => void;
}

export function ReceiptScreen({ receiptData, onNewSale, onViewDashboard }: ReceiptScreenProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const success = await thermalPrinter.printReceipt(receiptData);
      
      if (success) {
        toast.success('Receipt printed successfully!');
      } else {
        // Only show error in native app mode, not in browser
        if ((window as any).BluetoothSerial) {
          toast.error('Failed to print receipt. Check printer connection.');
        }
      }
    } catch (error) {
      console.error('Print error:', error);
      // Only show error in native app mode, not in browser
      if ((window as any).BluetoothSerial) {
        toast.error('Printer error: ' + (error as Error).message);
      }
    } finally {
      setIsPrinting(false);
    }
  };

  const handleEmail = () => {
    toast.success('Receipt sent via email');
    // In real app, would send email via API
  };

  const handleSMS = () => {
    toast.success('Receipt sent via SMS');
    // In real app, would send SMS via API
  };

  const handleShare = () => {
    toast.success('Receipt shared');
    // In real app, would use Web Share API
  };

  const handleDownload = () => {
    toast.success('Receipt downloaded');
    // In real app, would generate PDF
  };

  const formatReceiptDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }) + ' ' + d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Success Header */}
      <div className="bg-[#008060] text-white p-6 text-center shadow-sm">
        <CheckCircle className="w-16 h-16 mx-auto mb-3 text-white" />
        <h2 className="text-white mb-2">Payment Successful!</h2>
        <p className="text-[#95bf46]">Receipt #{receiptData.receiptNumber}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Thermal Receipt Card */}
        <Card className="p-0 overflow-hidden bg-white" id="receipt-content">
          <div 
            className="bg-white p-6 font-mono text-xs leading-relaxed"
            style={{ 
              fontFamily: '"Courier New", Courier, monospace',
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            {/* Store Header */}
            <div className="text-center mb-4 border-b-2 border-dashed border-gray-300 pb-4">
              <div className="text-lg font-bold mb-1">SUPERMART POS</div>
              <div className="text-[10px] leading-tight">
                123 MAIN STREET<br />
                CITY, STATE 12345<br />
                TEL: (555) 123-4567<br />
                TAX ID: 12-3456789
              </div>
            </div>

            {/* Receipt Info */}
            <div className="mb-4 text-[10px]">
              <div className="flex justify-between">
                <span>RECEIPT#:</span>
                <span>{receiptData.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{formatReceiptDate(receiptData.date)}</span>
              </div>
              <div className="flex justify-between">
                <span>CASHIER:</span>
                <span>{receiptData.cashier.toUpperCase()}</span>
              </div>
              {receiptData.customer && (
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span>{receiptData.customer.name.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-b-2 border-dashed border-gray-300 my-2"></div>

            {/* Items */}
            <div className="mb-2">
              {receiptData.items.map((item: any, index: number) => {
                const itemTotal = item.price * item.quantity;
                const discountAmount = item.discount 
                  ? (item.discountType === 'percentage' 
                    ? itemTotal * (item.discount / 100)
                    : item.discount)
                  : 0;
                const finalPrice = itemTotal - discountAmount;

                return (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between">
                      <span className="flex-1">{item.name.toUpperCase()}</span>
                      <span className="ml-2">₦{finalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-600 ml-2">
                      <span>{item.quantity} x ₦{item.price.toFixed(2)}</span>
                      {item.discount && (
                        <span>
                          DISC: -{item.discountType === 'percentage' ? `${item.discount}%` : `₦${item.discount.toFixed(2)}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Separator */}
            <div className="border-b border-gray-300 my-2"></div>

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>₦{receiptData.subtotal.toFixed(2)}</span>
              </div>
              
              {receiptData.loyaltyDiscount > 0 && (
                <div className="flex justify-between">
                  <span>LOYALTY DISC:</span>
                  <span>-₦{receiptData.loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>TAX ({(receiptData.taxRate * 100).toFixed(0)}%):</span>
                <span>₦{receiptData.tax.toFixed(2)}</span>
              </div>

              <div className="border-t-2 border-gray-400 pt-1 mt-1"></div>

              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL:</span>
                <span>₦{receiptData.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Separator */}
            <div className="border-b border-gray-300 my-3"></div>

            {/* Payments */}
            <div className="space-y-1 mb-3">
              {receiptData.payments.map((payment: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{payment.method.toUpperCase()}:</span>
                  <span>₦{payment.amount.toFixed(2)}</span>
                </div>
              ))}
              
              {receiptData.change > 0 && (
                <div className="flex justify-between font-bold">
                  <span>CHANGE:</span>
                  <span>₦{receiptData.change.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Loyalty Info */}
            {receiptData.customer && (
              <>
                <div className="border-b-2 border-dashed border-gray-300 my-3"></div>
                <div className="text-center mb-2">
                  <div className="text-[10px] font-bold mb-1">*** LOYALTY REWARDS ***</div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span>POINTS EARNED:</span>
                      <span>+{receiptData.loyaltyPointsEarned}</span>
                    </div>
                    {receiptData.loyaltyPointsUsed > 0 && (
                      <div className="flex justify-between">
                        <span>POINTS USED:</span>
                        <span>-{receiptData.loyaltyPointsUsed}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                      <span>TOTAL POINTS:</span>
                      <span>
                        {receiptData.customer.loyaltyPoints + receiptData.loyaltyPointsEarned - receiptData.loyaltyPointsUsed}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="border-t-2 border-dashed border-gray-300 mt-4 pt-4 text-center text-[10px]">
              <div className="mb-2">*** THANK YOU ***</div>
              <div className="mb-1">PLEASE COME AGAIN</div>
              <div className="text-[9px] text-gray-500 mt-3">
                ITEMS SOLD ARE NOT RETURNABLE<br />
                SAVE THIS RECEIPT
              </div>
            </div>

            {/* Barcode simulation */}
            <div className="mt-4 text-center">
              <div className="inline-block bg-black h-12 w-48 relative overflow-hidden">
                {/* Simple barcode pattern */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 bg-white"
                    style={{
                      left: `${i * 5}%`,
                      width: `${Math.random() > 0.5 ? 2 : 1}%`
                    }}
                  />
                ))}
              </div>
              <div className="text-[8px] mt-1">{receiptData.receiptNumber}</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handlePrint}>
            {isPrinting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
            Print
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" onClick={handleSMS}>
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onViewDashboard}
            className="h-12"
          >
            View Dashboard
          </Button>
          <Button 
            onClick={onNewSale}
            className="h-12 bg-[#008060] hover:bg-[#006e52]"
          >
            <Home className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        </div>
      </div>
    </div>
  );
}