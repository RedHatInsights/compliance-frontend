import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const {
      securityGuideId,
      profileId,
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    } = params;

    return [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

const useProfileRules = (options) =>
  useComplianceQuery('profileRules', { ...options, convertToArray });

export default useProfileRules;
