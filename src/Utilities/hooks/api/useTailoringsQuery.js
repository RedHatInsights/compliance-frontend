import useQuery, { apiInstance } from '../useQuery';

const useTailoringsQuery = (policyId, skip) => {
  const { data, error, loading } = useQuery(apiInstance.tailorings, {
    skip,
    params: [policyId, undefined, 100],
  });

  return { data: data?.data, error, loading };
};

export default useTailoringsQuery;
