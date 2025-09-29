import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ filters }) => [
  undefined, // xRHIDENTITY
  filters,
];

const useReportsOS = (options) =>
  useComplianceQuery('reportsOS', { ...options, convertToArray });

export default useReportsOS;
