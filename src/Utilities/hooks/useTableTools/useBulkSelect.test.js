import { renderHook, act } from '@testing-library/react-hooks';
import useBulkSelect from './useBulkSelect';
import items from './__fixtures__/items';
import useItemIdentify from './useItemIdentify';

describe('useBulkSelect', () => {
    const exampleItems = useItemIdentify(items(20));
    const defaultOptions = {
        onSelect: () => ({}),
        items: exampleItems,
        perPage: 10
    };

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
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();

        act(() => {
            result.current.toolbarProps.bulkSelect.items[2].onClick();
        });
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();

        act(() => {
            result.current.toolbarProps.bulkSelect.items[2].onClick();
        });
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();
    });

    it('returns a allows to select/deselect page', () => {
        const { result } = renderHook(() => useBulkSelect(defaultOptions));
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();

        act(() => {
            result.current.toolbarProps.bulkSelect.items[1].onClick();
        });
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();

        act(() => {
            result.current.toolbarProps.bulkSelect.items[1].onClick();
        });
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();
    });

    it('returns a allows to select none after all selected', () => {
        const { result } = renderHook(() => useBulkSelect(defaultOptions));

        act(() => {
            result.current.toolbarProps.bulkSelect.items[2].onClick();
        });
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();

        act(() => {
            result.current.toolbarProps.bulkSelect.items[0].onClick();
        });
        expect(result.current.toolbarProps.bulkSelect).toMatchSnapshot();
    });
});
