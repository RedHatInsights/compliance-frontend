import { CREATE_PROFILE, ASSOCIATE_SYSTEMS_TO_PROFILES } from 'Mutations';

export const policyFormValues = {
    benchmark: 'a5e7f1ea-e63c-40be-a17a-c2a247c11e10',
    description: 'This profile demonstrates compliance against the U.S. Government Commercial Cloud Services (C2S)',
    name: 'C2S for Red Hat Enterprise Linux 6',
    osMajorVersion: '6',
    latestSupportedOsMinorVersions: ['7', '8'],
    profile: {
        complianceThreshold: "100",
        description: 'This profile demonstrates compliance against the U.S. Government Commercial Cloud Services (C2S)',
        id: '197eb783-7bca-45c5-978d-c1e89b0118da',
        name: 'C2S for Red Hat Enterprise Linux 6',
        refId: 'xccdf_org.ssgproject.content_profile_C2S',
        benchmark: {
            latestSupportedOsMinorVersions: ['7', '8'],
        }
    },
    refId: 'xccdf_org.ssgproject.content_profile_C2S',
    systems: [],
    selectedRuleRefIds: ['myrulefrefid']
};

export const benchmarksQuery = [
    {
        id: 'f1dff140-6649-4060-b0f6-7b1548f9e901',
        title: 'Guide to the Secure Configuration of Red Hat Enterprise Linux 7',
        refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7',
        osMajorVersion: '7',
        version: '0.1.40',
        profiles: [
            {
                id: '02ca6a92-ffc9-4047-9bce-9bcef0e26ea2',
                name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                description: 'Ensures PCI-DSS v3 related security configuration settings \\n \\ are applied.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '7d674214-ad7f-4f37-8b54-0825f7e81b42',
                name: 'OSPP - Protection Profile for General Purpose Operating Systems v. 4.2',
                refId: 'xccdf_org.ssgproject.content_profile_ospp42',
                description: 'This profile reflects mandatory configuration controls identified in the\nNIAP Configuration Annex to the Protection Profile for General Purpose\nOperating Systems (Protection Profile Version 4.2).\n\nThis Annex is consistent with CNSSI-1253, which requires US National Security\nSystems to adhere to certain configuration parameters. Accordingly, configuration\nguidance produced according to the requirements of this Annex is suitable for use\nin US National Security Systems.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '3b6e8ecf-5884-4680-aaa2-fd92196540af',
                name: 'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                refId: 'xccdf_org.ssgproject.content_profile_nist-800-171-cui',
                description: 'From NIST 800-171, Section 2.2:\nSecurity requirements for protecting the confidentiality of CUI in nonfederal \ninformation systems and organizations have a well-defined structure that \nconsists of:\n\n(i) a basic security requirements section;\n(ii) a derived security requirements section.\n\nThe basic security requirements are obtained from FIPS Publication 200, which\nprovides the high-level and fundamental security requirements for federal\ninformation and information systems. The derived security requirements, which\nsupplement the basic security requirements, are taken from the security controls\nin NIST Special Publication 800-53.\n\nThis profile configures Red Hat Enterprise Linux 7 to the NIST Special\nPublication 800-53 controls identified for securing Controlled Unclassified\nInformation (CUI).',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'd6f099f4-9ff9-4315-9904-60e21aab1176',
                name: 'DISA STIG for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_stig-rhel7-disa',
                description: 'This profile contains configuration checks that align to the \n  DISA STIG for Red Hat Enterprise Linux V1R4. \n  \n  In addition to being applicable to RHEL7, DISA recognizes this \n  configuration baseline as applicable to the operating system tier of \n  Red Hat technologies that are based off RHEL7, such as: \n  - Red Hat Enterprise Linux Server \n  - Red Hat Enterprise Linux Workstation and Desktop \n  - Red Hat Virtualization Hypervisor (RHV-H) \n  - Red Hat Enterprise Linux for HPC \n  - Red Hat Storage',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '2bafa5d6-b3fc-4727-ad10-684a35520c6b',
                name: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                refId: 'xccdf_org.ssgproject.content_profile_rht-ccp',
                description: 'This profile contains the minimum security relevant \\n \\ configuration settings recommended by Red Hat, Inc for \\n \\ Red Hat Enterprise Linux 7 instances deployed by Red Hat Certified \\n \\ Cloud Providers.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'edac5bce-98d5-43b9-a8e7-189347083125',
                name: 'Health Insurance Portability and Accountability Act (HIPAA)',
                refId: 'xccdf_org.ssgproject.content_profile_hipaa',
                description: 'The HIPAA Security Rule establishes U.S. national standards to protect individuals’\nelectronic personal health information that is created, received, used, or\nmaintained by a covered entity. The Security Rule requires appropriate\nadministrative, physical and technical safeguards to ensure the\nconfidentiality, integrity, and security of electronic protected health\ninformation.\n\nThis profile configures Red Hat Enterprise Linux 7 to the HIPAA Security\nRule identified for securing of electronic protected health information.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '0c8bd8ed-622a-4bd6-849a-0a80b0721427',
                name: 'United States Government Configuration Baseline',
                refId: 'xccdf_org.ssgproject.content_profile_ospp',
                description: 'This compliance profile reflects the core set of security\nrelated configuration settings for deployment of Red Hat Enterprise\nLinux 7.x into U.S. Defense, Intelligence, and Civilian agencies.\nDevelopment partners and sponsors include the U.S. National Institute\nof Standards and Technology (NIST), U.S. Department of Defense,\nthe National Security Agency, and Red Hat.\n\nThis baseline implements configuration requirements from the following\nsources:\n\n- Committee on National Security Systems Instruction No. 1253 (CNSSI 1253)\n- NIST Controlled Unclassified Information (NIST 800-171)\n- NIST 800-53 control selections for MODERATE impact systems (NIST 800-53)\n- U.S. Government Configuration Baseline (USGCB)\n- NIAP Protection Profile for General Purpose Operating Systems v4.0 (OSPP v4.0)\n- DISA Operating System Security Requirements Guide (OS SRG)\n\nFor any differing configuration requirements, e.g. password lengths, the stricter\nsecurity setting was chosen. Security Requirement Traceability Guides (RTMs) and\nsample System Security Configuration Guides are provided via the\nscap-security-guide-docs package.\n\nThis profile reflects U.S. Government consensus content and is developed through\nthe OpenSCAP/SCAP Security Guide initiative, championed by the National\nSecurity Agency. Except for differences in formatting to accommodate\npublishing processes, this profile mirrors OpenSCAP/SCAP Security Guide\ncontent as minor divergences, such as bugfixes, work through the\nconsensus and release processes.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'f4bbc861-4dd5-44d3-8437-61a36d1177b6',
                name: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_standard',
                description: 'This profile contains rules to ensure standard security baseline\nof a Red Hat Enterprise Linux 7 system. Regardless of your system\'s workload\nall of these checks should pass.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'f8973ab9-0572-4e58-a4a5-dfefcf6cda03',
                name: 'C2S for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                description: 'This profile demonstrates compliance against the\nU.S. Government Commercial Cloud Services (C2S) baseline.\n\nThis baseline was inspired by the Center for Internet Security\n(CIS) Red Hat Enterprise Linux 7 Benchmark, v2.1.1 - 01-31-2017.\n\nFor the SCAP Security Guide project to remain in compliance with\nCIS\' terms and conditions, specifically Restrictions(8), note\nthere is no representation or claim that the C2S profile will\nensure a system is in compliance or consistency with the CIS\nbaseline.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'f230932c-f5cc-449c-887f-6c1c1e3af1b2',
                name: 'Criminal Justice Information Services (CJIS) Security Policy',
                refId: 'xccdf_org.ssgproject.content_profile_cjis',
                description: 'This profile is derived from FBI\'s CJIS v5.4\nSecurity Policy. A copy of this policy can be found at the CJIS Security\nPolicy Resource Center:\n\nhttps://www.fbi.gov/services/cjis/cjis-security-policy-resource-center',
                complianceThreshold: "100",
                __typename: 'Profile'
            }
        ],
        __typename: 'Benchmark'
    },
    {
        id: 'bdcc6b37-1d4a-489a-a38d-e9be7aef7051',
        title: 'Guide to the Secure Configuration of Red Hat Enterprise Linux 7',
        refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7',
        osMajorVersion: '7',
        version: '0.1.43',
        profiles: [
            {
                id: 'ffb19e93-3c4e-4be9-9ed9-3285340da558',
                name: 'DISA STIG for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_stig-rhel7-disa',
                description: 'This profile contains configuration checks that align to the\nDISA STIG for Red Hat Enterprise Linux V1R4.\n\nIn addition to being applicable to RHEL7, DISA recognizes this\nconfiguration baseline as applicable to the operating system tier of\nRed Hat technologies that are based off RHEL7, such as:\n\n- Red Hat Enterprise Linux Server\n- Red Hat Enterprise Linux Workstation and Desktop\n- Red Hat Enterprise Linux for HPC\n- Red Hat Storage',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '735d33e0-1a79-494c-b90b-1493a1d0f1f1',
                name: 'United States Government Configuration Baseline',
                refId: 'xccdf_org.ssgproject.content_profile_ospp',
                description: 'This compliance profile reflects the core set of security\nrelated configuration settings for deployment of Red Hat Enterprise\nLinux 7.x into U.S. Defense, Intelligence, and Civilian agencies.\nDevelopment partners and sponsors include the U.S. National Institute\nof Standards and Technology (NIST), U.S. Department of Defense,\nthe National Security Agency, and Red Hat.\n\nThis baseline implements configuration requirements from the following\nsources:\n\n- Committee on National Security Systems Instruction No. 1253 (CNSSI 1253)\n- NIST Controlled Unclassified Information (NIST 800-171)\n- NIST 800-53 control selections for MODERATE impact systems (NIST 800-53)\n- U.S. Government Configuration Baseline (USGCB)\n- NIAP Protection Profile for General Purpose Operating Systems v4.0 (OSPP v4.0)\n- DISA Operating System Security Requirements Guide (OS SRG)\n\nFor any differing configuration requirements, e.g. password lengths, the stricter\nsecurity setting was chosen. Security Requirement Traceability Guides (RTMs) and\nsample System Security Configuration Guides are provided via the\nscap-security-guide-docs package.\n\nThis profile reflects U.S. Government consensus content and is developed through\nthe OpenSCAP/SCAP Security Guide initiative, championed by the National\nSecurity Agency. Except for differences in formatting to accommodate\npublishing processes, this profile mirrors OpenSCAP/SCAP Security Guide\ncontent as minor divergences, such as bugfixes, work through the\nconsensus and release processes.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '85c24168-d858-4a99-967b-978679765fea',
                name: 'PCI-DSS v3.2.1 Control Baseline for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                description: 'Ensures PCI-DSS v3.2.1 related security configuration settings are applied.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '3f15774f-31cb-4981-ac7d-1021f2d3dca0',
                name: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                refId: 'xccdf_org.ssgproject.content_profile_rht-ccp',
                description: 'This profile contains the minimum security relevant\nconfiguration settings recommended by Red Hat, Inc for\nRed Hat Enterprise Linux 7 instances deployed by Red Hat Certified\nCloud Providers.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'ec73216b-3d2a-4f83-8789-d80d89d7d978',
                name: 'C2S for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                description: 'This profile demonstrates compliance against the\nU.S. Government Commercial Cloud Services (C2S) baseline.\n\nThis baseline was inspired by the Center for Internet Security\n(CIS) Red Hat Enterprise Linux 7 Benchmark, v2.1.1 - 01-31-2017.\n\nFor the SCAP Security Guide project to remain in compliance with\nCIS\' terms and conditions, specifically Restrictions(8), note\nthere is no representation or claim that the C2S profile will\nensure a system is in compliance or consistency with the CIS\nbaseline.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '5596f7f0-04a7-4d3e-bbc2-6d67d0a01949',
                name: 'OSPP - Protection Profile for General Purpose Operating Systems v. 4.2',
                refId: 'xccdf_org.ssgproject.content_profile_ospp42',
                description: 'This profile reflects mandatory configuration controls identified in the\nNIAP Configuration Annex to the Protection Profile for General Purpose\nOperating Systems (Protection Profile Version 4.2).\n\nThis Annex is consistent with CNSSI-1253, which requires US National Security\nSystems to adhere to certain configuration parameters. Accordingly, configuration\nguidance produced according to the requirements of this Annex is suitable for use\nin US National Security Systems.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '3af7d0b8-1abb-47b7-aaa1-5fc818b23917',
                name: 'Criminal Justice Information Services (CJIS) Security Policy',
                refId: 'xccdf_org.ssgproject.content_profile_cjis',
                description: 'This profile is derived from FBI\'s CJIS v5.4\nSecurity Policy. A copy of this policy can be found at the CJIS Security\nPolicy Resource Center:\n\nhttps://www.fbi.gov/services/cjis/cjis-security-policy-resource-center',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '28fa411e-fffa-4c81-9f2b-0c2ecfa41561',
                name: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_standard',
                description: 'This profile contains rules to ensure standard security baseline\nof a Red Hat Enterprise Linux 7 system. Regardless of your system\'s workload\nall of these checks should pass.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'd5f0e367-2a7d-4dfa-87a1-e92c944dfcb8',
                name: 'VPP - Protection Profile for Virtualization v. 1.0 for Red Hat Enterprise Linux Hypervisor (RHELH)',
                refId: 'xccdf_org.ssgproject.content_profile_rhelh-vpp',
                description: 'This compliance profile reflects the core set of security\nrelated configuration settings for deployment of Red Hat Enterprise\nLinux Hypervisor (RHELH) 7.x into U.S. Defense, Intelligence, and Civilian agencies.\nDevelopment partners and sponsors include the U.S. National Institute\nof Standards and Technology (NIST), U.S. Department of Defense,\nthe National Security Agency, and Red Hat.\n\nThis baseline implements configuration requirements from the following\nsources:\n\n- Committee on National Security Systems Instruction No. 1253 (CNSSI 1253)\n- NIST 800-53 control selections for MODERATE impact systems (NIST 800-53)\n- U.S. Government Configuration Baseline (USGCB)\n- NIAP Protection Profile for Virtualization v1.0 (VPP v1.0)\n\nFor any differing configuration requirements, e.g. password lengths, the stricter\nsecurity setting was chosen. Security Requirement Traceability Guides (RTMs) and\nsample System Security Configuration Guides are provided via the\nscap-security-guide-docs package.\n\nThis profile reflects U.S. Government consensus content and is developed through\nthe ComplianceAsCode project, championed by the National\nSecurity Agency. Except for differences in formatting to accommodate\npublishing processes, this profile mirrors ComplianceAsCode\ncontent as minor divergences, such as bugfixes, work through the\nconsensus and release processes.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'c15ef1d4-a327-4386-8f05-98938fed50b6',
                name: 'Health Insurance Portability and Accountability Act (HIPAA)',
                refId: 'xccdf_org.ssgproject.content_profile_hipaa',
                description: 'The HIPAA Security Rule establishes U.S. national standards to protect individuals’\nelectronic personal health information that is created, received, used, or\nmaintained by a covered entity. The Security Rule requires appropriate\nadministrative, physical and technical safeguards to ensure the\nconfidentiality, integrity, and security of electronic protected health\ninformation.\n\nThis profile configures Red Hat Enterprise Linux 7 to the HIPAA Security\nRule identified for securing of electronic protected health information.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'cd2b1041-7bc8-402d-8545-e4055ca71da0',
                name: 'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                refId: 'xccdf_org.ssgproject.content_profile_nist-800-171-cui',
                description: 'From NIST 800-171, Section 2.2:\nSecurity requirements for protecting the confidentiality of CUI in non-federal\ninformation systems and organizations have a well-defined structure that\nconsists of:\n\n(i) a basic security requirements section;\n(ii) a derived security requirements section.\n\nThe basic security requirements are obtained from FIPS Publication 200, which\nprovides the high-level and fundamental security requirements for federal\ninformation and information systems. The derived security requirements, which\nsupplement the basic security requirements, are taken from the security controls\nin NIST Special Publication 800-53.\n\nThis profile configures Red Hat Enterprise Linux 7 to the NIST Special\nPublication 800-53 controls identified for securing Controlled Unclassified\nInformation (CUI).',
                complianceThreshold: "100",
                __typename: 'Profile'
            }
        ],
        __typename: 'Benchmark'
    },
    {
        id: 'a5e7f1ea-e63c-40be-a17a-c2a247c11e10',
        title: 'Guide to the Secure Configuration of Red Hat Enterprise Linux 6',
        refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-6',
        osMajorVersion: '6',
        version: '0.1.28',
        profiles: [
            {
                id: '4a271e9e-6e84-4038-941b-6b265d9b1727',
                name: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                refId: 'xccdf_org.ssgproject.content_profile_rht-ccp',
                description: 'This is a *draft* SCAP profile for Red Hat Certified Cloud Providers',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '2c9ef707-bb58-4f80-9ce4-c20ebd4248a8',
                name: 'CSCF RHEL6 MLS Core Baseline',
                refId: 'xccdf_org.ssgproject.content_profile_CSCF-RHEL6-MLS',
                description: ' This profile reflects the Centralized Super Computing Facility \n(CSCF) baseline for Red Hat Enterprise Linux 6. This baseline has received \ngovernment ATO through the ICD 503 process, utilizing the CNSSI 1253 cross \ndomain overlay. This profile should be considered in active development. \nAdditional tailoring will be needed, such as the creation of RBAC roles \nfor production deployment.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '197eb783-7bca-45c5-978d-c1e89b0118da',
                name: 'C2S for Red Hat Enterprise Linux 6',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                description: 'This profile demonstrates compliance against the \nU.S. Government Commercial Cloud Services (C2S) baseline.\n\nThis baseline was inspired by the Center for Internet Security\n(CIS) Red Hat Enterprise Linux 6 Benchmark, v1.2.0 - 06-25-2013.\nFor the SCAP Security Guide project to remain in compliance with\nCIS\' terms and conditions, specifically Restrictions(8), note \nthere is no representation or claim that the C2S profile will\nensure a system is in compliance or consistency with the CIS\nbaseline. \n',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '7f501f8b-be3b-4105-a7d4-aa7cfa61d823',
                name: 'Standard System Security Profile',
                refId: 'xccdf_org.ssgproject.content_profile_standard',
                description: 'This profile contains rules to ensure standard security base of Red Hat Enterprise Linux 6 system.\nRegardless of your system\'s workload all of these checks should pass.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '074277c6-3f32-4758-86f6-30da5b99c404',
                name: 'Example Server Profile',
                refId: 'xccdf_org.ssgproject.content_profile_CS2',
                description: 'This profile is an example of a customized server profile.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'f8f4b1ca-44ec-48cb-bfbf-2fca69663e10',
                name: 'Common Profile for General-Purpose Systems',
                refId: 'xccdf_org.ssgproject.content_profile_common',
                description: 'This profile contains items common to general-purpose desktop and server installations.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '11efa871-3514-4931-95fb-c44f546b303d',
                name: 'Server Baseline',
                refId: 'xccdf_org.ssgproject.content_profile_server',
                description: 'This profile is for Red Hat Enterprise Linux 6 acting as a server.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'efedd0fe-7bcd-490e-b8c9-416122533ce5',
                name: 'Upstream STIG for Red Hat Enterprise Linux 6 Server',
                refId: 'xccdf_org.ssgproject.content_profile_stig-rhel6-server-upstream',
                description: 'This profile is developed under the DoD consensus model and DISA FSO Vendor STIG process,\nserving as the upstream development environment for the Red Hat Enterprise Linux 6 Server STIG.\n\nAs a result of the upstream/downstream relationship between the SCAP Security Guide project \nand the official DISA FSO STIG baseline, users should expect variance between SSG and DISA FSO content.\nFor official DISA FSO STIG content, refer to http://iase.disa.mil/stigs/os/unix-linux/Pages/red-hat.aspx.\n\nWhile this profile is packaged by Red Hat as part of the SCAP Security Guide package, please note \nthat commercial support of this SCAP content is NOT available. This profile is provided as example \nSCAP content with no endorsement for suitability or production readiness. Support for this \nprofile is provided by the upstream SCAP Security Guide community on a best-effort basis. The\nupstream project homepage is https://fedorahosted.org/scap-security-guide/.\n',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '91ffca63-accc-4698-ba93-84d147c80271',
                name: 'United States Government Configuration Baseline (USGCB)',
                refId: 'xccdf_org.ssgproject.content_profile_usgcb-rhel6-server',
                description: 'This profile is a working draft for a USGCB submission against RHEL6 Server.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '45b793d2-9f6a-4854-b0a8-9b89e7d7f3eb',
                name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 6',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                description: 'This is a *draft* profile for PCI-DSS v3',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'f839edeb-c32f-425c-bbd2-1b807806393b',
                name: 'CNSSI 1253 Low/Low/Low',
                refId: 'xccdf_org.ssgproject.content_profile_nist-cl-il-al',
                description: 'This profile follows the Committee on National Security Systems Instruction\n(CNSSI) No. 1253, "Security Categorization and Control Selection for National Security\nSystems" on security controls to meet low confidentiality, low integrity, and low\nassurance."',
                complianceThreshold: "100",
                __typename: 'Profile'
            }
        ],
        __typename: 'Benchmark'
    },
    {
        id: '6a02b217-c9e9-4a4d-93a9-c77b5ea7967a',
        title: 'Guide to the Secure Configuration of Red Hat Enterprise Linux 8',
        refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-8',
        osMajorVersion: '8',
        version: '0.1.42',
        profiles: [
            {
                id: '893aea23-079a-4eef-9598-56dc3bb7666a',
                name: 'Criminal Justice Information Services (CJIS) Security Policy',
                refId: 'xccdf_org.ssgproject.content_profile_cjis',
                description: 'This profile is derived from FBI\'s CJIS v5.4\nSecurity Policy. A copy of this policy can be found at the CJIS Security\nPolicy Resource Center:\n\nhttps://www.fbi.gov/services/cjis/cjis-security-policy-resource-center',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'f2567016-e955-45b7-be7f-ba4c778a1989',
                name: 'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                refId: 'xccdf_org.ssgproject.content_profile_cui',
                description: 'From NIST 800-171, Section 2.2:\nSecurity requirements for protecting the confidentiality of CUI in nonfederal\ninformation systems and organizations have a well-defined structure that\nconsists of:\n\n(i) a basic security requirements section;\n(ii) a derived security requirements section.\n\nThe basic security requirements are obtained from FIPS Publication 200, which\nprovides the high-level and fundamental security requirements for federal\ninformation and information systems. The derived security requirements, which\nsupplement the basic security requirements, are taken from the security controls\nin NIST Special Publication 800-53.\n\nThis profile configures Red Hat Enterprise Linux 8 to the NIST Special\nPublication 800-53 controls identified for securing Controlled Unclassified\nInformation (CUI)."',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: 'e933508e-7847-4783-b5a2-ebc0283bf3f6',
                name: 'Health Insurance Portability and Accountability Act (HIPAA)',
                refId: 'xccdf_org.ssgproject.content_profile_hipaa',
                description: 'The HIPAA Security Rule establishes U.S. national standards to protect individuals’\nelectronic personal health information that is created, received, used, or\nmaintained by a covered entity. The Security Rule requires appropriate\nadministrative, physical and technical safeguards to ensure the\nconfidentiality, integrity, and security of electronic protected health\ninformation.\n\nThis profile configures Red Hat Enterprise Linux 8 to the HIPAA Security\nRule identified for securing of electronic protected health information.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '1da60049-3777-431f-8ff0-29aa4be9a0ae',
                name: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                refId: 'xccdf_org.ssgproject.content_profile_rht-ccp',
                description: 'This profile contains the minimum security relevant\nconfiguration settings recommended by Red Hat, Inc for\nRed Hat Enterprise Linux 8 instances deployed by Red Hat Certified\nCloud Providers.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '92bf35f7-1538-41df-a745-42f73b938485',
                name: 'OSPP - Protection Profile for General Purpose Operating Systems',
                refId: 'xccdf_org.ssgproject.content_profile_ospp',
                description: 'This profile reflects mandatory configuration controls identified in the\nNIAP Configuration Annex to the Protection Profile for General Purpose\nOperating Systems (Protection Profile Version 4.2).',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '1cbb6b04-6fd7-472c-b463-2e1448c464cf',
                name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 8',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                description: 'Ensures PCI-DSS v3 related security configuration settings \\n \\ are applied.',
                complianceThreshold: "100",
                __typename: 'Profile'
            },
            {
                id: '96d0c9cd-f320-4162-b79d-6a6aab71f6f0',
                name: 'Standard System Security Profile for Red Hat Enterprise Linux 8',
                refId: 'xccdf_org.ssgproject.content_profile_standard',
                description: 'This profile contains rules to ensure standard security baseline\nof a Red Hat Enterprise Linux 8 system. Regardless of your system\'s workload\nall of these checks should pass.',
                complianceThreshold: "100",
                __typename: 'Profile'
            }
        ],
        __typename: 'Benchmark'
    }
];

