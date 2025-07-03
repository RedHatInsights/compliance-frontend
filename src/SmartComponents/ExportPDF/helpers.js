import { API_BASE_URL } from '@/constants';

export const fetchPaginatedList = async (
  createAsyncRequest,
  reportId,
  endpointPath,
  filter,
  outputKey,
  batchSize,
) => {
  let allItems = [];

  const fetchPage = async (limit, offset) => {
    return await createAsyncRequest('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit, offset, filter },
    });
  };

  try {
    const initialResponse = await fetchPage(batchSize, 0);

    const firstPageItems = initialResponse.data || [];
    allItems.push(...firstPageItems);

    const totalItems = initialResponse.meta?.total || 0;

    if (totalItems <= batchSize) {
      return { [outputKey]: allItems };
    }

    const totalPages = Math.ceil(totalItems / batchSize);
    const pagePromises = [];

    for (let pageIdx = 1; pageIdx < totalPages; pageIdx++) {
      pagePromises.push(fetchPage(batchSize, pageIdx * batchSize));
    }

    const batchedResults = await Promise.all(pagePromises);
    const remainingItems = batchedResults.flatMap(
      (response) => response.data || [],
    );

    allItems.push(...remainingItems);

    return { [outputKey]: allItems };
  } catch ({}) {
    return { [outputKey]: [] };
  }
};

export const fetchUnsupportedSystemsWithExpectedSSG = async (
  createAsyncRequest,
  reportId,
  osMajorVersion,
  refId,
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
