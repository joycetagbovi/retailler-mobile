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
  const [showAndroidDialog, setShowAndroidDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [manifestAvailable, setManifestAvailable] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Debug logging
    const debug: string[] = [];
    
    // Check if already installed (standalone mode)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
    debug.push(`Standalone: ${isStandaloneMode}`);

    // Check if iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
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
      console.log('beforeinstallprompt event fired!');
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('App installed successfully!');
      toast.success('App installed successfully!');
      setDeferredPrompt(null);
      setShowDialog(false);
      setShowAndroidDialog(false);
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

    // Check if we have the deferred prompt (Android/Chrome)
    if (deferredPrompt) {
      try {
        console.log('Triggering install prompt...');
        // Show the install prompt programmatically
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log('User choice:', outcome);

        if (outcome === 'accepted') {
          toast.success('App is being installed...');
        } else {
          toast.info('Installation cancelled');
        }
      } catch (error) {
        console.error('Error showing install prompt:', error);
        toast.error(
          'Failed to show install prompt. Please try using browser menu (⋮ → Install App).'
        );
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      return;
    }

    // If no deferred prompt, show Android installation dialog with instructions
    if (!deferredPrompt) {
      // Check PWA criteria first
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
        // Show Android installation dialog instead of toast
        setShowAndroidDialog(true);
      }
      return;
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
        {isIOS
          ? 'Show Install Instructions'
          : deferredPrompt
          ? 'Install App Now'
          : 'Install App'}
      </Button>

      {!canInstall && (
        <div className='mt-2 flex items-center gap-2 text-xs text-[#6d7175]'>
          <AlertCircle className='w-3 h-3' />
          <span>Waiting for installation to become available...</span>
        </div>
      )}

      {deferredPrompt && !isIOS && (
        <p className='mt-2 text-xs text-center text-[#6d7175]'>
          Click the button above to install directly (no browser menu needed)
        </p>
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
            <p className='text-[#202223] font-medium'>To install on iPhone:</p>
            <ol className='list-decimal list-inside space-y-3 text-[#6d7175]'>
              <li>
                Look at the <strong>bottom center</strong> of Safari and tap the{' '}
                <span className='inline-flex items-center justify-center w-6 h-6 rounded bg-[#008060] text-white text-xs font-bold'>
                  ↑
                </span>{' '}
                <strong>Share</strong> button
              </li>
              <li>
                Scroll down in the share menu and tap{' '}
                <strong className='text-[#008060]'>"Add to Home Screen"</strong>
              </li>
              <li>
                Tap <strong>"Add"</strong> in the top right to confirm
              </li>
            </ol>
            <div className='bg-white p-3 rounded border border-[#e1e3e5] mt-3'>
              <p className='text-[#202223] text-xs font-medium mb-1'>💡 Tip:</p>
              <p className='text-[#6d7175] text-xs'>
                Unfortunately, iOS Safari doesn't allow automatic installation.
                You must use the Share menu. Once installed, the app will work
                offline and appear on your home screen.
              </p>
            </div>
          </div>

          <Button onClick={() => setShowDialog(false)} className='w-full'>
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      {/* Android Installation Instructions Dialog */}
      <Dialog
        open={showAndroidDialog && !isIOS}
        onOpenChange={setShowAndroidDialog}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Install Supermart POS</DialogTitle>
            <DialogDescription>
              Install this app on your Android device for quick access and
              offline functionality.
            </DialogDescription>
          </DialogHeader>

          <div className='bg-[#f6f6f7] p-4 rounded text-sm space-y-3'>
            <p className='text-[#202223] font-medium'>To install on Android:</p>
            <ol className='list-decimal list-inside space-y-3 text-[#6d7175]'>
              <li>
                Tap the <strong>menu button</strong> (⋮) in the{' '}
                <strong>top right corner</strong> of your browser
              </li>
              <li>
                Look for{' '}
                <strong className='text-[#008060]'>"Install app"</strong> or{' '}
                <strong className='text-[#008060]'>"Add to Home screen"</strong>{' '}
                in the menu
              </li>
              <li>
                Tap it and then tap <strong>"Install"</strong> to confirm
              </li>
            </ol>
            <div className='bg-white p-3 rounded border border-[#e1e3e5] mt-3'>
              <p className='text-[#202223] text-xs font-medium mb-1'>💡 Tip:</p>
              <p className='text-[#6d7175] text-xs'>
                The install option appears when the app meets PWA requirements.
                Once installed, the app will work offline and appear on your
                home screen.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowAndroidDialog(false)}
            className='w-full'
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
