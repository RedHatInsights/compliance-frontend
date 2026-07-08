import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Page } from '@patternfly/react-core';

import { init } from 'Store';
import App from '../App';
import IopBridge from './IopBridge';

const IopAppEntry = ({ environment = 'production' }) => (
  <Page className="iop-compliance-page" sidebar={null}>
    <HashRouter>
      <IopBridge>
        <Provider store={init(environment).getStore()}>
          <App />
        </Provider>
      </IopBridge>
    </HashRouter>
  </Page>
);

IopAppEntry.propTypes = {
  environment: PropTypes.string,
};

export default IopAppEntry;
