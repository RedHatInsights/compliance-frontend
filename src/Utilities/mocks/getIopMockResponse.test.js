import { getIopMockResponse } from './getIopMockResponse';
import { iopMockPolicies } from './iopMockData';

describe('getIopMockResponse', () => {
  it('returns paginated policies with total meta', () => {
    const result = getIopMockResponse('policies', { limit: 2, offset: 0 });

    expect(result.data).toHaveLength(2);
    expect(result.meta.total).toBe(iopMockPolicies.length);
  });

  it('returns only total when onlyTotal is true', () => {
    const result = getIopMockResponse('policies', {}, { onlyTotal: true });

    expect(result).toBe(iopMockPolicies.length);
  });

  it('returns a single policy by id', () => {
    const policyId = iopMockPolicies[1].id;
    const result = getIopMockResponse('policy', { policyId });

    expect(result.data.id).toBe(policyId);
  });

  it('returns OS versions for reportsOS', () => {
    const result = getIopMockResponse('reportsOS', {});

    expect(result.data).toEqual(expect.arrayContaining([7, 8]));
  });

  it('returns a created policy id for createPolicy mutations', () => {
    const result = getIopMockResponse('createPolicy', {
      policy: { title: 'Test policy' },
    });

    expect(result.data.id).toBeTruthy();
    expect(result.data.title).toBe('Test policy');
  });
});
