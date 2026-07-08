import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Page } from '@patternfly/react-core';

import { init } from 'Store';
import App from '../App';
import IopBridge from './IopBridge';
import IopFlagProvider from './IopFlagProvider';

const IopAppEntry = ({ environment = 'production' }) => (
  <Page className="iop-compliance-page" sidebar={null}>
    <HashRouter>
      <IopBridge>
        <IopFlagProvider>
          <Provider store={init(environment).getStore()}>
            <App />
          </Provider>
        </IopFlagProvider>
      </IopBridge>
    </HashRouter>
  </Page>
);

IopAppEntry.propTypes = {
  environment: PropTypes.string,
};

export default IopAppEntry;
