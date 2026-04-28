import 'Utilities/ensureReactQueryCompat';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { KESSEL_API_BASE_URL } from '@/constants';
import { EnvironmentContext } from 'Utilities/EnvironmentContext';
import CompliancePermissionsProvider from 'Utilities/CompliancePermissionsProvider';

const queryClient = new QueryClient();

const noop = () => {};
const rejectedPromise = () => Promise.reject(new Error('Not supported'));

function fakeInsightsChrome() {
  if (typeof window === 'undefined') {
    return;
  }

  window.insights = window.insights || {};
  window.insights.chrome = {
    auth: {
      getUser: () =>
        Promise.resolve({
          identity: {
            account_number: '0',
            user: { is_org_admin: false },
          },
        }),
      logout: noop,
      getUserPermissions: () => Promise.resolve([]),
    },
    hideGlobalFilter: noop,
    updateDocumentTitle: noop,
    getUserPermissions: () => Promise.resolve([]),
  };
}

const resolveRuntime = (runtime) => {
  if (runtime === 'hcc' || runtime === 'iop') {
    return runtime;
  }

  if (typeof window === 'undefined') {
    return 'hcc';
  }

  if (window.location.pathname.includes('/foreman_rh_cloud')) {
    return 'iop';
  }

  return 'hcc';
};

const HccAuthProvider = ({ children, isKesselEnabled }) =>
  isKesselEnabled ? (
    <AccessCheck.Provider
      baseUrl={window.location.origin}
      apiPath={KESSEL_API_BASE_URL}
    >
      {children}
    </AccessCheck.Provider>
  ) : (
    <RBACProvider appName="compliance">{children}</RBACProvider>
  );

HccAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isKesselEnabled: PropTypes.bool,
};

const HccEnvironmentProvider = ({ children }) => {
  const chrome = useChrome();
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const resolvedKesselEnabled = Boolean(isKesselEnabled);

  const envContext = useMemo(
    () => ({
      runtime: 'hcc',
      isIop: false,
      isHcc: true,
      hasChrome: true,
      authorizationProvider: resolvedKesselEnabled ? 'kessel' : 'rbac',
      isKesselEnabled: resolvedKesselEnabled,
      updateDocumentTitle:
        chrome?.updateDocumentTitle ??
        ((title) => {
          document.title = title;
        }),
      hideGlobalFilter: chrome?.hideGlobalFilter ?? noop,
      requestPdf: chrome?.requestPdf ?? rejectedPromise,
      logout: chrome?.auth?.logout ?? noop,
    }),
    [chrome, resolvedKesselEnabled],
  );

  return (
    <EnvironmentContext.Provider value={envContext}>
      <HccAuthProvider isKesselEnabled={resolvedKesselEnabled}>
        <CompliancePermissionsProvider>
          {children}
        </CompliancePermissionsProvider>
      </HccAuthProvider>
    </EnvironmentContext.Provider>
  );
};

HccEnvironmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const IopEnvironmentProvider = ({ children }) => {
  fakeInsightsChrome();

  const envContext = useMemo(
    () => ({
      runtime: 'iop',
      isIop: true,
      isHcc: false,
      hasChrome: false,
      authorizationProvider: 'iop',
      isKesselEnabled: false,
      updateDocumentTitle: (title) => {
        document.title = title;
      },
      hideGlobalFilter: noop,
      requestPdf: rejectedPromise,
      logout: noop,
    }),
    [],
  );

  return (
    <EnvironmentContext.Provider value={envContext}>
      <CompliancePermissionsProvider>{children}</CompliancePermissionsProvider>
    </EnvironmentContext.Provider>
  );
};

IopEnvironmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const EnvironmentProvider = ({ children, runtime }) => {
  const resolvedRuntime = resolveRuntime(runtime);
  return (
    <QueryClientProvider client={queryClient}>
      {resolvedRuntime === 'iop' ? (
        <IopEnvironmentProvider>{children}</IopEnvironmentProvider>
      ) : (
        <HccEnvironmentProvider>{children}</HccEnvironmentProvider>
      )}
    </QueryClientProvider>
  );
};

EnvironmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
  runtime: PropTypes.oneOf(['hcc', 'iop']),
};

export default EnvironmentProvider;

export {
  useEnvironment,
  EnvironmentContext,
  defaultEnvironment,
} from 'Utilities/EnvironmentContext';
