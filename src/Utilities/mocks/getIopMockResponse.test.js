import { getIopMockResponse } from './getIopMockResponse';
import { iopMockPolicies } from './iopMockData';
import prepareTreeTable from '@/PresentationalComponents/Tailorings/helpers/prepareTreeTable';

describe('getIopMockResponse', () => {
  it('returns paginated policies with total meta', () => {
    const result = getIopMockResponse('policies', { limit: 2, offset: 0 });

    expect(result.data).toHaveLength(2);
    expect(result.meta.total).toBe(iopMockPolicies.length);
  });

  it('returns only total when onlyTotal is true', () => {
    const result = getIopMockResponse('policies', {}, { onlyTotal: true });

    expect(result).toBe(iopMockPolicies.length);
  });

  it('returns a single policy by id', () => {
    const policyId = iopMockPolicies[1].id;
    const result = getIopMockResponse('policy', { policyId });

    expect(result.data.id).toBe(policyId);
  });

  it('returns OS versions for reportsOS', () => {
    const result = getIopMockResponse('reportsOS', {});

    expect(result.data).toEqual([7, 8, 9]);
  });

  it('returns realistic report names and policy types', () => {
    const result = getIopMockResponse('reports', {});
    const cisReport = result.data.find(
      ({ title }) => title === 'Production web baseline',
    );

    expect(cisReport.profile_title).toBe(
      'CIS Red Hat Enterprise Linux 9 Benchmark for Level 2 - Server',
    );
    expect(cisReport.os_major_version).toBe(9);
    expect(result.data.map(({ profile_title }) => profile_title)).toEqual(
      expect.arrayContaining([
        'PCI-DSS v4.0.1 Control Baseline for Red Hat Enterprise Linux 9',
        'DISA STIG for Red Hat Enterprise Linux 9',
        'Health Insurance Portability and Accountability Act (HIPAA)',
        'ANSSI-BP-028 (intermediary)',
      ]),
    );
  });

  it('returns report systems that match the report major version', () => {
    const report = getIopMockResponse('reports', {}).data.find(
      ({ os_major_version }) => os_major_version === 9,
    );
    const systems = getIopMockResponse('reportTestResults', {
      reportId: report.id,
    }).data;

    expect(systems.map(({ display_name }) => display_name)).toEqual([
      'server-web-1.test',
      'server-db-2.test',
      'server-app-3.test',
      'server-mail-4.test',
      'server-proxy-5.test',
      'server-auth-6.test',
      'server-nfs-7.test',
      'server-backup-8.test',
      'server-monitor-9.test',
    ]);
    expect(
      systems.every(({ os_major_version }) => os_major_version === 9),
    ).toBe(true);
    expect(systems.map(({ os_minor_version }) => os_minor_version)).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ]);
  });

  it('returns OS major versions only for securityGuidesOS', () => {
    const result = getIopMockResponse('securityGuidesOS', {});

    expect(result.data).toEqual([7, 8]);
  });

  it('builds a titled rule tree whose rules match group ids', () => {
    const tree = getIopMockResponse('tailoringRuleTree', {}).data;
    const groups = getIopMockResponse('ruleGroups', {}).data;
    const prepared = prepareTreeTable({
      tailoringRuleTree: tree,
      ruleGroups: groups,
    });

    expect(prepared.map(({ title }) => title)).toEqual([
      'System Settings',
      'Installing and Maintaining Software',
      'Services',
    ]);
    expect(
      prepared
        .find(({ title }) => title === 'System Settings')
        .twigs.map(({ title }) => title),
    ).toEqual(['Account and Access Control', 'Configuring SSH']);

    const sshGroupId = '4f1c2a10-1111-4a11-8a11-000000000002';
    const sshRules = getIopMockResponse('tailoringRules', {
      filters: `rule_group_id ^ (${sshGroupId})`,
    }).data;

    expect(sshRules.map(({ title }) => title)).toEqual([
      'Disable SSH Root Login',
      'Set SSH Client Alive Interval',
      'Disable SSH Empty Passwords',
    ]);
    expect(
      sshRules.every(({ rule_group_id }) => rule_group_id === sshGroupId),
    ).toBe(true);
  });

  it('returns a created policy id for createPolicy mutations', () => {
    const result = getIopMockResponse('createPolicy', {
      policy: { title: 'Test policy' },
    });

    expect(result.data.id).toBeTruthy();
    expect(result.data.title).toBe('Test policy');
  });
});
