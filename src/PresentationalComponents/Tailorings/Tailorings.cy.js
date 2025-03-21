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
import ruleTreeFactory, { collectIdsFromTree } from '@/__factories__/ruleTree';
import buildValueDefinitions from '@/__factories__/valueDefinitions';
import { buildPolicies } from '@/__factories__/policies';

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
// grab all rule group and rule ids to create fake rule groups and rules
const { ruleGroupIds, ruleAndGroupIds } = collectIdsFromTree(fakeTree);

// build rule groups and rules based on the ids
const ruleGroups = buildRuleGroups(ruleGroupIds.length, ruleGroupIds);
const rules = buildRules(ruleAndGroupIds.length, ruleAndGroupIds);
const rulesSlice = rules.slice(0, 10); // return only 10 rules for the first page

// build value definitions for the rules
const allValueCheckIds = rules.flatMap((rule) => rule.value_checks);
const valueDefinitions = buildValueDefinitions(
  allValueCheckIds.length,
  allValueCheckIds
);

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
      }
    );
  };
  beforeEach(() => {
    cy.intercept(`/api/compliance/v2/policies/${policy.id}/tailorings*`, {
      statusCode: 200,
      body: {
        data: tailorings,
        meta: {
          total: tailorings.length,
          offset: 0,
          limit: 10,
        },
      },
    }).as('getTailorings');

    cy.intercept(
      `/api/compliance/v2/security_guides/${tailoring.security_guide_id}`,
      {
        statusCode: 200,
        body: {
          data: securityGuide,
        },
      }
    ).as('getSecurityGuide');

    cy.intercept(
      `/api/compliance/v2/security_guides/${securityGuide.id}/rule_groups*`,
      {
        statusCode: 200,
        body: {
          data: ruleGroups,
          meta: {
            limit: 50,
            offset: 0,
            total: ruleGroups.length,
          },
        },
      }
    ).as('getRuleGroups');

    cy.intercept(
      `/api/compliance/v2/policies/${policy.id}/tailorings/${tailoring.id}/rule_tree`,
      {
        statusCode: 200,
        body: [fakeTree],
      }
    ).as('getRuleTree');

    cy.intercept(
      `/api/compliance/v2/security_guides/${securityGuide.id}/value_definitions*`,
      {
        statusCode: 200,
        body: {
          data: valueDefinitions,
          meta: {
            limit: 50,
            offset: 0,
            total: valueDefinitions.length,
          },
        },
      }
    ).as('getValueDefinitions');

    mountComponent();
    cy.wait('@getTailorings');
  });

  it('Expect to render Tailorings view with tabs', () => {
    // ensure there is only 1 tab displayed as 1 tailoring provided
    cy.get('[data-ouia-component-type="PF5/TabButton"]')
      .should('have.length', 1)
      .should(
        'contain.text',
        `RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`
      );
    // check tree view is shown by default
    cy.get('button[aria-label="tree"]').should('have.class', 'pf-m-selected');
    cy.get('button[data-ouia-component-id="EditRulesButton"]').should(
      'be.visible'
    );
  });

  describe('Tailorings tree view', () => {
    it('Check expandable tree recursively', () => {
      cy.wait('@getRuleTree');

      let accumulatedRules = [];

      const expandNode = (node) => {
        if (!node) return;

        const foundRuleGroup = ruleGroups.find((group) => group.id === node.id);
        if (!foundRuleGroup) return;

        const filteredRules = rules.filter(
          (rule) => rule.rule_group_id === foundRuleGroup.id
        );

        accumulatedRules = [...accumulatedRules, ...filteredRules];

        // Handle batches if fake tree generates more than 50 rules
        const firstBatch = accumulatedRules.slice(0, 50);
        const secondBatch = accumulatedRules.slice(50);

        // const offset = accumulatedRules.length > 50 ? 50 : 0;
        console.log('DEBUG accumulatedRules', accumulatedRules);

        cy.intercept(
          `/api/compliance/v2/policies/${policy.id}/tailorings/${tailoring.id}/rules?limit=50&offset=0&sort_by=title%3Aasc&filter=rule_group_id*`,
          {
            statusCode: 200,
            body: {
              data: firstBatch,
              meta: {
                limit: 50,
                offset: 0,
                total: accumulatedRules.length,
              },
            },
          }
        ).as(`getRulesByGroupId-${foundRuleGroup.id}`);

        // Intercept second request (remaining rules, if any)
        if (secondBatch.length > 0) {
          cy.intercept(
            `/api/compliance/v2/policies/${policy.id}/tailorings/${tailoring.id}/rules?limit=50&offset=50&sort_by=title%3Aasc&filter=rule_group_id*`,
            {
              statusCode: 200,
              body: {
                data: secondBatch,
                meta: {
                  limit: 50,
                  offset: 50,
                  total: accumulatedRules.length,
                },
              },
            }
          ).as(`getRulesByGroupId-${foundRuleGroup.id}-50`);
        }

        cy.get('tbody tr')
          .filter((_index, el) => el.innerText.includes(foundRuleGroup.title))
          .first()
          .within(() => {
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
  });

  describe('Tailorings list rules view', () => {
    it('Expect to render Tailorings list rules view on table type switch', () => {
      cy.get('button[aria-label="rows"]').should(
        'not.have.class',
        'pf-m-selected'
      );

      cy.intercept(
        `/api/compliance/v2/policies/${policy.id}/tailorings/${tailoring.id}/rules*`,
        {
          statusCode: 200,
          body: {
            data: rulesSlice,
            meta: {
              total: rules.length,
              offset: 0,
              limit: 10,
            },
          },
        }
      ).as('getRules');

      cy.get('button[aria-label="rows"]').click();
      cy.wait('@getRules');
      cy.get('button[aria-label="rows"]').should('have.class', 'pf-m-selected');
      cy.get('table')
        .find('tbody')
        .find('tr')
        .should(
          'have.length',
          rules.length >= perPage ? perPage : rules.length
        );
    });

    it('Tailorings list rules value definitions displayed and mapped correctly', () => {
      cy.get('button[aria-label="rows"]').should(
        'not.have.class',
        'pf-m-selected'
      );

      cy.intercept(
        `/api/compliance/v2/policies/${policy.id}/tailorings/${tailoring.id}/rules*`,
        {
          statusCode: 200,
          body: {
            data: rulesSlice,
            meta: {
              total: rules.length,
              offset: 0,
              limit: 10,
            },
          },
        }
      ).as('getRules');

      cy.get('button[aria-label="rows"]').click();
      cy.wait('@getRules');

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
          'true'
        );

        cy.get('tbody[role="rowgroup"]')
          .eq(index)
          .within(() => {
            cy.get('tr.pf-m-expanded').within(() => {
              cy.get('div[id^="rule-description-rule"]')
                .should('exist')
                .invoke('text')
                .should('contain', currentRule.description);
              cy.get('div[id^="rule-identifiers-references"]')
                .should('exist')
                .invoke('text')
                .then((text) => {
                  expect(text).to.include(currentRule.identifier.label);
                  expect(text).to.include(currentRule.references[0].label);
                });
              cy.get('div[id^="rule-rationale"]')
                .should('exist')
                .invoke('text')
                .should('contain', currentRule.rationale);
            });
            const matchingValues = valueDefinitions.filter((def) =>
              currentRule.value_checks.includes(def.id)
            );
            matchingValues.forEach(({ title, default_value }) => {
              cy.contains('div', 'Depends on values')
                .parent() // Move to the parent container and get <p> child element
                .within(() => {
                  cy.get('p').should(
                    'contain.text',
                    `${title}: ${default_value}`
                  );
                });
            });
          });
      }
    });
  });
});

describe('Tailorings - No tailorings on Policy details', () => {
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
      }
    );
  };

  beforeEach(() => {
    cy.intercept(`/api/compliance/v2/policies/${policy.id}/tailorings*`, {
      statusCode: 200,
      body: {
        data: [],
        meta: {
          total: 0,
          offset: 0,
          limit: 10,
        },
      },
    }).as('getTailorings');

    // api/compliance/v2/security_guides/supported_profiles?filter=os_major_version%3D9+AND+ref_id%3Dxccdf_org.ssgproject.content_profile_stig_gui
    cy.intercept('/api/compliance/v2/security_guides/supported_profiles*', {
      statusCode: 200,
      body: {
        data: supportedProfiles,
        meta: {
          total: supportedProfiles.length,
          offset: 0,
          limit: 10,
        },
      },
    }).as('getSupportedProfiles');

    // api/compliance/v2/security_guides/2b9d3a7d-e8b2-425b-a3e7-d56558c0f602/profiles/817c03ad-d98c-45dc-9f03-d6c711abbaf6/rules?limit=10&offset=0&sort_by=title%3Aasc
    cy.intercept(
      `/api/compliance/v2/security_guides/${supportedProfile.security_guide_id}/profiles/${supportedProfile.id}/rules*`,
      {
        statusCode: 200,
        body: {
          data: rulesSlice,
          meta: {
            total: rules.length,
            offset: 0,
            limit: 10,
          },
        },
      }
    ).as('getRules');

    mountComponent();
    cy.wait('@getTailorings');
  });

  it('Expect to render NoTailorings view', () => {
    cy.contains('Rule editing is now available.');
    cy.contains(
      `What rules are shown on this list? This view shows rules that are from the latest SSG version (${supportedProfile.security_guide_version})`
    );
    cy.get('button[data-ouia-component-id="EditRulesButton"]').should(
      'be.visible'
    );
  });

  describe('NoTailorings tree view', () => {
    // TODO: fix NoTailorings tree view & add tests
  });

  describe('NoTailorings list rules view', () => {
    it('NoTailorings view expanded rules content', () => {
      cy.wait('@getRules');

      cy.get('table')
        .find('tbody')
        .find('tr')
        .should(
          'have.length',
          rules.length >= perPage ? perPage : rules.length
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
          'true'
        );

        cy.get('tbody[role="rowgroup"]')
          .eq(index)
          .within(() => {
            cy.get('tr.pf-m-expanded').within(() => {
              cy.get('div[id^="rule-description-rule"]')
                .should('exist')
                .invoke('text')
                .should('contain', currentRule.description);
              cy.get('div[id^="rule-identifiers-references"]')
                .should('exist')
                .invoke('text')
                .then((text) => {
                  expect(text).to.include(currentRule.identifier.label);
                  expect(text).to.include(currentRule.references[0].label);
                });
              cy.get('div[id^="rule-rationale"]')
                .should('exist')
                .invoke('text')
                .should('contain', currentRule.rationale);
            });
          });
      }
    });
  });
});
