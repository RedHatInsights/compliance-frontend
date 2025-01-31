import CompliancePolicies from './CompliancePolicies';
import { init } from 'Store';
import { featureFlagsInterceptors } from '../../../cypress/utils/interceptors';
import { buildPoliciesV2 } from '../../__factories__/policies';
import Columns from 'PresentationalComponents/PoliciesTable/Columns';
// import * as Filters from 'PresentationalComponents/PoliciesTable/Filters';

const mountComponent = () => {
  cy.mountWithContext(CompliancePolicies, { store: init().getStore() });
};

const fixturesV2 = buildPoliciesV2(13);

const policies_v2 = {
  data: fixturesV2,
  meta: {
    total: fixturesV2.length,
  },
};

describe('Policies table tests', () => {
  beforeEach(() => {
    featureFlagsInterceptors.apiV2Enabled();

    // Ignore total endpoint
    cy.intercept(/\/api\/compliance\/v2\/policies(?!.*limit=1&).*$/, {
      statusCode: 200,
      body: policies_v2,
    }).as('getPolicies');

    // Total endpoint
    cy.intercept('/api/compliance/v2/policies?limit=1', {
      statusCode: 200,
      body: policies_v2,
    }).as('getPoliciesTotal');

    mountComponent();
  });
  describe('defaults', () => {
    it('The table renders with data', () => {
      cy.get('table').should('have.length', 1);

      const policyNames = policies_v2.data.map((item) => item.title);

      cy.get('td[data-label="Name"] > div > div > a').each((item, index) => {
        expect(Cypress.$(item).text()).to.eq(policyNames[index]);
      });
    });
    it('Shows correct item count', () => {
      cy.ouiaType('PF5/Pagination', 'div')
        .first()
        .get('.pf-v5-c-menu-toggle__text')
        .find('b')
        .eq(1)
        .should('have.text', policies_v2.data.length);
    });
  });

  it('Sorts each column', () => {
    const filteredColumns = Columns.filter(
      (el) => !Object.hasOwn(el, 'isShown') || el?.isShown === true
    );
    cy.wrap(filteredColumns).each((col, index) => {
      // Name column
      if (index === 0) {
        // Wait for initial request with default sorting "title:asc"
        cy.checkAPISorting('@getPolicies', col?.sortable, 'asc');
        cy.get('.pf-v5-c-skeleton').should('have.length', 0);

        // Check Desc
        cy.get('th').eq(index).find('button').click();
        cy.checkAPISorting('@getPolicies', col?.sortable, 'desc');

        // Check Asc
        cy.get('th').eq(index).find('button').click();
        cy.checkAPISorting('@getPolicies', col?.sortable, 'asc');
      } else {
        cy.get('.pf-v5-c-skeleton').should('have.length', 0);

        // Check Asc
        cy.get('th').eq(index).find('button').click();
        cy.checkAPISorting('@getPolicies', col?.sortable, 'asc');

        // Check Desc
        cy.get('th').eq(index).find('button').click();
        cy.checkAPISorting('@getPolicies', col?.sortable, 'desc');
      }
    });
  });

  // Debouncing needs to be fixed first
  describe.skip('Filters', () => {
    it('Name filter', () => {
      cy.wait('@getPolicies');
      cy.get('.pf-v5-c-skeleton').should('have.length', 0);

      // cy.get('div[data-input').type('Hello, World')

      // cy.ouiaId('Policy name', 'button').click();
      cy.ouiaId('ConditionalFilter', 'input').type('foobar');
      // cy.checkAPIFiltering('@getPolicies', 'title', 'Foo bar');

      const repeatCount = 10;
      for (let i = 0; i < repeatCount; i++) {
        cy.wait('@getPolicies', {
          requestTimeout: 5000,
        }).then((interception) => {
          const isTargetIntercept = interception.request.url.includes('foobar');
          if (isTargetIntercept) found = true;
        });
      }
      let found = false;
      expect(found, 'Specific intercept not found').to.be.true;
    });
  });
});
