import { useApolloClient } from '@apollo/client';
import { GET_SYSTEMS } from '../constants';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
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

const useQueryExportData = (
  exportSettings,
  { id: policyId, totalHostCount },
  { onComplete, onError } = {
    onComplete: () => undefined,
    onError: () => undefined,
  }
) => {
  const client = useApolloClient();

  const prepareForExport = (systems) => ({
    ...(exportSettings.compliantSystems && {
      compliantSystems: compliantSystemsData(systems),
    }),
    ...(exportSettings.nonCompliantSystems && {
      nonCompliantSystems: nonCompliantSystemsData(systems),
    }),
    ...(exportSettings.unsupportedSystems && {
      unsupportedSystems: unsupportedSystemsData(systems),
    }),
    ...(exportSettings.topTenFailedRules && {
      topTenFailedRules: topTenFailedRulesData(systems),
    }),
    ...(exportSettings.userNotes && { userNotes: exportSettings.userNotes }),
  });
  const fetchFunction = (perPage, page) =>
    client.query({
      query: GET_SYSTEMS,
      fetchResults: true,
      fetchPolicy: 'no-cache',
      variables: {
        perPage,
        page,
        filter: '',
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
