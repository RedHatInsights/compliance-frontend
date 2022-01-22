import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { stringToId } from 'Utilities/TextHelper';

const buildFilterFilterString = (configItem, value) => {
  const { type, filterString } = configItem;

  if (type !== 'hidden' && !value) {
    return [];
  }

  switch (type) {
    case conditionalFilterType.text:
      return [filterString(value)];
    case conditionalFilterType.checkbox:
      return value.map((filter) => filterString(filter));

    case conditionalFilterType.group:
      return filterString(value);

    case 'hidden':
      return filterString();

    default:
      return [];
  }
};

const combineFilterStrings = (filterStringArray) => {
  const moreThanTwo =
    filterStringArray.map((f) => f.length).filter((fl) => fl > 0).length >= 2;
  return filterStringArray
    .map((fs) => fs.join(' or '))
    .join(moreThanTwo ? ' and ' : '');
};

export const buildFilterString = (filterConifg, filters) => {
  const filterStringArray = filterConifg
    .map((configItem) =>
      buildFilterFilterString(configItem, filters[stringToId(configItem.label)])
    )
    .filter((f) => f.length > 0);
  return combineFilterStrings(filterStringArray);
};

export const buildSystemsFilter = (
  filterConfig,
  activeFilters,
  showOnlySystemsWithTestResults,
  defaultFilter
) => {
  const filterString = buildFilterString(filterConfig, activeFilters);
  const combindedFilter = [
    ...(showOnlySystemsWithTestResults ? ['has_test_results = true'] : []),
    ...(filterString?.length > 0 ? [filterString] : []),
  ].join(' and ');
  const filter = defaultFilter
    ? `(${defaultFilter})` +
      (combindedFilter ? ` and (${combindedFilter})` : '')
    : combindedFilter;

  return filter;
};

export const groupByMajorVersion = (versions = [], showFilter = []) => {
  const showVersion = (version) => {
    if (showFilter.length > 0) {
      return showFilter.map(String).includes(String(version));
    } else {
      return true;
    }
  };

  return versions.reduce((acc, currentValue) => {
    if (showVersion(currentValue.major)) {
      acc[String(currentValue.major)] = [
        ...new Set([...(acc[currentValue.major] || []), currentValue.minor]),
      ];
    }

    return acc;
  }, []);
};

export const renameInventoryAttributes = ({
  culledTimestamp,
  staleWarningTimestamp,
  staleTimestamp,
  insightsId,
  lastScanned,
  ...system
}) => ({
  ...system,
  updated: lastScanned,
  culled_timestamp: culledTimestamp,
  stale_warning_timestamp: staleWarningTimestamp,
  stale_timestamp: staleTimestamp,
  insights_id: insightsId,
});

export const fetchBatched = (fetchFunction, total, filter, batchSize = 100) => {
  const pages = Math.ceil(total / batchSize) || 1;
  return Promise.all(
    [...new Array(pages)].map((_, pageIdx) =>
      fetchFunction(batchSize, pageIdx + 1, filter)
    )
  );
};

export const buildApiFilters = (filters = {}) => {
  const { tagFilters, ...otherFilters } = filters;
  const tagsApiFilter = tagFilters
    ? {
        tags: tagFilters.flatMap((tagFilter) =>
          tagFilter.values.map(
            (tag) =>
              `${encodeURIComponent(tagFilter.key)}/${encodeURIComponent(
                tag.tagKey
              )}=${encodeURIComponent(tag.value)}`
          )
        ),
      }
    : {};

  return {
    ...otherFilters,
    ...tagsApiFilter,
  };
};

export const toIdFilter = (ids) =>
  ids?.length > 0 ? `id ^ (${ids.join(',')})` : undefined;

export const searchTagsByKey = (search, tags) =>
  tags.filter((tagItem) => {
    if (search || search === '') {
      return tagItem?.key.indexOf(search) !== -1;
    } else {
      return true;
    }
  });
