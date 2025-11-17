// Thermal Printer Utility for ESC/POS Commands
// Works with Capacitor Bluetooth Serial plugin

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  cashier: string;
  customer?: {
    name: string;
    phone: string;
    loyaltyPoints: number;
  } | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    discount?: number;
    discountType?: 'percentage' | 'fixed';
  }>;
  subtotal: number;
  loyaltyDiscount: number;
  tax: number;
  taxRate: number;
  total: number;
  payments: Array<{
    method: string;
    amount: number;
  }>;
  change: number;
  loyaltyPointsEarned?: number;
  loyaltyPointsUsed?: number;
}

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

export const ESC_POS = {
  // Initialize printer
  INIT: `${ESC}@`,
  
  // Text alignment
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,
  
  // Text size
  NORMAL: `${GS}!\x00`,
  DOUBLE_HEIGHT: `${GS}!\x01`,
  DOUBLE_WIDTH: `${GS}!\x10`,
  DOUBLE: `${GS}!\x11`,
  
  // Text style
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  UNDERLINE_ON: `${ESC}-\x01`,
  UNDERLINE_OFF: `${ESC}-\x00`,
  
  // Line feed
  LINE_FEED: '\n',
  FEED_3_LINES: '\n\n\n',
  
  // Paper cut
  CUT: `${GS}V\x00`,
  
  // Drawer kick (cash drawer)
  OPEN_DRAWER: `${ESC}p\x00\x19\xFA`,
};

export class ThermalPrinter {
  private device: any = null;
  private isConnected: boolean = false;

