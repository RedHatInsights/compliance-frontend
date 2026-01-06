import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ reportId, filter }) => [
  reportId,
  undefined, // xRHIDENTITY
  filter,
];

const useReportSystemsOS = (options) =>
  useComplianceQuery('reportSystemsOS', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReportSystemsOS;
