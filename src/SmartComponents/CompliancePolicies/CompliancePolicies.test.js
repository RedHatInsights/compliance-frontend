import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';

import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { CompliancePolicies } from './CompliancePolicies.js';
import { usePoliciesQuery } from '../../Utilities/hooks/usePoliciesQuery/usePoliciesQuery';
import fixtures from '../../../cypress/fixtures/compliancePolicies2.json';

jest.mock('@apollo/client');

jest.mock('../../Utilities/hooks/usePoliciesQuery/usePoliciesQuery');

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
TestWrapper.propTypes = { children: propTypes.node };

describe('CompliancePolicies', () => {
  const queryRefetch = jest.fn();
  const queryDefaults = {
    error: undefined,
    loading: undefined,
    refetch: queryRefetch,
  };

  it('expect to render without error', () => {
    usePoliciesQuery.mockImplementation(() => ({
      ...queryDefaults,
      data: fixtures,
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(
      within(screen.getByLabelText('Policies')).queryAllByRole('row').length
    ).toEqual(11);
  });

  it('expect to render emptystate', () => {
    useQuery.mockImplementation(() => ({
      ...queryDefaults,
      data: {
        profiles: {
          edges: [],
        },
      },
    }));

    usePoliciesQuery.mockImplementation(() => ({
      ...queryDefaults,
      data: { data: [] },
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByText('No policies')).toBeInTheDocument();
  });

  it('expect to render an error', () => {
    const error = {
      networkError: { statusCode: 500 },
      error: 'Test Error loading',
    };

    usePoliciesQuery.mockImplementation(() => ({
      ...queryDefaults,
      error,
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('expect to render loading', () => {
    useQuery.mockImplementation(() => ({
      ...queryDefaults,
      loading: true,
    }));
    const useQuery2 = () => ({
      ...queryDefaults,
      loading: true,
    });

    usePoliciesQuery.mockImplementation(() => {
      const { data, error, loading, refetch } = useQuery2();

      const policiesWithOldId = data
        ? data?.data?.map((policy) => {
            return { ...policy, old_id: policy.id };
          })
        : null;

      return { data: policiesWithOldId, loading, error, refetch };
    });

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(
      within(screen.getByLabelText('Policies')).getAllByText('Loading...')
        .length
    ).toEqual(5);
  });
});
