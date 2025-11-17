import { Screen } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  ShoppingCart, 
  BarChart3, 
  RefreshCw,
  LogOut 
} from 'lucide-react';

interface NavigationBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  cartItemsCount: number;
}

export function NavigationBar({ currentScreen, onNavigate, onLogout, cartItemsCount }: NavigationBarProps) {
  const navItems = [
    { screen: 'home' as Screen, icon: Home, label: 'Home' },
    { screen: 'cart' as Screen, icon: ShoppingCart, label: 'Cart', badge: cartItemsCount },
    { screen: 'dashboard' as Screen, icon: BarChart3, label: 'Stats' },
    { screen: 'sync' as Screen, icon: RefreshCw, label: 'Sync' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
      <div className="flex items-center justify-around p-2">
        {navItems.map(({ screen, icon: Icon, label, badge }) => (
          <Button
            key={screen}
            variant="ghost"
            onClick={() => onNavigate(screen)}
            className={`flex flex-col items-center justify-center h-16 flex-1 relative ${
              currentScreen === screen 
                ? 'text-[#008060]' 
                : 'text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
            {badge !== undefined && badge > 0 && (
              <Badge className="absolute top-1 right-1/4 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                {badge}
              </Badge>
            )}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          onClick={onLogout}
          className="flex flex-col items-center justify-center h-16 flex-1 text-red-600"
        >
          <LogOut className="w-5 h-5 mb-1" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </div>
  );
}