import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId } = params;

    return [
      policyId,
      undefined, // xRHIDENTITY
    ];
  }
};

const usePolicy = (options) =>
  useComplianceQuery('policy', { ...options, convertToArray });

export default usePolicy;
