// TODO correct the serialiser to transform state put into the tablestate to be API consumable
export const paginationSerialiser = (state) => {
  if (state) {
    const offset = (state.page - 1) * state.perPage;
    const limit = state.perPage;

    return { offset, limit };
  }
};

const textFilterSerialiser = (filterConfigItem, value) =>
  `${filterConfigItem.filterAttribute} ~ "${value}"`;

const checkboxFilterSerialiser = (filterConfigItem, values) =>
  `${filterConfigItem.filterAttribute} ^ (${values
    .map((value) => `${value}`)
    .join(' ')})`;

const raidoFilterSerialiser = (filterConfigItem, values) =>
  `${filterConfigItem.filterAttribute} = "${values[0]}"`;

const filterSerialisers = {
  text: textFilterSerialiser,
  checkbox: checkboxFilterSerialiser,
  radio: raidoFilterSerialiser,
};

const findFilterSerialiser = (filterConfigItem) => {
  if (filterConfigItem.filterSerialiser) {
    return filterConfigItem.filterSerialiser;
  } else {
    return (
      filterConfigItem.filterAttribute &&
      filterSerialisers[filterConfigItem?.type]
    );
  }
};

/**
 * Takes an AsyncTableToolsTable state and transforms it into a Compliance scoped search filter parameter
 *
 *  @param   {object}             state   Table state
 *  @param   {object}             filters AsyncTableToolsTable filter configuration
 *
 *  @returns {string | undefined}         Compliance scoped search filter string
 *
 *  @category Compliance
 *  @tutorial filter-serialiser
 *
 */
export const filtersSerialiser = (state, filters) => {
  const queryParts = Object.entries(state || {}).reduce(
    (filterQueryParts, [filterId, value]) => {
      const filterConfigItem = filters.find((filter) => filter.id === filterId);
      const filterSerialiser = findFilterSerialiser(filterConfigItem);

      return [
        ...filterQueryParts,
        ...(filterSerialiser
          ? [filterSerialiser(filterConfigItem, value)]
          : []),
      ];
    },
    []
  );

  return queryParts.length > 0 ? queryParts.join(' AND ') : undefined;
};

/**
 * Returns a string consumable by the Compliance API as a "sort_by" parameter for a given column and direction
 * For columns to be sortable they need to have a "sortable" prop, which corresponds to the field name in the Compliance API
 *
 *  @param   {object} state           A "sortBy" table state
 *  @param   {number} state.index     Index of the column to sort by
 *  @param   {string} state.direction Direction to sort the column by
 *  @param   {Array}  columns         Columns passed in for the AsyncTableToolsTable
 *
 *  @returns {string}                 Compliance "sort_by" parameter string, like "name:desc"
 *
 *  @category Compliance
 *
 *  @example <caption>Example of a column with an sortable property</caption>
 *
 *  const columns = [
 *     {
 *       title: 'Name',
 *       sortable: 'name' // Corresponds to the attribute/field to sort by in the API
 *     }
 *  ];
 *
 */
export const sortSerialiser = ({ index, direction } = {}, columns) =>
  columns[index]?.sortable && `${columns[index].sortable}:${direction}`; // TODO: columns and index are not matching if the first column serves for expandable button
