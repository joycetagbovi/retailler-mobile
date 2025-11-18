import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Main Install Button Component
export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Debug logging
    const debug: string[] = [];
    
    // Check if already installed (standalone mode)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                             (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
    debug.push(`Standalone: ${isStandaloneMode}`);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);
    debug.push(`iOS: ${iOS}`);
    
    // Check HTTPS
    const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    debug.push(`HTTPS: ${isHTTPS}`);
    
    // Check service worker support
    const hasSW = 'serviceWorker' in navigator;
    debug.push(`SW Support: ${hasSW}`);
    
    setDebugInfo(debug.join(' | '));
    console.log('PWA Install Debug:', debug.join(' | '));

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('App installed successfully!');
      toast.success('App installed successfully!');
      setDeferredPrompt(null);
      setShowDialog(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS instructions in dialog
      setShowDialog(true);
      return;
    }

    if (!deferredPrompt) {
      toast.info('Installation not available on this browser');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('Installing app...');
    } else {
      toast.info('Installation cancelled');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  // Don't show button if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleInstallClick}
        className="w-full bg-[#008060] hover:bg-[#006e52] text-white"
        disabled={!deferredPrompt && !isIOS}
      >
        <Download className="w-4 h-4 mr-2" />
        Install App
      </Button>

      {/* iOS Installation Instructions Dialog */}
      <Dialog open={showDialog && isIOS} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Install Supermart POS</DialogTitle>
            <DialogDescription>
              Install this app on your iPhone for quick access and offline functionality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-[#f6f6f7] p-4 rounded text-sm space-y-3">
            <p className="text-[#202223]">To install:</p>
            <ol className="list-decimal list-inside space-y-2 text-[#6d7175]">
              <li>Tap the Share button <span className="inline-block text-lg">⎙</span> at the bottom</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>"Add"</strong> to confirm</li>
            </ol>
          </div>

          <Button onClick={() => setShowDialog(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}