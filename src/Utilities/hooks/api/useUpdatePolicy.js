import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, policyUpdate } = params;

    return [
      policyId,
      undefined, // xRHIDENTITY,
      policyUpdate,
    ];
  }
};

const useUpdatePolicy = (options) =>
  useComplianceQuery('updatePolicy', {
    skip: true,
    ...options,
    convertToArray,
  });

export default useUpdatePolicy;
