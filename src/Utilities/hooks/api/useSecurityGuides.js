import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { limit, offset, idsOnly, sort, filters } = params;

    return [
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sort,
      filters,
    ];
  }
};

const useSecurityGuides = (options) =>
  useComplianceQuery('securityGuides', { ...options, convertToArray });

export default useSecurityGuides;
