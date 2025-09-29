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

const useValueDefinitions = (options) =>
  useComplianceQuery('valueDefinitions', { ...options, convertToArray });

export default useValueDefinitions;
