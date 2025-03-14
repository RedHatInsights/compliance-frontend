import useComplianceQuery from './useComplianceQuery';

export const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const { reportId, tags, limit, offset, idsOnly, sortBy, filter } = params;

    return [
      reportId,
      undefined, // xRHIDENTITY
      tags,
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

const useReportSystems = (options) =>
  useComplianceQuery('reportSystems', { ...options, convertToArray });

export default useReportSystems;
