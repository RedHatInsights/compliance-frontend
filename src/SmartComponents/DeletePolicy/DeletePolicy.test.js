import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { dispatchAction } from 'Utilities/Dispatcher';
import TestWrapper from '@/Utilities/TestWrapper';

import DeletePolicy from './DeletePolicy.js';

jest.mock('Utilities/Dispatcher');

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(() => ({})),
  useQuery: () => ({
    data: { profile: { name: 'Test Policy 1', id: 'teste_polict_ID' } },
    error: undefined,
    loading: undefined,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
}));

describe('DeletePolicy', () => {
  const policy = { id: 1, name: 'foo' };

  beforeEach(() => {
    useMutation.mockImplementation((_query, options) => {
      return [
        function () {
          options.onCompleted();
        },
      ];
    });
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
