export const fixturesSystemReports = {
  data: [
    {
      id: '0de744d1-b00d-4b6c-a524-de0eb94dbe97',
      title:
        'VPP - Protection Profile for Virtualization v. 1.0 for Red Hat Virtualization',
      description:
        'This compliance profile reflects the core set of security\nrelated configuration settings for deployment of Red Hat Enterprise\nLinux Hypervisor (RHELH) 7.x into U.S. Defense, Intelligence, and Civilian agencies.\nDevelopment partners and sponsors include the U.S. National Institute\nof Standards and Technology (NIST), U.S. Department of Defense,\nthe National Security Agency, and Red Hat.\n\nThis baseline implements configuration requirements from the following\nsources:\n\n- Committee on National Security Systems Instruction No. 1253 (CNSSI 1253)\n- NIST 800-53 control selections for MODERATE impact systems (NIST 800-53)\n- U.S. Government Configuration Baseline (USGCB)\n- NIAP Protection Profile for Virtualization v1.0 (VPP v1.0)\n\nFor any differing configuration requirements, e.g. password lengths, the stricter\nsecurity setting was chosen. Security Requirement Traceability Guides (RTMs) and\nsample System Security Configuration Guides are provided via the\nscap-security-guide-docs package.\n\nThis profile reflects U.S. Government consensus content and is developed through\nthe ComplianceAsCode project, championed by the National\nSecurity Agency. Except for differences in formatting to accommodate\npublishing processes, this profile mirrors ComplianceAsCode\ncontent as minor divergences, such as bugfixes, work through the\nconsensus and release processes.',
      business_objective: null,
      compliance_threshold: 100.0,
      type: 'report',
      os_major_version: 7,
      profile_title:
        'VPP - Protection Profile for Virtualization v. 1.0 for Red Hat Virtualization',
      ref_id: 'xccdf_org.ssgproject.content_profile_rhelh-vpp',
      all_systems_exposed: false,
      percent_compliant: 0,
      compliant_system_count: 0,
      unsupported_system_count: 0,
      reported_system_count: 1,
    },
    {
      id: '2187dfbe-16b2-411d-8f57-bb5cc9f8449f',
      title: 'ANSSI-BP-028 (enhanced)',
      description:
        "This profile contains configurations that align to ANSSI-BP-028 v2.0 at the enhanced hardening level.\n\nANSSI is the French National Information Security Agency, and stands for Agence nationale de la sécurité des systèmes d'information.\nANSSI-BP-028 is a configuration recommendation for GNU/Linux systems.\n\nA copy of the ANSSI-BP-028 can be found at the ANSSI website:\nhttps://www.ssi.gouv.fr/administration/guide/recommandations-de-securite-relatives-a-un-systeme-gnulinux/\n\nAn English version of the ANSSI-BP-028 can also be found at the ANSSI website:\nhttps://cyber.gouv.fr/publications/configuration-recommendations-gnulinux-system",
      business_objective: null,
      compliance_threshold: 100.0,
      type: 'report',
      os_major_version: 7,
      profile_title: 'ANSSI-BP-028 (enhanced)',
      ref_id: 'xccdf_org.ssgproject.content_profile_anssi_nt28_enhanced',
      all_systems_exposed: false,
      percent_compliant: 0,
      compliant_system_count: 0,
      unsupported_system_count: 0,
      reported_system_count: 1,
    },
    {
      id: '3d55732c-1170-4f8e-83ed-b56760f9301d',
      title: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
      description:
        "This profile contains rules to ensure standard security baseline\nof a Red Hat Enterprise Linux 7 system. Regardless of your system's workload\nall of these checks should pass.",
      business_objective: null,
      compliance_threshold: 100.0,
      type: 'report',
      os_major_version: 7,
      profile_title:
        'Standard System Security Profile for Red Hat Enterprise Linux 7',
      ref_id: 'xccdf_org.ssgproject.content_profile_standard',
      all_systems_exposed: false,
      percent_compliant: 0,
      compliant_system_count: 0,
      unsupported_system_count: 0,
      reported_system_count: 1,
    },
  ],
};

export const fixturesReportTestResults = {
  data: [
    {
      id: '14d74821-1918-4499-a77e-734cba7fb549',
      end_time: '2024-09-11T09:23:03.000Z',
      failed_rule_count: 108,
      supported: true,
      score: 64.703888,
      type: 'test_result',
      display_name: 'rhiqe.ptiw11.test',
      groups: [],
      tags: [
        { key: 'pnRsctS', value: 'qqeixff', namespace: 'pasjBk' },
        { key: 'yXgnLy', value: 'KpNJKvv', namespace: 'WkBkgsDI' },
        { key: 'FVaACO', value: 'WdzcBw', namespace: 'WywAdxiL' },
        { key: 'LAkbZeyeJK', value: 'ZyPXMw', namespace: 'gJRWgGQm' },
        { key: 'nKcxvk', value: 'mBorSc', namespace: 'huIorTGAhs' },
      ],
      os_major_version: 7,
      os_minor_version: 8,
      compliant: false,
      system_id: '70d288a3-3691-47dc-a225-b87aa014a511',
      security_guide_version: '0.1.46',
    },
  ],
};
