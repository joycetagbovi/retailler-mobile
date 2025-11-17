import { Customer } from '../App';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Alice Johnson',
    phone: '+1234567890',
    email: 'alice@example.com',
    loyaltyPoints: 450,
    totalPurchases: 2350.50,
    specialPrice: true
  },
  {
    id: 'CUST-002',
    name: 'Bob Smith',
    phone: '+1234567891',
    email: 'bob@example.com',
    loyaltyPoints: 120,
    totalPurchases: 890.25,
    specialPrice: false
  },
  {
    id: 'CUST-003',
    name: 'Carol Williams',
    phone: '+1234567892',
    email: 'carol@example.com',
    loyaltyPoints: 780,
    totalPurchases: 4120.75,
    specialPrice: true
  },
  {
    id: 'CUST-004',
    name: 'David Brown',
    phone: '+1234567893',
    email: 'david@example.com',
    loyaltyPoints: 95,
    totalPurchases: 560.00,
    specialPrice: false
  },
  {
    id: 'CUST-005',
    name: 'Emma Davis',
    phone: '+1234567894',
    email: 'emma@example.com',
    loyaltyPoints: 1200,
    totalPurchases: 7850.30,
    specialPrice: true
  }
];

export function searchCustomers(query: string): Customer[] {
  if (!query) return MOCK_CUSTOMERS;
  
  const lowerQuery = query.toLowerCase();
  return MOCK_CUSTOMERS.filter(customer => 
    customer.name.toLowerCase().includes(lowerQuery) ||
    customer.phone.includes(query) ||
    customer.email?.toLowerCase().includes(lowerQuery) ||
    customer.id.toLowerCase().includes(lowerQuery)
  );
}
