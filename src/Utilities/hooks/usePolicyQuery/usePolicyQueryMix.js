import usePolicyQuery from './usePolicyQuery';
import usePolicyQuery2 from './usePolicyQuery2';

// From new Policy ID calls the V2 API to get the contents,
// then to get the old Policy ID, it calls the tailoring endpoint
// In the end it calls the GraphQL API using the old Policy ID
export const usePolicyQueryMix = ({ policyId }) => {
  const policyQuery = usePolicyQuery2({ policyId });
  const oldPolicyQuery = usePolicyQuery({
    policyId: policyQuery?.data?.policy?.data?.old_id,
    skip: policyQuery.loading,
  });

  const finalLoading = policyQuery.loading || oldPolicyQuery.loading;

  // Avoid error message when old id is not yet known
  const error =
    !policyQuery?.data?.policy?.data?.old_id || !finalLoading
      ? oldPolicyQuery?.error
      : undefined;

  return {
    error,
    loading: finalLoading,
    policyQuery,
    oldPolicyQuery,
    refetch: policyQuery.refetch,
  };
};
