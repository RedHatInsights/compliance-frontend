import { prepareForExport } from './helpers';
import { useSystemsFetch, useFetchFailedRules } from './apiQueryHooks';

const useExportData = (report, exportSettings) => {
  const fetchSystems = useSystemsFetch(report);
  const fetchRules = useFetchFailedRules(report);

  return async () => {
    const [
      compliantSystems,
      nonCompliantSystems,
      unsupportedSystems,
      neverReported,
    ] = await fetchSystems();

    const topTenFailedRules = await fetchRules();

    return prepareForExport(
      exportSettings,
      compliantSystems,
      nonCompliantSystems,
      unsupportedSystems,
      neverReported,
      topTenFailedRules
    );
  };
};

const useQueryExportData = (
  exportSettings,
  report,
  { onComplete, onError } = {
    onComplete: () => undefined,
    onError: () => undefined,
  }
) => {
  const fetchData = useExportData(report, exportSettings);

  return async () => {
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
  };
};

export default useQueryExportData;
