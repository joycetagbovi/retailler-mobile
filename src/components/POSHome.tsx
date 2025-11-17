import { useState, useRef, useEffect } from 'react';
import { User, CartItem, Customer } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Search, 
  ScanBarcode, 
  ShoppingCart, 
  User as UserIcon,
  Package,
  AlertTriangle,
  Clock,
  Grid3x3,
  List,
  Camera
} from 'lucide-react';
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES, searchProducts } from '../data/mockProducts';
import { BarcodeScanner } from './BarcodeScanner';
import { ProductCard } from './ProductCard';
import { toast } from 'sonner@2.0.3';
import { playBeep } from '../utils/beep';
import { barcodeScanner } from '../utils/barcodeScanner';

interface POSHomeProps {
  user: User;
  cart: CartItem[];
  selectedCustomer: Customer | null;
  heldCarts: { id: string; cart: CartItem[]; timestamp: number }[];
  onAddToCart: (item: CartItem) => void;
  onNavigateToCart: () => void;
  onResumeCart: (cartId: string) => void;
  onNavigateToCustomer: () => void;
}

export function POSHome({ 
  user, 
  cart, 
  selectedCustomer,
  heldCarts,
  onAddToCart, 
  onNavigateToCart,
  onResumeCart,
  onNavigateToCustomer
}: POSHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Setup barcode scanner listener for hardware scanners
  useEffect(() => {
    const handleScan = (result: { barcode: string }) => {
      console.log('Barcode scanned:', result.barcode);
      
      // Find product by barcode
      const product = MOCK_PRODUCTS.find(p => p.barcode === result.barcode || p.sku === result.barcode);
      
      if (product) {
        handleAddToCart(product);
      } else {
        toast.error(`Product not found: ${result.barcode}`);
      }
    };

    // Start listening for barcode scans
    barcodeScanner.startListening(handleScan);

    // Cleanup on unmount
    return () => {
      barcodeScanner.stopListening(handleScan);
    };
  }, []); // Empty dependency array - only setup once

  const filteredProducts = searchProducts(searchQuery);

  const handleAddToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    const cartItem: CartItem = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      category: product.category,
      image: product.image
    };
    onAddToCart(cartItem);
    toast.success(`${product.name} added to cart`);
    playBeep();
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = MOCK_PRODUCTS.find(p => p.barcode === barcode);
    if (product) {
      handleAddToCart(product);
      setShowScanner(false);
    } else {
      toast.error('Product not found');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-[#008060] text-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white">Welcome, {user.name}</h2>
            <p className="text-[#95bf46] text-sm capitalize">{user.role}</p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {user.role}
          </Badge>
        </div>

        {/* Customer Info */}
        {selectedCustomer ? (
          <div 
            onClick={onNavigateToCustomer}
            className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20 active:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <div>
                  <p className="text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-[#95bf46]">{selectedCustomer.loyaltyPoints} points</p>
                </div>
              </div>
              {selectedCustomer.specialPrice && (
                <Badge className="bg-yellow-500 text-yellow-900">VIP</Badge>
              )}
            </div>
          </div>
        ) : (
          <Button 
            onClick={onNavigateToCustomer}
            variant="outline" 
            className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        )}
      </div>

      {/* Search and Scanner */}
      <div className="space-y-3 bg-white border-b py-[20px] px-[16px] m-[0px]">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
            />
          </div>
          <Button 
            onClick={() => setShowScanner(true)}
            className="h-12 px-4 bg-[#008060] hover:bg-[#006e52]"
          >
            <ScanBarcode className="w-5 h-5" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Held Carts */}
      {heldCarts.length > 0 && (
        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-amber-900">Held Carts ({heldCarts.length})</span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {heldCarts.map((heldCart, index) => (
              <Button
                key={heldCart.id}
                variant="outline"
                size="sm"
                onClick={() => onResumeCart(heldCart.id)}
                className="whitespace-nowrap bg-white border-amber-300"
              >
                Cart #{index + 1} ({heldCart.cart.length} items)
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 gap-3'
              : 'space-y-2'
          }>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 right-4 z-20">
          <Button
            onClick={onNavigateToCart}
            className="h-14 w-14 rounded-full shadow-lg bg-[#008060] hover:bg-[#006e52] relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-500 text-white">
              {cartItemsCount}
            </Badge>
          </Button>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}