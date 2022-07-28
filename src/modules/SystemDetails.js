import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import ComplianceDetails from '../SmartComponents/SystemDetails/components/ComplianceDetails';
import { init } from 'Store';
import apolloClient from '@/Utilities/apolloClient';

const SystemDetails = (props) => (
  <Provider store={init().getStore()}>
    <ApolloProvider client={apolloClient}>
      <ComplianceDetails {...props} />
    </ApolloProvider>
  </Provider>
);

export default SystemDetails;
