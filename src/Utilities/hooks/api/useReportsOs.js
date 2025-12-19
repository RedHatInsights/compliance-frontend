import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ filter }) => [
  undefined, // xRHIDENTITY
  filter,
];

const useReportsOS = (options) =>
  useComplianceQuery('reportsOS', { ...options, convertToArray });

export default useReportsOS;
