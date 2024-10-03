import React from 'react';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
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

const AppEntry = () => (
  <Provider store={init(process?.env?.NODE_ENV || 'production').getStore()}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
);

export default AppEntry;
