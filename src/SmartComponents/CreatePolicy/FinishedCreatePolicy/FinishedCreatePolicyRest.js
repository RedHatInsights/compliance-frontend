import React, { useCallback } from 'react';
import FinishedCreatePolicyBase from './FinishedCreatePolicyBase';
import useCreatePolicy from '../../../Utilities/hooks/api/useCreatePolicy';
import useAssignRules from '../../../Utilities/hooks/api/useAssignRules';
import useAssignSystems from '../../../Utilities/hooks/api/useAssignSystems';
import useTailorings from '../../../Utilities/hooks/api/useTailorings';

export const useUpdatePolicy = () => {
  const { fetch: createPolicy } = useCreatePolicy({ skip: true });
  const { fetch: assignRules } = useAssignRules({ skip: true });
  const { fetch: assignSystems } = useAssignSystems({ skip: true });
  const { fetch: fetchTailorings } = useTailorings({ skip: true });

  const updatedPolicy = useCallback(
    async (
      _,
      {
        name,
        description,
        businessObjective,
        complianceThreshold,
        benchmarkId,
        selectedRuleRefIds,
        hosts,
      },
      onProgress
    ) => {
      const minorVersions = selectedRuleRefIds.map(
        ({ osMinorVersion }) => osMinorVersion
      );
      const expectedUpdates = 3 + minorVersions.length;
      let progress = 0;

      const dispatchProgress = () => {
        if (onProgress) {
          onProgress(++progress / expectedUpdates);
        }
      };

      const createPolicyResponse = await createPolicy(
        [
          undefined,
          {
            title: name,
            description,
            business_objective: businessObjective.title,
            compliance_threshold: complianceThreshold,
            profile_id: benchmarkId,
          },
        ],
        false
      );

      dispatchProgress();

      const { id: newPolicyId } = createPolicyResponse.data;

      await assignSystems(
        [newPolicyId, undefined, { ids: hosts.map(({ id }) => id) }],
        false
      );

      dispatchProgress();

      const fetchPolicyResponse = await fetchTailorings(
        [
          newPolicyId,
          undefined,
          100 /** to ensure we fetch all tailorings at once */,
        ],
        false
      );
      const tailorings = fetchPolicyResponse.data;

      dispatchProgress();

      tailorings.forEach(async (tailoring) => {
        const rulesToAssign = selectedRuleRefIds.find(
          ({ osMinorVersion }) =>
            Number(osMinorVersion) === tailoring.os_minor_version
        ).ruleRefIds;

        await assignRules(
          [
            newPolicyId,
            tailoring.id,
            undefined,
            {
              ids: rulesToAssign,
            },
          ],
          false
        );

        dispatchProgress();
      });

      return { id: newPolicyId };
    },
    [createPolicy, assignRules, assignSystems, fetchTailorings]
  );

  return updatedPolicy;
};

const FinishedCreatePolicyRest = (props) => {
  const updatePolicy = useUpdatePolicy();

  return <FinishedCreatePolicyBase updatePolicy={updatePolicy} {...props} />;
};

export default FinishedCreatePolicyRest;
