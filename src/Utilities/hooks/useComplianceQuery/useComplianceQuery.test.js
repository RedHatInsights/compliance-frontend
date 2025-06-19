import { renderHook, act, waitFor } from '@testing-library/react';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import usePagination from '@/Frameworks/AsyncTableTools/hooks/usePagination';
import {
  paginationSerialiser,
  sortSerialiser,
} from '@/PresentationalComponents/ComplianceTable/serialisers';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useTableSort from '@/Frameworks/AsyncTableTools/hooks/useTableSort';
import useQuery from '../useQuery';
import useComplianceQuery from './useComplianceQuery';

const wrapper = ({ children }) => (
  <TableStateProvider>{children}</TableStateProvider>
);

jest.mock('../useQuery');

const useTableStateHelper = ({ query: queryOptions } = {}) => {
  const paginate = usePagination({
    pagination: true,
    page: 1,
    perPage: 10,
    numberOfItems: 50,
    serialisers: { pagination: paginationSerialiser },
  });

  const columns = [
    { title: 'Name', sortable: 'name' },
    { title: 'Systems', sortable: 'systems' },
  ];
  const sort = useTableSort(columns, {
    sortBy: { index: 1, direction: 'asc' },
    serialisers: { sort: sortSerialiser },
  });
  const query = useComplianceQuery('policy', {
    useTableState: true,
    ...(queryOptions || {}),
  });
  const serialisedState = useSerialisedTableState();

  return {
    query,
    serialisedState,
    paginate,
    sort,
  };
};

const defaultUseQueryOptions = {
  skip: true,
  params: expect.anything(),
  compileResult: expect.anything(),
};

const mockUseQuery = jest.fn(() => {
  return { data: [], loading: false, error: undefined };
});

describe('useComplianceQuery', () => {
  beforeEach(() => {
    useQuery.mockImplementation(mockUseQuery);
  });

  it('verifies pagination', async () => {
    const { result } = renderHook(() => useTableStateHelper(), {
      wrapper,
    });

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        defaultUseQueryOptions,
      ),
    );

    act(() =>
      result.current.paginate.toolbarProps.pagination.onSetPage(undefined, 2),
    );

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 10,
            offset: 10,
          }),
        }),
      ),
    );

    act(() =>
      result.current.paginate.toolbarProps.pagination.onPerPageSelect(null, 50),
    );

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: expect.objectContaining({ limit: 50 }),
        }),
      ),
    );
  });

  it('verifies sorting', async () => {
    const { result } = renderHook(() => useTableStateHelper(), {
      wrapper,
    });

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        defaultUseQueryOptions,
      ),
    );

    act(() => result.current.sort.tableProps.onSort(null, 1, 'desc'));

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: expect.objectContaining({ sortBy: 'systems:desc' }),
        }),
      ),
    );
  });

  it('properly set skip when batch is enabled', async () => {
    renderHook(
      () => useTableStateHelper({ query: { batched: true, skip: true } }),
      {
        wrapper,
      },
    );

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        defaultUseQueryOptions,
      ),
    );

    await waitFor(() =>
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          skip: true,
        }),
      ),
    );
  });
});
