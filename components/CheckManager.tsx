
import React, { useState } from 'react';
import { Check, Currency } from '../types';
import { Icons } from '../constants';

interface CheckManagerProps {
  checks: Check[];
  t: any;
  onAddCheck: (check: Check) => void;
}

const CheckManager: React.FC<CheckManagerProps> = ({ checks, t, onAddCheck }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryMode, setEntryMode] = useState<'selection' | 'manual' | 'scan'>('selection');
  const [newCheck, setNewCheck] = useState<Partial<Check>>({
    currency: Currency.TRY,
    type: 'receivable',
    status: 'portfolio'
  });

  const receivables = checks.filter(c => c.type === 'receivable');
  const payables = checks.filter(c => c.type === 'payable');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check: Check = {
      id: `manual-${Date.now()}`,
      maturityDate: newCheck.maturityDate || new Date().toISOString().split('T')[0],
      amount: Number(newCheck.amount) || 0,
      currency: newCheck.currency as Currency,
      type: newCheck.type as 'receivable' | 'payable',
      bank: newCheck.bank || 'Bilinmeyen Banka',
      checkNumber: newCheck.checkNumber || '000000',
      counterparty: newCheck.counterparty || 'Bilinmeyen Firma',
      status: 'portfolio'
    };
    onAddCheck(check);
    resetModal();
  };

  const resetModal = () => {
    setShowAddModal(false);
    setEntryMode('selection');
    setNewCheck({ currency: Currency.TRY, type: 'receivable', status: 'portfolio' });
  };

  const Table = ({ items, title, color }: { items: Check[], title: string, color: string }) => (
    <div className="bg-white dark:bg-cardDark p-6 lg:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          {title}
        </h3>
        <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {items.length} Adet
        </span>
      </div>
      <div className="space-y-4">
        {items.map(check => (
          <div key={check.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl group transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10">
            <div>
              <p className="font-black text-sm">{check.counterparty}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{check.bank}</span>
                <span className="text-[10px] text-blue-500 font-black uppercase">{check.maturityDate}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-sm">{check.amount.toLocaleString()} {check.currency}</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">#{check.checkNumber}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-8 text-xs font-bold text-slate-300 uppercase tracking-widest">Kayıt Bulunmuyor</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-blue-950 transition-all"
        >
          <Icons.Plus />
          {t.addCheck}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
        <Table items={receivables} title={t.receivableChecks} color="bg-emerald-500" />
        <Table items={payables} title={t.payableChecks} color="bg-rose-500" />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-md">
          <div className="bg-white dark:bg-cardDark rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">{t.addCheck}</h3>
              <button onClick={resetModal} className="text-slate-400 hover:text-rose-500 transition-colors">
                <Icons.X />
              </button>
            </div>

            <div className="p-8">
              {entryMode === 'selection' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setEntryMode('scan')}
                    className="flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-[2rem] border-2 border-transparent hover:border-blue-900 transition-all group"
                  >
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Icons.Camera />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{t.scanCheck}</span>
                  </button>
                  <button 
                    onClick={() => setEntryMode('manual')}
                    className="flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-[2rem] border-2 border-transparent hover:border-blue-900 transition-all group"
                  >
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Icons.Layers />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{t.enterCheckDetails}</span>
                  </button>
                </div>
              )}

              {entryMode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tip</label>
                      <select 
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                        value={newCheck.type}
                        onChange={e => setNewCheck({...newCheck, type: e.target.value as 'receivable' | 'payable'})}
                      >
                        <option value="receivable">{t.receivableChecks}</option>
                        <option value="payable">{t.payableChecks}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.maturityDate}</label>
                      <input 
                        type="date"
                        required
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                        value={newCheck.maturityDate}
                        onChange={e => setNewCheck({...newCheck, maturityDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.checkAmount}</label>
                      <input 
                        type="number"
                        required
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                        value={newCheck.amount}
                        onChange={e => setNewCheck({...newCheck, amount: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Döviz</label>
                      <select 
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                        value={newCheck.currency}
                        onChange={e => setNewCheck({...newCheck, currency: e.target.value as Currency})}
                      >
                        {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.bankName}</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                        value={newCheck.bank}
                        onChange={e => setNewCheck({...newCheck, bank: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.checkNumber}</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                        value={newCheck.checkNumber}
                        onChange={e => setNewCheck({...newCheck, checkNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.counterpartyName}</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-900 outline-none font-bold text-sm"
                      value={newCheck.counterparty}
                      onChange={e => setNewCheck({...newCheck, counterparty: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setEntryMode('selection')}
                      className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:text-slate-600 transition-all"
                    >
                      {t.cancel}
                    </button>
                    <button 
                      type="submit"
                      className="flex-2 py-4 px-10 bg-blue-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-950 transition-all"
                    >
                      {t.save}
                    </button>
                  </div>
                </form>
              )}

              {entryMode === 'scan' && (
                <div className="flex flex-col items-center justify-center space-y-6 py-10">
                  <div className="w-24 h-24 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center animate-pulse">
                    <Icons.Camera />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest mb-2">Çek Taraması</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">AI VISION ile otomatik çek verisi çıkarma yakında burada olacak.</p>
                  </div>
                  <button 
                    onClick={() => setEntryMode('selection')}
                    className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 font-black text-[10px] uppercase rounded-2xl hover:text-slate-600"
                  >
                    Geri Dön
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckManager;
