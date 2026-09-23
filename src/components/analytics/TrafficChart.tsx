'use client';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AnalyticsTimelineItem } from '@/hooks/useAnalytics';

interface TrafficChartProps {
  data: AnalyticsTimelineItem[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-[#141414] print:bg-gray-50 rounded-2xl border border-[#222222] print:border-gray-100 text-gray-500 print:text-gray-400">
        Nenhum dado de tráfego disponível para o período selecionado.
      </div>
    );
  }

  // Formatador de data para deixar o eixo X mais limpo (Ex: "15 ago")
  const formatDate = (dateStr: string) => {
    // Adiciona timezone de meio-dia fixo para evitar bug de fuso horário pulando 1 dia
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  };

  return (
    <div className="bg-[#141414] print:bg-white p-6 rounded-2xl shadow-sm border border-[#222222] transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] hover:border-[#39FF14] print:shadow-none print:border-gray-300 print:break-inside-avoid">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 print:text-gray-500 mb-6">
        Evolução do Tráfego (Últimos Dias)
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39FF14" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* Linhas horizontais sutis, sem linhas verticais para ficar mais clean */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatDate}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dx={-10}
            />
            
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #333333', 
                boxShadow: '0 0 15px rgba(57,255,20,0.3)',
                padding: '12px',
                backgroundColor: '#0a0a0a',
                color: '#f3f4f6'
              }}
              labelFormatter={(label) => formatDate(label as string)}
            />
            
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px', fontSize: '14px', color: '#9CA3AF', fontWeight: 600 }} 
            />
            
            {/* Pageviews - Area principal Verde Neon brilhante com gradiente */}
            <Area 
              type="monotone" 
              name="Pageviews"
              dataKey="pageviews" 
              stroke="#39FF14" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPageviews)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#39FF14' }}
            />
            
            {/* Visitantes - Linha secundária cinza claro/escuro que aparece bem no preto e no branco */}
            <Line 
              type="monotone" 
              name="Visitantes"
              dataKey="visitors" 
              stroke="#71717a" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#71717a' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
