import React from 'react';
import { init } from 'Store';
import Tailorings from './Tailorings';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import EditRulesButtonToolbarItem from 'SmartComponents/PolicyDetails/EditRulesButtonToolbarItem';
import { buildSupportedProfiles } from '@/__factories__/supportedProfiles';
import { buildRules } from '@/__factories__/rules';
import { buildTailorings } from '@/__factories__/tailorings';
import { buildSecurityGuide } from '@/__factories__/securityGuides';
import { buildRuleGroups } from '@/__factories__/ruleGroups';
import ruleTreeFactory, {
  collectIdsFromTree,
  extendRuleTree,
} from '@/__factories__/ruleTree';
import buildValueDefinitions from '@/__factories__/valueDefinitions';
import { buildPolicies } from '@/__factories__/policies';
import getRequestParams from '../../../cypress/utils/requestParams';
import getComparisonMessage from '../../../cypress/utils/getComparisonMessage';
import { interceptBatchRequest } from '../../../cypress/utils/interceptors';
import checkRuleFields from '../../../cypress/utils/checkRuleFields';
import {
  interceptRulesByGroupRequest,
  interceptPolicyTailorings,
  interceptSecurityGuide,
  interceptTailoringTree,
  interceptSecurityGuideTree,
  interceptSSGValueDefinitions,
  interceptSupportedProfiles,
  interceptRuleGroups,
  interceptTailoringRules,
  interceptProfileRules,
} from '../../../cypress/utils/interceptors';

import { TABLE_ROW } from '@redhat-cloud-services/frontend-components-utilities';

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const policy = buildPolicies(1)[0];
const DedicatedAction = () => <EditRulesButtonToolbarItem policy={policy} />;

const tailorings = buildTailorings(1);
const tailoring = tailorings[0];

const securityGuide = buildSecurityGuide({
  id: tailoring.security_guide_id,
  os_major_version: tailoring.os_major_version,
  version: tailoring.security_guide_version,
});

// fake rule tree structure
const fakeTree = ruleTreeFactory.build();

// fake security guide tree structure
// Adding 1 additional hardcoded node to profile tree
const additionalRulesTree = buildRules(1);
const additionalRule = additionalRulesTree[0];
const additionalRuleGroupTree = buildRuleGroups(additionalRulesTree.length, [
  additionalRule['rule_group_id'],
])[0];
const additionalNode = {
  id: additionalRuleGroupTree.id,
  type: 'rule_group',
  children: [additionalRule],
};
const fakeSecurityGuideTree = extendRuleTree(fakeTree, additionalNode);

// grab all rule group and rule ids to create fake rule groups and rules
const { ruleGroupIds, ruleAndGroupIds } = collectIdsFromTree(fakeTree);

// build rule groups and rules based on the ids
const ruleGroups = [
  ...buildRuleGroups(ruleGroupIds.length, ruleGroupIds),
  additionalRuleGroupTree,
];
const rules = buildRules(ruleAndGroupIds.length, ruleAndGroupIds);
const rulesSlice = rules.slice(0, 10); // return only 10 rules for the first page

// build value definitions for the rules
const allValueCheckIds = rules.flatMap((rule) => rule.value_checks);
const valueDefinitions = buildValueDefinitions(
  allValueCheckIds.length,
  allValueCheckIds,
);

const preselectedRuleIds = rules.map((rule) => rule.id);

const key = tailoring.os_minor_version;
const additionalRules = { [key]: [] };
const preselected = { [key]: preselectedRuleIds };
const SYSTEMS_COUNT = 333;
const selectedSystemsCount = { [key]: SYSTEMS_COUNT };

const getRowByTitle = (title) =>
  cy
    .get(TABLE_ROW.replace('PF5/', 'PF6/'))
    .filter((_index, el) => el.innerText.includes(title))
    .first();

