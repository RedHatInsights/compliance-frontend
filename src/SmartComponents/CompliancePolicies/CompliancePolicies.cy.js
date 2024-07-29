import React from 'react';
import CompliancePolicies from './CompliancePolicies';
import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';
import { COMPLIANCE_API_ROOT } from '@/constants';
import { init } from 'Store';
import fixtures from '../../../cypress/fixtures/compliancePolicies2.json';

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
    uri: COMPLIANCE_API_ROOT + '/graphql',
  }),
  cache: new InMemoryCache(),
});
const mountComponent = () => {
  cy.mount(
    <Provider store={init().getStore()}>
      <MemoryRouter>
        <ApolloProvider client={client}>
          <CompliancePolicies />
        </ApolloProvider>
      </MemoryRouter>
    </Provider>
  );
};

const policies = fixtures.data;

describe('Policies table tests', () => {
  beforeEach(() => {
    cy.stub();
    cy.intercept('**/policies', {
      statusCode: 200,
      body: fixtures,
    });
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
      let policyNames = policies.map((policy) => policy.title);
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
      let rhelVersions = policies.map(
        (policy) => `RHEL ${policy.os_major_version}`
      );
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
      let systems = policies.map((policy) => policy.total_system_count);
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
      let businessObjectives = policies.map(
        (policy) => policy.business_objective
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
            ascendingSorted[index] === null,
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
          assert(descendingSorted[index] === null);
        } else {
          expect(Cypress.$(item).text()).to.eq(descendingSorted[index]);
        }
      });
    });

    it('Sort by Compliance threshold', () => {
      let complianceThresholdValues = policies.map(
        (policy) => policy.compliance_threshold
      );
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
      let policyName = policies[0].title;
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
    it('Manage policies columns', () => {
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
    it.skip('CSV report download and content', () => {
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

    it.skip('JSON report download and content', () => {
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
      let policyName = policies[0].title;
      let policyId = policies[0].id;
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
