import { useState } from 'react';
import { CartItem, User } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ApplyDiscountDialogProps {
  item: CartItem;
  user: User;
  onApply: (discount: number, type: 'percentage' | 'fixed') => void;
  onClose: () => void;
}

export function ApplyDiscountDialog({ item, user, onApply, onClose }: ApplyDiscountDialogProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');

  const getMaxDiscount = () => {
    if (user.permissions.includes('discount-unlimited')) {
      return 100;
    } else if (user.permissions.includes('discount-20')) {
      return 20;
    } else if (user.permissions.includes('discount-10')) {
      return 10;
    }
    return 0;
  };

  const maxDiscount = getMaxDiscount();

  const handleApply = () => {
    const discount = parseFloat(discountValue);
    
    if (isNaN(discount) || discount <= 0) {
      toast.error('Please enter a valid discount');
      return;
    }

    if (discountType === 'percentage' && discount > maxDiscount) {
      toast.error(`Maximum discount allowed: ${maxDiscount}%`);
      return;
    }

    if (discountType === 'fixed' && discount >= item.price * item.quantity) {
      toast.error('Discount cannot exceed item total');
      return;
    }

    onApply(discount, discountType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Apply Discount</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">{item.name}</p>
            <p className="text-gray-900">₦{item.price.toFixed(2)} × {item.quantity}</p>
          </div>

          <div>
            <Label>Discount Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={discountType === 'percentage' ? 'default' : 'outline'}
                onClick={() => setDiscountType('percentage')}
                className="h-12"
              >
                <Percent className="w-4 h-4 mr-2" />
                Percentage
              </Button>
              <Button
                variant={discountType === 'fixed' ? 'default' : 'outline'}
                onClick={() => setDiscountType('fixed')}
                className="h-12"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Fixed Amount
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="discount-value">
              {discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
            </Label>
            <Input
              id="discount-value"
              type="number"
              placeholder={discountType === 'percentage' ? `Max ${maxDiscount}%` : 'Enter amount'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="mt-1"
              min="0"
              max={discountType === 'percentage' ? maxDiscount : undefined}
              step="0.01"
            />
            {discountType === 'percentage' && (
              <p className="text-gray-500 text-sm mt-1">
                Your maximum discount: {maxDiscount}%
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              className="bg-[#008060] hover:bg-[#006e52]"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}