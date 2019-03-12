import { routerParams } from '@red-hat-insights/insights-frontend-components';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { paths } from '../../Routes';
import { Tabs, Tab } from '@patternfly/react-core';
import invert from 'lodash/invert';

class ComplianceTabs extends Component {
    constructor(props) {
        super(props);
        this.tabPaths = {
            0: paths.compliancePolicies,
            1: paths.complianceSystems
        };
        this.redirect = this.redirect.bind(this);
    }

    redirect(_, tabIndex) {
        this.props.history.push(this.tabPaths[tabIndex]);
    }

    render() {
        const { match: { path } } = this.props;
        const currentKey = Number(invert(this.tabPaths)[path]);

        return (
            <React.Fragment>
                <Tabs activeKey={currentKey} onSelect={this.redirect} aria-label="Compliance Tabs">
                    <Tab title={'Policies'} eventKey={0}>
                    </Tab>
                    <Tab title={'Systems'} eventKey={1}>
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    }
}

ComplianceTabs.propTypes = {
    history: propTypes.object,
    match: propTypes.object
};

export default routerParams(ComplianceTabs);
