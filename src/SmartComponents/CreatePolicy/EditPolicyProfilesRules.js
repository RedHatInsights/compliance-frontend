import React, { useLayoutEffect } from 'react';
import {
  propTypes as reduxFormPropTypes,
  formValueSelector,
  reduxForm,
} from 'redux-form';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  Title,
  Text,
  TextContent,
  TextVariants,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import {
  TabbedRules,
  profilesWithRulesToSelection,
  tabsDataToOsMinorMap,
  extendProfilesByOsMinor,
} from 'PresentationalComponents/TabbedRules';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';

const PROFILES_QUERY = gql`
  query Profiles($filter: String!) {
    profiles(search: $filter) {
      edges {
        node {
          id
          name
          refId
          osMinorVersion
          osMajorVersion
          policy {
            id
          }
          policyType
          benchmark {
            id
            refId
            latestSupportedOsMinorVersions
            osMajorVersion
          }
          ssgVersion
          rules {
            id
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
          }
        }
      }
    }
  }
`;

const BENCHMARKS_QUERY = gql`
  query Benchmarks($filter: String!) {
    benchmarks(search: $filter) {
      nodes {
        id
        latestSupportedOsMinorVersions
        profiles {
          id
          refId
          osMajorVersion
          ssgVersion
        }
      }
    }
  }
`;

const getBenchmarkProfile = (benchmark, profileRefId) =>
  benchmark.profiles.find(
    (benchmarkProfile) => benchmarkProfile.refId === profileRefId
  );

const getBenchmarkBySupportedOsMinor = (benchmarks, osMinorVersion) =>
  benchmarks.find((benchmark) =>
    benchmark.latestSupportedOsMinorVersions?.includes(osMinorVersion)
  );

export const EditPolicyProfilesRules = ({
  policy,
  selectedRuleRefIds,
  change,
  osMajorVersion,
  osMinorVersionCounts,
}) => {
  const columns = [Columns.Name, Columns.Severity, Columns.Ansible];
  const osMinorVersions = osMinorVersionCounts
    .map((i) => i.osMinorVersion)
    .sort();
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

  let tabsData = osMinorVersionCounts.map(
    ({ osMinorVersion, count: systemCount }) => {
      osMinorVersion = `${osMinorVersion}`;
      let profile;
      if (benchmarks) {
        const benchmark = getBenchmarkBySupportedOsMinor(
          benchmarks,
          osMinorVersion
        );
        if (benchmark) {
          profile = getBenchmarkProfile(benchmark, policy.refId);
          if (profile) {
            profile = {
              ...profile,
              benchmark,
            };
          }
        }
      }

      return {
        profile,
        systemCount,
        newOsMinorVersion: osMinorVersion,
      };
    }
  );
  tabsData = tabsData.filter(({ profile }) => !!profile);

  const profileToOsMinorMap = tabsDataToOsMinorMap(tabsData);
  const profileIds = Object.keys(profileToOsMinorMap);
  const filter = profileIds.map((i) => `id = ${i}`).join(' OR ');
  const skipProfilesQuery = benchmarksLoading || filter.length === 0;
  const {
    data: profilesData,
    error: profilesError,
    loading: profilesLoading,
  } = useQuery(PROFILES_QUERY, {
    variables: {
      filter,
    },
    skip: skipProfilesQuery,
  });
  const error = benchmarksError || profilesError;
  const dataState = profileIds?.length > 0 ? profilesData : undefined;
  const loadingState = profilesLoading || benchmarksLoading ? true : undefined;
  const noRuleSets = !error && !loadingState && profileIds?.length === 0;
  const profiles = skipProfilesQuery
    ? []
    : profilesData?.profiles.edges.map((p) => p.node);

  const setSelectedRuleRefIds = (newSelection) => {
    change('selectedRuleRefIds', newSelection);
  };

  useLayoutEffect(() => {
    if (!loadingState) {
      const profilesWithOs = extendProfilesByOsMinor(
        profiles,
        profileToOsMinorMap
      );
      const newSelection = profilesWithRulesToSelection(
        profilesWithOs,
        selectedRuleRefIds,
        { only: true }
      );
      setSelectedRuleRefIds(newSelection);
    }
  }, [profiles, loadingState]);

  return (
    <React.Fragment>
      <TextContent className="pf-u-pb-md">
        <Text component={TextVariants.h1}>Rules</Text>
        <Text>
          Customize your <b>{policy.name}</b> SCAP policy by including and
          excluding rules.
        </Text>
        <Text>
          Each release of RHEL is supported with a unique and specific version
          of the SCAP Security Guide (SSG). You must customize each version of
          SSG for each release of RHEL.
        </Text>
      </TextContent>

      <StateViewWithError
        stateValues={{
          error,
          data: dataState,
          loading: loadingState,
          noRuleSets,
        }}
      >
        <StateViewPart stateKey="noRuleSets">
          <EmptyState>
            <Title headingLevel="h1" size="xl">
              No rules can be configured
            </Title>
            <EmptyStateBody>
              The policy type selected does not exist for the systems and OS
              versions selected in the previous steps.
            </EmptyStateBody>
          </EmptyState>
        </StateViewPart>
        <StateViewPart stateKey="loading">
          <EmptyTable>
            <Spinner />
          </EmptyTable>
        </StateViewPart>
        <StateViewPart stateKey="data">
          <TabbedRules
            tabsData={tabsData}
            selectedRuleRefIds={selectedRuleRefIds}
            columns={columns}
            remediationsEnabled={false}
            selectedFilter
            level={1}
            setSelectedRuleRefIds={setSelectedRuleRefIds}
            ouiaId="RHELVersions"
          />
        </StateViewPart>
      </StateViewWithError>
    </React.Fragment>
  );
};

EditPolicyProfilesRules.propTypes = {
  policy: propTypes.object,
  change: reduxFormPropTypes.change,
  osMajorVersion: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    })
  ),
  selectedRuleRefIds: propTypes.array,
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    policy: JSON.parse(selector(state, 'profile')),
    osMajorVersion: selector(state, 'osMajorVersion'),
    osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
    selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(EditPolicyProfilesRules);
