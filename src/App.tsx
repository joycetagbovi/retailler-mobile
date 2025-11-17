import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { POSHome } from './components/POSHome';
import { CartScreen } from './components/CartScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { ReceiptScreen } from './components/ReceiptScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { SyncLogsScreen } from './components/SyncLogsScreen';
import { CustomerLookup } from './components/CustomerLookup';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NavigationBar } from './components/NavigationBar';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { useOfflineSync } from './hooks/useOfflineSync';
import { useLocalStorage } from './hooks/useLocalStorage';

export type Screen = 'login' | 'home' | 'cart' | 'payment' | 'receipt' | 'dashboard' | 'sync' | 'customer';

export interface User {
  id: string;
  name: string;
  role: 'salesperson' | 'cashier' | 'supervisor' | 'floor-agent';
  permissions: string[];
}

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  stock: number;
  category: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  specialPrice?: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useLocalStorage<User | null>('pos-user', null);
  const [cart, setCart] = useLocalStorage<CartItem[]>('pos-cart', []);
  const [selectedCustomer, setSelectedCustomer] = useLocalStorage<Customer | null>('pos-customer', null);
  const [heldCarts, setHeldCarts] = useLocalStorage<{ id: string; cart: CartItem[]; timestamp: number }[]>('pos-held-carts', []);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(false);
  
  const { isOnline, syncStatus } = useOfflineSync();

  // Check if app is running in standalone mode and show splash screen
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    // Only show splash on first load in standalone mode
    const hasShownSplash = sessionStorage.getItem('splash-shown');
    
    if (isStandalone && !hasShownSplash) {
      setShowSplash(true);
      sessionStorage.setItem('splash-shown', 'true');
    }
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentScreen('home');
    }
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setSelectedCustomer(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleAddToCart = (item: CartItem) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      ));
    } else {
      setCart([...cart, item]);
    }
  };

  const handleUpdateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
  };

  const handleHoldCart = () => {
    if (cart.length > 0) {
      const heldCart = {
        id: `held-${Date.now()}`,
        cart: cart,
        timestamp: Date.now()
      };
      setHeldCarts([...heldCarts, heldCart]);
      setCart([]);
      setCurrentScreen('home');
    }
  };

  const handleResumeCart = (heldCartId: string) => {
    const heldCart = heldCarts.find(h => h.id === heldCartId);
    if (heldCart) {
      setCart(heldCart.cart);
      setHeldCarts(heldCarts.filter(h => h.id !== heldCartId));
      setCurrentScreen('cart');
    }
  };

  const handleProceedToPayment = () => {
    if (cart.length > 0) {
      setCurrentScreen('payment');
    }
  };

  const handlePaymentComplete = (paymentData: any) => {
    setReceiptData(paymentData);
    setCurrentScreen('receipt');
  };

  const handleNewSale = () => {
    setCart([]);
    setSelectedCustomer(null);
    setReceiptData(null);
    setCurrentScreen('home');
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      
      case 'home':
        return (
          <POSHome
            user={user!}
            cart={cart}
            selectedCustomer={selectedCustomer}
            heldCarts={heldCarts}
            onAddToCart={handleAddToCart}
            onNavigateToCart={() => setCurrentScreen('cart')}
            onResumeCart={handleResumeCart}
            onNavigateToCustomer={() => setCurrentScreen('customer')}
          />
        );
      
      case 'cart':
        return (
          <CartScreen
            cart={cart}
            user={user!}
            selectedCustomer={selectedCustomer}
            onUpdateCart={handleUpdateCart}
            onHoldCart={handleHoldCart}
            onProceedToPayment={handleProceedToPayment}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'payment':
        return (
          <PaymentScreen
            cart={cart}
            selectedCustomer={selectedCustomer}
            user={user!}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setCurrentScreen('cart')}
          />
        );
      
      case 'receipt':
        return (
          <ReceiptScreen
            receiptData={receiptData}
            onNewSale={handleNewSale}
            onViewDashboard={() => setCurrentScreen('dashboard')}
          />
        );
      
      case 'dashboard':
        return (
          <DashboardScreen
            user={user!}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'sync':
        return (
          <SyncLogsScreen
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'customer':
        return (
          <CustomerLookup
            onSelectCustomer={handleSelectCustomer}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      default:
        return null;
    }
  };

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-[#f6f6f7]">
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        {renderScreen()}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <OfflineIndicator isOnline={isOnline} syncStatus={syncStatus} />
      {renderScreen()}
      {currentScreen !== 'login' && (
        <NavigationBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          cartItemsCount={cart.length}
        />
      )}
      <Toaster />
    </div>
  );
}