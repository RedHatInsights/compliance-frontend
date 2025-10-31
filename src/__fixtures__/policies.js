export const policies = [
  {
    id: '2e728220-73b7-4954-982a-db9678402299',
    title: 'ANSSI',
    description:
      "This profile contains configurations that align to ANSSI-BP-028 v2.0 at the intermediary hardening level.\n\nANSSI is the French National Information Security Agency, and stands for Agence nationale de la sécurité des systèmes d'information.\nANSSI-BP-028 is a configuration recommendation for GNU/Linux systems.",
    business_objective: 'Testing 👋',
    compliance_threshold: '90.0',
    total_system_count: 2,
    type: 'policy',
    os_major_version: 8,
    profile_title: 'ANSSI-BP-028 (intermediary)',
    ref_id: 'xccdf_org.ssgproject.content_profile_anssi_bp28_intermediary',
  },
  {
    id: 'b93fa6de-4855-4c5a-af12-17e859b88dfa',
    title: 'CIS',
    description:
      'This profile defines a baseline that aligns to the "Level 1 - Server" configuration from the Center for Internet Security® Red Hat Enterprise Linux 7 Benchmark™, v4.0.0, released 2023-12-21.',
    business_objective: null,
    compliance_threshold: '100.0',
    total_system_count: 0,
    type: 'policy',
    os_major_version: 7,
    profile_title:
      'CIS Red Hat Enterprise Linux 7 Benchmark for Level 1 - Server',
    ref_id: 'xccdf_org.ssgproject.content_profile_cis_server_l1',
  },
  {
    id: '26affdde-a4e2-477d-89dd-c82d723e3636',
    title: 'HIPAA',
    description:
      "The HIPAA Security Rule establishes U.S. national standards to protect individuals' electronic personal health information that is created, received, used, or maintained by a covered entity.",
    business_objective: null,
    compliance_threshold: '99.0',
    total_system_count: 1,
    type: 'policy',
    os_major_version: 7,
    profile_title:
      'Health Insurance Portability and Accountability Act (HIPAA)',
    ref_id: 'xccdf_org.ssgproject.content_profile_hipaa',
  },
];
