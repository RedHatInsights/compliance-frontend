import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ reportId, filters }) => [
  reportId,
  undefined, // xRHIDENTITY
  filters,
];

const useReportSystemsOS = (options) =>
  useComplianceQuery('reportSystemsOS', { ...options, convertToArray });

export default useReportSystemsOS;
