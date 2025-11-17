# Capacitor Native App Setup Guide

This guide will help you convert your web-based POS app into a native Android/iOS application with Bluetooth printer and barcode scanner support.

## 📋 Prerequisites

- Node.js 18+ installed
- Android Studio (for Android builds)
- Xcode (for iOS builds - Mac only)
- Your existing POS web app

---

## 🚀 Step 1: Install Capacitor

```bash
# Install Capacitor CLI and core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor in your project
npx cap init

# When prompted:
# App name: Your Store POS
# App ID: com.yourstore.pos (use your domain in reverse)
# Web asset directory: dist (or build, depending on your setup)
```

---

## 📱 Step 2: Add Native Platforms

### For Android:
```bash
npm install @capacitor/android
npx cap add android
```

### For iOS (Mac only):
```bash
npm install @capacitor/ios
npx cap add ios
```

---

## 🔌 Step 3: Install Required Plugins

### 1. Bluetooth Serial (for Thermal Printer)
```bash
npm install @capacitor-community/bluetooth-serial
npx cap sync
```

### 2. Barcode Scanner (Camera-based)
```bash
npm install @capacitor-community/barcode-scanner
npx cap sync
```

### 3. Status Bar & Splash Screen (Optional but recommended)
```bash
npm install @capacitor/status-bar @capacitor/splash-screen
npx cap sync
```

### 4. Network Status (for offline detection)
```bash
npm install @capacitor/network
npx cap sync
```

---

## ⚙️ Step 4: Configure Permissions

### Android Permissions (`android/app/src/main/AndroidManifest.xml`)

Add these permissions inside the `<manifest>` tag:

```xml
<!-- Bluetooth permissions -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />

<!-- Camera for barcode scanning -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Internet for API calls -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Storage for offline data -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS Permissions (`ios/App/App/Info.plist`)

Add these keys to the `<dict>` section:

```xml
<!-- Camera permission -->
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan barcodes</string>

<!-- Bluetooth permission -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>We need Bluetooth to connect to thermal printer</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>We need Bluetooth to connect to thermal printer</string>
```

---

## 🏗️ Step 5: Update Capacitor Config

Edit `capacitor.config.ts` (or create it):

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourstore.pos',
  appName: 'Your Store POS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development, you can use your dev server:
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#008060',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#008060',
    },
  },
};

export default config;
```

---

## 🔧 Step 6: Update Your App Code

### Initialize Capacitor Plugins

Create `/utils/capacitorInit.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export async function initializeCapacitor() {
  if (Capacitor.isNativePlatform()) {
    console.log('Running on native platform:', Capacitor.getPlatform());

    // Configure status bar
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#008060' });
    } catch (error) {
      console.error('Status bar configuration failed:', error);
    }

    // Hide splash screen
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.error('Splash screen hide failed:', error);
    }

    console.log('Capacitor initialized successfully');
  } else {
    console.log('Running in browser mode');
  }
}
```

### Update App.tsx

```typescript
import { useEffect } from 'react';
import { initializeCapacitor } from './utils/capacitorInit';

function App() {
  useEffect(() => {
    initializeCapacitor();
  }, []);

  // ... rest of your app code
}
```

---

## 🖨️ Step 7: Integrate Thermal Printer

The printer utility is already created at `/utils/thermalPrinter.ts`.

### Usage Example:

```typescript
import { thermalPrinter } from './utils/thermalPrinter';

// In your receipt screen or payment completion:
const handlePrintReceipt = async () => {
  try {
    const success = await thermalPrinter.printReceipt(receiptData);
    
    if (success) {
      toast.success('Receipt printed successfully');
    } else {
      toast.error('Failed to print receipt');
    }
  } catch (error) {
    console.error('Print error:', error);
    toast.error('Printer error: ' + error.message);
  }
};

// Test printer connection
const testPrinter = async () => {
  const connected = await thermalPrinter.connect();
  
  if (connected) {
    await thermalPrinter.testPrint();
    toast.success('Printer connected!');
  } else {
    toast.error('Failed to connect to printer');
  }
};
```

---

## 📷 Step 8: Integrate Barcode Scanner

The scanner utility is already created at `/utils/barcodeScanner.ts`.

### Usage Example in POSHome:

```typescript
import { barcodeScanner } from './utils/barcodeScanner';
import { useEffect } from 'react';

function POSHome() {
  useEffect(() => {
    // Start listening for barcode scans
    const handleScan = (result) => {
      console.log('Scanned:', result.barcode);
      
      // Search for product
      handleSearchProduct(result.barcode);
      
      // Play beep sound
      playBeepSound();
    };

    barcodeScanner.startListening(handleScan);

    // Cleanup
    return () => {
      barcodeScanner.stopListening(handleScan);
    };
  }, []);

  // Camera scan button (optional - for devices without physical scanner)
  const handleCameraScan = async () => {
    const result = await barcodeScanner.scanWithCamera();
    
    if (result) {
      handleSearchProduct(result.barcode);
      playBeepSound();
    }
  };

  // ... rest of component
}
```

---

## 🏃 Step 9: Build and Run

### Development Mode

#### Android:
```bash
# Build your web app first
npm run build

# Sync web assets to native project
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Wait for Gradle sync to complete
# 2. Connect your Android device or start emulator
# 3. Click "Run" button (green play icon)
```

