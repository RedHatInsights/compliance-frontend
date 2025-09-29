import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ reportId, filters }) => [
  reportId,
  undefined, // xRHIDENTITY
  filters,
];

const useReportTestResultsOS = (options) =>
  useComplianceQuery('reportTestResultsOS', { ...options, convertToArray });

export default useReportTestResultsOS;
