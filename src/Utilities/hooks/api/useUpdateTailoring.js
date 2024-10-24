import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useUpdateTailoring = (options) => {
  const updateTailoringApi = useComplianceApi('updateTailoring');
  const query = useQuery(updateTailoringApi, { skip: true, ...options });

  return query;
};

export default useUpdateTailoring;
