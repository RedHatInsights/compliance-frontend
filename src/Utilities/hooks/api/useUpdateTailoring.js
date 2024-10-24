import useComplianceQuery from './useComplianceQuery';

const useUpdateTailoring = (options) =>
  useComplianceQuery('updateTailoring', { skip: true, ...options });

export default useUpdateTailoring;
