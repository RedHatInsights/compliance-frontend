import { apiInstance, useQuery } from '../useQuery';

const usePolicyQuery = ({ policyId }) => {
  const {
    data: policyData,
    loading: policyLoading,
    error: policyError,
    refetch: policyRefetch,
  } = useQuery(apiInstance.policy, policyId);

  const {
    data: tailoringData,
    loading: tailoringLoading,
    // error: tailoringError,
    // refetch: tailoringRefetch,
  } = useQuery(apiInstance.tailorings, policyId, null, 1, 0);

  const loading = policyLoading || tailoringLoading;

  return {
    data: {
      policy: {
        data: { ...policyData?.data, old_id: tailoringData?.data?.[0]?.id },
      },
    },
    loading,
    error: policyError,
    refetch: policyRefetch,
  };
};
export default usePolicyQuery;
