import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Wizard } from '@patternfly/react-core';
import CreateSCAPPolicy from './CreateSCAPPolicy';
import { default as EditPolicyRules } from './EditPolicyProfilesRules';
import EditPolicySystems from './EditPolicySystems';
import EditPolicyDetails from './EditPolicyDetails';
import ReviewCreatedPolicy from './ReviewCreatedPolicy';
import FinishedCreatePolicy from './FinishedCreatePolicy';
import { validateBenchmarkPage, validateDetailsPage, validateRulesPage, validateSystemsPage } from './validate';

export const CreatePolicy = ({
    benchmark, osMajorVersion, complianceThreshold, name, profile, refId, selectedRuleRefIds, systemIds
}) => {
    const history = useHistory();
    const [stepIdReached, setStepIdReached] = useState(1);

    const resetAnchor = () => {
        const { location } = history;
        if (location.hash) {
            history.push({ ...location, hash: '' });
        }
    };

    const onNext = ({ id }) => {
        setStepIdReached(stepIdReached < id ? id : stepIdReached);
        resetAnchor();
    };

    const onClose = () => {
        history.push('/scappolicies');
    };

    const steps = [
        {
            id: 1,
            name: 'Create SCAP policy',
            component: <CreateSCAPPolicy/>,
            enableNext: validateBenchmarkPage(benchmark, osMajorVersion, profile)
        },
        {
            id: 2,
            name: 'Details',
            component: <EditPolicyDetails/>,
            canJumpTo: stepIdReached >= 2,
            enableNext: validateDetailsPage(name, refId, complianceThreshold)
        },
        {
            id: 3,
            name: 'Systems',
            component: <EditPolicySystems/>,
            canJumpTo: stepIdReached >= 3,
            enableNext: validateSystemsPage(systemIds)
        },
        {
            id: 4,
            name: 'Rules',
            component: <EditPolicyRules/>,
            canJumpTo: systemIds?.length > 0 && stepIdReached >= 4,
            enableNext: validateRulesPage(selectedRuleRefIds)
        },
        {
            id: 5,
            name: 'Review',
            component: <ReviewCreatedPolicy/>,
            nextButtonText: 'Finish',
            canJumpTo: (
                validateRulesPage(selectedRuleRefIds) &&
                systemIds?.length > 0 &&
                stepIdReached >= 5
            )
        },
        {
            id: 6,
            name: 'Finished',
            component: <FinishedCreatePolicy onWizardFinish={ onClose } />,
            isFinishedStep: true,
            canJumpTo: systemIds?.length > 0 && stepIdReached >= 6
        }
    ];

    return (
        <React.Fragment>
            <Wizard
                isOpen
                onNext={ onNext }
                onGoToStep={ resetAnchor }
                onBack={ resetAnchor }
                onClose={ onClose }
                title="Create SCAP policy"
                description="Create a new policy for managing SCAP compliance"
                steps={ steps } />
        </React.Fragment>
    );
};

CreatePolicy.propTypes = {
    benchmark: propTypes.string,
    osMajorVersion: propTypes.string,
    osMinorVersionCounts: propTypes.arrayOf(propTypes.shape({
        osMinorVersion: propTypes.number,
        count: propTypes.number
    })),
    complianceThreshold: propTypes.string,
    businessObjective: propTypes.object,
    dispatch: propTypes.func,
    isOpen: propTypes.bool,
    name: propTypes.string,
    onWizardFinish: propTypes.func,
    profile: propTypes.string,
    refId: propTypes.string,
    selectedRuleRefIds: propTypes.arrayOf(propTypes.string),
    systemIds: propTypes.arrayOf(propTypes.string)
};

CreatePolicy.defaultProps = {
    isOpen: false
};

const selector = formValueSelector('policyForm');
export default connect(
    state => ({
        benchmark: selector(state, 'benchmark'),
        osMajorVersion: selector(state, 'osMajorVersion'),
        osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
        businessObjective: selector(state, 'businessObjective'),
        complianceThreshold: selector(state, 'complianceThreshold') || '100.0',
        name: selector(state, 'name'),
        profile: selector(state, 'profile'),
        refId: selector(state, 'refId'),
        selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
        systemIds: selector(state, 'systems')
    })
)(CreatePolicy);
