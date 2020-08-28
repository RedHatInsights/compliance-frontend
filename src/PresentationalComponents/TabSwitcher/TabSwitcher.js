import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import propTypes from 'prop-types';
import { Tabs } from '@patternfly/react-core';
import { useAnchor } from 'Utilities/Router';

export const ContentTab = ({ children }) => (children);

const TabSwitcher = (props) => (
    props.children.map((tab) => (
        tab.props.eventKey === props.activeKey ? tab : undefined
    )).filter((c) => (!!c))
);

TabSwitcher.propTypes = {
    activeTab: propTypes.number,
    children: propTypes.node
};

export const RouteredTabSwitcher = ({ children, defaultTab }) => {
    const currentAnchor = useAnchor(defaultTab);

    return children.map((tab) => (
        tab.props.eventKey === currentAnchor ? tab : undefined
    )).filter((c) => (!!c));
};

RouteredTabSwitcher.propTypes = {
    children: propTypes.node,
    defaultTab: propTypes.string
};

export const RoutedTabs = ({ children, defaultTab, ...props }) => {
    const { push } = useHistory();
    const { pathname, state } = useLocation();
    const currentAnchor = useAnchor(defaultTab);
    const handleTabSelect = (e, eventKey) => {
        e.preventDefault();

        push({
            state,
            to: pathname,
            hash: eventKey.replace('#', '')
        });
    };

    return <Tabs
        { ...props }
        onSelect={ handleTabSelect }
        activeKey={ currentAnchor }>
        { children }
    </Tabs>;
};

RoutedTabs.propTypes = {
    children: propTypes.node,
    defaultTab: propTypes.string
};

export default TabSwitcher;
