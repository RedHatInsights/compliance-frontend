import { renderHook } from '@testing-library/react-hooks';
import filters from './__fixtures__/filters';
import useFilterConfig from './useFilterConfig';

describe('useFilterConfig', () => {
    it('returns a filter config configuration', () => {
        const { result } = renderHook(() => useFilterConfig({ filters: { filterConfig: filters } }));
        expect(result.current).toMatchSnapshot();
    });
});
