import { useMutation } from '@apollo/client';
import { CREATE_PROFILE, UPDATE_PROFILE } from '../graphql/mutations';

const usePolicyMutation = () => {
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [createProfile] = useMutation(CREATE_PROFILE);

  return async (id, updatedPolicy, businessObjectiveId) => {
    const { name, description, complianceThreshold, values } = updatedPolicy;
    const details = {
      ...(name && { name }),
      ...(description && { description }),
      ...((businessObjectiveId || businessObjectiveId === null) && {
        businessObjectiveId,
      }),
      ...(complianceThreshold
        ? { complianceThreshold: parseFloat(complianceThreshold) }
        : {}),
      ...(values && { values }),
    };

    let mutatedPolicy;
    let error;
    if (id) {
      const policyInput = { id, ...details };

      const result = await updateProfile({ variables: { input: policyInput } });
      mutatedPolicy = result.data?.updateProfile?.profile;
      error = result.error;
    } else {
      const { cloneFromProfileId, refId, benchmarkId } = updatedPolicy;
      const policyInput = {
        ...details,
        cloneFromProfileId,
        refId,
        benchmarkId,
      };

      const result = await createProfile({ variables: { input: policyInput } });
      mutatedPolicy = result.data?.createProfile?.profile;
      error = result.error;
    }

    if (error) {
      throw error;
    }

    return mutatedPolicy;
  };
};

export default usePolicyMutation;
