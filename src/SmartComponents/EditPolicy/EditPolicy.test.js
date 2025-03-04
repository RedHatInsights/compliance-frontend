import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditPolicy from './EditPolicy';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useAssignedRules from './hooks/useAssignedRules';
import useAssignSystems from 'Utilities/hooks/api/useAssignSystems';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import userEvent from '@testing-library/user-event';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import EditPolicyForm from './EditPolicyForm';
import { dispatchNotification } from 'Utilities/Dispatcher';
import useUpdatePolicy from 'Utilities/hooks/api/useUpdatePolicy';

jest.mock('Utilities/hooks/api/useSupportedProfiles');
jest.mock('Utilities/hooks/api/useAssignRules');
jest.mock('Utilities/hooks/api/useAssignSystems');
jest.mock('Utilities/hooks/api/usePolicy');
jest.mock('Utilities/hooks/api/useTailorings');
jest.mock('Utilities/hooks/api/useUpdatePolicy');
jest.mock('Utilities/hooks/api/useUpdateTailoring');
jest.mock('./hooks/useAssignedRules');
jest.mock('Utilities/Dispatcher', () => ({ dispatchNotification: jest.fn() }));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate'
);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ policy_id: 'test-policy-id' })),
}));

jest.mock('./EditPolicyForm');

const navigate = jest.fn();
useNavigate.mockImplementation(() => navigate);

const user = userEvent.setup();
const defaultProp = {
  route: {
    title: 'test-page',
    setTitle: jest.fn(),
  },
};

const renderComponent = (newProps = {}) =>
  render(
    <TestWrapper>
      <EditPolicy {...{ ...defaultProp, newProps }} />
    </TestWrapper>
  );

const fetchMock = jest.fn(() => Promise.resolve({ data: [{ id: 'test-id' }] }));

describe('EditPolicy', () => {
  beforeEach(() => {
    useUpdatePolicy.mockReturnValue({
      fetch: jest.fn(() => Promise.resolve()),
    });

    usePolicy.mockImplementation(() => ({
      data: {
        data: { title: 'test-policy', os_major_version: 7, id: 'test-id' },
      },
      loading: false,
      error: false,
    }));

    useTailorings.mockImplementation(() => ({
      fetch: jest.fn(() =>
        Promise.resolve({
          data: [{ id: 'tailoring-id-1', os_minor_version: 8 }],
        })
      ),
    }));

    useAssignedRules.mockImplementation(() => ({
      assignedRuleIds: [],
      assignedRulesLoading: false,
    }));

    [
      useAssignRules,
      useAssignSystems,
      useSupportedProfiles,
      useUpdateTailoring,
    ].forEach((hook) => {
      hook.mockImplementation(() => ({
        data: { data: [{ id: 'test-id' }] },
        loading: false,
        error: false,
        fetch: fetchMock,
      }));
    });

    EditPolicyForm.mockImplementation(({ setUpdatedPolicy }) => {
      useEffect(() => {
        setUpdatedPolicy({
          tailoringRules: {
            8: ['rule-1', 'rule-2'],
          },
          hosts: ['system-1'],
          tailoringValueOverrides: {
            8: { 'value-id': 'changed-value' },
          },
        });
      }, []);

      return <div>Mocked tabs</div>;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should have proper modal title', () => {
    renderComponent();
    expect(screen.getByText(`Edit test-policy`)).toBeVisible();
  });

  it('Should redirect to policy detail page on cancel button click', async () => {
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(navigate).toHaveBeenCalledWith('/scappolicies/test-policy-id');
  });

  it('Should display save button as disabled when no changes are made', () => {
    EditPolicyForm.mockImplementation(({ setUpdatedPolicy }) => {
      useEffect(() => {
        setUpdatedPolicy(null);
      }, []);

      return <div>Mocked tabs</div>;
    });

    renderComponent();

    expect(
      screen.getByRole('button', {
        name: /save/i,
      })
    ).toBeDisabled();
  });

  it('Should call fetch APIs with correct params', async () => {
    renderComponent();

    [usePolicy, useAssignRules, useAssignSystems].forEach(
      async (hook) =>
        await waitFor(() => {
          expect(hook).toHaveBeenCalledWith('test-policy-id');
        })
    );

    await waitFor(() => {
      expect(useSupportedProfiles).toHaveBeenCalledWith({
        params: { filter: 'os_major_version=7', limit: 100 },
        skip: false,
      });
    });
  });

  it('Should submit form', async () => {
    renderComponent();
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: /save/i,
        })
      ).toBeEnabled()
    );

    await user.click(
      screen.getByRole('button', {
        name: /save/i,
      })
    );

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith({
        policyId: 'test-id',
        assignSystemsRequest: { ids: ['system-1'] },
      })
    );

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith({
        policyId: 'test-id',
        tailoringId: 'tailoring-id-1',
        assignRulesRequest: { ids: ['rule-1', 'rule-2'] },
      })
    );

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith({
        policyId: 'test-id',
        tailoringId: 'tailoring-id-1',
        valuesUpdate: { value_overrides: { 'value-id': 'changed-value' } },
      })
    );

    await waitFor(() =>
      expect(dispatchNotification).toHaveBeenCalledWith({
        autoDismiss: true,
        title: 'Policy updated',
        variant: 'success',
      })
    );
  });

  it('Should submit fail if any API errors', async () => {
    useAssignRules.mockReturnValue({
      fetch: jest.fn(() => {
        return Promise.reject(new Error('error message'));
      }),
    });

    renderComponent();
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: /save/i,
        })
      ).toBeEnabled()
    );

    await user.click(
      screen.getByRole('button', {
        name: /save/i,
      })
    );

    await waitFor(() =>
      expect(dispatchNotification).toHaveBeenCalledWith({
        variant: 'danger',
        title: 'Error updating policy',
        description: 'error message',
      })
    );
  });

  it('Should call fetch APIs with correct params', async () => {
    renderComponent();

    [usePolicy, useAssignRules, useAssignSystems].forEach(
      async (hook) =>
        await waitFor(() => {
          expect(hook).toHaveBeenCalledWith('test-policy-id');
        })
    );

    await waitFor(() => {
      expect(useSupportedProfiles).toHaveBeenCalledWith({
        params: { filter: 'os_major_version=7', limit: 100 },
        skip: false,
      });
    });
  });
});
