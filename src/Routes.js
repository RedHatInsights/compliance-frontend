import React, { lazy, useEffect, useState } from 'react';
import { matchPath } from 'react-router-dom';
import Router from './Utilities/Router';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';
import axios from 'axios';
const defaultReportTitle = 'Reports';
const defaultPermissions = ['compliance:*:*'];
const reportsRoutes = [
  {
    path: '/reports',
    title: defaultReportTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports'
      )
    ),
  },
  {
    path: '/reports/:report_id',
    title: `Report: $entityTitle - ${defaultReportTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:report:read'],
    defaultTitle: defaultReportTitle,
    component: lazy(() =>
      import(
        /* webpackChunkName: "ReportDetails" */ 'SmartComponents/ReportDetails/ReportDetails'
      )
    ),
  },
  {
    path: '/reports/:report_id/delete',
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
    path: '/reports/:report_id/pdf',
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
    path: '/scappolicies',
    title: defaultPoliciesTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies'
      )
    ),
  },
  {
    path: '/scappolicies/new',
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
    path: '/scappolicies/:policy_id',
    title: `$entityTitle - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    defaultTitle: defaultPoliciesTitle,
    component: lazy(() =>
      import(
        /* webpackChunkName: "PolicyDetails" */ 'SmartComponents/PolicyDetails/PolicyDetails'
      )
    ),
  },
  {
    path: '/scappolicies/:policy_id/edit',
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
    path: '/scappolicies/:policy_id/delete',
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
    path: '/scappolicies/:policy_id/default_ruleset',
    title: `Default policy rules - ${defaultPoliciesTitle}`,
    requiredPermissions: [...defaultPermissions, 'compliance:policy:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "PolicyRules" */ 'SmartComponents/PolicyRules/PolicyRules'
      )
    ),
  },
];

const defaultSystemsTitle = 'Compliance systems';
const systemsRoutes = [
  {
    path: '/systems',
    title: defaultSystemsTitle,
    requiredPermissions: [...defaultPermissions, 'compliance:system:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "ComplianceSystems" */ 'SmartComponents/ComplianceSystems/ComplianceSystems'
      )
    ),
  },
  {
    path: '/systems/:inventoryId',
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
  const route = routes.find((route) => {
    return matchPath(pathToMatch.pathname, { ...route, exact: true });
  });
  return route;
};
const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';
export const Routes = (...props) => {
  const [hasSystems, setHasSystems] = useState(true);
  useEffect(() => {
    try {
      axios
        .get(`${INVENTORY_TOTAL_FETCH_URL}?page=1&per_page=1`)
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
    <Router {...props} routes={routes} />
  );
};
