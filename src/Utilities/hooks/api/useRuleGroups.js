import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { securityGuideId, limit, offset, idsOnly, sortBy, filter } = params;

    return [
      securityGuideId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

const useRuleGroups = (options) =>
  useComplianceQuery('ruleGroups', { ...options, convertToArray });

export default useRuleGroups;
