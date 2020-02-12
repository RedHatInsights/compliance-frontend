import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const CompliancePolicies = asyncComponent(() =>
    import(/* webpackChunkName: "CompliancePolicies" */ 'SmartComponents/CompliancePolicies/CompliancePolicies')
);
const Reports = asyncComponent(() =>
    import(/* webpackChunkName: "ComplianceReports" */ './SmartComponents/Reports/Reports')
);
const ReportsSystems = asyncComponent(() =>
    import(/* webpackChunkName: "ComplianceReportsSystems" */ './SmartComponents/ReportsSystems/ReportsSystems')
);
const ReportDetails = asyncComponent(() =>
    import(/* webpackChunkName: "ComplianceReportDetails" */ './SmartComponents/ReportDetails/ReportDetails')
);
const ComplianceSystems = asyncComponent(() =>
    import(/* webpackChunkName: "ComplianceSystems" */ 'SmartComponents/ComplianceSystems/ComplianceSystems')
);
const PolicyDetails = asyncComponent(() =>
    import(/* webpackChunkName: "PolicyDetails" */ 'SmartComponents/PolicyDetails/PolicyDetails')
);
const SystemDetails = asyncComponent(() =>
    import(/* webpackChunkName: "SystemDetails" */ 'SmartComponents/SystemDetails/SystemDetails')
);

export const paths = {
    compliancePolicies: '/policies',
    reports: '/reports',
    reportsSystems: '/reports/systems',
    complianceSystems: '/systems',
    complianceSystemsInventoryDetail: '/systems/:inventoryId',
    policyDetails: '/policies/:policy_id',
    policyDetailsInventoryDetail: '/policies/:policy_id/:inventoryId',
    reportDetails: '/reports/:report_id',
    reportDetailsInventoryDetail: '/policies/:policy_id/:inventoryId',
    systemDetails: '/systems/:inventoryId'
};

type Props = {
    childProps: any
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/compliance/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props: Props) => {
    const path = props.childProps.location.pathname;

    return (
        <Switch>
            <Route exact path={paths.compliancePolicies} component={CompliancePolicies} />
            <Route exact path={paths.reports} component={Reports} />
            <Route exact path={paths.reportsSystems} component={ReportsSystems} />
            <Route exact path={paths.reportDetails} component={ReportDetails} />
            <Route exact path={paths.complianceSystems} component={ComplianceSystems} />
            <Route path={paths.complianceSystemsInventoryDetail} component={SystemDetails} />
            <Route path={paths.policyDetailsInventoryDetail} component={SystemDetails} />
            <Route exact path={paths.policyDetails} component={PolicyDetails} />
            <Route path={paths.systemDetails} component={SystemDetails} />

            {/* Finally, catch all unmatched routes */}
            <Route render={() => (some(paths, p => p === path) ? null : <Redirect to={paths.reports} />)} />
        </Switch>
    );
};
