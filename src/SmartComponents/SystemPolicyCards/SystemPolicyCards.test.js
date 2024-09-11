import { useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { useSystemReports } from '../../Utilities/hooks/api/useSystemReports';
import { SystemPolicyCards } from './SystemPolicyCards';
import { useReportTestResults } from '../../Utilities/hooks/api/useReportTestResults';
import { fixturesReportTestResults, fixturesSystemReports } from './fixtures';

jest.mock('../../Utilities/hooks/api/useSystemReports');
jest.mock('../../Utilities/hooks/api/useReportTestResults');
jest.mock('react-router-dom');

describe('SystemPolicyCards', () => {
  beforeEach(() => {
    useParams.mockReturnValue({
      inventoryId: 'abc',
    });
  });

  it('shows placeholders in loading state', () => {
    useSystemReports.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    screen.getByRole('progressbar', { name: 'Loading policies' });
  });

  it('shows placeholders for almost loaded policies', () => {
    useSystemReports.mockImplementation(() => ({
      data: fixturesSystemReports,
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    expect(
      screen.getAllByRole('progressbar', { name: 'Loading policy' })
    ).toHaveLength(fixturesSystemReports.data.length);
  });

  it('shows card with data for loaded policy', () => {
    useSystemReports.mockImplementation(() => ({
      data: { data: [fixturesSystemReports.data[0]] },
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: fixturesReportTestResults,
      loading: false,
    }));
    render(<SystemPolicyCards />);

    screen.getByRole('heading', {
      name: fixturesSystemReports.data[0].title,
    });
    screen.getByText(
      fixturesReportTestResults.data[0].compliant
        ? 'Compliant'
        : 'Not compliant'
    );
    screen.getByText(
      `${fixturesReportTestResults.data[0].failed_rule_count} rules failed`
    );
    screen.getByText(
      `SSG version: ${fixturesReportTestResults.data[0].security_guide_version}`
    );
  });

  it('requests system reports with system id', () => {
    useSystemReports.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    expect(useSystemReports).toBeCalledWith({ limit: 100, systemId: 'abc' });
  });

  it('requests test results with with report and system id', () => {
    useSystemReports.mockImplementation(() => ({
      data: { data: [fixturesSystemReports.data[0]] },
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    expect(useReportTestResults).toBeCalledWith({
      filter: 'system_id=abc',
      reportId: '0de744d1-b00d-4b6c-a524-de0eb94dbe97',
    });
  });
});
