import useQuery, { apiInstance } from '../useQuery';

const useOperatingSystemsQuery = (filters) => {
  return useQuery(apiInstance.systemsOS, { params: [undefined, filters] });
};

export default useOperatingSystemsQuery;
