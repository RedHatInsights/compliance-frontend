export const policies = {
    edges: [
        {
            node: {
                id: 'b71376fd-015e-4209-99af-4543e82e5dc5',
                name: 'United States Government Configuration Baseline23',
                refId: 'xccdf_org.ssgproject.content_profile_ospp23',
                policyType: 'United States Government Standard',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                compliantHostCount: 4,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: 'b71376fd-015e-4209-99af-4543e82e5dc5-policy',
                    name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 73',
                    profiles: [
                        {
                            id: 'b71376fd-015e-4209-99af',
                            name: 'United States Government Configuration Baseline123',
                            refId: 'xccdf_org.ssgproject.content_profile_ospp123',
                            osMajorVersion: '7',
                            osMinorVersion: '9',
                            benchmark: { version: '0.1.49' },
                            rules: [
                                {
                                    title: 'Record Attempts to Alter the localtime File',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/localtime -p wa -k audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/localtime -p wa -k audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport and should always be used.',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                },
                                {
                                    title: 'Record Attempts to Alter Time Through clock_settime',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                }
                            ]
                        },
                        {
                            id: 'b71376fd-015e-4209-99ac',
                            name: 'United States Government Configuration Baseline123',
                            refId: 'xccdf_org.ssgproject.content_profile_ospp123',
                            osMajorVersion: '7',
                            benchmark: { version: '0.1.45' },
                            rules: [
                                {
                                    title: 'Record Attempts to Alter the localtime File',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/localtime -p wa -k audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/localtime -p wa -k audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport and should always be used.',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                },
                                {
                                    title: 'Record Attempts to Alter Time Through clock_settime',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                }
                            ]
                        },
                        {
                            id: 'b71376fd-015e-4209-99ad',
                            name: 'United States Government Configuration Baseline123',
                            refId: 'xccdf_org.ssgproject.content_profile_ospp123',
                            osMajorVersion: '7',
                            osMinorVersion: '8',
                            benchmark: { version: '0.1.46' },
                            rules: [
                                {
                                    title: 'Record Attempts to Alter the localtime File',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/localtime -p wa -k audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/localtime -p wa -k audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport and should always be used.',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                },
                                {
                                    title: 'Record Attempts to Alter Time Through clock_settime',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                }
                            ]
                        }
                    ],
                    __typename: 'Profile'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '719999b6-d230-4ba5-8dba-7ab3dc6561e0',
                name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 73',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss3',
                policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 73',
                complianceThreshold: 67,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                policy: {
                    id: 'b71376fd-015e-4209-99af-4543e82e5dc5-policy',
                    name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 73',
                    profiles: [
                        {
                            id: 'b71376fd-015e-4209-99ae',
                            name: 'United States Government Configuration Baseline123',
                            refId: 'xccdf_org.ssgproject.content_profile_ospp123',
                            benchmark: { version: '0.1.45' },
                            rules: [
                                {
                                    title: 'Record Attempts to Alter the localtime File',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/localtime -p wa -k audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/localtime -p wa -k audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport and should always be used.',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                },
                                {
                                    title: 'Record Attempts to Alter Time Through clock_settime',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                },
                                {
                                    title: 'Record Attempts to Alter Time Through clock_settime',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                },
                                {
                                    title: 'Record Attempts to Alter Time Through clock_settime',
                                    severity: 'medium',
                                    rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                                    refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                                    description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                                    remediationAvailable: false,
                                    __typename: 'Rule'
                                }
                            ]
                        }
                    ],
                    __typename: 'Profile'
                },
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'dae0487d-3201-4ee0-af5f-b94cde2af818',
                name: 'United States Government Configuration Baseline2',
                refId: 'xccdf_org.ssgproject.content_profile_ospp2',
                policyType: 'United States Government Configuration Baseline2',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: 'dae0487d-3201-4ee0-af5f-b94cde2af818',
                    name: 'United States Government Configuration Baseline2'
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '20a9d997-62a6-40cc-a5f3-19d466eb975e',
                name: 'C2S for Red Hat Enterprise Linux 7',
                policyType: 'C2S for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_C2S',
                complianceThreshold: 69.5,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '20a9d997-62a6-40cc-a5f3-19d466eb975e',
                    name: 'C2S for Red Hat Enterprise Linux 7',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '6d345bd2-d597-4df8-9bcf-71c41155b42c',
                name: 'Criminal Justice Information Services (CJIS) Security Policy',
                policyType: 'Criminal Justice Information Services (CJIS) Security Policy',
                refId: 'xccdf_org.ssgproject.content_profile_cjis',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '6d345bd2-d597-4df8-9bcf-71c41155b42c',
                    name: 'Criminal Justice Information Services (CJIS) Security Policy',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'c8e15347-9c2b-495d-8e54-503c2f9582b6',
                name: 'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                policyType: 'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                refId: 'xccdf_org.ssgproject.content_profile_nist-800-171-cui',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: 'c8e15347-9c2b-495d-8e54-503c2f9582b6',
                    name: 'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '3c4823a1-2c16-46ae-b2fe-0cebf5a03931',
                name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
                policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '3c4823a1-2c16-46ae-b2fe-0cebf5a03931',
                    name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'f7b7977a-403b-4cd1-ab90-20b6f9a5a359',
                name: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                policyType: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                refId: 'xccdf_org.ssgproject.content_profile_rht-ccp',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: 'f7b7977a-403b-4cd1-ab90-20b6f9a5a359',
                    name: 'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '36abc364-6dc3-4e35-94f4-d10fa77e866e',
                name: 'Health Insurance Portability and Accountability Act (HIPAA)',
                policyType: 'Health Insurance Portability and Accountability Act (HIPAA)',
                refId: 'xccdf_org.ssgproject.content_profile_hipaa',
                complianceThreshold: 100,
                totalHostCount: 10,
                testResultHostCount: 8,
                businessObjective: null,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '36abc364-6dc3-4e35-94f4-d10fa77e866e',
                    name: 'Health Insurance Portability and Accountability Act (HIPAA)',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: 'd35c8aad-8fc8-49e8-bff0-4d9d3dc8f220',
                name: 'United States Government Configuration Baseline',
                policyType: 'United States Government Configuration Baseline',
                refId: 'xccdf_org.ssgproject.content_profile_ospp',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: 'd35c8aad-8fc8-49e8-bff0-4d9d3dc8f220',
                    name: 'United States Government Configuration Baseline',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '4c27fe09-9a7f-437c-b38b-e42272d9ccf0',
                name: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                policyType: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_standard',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '4c27fe09-9a7f-437c-b38b-e42272d9ccf0',
                    name: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '9b034440-e3dd-4c19-8f2c-ca75e813d57d',
                name: 'DISA STIG for Red Hat Enterprise Linux 7',
                policyType: 'DISA STIG for Red Hat Enterprise Linux 7',
                refId: 'xccdf_org.ssgproject.content_profile_stig-rhel7-disa',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '9b034440-e3dd-4c19-8f2c-ca75e813d57d',
                    name: 'DISA STIG for Red Hat Enterprise Linux 7',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        },
        {
            node: {
                id: '19921ca4-8526-4651-8876-3c8587e8e125',
                name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 72',
                policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 72',
                refId: 'xccdf_org.ssgproject.content_profile_pci-dss2',
                complianceThreshold: 100,
                businessObjective: null,
                totalHostCount: 10,
                testResultHostCount: 8,
                osMajorVersion: '7',
                hosts: [
                    { id: 'f7d15113-1ac8-4aee-b367-e1777e60979d', osMinorVersion: 7 }
                ],
                benchmark: {
                    title: 'Guide to the Secure Configuration of RHEL 7',
                    version: '0.1.49'
                },
                policy: {
                    id: '19921ca4-8526-4651-8876-3c8587e8e125',
                    name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 72',
                },
                __typename: 'Profile'
            },
            __typename: 'ProfileEdge'
        }
    ],
    __typename: 'ProfileConnection'
};
