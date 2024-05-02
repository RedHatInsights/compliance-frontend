import React, { useEffect } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Text,
  TextContent,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import {
  TabbedRules,
  profilesWithRulesToSelection,
  tabsDataToOsMinorMap,
  extendProfilesByOsMinor,
} from 'PresentationalComponents/TabbedRules';
import { sortingByProp } from 'Utilities/helpers';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { BENCHMARKS_QUERY } from './constants';

const getBenchmarkBySupportedOsMinor = (benchmarks, osMinorVersion) =>
  benchmarks.find((benchmark) =>
    benchmark.latestSupportedOsMinorVersions?.includes(osMinorVersion)
  );

const getBenchmarkProfile = (benchmark, profileRefId) =>
  benchmark.profiles.find(
    (benchmarkProfile) => benchmarkProfile.refId === profileRefId
  );

const EditPolicyRulesTabEmptyState = () => (
  <EmptyState>
    <EmptyStateHeader
      titleText="No rules can be configured"
      headingLevel="h5"
    />
    <EmptyStateBody>
      This policy has no associated systems, and therefore no rules can be
      configured.
    </EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateBody>
        Add at least one system to configure rules for this policy.
      </EmptyStateBody>
    </EmptyStateFooter>
  </EmptyState>
);

export const toTabsData = (policy, osMinorVersionCounts, benchmarks) =>
  Object.values(osMinorVersionCounts)
    .sort(sortingByProp('osMinorVersion', 'desc'))
    .map(({ osMinorVersion, count: systemCount }) => {
      osMinorVersion = `${osMinorVersion}`;
      let profile = policy.policy.profiles.find(
        (profile) => profile.osMinorVersion === osMinorVersion
      );
      let osMajorVersion = policy.osMajorVersion;

      if (!profile && benchmarks) {
        const benchmark = getBenchmarkBySupportedOsMinor(
          benchmarks,
          osMinorVersion
        );
        if (benchmark) {
          const benchmarkProfile = getBenchmarkProfile(benchmark, policy.refId);
          if (benchmarkProfile) {
            profile = policy.policy.profiles.find(
              (profile) =>
                profile.parentProfileId === benchmarkProfile.id &&
                profile.osMinorVersion === osMinorVersion
            );

            profile = {
              ...benchmarkProfile,
              benchmark,
              osMajorVersion,
              ...profile,
            };
          }
        }
      }

      return {
        profile,
        systemCount,
        newOsMinorVersion: osMinorVersion,
      };
    })
    .filter(({ profile, newOsMinorVersion }) => !!profile && newOsMinorVersion);

export const EditPolicyRulesTab = ({
  policy,
  selectedRuleRefIds,
  setSelectedRuleRefIds,
  osMinorVersionCounts,
  setRuleValues,
  ruleValues: ruleValuesProp,
}) => {
  const osMajorVersion = policy?.osMajorVersion;
  const osMinorVersions = Object.keys(osMinorVersionCounts).sort();
  const benchmarkSearch =
    `os_major_version = ${osMajorVersion} ` +
    `and latest_supported_os_minor_version ^ "${osMinorVersions.join(',')}"`;

  const {
    data: benchmarksData,
    error,
    loading,
  } = useQuery(BENCHMARKS_QUERY, {
    variables: {
      filter: benchmarkSearch,
    },
    skip: osMinorVersions.length === 0,
  });

  const benchmarks = benchmarksData?.benchmarks?.nodes;

  const tabsData = toTabsData(policy, osMinorVersionCounts, benchmarks);
  const profileToOsMinorMap = tabsDataToOsMinorMap(tabsData);

  const dataState = !loading && tabsData?.length > 0 ? tabsData : undefined;

  useEffect(() => {
    if (policy.policy.profiles) {
      const profiles = policy.policy.profiles;
      const profilesWithOs = extendProfilesByOsMinor(
        profiles,
        profileToOsMinorMap
      );
      setSelectedRuleRefIds((prevSelection) => {
        const newSelection = profilesWithRulesToSelection(
          profilesWithOs,
          prevSelection
        );
        return newSelection;
      });
    }
  }, [policy.policy.profiles]);

  const ruleValues = (policy) => {
    const mergeValues = (policyId, values) => {
      return {
        ...values,
        ...(ruleValuesProp?.[policyId] || {}),
      };
    };

    return Object.fromEntries(
      policy?.policy?.profiles?.map(
        ({ id, values, benchmark: { valueDefinitions } }) => [
          id,
          mergeValues(id, values, valueDefinitions),
        ]
      ) || []
    );
  };

  return (
    <StateViewWithError
      stateValues={{
        error,
        data: !error && dataState,
        loading,
        empty: !loading && !dataState && !error,
      }}
    >
      <StateViewPart stateKey="loading">
        <EmptyState>
          <Spinner />
        </EmptyState>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <TextContent>
          <Text>
            Different release versions of RHEL are associated with different
            versions of the SCAP Security Guide (SSG), therefore each release
            must be customized independently.
          </Text>
        </TextContent>
        {tabsData.length > 0 && (
          <TabbedRules
            resetLink
            rulesPageLink
            selectedFilter
            remediationsEnabled={false}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            tabsData={tabsData}
            ruleValues={ruleValues(policy)}
            selectedRuleRefIds={selectedRuleRefIds}
            setSelectedRuleRefIds={setSelectedRuleRefIds}
            setRuleValues={setRuleValues}
            level={1}
            ouiaId="RHELVersions"
          />
        )}
      </StateViewPart>
      <StateViewPart stateKey="empty">
        <EditPolicyRulesTabEmptyState />
      </StateViewPart>
    </StateViewWithError>
  );
};

EditPolicyRulesTab.propTypes = {
  setNewRuleTabs: propTypes.func,
  policy: propTypes.object,
  osMinorVersionCounts: propTypes.shape({
    osMinorVersion: propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    }),
  }),
  selectedRuleRefIds: propTypes.array,
  setSelectedRuleRefIds: propTypes.func,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
};

export default EditPolicyRulesTab;
