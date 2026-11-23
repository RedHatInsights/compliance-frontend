import {
  PDF_MAX_SLICE_SIZE,
  PDF_SLICE_THRESHOLD,
  buildReportPdfSlices,
  fetchPaginatedList,
  fetchUnsupportedSystemsWithExpectedSSG,
} from './helpers';
import { API_BASE_URL } from '@/constants';

describe('fetchPaginatedList', () => {
  let createAsyncRequest;
  const reportId = '123-456';
  const endpointPath = '/items';
  const filter = 'foo=bar';
  const outputKey = 'paginatedItems';
  const batchSize = 2;

  beforeEach(() => {
    createAsyncRequest = jest.fn();
  });

  const generateMockData = (count) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: `item-${i}`,
        name: `Item ${i}`,
      });
    }
    return items;
  };

  it('should fetch all items when total items are less than or equal to batch size', async () => {
    createAsyncRequest.mockResolvedValueOnce({
      data: generateMockData(batchSize),
      meta: { total: batchSize },
    });

    const result = await fetchPaginatedList(
      createAsyncRequest,
      reportId,
      endpointPath,
      filter,
      outputKey,
      batchSize,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(1);
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit: batchSize, offset: 0, filter },
    });

    expect(result).toEqual({ [outputKey]: generateMockData(batchSize) });
  });

  it('should fetch all items across multiple pages', async () => {
    const totalItems = 5;
    const firstPageData = generateMockData(batchSize);
    const secondPageData = generateMockData(batchSize);
    const thirdPageData = generateMockData(1);

    createAsyncRequest
      .mockResolvedValueOnce({
        data: firstPageData,
        meta: { total: totalItems },
      })
      .mockResolvedValueOnce({
        data: secondPageData,
        meta: { total: totalItems },
      })
      .mockResolvedValueOnce({
        data: thirdPageData,
        meta: { total: totalItems },
      });

    const result = await fetchPaginatedList(
      createAsyncRequest,
      reportId,
      endpointPath,
      filter,
      outputKey,
      batchSize,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(3);

    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit: batchSize, offset: 0, filter },
    });
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit: batchSize, offset: batchSize, filter },
    });
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit: batchSize, offset: 4, filter },
    });

    const expectedItems = [
      ...firstPageData,
      ...secondPageData,
      ...thirdPageData,
    ];
    expect(result).toEqual({ [outputKey]: expectedItems });
  });

  it('should return an empty array if the initial fetch returns no data', async () => {
    createAsyncRequest.mockResolvedValueOnce({
      data: [],
      meta: { total: 0 },
    });

    const result = await fetchPaginatedList(
      createAsyncRequest,
      reportId,
      endpointPath,
      filter,
      outputKey,
      batchSize,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ [outputKey]: [] });
  });

  it('should return an empty array on an error during initial fetch', async () => {
    createAsyncRequest.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchPaginatedList(
      createAsyncRequest,
      reportId,
      endpointPath,
      filter,
      outputKey,
      batchSize,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ [outputKey]: [] });
  });

  it('should return an empty array on an error during subsequent fetches', async () => {
    const totalItems = 5;
    const firstPageData = generateMockData(batchSize, 0);

    createAsyncRequest
      .mockResolvedValueOnce({
        data: firstPageData,
        meta: { total: totalItems },
      })
      .mockRejectedValueOnce(new Error('Subsequent network error'));

    const result = await fetchPaginatedList(
      createAsyncRequest,
      reportId,
      endpointPath,
      filter,
      outputKey,
      batchSize,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ [outputKey]: [] });
  });
});

