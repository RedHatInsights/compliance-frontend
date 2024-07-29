import useQuery, { apiInstance } from '../useQuery';

const usePolicyQuery = ({ policyId }) => {
  const {
    data: policyData,
    loading: policyLoading,
    error: policyError,
    refetch: policyRefetch,
  } = useQuery(apiInstance.policy, { params: [policyId] });

  // We only need the first tailoring
  const limit = 1;
  const offset = 0;

  const {
    data: tailoringData,
    loading: tailoringLoading,
    error: tailoringError,
  } = useQuery(apiInstance.tailorings, {
    params: [policyId, null, limit, offset],
    skip: !!policyData,
  });

  const loading = policyLoading || tailoringLoading;

  return {
    data: {
      policy: {
        data: { ...policyData?.data, old_id: tailoringData?.data?.[0]?.id },
      },
    },
    loading,
    error: policyError || tailoringError,
    refetch: policyRefetch,
  };
};
export default usePolicyQuery;
