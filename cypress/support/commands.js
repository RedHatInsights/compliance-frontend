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
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
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
    const client = new ApolloClient({
      link: new HttpLink({
        credentials: 'include',
        uri: COMPLIANCE_API_ROOT + '/graphql',
      }),
      cache: new InMemoryCache(),
    });

    console.log(renderOptions);

    return mount(
      <FlagProvider
        config={{
          url: 'http://localhost:8002/feature_flags',
          clientKey: 'abc',
          appName: 'abc',
        }}
      >
        <ApolloProvider client={client}>
          <TestWrapper renderOptions={renderOptions}>
            <Component {...props} />
          </TestWrapper>
        </ApolloProvider>
      </FlagProvider>
    );
  }
);
