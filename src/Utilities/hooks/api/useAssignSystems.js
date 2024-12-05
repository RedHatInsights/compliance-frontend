import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, assignSystemsRequest } = params;

    return [
      policyId,
      undefined, // xRHIDENTITY,
      assignSystemsRequest,
    ];
  }
};

const useAssignSystems = (options) =>
  useComplianceQuery('assignSystems', { ...options, convertToArray });

export default useAssignSystems;
