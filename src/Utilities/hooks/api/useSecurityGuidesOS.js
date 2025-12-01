import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ filters }) => [
  undefined, // xRHIDENTITY
  filters,
];

const useSecurityGuidesOS = (options) =>
  useTableToolsQuery('securityGuidesOS', { ...options, convertToArray });

export default useSecurityGuidesOS;