export const policyRulesQuery = {
    profile: {
        name: 'PCI-DSS v3.2.1 Control Baseline for Red Hat Enterprise Linux 7',
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
        rules: [
            {
                title: 'Record Attempts to Alter the localtime File',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/localtime -p wa -k audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/localtime -p wa -k audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport and should always be used.',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27310-2',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Record Attempts to Alter Time Through clock_settime',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27219-5',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Ensure System Log Files Have Correct Permissions',
                severity: 'medium',
                rationale: 'Log files can contain valuable information regarding system configuration. If the system log files are not protected unauthorized users could change the logged data, eliminating their forensic value.',
                refId: 'xccdf_org.ssgproject.content_rule_rsyslog_files_permissions',
                description: 'The file permissions for all log files written by rsyslog should be set to 600, or more restrictive. These log files are determined by the second part of each Rule line in /etc/rsyslog.conf and typically all appear in /var/log. For each log file LOGFILE referenced in /etc/rsyslog.conf, run the following command to inspect the file\'s permissions: $ ls -l LOGFILE If the permissions are not 600 or more restrictive, run the following command to correct this: $ sudo chmod 0600 LOGFILE"',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-80191-0',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Record attempts to alter time through adjtimex',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_adjtimex',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S adjtimex -F key=audit_time_rules If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S adjtimex -F key=audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S adjtimex -F key=audit_time_rules If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S adjtimex -F key=audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27290-6',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fchown',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fchown',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27356-5',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - setxattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_setxattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27213-8',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - chown',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_chown',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27364-9',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fchownat',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fchownat',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod',
                remediationAvailable: false,
                identifier: {
                    label: 'CCE-27387-0',
                    system: 'https://nvd.nist.gov/cce/index.cfm',
                    __typename: 'RuleIdentifier'
                },
                __typename: 'Rule'
            }
        ],
        __typename: 'Profile'
    }
};

