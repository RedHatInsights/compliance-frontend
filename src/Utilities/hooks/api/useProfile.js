import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { securityGuideId } = params;
    const { profileId } = params;

    return [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
    ];
  }
};

const useProfile = (options) =>
  useComplianceQuery('profile', { ...options, convertToArray });

export default useProfile;
