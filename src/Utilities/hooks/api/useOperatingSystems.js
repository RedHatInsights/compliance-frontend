import useComplianceQuery from './useComplianceQuery';

const useOperatingSystemsQuery = (options) =>
  useComplianceQuery('systemsOS', options);

export default useOperatingSystemsQuery;
