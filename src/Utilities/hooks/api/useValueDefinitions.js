import useQuery, { apiInstance } from '../useQuery';

export const useValueDefinitions = (securityGuideId, options) =>
  useQuery(apiInstance.valueDefinitions, {
    ...options,
    params: [securityGuideId, ...(options.params || [])],
  });

export default useValueDefinitions;
