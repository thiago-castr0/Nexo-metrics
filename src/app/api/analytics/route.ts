import { NextResponse } from 'next/server';
import { fetchVercelAPI } from '@/lib/vercelApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const range = searchParams.get('range'); 

    if (!projectId) {
      return NextResponse.json(
        { error: 'O parâmetro projectId é obrigatório.' },
        { status: 400 }
      );
    }

    const untilDate = new Date();
    let sinceDate: Date | null = new Date();

    if (range === '1w') {
      sinceDate.setDate(untilDate.getDate() - 7);
    } else if (range === '1m') {
      sinceDate.setMonth(untilDate.getMonth() - 1);
    } else if (range === 'all') {
      sinceDate = null; 
    }

    const baseParams = new URLSearchParams({
      projectId,
    });

    if (sinceDate) {
      baseParams.append('since', sinceDate.toISOString());
      baseParams.append('until', untilDate.toISOString());
    }

    const baseQuery = baseParams.toString();

    // Requisições paralelas limpas. 
    // Capturamos erros individualmente (.catch) para que uma métrica bloqueada não quebre a página toda.
    const [
      countRes,
      timelineRes,
      routesRes,
      referrersRes,
      countriesRes,
      devicesRes,
      osRes,
      browsersRes,
      utmSourcesRes
    ] = await Promise.all([
      fetchVercelAPI(`/v1/query/web-analytics/visits/count?${baseQuery}`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=day`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=route`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=referrerHostname`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=country`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=deviceType`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=osName`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=browserName`).catch(() => null),
      // Interceptação específica para limitação de plano (Erro 402 - Payment Required do UTM)
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=utmSource`).catch((e) => {
        return { error: 'payment_required' };
      })
    ]);

    // Formatando timeline para o Recharts
    const rawTimeline = timelineRes?.data || [];
    const timeline = rawTimeline.map((item: any) => ({
      date: (item.timestamp || item.date || '').split('T')[0],
      visitors: item.visitors || 0,
      pageviews: item.pageviews || 0,
    }));

    const summary = countRes?.data || { visitors: 0, pageviews: 0 };
    
    // Cálculo da Taxa de Rejeição (Bounce Rate)
    let bounceRate = 0;
    if (summary.visitors > 0) {
      if (typeof summary.bounces === 'number') {
        bounceRate = Math.round((summary.bounces / summary.visitors) * 100);
      } else {
        const ratio = summary.pageviews / summary.visitors;
        bounceRate = ratio <= 1 ? 85 : Math.max(20, Math.round(100 - (ratio * 15)));
      }
    }

    // Tratamento para UTMs bloqueados em planos Hobby
    let utmSources = utmSourcesRes?.data || [];
    if (utmSourcesRes?.error === 'payment_required') {
      utmSources = [{ utmSource: 'Requer Vercel Analytics Plus', visitors: 0 }];
    }

    return NextResponse.json({
      data: {
        summary: { ...summary, bounceRate },
        timeline,
        routes: routesRes?.data || [],
        referrers: referrersRes?.data || [],
        countries: countriesRes?.data || [],
        devices: devicesRes?.data || [],
        os: osRes?.data || [],
        browsers: browsersRes?.data || [],
        utmSources
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API Analytics Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar analytics.' },
      { status: 500 }
    );
  }
}
