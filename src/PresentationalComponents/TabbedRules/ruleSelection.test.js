import {
  matchesSelectionItem,
  profilesWithRulesToSelection,
  tabsDataToOsMinorMap,
  extendProfilesByOsMinor,
} from './ruleSelection';

describe('matchesSelectionItem', () => {
  const selectionItem = {
    id: '1',
    osMinorVersion: '5',
  };

  it('matches on profile id and osMinorVersion', () => {
    const profile = {
      id: '1',
      osMinorVersion: '5',
    };
    expect(matchesSelectionItem(selectionItem, profile)).toBe(true);
  });

  it('matches on profile id and newOsMinorVersion', () => {
    const profile = {
      id: '1',
    };
    const newOsMinorVersion = '5';
    expect(
      matchesSelectionItem(selectionItem, profile, newOsMinorVersion)
    ).toBe(true);
  });

  it('returns false on profile id missmatch', () => {
    const profile = {
      id: '99',
      osMinorVersion: '5',
    };
    expect(matchesSelectionItem(selectionItem, profile)).toBe(false);
  });

  it('returns false on osMinorVersion missmatch', () => {
    const profile = {
      id: '1',
      osMinorVersion: '6',
    };
    const newOsMinorVersion = '7';

    expect(matchesSelectionItem(selectionItem, profile)).toBe(false);
    expect(
      matchesSelectionItem(selectionItem, profile, newOsMinorVersion)
    ).toBe(false);
  });
});

describe('profilesWithRulesToSelection', () => {
  const profiles = [
    {
      id: '1',
      osMinorVersion: '5',
      rules: [{ refId: 'profile1-rule1' }, { refId: 'profile1-rule2' }],
    },
    {
      id: '2',
      osMinorVersion: '6',
      rules: [{ refId: 'profile2-rule1' }, { refId: 'profile2-rule2' }],
    },
  ];

  const prevSelection = [
    {
      id: '1',
      osMinorVersion: '00',
      ruleRefIds: ['profile1-different-os-rule'],
    },
    {
      id: '1',
      osMinorVersion: '5',
      ruleRefIds: ['profile1-rule3', 'profile1-rule4'],
    },
    {
      id: '99',
      osMinorVersion: '5',
      ruleRefIds: ['profile99-rule1', 'profile99-rule2'],
    },
  ];

  it('converts profiles with rules to brand new selection', () => {
    const newSelection = profilesWithRulesToSelection(profiles);
    expect(newSelection).toMatchSnapshot();
  });

  it('converts profiles with rules to brand new selection using only option', () => {
    const newSelection = profilesWithRulesToSelection(profiles, undefined, {
      only: true,
    });
    expect(newSelection).toMatchSnapshot();
  });

  it('appends new profiles with rules to a selection and keeps existing', () => {
    const newSelection = profilesWithRulesToSelection(profiles, prevSelection);
    expect(newSelection).toMatchSnapshot();
  });

  it('keeps existing profile rules selection if they match new profiles', () => {
    const newSelection = profilesWithRulesToSelection(profiles, prevSelection, {
      only: true,
    });
    expect(newSelection).toMatchSnapshot();
  });

  it('errors gracefully on missing rules', () => {
    const profilesWithoutRules = [
      { id: '1', osMinorVersion: '5' },
      { id: '2', osMinorVersion: '6' },
    ];

    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const newSelection = profilesWithRulesToSelection(profilesWithoutRules);
    expect(newSelection).toMatchSnapshot();
    expect(consoleError).toBeCalled();
    consoleError.mockRestore();
  });

  it('errors gracefully on missing osMinorVersion', () => {
    const profilesWithoutOS = [
      {
        id: '1',
        rules: [{ refId: 'profile1-rule1' }, { refId: 'profile1-rule2' }],
      },
      {
        id: '2',
        rules: [{ refId: 'profile2-rule1' }, { refId: 'profile2-rule2' }],
      },
    ];

    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const newSelection = profilesWithRulesToSelection(profilesWithoutOS);
    expect(newSelection).toMatchSnapshot();
    expect(consoleError).toBeCalled();
    consoleError.mockRestore();
  });
});

describe('tabsDataToOsMinorMap', () => {
  it('maps profile ids to osMinorVersions', () => {
    const tabsData = [
      {
        profile: { id: '1' },
        newOsMinorVersion: '5',
      },
      {
        profile: { id: '2' },
        newOsMinorVersion: '6',
      },
      {
        profile: { id: '2' },
        newOsMinorVersion: '7',
      },
      {
        profile: { id: '3', osMinorVersion: '8' },
      },
    ];

    const profileToOsMinorMap = tabsDataToOsMinorMap(tabsData);
    expect(Object.keys(profileToOsMinorMap)).toEqual(['1', '2', '3']);
    expect(profileToOsMinorMap).toEqual({
      1: ['5'],
      2: ['6', '7'],
      3: ['8'],
    });
  });
});

describe('extendProfilesByOsMinor', () => {
  it('extends profiles by OS minor versions using a map', () => {
    const profiles = [
      { id: '1', title: 'Only one OS minor' },
      { id: '2', title: 'Expanded to two OS minor' },
      { id: '3', title: 'Version overwritten', osMinorVersion: '5' },
      { id: '4', title: 'Unmatched' },
    ];
    const osMinorMap = {
      1: ['5'],
      2: ['6', '7'],
      3: ['8'],
    };

    expect(extendProfilesByOsMinor(profiles, osMinorMap)).toMatchSnapshot();
  });
});
