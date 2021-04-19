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
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { useQuery } from '@apollo/client';

const REVIEW = gql`
query review($benchmarkId: String!) {
    benchmark(id: $benchmarkId) {
        id
        osMajorVersion
    }
}
`;

const ReviewCreatedPolicy = ({
    benchmarkId, name, businessObjective, complianceThreshold, parentProfileName, osMinorVersionCounts
}) => {
    const { data, error, loading } = useQuery(REVIEW, { variables: { benchmarkId } });

    if (error) { return error; }

    if (loading) { return <Spinner/>; }

    const { benchmark: { osMajorVersion } } = data;

    return (
        <TextContent>
            <Text component={TextVariants.h1}>
                Review
            </Text>
            <Text>
                Review your SCAP policy before finishing.
            </Text>
            <Text component={TextVariants.h3} style={ { marginTop: 0 } }>{ name }</Text>
            <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>Policy type</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ parentProfileName }</TextListItem>
                <TextListItem component={TextListItemVariants.dt}>Compliance threshold</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{ complianceThreshold }%</TextListItem>
                { businessObjective &&
                    <React.Fragment>
                        <TextListItem component={TextListItemVariants.dt}>Business objective</TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>{ businessObjective }</TextListItem>
                    </React.Fragment>
                }
                <TextListItem component={TextListItemVariants.dt}>Systems</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    <TextList component={TextListVariants.dl}>
                        { osMinorVersionCounts.map(({ osMinorVersion, count }) => (
                            <React.Fragment key={osMinorVersion}>
                                <TextListItem component={TextListItemVariants.dt} style={{ 'font-weight': 'normal' }}>
                                    RHEL {osMajorVersion}.{osMinorVersion}
                                </TextListItem>
                                <TextListItem component={TextListItemVariants.dd}>
                                    { count } { count > 1 ? 'systems' : 'system' }
                                </TextListItem>
                            </React.Fragment>
                        )) }
                    </TextList>
                </TextListItem>
            </TextList>
        </TextContent>
    );
};

ReviewCreatedPolicy.propTypes = {
    benchmarkId: propTypes.string,
    refId: propTypes.string,
    name: propTypes.string,
    businessObjective: propTypes.string,
    complianceThreshold: propTypes.number,
    parentProfileName: propTypes.string,
    osMinorVersionCounts: propTypes.arrayOf(propTypes.shape({
        osMinorVersion: propTypes.number,
        count: propTypes.number
    }))
};

const selector = formValueSelector('policyForm');

export default connect(
    state => ({
        benchmarkId: selector(state, 'benchmark'),
        refId: selector(state, 'refId'),
        name: selector(state, 'name'),
        businessObjective: selector(state, 'businessObjective'),
        osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
        complianceThreshold: parseFloat(selector(state, 'complianceThreshold')) || 100.0,
        parentProfileName: JSON.parse(selector(state, 'profile')).name,
        rulesCount: selector(state, 'selectedRuleRefIds').length
    })
)(ReviewCreatedPolicy);
