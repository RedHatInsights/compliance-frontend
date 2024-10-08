import { useParams } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useSystemReports } from '../../Utilities/hooks/api/useSystemReports';
import { SystemPolicyCards } from './SystemPolicyCards';
import { useReportTestResults } from '../../Utilities/hooks/api/useReportTestResults';
import systemReports from '../../__factories__/systemReports';
import testResults from '../../__factories__/testResults';

jest.mock('../../Utilities/hooks/api/useSystemReports');
jest.mock('../../Utilities/hooks/api/useReportTestResults');
jest.mock('react-router-dom');

describe('SystemPolicyCards', () => {
  const systemReportsData = systemReports.buildList(3);
  const testResultsData = testResults.buildList(1);

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

    screen.getAllByRole('progressbar', { name: 'Loading policy' });
  });

  it('shows placeholders for almost loaded policies', () => {
    useSystemReports.mockImplementation(() => ({
      data: { data: systemReportsData },
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    expect(
      screen.getAllByRole('progressbar', { name: 'Loading policy' })
    ).toHaveLength(systemReportsData.length);
  });

  it('shows card with data for loaded policy', async () => {
    useSystemReports.mockImplementation(() => ({
      data: { data: [systemReportsData[0]] },
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: { data: testResultsData, meta: { total: 1 } },
      loading: false,
    }));
    render(<SystemPolicyCards />);

    screen.getByRole('heading', {
      name: systemReportsData[0].title,
    });
    screen.getByText(
      testResultsData[0].compliant ? 'Compliant' : 'Not compliant'
    );
    screen.getByText(
      `${testResultsData[0].failed_rule_count} rule${
        testResultsData[0].failed_rule_count > 1 ||
        testResultsData[0].failed_rule_count === 0
          ? 's'
          : ''
      } failed`
    );
    screen.getByText(
      `SSG version: ${testResultsData[0].security_guide_version}`
    );
  });

  it('requests system reports with system id', async () => {
    useSystemReports.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    expect(useSystemReports).toBeCalledWith({ limit: 100, systemId: 'abc' });
  });

  it('requests test results with with report and system id', async () => {
    useSystemReports.mockImplementation(() => ({
      data: { data: [systemReportsData[0]] },
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: null,
      loading: true,
    }));
    render(<SystemPolicyCards />);

    expect(useReportTestResults).toBeCalledWith({
      filter: 'system_id=abc',
      reportId: systemReportsData[0].id,
    });
  });

  it('does not render a card for policy with no test results', async () => {
    useSystemReports.mockImplementation(() => ({
      data: { data: [systemReportsData[0]] },
      loading: false,
    }));
    useReportTestResults.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
    }));
    render(<SystemPolicyCards />);

    await waitFor(() => {
      expect(useReportTestResults).toBeCalled();
    });
    expect(
      screen.queryByText(systemReportsData[0].title)
    ).not.toBeInTheDocument();
  });
});
