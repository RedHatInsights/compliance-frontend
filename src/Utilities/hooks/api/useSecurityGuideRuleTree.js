import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ securityGuideId }) => [
  securityGuideId,
  undefined, // xRHIDENTITY
];

const useSecurityGuideRuleTree = (options = {}) =>
  useTableToolsQuery('securityGuideRuleTree', {
    ...options,
    requiredParams: 'securityGuideId',
    convertToArray,
  });

export default useSecurityGuideRuleTree;
