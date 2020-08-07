import React from 'react';
import Router from './Utilities/Router';
import asyncComponent from './Utilities/asyncComponent';

const reportsRoutes = [
    {
        path: '/reports',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "Reports" */ './SmartComponents/Reports/Reports')
        )
    }, {
        path: '/reports/systems',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "ReportsSystems" */ 'SmartComponents/ReportsSystems/ReportsSystems')
        )
    }, {
        path: '/reports/:report_id',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "ReportDetails" */ 'SmartComponents/ReportDetails/ReportDetails')
        )
    }
];

const policiesRoutes = [
    {
        path: '/scappolicies',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies')
        )
    }, {
        path: '/scappolicies/new',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "CreatePolicy" */ 'SmartComponents/CreatePolicy/CreatePolicy')
        ),
        modal: true
    }, {
        path: '/scappolicies/:policy_id',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "PolicyDetails" */ 'SmartComponents/PolicyDetails/PolicyDetails')
        )
    }, {
        path: '/scappolicies/:policy_id/edit',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "EditPolicy" */ 'SmartComponents/EditPolicy/EditPolicy')
        ),
        modal: true
    }, {
        path: '/scappolicies/:policy_id/delete',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "DeletePolicy" */ 'SmartComponents/DeletePolicy/DeletePolicy')
        ),
        modal: true
    }
];

const systemsRoutes = [
    {
        path: '/systems',
        component: asyncComponent(() =>
            import(/* webpackChunkName: "ComplianceSystems" */ 'SmartComponents/ComplianceSystems/ComplianceSystems')
        )
    }, {
        path: '/systems/:inventoryId',
        component: asyncComponent(() =>
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
