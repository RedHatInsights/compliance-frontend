import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { init } from 'Store';
import App from './App';

import { COMPLIANCE_API_ROOT } from '@/constants';

const client = new ApolloClient({
    link: new HttpLink({ credentials: 'include', uri: COMPLIANCE_API_ROOT + '/graphql' }),
    cache: new InMemoryCache()
});

ReactDOM.render(
    <Provider store={ init(logger).getStore() }>
        <IntlProvider locale={ navigator.language }>
            <Router basename={ getBaseName(window.location.pathname) }>
                <ApolloProvider client={ client }>
                    <App />
                </ApolloProvider>
            </Router>
        </IntlProvider>
    </Provider>,
    document.getElementById('root')
);