describe('fetchPaginatedList with a range', () => {
  const page = (offset, count, total) => ({
    data: Array.from({ length: count }, (_, i) => ({ id: offset + i })),
    meta: { total },
  });

  it('loads only the pages that cover the range and trims to its size', async () => {
    const createAsyncRequest = jest.fn(async (_service, { params }) =>
      page(params.offset, params.limit, 100),
    );

    const result = await fetchPaginatedList(
      createAsyncRequest,
      'r1',
      '/items',
      'foo=bar',
      'items',
      10,
      { offset: 20, limit: 25 },
    );

    expect(
      createAsyncRequest.mock.calls.map(([, { params }]) => params.offset),
    ).toEqual([20, 30, 40]);
    expect(result.items.map(({ id }) => id)).toEqual(
      Array.from({ length: 25 }, (_, i) => 20 + i),
    );
  });

  it('runs to the last row when the range has no limit', async () => {
    const createAsyncRequest = jest.fn(async (_service, { params }) =>
      page(params.offset, Math.min(params.limit, 45 - params.offset), 45),
    );

    const result = await fetchPaginatedList(
      createAsyncRequest,
      'r1',
      '/items',
      'foo=bar',
      'items',
      10,
      { offset: 30 },
    );

    expect(
      createAsyncRequest.mock.calls.map(([, { params }]) => params.offset),
    ).toEqual([30, 40]);
    expect(result.items).toHaveLength(15);
  });
});

describe('buildReportPdfSlices', () => {
  const allSettings = {
    compliantSystems: true,
    nonCompliantSystems: true,
    unsupportedSystems: true,
    nonReportingSystems: true,
  };
  const report = (nonCompliant, unsupported, nonReporting, compliant) => ({
    assigned_system_count:
      nonCompliant + unsupported + nonReporting + compliant,
    reported_system_count: nonCompliant + unsupported + compliant,
    compliant_system_count: compliant,
    unsupported_system_count: unsupported,
  });

  it('sends one unsliced payload at or under the threshold', () => {
    expect(
      buildReportPdfSlices(report(PDF_SLICE_THRESHOLD, 0, 0, 0), allSettings),
    ).toEqual([undefined]);
    expect(buildReportPdfSlices(undefined, allSettings)).toEqual([undefined]);
  });

  it('ignores lists the export leaves out', () => {
    expect(
      buildReportPdfSlices(report(1500, 0, 0, 1500), {
        nonCompliantSystems: true,
      }),
    ).toEqual([undefined]);
  });

  it('splits one large list into even slices, the last open-ended', () => {
    const slices = buildReportPdfSlices(report(2500, 0, 0, 0), allSettings);

    expect(slices).toEqual([
      {
        ranges: { nonCompliantSystems: { offset: 0, limit: 834 } },
        first: true,
        last: false,
      },
      {
        ranges: { nonCompliantSystems: { offset: 834, limit: 834 } },
        first: false,
        last: false,
      },
      {
        ranges: { nonCompliantSystems: { offset: 1668 } },
        first: false,
        last: true,
      },
    ]);
  });

  it('packs lists in print order and covers every row once', () => {
    const slices = buildReportPdfSlices(
      report(1200, 300, 50, 1650),
      allSettings,
    );

    expect(slices.map(({ ranges }) => ranges)).toEqual([
      { nonCompliantSystems: { offset: 0, limit: 800 } },
      {
        nonCompliantSystems: { offset: 800 },
        unsupportedSystems: { offset: 0 },
        nonReportingSystems: { offset: 0 },
        compliantSystems: { offset: 0, limit: 50 },
      },
      { compliantSystems: { offset: 50, limit: 800 } },
      { compliantSystems: { offset: 850 } },
    ]);
    slices.forEach(({ ranges }) =>
      Object.values(ranges).forEach(({ limit }) =>
        expect(limit ?? 0).toBeLessThanOrEqual(PDF_MAX_SLICE_SIZE),
      ),
    );
  });
});

