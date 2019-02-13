import { routerParams } from '@red-hat-insights/insights-frontend-components';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { paths } from '../../Routes';
import { Nav, NavList, NavItem, NavVariants } from '@patternfly/react-core';

class ComplianceTabs extends Component {
    constructor(props) {
        super(props);
        this.redirect = this.redirect.bind(this);
    }
    redirect(tab) {
        this.props.history.push(tab.itemId);
    }
    render() {
        return (
            <React.Fragment>
                <Nav onSelect={this.redirect} aria-label="Compliance Tabs">
                    <NavList variant={NavVariants.horizontal}>
                        <NavItem preventDefault={true}
                            isActive={this.props.match.path === paths.compliancePolicies}
                            itemId={paths.compliancePolicies}>
                            Policies
                        </NavItem>
                        <NavItem preventDefault={true}
                            isActive={this.props.match.path === paths.complianceSystems}
                            itemId={paths.complianceSystems}>
                            Systems
                        </NavItem>
                    </NavList>
                </Nav>
            </React.Fragment>
        );
    }
}

ComplianceTabs.propTypes = {
    history: propTypes.object,
    match: propTypes.object
};

export default routerParams(ComplianceTabs);
