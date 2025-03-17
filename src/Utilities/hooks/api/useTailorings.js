import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, limit, offset, idsOnly, sortBy, filter } = params;

    return [
      policyId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
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
