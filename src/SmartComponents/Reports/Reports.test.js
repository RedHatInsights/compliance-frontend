import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper.js';

import usePolicies from 'Utilities/hooks/api/usePolicies';
import useReports from 'Utilities/hooks/api/useReports';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';

import Reports from './Reports.js';

// TODO We might want to rather mock the useComplianceWuery hook and assert that the correct params were passed as well.
jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());
jest.mock('Utilities/hooks/api/useReports', () => jest.fn());
jest.mock('Utilities/hooks/api/useReportsOs', () => jest.fn());

describe('Reports', () => {
  it('expect to render an error on total request', () => {
    useReports.mockImplementation(() => ({
      data: undefined,
      loading: false,
      error: 'Something went wrong',
    }));
    useReportsOS.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: undefined,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
  it('expect to render an error on data request', () => {
    useReportsOS.mockImplementation(() => ({
      data: { data: [7] },
      loading: false,
      error: null,
      refetch: () => {},
    }));
    useReports.mockImplementation(({ onlyTotal }) =>
      !onlyTotal
        ? {
            data: undefined,
            loading: false,
            error: 'Something went wrong',
            refetch: () => {},
          }
        : { data: 1 }
    );

    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('expect to render loading', () => {
    useReports.mockImplementation(() => ({ data: undefined, loading: true }));
    useReportsOS.mockImplementation(() => ({ data: undefined, loading: true }));

    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Contents')).toHaveAttribute(
      'aria-valuetext',
      'Loading...'
    );
  });

  it('Reports rendered with empty state', async () => {
    usePolicies.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: null,
      refetch: () => {},
    }));
    useReportsOS.mockImplementation(() => ({
      data: { data: [] },
      loading: false,
      error: null,
      refetch: () => {},
    }));
    useReports.mockImplementation(({ onlyTotal }) =>
      !onlyTotal
        ? {
            data: { data: [], meta: { total: 0 } },
            loading: false,
            error: null,
            refetch: () => {},
          }
        : { data: 0 }
    );

    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

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
