import { renderHook } from '@testing-library/react';
import useSelectedFilter from './useSelectedFilter';

describe('useSelectedFilter', () => {
  it('returns a table sort configuration', () => {
    const { result } = renderHook(() =>
      useSelectedFilter({
        addFilterConfigItem: () => ({}),
        setActiveFilter: () => ({}),
        activeFilters: [],
      })
    );
    expect(result).toMatchSnapshot();
  });
});
