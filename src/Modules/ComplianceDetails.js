import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import Details from '../SmartComponents/SystemDetails/Details';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import useUnleashFlagsReady from 'Utilities/hooks/useUnleashFlagsReady';
import { KESSEL_API_BASE_URL } from '@/constants';
import { getAppConfig } from '@/config/appConfig';
import { Bullseye, Spinner } from '@patternfly/react-core';

const queryClient = new QueryClient();

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const flagsReady = useUnleashFlagsReady();
  const remediationsEnabled =
    props.remediationsEnabled !== false && getAppConfig().features.remediations;

  if (!flagsReady) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  const details = (
    <Details {...props} remediationsEnabled={remediationsEnabled} />
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isKesselEnabled ? (
        <AccessCheck.Provider
          baseUrl={window.location.origin}
          apiPath={KESSEL_API_BASE_URL}
        >
          <Provider store={store.current}>{details}</Provider>
        </AccessCheck.Provider>
      ) : (
        <RBACProvider appName="compliance">
          <Provider store={store.current}>{details}</Provider>
        </RBACProvider>
      )}
    </QueryClientProvider>
  );
};

ComplianceDetails.propTypes = {
  remediationsEnabled: PropTypes.bool,
};

export default ComplianceDetails;
