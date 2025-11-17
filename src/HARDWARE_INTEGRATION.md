# Hardware Integration Quick Guide

## 🖨️ Bluetooth Thermal Printer

### What You Have:
- ✅ **Thermal Printer Utility** (`/utils/thermalPrinter.ts`)
- ✅ **ESC/POS Commands** (Standard thermal printer language)
- ✅ **Auto-connect** on print
- ✅ **Receipt formatting** for 58mm/80mm printers
- ✅ **Print button** in Receipt screen with loading state

### How It Works:

```typescript
import { thermalPrinter } from './utils/thermalPrinter';

// Print receipt
await thermalPrinter.printReceipt(receiptData);

// Test printer
await thermalPrinter.testPrint();

// Open cash drawer (if connected)
await thermalPrinter.openCashDrawer();
```

### Supported Features:
- ✅ Text formatting (bold, underline, size)
- ✅ Alignment (left, center, right)
- ✅ Line spacing
- ✅ Paper cutting
- ✅ Cash drawer kick
- ✅ 58mm and 80mm paper widths

### Browser vs Native:
- **Browser**: Won't work (requires Capacitor plugin)
- **Native App**: Works with Bluetooth Serial plugin

---

## 📱 Barcode Scanner

### What You Have:
- ✅ **Barcode Scanner Utility** (`/utils/barcodeScanner.ts`)
- ✅ **Keyboard emulation support** (USB/Bluetooth scanners)
- ✅ **Camera scanner support** (Capacitor plugin)
- ✅ **Auto-detection** in POSHome
- ✅ **Beep sound** on successful scan

### How It Works:

#### Hardware Scanner (USB/Bluetooth):
```typescript
// Automatically listening in POSHome.tsx
// Just scan and it adds product to cart!
```

**Setup:**
1. Pair Bluetooth scanner with device (or plug in USB)
2. Scanner acts as keyboard
3. Scans barcode → types number → presses Enter
4. App detects scan and adds product
5. ✨ No configuration needed!

#### Camera Scanner (Built-in):
```typescript
import { barcodeScanner } from './utils/barcodeScanner';

// Open camera to scan
const result = await barcodeScanner.scanWithCamera();
if (result) {
  console.log('Scanned:', result.barcode);
}
```

### Scanner Types Supported:
- ✅ **USB Barcode Scanners** (HID keyboard mode)
- ✅ **Bluetooth Barcode Scanners** (HID keyboard mode)
- ✅ **Device Camera** (via Capacitor plugin)
- ✅ **1D Barcodes**: EAN-13, UPC-A, Code 128, Code 39
- ✅ **2D Barcodes**: QR codes, Data Matrix

---

## 🚀 Quick Start (Testing in Browser)

### Right Now:
1. **Barcode Scanner**: ✅ Works! USB/Bluetooth scanners work as keyboards
2. **Thermal Printer**: ❌ Requires Capacitor native app

### Test Barcode Scanner:
```bash
# Just run your app
npm run dev

# In POSHome:
# 1. Focus is always ready
# 2. Scan with USB/Bluetooth scanner
# 3. Product auto-adds to cart
# 4. Beep sound plays
```

---

## 📦 Deploy as Native App

### Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### Step 2: Add Platform
```bash
# For Android tablets/POS terminals
npm install @capacitor/android
npx cap add android

# For iOS (iPad)
npm install @capacitor/ios
npx cap add ios
```

### Step 3: Install Plugins
```bash
# Bluetooth printer
npm install @capacitor-community/bluetooth-serial

# Camera barcode scanner
npm install @capacitor-community/barcode-scanner

# Sync
npx cap sync
```

### Step 4: Build & Run
```bash
# Build web app
npm run build

# Open native IDE
npx cap open android  # or ios

# Run from Android Studio/Xcode
```

📖 **Full instructions**: See `/CAPACITOR_SETUP.md`

---

## 🔧 Recommended Hardware

### Bluetooth Thermal Printers:
| Printer | Price Range | Features |
|---------|-------------|----------|
| **GOOJPRT PT-210** | ₦25,000-35,000 | 58mm, Bluetooth, Rechargeable |
| **MUNBYN P047** | ₦30,000-45,000 | 58mm, Bluetooth, Auto-cut |
| **Epson TM-P20** | ₦65,000-85,000 | 58mm, Bluetooth, Premium |
| **Star mPOP** | ₦120,000+ | 58mm, Cash drawer, Apple certified |

