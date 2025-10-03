import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({ reportId, filters }) => [
  reportId,
  undefined, // xRHIDENTITY
  filters,
];

const useReportSystemsOS = (options) =>
  useTableToolsQuery('reportSystemsOS', { ...options, convertToArray });

export default useReportSystemsOS;
