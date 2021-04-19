import React, { useLayoutEffect } from 'react';
import {
    EmptyState, EmptyStateBody, Text, TextContent, Title
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { StateViewWithError, StateViewPart, TabbedRules } from 'PresentationalComponents';
import useCollection from 'Utilities/hooks/api/useCollection';
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

const EditPolicyRulesTab = ({ handleSelect, policy, selectedRuleRefIds, osMinorVersionCounts }) => {
    const osMajorVersion = policy?.osMajorVersion;
    const osMinorVersions = Object.keys(osMinorVersionCounts).sort();
    const benchmarkSearch = `os_major_version = ${ osMajorVersion } ` +
        `and latest_supported_os_minor_version ^ "${ osMinorVersions.join(',') }"`;

    const { data: benchmarks, loading: benchmarksLoading } = useCollection('benchmarks', {
        type: 'benchmark',
        include: ['profiles'],
        params: { search: benchmarkSearch },
        skip: osMinorVersions.length === 0
    }, [benchmarkSearch]);

    let profileIds = [];
    let tabsData = Object.values(osMinorVersionCounts).sort(
        sortingByProp('osMinorVersion', 'desc')
    ).map(({ osMinorVersion, count: systemCount }) => {
        osMinorVersion = `${osMinorVersion}`;
        let profile = policy.policy.profiles.find((profile) => (profile.osMinorVersion === osMinorVersion));

        if (!profile && benchmarks) {
            const benchmark = getBenchmarkBySupportedOsMinor(benchmarks.collection, osMinorVersion);
            if (benchmark) {
                const benchmarkProfile = getBenchmarkProfile(benchmark, policy.refId);
                if (benchmarkProfile) {
                    profile = policy.policy.profiles.find((profile) => (profile.parentProfileId === benchmarkProfile.id));

                    profile = {
                        ...benchmarkProfile,
                        benchmark: benchmarkProfile.relationships?.benchmark?.data,
                        rules: benchmarkProfile.relationships?.rules?.data,
                        ...profile
                    };
                }
            }
        }

        return {
            profile,
            systemCount,
            newOsMinorVersion: osMinorVersion,
            selectedRuleRefIds: selectedRuleRefIds?.find(({ id }) => id === profile?.id)?.ruleRefIds
        };
    });
    tabsData = tabsData.filter(({ profile, newOsMinorVersion }) => !!profile && newOsMinorVersion);

    tabsData.forEach((tab) => (profileIds.push(tab.profile.id)));

    const filter = `${ (profileIds || []).map((i) => (`id = ${ i }`)).join(' OR ') }`;
    const { data: profilesData, error, loading } = useQuery(PROFILES_QUERY, {
        variables: {
            filter
        },
        skip: filter.length === 0
    });
    const loadingState = ((loading || benchmarksLoading) ? true : undefined);
    const dataState = ((!loadingState && tabsData?.length > 0) ? profilesData : undefined);

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

    return <StateViewWithError stateValues={ {
        error, data: dataState, loading: loadingState, empty: !loadingState && !dataState
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
