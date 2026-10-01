import { policies } from '@/__fixtures__/policies';
import { systems } from '@/__fixtures__/systems';
import { supportedProfiles } from '@/__fixtures__/supportedProfiles';
import { buildReport } from '@/__factories__/report';
import { buildTailorings } from '@/__factories__/tailorings';
import buildValueDefinitions from '@/__factories__/valueDefinitions';
import { buildSecurityGuides } from '@/__factories__/securityGuides';
import { buildTestResults } from '@/__factories__/ruleResults';
import { faker } from '@faker-js/faker';

export const IOP_MOCK_POLICY_ID = policies[0].id;
export const IOP_MOCK_REPORT_ID = 'iop-mock-report-id';
export const IOP_MOCK_SYSTEM_ID = systems[0].id;
export const IOP_MOCK_NEW_POLICY_ID = 'iop-mock-new-policy-id';

const UNGROUPED_HOSTS = [
  {
    id: 'dc925b53-0bee-4ccf-b95a-4b9611362cf7',
    name: 'Ungrouped Hosts',
    ungrouped: true,
  },
];

const REPORT_COUNTS = {
  type: 'report',
  all_systems_exposed: true,
  compliance_threshold: 95,
  assigned_system_count: 12,
  reported_system_count: 9,
  compliant_system_count: 6,
  unsupported_system_count: 0,
  never_reported_system_count: 3,
  percent_compliant: 67,
};

const REPORTING_ROLES = [
  'web',
  'db',
  'app',
  'mail',
  'proxy',
  'auth',
  'nfs',
  'backup',
  'monitor',
];

const NEVER_REPORTED_SYSTEMS = [
  { role: 'staging', minor: 2 },
  { role: 'lab', minor: 5 },
  { role: 'build', minor: 8 },
];

export const iopMockPolicies = policies;
export const iopMockReports = [
  {
    ...REPORT_COUNTS,
    id: '9c1a0e10-1111-4a11-9a11-111111111111',
    title: 'Production web baseline',
    profile_title:
      'CIS Red Hat Enterprise Linux 9 Benchmark for Level 2 - Server',
    ref_id: 'xccdf_org.ssgproject.content_profile_cis',
    os_major_version: 9,
    description:
      'Baseline for internet-facing RHEL 9 servers aligned to CIS Level 2 - Server.',
    business_objective: 'Harden production web servers',
  },
  {
    ...REPORT_COUNTS,
    id: '9c1a0e10-2222-4a22-9a22-222222222222',
    title: 'Cardholder data systems',
    profile_title:
      'PCI-DSS v4.0.1 Control Baseline for Red Hat Enterprise Linux 9',
    ref_id: 'xccdf_org.ssgproject.content_profile_pci-dss',
    os_major_version: 9,
    description:
      'Controls for systems that store, process, or transmit cardholder data.',
    business_objective: 'Meet PCI-DSS requirements',
  },
  {
    ...REPORT_COUNTS,
    id: '9c1a0e10-3333-4a33-9a33-333333333333',
    title: 'DISA STIG servers',
    profile_title: 'DISA STIG for Red Hat Enterprise Linux 9',
    ref_id: 'xccdf_org.ssgproject.content_profile_stig',
    os_major_version: 9,
    description: 'DISA STIG baseline for RHEL 9 servers.',
    business_objective: 'Align servers with DISA STIG',
  },
  {
    ...REPORT_COUNTS,
    id: '8c1a0e10-4444-4a44-8a44-444444444444',
    title: 'HIPAA clinical systems',
    profile_title:
      'Health Insurance Portability and Accountability Act (HIPAA)',
    ref_id: 'xccdf_org.ssgproject.content_profile_hipaa',
    os_major_version: 8,
    description:
      'Baseline for systems that handle electronic protected health information.',
    business_objective: 'Protect clinical systems',
  },
  {
    ...REPORT_COUNTS,
    id: '7c1a0e10-5555-4a55-8a55-555555555555',
    title: 'ANSSI intermediary',
    profile_title: 'ANSSI-BP-028 (intermediary)',
    ref_id: 'xccdf_org.ssgproject.content_profile_anssi_bp28_intermediary',
    os_major_version: 7,
    description:
      'ANSSI-BP-028 intermediary hardening level for RHEL 7 systems.',
    business_objective: 'Apply ANSSI hardening',
  },
];
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
const rule = (
  id,
  refId,
  title,
  severity,
  remediationAvailable,
  identifier,
) => ({
  id,
  refId,
  title,
  severity,
  remediationAvailable,
  identifier,
});

