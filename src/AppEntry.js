import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { Provider } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';
import axios from 'axios';
import { StateView, StateViewPart } from 'PresentationalComponents';
import { init } from 'Store';
import App from './App';

import { COMPLIANCE_API_ROOT, INVENTORY_TOTAL_FETCH_URL } from '@/constants';

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
    uri: COMPLIANCE_API_ROOT + '/graphql',
  }),
  cache: new InMemoryCache(),
});

const AppEntry = ({ logger }) => {
  const [loading, setLoading] = useState(true);
  const [hasSystems, setHasSystems] = useState();

  useEffect(() => {
    try {
      axios.get(INVENTORY_TOTAL_FETCH_URL).then(({ data }) => {
        setLoading(false);
        setHasSystems(data.total > 0);
      });
    } catch (e) {
      console.log(e);
    }
  }, [hasSystems]);

  return (
    <StateView stateValues={{ hasSystems, loading }}>
      <StateViewPart stateKey="loading">
        <Bullseye>
          <Spinner />
        </Bullseye>
      </StateViewPart>
      <StateViewPart stateKey="hasSystems">
        {hasSystems ? (
          <Provider store={init(logger).getStore()}>
            <ApolloProvider client={client}>
              <App />
            </ApolloProvider>
          </Provider>
        ) : (
          <AsyncComponent
            appId="compliance_zero_state"
            appName="dashboard"
            module="./AppZeroState"
            scope="dashboard"
            ErrorComponent={<ErrorState />}
            app="Compliance"
          />
        )}
      </StateViewPart>
    </StateView>
  );
};

AppEntry.propTypes = {
  logger: PropTypes.any,
};

export default AppEntry;
