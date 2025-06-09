import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, tailoringId, limit, offset, idsOnly, sortBy, filter } =
      params;

    return [
      policyId,
      tailoringId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useTailoringRules = (options) =>
  useComplianceQuery('tailoringRules', { ...options, convertToArray });

export default useTailoringRules;
