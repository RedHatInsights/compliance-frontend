export const TOTAL_REQUEST_PARAMS = {
  limit: 1,
};

export const joinFilters = (...filters) => {
  const filteredFilters = filters.filter((v) => v?.length);

  return filteredFilters.length > 1
    ? filteredFilters.map((filter) => `(${filter})`).join(' AND ')
    : filters;
};

export const paramsWithFilters = (fetchParams, params) => {
  if (fetchParams && !Array.isArray(fetchParams)) {
    const { filter: fetchFilter, ...remainingFetchParams } = fetchParams;
    const filter = joinFilters(
      ...[
        ...(fetchFilter ? [fetchFilter] : []),
        ...(params?.filter ? [params.filter] : []),
      ]
    );

    return {
      ...params,
      ...remainingFetchParams,
      ...(filter?.length ? { filter } : {}),
    };
  } else {
    return fetchParams || params;
  }
};

export const compileResult = (fetchResult, params) => {
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
      Object.keys(params).includes(param)
    );
  }
};
