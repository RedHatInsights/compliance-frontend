export const rules = [
  {
    id: '3fab1809-841d-4570-bcd7-1eeea46a870f',
    ref_id:
      'xccdf_org.ssgproject.content_rule_sebool_polyinstantiation_enabled',
    title: 'Configure the polyinstantiation_enabled SELinux Boolean',
    rationale: '',
    description:
      'By default, the SELinux boolean polyinstantiation_enabled is disabled. This setting should be configured to . To set the polyinstantiation_enabled SELinux boolean, run the following command: $ sudo setsebool -P polyinstantiation_enabled',
    severity: 'medium',
    precedence: 1076,
    identifier: {
      label: 'CCE-84230-2',
      system: 'https://nvd.nist.gov/cce/index.cfm',
    },
    references: [
      {
        href: 'http://www.ssi.gouv.fr/administration/bonnes-pratiques/',
        label: 'BP28(R39)',
      },
    ],
    value_checks: ['0f7fecb0-e91a-457e-ad90-ba9c6a90e789'],
    remediation_available: true,
    rule_group_id: 'dd471434-a81f-4497-ba93-d5a9ef4d3ee9',
    type: 'rule',
  },
  {
    id: '49628b3c-ee56-4771-a597-8f7de1e959ed',
    ref_id: 'xccdf_org.ssgproject.content_rule_selinux_state',
    title: 'Ensure SELinux State is Enforcing',
    rationale:
      'Setting the SELinux state to enforcing ensures SELinux is able to confine potentially compromised processes to the security policy, which is designed to prevent them from causing damage to the system or further elevating their privileges.',
    description:
      'The SELinux state should be set to  at system boot time.  In the file /etc/selinux/config, add or correct the following line to configure the system to boot into enforcing mode: SELINUX=',
    severity: 'high',
    precedence: 898,
    identifier: {
      label: 'CCE-80869-1',
      system: 'https://nvd.nist.gov/cce/index.cfm',
    },
    references: [
      {
        href: 'http://www.ssi.gouv.fr/administration/bonnes-pratiques/',
        label: 'BP28(R4)',
      },
      {
        href: 'http://www.ssi.gouv.fr/administration/bonnes-pratiques/',
        label: 'BP28(R66)',
      },
      {
        href: 'https://www.cisecurity.org/benchmark/red_hat_linux/',
        label: '1.7.1.4',
      },
    ],
    value_checks: ['e233d850-3a66-4821-93d0-c9ccbc258290'],
    remediation_available: true,
    rule_group_id: '7352af3d-9cea-44e5-81a0-b4786ec4d416',
    type: 'rule',
  },
];
