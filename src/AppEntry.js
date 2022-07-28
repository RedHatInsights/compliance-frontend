import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { init } from 'Store';
import apolloClient from '@/Utilities/apolloClient';

import App from './App';

const AppEntry = ({ logger }) => {
  const [registry, setRegistry] = useState();

  useEffect(() => {
    setRegistry(init(logger));
  }, []);

  return registry ? (
    <Provider store={registry.getStore()}>
      <IntlProvider locale={navigator.language}>
        <Router basename={getBaseName(window.location.pathname)}>
          <ApolloProvider client={apolloClient}>
            <App />
          </ApolloProvider>
        </Router>
      </IntlProvider>
    </Provider>
  ) : (
    ''
  );
};

AppEntry.propTypes = {
  logger: PropTypes.any,
};

export default AppEntry;
