import { useApolloClient } from '@apollo/client';
import useFeature from 'Utilities/hooks/useFeature';
import { GET_SYSTEMS } from '../constants';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
  nonReportingSystemsData,
  topTenFailedRulesData,
} from './helpers';

const fetchBatched = (fetchFunction, total, batchSize = 100) => {
  const pages = Math.ceil(total / batchSize) || 1;
  return Promise.all(
    [...new Array(pages)].map((_, pageIdx) =>
      fetchFunction(batchSize, pageIdx + 1)
    )
  );
};

// Hook that provides a wrapper function for a preconfigured GraphQL client to fetch export data
const useQueryExportData = (
  exportSettings,
  { id: policyId, totalHostCount } = {},
  { onComplete, onError } = {
    onComplete: () => undefined,
    onError: () => undefined,
  }
) => {
  const systemsNotReporting = useFeature('systemsNotReporting');

  const client = useApolloClient();

  const prepareForExport = (systems) => {
    const compliantSystems = compliantSystemsData(systems);
    const nonCompliantSystems = nonCompliantSystemsData(systems);
    const unsupportedSystems = unsupportedSystemsData(systems);
    const nonReportingSystems = nonReportingSystemsData(systems);

    return {
      ...(exportSettings.compliantSystems && {
        compliantSystems: compliantSystems,
      }),
      compliantSystemCount: compliantSystems.length,
      ...(exportSettings.nonCompliantSystems && {
        nonCompliantSystems: nonCompliantSystems,
      }),
      nonCompliantSystemCount: nonCompliantSystems.length,
      ...(exportSettings.unsupportedSystems && {
        unsupportedSystems: unsupportedSystems,
      }),
      unsupportedSystemCount: unsupportedSystems.length,
      ...(exportSettings.topTenFailedRules && {
        topTenFailedRules: topTenFailedRulesData(systems),
      }),
      ...(systemsNotReporting
        ? {
            nonReportingSystemCount: nonReportingSystems.length,
            ...(exportSettings.nonReportingSystems && {
              nonReportingSystems: nonReportingSystems,
            }),
          }
        : {}),
      ...(exportSettings.userNotes && { userNotes: exportSettings.userNotes }),
    };
  };
  const fetchFunction = (perPage, page) =>
    client.query({
      query: GET_SYSTEMS,
      fetchResults: true,
      fetchPolicy: 'no-cache',
      variables: {
        perPage,
        page,
        filter: `policy_id = ${policyId}`,
        policyId,
      },
    });

  return () =>
    fetchBatched(fetchFunction, totalHostCount)
      .then((results) =>
        results.flatMap(({ data }) => data.systems.edges.map((e) => e.node))
      )
      .then((systems) => {
        const exportData = prepareForExport(systems);
        onComplete && onComplete(exportData);
        return exportData;
      })
      .catch((error) => {
        if (onError) {
          onError(error);
          return [];
        } else {
          throw error;
        }
      });
};

export default useQueryExportData;
