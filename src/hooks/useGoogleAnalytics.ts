import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GADateRange {
  startDate: string;
  endDate: string;
}

interface GADataRequest {
  dateRange?: GADateRange;
  metrics?: string[];
  dimensions?: string[];
}

interface GADataResponse {
  reports?: Array<{
    dimensionHeaders: Array<{ name: string }>;
    metricHeaders: Array<{ name: string; type: string }>;
    rows: Array<{
      dimensionValues: Array<{ value: string }>;
      metricValues: Array<{ value: string }>;
    }>;
    metadata?: {
      currencyCode?: string;
    };
  }>;
  error?: string;
}

export const useGoogleAnalytics = (request?: GADataRequest) => {
  const [data, setData] = useState<GADataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGAData = async () => {
    if (!request) return;

    setLoading(true);
    setError(null);

    try {
      // Build query parameters from request
      const params = new URLSearchParams();
      if (request.dateRange) {
        params.append('startDate', request.dateRange.startDate);
        params.append('endDate', request.dateRange.endDate);
      }
      if (request.metrics && request.metrics.length > 0) {
        params.append('metrics', request.metrics.join(','));
      }
      if (request.dimensions && request.dimensions.length > 0) {
        params.append('dimensions', request.dimensions.join(','));
      }

      const { data: result, error: supabaseError } = await supabase.functions.invoke('google-analytics-data?' + params.toString());

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setData(result as GADataResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Google Analytics data');
      console.error('GA Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGAData();
  }, [request?.dateRange?.startDate, request?.dateRange?.endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchGAData,
  };
};

// Helper functions to parse GA4 response data
export const parseGAMetrics = (gaData: GADataResponse | null, metricName: string): number => {
  if (!gaData?.reports?.[0]) return 0;

  const report = gaData.reports[0];
  const metricIndex = report.metricHeaders.findIndex(header => header.name === metricName);

  if (metricIndex === -1) return 0;

  // Sum all rows for this metric
  return report.rows.reduce((sum, row) => {
    const value = parseFloat(row.metricValues[metricIndex]?.value || '0');
    return sum + value;
  }, 0);
};

export const parseGADimensions = (gaData: GADataResponse | null, dimensionName: string): Array<{ dimension: string; value: number; metric?: string }> => {
  if (!gaData?.reports?.[0]) return [];

  const report = gaData.reports[0];
  const dimensionIndex = report.dimensionHeaders.findIndex(header => header.name === dimensionName);
  const metricIndex = report.metricHeaders.findIndex(header => header.name === 'activeUsers'); // Default metric

  if (dimensionIndex === -1) return [];

  return report.rows.map(row => ({
    dimension: row.dimensionValues[dimensionIndex]?.value || '',
    value: parseFloat(row.metricValues[metricIndex]?.value || '0'),
  }));
};

export const parseGASessions = (gaData: GADataResponse | null): number => {
  return parseGAMetrics(gaData, 'sessions');
};

export const parseGAPageViews = (gaData: GADataResponse | null): number => {
  return parseGAMetrics(gaData, 'screenPageViews');
};

export const parseGAUsers = (gaData: GADataResponse | null): number => {
  return parseGAMetrics(gaData, 'activeUsers');
};

export const parseGARevenue = (gaData: GADataResponse | null): number => {
  if (!gaData?.reports?.[0]) return 0;

  const report = gaData.reports[0];
  const revenueIndex = report.metricHeaders.findIndex(header => header.name === 'totalRevenue');

  if (revenueIndex === -1) return 0;

  // Sum all rows and convert from micro-units to dollars
  const totalMicros = report.rows.reduce((sum, row) => {
    const value = parseFloat(row.metricValues[revenueIndex]?.value || '0');
    return sum + value;
  }, 0);

  return totalMicros / 1000000; // GA4 reports revenue in millionths of currency unit
};
