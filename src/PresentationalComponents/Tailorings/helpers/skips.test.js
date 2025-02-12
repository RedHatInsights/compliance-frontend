import skips from './skips';

describe('skips', () => {
  const policy = {};
  const tailoring = {};
  const securityGuide = {};
  const profileId = 'PROFILE_ID_1';
  const tableState = {
    tableState: {
      selectedOnly: true,
      tableView: 'rows',
      'open-items': [],
    },
  };

  it('should return an object with all skip options true by default', () => {
    expect(
      skips({
        policy: undefined,
        tailoring: undefined,
        profileId: undefined,
        securityGuide: undefined,
        tableState: undefined,
      })
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

  describe('rows view', () => {});

  it('should return an object with all skip options true, except SSG, if a tableState is present, but no policy, tailoring or SSG', () => {
    expect(
      skips({
        policy: undefined,
        tailoring: undefined,
        securityGuide: undefined,
        profileId: undefined,
        tableState,
      })
    ).toEqual({
      securityGuide: {
        skipRulesGroups: false,
        skipRuleTree: false,
        skipRules: false,
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

  // These are the conditions for the PolicyDetails Rules tab
  it('should not skip tailoring rules if a tableState, tailoring and policy is passed and selected only is enabled', () => {
    expect(
      skips({
        policy,
        tailoring,
        profileId,
        securityGuide: undefined,
        tableState,
      })
    ).toEqual({
      securityGuide: {
        skipRuleGroups: false,
        skipRuleTree: false,
        skipRules: false,
        skipValueDefinitions: true,
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

  // These are the conditions for a rules table for a "new tailoring",
  // where there is a policy, with a security guide, but no tailoring with rules assigned
  it('should not skip SSG rules if a tableState and policy is passed, but no tailoring', () => {
    expect(
      skips({
        policy,
        tailoring: undefined,
        profileId,
        securityGuide,
        tableState,
      })
    ).toEqual({
      securityGuide: {
        skipRuleGroups: false,
        skipRuleTree: false,
        skipRules: false,
        skipValueDefinitions: true,
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

  // Same as above, but with "Selected only" disabled
  it('should not skip SSG rules if a tableState and policy is passed, but no tailoring with "Selected only" disabled', () => {
    expect(
      skips({
        policy,
        tailoring: undefined,
        profileId,
        securityGuide,
        tableState: {
          tableState: {
            ...tableState.tableState,
            selectedOnly: false,
          },
        },
      })
    ).toEqual({
      securityGuide: {
        skipRuleGroups: false,
        skipRuleTree: false,
        skipRules: false,
        skipValueDefinitions: true,
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

  // This is to verify the correct requests are made on the PolicyDetails Rules Table in the tree view with open items
  it('should not skip tailoring rules and ruleTree if a tableState, tailoring and policy is passed', () => {
    expect(
      skips({
        policy,
        tailoring,
        undefined,
        tableState: {
          tableState: {
            selectedOnly: true,
            tableView: 'tree',
            'open-items': ['OPEN_ITEM1', 'OPEN_ITEM2'],
          },
        },
      })
    ).toEqual({
      securityGuide: {
        skipRuleGroups: false,
        skipRuleTree: false,
        skipRules: false,
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

  // Same as above, but with NO open items
  it('should skip tailoring rules if there are no open items', () => {
    expect(
      skips({
        policy,
        tailoring,
        undefined,
        tableState: {
          tableState: {
            selectedOnly: true,
            tableView: 'tree',
            'open-items': [],
          },
        },
      })
    ).toEqual({
      securityGuide: {
        skipRuleGroups: false,
        skipRuleTree: false,
        skipRules: true,
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
});
