import React from 'react';
import { useLocation } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import propTypes from 'prop-types';
import { Tabs } from '@patternfly/react-core';
import useAnchor from 'Utilities/hooks/useAnchor';

// Plain tab component without any styling
export const ContentTab = ({ children }) => children;

const findTab = (tabs, key) => tabs.find((tab) => tab.props.eventKey === key);

const useAnchorLevels = (defaultAnchor, level) => {
  const anchor = useAnchor(defaultAnchor);
  const levels = anchor.split('|');
  const currentAnchor = levels[level] || defaultAnchor;

  return {
    levels,
    currentAnchor,
  };
};

// Shows always only one tab, either the current or if not available the default
const TabSwitcher = ({ children, activeKey: currentAnchor, defaultTab }) => {
  const getDefaultTab = () =>
    defaultTab ? findTab(children, defaultTab) : children[0];
  const currentTab = findTab(children, currentAnchor);

  return currentTab ? [currentTab] : [getDefaultTab()];
};

TabSwitcher.propTypes = {
  children: propTypes.node,
  currentAnchor: propTypes.string,
  defaultTab: propTypes.string,
};

// Routed Plain switcher that can be used with PatternFly tabs
export const RoutedTabSwitcher = ({ children, defaultTab, level = 0 }) => {
  const { currentAnchor } = useAnchorLevels(defaultTab, level);

  return <TabSwitcher activeKey={currentAnchor}>{children}</TabSwitcher>;
};

RoutedTabSwitcher.propTypes = {
  children: propTypes.node,
  defaultTab: propTypes.string,
  level: propTypes.number,
};

// Allows to use full PatternFly tabs and switch them using the URL hash
// It can be used with filled tabs (EditPolicyForm) or just tab "buttons" (PolicyDetails)
export const RoutedTabs = ({
  children,
  defaultTab,
  level = 0,
  ouiaId,
  ...props
}) => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { currentAnchor, levels } = useAnchorLevels(defaultTab, level);
  const handleTabSelect = (e, eventKey) => {
    e.preventDefault();
    const tabToActivate = eventKey.replace('#', '');
    let tabAnchor = levels;
    tabAnchor[level] = tabToActivate;

    navigate({
      state,
      to: pathname,
      hash: tabAnchor.slice(0, level + 1).join('|'),
    });
  };
  const tabAvailable = children
    .map(({ props: { eventKey } }) => eventKey)
    .find((tabAnchor) => tabAnchor === currentAnchor);

  return (
    <Tabs
      {...props}
      ouiaId={ouiaId}
      onSelect={handleTabSelect}
      activeKey={tabAvailable ? currentAnchor : defaultTab}
    >
      {children}
    </Tabs>
  );
};

RoutedTabs.propTypes = {
  children: propTypes.node,
  defaultTab: propTypes.string,
  level: propTypes.number,
  ouiaId: propTypes.string,
};

export default TabSwitcher;
