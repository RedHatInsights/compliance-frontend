import { filtersSerialiser } from 'PresentationalComponents/ComplianceTable/serialisers';
import * as filters from '../../Filters';

export const inventoryFiltersSerialiser = (
  inventoryFilterState = {},
  ignoreOsMajorVersion,
) =>
  filtersSerialiser(inventoryFilterState, [
    filters.name,
    filters.os(ignoreOsMajorVersion),
    filters.group,
    filters.tags,
  ]);

export const inventorySortSerialiser = (
  { key: sortByKey, direction } = {},
  columns,
) => {
  const index = columns.findIndex(({ key }) => key === sortByKey);

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

const mapData = ({
  display_name: name,
  os_major_version: osMajorVersion,
  os_minor_version: osMinorVersion,
  insights_id: insightsId,
  security_guide_version: version,
  end_time: lastScanned,
  failed_rule_count: rulesFailed,
  score,
  compliant,
  supported,
  policies,
  ...rest
}) => ({
  ...rest,
  name,
  osMajorVersion,
  osMinorVersion,
  insightsId,
  lastScanned,
  rulesFailed,
  ...(score || compliant || supported
    ? {
        testResultProfiles: [
          { score, compliant, supported, benchmark: { version } },
        ],
      }
    : {}),
  ...(policies
    ? {
        policies: policies?.map(({ title: name, ...rest }) => ({
          ...rest,
          name,
        })),
      }
    : {}),
});

export const compileResult = (fetchResult, params) => {
  const data = fetchResult.data?.data.map(mapData);
  const meta = fetchResult.data?.meta;

  return {
    data,
    meta: {
      ...params,
      ...(meta || {}),
    },
  };
};
