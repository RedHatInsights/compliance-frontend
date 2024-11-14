import React from 'react';
import propTypes from 'prop-types';
import { Spinner, Tab } from '@patternfly/react-core';
import {
  RoutedTabs,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import OsVersionText from '../TabbedRules/OsVersionText';
import TailoringTab from './components/TailoringTab';
import { eventKey } from './helpers';

// TODO Systems count on tabs -> may need API change
// TODO defaultTab  defaultTab={getDefaultTab(tailorings, defaultTab)}

/**
 * This component is used to show either the tailorings with rules of a specific policy,
 * or the rules of a specific security guide and it's rules for a set of minor OS versions
 *
 *  @param   {object}             [props]
 *  @param   {object}             [props.policy]                         A policy object from the API
 *  @param   {string}             [props.profiles]
 *  @param   {string}             [props.defaultTab]                     TODO
 *  @param   {Array}              [props.columns]                        An array of RulesTable columns
 *  @param   {number}             [props.level]                          TODO
 *  @param   {string}             [props.ouiaId]                         OuiaId to pass to the PatternFly Table
 *  @param   {Function}           [props.onValueOverrideSave]            Callback function called when a value of a rule is saved
 *  @param   {Function}           [props.onSelect]                       Callback function called when any selection is made
 *  @param   {object}             [props.preselected]                    An object containing the preselection of rules for each tab
 *  @param   {boolean}            [props.enableSecurityGuideRulesToggle] Will enable the "Only Selected" toggle. When a policy with tailorings is shown and the toggle is enabled it will request rule data from the tailoring, with it disabled it will load rule data from the security guide. If a profile is provided it will load rules either from the profile, if the toggle is enabled, otherwise from the security guide.
 *
 *  @returns {React.ReactElement}
 *
 *  @category Compliance
 *
 *
 *  @example
 *
 *  // Will show the tailorings of a policy
 *
 *  <Tailorings
 *   ouiaId="RHELVersions"
 *   columns={[
 *     Columns.Name,
 *     Columns.Severity,
 *     Columns.Remediation,
 *   ]}
 *   policy={policy}
 * />
 *
 *  // Will show the tailorings of a policy and an additional tab for another OS minor version to show
 *
 *  <Tailorings
 *   ouiaId="RHELVersions"
 *   columns={[
 *     Columns.Name,
 *     Columns.Severity,
 *     Columns.Remediation,
 *   ]}
 *   policy={policy}
 *   osMinorVersions={[9,10]}
 * />
 *
 *  // Will show tabs with rules from the security guide and the specified OS minor versions
 *
 *  <Tailorings
 *   ouiaId="RHELVersions"
 *   columns={[
 *     Columns.Name,
 *     Columns.Severity,
 *     Columns.Remediation,
 *   ]}
 *   securityGuideId={'ffff-ffff-fffff'}
 *   osMinorVersions={[9,10]}
 * />
 *
 *  // Will show tabs with rules from the security guide and the specified OS minor versions
 *  // and preselect rules with the IDs provided in preselected. The key can also be a tailorings ID
 *
 *  <Tailorings
 *   ouiaId="RHELVersions"
 *   columns={[
 *     Columns.Name,
 *     Columns.Severity,
 *     Columns.Remediation,
 *   ]}
 *   profileRefId={XYZ}
 *   osMinorVersions={{
 *     9: 'ffff-ffff-fffff',
 *    10: 'eeeee-eeeee-eeeeef',
 *   }}
 *   preselected={{
 *     "9": ['RULE_ID1', 'RULE_ID2']
 *     "10": ['RULE_ID11', 'RULE_ID5']
 *   }}
 * />
 *
 *
 */
const Tailorings = ({
  policy,
  profiles,
  defaultTab,
  columns,
  level = 0,
  ouiaId,
  onValueOverrideSave,
  onSelect,
  preselected,
  enableSecurityGuideRulesToggle,
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
    },
    skip: !policy,
  });

  const tabs = [
    ...(policy && tailoringsData?.data ? tailoringsData.data : []),
    ...(profiles?.map((profile) => ({
      ...profile,
      os_major_version: profile.osMajorVersion,
      os_minor_version: profile.osMinorVersion,
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
        data: tabs,
        loading: tailoringsLoading,
      }}
    >
      <StateViewPart stateKey="loading">
        <Spinner />
      </StateViewPart>
      <StateViewPart stateKey="data">
        {tabs.length > 0 && (
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
                  <OsVersionText
                    profile={{
                      osMajorVersion: tab.os_major_version,
                      osMinorVersion: tab.os_minor_version,
                    }}
                  />
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
                    onValueOverrideSave: onValueSave,
                    ...(onSelect ? { onSelect: onSelectTailoring } : {}),
                    preselected:
                      preselected?.[tab.id] ||
                      preselected?.[tab.os_minor_version],
                  }}
                />
              </Tab>
            ))}
          </RoutedTabs>
        )}
      </StateViewPart>
    </StateViewWithError>
  );
};

Tailorings.propTypes = {
  columns: propTypes.arrayOf(propTypes.object),
  policy: propTypes.object,
  profiles: propTypes.array,
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
};

export default Tailorings;
