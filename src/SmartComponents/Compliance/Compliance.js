import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import some from 'lodash/some';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Main, routerParams } from '@red-hat-insights/insights-frontend-components';

const ComplianceProfiles = asyncComponent(() =>
    import(/* webpackChunkName: "ComplianceProfiles" */ '../ComplianceProfiles/ComplianceProfiles')
);
export const paths = {
    compliance: '/',
    complianceProfiles: '/profiles',
    profilePage: '/profiles/:profile'
};

const Compliance = props => {
    let path = props.location.pathname;
    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title="Compliance" />
            </PageHeader>
            <Main>
                <Switch>
                    <Route exact path={paths.complianceProfiles} component={ComplianceProfiles} />
                    <Route
                        render={() => (some(paths, p => p === path) ? null : <Redirect to={paths.compliance} />)}
                    />
                </Switch>
            </Main>
        </React.Fragment>
    );
};

Compliance.propTypes = {
    location: propTypes.object.isRequired
};

export default routerParams(Compliance);
