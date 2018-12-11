import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { COMPLIANCE_API_ROOT } from './constants';

const client = new ApolloClient({
    link: new HttpLink({ uri: COMPLIANCE_API_ROOT + '/graphql' }),
    cache: new InMemoryCache()
});

// exposes webpack variable RELEASE
/*global RELEASE:true*/

ReactDOM.render(
    <Provider store={ init().getStore() }>
        <Router basename={ `/${RELEASE}/platform/compliance` }>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
);
