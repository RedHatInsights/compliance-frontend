import { renderHook, act } from '@testing-library/react-hooks';
import useBulkSelect from './useBulkSelect';
import items from './__fixtures__/items';
import useItemIdentify from './useItemIdentify';

describe('useBulkSelect', () => {
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
        const { result } = renderHook(() => useBulkSelect(defaultOptions));

        expect(result).toMatchSnapshot();
    });

    it('returns a allows to select one', () => {
        const item = exampleItems[5];
        const { result } = renderHook(() => useBulkSelect(defaultOptions));

        act(() => {
            result.current.tableProps.onSelect(undefined, true, 'key', item);
        });
        expect(result.current.transformer(item)).toMatchSnapshot();
    });

    it('returns a allows to select/deselect all', () => {
        const { result } = renderHook(() => useBulkSelect(defaultOptions));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();
    });

    it('returns a allows to select/deselect page', () => {
        const { result } = renderHook(() => useBulkSelect(defaultOptions));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectPage(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectPage(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();
    });

    it('returns to select none after all selected', () => {
        const { result } = renderHook(() => useBulkSelect(defaultOptions));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectNone(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();
    });

    it('returns respects filtered results', () => {
        const { result } = renderHook(() => useBulkSelect({
            ...defaultOptions,
            filter: (items) => (items.slice(5, 10))
        }));
        expect(getBulkSelect(result)).toMatchSnapshot();

        act(() => {
            getSelectAll(result).onClick();
        });
        expect(getBulkSelect(result)).toMatchSnapshot();
    });
});
