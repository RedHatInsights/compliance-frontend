import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { COMPLIANCE_API_ROOT } from './constants';
import { IntlProvider } from 'react-intl';

const client = new ApolloClient({
    link: new HttpLink({ credentials: 'include', uri: COMPLIANCE_API_ROOT + '/graphql' }),
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
        <Provider store={ init().getStore() }>
            <IntlProvider locale={navigator.language}>
                <Router basename={`${release}${pathName[0]}/${pathName[1]}`}>
                    <ApolloProvider client={client}>
                        <App />
                    </ApolloProvider>
                </Router>
            </IntlProvider>
        </Provider>,
        document.getElementById('root')
    );
});
