import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ComplianceDetails from './ComplianceDetails';

jest.mock('Utilities/hooks/useFeatureFlag', () => () => true);
jest.mock('../SmartComponents/SystemDetails/useTestResults', () =>
  jest.fn(() => ({
    testResultsLoading: false,
    testResults: [],
  })),
);
jest.mock('Utilities/hooks/api/useSystem', () =>
  jest.fn(() => ({
    data: { data: { policies: [] } },
    loading: false,
  })),
);

describe('ComplianceDetails (federated module)', () => {
  it('renders correctly when connectedToInsights is true (NoPoliciesState under EnvironmentProvider)', () => {
    render(
      <TestWrapper>
        <ComplianceDetails inventoryId="test-id" connectedToInsights={true} />
      </TestWrapper>,
    );

    expect(
      screen.getByText(
        'This system is not part of any SCAP policies defined within Compliance.',
      ),
    ).toBeInTheDocument();
  });

  it('renders correctly when connectedToInsights is false (NotConnected)', () => {
    render(
      <TestWrapper>
        <ComplianceDetails inventoryId="test-id" connectedToInsights={false} />
      </TestWrapper>,
    );

    expect(
      screen.getByText('Learn how to activate the Insights client'),
    ).toBeInTheDocument();
  });
});
