import { renderHook, act } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import { useSerialisedTableState } from '../useTableState';

import usePagination from './usePagination';

describe('usePagination', () => {
  const defaultOptions = {
    numberOfItems: 300,
  };

  it('returns no paginate configuration by default if disabled', () => {
    const { result } = renderHook(
      () =>
        usePagination({
          pagination: false,
        }),
      DEFAULT_RENDER_OPTIONS
    );
    expect(result.current).toEqual({});
  });

  it('changes the page when setPage is called', () => {
    const { result } = renderHook(
      () => usePagination(defaultOptions),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.toolbarProps.pagination.onSetPage(undefined, 2);
    });

    expect(result.current.toolbarProps.pagination.page).toBe(2);
  });

  it('resets to page 1 if a negative page is passed', () => {
    const { result } = renderHook(
      () => usePagination(defaultOptions),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.toolbarProps.pagination.onSetPage(undefined, -2);
    });

    expect(result.current.toolbarProps.pagination.page).toBe(1);
  });

  it('changes the perPage when setPage is called', () => {
    const { result } = renderHook(
      () => usePagination(defaultOptions),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.toolbarProps.pagination.onPerPageSelect(undefined, 100);
    });

    expect(result.current.toolbarProps.pagination.perPage).toBe(100);
  });

  it('allows providing a serialiser', () => {
    const usePaginationWithSerialisedState = (...args) => {
      const serialised = useSerialisedTableState();

      const pagination = usePagination(...args);
      return {
        pagination,
        serialised,
      };
    };
    const paginationSerialiser = ({ page, perPage }) =>
      `page=${page}&perPage=${perPage}`;

    const { result } = renderHook(
      () =>
        usePaginationWithSerialisedState({
          ...defaultOptions,
          serialisers: {
            pagination: paginationSerialiser,
          },
        }),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.pagination.toolbarProps.pagination.onSetPage(undefined, 2);
    });

    expect(result.current.pagination.toolbarProps.pagination.page).toBe(2);
    expect(result.current.serialised.pagination).toEqual('page=2&perPage=10');
  });
});
