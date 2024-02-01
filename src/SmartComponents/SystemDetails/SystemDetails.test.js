import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { SystemDetails } from './SystemDetails.js';

jest.mock('@apollo/client');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useParams: jest.fn(() => ({
    inventoryId: '1',
  })),
}));

jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

describe('SystemDetails', () => {
  const defaultLocation = {
    query: {
      hidePassed: false,
    },
  };
  const data = {
    system: {
      insightsId: 'ID_YEAH',
      name: 'test.host.local',
      testResultProfiles: [],
    },
  };
  const defaultQuery = {
    data,
    loading: false,
  };

  beforeEach(() => {
    useLocation.mockImplementation(jest.fn(() => defaultLocation));
    useQuery.mockImplementation(() => defaultQuery);
  });

  it('expect to render an the inventory details', () => {
    render(
      <TestWrapper>
        <SystemDetails />
      </TestWrapper>
    );

    expect(
      screen.getByLabelText('Inventory Details Wrapper')
    ).toBeInTheDocument();
  });

  it('expect to render loading', () => {
    useQuery.mockImplementation(() => ({ ...defaultQuery, loading: true }));
    render(
      <TestWrapper>
        <SystemDetails />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
