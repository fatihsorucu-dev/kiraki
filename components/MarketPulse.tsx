
import React, { useEffect, useState } from 'react';
import { fetchMarketPulse } from '../services/gemini';
import { Icons } from '../constants';

const MarketPulse: React.FC<{ t: any }> = ({ t }) => {
  const [pulse, setPulse] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketPulse().then(res => {
      setPulse(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] animate-pulse">
        <div className="h-4 bg-blue-800 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-blue-800 rounded"></div>
          <div className="h-3 bg-blue-800 rounded w-5/6"></div>
          <div className="h-3 bg-blue-800 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            {t.marketPulse}
          </h3>
          <Icons.TrendingUp />
        </div>
        
        <div className="prose prose-invert prose-sm max-w-none mb-6 opacity-90 font-medium leading-relaxed">
          {pulse?.text.split('\n').map((line, i) => (
            <p key={i} className="mb-2">{line}</p>
          ))}
        </div>

        {pulse?.sources && pulse.sources.length > 0 && (
          <div className="pt-4 border-t border-blue-800">
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-300 mb-2">{t.newsSources}</p>
            <div className="flex flex-wrap gap-2">
              {pulse.sources.map((chunk: any, i: number) => (
                chunk.web && (
                  <a 
                    key={i} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded-lg font-bold transition-colors truncate max-w-[150px]"
                  >
                    {chunk.web.title || 'Kaynak'}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
         <Icons.Layers />
      </div>
    </div>
  );
};

export default MarketPulse;
