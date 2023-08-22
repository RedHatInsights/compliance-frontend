export const compileData = (policyData, ruleTreesData, valueDefinitionsData) =>
  policyData && {
    profile: {
      ...policyData.profile,
      policy: {
        ...(policyData?.profile?.policy || {}),
        profiles:
          policyData?.profile?.policy?.profiles?.map((profile) => {
            const ruleTree =
              ruleTreesData?.profile?.policy?.profiles?.find(
                ({ id }) => id === profile.id
              )?.benchmark.ruleTree || {};

            const valueDefinitions =
              valueDefinitionsData?.profile?.policy?.profiles?.find(
                ({ id }) => id === profile.id
              )?.benchmark.valueDefinitions || [];

            const values =
              valueDefinitionsData?.profile?.policy?.profiles?.find(
                ({ id }) => id === profile.id
              )?.values;

            return {
              ...profile,
              values,
              benchmark: {
                ...profile.benchmark,
                ruleTree,
                valueDefinitions,
              },
            };
          }) || [],
      },
    },
  };
