import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import propTypes from 'prop-types';
import { Tabs } from '@patternfly/react-core';

const useAnchor = (defaultAnchor) => {
    const location = useLocation();
    const hash = location.hash && location.hash.length > 0 ? location.hash : undefined;
    return (hash || defaultAnchor).replace('#', '');
};

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
    const history = useHistory();
    const currentAnchor = useAnchor(defaultTab);
    const handleTabSelect = (_, eventKey) => {
        history.push({ hash: eventKey });
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