describe('Tailorings - Tailorings on Edit policy', () => {
  const mountComponent = () => {
    cy.mountWithContext(
      Tailorings,
      {
        store: init().getStore(),
      },
      {
        policy: policy,
        profiles: undefined, // TODO: add profile to test
        resetLink: true,
        rulesPageLink: true,
        remediationsEnabled: false,
        columns: [Columns.Name, Columns.Severity, Columns.Remediation],
        level: 1,
        ouiaId: 'RHELVersions',
        onValueOverrideSave: cy.spy().as('onValueOverridesSave'), // TODO: add test
        valueOverrides: {}, // { 8: {"id1": "val", "id2": "val"}, 7: {}...}
        onSelect: cy.spy().as('onSelect'), // rule selection
        showResetButton: true,
        selected: preselected, // { 8: ["id1", "id2"], 7: {}...}
        additionalRules: additionalRules, // { 8: ["id1", "id2"], 7: []...}
        enableSecurityGuideRulesToggle: true,
        selectedVersionCounts: selectedSystemsCount, // { 8: 10, 7: 5...}
        skipProfile: 'edit-policy',
      },
    );
  };
  beforeEach(() => {
    interceptPolicyTailorings(policy.id, tailorings, tailorings.length);
    interceptSecurityGuide(tailoring.security_guide_id, securityGuide);
    interceptRuleGroups(securityGuide.id, ruleGroups, ruleGroups.length);

    interceptTailoringTree(policy.id, tailoring.id, fakeTree);
    interceptSecurityGuideTree(securityGuide.id, fakeSecurityGuideTree);
    interceptSSGValueDefinitions(
      securityGuide.id,
      valueDefinitions,
      valueDefinitions.length,
    );

    mountComponent();
    cy.wait('@getTailorings');
    cy.wait('@getRuleTree');
    cy.wait('@getSecurityGuideRuleTree');
  });
  it('Expect to render Tailorings view with tabs', () => {
    // ensure there is only 1 tab displayed as 1 tailoring provided
    cy.ouiaId(
      `RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`,
    ).should('exist');
    cy.ouiaType('PF6/TabButton').find('span').contains(SYSTEMS_COUNT);
    // check tree view is shown by default
    cy.get('button[aria-label="tree"]').should('have.class', 'pf-m-selected');
    cy.ouiaId('EditRulesButton').should('not.exist');
    cy.get('a').contains('Reset to default').should('be.visible');
    const href = `/insights/compliance/scappolicies/${tailoring.profile_id}/default_ruleset/${securityGuide.id}`;
    cy.get('a')
      .contains('View policy rules')
      .should('be.visible')
      .should('have.attr', 'href', href);
    cy.ouiaType('PF6/Switch').should('exist').contains('Selected only');
  });

  describe('Tailorings tree view', () => {
    it('Select non default rules & reset selection', () => {
      // take initial ruleGroup from tree
      const foundRuleGroup = ruleGroups.find(
        (group) => group.id === fakeSecurityGuideTree.id,
      );

      getRowByTitle(foundRuleGroup.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('have.prop', 'checked', true);
      });

      // Switch toggle to show security guide tree
      cy.get('span[class*="switch__toggle"]').click();
      // check if checkbox changed from checked to indeterminate
      getRowByTitle(foundRuleGroup.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('have.prop', 'indeterminate', true);
      });

      const filteredRules = rules.filter(
        (rule) => rule.rule_group_id === foundRuleGroup.id,
      );
      const endpoint = `security_guides/${securityGuide.id}`;
      interceptRulesByGroupRequest(
        foundRuleGroup.id,
        endpoint,
        filteredRules,
        filteredRules.length,
        0,
        50,
      );

      getRowByTitle(foundRuleGroup.title).within(() => {
        cy.get('div').find("span[class*='table__toggle']").click();
      });
      cy.wait(`@getRulesByGroupId-${foundRuleGroup.id}`);

      const newRulesSet = [...filteredRules, ...additionalRulesTree];
      interceptRulesByGroupRequest(
        additionalRuleGroupTree.id,
        endpoint,
        newRulesSet,
        newRulesSet.length,
        0,
        50,
      );

      // expand group and check if not selected
      getRowByTitle(additionalRuleGroupTree.title).within(() => {
        cy.get('div').find("span[class*='table__toggle']").click();
        cy.wait(`@getRulesByGroupId-${additionalRuleGroupTree.id}`);
        cy.ouiaType('PF6/Checkbox').should('not.be.checked');
      });
      // check if rule is not selected under rule group
      getRowByTitle(additionalRule.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('not.be.checked');
      });
      // select rule group and check if selected
      getRowByTitle(additionalRuleGroupTree.title).within(() => {
        cy.ouiaType('PF6/Checkbox').check();
        cy.ouiaType('PF6/Checkbox').should('be.checked');
      });
      cy.get('@onSelect').should('have.been.called');
      // check if rule is selected under rule group
      getRowByTitle(additionalRule.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('be.checked');
      });
      // check reset selection works
      cy.contains('a', 'Reset to default').click();
      // select rule group and check if selected
      getRowByTitle(additionalRuleGroupTree.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('not.be.checked');
      });
      // check if rule is selected under rule group
      getRowByTitle(additionalRule.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('not.be.checked');
      });
      getRowByTitle(foundRuleGroup.title).within(() => {
        cy.ouiaType('PF6/Checkbox').should('have.prop', 'indeterminate', true);
      });
    });
  });
  describe('Tailorings list rules view', () => {});
});

