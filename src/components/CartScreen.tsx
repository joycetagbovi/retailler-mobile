import { useState } from 'react';
import { CartItem, User, Customer } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Percent,
  DollarSign,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { ApplyDiscountDialog } from './ApplyDiscountDialog';
import { toast } from 'sonner@2.0.3';

interface CartScreenProps {
  cart: CartItem[];
  user: User;
  selectedCustomer: Customer | null;
  onUpdateCart: (cart: CartItem[]) => void;
  onHoldCart: () => void;
  onProceedToPayment: () => void;
  onBack: () => void;
}

export function CartScreen({ 
  cart, 
  user,
  selectedCustomer,
  onUpdateCart, 
  onHoldCart, 
  onProceedToPayment,
  onBack 
}: CartScreenProps) {
  const [discountDialogItem, setDiscountDialogItem] = useState<CartItem | null>(null);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const item = cart.find(i => i.id === itemId);
    if (item && newQuantity > item.stock) {
      toast.error(`Only ${item.stock} available in stock`);
      return;
    }

    onUpdateCart(
      cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    onUpdateCart(cart.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const applyDiscount = (itemId: string, discount: number, discountType: 'percentage' | 'fixed') => {
    onUpdateCart(
      cart.map(item => 
        item.id === itemId 
          ? { ...item, discount, discountType }
          : item
      )
    );
    toast.success('Discount applied');
  };

  const calculateItemTotal = (item: CartItem) => {
    const baseTotal = item.price * item.quantity;
    if (!item.discount) return baseTotal;
    
    if (item.discountType === 'percentage') {
      return baseTotal * (1 - item.discount / 100);
    } else {
      return Math.max(0, baseTotal - item.discount);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const baseTotal = item.price * item.quantity;
    return sum + (baseTotal - calculateItemTotal(item));
  }, 0);
  const total = subtotal - totalDiscount;

  const handleHoldCart = () => {
    onHoldCart();
    toast.success('Cart held successfully');
  };

  return (
    <div className="min-h-screen pb-48">
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
            <h2 className="text-white">Shopping Cart</h2>
            <p className="text-[#95bf46] text-sm">{cart.length} items</p>
          </div>
        </div>

        {selectedCustomer && (
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
            <p className="text-sm">{selectedCustomer.name}</p>
            <p className="text-xs text-[#95bf46]">{selectedCustomer.loyaltyPoints} points available</p>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button onClick={onBack} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        ) : (
          cart.map(item => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-[#f6f6f7] rounded-lg flex-shrink-0 border border-[#e1e3e5]" />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{item.sku}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">₦{item.price.toFixed(2)}</span>
                    {item.discount && (
                      <Badge variant="outline" className="text-xs">
                        {item.discountType === 'percentage' 
                          ? `-${item.discount}%`
                          : `-₦{item.discount.toFixed(2)}`
                        }
                      </Badge>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-center p-0"
                        min="1"
                        max={item.stock}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDiscountDialogItem(item)}
                      disabled={!user.permissions.includes('discount-10')}
                    >
                      <Percent className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-500 text-sm">Subtotal:</span>
                    <span className="text-gray-900">₦{calculateItemTotal(item).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg pb-16">
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₦{subtotal.toFixed(2)}</span>
            </div>
            
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₦{totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-900 pt-2 border-t">
              <span>Total:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleHoldCart}
                className="h-12"
              >
                <Clock className="w-4 h-4 mr-2" />
                Hold Cart
              </Button>
              <Button
                onClick={onProceedToPayment}
                className="h-12 bg-[#008060] hover:bg-[#006e52]"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Discount Dialog */}
      {discountDialogItem && (
        <ApplyDiscountDialog
          item={discountDialogItem}
          user={user}
          onApply={(discount, type) => {
            applyDiscount(discountDialogItem.id, discount, type);
            setDiscountDialogItem(null);
          }}
          onClose={() => setDiscountDialogItem(null)}
        />
      )}
    </div>
  );
}