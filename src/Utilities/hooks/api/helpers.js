export const joinFilters = (...filters) =>
  filters.map((filter) => `(${filter})`).join(' AND ');

export const paramsWithFilters = (fetchParams, params) => {
  if (!Array.isArray(fetchParams)) {
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
      filter,
    };
  } else {
    return fetchParams;
  }
};
