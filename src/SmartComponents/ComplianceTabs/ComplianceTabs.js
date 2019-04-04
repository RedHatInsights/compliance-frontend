import { routerParams } from '@red-hat-insights/insights-frontend-components';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { paths } from '../../Routes';
import { Tabs, Tab } from '@patternfly/react-core';
import invert from 'lodash/invert';

class ComplianceTabs extends Component {
    _isMounted = false;

    state = {
        internalUser: false,
        tabPaths: {
            0: paths.compliancePolicies,
            1: paths.complianceSystems
        }
    };

    redirect = (_, tabIndex) => {
        const { tabPaths } = this.state;
        this.props.history.push(tabPaths[tabIndex]);
    }

    componentDidMount() {
        this._isMounted = true;
        window.insights.chrome.auth.getUser().then((data) => {
            if (this._isMounted) {
                this.setState({
                    internalUser: data.identity.user.is_internal,
                    tabPaths: {
                        0: paths.compliancePolicies,
                        1: paths.complianceSystems,
                        2: paths.complianceImageStreams
                    }
                });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { match: { path } } = this.props;
        const { internalUser, tabPaths } = this.state;
        let currentKey = Number(invert(tabPaths)[path]);

        const tabs = [
            <Tab title={'Policies'} key={0} eventKey={0}></Tab>,
            <Tab title={'Systems'} key={1} eventKey={1}></Tab>
        ];

        if (internalUser) {
            tabs.push(<Tab title={'Image Streams'} key={2} eventKey={2}></Tab>);
        } else if (path === '/imagestreams') {
            // We cannot pass '2' to activeKey while the page is loading
            // on the imagestreams page. This breaks the component.
            // While the page is loading, we don't know yet if this
            // an internal user or not. Therefore we just mark '1' as the
            // activeKey until we know if it's an internalUser in /imagestreams
            currentKey = 1;
        }

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
