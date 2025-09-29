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

const useRules = (options) =>
  useComplianceQuery('rules', {
    ...options,
    convertToArray,
  });

export default useRules;
