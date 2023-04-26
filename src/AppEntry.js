import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Provider } from 'react-redux';
import { init } from 'Store';
import App from './App';

import { COMPLIANCE_API_ROOT } from '@/constants';

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
    uri: COMPLIANCE_API_ROOT + '/graphql',
  }),
  cache: new InMemoryCache(),
});

const AppEntry = ({ logger }) => (
  <Provider store={init(logger).getStore()}>
    <IntlProvider locale={navigator.language}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </IntlProvider>
  </Provider>
);

AppEntry.propTypes = {
  logger: PropTypes.any,
};

export default AppEntry;
