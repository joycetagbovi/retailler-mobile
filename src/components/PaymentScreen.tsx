import { useState } from 'react';
import { CartItem, User, Customer } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  Smartphone,
  Banknote,
  Check,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PaymentScreenProps {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  user: User;
  onPaymentComplete: (paymentData: any) => void;
  onBack: () => void;
}

type PaymentMethod = 'cash' | 'card' | 'transfer';

export function PaymentScreen({ cart, selectedCustomer, user, onPaymentComplete, onBack }: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const TAX_RATE = 0.08; // 8% tax rate

  const calculateItemTotal = (item: CartItem) => {
    const baseTotal = item.price * item.quantity;
    if (!item.discount) return baseTotal;
    
    if (item.discountType === 'percentage') {
      return baseTotal * (1 - item.discount / 100);
    } else {
      return Math.max(0, baseTotal - item.discount);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  
  const loyaltyDiscount = useLoyaltyPoints && selectedCustomer 
    ? Math.min(selectedCustomer.loyaltyPoints * 0.01, subtotal * 0.1) // ₦0.01 per point, max 10% discount
    : 0;

  const subtotalAfterDiscount = subtotal - loyaltyDiscount;
  const tax = subtotalAfterDiscount * TAX_RATE;
  const total = subtotalAfterDiscount + tax;
  
  const amountEntered = parseFloat(paymentAmount) || 0;
  const change = selectedMethod === 'cash' ? Math.max(0, amountEntered - total) : 0;

  const paymentMethods: { method: PaymentMethod; label: string; icon: any }[] = [
    { method: 'cash', label: 'Cash', icon: Banknote },
    { method: 'card', label: 'Card', icon: CreditCard },
    { method: 'transfer', label: 'Transfer', icon: Wallet }
  ];

  const handleQuickAmount = (amount: number) => {
    setPaymentAmount(amount.toString());
  };

  const handleCompletePayment = () => {
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < total) {
      toast.error('Amount is less than total');
      return;
    }

    // For non-cash payments, amount should match exactly
    if (selectedMethod !== 'cash' && Math.abs(amount - total) > 0.01) {
      toast.error('Card and Transfer payments must match the total exactly');
      return;
    }

    // Start processing
    setIsProcessing(true);

    const receiptData = {
      receiptNumber: `RCP-${Date.now()}`,
      date: new Date().toISOString(),
      cashier: user.name,
      customer: selectedCustomer,
      items: cart,
      subtotal,
      loyaltyDiscount,
      tax,
      taxRate: TAX_RATE,
      total,
      payments: [{ method: selectedMethod, amount }],
      change,
      loyaltyPointsEarned: Math.floor(total / 10), // 1 point per ₦10
      loyaltyPointsUsed: useLoyaltyPoints ? Math.floor(loyaltyDiscount * 100) : 0
    };

    // Save to pending sales for sync
    const pendingSales = JSON.parse(localStorage.getItem('pos-pending-sales') || '[]');
    pendingSales.push(receiptData);
    localStorage.setItem('pos-pending-sales', JSON.stringify(pendingSales));

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTransactionId(`TXN${Date.now()}`);
      
      // Store receipt data for viewing
      sessionStorage.setItem('currentReceipt', JSON.stringify(receiptData));
    }, 2000);
  };

  const handleViewReceipt = () => {
    const receiptData = JSON.parse(sessionStorage.getItem('currentReceipt') || '{}');
    onPaymentComplete(receiptData);
  };

  return (
    <div className="min-h-screen pb-32 bg-gray-50">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="p-8 max-w-sm mx-4">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-[#008060] animate-spin" />
              <div className="text-center">
                <h3 className="text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600 text-sm">Please wait...</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Success Overlay */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="p-8 max-w-sm mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 text-sm mb-1">Transaction ID</p>
                <p className="text-gray-900 font-mono">{transactionId}</p>
                <p className="text-gray-600 text-sm mt-4">Amount Paid: ₦{amountEntered.toFixed(2)}</p>
                {change > 0 && (
                  <p className="text-green-600 text-sm">Change: ₦{change.toFixed(2)}</p>
                )}
              </div>
              <Button
                onClick={handleViewReceipt}
                className="w-full bg-[#008060] hover:bg-[#006e52]"
              >
                View Receipt
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#008060] text-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-white">Payment</h2>
            <p className="text-blue-100 text-sm">{cart.length} items</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Amount Summary */}
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₦{subtotal.toFixed(2)}</span>
            </div>
            
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Loyalty Discount:</span>
                <span>-₦{loyaltyDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600 pt-2 border-t">
              <span>Tax (8%):</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-900 pt-2 border-t">
              <span>Total:</span>
              <span className="text-xl">₦{total.toFixed(2)}</span>
            </div>

            {change > 0 && amountEntered >= total && (
              <div className="flex justify-between text-green-600 pt-2 border-t">
                <span>Change:</span>
                <span>₦{change.toFixed(2)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Loyalty Points */}
        {selectedCustomer && selectedCustomer.loyaltyPoints > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Use Loyalty Points</p>
                <p className="text-gray-500 text-sm">
                  {selectedCustomer.loyaltyPoints} points available
                  {useLoyaltyPoints && ` (Save ₦${loyaltyDiscount.toFixed(2)})`}
                </p>
              </div>
              <Button
                variant={useLoyaltyPoints ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseLoyaltyPoints(!useLoyaltyPoints)}
              >
                {useLoyaltyPoints ? <Check className="w-4 h-4" /> : 'Use'}
              </Button>
            </div>
          </Card>
        )}

        {/* Payment Methods */}
        <div>
          <h3 className="text-gray-900 mb-3">Payment Method</h3>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map(({ method, label, icon: Icon }) => (
              <Button
                key={method}
                variant={selectedMethod === method ? 'default' : 'outline'}
                onClick={() => setSelectedMethod(method)}
                className="h-16 flex flex-col items-center justify-center"
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <h3 className="text-gray-900 mb-3">Enter Amount</h3>
          <Input
            type="number"
            placeholder={`Enter amount (Total: ₦${total.toFixed(2)})`}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="mb-2 text-lg h-12 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
            step="0.01"
            min="0"
          />
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[100, 500, 1000, 5000].map(amount => (
              <Button
                key={amount}
                variant="outline"
                className="h-12"
                onClick={() => handleQuickAmount(amount)}
              >
                ₦{amount}
              </Button>
            ))}
          </div>

          {/* Exact Amount Button */}
          <Button
            onClick={() => handleQuickAmount(Math.ceil(total))}
            className="w-full h-14 bg-[#008060] hover:bg-[#006e52]"
          >
            Exact Amount (₦{total.toFixed(2)})
          </Button>
        </div>
      </div>

      {/* Complete Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-20">
        <Button
          onClick={handleCompletePayment}
          disabled={!paymentAmount || parseFloat(paymentAmount) < total}
          className="w-full h-14 bg-[#008060] hover:bg-[#006e52] disabled:opacity-50"
        >
          Complete Payment
        </Button>
      </div>
    </div>
  );
}