import Reports from './Reports';
import { init } from 'Store';
import { featureFlagsInterceptors } from '../../../cypress/utils/interceptors';
import { buildReports } from '../../__factories__/reports';
import { interceptBatchRequest } from '../../../cypress/utils/interceptors';

const mountComponent = () => {
  cy.mountWithContext(Reports, { store: init().getStore() });
};

const reportsData = buildReports(21);
const reportsDataFirstBatch = reportsData.slice(0, 10);
const reportsResp = {
  data: reportsDataFirstBatch,
  meta: {
    total: reportsData.length,
    offset: 0,
    limit: 10,
  },
};

function getRequestParams({
  limit = '10',
  offset = '0',
  filter = '(with_reported_systems = true)',
  sortBy = 'title:asc',
} = {}) {
  return new URLSearchParams({
    limit,
    offset,
    sort_by: sortBy,
    filter,
  }).toString();
}

describe('Reports table tests', () => {
  beforeEach(() => {
    featureFlagsInterceptors.apiV2Enabled();

    cy.intercept('/api/compliance/v2/reports/os_versions', {
      statusCode: 200,
      body: [6, 7, 8, 9],
    }).as('getOsVersions');

    cy.intercept(`/api/compliance/v2/reports?${getRequestParams()}`, {
      statusCode: 200,
      body: reportsResp,
    }).as('getReports');

    cy.intercept(
      '/api/compliance/v2/reports?limit=1&filter=with_reported_systems%3Dtrue',
      {
        statusCode: 200,
        body: reportsResp,
      }
    ).as('getReportsTotal');

    mountComponent();
  });
  describe('defaults', () => {
    it('Reports table renders', () => {
      cy.wait('@getReports');
      cy.get('table').should('have.length', 1);
    });
  });

  describe('Table column sorting', () => {
    it('Sort by Name', () => {
      cy.wait('@getReports');
      cy.get('th[data-label="Policy"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          sortBy: 'title:desc',
        })}`,
        {
          statusCode: 200,
          body: reportsResp,
        }
      ).as('getSortedReports');

      cy.get('th[data-label="Policy"] > button').click();

      cy.wait('@getSortedReports')
        .its('request.url')
        .should('contain', 'sort_by=title%3Adesc');
      cy.get('th[data-label="Policy"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
    });

    it('Sort by Operating system', () => {
      cy.wait('@getReports');

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          sortBy: 'os_major_version:asc',
        })}`,
        {
          statusCode: 200,
          body: reportsResp,
        }
      ).as('getSortedReports');

      cy.get('th[data-label="Operating system"] > button').click();
      cy.get('th[data-label="Operating system"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');

      cy.wait('@getSortedReports')
        .its('request.url')
        .should('contain', 'sort_by=os_major_version%3Aasc');

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          sortBy: 'os_major_version:desc',
        })}`,
        {
          statusCode: 200,
          body: reportsResp,
        }
      ).as('getSortedReports');

      cy.get('th[data-label="Operating system"] > button').click();
      cy.get('th[data-label="Operating system"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.wait('@getSortedReports')
        .its('request.url')
        .should('contain', 'sort_by=os_major_version%3Adesc');
    });

    it('Sort by Systems meeting compliance', () => {
      cy.wait('@getReports');
      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          sortBy: 'percent_compliant:asc',
        })}`,
        {
          statusCode: 200,
          body: reportsResp,
        }
      ).as('getSortedReports');

      cy.get('th[data-label="Systems meeting compliance"] > button').click();
      cy.get('th[data-label="Systems meeting compliance"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');
      cy.wait('@getSortedReports')
        .its('request.url')
        .should('contain', 'sort_by=percent_compliant%3Aasc');

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          sortBy: 'percent_compliant:desc',
        })}`,
        {
          statusCode: 200,
          body: reportsResp,
        }
      ).as('getSortedReports');

      cy.get('th[data-label="Systems meeting compliance"] > button').click();
      cy.get('th[data-label="Systems meeting compliance"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'descending');
      cy.wait('@getSortedReports')
        .its('request.url')
        .should('contain', 'sort_by=percent_compliant%3Adesc');
    });
  });

  describe('table pagination', () => {
    it('Set per page elements', () => {
      cy.wait('@getReports');
      cy.ouiaType('PF5/Toolbar', 'div')
        .ouiaType('PF5/Pagination', 'div')
        .ouiaType('PF5/MenuToggle', 'button')
        .should('contain', `1 - 10 of ${reportsData.length}`);

      const perPageOptions = [20, 50, 100];
      perPageOptions.forEach((perPageValue) => {
        cy.intercept(
          `/api/compliance/v2/reports?${getRequestParams({
            limit: perPageValue,
          })}`,
          {
            statusCode: 200,
            body: {
              data: reportsData.slice(0, perPageValue),
              meta: {
                limit: perPageValue,
                total: reportsData.length,
              },
            },
          }
        ).as('getPaginatedReports');

        cy.ouiaType('PF5/Toolbar', 'div')
          .ouiaType('PF5/Pagination', 'div')
          .ouiaType('PF5/MenuToggle', 'button')
          .click();

        cy.get('button[role="menuitem"]')
          .contains(`${perPageValue} per page`)
          .click();

        cy.wait('@getPaginatedReports')
          .its('request.url')
          .should('contain', `limit=${perPageValue}`);

        cy.get('table')
          .find('tbody')
          .find('tr')
          .should(
            'have.length',
            reportsData.length > perPageValue
              ? perPageValue
              : reportsData.length
          );
      });
    });
  });

  describe('Reports download', () => {
    beforeEach(() => {
      cy.wait('@getReports');
      interceptBatchRequest(
        'reports',
        0,
        reportsData.slice(0, 10),
        reportsData.length
      );
      interceptBatchRequest(
        'reports',
        10,
        reportsData.slice(10, 20),
        reportsData.length
      );
      interceptBatchRequest(
        'reports',
        20,
        reportsData.slice(20, 30),
        reportsData.length
      );
    });
    it('CSV report download and content', () => {
      cy.get('button[aria-label="Export"]').click();
      cy.get('button[aria-label="Export to CSV"]').click();

      cy.wait('@reportsBatch1');
      cy.wait('@reportsBatch2');
      cy.wait('@reportsBatch3');

      // check if file downloaded and not empty
      cy.exec(`ls cypress/downloads | grep .csv | sort -n | tail -1`).then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res).should('not.be.empty');
        }
      );
    });
    it('JSON report download and content', () => {
      cy.get('button[aria-label="Export"]').click();
      cy.get('button[aria-label="Export to JSON"]').click();
      cy.wait('@reportsBatch1');
      cy.wait('@reportsBatch2');
      cy.wait('@reportsBatch3');

      // validate json content
      cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res)
            .should('not.be.empty')
            .then((fileContent) => {
              assert(
                fileContent.length === reportsData.length,
                'Length of profiles is different'
              );
              fileContent.forEach((item) => {
                reportsData.forEach((report) => {
                  if (report.title == item['policy']) {
                    assert(
                      item['operatingSystem'].includes(report.os_major_version),
                      `Operating system values are not equal: JSON has ${item['operatingSystem']} value but table has ${report.os_major_version}`
                    );
                    let systemMeetingCompliance = `${report.compliant_system_count} of ${report.reported_system_count} systems`;
                    let unsupportedCount = report.unsupported_system_count;
                    if (unsupportedCount != 0) {
                      systemMeetingCompliance =
                        systemMeetingCompliance +
                        ` | ${unsupportedCount} unsupported`;
                    }
                    assert(
                      item['systemsMeetingCompliance'] ===
                        systemMeetingCompliance,
                      `Systems meeting compliance values are not equal: JSON has ${item['systemsMeetingCompliance']} value but json has ${report.compliant_system_count}`
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
    it.skip('Search by non existing name', () => {
      // No matching results found is returned, table bug
      cy.wait('@getReports');

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          filter: '(with_reported_systems = true) AND title ~ "foo bar"',
        })}`,
        {
          statusCode: 200,
          body: {
            data: [],
            meta: {
              total: 0,
            },
          },
        }
      ).as('getFilteredReports');

      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="Conditional filter toggle"]')
        .click();
      // cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'li').click();
      cy.ouiaId('ConditionalFilter', 'input').type('foo bar', { delay: 0 });
      cy.wait('@getFilteredReports')
        .its('request.url')
        .should(
          'contain',
          new URLSearchParams({
            filter: '(with_reported_systems = true) AND title ~ "foo bar"',
          }).toString()
        );

      cy.get('div[class="pf-v5-c-empty-state"]').contains(
        'No matching reports found'
      );
    });
    it('Find report by Name', () => {
      cy.wait('@getReports');
      const reportTitle = reportsData[0].title;
      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          filter: `(with_reported_systems = true) AND title ~ "${reportTitle}"`,
        })}`,
        {
          statusCode: 200,
          body: {
            data: [reportsData[0]],
            meta: {
              total: 1,
            },
          },
        }
      ).as('getFilteredReports');

      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="Conditional filter toggle"]')
        .click();
      // cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'li').click();
      cy.ouiaId('ConditionalFilter', 'input').type(reportTitle, { delay: 0 });
      cy.wait('@getFilteredReports')
        .its('request.url')
        .should(
          'contain',
          new URLSearchParams({
            filter: `(with_reported_systems = true) AND title ~ "${reportTitle}"`,
          }).toString()
        );
      cy.get('td[data-label="Policy"] a')
        .should('have.length', 1)
        .first()
        .contains(reportTitle);
    });
    it('Find report by Operating system', () => {
      cy.wait('@getReports');
      const reportOSVersion = reportsData[0].os_major_version;

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          filter: `(with_reported_systems = true) AND os_major_version ^ (${reportOSVersion})`,
        })}`,
        {
          statusCode: 200,
          body: {
            data: [reportsData[0]],
            meta: {
              total: 1,
            },
          },
        }
      ).as('getFilteredReports');

      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="Conditional filter toggle"]')
        .click();
      // cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Operating system', 'li').click();
      // cy.ouiaId('Filter by operating system', 'div').click();
      cy.contains('button', 'Filter by operating system').click();
      cy.contains('span', `RHEL ${reportOSVersion}`)
        .parent()
        .find('input')
        .check();
      cy.wait('@getFilteredReports')
        .its('request.url')
        .should(
          'contain',
          new URLSearchParams({
            filter: `(with_reported_systems = true) AND os_major_version ^ (${reportOSVersion})`,
          }).toString()
        );
      cy.get('td[data-label="Operating system"]')
        .should('have.length', 1)
        .first()
        .contains(`RHEL ${reportOSVersion}`);
    });
    it('Find report by Systems meeting compliance', () => {
      cy.wait('@getReports');

      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          filter: `(with_reported_systems = true) AND ((percent_compliant >= 90 AND percent_compliant <= 100))`,
        })}`,
        {
          statusCode: 200,
          body: {
            data: [reportsData[0]],
            meta: {
              total: 1,
            },
          },
        }
      ).as('getFilteredReports');

      // cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="Conditional filter toggle"]')
        .click();

      cy.ouiaId('Systems meeting compliance', 'li').click();
      cy.contains('button', 'Filter by systems meeting compliance').click();
      cy.contains('span', '90 - 100%').parent().find('input').check();
      cy.wait('@getFilteredReports')
        .its('request.url')
        .should(
          'contain',
          new URLSearchParams({
            filter: `(with_reported_systems = true) AND ((percent_compliant >= 90 AND percent_compliant <= 100))`,
          }).toString()
        );
    });
    it('Clear filters works', () => {
      cy.wait('@getReports');
      cy.intercept(
        `/api/compliance/v2/reports?${getRequestParams({
          filter: '(with_reported_systems = true) AND title ~ "foo bar"',
        })}`,
        {
          statusCode: 200,
          body: {
            data: [],
            meta: {
              total: 0,
            },
          },
        }
      ).as('getFilteredReports');

      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="Conditional filter toggle"]')
        .click();
      // cy.ouiaId('ConditionalFilter', 'button').click();
      cy.ouiaId('Policy name', 'li').click();
      cy.ouiaId('ConditionalFilter', 'input').type('foo bar', { delay: 0 });
      cy.wait('@getFilteredReports')
        .its('request.url')
        .should(
          'contain',
          new URLSearchParams({
            filter: '(with_reported_systems = true) AND title ~ "foo bar"',
          }).toString()
        );

      cy.ouiaId('ClearFilters', 'button').should('be.visible').click();
      cy.wait('@getReports');
      cy.ouiaId('ClearFilters', 'button').should('not.exist');
    });
  });

  describe('Manage columns', () => {
    it('Manage reports columns', () => {
      // TODO pf/react-core 5.4.0 seems to have broken `ouiaId`s
      // cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="kebab dropdown toggle"]')
        .click();

      cy.ouiaType('PF5/DropdownItem', 'li').first().find('button').click();
      cy.get('input[checked]')
        .not('[disabled]')
        .each(($checkbox) => {
          cy.wrap($checkbox).click();
        });
      cy.ouiaId('ColumnManagementModal-save-button', 'button').click();

      cy.get('th[data-label="Operating system"]').should('not.exist');
      cy.get('th[data-label="Systems meeting compliance"]').should('not.exist');

      //cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="kebab dropdown toggle"]')
        .click();

      cy.ouiaType('PF5/DropdownItem', 'li').first().find('button').click();
      cy.get('button').contains('Select all').click();
      cy.ouiaId('ColumnManagementModal-save-button', 'button').click();

      cy.get('th[data-label="Operating system"]').should('exist');
      cy.get('th[data-label="Systems meeting compliance"]').should('exist');
    });
  });

  it('expect to render emptystate', () => {
    cy.intercept('api/compliance/v2/reports*', {
      statusCode: 200,
      body: { data: [], meta: { total: 0 } },
    }).as('getReports');
    cy.intercept('api/compliance/v2/policies*', {
      statusCode: 200,
      body: { data: [], meta: { total: 0 } },
    }).as('getPolicies');
    cy.contains('No policies are reporting');
  });
});
