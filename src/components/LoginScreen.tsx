import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ShoppingBag, Lock, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { InstallPWA } from './InstallPWA';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'salesperson',
    permissions: ['scan', 'sell', 'discount-10']
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'cashier',
    permissions: ['scan', 'sell', 'discount-20', 'refund']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'supervisor',
    permissions: ['scan', 'sell', 'discount-unlimited', 'refund', 'price-override', 'cancel-receipt']
  },
  {
    id: '4',
    name: 'Sarah Williams',
    role: 'floor-agent',
    permissions: ['scan', 'check-stock', 'customer-lookup']
  }
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    if (!username || !pin) {
      toast.error('Please enter username and PIN');
      return;
    }

    // Mock authentication - in real app, validate against backend
    if (pin === '1234') {
      const user = MOCK_USERS.find(u => u.name.toLowerCase().includes(username.toLowerCase())) || MOCK_USERS[0];
      toast.success(`Welcome back, ${user.name}!`);
      onLogin(user);
    } else {
      toast.error('Invalid PIN');
    }
  };

  const handleQuickLogin = (user: User) => {
    toast.success(`Quick login as ${user.name}`);
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f6f6f7]">
      {/* Left Side - Shopify-style Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004c3f] relative overflow-hidden">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="shopify-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shopify-pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start text-white p-16 w-full max-w-xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-white/10 backdrop-blur-sm mb-8">
            <ShoppingBag className="w-7 h-7 text-[#95bf46]" />
          </div>

          {/* Title */}
          <h1 className="text-white text-5xl mb-4 tracking-tight">
            Point of Sale
          </h1>
          <p className="text-[#95bf46] text-xl mb-12">
            Everything you need to sell in person
          </p>

          {/* Features - Shopify Style */}
          <div className="space-y-5 mb-12">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#95bf46] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#004c3f]" strokeWidth={3} />
              </div>
              <div>
                <p className="text-white text-lg">Accept payments anywhere</p>
                <p className="text-[#95bf46]/80 text-sm mt-1">Process transactions with cash, card, or mobile payments</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#95bf46] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#004c3f]" strokeWidth={3} />
              </div>
              <div>
                <p className="text-white text-lg">Works offline</p>
                <p className="text-[#95bf46]/80 text-sm mt-1">Never miss a sale with automatic offline mode and sync</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#95bf46] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#004c3f]" strokeWidth={3} />
              </div>
              <div>
                <p className="text-white text-lg">Real-time inventory</p>
                <p className="text-[#95bf46]/80 text-sm mt-1">Track stock levels and get low inventory alerts instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#95bf46] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#004c3f]" strokeWidth={3} />
              </div>
              <div>
                <p className="text-white text-lg">Customer management</p>
                <p className="text-[#95bf46]/80 text-sm mt-1">Build relationships with loyalty points and purchase history</p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-[#95bf46]/60 text-sm mb-2">Trusted by retail businesses</p>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-white text-2xl">99.9%</div>
                <div className="text-[#95bf46]/60 text-xs">Uptime</div>
              </div>
              <div>
                <div className="text-white text-2xl">24/7</div>
                <div className="text-[#95bf46]/60 text-xs">Support</div>
              </div>
              <div>
                <div className="text-white text-2xl">PCI DSS</div>
                <div className="text-[#95bf46]/60 text-xs">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[#008060] mb-4">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-[#202223] mb-2">POS</h1>
            <p className="text-[#6d7175]">Sign in to start selling</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-[#202223] mb-2">Log in</h2>
            <p className="text-[#6d7175]">Continue to your POS terminal</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 border border-[#e1e3e5]">
            <div className="space-y-5">
              <div>
                <Label htmlFor="username" className="text-[#202223] mb-2 block">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
                />
              </div>

              <div>
                <Label htmlFor="pin" className="text-[#202223] mb-2 block">PIN</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6d7175]" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pl-10 h-11 border-[#c9cccf] focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
                    maxLength={6}
                    inputMode="numeric"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin();
                      }
                    }}
                  />
                </div>
                <p className="text-[#6d7175] text-sm mt-2">Demo PIN: 1234</p>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full h-11 bg-[#008060] hover:bg-[#006e52] text-white shadow-sm"
              >
                Log in
              </Button>
            </div>
          </div>

          {/* Quick Login Options */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#e1e3e5]">
            <p className="text-[#6d7175] text-sm mb-4 text-center">Quick access (Demo)</p>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_USERS.map(user => (
                <Button
                  key={user.id}
                  variant="outline"
                  onClick={() => handleQuickLogin(user)}
                  className="flex flex-col items-center p-4 h-auto border-[#c9cccf] hover:border-[#008060] hover:bg-[#f6f6f7] transition-colors"
                >
                  <span className="text-sm text-[#202223]">{user.name.split(' ')[0]}</span>
                  <span className="text-xs text-[#6d7175] capitalize mt-1">{user.role}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[#6d7175] text-sm mt-8 mb-4">
            POS System v1.0 • Offline-first
          </p>
          
          {/* Install App Button */}
          <div className="mt-4">
            <InstallPWA />
          </div>
        </div>
      </div>
    </div>
  );
}