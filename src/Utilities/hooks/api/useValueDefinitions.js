import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

export const useValueDefinitions = (options) => {
  const valueDefinitionsApi = useComplianceApi('valueDefinitions');
  const query = useQuery(valueDefinitionsApi, options);

  return query;
};

export default useValueDefinitions;
