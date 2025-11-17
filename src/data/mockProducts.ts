export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  barcode: string;
  image?: string;
  batch?: string;
  expiryDate?: string;
}

// Mock product database - simulating 20,000+ SKU database
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'FOOD-001',
    name: 'Organic Whole Milk 1L',
    category: 'Dairy',
    price: 4.99,
    stock: 150,
    lowStockThreshold: 20,
    barcode: '1234567890123',
    batch: 'B2024-11',
    expiryDate: '2025-12-01'
  },
  {
    id: '2',
    sku: 'FOOD-002',
    name: 'White Bread Loaf',
    category: 'Bakery',
    price: 2.49,
    stock: 80,
    lowStockThreshold: 15,
    barcode: '1234567890124',
    batch: 'B2024-11',
    expiryDate: '2024-11-20'
  },
  {
    id: '3',
    sku: 'FOOD-003',
    name: 'Fresh Eggs (12 pack)',
    category: 'Dairy',
    price: 5.99,
    stock: 200,
    lowStockThreshold: 30,
    barcode: '1234567890125',
    batch: 'B2024-11',
    expiryDate: '2024-12-01'
  },
  {
    id: '4',
    sku: 'BEV-001',
    name: 'Orange Juice 1L',
    category: 'Beverages',
    price: 3.99,
    stock: 120,
    lowStockThreshold: 25,
    barcode: '1234567890126',
    batch: 'B2024-11',
    expiryDate: '2025-01-15'
  },
  {
    id: '5',
    sku: 'BEV-002',
    name: 'Cola 2L Bottle',
    category: 'Beverages',
    price: 2.99,
    stock: 300,
    lowStockThreshold: 50,
    barcode: '1234567890127'
  },
  {
    id: '6',
    sku: 'SNACK-001',
    name: 'Potato Chips 200g',
    category: 'Snacks',
    price: 3.49,
    stock: 180,
    lowStockThreshold: 30,
    barcode: '1234567890128',
    expiryDate: '2025-06-01'
  },
  {
    id: '7',
    sku: 'SNACK-002',
    name: 'Chocolate Bar 100g',
    category: 'Snacks',
    price: 1.99,
    stock: 250,
    lowStockThreshold: 40,
    barcode: '1234567890129',
    expiryDate: '2025-08-01'
  },
  {
    id: '8',
    sku: 'CLEAN-001',
    name: 'Laundry Detergent 2L',
    category: 'Household',
    price: 12.99,
    stock: 60,
    lowStockThreshold: 15,
    barcode: '1234567890130'
  },
  {
    id: '9',
    sku: 'CLEAN-002',
    name: 'Dish Soap 500ml',
    category: 'Household',
    price: 4.49,
    stock: 90,
    lowStockThreshold: 20,
    barcode: '1234567890131'
  },
  {
    id: '10',
    sku: 'FRESH-001',
    name: 'Bananas (per kg)',
    category: 'Fresh Produce',
    price: 2.99,
    stock: 50,
    lowStockThreshold: 10,
    barcode: '1234567890132'
  },
  {
    id: '11',
    sku: 'FRESH-002',
    name: 'Tomatoes (per kg)',
    category: 'Fresh Produce',
    price: 4.49,
    stock: 35,
    lowStockThreshold: 10,
    barcode: '1234567890133'
  },
  {
    id: '12',
    sku: 'FRESH-003',
    name: 'Apples (per kg)',
    category: 'Fresh Produce',
    price: 3.99,
    stock: 45,
    lowStockThreshold: 10,
    barcode: '1234567890134'
  },
  {
    id: '13',
    sku: 'MEAT-001',
    name: 'Chicken Breast (per kg)',
    category: 'Meat',
    price: 12.99,
    stock: 25,
    lowStockThreshold: 5,
    barcode: '1234567890135',
    expiryDate: '2024-11-22'
  },
  {
    id: '14',
    sku: 'MEAT-002',
    name: 'Ground Beef (per kg)',
    category: 'Meat',
    price: 15.99,
    stock: 20,
    lowStockThreshold: 5,
    barcode: '1234567890136',
    expiryDate: '2024-11-21'
  },
  {
    id: '15',
    sku: 'FROZEN-001',
    name: 'Frozen Pizza',
    category: 'Frozen Foods',
    price: 6.99,
    stock: 100,
    lowStockThreshold: 20,
    barcode: '1234567890137',
    expiryDate: '2025-06-01'
  },
  {
    id: '16',
    sku: 'FROZEN-002',
    name: 'Ice Cream 1L',
    category: 'Frozen Foods',
    price: 5.49,
    stock: 75,
    lowStockThreshold: 15,
    barcode: '1234567890138',
    expiryDate: '2025-04-01'
  },
  {
    id: '17',
    sku: 'PAPER-001',
    name: 'Toilet Paper 12-pack',
    category: 'Household',
    price: 9.99,
    stock: 110,
    lowStockThreshold: 25,
    barcode: '1234567890139'
  },
  {
    id: '18',
    sku: 'PAPER-002',
    name: 'Paper Towels 6-pack',
    category: 'Household',
    price: 7.99,
    stock: 85,
    lowStockThreshold: 20,
    barcode: '1234567890140'
  },
  {
    id: '19',
    sku: 'CEREAL-001',
    name: 'Corn Flakes 500g',
    category: 'Breakfast',
    price: 4.99,
    stock: 140,
    lowStockThreshold: 25,
    barcode: '1234567890141',
    expiryDate: '2025-03-01'
  },
  {
    id: '20',
    sku: 'CEREAL-002',
    name: 'Oatmeal 1kg',
    category: 'Breakfast',
    price: 5.99,
    stock: 95,
    lowStockThreshold: 20,
    barcode: '1234567890142',
    expiryDate: '2025-05-01'
  }
];

export const PRODUCT_CATEGORIES = [
  'All Categories',
  'Dairy',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household',
  'Fresh Produce',
  'Meat',
  'Frozen Foods',
  'Breakfast'
];

export function searchProducts(query: string): Product[] {
  if (!query) return MOCK_PRODUCTS;
  
  const lowerQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.sku.toLowerCase().includes(lowerQuery) ||
    product.barcode.includes(query) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
}

export function getProductByBarcode(barcode: string): Product | undefined {
  return MOCK_PRODUCTS.find(product => product.barcode === barcode);
}

export function getProductsByCateory(category: string): Product[] {
  if (category === 'All Categories') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(product => product.category === category);
}
