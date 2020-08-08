import React from 'react';
import propTypes from 'prop-types';
import {
    Title, Button, Bullseye, EmptyState, EmptyStateBody, EmptyStateSecondaryActions,
    EmptyStateVariant, EmptyStateIcon
} from '@patternfly/react-core';
import { ProgressBar } from 'PresentationalComponents';
import { WrenchIcon } from '@patternfly/react-icons';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withApollo } from '@apollo/react-hoc';
import { CREATE_PROFILE, ASSOCIATE_SYSTEMS_TO_PROFILES } from 'Utilities/graphql/mutations';
import businessObjectiveMutation from 'Utilities/businessObjectiveMutation';

class FinishedCreatePolicy extends React.Component {
    state = {
        percent: 0,
        message: 'This usually takes a minute or two.',
        failed: false
    };

    componentDidMount() {
        this.createProfile().then((result) => {
            this.setState(prevState => ({
                percent: prevState.percent + 50,
                profileId: result.data.createProfile.profile.id
            }), this.associateSystems);
        }).catch((error) => {
            this.setState({
                message: error.networkError.message,
                failed: true
            });
        });
    }

    createProfile = () => {
        const { businessObjective, benchmarkId, cloneFromProfileId, refId, name,
            description, complianceThreshold, selectedRuleRefIds, client } = this.props;
        return businessObjectiveMutation(null, businessObjective, client.mutate).then(
            businessObjectiveId => {
                let input = { benchmarkId, cloneFromProfileId, refId, name,
                    description, complianceThreshold, selectedRuleRefIds };

                if (businessObjectiveId) {
                    input.businessObjectiveId = businessObjectiveId;
                }

                return client.mutate({
                    mutation: CREATE_PROFILE,
                    variables: {
                        input
                    }
                });
            }
        );
    }

    associateSystems = () => {
        const { systemIds, client } = this.props;
        const { profileId: id } = this.state;
        return client.mutate({
            mutation: ASSOCIATE_SYSTEMS_TO_PROFILES,
            variables: {
                input: { id, systemIds }
            }
        }).then(() => {
            this.setState(prevState => ({
                percent: prevState.percent + 50,
                message: ''
            }));
        }).catch((error) => {
            this.setState({
                message: error.networkError.message,
                failed: true
            });
        });;
    }

    render() {
        const { percent, message, failed } = this.state;
        const { onWizardFinish } = this.props;
        return (
            <Bullseye>
                <EmptyState variant={EmptyStateVariant.full}>
                    <EmptyStateIcon icon={WrenchIcon} />
                    <br/>
                    <Title headingLevel="h1" size='lg'>
                        Creating policy
                    </Title>
                    <EmptyStateBody>
                        <ProgressBar percent={percent} failed={failed} />
                    </EmptyStateBody>
                    <EmptyStateBody className={failed && 'wizard-failed-message'}>
                        { message }
                    </EmptyStateBody>
                    <EmptyStateSecondaryActions>
                        { percent === 100 ?
                            <Button
                                variant={'primary'}
                                onClick={() => { onWizardFinish(); }}
                            >
                                Return to application
                            </Button> :
                            '' }
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Bullseye>
        );
    }
}

FinishedCreatePolicy.propTypes = {
    benchmarkId: propTypes.string.isRequired,
    client: propTypes.object.isRequired,
    businessObjective: propTypes.object,
    cloneFromProfileId: propTypes.string.isRequired,
    refId: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    description: propTypes.string,
    systemIds: propTypes.array,
    complianceThreshold: propTypes.number,
    onWizardFinish: propTypes.func,
    selectedRuleRefIds: propTypes.arrayOf(propTypes.string).isRequired
};

export const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            benchmarkId: selector(state, 'benchmark'),
            businessObjective: selector(state, 'businessObjective'),
            cloneFromProfileId: JSON.parse(selector(state, 'profile')).id,
            refId: selector(state, 'refId'),
            name: selector(state, 'name'),
            description: selector(state, 'description'),
            complianceThreshold: parseFloat(selector(state, 'complianceThreshold')) || 100.0,
            systemIds: selector(state, 'systems'),
            selectedRuleRefIds: selector(state, 'selectedRuleRefIds')
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: true,
        forceUnregisterOnUnmount: true
    }),
    withApollo
)(FinishedCreatePolicy);
