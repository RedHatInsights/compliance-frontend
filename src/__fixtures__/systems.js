/* eslint-disable camelcase */
export const systems = [
    {
        node: {
            id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6',
            name: 'demo.example.com',
            testResultProfiles: [
                {
                    id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6-profile-1',
                    name: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                    lastScanned: '2019-11-21T14:32:19Z',
                    supported: true,
                    compliant: false,
                    benchmark: { version: '0.14.3' },
                    rulesFailed: 28,
                    rules: [
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_security_patches_up_to_date',
                            title: 'Ensure Software Patches Installed',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_owner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg User Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_groupowner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg Group Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_auditd_data_retention_max_log_file_action',
                            title: 'Configure auditd max_log_file_action Upon Reaching Maximum Log Size',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_login_events',
                            title: 'Record Attempts to Alter Logon and Logout Events',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_stime',
                            title: 'Record Attempts to Alter Time Through stime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_settimeofday',
                            title: 'Record attempts to alter time through settimeofday',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                            title: 'Record Attempts to Alter the localtime File',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                            title: 'Record Attempts to Alter Time Through clock_settime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_networkconfig_modification',
                            title: 'Record Events that Modify the System\'s Network Environment',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_usergroup_modification',
                            title: 'Record Events that Modify User/Group Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_session_events',
                            title: 'Record Attempts to Alter Process and Session Initiation Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_immutable',
                            title: 'Make the auditd Configuration Immutable',
                            compliant: false
                        }
                    ],
                    score: 40
                },
                {
                    id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6-profile-2',
                    name: 'DISA STIG for Red Hat Enterprise Linux 7',
                    lastScanned: '2019-11-21T14:32:19Z',
                    supported: true,
                    compliant: false,
                    benchmark: { version: '0.14.2' },
                    rules: [
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_security_patches_up_to_date',
                            title: 'Ensure Software Patches Installed',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_owner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg User Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_groupowner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg Group Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_auditd_data_retention_max_log_file_action',
                            title: 'Configure auditd max_log_file_action Upon Reaching Maximum Log Size',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_login_events',
                            title: 'Record Attempts to Alter Logon and Logout Events',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_stime',
                            title: 'Record Attempts to Alter Time Through stime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_settimeofday',
                            title: 'Record attempts to alter time through settimeofday',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                            title: 'Record Attempts to Alter the localtime File',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                            title: 'Record Attempts to Alter Time Through clock_settime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_networkconfig_modification',
                            title: 'Record Events that Modify the System\'s Network Environment',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_usergroup_modification',
                            title: 'Record Events that Modify User/Group Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_session_events',
                            title: 'Record Attempts to Alter Process and Session Initiation Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_immutable',
                            title: 'Make the auditd Configuration Immutable',
                            compliant: false
                        }
                    ],
                    score: 0
                },
                {
                    id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6-profile-3',
                    name: 'United States Government Configuration Baseline',
                    lastScanned: '2019-11-21T14:32:19Z',
                    supported: true,
                    compliant: false,
                    rules: [
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_security_patches_up_to_date',
                            title: 'Ensure Software Patches Installed',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_owner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg User Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_groupowner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg Group Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_auditd_data_retention_max_log_file_action',
                            title: 'Configure auditd max_log_file_action Upon Reaching Maximum Log Size',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_login_events',
                            title: 'Record Attempts to Alter Logon and Logout Events',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_stime',
                            title: 'Record Attempts to Alter Time Through stime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_settimeofday',
                            title: 'Record attempts to alter time through settimeofday',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                            title: 'Record Attempts to Alter the localtime File',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                            title: 'Record Attempts to Alter Time Through clock_settime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_networkconfig_modification',
                            title: 'Record Events that Modify the System\'s Network Environment',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_usergroup_modification',
                            title: 'Record Events that Modify User/Group Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_session_events',
                            title: 'Record Attempts to Alter Process and Session Initiation Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_immutable',
                            title: 'Make the auditd Configuration Immutable',
                            compliant: false
                        }
                    ],
                    score: 0
                },
                {
                    id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6-profile-4',
                    name: 'C2S for Red Hat Enterprise Linux 7',
                    lastScanned: '2019-11-21T14:32:19Z',
                    supported: true,
                    compliant: false,
                    rules: [
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_security_patches_up_to_date',
                            title: 'Ensure Software Patches Installed',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_owner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg User Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_file_groupowner_grub2_cfg',
                            title: 'Verify /boot/grub2/grub.cfg Group Ownership',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_auditd_data_retention_max_log_file_action',
                            title: 'Configure auditd max_log_file_action Upon Reaching Maximum Log Size',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_login_events',
                            title: 'Record Attempts to Alter Logon and Logout Events',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_stime',
                            title: 'Record Attempts to Alter Time Through stime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_settimeofday',
                            title: 'Record attempts to alter time through settimeofday',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                            title: 'Record Attempts to Alter the localtime File',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                            title: 'Record Attempts to Alter Time Through clock_settime',
                            compliant: true
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_networkconfig_modification',
                            title: 'Record Events that Modify the System\'s Network Environment',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_usergroup_modification',
                            title: 'Record Events that Modify User/Group Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_session_events',
                            title: 'Record Attempts to Alter Process and Session Initiation Information',
                            compliant: false
                        },
                        {
                            refId: 'xccdf_org.ssgproject.content_rule_audit_rules_immutable',
                            title: 'Make the auditd Configuration Immutable',
                            compliant: false
                        }
                    ],
                    score: 0
                }
            ],
            policies: [
                { name: 'HIPAA Policy' }
            ]
        }
    },
    {
        node: {
            id: 'c1f0aef3-66fd-4abc-aa33-ec6755dd39d9',
            name: 'foo.example.com',
            testResultProfiles: [
                {
                    name: 'Standard System Security Profile for Red Hat Enterprise Linux 7',
                    lastScanned: 'Never',
                    rules: [],
                    score: 0,
                    compliant: false,
                    benchmark: { version: '0.14.5' },
                    supported: true
                }
            ],
            policies: [
                { name: 'Standard System Security Profile Policy' }
            ]
        }
    }
];

