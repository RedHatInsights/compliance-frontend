export const TOTAL_REQUEST_PARAMS = {
  limit: 1,
};

export const joinFilters = (...filters) => {
  const filteredFilters = filters.filter((v) => v?.length);

  return filteredFilters.length > 1
    ? filteredFilters.map((filter) => `(${filter})`).join(' AND ')
    : filters[0];
};

const removeUndefinedProps = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => typeof value != 'undefined'),
  );

export const paramsWithFilters = (fetchParams, params) => {
  if (fetchParams && !Array.isArray(fetchParams)) {
    const { filter: fetchFilter, ...remainingFetchParams } =
      removeUndefinedProps(fetchParams);
    const filter = joinFilters(fetchFilter, params?.filter || {});

    return {
      ...remainingFetchParams,
      ...removeUndefinedProps(params),
      ...(filter?.length ? { filter } : {}),
    };
  } else {
    return fetchParams || params;
  }
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
  if (!requiredParams || !Array.isArray(params)) {
    return true;
  } else {
    const paramsToCheck =
      typeof requiredParams === 'string' ? [requiredParams] : requiredParams;

    return (paramsToCheck || []).every((param) =>
      Object.keys(params).includes(param),
    );
  }
};

const plainCompileResult = (fetchResult) => fetchResult;

export const fetchResult = async (
  fn,
  params,
  convertToArray,
  compileResult = plainCompileResult,
) => {
  const convertedParams =
    (convertToArray && !Array.isArray(params)
      ? convertToArray(params)
      : params) || [];

  if (Array.isArray(convertedParams)) {
    return compileResult(await fn(...convertedParams), params);
  } else {
    return compileResult(await fn(convertedParams), params);
  }
};
