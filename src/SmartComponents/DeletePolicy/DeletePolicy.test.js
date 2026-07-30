import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import TestWrapper from 'Utilities/TestWrapper';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import useDeletePolicy from 'Utilities/hooks/api/useDeletePolicy';

import DeletePolicy from './DeletePolicy.js';

jest.mock('Utilities/hooks/api/usePolicy');
jest.mock('Utilities/hooks/api/useDeletePolicy');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock(
  '@redhat-cloud-services/frontend-components-notifications/hooks',
  () => ({
    useAddNotification: jest.fn(() => jest.fn()),
  }),
);

describe('DeletePolicy', () => {
  const policyId = 'teste_polict_ID';
  const navigateMocked = jest.fn();
  const deletePolicyQuery = jest.fn();
  const addNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ policy_id: policyId });
    useNavigate.mockImplementation(() => navigateMocked);
    useAddNotification.mockReturnValue(addNotification);
    usePolicy.mockReturnValue({
      data: { data: { title: 'Test Policy 1', id: policyId } },
      error: undefined,
      loading: undefined,
    });
    deletePolicyQuery.mockResolvedValue(undefined);
    useDeletePolicy.mockReturnValue({
      query: deletePolicyQuery,
    });
  });

  const enableAndConfirmDelete = async () => {
    act(() => {
      screen
        .getByRole('checkbox', {
          checked: false,
          id: `deleting-policy-check-${policyId}`,
        })
        .click();
    });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'delete' })).toBeEnabled(),
    );

    screen.getByRole('button', { name: 'delete' }).click();
  };

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

    await enableAndConfirmDelete();

    expect(useDeletePolicy).toHaveBeenCalledWith({ skip: true });

    await waitFor(() => {
      expect(deletePolicyQuery).toHaveBeenCalledWith({ policyId });
      expect(addNotification).toHaveBeenCalledWith({
        variant: 'success',
        title: 'Deleted "Test Policy 1" and its associated reports',
      });
      expect(navigateMocked).toHaveBeenCalledWith('/scappolicies');
    });
  });

  it('handles error during REST deletion', async () => {
    const error = new Error('Deletion failed');
    deletePolicyQuery.mockRejectedValue(error);

    render(
      <TestWrapper>
        <DeletePolicy />
      </TestWrapper>,
    );

    await enableAndConfirmDelete();

    await waitFor(() => {
      expect(addNotification).toHaveBeenCalledWith({
        variant: 'danger',
        title: 'Error removing policy',
        description: error.message,
      });
      expect(navigateMocked).toHaveBeenCalledWith('/scappolicies');
    });
  });
});