describe('Tailorings - Tailorings on Policy details', () => {
  const perPage = 10;

  const mountComponent = () => {
    cy.mountWithContext(
      Tailorings,
      {
        store: init().getStore(),
      },
      {
        policy: policy,
        ouiaId: 'RHELVersions',
        columns: [Columns.Name, Columns.Severity, Columns.Remediation],
        level: 1,
        DedicatedAction: () => <DedicatedAction policy={policy} />,
        onValueOverrideSave: cy.spy(),
        selectedVersionCounts: {},
        skipProfile: 'policy-details',
      },
    );
  };
  beforeEach(() => {
    interceptPolicyTailorings(policy.id, tailorings, tailorings.length);
    interceptSecurityGuide(tailoring.security_guide_id, securityGuide);
    interceptRuleGroups(securityGuide.id, ruleGroups, ruleGroups.length);

    interceptTailoringTree(policy.id, tailoring.id, fakeTree);
    interceptSSGValueDefinitions(
      securityGuide.id,
      valueDefinitions,
      valueDefinitions.length,
    );

    mountComponent();
    cy.wait('@getTailorings');
    cy.wait('@getRuleTree');
  });

  it('Expect to render Tailorings view with tabs', () => {
    // ensure there is only 1 tab displayed as 1 tailoring provided
    cy.ouiaType('PF6/TabButton')
      .should('have.length', 1)
      .should(
        'contain.text',
        `RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`,
      );
    // check tree view is shown by default
    cy.get('button[aria-label="tree"]').should('have.class', 'pf-m-selected');
    cy.ouiaId('EditRulesButton').should('be.visible');
  });
  describe('Export rules', () => {
    const endpoint = `policies/${policy.id}/tailorings/${tailoring.id}/rules`;
    beforeEach(() => {
      interceptBatchRequest(endpoint, 0, rules.slice(0, 50), rules.length, 50);
      if (rules.length > 50) {
        interceptBatchRequest(
          endpoint,
          50,
          rules.slice(50, 100),
          rules.length,
          50,
        );
      }
    });
    it('Export CSV rules work', () => {
      cy.get('button[aria-label="Export"]').should('be.visible').click();
      cy.get('button[aria-label="Export to CSV"]').click();
      cy.wait(`@${endpoint}Batch1`);
      if (rules.length > 50) {
        cy.wait(`@${endpoint}Batch2`);
      }
      cy.exec(`ls cypress/downloads | grep .csv | sort -n | tail -1`).then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res).should('not.be.empty');
        },
      );
    });
    it('Export JSON rules work', () => {
      cy.get('button[aria-label="Export"]').should('be.visible').click();
      cy.get('button[aria-label="Export to JSON"]').click();
      cy.wait(`@${endpoint}Batch1`);
      if (rules.length > 50) {
        cy.wait(`@${endpoint}Batch2`);
      }

      // validate json content
      cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res)
            .should('not.be.empty')
            .then((fileContent) => {
              assert(
                fileContent.length === rules.length,
                'Length of rules is different',
              );
              fileContent.forEach((item) => {
                rules.forEach((rule) => {
                  if (item['name'].includes(rule.title)) {
                    assert(
                      item['name'].includes(rule.identifier.label),
                      getComparisonMessage(
                        'Identifier',
                        rule.identifier.label,
                        item['name'],
                      ),
                    );
                    assert(
                      rule.severity === item['severity'],
                      getComparisonMessage(
                        'Severity',
                        rule.severity,
                        item['severity'],
                      ),
                    );
                    const remediationWording = rule.remediation_available
                      ? 'Playbook'
                      : 'Manual';
                    assert(
                      remediationWording === item['remediationType'],
                      getComparisonMessage(
                        'Remediation',
                        remediationWording,
                        item['remediationType'],
                      ),
                    );
                  }
                });
              });
            });
        },
      );
    });
  });

  describe('Tailorings tree view', () => {
    it('Check expandable tree recursively', () => {
      let accumulatedRules = [];

      const expandNode = (node) => {
        if (!node) return;

        if (node.type === 'rule') {
          const foundRule = rules.find((rule) => rule.id === node.id);
          if (!foundRule) return;
          const matchingValues = valueDefinitions.filter((def) =>
            foundRule.value_checks.includes(def.id),
          );
          getRowByTitle(foundRule.title).within(() => {
            cy.get('td[data-label="Severity"]').should(
              'contain',
              capitalizeFirstLetter(foundRule.severity),
            );
            cy.get('td[data-label="Remediation type"]').should(
              'contain',
              foundRule.remediation_available ? 'Playbook' : 'Manual',
            );
            cy.get('div').find("span[class*='table__toggle']").click();
          });
          // after expanding the rule, HTML tree structure changes
          cy.get('tbody[role="rowgroup"]')
            .filter((_index, el) =>
              Cypress.$(el).text().includes(foundRule.title),
            )
            .within(() => {
              checkRuleFields(foundRule, matchingValues);
            });
          return;
        }
        const foundRuleGroup = ruleGroups.find((group) => group.id === node.id);
        if (!foundRuleGroup) return;

        const filteredRules = rules.filter(
          (rule) => rule.rule_group_id === foundRuleGroup.id,
        );

        accumulatedRules = [...accumulatedRules, ...filteredRules];

        // Handle batches if fake tree generates more than 50 rules
        const firstBatch = accumulatedRules.slice(0, 50);
        const secondBatch = accumulatedRules.slice(50);
        // dynamically intercept requests as filtering by rule_group_id includes new group ids
        const endpoint = `policies/${policy.id}/tailorings/${tailoring.id}`;
        interceptRulesByGroupRequest(
          foundRuleGroup.id,
          endpoint,
          firstBatch,
          accumulatedRules.length,
          0,
          50,
        );

        // Intercept second request (remaining rules, if any)
        if (secondBatch.length > 0) {
          interceptRulesByGroupRequest(
            `${foundRuleGroup.id}-50`,
            endpoint,
            secondBatch,
            accumulatedRules.length,
            50,
            50,
          );
        }

        getRowByTitle(foundRuleGroup.title).within(() => {
          cy.get('div').find("span[class*='table__toggle']").click();
        });

        // Wait for rules to load
        cy.wait(`@getRulesByGroupId-${foundRuleGroup.id}`);
        if (secondBatch.length > 0) {
          cy.wait(`@getRulesByGroupId-${foundRuleGroup.id}-50`);
        }

        // Recursively check children
        if (node.children && node.children.length) {
          node.children.forEach((child) => expandNode(child));
        }
      };

      expandNode(fakeTree);
    });
    it('Searching by rule title switches to list view', () => {
      const first_rule = rules[0];
      const requestParams = getRequestParams({
        filter: `(title ~ "${first_rule.title}" OR identifier_label ~ "${first_rule.title}")`,
      });
      interceptTailoringRules(
        policy.id,
        tailoring.id,
        [first_rule],
        1,
        0,
        10,
        requestParams,
      );

      cy.get('button[aria-label="rows"]').should(
        'not.have.class',
        'pf-m-selected',
      );
      cy.ouiaId('ConditionalFilter', 'input').type(first_rule.title, {
        delay: 0,
      });
      cy.get('button[aria-label="rows"]').should('have.class', 'pf-m-selected');
    });
  });

  describe('Tailorings list rules view', () => {
    beforeEach(() => {
      interceptTailoringRules(
        policy.id,
        tailoring.id,
        rulesSlice,
        rules.length,
      );
    });
    it('Expect to render Tailorings list rules view on table type switch', () => {
      cy.get('button[aria-label="rows"]').should(
        'not.have.class',
        'pf-m-selected',
      );
      cy.get('button[aria-label="rows"]').click();
      cy.wait('@getTailoringRules');
      cy.get('button[aria-label="rows"]').should('have.class', 'pf-m-selected');
      cy.get('table')
        .find('tbody')
        .find('tr')
        .should(
          'have.length',
          rules.length >= perPage ? perPage : rules.length,
        );
    });

    it('Tailorings list rules value definitions displayed and mapped correctly', () => {
      cy.get('button[aria-label="rows"]').should(
        'not.have.class',
        'pf-m-selected',
      );
      cy.get('button[aria-label="rows"]').click();
      cy.wait('@getTailoringRules');

      for (let index = 0; index < rulesSlice.length; index++) {
        const currentRule = rules[index];

        cy.get('table tbody')
          .eq(index)
          .find('tr')
          .first()
          .find('td')
          .first()
          .find('button')
          .as('expandFirstRowButton');
        cy.get('@expandFirstRowButton').click();
        cy.get('@expandFirstRowButton').should(
          'have.attr',
          'aria-expanded',
          'true',
        );

        cy.get('tbody[role="rowgroup"]')
          .eq(index)
          .within(() => {
            cy.get('tr.pf-m-expanded').within(() => {
              const matchingValues = valueDefinitions.filter((def) =>
                currentRule.value_checks.includes(def.id),
              );
              checkRuleFields(currentRule, matchingValues);
            });
          });
      }
    });
  });
});

