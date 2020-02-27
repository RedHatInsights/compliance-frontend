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
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withApollo } from '@apollo/react-hoc';
import { CREATE_PROFILE, ASSOCIATE_SYSTEMS_TO_PROFILES } from '../../Utilities/graphql/mutations';

class FinishedCreatePolicy extends React.Component {
    state = {
        percent: 0,
        message: 'Your Compliance policy is being created. After this is created, you may assign it to hosts and customize it.'
    };

    componentDidMount() {
        this.createProfile().then((result) => {
            this.setState(prevState => ({
                message: 'Your Compliance policy has been created. Associating systems to it...',
                percent: prevState.percent + 50,
                profileId: result.data.createProfile.profile.id
            }), this.associateSystems);
        }).catch((error) => {
            this.setState({
                message: error.networkError.message
            });
        });
    }

    createProfile = () => {
        const { benchmarkId, cloneFromProfileId, refId, name, description, complianceThreshold, client } = this.props;
        return client.mutate({
            mutation: CREATE_PROFILE,
            variables: {
                input: { benchmarkId, cloneFromProfileId, refId, name, description, complianceThreshold }
            }
        });
    }

    associateSystems = () => {
        const { systemIds, client, onWizardFinish } = this.props;
        const { profileId: id } = this.state;
        return client.mutate({
            mutation: ASSOCIATE_SYSTEMS_TO_PROFILES,
            variables: {
                input: { id, systemIds }
            }
        }).then(() => {
            this.setState(prevState => ({
                percent: prevState.percent + 50,
                message: 'Your Compliance policy has been created and systems have been associated to it.'
            }), onWizardFinish);
        });
    }

    render() {
        const { percent, message } = this.state;
        return (
            <Bullseye>
                <EmptyState variant={EmptyStateVariant.full}>
                    <EmptyStateIcon size='xl' icon={CogsIcon} />
                    <br/>
                    <Title size='lg'>
                        {percent === 100 ? 'Profile creation complete' : 'Profile creation in progress'}
                    </Title>
                    <EmptyStateBody>
                        <Progress
                            id={'finished-create-policy'}
                            value={percent}
                            measureLocation={ProgressMeasureLocation.outside}
                        />
                    </EmptyStateBody>
                    <EmptyStateBody>
                        { message }
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
    client: propTypes.object.isRequired,
    cloneFromProfileId: propTypes.string.isRequired,
    onClose: propTypes.func.isRequired,
    refId: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    description: propTypes.string,
    systemIds: propTypes.array,
    complianceThreshold: propTypes.number,
    onWizardFinish: propTypes.func
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
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: true,
        forceUnregisterOnUnmount: true
    }),
    withApollo
)(FinishedCreatePolicy);
