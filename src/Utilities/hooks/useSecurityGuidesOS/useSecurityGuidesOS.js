import useQuery, { apiInstance } from '../useQuery';

const useSecurityGuidesOS = () => {
  const { data, error, loading } = useQuery(apiInstance.securityGuidesOS);

  return { data, error, loading };
};

export default useSecurityGuidesOS;
