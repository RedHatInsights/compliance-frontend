import { prepareForExportRest } from './helpers';
import { useSystemsFetchRest, useFetchFailedRulesRest } from './apiQueryHooks';

const useExportDataRest = (report, exportSettings) => {
  const fetchSystems = useSystemsFetchRest(report);
  const fetchRules = useFetchFailedRulesRest(report);

  return async () => {
    const [
      compliantSystems,
      nonCompliantSystems,
      unsupportedSystems,
      neverReported,
    ] = await fetchSystems();

    const topTenFailedRules = await fetchRules();

    return prepareForExportRest(
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
  const fetchDataRest = useExportDataRest(report, exportSettings);

  return async () => {
    try {
      const exportData = await fetchDataRest();

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
