import useQuery, { apiInstance } from '../useQuery';

const usePolicyQuery = ({ policyId }) => {
  return useQuery(apiInstance.policy, { params: [policyId] });
};

export default usePolicyQuery;
