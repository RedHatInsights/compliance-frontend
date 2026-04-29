import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import Details from '../SmartComponents/SystemDetails/Details';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { KESSEL_API_BASE_URL } from '@/constants';
import { useFlagsStatus } from '@unleash/proxy-client-react';
import { Bullseye, Spinner } from '@patternfly/react-core';

const queryClient = new QueryClient();

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const { flagsReady } = useFlagsStatus();

  if (!flagsReady) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isKesselEnabled ? (
        <AccessCheck.Provider
          baseUrl={window.location.origin}
          apiPath={KESSEL_API_BASE_URL}
        >
          <Provider store={store.current}>
            <Details {...props} />
          </Provider>
        </AccessCheck.Provider>
      ) : (
        <RBACProvider appName="compliance">
          <Provider store={store.current}>
            <Details {...props} />
          </Provider>
        </RBACProvider>
      )}
    </QueryClientProvider>
  );
};

export default ComplianceDetails;
