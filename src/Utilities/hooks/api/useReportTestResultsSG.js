import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ reportId }) => [
  reportId,
  undefined, // xRHIDENTITY
];

const useReportTestResultsSG = (options) =>
  useComplianceQuery('reportTestResultsSG', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReportTestResultsSG;
