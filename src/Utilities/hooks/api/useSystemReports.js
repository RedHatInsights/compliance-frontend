import useComplianceQuery from './useComplianceQuery';

const useSystemReports = (options) =>
  useComplianceQuery('systemReports', options);

export default useSystemReports;
