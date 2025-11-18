import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Camera, Keyboard, X, AlertCircle } from 'lucide-react';
import { playBeep } from '../utils/beep';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner@2.0.3';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerInitialized = useRef(false);

  // Initialize camera scanner
  useEffect(() => {
    if (scanMode === 'camera' && !scannerInitialized.current) {
      startCameraScanner();
      scannerInitialized.current = true;
    }

    return () => {
      stopScanner();
    };
  }, [scanMode]);

  const startCameraScanner = async () => {
    try {
      setIsScanning(true);
      setError(null);

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      // Configure for iPhone and barcode scanning
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
        formatsToSupport: [
          0,  // QR_CODE
          8,  // EAN_13
          9,  // EAN_8
          11, // CODE_128
          12, // CODE_39
          13, // CODE_93
          14, // CODABAR
          15, // ITF
          16, // UPC_A
          17  // UPC_E
        ]
      };

      await html5QrCode.start(
        { facingMode: "environment" }, // Use back camera
        config,
        (decodedText) => {
          // Success! Barcode detected
          handleSuccessfulScan(decodedText);
        },
        (errorMessage) => {
          // Scanning in progress, errors are normal
          // Don't show these to user
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera scanner error:", err);
      
      // Handle different error types
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another app.');
      } else if (err.message?.includes('secure') || err.message?.includes('https')) {
        setError('Camera requires HTTPS. Please use a secure connection.');
      } else {
        setError('Unable to access camera. Try manual entry.');
      }
      
      // Auto-switch to manual mode after error
      setTimeout(() => {
        setScanMode('manual');
      }, 3000);
    }
  };

  const handleSuccessfulScan = (barcode: string) => {
    if (barcode && barcode.trim()) {
      playBeep();
      toast.success('Barcode detected!');
      onScan(barcode.trim());
      stopScanner();
      onClose();
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        scannerInitialized.current = false;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      setIsScanning(false);
    }
  };

  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode('');
      playBeep();
      onClose();
    }
  };

  const switchToManual = async () => {
    await stopScanner();
    setScanMode('manual');
  };

  const switchToCamera = async () => {
    scannerInitialized.current = false;
    setScanMode('camera');
  };

  useEffect(() => {
    // Auto-focus on manual input
    if (scanMode === 'manual') {
      const input = document.getElementById('manual-barcode-input');
      if (input) {
        input.focus();
      }
    }
  }, [scanMode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between">
        <h3 className="text-gray-900">
          {scanMode === 'camera' ? 'Scan Barcode' : 'Manual Entry'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {scanMode === 'camera' ? (
          <div className="w-full max-w-sm">
            {/* Real Camera Scanner */}
            <div className="w-full bg-black rounded-2xl mb-4 overflow-hidden">
              <div id="qr-reader" className="w-full"></div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/90 text-white p-3 rounded-lg mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            {/* Instructions */}
            {!error && (
              <p className="text-white text-center mb-4">
                {isScanning 
                  ? 'Point camera at barcode' 
                  : 'Starting camera...'}
              </p>
            )}

            <Button
              onClick={switchToManual}
              variant="outline"
              className="w-full bg-white"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Enter Manually
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-sm bg-white rounded-2xl p-6">
            <div className="text-center mb-6">
              <Keyboard className="w-16 h-16 text-[#008060] mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Manual Entry</h3>
              <p className="text-gray-600 text-sm">Enter barcode number</p>
            </div>

            <div className="space-y-4">
              <Input
                id="manual-barcode-input"
                type="text"
                placeholder="Enter barcode..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualScan();
                  }
                }}
                className="text-center text-lg"
                inputMode="numeric"
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={switchToCamera}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </Button>
                <Button
                  onClick={handleManualScan}
                  disabled={!manualBarcode.trim()}
                  className="bg-[#008060] hover:bg-[#006e52]"
                >
                  Scan
                </Button>
              </div>

              {/* Quick test barcodes */}
              <div className="pt-4 border-t">
                <p className="text-gray-600 text-sm mb-2">Test Barcodes:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['1234567890123', '1234567890124', '1234567890125', '1234567890126'].map(barcode => (
                    <Button
                      key={barcode}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onScan(barcode);
                        playBeep();
                        onClose();
                      }}
                      className="text-xs"
                    >
                      {barcode}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
