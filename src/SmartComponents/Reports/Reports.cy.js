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
