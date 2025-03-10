import { renderHook, waitFor } from '@testing-library/react';
import useRuleGroups from 'Utilities/hooks/api/useRuleGroups';
import { buildTreeTable } from 'PresentationalComponents/Tailorings/helpers';
import { usePolicyRulesList } from 'Utilities/hooks/api/usePolicyRulesList';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';
import useProfileTree from 'Utilities/hooks/api/useProfileTree';

jest.mock('Utilities/hooks/api/useProfileRules', () => jest.fn());
jest.mock('Utilities/hooks/api/useProfileTree', () => jest.fn());
jest.mock('Utilities/hooks/api/useRuleGroups', () => jest.fn());
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

    useRuleGroups.mockReturnValue({
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
      data: [{ id: 'root', children: [] }],
      error: null,
    });

    useRuleGroups.mockReturnValue({
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
      builtTree: [{ id: 'root', itemId: 'root', children: [] }],
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

    useRuleGroups.mockReturnValue({
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

    useRuleGroups.mockReturnValue({
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

  // TODO This needs the table state setup with a tablestate provider (mock) to trigger the fetch properly
  test.skip('fetchRules function works correctly', async () => {
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

    useRuleGroups.mockReturnValue({
      loading: false,
      data: null,
      error: null,
    });

    renderHook(() =>
      usePolicyRulesList({
        profileId: 'test-profile-id',
        securityGuideId: 'test-security-guide-id',
        tableState: {
          serialisedTableState: { pagination: { limit: 10, offset: 0 } },
        },
        shouldSkip: { rule: false, ruleTree: false, ruleGroups: false },
      })
    );

    await waitFor(() => {
      return expect(mockFetch).toHaveBeenCalledWith(
        ['test-security-guide-id', 'test-profile-id', undefined, 10, 0],
        false
      );
    });
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

    useRuleGroups.mockReturnValue({
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
