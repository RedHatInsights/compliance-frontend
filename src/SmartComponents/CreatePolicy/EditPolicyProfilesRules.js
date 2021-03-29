import React, { useLayoutEffect } from 'react';
import { propTypes as reduxFormPropTypes, formValueSelector, reduxForm } from 'redux-form';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { StateViewWithError, StateViewPart, TabbedRules } from 'PresentationalComponents';
import useCollection from 'Utilities/hooks/api/useCollection';

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

const getBenchmarkProfiles = (profileRefId, benchmarks) => (
    profileRefId && benchmarks ? benchmarks.flatMap((benchmark) => (
        benchmark.profiles.filter((benchmarkProfile) => (benchmarkProfile.refId === profileRefId))
    )) : []
);

export const EditPolicyProfilesRules = ({ profile, selectedRuleRefIds, change, osMajorVersion, osMinorVersionCounts }) => {
    const columns = selectRulesTableColumns(['Name', 'Severity', 'Ansible']);
    const handleSelectCallback = (profile, newSelectedRuleRefIds) => {
        const newSelection = selectedRuleRefIds.map((selectedProfile) => {
            if (selectedProfile.id === profile.id) {
                return {
                    ...selectedProfile,
                    selectedRuleRefIds: newSelectedRuleRefIds
                };
            } else {
                return selectedProfile;
            }
        });

        change('selectedRuleRefIds', newSelection);
    };

    const { data: benchmarks, loading: benchmarksLoading } = useCollection('benchmarks', {
        type: 'benchmark',
        include: ['profiles'],
        params: {
            search: `os_major_version = ${ osMajorVersion } ` +
                    `and latest_supported_os_minor_version ^ (${ osMinorVersionCounts.map((i) => (i.osMinorVersion)).join(',') })`
        }
    });

    const profiles = getBenchmarkProfiles(profile.refId, benchmarks?.collection);
    const profileIds = profiles?.map((profile) => (profile.id));
    const filter = `${ (profileIds || []).map((i) => (`id = ${ i }`)).join(' OR ') }`;
    const { data: profilesData, error, loading } = useQuery(PROFILES_QUERY, {
        variables: {
            filter
        },
        skip: filter.length === 0
    });
    const dataState = ((profileIds?.length > 0) ? profilesData : undefined);
    const loadingState = ((loading || benchmarksLoading) ? true : undefined);

    useLayoutEffect(() => {
        if (profilesData && !selectedRuleRefIds) {
            const profiles = profilesData?.profiles.edges.map((p) => (p.node));
            change('selectedRuleRefIds', profiles.map((profile) => ({
                ...profile,
                selectedRuleRefIds: profile.rules.map((rule) => (rule.refId))
            })));
        }
    }, [profilesData]);

    return <StateViewWithError stateValues={ { error, data: dataState, loading: loadingState } }>
        <StateViewPart stateKey="loading">
            <EmptyTable><Spinner/></EmptyTable>
        </StateViewPart>
        <StateViewPart stateKey="data">
            <TextContent>
                <Text component={TextVariants.h1}>
                    Rules
                </Text>
            </TextContent>
            <TextContent>
                <Text>
                    Edit your policy by including and excluding rules.
                </Text>
                <Text>
                    Selected policy type <strong>{ profile.name }</strong> has { profile.rules?.length } rules.&ensp;
                </Text>
            </TextContent>
            <TabbedRules
                profiles={ profilesData?.profiles.edges.map((p) => (p.node)) }
                selectedRuleRefIds={ selectedRuleRefIds }
                benchmarks={ benchmarks?.collection }
                columns={ columns }
                remediationsEnabled={ false }
                selectedFilter
                systemsCounts={ osMinorVersionCounts }
                level={ 1 }
                handleSelect={ handleSelectCallback } />
        </StateViewPart>
    </StateViewWithError>;
};

EditPolicyProfilesRules.propTypes = {
    profile: propTypes.object,
    change: reduxFormPropTypes.change,
    osMajorVersion: propTypes.string,
    osMinorVersionCounts: propTypes.arrayOf(propTypes.shape({
        osMinorVersion: propTypes.number,
        count: propTypes.number
    })),
    selectedRuleRefIds: propTypes.array
};

const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            profile: JSON.parse(selector(state, 'profile')),
            osMajorVersion: selector(state, 'osMajorVersion'),
            osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
            selectedRuleRefIds: selector(state, 'selectedRuleRefIds')
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicyProfilesRules);
