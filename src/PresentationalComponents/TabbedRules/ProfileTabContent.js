import React from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
    Text, TextVariants, TextContent, Grid, Spinner, Label
} from '@patternfly/react-core';
import SystemRulesTable from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import { pluralize } from 'Utilities/TextHelper';
import OsVersionText from './OsVersionText';

const ProfileSystemCount = ({ profile, counts = [] }) => {
    if (counts.lenght > 0) {
        const minorVersion = (profile.osMinorVersion || profile?.benchmark?.latestSupportedOsMinorVersions[0]);
        const count = (counts.find((count) => (parseInt(count.osMinorVersion) === parseInt(minorVersion)))).count;

        return <Label>{ count } { pluralize(count, 'system') }</Label>;
    } else { return ''; }
};

ProfileSystemCount.propTypes = {
    profile: propTypes.object,
    counts: propTypes.object
};

const BENCHMARK_QUERY = gql`
query benchmarkQuery($id: String!) {
    benchmark(id: $id) {
        id
        osMajorVersion
        latestSupportedOsMinorVersions
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
`;

const ProfileTabContent = ({ profile, columns, handleSelect, systemsCounts, selectedRuleRefIds, rulesTableProps }) => {
    const { data: benchmark, error, loading } = useQuery(BENCHMARK_QUERY, {
        variables: {
            id: profile.benchmark.id
        },
        skip: ((profile?.benchmark?.rules || []).length > 0)
    });

    return <React.Fragment>
        <Grid>
            <TextContent>
                <Text component={ TextVariants.h4 }>
                    <OsVersionText profile={ profile } />
                    <ProfileSystemCount profile={ profile } counts={ systemsCounts } />
                </Text>
                <Text component={ TextVariants.p }>
                    SSG version { profile.ssgVersion }
                </Text>
            </TextContent>
        </Grid>
        <StateViewWithError stateValues={ { error, loading, benchmark } }>
            <StateViewPart stateKey="loading">
                <Spinner />
            </StateViewPart>
            <StateViewPart stateKey="benchmark">

                <SystemRulesTable
                    remediationsEnabled={false}
                    columns={ columns }
                    profileRules={ [{ profile, rules: (benchmark?.benchmark.rules || []) }] }
                    selectedRefIds={ selectedRuleRefIds }
                    handleSelect={
                        handleSelect
                        && ((selectedRuleRefIds) => handleSelect(profile, selectedRuleRefIds))
                    }
                    { ...rulesTableProps } />

            </StateViewPart>
        </StateViewWithError>
    </React.Fragment>;
};

ProfileTabContent.propTypes = {
    profile: propTypes.object,
    columns: propTypes.array,
    handleSelect: propTypes.func,
    systemsCounts: propTypes.object,
    selectedRuleRefIds: propTypes.object,
    rulesTableProps: propTypes.object
};

export default ProfileTabContent;