describe('fetchUnsupportedSystemsWithExpectedSSG', () => {
  let createAsyncRequest;

  const reportId = 'report-abc';
  const osMajorVersion = '8';
  const refId = 'xccdf-foo';

  beforeEach(() => {
    createAsyncRequest = jest.fn();

    jest.resetModules();

    createAsyncRequest.mockClear();
  });

  it('should fetch unsupported systems and populate expected security guide versions', async () => {
    const mockUnsupportedSystems = [
      {
        id: 'system-1',
        os_minor_version: '0',
        os_major_version: osMajorVersion,
        supported: false,
      },
      {
        id: 'system-2',
        os_minor_version: '1',
        os_major_version: osMajorVersion,
        supported: false,
      },
      {
        id: 'system-3',
        os_minor_version: '0',
        os_major_version: osMajorVersion,
        supported: false,
      }, // Duplicate minor version
    ];

    createAsyncRequest
      .mockResolvedValueOnce({
        data: mockUnsupportedSystems,
        meta: { total: mockUnsupportedSystems.length },
      })
      .mockResolvedValueOnce({
        data: [{ version: '1.0.1', id: '123' }], // For os_minor_version: '0'
      })
      .mockResolvedValueOnce({
        data: [{ version: '1.1.5', id: '321' }], // For os_minor_version: '1'
      });

    const result = await fetchUnsupportedSystemsWithExpectedSSG(
      createAsyncRequest,
      reportId,
      osMajorVersion,
      refId,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(3);
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}/test_results`,
      params: {
        limit: 50,
        filter: `supported = false`,
        offset: 0,
      },
    });
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/security_guides`,
      params: {
        limit: 1,
        filter: `os_major_version=${osMajorVersion} AND supported_profile=${refId}:0`,
        sort_by: `version:desc`,
      },
    });
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance', {
      method: 'GET',
      url: `${API_BASE_URL}/security_guides`,
      params: {
        limit: 1,
        filter: `os_major_version=${osMajorVersion} AND supported_profile=${refId}:1`,
        sort_by: `version:desc`,
      },
    });

    const expectedOutput = {
      unsupported_systems: [
        {
          ...mockUnsupportedSystems[0],
          expected_security_guide_version: '1.0.1',
        },
        {
          ...mockUnsupportedSystems[1],
          expected_security_guide_version: '1.1.5',
        },
        {
          ...mockUnsupportedSystems[2],
          expected_security_guide_version: '1.0.1',
        }, // same SSG as system 1 has
      ],
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty array if fetchPaginatedList returns no unsupported systems', async () => {
    createAsyncRequest.mockResolvedValueOnce({
      data: [],
      meta: { total: 0 },
    });

    const result = await fetchUnsupportedSystemsWithExpectedSSG(
      createAsyncRequest,
      reportId,
      osMajorVersion,
      refId,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ unsupported_systems: [] });
  });

  it('should handle cases where security guide fetch returns no data', async () => {
    const mockUnsupportedSystems = [
      {
        id: 'sys-1',
        os_minor_version: '0',
        os_major_version: osMajorVersion,
        supported: false,
      },
    ];

    createAsyncRequest
      .mockResolvedValueOnce({
        data: mockUnsupportedSystems,
        meta: { total: mockUnsupportedSystems.length },
      })
      .mockRejectedValueOnce({
        data: [],
      });

    const result = await fetchUnsupportedSystemsWithExpectedSSG(
      createAsyncRequest,
      reportId,
      osMajorVersion,
      refId,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      unsupported_systems: [
        {
          ...mockUnsupportedSystems[0],
          expected_security_guide_version: 'N/A',
        },
      ],
    });
  });

  it('should handle errors during security guide fetches gracefully', async () => {
    const mockUnsupportedSystems = [
      {
        id: 'sys-1',
        os_minor_version: '0',
        os_major_version: osMajorVersion,
        supported: false,
      },
      {
        id: 'sys-2',
        os_minor_version: '1',
        os_major_version: osMajorVersion,
        supported: false,
      },
    ];

    createAsyncRequest
      .mockResolvedValueOnce({
        data: mockUnsupportedSystems,
        meta: { total: mockUnsupportedSystems.length },
      })
      .mockResolvedValueOnce({
        data: [{ version: '1.0.1', id: 'sg-101' }],
      })
      .mockRejectedValueOnce(new Error('Security guide fetch failed'));

    const result = await fetchUnsupportedSystemsWithExpectedSSG(
      createAsyncRequest,
      reportId,
      osMajorVersion,
      refId,
    );

    expect(createAsyncRequest).toHaveBeenCalledTimes(3);

    const expectedOutput = {
      unsupported_systems: [
        {
          ...mockUnsupportedSystems[0],
          expected_security_guide_version: '1.0.1',
        },
        {
          ...mockUnsupportedSystems[1],
          expected_security_guide_version: 'N/A',
        }, // 'N/A' due to error
      ],
    };
    expect(result).toEqual(expectedOutput);
  });
});
