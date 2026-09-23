import { NextResponse } from 'next/server';
import { fetchVercelAPI } from '@/lib/vercelApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const range = searchParams.get('range');
    const filterBy = searchParams.get('filterBy');
    const filterValue = searchParams.get('filterValue');

    if (!projectId || !filterBy || !filterValue) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios ausentes.' },
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
      [filterBy]: filterValue,
    });

    if (sinceDate) {
      baseParams.append('since', sinceDate.toISOString());
      baseParams.append('until', untilDate.toISOString());
    }

    const baseQuery = baseParams.toString();

    // Cruzando com as principais dimensões: navegadores, SO, devices, países e rotas
    const [
      browsersRes,
      osRes,
      devicesRes,
      countriesRes,
      routesRes
    ] = await Promise.all([
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=browserName`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=osName`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=deviceType`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=country`).catch(() => null),
      fetchVercelAPI(`/v1/query/web-analytics/visits/aggregate?${baseQuery}&by=route`).catch(() => null),
    ]);

    return NextResponse.json({
      data: {
        browsers: browsersRes?.data || [],
        os: osRes?.data || [],
        devices: devicesRes?.data || [],
        countries: countriesRes?.data || [],
        routes: routesRes?.data || [],
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API Analytics Details Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar detalhes.' },
      { status: 500 }
    );
  }
}
