import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ reportId }) => [
  reportId,
  undefined, // xRHIDENTITY
];

const useReportTestResultsSG = (options) =>
  useTableToolsQuery('reportTestResultsSG', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReportTestResultsSG;
