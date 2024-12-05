import usePoliciesQuery from './api/usePolicies';

const usePoliciesCount = () => {
  const query = usePoliciesQuery({ params: { limit: 1 } });

  return query?.data?.meta?.total ?? null;
};

export default usePoliciesCount;
