import { useCallback } from 'react';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import { apiInstance } from '../../../Utilities/hooks/useQuery';
import concat from 'lodash/concat';
import { calculateOffset } from '@/Utilities/helpers';

const COMPLIANT_SYSTEMS_FILTER = 'compliant = true and supported = true';
const NON_COMPLIANT_SYSTEMS_FILTER = 'compliant = false and supported = true';
const UNSUPPORTED_SYSTEMS_FILTER = 'supported = false';
const NOT_REPORTING_SYSTEMS_FILTER = 'never_reported = true';

const useFetchBatched = () => {
  const { isResolving: isLoading, resolve } = usePromiseQueue();

  return {
    isLoading,
    fetchBatched: useCallback(
      (fetchFunction, total, filter, batchSize = 50) => {
        const pages = Math.ceil(total / batchSize) || 1;

        const results = resolve(
          [...new Array(pages)].map(
            (_, pageIdx) => () => fetchFunction(batchSize, pageIdx + 1, filter)
          )
        );

        return results;
      },
      [resolve]
    ),
  };
};

export const useFetchFailedRules = ({ id: reportId } = {}) => {
  return useCallback(
    () =>
      apiInstance
        .reportStats(reportId)
        .then(({ data: { top_failed_rules } = {} }) => top_failed_rules),
    [reportId]
  );
};

const useFetchReportTestResults = (reportId, filter) =>
  useCallback(
    (perPage, page) =>
      apiInstance
        .reportTestResults(
          reportId,
          undefined,
          undefined,
          perPage,
          calculateOffset(page, perPage),
          undefined,
          undefined,
          filter
        )
        .then(({ data: { data } = {} }) => data),
    [reportId, filter]
  );

const useFetchReportSystems = (reportId, filter) =>
  useCallback(
    (perPage, page) =>
      apiInstance
        .reportSystems(
          reportId,
          undefined,
          undefined,
          perPage,
          calculateOffset(page, perPage),
          undefined,
          undefined,
          filter
        )
        .then(({ data: { data } = {} }) => data),
    [reportId, filter]
  );

export const useSystemsFetch = ({
  id: reportId,
  compliant_system_count: compliantSystemsCount,
  unsupported_system_count: unsupportedSystemsCount,
  assigned_system_count: assignedSystemsCount,
  reported_system_count: reportedSystemsCount,
} = {}) => {
  const { fetchBatched } = useFetchBatched();
  const fetchCompliant = useFetchReportTestResults(
    reportId,
    COMPLIANT_SYSTEMS_FILTER
  );
  const fetchNonCompliante = useFetchReportTestResults(
    reportId,
    NON_COMPLIANT_SYSTEMS_FILTER
  );
  const fetchUnsupported = useFetchReportTestResults(
    reportId,
    UNSUPPORTED_SYSTEMS_FILTER
  );
  const fetchNeverReported = useFetchReportSystems(
    reportId,
    NOT_REPORTING_SYSTEMS_FILTER
  );

  const fetchAndConcat = (fetchFunction, count) => {
    return fetchBatched(fetchFunction, count).then((result) =>
      concat(...result)
    );
  };

  return async () =>
    Promise.all([
      fetchAndConcat(fetchCompliant, compliantSystemsCount),
      fetchAndConcat(
        fetchNonCompliante,
        assignedSystemsCount - compliantSystemsCount
      ),
      fetchAndConcat(fetchUnsupported, unsupportedSystemsCount),
      fetchAndConcat(
        fetchNeverReported,
        assignedSystemsCount - reportedSystemsCount
      ),
    ]);
};
