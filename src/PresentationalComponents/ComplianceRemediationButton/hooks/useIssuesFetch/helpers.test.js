import {
  buildSystemOsMinorMap,
  mapValueOverridesToRefIds,
  buildOverridesByOsMinor,
  resolveValueOverridesForSystems,
  compileRemediatonData,
} from './helpers';

describe('useIssuesFetch helpers', () => {
  describe('buildSystemOsMinorMap', () => {
    it('maps system_id to os_minor_version', () => {
      expect(
        buildSystemOsMinorMap([
          { system_id: 'sys-1', os_minor_version: 6 },
          { system_id: 'sys-2', os_minor_version: '8' },
          { system_id: 'sys-3' },
        ]),
      ).toEqual({
        'sys-1': 6,
        'sys-2': 8,
      });
    });
  });

  describe('mapValueOverridesToRefIds', () => {
    it('maps UUID keys to value definition ref_ids', () => {
      expect(
        mapValueOverridesToRefIds(
          {
            'uuid-1': '180',
            'uuid-2': 'true',
          },
          [
            {
              id: 'uuid-1',
              ref_id: 'var_accounts_maximum_age_login_defs',
            },
            {
              id: 'uuid-2',
              ref_id: 'var_accounts_tmout',
            },
          ],
        ),
      ).toEqual({
        var_accounts_maximum_age_login_defs: '180',
        var_accounts_tmout: 'true',
      });
    });

    it('throws when a UUID cannot be mapped', () => {
      expect(() =>
        mapValueOverridesToRefIds(
          { 'missing-uuid': '180' },
          [{ id: 'other', ref_id: 'var_other' }],
        ),
      ).toThrow(
        'Unable to map value override "missing-uuid" to a playbook var_* key',
      );
    });
  });

  describe('buildOverridesByOsMinor', () => {
    it('builds ref_id override maps keyed by OS minor', () => {
      expect(
        buildOverridesByOsMinor(
          [
            {
              os_minor_version: 6,
              security_guide_id: 'sg-1',
              value_overrides: { 'uuid-1': '180' },
            },
            {
              os_minor_version: 8,
              security_guide_id: 'sg-1',
              value_overrides: {},
            },
          ],
          {
            'sg-1': [
              {
                id: 'uuid-1',
                ref_id: 'var_accounts_maximum_age_login_defs',
              },
            ],
          },
        ),
      ).toEqual({
        6: {
          var_accounts_maximum_age_login_defs: '180',
        },
      });
    });
  });

  describe('resolveValueOverridesForSystems', () => {
    const overridesByOsMinor = {
      6: { var_accounts_maximum_age_login_defs: '180' },
      8: { var_accounts_maximum_age_login_defs: '90' },
    };

    it('returns overrides for the systems OS minor', () => {
      expect(
        resolveValueOverridesForSystems(
          ['sys-1'],
          { 'sys-1': 6 },
          overridesByOsMinor,
        ),
      ).toEqual({
        var_accounts_maximum_age_login_defs: '180',
      });
    });

    it('returns undefined when there are no tailored values', () => {
      expect(
        resolveValueOverridesForSystems(
          ['sys-1'],
          { 'sys-1': 4 },
          overridesByOsMinor,
        ),
      ).toBeUndefined();
    });

    it('throws when systems span minors with different overrides', () => {
      expect(() =>
        resolveValueOverridesForSystems(
          ['sys-1', 'sys-2'],
          { 'sys-1': 6, 'sys-2': 8 },
          overridesByOsMinor,
        ),
      ).toThrow(
        'Cannot attach a single value_overrides map to an issue that spans multiple OS minors with different tailorings',
      );
    });
  });

  describe('compileRemediatonData', () => {
    const ruleResults = [
      {
        id: 'rr-1',
        result: 'fail',
        rule_id: 'rule-1',
        remediation_issue_id: 'ssg:rhel8|cis|rule_accounts_maximum_age',
        system_id: 'sys-1',
        description: 'Maximum password age',
        precedence: 1,
      },
      {
        id: 'rr-2',
        result: 'fail',
        rule_id: 'rule-1',
        remediation_issue_id: 'ssg:rhel8|cis|rule_accounts_maximum_age',
        system_id: 'sys-2',
        description: 'Maximum password age',
        precedence: 1,
      },
      {
        id: 'rr-3',
        result: 'pass',
        rule_id: 'rule-2',
        remediation_issue_id: 'ssg:rhel8|cis|other',
        system_id: 'sys-1',
      },
    ];

    it('compiles issues and systems without overrides', () => {
      expect(compileRemediatonData(ruleResults)).toEqual({
        systems: ['sys-1', 'sys-2'],
        issues: [
          {
            id: 'ssg:rhel8|cis|rule_accounts_maximum_age',
            precedence: 1,
            description: 'Maximum password age',
            systems: ['sys-1', 'sys-2'],
          },
        ],
      });
    });

    it('attaches value_overrides when tailorings resolve for the systems', () => {
      expect(
        compileRemediatonData(ruleResults, undefined, {
          systemOsMinorMap: {
            'sys-1': 6,
            'sys-2': 6,
          },
          overridesByOsMinor: {
            6: {
              var_accounts_maximum_age_login_defs: '180',
            },
          },
        }),
      ).toEqual({
        systems: ['sys-1', 'sys-2'],
        issues: [
          {
            id: 'ssg:rhel8|cis|rule_accounts_maximum_age',
            precedence: 1,
            description: 'Maximum password age',
            systems: ['sys-1', 'sys-2'],
            value_overrides: {
              var_accounts_maximum_age_login_defs: '180',
            },
          },
        ],
      });
    });
  });
});
