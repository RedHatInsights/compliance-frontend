import { useMutation } from '@apollo/client';
import useTailorProfile from './useTailorProfile';
jest.mock('@apollo/client');

describe('useTailorProfile', () => {
  afterEach(() => {
    useMutation.mockReset();
  });

  it('assigns rules to exact profile', async () => {
    const profileSelectedRuleRefIds = {
      id: '1',
      ruleRefIds: ['ref1', 'ref2'],
    };
    const profiles = [{ id: '1', parentProfileId: null }];

    const associateMutation = jest.fn(async ({ variables: { input } }) => {
      expect(input).toBeDefined();
      expect(input.id).toBe('1');
      expect(input.ruleRefIds).toEqual(['ref1', 'ref2']);

      return {};
    });
    useMutation.mockImplementation(() => [associateMutation]);

    const tailorProfile = useTailorProfile();
    await tailorProfile(profileSelectedRuleRefIds, profiles);

    expect(associateMutation).toHaveBeenCalled();
  });

  it('assigns rules to using parent profile', async () => {
    const profileSelectedRuleRefIds = {
      id: '1',
      osMinorVersion: '5',
      ruleRefIds: ['ref1', 'ref2'],
    };
    const profiles = [
      {
        id: '999',
        parentProfileId: '1',
        osMinorVersion: '5',
      },
    ];

    const associateMutation = jest.fn(async ({ variables: { input } }) => {
      expect(input).toBeDefined();
      expect(input.id).toBe('999');
      expect(input.ruleRefIds).toEqual(['ref1', 'ref2']);

      return {};
    });
    useMutation.mockImplementation(() => [associateMutation]);

    const tailorProfile = useTailorProfile();
    await tailorProfile(profileSelectedRuleRefIds, profiles);

    expect(associateMutation).toHaveBeenCalled();
  });

  it('throws on error', async () => {
    const profileSelectedRuleRefIds = {
      id: '1',
      ruleRefIds: ['ref1', 'ref2'],
    };
    const profiles = [{ id: '1', parentProfileId: null }];

    const associateMutation = jest.fn(async () => {
      return {
        error: new Error('bam!'),
      };
    });
    useMutation.mockImplementation(() => [associateMutation]);

    const tailorProfile = useTailorProfile();

    try {
      await tailorProfile(profileSelectedRuleRefIds, profiles);
      throw new Error('Must throw an error');
    } catch (error) {
      expect(error).toEqual(new Error('bam!'));
    }

    expect(associateMutation).toHaveBeenCalled();
  });
});
