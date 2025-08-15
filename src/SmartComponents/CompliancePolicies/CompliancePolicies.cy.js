/* eslint-disable testing-library/no-node-access */
import CompliancePolicies from './CompliancePolicies';
import { init } from 'Store';
import { buildPolicies } from '../../__factories__/policies';
import { interceptBatchRequest } from '../../../cypress/utils/interceptors';
import getRequestParams from '../../../cypress/utils/requestParams';
import {
  itemsPerPage,
  changePagination,
} from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/CypressUtils/PaginationUtils';

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
  describe('Table with content', () => {
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
        cy.get('table').should('have.length', 1);

        const policyNames = policiesResp.data.map((item) => item.title);

        cy.get('td[data-label="Name"] > div > div > a').each((item, index) => {
          expect(Cypress.$(item).text()).to.eq(policyNames[index]);
        });
      });
    });

    describe('Table column sorting', () => {
      const columnsToTest = [
        { label: 'Name', apiKey: 'title' },
        { label: 'Operating system', apiKey: 'os_major_version' },
        { label: 'Systems', apiKey: 'total_system_count' },
        { label: 'Business objective', apiKey: 'business_objective' },
        { label: 'Compliance threshold', apiKey: 'compliance_threshold' },
      ];

      const checkSorting = (label, apiKey, direction) => {
        cy.intercept(
          `/api/compliance/v2/policies?${getRequestParams({
            sortBy: `${apiKey}:${direction}`,
          })}`,
          {
            statusCode: 200,
            body: policiesResp,
          },
        ).as('getSortedPolicies');

        cy.sortTableColumn(
          label,
          direction === 'asc' ? 'ascending' : 'descending',
        );
        cy.checkAPISorting('@getSortedPolicies', apiKey, direction);
      };

      columnsToTest.forEach(({ label, apiKey }) => {
        it(`Sort by ${label}`, () => {
          if (label === 'Name') {
            cy.get('th[data-label="Name"]')
              .invoke('attr', 'aria-sort')
              .should('eq', 'ascending');
          } else {
            checkSorting(label, apiKey, 'asc');
          }
          checkSorting(label, apiKey, 'desc');
        });
      });
    });

    describe('Table pagination', () => {
      it('Set per page elements', () => {
        itemsPerPage(policiesData.length);

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
            },
          ).as('getPaginatedPolicies');

          changePagination(perPageValue);

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
                : policiesData.length,
            );
        });
      });
    });

    describe('Export download', () => {
      beforeEach(() => {
        interceptBatchRequest(
          'policies',
          0,
          policiesData.slice(0, 10),
          policiesData.length,
        );
        interceptBatchRequest(
          'policies',
          10,
          policiesData.slice(10, 20),
          policiesData.length,
        );
      });

      it('CSV report download and content', () => {
        cy.get('button[aria-label="Export"]').click();
        cy.get('button[aria-label="Export to CSV"]').click();

        // check if file downloaded and not empty
        cy.exec(`ls cypress/downloads | grep .csv | sort -n | tail -1`).then(
          function (result) {
            let res = result.stdout;
            cy.readFile('cypress/downloads/' + res).should('not.be.empty');
          },
        );
      });

      it('JSON report download and content', () => {
        cy.get('button[aria-label="Export"]').click();
        cy.get('button[aria-label="Export to JSON"]').click();

        // validate json content
        cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
          function (result) {
            let latestJsonFile = result.stdout;
            cy.readFile('cypress/downloads/' + latestJsonFile)
              .should('not.be.empty')
              .and('have.length', policiesData.length)
              .then((fileContent) => {
                const policiesDataMap = new Map(
                  policiesData.map((policy) => [policy.title, policy]),
                );
                fileContent.forEach((policyFromJSON) => {
                  const foundPolicy = policiesDataMap.get(policyFromJSON.name);
                  expect(foundPolicy).to.exist;
                  const expectedPolicy = {
                    name: foundPolicy.title,
                    operatingSystem: `RHEL ${foundPolicy.os_major_version}`,
                    systems: foundPolicy.total_system_count,
                    businessObjective: foundPolicy.business_objective || '--',
                    complianceThreshold: `${foundPolicy.compliance_threshold}%`,
                  };
                  expect(policyFromJSON).to.deep.equal(expectedPolicy);
                });
              });
          },
        );
      });
    });

    describe('Filter table', () => {
      it('Find report by Name', () => {
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
          },
        ).as('getFilteredPolicies');

        cy.ouiaId('ConditionalFilter', 'input').type(policyTitle, { delay: 0 });
        cy.wait('@getFilteredPolicies')
          .its('request.url')
          .should(
            'contain',
            new URLSearchParams({
              filter: `title ~ "${policyTitle}"`,
            }).toString(),
          );
        cy.get('td[data-label="Name"]')
          .should('have.length', 1)
          .and('contain.text', policyTitle);
      });
    });

    describe('Manage columns', () => {
      it('Manage reports columns', () => {
        const tableColumns = [
          'Operating system',
          'Systems',
          'Business objective',
          'Compliance threshold',
        ];
        const openManageColumns = () => {
          cy.ouiaId('BulkActionsToggle', 'button').click();
          cy.ouiaType('PF6/DropdownItem', 'li')
            .contains('Manage columns')
            .should('be.visible')
            .click();
        };

        openManageColumns();
        cy.get('input[checked]').not('[disabled]').click({ multiple: true });
        cy.ouiaId('ColumnManagementModal-save-button', 'button').click();

        tableColumns.forEach((column) => {
          cy.get(`th[data-label="${column}"]`).should('not.exist');
        });

        openManageColumns();
        cy.get('button').contains('Select all').click();
        cy.ouiaId('ColumnManagementModal-save-button', 'button').click();

        tableColumns.forEach((column) => {
          cy.get(`th[data-label="${column}"]`).should('exist');
        });
      });
    });
  });

  describe('Empty table', () => {
    beforeEach(() => {
      cy.intercept('api/compliance/v2/policies*', {
        statusCode: 200,
        body: { data: [], meta: { total: 0 } },
      }).as('getPolicies');
      mountComponent();
    });
    it('expect to render emptystate', () => {
      cy.contains('No policies');
      cy.contains('Create new policy');
    });
  });
});
