import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import {
    Title, Button, Bullseye, EmptyState, EmptyStateBody, EmptyStateSecondaryActions,
    EmptyStateVariant, EmptyStateIcon, List, ListItem
} from '@patternfly/react-core';
import { ProgressBar } from 'PresentationalComponents';
import { WrenchIcon } from '@patternfly/react-icons';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withApollo } from '@apollo/react-hoc';
import usePolicy from 'SmartComponents/EditPolicy/usePolicy';

const FinishedCreatePolicy = ({
    onWizardFinish,
    cloneFromProfileId,
    description,
    name,
    complianceThreshold,
    businessObjective,
    refId,
    benchmarkId,
    systemIds,
    selectedRuleRefIds
}) => {
    const [percent, setPercent] = useState(0);
    const [message, setMessage] = useState('This usually takes a minute or two.');
    const [errors, setErrors] = useState(null);
    const [failed, setFailed] = useState(false);
    const updatePolicy = usePolicy();

    useEffect(() => {
        updatePolicy(null, {
            cloneFromProfileId,
            description,
            name,
            complianceThreshold,
            businessObjective: { title: businessObjective },
            refId,
            benchmarkId,
            hosts: systemIds.map((id) => ({ id })),
            selectedRuleRefIds
        }).then(() => {
            setPercent(100);
            setMessage();
        }).catch((error) => {
            setMessage(error.networkError?.message);
            setErrors(error.networkError?.result?.errors);
            setFailed(true);
        });
    }, []);

    let listErrors;
    if (errors && Array.isArray(errors) && errors.length > 0) {
        listErrors = errors.map((error) => (
            <ListItem key={ error }>{ error }</ListItem>
        ));
    }

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
                { listErrors &&
                    <EmptyStateBody className='wizard-failed-errors'>
                        <List>{ listErrors }</List>
                    </EmptyStateBody>
                }
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
};

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
