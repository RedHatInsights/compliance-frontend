import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RuleResultsWrapper from './RuleResults';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import { buildTestResults } from '@/__factories__/ruleResults';

jest.mock('Utilities/hooks/api/useReportRuleResults', () => jest.fn());

const fetchAllIds = jest.fn();

describe('RuleResults', () => {
  const reportTestResult = {
    id: 'test-id',
    report_id: 'report-id',
    title: 'Test Report',
  };

  it('renders', () => {
    useReportRuleResults.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: null,
      refetch: () => {},
    }));
    render(<RuleResultsWrapper reportTestResult={reportTestResult} />);

    expect(screen.getByText(/no matching results found/i)).toBeInTheDocument();
  });

  it('renders Select all in bulk select dropdown', async () => {
    const testResults = buildTestResults(11);

    useReportRuleResults.mockImplementation(() => ({
      data: {
        data: testResults.slice(0, 10),
        meta: { total: testResults.length },
      },
      loading: false,
      error: null,
      fetchAllIds,
    }));
    render(<RuleResultsWrapper reportTestResult={reportTestResult} />);
    screen
      .getByRole('button', {
        name: /0 selected/i,
      })
      .click();

    await waitFor(() => {
      expect(screen.getByText('Select all (11 items)')).toBeInTheDocument();
    });

    screen.getByText('Select all (11 items)').click();
    expect(fetchAllIds).toHaveBeenCalled();
  });
});
