import { prepareForExportGraphQL, prepareForExportRest } from './helpers';
import {
  useFetchRules,
  useSystemsFetch,
  useSystemsFetchRest,
  useFetchFailedRulesRest,
} from './apiQueryHooks';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';
import { useCallback } from 'react';

const useExportDataGraphQL = (report, exportSettings) => {
  const fetchSystems = useSystemsFetch(report);
  const fetchRules = useFetchRules(report);

  return useCallback(async () => {
    const systems = await fetchSystems();
    const rules = await fetchRules();

    return prepareForExportGraphQL(exportSettings, systems, rules);
  }, [JSON.stringify(report), JSON.stringify(exportSettings)]);
};

const useExportDataRest = (report, exportSettings) => {
  const fetchSystems = useSystemsFetchRest(report);
  const fetchRules = useFetchFailedRulesRest(report);

  return useCallback(async () => {
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
  }, [JSON.stringify(report), JSON.stringify(exportSettings)]);
};

// Hook that provides a wrapper function for a preconfigured GraphQL client to fetch export data
const useQueryExportData = (
  exportSettings,
  report,
  { onComplete, onError } = {
    onComplete: () => undefined,
    onError: () => undefined,
  }
) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const fetchDataGraphQL = useExportDataGraphQL(report, exportSettings);
  const fetchDataRest = useExportDataRest(report, exportSettings);

  return async () => {
    try {
      const exportData = apiV2Enabled
        ? await fetchDataRest()
        : await fetchDataGraphQL();

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
