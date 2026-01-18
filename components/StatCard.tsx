
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, trend, color = 'text-slate-900 dark:text-white' }) => {
  return (
    <div className="bg-white dark:bg-cardDark p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 w-full">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
      <h3 className={`text-xl lg:text-2xl font-black ${color} truncate`}>{value}</h3>
      {subValue && (
        <div className="flex flex-wrap items-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 gap-1 lg:gap-2">
          {trend && (
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 ${trend === 'up' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'}`}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
          <span className="text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-full">
            {subValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
