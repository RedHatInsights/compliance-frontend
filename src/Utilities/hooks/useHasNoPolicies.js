import { usePoliciesQuery } from './usePoliciesQuery/usePoliciesQuery';

const useHasNoPolicies = () => {
  const query = usePoliciesQuery({ limit: 1 });

  return query?.data?.meta?.total === 0 ?? null;
};

export default useHasNoPolicies;
