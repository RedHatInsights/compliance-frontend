import { renderHook } from '@testing-library/react';
import useBatchedRuleGroups from 'PresentationalComponents/Tailorings/hooks/useBatchedRuleGroups';
import { buildTreeTable } from 'PresentationalComponents/Tailorings/helpers';
import { act } from 'react';
import { usePolicyRulesList } from 'Utilities/hooks/api/usePolicyRulesList';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';
import { useProfileTree } from 'Utilities/hooks/api/useProfileTree';

jest.mock('Utilities/hooks/api/useProfileRules', () => jest.fn());
jest.mock('Utilities/hooks/api/useProfileTree', () => ({
  useProfileTree: jest.fn(),
}));
jest.mock(
  'PresentationalComponents/Tailorings/hooks/useBatchedRuleGroups',
  () => jest.fn()
);
jest.mock('PresentationalComponents/Tailorings/helpers', () => ({
  buildTreeTable: jest.fn(),
}));

describe('usePolicyRulesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns loading state initially', () => {
    useProfileRules.mockReturnValue({
      loading: true,
      data: null,
      error: null,
      fetch: jest.fn(),
    });

    useProfileTree.mockReturnValue({
      loading: true,
      data: null,
      error: null,
    });

    useBatchedRuleGroups.mockReturnValue({
      loading: true,
      data: null,
      error: null,
    });

    buildTreeTable.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: false, ruleTree: false, ruleGroups: false },
      })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual({
      rules: null,
      ruleGroups: null,
      builtTree: undefined,
    });
    expect(result.current.error).toBeUndefined();
  });

  test('returns data when all dependencies resolve', () => {
    useProfileRules.mockReturnValue({
      loading: false,
      data: { rules: [{ id: 1, title: 'Test Rule' }] },
      error: null,
      fetch: jest.fn(),
    });

    useProfileTree.mockReturnValue({
      loading: false,
      data: { tree: [{ id: 'root', children: [] }] },
      error: null,
    });

    useBatchedRuleGroups.mockReturnValue({
      loading: false,
      data: [{ id: 'group1', name: 'Group 1' }],
      error: null,
    });

    buildTreeTable.mockReturnValue([{ id: 'root', children: [] }]);

    const { result } = renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: false, ruleTree: false, ruleGroups: false },
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      rules: { rules: [{ id: 1, title: 'Test Rule' }] },
      ruleGroups: [{ id: 'group1', name: 'Group 1' }],
      builtTree: [{ id: 'root', children: [] }],
    });
    expect(result.current.error).toBeUndefined();
  });

  test('handles errors from all dependencies', () => {
    useProfileRules.mockReturnValue({
      loading: false,
      data: null,
      error: 'Error fetching profile rules',
      fetch: jest.fn(),
    });

    useProfileTree.mockReturnValue({
      loading: false,
      data: null,
      error: 'Error fetching profile tree',
    });

    useBatchedRuleGroups.mockReturnValue({
      loading: false,
      data: null,
      error:
        'Error fetching batched rule groups though I wont show cause im last place',
    });

    buildTreeTable.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: false, ruleTree: false, ruleGroups: false },
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Error fetching profile rules');
    expect(result.current.data).toEqual({
      rules: null,
      ruleGroups: null,
      builtTree: undefined,
    });
  });

  test('returns partial data when some dependencies succeed', () => {
    useProfileRules.mockReturnValue({
      loading: false,
      data: { rules: [{ id: 1, title: 'Test Rule' }] },
      error: null,
      fetch: jest.fn(),
    });

    useProfileTree.mockReturnValue({
      loading: false,
      data: null,
      error: 'Error fetching profile tree',
    });

    useBatchedRuleGroups.mockReturnValue({
      loading: false,
      data: null,
      error: 'Error fetching batched rule groups',
    });

    buildTreeTable.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: false, ruleTree: false, ruleGroups: false },
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      rules: { rules: [{ id: 1, title: 'Test Rule' }] },
      ruleGroups: null,
      builtTree: undefined,
    });
    expect(result.current.error).toBe('Error fetching profile tree');
  });

  test('fetchRules function works correctly', async () => {
    const mockFetch = jest.fn();

    useProfileRules.mockReturnValue({
      loading: false,
      data: { rules: [] },
      error: null,
      fetch: mockFetch,
    });

    useProfileTree.mockReturnValue({
      loading: false,
      data: null,
      error: null,
    });

    useBatchedRuleGroups.mockReturnValue({
      loading: false,
      data: null,
      error: null,
    });

    const { result } = renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: false, ruleTree: false, ruleGroups: false },
      })
    );

    await act(async () => {
      await result.current.fetchRules(0, 10);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      ['test-security-guide-id', 'test-profile-id', undefined, 10, 0],
      false
    );
  });

  test('respects shouldSkip parameter', () => {
    useProfileRules.mockReturnValue({
      loading: false,
      data: null,
      error: null,
      fetch: jest.fn(),
    });

    useProfileTree.mockReturnValue({
      loading: false,
      data: null,
      error: null,
    });

    useBatchedRuleGroups.mockReturnValue({
      loading: false,
      data: null,
      error: null,
    });

    buildTreeTable.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: true, ruleTree: true, ruleGroups: true },
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      rules: null,
      ruleGroups: null,
      builtTree: undefined,
    });
    expect(result.current.error).toBeUndefined();
  });
});
