import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ filters }) => [
  undefined, // xRHIDENTITY
  filters,
];

const useSecurityGuidesOS = (options) =>
  useComplianceQuery('securityGuidesOS', { ...options, convertToArray });

export default useSecurityGuidesOS;
