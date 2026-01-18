
import React, { useState } from 'react';
import { Currency } from '../types';
import { Icons } from '../constants';

interface ExposureDetails {
  currency: Currency;
  nearTerm: number; // 30-day
  longTerm: number; // 90+ day
}

interface FXAnalyzerProps {
  usdExposure: ExposureDetails;
  eurExposure: ExposureDetails;
  currentRates: { USDTRY: number; EURTRY: number };
  isReadOnly?: boolean;
}

const FXAnalyzer: React.FC<FXAnalyzerProps> = ({ usdExposure, eurExposure, currentRates, isReadOnly = false }) => {
  const [usdShock, setUsdShock] = useState(0);
  const [eurShock, setEurShock] = useState(0);

  const calculateTotalExposure = (details: ExposureDetails, rate: number) => {
    return (details.nearTerm + details.longTerm) * rate;
  };

  const calculateImpact = () => {
    const usdTotal = (usdExposure.nearTerm + usdExposure.longTerm) * currentRates.USDTRY;
    const eurTotal = (eurExposure.nearTerm + eurExposure.longTerm) * currentRates.EURTRY;
    const usdImpact = usdTotal * (usdShock / 100);
    const eurImpact = eurTotal * (eurShock / 100);
    return usdImpact + eurImpact;
  };

  const totalImpact = calculateImpact();

  const handleEntityClick = (currency: Currency) => {
    const label = currency === Currency.USD ? 'Müşteriler' : 'Tedarikçiler';
    alert(`${label} listesi ve filtreleme modülü yakında eklenecektir.`);
  };

  const ExposureCard = ({ details, rate, shock }: { details: ExposureDetails, rate: number, shock: number }) => {
    const totalTry = calculateTotalExposure(details, rate);
    const nearTermTry = details.nearTerm * rate;
    const longTermTry = details.longTerm * rate;
    const totalAmount = details.nearTerm + details.longTerm;
    
    const nearPercent = (details.nearTerm / totalAmount) * 100;
    const longPercent = (details.longTerm / totalAmount) * 100;

    const currencySymbol = details.currency === Currency.USD ? '$' : '€';
    const isUSD = details.currency === Currency.USD;

    return (
      <div className="bg-white dark:bg-cardDark p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{details.currency} Toplam Pozisyon</span>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
              <span className="text-sm font-bold opacity-40">₺</span>
              {totalTry.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h4>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Döviz Bakiyesi</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {currencySymbol}{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
            <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Yakın Vade (30 G)</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{currencySymbol}{details.nearTerm.toLocaleString()}</p>
            <p className="text-[9px] font-bold text-slate-400 mt-1">₺{nearTermTry.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
            <p className="text-[9px] font-black text-blue-900 dark:text-blue-300 uppercase mb-1">Uzun Vade (90+ G)</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{currencySymbol}{details.longTerm.toLocaleString()}</p>
            <p className="text-[9px] font-bold text-slate-400 mt-1">₺{longTermTry.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Stacked Bar Visual */}
        <div className="space-y-3 mt-2">
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${nearPercent}%` }} 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000 ease-out relative group/bar"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
            <div 
              style={{ width: `${longPercent}%` }} 
              className="h-full bg-gradient-to-r from-blue-800 to-blue-950 dark:from-blue-600 dark:to-blue-800 transition-all duration-1000 ease-out relative group/bar"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Yakın %{Math.round(nearPercent)}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Uzak %{Math.round(longPercent)}</span>
               <div className="w-2 h-2 rounded-full bg-blue-900 dark:bg-blue-600" />
            </div>
          </div>
        </div>

        {/* New Entity Navigation Buttons */}
        <button 
          onClick={() => handleEntityClick(details.currency)}
          className="mt-2 w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-all group"
        >
          <div className="group-hover:scale-110 transition-transform">
            <Icons.UserGroup />
          </div>
          {isUSD ? 'MÜŞTERİLERİ GÖRÜNTÜLE' : 'TEDARİKÇİLERİ GÖRÜNTÜLE'}
        </button>

        {shock !== 0 && (
          <div className={`p-4 rounded-2xl text-[11px] font-black border animate-in slide-in-from-top-2 duration-300 ${shock > 0 ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-600'}`}>
            <div className="flex justify-between items-center">
              <span className="uppercase tracking-widest">{shock > 0 ? 'OLASI ZARAR' : 'KUR KAZANCI'}</span>
              <span>{shock > 0 ? '-' : '+'} ₺{Math.abs(totalTry * (shock / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExposureCard details={usdExposure} rate={currentRates.USDTRY} shock={usdShock} />
        <ExposureCard details={eurExposure} rate={currentRates.EURTRY} shock={eurShock} />
      </div>

      <div className={`bg-white dark:bg-cardDark p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative ${isReadOnly ? 'opacity-75' : ''}`}>
        {isReadOnly && (
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 z-10 flex items-center justify-center rounded-[2.5rem] backdrop-blur-[1px]">
            <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Sadece İzleme Modu
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Döviz Senaryo Simülatörü</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[9px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Canlı Simülasyon</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">USD Kuru Değişimi (%)</label>
                <span className={`text-sm font-black px-3 py-1 rounded-lg ${usdShock > 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : usdShock < 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400'}`}>
                  {usdShock > 0 ? '+' : ''}{usdShock}%
                </span>
              </div>
              <input 
                type="range" 
                min="-20" 
                max="20" 
                step="1"
                disabled={isReadOnly}
                value={usdShock}
                onChange={(e) => setUsdShock(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-900 dark:accent-blue-400 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                <span>Düşüş</span>
                <span>Normal</span>
                <span>Yükseliş</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EUR Kuru Değişimi (%)</label>
                <span className={`text-sm font-black px-3 py-1 rounded-lg ${eurShock > 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : eurShock < 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400'}`}>
                  {eurShock > 0 ? '+' : ''}{eurShock}%
                </span>
              </div>
              <input 
                type="range" 
                min="-20" 
                max="20" 
                step="1"
                disabled={isReadOnly}
                value={eurShock}
                onChange={(e) => setEurShock(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-900 dark:accent-blue-400 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                <span>Düşüş</span>
                <span>Normal</span>
                <span>Yükseliş</span>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-center shadow-inner ${totalImpact > 0 ? 'bg-rose-50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/50' : totalImpact < 0 ? 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 text-center md:text-left">Net Senaryo Etkisi (TRY)</p>
            <h4 className={`text-5xl font-black text-center md:text-left tracking-tighter ${totalImpact > 0 ? 'text-rose-600' : totalImpact < 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
              {totalImpact > 0 ? '-' : totalImpact < 0 ? '+' : ''}
              ₺{Math.abs(totalImpact).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h4>
            <div className="mt-6 flex flex-col gap-2 items-center md:items-start">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${totalImpact > 0 ? 'bg-rose-200 text-rose-700' : totalImpact < 0 ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                {totalImpact > 0 ? 'KRİTİK NAKİT ETKİSİ' : totalImpact < 0 ? 'POZİTİF KUR KAZANCI' : 'SENARYO SEÇİN'}
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center md:text-left leading-relaxed">
                {totalImpact !== 0 
                  ? "Bu etki nakit akışı tahminlerinize otomatik olarak yansıtılacaktır."
                  : "Döviz kurlarındaki değişimlerin şirketinize etkisini görmek için kaydırıcıları kullanın."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FXAnalyzer;
