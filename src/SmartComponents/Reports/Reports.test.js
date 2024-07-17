import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import { useReports } from '../../Utilities/hooks/api/useReports';

import { reports } from '@/__fixtures__/reports.js';
import { Reports } from './Reports.js';

jest.mock('../../Utilities/hooks/api/useReports', () => ({
  ...jest.requireActual('../../Utilities/hooks/api/useReports'),
  useReports: jest.fn(),
}));

import { useQuery } from '@apollo/client';
import { profiles } from '@/__fixtures__/profiles.js';
jest.mock('@apollo/client');

describe('Reports', () => {
  const queryResultDefaults = {
    error: undefined,
    loading: undefined,
    data: undefined,
    refetch: jest.fn(),
  };

  it('expect to render properly and show the profile(s)', () => {
    useReports.mockImplementation(() => ({
      ...queryResultDefaults,
      data: { data: reports },
    }));

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
    useReports.mockImplementation(() => ({
      ...queryResultDefaults,
      data: {
        data: [],
      },
    }));

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
    useReports.mockImplementation(() => ({
      ...queryResultDefaults,
      data: { data: [] },
      loading: true,
    }));

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
