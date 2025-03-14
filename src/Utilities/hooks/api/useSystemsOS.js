import useComplianceQuery from './useComplianceQuery';

export const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { filter } = params;

    return [
      undefined, // xRHIDENTITY
      filter,
    ];
  }
};

const useSystemsOs = (options) =>
  useComplianceQuery('systemsOS', { ...options, convertToArray });

export default useSystemsOs;
