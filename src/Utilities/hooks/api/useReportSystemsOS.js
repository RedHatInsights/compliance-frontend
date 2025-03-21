import useComplianceQuery from './useComplianceQuery';

export const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { reportId, filter } = params;

    return [
      reportId,
      undefined, // xRHIDENTITY
      filter,
    ];
  }
};

const useReportSystemsOS = (options) =>
  useComplianceQuery('reportSystemsOS', { ...options, convertToArray });

export default useReportSystemsOS;
