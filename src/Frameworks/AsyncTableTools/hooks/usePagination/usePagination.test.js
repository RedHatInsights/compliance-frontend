import { renderHook, act } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';

import usePagination from './usePagination';

describe.skip('usePagination', () => {
  it('returns a paginate configuration', () => {
    const { result } = renderHook(
      () => usePagination(),
      DEFAULT_RENDER_OPTIONS
    );
    expect(result).toEqual();
  });

  it('changes the page when setPage is called', () => {
    const { result } = renderHook(
      () => usePagination(),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.toolbarProps.pagination.page).toBe(2);
  });
});
