import { renderHook, act } from '@testing-library/react-hooks';
import { useOnSave } from './hooks';

import { usePolicy } from 'Mutations';
jest.mock('Mutations');

import { dispatchNotification } from 'Utilities/Dispatcher';
jest.mock('Utilities/Dispatcher');
jest.mock('Utilities/hooks/useLinkToBackground', () => ({
  __esModule: true,
  default: () => () => ({}),
}));
jest.mock('Utilities/hooks/useAnchor', () => ({
  __esModule: true,
  default: () => () => ({}),
}));

describe('useOnSave', function () {
  const policy = {};
  const updatedPolicy = {};
  const mockedNotification = jest.fn();

  beforeEach(() => {
    dispatchNotification.mockImplementation(mockedNotification);
  });

  it('returns an array with a boolean and function', () => {
    const { result } = renderHook(() => useOnSave());
    expect(result).toMatchSnapshot();
  });

  it('returns a function to call with a policy and updated policy', async () => {
    usePolicy.mockImplementation(() => {
      return () => Promise.resolve();
    });
    const { result, waitForValueToChange } = renderHook(() => useOnSave());

    act(() => {
      result.current[1](policy, updatedPolicy);
    });

    await waitForValueToChange(() => result.current[0]);

    expect(mockedNotification).toHaveBeenCalledWith({
      variant: 'success',
      title: 'Policy updated',
      autoDismiss: true,
    });
  });

  it('returns a function to call with a policy and updated policy and can raise an error', async () => {
    usePolicy.mockImplementation(() => {
      return () => Promise.reject({});
    });
    const { result, waitForValueToChange } = renderHook(() => useOnSave());

    act(() => {
      result.current[1](policy, updatedPolicy);
    });

    await waitForValueToChange(() => result.current[0]);

    expect(mockedNotification).toHaveBeenCalledWith({
      variant: 'danger',
      title: 'Error updating policy',
      description: undefined,
    });
  });
});
