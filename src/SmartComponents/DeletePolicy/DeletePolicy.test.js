import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useLocation } from 'react-router-dom';
import { dispatchAction } from 'Utilities/Dispatcher';
import TestWrapper from '@/Utilities/TestWrapper';
import useQuery from '../../Utilities/hooks/useQuery/';

import DeletePolicy from './DeletePolicy.js';

jest.mock('../../Utilities/hooks/useQuery');
useQuery.mockImplementation(() => ({
  data: {
    data: {
      title: 'Test Policy 1',
      total_system_count: 1,
      description: 'profile description',
      os_major_version: 7,
      compliance_threshold: 1,
      old_id: 1,
    },
  },
  loading: false,
  error: undefined,
  refetch: jest.fn(),
}));

jest.mock('Utilities/Dispatcher');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
}));

describe('DeletePolicy', () => {
  const policy = { id: 1, name: 'foo' };

  beforeEach(() => {
    useLocation.mockImplementation(() => ({
      state: {
        policy,
      },
    }));
    dispatchAction.mockImplementation(() => {});
  });

  it('expect to render a modal to delete a policy', () => {
    render(
      <TestWrapper>
        <DeletePolicy />
      </TestWrapper>
    );

    expect(
      screen.getByText(
        'I understand this will delete the policy and all associated reports'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Test Policy 1')).toBeInTheDocument();
  });
});
