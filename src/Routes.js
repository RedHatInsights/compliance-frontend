import React, { lazy, Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes, Navigate, matchPath } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';
import axios from 'axios';
import { ComplianceRoute } from 'PresentationalComponents';
import { getAppConfig } from '@/config/appConfig';
import { normalizePathForRouteMatch } from '@/Utilities/routing/compliancePaths';
import {
  includeSystemsRoutes,
  routePrefixes,
} from '@/Utilities/routing/complianceRoutePrefixes';

const defaultReportTitle = 'Reports';
const defaultPermissions = ['compliance:*:*'];

const buildReportsRoutes = (reportsPrefix) => [
  {
    path: `${reportsPrefix}`,
    title: defaultReportTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports'
        ),
    ),
  },
  {
    path: `${reportsPrefix}/:report_id`,
    title: `$entityTitle - ${defaultReportTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    defaultTitle: defaultReportTitle,
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "ReportDetails" */ 'SmartComponents/ReportDetails/ReportDetails'
        ),
    ),
  },
  {
    path: `${reportsPrefix}/:report_id/delete`,
    title: `Delete report - ${defaultReportTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:delete'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "DeleteReport" */ 'SmartComponents/DeleteReport/DeleteReport'
        ),
    ),
    modal: true,
  },
  ...(getAppConfig().features.pdf
    ? [
        {
          path: `${reportsPrefix}/:report_id/pdf`,
          title: `Export report - ${defaultReportTitle}`,
          requiredPermissions: [
            ...defaultPermissions,
            'compliance:report:read',
          ],
          defaultTitle: defaultReportTitle,
          modal: true,
          component: lazy(
            () =>
              import(
                /* webpackChunkName: "ReportDetails" */ 'SmartComponents/ExportPDF/ExportPDF'
              ),
          ),
        },
      ]
    : []),
];

const getReportsRoutes = () => buildReportsRoutes(routePrefixes.reports);

const defaultPoliciesTitle = 'SCAP policies';

const buildPoliciesRoutes = (policiesPrefix) => [
  {
    path: `${policiesPrefix}`,
    title: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies'
        ),
    ),
  },
  {
    path: `${policiesPrefix}/new`,
    title: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:create'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "CreatePolicy" */ 'SmartComponents/CreatePolicy'
        ),
    ),
    modal: true,
  },
  {
    path: `${policiesPrefix}/:policy_id`,
    title: `$entityTitle - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    defaultTitle: defaultPoliciesTitle,
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "PolicyDetailsWrapper" */ 'SmartComponents/PolicyDetails/PolicyDetails'
        ),
    ),
  },
  {
    path: `${policiesPrefix}/:policy_id/edit`,
    title: `$entityTitle - ${defaultPoliciesTitle}`,
    defaultTitle: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:write'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "EditPolicy" */ 'SmartComponents/EditPolicy/EditPolicy'
        ),
    ),
    modal: true,
  },
  {
    path: `${policiesPrefix}/:policy_id/import-rules`,
    title: `$entityTitle - ${defaultPoliciesTitle}`,
    defaultTitle: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:write'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "ImportRules" */ 'SmartComponents/ImportRules/ImportRules'
        ),
    ),
    modal: true,
  },
  {
    path: `${policiesPrefix}/:policy_id/delete`,
    title: `Delete policy - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:delete'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "DeletePolicy" */ 'SmartComponents/DeletePolicy/DeletePolicy'
        ),
    ),
    modal: true,
  },
  {
    path: `${policiesPrefix}/:policy_id/default_ruleset/:security_guide_id?`,
    title: `Default policy rules - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "PolicyRules" */ 'SmartComponents/PolicyRules/PolicyRules'
        ),
    ),
  },
];

const getPoliciesRoutes = () => buildPoliciesRoutes(routePrefixes.policies);

const defaultSystemsTitle = 'Systems';
const systemsRoutes = [
  {
    path: 'systems',
    title: defaultSystemsTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:system:read'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "ComplianceSystems" */ 'SmartComponents/ComplianceSystems/ComplianceSystems'
        ),
    ),
  },
  {
    path: 'systems/:inventoryId',
    title: `$entityTitle - ${defaultSystemsTitle}`,
    defaultTitle: defaultSystemsTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:system:read'],
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "SystemDetails" */ 'SmartComponents/SystemDetails/SystemDetails'
        ),
    ),
  },
];

export const getRoutes = () => {
  const systems = includeSystemsRoutes ? systemsRoutes : [];
  return [...getPoliciesRoutes(), ...getReportsRoutes(), ...systems];
};

export const findRouteByPath = (to) => {
  const raw =
    typeof to === 'string'
      ? to
      : to?.pathname || (typeof to?.to === 'string' ? to.to : '');
  const pathname = normalizePathForRouteMatch(raw);
  const pathnameForMatch = pathname ? `/${pathname}` : '';
  return getRoutes().find((route) =>
    matchPath({ path: route.path, end: true }, pathnameForMatch),
  );
};

const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';

const ComplianceRoutesSuspense = ({ children }) => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    }
  >
    {children}
  </Suspense>
);

ComplianceRoutesSuspense.propTypes = {
  children: PropTypes.node,
};

const DefaultComplianceRedirect = () => (
  <Navigate to={routePrefixes.reports} replace />
);

const ComplianceRoutes = () => {
  const { features } = getAppConfig();
  const [hasSystems, setHasSystems] = useState(true);
  useEffect(() => {
    if (!features.dashboardZeroState) {
      return;
    }
    try {
      axios
        .get(
          // look only for RHEL systems, https://issues.redhat.com/browse/RHINENG-5929
          `${INVENTORY_TOTAL_FETCH_URL}?page=1&per_page=1&filter[system_profile][operating_system][RHEL][version][gte]=0`,
        )
        .then(({ data }) => {
          setHasSystems(data.total > 0);
        });
    } catch (e) {
      console.log(e);
    }
  }, [features.dashboardZeroState]);

  const complianceRoutes = (
    <Routes>
      {getRoutes().map(({ path, ...route }) => (
        <Route
          path={path}
          key={`route-${path.replace('/', '-')}`}
          element={<ComplianceRoute {...{ ...route, path }} />}
        ></Route>
      ))}
      <Route path="*" element={<DefaultComplianceRedirect />} />
    </Routes>
  );

  return (
    <ComplianceRoutesSuspense>
      {!hasSystems && features.dashboardZeroState ? (
        <AsyncComponent
          appId="compliance_zero_state"
          appName="dashboard"
          module="./AppZeroState"
          scope="dashboard"
          ErrorComponent={<ErrorState />}
          app="Compliance"
        />
      ) : (
        complianceRoutes
      )}
    </ComplianceRoutesSuspense>
  );
};

export default ComplianceRoutes;
