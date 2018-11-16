import { routerParams, TabLayout } from '@red-hat-insights/insights-frontend-components';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { paths } from '../Compliance/Compliance';

class ComplianceTabs extends Component {
    constructor(props) {
        super(props);
        this.redirect = this.redirect.bind(this);
    }
    redirect(event, tab) {
        this.props.history.push(tab.name);
    }
    render() {
        return (
            <React.Fragment>
                <TabLayout
                    items={[
                        { title: 'Profiles', name: paths.complianceProfiles },
                        { title: 'Systems', name: paths.complianceSystems }
                    ]}
                    onTabClick={this.redirect}
                    active={this.props.location.pathname}
                >
                    {this.props.children}
                </TabLayout>
            </React.Fragment>
        );
    }
}

ComplianceTabs.propTypes = {
    children: propTypes.any,
    location: propTypes.object,
    history: propTypes.object
};

export default routerParams(ComplianceTabs);
