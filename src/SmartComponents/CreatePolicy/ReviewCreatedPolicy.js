import React from 'react';
import {
    Text,
    TextVariants,
    TextContent,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';
import {
    ExclamationTriangleIcon
} from '@patternfly/react-icons';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { useQuery } from '@apollo/react-hooks';

const REVIEW = gql`
query review($benchmarkId: String!) {
    benchmark(id: $benchmarkId) {
        id
        title
        refId
        version
    }
}
`;

const SystemsCount = ({ count }) => (
    count > 0 ? count : <Tooltip
        position={TooltipPosition.bottom}
        content="Policies without systems will not have reports.">
        <ExclamationTriangleIcon className='ins-u-warning'/>
        <Text component="span" className='ins-u-warning'>
            &nbsp;No systems
        </Text>
    </Tooltip>
);

SystemsCount.propTypes = {
    count: propTypes.number
};

const ReviewCreatedPolicy = ({ benchmarkId, name, refId, systemsCount, rulesCount, complianceThreshold, parentProfileName }) => {
    const { data, error, loading } = useQuery(REVIEW, { variables: { benchmarkId } });

    if (error) { return error; }

    if (loading) { return <Spinner/>; }

    const benchmark = data.benchmark;

    return (
        <TextContent>
            <Text component={TextVariants.h1}>
                Review
            </Text>
            <Text component={TextVariants.h4}>
                Review your policy before finishing.
            </Text>
            <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>Operating system</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    { benchmark.refId.split('xccdf_org.ssgproject.content_benchmark_')[1].replace('-', ' ') }
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Security guide</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    {` ${benchmark.title} - ${benchmark.version}`}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Policy type</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ parentProfileName }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Policy name</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ name }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Reference ID</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ refId }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Compliance threshold</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ complianceThreshold }%</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>No. of rules</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ rulesCount }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>No. of systems</TextListItem>
                <TextListItem component={TextListItemVariants.dd}><SystemsCount count={ systemsCount } /></TextListItem>
            </TextList>
        </TextContent>
    );
};

ReviewCreatedPolicy.propTypes = {
    benchmarkId: propTypes.string,
    refId: propTypes.string,
    name: propTypes.string,
    systemsCount: propTypes.number,
    rulesCount: propTypes.number,
    complianceThreshold: propTypes.number,
    parentProfileName: propTypes.string
};

const selector = formValueSelector('policyForm');

export default connect(
    state => ({
        benchmarkId: selector(state, 'benchmark'),
        refId: selector(state, 'refId'),
        name: selector(state, 'name'),
        systemsCount: selector(state, 'systems').length,
        complianceThreshold: parseFloat(selector(state, 'complianceThreshold')) || 100.0,
        parentProfileName: JSON.parse(selector(state, 'profile')).name,
        rulesCount: selector(state, 'selectedRuleRefIds').length
    })
)(ReviewCreatedPolicy);
