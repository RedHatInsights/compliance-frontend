import { routerParams } from '@red-hat-insights/insights-frontend-components';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { paths } from '../../Routes';
import { Tabs, Tab } from '@patternfly/react-core';
import invert from 'lodash/invert';

class ComplianceTabs extends Component {
    state = {
        tabPaths: {
            0: paths.compliancePolicies,
            1: paths.complianceSystems
        }
    };

    redirect = (_, tabIndex) => {
        const { tabPaths } = this.state;
        this.props.history.push(tabPaths[tabIndex]);
    }

    render() {
        const { match: { path } } = this.props;
        const { tabPaths } = this.state;
        let currentKey = Number(invert(tabPaths)[path]);

        const tabs = [
            <Tab title={'Policies'} key={0} eventKey={0}></Tab>,
            <Tab title={'Systems'} key={1} eventKey={1}></Tab>
        ];

        return (
            <Tabs activeKey={currentKey} onSelect={this.redirect} aria-label="Compliance Tabs">
                { tabs }
            </Tabs>
        );
    }
}

ComplianceTabs.propTypes = {
    history: propTypes.object,
    match: propTypes.object
};

export default routerParams(ComplianceTabs);
