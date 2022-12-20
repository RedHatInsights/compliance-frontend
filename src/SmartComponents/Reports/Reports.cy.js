import React from 'react';
import Reports from './Reports';
import { IntlProvider } from 'react-intl';

import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Provider } from 'react-redux';
import { COMPLIANCE_API_ROOT } from '@/constants';
import { init } from 'Store';

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
    Cypress.config('interceptions', {
      data: {
        profiles: {
          edges: [
            {
              node: {
                benchmark: {
                  id: '21231231',
                  version: '0.1.63',
                  __typename: 'Benchmark',
                },
                id: '1',
                refId: '121212',
                name: 'profile1',
                description: 'profile description',
                testResultHostCount: 1,
                osMajorVersion: '7',
                totalHostCount: 2323,
                unsupportedHostCount: 1,
                complianceThreshold: 1,
                compliantHostCount: 1,
                policy: {
                  id: '2323232323',
                  name: 'C2S',
                  __typename: 'Profile',
                },
                businessObjective: {
                  id: '1',
                  title: 'BO 1',
                },
              },
            },
          ],
        },
      },
      error: false,
      loading: false,
    });
    mountComponent();
  });
  describe('defaults', () => {
    it('The Pathways table renders', () => {
      cy.get('table').should('have.length', 1);
    });
  });

  it('expect to render emptystate', () => {
    Cypress.config('interceptions', {
      data: {
        profiles: { edges: [] },
      },
      error: false,
      loading: false,
    });
    cy.get('table').should('have.length', 1);
  });
});
