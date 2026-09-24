import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  loading?: boolean;
  trend?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ title, value, icon, loading, trend }: MetricCardProps) {
  return (
    <div className="bg-[#141414] print:bg-white p-6 print:p-4 rounded-2xl shadow-sm border border-[#222222] print:border-gray-300 flex flex-col gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] hover:border-[#39FF14] print:shadow-none print:break-inside-avoid group">
      <div className="flex items-center gap-2 text-gray-400 print:text-gray-500">
        <div className="p-2 bg-black border border-[#333] print:border-none text-[#39FF14] rounded-lg transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(57,255,20,0.5)] print:bg-transparent print:text-black print:p-0">
          {icon}
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="flex items-end justify-between mt-1 min-h-[40px]">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 print:text-gray-300" />
        ) : (
          <>
            <span className="text-4xl font-extrabold text-white print:text-gray-900 tracking-tight">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </span>
            {trend && (
              <div className={`text-xs font-semibold ${trend.value >= 0 ? 'text-[#39FF14]' : 'text-red-500'} flex items-center mb-1`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}% <span className="text-gray-500 print:text-gray-400 font-normal ml-1 hidden sm:inline">{trend.label}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
