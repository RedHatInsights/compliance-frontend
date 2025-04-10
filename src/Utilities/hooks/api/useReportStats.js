import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ reportId }) => [
  reportId,
  undefined, // xRHIDENTITY
];

const useReportStats = (options) =>
  useComplianceQuery('reportStats', { ...options, convertToArray });

export default useReportStats;
