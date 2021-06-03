import React from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
    Text, TextVariants, TextContent, Grid, Spinner, Badge, Popover
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { StateViewWithError, StateViewPart, SupportedSSGVersionsLink } from 'PresentationalComponents';
import { pluralize } from 'Utilities/TextHelper';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import OsVersionText from './OsVersionText';

const ProfileSystemCount = ({ count = 0 }) => (
    <Badge isRead>
        { `${count} ${ pluralize(count, 'system')}` }
    </Badge>
);

ProfileSystemCount.propTypes = {
    profile: propTypes.object,
    count: propTypes.number
};

const SSGVersionText = ({ profile, newOsMinorVersion }) => (
    <Text component={ TextVariants.p }>
        SSG version: { profile.ssgVersion }
        {' '}
        <Popover
            position='right'
            bodyContent={ <SSGPopoverBody { ...{ profile, newOsMinorVersion } } /> }
            footerContent={ <SupportedSSGVersionsLink /> }>
            <span style={ { cursor: 'pointer' } }>
                <OutlinedQuestionCircleIcon className="grey-icon" />
            </span>
        </Popover>
    </Text>
);

SSGVersionText.propTypes = {
    profile: propTypes.object.isRequired,
    newOsMinorVersion: propTypes.string
};

const SSGPopoverBody = ({ profile, newOsMinorVersion }) => (
    <TextContent style={ { fontSize: 'var(--pf-c-popover--FontSize)' } }>
        <Text>
            This is the latest supported version of the SCAP Security Guide (SSG) for
            {' '}
            <OsVersionText { ...{ profile, newOsMinorVersion } } />
        </Text>
        <Text>
            <OsVersionText { ...{ profile, newOsMinorVersion } } /> systems assigned to this
            policy will report using this rule list.
        </Text>
    </TextContent>
);

SSGPopoverBody.propTypes = {
    profile: propTypes.object.isRequired,
    newOsMinorVersion: propTypes.string
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
            <TextContent className="pf-u-mt-md">
                <Text component={ TextVariants.h3 } >
                    <span className='pf-u-pr-sm'>
                        <OsVersionText { ...{ profile, newOsMinorVersion } } />
                    </span>
                    <ProfileSystemCount count={ systemCount } />
                </Text>
                <SSGVersionText { ...{ profile, newOsMinorVersion } } />
            </TextContent>
        </Grid>
        <StateViewWithError stateValues={ { error, loading, rules } }>
            <StateViewPart stateKey="loading">
                <Spinner />
            </StateViewPart>
            <StateViewPart stateKey="rules">

                <RulesTable
                    remediationAvailableFilter
                    remediationsEnabled={false}
                    columns={ columns }
                    profileRules={ [{ profile, rules: (rules || []) }] }
                    selectedRefIds={ selectedRuleRefIds }
                    handleSelect={
                        handleSelect && ((selectedRuleRefIds) =>
                            handleSelect(profile, newOsMinorVersion, selectedRuleRefIds)
                        )
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
    selectedRuleRefIds: propTypes.array,
    rulesTableProps: propTypes.object
};

export default ProfileTabContent;
