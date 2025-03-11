import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { init } from 'Store';
import App from './App';

const AppEntry = ({ environment = 'production' }) => (
  <Provider store={init(environment).getStore()}>
    <App />
  </Provider>
);

AppEntry.propTypes = {
  environment: PropTypes.bool,
};

export default AppEntry;
