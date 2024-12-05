import { renderHook, act, waitFor } from '@testing-library/react';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import usePagination from '@/Frameworks/AsyncTableTools/hooks/usePagination';
import {
  paginationSerialiser,
  sortSerialiser,
} from '@/PresentationalComponents/ComplianceTable/serialisers';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useTableSort from '@/Frameworks/AsyncTableTools/hooks/useTableSort';

const wrapper = ({ children }) => (
  <TableStateProvider>{children}</TableStateProvider>
);

const mockFakeApi = jest.fn(() => Promise.resolve({ data: [] }));

import useComplianceQuery from './useComplianceQuery';

jest.mock('../useQuery', () => ({ __esModule: true, default: jest.fn() }));
import useQuery from '../useQuery';

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
  const query = useComplianceQuery('policy', { useTableState: true });
  const serialisedState = useSerialisedTableState();

  return {
    query,
    serialisedState,
    paginate,
    sort,
  };
};

const initialSerializedState = {
  skip: true,
  params: expect.anything(),
};

describe('useComplianceQuery', () => {
  beforeEach(() => {
    mockFakeApi.mockReset();
    useQuery.mockImplementation(mockFakeApi);
  });

  it('verifies pagination', async () => {
    const { result } = renderHook(() => useTableStateHelper(), {
      wrapper,
    });

    await waitFor(() =>
      expect(mockFakeApi).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        initialSerializedState
      )
    );

    act(() =>
      result.current.paginate.toolbarProps.pagination.onSetPage(undefined, 2)
    );

    await waitFor(() =>
      expect(mockFakeApi).toHaveBeenNthCalledWith(3, expect.anything(), {
        skip: false,
        params: expect.objectContaining({
          limit: 10,
          offset: 10,
        }),
      })
    );

    act(() =>
      result.current.paginate.toolbarProps.pagination.onPerPageSelect(null, 50)
    );

    await waitFor(() =>
      expect(mockFakeApi).toHaveBeenNthCalledWith(4, expect.anything(), {
        skip: false,
        params: expect.objectContaining({ limit: 50 }),
      })
    );
  });

  it('verifies sorting', async () => {
    const { result } = renderHook(() => useTableStateHelper(), {
      wrapper,
    });

    await waitFor(() =>
      expect(mockFakeApi).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        initialSerializedState
      )
    );

    act(() => result.current.sort.tableProps.onSort(null, 1, 'desc'));

    await waitFor(() =>
      expect(mockFakeApi).toHaveBeenNthCalledWith(3, expect.anything(), {
        skip: false,
        params: expect.objectContaining({ sortBy: 'systems:desc' }),
      })
    );
  });
});
