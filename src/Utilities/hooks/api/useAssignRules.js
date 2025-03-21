import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { policyId, tailoringId, assignRulesRequest } = params;

    return [
      policyId,
      tailoringId,
      undefined, // xRHIDENTITY,
      assignRulesRequest,
    ];
  }
};

const useAssignRules = (options) =>
  useComplianceQuery('assignRules', { ...options, skip: true, convertToArray });

export default useAssignRules;
