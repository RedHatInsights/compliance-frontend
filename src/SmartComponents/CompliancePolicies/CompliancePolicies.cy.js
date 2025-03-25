import CompliancePolicies from './CompliancePolicies';
import { init } from 'Store';
import { buildPolicies } from '../../__factories__/policies';
import { interceptBatchRequest } from '../../../cypress/utils/interceptors';
import getRequestParams from '../../../cypress/utils/requestParams';

const mountComponent = () => {
  cy.mountWithContext(CompliancePolicies, { store: init().getStore() });
};

const policiesData = buildPolicies(13);
const policiesDataFirstBatch = policiesData.slice(0, 10);

const policiesResp = {
  data: policiesDataFirstBatch,
  meta: {
    total: policiesData.length,
    offset: 0,
    limit: 10,
  },
};

describe('Policies table tests API V2', () => {
  beforeEach(() => {
    cy.intercept(`/api/compliance/v2/policies?${getRequestParams()}`, {
      statusCode: 200,
      body: policiesResp,
    }).as('getPolicies');

    // Total endpoint
    cy.intercept('/api/compliance/v2/policies?limit=1', {
      statusCode: 200,
      body: policiesResp,
    }).as('getPoliciesTotal');

    mountComponent();
  });
  describe('defaults', () => {
    it('The table renders with data', () => {
      cy.wait('@getPolicies');
      cy.get('table').should('have.length', 1);

      const policyNames = policiesResp.data.map((item) => item.title);

      cy.get('td[data-label="Name"] > div > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(policyNames[index]);
      });
    });
    it('Shows correct total item count', () => {
      cy.wait('@getPolicies');
      cy.ouiaType('PF5/Pagination', 'div')
        .first()
        .get('.pf-v5-c-menu-toggle__text')
        .find('b')
        .eq(1)
        .should('have.text', policiesData.length);
    });
  });

  describe('Table column sorting', () => {
    it('Sort by Name', () => {
      cy.wait('@getPolicies');
      cy.get('th[data-label="Name"]')
        .invoke('attr', 'aria-sort')
        .should('eq', 'ascending');

      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'title:desc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Name', 'descending');
      cy.checkAPISorting('@getSortedPolicies', 'title', 'desc');
    });

    it('Sort by Operating system', () => {
      cy.wait('@getPolicies');

      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'os_major_version:asc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Operating system', 'ascending');
      cy.checkAPISorting('@getSortedPolicies', 'os_major_version', 'asc');

      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'os_major_version:desc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Operating system', 'descending');
      cy.checkAPISorting('@getSortedPolicies', 'os_major_version', 'desc');
    });

    it('Sort by Systems count', () => {
      cy.wait('@getPolicies');
      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'total_system_count:asc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Systems', 'ascending');
      cy.checkAPISorting('@getSortedPolicies', 'total_system_count', 'asc');

      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'total_system_count:desc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Systems', 'descending');
      cy.checkAPISorting('@getSortedPolicies', 'total_system_count', 'desc');
    });

    it('Sort by Business objective', () => {
      cy.wait('@getPolicies');
      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'business_objective:asc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Business objective', 'ascending');
      cy.checkAPISorting('@getSortedPolicies', 'business_objective', 'asc');

      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'business_objective:desc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Business objective', 'descending');
      cy.checkAPISorting('@getSortedPolicies', 'business_objective', 'desc');
    });

    it('Sort by Threshold', () => {
      cy.wait('@getPolicies');
      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'compliance_threshold:asc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Compliance threshold', 'ascending');
      cy.checkAPISorting('@getSortedPolicies', 'compliance_threshold', 'asc');

      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          sortBy: 'compliance_threshold:desc',
        })}`,
        {
          statusCode: 200,
          body: policiesResp,
        }
      ).as('getSortedPolicies');

      cy.sortTableColumn('Compliance threshold', 'descending');
      cy.checkAPISorting('@getSortedPolicies', 'compliance_threshold', 'desc');
    });
  });

  describe('Table pagination', () => {
    it('Set per page elements', () => {
      cy.wait('@getPolicies');
      cy.ouiaType('PF5/Toolbar', 'div')
        .ouiaType('PF5/Pagination', 'div')
        .ouiaType('PF5/MenuToggle', 'button')
        .should('contain', `1 - 10 of ${policiesData.length}`);

      const perPageOptions = [20, 50, 100];
      perPageOptions.forEach((perPageValue) => {
        cy.intercept(
          `/api/compliance/v2/policies?${getRequestParams({
            limit: perPageValue,
          })}`,
          {
            statusCode: 200,
            body: {
              data: policiesData.slice(0, perPageValue),
              meta: {
                limit: perPageValue,
                total: policiesData.length,
              },
            },
          }
        ).as('getPaginatedPolicies');

        cy.ouiaType('PF5/Toolbar', 'div')
          .ouiaType('PF5/Pagination', 'div')
          .ouiaType('PF5/MenuToggle', 'button')
          .click();

        cy.get('button[role="menuitem"]')
          .contains(`${perPageValue} per page`)
          .click();

        cy.wait('@getPaginatedPolicies')
          .its('request.url')
          .should('contain', `limit=${perPageValue}`);

        cy.get('table')
          .find('tbody')
          .find('tr')
          .should(
            'have.length',
            policiesData.length > perPageValue
              ? perPageValue
              : policiesData.length
          );
      });
    });
  });

  describe('Export download', () => {
    beforeEach(() => {
      cy.wait('@getPolicies');
      interceptBatchRequest(
        'policies',
        0,
        policiesData.slice(0, 10),
        policiesData.length
      );
      interceptBatchRequest(
        'policies',
        10,
        policiesData.slice(10, 20),
        policiesData.length
      );
    });
    it('CSV report download and content', () => {
      cy.get('button[aria-label="Export"]').click();
      cy.get('button[aria-label="Export to CSV"]').click();

      cy.wait('@policiesBatch1');
      cy.wait('@policiesBatch2');

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
      cy.wait('@policiesBatch1');
      cy.wait('@policiesBatch2');

      // validate json content
      cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
        function (result) {
          let res = result.stdout;
          cy.readFile('cypress/downloads/' + res)
            .should('not.be.empty')
            .then((fileContent) => {
              assert(
                fileContent.length === policiesData.length,
                'Length of policies is different'
              );
              fileContent.forEach((item) => {
                policiesData.forEach((policy) => {
                  if (policy.title == item['name']) {
                    assert(
                      `RHEL ${policy.os_major_version}` ===
                        item['operatingSystem'],
                      `OS comparation failed: ${policy.os_major_version} !== ${item['operatingSystem']}`
                    );
                    assert(
                      policy.total_system_count === item['systems'],
                      `Systems comparation failed: ${policy.total_system_count} !== ${item['systems']}`
                    );
                    const businessObj = policy.business_objective
                      ? policy.business_objective
                      : '--';
                    assert(
                      businessObj === item['businessObjective'],
                      `BO comparation failed: ${businessObj} !== ${item['businessObjective']}`
                    );
                    assert(
                      `${policy.compliance_threshold}%` ==
                        item['complianceThreshold'],
                      `Threshold comparation failed: ${policy.compliance_threshold} !== ${item['complianceThreshold']}`
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
    it('Find report by Name', () => {
      cy.wait('@getPolicies');
      const policyTitle = policiesData[0].title;
      cy.intercept(
        `/api/compliance/v2/policies?${getRequestParams({
          filter: `title ~ "${policyTitle}"`,
        })}`,
        {
          statusCode: 200,
          body: {
            data: [policiesData[0]],
            meta: {
              total: 1,
            },
          },
        }
      ).as('getFilteredPolicies');

      cy.ouiaId('ConditionalFilter', 'input').type(policyTitle, { delay: 0 });
      cy.wait('@getFilteredPolicies')
        .its('request.url')
        .should(
          'contain',
          new URLSearchParams({
            filter: `title ~ "${policyTitle}"`,
          }).toString()
        );
      cy.get('td[data-label="Name"]')
        .should('have.length', 1)
        .first()
        .contains(policyTitle);
    });
  });

  describe('Manage columns', () => {
    it('Manage reports columns', () => {
      // TODO pf/react-core 5.4.0 seems to have broken `ouiaId`s
      // cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="kebab dropdown toggle"]')
        .click();

      cy.ouiaType('PF5/DropdownItem', 'li')
        .contains('Manage columns')
        .should('be.visible')
        .click();
      cy.get('input[checked]')
        .not('[disabled]')
        .each(($checkbox) => {
          cy.wrap($checkbox).click();
        });
      cy.ouiaId('ColumnManagementModal-save-button', 'button').click();

      cy.get('th[data-label="Operating system"]').should('not.exist');
      cy.get('th[data-label="Systems"]').should('not.exist');
      cy.get('th[data-label="Business objective"]').should('not.exist');
      cy.get('th[data-label="Compliance threshold"]').should('not.exist');

      //cy.ouiaId('BulkActionsToggle', 'button').click();
      cy.ouiaId('PrimaryToolbar', 'div')
        .get('button[aria-label="kebab dropdown toggle"]')
        .click();

      cy.ouiaType('PF5/DropdownItem', 'li')
        .contains('Manage columns')
        .should('be.visible')
        .click();
      cy.get('button').contains('Select all').click();
      cy.ouiaId('ColumnManagementModal-save-button', 'button').click();

      cy.get('th[data-label="Operating system"]').should('exist');
      cy.get('th[data-label="Systems"]').should('exist');
      cy.get('th[data-label="Business objective"]').should('exist');
      cy.get('th[data-label="Compliance threshold"]').should('exist');
    });
  });

  it('expect to render emptystate', () => {
    cy.intercept('api/compliance/v2/policies*', {
      statusCode: 200,
      body: { data: [], meta: { total: 0 } },
    }).as('getPolicies');
    cy.contains('No policies');
  });
});
