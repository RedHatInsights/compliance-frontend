import { filtersSerialiser } from 'PresentationalComponents/ComplianceTable/serialisers';
import * as filters from '../../Filters';

const mapSortKey = (sortByKey) =>
  ({
    group_name: 'groups',
  })[sortByKey] || sortByKey;

export const inventoryFiltersSerialiser = (
  inventoryFilterState = {},
  ignoreOsMajorVersion,
) => {
  const { tagFilters, ...otherFilters } = inventoryFilterState;
  const filter = filtersSerialiser(otherFilters, [
    filters.name,
    filters.os(ignoreOsMajorVersion),
    filters.group,
  ]);

  const tags = tagFilters
    ? filters.tags.filterSerialiser(filters.tags, tagFilters)
    : undefined;

  return { filter, tags };
};

export const inventorySortSerialiser = (
  { key: sortByKey, direction } = {},
  columns,
) => {
  const index = columns.findIndex(({ key }) => key === mapSortKey(sortByKey));

  if (index >= 0 && columns[index]?.sortable) {
    return `${columns[index].sortable}:${direction}`;
  }
};

export const buildOSObjects = (osVersions = []) => ({
  results: osVersions
    .filter((version) => !!version && typeof version === 'string')
    .map((version) => {
      const [major, minor] = version.split('.');
      return {
        value: {
          name: 'RHEL',
          major,
          minor,
        },
      };
    }),
});
