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

export interface Invoice {
  id: string;
  user_id: string;
  customer_id: string;
  customer_name: string;
  quote_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  due_date: string;
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

class LocalStorageManager {
  // Mock user for demo purposes
  private mockUser: User = {
    id: 'demo-user-123',
    email: 'demo@empresa.com',
    company_name: 'Mi Empresa',
    company_address: 'Calle Principal 123, Ciudad',
    company_phone: '+1 234 567 8900',
    company_email: 'contacto@miempresa.com',
    logo_url: '',
    created_at: new Date().toISOString()
  };

  // Initialize with sample data if empty
  private initializeSampleData(): void {
    const userId = this.mockUser.id;
    
    // Initialize users
    const users = this.getData<User>('users');
    if (users.length === 0) {
      this.setData('users', [this.mockUser]);
    }

    // Initialize sample products
    const products = this.getData<Product>('products');
    if (products.length === 0) {
      const sampleProducts: Product[] = [
        {
          id: this.generateId(),
          user_id: userId,
          name: 'Consultoría Web',
          description: 'Desarrollo de sitio web corporativo',
          price: 1500,
          tax_rate: 16,
          created_at: new Date().toISOString()
        },
        {
          id: this.generateId(),
          user_id: userId,
          name: 'Diseño de Logo',
          description: 'Diseño profesional de identidad corporativa',
          price: 500,
          tax_rate: 16,
          created_at: new Date().toISOString()
        }
      ];
      this.setData('products', sampleProducts);
    }

    // Initialize sample services
    const services = this.getData<Service>('services');
    if (services.length === 0) {
      const sampleServices: Service[] = [
        {
          id: this.generateId(),
          user_id: userId,
          name: 'Desarrollo Frontend',
          description: 'Desarrollo de interfaces de usuario',
          hourly_rate: 75,
          tax_rate: 16,
          created_at: new Date().toISOString()
        },
        {
          id: this.generateId(),
          user_id: userId,
          name: 'Consultoría IT',
          description: 'Asesoría técnica especializada',
          hourly_rate: 100,
          tax_rate: 16,
          created_at: new Date().toISOString()
        }
      ];
      this.setData('services', sampleServices);
    }

    // Initialize sample customers
    const customers = this.getData<Customer>('customers');
    if (customers.length === 0) {
      const sampleCustomers: Customer[] = [
        {
          id: this.generateId(),
          user_id: userId,
          name: 'Empresa ABC S.A.',
          email: 'contacto@empresaabc.com',
          phone: '+1 555 0123',
          address: 'Av. Comercial 456, Ciudad',
          created_at: new Date().toISOString()
        },
        {
          id: this.generateId(),
          user_id: userId,
          name: 'Startup XYZ',
          email: 'info@startupxyz.com',
          phone: '+1 555 0456',
          address: 'Centro de Innovación 789, Ciudad',
          created_at: new Date().toISOString()
        }
      ];
      this.setData('customers', sampleCustomers);
    }

    // Initialize sample quotes
    const quotes = this.getData<Quote>('quotes');
    if (quotes.length === 0) {
      const products = this.getData<Product>('products');
      const customers = this.getData<Customer>('customers');
      
      if (products.length > 0 && customers.length > 0) {
        const sampleQuotes: Quote[] = [
          {
            id: this.generateId(),
            user_id: userId,
            customer_id: customers[0].id,
            customer_name: customers[0].name,
            quote_number: 'Q2024-0001',
            status: 'accepted',
            items: [{
              id: this.generateId(),
              type: 'product',
              item_id: products[0].id,
              name: products[0].name,
              description: products[0].description,
              quantity: 1,
              unit_price: products[0].price,
              tax_rate: products[0].tax_rate,
              total: products[0].price
            }],
            subtotal: products[0].price,
            tax_amount: products[0].price * (products[0].tax_rate / 100),
            total: products[0].price + (products[0].price * (products[0].tax_rate / 100)),
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payment_terms: 'Net 30',
            notes: 'Cotización de ejemplo',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: this.generateId(),
            user_id: userId,
            customer_id: customers[1].id,
            customer_name: customers[1].name,
            quote_number: 'Q2024-0002',
            status: 'sent',
            items: [{
              id: this.generateId(),
              type: 'product',
              item_id: products[1].id,
              name: products[1].name,
              description: products[1].description,
              quantity: 1,
              unit_price: products[1].price,
              tax_rate: products[1].tax_rate,
              total: products[1].price
            }],
            subtotal: products[1].price,
            tax_amount: products[1].price * (products[1].tax_rate / 100),
            total: products[1].price + (products[1].price * (products[1].tax_rate / 100)),
            valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            payment_terms: 'Net 15',
            notes: 'Propuesta de diseño',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        this.setData('quotes', sampleQuotes);
      }
    }
  }

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
    this.initializeSampleData();
    return this.mockUser;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  clearCurrentUser(): void {
    localStorage.removeItem('current_user');
  }

  createUser(userData: Omit<User, 'id' | 'created_at'>): User {
    this.initializeSampleData();
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
    this.initializeSampleData();
    const users = this.getData<User>('users');
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    this.setData('users', users);
    
    // Update current user if it's the same
    if (this.mockUser.id === id) {
      this.mockUser = { ...this.mockUser, ...updates };
    }
    
    return users[index];
  }

  // Products
  getProducts(userId: string): Product[] {
    this.initializeSampleData();
    return this.getData<Product>('products').filter(p => p.user_id === userId);
  }

  createProduct(userId: string, productData: Omit<Product, 'id' | 'user_id' | 'created_at'>): Product {
    this.initializeSampleData();
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
    this.initializeSampleData();
    const products = this.getData<Product>('products');
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updates };
    this.setData('products', products);
    
    return products[index];
  }

  deleteProduct(id: string): boolean {
    this.initializeSampleData();
    const products = this.getData<Product>('products');
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    this.setData('products', filteredProducts);
    return true;
  }

  // Services
  getServices(userId: string): Service[] {
    this.initializeSampleData();
    return this.getData<Service>('services').filter(s => s.user_id === userId);
  }

  createService(userId: string, serviceData: Omit<Service, 'id' | 'user_id' | 'created_at'>): Service {
    this.initializeSampleData();
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
    this.initializeSampleData();
    const services = this.getData<Service>('services');
    const index = services.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    services[index] = { ...services[index], ...updates };
    this.setData('services', services);
    
    return services[index];
  }

  deleteService(id: string): boolean {
    this.initializeSampleData();
    const services = this.getData<Service>('services');
    const filteredServices = services.filter(s => s.id !== id);
    
    if (filteredServices.length === services.length) return false;
    
    this.setData('services', filteredServices);
    return true;
  }

  // Customers
  getCustomers(userId: string): Customer[] {
    this.initializeSampleData();
    return this.getData<Customer>('customers').filter(c => c.user_id === userId);
  }

  createCustomer(userId: string, customerData: Omit<Customer, 'id' | 'user_id' | 'created_at'>): Customer {
    this.initializeSampleData();
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
    this.initializeSampleData();
    const customers = this.getData<Customer>('customers');
    const index = customers.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    customers[index] = { ...customers[index], ...updates };
    this.setData('customers', customers);
    
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    this.initializeSampleData();
    const customers = this.getData<Customer>('customers');
    const filteredCustomers = customers.filter(c => c.id !== id);
    
    if (filteredCustomers.length === customers.length) return false;
    
    this.setData('customers', filteredCustomers);
    return true;
  }

  // Quotes
  getQuotes(userId: string): Quote[] {
    this.initializeSampleData();
    return this.getData<Quote>('quotes').filter(q => q.user_id === userId);
  }

  createQuote(userId: string, quoteData: Omit<Quote, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Quote {
    this.initializeSampleData();
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
    this.initializeSampleData();
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
    this.initializeSampleData();
    const quotes = this.getData<Quote>('quotes');
    const filteredQuotes = quotes.filter(q => q.id !== id);
    
    if (filteredQuotes.length === quotes.length) return false;
    
    this.setData('quotes', filteredQuotes);
    return true;
  }

  generateQuoteNumber(): string {
    this.initializeSampleData();
    const quotes = this.getData<Quote>('quotes');
    const year = new Date().getFullYear();
    const count = quotes.filter(q => q.quote_number.startsWith(`Q${year}`)).length + 1;
    return `Q${year}-${count.toString().padStart(4, '0')}`;
  }

  // Invoices
  getInvoices(userId: string): Invoice[] {
    this.initializeSampleData();
    return this.getData<Invoice>('invoices').filter(i => i.user_id === userId);
  }

  createInvoice(userId: string, invoiceData: Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Invoice {
    this.initializeSampleData();
    const invoice: Invoice = {
      ...invoiceData,
      id: this.generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const invoices = this.getData<Invoice>('invoices');
    invoices.push(invoice);
    this.setData('invoices', invoices);
    
    return invoice;
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
    this.initializeSampleData();
    const invoices = this.getData<Invoice>('invoices');
    const index = invoices.findIndex(i => i.id === id);
    
    if (index === -1) return null;
    
    invoices[index] = { 
      ...invoices[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    this.setData('invoices', invoices);
    
    return invoices[index];
  }

  deleteInvoice(id: string): boolean {
    this.initializeSampleData();
    const invoices = this.getData<Invoice>('invoices');
    const filteredInvoices = invoices.filter(i => i.id !== id);
    
    if (filteredInvoices.length === invoices.length) return false;
    
    this.setData('invoices', filteredInvoices);
    return true;
  }

  generateInvoiceNumber(): string {
    this.initializeSampleData();
    const invoices = this.getData<Invoice>('invoices');
    const year = new Date().getFullYear();
    const count = invoices.filter(i => i.invoice_number.startsWith(`INV${year}`)).length + 1;
    return `INV${year}-${count.toString().padStart(4, '0')}`;
  }

  // Convert quote to invoice
  convertQuoteToInvoice(quoteId: string): Invoice | null {
    this.initializeSampleData();
    const quotes = this.getData<Quote>('quotes');
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote || quote.status !== 'accepted') return null;
    
    const invoiceData = {
      customer_id: quote.customer_id,
      customer_name: quote.customer_name,
      quote_id: quote.id,
      invoice_number: this.generateInvoiceNumber(),
      status: 'draft' as const,
      items: quote.items,
      subtotal: quote.subtotal,
      tax_amount: quote.tax_amount,
      total: quote.total,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      payment_terms: quote.payment_terms,
      notes: quote.notes
    };
    
    return this.createInvoice(quote.user_id, invoiceData);
  }
}

export const localDB = new LocalStorageManager();