import { renderHook } from '@testing-library/react-hooks';
import useEditPolicy from './useEditPolicy';
import useOnSavePolicy from 'Utilities/hooks/useOnSavePolicy';
import buildPolicy from '@/__factories__/policies.js';

jest.mock('Utilities/hooks/useOnSavePolicy');
useOnSavePolicy.mockImplementation(({ onSave }) => {
  return [false, onSave];
});

describe('useEditPolicy', () => {
  const policy = buildPolicy();
  console.log(policy);
  it('returns an array with a boolean and function', () => {
    const { result } = renderHook(() => useEditPolicy(policy));

    expect(result.current.initialValues.systems[0].id).toEqual(
      policy.hosts[0].id
    );
  });
});
