export const supportedProfiles = [
  {
    id: "1f506398-5fc3-47b0-86c4-0c6e6525c34c",
    title: "CIS Red Hat Enterprise Linux 8 Benchmark for Level 2 - Server",
    description:
      'This profile defines a baseline that aligns to the "Level 2 - Server"\nconfiguration from the Center for Internet Security® Red Hat Enterprise\nLinux 8 Benchmark™, v3.0.0, released 2023-10-30.\n\nThis profile includes Center for Internet Security®\nRed Hat Enterprise Linux 8 CIS Benchmarks™ content.',
    ref_id: "xccdf_org.ssgproject.content_profile_cis",
    security_guide_id: "13000ad2-8b34-446c-92b1-2bb6011daa06",
    security_guide_version: "0.1.74",
    os_major_version: 8,
    os_minor_versions: [10, 9, 8, 7, 6, 5, 4, 3],
    type: "supported_profile",
  },
  {
    id: "2374a08a-5aff-41c3-98b2-92b6e7fbf209",
    title: "CIS Red Hat Enterprise Linux 8 Benchmark for Level 1 - Workstation",
    description:
      'This profile defines a baseline that aligns to the "Level 1 - Workstation"\nconfiguration from the Center for Internet Security® Red Hat Enterprise\nLinux 8 Benchmark™, v3.0.0, released 2023-10-30.\n\nThis profile includes Center for Internet Security®\nRed Hat Enterprise Linux 8 CIS Benchmarks™ content.',
    ref_id: "xccdf_org.ssgproject.content_profile_cis_workstation_l1",
    security_guide_id: "13000ad2-8b34-446c-92b1-2bb6011daa06",
    security_guide_version: "0.1.74",
    os_major_version: 8,
    os_minor_versions: [10, 9, 8, 7, 6, 5, 4],
    type: "supported_profile",
  },
  {
    id: "3a5cf3da-b198-449a-9f32-c736e0e04a37",
    title: "ANSSI-BP-028 (high)",
    description:
      "This profile contains configurations that align to ANSSI-BP-028 v2.0 at the high hardening level.\n\nANSSI is the French National Information Security Agency, and stands for Agence nationale de la sécurité des systèmes d'information.\nANSSI-BP-028 is a configuration recommendation for GNU/Linux systems.\n\nA copy of the ANSSI-BP-028 can be found at the ANSSI website:\nhttps://www.ssi.gouv.fr/administration/guide/recommandations-de-securite-relatives-a-un-systeme-gnulinux/\n\nAn English version of the ANSSI-BP-028 can also be found at the ANSSI website:\nhttps://cyber.gouv.fr/publications/configuration-recommendations-gnulinux-system",
    ref_id: "xccdf_org.ssgproject.content_profile_anssi_bp28_high",
    security_guide_id: "13000ad2-8b34-446c-92b1-2bb6011daa06",
    security_guide_version: "0.1.74",
    os_major_version: 8,
    os_minor_versions: [10, 9, 8, 7, 6, 5, 4],
    type: "supported_profile",
  },
  {
    id: "4bd29f91-540c-4c36-9a8a-3b30706e722b",
    title: "DISA STIG for Red Hat Enterprise Linux 8",
    description:
      "This profile contains configuration checks that align to the\nDISA STIG for Red Hat Enterprise Linux 8 V1R14.\n\nIn addition to being applicable to Red Hat Enterprise Linux 8, DISA recognizes this\nconfiguration baseline as applicable to the operating system tier of\nRed Hat technologies that are based on Red Hat Enterprise Linux 8, such as:\n\n- Red Hat Enterprise Linux Server\n- Red Hat Enterprise Linux Workstation and Desktop\n- Red Hat Enterprise Linux for HPC\n- Red Hat Storage\n- Red Hat Containers with a Red Hat Enterprise Linux 8 image",
    ref_id: "xccdf_org.ssgproject.content_profile_stig",
    security_guide_id: "13000ad2-8b34-446c-92b1-2bb6011daa06",
    security_guide_version: "0.1.74",
    os_major_version: 8,
    os_minor_versions: [10, 9, 8, 7, 6, 5, 4, 3, 2],
    type: "supported_profile",
  },
];
