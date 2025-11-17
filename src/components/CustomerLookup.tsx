import { useState } from 'react';
import { Customer } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, UserPlus, Star, Phone, Mail } from 'lucide-react';
import { MOCK_CUSTOMERS, searchCustomers } from '../data/mockCustomers';
import { toast } from 'sonner@2.0.3';

interface CustomerLookupProps {
  onSelectCustomer: (customer: Customer) => void;
  onBack: () => void;
}

export function CustomerLookup({ onSelectCustomer, onBack }: CustomerLookupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredCustomers = searchCustomers(searchQuery);

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    toast.success(`Customer ${customer.name} selected`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#008060] text-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-white">Customer Lookup</h2>
            <p className="text-blue-100 text-sm">Search or create customer</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Create New Customer */}
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="outline"
          className="w-full h-12"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create New Customer
        </Button>

        {/* Customer List */}
        <div className="space-y-2">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found</p>
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <Card 
                key={customer.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectCustomer(customer)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-900">{customer.name}</h3>
                      {customer.specialPrice && (
                        <Badge className="bg-yellow-500 text-yellow-900">
                          <Star className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail className="w-4 h-4" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-500">Points: </span>
                        <span className="text-[#008060]">{customer.loyaltyPoints}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Total: </span>
                        <span className="text-green-600">₦{customer.totalPurchases.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" className="bg-[#008060] hover:bg-[#006e52]">
                    Select
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Customer Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl">
            <h3 className="text-gray-900 mb-4">Create New Customer</h3>
            
            <div className="space-y-4">
              <Input placeholder="Full Name" />
              <Input placeholder="Phone Number" type="tel" />
              <Input placeholder="Email (optional)" type="email" />
              
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    toast.success('Customer created successfully');
                    setShowCreateForm(false);
                  }}
                  className="bg-[#008060] hover:bg-[#006e52]"
                >
                  Create
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}