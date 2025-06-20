import skips from './skips';

describe('skips', () => {
  const policy = {};
  const tailoring = {};
  const securityGuideId = 'SSG_ID';
  const profileId = 'PROFILE_ID_1';

  it('should return an object with all skip options true by default', () => {
    expect(
      skips({
        policy: undefined,
        tailoring: undefined,
        profileId: undefined,
        securityGuide: undefined,
        tableState: undefined,
      }),
    ).toEqual({
      securityGuide: {
        skipRuleTree: true,
        skipRules: true,
        skipRuleGroups: true,
        skipValueDefinitions: true,
      },
      profile: {
        skipRules: true,
        skipRuleTree: true,
      },
      tailoring: {
        skipRules: true,
        skipRuleTree: true,
      },
    });
  });

  describe('policy-details', () => {
    const skipProfile = 'policy-details';

    describe('row', () => {
      const tableState = {
        tableState: {
          tableView: 'rows',
        },
      };

      it('should only load rules by default', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: true,
            skipRuleGroups: true,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: false,
            skipRuleTree: true,
          },
        });
      });

      it('should not load rules if there is no tailoring', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring: undefined,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: true,
            skipRuleGroups: true,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: true,
          },
        });
      });

      it('should load value defintions if there are open items', () => {
        const tableStateWithOpenItems = {
          tableState: {
            ...tableState.tableState,
            'open-items': ['OPEN_ITEM1', 'OPEN_ITEM2'],
          },
        };
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState: tableStateWithOpenItems,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: true,
            skipRuleGroups: true,
            skipValueDefinitions: false,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: false,
            skipRuleTree: true,
          },
        });
      });
    });

    describe('tree', () => {
      const tableState = {
        tableState: {
          tableView: 'tree',
        },
      };

      it('should load rules, ruleTree and rule groups by default', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: true,
            skipRuleGroups: false,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: false,
          },
        });
      });

      it('should load value defintions if there are open items', () => {
        const tableStateWithOpenItems = {
          tableState: {
            ...tableState.tableState,
            'open-items': ['OPEN_ITEM1', 'OPEN_ITEM2'],
          },
        };
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState: tableStateWithOpenItems,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: true,
            skipRuleGroups: false,
            skipValueDefinitions: false,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: false,
            skipRuleTree: false,
          },
        });
      });
    });
  });

  describe('create-policy', () => {
    const skipProfile = 'create-policy';

    describe('row', () => {
      const tableState = {
        tableState: {
          selectedRulesOnly: true,
          tableView: 'rows',
        },
      };

      it('should only load rules by default', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: false,
            skipRules: true,
            skipRuleGroups: false,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: false,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: true,
          },
        });
      });

      it('should load SSG and profile rules with only selected rules not enables', () => {
        const tableState = {
          tableState: {
            selectedRulesOnly: false,
            tableView: 'rows',
          },
        };
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: false,
            skipRules: false,
            skipRuleGroups: false,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: true,
          },
        });
      });
    });

    describe('tree', () => {
      const tableState = {
        tableState: {
          tableView: 'tree',
        },
      };

      it('should load rules, ruleTree and rule groups by default', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: false,
            skipRules: true,
            skipRuleGroups: false,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: false,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: true,
          },
        });
      });

      it('should load value defintions and additonal rules if there are open items', () => {
        const tableStateWithOpenItems = {
          tableState: {
            ...tableState.tableState,
            'open-items': ['OPEN_ITEM1', 'OPEN_ITEM2'],
          },
        };

        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState: tableStateWithOpenItems,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: false,
            skipRules: false,
            skipRuleGroups: false,
            skipValueDefinitions: false,
          },
          profile: {
            skipRules: false,
            skipRuleTree: false,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: true,
          },
        });
      });
    });
  });

  describe('edit-policy', () => {
    const skipProfile = 'edit-policy';

    describe('row', () => {
      const tableState = {
        tableState: {
          selectedRulesOnly: true,
          tableView: 'rows',
        },
      };

      it('should only load rules by default', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: true,
            skipRuleGroups: true,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: false,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: false,
            skipRuleTree: true,
          },
        });
      });

      it('should only load SSG with only selected rules not enables', () => {
        const tableState = {
          tableState: {
            selectedRulesOnly: false,
            tableView: 'rows',
          },
        };
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: true,
            skipRules: false,
            skipRuleGroups: true,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: true,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: true,
          },
        });
      });
    });

    describe('tree', () => {
      const tableState = {
        tableState: {
          tableView: 'tree',
        },
      };

      it('should load rules, ruleTree and rule groups by default', () => {
        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: false,
            skipRules: true,
            skipRuleGroups: false,
            skipValueDefinitions: true,
          },
          profile: {
            skipRules: true,
            skipRuleTree: false,
          },
          tailoring: {
            skipRules: true,
            skipRuleTree: false,
          },
        });
      });

      it('should load value defintions and additonal rules if there are open items', () => {
        const tableStateWithOpenItems = {
          tableState: {
            ...tableState.tableState,
            'open-items': ['OPEN_ITEM1', 'OPEN_ITEM2'],
          },
        };

        expect(
          skips({
            skipProfile,
            policy,
            tailoring,
            securityGuideId,
            profileId,
            tableState: tableStateWithOpenItems,
          }),
        ).toEqual({
          securityGuide: {
            skipRuleTree: false,
            skipRules: false,
            skipRuleGroups: false,
            skipValueDefinitions: false,
          },
          profile: {
            skipRules: false,
            skipRuleTree: false,
          },
          tailoring: {
            skipRules: false,
            skipRuleTree: false,
          },
        });
      });
    });
  });
});