  /**
   * Connect to Bluetooth printer
   * This uses Capacitor's Bluetooth Serial plugin
   */
  async connect(): Promise<boolean> {
    try {
      // Check if running in Capacitor environment
      if (!(window as any).BluetoothSerial) {
        // Silently return false in browser mode - no warning needed
        return false;
      }

      const BluetoothSerial = (window as any).BluetoothSerial;

      // Check if Bluetooth is enabled
      const isEnabled = await BluetoothSerial.isEnabled();
      if (!isEnabled) {
        await BluetoothSerial.enable();
      }

      // List paired devices
      const devices = await BluetoothSerial.list();
      console.log('Available Bluetooth devices:', devices);

      // Find thermal printer (you can modify this logic)
      const printer = devices.find((d: any) => 
        d.name.toLowerCase().includes('printer') || 
        d.name.toLowerCase().includes('rpp') ||
        d.name.toLowerCase().includes('pos')
      );

      if (!printer) {
        throw new Error('No thermal printer found in paired devices');
      }

      // Connect to printer
      await BluetoothSerial.connect(printer.address);
      this.device = printer;
      this.isConnected = true;

      console.log('Connected to printer:', printer.name);
      return true;
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Disconnect from printer
   */
  async disconnect(): Promise<void> {
    try {
      if ((window as any).BluetoothSerial && this.isConnected) {
        await (window as any).BluetoothSerial.disconnect();
        this.isConnected = false;
        this.device = null;
      }
    } catch (error) {
      console.error('Failed to disconnect from printer:', error);
    }
  }

  /**
   * Send raw data to printer
   */
  private async sendRaw(data: string): Promise<void> {
    if (!this.isConnected || !(window as any).BluetoothSerial) {
      console.warn('Printer not connected');
      return;
    }

    try {
      await (window as any).BluetoothSerial.write(data);
    } catch (error) {
      console.error('Failed to send data to printer:', error);
      throw error;
    }
  }

  /**
   * Format text to fit receipt width (32 characters for 58mm, 48 for 80mm)
   */
  private formatLine(left: string, right: string, width: number = 32): string {
    const spaces = width - left.length - right.length;
    return left + ' '.repeat(Math.max(0, spaces)) + right;
  }

  /**
   * Create separator line
   */
  private separator(width: number = 32): string {
    return '-'.repeat(width);
  }

  /**
   * Generate ESC/POS receipt commands
   */
  generateReceiptCommands(data: ReceiptData, width: number = 32): string {
    let receipt = '';

    // Initialize printer
    receipt += ESC_POS.INIT;

    // Header - Store Name
    receipt += ESC_POS.ALIGN_CENTER;
    receipt += ESC_POS.DOUBLE;
    receipt += ESC_POS.BOLD_ON;
    receipt += 'YOUR STORE NAME\n';
    receipt += ESC_POS.BOLD_OFF;
    receipt += ESC_POS.NORMAL;
    receipt += 'Address Line 1\n';
    receipt += 'Address Line 2\n';
    receipt += 'Tel: +234 XXX XXX XXXX\n';
    receipt += ESC_POS.LINE_FEED;

    // Receipt Info
    receipt += ESC_POS.ALIGN_LEFT;
    receipt += this.separator(width) + '\n';
    receipt += `Receipt: ${data.receiptNumber}\n`;
    receipt += `Date: ${new Date(data.date).toLocaleString('en-NG')}\n`;
    receipt += `Cashier: ${data.cashier}\n`;
    
    if (data.customer) {
      receipt += `Customer: ${data.customer.name}\n`;
      receipt += `Phone: ${data.customer.phone}\n`;
    }
    
    receipt += this.separator(width) + '\n';
    receipt += ESC_POS.LINE_FEED;

    // Items
    receipt += ESC_POS.BOLD_ON;
    receipt += this.formatLine('Item', 'Amount', width) + '\n';
    receipt += ESC_POS.BOLD_OFF;
    receipt += this.separator(width) + '\n';

    data.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const itemName = item.name.length > width - 10 
        ? item.name.substring(0, width - 13) + '...' 
        : item.name;
      
      receipt += `${itemName}\n`;
      receipt += this.formatLine(
        `  ${item.quantity} x ₦${item.price.toFixed(2)}`,
        `₦${itemTotal.toFixed(2)}`,
        width
      ) + '\n';

      if (item.discount && item.discount > 0) {
        const discountAmount = item.discountType === 'percentage'
          ? itemTotal * (item.discount / 100)
          : item.discount;
        receipt += this.formatLine(
          '  Discount',
          `-₦${discountAmount.toFixed(2)}`,
          width
        ) + '\n';
      }
    });

    receipt += this.separator(width) + '\n';

    // Totals
    receipt += this.formatLine('Subtotal:', `₦${data.subtotal.toFixed(2)}`, width) + '\n';
    
    if (data.loyaltyDiscount > 0) {
      receipt += this.formatLine(
        'Loyalty Discount:',
        `-₦${data.loyaltyDiscount.toFixed(2)}`,
        width
      ) + '\n';
    }

    receipt += this.formatLine(
      `Tax (${(data.taxRate * 100).toFixed(0)}%):`,
      `₦${data.tax.toFixed(2)}`,
      width
    ) + '\n';
    
    receipt += this.separator(width) + '\n';
    receipt += ESC_POS.DOUBLE_HEIGHT;
    receipt += ESC_POS.BOLD_ON;
    receipt += this.formatLine('TOTAL:', `₦${data.total.toFixed(2)}`, width) + '\n';
    receipt += ESC_POS.BOLD_OFF;
    receipt += ESC_POS.NORMAL;
    receipt += this.separator(width) + '\n';

    // Payments
    receipt += ESC_POS.LINE_FEED;
    receipt += ESC_POS.BOLD_ON;
    receipt += 'PAYMENT METHOD\n';
    receipt += ESC_POS.BOLD_OFF;
    
    data.payments.forEach(payment => {
      receipt += this.formatLine(
        `${payment.method.toUpperCase()}:`,
        `₦${payment.amount.toFixed(2)}`,
        width
      ) + '\n';
    });

    if (data.change > 0) {
      receipt += ESC_POS.LINE_FEED;
      receipt += ESC_POS.BOLD_ON;
      receipt += this.formatLine('CHANGE:', `₦${data.change.toFixed(2)}`, width) + '\n';
      receipt += ESC_POS.BOLD_OFF;
    }

    // Loyalty Points
    if (data.loyaltyPointsEarned || data.loyaltyPointsUsed) {
      receipt += ESC_POS.LINE_FEED;
      receipt += this.separator(width) + '\n';
      receipt += ESC_POS.BOLD_ON;
      receipt += 'LOYALTY POINTS\n';
      receipt += ESC_POS.BOLD_OFF;
      
      if (data.loyaltyPointsUsed) {
        receipt += this.formatLine('Used:', `${data.loyaltyPointsUsed} pts`, width) + '\n';
      }
      if (data.loyaltyPointsEarned) {
        receipt += this.formatLine('Earned:', `${data.loyaltyPointsEarned} pts`, width) + '\n';
      }
      if (data.customer) {
        receipt += this.formatLine(
          'Total:',
          `${data.customer.loyaltyPoints + (data.loyaltyPointsEarned || 0) - (data.loyaltyPointsUsed || 0)} pts`,
          width
        ) + '\n';
      }
    }

    // Footer
    receipt += ESC_POS.LINE_FEED;
    receipt += this.separator(width) + '\n';
    receipt += ESC_POS.ALIGN_CENTER;
    receipt += 'Thank you for shopping with us!\n';
    receipt += 'Visit again soon!\n';
    receipt += ESC_POS.LINE_FEED;
    receipt += this.separator(width) + '\n';
    receipt += ESC_POS.FEED_3_LINES;

    // Cut paper
    receipt += ESC_POS.CUT;

    return receipt;
  }

  /**
   * Print receipt
   */
  async printReceipt(data: ReceiptData): Promise<boolean> {
    try {
      // Auto-connect if not connected
      if (!this.isConnected) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Failed to connect to printer');
        }
      }

      // Generate receipt commands
      const commands = this.generateReceiptCommands(data);

      // Send to printer
      await this.sendRaw(commands);

      console.log('Receipt printed successfully');
      return true;
    } catch (error) {
      console.error('Failed to print receipt:', error);
      return false;
    }
  }

  /**
   * Test print
   */
  async testPrint(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Failed to connect to printer');
        }
      }

      let test = '';
      test += ESC_POS.INIT;
      test += ESC_POS.ALIGN_CENTER;
      test += ESC_POS.DOUBLE;
      test += ESC_POS.BOLD_ON;
      test += 'TEST PRINT\n';
      test += ESC_POS.BOLD_OFF;
      test += ESC_POS.NORMAL;
      test += ESC_POS.LINE_FEED;
      test += 'Printer is working!\n';
      test += ESC_POS.FEED_3_LINES;
      test += ESC_POS.CUT;

      await this.sendRaw(test);
      return true;
    } catch (error) {
      console.error('Test print failed:', error);
      return false;
    }
  }

  /**
   * Open cash drawer
   */
  async openCashDrawer(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    await this.sendRaw(ESC_POS.OPEN_DRAWER);
  }

  /**
   * Check if connected
   */
  isConnectedToPrinter(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
export const thermalPrinter = new ThermalPrinter();