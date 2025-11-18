import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
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
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [manifestAvailable, setManifestAvailable] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => {
          setServiceWorkerReady(true);
        })
        .catch(() => {
          setServiceWorkerReady(false);
        });
    }

    // Check if manifest is available
    fetch('/manifest.json')
      .then((res) => {
        if (res.ok) {
          setManifestAvailable(true);
        }
      })
      .catch(() => {
        setManifestAvailable(false);
      });

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      toast.success('App installed successfully!');
      setDeferredPrompt(null);
      setShowDialog(false);
    });

    // Check periodically if prompt becomes available
    const checkInterval = setInterval(() => {
      if (!deferredPrompt && !isIOS && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          // Prompt might become available after SW registration
        });
      }
    }, 2000);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      clearInterval(checkInterval);
    };
  }, [deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS instructions in dialog
      setShowDialog(true);
      return;
    }

    // Check if we have the deferred prompt
    if (deferredPrompt) {
      try {
        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          toast.success('Installing app...');
        } else {
          toast.info('Installation cancelled');
        }
      } catch (error) {
        console.error('Error showing install prompt:', error);
        toast.error(
          'Failed to show install prompt. Please try using browser menu.'
        );
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      return;
    }

    // If no deferred prompt, check PWA criteria and show helpful message
    const issues: string[] = [];

    if (!serviceWorkerReady) {
      issues.push('Service worker not registered');
    }

    if (!manifestAvailable) {
      issues.push('Manifest file not found');
    }

    if (issues.length > 0) {
      toast.error(`Installation unavailable: ${issues.join(', ')}`);
      console.log('PWA Installation Issues:', {
        serviceWorkerReady,
        manifestAvailable,
        hasDeferredPrompt: !!deferredPrompt,
        isIOS,
        isStandalone,
      });
    } else {
      // Show manual installation instructions
      toast.info('Please use your browser menu to install the app', {
        description:
          'Look for "Install App" or "Add to Home Screen" in the browser menu',
      });
    }
  };

  // Don't show button if already installed
  if (isStandalone) {
    return null;
  }

  // Show button even if deferredPrompt is not available (for manual installation)
  const canInstall = isIOS || deferredPrompt || serviceWorkerReady;

  return (
    <>
      <Button
        onClick={handleInstallClick}
        className='w-full bg-[#008060] hover:bg-[#006e52] text-white'
        disabled={!canInstall}
      >
        <Download className='w-4 h-4 mr-2' />
        {isIOS ? 'Install App' : deferredPrompt ? 'Install App' : 'Install App'}
      </Button>

      {!canInstall && (
        <div className='mt-2 flex items-center gap-2 text-xs text-[#6d7175]'>
          <AlertCircle className='w-3 h-3' />
          <span>Waiting for installation to become available...</span>
        </div>
      )}

      {/* iOS Installation Instructions Dialog */}
      <Dialog open={showDialog && isIOS} onOpenChange={setShowDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Install Supermart POS</DialogTitle>
            <DialogDescription>
              Install this app on your iPhone for quick access and offline
              functionality.
            </DialogDescription>
          </DialogHeader>

          <div className='bg-[#f6f6f7] p-4 rounded text-sm space-y-3'>
            <p className='text-[#202223] font-medium'>To install:</p>
            <ol className='list-decimal list-inside space-y-2 text-[#6d7175]'>
              <li>
                Tap the Share button{' '}
                <span className='inline-block text-lg'>⎙</span> at the bottom of
                Safari
              </li>
              <li>
                Scroll down and tap <strong>"Add to Home Screen"</strong>
              </li>
              <li>
                Tap <strong>"Add"</strong> to confirm
              </li>
            </ol>
            <p className='text-[#6d7175] text-xs mt-3'>
              The app will appear on your home screen and work offline.
            </p>
          </div>

          <Button onClick={() => setShowDialog(false)} className='w-full'>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
