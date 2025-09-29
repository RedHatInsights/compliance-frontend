import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ reportId }) => [
  reportId,
  undefined, // xRHIDENTITY
];

const useReport = (options) =>
  useTableToolsQuery('report', {
    ...options,
    requiredParams: 'reportId',
    convertToArray,
  });

export default useReport;
