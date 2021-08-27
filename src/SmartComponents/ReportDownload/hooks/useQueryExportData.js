import { useApolloClient } from '@apollo/client';
import { GET_SYSTEMS } from './constants';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
  topTenFailedRulesData,
} from './helpers';

const useQueryExportData = (
  exportSettings,
  policy,
  { onComplete, onError }
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

  // TODO fetch all batched
  return () =>
    client
      .query({
        query: GET_SYSTEMS,
        fetchResults: true,
        fetchPolicy: 'no-cache',
        variables: {
          perPage: 100,
          page: 1,
          filter: '',
          policyId: policy.id,
        },
      })
      .then(({ data }) => {
        const exportData = prepareForExport(
          exportSettings,
          data?.systems?.edges?.map((e) => e.node) || []
        );
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