export const mutateCreateProfileMock =  {
    request: {
        query: CREATE_PROFILE,
        variables: {
            input: {
                benchmarkId: 'a5e7f1ea-e63c-40be-a17a-c2a247c11e10',
                cloneFromProfileId: '197eb783-7bca-45c5-978d-c1e89b0118da',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                name: 'C2S for Red Hat Enterprise Linux 6',
                description: 'This profile demonstrates compliance against the U.S. Government Commercial Cloud Services (C2S)',
                selectedRuleRefIds: ['myrulefrefid'],
                complianceThreshold: "100"
            }
        }
    },
    result: {
        data: {
            createProfile: {
                profile: {
                    id: 'aeb578f9-c8e8-4d26-add7-e5017c9ec79a'
                }
            }
        }
    }
};

export const mutateAssociateSystemsToProfile = {
    request: {
        query: ASSOCIATE_SYSTEMS_TO_PROFILES,
        variables: {
            input: {
                id: 'aeb578f9-c8e8-4d26-add7-e5017c9ec79a',
                systemIds: []
            }
        }
    },
    result: {
        data: {
            associateSystems: {
                profile: {
                    id: 'aeb578f9-c8e8-4d26-add7-e5017c9ec79a'
                }
            }
        }
    }
}

export const mutateCreateProfileErrorMock =  {
    request: {
        query: CREATE_PROFILE,
        variables: {
            input: {
                benchmarkId: 'a5e7f1ea-e63c-40be-a17a-c2a247c11e10',
                description: 'This profile demonstrates compliance against the U.S. Government Commercial Cloud Services (C2S)',
                name: 'C2S for Red Hat Enterprise Linux 6',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                selectedRuleRefIds: ['myrulefrefid'],
                cloneFromProfileId: '197eb783-7bca-45c5-978d-c1e89b0118da',
                complianceThreshold:"100"
            }
        }
    },
    error: {
        message: 'Response not successful: Received status code 406',
        result: {
            errors: ['Error reason']
        }
    }
};

