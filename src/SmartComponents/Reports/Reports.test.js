import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper.js';

import { useQuery } from '@apollo/client';
import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';
import useReportsCount from 'Utilities/hooks/useReportsCount.js';
import useReportsOS from 'Utilities/hooks/api/useReportsOs.js';
import { profiles } from '@/__fixtures__/profiles.js';

import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag.js';
import Reports from './Reports.js';

jest.mock('@apollo/client');
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('@/Utilities/hooks/api/useReports');
jest.mock('Utilities/hooks/api/useComplianceQuery', () => jest.fn());
jest.mock('Utilities/hooks/api/useReportsOs', () => jest.fn());
jest.mock('Utilities/hooks/useReportsCount', () => jest.fn());

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

  it('should use REST api', async () => {
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
