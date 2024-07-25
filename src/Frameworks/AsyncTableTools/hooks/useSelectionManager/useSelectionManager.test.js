import { act, renderHook } from '@testing-library/react';
import useSelectionManager from './useSelectionManager';

describe('useSelectionManager', () => {
  it('returns an object with functions to manage selections', () => {
    const { result } = renderHook(() => useSelectionManager());
    expect(result.current.clear).toBeDefined();
    expect(result.current.set).toBeDefined();
    expect(result.current.reset).toBeDefined();
    expect(result.current.select).toBeDefined();
    expect(result.current.deselect).toBeDefined();
  });

  describe('withGroups: false', () => {
    const defaultArguments = [[1, 2, 3, 4]];

    it('returns an object with function to manage selections wihtout groups', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );
      expect(result.current.selection).toEqual(defaultArguments[0]);
    });

    it('adds an item from the selection when calling select', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );

      act(() => {
        result.current.select(42);
      });

      expect(result.current.selection).toEqual([42, ...defaultArguments[0]]);
    });

    it('removes an item from the selection when calling deselect', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );

      act(() => {
        result.current.deselect(3);
      });

      expect(result.current.selection).toEqual(
        defaultArguments[0].filter((v) => v !== 3)
      );
    });

    it('sets items for a selection when calling set', () => {
      const newSelection = [0, 9, 8, 45, 3];
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );

      act(() => {
        result.current.set(newSelection);
      });

      expect(result.current.selection).toEqual(newSelection);
    });
  });

  describe('withGroups true', () => {
    const defaultArguments = [
      { group1: [1, 2, 3, 4], group2: [12, 23, 34, 45] },
      { withGroups: true },
    ];

    it('returns an object with function to manage selections with groups', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );
      expect(result.current.clear).toBeDefined();
      expect(result.current.set).toBeDefined();
      expect(result.current.reset).toBeDefined();
      expect(result.current.select).toBeDefined();
      expect(result.current.deselect).toBeDefined();
    });

    it('adds an item from the selection when calling select', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );

      act(() => {
        result.current.select(42, 'group2');
      });

      expect(result.current.selection.group2).toEqual([
        42,
        ...defaultArguments[0].group2,
      ]);
    });

    it('removes an item from the selection when calling deselect', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );

      act(() => {
        result.current.deselect(2, 'group1');
      });

      expect(result.current.selection.group1).toEqual([1, 3, 4]);
    });

    it('sets items for a selection when calling set', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments)
      );

      act(() => {
        result.current.set([0, 9, 8, 45, 3], 'group1');
      });

      expect(result.current.selection.group1).toEqual([0, 9, 8, 45, 3]);
    });
  });
});
