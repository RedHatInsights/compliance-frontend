import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ securityGuideId }) => [
  securityGuideId,
  undefined, // xRHIDENTITY
];

const useSecurityGuideRuleTree = (options = {}) =>
  useTableToolsQuery('securityGuideRuleTree', {
    ...options,
    convertToArray,
  });

export default useSecurityGuideRuleTree;
