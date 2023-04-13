import React from 'react';
import Reports from './Reports';
import { IntlProvider } from 'react-intl';

import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Provider } from 'react-redux';
import { COMPLIANCE_API_ROOT } from '@/constants';
import { init } from 'Store';
import fixtures from '../../../cypress/fixtures/reports.json';

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
      <IntlProvider locale={navigator.language}>
        <MemoryRouter>
          <ApolloProvider client={client}>
            <Reports />
          </ApolloProvider>
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
};

const profilesResp = Object.assign([], fixtures['profiles']['edges']);

describe('Reports table tests', () => {
  beforeEach(() => {
    cy.intercept('*', {
      statusCode: 201,
      body: {
        data: fixtures,
      },
    });
    mountComponent();
  });
  describe('defaults', () => {
    it('The Pathways table renders', () => {
      cy.get('table').should('have.length', 1);
    });
  });

  describe('table column filtering', () => {
    it('Sort by Name', () => {
      let profileNames = [];
      profilesResp.forEach((item) => {
        profileNames.push(item['node']['name']);
      });
      const ascendingSorted = [...profileNames].sort();
      const descendingSorted = [...profileNames].sort().reverse();

      cy.get('th[data-label="Policy"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.get('td[data-label="Policy"] > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(ascendingSorted[index]);
      });

      cy.get('th[data-label="Policy"] > button').click();

      cy.get('th[data-label="Policy"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Policy"] > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(descendingSorted[index]);
      });
    });

    it('Sort by Operating system', () => {
      let rhelVersions = [];
      profilesResp.forEach((item) => {
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
  });

  describe('table pagination', () => {
    it('Set per page elements', () => {
      const perPage = [
        '10 per page',
        '20 per page',
        '50 per page',
        '100 per page',
      ];

      cy.ouiaType('PF4/PaginationOptionsMenu', 'div')
        .ouiaType('PF4/DropdownToggle', 'button')
        .each(($pagOptMenu) => {
          perPage.forEach(function (perPageValue) {
            cy.wrap($pagOptMenu).click();
            cy.ouiaType('PF4/DropdownItem', 'button')
              .contains(perPageValue)
              .click();
            cy.get('table').should('have.length', 1);
          });
        });
    });
  });

  describe('Reports download', () => {
    it('CSV report download and content', () => {
      cy.ouiaId('Export', 'button').click();
      cy.ouiaId('DownloadCSV', 'button').click();
      // get the newest csv file
      cy.exec('ls cypress/downloads | grep .csv | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res).should('not.be.empty');
        }
      );
    });
    it('JSON report download and content', () => {
      cy.ouiaId('Export', 'button').click();
      cy.ouiaId('DownloadJSON', 'button').click();
      // get the newest csv file
      cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res)
            .should('not.be.empty')
            .then((fileContent) => {
              assert(
                fileContent.length === profilesResp.length,
                'Length of profiles is different'
              );
              fileContent.forEach((item) => {
                profilesResp.forEach((profile) => {
                  if (profile['node']['name'] == item['Policy']) {
                    let profileRHEL =
                      'RHEL ' + profile['node']['osMajorVersion'];
                    assert(
                      item['OperatingSystem'].includes(profileRHEL),
                      `Operating system values are not equal: JSON has ${item['OperatingSystem']} value but table has ${profileRHEL}`
                    );

                    let profilesSystemMeetingCompliance = `${profile['node']['compliantHostCount']} of ${profile['node']['testResultHostCount']} systems`;
                    let unsupportedCount =
                      profile['node']['unsupportedHostCount'];
                    if (unsupportedCount != 0) {
                      profilesSystemMeetingCompliance =
                        profilesSystemMeetingCompliance +
                        ` | ${unsupportedCount} unsupported`;
                    }
                    assert(
                      item['SystemsMeetingCompliance'] ===
                        profilesSystemMeetingCompliance,
                      `Systems meeting compliance values are not equal: JSON has ${item['SystemsMeetingCompliance']} value but table has ${profilesSystemMeetingCompliance}`
                    );
                  }
                });
              });
            });
        }
      );
    });
  });

  describe('Filter table', () => {
    it('Search by non existing name', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'button').click();
      cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
      cy.get('div[class="pf-c-empty-state"]').contains(
        'No matching reports found'
      );
    });
    it('Find report by Name', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'button').click();
      cy.ouiaId('ConditionalFilter', 'input').type('PCI-DSS v3.2.1 Control');
      cy.get('td[data-label="Policy"] > div > a')
        .should('have.length', 1)
        .first()
        .contains('PCI-DSS v3.2.1 Control');
    });
    it('Find report by Policy type', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy type', 'button').click();
      cy.ouiaId('Filter by policy type', 'div').click();
      cy.get('input[id$="Example Server Profile"]').click();
      cy.get('td[data-label="Policy"] > div > a')
        .should('have.length', 1)
        .first()
        .contains('Example Server Profile');
    });
    it('Find report by Operating system', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Operating system', 'button').click();
      cy.ouiaId('Filter by operating system', 'div').click();
      cy.get('input[id$="-7"]').click();
      cy.get('td[data-label="Operating system"]')
        .should('have.length', 1)
        .first()
        .contains('RHEL 7');
    });
    it('Find report by Systems meeting compliance', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Systems meeting compliance', 'button').click();
      cy.ouiaId('Filter by systems meeting compliance', 'div').click();
      cy.get('input[id$="-50-69"]').click();

      cy.get('td[data-label="Policy"] > div > a')
        .should('have.length', 1)
        .first()
        .contains('PCI-DSS v3.2.1 Control');
    });
    it('Clear filters works', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'button').click();
      cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');

      cy.ouiaId('ClearFilters', 'button').should('be.visible').click();
      cy.ouiaId('ClearFilters', 'button').should('not.exist');
    });
  });

  describe('Manage columns', () => {
    it('Manage reports columns', () => {
      cy.ouiaId('Actions', 'div').click();
      cy.ouiaType('PF4/DropdownItem', 'button').click();
      cy.get('input[checked]')
        .not('[disabled]')
        .each(($checkbox) => {
          cy.wrap($checkbox).click();
        });
      cy.ouiaId('Save', 'button').click();

      cy.get('th[data-label="Operating system"]').should('not.exist');
      cy.get('th[data-label="Systems meeting compliance"]').should('not.exist');

      cy.ouiaId('Actions', 'div').click();
      cy.ouiaType('PF4/DropdownItem', 'button').click();
      cy.get('button').contains('Select all').click();
      cy.ouiaId('Save', 'button').click();

      cy.get('th[data-label="Operating system"]').should('exist');
      cy.get('th[data-label="Systems meeting compliance"]').should('exist');
    });
  });

  it('expect to render emptystate', () => {
    cy.intercept('*', {
      statusCode: 201,
      body: {
        data: fixtures,
      },
    });
    cy.get('table').should('have.length', 1);
  });
});
