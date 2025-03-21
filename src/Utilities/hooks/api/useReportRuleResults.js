import useComplianceQuery from '../useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { testResultId, reportId, limit, offset, idsOnly, sortBy, filter } =
      params;

    return [
      testResultId,
      reportId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

const useReportRuleResults = (options) =>
  useComplianceQuery('reportRuleResults', {
    ...options,
    convertToArray,
  });

export default useReportRuleResults;
