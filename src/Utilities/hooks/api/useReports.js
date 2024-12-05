import useComplianceQuery from './useComplianceQuery';

const useReports = (options) => useComplianceQuery('reports', options);

export default useReports;
