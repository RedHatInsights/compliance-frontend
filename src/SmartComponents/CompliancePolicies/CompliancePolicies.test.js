import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';

import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { profiles } from '@/__fixtures__/profiles.js';
import CompliancePolicies from './CompliancePolicies.js';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

jest.mock('@apollo/client');
jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');

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
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });

  it('expect to render without error', () => {
    useQuery.mockImplementation(() => ({
      ...queryDefaults,
      data: profiles,
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
    useQuery.mockImplementation(() => ({
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

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Policies loading')).toBeInTheDocument(1);
  });
});
