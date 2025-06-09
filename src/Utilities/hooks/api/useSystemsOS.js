import useComplianceQuery from './useComplianceQuery';

export const convertToArray = ({ filter }) => [
  undefined, // xRHIDENTITY
  filter,
];

const useSystemsOs = (options) =>
  useComplianceQuery('systemsOS', { ...options, convertToArray });

export default useSystemsOs;
