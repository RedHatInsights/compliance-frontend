import propTypes from 'prop-types';
import React from 'react';
import { Tabs, Tab } from '@patternfly/react-core';

export const PolicyTabs = ({ activeTab, setActiveTab }) => {
    const redirect = (_, tabIndex) => {
        setActiveTab(tabIndex);
    };

    const tabs = [
        <Tab title={'Details'} id='policy-details' key={0} eventKey={0}></Tab>,
        <Tab title={'Rules'} id='policy-rules' key={1} eventKey={1}></Tab>,
        <Tab title={'Systems'} id='policy-systems' key={2} eventKey={2}></Tab>
    ];

    return (
        <Tabs activeKey={activeTab} onSelect={redirect} aria-label="Policy Tabs">
            { tabs }
        </Tabs>
    );
};

PolicyTabs.propTypes = {
    activeTab: propTypes.number,
    setActiveTab: propTypes.func
};

export default PolicyTabs;
