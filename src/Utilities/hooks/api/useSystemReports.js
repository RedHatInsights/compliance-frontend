import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({
  systemId,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
}) => [
  systemId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useSystemReports = (options) =>
  useComplianceQuery('systemReports', {
    ...options,
    requiredParams: 'systemId',
    convertToArray,
  });

export default useSystemReports;
