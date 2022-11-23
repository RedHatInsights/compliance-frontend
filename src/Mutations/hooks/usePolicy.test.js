import useCreateBusinessObjective from './useCreateBusinessObjective';
import usePolicyMutation from './usePolicyMutation';
import useAssociateSystems from './useAssociateSystems';
import useTailorProfile from './useTailorProfile';
import { default as usePolicyHook } from './usePolicy';

jest.mock('./useCreateBusinessObjective');
jest.mock('./usePolicyMutation');
jest.mock('./useAssociateSystems');
jest.mock('./useTailorProfile');

describe('usePolicy', () => {
  afterEach(() => {
    [
      useCreateBusinessObjective,
      usePolicyMutation,
      useAssociateSystems,
      useAssociateSystems,
    ].forEach((mock) => {
      mock.mockReset();
    });
  });

  it('creates new policy with no system and rule associations', async () => {
    const updatedPolicy = {
      name: 'New policy',
      hosts: [],
    };

    let progressCount = 0;
    const onProgress = () => {
      progressCount++;
    };

    const createBusinessObjective = jest.fn(async () => null);
    const policyMutation = jest.fn(async () => ({ id: '1' }));
    const associateSystems = jest.fn(async () => ({
      policy: { profiles: [] },
    }));
    const tailorProfile = jest.fn(async () => {});

    useCreateBusinessObjective.mockReturnValue(createBusinessObjective);
    usePolicyMutation.mockReturnValue(policyMutation);
    useAssociateSystems.mockReturnValue(associateSystems);
    useTailorProfile.mockReturnValue(tailorProfile);

    const usePolicy = usePolicyHook();
    await usePolicy(null, updatedPolicy, onProgress);

    expect(createBusinessObjective).toBeCalled();
    expect(policyMutation).toBeCalledWith(undefined, updatedPolicy, null);
    expect(associateSystems).toBeCalled();
    expect(tailorProfile).not.toBeCalled();

    expect(progressCount).toBe(3);
  });

  it('creates new policy with systems, tailoring, and business objective', async () => {
    const hosts = [
      { id: 'h1', osVersion: '7.1' },
      { id: 'h2', osVersion: '7.2' },
    ];
    const profile1SelectedRuleRefIds = {
      id: '1',
      ruleRefIds: ['ref1', 'ref2'],
    };
    const profile2SelectedRuleRefIds = {
      id: '2',
      ruleRefIds: ['ref3', 'ref4'],
    };
    const selectedRuleRefIds = [
      profile1SelectedRuleRefIds,
      profile2SelectedRuleRefIds,
    ];
    const businessObjective = {
      title: 'New Objective',
    };
    const updatedPolicy = {
      name: 'New policy',
      hosts,
      selectedRuleRefIds,
      businessObjective,
    };

    let progressCount = 0;
    const onProgress = () => {
      progressCount++;
    };

    const newPolicyProfiles = [{ id: '1' }, { id: '2' }];

    const createBusinessObjective = jest.fn(async () => 'BOid');
    const policyMutation = jest.fn(async () => ({ id: '3' }));
    const associateSystems = jest.fn(async () => ({
      policy: { profiles: newPolicyProfiles },
    }));
    const tailorProfile = jest.fn(async () => {});

    useCreateBusinessObjective.mockReturnValue(createBusinessObjective);
    usePolicyMutation.mockReturnValue(policyMutation);
    useAssociateSystems.mockReturnValue(associateSystems);
    useTailorProfile.mockReturnValue(tailorProfile);

    const usePolicy = usePolicyHook();
    await usePolicy(null, updatedPolicy, onProgress);

    expect(createBusinessObjective).toBeCalledWith(null, businessObjective);
    expect(policyMutation).toBeCalledWith(undefined, updatedPolicy, 'BOid');
    expect(associateSystems).toBeCalledWith({ id: '3' }, hosts);
    expect(tailorProfile).toBeCalledWith(
      profile1SelectedRuleRefIds,
      newPolicyProfiles
    );
    expect(tailorProfile).toBeCalledWith(
      profile2SelectedRuleRefIds,
      newPolicyProfiles
    );
    expect(tailorProfile).toBeCalledTimes(2);
    expect(progressCount).toBe(5);
  });

  it('updates policy, its systems, tailoring, and business objective', async () => {
    const oldPolicy = {
      id: '3',
      name: 'Old policy',
      businessObjective: {
        title: 'Old Objective',
      },
    };

    const hosts = [
      { id: 'h1', osVersion: '7.1' },
      { id: 'h2', osVersion: '7.2' },
    ];
    const profile1SelectedRuleRefIds = {
      id: '1',
      ruleRefIds: ['ref1', 'ref2'],
    };
    const profile2SelectedRuleRefIds = {
      id: '2',
      ruleRefIds: ['ref3', 'ref4'],
    };
    const selectedRuleRefIds = [
      profile1SelectedRuleRefIds,
      profile2SelectedRuleRefIds,
    ];
    const businessObjective = {
      title: 'New Objective',
    };
    const updatedPolicy = {
      name: 'Updated policy',
      hosts,
      selectedRuleRefIds,
      businessObjective,
    };

    let progressCount = 0;
    const onProgress = () => {
      progressCount++;
    };

    const newPolicyProfiles = [{ id: '1' }, { id: '2' }];

    const createBusinessObjective = jest.fn(async () => 'BOid');
    const policyMutation = jest.fn(async () => ({ id: '3' }));
    const associateSystems = jest.fn(async () => ({
      policy: { profiles: newPolicyProfiles },
    }));
    const tailorProfile = jest.fn(async () => {});

    useCreateBusinessObjective.mockReturnValue(createBusinessObjective);
    usePolicyMutation.mockReturnValue(policyMutation);
    useAssociateSystems.mockReturnValue(associateSystems);
    useTailorProfile.mockReturnValue(tailorProfile);

    const usePolicy = usePolicyHook();
    await usePolicy(oldPolicy, updatedPolicy, onProgress);

    expect(createBusinessObjective).toBeCalledWith(
      oldPolicy,
      businessObjective
    );
    expect(policyMutation).toBeCalledWith('3', updatedPolicy, 'BOid');
    expect(associateSystems).toBeCalledWith(oldPolicy, hosts);
    expect(tailorProfile).toBeCalledWith(
      profile1SelectedRuleRefIds,
      newPolicyProfiles
    );
    expect(tailorProfile).toBeCalledWith(
      profile2SelectedRuleRefIds,
      newPolicyProfiles
    );
    expect(tailorProfile).toBeCalledTimes(2);
    expect(progressCount).toBe(5);
  });
});
