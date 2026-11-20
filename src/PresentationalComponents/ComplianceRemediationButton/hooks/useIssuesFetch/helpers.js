import { uniq } from 'Utilities/helpers';

const isRemediatable = ({ result, remediation_issue_id }) =>
  result === 'fail' && !!remediation_issue_id;

const isSelected =
  (selectedRuleIds) =>
  ({ id }) =>
    selectedRuleIds !== undefined ? selectedRuleIds.includes(id) : true;

export const isReportTestResultSupported = (reportTestResult) => {
  return reportTestResult?.supported;
};

export const buildFetchQueue = (reportTestResults) =>
  reportTestResults
    .filter(isReportTestResultSupported)
    .map(({ id: testResultId }) => ({
      testResultId,
    }));

// Returns { [system_id]: os_minor_version } from selected test results.
export const buildSystemOsMinorMap = (reportTestResults = []) =>
  reportTestResults.reduce((acc, { system_id, os_minor_version }) => {
    if (system_id == null || os_minor_version == null) {
      return acc;
    }

    return {
      ...acc,
      [system_id]: Number(os_minor_version),
    };
  }, {});

// Returns { [ref_id]: value } by mapping ValueDefinition UUID keys to ref_ids.
export const mapValueOverridesToRefIds = (
  valueOverrides = {},
  valueDefinitions = [],
) => {
  const definitionsById = valueDefinitions.reduce(
    (acc, definition) => ({
      ...acc,
      [definition.id]: definition,
    }),
    {},
  );

  return Object.entries(valueOverrides).reduce((acc, [valueId, value]) => {
    const definition = definitionsById[valueId];
    const refId = definition?.ref_id;

    if (!refId) {
      throw new Error(
        `Unable to map value override "${valueId}" to a playbook var_* key`,
      );
    }

    return {
      ...acc,
      [refId]: value,
    };
  }, {});
};

// Returns { [os_minor_version]: { [ref_id]: value } } — which tailored
// values apply for each OS minor. Skips Tailorings with no overrides.
export const buildOverridesByOsMinor = (
  tailorings = [],
  valueDefinitionsBySecurityGuideId = {},
) =>
  tailorings.reduce((acc, tailoring) => {
    const {
      os_minor_version,
      security_guide_id,
      value_overrides: valueOverrides = {},
    } = tailoring;

    if (
      os_minor_version == null ||
      !valueOverrides ||
      Object.keys(valueOverrides).length === 0
    ) {
      return acc;
    }

    const valueDefinitions =
      valueDefinitionsBySecurityGuideId[security_guide_id] || [];

    return {
      ...acc,
      [Number(os_minor_version)]: mapValueOverridesToRefIds(
        valueOverrides,
        valueDefinitions,
      ),
    };
  }, {});

// For an issue's systems, pick the value_overrides map to attach:
// 1. Look up each system's OS minor (systemOsMinorMap)
// 2. Look up that minor's tailored values (overridesByOsMinor)
// 3. No tailored values → undefined (don't add value_overrides)
// 4. One map (or the same map for every minor) → return that map
// 5. Different maps on the same issue → throw (Remediations allows one
//    value_overrides per issue). Issue ids usually differ by SSG
//    version (OS minor) so this is mainly a safety net.
export const resolveValueOverridesForSystems = (
  systems = [],
  systemOsMinorMap = {},
  overridesByOsMinor = {},
) => {
  const minors = uniq(
    systems
      .map((systemId) => systemOsMinorMap[systemId])
      .filter((osMinorVersion) => osMinorVersion != null),
  );

  const overridesForMinors = minors
    .map((osMinorVersion) => overridesByOsMinor[osMinorVersion])
    .filter(
      (valueOverrides) =>
        valueOverrides && Object.keys(valueOverrides).length > 0,
    );

  if (overridesForMinors.length === 0) {
    return undefined;
  }

  const uniqueOverrideMaps = uniq(
    overridesForMinors.map((valueOverrides) => JSON.stringify(valueOverrides)),
  );

  if (uniqueOverrideMaps.length > 1) {
    throw new Error(
      'Cannot attach a single value_overrides map to an issue that spans multiple OS minors with different tailorings',
    );
  }

  return overridesForMinors[0];
};

// Attach value_overrides only when the issue's systems have tailored values.
const attachValueOverrides = (
  issue,
  systemOsMinorMap,
  overridesByOsMinor,
) => {
  const valueOverrides = resolveValueOverridesForSystems(
    issue.systems,
    systemOsMinorMap,
    overridesByOsMinor,
  );

  if (!valueOverrides) {
    return issue;
  }

  return {
    ...issue,
    value_overrides: valueOverrides,
  };
};

// Builds the Remediations dataProvider payload: { systems, issues }.
// Optional override context adds per-issue value_overrides (var_* keys).
export const compileRemediatonData = (
  ruleResults,
  selectedRuleIds,
  {
    systemOsMinorMap = {},
    overridesByOsMinor = {},
  } = {},
) => {
  const remediatableIssues = Object.values(
    ruleResults
      .filter(isRemediatable)
      .filter(isSelected(selectedRuleIds))
      .reduce(
        (
          remediationResult,
          { rule_id, remediation_issue_id, system_id, description, precedence },
        ) => ({
          ...remediationResult,
          [rule_id]: {
            id: remediation_issue_id,
            precedence,
            description,
            systems: uniq([
              ...(remediationResult[rule_id]?.systems || []),
              system_id,
            ]),
          },
        }),
        {},
      ),
  ).map((issue) =>
    attachValueOverrides(issue, systemOsMinorMap, overridesByOsMinor),
  );

  const systems = uniq(
    remediatableIssues.reduce((systemIds, { systems }) => {
      return [...(systemIds || []), ...(systems || [])];
    }, []),
  );

  return {
    systems,
    issues: remediatableIssues,
  };
};