describe.skip('Tailorings - No tailorings on Policy details', () => {
  const supportedProfiles = buildSupportedProfiles(1);
  const supportedProfile = supportedProfiles[0];
  const perPage = 10;

  const mountComponent = () => {
    cy.mountWithContext(
      Tailorings,
      {
        store: init().getStore(),
      },
      {
        policy: policy,
        ouiaId: 'RHELVersions',
        columns: [Columns.Name, Columns.Severity, Columns.Remediation],
        level: 1,
        DedicatedAction: () => <DedicatedAction policy={policy} />,
        onValueOverrideSave: cy.spy(),
        selectedVersionCounts: {},
        skipProfile: 'policy-details',
      },
    );
  };

  beforeEach(() => {
    interceptPolicyTailorings(policy.id, [], 0);
    interceptSupportedProfiles(supportedProfiles, supportedProfiles.length);
    interceptProfileRules(
      supportedProfile.security_guide_id,
      supportedProfile.id,
      rulesSlice,
      rules.length,
    );

    mountComponent();
    cy.wait('@getTailorings');
  });

  it('Expect to render NoTailorings view', () => {
    cy.contains('Rule editing is now available.');
    cy.contains(
      `What rules are shown on this list? This view shows rules that are from the latest SSG version (${supportedProfile.security_guide_version})`,
    );
    cy.ouiaId('EditRulesButton').should('be.visible');
  });

  describe('NoTailorings tree view', () => {
    // TODO: fix NoTailorings tree view & add tests
  });

  describe('NoTailorings list rules view', () => {
    it('NoTailorings view expanded rules content', () => {
      cy.wait('@getProfileRules');

      cy.get('table')
        .find('tbody')
        .find('tr')
        .should(
          'have.length',
          rules.length >= perPage ? perPage : rules.length,
        );

      for (let index = 0; index < rulesSlice.length; index++) {
        const currentRule = rules[index];

        cy.get('table tbody')
          .eq(index)
          .find('tr')
          .first()
          .find('td')
          .first()
          .find('button')
          .as('expandFirstRowButton');
        cy.get('@expandFirstRowButton').click();
        cy.get('@expandFirstRowButton').should(
          'have.attr',
          'aria-expanded',
          'true',
        );

        cy.get('tbody[role="rowgroup"]')
          .eq(index)
          .within(() => {
            cy.get('tr.pf-m-expanded').within(() => {
              checkRuleFields(currentRule);
            });
          });
      }
    });
  });
});
