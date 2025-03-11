import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import Details from '../SmartComponents/SystemDetails/Details';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());

  return (
    <RBACProvider appName="compliance">
      <Provider store={store.current}>
        <Details {...props} />
      </Provider>
    </RBACProvider>
  );
};

export default ComplianceDetails;
