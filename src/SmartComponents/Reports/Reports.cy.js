import React from 'react';
import Reports from './Reports';
import { MemoryRouter } from 'react-router-dom';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { Provider } from 'react-redux';
import { COMPLIANCE_API_ROOT } from '@/constants';
import { init } from 'Store';
import fixtures from '../../../cypress/fixtures/reports.json';
import { featureFlagsInterceptors } from '../../../cypress/utils/interceptors';
import FlagProvider from '@unleash/proxy-client-react';

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
    uri: COMPLIANCE_API_ROOT + '/graphql',
  }),
  cache: new InMemoryCache(),
});
const mountComponent = () => {
  cy.mount(
    <FlagProvider
      config={{
        url: 'http://localhost:8002/feature_flags',
        clientKey: 'abc',
        appName: 'abc',
      }}
    >
      <Provider store={init().getStore()}>
        <MemoryRouter>
          <ApolloProvider client={client}>
            <Reports />
          </ApolloProvider>
        </MemoryRouter>
      </Provider>
    </FlagProvider>
  );
};

const profilesResp = Object.assign([], fixtures['profiles']['edges']);

describe('Reports table tests', () => {
  beforeEach(() => {
    featureFlagsInterceptors.apiV2Disabled();
    cy.intercept('**/graphql', {
      statusCode: 200,
      body: {
        data: fixtures,
      },
    });
    mountComponent();
  });
  describe('defaults', () => {
    it('Reports table renders', () => {
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
      cy.get('td[data-label="Policy"] a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(ascendingSorted[index]);
      });

      cy.get('th[data-label="Policy"] > button').click();

      cy.get('th[data-label="Policy"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.get('td[data-label="Policy"] a').each((item, index) => {
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

  describe.skip('Filter table', () => {
    it('Search by non existing name', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'button').click();
      cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
      cy.get('div[class="pf-v5-c-empty-state"]').contains(
        'No matching reports found'
      );
    });
    it('Find report by Name', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'button').click();
      cy.ouiaId('ConditionalFilter', 'input').type('PCI-DSS v3.2.1 Control');
      cy.get('td[data-label="Policy"] a')
        .should('have.length', 1)
        .first()
        .contains('PCI-DSS v3.2.1 Control');
    });
    it('Find report by Policy type', () => {
      cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy type', 'button').click();
      cy.ouiaId('Filter by policy type', 'div').click();
      cy.get('input[id$="Example Server Profile"]').click();
      cy.get('td[data-label="Policy"] a')
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

  // TODO pf/react-core 5.4.0 seems to have broken `ouiaId`s
  describe.skip('Manage columns', () => {
    it('Manage reports columns', () => {
      cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaType('PF5/DropdownItem', 'li').first().find('button').click();
      cy.get('input[checked]')
        .not('[disabled]')
        .each(($checkbox) => {
          cy.wrap($checkbox).click();
        });
      cy.ouiaId('Save', 'button').click();

      cy.get('th[data-label="Operating system"]').should('not.exist');
      cy.get('th[data-label="Systems meeting compliance"]').should('not.exist');

      cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaType('PF5/DropdownItem', 'li').first().find('button').click();
      cy.get('button').contains('Select all').click();
      cy.ouiaId('Save', 'button').click();

      cy.get('th[data-label="Operating system"]').should('exist');
      cy.get('th[data-label="Systems meeting compliance"]').should('exist');
    });
  });

  it('expect to render emptystate', () => {
    cy.intercept('**/graphql', {
      statusCode: 200,
      body: {
        data: fixtures,
      },
    });
    cy.get('table').should('have.length', 1);
  });
});
