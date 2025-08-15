import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import Details from '../SmartComponents/SystemDetails/Details';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());

  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider appName="compliance">
        <Provider store={store.current}>
          <Details {...props} />
        </Provider>
      </RBACProvider>
    </QueryClientProvider>
  );
};

export default ComplianceDetails;
