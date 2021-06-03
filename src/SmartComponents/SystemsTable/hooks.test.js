import { act, renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';
import { useSystemsFilter, useSystemsExport } from './hooks';

jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn(() => ({
        query: () => Promise.resolve([])
    }))
}));

describe('useSystemsFilter', () => {
    it('returns a filter string', () => {
        const { result } = renderHook(() => useSystemsFilter(
            'name = "Name"', true, 'default = "filter"'
        ));
        expect(result.current).toMatchSnapshot();
    });
});

describe('useSystemsExport', () => {
    const defaultOptions = {
        columns: [{ name: 'Name' }],
        filter: '',
        policyId: 'POLICY ID',
        query: 'QUERY',
        total: 1
    };

    it('returns a export configuration', () => {
        const { result } = renderHook(() => useSystemsExport(defaultOptions));

        expect(result.current).toMatchSnapshot();
    });

    it('returns a export with isDisabled true on total 0 ', () => {
        const { result } = renderHook(() => useSystemsExport({
            ...defaultOptions,
            total: 0
        }));

        expect(result.current).toMatchSnapshot();
    });

    it('returns a export with isDisabled true on total 0 ', () => {
        const { result } = renderHook(() => useSystemsExport({
            ...defaultOptions,
            selected: [1]
        }));

        expect(result.current).toMatchSnapshot();
    });

    it('returns a export with isDisabled true on total 0 ', () => {
        const apolloClient = jest.fn(() => ({
            query: () => Promise.resolve([])
        }));
        useApolloClient.mockImplementation(apolloClient);

        const { result } = renderHook(() => useSystemsExport({
            ...defaultOptions,
            selected: [1]
        }));

        act(() => {
            result.current.onSelect();
        });

        expect(apolloClient).toHaveBeenCalled();
    });
});
