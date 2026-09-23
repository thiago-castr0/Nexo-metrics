import { useState, useEffect } from 'react';

export interface AnalyticsTimelineItem {
  date: string;
  visitors: number;
  pageviews: number;
}

export interface AnalyticsData {
  summary: {
    visitors: number;
    pageviews: number;
    bounceRate: number;
  };
  timeline: AnalyticsTimelineItem[];
  routes: Array<{ route: string; visitors: number; pageviews: number }>;
  referrers: Array<{ referrerHostname: string; visitors: number; pageviews: number }>;
  countries: Array<{ country: string; visitors: number; pageviews: number }>;
  devices: Array<{ deviceType: string; visitors: number; pageviews: number }>;
  os: Array<{ osName: string; visitors: number; pageviews: number }>;
  browsers: Array<{ browserName: string; visitors: number; pageviews: number }>;
  utmSources: Array<{ utmSource: string; visitors: number; pageviews: number }>;
}

export type DateRange = '1w' | '1m' | 'all';

export function useAnalytics(projectId: string | null) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>('1w');

  useEffect(() => {
    async function fetchAnalytics() {
      if (!projectId) {
        setData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          projectId,
          range: dateRange,
        });

        const response = await fetch(`/api/analytics?${queryParams.toString()}`);
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao processar as métricas.');
        }

        const json = await response.json();
        
        setData(json.data || null);

      } catch (err: any) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [projectId, dateRange]); 

  return {
    data,
    loading,
    error,
    dateRange,
    setDateRange
  };
}
