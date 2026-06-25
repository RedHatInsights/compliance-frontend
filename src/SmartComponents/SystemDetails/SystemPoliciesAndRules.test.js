import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SystemPoliciesAndRules from './SystemPoliciesAndRules';
import testResults from '../../__factories__/testResults';

jest.mock('./RuleResults', () => ({
  __esModule: true,
  default: ({ reportTestResult }) => (
    <div data-testid={`rules-${reportTestResult.report_id}`}>
      Rules for {reportTestResult.title}
    </div>
  ),
}));

describe('SystemPoliciesAndRules', () => {
  const testResultsData = testResults.buildList(2);
  const testResultsMock = testResultsData.map((testResult, index) => ({
    ...testResult,
    report_id: `report-${index}`,
    title: `Policy ${index}`,
    profile_title: `Profile ${index}`,
  }));

  const defaultProps = {
    systemId: 'test-system-id',
    reportTestResults: testResultsMock,
    hidePassed: false,
    remediationsEnabled: true,
  };

  it('synchronizes tab selection when a card is clicked', async () => {
    const user = userEvent.setup();
    render(<SystemPoliciesAndRules {...defaultProps} />);

    const clickableButtons = screen.getAllByLabelText(/Select Policy/i);
    await user.click(clickableButtons[1]);

    expect(screen.getByRole('tab', { name: /Policy 1/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('synchronizes card selection when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<SystemPoliciesAndRules {...defaultProps} />);

    await user.click(screen.getByRole('tab', { name: /Policy 1/i }));

    const clickableButtons = screen.getAllByLabelText(/Select Policy/i);
    expect(clickableButtons[1].closest('.pf-v6-c-card')).toHaveClass(
      'pf-m-current',
    );
  });
});
