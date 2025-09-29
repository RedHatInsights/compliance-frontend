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

const useProfiles = (options) =>
  useComplianceQuery('profiles', { ...options, convertToArray });

export default useProfiles;
