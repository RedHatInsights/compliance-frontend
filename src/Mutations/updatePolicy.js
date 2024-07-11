import { apiInstance } from '../Utilities/hooks/useQuery';

const updatePolicy = async (policyId, updatedPolicy) => {
  return await apiInstance.updatePolicy(policyId, null, {
    description: updatedPolicy?.description,
    business_objective: updatedPolicy?.business_objective ?? '-',
    compliance_threshold: parseFloat(updatedPolicy?.compliance_threshold),
  });
};

export default updatePolicy;
