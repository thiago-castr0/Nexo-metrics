'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Monitor, Smartphone, Globe, Activity, Navigation2 } from 'lucide-react';
import { DateRange } from '@/hooks/useAnalytics';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; 
  filterBy: string; // ex: 'referrerHostname'
  filterValue: string; // ex: 'google.com'
  projectId: string | null;
  dateRange: DateRange;
}

export function DetailsModal({
  isOpen,
  onClose,
  title,
  filterBy,
  filterValue,
  projectId,
  dateRange
}: DetailsModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectId && filterBy && filterValue) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const queryParams = new URLSearchParams({
            projectId,
            range: dateRange,
            filterBy,
            filterValue,
          });

          const response = await fetch(`/api/analytics/details?${queryParams.toString()}`);
          
          if (!response.ok) {
            throw new Error('Falha ao carregar detalhes.');
          }

          const json = await response.json();
          setData(json.data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setData(null);
    }
  }, [isOpen, projectId, filterBy, filterValue, dateRange]);

  if (!isOpen) return null;

  const renderMiniTable = (icon: any, tableTitle: string, items: any[], keyField: string) => {
    if (!items || items.length === 0) return null;
    
    // Calcula total para porcentagem
    const total = items.reduce((acc, curr) => acc + (curr.visitors || 0), 0);

    return (
      <div className="bg-[#141414] border border-[#222222] rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3">
          {icon}
          {tableTitle}
        </h3>
        <div className="flex flex-col gap-2">
          {items.slice(0, 5).map((item, idx) => {
            const perc = total > 0 ? Math.round((item.visitors / total) * 100) : 0;
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 truncate max-w-[60%]">{item[keyField] || 'Desconhecido'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-8 text-right">{perc}%</span>
                  <span className="text-white font-medium">{item.visitors}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-[#222222] bg-[#141414]">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Filtrando por: {title}</p>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#39FF14]">{filterValue}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#222222] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#39FF14]" />
              <p>Cruzando métricas...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48 text-red-400">
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderMiniTable(<Monitor className="w-4 h-4 text-[#39FF14]" />, 'Sistemas Operacionais', data.os, 'osName')}
              {renderMiniTable(<Globe className="w-4 h-4 text-[#39FF14]" />, 'Navegadores', data.browsers, 'browserName')}
              {renderMiniTable(<Smartphone className="w-4 h-4 text-[#39FF14]" />, 'Dispositivos', data.devices, 'deviceType')}
              {renderMiniTable(<Navigation2 className="w-4 h-4 text-[#39FF14]" />, 'Páginas Acessadas', data.routes, 'route')}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              Nenhum dado encontrado para esse filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
