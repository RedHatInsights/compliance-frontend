import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { securityGuideId, limit, offset, idsOnly, sort, filters } = params;

    return [
      securityGuideId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sort,
      filters,
    ];
  }
};

const useRuleGroups = (options) =>
  useComplianceQuery('ruleGroups', { ...options, convertToArray });

export default useRuleGroups;
