import { policies } from '@/__fixtures__/policies';
import { systems } from '@/__fixtures__/systems';
import { supportedProfiles } from '@/__fixtures__/supportedProfiles';
import { buildReports } from '@/__factories__/reports';
import { buildReport } from '@/__factories__/report';
import { buildTailorings } from '@/__factories__/tailorings';
import { buildRules } from '@/__factories__/rules';
import { buildRuleGroups } from '@/__factories__/ruleGroups';
import buildValueDefinitions from '@/__factories__/valueDefinitions';
import { buildSecurityGuides } from '@/__factories__/securityGuides';
import testResultsFactory from '@/__factories__/testResults';
import { buildTestResults } from '@/__factories__/ruleResults';
import ruleTreeFactory from '@/__factories__/ruleTree';
import { faker } from '@faker-js/faker';

export const IOP_MOCK_POLICY_ID = policies[0].id;
export const IOP_MOCK_REPORT_ID = 'iop-mock-report-id';
export const IOP_MOCK_SYSTEM_ID = systems[0].id;
export const IOP_MOCK_NEW_POLICY_ID = 'iop-mock-new-policy-id';

export const iopMockPolicies = policies;
export const iopMockReports = buildReports(5);
export const iopMockSystems = systems.map((system) => ({
  ...system,
  created: system.end_time || system.created || new Date().toISOString(),
}));
export const iopMockSupportedProfiles = supportedProfiles;
export const iopMockSecurityGuides = buildSecurityGuides(3);
export const iopMockTailorings = buildTailorings(3).map((tailoring, index) => ({
  ...tailoring,
  os_minor_version: [8, 7, 6][index] ?? tailoring.os_minor_version,
  os_major_version: policies[0].os_major_version,
  security_guide_id: supportedProfiles[0].security_guide_id,
}));
export const iopMockRules = buildRules(8);
export const iopMockRuleGroups = buildRuleGroups(4);
export const iopMockValueDefinitions = buildValueDefinitions(4);
// System-level report test results (not rule_result rows from ruleResults factory).
export const iopMockTestResults = testResultsFactory
  .buildList(10)
  .map((row) => {
    const id = faker.string.uuid();
    return {
      ...row,
      id,
      system_id: id,
      groups: [
        {
          id: 'dc925b53-0bee-4ccf-b95a-4b9611362cf7',
          name: 'Ungrouped Hosts',
          ungrouped: true,
        },
      ],
      // Inventory entities reducer keeps loaded rows only when `created` is set.
      created: row.end_time || new Date().toISOString(),
    };
  });

// Per-rule rows for system details Rule results table (title, severity, description, …).
export const iopMockRuleResults = buildTestResults(10).map((row, index) => ({
  ...row,
  remediation_issue_id:
    index % 2 === 0 ? `ssg:rhel8|${faker.lorem.slug()}` : null,
}));
export const iopMockRuleTree = [
  ruleTreeFactory.build(
    {},
    { transient: { depth: 2, minChildren: 1, maxChildren: 2 } },
  ),
];

export const iopMockReportsOs = [7, 8];
export const iopMockPolicySystemsOs = ['7.8', '7.9'];
export const iopMockSystemsOs = ['7.8', '7.9'];

export const findIopMockPolicy = (policyId) => {
  const match = iopMockPolicies.find(({ id }) => id === policyId);
  return match || { ...iopMockPolicies[0], id: policyId || IOP_MOCK_POLICY_ID };
};

export const findIopMockReport = (reportId) => {
  const match = iopMockReports.find(({ id }) => id === reportId);
  return (
    match || {
      ...buildReport(),
      id: reportId || IOP_MOCK_REPORT_ID,
    }
  );
};

export const findIopMockSystem = (systemId) => {
  const match = iopMockSystems.find(
    ({ id, system_id }) => id === systemId || system_id === systemId,
  );
  return match || { ...iopMockSystems[0], id: systemId || IOP_MOCK_SYSTEM_ID };
};
