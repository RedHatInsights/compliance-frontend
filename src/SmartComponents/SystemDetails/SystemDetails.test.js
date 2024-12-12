import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import SystemDetails from './SystemDetails.js';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag.js';
import useSystem from 'Utilities/hooks/api/useSystem';

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

jest.mock('Utilities/hooks/api/useSystem', () => jest.fn());

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
      policies: [],
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
    require('react-router-dom').useLocation.mockReturnValue({
      pathname: '/insights/inventory',
    });
    useSystem.mockImplementation(() => ({
      data: {},
      error: undefined,
      loading: undefined,
    }));

    expect(useSystem).not.toHaveBeenCalled();

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

describe('SystemDetails - REST', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => true);
  });

  it('expect to render Inventory Details Wrapper', () => {
    useSystem.mockImplementation(() => ({
      data: { data: { display_name: "foo", policies: [{}], insights_id: "123" }},
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <SystemDetails route={{}}/>
      </TestWrapper>
    );

    expect(
      screen.getByLabelText('Inventory Details Wrapper')
    ).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  })
});
