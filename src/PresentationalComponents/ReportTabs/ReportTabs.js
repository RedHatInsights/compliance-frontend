import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import propTypes from 'prop-types';
import React from 'react';
import { paths } from '../../Routes';
import { Tabs, Tab } from '@patternfly/react-core';
import invert from 'lodash/invert';

export const ReportTabs = (props) => {
    const { match: { path } } = props;

    const tabPaths = {
        0: paths.reports,
        1: paths.reportsSystems
    };

    const redirect = (_, tabIndex) => {
        props.history.push(tabPaths[tabIndex]);
    };

    let currentKey = Number(invert(tabPaths)[path]);

    const tabs = [
        <Tab title={'By policy'} key={0} eventKey={0}></Tab>,
        <Tab title={'By systems'} key={1} eventKey={1}></Tab>
    ];

    return (
        <Tabs activeKey={currentKey} onSelect={redirect} aria-label="Report Tabs">
            { tabs }
        </Tabs>
    );
};

ReportTabs.propTypes = {
    history: propTypes.object,
    match: propTypes.object
};

export default routerParams(ReportTabs);
