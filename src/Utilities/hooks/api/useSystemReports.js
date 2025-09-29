import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({
  systemId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  systemId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useSystemReports = (options) =>
  useTableToolsQuery('systemReports', {
    ...options,
    requiredParams: 'systemId',
    convertToArray,
  });

export default useSystemReports;
