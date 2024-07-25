import { renderHook } from '@testing-library/react-hooks';
import useAsyncTableTools from './useAsyncTableTools';

describe('useAsyncTableTools', () => {
  const defaultArguments = [[], { manageColumns: true }];
  it('returns a object with tableProps and toolbarProps', () => {
    const { result } = renderHook(() =>
      useAsyncTableTools(...defaultArguments)
    );
    expect(result).toEqual({});
  });
});
