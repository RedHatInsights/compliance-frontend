import React, { useEffect } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
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
import { BENCHMARKS_QUERY, PROFILES_QUERY } from './constants';

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
    <Title headingLevel="h5" size="lg">
      No rules can be configured
    </Title>
    <EmptyStateBody>
      This policy has no associated systems, and therefore no rules can be
      configured.
    </EmptyStateBody>
    <EmptyStateBody>
      Add at least one system to configure rules for this policy.
    </EmptyStateBody>
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
}) => {
  const osMajorVersion = policy?.osMajorVersion;
  const osMinorVersions = Object.keys(osMinorVersionCounts).sort();
  const benchmarkSearch =
    `os_major_version = ${osMajorVersion} ` +
    `and latest_supported_os_minor_version ^ "${osMinorVersions.join(',')}"`;

  const {
    data: benchmarksData,
    error: benchmarksError,
    loading: benchmarksLoading,
  } = useQuery(BENCHMARKS_QUERY, {
    variables: {
      filter: benchmarkSearch,
    },
    skip: osMinorVersions.length === 0,
  });

  const benchmarks = benchmarksData?.benchmarks?.nodes;

  const tabsData = toTabsData(policy, osMinorVersionCounts, benchmarks);
  const profileToOsMinorMap = tabsDataToOsMinorMap(tabsData);
  const filter = Object.keys(profileToOsMinorMap)
    .map((i) => `id = ${i}`)
    .join(' OR ');
  const {
    data: profilesData,
    error: profilesError,
    loading: profilesLoading,
  } = useQuery(PROFILES_QUERY, {
    variables: {
      filter,
    },
    skip: filter.length === 0,
  });
  const loadingState = profilesLoading || benchmarksLoading ? true : undefined;
  const dataState =
    !loadingState && tabsData?.length > 0 ? profilesData : undefined;

  useEffect(() => {
    if (profilesData) {
      const profiles = profilesData?.profiles.edges.map((p) => p.node) || [];
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
  }, [profilesData]);
  const error = benchmarksError || profilesError;

  return (
    <StateViewWithError
      stateValues={{
        error,
        data: !error && dataState,
        loading: loadingState,
        empty: !loadingState && !dataState && !error,
      }}
    >
      <StateViewPart stateKey="loading">
        <EmptyTable>
          <Spinner />
        </EmptyTable>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <TextContent>
          <Text>
            Different release versions of RHEL are associated with different
            versions of the SCAP Security Guide (SSG), therefore each release
            must be customized independently.
          </Text>
        </TextContent>
        <TabbedRules
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          tabsData={tabsData}
          selectedRuleRefIds={selectedRuleRefIds}
          setSelectedRuleRefIds={setSelectedRuleRefIds}
          remediationsEnabled={false}
          selectedFilter
          level={1}
          ouiaId="RHELVersions"
        />
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
};

export default EditPolicyRulesTab;
