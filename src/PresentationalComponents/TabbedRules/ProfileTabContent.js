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

const ProfileSystemCount = ({ count = 0 }) => (
    <Label>
        { `${count} ${ pluralize(count, 'system')}` }
    </Label>
);

ProfileSystemCount.propTypes = {
    profile: propTypes.object,
    count: propTypes.number
};

const BENCHMARK_QUERY = gql`
query benchmarkQuery($id: String!) {
    benchmark(id: $id) {
        id
        osMajorVersion
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

const ProfileTabContent = ({
    profile, columns, handleSelect, systemCount, selectedRuleRefIds, rulesTableProps, newOsMinorVersion
}) => {
    const { data: benchmark, error, loading } = useQuery(BENCHMARK_QUERY, {
        variables: {
            id: profile.benchmark.id
        },
        skip: !handleSelect || !profile.benchmark?.id
    });
    const rules = handleSelect ? benchmark?.benchmark?.rules : profile?.rules;

    return <React.Fragment>
        <Grid>
            <TextContent>
                <Text component={ TextVariants.h4 }>
                    <OsVersionText profile={ profile } newOsMinorVersion={ newOsMinorVersion} />
                    {' '}
                    <ProfileSystemCount count={ systemCount } />
                </Text>
                <Text component={ TextVariants.p }>
                    SSG version { profile.ssgVersion }
                </Text>
            </TextContent>
        </Grid>
        <StateViewWithError stateValues={ { error, loading, rules } }>
            <StateViewPart stateKey="loading">
                <Spinner />
            </StateViewPart>
            <StateViewPart stateKey="rules">

                <SystemRulesTable
                    remediationsEnabled={false}
                    columns={ columns }
                    profileRules={ [{ profile, rules: (rules || []) }] }
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
    newOsMinorVersion: propTypes.string,
    columns: propTypes.array,
    handleSelect: propTypes.func,
    systemCount: propTypes.object,
    selectedRuleRefIds: propTypes.object,
    rulesTableProps: propTypes.object
};

export default ProfileTabContent;