const group = (id, title, children) => ({ id, title, children });

// Shared by the rule tree, rule groups and rules so policy details can title each node.
const POLICY_RULE_NODES = [
  group('4f1c2a10-1111-4a11-8a11-000000000001', 'System Settings', [
    group('4f1c2a10-1111-4a11-8a11-000000000002', 'Configuring SSH', [
      rule(
        '4f1c2a10-2222-4a22-8a22-000000000001',
        'sshd_disable_root_login',
        'Disable SSH Root Login',
        'high',
        true,
        'CCE-80870-9',
      ),
      rule(
        '4f1c2a10-2222-4a22-8a22-000000000002',
        'sshd_set_idle_timeout',
        'Set SSH Client Alive Interval',
        'medium',
        true,
        'CCE-80901-2',
      ),
      rule(
        '4f1c2a10-2222-4a22-8a22-000000000003',
        'sshd_disable_empty_passwords',
        'Disable SSH Empty Passwords',
        'high',
        true,
        'CCE-80872-5',
      ),
    ]),
    group(
      '4f1c2a10-1111-4a11-8a11-000000000003',
      'Account and Access Control',
      [
        rule(
          '4f1c2a10-2222-4a22-8a22-000000000004',
          'accounts_password_minlen_login_defs',
          'Set Password Minimum Length',
          'medium',
          true,
          'CCE-80656-2',
        ),
        rule(
          '4f1c2a10-2222-4a22-8a22-000000000005',
          'account_disable_post_pw_expiration',
          'Lock Inactive User Accounts',
          'low',
          false,
          'CCE-80954-1',
        ),
      ],
    ),
  ]),
  group(
    '4f1c2a10-1111-4a11-8a11-000000000004',
    'Installing and Maintaining Software',
    [
      rule(
        '4f1c2a10-2222-4a22-8a22-000000000006',
        'ensure_gpgcheck_globally_activated',
        'Ensure gpgcheck Enabled for All yum Package Repositories',
        'high',
        true,
        'CCE-80837-8',
      ),
      rule(
        '4f1c2a10-2222-4a22-8a22-000000000007',
        'security_patches_up_to_date',
        'Ensure Software Patches Installed',
        'medium',
        false,
        'CCE-26895-3',
      ),
    ],
  ),
  group('4f1c2a10-1111-4a11-8a11-000000000005', 'Services', [
    rule(
      '4f1c2a10-2222-4a22-8a22-000000000008',
      'service_firewalld_enabled',
      'Enable firewalld',
      'high',
      true,
      'CCE-80860-0',
    ),
    rule(
      '4f1c2a10-2222-4a22-8a22-000000000009',
      'service_auditd_enabled',
      'Enable auditd',
      'medium',
      true,
      'CCE-80863-4',
    ),
  ]),
];

const isRuleGroup = (node) => Array.isArray(node.children);

const toApiRuleTree = (nodes) =>
  nodes.map((node) =>
    isRuleGroup(node)
      ? {
          id: node.id,
          type: 'rule_group',
          children: toApiRuleTree(node.children),
        }
      : { id: node.id, type: 'rule' },
  );

const collectRuleGroups = (nodes, groups = []) => {
  nodes.forEach((node) => {
    if (!isRuleGroup(node)) {
      return;
    }

    groups.push({
      id: node.id,
      ref_id: `xccdf_org.ssgproject.content_group_${node.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')}`,
      title: node.title,
      description: node.title,
      rationale: '',
      precedence: groups.length + 1,
      type: 'rule_group',
    });
    collectRuleGroups(node.children, groups);
  });

  return groups;
};

