import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ reportId, filter }) => [
  reportId,
  undefined, // xRHIDENTITY
  filter,
];

const useReportTestResultsOS = (options) =>
  useComplianceQuery('reportTestResultsOS', { ...options, convertToArray });

export default useReportTestResultsOS;
