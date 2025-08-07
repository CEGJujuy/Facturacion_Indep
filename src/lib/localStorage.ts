export interface User {
  id: string;
  email: string;
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  logo_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  tax_rate: number;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  hourly_rate: number;
  tax_rate: number;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface QuoteItem {
  id: string;
  type: 'product' | 'service';
  item_id: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

export interface Quote {
  id: string;
  user_id: string;
  customer_id: string;
  customer_name: string;
  quote_number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  valid_until: string;
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

class LocalStorageManager {
  private getKey(table: string): string {
    return `invoice_system_${table}`;
  }

  private getData<T>(table: string): T[] {
    const data = localStorage.getItem(this.getKey(table));
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getKey(table), JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // User management
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('current_user');
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  clearCurrentUser(): void {
    localStorage.removeItem('current_user');
  }

  createUser(userData: Omit<User, 'id' | 'created_at'>): User {
    const user: User = {
      ...userData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
    };
    
    const users = this.getData<User>('users');
    users.push(user);
    this.setData('users', users);
    
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getData<User>('users');
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    this.setData('users', users);
    
    // Update current user if it's the same
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser(users[index]);
    }
    
    return users[index];
  }

  // Products
  getProducts(userId: string): Product[] {
    return this.getData<Product>('products').filter(p => p.user_id === userId);
  }

  createProduct(userId: string, productData: Omit<Product, 'id' | 'user_id' | 'created_at'>): Product {
    const product: Product = {
      ...productData,
      id: this.generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    
    const products = this.getData<Product>('products');
    products.push(product);
    this.setData('products', products);
    
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getData<Product>('products');
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updates };
    this.setData('products', products);
    
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getData<Product>('products');
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    this.setData('products', filteredProducts);
    return true;
  }

  // Services
  getServices(userId: string): Service[] {
    return this.getData<Service>('services').filter(s => s.user_id === userId);
  }

  createService(userId: string, serviceData: Omit<Service, 'id' | 'user_id' | 'created_at'>): Service {
    const service: Service = {
      ...serviceData,
      id: this.generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    
    const services = this.getData<Service>('services');
    services.push(service);
    this.setData('services', services);
    
    return service;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const services = this.getData<Service>('services');
    const index = services.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    services[index] = { ...services[index], ...updates };
    this.setData('services', services);
    
    return services[index];
  }

  deleteService(id: string): boolean {
    const services = this.getData<Service>('services');
    const filteredServices = services.filter(s => s.id !== id);
    
    if (filteredServices.length === services.length) return false;
    
    this.setData('services', filteredServices);
    return true;
  }

  // Customers
  getCustomers(userId: string): Customer[] {
    return this.getData<Customer>('customers').filter(c => c.user_id === userId);
  }

  createCustomer(userId: string, customerData: Omit<Customer, 'id' | 'user_id' | 'created_at'>): Customer {
    const customer: Customer = {
      ...customerData,
      id: this.generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    
    const customers = this.getData<Customer>('customers');
    customers.push(customer);
    this.setData('customers', customers);
    
    return customer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = this.getData<Customer>('customers');
    const index = customers.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    customers[index] = { ...customers[index], ...updates };
    this.setData('customers', customers);
    
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    const customers = this.getData<Customer>('customers');
    const filteredCustomers = customers.filter(c => c.id !== id);
    
    if (filteredCustomers.length === customers.length) return false;
    
    this.setData('customers', filteredCustomers);
    return true;
  }

  // Quotes
  getQuotes(userId: string): Quote[] {
    return this.getData<Quote>('quotes').filter(q => q.user_id === userId);
  }

  createQuote(userId: string, quoteData: Omit<Quote, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Quote {
    const quote: Quote = {
      ...quoteData,
      id: this.generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const quotes = this.getData<Quote>('quotes');
    quotes.push(quote);
    this.setData('quotes', quotes);
    
    return quote;
  }

  updateQuote(id: string, updates: Partial<Quote>): Quote | null {
    const quotes = this.getData<Quote>('quotes');
    const index = quotes.findIndex(q => q.id === id);
    
    if (index === -1) return null;
    
    quotes[index] = { 
      ...quotes[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    this.setData('quotes', quotes);
    
    return quotes[index];
  }

  deleteQuote(id: string): boolean {
    const quotes = this.getData<Quote>('quotes');
    const filteredQuotes = quotes.filter(q => q.id !== id);
    
    if (filteredQuotes.length === quotes.length) return false;
    
    this.setData('quotes', filteredQuotes);
    return true;
  }

  generateQuoteNumber(): string {
    const quotes = this.getData<Quote>('quotes');
    const year = new Date().getFullYear();
    const count = quotes.filter(q => q.quote_number.startsWith(`Q${year}`)).length + 1;
    return `Q${year}-${count.toString().padStart(4, '0')}`;
  }
}

export const localDB = new LocalStorageManager();