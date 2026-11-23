import { API_BASE_URL } from '@/constants';

export const PDF_SLICE_THRESHOLD = 2000;
export const PDF_MAX_SLICE_SIZE = 1000;

// In the order the report prints them.
const systemLists = ({
  assigned_system_count: assigned,
  reported_system_count: reported,
  compliant_system_count: compliant,
  unsupported_system_count: unsupported,
}) => [
  ['nonCompliantSystems', reported - compliant - unsupported],
  ['unsupportedSystems', unsupported],
  ['nonReportingSystems', assigned - reported],
  ['compliantSystems', compliant],
];

export const buildReportPdfSlices = (report = {}, exportSettings = {}) => {
  const lists = systemLists(report).filter(
    ([setting, count]) => exportSettings[setting] && count > 0,
  );
  const total = lists.reduce((sum, [, count]) => sum + count, 0);
  if (!(total > PDF_SLICE_THRESHOLD)) {
    return [undefined];
  }

  const sliceSize = Math.ceil(total / Math.ceil(total / PDF_MAX_SLICE_SIZE));
  const slices = [];
  let ranges = {};
  let room = sliceSize;
  lists.forEach(([setting, count]) => {
    for (let offset = 0; offset < count;) {
      const limit = Math.min(room, count - offset);
      // Open-ended, so a list reaches its final row even if the count is stale.
      ranges[setting] = offset + limit < count ? { offset, limit } : { offset };
      offset += limit;
      room -= limit;
      if (room === 0) {
        slices.push(ranges);
        ranges = {};
        room = sliceSize;
      }
    }
  });
  if (Object.keys(ranges).length > 0) {
    slices.push(ranges);
  }

  return slices.map((sliceRanges, index) => ({
    ranges: sliceRanges,
    first: index === 0,
    last: index === slices.length - 1,
  }));
};

export const fetchPaginatedList = async (
  createAsyncRequest,
  reportId,
  endpointPath,
  filter,
  outputKey,
  batchSize,
  range = {},
) => {
  let allItems = [];
  const start = range.offset ?? 0;

  const fetchPage = async (limit, offset) => {
    return await createAsyncRequest('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit, offset, filter },
    });
  };

  try {
    const initialResponse = await fetchPage(batchSize, start);

    const firstPageItems = initialResponse.data || [];
    allItems.push(...firstPageItems);

    const totalItems = initialResponse.meta?.total || 0;
    const end =
      range.limit === undefined
        ? totalItems
        : Math.min(totalItems, start + range.limit);
    const pagePromises = [];

    for (let offset = start + batchSize; offset < end; offset += batchSize) {
      pagePromises.push(fetchPage(batchSize, offset));
    }

    const batchedResults = await Promise.all(pagePromises);
    const remainingItems = batchedResults.flatMap(
      (response) => response.data || [],
    );

    allItems.push(...remainingItems);

    return { [outputKey]: allItems.slice(0, range.limit) };
  } catch ({}) {
    return { [outputKey]: [] };
  }
};

export const fetchUnsupportedSystemsWithExpectedSSG = async (
  createAsyncRequest,
  reportId,
  osMajorVersion,
  refId,
  range,
) => {
  try {
    const { unsupported_systems: rawUnsupportedSystems } =
      await fetchPaginatedList(
        createAsyncRequest,
        reportId,
        '/test_results',
        'supported = false',
        'unsupported_systems',
        50,
        range,
      );

    if (rawUnsupportedSystems.length === 0) {
      return { unsupported_systems: [] };
    }

    const uniqueOsMinorVersions = new Set();
    rawUnsupportedSystems.forEach((system) => {
      uniqueOsMinorVersions.add(system.os_minor_version);
    });

    // Fetch security guides for each unique OS minor version
    const securityGuidePromises = Array.from(uniqueOsMinorVersions).map(
      async (osMinorVersion) => {
        try {
          const response = await createAsyncRequest('compliance', {
            method: 'GET',
            url: `${API_BASE_URL}/security_guides`,
            params: {
              limit: 1, // Interested in latest version
              filter: `os_major_version=${osMajorVersion} AND supported_profile=${refId}:${osMinorVersion}`,
              sort_by: `version:desc`,
            },
          });

          if (response.data && response.data.length > 0) {
            return {
              osMinorVersion: osMinorVersion,
              expectedVersion: response.data[0].version,
            };
          }
          return null;
        } catch ({}) {
          return null;
        }
      },
    );

    const securityGuideResults = (
      await Promise.all(securityGuidePromises)
    ).filter(Boolean);

    const expectedSsgVersionMap = new Map();
    securityGuideResults.forEach((result) => {
      expectedSsgVersionMap.set(result.osMinorVersion, result.expectedVersion);
    });

    // Populate expected_security_guide_version for each unsupported system
    const mutatedUnsupportedSystems = rawUnsupportedSystems.map((system) => {
      const expectedSsgVersion =
        expectedSsgVersionMap.get(system.os_minor_version) || 'N/A';
      return {
        ...system,
        expected_security_guide_version: expectedSsgVersion,
      };
    });

    return { unsupported_systems: mutatedUnsupportedSystems };
  } catch ({}) {
    return { unsupported_systems: [] };
  }
};
