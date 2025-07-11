import { useEffect } from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import usePolicy from 'Utilities/hooks/api/usePolicy';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import usePolicySystems from 'Utilities/hooks/api/usePolicySystems';
import useAssignedRules from './hooks/useAssignedRules';
import EditPolicyForm from './EditPolicyForm';
import useUpdatePolicy from 'Utilities/hooks/api/useUpdatePolicy';
import EditPolicy from './EditPolicy';
import TestWrapper from 'Utilities/TestWrapper';

jest.mock('Utilities/hooks/api/useSupportedProfiles');
jest.mock('Utilities/hooks/api/useAssignRules');
jest.mock('Utilities/hooks/api/usePolicySystems');
jest.mock('Utilities/hooks/api/usePolicy');
jest.mock('Utilities/hooks/api/useUpdatePolicy');
jest.mock('./hooks/useAssignedRules');

jest.mock('./EditPolicyForm');

// eslint-disable-next-line
const MockEditPolicyForm = ({ setUpdatedPolicy }) => {
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
  }, [setUpdatedPolicy]);

  return <div>Mocked tabs</div>;
};

EditPolicyForm.mockImplementation(MockEditPolicyForm);

const user = userEvent.setup();
const defaultProp = {
  route: {
    title: 'test-page',
    setTitle: jest.fn(),
  },
};

const renderComponent = (newProps = {}) =>
  render(<EditPolicy {...{ ...defaultProp, newProps }} />, {
    wrapper: TestWrapper,
  });

const fetchMock = jest.fn(() => Promise.resolve({ data: [{ id: 'test-id' }] }));
const fetchBatchedMock = jest.fn(() =>
  Promise.resolve({ data: [{ id: 'test-id' }] }),
);

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

    useAssignedRules.mockImplementation(() => ({
      assignedRuleIds: [],
      assignedRulesLoading: false,
    }));

    [useAssignRules, usePolicySystems, useSupportedProfiles].forEach((hook) => {
      hook.mockImplementation(() => ({
        data: { data: [{ id: 'test-id' }] },
        loading: false,
        error: false,
        fetch: fetchMock,
        fetchBatched: fetchBatchedMock,
      }));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should have proper modal title', () => {
    renderComponent();
    expect(screen.getByText(`Edit test-policy`)).toBeVisible();
  });

  it('Should call fetch APIs with correct params', async () => {
    renderComponent();

    [usePolicy, useAssignRules, usePolicySystems].forEach(
      async (hook) =>
        await waitFor(() => {
          expect(hook).toHaveBeenCalled();
        }),
    );

    await waitFor(() => {
      expect(useSupportedProfiles).toHaveBeenCalledWith({
        batched: true,
        params: { filter: 'os_major_version=7' },
        skip: false,
      });
    });
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
        }),
      ).toBeEnabled(),
    );

    await user.click(
      screen.getByRole('button', {
        name: /save/i,
      }),
    );
  });

  it('Should call fetch APIs with correct params', async () => {
    renderComponent();

    [usePolicy, useAssignRules, usePolicySystems].forEach(
      async (hook) =>
        await waitFor(() => {
          expect(hook).toHaveBeenCalledWith('test-policy-id');
        }),
    );

    await waitFor(() => {
      expect(useSupportedProfiles).toHaveBeenCalledWith({
        batched: true,
        params: { filter: 'os_major_version=7' },
        skip: false,
      });
    });
  });
});
