import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { securityGuideId, profileId } = params;

    return [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
    ];
  }
};

const useProfileTree = (options) =>
  useComplianceQuery('profileTree', { ...options, convertToArray });

export default useProfileTree;
