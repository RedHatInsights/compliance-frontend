import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ reportId }) => [
  reportId,
  undefined, // xRHIDENTITY
];

const useReport = (options) =>
  useComplianceQuery('report', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReport;
