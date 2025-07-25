import React, { useCallback } from 'react';
import FinishedCreatePolicyBase from './FinishedCreatePolicyBase';
import useCreatePolicy from 'Utilities/hooks/api/useCreatePolicy';
import useCreateTailoring from 'Utilities/hooks/api/useCreateTailoring';

import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useAssignSystems from 'Utilities/hooks/api/useAssignSystems';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';

export const useUpdatePolicy = () => {
  const { fetch: createPolicy } = useCreatePolicy({ skip: true });
  const { fetch: assignRules } = useAssignRules({ skip: true });
  const { fetch: assignSystems } = useAssignSystems({ skip: true });
  const { fetch: fetchTailorings } = useTailorings({ skip: true });
  const { fetch: updateTailoring } = useUpdateTailoring({ skip: true }); // to update value overrides
  const { fetchQueue: createTailorings } = useCreateTailoring();

  const updatedPolicy = useCallback(
    async (
      _,
      {
        name,
        description,
        businessObjective,
        complianceThreshold,
        selectedRuleRefIds,
        hosts,
        valueOverrides,
        cloneFromProfileId,
      },
      onProgress,
    ) => {
      const minorVersions = selectedRuleRefIds.map(
        ({ osMinorVersion }) => osMinorVersion,
      );
      const expectedUpdates =
        3 + minorVersions.length + Object.keys(valueOverrides).length;
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
            business_objective: businessObjective,
            compliance_threshold: complianceThreshold,
            profile_id: cloneFromProfileId,
          },
        ],
        false,
      );

      dispatchProgress();

      const { id: newPolicyId } = createPolicyResponse.data;

      if (hosts) {
        await assignSystems([
          newPolicyId,
          undefined,
          { ids: hosts.map(({ id }) => id) },
        ]);
      } else {
        const tailoringsToCreate = minorVersions.map((os_minor_version) => ({
          policyId: newPolicyId,
          tailoringCreate: { os_minor_version },
        }));

        await createTailorings(tailoringsToCreate);
      }

      dispatchProgress();

      const fetchPolicyResponse = await fetchTailorings(
        [
          newPolicyId,
          undefined,
          100 /** to ensure we fetch all tailorings at once */,
        ],
        false,
      );
      const tailorings = fetchPolicyResponse.data;

      dispatchProgress();

      for (const tailoring of tailorings) {
        const rulesToAssign = selectedRuleRefIds.find(
          ({ osMinorVersion }) =>
            Number(osMinorVersion) === tailoring.os_minor_version,
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
          false,
        );

        dispatchProgress();
      }

      for (const tailoring of tailorings) {
        const tailoringValueOverrides =
          valueOverrides[tailoring.os_minor_version];

        if (
          tailoringValueOverrides === undefined ||
          Object.keys(tailoringValueOverrides).length === 0
        ) {
          continue;
        }
        await updateTailoring({
          policyId: newPolicyId,
          tailoringId: tailoring.id,
          valuesUpdate: { value_overrides: tailoringValueOverrides },
        });

        dispatchProgress();
      }

      return { id: newPolicyId };
    },
    [
      createPolicy,
      assignSystems,
      fetchTailorings,
      assignRules,
      updateTailoring,
    ],
  );

  return updatedPolicy;
};

const FinishedCreatePolicy = (props) => {
  const updatePolicy = useUpdatePolicy();
  return <FinishedCreatePolicyBase updatePolicy={updatePolicy} {...props} />;
};

export default FinishedCreatePolicy;
