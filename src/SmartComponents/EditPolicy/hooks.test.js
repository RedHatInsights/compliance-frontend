import { renderHook, act, waitFor } from '@testing-library/react';
import { useOnSave } from './hooks';

import { dispatchNotification } from 'Utilities/Dispatcher';
jest.mock('Utilities/Dispatcher');

jest.mock('Utilities/hooks/useAnchor', () => ({
  __esModule: true,
  default: () => () => ({}),
}));

describe('useOnSave', function () {
  const policy = {};
  const updatedPolicy = {};
  const mockedNotification = jest.fn();
  const onSaveCallBack = jest.fn();
  const onErrorCallback = jest.fn();

  beforeEach(() => {
    onSaveCallBack.mockReset();
    onErrorCallback.mockReset();
    dispatchNotification.mockImplementation(mockedNotification);
  });

  it('returns a function to call with a policy and updated policy', async () => {
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
        description: undefined,
      })
    );

    expect(onErrorCallback).toHaveBeenCalled();
    expect(onSaveCallBack).not.toHaveBeenCalled();
  });
});
