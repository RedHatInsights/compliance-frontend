import React, { lazy } from 'react';
import Router from './Utilities/Router';

const reportsRoutes = [
    {
        path: '/reports',
        component: lazy(() =>
            import(/* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports')
        )
    }, {
        path: '/reports/:report_id',
        component: lazy(() =>
            import(/* webpackChunkName: "ReportDetails" */ 'SmartComponents/ReportDetails/ReportDetails')
        )
    }, {
        path: '/reports/:report_id/delete',
        component: lazy(() =>
            import(/* webpackChunkName: "DeleteReport" */ 'SmartComponents/DeleteReport/DeleteReport')
        ),
        modal: true
    }
];

const policiesRoutes = [
    {
        path: '/scappolicies',
        component: lazy(() =>
            import(/* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies')
        )
    }, {
        path: '/scappolicies/new',
        component: lazy(() =>
            import(/* webpackChunkName: "CreatePolicy" */ 'SmartComponents/CreatePolicy/CreatePolicy')
        ),
        modal: true
    }, {
        path: '/scappolicies/:policy_id',
        component: lazy(() =>
            import(/* webpackChunkName: "PolicyDetails" */ 'SmartComponents/PolicyDetails/PolicyDetails')
        )
    }, {
        path: '/scappolicies/:policy_id/edit',
        component: lazy(() =>
            import(/* webpackChunkName: "EditPolicy" */ 'SmartComponents/EditPolicy/EditPolicy')
        ),
        modal: true
    }, {
        path: '/scappolicies/:policy_id/delete',
        component: lazy(() =>
            import(/* webpackChunkName: "DeletePolicy" */ 'SmartComponents/DeletePolicy/DeletePolicy')
        ),
        modal: true
    }
];

const systemsRoutes = [
    {
        path: '/systems',
        component: lazy(() =>
            import(/* webpackChunkName: "ComplianceSystems" */ 'SmartComponents/ComplianceSystems/ComplianceSystems')
        )
    }, {
        path: '/systems/:inventoryId',
        component: lazy(() =>
            import(/* webpackChunkName: "SystemDetails" */ 'SmartComponents/SystemDetails/SystemDetails')
        )
    }
];

const routes = [
    ...policiesRoutes,
    ...reportsRoutes,
    ...systemsRoutes
];

export const Routes = (...props) => (<Router { ...props } routes={ routes } />);
