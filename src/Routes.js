import React, { lazy } from 'react';
import Router from './Utilities/Router';

const defaultReportTitle = 'Reports';
const reportsRoutes = [
  {
    path: '/reports',
    title: defaultReportTitle,
    component: lazy(() =>
      import(
        /* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports'
      )
    ),
  },
  {
    path: '/reports/:report_id',
    title: `Report: $entityTitle - ${defaultReportTitle}`,
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
    component: lazy(() =>
      import(
        /* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies'
      )
    ),
  },
  {
    path: '/scappolicies/new',
    title: defaultPoliciesTitle,
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
    component: lazy(() =>
      import(
        /* webpackChunkName: "DeletePolicy" */ 'SmartComponents/DeletePolicy/DeletePolicy'
      )
    ),
    modal: true,
  },
];

const defaultSystemsTitle = 'Systems';
const systemsRoutes = [
  {
    path: '/systems',
    title: defaultSystemsTitle,
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
    component: lazy(() =>
      import(
        /* webpackChunkName: "SystemDetails" */ 'SmartComponents/SystemDetails/SystemDetails'
      )
    ),
  },
];

export const routes = [...policiesRoutes, ...reportsRoutes, ...systemsRoutes];

export const Routes = (...props) => <Router {...props} routes={routes} />;
