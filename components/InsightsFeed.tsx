
import React from 'react';
import { Insight } from '../types';
import { Icons } from '../constants';

interface InsightsFeedProps {
  insights: Insight[];
  loading: boolean;
  t: any;
}

const InsightsFeed: React.FC<InsightsFeedProps> = ({ insights, loading, t }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-[2rem]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Icons.Layers />
          Yapay Zeka Karar Desteği
        </h3>
      </div>
      
      {insights.map((insight) => {
        const isHigh = insight.severity === 'high';
        const isMed = insight.severity === 'medium';
        const colorClass = isHigh ? 'bg-rose-50 border-rose-100 text-rose-900 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400' : 
                         isMed ? 'bg-amber-50 border-amber-100 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400' : 
                         'bg-emerald-50 border-emerald-100 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400';
        
        return (
          <div key={insight.id} className={`p-6 rounded-[2rem] border transition-all hover:shadow-lg ${colorClass}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${isHigh ? 'bg-rose-200 dark:bg-rose-900/50' : isMed ? 'bg-amber-200 dark:bg-amber-900/50' : 'bg-emerald-200 dark:bg-emerald-900/50'}`}>
                  {isHigh ? <Icons.AlertTriangle /> : <Icons.TrendingUp />}
                </div>
                <div>
                  <h4 className="font-black text-md mb-2">{insight.title}</h4>
                  <p className="text-sm opacity-80 leading-relaxed font-medium">{insight.content}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                 <button className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-slate-200/50 dark:border-slate-800">
                   Yoksay
                 </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InsightsFeed;
