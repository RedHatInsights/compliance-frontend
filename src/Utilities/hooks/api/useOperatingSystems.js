import useQuery, { apiInstance } from '../useQuery';

const useOperatingSystemsQuery = () => {
  return useQuery(apiInstance.systems);
};

export default useOperatingSystemsQuery;
