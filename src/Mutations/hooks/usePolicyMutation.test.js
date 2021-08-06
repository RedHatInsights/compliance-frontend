import { useMutation } from '@apollo/client';
import usePolicyMutation from './usePolicyMutation';
jest.mock('@apollo/client');

describe('usePolicyMutation', () => {
  afterEach(() => {
    useMutation.mockReset();
  });

  it('creates profile', async () => {
    const updatedPolicy = {
      name: 'NAME',
      description: 'DESCRIPTION',
      complianceThreshold: '1.0',
      cloneFromProfileId: '111',
      refId: 'ref',
      benchmarkId: '222',
      otherAttribute: 'other',
    };
    const createProfile = jest.fn(async ({ variables: { input } }) => {
      expect(input).toBeDefined();
      expect(input.name).toBe('NAME');
      expect(input.description).toBe('DESCRIPTION');
      expect(input.cloneFromProfileId).toBe('111');
      expect(input.refId).toBe('ref');
      expect(input.benchmarkId).toBe('222');
      expect(input.businessObjectiveId).toBe('BOid');
      expect(input.otherAttribute).toBe(undefined);

      return {
        data: { createProfile: { profile: { id: '1' } } },
      };
    });
    useMutation.mockImplementation(() => [createProfile]);

    const policyMutation = usePolicyMutation();
    const result = await policyMutation(undefined, updatedPolicy, 'BOid');

    expect(createProfile).toHaveBeenCalled();
    expect(result).toEqual({ id: '1' });
  });

  it('updates profile', async () => {
    const updatedPolicy = {
      name: 'NAME',
      description: 'DESCRIPTION',
      complianceThreshold: '1.0',
      refId: 'ref',
      benchmarkId: '222',
      otherAttribute: 'other',
    };
    const updateProfile = jest.fn(async ({ variables: { input } }) => {
      expect(input).toEqual({
        id: '1',
        name: 'NAME',
        description: 'DESCRIPTION',
        complianceThreshold: 1.0,
        businessObjectiveId: null,
      });
      return {
        data: { updateProfile: { profile: { id: '1' } } },
      };
    });
    useMutation.mockImplementation(() => [updateProfile]);

    const policyMutation = usePolicyMutation();
    const result = await policyMutation('1', updatedPolicy, null);

    expect(updateProfile).toHaveBeenCalled();
    expect(result).toEqual({ id: '1' });
  });

  it('throws on error', async () => {
    const updateProfile = jest.fn(async () => {
      return {
        error: new Error('bam!'),
      };
    });
    useMutation.mockImplementation(() => [updateProfile]);

    const policyMutation = usePolicyMutation();
    try {
      await policyMutation(undefined, {}, undefined);
      throw new Error('Must throw an error');
    } catch (error) {
      expect(error).toEqual(new Error('bam!'));
    }

    try {
      await policyMutation('1', {}, undefined);
      throw new Error('Must throw an error');
    } catch (error) {
      expect(error).toEqual(new Error('bam!'));
    }

    expect(updateProfile).toHaveBeenCalledTimes(2);
  });
});
