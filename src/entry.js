import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { API_WS_ROOT } from './constants';

ReactDOM.render(
    <Provider store={ init().getStore() }>
        <Router basename='/insights/platform/compliance'>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
