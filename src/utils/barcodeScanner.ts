// Barcode Scanner Utility
// Handles both keyboard emulation and native scanner integration

export interface ScanResult {
  barcode: string;
  timestamp: number;
  format?: string;
}

export type ScanCallback = (result: ScanResult) => void;

export class BarcodeScanner {
  private scanBuffer: string = '';
  private scanTimeout: NodeJS.Timeout | null = null;
  private callbacks: ScanCallback[] = [];
  private isListening: boolean = false;
  private lastScanTime: number = 0;
  private readonly SCAN_TIMEOUT = 100; // ms between characters for scanner detection
  private readonly MIN_BARCODE_LENGTH = 3;
  private readonly DEBOUNCE_TIME = 300; // ms to prevent duplicate scans

  /**
   * Start listening for barcode scans
   */
  startListening(callback: ScanCallback): void {
    this.callbacks.push(callback);

    if (!this.isListening) {
      this.isListening = true;
      document.addEventListener('keypress', this.handleKeyPress);
      console.log('Barcode scanner listener started');
    }
  }

  /**
   * Stop listening for barcode scans
   */
  stopListening(callback?: ScanCallback): void {
    if (callback) {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    } else {
      this.callbacks = [];
    }

    if (this.callbacks.length === 0 && this.isListening) {
      this.isListening = false;
      document.removeEventListener('keypress', this.handleKeyPress);
      console.log('Barcode scanner listener stopped');
    }
  }

  /**
   * Handle keyboard input (for scanner emulation)
   */
  private handleKeyPress = (event: KeyboardEvent): void => {
    // Ignore if user is typing in an input field (except search fields)
    const target = event.target as HTMLElement;
    const isSearchInput = target.classList.contains('barcode-scanner-input') ||
                         target.getAttribute('data-scanner-enabled') === 'true';
    
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (!isSearchInput) {
        return;
      }
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastScanTime;

    // Enter key signals end of scan
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      this.processScan();
      return;
    }

    // If too much time passed, start new scan
    if (timeDiff > this.SCAN_TIMEOUT && this.scanBuffer.length > 0) {
      this.scanBuffer = '';
    }

    // Add character to buffer
    this.scanBuffer += event.key;
    this.lastScanTime = currentTime;

    // Clear existing timeout
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }

    // Set new timeout to process scan
    this.scanTimeout = setTimeout(() => {
      this.processScan();
    }, this.SCAN_TIMEOUT);
  };

  /**
   * Process the scanned barcode
   */
  private processScan(): void {
    if (this.scanBuffer.length >= this.MIN_BARCODE_LENGTH) {
      const now = Date.now();
      
      // Debounce - prevent duplicate scans
      if (now - this.lastScanTime < this.DEBOUNCE_TIME) {
        this.scanBuffer = '';
        return;
      }

      const result: ScanResult = {
        barcode: this.scanBuffer.trim(),
        timestamp: now
      };

      // Notify all callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(result);
        } catch (error) {
          console.error('Error in scan callback:', error);
        }
      });

      console.log('Barcode scanned:', result.barcode);
    }

    this.scanBuffer = '';
  }

  /**
   * Scan using device camera (Capacitor)
   */
  async scanWithCamera(): Promise<ScanResult | null> {
    try {
      // Check if Capacitor Barcode Scanner is available
      if (!(window as any).BarcodeScanner) {
        console.warn('Capacitor Barcode Scanner plugin not available');
        return null;
      }

      const BarcodeScanner = (window as any).BarcodeScanner;

      // Request camera permissions
      const status = await BarcodeScanner.checkPermission({ force: true });
      
      if (!status.granted) {
        console.error('Camera permission denied');
        return null;
      }

      // Hide background
      document.body.classList.add('scanner-active');
      await BarcodeScanner.hideBackground();

      // Start scanning
      const result = await BarcodeScanner.startScan();

      // Show background
      document.body.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();

      if (result.hasContent) {
        return {
          barcode: result.content,
          timestamp: Date.now(),
          format: result.format
        };
      }

      return null;
    } catch (error) {
      console.error('Camera scan failed:', error);
      document.body.classList.remove('scanner-active');
      
      if ((window as any).BarcodeScanner) {
        await (window as any).BarcodeScanner.showBackground();
      }
      
      return null;
    }
  }

  /**
   * Check if running in Capacitor environment
   */
  isNativeEnvironment(): boolean {
    return !!(window as any).Capacitor;
  }

  /**
   * Check if camera scanner is available
   */
  isCameraScannerAvailable(): boolean {
    return !!(window as any).BarcodeScanner;
  }
}

// Singleton instance
export const barcodeScanner = new BarcodeScanner();

// Auto-start listening when module loads (can be configured)
if (typeof window !== 'undefined') {
  // Uncomment to auto-start:
  // barcodeScanner.startListening((result) => {
  //   console.log('Global barcode scan:', result);
  // });
}