#### iOS:
```bash
# Build your web app
npm run build

# Sync web assets
npx cap sync ios

# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Select your device/simulator
# 2. Click "Run" button
# 3. If prompted, create Apple Developer account
```

### Live Reload (Development)

For faster development with live reload:

```bash
# 1. Start your dev server
npm run dev

# 2. Find your local IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# 3. Update capacitor.config.ts:
server: {
  url: 'http://YOUR_LOCAL_IP:5173',
  cleartext: true
}

# 4. Sync and run
npx cap sync
npx cap open android  # or ios
```

---

## 📦 Step 10: Production Build

### Android APK/AAB:

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# In Android Studio:
# 1. Build > Generate Signed Bundle / APK
# 2. Follow wizard to create keystore and sign app
# 3. Select "release" build variant
# 4. Generate AAB for Google Play or APK for direct install
```

### iOS App Store:

```bash
# Build web app
npm run build

# Sync to iOS
npx cap sync ios

# Open Xcode
npx cap open ios

# In Xcode:
# 1. Product > Archive
# 2. Distribute App
# 3. Select App Store Connect
# 4. Follow wizard to upload
```

---

## 🧪 Testing Bluetooth Printer

### Supported Printers:
- **58mm thermal printers**: Most common for receipts
- **80mm thermal printers**: Wider format
- **Brands**: Epson, Star Micronics, GOOJPRT, MUNBYN, etc.

### Pairing:
1. Turn on Bluetooth printer
2. Go to device Settings > Bluetooth
3. Pair the printer (PIN usually: 0000 or 1234)
4. Return to POS app
5. App will auto-detect paired printer

### Troubleshooting:
- **Not connecting**: Re-pair device in Bluetooth settings
- **Printing gibberish**: Check ESC/POS command compatibility
- **Not cutting paper**: Some printers don't support auto-cut
- **Slow printing**: Normal for Bluetooth, consider USB if available

---

## 🔍 Testing Barcode Scanner

### Hardware Scanners (USB/Bluetooth):
- Most USB/Bluetooth barcode scanners work as keyboard emulators
- No special setup needed - just pair and scan!
- Works in both browser and native app

### Camera Scanner (Built-in):
- Only works in Capacitor native app
- Requires camera permissions
- Good fallback if no physical scanner available

---

## 📱 Recommended Devices

### Android Tablets:
- **Samsung Galaxy Tab A8** (Budget friendly)
- **Samsung Galaxy Tab S9** (Premium)
- **Lenovo Tab M10** (Budget)

### Android POS Terminals:
- **Sunmi T2 Mini** (Built-in printer)
- **Imin Swift 2** (Portable POS)
- **MUNBYN POS Terminal** (All-in-one)

### iOS:
- **iPad 9th Gen** (Budget)
- **iPad Air** (Mid-range)
- **iPad Pro** (Premium)

---

## 🐛 Common Issues & Solutions

### Issue: "Plugin not found"
**Solution**: Run `npx cap sync` after installing plugins

### Issue: Bluetooth permissions denied
**Solution**: 
- Check AndroidManifest.xml has all Bluetooth permissions
- For Android 12+, need BLUETOOTH_CONNECT and BLUETOOTH_SCAN

### Issue: Camera not working
**Solution**: 
- Check permissions in manifest
- Ensure camera permission granted in device settings
- Try `npx cap sync` after adding permissions

### Issue: White screen on app launch
**Solution**:
- Check `webDir` in capacitor.config.ts matches build output
- Run `npm run build` before `npx cap sync`
- Check browser console in Android Studio/Xcode

### Issue: Network requests failing
**Solution**:
- Add `android:usesCleartextTraffic="true"` to AndroidManifest.xml `<application>` tag (for HTTP APIs)
- For HTTPS, ensure valid SSL certificate

---

## 🎯 Next Steps

1. ✅ Build and test on physical device
2. ✅ Pair Bluetooth thermal printer and test printing
3. ✅ Test barcode scanner (both hardware and camera)
4. ✅ Test offline functionality
5. ✅ Create app icons and splash screens
6. ✅ Test on multiple devices/screen sizes
7. ✅ Prepare for app store submission

---

## 🔗 Helpful Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Bluetooth Serial Plugin](https://github.com/capacitor-community/bluetooth-serial)
- [Barcode Scanner Plugin](https://github.com/capacitor-community/barcode-scanner)
- [ESC/POS Command Reference](https://reference.epson-biz.com/modules/ref_escpos/index.php)
- [Android Studio Download](https://developer.android.com/studio)
- [Xcode Download](https://developer.apple.com/xcode/)

---

## 💡 Pro Tips

1. **Keep web version**: Your app still works in browser for backup/testing
2. **Test early**: Install on real devices as soon as possible
3. **Offline first**: Always design for offline-first functionality
4. **Battery optimization**: Test with screen always-on during shifts
5. **Backup plan**: Have web version accessible if native app fails
6. **Update strategy**: Plan for over-the-air updates vs app store updates

---

## 📞 Support

If you encounter issues:
1. Check this documentation first
2. Review Capacitor docs for your specific plugin
3. Check device compatibility
4. Test on different devices/OS versions

Good luck with your POS deployment! 🚀
