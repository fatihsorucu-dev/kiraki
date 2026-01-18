
export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR'
}

export type PermissionKey = 'canUploadData' | 'canRunSimulations' | 'canViewInsights' | 'canManageUsers' | 'canAccessFX' | 'canAccessForecast' | 'canAccessAlerts';

export interface Permissions {
  canUploadData: boolean;
  canRunSimulations: boolean;
  canViewInsights: boolean;
  canManageUsers: boolean;
  canAccessFX: boolean;
  canAccessForecast: boolean;
  canAccessAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  permissions: Permissions;
  companyId: string;
  isMaster?: boolean;
}

export interface Company {
  id: string;
  name: string;
  taxId: string;
  readinessScore: number;
  industry: 'Technology' | 'Manufacturing' | 'Export' | 'Retail' | 'Food & Beverage';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: Currency;
  type: 'inflow' | 'outflow';
  counterparty: string;
  category: string;
}

export interface Check {
  id: string;
  maturityDate: string;
  amount: number;
  currency: Currency;
  type: 'receivable' | 'payable';
  bank: string;
  checkNumber: string;
  counterparty: string;
  status: 'portfolio' | 'cashed' | 'returned';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  companyId: string;
}

export interface Invoice {
  id: string;
  dueDate: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'paid' | 'delayed';
  type: 'receivable' | 'payable';
  counterparty: string;
  riskScore?: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface FXRate {
  pair: string;
  rate: number;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
  actionType: 'pay_invoice' | 'hedge_currency' | 'view_forecast' | 'update_balance' | 'none';
  actionTarget?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  impact?: string;
  suggestedAction?: string;
}
