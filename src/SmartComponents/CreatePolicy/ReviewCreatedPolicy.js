import React from 'react';
import {
    Text,
    TextVariants,
    TextContent,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants
} from '@patternfly/react-core';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { useQuery } from '@apollo/react-hooks';

const REVIEW = gql`
query review($benchmarkId: String!) {
    benchmark(id: $benchmarkId) {
        title,
        version
    }
}
`;

const ReviewCreatedPolicy = ({ benchmarkId, name, refId, systemsCount }) => {
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
                Review your policy before finishing. SCAP security guide, profile type
                and name cannot be changed after initial creation. Make sure they are correct!
            </Text>
            <hr/>
            <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>SCAP security guide</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    {` ${benchmark.title} - ${benchmark.version}`}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Profile type</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ name }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Generated ID</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ refId }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Number of systems</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ systemsCount }</TextListItem>
            </TextList>
        </TextContent>
    );
};

ReviewCreatedPolicy.propTypes = {
    benchmarkId: propTypes.string,
    refId: propTypes.string,
    name: propTypes.string,
    systemsCount: propTypes.number
};

const selector = formValueSelector('policyForm');

export default connect(
    state => ({
        benchmarkId: selector(state, 'benchmark'),
        refId: selector(state, 'refId'),
        name: selector(state, 'name'),
        systemsCount: selector(state, 'systems').length
    })
)(ReviewCreatedPolicy);
