// NOTE We might want to pass also the complete "table state" as a last parameter

/**
 * TODO This function should transform the pagination table state into a format consumable as a param by the REST API
 *
 * @param {Object} sort State of the "pagination" in the table state
 */
export const onSetPaginationState = (pagination) => {
  // TODO This function should transform the pagination table state into a format consumable as a param by the REST API
  return;
};

/**
 * TODO This function should transform the filter table state into a format consumable as a param by the REST API
 * This function should utilise the `toApi...` function provided with each filter
 *
 * @param {Object} filters
 * @param {Object} activeFilters State of the "filters" in the table state
 */
export const onSetFilterState = (filters, activeFilters) => {};

/**
 * TODO This function should transform the filter table state into a format consumable as a param by the REST API
 *
 * @param {Object} sort State of the "sort" in the table state
 */
export const onSetSortState = (sort) => {};
