import { uniq } from 'Utilities/helpers';

const CONTENT_VALUE_PREFIX = 'xccdf_org.ssgproject.content_value_';

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

// Playbooks use short keys (var_*), not full XCCDF ref_ids
// (xccdf_org.ssgproject.content_value_var_*).
export const toPlaybookVarKey = (refId) => {
  if (!refId) {
    return undefined;
  }

  if (refId.startsWith(CONTENT_VALUE_PREFIX)) {
    return refId.slice(CONTENT_VALUE_PREFIX.length);
  }

  const shortVarMatch = refId.match(/var_[A-Za-z0-9_]+$/);
  return shortVarMatch ? shortVarMatch[0] : refId;
};

// Returns { [var_*]: value }. Optionally limits to the rule's value_checks
// so each issue only gets overrides for that rule.
export const mapValueOverridesToPlaybookVars = (
  valueOverrides = {},
  valueDefinitions = [],
  valueCheckIds = [],
) => {
  const definitionsById = valueDefinitions.reduce(
    (acc, definition) => ({
      ...acc,
      [definition.id]: definition,
    }),
    {},
  );

  const allowedIds =
    valueCheckIds.length > 0 ? new Set(valueCheckIds) : undefined;

  return Object.entries(valueOverrides).reduce((acc, [valueId, value]) => {
    if (allowedIds && !allowedIds.has(valueId)) {
      return acc;
    }

    const definition = definitionsById[valueId];
    const playbookVarKey = toPlaybookVarKey(definition?.ref_id);

    if (!playbookVarKey) {
      throw new Error(
        `Unable to map value override "${valueId}" to a playbook var_* key`,
      );
    }

    return {
      ...acc,
      [playbookVarKey]: value,
    };
  }, {});
};

// Returns { [os_minor_version]: { security_guide_id, value_overrides } }
// with UUID-keyed overrides from each Tailoring.
export const buildOverridesByOsMinor = (tailorings = []) =>
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

    return {
      ...acc,
      [Number(os_minor_version)]: {
        security_guide_id,
        value_overrides: valueOverrides,
      },
    };
  }, {});

// For an issue's systems, pick the Tailoring override entry to use:
// 1. Look up each system's OS minor (systemOsMinorMap)
// 2. Look up that minor's tailored values (overridesByOsMinor)
// 3. No tailored values → undefined (don't add value_overrides)
// 4. One map (or the same map for every minor) → return that entry
// 5. Different maps on the same issue → throw (Remediations allows one
//    value_overrides per issue). Issue ids usually differ by SSG
//    version (≈ OS minor), so this is mainly a safety net.
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
      (entry) =>
        entry?.value_overrides && Object.keys(entry.value_overrides).length > 0,
    );

  if (overridesForMinors.length === 0) {
    return undefined;
  }

  const uniqueOverrideMaps = uniq(
    overridesForMinors.map(({ value_overrides }) =>
      JSON.stringify(value_overrides),
    ),
  );

  if (uniqueOverrideMaps.length > 1) {
    throw new Error(
      'Cannot attach a single value_overrides map to an issue that spans multiple OS minors with different tailorings',
    );
  }

  return overridesForMinors[0];
};

// Attach per-rule value_overrides (short var_* keys) when the issue's
// systems have tailored values that apply to this rule's value_checks.
const attachValueOverrides = (
  issue,
  systemOsMinorMap,
  overridesByOsMinor,
  valueDefinitionsBySecurityGuideId,
  valueChecksByRuleId,
) => {
  const overrideEntry = resolveValueOverridesForSystems(
    issue.systems,
    systemOsMinorMap,
    overridesByOsMinor,
  );

  if (!overrideEntry) {
    return issue;
  }

  const valueChecks = valueChecksByRuleId[issue.rule_id] || [];
  const valueOverrides = mapValueOverridesToPlaybookVars(
    overrideEntry.value_overrides,
    valueDefinitionsBySecurityGuideId[overrideEntry.security_guide_id] || [],
    valueChecks,
  );

  if (Object.keys(valueOverrides).length === 0) {
    return issue;
  }

  return {
    ...issue,
    value_overrides: valueOverrides,
  };
};

// Builds the Remediations dataProvider payload: { systems, issues }.
// Optional context adds per-issue value_overrides (playbook var_* keys).
export const compileRemediatonData = (
  ruleResults,
  selectedRuleIds,
  {
    systemOsMinorMap = {},
    overridesByOsMinor = {},
    valueDefinitionsBySecurityGuideId = {},
    valueChecksByRuleId = {},
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
            rule_id,
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
  ).map((issue) => {
    const issueWithOverrides = attachValueOverrides(
      issue,
      systemOsMinorMap,
      overridesByOsMinor,
      valueDefinitionsBySecurityGuideId,
      valueChecksByRuleId,
    );
    const { rule_id: _ruleId, ...remediationIssue } = issueWithOverrides;
    return remediationIssue;
  });

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
