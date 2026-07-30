import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ reportId }) => [
  reportId,
  undefined, // xRHIDENTITY,
];

const useDeleteReport = (options) =>
  useTableToolsQuery('deleteReport', {
    ...options,
    requiredParams: 'reportId',
    skip: true,
    convertToArray,
  });

export default useDeleteReport;
