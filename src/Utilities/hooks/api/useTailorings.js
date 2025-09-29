import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, limit, offset, idsOnly, sort, filters } = params;

    return [
      policyId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sort,
      filters,
    ];
  }
};

const useTailorings = (options) =>
  useComplianceQuery('tailorings', {
    ...options,
    requiredParams: 'policyId',
    convertToArray,
  });

export default useTailorings;
