import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({ reportId, filters }) => [
  reportId,
  undefined, // xRHIDENTITY
  filters,
];

const useReportTestResultsOS = (options) =>
  useTableToolsQuery('reportTestResultsOS', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReportTestResultsOS;
