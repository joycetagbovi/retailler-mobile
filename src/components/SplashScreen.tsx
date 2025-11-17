import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete before calling onComplete
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#008060] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo Icon */}
      <div className="mb-6 animate-bounce">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <ShoppingBag className="w-14 h-14 text-[#008060]" strokeWidth={2.5} />
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-white text-3xl mb-2">Supermart POS</h1>
      <p className="text-white/80 text-sm">Mobile Sales Application</p>

      {/* Loading Animation */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
