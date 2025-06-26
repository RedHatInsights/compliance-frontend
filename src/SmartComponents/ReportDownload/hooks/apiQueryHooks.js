import { useCallback } from 'react';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import { apiInstance } from '../../../Utilities/hooks/useQuery';
import { concat, uniq } from 'lodash';
import { calculateOffset } from '@/Utilities/helpers';
import useSecurityGuides from 'Utilities/hooks/api/useSecurityGuides';

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
            (_, pageIdx) => () => fetchFunction(batchSize, pageIdx + 1, filter),
          ),
        );

        return results;
      },
      [resolve],
    ),
  };
};

export const useFetchFailedRules = ({ id: reportId } = {}) => {
  return useCallback(
    () =>
      apiInstance
        .reportStats(reportId)
        .then(({ data: { top_failed_rules } = {} }) => top_failed_rules),
    [reportId],
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
          filter,
        )
        .then(({ data: { data } = {} }) => data),
    [reportId, filter],
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
          filter,
        )
        .then(({ data: { data } = {} }) => data),
    [reportId, filter],
  );

const useFetchSupportedSsg = () => {
  const { fetchQueue } = useSecurityGuides({
    skip: true,
    params: {
      limit: 1,
      sortBy: 'version:desc',
    },
  });

  return async (refId, osMajorVersion, unsupportedSystems) => {
    const queueToFetch = uniq(
      unsupportedSystems.map(({ os_minor_version }) => os_minor_version),
    ).reduce((queue, osMinorVersion) => {
      return {
        ...queue,
        [osMinorVersion]: {
          filter: `os_major_version=${osMajorVersion} AND supported_profile=${refId}:${osMinorVersion}`,
        },
      };
    }, {});
    const fetchedExpectedVersions = await fetchQueue(queueToFetch);
    const expectedVersions = Object.fromEntries(
      Object.entries(fetchedExpectedVersions).map(
        ([
          osMinorVersion,
          {
            data: [{ version }],
          },
        ]) => [osMinorVersion, version],
      ),
    );

    return unsupportedSystems.map((system) => ({
      ...system,
      expectedSsgVersion: expectedVersions[system.os_minor_version],
    }));
  };
};

export const useSystemsFetch = ({
  id: reportId,
  ref_id,
  os_major_version,
  compliant_system_count: compliantSystemsCount,
  unsupported_system_count: unsupportedSystemsCount,
  assigned_system_count: assignedSystemsCount,
  reported_system_count: reportedSystemsCount,
} = {}) => {
  const { fetchBatched } = useFetchBatched();
  const fetchCompliant = useFetchReportTestResults(
    reportId,
    COMPLIANT_SYSTEMS_FILTER,
  );
  const fetchNonCompliante = useFetchReportTestResults(
    reportId,
    NON_COMPLIANT_SYSTEMS_FILTER,
  );
  const fetchUnsupported = useFetchReportTestResults(
    reportId,
    UNSUPPORTED_SYSTEMS_FILTER,
  );
  const fetchSupportedSsgs = useFetchSupportedSsg();
  const fetchNeverReported = useFetchReportSystems(
    reportId,
    NOT_REPORTING_SYSTEMS_FILTER,
  );

  const fetchAndConcat = async (fetchFunction, count) => {
    return await fetchBatched(fetchFunction, count).then((result) =>
      concat(...result),
    );
  };

  return async () => {
    const compliantSystems = await fetchAndConcat(
      fetchCompliant,
      compliantSystemsCount,
    );
    const nonCompliantSystems = await fetchAndConcat(
      fetchNonCompliante,
      assignedSystemsCount - compliantSystemsCount,
    );
    const unsupportedSystems = await fetchAndConcat(
      fetchUnsupported,
      unsupportedSystemsCount,
    );
    const unsupportedSystemsWithExpectedSsg = await fetchSupportedSsgs(
      ref_id,
      os_major_version,
      unsupportedSystems,
    );
    const neverReportedSystems = await fetchAndConcat(
      fetchNeverReported,
      assignedSystemsCount - reportedSystemsCount,
    );

    return [
      compliantSystems,
      nonCompliantSystems,
      unsupportedSystemsWithExpectedSsg,
      neverReportedSystems,
    ];
  };
};
