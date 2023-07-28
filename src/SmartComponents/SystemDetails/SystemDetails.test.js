import { render } from '@testing-library/react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { SystemDetails } from './SystemDetails.js';

jest.mock('@apollo/client');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useParams: jest.fn(() => ({
    inventoryId: 1,
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
      name: 'test.host.local',
    },
  };
  const defaultQuery = {
    data,
    error: false,
    loading: false,
  };

  beforeEach(() => {
    useLocation.mockImplementation(jest.fn(() => defaultLocation));
    useQuery.mockImplementation(() => defaultQuery);
  });

  it('expect to render without error', () => {
    const { asFragment } = render(<SystemDetails />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render loading', () => {
    useQuery.mockImplementation(() => ({ ...defaultQuery, loading: true }));
    const { asFragment } = render(<SystemDetails />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render and pass hidePassed correctly', () => {
    useLocation.mockImplementation(() => ({ query: { hidePassed: true } }));
    const { asFragment } = render(<SystemDetails />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render a 500 error', () => {
    const error = {
      networkError: { statusCode: 500 },
      error: 'Test Error loading',
    };
    useQuery.mockImplementation(() => ({ ...defaultQuery, error }));
    const { asFragment } = render(<SystemDetails />);

    expect(asFragment()).toMatchSnapshot();
  });
});
