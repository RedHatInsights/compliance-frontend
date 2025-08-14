import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLocation } from 'react-router-dom';
import TestWrapper from 'Utilities/TestWrapper';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import { apiInstance } from 'Utilities/hooks/useQuery';

import DeletePolicy from './DeletePolicy.js';

jest.mock('Utilities/hooks/api/usePolicy');
jest.mock('Utilities/hooks/useQuery');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
}));

describe('DeletePolicy', () => {
  const policy = { id: 1, name: 'foo' };
  const mockDelete = jest.fn();

  beforeEach(() => {
    usePolicy.mockReturnValue({
      data: { data: { title: 'Test Policy 1', id: 'teste_polict_ID' } },
      error: undefined,
      loading: undefined,
    });
    useLocation.mockImplementation(() => ({
      state: {
        policy,
      },
    }));
    apiInstance.deletePolicy = mockDelete;
  });

  it('expect to render a modal and delete a policy', async () => {
    render(
      <TestWrapper>
        <DeletePolicy />
      </TestWrapper>,
    );

    expect(
      screen.getByText(
        'I understand this will delete the policy and all associated reports',
      ),
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

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'delete' })).toBeEnabled(),
    );

    screen.getByRole('button', { name: 'delete' }).click();

    await waitFor(() => expect(mockDelete).toHaveBeenCalled());
  });
});
