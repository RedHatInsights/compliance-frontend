import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { profiles } from '@/__fixtures__/profiles.js';
import { CompliancePolicies } from './CompliancePolicies.js';

jest.mock('@apollo/client');

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
TestWrapper.propTypes = { children: propTypes.node };

describe('CompliancePolicies', () => {
  const queryRefetch = jest.fn();
  const queryDefaults = {
    error: undefined,
    loading: undefined,
    refetch: queryRefetch,
  };
  it('expect to render without error', async () => {
    useQuery.mockImplementation(() => ({
      ...queryDefaults,
      data: profiles,
    }));

    const { container } = render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(
      container.querySelectorAll('[data-ouia-component-type="PF4/TableRow"]')
        .length
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

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.findByText('No policies')).not.toBeNull();
  });

  it('expect to render an error', () => {
    const error = {
      networkError: { statusCode: 500 },
      error: 'Test Error loading',
    };
    useQuery.mockImplementation(() => ({
      ...queryDefaults,
      error,
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.findByText(error.error)).not.toBeNull();
  });

  it('expect to render loading', () => {
    useQuery.mockImplementation(() => ({
      ...queryDefaults,
      loading: true,
    }));

    const { container } = render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.findByText('No policies')).not.toBeNull();
    expect(
      container.querySelectorAll('[data-ouia-component-type="PF4/TableRow"]')
        .length
    ).toEqual(6);
  });
});
