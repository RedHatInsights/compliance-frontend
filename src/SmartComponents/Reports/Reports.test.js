import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper.js';

import usePolicies from 'Utilities/hooks/api/usePolicies';
import useReports from 'Utilities/hooks/api/useReports';
import useReportsCount from 'Utilities/hooks/useReportsCount';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';

import Reports from './Reports.js';

// TODO We might want to rather mock the useComplianceWuery hook and assert that the correct params were passed as well.
jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());
jest.mock('Utilities/hooks/api/useReports', () => jest.fn());
jest.mock('Utilities/hooks/api/useReportsOs', () => jest.fn());
jest.mock('Utilities/hooks/useReportsCount', () => jest.fn());

describe('Reports', () => {
  it('Reports rendered with empty state', async () => {
    useReportsCount.mockImplementation(() => 0);
    usePolicies.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: null,
      refetch: () => {},
    }));
    useReportsOS.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: null,
      refetch: () => {},
    }));
    useReports.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(useReportsCount).toHaveBeenCalled();
    expect(useReportsOS).toHaveBeenCalled();
    expect(useReports).toHaveBeenCalled();

    expect(
      await screen.findByRole('button', { name: 'Create new policy' })
    ).toBeInTheDocument();
    expect(screen.getByText('No policies are reporting')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Learn about OpenSCAP and Compliance' })
    ).toBeInTheDocument();
  });
});
