import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, tags, limit, offset, idsOnly, sortBy, filter } = params;

    return [
      policyId,
      undefined, // xRHIDENTITY
      tags,
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

const usePolicySystems = (options) =>
  useComplianceQuery('policySystems', { ...options, convertToArray });

export default usePolicySystems;
