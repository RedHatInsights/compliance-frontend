import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper.js';

import { useQuery } from '@apollo/client';
import { profiles } from '@/__fixtures__/profiles.js';

import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag.js';
import Reports from './Reports.js';

jest.mock('@apollo/client');
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('@/Utilities/hooks/api/useReports');

describe('Reports - GraphQL', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });

  const queryResultDefaults = {
    error: undefined,
    loading: undefined,
    data: undefined,
    refetch: jest.fn(),
  };

  it('expect to render properly and show the profile(s)', () => {
    useQuery.mockImplementation(() => ({
      ...queryResultDefaults,
      data: profiles,
    }));
    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(screen.getAllByText('PCI-DSS').length).toEqual(10);
  });

  it('expect to render emptystate', () => {
    useQuery.mockImplementation(() => ({
      ...queryResultDefaults,
      data: {
        profiles: { edges: [] },
      },
    }));
    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Create new policy' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Learn about OpenSCAP and Compliance' })
    ).toBeInTheDocument();
  });

  it('expect to render loading', () => {
    useQuery.mockImplementation(() => ({
      ...queryResultDefaults,
      loading: true,
    }));
    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});

describe('Reports - REST', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => true);
  });

  it('should use REST api', () => {
    useQuery.mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <Reports />
      </TestWrapper>
    );

    expect(useQuery).toHaveBeenCalled();
  });
});
