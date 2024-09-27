import useQuery, { apiInstance } from '../useQuery';

const useSystemsQuery = () => {
  return useQuery(apiInstance.systems);
};

export default useSystemsQuery;
