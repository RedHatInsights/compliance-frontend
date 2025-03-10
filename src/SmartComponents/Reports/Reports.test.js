import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper.js';

import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';
import useReportsCount from 'Utilities/hooks/useReportsCount.js';
import useReportsOS from 'Utilities/hooks/api/useReportsOs.js';

import Reports from './Reports.js';

jest.mock('@/Utilities/hooks/api/useReports');
jest.mock('Utilities/hooks/api/useComplianceQuery', () => jest.fn());
jest.mock('Utilities/hooks/api/useReportsOs', () => jest.fn());
jest.mock('Utilities/hooks/useReportsCount', () => jest.fn());

describe('Reports', () => {
  it('Reports rendered with empty state', async () => {
    useReportsCount.mockImplementation(() => 0);
    useReportsOS.mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      refetch: () => {},
    }));
    useComplianceQuery.mockImplementation(() => ({
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
    expect(useComplianceQuery).toHaveBeenCalled();

    expect(
      await screen.findByRole('button', { name: 'Create new policy' })
    ).toBeInTheDocument();
    expect(screen.getByText('No policies are reporting')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Learn about OpenSCAP and Compliance' })
    ).toBeInTheDocument();
  });
});
