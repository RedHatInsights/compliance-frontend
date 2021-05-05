import React, { useLayoutEffect } from 'react';
import {
    EmptyState, EmptyStateBody, Text, TextContent, Title
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { StateViewWithError, StateViewPart, TabbedRules } from 'PresentationalComponents';
import { sortingByProp } from 'Utilities/helpers';

const PROFILES_QUERY = gql`
query Profiles($filter: String!){
    profiles(search: $filter){
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
query Benchmarks($filter: String!){
    benchmarks(search: $filter){
        nodes {
            id
            latestSupportedOsMinorVersions
            profiles {
                id
                refId
                ssgVersion
            }
        }
    }
}
`;

const getBenchmarkBySupportedOsMinor = (benchmarks, osMinorVersion) => (
    benchmarks.find((benchmark) =>
        benchmark.latestSupportedOsMinorVersions?.includes(osMinorVersion)
    )
);

const getBenchmarkProfile = (benchmark, profileRefId) => (
    benchmark.profiles.find((benchmarkProfile) => (benchmarkProfile.refId === profileRefId))
);

const EditPolicyRulesTabEmptyState = () => <EmptyState>
    <Title headingLevel="h5" size="lg">
        No rules can be configured
    </Title>
    <EmptyStateBody>
        This policy has no associated systems, and therefore no rules can be configured.
    </EmptyStateBody>
    <EmptyStateBody>
        Add at least one system to configure rules for this policy.
    </EmptyStateBody>
</EmptyState>;

export const toTabsData = (policy, osMinorVersionCounts, benchmarks) => (
    Object.values(osMinorVersionCounts).sort(
        sortingByProp('osMinorVersion', 'desc')
    ).map(({ osMinorVersion, count: systemCount }) => {
        osMinorVersion = `${osMinorVersion}`;
        let profile = policy.policy.profiles.find((profile) => (profile.osMinorVersion === osMinorVersion));
        let osMajorVersion = policy.osMajorVersion;

        if (!profile && benchmarks) {
            const benchmark = getBenchmarkBySupportedOsMinor(benchmarks, osMinorVersion);
            if (benchmark) {
                const benchmarkProfile = getBenchmarkProfile(benchmark, policy.refId);
                if (benchmarkProfile) {
                    profile = policy.policy.profiles.find((profile) => (profile.parentProfileId === benchmarkProfile.id));

                    profile = {
                        ...benchmarkProfile,
                        benchmark,
                        osMajorVersion,
                        ...profile
                    };
                }
            }
        }

        return {
            profile,
            systemCount,
            newOsMinorVersion: osMinorVersion
        };
    }).filter(({ profile, newOsMinorVersion }) => !!profile && newOsMinorVersion)
);

export const EditPolicyRulesTab = ({ handleSelect, policy, selectedRuleRefIds, osMinorVersionCounts, setNewRuleTabs }) => {
    const osMajorVersion = policy?.osMajorVersion;
    const osMinorVersions = Object.keys(osMinorVersionCounts).sort();
    const benchmarkSearch = `os_major_version = ${ osMajorVersion } ` +
        `and latest_supported_os_minor_version ^ "${ osMinorVersions.join(',') }"`;

    const {
        data: benchmarksData,
        error: benchmarksError,
        loading: benchmarksLoading
    } = useQuery(BENCHMARKS_QUERY, {
        variables: {
            filter: benchmarkSearch
        },
        skip: osMinorVersions.length === 0
    });

    const benchmarks = benchmarksData?.benchmarks?.nodes;

    const tabsData = toTabsData(policy, osMinorVersionCounts, benchmarks);
    const profileIds = tabsData.map((tab) => (tab.profile.id));
    const filter = `${ (profileIds || []).map((i) => (`id = ${ i }`)).join(' OR ') }`;
    const {
        data: profilesData, error: profilesError, loading: profilesLoading
    } = useQuery(PROFILES_QUERY, {
        variables: {
            filter
        },
        skip: filter.length === 0
    });
    const loadingState = ((profilesLoading || benchmarksLoading) ? true : undefined);
    const dataState = ((!loadingState && tabsData?.length > 0) ? profilesData : undefined);

    if (!loadingState) {
        setNewRuleTabs(!!tabsData.find(tab => (
            policy.policy.profiles.find(profile => (
                profile.osMinorVersion !== tab.newOsMinorVersion
            ))
        )));
    }

    useLayoutEffect(() => {
        if (profilesData) {
            const profiles = profilesData?.profiles.edges.map((p) => (p.node)) || [];
            profiles.forEach((profile) => {
                const foundSelection = selectedRuleRefIds?.find(({ id }) => id === profile?.id);
                if (!foundSelection) {
                    const refIds = profile.rules.map((rule) => (rule.refId));
                    handleSelect(profile, refIds);
                }
            });
        }
    }, [profilesData]);
    const error = benchmarksError || profilesError;

    return <StateViewWithError stateValues={ {
        error,
        data: !error && dataState,
        loading: loadingState,
        empty: !loadingState && !dataState && !error
    } }>
        <StateViewPart stateKey="loading">
            <EmptyTable><Spinner/></EmptyTable>
        </StateViewPart>
        <StateViewPart stateKey="data">
            <TextContent>
                <Text>
                    Different release versions of RHEL are associated with different versions of
                    the SCAP Security Guide (SSG), therefore each release must be customized independently.
                </Text>
            </TextContent>
            <TabbedRules
                tabsData={ tabsData }
                selectedRuleRefIds={ selectedRuleRefIds }
                remediationsEnabled={ false }
                selectedFilter
                level={ 1 }
                handleSelect={ handleSelect } />
        </StateViewPart>
        <StateViewPart stateKey="empty">
            <EditPolicyRulesTabEmptyState />
        </StateViewPart>
    </StateViewWithError>;
};

EditPolicyRulesTab.propTypes = {
    handleSelect: propTypes.func,
    setNewRuleTabs: propTypes.func,
    policy: propTypes.object,
    osMinorVersionCounts: propTypes.shape({
        osMinorVersion: propTypes.shape({
            osMinorVersion: propTypes.number,
            count: propTypes.number
        })
    }),
    selectedRuleRefIds: propTypes.array
};

export default EditPolicyRulesTab;
