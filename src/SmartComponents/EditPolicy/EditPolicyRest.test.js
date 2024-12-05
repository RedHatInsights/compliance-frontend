import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditPolicyRest } from './EditPolicyRest';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useAssignSystems from 'Utilities/hooks/api/useAssignSystems';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';
import userEvent from '@testing-library/user-event';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { apiInstance } from 'Utilities/hooks/useQuery';
import EditPolicyForm from './EditPolicyFormRest';
import { dispatchNotification } from 'Utilities/Dispatcher';

jest.mock('Utilities/hooks/api/useSupportedProfiles');
jest.mock('Utilities/hooks/api/useAssignRules');
jest.mock('Utilities/hooks/api/useAssignSystems');
jest.mock('Utilities/hooks/api/usePolicy');
jest.mock('Utilities/hooks/api/useTailorings');
jest.mock('Utilities/Dispatcher', () => ({ dispatchNotification: jest.fn() }));
jest.mock('Mutations', () => ({
  usePolicy: jest.fn(),
}));
jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate'
);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ policy_id: 'test-policy-id' })),
}));
jest.mock('Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('./EditPolicyFormRest');
jest.mock('Utilities/hooks/useQuery/apiInstance', () => ({
  updatePolicy: jest.fn(() => Promise.resolve({})),
  assignSystems: jest.fn(() => Promise.resolve({})),
  assignRules: jest.fn(() => Promise.resolve({})),
}));

const navigate = jest.fn();
useNavigate.mockImplementation(() => navigate);
usePolicy.mockImplementation(() => ({
  data: { data: { title: 'test-policy', os_major_version: 7, id: 'test-id' } },
  loading: false,
  error: false,
}));

useTailorings.mockImplementation(() => ({
  data: [{ id: 'tailoring-id' }],
  loading: false,
  error: false,
}));

[useAssignRules, useAssignSystems, useSupportedProfiles].forEach((hook) => {
  hook.mockImplementation(() => ({
    data: { data: [{ id: 'test-id' }] },
    loading: false,
    error: false,
  }));
});

EditPolicyForm.mockImplementation(({ setUpdatedPolicy }) => {
  useEffect(() => {
    setUpdatedPolicy({
      tailoringRules: {
        'tailoring-id-1': ['rule-1'],
        'tailoring-id-2': ['rule-2'],
      },
      hosts: ['system-1'],
      value: { 'tailoring-id': { 'value-id': 'changed-value' } },
    });
  }, []);

  return <div>Mocked tabs</div>;
});

useAPIV2FeatureFlag.mockReturnValue(true);
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
      <EditPolicyRest {...{ ...defaultProp, newProps }} />
    </TestWrapper>
  );

// TODO: recover and review the tests
describe.skip('EditPolicyRest', () => {
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
      expect(apiInstance.assignSystems).toHaveBeenCalledWith('test-id', null, {
        ids: ['system-1'],
      })
    );
    await waitFor(() =>
      expect(apiInstance.assignRules).toHaveBeenCalledWith(
        'test-id',
        'tailoring-id-1',
        null,
        { ids: ['rule-1'] }
      )
    );
    await waitFor(() =>
      expect(apiInstance.assignRules).toHaveBeenCalledWith(
        'test-id',
        'tailoring-id-2',
        null,
        { ids: ['rule-2'] }
      )
    );

    expect(dispatchNotification).toHaveBeenCalledWith({
      autoDismiss: true,
      title: 'Policy updated',
      variant: 'success',
    });
  });

  it('Should submit fail if any API errors', async () => {
    apiInstance.assignRules.mockImplementation(() =>
      Promise.reject({ message: 'error message' })
    );

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
