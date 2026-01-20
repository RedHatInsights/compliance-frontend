import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';

import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';

import CompliancePolicies from './CompliancePolicies.js';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import { buildPolicies } from '../../__factories__/policies';

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
TestWrapper.propTypes = { children: propTypes.node };

const policiesData = buildPolicies(11);
jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());
jest.mock('Utilities/hooks/useFeatureFlag', () => () => true);
jest.mock('Utilities/hooks/usePermissionCheck', () => ({
  useKesselPermissions: jest.fn(() => ({ hasAccess: true, isLoading: false })),
}));

describe('CompliancePolicies', () => {
  it('expect to render without error', () => {
    usePolicies.mockImplementation(({ onlyTotal }) =>
      !onlyTotal
        ? {
            data: { data: policiesData, meta: { total: policiesData.length } },
            loading: false,
            error: null,
            refetch: () => {},
          }
        : { data: policiesData.length },
    );

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>,
    );
    const tableRowsLength = policiesData.length + 1; // th also has 1 row

    expect(
      within(screen.getByLabelText('Policies')).queryAllByRole('row').length,
    ).toEqual(tableRowsLength);
  });

  it('expect to render emptystate', () => {
    usePolicies.mockImplementation(() => ({
      data: 0,
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>,
    );

    expect(screen.getByText('No policies')).toBeInTheDocument();
  });

  it('expect to render an error on total request', () => {
    usePolicies.mockImplementation(() => ({
      data: undefined,
      loading: false,
      error: 'Something went wrong',
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('expect to render an error on data request', () => {
    usePolicies.mockImplementation(({ onlyTotal }) =>
      !onlyTotal
        ? {
            data: undefined,
            loading: false,
            error: 'Something went wrong',
            refetch: () => {},
          }
        : { data: policiesData.length },
    );

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('expect to render loading', () => {
    usePolicies.mockImplementation(() => ({ data: undefined, loading: true }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Contents')).toHaveAttribute(
      'aria-valuetext',
      'Loading...',
    );
  });
});
