import { renderHook, act } from '@testing-library/react-hooks';
import { useBulkSelect, useBulkSelectWithItems } from './useBulkSelect';
import items from './__fixtures__/items';
import useItemIdentify from './useItemIdentify';

describe('useBulkSelect', () => {
    const defaultOptions = {
        total: 0,
        onSelect: () => ({}),
        itemIdsInTable: () => ([]),
        itemIdsOnPage: () => ([])
    };

    it('returns a bulk select configuration', () => {
        const { result } = renderHook(() => useBulkSelect(defaultOptions));

        expect(result).toMatchSnapshot();
    });

    it('returns a bulk select configuration with the correct options', () => {
        const { result } = renderHook(() => useBulkSelect({
            ...defaultOptions,
            total: 1,
            preselected: ['ID'],
            itemIdsInTable: () => (['ID']),
            itemIdsOnPage: () => (['ID'])
        }));

        expect(result.current).toMatchSnapshot();
    });

    it('returns a bulk select configuration with the correct options', () => {
        const { result } = renderHook(() => useBulkSelect({
            ...defaultOptions,
            total: 2,
            preselected: ['ID'],
            itemIdsInTable: () => (['ID', 'ID2']),
            itemIdsOnPage: () => (['ID', 'ID2'])
        }));

        expect(result.current).toMatchSnapshot();
    });

    it('returns a bulk select configuration with the correct options', () => {
        const { result } = renderHook(() => useBulkSelect({
            ...defaultOptions,
            total: 2,
            preselected: ['ID'],
            itemIdsInTable: () => (['ID', 'ID2']),
            itemIdsOnPage: () => (['ID'])
        }));

        expect(result.current).toMatchSnapshot();
    });
});

describe('useBulkSelectWithItems', () => {
    const exampleItems = useItemIdentify(items(20));
    const defaultOptions = {
        onSelect: () => ({}),
        items: exampleItems,
        perPage: 10,
        preselected: []
    };
    const getBulkSelect = (result) => (result.current.toolbarProps.bulkSelect);
    const getSelectNone = (result) => (result.current.toolbarProps.bulkSelect.items[0]);
    const getSelectPage = (result) => (result.current.toolbarProps.bulkSelect.items[1]);
    const getSelectAll = (result) => (result.current.toolbarProps.bulkSelect.items[2]);

    it('returns a bulk select configuration', () => {
        const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));

        expect(result).toMatchSnapshot();
    });

    it('returns a allows to select one', async () => {
        const item = exampleItems[5];
        const { result, waitForNextUpdate } = renderHook(() => useBulkSelectWithItems(defaultOptions));

        act(() => {
            result.current.tableProps.onSelect(undefined, true, 'key', item);
        });
        await waitForNextUpdate();
        expect(result.current.transformer(item)).toMatchSnapshot();
    });

    it('returns a allows to select/deselect all', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBulkSelectWithItems(defaultOptions));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });

        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });
        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();
    });

    it('returns a allows to select/deselect page', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBulkSelectWithItems(defaultOptions));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectPage(result).onClick();
        });

        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectPage(result).onClick();
        });

        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();
    });

    it('returns to select none after all selected', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBulkSelectWithItems(defaultOptions));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });

        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectNone(result).onClick();
        });

        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();
    });

    it('returns respects filtered results', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBulkSelectWithItems({
            ...defaultOptions,
            filter: (items) => (items.slice(5, 10))
        }));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });

        await waitForNextUpdate();
        expect(getBulkSelect(result)).toMatchSnapshot();
    });
});