export const profileRefIdsQuery = {
    edges: [
        {
            node: {
                id: '719999b6-d230-4ba5-8dba-7ab3dc6561e0',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss3',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-8'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'dae0487d-3201-4ee0-af5f-b94cde2af818',
                refId: 'xccdf_org.ssgproject.content_profile_ospp2',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '8ed49cf9-16d4-4e49-9892-331b3c30919b',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss_customized',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-8'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '20a9d997-62a6-40cc-a5f3-19d466eb975e',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'e4fe9d96-cf78-4f71-9831-db8240fe6477',
                refId: 'xccdf_org.ssgproject.content_profile_ospp - customized',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '6d345bd2-d597-4df8-9bcf-71c41155b42c',
                refId: 'xccdf_org.ssgproject.content_profile_cjis',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'c8e15347-9c2b-495d-8e54-503c2f9582b6',
                refId: 'xccdf_org.ssgproject.content_profile_nist-800-171-cui',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '3c4823a1-2c16-46ae-b2fe-0cebf5a03931',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'f7b7977a-403b-4cd1-ab90-20b6f9a5a359',
                refId: 'xccdf_org.ssgproject.content_profile_rht-ccp',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '36abc364-6dc3-4e35-94f4-d10fa77e866e',
                refId: 'xccdf_org.ssgproject.content_profile_hipaa',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'd35c8aad-8fc8-49e8-bff0-4d9d3dc8f220',
                refId: 'xccdf_org.ssgproject.content_profile_ospp',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '4c27fe09-9a7f-437c-b38b-e42272d9ccf0',
                refId: 'xccdf_org.ssgproject.content_profile_standard',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '9b034440-e3dd-4c19-8f2c-ca75e813d57d',
                refId: 'xccdf_org.ssgproject.content_profile_stig-rhel7-disa',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '19921ca4-8526-4651-8876-3c8587e8e125',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss2',
                benchmark: {
                    refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        }
    ]
};
