import { useMutation } from '@apollo/client';
import useCreateBusinessObjective from './useCreateBusinessObjective';
jest.mock('@apollo/client');

describe('useCreateBusinessObjective', () => {
  afterEach(() => {
    useMutation.mockReset();
  });

  it('creates new Business Objective', async () => {
    const policy = {
      businessObjective: {
        id: '0',
        title: 'Old BO',
      },
    };
    let createCount = 0;
    const createMutation = jest.fn(async ({ variables: { input } }) => {
      expect(input).toBeDefined();
      expect(input.title).toBe('New BO');

      createCount++;
      return {
        data: {
          createBusinessObjective: {
            businessObjective: { id: `${createCount}` },
          },
        },
      };
    });

    useMutation.mockImplementation(() => [createMutation]);
    const createBusinessObjective = useCreateBusinessObjective();

    let result = await createBusinessObjective({}, { title: 'New BO' });
    expect(createMutation).toHaveBeenCalled();
    expect(result).toEqual('1');

    result = await createBusinessObjective(policy, { title: 'New BO' });
    expect(result).toEqual('2');
  });

  it('reuses existing Business Objective', async () => {
    const policy = {
      businessObjective: {
        id: '0',
        title: 'BO',
      },
    };
    const createMutation = jest.fn(async () => {});

    useMutation.mockImplementation(() => [createMutation]);
    const createBusinessObjective = useCreateBusinessObjective();

    const result = await createBusinessObjective(policy, { title: 'BO' });
    expect(result).toBe('0');
    expect(createMutation).not.toHaveBeenCalled();
  });

  it('resets Business Objective', async () => {
    const policy = {
      businessObjective: {
        id: '0',
        title: 'Old BO',
      },
    };
    const createMutation = jest.fn(async () => {});

    useMutation.mockImplementation(() => [createMutation]);
    const createBusinessObjective = useCreateBusinessObjective();

    const result = await createBusinessObjective(policy, { title: '' });
    expect(result).toBe(null);
    expect(createMutation).not.toHaveBeenCalled();
  });

  it('throws error', async () => {
    const createMutation = jest.fn(async () => {
      return {
        error: new Error('bam!'),
      };
    });

    useMutation.mockImplementation(() => [createMutation]);
    const createBusinessObjective = useCreateBusinessObjective();

    try {
      await createBusinessObjective({}, { title: 'New BO' });
      throw new Error('Must throw an error');
    } catch (error) {
      expect(error).toEqual(new Error('bam!'));
    }

    expect(createMutation).toHaveBeenCalled();
  });
});
