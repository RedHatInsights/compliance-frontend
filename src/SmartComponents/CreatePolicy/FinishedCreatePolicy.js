import React from 'react';
import propTypes from 'prop-types';
import {
    Title,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateSecondaryActions,
    EmptyStateVariant,
    Progress,
    ProgressMeasureLocation,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CogsIcon } from '@patternfly/react-icons';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { graphql } from 'react-apollo';

const CREATE_PROFILE = gql`
mutation CreateProfile($input: createProfileInput!) {
    createProfile(input: $input) {
        profile {
            id
        }
    }
}
`;

const ASSOCIATE_SYSTEMS_TO_PROFILES = gql`
mutation associateSystems($input: associateSystemsInput!) {
    associateSystems(input: $input) {
        profile {
            id
        }
    }
}
`;

class FinishedCreatePolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = { percent: 0 };
    }

    componentDidMount() {
        this.createProfile().then((result) => {
            this.setState(prevState => ({
                percent: prevState.percent + 50,
                profileId: result.data.createProfile.profile.id
            }), this.associateSystems);
        });
    }

    createProfile = () => {
        const { benchmarkId, cloneFromProfileId, refId, name, description, complianceThreshold, mutate } = this.props;
        return mutate({
            mutation: CREATE_PROFILE,
            variables: {
                input: { benchmarkId, cloneFromProfileId, refId, name, description, complianceThreshold }
            }
        });
    }

    associateSystems = () => {
        const { systemIds, mutate } = this.props;
        const { profileId: id } = this.state;
        return mutate({
            mutation: ASSOCIATE_SYSTEMS_TO_PROFILES,
            variables: {
                input: { id, systemIds }
            }
        }).then(() => {
            this.setState(prevState => ({ percent: prevState.percent + 50 }));
        });
    }

    render() {
        const { percent } = this.state;
        return (
            <Bullseye>
                <EmptyState variant={EmptyStateVariant.full}>
                    <EmptyStateIcon size='xl' icon={CogsIcon} />
                    <br/>
                    <Title size='lg'>
                        {percent === 100 ? 'Profile creation complete' : 'Profile creation in progress'}
                    </Title>
                    <EmptyStateBody>
                        <Progress value={percent} measureLocation={ProgressMeasureLocation.outside} />
                    </EmptyStateBody>
                    <EmptyStateBody>
                        Your Compliance Profile is being created. After this is created, you may assign it
                        to hosts and customize it.
                    </EmptyStateBody>
                    <EmptyStateSecondaryActions>
                        {percent === 100 ? <Button variant={'primary'} onClick={this.props.onClose}>Close</Button> : ''}
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Bullseye>
        );
    }
}

FinishedCreatePolicy.propTypes = {
    benchmarkId: propTypes.string.isRequired,
    mutate: propTypes.func.isRequired,
    cloneFromProfileId: propTypes.string.isRequired,
    onClose: propTypes.func.isRequired,
    refId: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    description: propTypes.string,
    systemIds: propTypes.array,
    complianceThreshold: propTypes.number
};

export const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            benchmarkId: selector(state, 'benchmark'),
            cloneFromProfileId: JSON.parse(selector(state, 'profile')).id,
            refId: selector(state, 'refId'),
            name: selector(state, 'name'),
            description: selector(state, 'description'),
            complianceThreshold: parseFloat(selector(state, 'complianceThreshold')) || 100.0,
            systemIds: selector(state, 'systems')
        })
    ),
    graphql(CREATE_PROFILE)
)(FinishedCreatePolicy);
