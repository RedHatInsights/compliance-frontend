import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ filters }) => [
  undefined, // xRHIDENTITY
  filters,
];

const useSystemsOs = (options) =>
  useComplianceQuery('systemsOS', { ...options, convertToArray });

export default useSystemsOs;
