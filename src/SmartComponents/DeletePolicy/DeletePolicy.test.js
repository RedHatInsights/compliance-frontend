import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useLocation } from 'react-router-dom';
import { dispatchAction } from 'Utilities/Dispatcher';
import TestWrapper from '@/Utilities/TestWrapper';
import DeletePolicy from './DeletePolicy.js';
import { apiInstance } from '../../Utilities/hooks/useQuery';

jest.mock('../../Utilities/hooks/useQuery', () => ({
  __esModule: true,
  apiInstance: { deletePolicy: jest.fn() },
  default: () => ({
    data: { data: { title: 'Test Policy 1', id: 'teste_polict_ID' } },
    error: undefined,
    loading: undefined,
  }),
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

  it('expect to render a modal and delete a policy', () => {
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

    act(() => {
      screen
        .getByRole('checkbox', {
          checked: false,
          id: 'deleting-policy-check-teste_polict_ID',
        })
        .click();
    });

    act(() => {
      screen.getByRole('button', { name: 'delete' }).click();
    });

    expect(apiInstance.deletePolicy).toBeCalled();
  });
});
