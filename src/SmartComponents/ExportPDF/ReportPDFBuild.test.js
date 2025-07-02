import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { API_BASE_URL } from '@/constants';
import { fetchData } from './ReportPDFBuild';

import ReportPDFBuild from './ReportPDFBuild';
import PolicyDetailsSection from './PolicyDetailsSection';
import TopFailedRulesSection from './TopFailedRulesSection';
import SystemsTableSection from './SystemsTableSection';

jest.mock('./helpers', () => ({
  fetchPaginatedList: jest.fn(),
  fetchUnsupportedSystemsWithExpectedSSG: jest.fn(),
}));

import {
  fetchPaginatedList,
  fetchUnsupportedSystemsWithExpectedSSG,
} from './helpers';

describe('fetchData', () => {
  let createAsyncRequest;
  const mockReportId = 'test-report-id';
  const mockOptionsBase = {
    reportId: mockReportId,
    exportSettings: {
      topTenFailedRules: false,
      compliantSystems: false,
      nonCompliantSystems: false,
      nonReportingSystems: false,
      unsupportedSystems: false,
      userNotes: '',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    createAsyncRequest = jest.fn();
  });

  it('should fetch all data when all export settings are enabled and calls are successful', async () => {
    const options = {
      ...mockOptionsBase,
      exportSettings: {
        topTenFailedRules: true,
        compliantSystems: true,
        nonCompliantSystems: true,
        nonReportingSystems: true,
        unsupportedSystems: true,
        userNotes: 'Some user notes',
      },
    };

    createAsyncRequest
      .mockResolvedValueOnce({
        // report_details fetch
        data: {
          id: mockReportId,
          title: 'Test Report',
          os_major_version: 8,
          ref_id: 'xccdf_foo',
        },
      })
      .mockResolvedValueOnce({
        // top_failed_rules fetch
        top_failed_rules: [{ id: 'rule1', severity: 'medium' }],
      });

    fetchPaginatedList
      .mockResolvedValueOnce({ compliant_systems: [{ id: 'comp1' }] })
      .mockResolvedValueOnce({ non_compliant_systems: [{ id: 'noncomp1' }] })
      .mockResolvedValueOnce({ non_reporting_systems: [{ id: 'nonrep1' }] });

    fetchUnsupportedSystemsWithExpectedSSG.mockResolvedValueOnce({
      unsupported_systems: [
        { id: 'unsupp1', expected_security_guide_version: '1.0' },
      ],
    });

    const result = await fetchData(createAsyncRequest, options);

    expect(createAsyncRequest).toHaveBeenCalledTimes(2); // reportDetails & top failed rules
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${mockReportId}`,
    });
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${mockReportId}/stats`,
    });

    expect(fetchPaginatedList).toHaveBeenCalledTimes(3);
    expect(fetchPaginatedList).toHaveBeenCalledWith(
      createAsyncRequest,
      mockReportId,
      '/test_results',
      'compliant = true and supported = true',
      'compliant_systems',
      50,
    );
    expect(fetchPaginatedList).toHaveBeenCalledWith(
      createAsyncRequest,
      mockReportId,
      '/test_results',
      'compliant = false and supported = true',
      'non_compliant_systems',
      50,
    );
    expect(fetchPaginatedList).toHaveBeenCalledWith(
      createAsyncRequest,
      mockReportId,
      '/systems',
      'never_reported = true',
      'non_reporting_systems',
      50,
    );

    expect(fetchUnsupportedSystemsWithExpectedSSG).toHaveBeenCalledTimes(1);
    expect(fetchUnsupportedSystemsWithExpectedSSG).toHaveBeenCalledWith(
      createAsyncRequest,
      mockReportId,
      8,
      'xccdf_foo',
    );

    expect(result.data.length).toBe(6);
    expect(result.data[0]).toEqual({
      report_details: {
        id: mockReportId,
        title: 'Test Report',
        os_major_version: 8,
        ref_id: 'xccdf_foo',
      },
    });
    expect(result.data[1]).toEqual({
      top_failed_rules: [{ id: 'rule1', severity: 'medium' }],
    });
    expect(result.data[2]).toEqual({ compliant_systems: [{ id: 'comp1' }] });
    expect(result.data[3]).toEqual({
      non_compliant_systems: [{ id: 'noncomp1' }],
    });
    expect(result.data[4]).toEqual({
      non_reporting_systems: [{ id: 'nonrep1' }],
    });
    expect(result.data[5]).toEqual({
      unsupported_systems: [
        { id: 'unsupp1', expected_security_guide_version: '1.0' },
      ],
    });
    expect(result.options).toEqual(options);
  });

  it('should only fetch report details when no optional settings are enabled', async () => {
    const options = { ...mockOptionsBase };

    createAsyncRequest.mockResolvedValueOnce({
      data: {
        id: mockReportId,
        title: 'Test Report',
        os_major_version: 7,
        ref_id: 'xccdf_foo',
      },
    });

    const result = await fetchData(createAsyncRequest, options);

    expect(createAsyncRequest).toHaveBeenCalledTimes(1);
    expect(createAsyncRequest).toHaveBeenCalledWith('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${mockReportId}`,
    });

    expect(fetchPaginatedList).not.toHaveBeenCalled();
    expect(fetchUnsupportedSystemsWithExpectedSSG).not.toHaveBeenCalled();

    expect(result.data.length).toBe(6);
    expect(result.data[0]).toEqual({
      report_details: {
        id: mockReportId,
        title: 'Test Report',
        os_major_version: 7,
        ref_id: 'xccdf_foo',
      },
    });
    expect(result.data[1]).toEqual({ top_failed_rules: [] });
    expect(result.data[2]).toEqual({ compliant_systems: [] });
    expect(result.data[3]).toEqual({ non_compliant_systems: [] });
    expect(result.data[4]).toEqual({ non_reporting_systems: [] });
    expect(result.data[5]).toEqual({ unsupported_systems: [] });
  });

  it('should return empty top_failed_rules on fetch error when enabled', async () => {
    const options = {
      ...mockOptionsBase,
      exportSettings: { topTenFailedRules: true },
    };

    createAsyncRequest
      .mockResolvedValueOnce({
        data: { os_major_version: 8, ref_id: 'xccdf_foo' },
      }) // report details fetch
      .mockRejectedValueOnce(new Error('Top rules fetch failed')); // Top failed rules error

    const result = await fetchData(createAsyncRequest, options);

    expect(createAsyncRequest).toHaveBeenCalledTimes(2);
    expect(result.data[1]).toEqual({ top_failed_rules: [] });
  });

  it('should return empty compliant_systems on fetchPaginatedList error when enabled', async () => {
    const options = {
      ...mockOptionsBase,
      exportSettings: { compliantSystems: true },
    };

    createAsyncRequest.mockResolvedValueOnce({
      data: { os_major_version: 8, ref_id: 'xccdf_foo' },
    });
    fetchPaginatedList.mockResolvedValueOnce({ compliant_systems: [] }); // when error happens, we get an empty list

    const result = await fetchData(createAsyncRequest, options);

    expect(fetchPaginatedList).toHaveBeenCalledTimes(1);
    expect(fetchPaginatedList).toHaveBeenCalledWith(
      createAsyncRequest,
      mockReportId,
      '/test_results',
      'compliant = true and supported = true',
      'compliant_systems',
      50,
    );
    expect(result.data[2]).toEqual({ compliant_systems: [] });
  });

  it('should return empty unsupported_systems on fetchUnsupportedSystemsWithExpectedSSG error when enabled', async () => {
    const options = {
      ...mockOptionsBase,
      exportSettings: { unsupportedSystems: true },
    };

    createAsyncRequest.mockResolvedValueOnce({
      data: { os_major_version: 8, ref_id: 'xccdf_foo' },
    });

    fetchUnsupportedSystemsWithExpectedSSG.mockResolvedValueOnce({
      unsupported_systems: [],
    }); // when error happens, we get an empty list

    const result = await fetchData(createAsyncRequest, options);

    expect(fetchUnsupportedSystemsWithExpectedSSG).toHaveBeenCalledTimes(1);
    expect(fetchUnsupportedSystemsWithExpectedSSG).toHaveBeenCalledWith(
      createAsyncRequest,
      mockReportId,
      8,
      'xccdf_foo',
    );
    expect(result.data[5]).toEqual({ unsupported_systems: [] });
  });

  it('should include user notes in options when provided', async () => {
    const optionsWithNotes = {
      ...mockOptionsBase,
      exportSettings: {
        userNotes: 'My awesome notes',
      },
    };

    createAsyncRequest.mockResolvedValueOnce({
      data: { os_major_version: 8, ref_id: '' },
    });

    const result = await fetchData(createAsyncRequest, optionsWithNotes);

    expect(result.options.exportSettings.userNotes).toBe('My awesome notes');
  });
});

