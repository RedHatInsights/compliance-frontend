import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { FlagProvider } from '@unleash/proxy-client-react';
import { init } from 'Store';
import App from './App';
import { getAppConfig } from '@/config/appConfig';
import { staticUnleashFlagProviderConfig } from '@/config/staticUnleashFlagProviderConfig';

const AppEntry = ({ environment = 'production' }) => {
  const appConfig = getAppConfig();
  const inner = (
    <Provider store={init(environment).getStore()}>
      <App />
    </Provider>
  );

  if (!appConfig.features.unleash) {
    return (
      <FlagProvider config={staticUnleashFlagProviderConfig}>
        {inner}
      </FlagProvider>
    );
  }

  return inner;
};

AppEntry.propTypes = {
  environment: PropTypes.bool,
};

export default AppEntry;
