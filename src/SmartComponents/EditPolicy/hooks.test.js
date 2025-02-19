import { renderHook, act, waitFor } from '@testing-library/react';
import { useOnSave } from './hooks';
import useAssignRules from '../../Utilities/hooks/api/useAssignRules';
import useAssignSystems from '../../Utilities/hooks/api/useAssignSystems';
import useTailorings from '../../Utilities/hooks/api/useTailorings';
import useUpdatePolicy from '../../Utilities/hooks/api/useUpdatePolicy';

import { dispatchNotification } from 'Utilities/Dispatcher';
jest.mock('Utilities/Dispatcher');

jest.mock('Utilities/hooks/useAnchor', () => ({
  __esModule: true,
  default: () => () => ({}),
}));

jest.mock('../../Utilities/hooks/api/useAssignRules');
jest.mock('../../Utilities/hooks/api/useAssignSystems');
jest.mock('../../Utilities/hooks/api/useTailorings');
jest.mock('../../Utilities/hooks/api/useUpdatePolicy');

describe('useOnSave', function () {
  const policy = {};
  const updatedPolicy = { description: 'Foo' };
  const mockedNotification = jest.fn();
  const onSaveCallBack = jest.fn();
  const onErrorCallback = jest.fn();

  beforeEach(() => {
    onSaveCallBack.mockReset();
    onErrorCallback.mockReset();
    dispatchNotification.mockImplementation(mockedNotification);

    useAssignRules.mockReturnValue({ fetch: jest.fn(() => Promise.resolve()) });
    useAssignSystems.mockReturnValue({
      fetch: jest.fn(() => Promise.resolve()),
    });
    useTailorings.mockReturnValue({
      fetch: jest.fn(() => Promise.resolve({ data: [] })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a function to call with a policy and updated policy', async () => {
    useUpdatePolicy.mockReturnValue({
      fetch: jest.fn(() => Promise.resolve()),
    });

    const { result } = renderHook(() =>
      useOnSave(policy, updatedPolicy, {
        onSave: onSaveCallBack,
        onError: onErrorCallback,
      })
    );
    const [, onSave] = result.current;

    act(() => {
      onSave();
    });

    await waitFor(() =>
      expect(mockedNotification).toHaveBeenCalledWith({
        variant: 'success',
        title: 'Policy updated',
        autoDismiss: true,
      })
    );

    expect(onSaveCallBack).toHaveBeenCalled();
    expect(onErrorCallback).not.toHaveBeenCalled();
  });

  it('returns a function to call with a policy and updated policy and can raise an error', async () => {
    useUpdatePolicy.mockReturnValue({
      fetch: jest.fn(() => {
        return Promise.reject(new Error('Update failed'));
      }),
    });

    const { result } = renderHook(() =>
      useOnSave(policy, updatedPolicy, {
        onSave: onSaveCallBack,
        onError: onErrorCallback,
      })
    );
    const [, onSave] = result.current;
    act(() => {
      onSave();
    });

    await waitFor(() =>
      expect(mockedNotification).toHaveBeenCalledWith({
        variant: 'danger',
        title: 'Error updating policy',
        description: 'Update failed',
      })
    );

    expect(onErrorCallback).toHaveBeenCalled();
    expect(onSaveCallBack).not.toHaveBeenCalled();
  });
});
