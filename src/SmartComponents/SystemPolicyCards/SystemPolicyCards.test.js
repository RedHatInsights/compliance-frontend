import { useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SystemPolicyCards } from './SystemPolicyCards';
import testResults from '../../__factories__/testResults';

jest.mock('Utilities/hooks/api/useSystemReports');
jest.mock('Utilities/hooks/api/useReportTestResults');
jest.mock('react-router-dom');

describe('SystemPolicyCards', () => {
  const testResultsData = testResults.buildList(1);
  const testResultsMock = testResultsData.map((testResult) => ({
    ...testResult,
    report_id: 'abc',
    title: 'xyz',
    profile_title: 'xyz',
  }));

  beforeEach(() => {
    useParams.mockReturnValue({
      inventoryId: 'abc',
    });
  });

  it('shows card with data for loaded policy', () => {
    render(<SystemPolicyCards reportTestResults={testResultsMock} />);

    screen.getByRole('heading', {
      name: testResultsMock[0].title,
    });
    screen.getByText(
      testResultsMock[0].compliant ? 'Compliant' : 'Not compliant'
    );
    screen.getByText(
      `${testResultsMock[0].failed_rule_count} rule${
        testResultsMock[0].failed_rule_count > 1 ||
        testResultsMock[0].failed_rule_count === 0
          ? 's'
          : ''
      } failed`
    );
    screen.getByText(
      `SSG version: ${testResultsMock[0].security_guide_version}`
    );
  });
});
