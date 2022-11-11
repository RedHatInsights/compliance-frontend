import React, { useRef } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { init } from 'Store';
import { FederatedModuleRouter } from '../Utilities/Router';
import Details from '../SmartComponents/SystemDetails/ComplianceDetail';

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());
  const client = useRef(
    new ApolloClient({
      link: new HttpLink({
        uri: '/api/compliance/graphql',
        credentials: 'include',
      }),
      cache: new InMemoryCache(),
    })
  );

  return (
    <FederatedModuleRouter>
      <ApolloProvider client={client.current}>
        <Provider store={store.current}>
          <Details {...props} />
        </Provider>
      </ApolloProvider>
    </FederatedModuleRouter>
  );
};

export default ComplianceDetails;
