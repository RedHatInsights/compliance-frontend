import { renderHook, act, waitFor } from '@testing-library/react';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import usePagination from '@/Frameworks/AsyncTableTools/hooks/usePagination';
import {
  paginationSerialiser,
  sortSerialiser,
} from '@/PresentationalComponents/ComplianceTable/serialisers';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useTableSort from '@/Frameworks/AsyncTableTools/hooks/useTableSort';

import useComplianceQuery from './useComplianceQuery';

const wrapper = ({ children }) => (
  <TableStateProvider>{children}</TableStateProvider>
);

const fakeApi = jest.fn(() => Promise.resolve({ data: [] }));

const useTableStateHelper = () => {
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
  const query = useComplianceQuery(fakeApi);
  const serialisedState = useSerialisedTableState();

  return {
    query,
    serialisedState,
    paginate,
    sort,
  };
};

const initialSerializedState = {
  offset: 0,
  limit: 10,
  sortBy: 'name:asc',
  filter: undefined,
};

describe('useComplianceQuery', () => {
  beforeEach(() => {
    fakeApi.mockReset();
  });
  it('verifies pagination', async () => {
    const { result } = renderHook(() => useTableStateHelper(), {
      wrapper,
    });

    await waitFor(() =>
      expect(fakeApi).toHaveBeenNthCalledWith(1, initialSerializedState)
    );

    act(() =>
      result.current.paginate.toolbarProps.pagination.onSetPage(undefined, 2)
    );

    await waitFor(() =>
      expect(fakeApi).toHaveBeenNthCalledWith(2, {
        ...initialSerializedState,
        offset: 10,
      })
    );

    act(() =>
      result.current.paginate.toolbarProps.pagination.onPerPageSelect(null, 50)
    );

    await waitFor(() =>
      expect(fakeApi).toHaveBeenNthCalledWith(3, {
        ...initialSerializedState,
        limit: 50,
      })
    );
  });

  it('verifies sorting', async () => {
    const { result } = renderHook(() => useTableStateHelper(), {
      wrapper,
    });

    await waitFor(() =>
      expect(fakeApi).toHaveBeenNthCalledWith(1, initialSerializedState)
    );

    act(() => result.current.sort.tableProps.onSort(null, 2, 'desc'));

    await waitFor(() =>
      expect(fakeApi).toHaveBeenNthCalledWith(2, {
        ...initialSerializedState,
        sortBy: 'systems:desc',
      })
    );
  });
});
