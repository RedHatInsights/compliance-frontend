import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { FlagProvider } from '@unleash/proxy-client-react';
import { Page } from '@patternfly/react-core';

import { init } from 'Store';
import App from '../App';
import { staticUnleashFlagProviderConfig } from '@/config/staticUnleashFlagProviderConfig';
import IopBridge from './IopBridge';

const IopAppEntry = ({ environment = 'production' }) => (
  <Page className="iop-compliance-page" sidebar={null}>
    <HashRouter>
      <IopBridge>
        <FlagProvider config={staticUnleashFlagProviderConfig}>
          <Provider store={init(environment).getStore()}>
            <App />
          </Provider>
        </FlagProvider>
      </IopBridge>
    </HashRouter>
  </Page>
);

IopAppEntry.propTypes = {
  environment: PropTypes.string,
};

export default IopAppEntry;
