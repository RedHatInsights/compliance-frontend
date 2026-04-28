import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import Details from '../SmartComponents/SystemDetails/Details';
import EnvironmentProvider from 'Utilities/EnvironmentProvider';

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());

  return (
    <EnvironmentProvider>
      <Provider store={store.current}>
        <Details {...props} />
      </Provider>
    </EnvironmentProvider>
  );
};

export default ComplianceDetails;
