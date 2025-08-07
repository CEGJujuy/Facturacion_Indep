import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { localDB, Quote, Product, Service, Customer, QuoteItem } from '../lib/localStorage';
import { 
  Plus, 
  FileText, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import PDFGenerator from '../components/PDFGenerator';

export default function Quotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Form states
  const [quoteForm, setQuoteForm] = useState({
    customer_id: '',
    customer_name: '',
    valid_until: '',
    payment_terms: '',
    notes: '',
    items: [] as QuoteItem[]
  });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [newItem, setNewItem] = useState({
    type: 'product' as 'product' | 'service',
    item_id: '',
    quantity: 1,
    hours: 1
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    const userQuotes = localDB.getQuotes(user.id);
    const userProducts = localDB.getProducts(user.id);
    const userServices = localDB.getServices(user.id);
    const userCustomers = localDB.getCustomers(user.id);
    
    setQuotes(userQuotes);
    setProducts(userProducts);
    setServices(userServices);
    setCustomers(userCustomers);
    setLoading(false);
  };

  const resetQuoteForm = () => {
    setQuoteForm({
      customer_id: '',
      customer_name: '',
      valid_until: '',
      payment_terms: '',
      notes: '',
      items: []
    });
    setEditingQuote(null);
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newCustomer = localDB.createCustomer(user.id, customerForm);
      setCustomers([...customers, newCustomer]);
      setQuoteForm({ ...quoteForm, customer_id: newCustomer.id, customer_name: newCustomer.name });
      setShowCustomerModal(false);
      resetCustomerForm();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const addItemToQuote = () => {
    if (!newItem.item_id) return;

    let item: QuoteItem;
    
    if (newItem.type === 'product') {
      const product = products.find(p => p.id === newItem.item_id);
      if (!product) return;
      
      const total = product.price * newItem.quantity;
      item = {
        id: Date.now().toString(),
        type: 'product',
        item_id: product.id,
        name: product.name,
        description: product.description,
        quantity: newItem.quantity,
        unit_price: product.price,
        tax_rate: product.tax_rate,
        total: total
      };
    } else {
      const service = services.find(s => s.id === newItem.item_id);
      if (!service) return;
      
      const total = service.hourly_rate * newItem.hours;
      item = {
        id: Date.now().toString(),
        type: 'service',
        item_id: service.id,
        name: service.name,
        description: service.description,
        quantity: newItem.hours,
        unit_price: service.hourly_rate,
        tax_rate: service.tax_rate,
        total: total
      };
    }

    setQuoteForm({
      ...quoteForm,
      items: [...quoteForm.items, item]
    });

    setNewItem({
      type: 'product',
      item_id: '',
      quantity: 1,
      hours: 1
    });
  };

  const removeItemFromQuote = (itemId: string) => {
    setQuoteForm({
      ...quoteForm,
      items: quoteForm.items.filter(item => item.id !== itemId)
    });
  };

  const calculateQuoteTotals = () => {
    const subtotal = quoteForm.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = quoteForm.items.reduce((sum, item) => sum + (item.total * item.tax_rate / 100), 0);
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { subtotal, taxAmount, total } = calculateQuoteTotals();
      
      const quoteData = {
        customer_id: quoteForm.customer_id,
        customer_name: quoteForm.customer_name,
        quote_number: editingQuote ? editingQuote.quote_number : localDB.generateQuoteNumber(),
        status: 'draft' as const,
        items: quoteForm.items,
        subtotal,
        tax_amount: taxAmount,
        total,
        valid_until: quoteForm.valid_until,
        payment_terms: quoteForm.payment_terms,
        notes: quoteForm.notes
      };

      if (editingQuote) {
        localDB.updateQuote(editingQuote.id, quoteData);
      } else {
        localDB.createQuote(user.id, quoteData);
      }

      loadData();
      setShowModal(false);
      resetQuoteForm();
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteForm({
      customer_id: quote.customer_id,
      customer_name: quote.customer_name,
      valid_until: quote.valid_until,
      payment_terms: quote.payment_terms || '',
      notes: quote.notes || '',
      items: quote.items
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      localDB.deleteQuote(id);
      loadData();
    }
  };

  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    localDB.updateQuote(quoteId, { status: newStatus });
    loadData();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">Create and manage your quotes</p>
        </div>
        <button
          onClick={() => {
            resetQuoteForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          {filteredQuotes.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.quote_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${quote.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(quote.status)}
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value as Quote['status'])}
                          className={`ml-2 text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(quote.status)}`}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="text-green-600 hover:text-green-900"
                          title="Generar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(quote)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No quotes found. Create your first quote to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quote Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingQuote ? 'Edit Quote' : 'Create New Quote'}
              </h3>
              <form onSubmit={handleSubmitQuote} className="space-y-6">
                {/* Customer Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer *
                    </label>
                    <div className="flex gap-2">
                      <select
                        required
                        value={quoteForm.customer_id}
                        onChange={(e) => {
                          const customer = customers.find(c => c.id === e.target.value);
                          setQuoteForm({
                            ...quoteForm,
                            customer_id: e.target.value,
                            customer_name: customer?.name || ''
                          });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCustomerModal(true)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={quoteForm.valid_until}
                      onChange={(e) => setQuoteForm({ ...quoteForm, valid_until: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Items</h4>
                  
                  {/* Add Item Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <select
                          value={newItem.type}
                          onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'product' | 'service', item_id: '' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <select
                          value={newItem.item_id}
                          onChange={(e) => setNewItem({ ...newItem, item_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select {newItem.type}</option>
                          {(newItem.type === 'product' ? products : services).map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} - ${newItem.type === 'product' ? (item as Product).price : (item as Service).hourly_rate}
                              {newItem.type === 'service' ? '/hr' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={newItem.type === 'product' ? newItem.quantity : newItem.hours}
                          onChange={(e) => setNewItem({
                            ...newItem,
                            [newItem.type === 'product' ? 'quantity' : 'hours']: parseFloat(e.target.value)
                          })}
                          placeholder={newItem.type === 'product' ? 'Qty' : 'Hours'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={addItemToQuote}
                          disabled={!newItem.item_id}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  {quoteForm.items.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty/Hours</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {quoteForm.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">${item.unit_price}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">${item.total.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeItemFromQuote(item.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {/* Totals */}
                      <div className="bg-gray-50 px-4 py-3">
                        <div className="flex justify-end space-y-1">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              Subtotal: ${calculateQuoteTotals().subtotal.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Tax: ${calculateQuoteTotals().taxAmount.toFixed(2)}
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              Total: ${calculateQuoteTotals().total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={quoteForm.payment_terms}
                      onChange={(e) => setQuoteForm({ ...quoteForm, payment_terms: e.target.value })}
                      placeholder="e.g., Net 30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetQuoteForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteForm.items.length === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingQuote ? 'Update Quote' : 'Create Quote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h3>
              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomerModal(false);
                      resetCustomerForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PDF Generator */}
      {selectedQuote && user && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Generar PDF de Cotización</h3>
            <p className="text-gray-600 mb-4">
              Cotización: {selectedQuote.quote_number}
            </p>
            <div className="flex space-x-3">
              <PDFGenerator
                data={selectedQuote}
                user={user}
                type="quote"
                onGenerated={() => setSelectedQuote(null)}
              />
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}