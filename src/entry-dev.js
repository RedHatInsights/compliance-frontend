import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import logger from 'redux-logger';
import { COMPLIANCE_API_ROOT } from './constants';

const client = new ApolloClient({
    link: new HttpLink({ uri: COMPLIANCE_API_ROOT + '/graphql' }),
    cache: new InMemoryCache()
});

const pathName = window.location.pathname.split('/');
pathName.shift();

let release = '/';
if (pathName[0] === 'beta') {
    release = `/${pathName.shift()}/`;
}

window.insights.chrome.auth.getUser().then(() => {
    ReactDOM.render(
        <Provider store={ init(logger).getStore() }>
            <Router basename={`${release}${pathName[0]}/${pathName[1]}`}>
                <ApolloProvider client={client}>
                    <App />
                </ApolloProvider>
            </Router>
        </Provider>,

        document.getElementById('root')
    );
});
