export const tableState = {
  "loaded": true,
  "tagsLoaded": false,
  "allTagsLoaded": true,
  "columns": [
    {
      "composed": [
        "facts.os_release",
        "display_name"
      ],
      "key": "display_name",
      "title": "Name",
      "props": {
        "width": 30
      }
    },
    {
      "key": "facts.compliance.profiles",
      "title": "Profile",
      "props": {
        "width": 50
      }
    },
    {
      "key": "facts.compliance.rules_failed",
      "title": "Rules failed",
      "props": {
        "width": 5
      }
    },
    {
      "key": "facts.compliance.compliance_score",
      "title": "Compliance score",
      "props": {
        "width": 5
      }
    },
    {
      "key": "facts.compliance.last_scanned",
      "title": "Last scanned",
      "props": {
        "width": 10
      }
    }
  ],
  "rows": [
    {
      "id": "f0baa668-4ee4-440c-b043-12805d0c4ac0",
      "account": "007",
      "bios_uuid": "07b0ed52-6eba-443e-98e4-f83469aed131",
      "created": "2020-01-15T08:51:15.386991Z",
      "display_name": "g9gwSB.example.com",
      "fqdn": "g9gwSB.example.com",
      "insights_id": "3fd1ca93-f9a8-40b5-80f3-308315de8e46",
      "ip_addresses": [
        "10.0.208.212"
      ],
      "mac_addresses": [
        "a5:37:62:f4:8f:2c",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "0aed0b23-a0a4-4493-aea2-118278655357",
      "tags": [],
      "updated": "2020-01-15T08:51:15.387007Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7, Criminal Justice Information Services (CJIS) Security Policy",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/f0baa668-4ee4-440c-b043-12805d0c4ac0",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "f0baa668-4ee4-440c-b043-12805d0c4ac0",
                    "name": "g9gwSB.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      },
                      {
                        "name": "Criminal Justice Information Services (CJIS) Security Policy",
                        "rulesPassed": 0,
                        "rulesFailed": 0,
                        "lastScanned": "Never",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7, Criminal Justice Information Services (CJIS) Security Policy",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "442e4a93-9606-47d2-8be3-b099df8df014",
      "account": "007",
      "bios_uuid": "22dbbb23-2614-40b1-8811-07dd9f04c33a",
      "created": "2020-01-15T08:54:21.518019Z",
      "display_name": "AEeQmY.example.com",
      "fqdn": "AEeQmY.example.com",
      "insights_id": "af1bf4a7-9607-4f2d-a90d-e306d76093f7",
      "ip_addresses": [
        "10.0.29.6"
      ],
      "mac_addresses": [
        "0c:02:e0:95:73:26",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "db4cf2fe-2eb9-45c9-b9ea-ad2582259ebc",
      "tags": [],
      "updated": "2020-01-15T08:54:21.518030Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7, Criminal Justice Information Services (CJIS) Security Policy, OSPP - Protection Profile for General Purpose Operating Systems v. 4.2",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/442e4a93-9606-47d2-8be3-b099df8df014",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "442e4a93-9606-47d2-8be3-b099df8df014",
                    "name": "AEeQmY.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      },
                      {
                        "name": "Criminal Justice Information Services (CJIS) Security Policy",
                        "rulesPassed": 0,
                        "rulesFailed": 0,
                        "lastScanned": "Never",
                        "compliant": false,
                        "__typename": "Profile"
                      },
                      {
                        "name": "OSPP - Protection Profile for General Purpose Operating Systems v. 4.2",
                        "rulesPassed": 0,
                        "rulesFailed": 0,
                        "lastScanned": "Never",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7, Criminal Justice Information Services (CJIS) Security Policy, OSPP - Protection Profile for General Purpose Operating Systems v. 4.2",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "f6589ae0-b427-46fa-8b98-5ee60f88c42e",
      "account": "007",
      "bios_uuid": "e173595d-face-46f1-b2db-ec437bbbb0cf",
      "created": "2020-01-15T08:54:44.493699Z",
      "display_name": "PbK2JC.example.com",
      "fqdn": "PbK2JC.example.com",
      "insights_id": "7a1ed588-3faa-4c0e-a2ac-0dfda6b65f3a",
      "ip_addresses": [
        "10.0.179.126"
      ],
      "mac_addresses": [
        "a6:bf:54:40:e2:44",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "ff7ac111-c963-4989-a01d-62e4d6e30d01",
      "tags": [],
      "updated": "2020-01-15T08:54:44.493709Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7, Standard System Security Profile for Red Hat Enterprise Linux 7, Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/f6589ae0-b427-46fa-8b98-5ee60f88c42e",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "f6589ae0-b427-46fa-8b98-5ee60f88c42e",
                    "name": "PbK2JC.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      },
                      {
                        "name": "Standard System Security Profile for Red Hat Enterprise Linux 7",
                        "rulesPassed": 0,
                        "rulesFailed": 0,
                        "lastScanned": "Never",
                        "compliant": false,
                        "__typename": "Profile"
                      },
                      {
                        "name": "Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)",
                        "rulesPassed": 0,
                        "rulesFailed": 0,
                        "lastScanned": "Never",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7, Standard System Security Profile for Red Hat Enterprise Linux 7, Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "d5c6fe5f-1d05-4a86-afa8-e391a2d6ba3a",
      "account": "007",
      "bios_uuid": "44d8b20f-ee51-4bec-b263-c71b7bfe83b4",
      "created": "2020-01-15T08:54:53.647961Z",
      "display_name": "s4zNH8.example.com",
      "fqdn": "s4zNH8.example.com",
      "insights_id": "500e75fe-00c1-4b60-b90f-68d2b7fc78a9",
      "ip_addresses": [
        "10.0.23.225"
      ],
      "mac_addresses": [
        "44:c9:07:6c:20:ba",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "03d481bf-8d27-4c87-8987-f8561bb8af66",
      "tags": [],
      "updated": "2020-01-15T08:54:53.647972Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/d5c6fe5f-1d05-4a86-afa8-e391a2d6ba3a",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "d5c6fe5f-1d05-4a86-afa8-e391a2d6ba3a",
                    "name": "s4zNH8.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "aa10e9b1-9536-4698-9c6d-d3d3b77f2093",
      "account": "007",
      "bios_uuid": "8fd9f189-e052-4f21-83e7-b4e33406d29f",
      "created": "2020-01-15T08:55:08.170665Z",
      "display_name": "Zo7kJw.example.com",
      "fqdn": "Zo7kJw.example.com",
      "insights_id": "94303792-0ab3-49c0-8b93-ea21d050f027",
      "ip_addresses": [
        "10.0.162.55"
      ],
      "mac_addresses": [
        "48:4d:20:1e:fb:62",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "ae3effc6-c1d4-44eb-a363-8ca9e4a4ef46",
      "tags": [],
      "updated": "2020-01-15T08:55:08.170676Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/aa10e9b1-9536-4698-9c6d-d3d3b77f2093",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "aa10e9b1-9536-4698-9c6d-d3d3b77f2093",
                    "name": "Zo7kJw.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "65ef8c7a-5729-4b9f-9c37-b00566cb312f",
      "account": "007",
      "bios_uuid": "206713b3-9bf8-4760-9a19-a715c990ba7b",
      "created": "2020-01-15T08:55:21.539257Z",
      "display_name": "ryJtlV.example.com",
      "fqdn": "ryJtlV.example.com",
      "insights_id": "a2c8b7fa-e16d-4ce8-98bb-da62edf266d3",
      "ip_addresses": [
        "10.0.120.6"
      ],
      "mac_addresses": [
        "85:96:3b:b3:5b:d3",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "df313875-5caa-416f-9b15-26358ce40c9a",
      "tags": [],
      "updated": "2020-01-15T08:55:21.539268Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/65ef8c7a-5729-4b9f-9c37-b00566cb312f",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "65ef8c7a-5729-4b9f-9c37-b00566cb312f",
                    "name": "ryJtlV.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "fdaef545-2dc1-42b6-b92b-2f8a94beb8fd",
      "account": "007",
      "bios_uuid": "df6ee21c-4d3c-4d99-af1e-cf123e470693",
      "created": "2020-01-15T08:55:27.935634Z",
      "display_name": "Hb1nlp.example.com",
      "fqdn": "Hb1nlp.example.com",
      "insights_id": "9bd8f1c7-736d-4c3e-9949-f6459ba94c13",
      "ip_addresses": [
        "10.0.183.63"
      ],
      "mac_addresses": [
        "6e:df:c7:ac:86:73",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "004ec7b2-e535-4148-8095-c1b12d33bda5",
      "tags": [],
      "updated": "2020-01-15T08:55:27.935645Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/fdaef545-2dc1-42b6-b92b-2f8a94beb8fd",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "fdaef545-2dc1-42b6-b92b-2f8a94beb8fd",
                    "name": "Hb1nlp.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "7bc4e4f0-b12a-47b5-bc8b-3c48cac8b957",
      "account": "007",
      "bios_uuid": "93bd098e-b422-4276-a8a5-3a19270dd3de",
      "created": "2020-01-15T08:55:33.463984Z",
      "display_name": "4pRn86.example.com",
      "fqdn": "4pRn86.example.com",
      "insights_id": "4ca32a18-6da9-4e96-bba4-0ae3147bc959",
      "ip_addresses": [
        "10.0.158.87"
      ],
      "mac_addresses": [
        "46:71:b3:b6:35:4f",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "2564154e-e1b7-47b4-af02-bbb71b463267",
      "tags": [],
      "updated": "2020-01-15T08:55:33.463995Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/7bc4e4f0-b12a-47b5-bc8b-3c48cac8b957",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "7bc4e4f0-b12a-47b5-bc8b-3c48cac8b957",
                    "name": "4pRn86.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "a62e692d-9278-4d45-ad97-9ea972139250",
      "account": "007",
      "bios_uuid": "041246f5-6156-4bbc-916a-fa9fec2792b0",
      "created": "2020-01-15T08:55:49.403553Z",
      "display_name": "teZkGK.example.com",
      "fqdn": "teZkGK.example.com",
      "insights_id": "f092f65d-9a38-4886-835f-a1e0ad710d04",
      "ip_addresses": [
        "10.0.112.84"
      ],
      "mac_addresses": [
        "8b:83:03:17:fb:dc",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "7ae7380f-bdfa-4704-b665-402760353252",
      "tags": [],
      "updated": "2020-01-15T08:55:49.403564Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/a62e692d-9278-4d45-ad97-9ea972139250",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "a62e692d-9278-4d45-ad97-9ea972139250",
                    "name": "teZkGK.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    },
    {
      "id": "60b8ebff-b8f1-4a83-a374-6de8d6afbfe0",
      "account": "007",
      "bios_uuid": "474fbde5-687d-4b38-b0ed-dd7625e15414",
      "created": "2020-01-15T08:56:00.331401Z",
      "display_name": "FS4aaX.example.com",
      "fqdn": "FS4aaX.example.com",
      "insights_id": "e6974443-0981-4a39-967f-a52e38d1b0b3",
      "ip_addresses": [
        "10.0.34.148"
      ],
      "mac_addresses": [
        "02:73:f5:90:36:50",
        "00:00:00:00:00:00"
      ],
      "rhel_machine_id": null,
      "satellite_id": null,
      "subscription_manager_id": "0a011c71-c5a8-45ed-82bd-766b422afe28",
      "tags": [],
      "updated": "2020-01-15T08:56:00.331412Z",
      "facts": {
        "inventory": {},
        "compliance": {
          "profiles": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
          "rules_passed": 38,
          "rules_failed": {
            "title": {
              "type": {
                "displayName": "Link",
                "propTypes": {}
              },
              "key": null,
              "ref": null,
              "props": {
                "to": {
                  "pathname": "/systems/60b8ebff-b8f1-4a83-a374-6de8d6afbfe0",
                  "query": {
                    "hidePassed": true
                  }
                },
                "children": 56
              },
              "_owner": null,
              "_store": {}
            }
          },
          "rules_failed_text": 56,
          "compliance_score": {
            "key": null,
            "ref": null,
            "props": {
              "children": [
                {
                  "key": null,
                  "ref": null,
                  "props": {
                    "id": "60b8ebff-b8f1-4a83-a374-6de8d6afbfe0",
                    "name": "FS4aaX.example.com",
                    "profiles": [
                      {
                        "name": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                        "rulesPassed": 38,
                        "rulesFailed": 56,
                        "lastScanned": "2019-03-06T06:20:13Z",
                        "compliant": false,
                        "__typename": "Profile"
                      }
                    ],
                    "__typename": "System",
                    "profileNames": "PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7",
                    "rulesPassed": 38,
                    "rulesFailed": 56,
                    "lastScanned": "2019-03-06T06:20:13.000Z"
                  },
                  "_owner": null,
                  "_store": {}
                },
                " 40%"
              ]
            },
            "_owner": null,
            "_store": {}
          },
          "compliance_score_text": " 40%",
          "last_scanned": {
            "title": {
              "key": null,
              "ref": null,
              "props": {
                "value": 1551853213000,
                "updateInterval": 10000
              },
              "_owner": null,
              "_store": {}
            }
          },
          "last_scanned_text": "2019-03-06T06:20:13.000Z"
        }
      }
    }
  ],
  "activeFilters": [],
  "perPage": 50,
  "page": 1,
  "count": 10,
  "total": 10,
  "allTags": [
    {
      "name": "tjysn5",
      "tags": [
        {
          "tagName": "4z",
          "tagValue": "Some tag=b2rco4vr8"
        },
        {
          "tagName": "3i6li",
          "tagValue": "Some tag=.fe3oy90knfr"
        },
        {
          "tagName": "u5jneqo",
          "tagValue": "Some tag=giucjl"
        },
        {
          "tagName": "yic6nkm",
          "tagValue": "Some tag=xg7a"
        },
        {
          "tagName": "yrw0vd9jpl",
          "tagValue": "Some tag=5jigoaeorp"
        },
        {
          "tagName": "ffxvt8ch",
          "tagValue": "Some tag=8a0e6v"
        },
        {
          "tagName": "5u7hy0bxo",
          "tagValue": "Some tag=wrewzzhwonq"
        },
        {
          "tagName": "myp2s9a7",
          "tagValue": "Some tag=u7ykboyn6m"
        }
      ]
    },
    {
      "name": "8e9n993o2n",
      "tags": [
        {
          "tagName": "vs8a",
          "tagValue": "Some tag=xl4am"
        },
        {
          "tagName": "y8exk3",
          "tagValue": "Some tag=xr"
        },
        {
          "tagName": "ykrc8s",
          "tagValue": "Some tag=ilbbmli8msd"
        },
        {
          "tagName": "sxbcs",
          "tagValue": "Some tag=77kjapi8q"
        },
        {
          "tagName": "91",
          "tagValue": "Some tag=r62"
        },
        {
          "tagName": "o52tawd6h3",
          "tagValue": "Some tag=.r3skoehaeaj"
        },
        {
          "tagName": "x46iiin",
          "tagValue": "Some tag=af02rz"
        },
        {
          "tagName": "7m7v",
          "tagValue": "Some tag=jsa1yczn1wf"
        },
        {
          "tagName": "rl48d",
          "tagValue": "Some tag=fi61o4j7"
        }
      ]
    },
    {
      "name": "k1s6d",
      "tags": [
        {
          "tagName": "ima3yj",
          "tagValue": "Some tag=vd66mgnee"
        },
        {
          "tagName": "5r4wi",
          "tagValue": "Some tag=grs7ryr"
        },
        {
          "tagName": ".yvkqdd77k6",
          "tagValue": "Some tag=1y9mh9z3u"
        },
        {
          "tagName": "sg6ad",
          "tagValue": "Some tag=4tfyplsrh"
        },
        {
          "tagName": "7kyhsn6oqdx",
          "tagValue": "Some tag=dorhrzje"
        }
      ]
    },
    {
      "name": "xrj",
      "tags": [
        {
          "tagName": "uv27uw9vbl",
          "tagValue": "Some tag=ivmvxzrr"
        },
        {
          "tagName": "ibauyk",
          "tagValue": "Some tag=tjm0aky6"
        },
        {
          "tagName": "gqxqsb6",
          "tagValue": "Some tag=wxjzmfqj"
        },
        {
          "tagName": "lvg2cb",
          "tagValue": "Some tag=0.e7g81oapfmg"
        },
        {
          "tagName": "itva6n",
          "tagValue": "Some tag=0cneeu9u"
        },
        {
          "tagName": "qbye5slf",
          "tagValue": "Some tag=p0i5k9"
        },
        {
          "tagName": "4d0w0m9g0a",
          "tagValue": "Some tag=ysf6qzrg1q"
        }
      ]
    },
    {
      "name": "t667dzf34g",
      "tags": []
    }
  ]
};