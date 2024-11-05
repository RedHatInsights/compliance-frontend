import useComplianceQuery from './useComplianceQuery';

const useAssignSystems = (options) =>
  useComplianceQuery('assignSystems', options);

export default useAssignSystems;