jest.mock('./PolicyDetailsSection', () =>
  jest.fn(() => <div>PolicyDetailsSection</div>),
);
jest.mock('./TopFailedRulesSection', () =>
  jest.fn(() => <div>TopFailedRulesSection</div>),
);
jest.mock('./SystemsTableSection', () =>
  jest.fn(() => <div>SystemsTableSection</div>),
);

describe('ReportPDFBuild', () => {
  const mockReportData = {
    id: 'report-id',
    title: 'Test Compliance Report',
    os_major_version: 8,
    ref_id: 'xccdf_foo',
  };

  const mockAsyncData = {
    data: {
      data: [
        { report_details: mockReportData },
        { top_failed_rules: [] },
        { compliant_systems: [] },
        { non_compliant_systems: [] },
        { non_reporting_systems: [] },
        { unsupported_systems: [] },
      ],
      options: {
        reportId: 'report-id',
        exportSettings: {
          topTenFailedRules: false,
          compliantSystems: false,
          nonCompliantSystems: false,
          nonReportingSystems: false,
          unsupportedSystems: false,
          userNotes: '',
        },
      },
    },
  };

  it('should render basic report details and Red Hat Insights title', () => {
    render(<ReportPDFBuild asyncData={mockAsyncData} />);

    expect(screen.getByText('Red Hat Insights')).toBeInTheDocument();
    expect(
      screen.getByText(`Compliance: ${mockReportData.title}`),
    ).toBeInTheDocument();
    expect(screen.getByText('PolicyDetailsSection')).toBeInTheDocument();

    expect(screen.queryByText('User notes:')).not.toBeInTheDocument();
    expect(screen.queryByText('TopFailedRulesSection')).not.toBeInTheDocument();
    expect(screen.queryByText('SystemsTableSection')).not.toBeInTheDocument();
  });

  it('does no renders sections that have empty data', () => {
    const mockAsyncDataModified = {
      data: {
        ...mockAsyncData.data,
        options: {
          ...mockAsyncData.data.options,
          exportSettings: {
            ...mockAsyncData.data.options.exportSettings,
            topTenFailedRules: true,
            compliantSystems: true,
            nonCompliantSystems: true,
            nonReportingSystems: true,
            unsupportedSystems: true,
          },
        },
      },
    };
    render(<ReportPDFBuild asyncData={mockAsyncDataModified} />);

    expect(screen.getByText('Red Hat Insights')).toBeInTheDocument();
    expect(
      screen.getByText(`Compliance: ${mockReportData.title}`),
    ).toBeInTheDocument();
    expect(screen.getByText('PolicyDetailsSection')).toBeInTheDocument();

    expect(screen.queryByText('TopFailedRulesSection')).not.toBeInTheDocument();
    expect(screen.queryByText('SystemsTableSection')).not.toBeInTheDocument();
  });

  it('should render all sections when all export settings are enabled and data is provided', () => {
    const fullAsyncData = {
      data: {
        data: [
          { report_details: mockReportData },
          { top_failed_rules: [{ id: 'ruleX' }] },
          { compliant_systems: [{ id: 'sysC' }] },
          { non_compliant_systems: [{ id: 'sysNC' }] },
          { non_reporting_systems: [{ id: 'sysNR' }] },
          { unsupported_systems: [{ id: 'sysUS' }] },
        ],
        options: {
          exportSettings: {
            topTenFailedRules: true,
            compliantSystems: true,
            nonCompliantSystems: true,
            nonReportingSystems: true,
            unsupportedSystems: true,
            userNotes: 'My cool notes',
          },
        },
      },
    };
    render(<ReportPDFBuild asyncData={fullAsyncData} />);

    expect(screen.getByText('Red Hat Insights')).toBeInTheDocument();
    expect(
      screen.getByText(`Compliance: ${mockReportData.title}`),
    ).toBeInTheDocument();
    expect(screen.getByText('User notes:')).toBeInTheDocument();
    expect(screen.getByText('My cool notes')).toBeInTheDocument();
    expect(screen.getByText('PolicyDetailsSection')).toBeInTheDocument();
    const systemsTableSections = screen.getAllByText('SystemsTableSection');
    expect(systemsTableSections).toHaveLength(4);
    expect(screen.getByText('TopFailedRulesSection')).toBeInTheDocument();

    expect(PolicyDetailsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        reportData: mockReportData,
      }),
      {},
    );
    expect(SystemsTableSection).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionTitle: 'Non-compliant systems',
        systemsData: [{ id: 'sysNC' }],
      }),
      {},
    );
    expect(SystemsTableSection).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionTitle: 'Systems with unsupported configuration',
        systemsData: [{ id: 'sysUS' }],
      }),
      {},
    );
    expect(SystemsTableSection).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionTitle: 'Systems never reported',
        systemsData: [{ id: 'sysNR' }],
      }),
      {},
    );
    expect(SystemsTableSection).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionTitle: 'Compliant systems',
        systemsData: [{ id: 'sysC' }],
      }),
      {},
    );
    expect(TopFailedRulesSection).toHaveBeenCalledWith(
      expect.objectContaining({
        rulesData: [{ id: 'ruleX' }],
      }),
      {},
    );
  });
});
