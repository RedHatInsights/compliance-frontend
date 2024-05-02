import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { Tab, Badge } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import ProfileTabContent from './ProfileTabContent';
import OsVersionText from './OsVersionText';
import {
  selectedRuleRefIdsForTab,
  matchesSelectionItem,
} from './ruleSelection';

const eventKey = ({ id, osMinorVersion }, newOsMinorVersion) =>
  `rules-${id}-${osMinorVersion || newOsMinorVersion}`;

const getDefaultTab = (tabsData, defaultTab) => {
  if (!tabsData || tabsData.length === 0) {
    return;
  }

  if (!defaultTab) {
    const firstTab = tabsData[0];
    defaultTab = {
      id: firstTab.profile.id,
      osMinorVersion:
        firstTab.profile.osMinorVersion || firstTab.newOsMinorVersion,
    };
  }

  return eventKey(defaultTab);
};

const TabbedRules = ({
  tabsData,
  defaultTab,
  selectedRuleRefIds,
  setSelectedRuleRefIds,
  columns,
  level = 0,
  ouiaId,
  resetLink,
  rulesPageLink,
  setRuleValues,
  ruleValues,
  onRuleValueReset,
  ...rulesTableProps
}) => {
  const handleSelect = useCallback(
    (profile, newOsMinorVersion, profileSelectedRuleRefIds) => {
      const filteredSelection = (selectedRuleRefIds || []).filter(
        (selectionItem) =>
          !matchesSelectionItem(selectionItem, profile, newOsMinorVersion)
      );

      const newItem = {
        id: profile.id,
        osMinorVersion: newOsMinorVersion || profile.osMinorVersion,
        ruleRefIds: profileSelectedRuleRefIds,
      };
      setSelectedRuleRefIds([newItem, ...filteredSelection]);
    },
    [selectedRuleRefIds]
  );

  return (
    <RoutedTabs
      ouiaId={ouiaId}
      level={level}
      defaultTab={getDefaultTab(tabsData, defaultTab)}
    >
      {tabsData?.map(({ profile, newOsMinorVersion, systemCount }) => (
        <Tab
          aria-label={`Rules for RHEL ${profile.osMajorVersion}.${
            profile.osMinorVersion || newOsMinorVersion
          }`}
          key={eventKey(profile, newOsMinorVersion)}
          eventKey={eventKey(profile, newOsMinorVersion)}
          title={
            <span>
              <span className="pf-v5-u-pr-sm">
                <OsVersionText
                  profile={profile}
                  newOsMinorVersion={newOsMinorVersion}
                />
              </span>
              <Badge isRead>{systemCount}</Badge>
            </span>
          }
          ouiaId={`RHEL ${profile.osMajorVersion}.${
            profile.osMinorVersion || newOsMinorVersion
          }`}
        >
          <ProfileTabContent
            {...{
              profile,
              newOsMinorVersion,
              columns,
              rulesTableProps,
              systemCount,
              selectedRuleRefIds: selectedRuleRefIdsForTab(
                selectedRuleRefIds,
                profile,
                newOsMinorVersion
              ),
              handleSelect: setSelectedRuleRefIds ? handleSelect : undefined,
              setRuleValues,
              ruleValues,
              onRuleValueReset,
              resetLink: resetLink,
              rulesPageLink: rulesPageLink,
            }}
          />
        </Tab>
      ))}
    </RoutedTabs>
  );
};

TabbedRules.propTypes = {
  tabsData: propTypes.arrayOf(
    propTypes.shape({
      profile: propTypes.object.isRequired,
      selectedRuleRefIds: propTypes.arrayOf(propTypes.string),
      newOsMinorVersion: propTypes.string,
      systemCount: propTypes.number,
    })
  ).isRequired,
  selectedRuleRefIds: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      ruleRefIds: propTypes.arrayOf(propTypes.string),
    })
  ),
  setSelectedRuleRefIds: propTypes.func,
  columns: propTypes.arrayOf(propTypes.object),
  defaultTab: propTypes.shape({
    id: propTypes.string,
    osMinorVersion: propTypes.string,
  }),
  level: propTypes.number,
  ouiaId: propTypes.string,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  onRuleValueReset: propTypes.func,
};

export default TabbedRules;
