
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

interface DataPoint {
  date: string;
  balance: number;
  low?: number;
  high?: number;
}

export interface EventMarker {
  date: string;
  label: string;
  color: string;
}

const CashflowChart: React.FC<{ data: DataPoint[], events?: EventMarker[] }> = ({ data, events = [] }) => {
  const formatCurrency = (val: number) => `₺${(val / 1000).toFixed(0)}k`;

  return (
    <div className="h-64 lg:h-80 w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 30, right: 30, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
              padding: '12px', 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)'
            }}
            itemStyle={{ fontWeight: 800, fontSize: '10px' }}
            labelStyle={{ fontWeight: 900, marginBottom: '4px', color: '#1e293b', fontSize: '12px' }}
            formatter={(value: number) => [`₺${value.toLocaleString()}`, 'Bakiye']}
          />
          
          <Area type="monotone" dataKey="high" stroke="none" fill="url(#colorRange)" connectNulls />
          <Area type="monotone" dataKey="low" stroke="none" fill="#f8fafc" connectNulls />

          {events.map((ev, idx) => (
            <ReferenceLine 
              key={idx} 
              x={ev.date} 
              stroke={ev.color} 
              strokeDasharray="6 6" 
              strokeWidth={2}
            >
              <Label 
                value={ev.label} 
                position="top" 
                fill={ev.color} 
                fontSize={9} 
                fontWeight={900}
                className="uppercase tracking-widest"
                offset={10}
              />
            </ReferenceLine>
          ))}

          <Area type="monotone" dataKey="balance" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashflowChart;
