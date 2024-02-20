import { useMutation } from '@apollo/client';
import useAssociateSystems from './useAssociateSystems';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
}));

describe('useAssociateSystems', () => {
  afterEach(() => {
    useMutation.mockReset();
  });

  it('associates systems to policy', async () => {
    const policy = { id: '1' };
    const hosts = [
      { id: 'h1', osVersion: '7.1' },
      { id: 'h2', osVersion: '7.2' },
    ];

    const associateMutation = jest.fn(async ({ variables: { input } }) => {
      expect(input).toBeDefined();
      expect(input.id).toBe('1');
      expect(input.systemIds).toEqual(['h1', 'h2']);

      return {
        data: { associateSystems: { profile: { id: '1' } } },
      };
    });
    useMutation.mockImplementation(() => [associateMutation]);

    const associateSystems = useAssociateSystems();
    const result = await associateSystems(policy, hosts);

    expect(associateMutation).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('clears associated policy systems', async () => {
    const policy = { id: '1' };
    const hosts = [];

    const associateMutation = jest.fn(async ({ variables: { input } }) => {
      expect(input).toBeDefined();
      expect(input.id).toBe('1');
      expect(input.systemIds).toEqual([]);

      return {
        data: { associateSystems: { profile: { id: '1' } } },
      };
    });
    useMutation.mockImplementation(() => [associateMutation]);

    const associateSystems = useAssociateSystems();
    const result = await associateSystems(policy, hosts);

    expect(associateMutation).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('throws on error', async () => {
    const policy = { id: '1' };
    const hosts = [];

    const associateMutation = jest.fn(async () => {
      return {
        error: new Error('bam!'),
      };
    });
    useMutation.mockImplementation(() => [associateMutation]);

    const associateSystems = useAssociateSystems();
    try {
      await associateSystems(policy, hosts);
      throw new Error('Must throw an error');
    } catch (error) {
      expect(error).toEqual(new Error('bam!'));
    }

    expect(associateMutation).toHaveBeenCalled();
  });
});
