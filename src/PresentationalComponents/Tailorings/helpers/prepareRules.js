export const prepareRules = ({
  securityGuideRules,
  profileRules,
  tailoringRules,
  valueDefinitions,
  valueOverrides,
  // selected,
}) => {
  const combinedRules = [
    ...(tailoringRules?.data || []),
    ...(profileRules?.data || []),
    ...(securityGuideRules?.data || []),
  ];
  const rules = combinedRules.filter(
    (obj, index) => index === combinedRules.findIndex((o) => obj.id === o.id),
  );
  // TODO: investigate better solution to show Selected only correctly
  // const filteredRules = selected
  //   ? rules.filter(({ id }) => selected.includes(id))
  //   : rules;
  const data = rules?.map((rule) => {
    const definitions = rule.value_checks?.map((checkId) =>
      valueDefinitions?.data?.find(({ id }) => id === checkId),
    );

    // TODO doublecheck, maybe the entries should rather be created from the value_checks
    const ruleValues = valueOverrides
      ? Object.fromEntries(
          Object.entries(valueOverrides).filter(([id]) =>
            rule.value_checks.includes(id),
          ),
        )
      : undefined;

    return {
      // TODO This is mostly used because we lazy load definitions
      loaded: !!valueDefinitions?.data,
      ...rule,
      valueDefinitions: definitions,
      ruleValues,
    };
  });

  return {
    meta: {
      total:
        tailoringRules?.meta.total ||
        0 + profileRules?.meta.total ||
        0 + securityGuideRules?.meta.total ||
        0,
    },
    data,
  };
};

export default prepareRules;
