import useComplianceQuery from '../useComplianceQuery';

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
  useComplianceQuery('systemReports', {
    ...options,
    requiredParams: 'systemId',
    convertToArray,
  });

export default useSystemReports;
