import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { FlagProvider } from '@unleash/proxy-client-react';

import { init } from 'Store';
import App from '../App';
import { staticUnleashFlagProviderConfig } from '@/config/staticUnleashFlagProviderConfig';
import IopBridge from './IopBridge';

const IopAppEntry = ({ environment = 'production' }) => (
  <HashRouter>
    <IopBridge>
      <FlagProvider config={staticUnleashFlagProviderConfig}>
        <Provider store={init(environment).getStore()}>
          <App />
        </Provider>
      </FlagProvider>
    </IopBridge>
  </HashRouter>
);

IopAppEntry.propTypes = {
  environment: PropTypes.string,
};

export default IopAppEntry;
