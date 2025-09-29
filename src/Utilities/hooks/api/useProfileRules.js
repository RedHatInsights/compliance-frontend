import useComplianceQuery from '../useComplianceQuery';

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
      sort,
      filters,
    } = params;

    return [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sort,
      filters,
    ];
  }
};

const useProfileRules = (options) =>
  useComplianceQuery('profileRules', {
    ...options,
    requiredParams: ['profileId', 'securityGuideId'],
    convertToArray,
  });

export default useProfileRules;
