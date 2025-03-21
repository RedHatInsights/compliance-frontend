import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { securityGuideId } = params;

    return [
      securityGuideId,
      undefined, // xRHIDENTITY
    ];
  }
};

const useSecurityGuide = (options) =>
  useComplianceQuery('securityGuide', {
    ...options,
    requiredParams: 'securityGuideId',
    convertToArray,
  });

export default useSecurityGuide;
