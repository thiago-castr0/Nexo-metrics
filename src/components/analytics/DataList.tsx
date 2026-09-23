import React from 'react';
import { FaWindows, FaApple, FaAndroid, FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { SiVercel } from 'react-icons/si';
import { Monitor, Smartphone } from 'lucide-react';

export interface DataListItem {
  label: string;
  visitors: number;
}

interface DataListProps {
  title: string;
  items: DataListItem[];
  totalVisitors?: number; // Usado para calcular a % absoluta se necessário
  onClickRow?: (label: string, title: string) => void;
}

function getLabelIcon(title: string, label: string) {
  const l = label.toLowerCase();
  
  if (title === 'Países') {
    if (!label || label.length !== 2) return null;
    return (
      <img 
        src={`https://flagcdn.com/w20/${label.toLowerCase()}.png`} 
        srcSet={`https://flagcdn.com/w40/${label.toLowerCase()}.png 2x`}
        width="16" 
        alt={label}
        className="w-4 h-3 object-cover rounded-[2px] shadow-sm flex-shrink-0"
      />
    );
  }

  if (title === 'Sistemas Operacionais') {
    if (l.includes('windows')) return <FaWindows className="w-3.5 h-3.5 text-[#0078D6]" />;
    if (l.includes('ios') || l.includes('mac')) return <FaApple className="w-3.5 h-3.5 text-gray-800" />;
    if (l.includes('android')) return <FaAndroid className="w-3.5 h-3.5 text-[#3DDC84]" />;
  }
  
  if (title === 'Navegadores') {
    if (l.includes('chrome')) return <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" className="w-3.5 h-3.5" alt="Chrome" />;
    if (l.includes('safari')) return <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" className="w-3.5 h-3.5" alt="Safari" />;
    if (l.includes('edge')) return <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" className="w-3.5 h-3.5" alt="Edge" />;
    if (l.includes('firefox')) return <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" className="w-3.5 h-3.5" alt="Firefox" />;
    if (l.includes('opera')) return <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png" className="w-3.5 h-3.5" alt="Opera" />;
  }

  if (title === 'Referências') {
    if (l.includes('google')) return <FcGoogle className="w-3.5 h-3.5" />;
    if (l.includes('vercel')) return <SiVercel className="w-3.5 h-3.5 text-black" />;
    if (l.includes('github')) return <FaGithub className="w-3.5 h-3.5 text-gray-800" />;
    if (l.includes('twitter') || l === 't.co') return <FaTwitter className="w-3.5 h-3.5 text-[#1DA1F2]" />;
    if (l.includes('facebook')) return <FaFacebook className="w-3.5 h-3.5 text-[#1877F2]" />;
  }

  if (title === 'Dispositivos') {
    if (l === 'mobile') return <Smartphone className="w-3.5 h-3.5 text-gray-600" />;
    if (l === 'desktop') return <Monitor className="w-3.5 h-3.5 text-gray-600" />;
  }

  return null;
}

function formatLabel(title: string, label: string) {
  if (title === 'Dispositivos') {
    if (label.toLowerCase() === 'mobile') return 'Mobile';
    if (label.toLowerCase() === 'desktop') return 'Desktop';
  }
  
  return label;
}

export function DataList({ title, items, totalVisitors, onClickRow }: DataListProps) {
  // O maior valor de visitantes define 100% do comprimento visual da barra
  const maxVisitors = items.length > 0 ? Math.max(...items.map((i) => i.visitors)) : 0;

  return (
    <div className="bg-[#141414] print:bg-white rounded-2xl border border-[#222222] print:border-gray-100 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] hover:border-[#39FF14] print:shadow-none print:border-gray-300 print:break-inside-avoid flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-[#222222] print:border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <h3>{title}</h3>
        <span>Visitantes</span>
      </div>
      
      <div className="p-4 flex-1">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500 py-6 text-center flex items-center justify-center h-full">
            Nenhum dado registrado
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {items.map((item, index) => {
              let label = item.label || '/';
              
              const icon = getLabelIcon(title, label);
              const formattedLabel = formatLabel(title, label);

              const percentage = maxVisitors > 0 ? (item.visitors / maxVisitors) * 100 : 0;
              const absolutePercentage = totalVisitors && totalVisitors > 0 
                ? Math.round((item.visitors / totalVisitors) * 100) 
                : null;
                
              const hasIconOrFlag = !!icon || title === 'Países';

              return (
                <div 
                  key={index} 
                  onClick={() => onClickRow && onClickRow(item.label, title)}
                  className={`relative group flex items-center justify-between text-sm py-1.5 z-10 px-2 rounded transition-colors ${onClickRow ? 'cursor-pointer hover:bg-[#1a1a1a] print:hover:bg-gray-50' : 'hover:bg-[#1a1a1a] print:hover:bg-gray-50'}`}
                >
                  {/* Barra de progresso ao fundo com borda super fina via CSS inline */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#0a0a0a] rounded -z-10 transition-all print:hidden"
                    style={{ 
                      width: `${percentage}%`, 
                      border: '0.1px solid rgba(57, 255, 20, 0.3)'
                    }}
                  ></div>
                  
                  <div className="flex items-center gap-2 max-w-[70%] z-10">
                    {icon}
                    <span className={`truncate font-medium text-gray-200 print:text-gray-800 ${title === 'Países' ? 'text-[10px]' : (hasIconOrFlag ? 'text-xs' : 'text-sm')}`}>
                      {formattedLabel}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 z-10 text-right">
                    {absolutePercentage !== null && (
                      <span className="text-gray-500 print:text-gray-400 text-xs w-8">
                        {absolutePercentage}%
                      </span>
                    )}
                    <span className="font-bold text-white print:text-gray-900 w-8">
                      {item.visitors.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
