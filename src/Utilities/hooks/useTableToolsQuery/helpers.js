export const TOTAL_REQUEST_PARAMS = {
  limit: 1,
};

export const defaultCompileResult = (fetchResult, params) => {
  const data = fetchResult.data?.data || fetchResult.data;
  const meta = fetchResult.data?.meta;

  return {
    data,
    meta: {
      ...params,
      ...(meta || {}),
    },
  };
};

export const compileTotalResult = (fetchResult) =>
  fetchResult.data?.meta?.total;

export const hasRequiredParams = (requiredParams, params = {}) => {
  if (!requiredParams) {
    return true;
  } else {
    const paramsToCheck =
      typeof requiredParams === 'string' ? [requiredParams] : requiredParams;

    const missingParam = paramsToCheck.find(
      (requiredParam) => !(requiredParam in params),
    );
    if (missingParam) {
      console.error(`Missing required parameter: '${missingParam}'`);
    }
  }
};

export const fetchResult = async (
  fn,
  params,
  convertToArray,
  compileResult,
) => {
  const convertedParams = convertToArray(params);
  return compileResult(await fn(...convertedParams), params);
};

export const combineParamsWithTableState = (
  tableStateParams,
  additionalParams,
) => {
  const tableFilters = tableStateParams?.filters;
  const optionFilters = additionalParams?.filters;

  const combinedParams = {
    ...(tableStateParams || {}),
    ...(additionalParams || {}),
  };
  if (tableFilters && optionFilters) {
    combinedParams.filters = `(${tableFilters}) AND (${optionFilters})`;
  }
  return combinedParams;
};
