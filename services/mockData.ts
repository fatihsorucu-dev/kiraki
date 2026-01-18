
import { Currency, Transaction, Invoice, FXRate, User, Company, Alert } from '../types';

export const mockCompanies: Company[] = [
  { id: 'c1', name: 'Sorucu IT Services', taxId: '1234567890', readinessScore: 78, industry: 'Technology' },
  { id: 'c2', name: 'Anadolu Gıda Ltd.', taxId: '9876543210', readinessScore: 62, industry: 'Food & Beverage' }
];

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2023-10-01', amount: 45000, currency: Currency.TRY, type: 'inflow', counterparty: 'Müşteri A', category: 'Sales' },
  { id: '2', date: '2023-10-05', amount: 12000, currency: Currency.TRY, type: 'outflow', counterparty: 'Kira Yönetimi', category: 'Fixed' },
  { id: '3', date: '2023-10-10', amount: 2500, currency: Currency.USD, type: 'outflow', counterparty: 'AWS Cloud', category: 'Software' },
  { id: '4', date: '2023-10-15', amount: 8000, currency: Currency.EUR, type: 'inflow', counterparty: 'Almanya İhracat Ltd', category: 'Export' },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv-1', dueDate: '2024-06-15', amount: 150000, currency: Currency.TRY, status: 'pending', type: 'receivable', counterparty: 'Anadolu Dağıtım', riskScore: 12 },
  { id: 'inv-2', dueDate: '2024-06-20', amount: 4500, currency: Currency.USD, status: 'pending', type: 'payable', counterparty: 'Global Logistics', riskScore: 45 },
  { id: 'inv-3', dueDate: '2024-07-01', amount: 2200, currency: Currency.EUR, status: 'pending', type: 'payable', counterparty: 'Fabrik AG', riskScore: 88 },
  { id: 'inv-4', dueDate: '2024-07-15', amount: 75000, currency: Currency.TRY, status: 'pending', type: 'receivable', counterparty: 'Trend Pazarlama', riskScore: 24 },
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    title: 'Döviz Riski Limiti Aşıldı',
    description: 'Euro açık pozisyonunuz belirlenen %20 güvenli sınırın üzerine çıktı.',
    severity: 'high',
    date: '2024-06-05',
    impact: '-₺420,000 (Olası Kur Artışı)',
    suggestedAction: 'Döviz forward sözleşmesi yapmayı değerlendirin.'
  },
  {
    id: 'a2',
    title: 'Büyük Ödeme Yaklaşıyor',
    description: 'EuroSteel firmasına yapılacak ₺280,000 tutarındaki ödeme 14 gün içinde.',
    severity: 'medium',
    date: '2024-06-04',
    suggestedAction: 'Nakit bakiye kontrolü sağlayın.'
  }
];

export const mockFXRates: FXRate[] = [
  { pair: 'USDTRY', rate: 32.50 },
  { pair: 'EURTRY', rate: 35.20 },
  { pair: 'EURUSD', rate: 1.08 },
];

export const getBalances = () => ({
  [Currency.TRY]: 850000,
  [Currency.USD]: 12400,
  [Currency.EUR]: 8900,
});

export const initialUsers: User[] = [
  {
    id: 'master-1',
    name: 'Master Admin',
    email: 'master@kiraki.com',
    role: 'Platform Owner',
    isMaster: true,
    avatar: 'https://i.pravatar.cc/150?u=master',
    permissions: { 
      canUploadData: true, canRunSimulations: true, canViewInsights: true, 
      canManageUsers: true, canAccessFX: true, canAccessForecast: true, canAccessAlerts: true 
    },
    companyId: 'platform'
  },
  {
    id: 'u1',
    name: 'Mert Aksoy',
    email: 'admin@kiraki.com',
    role: 'CEO',
    avatar: 'https://i.pravatar.cc/150?u=mert',
    permissions: { 
      canUploadData: true, canRunSimulations: true, canViewInsights: true, 
      canManageUsers: true, canAccessFX: true, canAccessForecast: true, canAccessAlerts: true 
    },
    companyId: 'c1'
  },
  {
    id: 'u2',
    name: 'Ayşe Yılmaz',
    email: 'finance@kiraki.com',
    role: 'Finance Specialist',
    avatar: 'https://i.pravatar.cc/150?u=ayse',
    permissions: { 
      canUploadData: true, canRunSimulations: true, canViewInsights: true, 
      canManageUsers: false, canAccessFX: true, canAccessForecast: true, canAccessAlerts: true 
    },
    companyId: 'c1'
  }
];
