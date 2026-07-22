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
import { CenteredSpinner, WithPermission } from 'PresentationalComponents';
import { getAppConfig } from '@/config/appConfig';

const queryClient = new QueryClient();

const TAB_PERMISSIONS = ['compliance:system:read', 'compliance:report:read'];

const ComplianceDetails = (props) => {
  const store = useRef(init().getStore());
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const flagsReady = useUnleashFlagsReady();
  const remediationsEnabled =
    props.remediationsEnabled !== false && getAppConfig().features.remediations;

  if (!flagsReady) {
    return <CenteredSpinner />;
  }

  const details = (
    <Provider store={store.current}>
      <WithPermission requiredPermissions={TAB_PERMISSIONS}>
        <Details {...props} remediationsEnabled={remediationsEnabled}/>
      </WithPermission>
    </Provider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isKesselEnabled ? (
        <AccessCheck.Provider
          baseUrl={window.location.origin}
          apiPath={KESSEL_API_BASE_URL}
        >
          {details}
        </AccessCheck.Provider>
      ) : (
        <RBACProvider appName="compliance">{details}</RBACProvider>
      )}
    </QueryClientProvider>
  );
};

ComplianceDetails.propTypes = {
  remediationsEnabled: PropTypes.bool,
};

export default ComplianceDetails;