export const entities = [
    {
        insights_id: '6e20f138-07de-4279-b6de-bb5f11a9f15d',
        rhel_machine_id: null,
        subscription_manager_id: '4dad2827-053b-4aa9-8e04-f5437d8bad86',
        satellite_id: null,
        bios_uuid: '68b96c88-455c-40e1-b0f8-7a5a9573dcc9',
        ip_addresses: [
            '10.0.140.61'
        ],
        fqdn: 'perfectscore.example.com',
        mac_addresses: [
            '24:e8:67:7c:fe:9c',
            '00:00:00:00:00:00'
        ],
        external_id: null,
        id: '274f7d10-5c81-49af-bd89-06b522386a41',
        account: '1460290',
        display_name: 'perfectscore.example.com',
        ansible_host: null,
        facts: [],
        reporter: null,
        stale_timestamp: null,
        stale_warning_timestamp: null,
        culled_timestamp: null,
        created: '2019-11-25T12:57:29.295797+00:00',
        updated: '2019-11-25T12:57:29.295803+00:00'
    },
    {
        insights_id: 'ff716ad5-33f0-4274-b9c3-230325cc342a',
        rhel_machine_id: null,
        subscription_manager_id: '85fa7742-3e16-4fbe-ad66-0c82bcc0ce44',
        satellite_id: null,
        bios_uuid: 'a033f0ae-22b0-4e2c-9ed6-7f4e9d98f73f',
        ip_addresses: [
            '10.0.30.156'
        ],
        fqdn: 'Maba7x.example.com',
        mac_addresses: [
            'ac:32:93:95:7c:d4',
            '00:00:00:00:00:00'
        ],
        external_id: null,
        id: '928cb95d-8d3f-41d5-ba49-35a54300ff9e',
        account: '1460290',
        display_name: 'Maba7x.example.com',
        ansible_host: null,
        facts: [],
        reporter: null,
        stale_timestamp: null,
        stale_warning_timestamp: null,
        culled_timestamp: null,
        created: '2019-11-22T15:46:32.740211+00:00',
        updated: '2019-11-22T15:46:32.740217+00:00'
    },
    {
        insights_id: '3e32f505-3fef-4f52-8320-43fefb9e4dd6',
        rhel_machine_id: null,
        subscription_manager_id: '817ba6fe-2285-4bc3-bcf8-c8a26e151a56',
        satellite_id: null,
        bios_uuid: '9951cdf3-b34e-4db4-b69a-a7a4653229a4',
        ip_addresses: [
            '192.168.121.239'
        ],
        fqdn: 'demo.example.com',
        mac_addresses: [
            '52:54:00:1d:a8:87',
            '00:00:00:00:00:00'
        ],
        external_id: null,
        id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6',
        account: '1460290',
        display_name: 'demo.example.com',
        ansible_host: null,
        facts: [],
        reporter: null,
        stale_timestamp: null,
        stale_warning_timestamp: null,
        culled_timestamp: null,
        created: '2019-10-25T16:03:10.609028+00:00',
        updated: '2019-11-21T14:33:17.838645+00:00'
    },
    {
        insights_id: null,
        rhel_machine_id: null,
        subscription_manager_id: null,
        satellite_id: null,
        bios_uuid: null,
        ip_addresses: null,
        fqdn: 'foo.example.com',
        mac_addresses: null,
        external_id: null,
        id: 'c1f0aef3-66fd-4abc-aa33-ec6755dd39d9',
        account: '1460290',
        display_name: 'foo.example.com',
        ansible_host: null,
        facts: [
            {
                namespace: 'inventory',
                facts: {
                    fqdn: 'foo.example.com'
                }
            }
        ],
        reporter: null,
        stale_timestamp: null,
        stale_warning_timestamp: null,
        culled_timestamp: null,
        created: '2019-11-08T06:55:06.937367+00:00',
        updated: '2019-11-08T06:55:06.937373+00:00'
    }
];
/* eslint-enable camelcase */
