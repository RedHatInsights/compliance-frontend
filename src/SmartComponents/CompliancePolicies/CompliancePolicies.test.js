import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';

import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';

import { buildPoliciesV2 } from '../../__factories__/policies';

import CompliancePolicies from './CompliancePolicies.js';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import usePoliciesCount from 'Utilities/hooks/usePoliciesCount';

jest.mock('Utilities/hooks/api/usePolicies');
jest.mock('Utilities/hooks/usePoliciesCount');

const policies = buildPoliciesV2(13);

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
TestWrapper.propTypes = { children: propTypes.node };

describe('CompliancePolicies', () => {
  const queryRefetch = jest.fn();
  const queryDefaults = {
    error: undefined,
    loading: undefined,
    refetch: queryRefetch,
  };

  beforeEach(() => {
    usePolicies.mockImplementation(() => ({
      ...queryDefaults,
      data: policies,
      meta: {
        total: policies.length,
      },
    }));
    usePoliciesCount.mockImplementation(() => policies.length);
  });

  it.only('expect to render without error', () => {
    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );
    screen.logTestingPlaygroundURL();
    expect(
      within(screen.getByLabelText('Policies')).queryAllByRole('row').length
    ).toEqual(11);
  });

  it('expect to render emptystate', () => {
    usePolicies.mockImplementation(() => ({
      ...queryDefaults,
      data: [],
      meta: {
        total: 0,
      },
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
    usePolicies.mockImplementation(() => ({
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
    usePolicies.mockImplementation(() => ({
      ...queryDefaults,
      loading: true,
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Policies loading')).toBeInTheDocument(1);
  });
});
