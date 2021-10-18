import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import propTypes from 'prop-types';
import { Tabs } from '@patternfly/react-core';
import { useAnchor } from 'Utilities/Router';

export const ContentTab = ({ children }) => children;

const useAnchorLevels = (defaultAnchor, level) => {
  const anchor = useAnchor(defaultAnchor);
  const levels = anchor.split('|');
  const currentAnchor = levels[level] || defaultAnchor;

  return {
    levels,
    currentAnchor,
  };
};

const TabSwitcher = (props) =>
  props.children
    .map((tab) => (tab.props.eventKey === props.activeKey ? tab : undefined))
    .filter((c) => !!c);

TabSwitcher.propTypes = {
  activeTab: propTypes.number,
  children: propTypes.node,
};

export const RoutedTabSwitcher = ({ children, defaultTab, level }) => {
  const { currentAnchor } = useAnchorLevels(defaultTab, level);

  return children
    .map((tab) => (tab.props.eventKey === currentAnchor ? tab : undefined))
    .filter((c) => !!c);
};

RoutedTabSwitcher.propTypes = {
  children: propTypes.node,
  defaultTab: propTypes.string,
  level: propTypes.number,
};

RoutedTabSwitcher.defaultProps = {
  level: 0,
};

export const RoutedTabs = ({
  children,
  defaultTab,
  level,
  ouiaId,
  ...props
}) => {
  const { push } = useHistory();
  const { pathname, state } = useLocation();
  const { currentAnchor, levels } = useAnchorLevels(defaultTab, level);
  const handleTabSelect = (e, eventKey) => {
    e.preventDefault();
    const tabToActivate = eventKey.replace('#', '');
    let tabAnchor = levels;
    tabAnchor[level] = tabToActivate;

    push({
      state,
      to: pathname,
      hash: tabAnchor.slice(0, level + 1).join('|'),
    });
  };

  return (
    <Tabs
      {...props}
      ouiaId={ouiaId}
      onSelect={handleTabSelect}
      activeKey={currentAnchor}
    >
      {children}
    </Tabs>
  );
};

RoutedTabs.defaultProps = {
  level: 0,
};

RoutedTabs.propTypes = {
  children: propTypes.node,
  defaultTab: propTypes.string,
  level: propTypes.number,
  ouiaId: propTypes.string,
};

export default TabSwitcher;
