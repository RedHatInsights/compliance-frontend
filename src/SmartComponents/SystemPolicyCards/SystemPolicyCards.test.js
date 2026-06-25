import { useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { SystemPolicyCards } from './SystemPolicyCards';
import testResults from '../../__factories__/testResults';

jest.mock('Utilities/hooks/api/useSystemReports');
jest.mock('Utilities/hooks/api/useReportTestResults');
jest.mock('react-router-dom');

describe('SystemPolicyCards', () => {
  const testResultsData = testResults.buildList(2);
  const testResultsMock = testResultsData.map((testResult, index) => ({
    ...testResult,
    report_id: `report-${index}`,
    title: `Policy ${index}`,
    profile_title: `Profile ${index}`,
  }));

  beforeEach(() => {
    useParams.mockReturnValue({
      inventoryId: 'abc',
    });
  });

  it('shows card with data for loaded policy', () => {
    const singlePolicyMock = [testResultsMock[0]];
    render(<SystemPolicyCards reportTestResults={singlePolicyMock} />);

    screen.getByRole('heading', {
      name: singlePolicyMock[0].title,
    });
    screen.getByText(
      singlePolicyMock[0].compliant ? 'Compliant' : 'Not compliant',
    );
    screen.getByText(
      `${singlePolicyMock[0].failed_rule_count} rule${
        singlePolicyMock[0].failed_rule_count > 1 ||
        singlePolicyMock[0].failed_rule_count === 0
          ? 's'
          : ''
      } failed`,
    );
    screen.getByText(
      `SSG version: ${singlePolicyMock[0].security_guide_version}`,
    );
  });

  it('calls onSelectPolicy when a card is clicked', async () => {
    const onSelectPolicy = jest.fn();
    const user = userEvent.setup();

    render(
      <SystemPolicyCards
        reportTestResults={testResultsMock}
        selectedPolicy="report-0"
        onSelectPolicy={onSelectPolicy}
      />,
    );

    const clickableButtons = screen.getAllByLabelText(/Select Policy/i);

    await user.click(clickableButtons[1]);

    expect(onSelectPolicy).toHaveBeenCalledWith('report-1');
  });

  it('renders multiple policy cards', () => {
    render(
      <SystemPolicyCards
        reportTestResults={testResultsMock}
        selectedPolicy="report-1"
        onSelectPolicy={jest.fn()}
      />,
    );

    screen.getByRole('heading', { name: testResultsMock[0].title });
    screen.getByRole('heading', { name: testResultsMock[1].title });
  });
});
