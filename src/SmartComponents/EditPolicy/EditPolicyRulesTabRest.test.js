import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import EditPolicyRulesTab from './EditPolicyRulesTabRest.js';
// import Tailorings from '@/PresentationalComponents/Tailorings/Tailorings';

// eslint-disable-next-line react/display-name
jest.mock('@/PresentationalComponents/Tailorings/Tailorings', () => () => (
  <div data-testid="tailorings-tab">Tailorings tab</div> //TODO: do not mock the component, instead test with its behaviours
));

const defaultProps = {
  policy: { total_system_count: 1 },
  assignedRuleIds: [],
  setRuleValues: jest.fn(),
  setUpdatedPolicy: jest.fn(),
  selectedOsMinorVersions: [],
};

describe('EditPolicyRulesTab', () => {
  it.skip('expect to render note when no rules can be configured', () => {
    render(
      <TestWrapper>
        <EditPolicyRulesTab {...defaultProps} />
      </TestWrapper>
    );

    expect(
      screen.getByText(
        'Different release versions of RHEL are associated with different versions of the SCAP Security Guide (SSG), therefore each release must be customized independently.'
      )
    ).toBeInTheDocument();

    expect(screen.queryByTestId('tailorings-tab')).toBeVisible();
  });

  it('expect to render with empty state', () => {
    render(
      <TestWrapper>
        <EditPolicyRulesTab
          {...{ ...defaultProps, policy: { total_system_count: 0 } }}
        />
      </TestWrapper>
    );

    expect(
      screen.queryByText(
        'This policy has no associated systems, and therefore no rules can be configured.'
      )
    ).toBeVisible();
  });

  it('expect to render with loading state', () => {
    render(
      <TestWrapper>
        <EditPolicyRulesTab
          {...{ ...defaultProps, policy: { total_system_count: undefined } }}
        />
      </TestWrapper>
    );

    expect(screen.queryByText('Loading...')).toBeVisible();
  });
});
