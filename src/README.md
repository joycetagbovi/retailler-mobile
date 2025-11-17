# Mobile POS & Sales Application

A fully-featured, mobile-optimized Point of Sale (POS) and sales application designed for supermarket environments. Built with React, TypeScript, and Tailwind CSS, this app provides an offline-first experience for salespersons, cashiers, floor agents, and supervisors.

## 🚀 Features

### Core POS Operations
- **User Authentication**: Role-based login system with PIN authentication
- **Product Management**: 
  - Barcode/QR code scanning (camera + manual entry)
  - Manual product search by SKU, name, or category
  - Real-time stock availability
  - Low stock warnings
  - Product details with batch and expiry information
- **Shopping Cart**:
  - Add/remove items with quantity controls
  - Hold and resume carts
  - Swipe-to-remove items
  - Real-time total calculations
- **Discounts**:
  - Percentage-based discounts
  - Fixed amount discounts
  - Role-based discount permissions
  - Coupon support
- **Multiple Payment Methods**:
  - Cash
  - Card
  - Bank Transfer
  - Mobile Wallet
  - Split payment support
- **Receipt Generation**:
  - Digital receipts
  - Print via Bluetooth (ready for integration)
  - Email/SMS delivery
  - Reprint functionality

### Offline-First Capabilities
- **Local Storage**: All data cached locally using localStorage
- **Offline Mode**: Full POS functionality without internet
- **Auto-Sync**: Automatic synchronization when back online
- **Sync Logs**: Track pending, synced, and failed transactions
- **Conflict Resolution**: Built-in sync engine

### Customer Management
- **Customer Lookup**: Search by name, phone, or email
- **Customer Creation**: Add new customers on the fly
- **Purchase History**: View customer transaction history
- **Loyalty Program**:
  - Points accumulation (1 point per $10)
  - Points redemption ($0.01 per point)
  - VIP customer badges
  - Customer-specific pricing

### Sales Reporting & Dashboard
- **Daily Performance Metrics**:
  - Total sales
  - Transaction count
  - Average transaction value
  - Items sold
  - Customers served
- **Payment Method Breakdown**:
  - Cash vs Card vs Transfer vs Mobile
  - Visual breakdown
- **Recent Transactions**: Last 5 transactions with details
- **End-of-Day Reconciliation**: Close day and reconcile all sales

### Security & Access Control
- **Role-Based Permissions**:
  - Salesperson: Basic sales, limited discounts
  - Cashier: Sales, refunds, moderate discounts
  - Supervisor: Full access, price override, unlimited discounts
  - Floor Agent: Stock checks, customer lookup
- **Supervisor Approval**: Required for sensitive operations
- **PIN Authentication**: Fast user switching

## 📱 Technical Architecture

### Technologies
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks + localStorage
- **Offline Storage**: localStorage with sync queue

### Mobile Optimizations
- **Responsive Design**: Mobile-first approach
- **Touch-Optimized**: Large buttons, easy navigation
- **PWA Support**: Installable as mobile app
- **Offline-First**: Works without internet
- **Fast Performance**: Optimized for low-end devices
- **Smooth Animations**: Visual feedback for all actions

### Data Flow
```
User Action → Local State → localStorage → Sync Queue → API (when online)
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Trust, professionalism
- **Secondary**: Green (#22c55e) - Success, growth
- **Accent**: Gradients (blue-to-green) - Modern, dynamic
- **Error**: Red (#d4183d) - Alerts, warnings
- **Warning**: Orange/Amber - Caution, attention

### UI/UX Principles
- **Clean & Modern**: Minimalistic retail-tech style
- **Rounded Elements**: Friendly, approachable
- **Large Touch Targets**: Minimum 44px for accessibility
- **Visual Feedback**: Animations for every action
- **Consistent Spacing**: 4px grid system
- **High Contrast**: Readable in all lighting conditions

## 📊 Mock Data

The application includes comprehensive mock data for demonstration:
- **20 Products** across 10 categories
- **5 Customers** with loyalty points and purchase history
- **4 User Roles** with different permission levels
- **Barcode Support**: Test barcodes for quick scanning

### Test Credentials
- **PIN**: 1234 (for all users)
- **Test Users**:
  - John Doe (Salesperson)
  - Jane Smith (Cashier)
  - Mike Johnson (Supervisor)
  - Sarah Williams (Floor Agent)

### Test Barcodes
- 1234567890123 - Organic Whole Milk
- 1234567890124 - White Bread Loaf
- 1234567890125 - Fresh Eggs
- 1234567890126 - Orange Juice

## 🔄 Sync System

### How It Works
1. **Sales Created**: All transactions saved to `pos-pending-sales`
2. **Offline Queue**: Items remain in queue when offline
3. **Auto-Sync**: When online, automatically syncs pending items
4. **Conflict Resolution**: Server timestamp wins in conflicts
5. **Retry Logic**: Failed items retry on next sync

### Sync Status
- **Pending**: Awaiting sync to server
- **Synced**: Successfully uploaded to ERP
- **Failed**: Sync error (requires attention)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser (Chrome, Safari, Edge)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage
1. **Login**: Use quick login or enter credentials (PIN: 1234)
2. **Scan/Search Products**: Use barcode scanner or search
3. **Add to Cart**: Tap products or scan barcodes
4. **Apply Discounts**: Tap discount button on cart items
5. **Select Customer**: Optional - add loyalty customer
6. **Process Payment**: Choose payment method(s)
7. **Complete Sale**: Generate receipt and start new sale

## 📱 Progressive Web App (PWA)

### Installation
1. **iOS**: Safari → Share → Add to Home Screen
2. **Android**: Chrome → Menu → Install App

### Features
- **Offline Access**: Works without internet
- **Home Screen Icon**: Quick access
- **Full Screen**: App-like experience
- **Background Sync**: Syncs when network available

## 🔐 Security Features

### Data Protection
- **Local Storage**: Client-side data encryption ready
- **Role Permissions**: Granular access control
- **Audit Trail**: All actions logged
- **Session Management**: Auto-logout on inactivity (ready for implementation)

### API Integration
- **Mock Endpoints**: Ready for real ERP integration
- **Authentication**: Token-based auth ready
- **Error Handling**: Comprehensive error management
- **Retry Logic**: Automatic retry on failure

## 🎯 Future Enhancements

### Planned Features
- [ ] Real camera barcode scanning (using device camera)
- [ ] Bluetooth thermal printer integration
- [ ] Biometric authentication (fingerprint/face ID)
- [ ] Real-time inventory updates via WebSocket
- [ ] Advanced reporting with charts
- [ ] Multi-currency support
- [ ] Tax calculation
- [ ] Returns and refunds workflow
- [ ] Employee time tracking
- [ ] Cash drawer management
- [ ] Receipt customization

### API Integration Points
- `POST /api/sales` - Submit sale transaction
- `GET /api/products` - Fetch product catalog
- `GET /api/products/:barcode` - Lookup by barcode
- `GET /api/customers` - Fetch customers
- `POST /api/customers` - Create customer
- `PUT /api/inventory` - Update stock levels
- `GET /api/sync` - Sync pending data

## 📄 License

This is a demonstration application. Customize and use according to your needs.

## 🤝 Contributing

This is a template application. Feel free to:
- Add real API integration
- Customize for your business needs
- Add additional features
- Improve UI/UX

## 📞 Support

For questions or issues:
1. Check the code comments
2. Review mock data structures
3. Test with demo credentials

---

**Built with ❤️ for modern retail operations**
