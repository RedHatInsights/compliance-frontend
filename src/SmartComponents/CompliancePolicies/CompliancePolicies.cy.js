import CompliancePolicies from './CompliancePolicies';
import { init } from 'Store';
import { featureFlagsInterceptors } from '../../../cypress/utils/interceptors';
import { buildPolicies, buildPoliciesV2 } from '../../__factories__/policies';

const mountComponent = () => {
  cy.mountWithContext(CompliancePolicies, { store: init().getStore() });
};

const fixtures = buildPolicies(13);
const fixturesV2 = buildPoliciesV2(13);

const policies = Object.assign([], fixtures['profiles']['edges']);
const policies_v2 = Object.assign([], fixturesV2);

describe('Policies table tests', () => {
  beforeEach(() => {
    cy.intercept('*', {
      statusCode: 201,
      body: {
        data: fixtures,
      },
    });
    featureFlagsInterceptors.apiV2Disabled();
    mountComponent();
  });
  describe('defaults', () => {
    it('The table renders', () => {
      cy.get('table').should('have.length', 1);
    });
  });

  describe('table column filtering', () => {
    beforeEach(() => {
      cy.ouiaType('PF5/Pagination', 'div').first().click();
      cy.get('[role="menuitem"]').contains('20 per page').click();
    });
    it('Sort by Name', () => {
      let policyNames = [];
      policies.forEach((item) => {
        policyNames.push(item['node']['name']);
      });
      // sort by lowercase without changing the list names
      const ascendingSorted = [...policyNames].sort((a, b) => {
        return a.localeCompare(b, undefined, { sensitivity: 'base' });
      });
      const descendingSorted = [...policyNames]
        .sort((a, b) => {
          return a.localeCompare(b, undefined, { sensitivity: 'base' });
        })
        .reverse();

      cy.get('th[data-label="Name"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Name"] > div > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(ascendingSorted[index]);
      });

      cy.get('th[data-label="Name"] > button').click();

      cy.get('th[data-label="Name"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Name"] > div > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(descendingSorted[index]);
      });
    });

    it('Sort by Operating system', () => {
      let rhelVersions = [];
      policies.forEach((item) => {
        rhelVersions.push('RHEL ' + item['node']['osMajorVersion']);
      });
      const ascendingSorted = [...rhelVersions].sort();
      const descendingSorted = [...rhelVersions].sort().reverse();

      cy.get('th[data-label="Operating system"] > button').click();
      cy.get('th[data-label="Operating system"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Operating system"]').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(ascendingSorted[index]);
      });

      cy.get('th[data-label="Operating system"] > button').click();

      cy.get('th[data-label="Operating system"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Operating system"]').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(descendingSorted[index]);
      });
    });

    it('Sort by Systems', () => {
      let systems = [];
      policies.forEach((item) => {
        systems.push(item['node']['totalHostCount']);
      });
      const ascendingSorted = [...systems].sort();
      const descendingSorted = [...systems].sort().reverse();

      cy.get('th[data-label="Systems"] > button').click();
      cy.get('th[data-label="Systems"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Systems"]').each((item, index) => {
        expect(Number(Cypress.$(item).text().trim())).to.eq(
          ascendingSorted[index]
        );
      });

      cy.get('th[data-label="Systems"] > button').click();

      cy.get('th[data-label="Systems"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Systems"]').each((item, index) => {
        expect(Number(Cypress.$(item).text().trim())).to.eq(
          descendingSorted[index]
        );
      });
    });

    it('Sort by Business objectives', () => {
      const businessObjectives = policies.map(
        (item) => item.node.businessObjective?.title ?? ''
      );

      const ascendingSorted = [...businessObjectives].sort();
      const descendingSorted = [...businessObjectives].sort().reverse();

      cy.get('th[data-label="Business objective"] > button').click();
      cy.get('th[data-label="Business objective"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Business objective"]').each((item, index) => {
        if (Cypress.$(item).text() == '--') {
          assert(
            ascendingSorted[index] === '',
            `Business objective should be null instead of ${ascendingSorted[index]}`
          );
        } else {
          expect(Cypress.$(item).text()).to.eq(ascendingSorted[index]);
        }
      });

      cy.get('th[data-label="Business objective"] > button').click();

      cy.get('th[data-label="Business objective"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Business objective"]').each((item, index) => {
        if (Cypress.$(item).text() == '--') {
          assert(descendingSorted[index] === '');
        } else {
          expect(Cypress.$(item).text()).to.eq(descendingSorted[index]);
        }
      });
    });

    it('Sort by Compliance threshold', () => {
      let complianceThresholdValues = [];
      policies.forEach((item) => {
        complianceThresholdValues.push(item['node']['complianceThreshold']);
      });
      const ascendingSorted = [...complianceThresholdValues].sort();
      const descendingSorted = [...complianceThresholdValues].sort().reverse();

      cy.get('th[data-label="Compliance threshold"] > button').click();
      cy.get('th[data-label="Compliance threshold"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Compliance threshold"]').each((item, index) => {
        expect(Number(Cypress.$(item).text().split('%')[0])).to.eq(
          ascendingSorted[index]
        );
      });

      cy.get('th[data-label="Compliance threshold"] > button').click();

      cy.get('th[data-label="Compliance threshold"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Compliance threshold"]').each((item, index) => {
        expect(Number(Cypress.$(item).text().split('%')[0])).to.eq(
          descendingSorted[index]
        );
      });
    });
  });

  describe('table pagination', () => {
    it('Navigation between pages', () => {
      cy.ouiaType('PF5/Pagination', 'div').first().click();
      cy.get('[role="menuitem"]').contains('10 per page').click();
      cy.ouiaType('PF5/Pagination', 'div')
        .find('button')
        .first()
        .invoke('text')
        .should('eq', `1 - 10 of ${policies.length} `);
      cy.get('button[aria-label="Go to previous page"]')
        .first()
        .should('be.disabled');
      cy.get('button[aria-label="Go to next page"]')
        .first()
        .should('be.enabled')
        .click();
      cy.ouiaType('PF5/Pagination', 'div')
        .find('button')
        .first()
        .invoke('text')
        .should('eq', `11 - ${policies.length} of ${policies.length} `);

      cy.ouiaType('PF5/Pagination', 'div').first().click();
      cy.get('[role="menuitem"]').contains('20 per page').click();
      cy.get('button[aria-label="Go to previous page"]')
        .first()
        .should('be.disabled');
      cy.get('button[aria-label="Go to next page"]')
        .first()
        .should('be.disabled');
      cy.ouiaType('PF5/Pagination', 'div')
        .find('button')
        .first()
        .invoke('text')
        .should('eq', `1 - ${policies.length} of ${policies.length} `);
    });

    it.skip('Set per page elements', () => {
      const perPage = [
        '10 per page',
        '20 per page',
        '50 per page',
        '100 per page',
      ];

      cy.ouiaType('PF5/PaginationOptionsMenu', 'div')
        .ouiaType('PF5/DropdownToggle', 'button')
        .each(($pagOptMenu) => {
          perPage.forEach(function (perPageValue) {
            cy.wrap($pagOptMenu).click();
            cy.ouiaType('PF5/DropdownItem', 'button')
              .contains(perPageValue)
              .click();
            cy.get('table').should('have.length', 1);
          });
        });
    });
  });

  describe('Filter table', () => {
    it('Search by non existing name', () => {
      cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
      cy.get('div[class="pf-v5-c-empty-state"]').contains(
        'No matching policies found'
      );
    });
    it('Find policy by Name', () => {
      let policyName = policies[0]['node']['name'];
      cy.ouiaId('ConditionalFilter', 'input').type(policyName);
      cy.get('td[data-label="Name"] a')
        .should('have.length', 1)
        .first()
        .contains(policyName);
    });
    it('Clear filters works', () => {
      cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
      cy.ouiaId('ClearFilters', 'button').should('be.visible').click();
      cy.ouiaId('ClearFilters', 'button').should('not.exist');
    });
  });

  describe('Manage columns', () => {
    it.skip('Manage policies columns', () => {
      cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaType('PF5/DropdownItem', 'li').first().find('button').click();
      cy.get('input[checked]')
        .not('[disabled]')
        .each(($checkbox) => {
          cy.wrap($checkbox).click();
        });
      cy.ouiaId('Save', 'button').click();

      cy.get('th[data-label="Operating system"]').should('not.exist');
      cy.get('th[data-label="Systems"]').should('not.exist');
      cy.get('th[data-label="Business objective"]').should('not.exist');
      cy.get('th[data-label="Compliance threshold"]').should('not.exist');

      cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaType('PF5/DropdownItem', 'li').first().find('button').click();
      cy.get('button').contains('Select all').click();
      cy.ouiaId('Save', 'button').click();

      cy.get('th[data-label="Operating system"]').should('exist');
      cy.get('th[data-label="Systems"]').should('exist');
      cy.get('th[data-label="Business objective"]').should('exist');
      cy.get('th[data-label="Compliance threshold"]').should('exist');
    });
  });

  describe('Reports download', () => {
    it('CSV report download and content', () => {
      cy.get('button[aria-label="Export"]').click();
      cy.get('button[aria-label="Export to CSV"]').click();
      // get the newest csv file
      cy.exec('ls cypress/downloads | grep .csv | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res).should('not.be.empty');
        }
      );
    });

    it('JSON report download and content', () => {
      cy.get('button[aria-label="Export"]').click();
      cy.get('button[aria-label="Export to JSON"]').click();

      // get the newest csv file
      cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res)
            .should('not.be.empty')
            .then((fileContent) => {
              assert(
                fileContent.length === policies.length,
                'Length of profiles is different'
              );
              fileContent.forEach((item) => {
                policies.forEach((policy) => {
                  if (
                    policy['node']['name'] == item['Name'] &&
                    item['OperatingSystem'].includes(
                      policy['node']['osMajorVersion']
                    )
                  ) {
                    let profileRHEL =
                      'RHEL ' + policy['node']['osMajorVersion'];
                    assert(
                      item['OperatingSystem'].includes(profileRHEL),
                      `Operating system values are not equal: JSON has ${item['OperatingSystem']} value but table has ${profileRHEL}`
                    );

                    assert(
                      item['Systems'] === policy['node']['totalHostCount'],
                      `Total host count is not equal: JSON has ${item['Systems']} but table has ${policy['node']['totalHostCount']}`
                    );

                    if (item['BusinessObjective'] === '--') {
                      assert(
                        policy['node']['businessObjective'] === null,
                        `Business objective has to be null but file contains ${item['businessObjective']} value`
                      );
                    } else {
                      assert(
                        item['BusinessObjective'] ===
                          policy['node']['businessObjective']['title'],
                        `Business objective values are not equal: JSON has ${item['BusinessObjective']} but table has ${policy['node']['businessObjective']['title']}`
                      );
                    }

                    let csvTreshold = Number(
                      item['ComplianceThreshold'].split('%')[0]
                    );
                    assert(
                      csvTreshold === policy['node']['complianceThreshold'],
                      `Threshold values are not equal: JSON has ${csvTreshold} but table has ${policy['node']['complianceThreshold']}`
                    );
                  }
                });
              });
            });
        }
      );
    });
  });

  describe('Table row', () => {
    it('Policy name has correct link to PolicyDetails page', () => {
      let policyName = policies[0]['node']['name'];
      let policyId = policies[0]['node']['id'];
      cy.ouiaId('ConditionalFilter', 'input').type(policyName);
      cy.get('td[data-label="Name"] > div > div > a')
        .first()
        .invoke('attr', 'href')
        .should('eq', `/insights/compliance/scappolicies/${policyId}`);
    });

    it('Row actions has correct items', () => {
      cy.ouiaType('PF5/TableRow', 'tr')
        .get('td[data-key="6"] > button')
        .first()
        .click();
      cy.ouiaType('PF5/TableRow', 'tr')
        .get('li > button')
        .eq(0)
        .should('contain.text', 'Delete policy');
      cy.ouiaType('PF5/TableRow', 'tr')
        .get('li > button')
        .eq(1)
        .should('contain.text', 'Edit policy');
    });
  });
});

describe('Policies table tests API V2', () => {
  beforeEach(() => {
    featureFlagsInterceptors.apiV2Enabled();
    cy.intercept('**/graphql', {
      statusCode: 200,
      body: {
        data: fixtures,
      },
    });
    cy.intercept('**/policies*', {
      statusCode: 200,
      body: {
        data: fixturesV2,
      },
    });
    mountComponent();
  });
  describe('defaults', () => {
    it.skip('The table renders with data', () => {
      cy.get('table').should('have.length', 1);

      let policyNames = [];
      policies_v2.forEach((item) => {
        policyNames.push(item['title']);
      });

      // Check Name sorting
      const ascendingSorted = [...policyNames].sort((a, b) => {
        return a.localeCompare(b, undefined, { sensitivity: 'base' });
      });
      cy.get('th[data-label="Name"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Name"] > div > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(ascendingSorted[index]);
      });
    });
  });
});
