
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Currency, User, Alert, AuditLog, Company, PermissionKey, Insight, Invoice, Check } from './types';
import { mockTransactions, mockInvoices, mockFXRates, getBalances, initialUsers, mockCompanies, mockAlerts } from './services/mockData';
import { generateFinancialInsights, getPaymentStrategy } from './services/gemini';
import { translations, Lang } from './i18n';
import { Icons } from './constants';
import StatCard from './components/StatCard';
import CashflowChart, { EventMarker } from './components/CashflowChart';
import FXAnalyzer from './components/FXAnalyzer';
import InsightsFeed from './components/InsightsFeed';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import DataCenter from './components/DataCenter';
import ChatInterface from './components/ChatInterface';
import InvoiceScanner from './components/InvoiceScanner';
import MarketPulse from './components/MarketPulse';
import CheckManager from './components/CheckManager';

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'tr');
  useEffect(() => localStorage.setItem('lang', lang), [lang]);
  const t = translations[lang];

  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies');
    return saved ? JSON.parse(saved) : mockCompanies;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => localStorage.setItem('companies', JSON.stringify(companies)), [companies]);
  useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);

  const [balances, setBalances] = useState(getBalances());
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [checks, setChecks] = useState<Check[]>([
    { id: 'ch-1', maturityDate: '2024-07-15', amount: 450000, currency: Currency.TRY, type: 'receivable', bank: 'Garanti', checkNumber: '123456', counterparty: 'Mega Yapı A.Ş.', status: 'portfolio' },
    { id: 'ch-2', maturityDate: '2024-07-20', amount: 280000, currency: Currency.TRY, type: 'payable', bank: 'İş Bankası', checkNumber: '998877', counterparty: 'Demir Çelik Sanayi', status: 'portfolio' },
  ]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [fxShockScenario, setFxShockScenario] = useState(false);
  const [showManualBank, setShowManualBank] = useState(false);

  const activeCompany = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.isMaster) return { name: 'KIRAKI Platform', readinessScore: 100, industry: 'Technology' as const };
    return companies.find(c => c.id === currentUser.companyId) || mockCompanies[0];
  }, [currentUser, companies]);

  useEffect(() => {
    if (currentUser?.isMaster && !['dashboard', 'users', 'data'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);

  const logAction = (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      companyId: currentUser.companyId
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddCheck = (check: Check) => {
    if (currentUser?.isMaster) return;
    setChecks(prev => [check, ...prev]);
    logAction('AddCheck', `New check added: ${check.counterparty} - ${check.amount} ${check.currency}`);
  };

  const projectionData = useMemo(() => {
    if (currentUser?.isMaster) return [];
    const data = [];
    let currentBalance = balances[Currency.TRY] + 
                         (balances[Currency.USD] * mockFXRates[0].rate) + 
                         (balances[Currency.EUR] * mockFXRates[1].rate);
    
    data.push({ date: lang === 'tr' ? 'Bugün' : 'Today', balance: Math.round(currentBalance), low: Math.round(currentBalance * 0.98), high: Math.round(currentBalance * 1.02) });

    const months = lang === 'tr' ? ['Haziran', 'Temmuz', 'Ağustos'] : ['June', 'July', 'August'];
    months.forEach((month, idx) => {
      const monthInvoices = invoices.filter(inv => inv.status === 'pending' && new Date(inv.dueDate).getMonth() === (5 + idx) % 12);
      const monthChecks = checks.filter(ch => ch.status === 'portfolio' && new Date(ch.maturityDate).getMonth() === (5 + idx) % 12);

      [...monthInvoices, ...monthChecks].forEach((item: any) => {
        let rate = item.currency === Currency.TRY ? 1 : item.currency === Currency.USD ? mockFXRates[0].rate : mockFXRates[1].rate;
        if (fxShockScenario && item.currency !== Currency.TRY) rate *= 1.1;
        const tryAmount = item.amount * rate;
        if (item.type === 'receivable') currentBalance += tryAmount;
        else currentBalance -= tryAmount;
      });

      const variance = (idx + 1) * 0.05;
      data.push({ date: month, balance: Math.round(currentBalance), low: Math.round(currentBalance * (1 - variance)), high: Math.round(currentBalance * (1 + variance)) });
    });

    return data;
  }, [balances, invoices, checks, lang, fxShockScenario, currentUser]);

  const eventMarkers = useMemo(() => {
    if (currentUser?.isMaster) return [];
    const markers: EventMarker[] = [];
    const months = lang === 'tr' ? ['Haziran', 'Temmuz', 'Ağustos'] : ['June', 'July', 'August'];
    
    // Add Payroll marker
    markers.push({ date: months[0], label: t.payroll, color: '#f59e0b' });

    // Add Tax marker
    markers.push({ date: months[1], label: t.taxes, color: '#6366f1' });

    // Add Large Payment marker for a big invoice
    const hasLargePayment = invoices.some(inv => inv.type === 'payable' && inv.amount > 50000);
    if (hasLargePayment) {
      markers.push({ date: months[2], label: t.largePayment, color: '#ef4444' });
    }

    return markers;
  }, [lang, t, invoices, currentUser]);

  const stats = useMemo(() => {
    if (currentUser?.isMaster) return { companies: companies.length, users: users.length, sessions: 12 };
    const totalCashTry = balances[Currency.TRY] + (balances[Currency.USD] * mockFXRates[0].rate) + (balances[Currency.EUR] * mockFXRates[1].rate);
    const runwayDays = Math.floor(totalCashTry / (15000));
    return { totalCash: totalCashTry, forecast60: projectionData[2]?.balance || totalCashTry, runway: runwayDays, status: runwayDays > 60 ? 'safe' : runwayDays > 30 ? 'watch' : 'danger' };
  }, [balances, projectionData, currentUser, companies, users]);

  useEffect(() => {
    if (currentUser && !currentUser.isMaster && currentUser.permissions.canViewInsights) {
      setLoadingInsights(true);
      generateFinancialInsights({ balances, invoices, checks, fxRates: mockFXRates }).then(res => {
        setInsights(res);
        setLoadingInsights(false);
      });
    }
  }, [currentUser, balances, invoices, checks]);

  if (!currentUser) return <Login users={users} companies={companies} onLogin={setCurrentUser} />;

  const SidebarItem = ({ id, icon: Icon, label, hidden }: { id: string; icon: any; label: string; hidden?: boolean }) => {
    if (hidden) return null;
    return (
      <button onClick={() => { setActiveTab(id); setSidebarOpen(false); }} className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === id ? 'bg-blue-800 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-blue-900/10'}`}>
        <div className="flex items-center gap-4 text-sm"><Icon /><span>{label}</span></div>
      </button>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-midnight text-white' : 'bg-slate-50 text-slate-900'} flex flex-col lg:flex-row transition-colors duration-300`}>
      <aside className={`fixed inset-0 z-50 lg:relative lg:translate-x-0 lg:w-72 bg-blue-950 flex flex-col transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-950 text-2xl">K</div>
            <h1 className="text-xl font-black text-white tracking-tighter">KIRAKI</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-white"><Icons.X /></button>
        </div>
        <nav className="px-4 flex-grow space-y-1 mt-4 overflow-y-auto">
          <SidebarItem id="dashboard" icon={Icons.Layers} label={t.dashboard} />
          <SidebarItem id="ask" icon={Icons.MessageSquare} label={t.askKuraki} hidden={currentUser.isMaster} />
          <SidebarItem id="checks" icon={Icons.Scale} label={t.checks} hidden={currentUser.isMaster} />
          <SidebarItem id="forecast" icon={Icons.TrendingUp} label={t.forecast} hidden={currentUser.isMaster} />
          <SidebarItem id="fxrisk" icon={Icons.DollarSign} label={t.fxRisk} hidden={currentUser.isMaster} />
          <SidebarItem id="insights" icon={Icons.Layers} label={t.insights} hidden={currentUser.isMaster} />
          <SidebarItem id="users" icon={Icons.DollarSign} label={t.users} />
          <SidebarItem id="data" icon={Icons.Upload} label={t.dataCenter} />
        </nav>
        <div className="p-4 border-t border-blue-900/50">
          <div className="flex items-center gap-2 mb-4 px-2">
            <button 
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-white text-[10px] font-black py-2 rounded-xl border border-blue-800 transition-all uppercase tracking-widest"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-blue-900/30 hover:bg-blue-900/50 text-white rounded-xl border border-blue-800 transition-all"
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          <button onClick={() => setCurrentUser(null)} className="w-full flex items-center gap-4 px-6 py-4 text-rose-300 font-bold hover:bg-rose-500/10 rounded-2xl transition-all"><Icons.AlertTriangle /><span>{t.logout}</span></button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col w-full">
        <header className="bg-white/90 dark:bg-cardDark/90 backdrop-blur-md px-8 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800">
          <div className="flex lg:hidden items-center gap-4"><button onClick={() => setSidebarOpen(true)}><Icons.Menu /></button><span className="font-black text-blue-900 ml-2">KIRAKI</span></div>
          <h2 className="hidden lg:block text-lg font-black uppercase tracking-tight">{t[activeTab as keyof typeof t] || activeTab}</h2>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {lang === 'tr' ? 'EN' : 'TR'}
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
              >
                {darkMode ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-white dark:border-slate-600" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase leading-none">{currentUser.name}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">{activeCompany?.name}</span>
               </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {currentUser.isMaster ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard label={t.totalActiveCompanies} value={stats.companies.toString()} subValue={t.allCompanies} />
                    <StatCard label={t.totalSystemUsers} value={stats.users.toString()} subValue={t.allUsers} />
                    <StatCard label={t.activeSessions} value={stats.sessions.toString()} color="text-emerald-500" subValue={t.apiHealth} />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-cardDark p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Icons.TrendingUp /> {t.platformUsage}
                      </h3>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase">{t.storageUsage}</span>
                          <span className="text-xs font-black">1.2 GB / 50 GB</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className="w-[12%] h-full bg-blue-600 rounded-full" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Sistem yükü şu an normal seviyelerde seyrediyor.</p>
                      </div>
                    </div>
                    <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
                       <Icons.Layers />
                       <h4 className="text-xl font-black mt-4">KIRAKI Platform v2.4</h4>
                       <p className="text-xs opacity-70 mt-2">Tüm modüller aktif ve şirket verileri güvenli şekilde şifreleniyor.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatCard label={t.totalCash} value={`₺${(stats.totalCash / 1000).toFixed(0)}k`} subValue={`${balances[Currency.USD].toLocaleString()} USD | ${balances[Currency.EUR].toLocaleString()} EUR`} />
                        <StatCard label={t.forecast60} value={`₺${(stats.forecast60 / 1000).toFixed(0)}k`} trend={stats.forecast60 > stats.totalCash ? 'up' : 'down'} subValue="Banka + Çekler Dahil" />
                        <StatCard label={t.runway} value={`${stats.runway} ${t.days}`} color={stats.status === 'danger' ? 'text-rose-600' : stats.status === 'watch' ? 'text-amber-600' : 'text-emerald-600'} subValue="Nakit Dayanma Süresi" />
                    </div>
                    <div className="bg-white dark:bg-cardDark p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t.financialHealth}</p>
                        <div className="relative w-32 h-32 mb-4 flex items-center justify-center flex-shrink-0 mx-auto">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={276} strokeDashoffset={276 - (276 * (activeCompany?.readinessScore || 0) / 100)} strokeLinecap="round" className="text-blue-600 transition-all duration-1000" />
                          </svg>
                          <span className="absolute font-black text-4xl text-slate-900 dark:text-white">{(activeCompany?.readinessScore || 0)}</span>
                        </div>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">İyi Seviyede</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <MarketPulse t={t} />
                      <div className="bg-white dark:bg-cardDark p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black uppercase tracking-tight">{t.cashForecast}</h3>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                              <button onClick={() => setFxShockScenario(false)} className={`px-4 py-2 rounded-lg text-[10px] font-black ${!fxShockScenario ? 'bg-white shadow text-blue-900' : 'text-slate-400'}`}>NORMAL</button>
                              <button onClick={() => setFxShockScenario(true)} className={`px-4 py-2 rounded-lg text-[10px] font-black ${fxShockScenario ? 'bg-rose-600 text-white shadow' : 'text-slate-400'}`}>ŞOK (+10%)</button>
                            </div>
                          </div>
                          <CashflowChart data={projectionData} events={eventMarkers} />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <InsightsFeed insights={insights} loading={loadingInsights} t={t} />
                      <InvoiceScanner t={t} onInvoiceAdded={(inv) => setInvoices(prev => [inv, ...prev])} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'checks' && !currentUser.isMaster && <CheckManager checks={checks} t={t} onAddCheck={handleAddCheck} />}
          {activeTab === 'ask' && !currentUser.isMaster && <ChatInterface context={{ balances, invoices, checks, fxRates: mockFXRates }} t={t} />}
          {activeTab === 'forecast' && !currentUser.isMaster && <div className="bg-white dark:bg-cardDark p-8 rounded-[2.5rem] shadow-sm"><CashflowChart data={projectionData} events={eventMarkers} /></div>}
          {activeTab === 'fxrisk' && !currentUser.isMaster && <FXAnalyzer usdExposure={{ currency: Currency.USD, nearTerm: 185000, longTerm: 435000 }} eurExposure={{ currency: Currency.EUR, nearTerm: 650000, longTerm: 1200000 }} currentRates={{ USDTRY: 32.5, EURTRY: 35.2 }} />}
          {activeTab === 'insights' && !currentUser.isMaster && <InsightsFeed insights={insights} loading={loadingInsights} t={t} />}
          {activeTab === 'data' && <DataCenter lang={lang} t={t} />}
          {activeTab === 'users' && <UserManagement lang={lang} t={t} currentUserId={currentUser.id} isMaster={!!currentUser.isMaster} companyId={currentUser.companyId} companies={companies} allUsers={users} setAllUsers={setUsers} onLog={logAction} />}
        </main>
      </div>
    </div>
  );
};

export default App;
