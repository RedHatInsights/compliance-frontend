import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ filters }) => [
  undefined, // xRHIDENTITY
  filters,
];

const useReportsOS = (options) =>
  useTableToolsQuery('reportsOS', { ...options, convertToArray });

export default useReportsOS;
