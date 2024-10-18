import useQuery, { apiInstance } from '../useQuery';

const useCreatePolicy = () => {
  return useQuery(apiInstance.createPolicy);
};

export default useCreatePolicy;