### Barcode Scanners:
| Scanner | Price Range | Type |
|---------|-------------|------|
| **TaoTronics TT-BS030** | ₦8,000-12,000 | Bluetooth, 1D |
| **Inateck BCST-70** | ₦15,000-22,000 | Bluetooth, 2D |
| **Zebra DS2278** | ₦55,000-75,000 | Bluetooth, 2D, Industrial |
| **Built-in Camera** | Free | 1D/2D via app |

### All-in-One POS Terminals:
| Terminal | Price Range | Features |
|----------|-------------|----------|
| **Sunmi T2 Mini** | ₦180,000-250,000 | Built-in printer, scanner, Android |
| **MUNBYN POS** | ₦150,000-200,000 | 15" touch, printer, scanner |
| **Imin Swift 2** | ₦120,000-160,000 | Portable, printer, Android |

---

## 🎯 Testing Checklist

### Browser Testing (Now):
- [x] ✅ Hardware barcode scanner (USB/Bluetooth)
- [x] ✅ Product search
- [x] ✅ Cart management
- [x] ✅ Payment flow
- [x] ✅ Receipt display
- [ ] ⏸️ Thermal printing (needs native app)

### Native App Testing:
- [ ] Hardware barcode scanner
- [ ] Camera barcode scanner
- [ ] Bluetooth thermal printer
- [ ] Receipt printing
- [ ] Cash drawer
- [ ] Offline mode
- [ ] Battery performance

---

## 💡 Pro Tips

### Barcode Scanner:
1. **Always works**: Most scanners are plug-and-play
2. **No pairing issues**: USB is more reliable than Bluetooth
3. **Test barcodes**: Use your product barcodes or generate test ones
4. **Multiple scans**: Scanner can scan rapidly, app handles it
5. **Scan to search**: Scanner also works in search field

### Thermal Printer:
1. **Pair first**: Pair printer in device Bluetooth settings
2. **Keep close**: Bluetooth range is about 10 meters
3. **Paper size**: Configure 58mm or 80mm in `thermalPrinter.ts`
4. **Test early**: Use `testPrint()` to verify connection
5. **Cash drawer**: Connect to printer's RJ11 port

### POS Workflow:
1. **Mount tablet**: Use tablet stand or wall mount
2. **Power**: Keep devices plugged in during shifts
3. **Backup**: Web version still works if native app fails
4. **Multiple terminals**: Each device runs independently
5. **Sync**: Plan for end-of-day sync to main system

---

## 🐛 Troubleshooting

### Barcode Scanner Not Working:
```bash
# Check 1: Is scanner paired? (Bluetooth)
Settings > Bluetooth > Check if scanner listed

# Check 2: Is scanner in HID mode?
Scan the "HID Keyboard Mode" barcode in scanner manual

# Check 3: Test in Notes app
Open Notes, scan barcode - should type number

# Check 4: Check browser console
Look for "Barcode scanned: XXXXX" message
```

### Printer Not Connecting:
```bash
# Check 1: Is printer paired?
Settings > Bluetooth > Check if printer listed

# Check 2: Is printer on?
Check power light, print test page

# Check 3: Re-pair device
Forget device, turn off/on printer, pair again

# Check 4: Check Capacitor plugin
npm list @capacitor-community/bluetooth-serial
```

### App Not Detecting Scanner:
```bash
# Check 1: Is POSHome screen active?
Scanner only works on home screen

# Check 2: Check console logs
Should see "Barcode scanner listener started"

# Check 3: Test with manual entry
Type barcode number and press Enter
```

---

## 📞 Support Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Bluetooth Serial**: https://github.com/capacitor-community/bluetooth-serial
- **ESC/POS Reference**: https://reference.epson-biz.com/modules/ref_escpos/
- **Barcode Generator**: https://barcode.tec-it.com/ (for testing)

---

## 🎉 You're Ready!

Your POS app now supports:
- ✅ Hardware barcode scanners (works now in browser!)
- ✅ Bluetooth thermal printers (needs Capacitor)
- ✅ Camera barcode scanning (needs Capacitor)
- ✅ ESC/POS receipt formatting
- ✅ Production-ready code

**Next steps:**
1. Test hardware scanner in browser now
2. Follow Capacitor setup guide for printing
3. Deploy to Android tablet/POS terminal
4. Pair Bluetooth devices
5. Start selling! 🚀
