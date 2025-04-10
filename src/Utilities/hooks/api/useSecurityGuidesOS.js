import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ filter }) => [
  undefined, // xRHIDENTITY
  filter,
];

const useSecurityGuidesOS = (options) =>
  useComplianceQuery('securityGuidesOS', { ...options, convertToArray });

export default useSecurityGuidesOS;
