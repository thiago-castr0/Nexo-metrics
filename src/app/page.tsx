'use client';

import { useProjects } from '@/hooks/useProjects';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ProjectSelector } from '@/components/analytics/ProjectSelector';
import { MetricCard } from '@/components/analytics/MetricCard';
import { TrafficChart } from '@/components/analytics/TrafficChart';
import { DataList } from '@/components/analytics/DataList';
import { DetailsModal } from '@/components/analytics/DetailsModal';
import { Printer, Users, MousePointerClick, Activity, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Dashboard() {
  const { projects, selectedProjectId, setSelectedProjectId, loading: projectsLoading } = useProjects();
  const { data: analyticsData, loading: analyticsLoading, dateRange, setDateRange } = useAnalytics(selectedProjectId);

  // Estado do Modal de Detalhes
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; filterBy: string; filterValue: string } | null>(null);

  const handleRowClick = (label: string, title: string) => {
    // Mapeamento simples do título para a chave da API da Vercel
    const filterMap: Record<string, string> = {
      'Páginas': 'route',
      'Referências': 'referrerHostname',
      'Países': 'country',
      'Cidades': 'city',
      'Regiões': 'region',
      'Sistemas Operacionais': 'osName',
      'Navegadores': 'browserName',
      'Dispositivos': 'deviceType',
      'Origens (UTM)': 'utmSource'
    };

    const filterBy = filterMap[title];
    if (filterBy) {
      setModalConfig({ title, filterBy, filterValue: label });
      setModalOpen(true);
    }
  };

  // Ação Nativa de Impressão 
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 print:bg-white print:text-black">
      {/* TOPBAR */}
      <nav className="w-full h-[50px] bg-[#454545] border-b border-[#555555] px-6 md:px-10 flex items-center justify-between print:hidden shadow-md">
        <div className="flex items-center">
          <Image src="/Imagens/logo 1.png" alt="Nexo Metrics" width={220} height={48} className="object-contain" />
        </div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-100 group-hover:text-[#39FF14] transition-colors leading-tight">Admin User</p>
            <p className="text-xs text-gray-400 leading-tight">admin@nexometrics.com</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#555] flex items-center justify-center border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.2)] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] transition-all">
             <span className="text-[#39FF14] font-bold text-lg">A</span>
          </div>
        </div>
      </nav>

      <main className="p-6 md:p-10 w-full max-w-[1600px] mx-auto flex flex-col gap-8 print:p-0">
      
      {/* HEADER E CONTROLES */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Geral</h1>
          <p className="text-gray-400 mt-2">Acompanhe a performance dos seus projetos em tempo real.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <ProjectSelector 
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelect={setSelectedProjectId}
            loading={projectsLoading}
          />
          
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as '1w' | '1m' | 'all')}
            className="appearance-none bg-[#141414] border border-[#222222] text-gray-200 text-sm font-medium rounded-lg py-2.5 px-4 shadow-sm cursor-pointer hover:border-[#39FF14] transition-all focus:ring-2 focus:ring-[#39FF14] outline-none"
          >
            <option value="1w">Uma semana</option>
            <option value="1m">Um mês</option>
            <option value="all">Total (Até hoje)</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-black text-[#39FF14] border border-[#39FF14] hover:bg-[#39FF14] hover:text-black px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-[0_0_10px_rgba(57,255,20,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
          >
            <Printer className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </header>

      {/* TÍTULO EXCLUSIVO PARA IMPRESSÃO */}
      <div className="hidden print:block mb-6">
        <div className="border-b border-gray-300 pb-4 mb-4 flex flex-col gap-2">
          <Image src="/Imagens/logo 1.png" alt="Nexo Metrics" width={180} height={40} className="object-contain" />
          <h1 className="text-3xl font-extrabold text-black mt-2">
            Relatório de Tráfego Web
          </h1>
        </div>
        {selectedProjectId && (
          <div className="mt-4 text-gray-700 text-lg flex flex-col gap-1">
            <p>Projeto: <strong className="text-black">{projects.find(p => p.id === selectedProjectId)?.name || 'Desconhecido'}</strong></p>
            <p>Período: <strong className="text-black">
              {dateRange === '1w' ? 'Última semana' : 
               dateRange === '1m' ? 'Último mês' : 
               'Total (Até hoje)'}
            </strong></p>
          </div>
        )}
      </div>

      {/* NEXO INSIGHTS */}
      <div className="bg-[#141414] border border-[#222222] rounded-2xl p-5 shadow-sm hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] hover:border-[#39FF14] transition-all duration-300 print:hidden flex items-start gap-4">
        <div className="p-3 bg-black rounded-xl shrink-0 border border-[#333] shadow-[0_0_10px_rgba(57,255,20,0.3)]">
          <Sparkles className="w-6 h-6 text-[#39FF14]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Nexo Insights
            <span className="text-[10px] bg-[#39FF14]/20 text-[#39FF14] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">IA</span>
          </h2>
          <p className="text-gray-400 mt-1 leading-relaxed">
            O tráfego aumentou <strong className="text-[#39FF14] bg-black px-1.5 rounded">15%</strong> esta semana. A maior origem de novos visitantes foi o <strong className="text-white">Google orgânico</strong>, principalmente de dispositivos <strong className="text-white">Mobile</strong> no Brasil.
          </p>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
        <MetricCard 
          title="Visitantes Únicos" 
          value={analyticsData?.summary?.visitors || 0}
          icon={<Users className="w-5 h-5" />}
          loading={analyticsLoading}
          trend={{ value: 12, label: 'vs última semana' }}
        />
        <MetricCard 
          title="Pageviews" 
          value={analyticsData?.summary?.pageviews || 0}
          icon={<MousePointerClick className="w-5 h-5" />}
          loading={analyticsLoading}
          trend={{ value: 15, label: 'vs última semana' }}
        />
        <MetricCard 
          title="Taxa de Rejeição" 
          value={`${analyticsData?.summary?.bounceRate || 0}%`}
          icon={<Activity className="w-5 h-5" />}
          loading={analyticsLoading}
          trend={{ value: -5, label: 'vs última semana' }}
        />
      </div>

      {/* GRÁFICO */}
      <section className="mt-2 print:mt-6">
        <TrafficChart data={analyticsData?.timeline || []} />
      </section>

      {/* LISTAS DE DADOS */}
      {/* LISTAS DE DADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:mt-6 print:grid-cols-3">
        <DataList 
          title="Páginas" 
          items={(analyticsData?.routes || []).map(r => ({ label: r.route, visitors: r.visitors }))}
          onClickRow={handleRowClick}
        />
        <DataList 
          title="Referências" 
          items={(analyticsData?.referrers || []).map(r => ({ label: r.referrerHostname, visitors: r.visitors }))}
          onClickRow={handleRowClick}
        />
        <DataList 
          title="Países" 
          items={(analyticsData?.countries || []).map(c => ({ label: c.country, visitors: c.visitors }))}
          totalVisitors={analyticsData?.summary?.visitors}
          onClickRow={handleRowClick}
        />
        <DataList 
          title="Sistemas Operacionais" 
          items={(analyticsData?.os || []).map(o => ({ label: o.osName, visitors: o.visitors }))}
          totalVisitors={analyticsData?.summary?.visitors}
          onClickRow={handleRowClick}
        />
        <DataList 
          title="Navegadores" 
          items={(analyticsData?.browsers || []).map(b => ({ label: b.browserName, visitors: b.visitors }))}
          totalVisitors={analyticsData?.summary?.visitors}
          onClickRow={handleRowClick}
        />
        <DataList 
          title="Dispositivos" 
          items={(analyticsData?.devices || []).map(d => ({ label: d.deviceType, visitors: d.visitors }))}
          totalVisitors={analyticsData?.summary?.visitors}
          onClickRow={handleRowClick}
        />
        <div className="md:col-span-2 lg:col-span-3">
          <DataList 
            title="Origens (UTM)" 
            items={(analyticsData?.utmSources?.length ? analyticsData.utmSources : [
              { utmSource: 'instagram (demo)', visitors: 1420, pageviews: 0 },
              { utmSource: 'promo_inverno (demo)', visitors: 850, pageviews: 0 },
              { utmSource: 'newsletter (demo)', visitors: 340, pageviews: 0 }
            ]).map(u => ({ label: u.utmSource, visitors: u.visitors || 0 }))}
            onClickRow={handleRowClick}
          />
        </div>
      </div>

      {modalConfig && (
        <DetailsModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalConfig.title}
          filterBy={modalConfig.filterBy}
          filterValue={modalConfig.filterValue}
          projectId={selectedProjectId}
          dateRange={dateRange}
        />
      )}
    </main>
    </div>
  );
}
