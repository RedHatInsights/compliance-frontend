import useQuery, { apiInstance } from '../useQuery';

const useOperatingSystemsQuery = (filters) => {
  return useQuery(apiInstance.systemsOS, { params: [null, filters] });
};

export default useOperatingSystemsQuery;
