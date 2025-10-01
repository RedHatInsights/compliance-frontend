import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ securityGuideId, limit, offset, idsOnly, sort, filters }) => [
  securityGuideId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useRuleGroups = (options) =>
  useTableToolsQuery('ruleGroups', { ...options, convertToArray });

export default useRuleGroups;