const collectRules = (nodes, groupId = null, rules = []) => {
  nodes.forEach((node) => {
    if (isRuleGroup(node)) {
      collectRules(node.children, node.id, rules);
      return;
    }

    rules.push({
      id: node.id,
      ref_id: `xccdf_org.ssgproject.content_rule_${node.refId}`,
      title: node.title,
      rationale: node.title,
      description: node.title,
      severity: node.severity,
      precedence: rules.length + 1,
      identifier: { label: node.identifier, system: 'https://ncp.nist.gov' },
      references: [],
      value_checks: [],
      remediation_available: node.remediationAvailable,
      rule_group_id: groupId,
      type: 'rule',
      remediation_issue_id: node.remediationAvailable
        ? `ssg:rhel8|anssi|${node.refId}`
        : null,
    });
  });

  return rules;
};

export const iopMockRuleTree = toApiRuleTree(POLICY_RULE_NODES);
export const iopMockRuleGroups = collectRuleGroups(POLICY_RULE_NODES);
export const iopMockRules = collectRules(POLICY_RULE_NODES);
export const iopMockValueDefinitions = buildValueDefinitions(4);

const buildReportSystem = ({
  report,
  role,
  index,
  minor,
  scanned,
  compliant,
}) => {
  const id = `${report.id}-${scanned ? 'reported' : 'never'}-${index + 1}`;

  return {
    id,
    system_id: id,
    display_name: `server-${role}-${index + 1}.test`,
    os_major_version: report.os_major_version,
    // String so minor 0 still renders: the name cell treats numeric 0 as missing.
    os_minor_version: String(minor),
    end_time: scanned ? '2026-02-18T14:22:00Z' : null,
    created: '2026-02-18T14:22:00Z',
    failed_rule_count: compliant ? 0 : 8 + index,
    supported: true,
    score: compliant ? 97 : 61,
    compliant,
    security_guide_version: index % 2 === 0 ? '0.1.76' : '0.1.74',
    type: 'test_result',
    groups: UNGROUPED_HOSTS,
    tags: [],
  };
};

export const iopMockReportTestResultsByReportId = Object.fromEntries(
  iopMockReports.map((report) => [
    report.id,
    REPORTING_ROLES.map((role, index) =>
      buildReportSystem({
        report,
        role,
        index,
        minor: index,
        scanned: true,
        compliant: index < report.compliant_system_count,
      }),
    ),
  ]),
);

export const iopMockReportSystemsByReportId = Object.fromEntries(
  iopMockReports.map((report) => [
    report.id,
    NEVER_REPORTED_SYSTEMS.map(({ role, minor }, index) =>
      buildReportSystem({
        report,
        role,
        index,
        minor,
        scanned: false,
        compliant: false,
      }),
    ),
  ]),
);

export const iopMockReportSsgVersions = ['0.1.74', '0.1.76'];

export const systemsForReport = (byReportId, reportId) =>
  (reportId && byReportId[reportId]) || byReportId[iopMockReports[0].id] || [];

export const osVersionsForSystems = (rows) =>
  rows.map(
    ({ os_major_version, os_minor_version }) =>
      `${os_major_version}.${os_minor_version}`,
  );

// Per-rule rows for system details Rule results table (title, severity, description, …).
export const iopMockRuleResults = buildTestResults(10).map((row, index) => ({
  ...row,
  remediation_issue_id:
    index % 2 === 0 ? `ssg:rhel8|${faker.lorem.slug()}` : null,
}));

export const iopMockReportsOs = [
  ...new Set(iopMockReports.map(({ os_major_version }) => os_major_version)),
].sort((left, right) => left - right);
// /security_guides/os_versions returns major versions only (integers).
export const iopMockSecurityGuidesOs = [7, 8];
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
