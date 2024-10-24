import useComplianceQuery from './useComplianceQuery';

const useSystem = (systemId, options) =>
  useComplianceQuery('system', { params: [systemId], ...options });

export default useSystem;
