export interface User {
  id: string;
  email: string;
  company_name: string;
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
  email: string;
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
  quote_number: string;
  title: string;
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  valid_until: string;
  payment_terms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  customer_id: string;
  quote_id?: string;
  invoice_number: string;
  title: string;
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  payment_terms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  monthlyRevenue: number;
  frequentCustomers: Customer[];
}