const getRequestParams = ({
  limit = '10',
  offset = '0',
  filter = undefined,
  sortBy = 'title:asc',
} = {}) => {
  const params = new URLSearchParams({
    limit,
    offset,
    sort_by: sortBy,
  });

  if (filter !== undefined) {
    params.append('filter', filter);
  }

  return params.toString();
};

export default getRequestParams;
