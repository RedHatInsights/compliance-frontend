import React, { lazy, useEffect, useState } from 'react';
import { Route, Routes, Navigate, matchPath } from 'react-router-dom';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';
import axios from 'axios';
import { ComplianceRoute } from 'PresentationalComponents';

const defaultReportTitle = 'Reports';
const defaultPermissions = ['compliance:*:*'];

const reportsRoutes = [
  {
    path: 'reports',
    title: defaultReportTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports'
      )
    ),
  },
  {
    path: 'reports/:report_id',
    title: `$entityTitle - ${defaultReportTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    defaultTitle: defaultReportTitle,
    component: lazy(() =>
      import(
        /* webpackChunkName: "ReportDetails" */ 'SmartComponents/ReportDetails/ReportDetails'
      )
    ),
  },
  {
    path: 'reports/:report_id/delete',
    title: `Delete report - ${defaultReportTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:report:delete'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "DeleteReport" */ 'SmartComponents/DeleteReport/DeleteReport'
      )
    ),
    modal: true,
  },

  {
    path: 'reports/:report_id/pdf',
    title: `Export report - ${defaultReportTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    defaultTitle: defaultReportTitle,
    modal: true,
    component: lazy(() =>
      import(
        /* webpackChunkName: "ReportDetails" */ 'SmartComponents/ReportDownload/ReportDownload'
      )
    ),
  },
];

const defaultPoliciesTitle = 'SCAP policies';
const policiesRoutes = [
  {
    path: 'scappolicies',
    title: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies'
      )
    ),
  },
  {
    path: 'scappolicies/new',
    title: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:create'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "CreatePolicy" */ 'SmartComponents/CreatePolicy/CreatePolicy'
      )
    ),
    modal: true,
  },
  {
    path: 'scappolicies/:policy_id',
    title: `$entityTitle - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    defaultTitle: defaultPoliciesTitle,
    component: lazy(() =>
      import(
        /* webpackChunkName: "PolicyDetailsWrapper" */ 'SmartComponents/PolicyDetails/PolicyDetails'
      )
    ),
  },
  {
    path: 'scappolicies/:policy_id/edit',
    title: `$entityTitle - ${defaultPoliciesTitle}`,
    defaultTitle: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:update'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "EditPolicy" */ 'SmartComponents/EditPolicy/EditPolicy'
      )
    ),
    modal: true,
  },
  {
    path: 'scappolicies/:policy_id/delete',
    title: `Delete policy - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:delete'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "DeletePolicy" */ 'SmartComponents/DeletePolicy/DeletePolicy'
      )
    ),
    modal: true,
  },
  {
    path: 'scappolicies/:policy_id/default_ruleset',
    title: `Default policy rules - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "PolicyRules" */ 'SmartComponents/PolicyRules/PolicyRules'
      )
    ),
  },
];

const defaultSystemsTitle = 'Systems';
const systemsRoutes = [
  {
    path: 'systems',
    title: defaultSystemsTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:system:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "ComplianceSystems" */ 'SmartComponents/ComplianceSystems/ComplianceSystems'
      )
    ),
  },
  {
    path: 'systems/:inventoryId',
    title: `$entityTitle - ${defaultSystemsTitle}`,
    defaultTitle: defaultSystemsTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:system:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "SystemDetails" */ 'SmartComponents/SystemDetails/SystemDetails'
      )
    ),
  },
];

export const routes = [...policiesRoutes, ...reportsRoutes, ...systemsRoutes];

export const findRouteByPath = (to) => {
  const pathToMatch = typeof to === 'string' ? { pathname: to } : to;
  return routes.find((route) =>
    matchPath({ ...route, exact: true }, pathToMatch.pathname)
  );
};

const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';

const ComplianceRoutes = () => {
  const [hasSystems, setHasSystems] = useState(true);
  useEffect(() => {
    try {
      axios
        .get(
          // look only for RHEL systems, https://issues.redhat.com/browse/RHINENG-5929
          `${INVENTORY_TOTAL_FETCH_URL}?page=1&per_page=1&filter[system_profile][operating_system][RHEL][version][gte]=0`
        )
        .then(({ data }) => {
          setHasSystems(data.total > 0);
        });
    } catch (e) {
      console.log(e);
    }
  }, [hasSystems]);

  return !hasSystems ? (
    <AsyncComponent
      appId="compliance_zero_state"
      appName="dashboard"
      module="./AppZeroState"
      scope="dashboard"
      ErrorComponent={<ErrorState />}
      app="Compliance"
    />
  ) : (
    <Routes>
      {routes.map(({ path, ...route }) => (
        <Route
          path={path}
          key={`route-${path.replace('/', '-')}`}
          element={<ComplianceRoute {...{ ...route, path }} />}
        ></Route>
      ))}
      <Route path="*" element={<Navigate to="reports" />} />
    </Routes>
  );
};

export default ComplianceRoutes;
