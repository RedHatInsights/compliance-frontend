import React, { lazy } from 'react';
import { matchPath } from 'react-router-dom';
import Router from './Utilities/Router';
const defaultReportTitle = 'Reports';
const defaultPermissions = ['compliance:*:*'];
const reportsRoutes = [
  {
    path: '/reports',
    title: defaultReportTitle,
    requiredPermissions: ['compliance:reports:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports'
      )
    ),
  },
  {
    path: '/reports/:report_id',
    title: `Report: $entityTitle - ${defaultReportTitle}`,
    requiredPermissions: ['compliance:reports:read'],
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
    requiredPermissions: ['compliance:reports:delete'],
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
    requiredPermissions: ['compliance:report_export:read'],
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
    requiredPermissions: ['compliance:policy:read'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies'
      )
    ),
  },
  {
    path: '/scappolicies/new',
    title: defaultPoliciesTitle,
    requiredPermissions: ['compliance:policy:create'],
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
    requiredPermissions: ['compliance:policy:read'],
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
    requiredPermissions: ['compliance:policy:update'],
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
    requiredPermissions: ['compliance:policy:delete'],
    component: lazy(() =>
      import(
        /* webpackChunkName: "DeletePolicy" */ 'SmartComponents/DeletePolicy/DeletePolicy'
      )
    ),
    modal: true,
  },
];

const defaultSystemsTitle = 'Compliance systems';
const systemsRoutes = [
  {
    path: '/systems',
    title: defaultSystemsTitle,
    requiredPermissions: defaultPermissions,
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
    requiredPermissions: defaultPermissions,
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
export const Routes = (...props) => <Router {...props} routes={routes} />;
