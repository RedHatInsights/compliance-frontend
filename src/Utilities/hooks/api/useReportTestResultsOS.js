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

const useReportTestResultsOS = (options) =>
  useComplianceQuery('reportTestResultsOS', { ...options, convertToArray });

export default useReportTestResultsOS;
