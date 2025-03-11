// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import React from 'react';
import { mount } from '@cypress/react18';
import FlagProvider from '@unleash/proxy-client-react';
import { COMPLIANCE_API_ROOT } from '@/constants';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';

Cypress.Commands.add(
  'ouiaId',
  { prevSubject: 'optional' },
  (subject, item, el = '') => {
    const attr = `${el}[data-ouia-component-id="${item}"]`;
    return subject ? cy.wrap(subject).find(attr) : cy.get(attr);
  }
);

Cypress.Commands.add(
  'ouiaType',
  { prevSubject: 'optional' },
  (subject, item, el = '') => {
    const attr = `${el}[data-ouia-component-type="${item}"]`;
    return subject ? cy.wrap(subject).find(attr) : cy.get(attr);
  }
);

Cypress.Commands.add(
  'mountWithContext',
  (Component, renderOptions = {}, props) => {
    return mount(
      <FlagProvider
        config={{
          url: 'http://localhost:8002/feature_flags',
          clientKey: 'abc',
          appName: 'abc',
        }}
      >
          <TestWrapper renderOptions={renderOptions}>
            <Component {...props} />
          </TestWrapper>

      </FlagProvider>
    );
  }
);

Cypress.Commands.add('checkAPISorting', (endpoint, sortKey, direction) => {
  cy.wait(endpoint)
    .its('request.url')
    .should(
      'include',
      `sort_by=${encodeURIComponent(`${sortKey}:${direction}`)}`
    );
});

Cypress.Commands.add('checkAPIFiltering', (endpoint, filterKey, value) => {
  cy.wait(endpoint)
    .its('request.url')
    .should(
      'include',
      `filter=${encodeURIComponent(`${filterKey} ~ ${value}`)}`
    );
});

Cypress.Commands.add('sortTableColumn', (colName, order) => {
  cy.get(`th[data-label="${colName}"] > button`).click();
  cy.get(`th[data-label="${colName}"]`)
    .invoke('attr', 'aria-sort')
    .should('eq', order);
})
