import { buildTreeTable, skips } from './helpers';

import ruleTree from '@/__factories__/ruleTree';
// import ruleGroups from './__factories__/ruleGroups';

describe('buildTreeTable', () => {
  it('should return a treeTable for rule groups and rules', () => {
    const tree = ruleTree.build();
    expect(buildTreeTable(tree, [])[0].leaves?.length).toEqual(2);
  });
});

describe.skip('skips', () => {
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
        ruleGroups: true,
        ruleTree: true,
        rules: true,
        valueDefinitions: true,
        profile: {
          rules: true,
          ruleTree: true,
        },
      },
      tailoring: {
        rules: true,
        ruleTree: true,
      },
    });
  });

  it('should return an object with all skip options true if a tableState is present, but no policy, tailoring or SSG', () => {
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
        ruleGroups: true,
        ruleTree: true,
        rules: true,
        valueDefinitions: true,
        profile: {
          rules: true,
          ruleTree: true,
        },
      },
      tailoring: {
        rules: true,
        ruleTree: true,
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
        ruleGroups: false,
        ruleTree: true,
        rules: true,
        valueDefinitions: true,
        profile: {
          rules: true,
          ruleTree: true,
        },
      },
      tailoring: {
        rules: false,
        ruleTree: false,
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
        ruleGroups: false,
        ruleTree: true,
        rules: true,
        valueDefinitions: true,
        profile: {
          rules: false,
          ruleTree: false,
        },
      },
      tailoring: {
        rules: true,
        ruleTree: true,
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
        ruleGroups: false,
        ruleTree: false,
        rules: false,
        valueDefinitions: true,
        profile: {
          rules: true,
          ruleTree: true,
        },
      },
      tailoring: {
        rules: true,
        ruleTree: true,
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
        ruleGroups: false,
        ruleTree: true,
        rules: true,
        valueDefinitions: false,
        profile: {
          rules: true,
          ruleTree: true,
        },
      },
      tailoring: {
        rules: false,
        ruleTree: false,
      },
    });
  });

  // Same as above, but with NO open items
  // TODO When rules are skipped it'll result in the items being undefined in case the treeview is active.
  // When the tree view is active no rules should be fetched until a group is expanded
  it.skip('should skip tailoring rules if there are no open items', () => {
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
        ruleGroups: false,
        ruleTree: true,
        rules: true,
        valueDefinitions: true,
        profile: {
          rules: true,
          ruleTree: true,
        },
      },
      tailoring: {
        rules: true,
        ruleTree: false,
      },
    });
  });
});
