import { useCallback } from 'react';
import { prepareForExport } from './helpers';
import useReportStats from 'Utilities/hooks/api/useReportStats';
import useSystemsFetch from './useSystemsFetch';

const useQueryExportData = (
  exportSettings,
  report,
  { onComplete, onError } = {
    onComplete: () => undefined,
    onError: () => undefined,
  }
) => {
  const fetchSystems = useSystemsFetch(report);
  const { fetch: fetchRules } = useReportStats({
    params: { reportId: report?.id },
    skip: true,
  });

  const fetchData = useCallback(async () => {
    const [
      compliantSystems,
      nonCompliantSystems,
      unsupportedSystems,
      neverReported,
    ] = await fetchSystems();
    const { data: { top_failed_rules: topTenFailedRules } = {} } =
      await fetchRules();

    return prepareForExport(
      exportSettings,
      compliantSystems,
      nonCompliantSystems,
      unsupportedSystems,
      neverReported,
      topTenFailedRules
    );
  }, [exportSettings, fetchSystems, fetchRules]);

  const queryExportData = useCallback(async () => {
    try {
      const exportData = await fetchData();

      onComplete?.(exportData);
      return exportData;
    } catch (error) {
      if (onError) {
        onError?.(error);
        return [];
      } else {
        throw error;
      }
    }
  }, [fetchData, onError, onComplete]);

  return queryExportData;
};

export default useQueryExportData;
