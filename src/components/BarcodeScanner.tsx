import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Camera, Keyboard, X } from 'lucide-react';
import { playBeep } from '../utils/beep';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');

  // Simulate camera scanning (in real app, use device camera)
  const handleCameraScan = () => {
    toast.info('Camera scanning not available in web demo. Use manual entry.');
    setScanMode('manual');
  };

  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode('');
      playBeep();
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between">
        <h3 className="text-gray-900">Scan Barcode</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {scanMode === 'camera' ? (
          <div className="w-full max-w-sm">
            <div className="aspect-square bg-black rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
              {/* Simulated camera viewfinder */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#008060]/20 to-transparent animate-pulse" />
              <div className="w-3/4 h-3/4 border-4 border-white rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-white opacity-50" />
              </div>
            </div>
            
            <p className="text-white text-center mb-4">
              Position barcode within the frame
            </p>

            <Button
              onClick={() => setScanMode('manual')}
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
                  onClick={() => setScanMode('camera')}
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
                      onClick={() => onScan(barcode)}
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