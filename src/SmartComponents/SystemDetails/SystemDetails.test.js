import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import SystemDetails from './SystemDetails.js';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag.js';

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

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag.js');

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
    useAPIV2FeatureFlag.mockReturnValue(false);
  });

  it('expect to render the inventory details', () => {
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

  // TODO: add tests for the REST API component
});
