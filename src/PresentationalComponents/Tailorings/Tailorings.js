import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { Spinner, Tab } from '@patternfly/react-core';
import {
  RoutedTabs,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';

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
 *  @param   {object}             [props.policy]              A policy object from the API
 *  @param   {string}             [props.securityGuideId]     A security guide ID
 *  @param   {Array}              [props.osMinorVersions]     An array of OS minor versions to show the security guide rules for
 *  @param   {string}             [props.defaultTab]          TODO
 *  @param   {Array}              [props.columns]             An array of RulesTable columns
 *  @param   {number}             [props.level]               TODO
 *  @param   {string}             [props.ouiaId]
 *  @param   {Function}           [props.onValueOverrideSave] Callback function called when a value of a rule is saved
 *
 *  @param   {Function}           [props.onSelect]            Callback function called when any selection is made
 *  @param   {object}             [props.preselected]         An object containing the preselection of rules for each tab
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
 *   level={1}
 *   DedicatedAction={DedicatedAction}
 *   onValueOverrideSave={saveToPolicy}
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
 *   level={1}
 *   DedicatedAction={DedicatedAction}
 *   onValueOverrideSave={saveToPolicy}
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
 *   level={1}
 *   DedicatedAction={DedicatedAction}
 *   onValueOverrideSave={saveToPolicy}
 * />
 */
const Tailorings = ({
  policy,
  securityGuideId,
  osMinorVersions,
  defaultTab,
  columns,
  level = 0,
  ouiaId,
  onValueOverrideSave,
  onSelect,
  preselected,
  ...rulesTableProps
}) => {
  const {
    data: tailoringsData,
    loading: tailoringsLoading,
    error: tailoringsError,
  } = useTailorings({
    params: [
      policy?.id,
      undefined,
      undefined,
      undefined,
      undefined,
      'os_minor_version:desc',
      'NOT(null? os_minor_version)',
    ],
    skip: !policy,
  });

  const {
    data: securityGuide,
    loading: securityGuideLoading,
    error: securityGuideError,
  } = useSecurityGuide({
    params: [securityGuideId],
    skip: !securityGuideId,
  });

  const tabs = useMemo(() => {
    return [
      ...(policy && tailoringsData?.data ? tailoringsData.data : []),
      ...(securityGuideId && osMinorVersions && securityGuide
        ? osMinorVersions.map((osMinorVersion) => {
            return {
              ...(securityGuide?.data || {}),
              os_minor_version: osMinorVersion,
              os_major_version:
                policy?.osMajorVersion || securityGuide?.data?.os_major_version,
              isSecurityGuide: true,
            };
          })
        : []),
    ];
  }, [policy, securityGuideId, securityGuide, tailoringsData, osMinorVersions]);

  const onValueSave = (...valueParams) =>
    onValueOverrideSave?.(policy || securityGuideId, ...valueParams);

  const onSelectTailoring = (...tabParams) =>
    onSelect?.(policy || securityGuideId, ...tabParams);

  return (
    <StateViewWithError
      stateValues={{
        error: securityGuideError || tailoringsError,
        data: tabs,
        loading: securityGuideLoading || tailoringsLoading,
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
                          securityGuide: tab,
                          osMinorVersion: tab.os_minor_version,
                        }
                      : { policy, tailoring: tab }),
                    columns,
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
  policy: propTypes.object,
  osMinorVerions: propTypes.array,
  securityGuideId: propTypes.string,
  osMinorVersions: propTypes.array,
  selectedRuleRefIds: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      ruleRefIds: propTypes.arrayOf(propTypes.string),
    })
  ),
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
  onValueOverrideSave: propTypes.func,
  onSelect: propTypes.func,
  preselected: propTypes.object,
};

export default Tailorings;
