import React from 'react';
import propTypes from 'prop-types';
import { Badge, Flex, FlexItem, Spinner, Tab } from '@patternfly/react-core';
import {
  RoutedTabs,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import OsVersionText from './osVersionText';
import TailoringTab from './components/TailoringTab';
import { eventKey } from './helpers';
import NoTailorings from './NoTailorings';

// TODO Systems count on tabs -> may need API change
// TODO defaultTab  defaultTab={getDefaultTab(tailorings, defaultTab)}

/**
 * This component is used to show either a specific policy an it's tailorings,
 * or a specific security guide and specific profiles,
 * or a specific policy with it's existing tailorings and the default ruleset from the security guide for a specified set of minor OS versions.
 *
 *  @param   {object}             [props]                                React component props
 *  @param   {object}             [props.policy]                         A policy object from the API
 *  @param   {string}             [props.policy.id]                      The id used to fetch the tailorings associated with it
 *  @param   {string}             [props.profiles]                       An array of objects containing osMajorVersion, osMinorVersion, securityGuideId, profileId props for showing additional tabs.
 *  @param   {string}             [props.defaultTab]                     TODO
 *  @param   {Array}              [props.columns]                        An array of RulesTable columns
 *  @param   {number}             [props.level]                          Sets the level of the tab in the URL anchor
 *  @param   {string}             [props.ouiaId]                         OuiaId to pass to the PatternFly Table
 *  @param   {Function}           [props.onValueOverrideSave]            Callback function called when a value of a rule is saved
 *  @param   {Function}           [props.onSelect]                       Callback function called when any selection is made
 *  @param   {object}             [props.preselected]                    An object containing the preselection of rules for each tab
 *  @param   {boolean}            [props.enableSecurityGuideRulesToggle] Will enable the "Only Selected" toggle. When a policy with tailorings is shown and the toggle is enabled it will request rule data from the tailoring, with it disabled it will load rule data from the security guide. If a profile is provided it will load rules either from the profile, if the toggle is enabled, otherwise from the security guide.
 *  @param   {object}             [props.selectedVersionCounts]          An object containing minor version as a key and count as a value. Helps to render the system count badge in tab headers.
 *  @param   {object}             [props.valueOverrides]
 *  @param                        [props.rulesPageLink]
 *
 *  @param                        props.skipProfile
 *  @param                        props.additionalRules
 *  @returns {React.ReactElement}
 *
 *  @category Compliance
 *  @tutorial how-to-use-tailorings
 *
 */
const Tailorings = ({
  policy,
  profiles,
  defaultTab,
  columns,
  level = 0,
  ouiaId,
  rulesPageLink,
  onValueOverrideSave,
  onSelect,
  preselected,
  enableSecurityGuideRulesToggle,
  selectedVersionCounts,
  valueOverrides,
  skipProfile,
  additionalRules,
  ...rulesTableProps
}) => {
  const {
    data: tailoringsData,
    loading: tailoringsLoading,
    error: tailoringsError,
  } = useTailorings({
    params: {
      policyId: policy?.id,
      filter: 'NOT(null? os_minor_version)',
      sortBy: 'os_minor_version:desc',
    },
    skip: !policy,
  });

  const tabs = [
    ...(policy && tailoringsData?.data ? tailoringsData.data : []),
    ...(profiles?.map((profile) => ({
      ...profile,
      os_major_version: profile.osMajorVersion,
      os_minor_version: profile.osMinorVersion,
      // TODO this cam be done smarter. We can pass the properties for the tab directly here
      isSecurityGuide: true,
    })) || []),
  ];

  const onValueSave = (...valueParams) =>
    onValueOverrideSave?.(policy, ...valueParams);

  const onSelectTailoring = (...tabParams) => onSelect?.(policy, ...tabParams);

  return (
    <StateViewWithError
      stateValues={{
        error: tailoringsError,
        data: tabs && (tailoringsData || profiles),
        loading: tailoringsLoading,
      }}
    >
      <StateViewPart stateKey="loading">
        <Spinner />
      </StateViewPart>
      <StateViewPart stateKey="data">
        {tabs.length > 0 ? (
          <RoutedTabs
            ouiaId={ouiaId}
            level={level}
            defaultTab={eventKey(tabs[0])}
          >
            {tabs?.map((tab) => (
              <Tab
                key={eventKey(tab)}
                eventKey={eventKey(tab)}
                aria-label={`Rules for RHEL ${tab.os_major_version}.${tab.os_minor_version}`}
                title={
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <OsVersionText
                        profile={{
                          osMajorVersion: tab.os_major_version,
                          osMinorVersion: tab.os_minor_version,
                        }}
                      />
                    </FlexItem>
                    {selectedVersionCounts?.[tab.os_minor_version] && (
                      <FlexItem>
                        <Badge isRead>
                          {selectedVersionCounts[tab.os_minor_version]}
                        </Badge>
                      </FlexItem>
                    )}
                  </Flex>
                }
                ouiaId={`RHEL ${tab.os_major_version}.${tab.os_minor_version}`}
              >
                <TailoringTab
                  {...{
                    ...(tab.isSecurityGuide
                      ? {
                          securityGuideId: tab.securityGuideId,
                          profileId: tab.profileId,
                          osMajorVersion: tab.os_major_version,
                          osMinorVersion: tab.os_minor_version,
                        }
                      : { policy, tailoring: tab }),
                    columns,
                    enableSecurityGuideRulesToggle,
                    rulesTableProps,
                    skipProfile,
                    onValueOverrideSave: onValueSave,
                    ...(onSelect ? { onSelect: onSelectTailoring } : {}),
                    preselected:
                      preselected?.[tab.id] ||
                      preselected?.[tab.os_minor_version],
                    additionalRules:
                      additionalRules?.[tab.id] ||
                      additionalRules?.[tab.os_minor_version],
                    rulesPageLink: rulesPageLink,
                    valueOverrides: valueOverrides?.[tab.os_minor_version],
                  }}
                />
              </Tab>
            ))}
          </RoutedTabs>
        ) : (
          <NoTailorings policy={policy} columns={columns} />
        )}
      </StateViewPart>
    </StateViewWithError>
  );
};

Tailorings.propTypes = {
  columns: propTypes.arrayOf(propTypes.object),
  policy: propTypes.shape({
    id: propTypes.string,
  }),
  profiles: propTypes.arrayOf(
    propTypes.shape({
      osMajorVersion: propTypes.string,
      osMinorVersion: propTypes.string,
      securityGuideId: propTypes.string,
      profileId: propTypes.string,
    })
  ),
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
  onValueOverrideSave: propTypes.func,
  onSelect: propTypes.func,
  preselected: propTypes.object,
  enableSecurityGuideRulesToggle: propTypes.bool,
  selectedVersionCounts: propTypes.object,
  valueOverrides: propTypes.object,
  skipProfile: propTypes.string,
  additionalRules: propTypes.object,
};

export default Tailorings;
