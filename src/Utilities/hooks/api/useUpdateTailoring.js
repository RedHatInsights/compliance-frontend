import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, tailoringId, valuesUpdate } = params;

    return [
      policyId,
      tailoringId,
      undefined, // xRHIDENTITY,
      valuesUpdate,
    ];
  }
};

const useUpdateTailoring = (options) =>
  useComplianceQuery('updateTailoring', {
    skip: true,
    ...options,
    convertToArray,
  });

export default useUpdateTailoring;
