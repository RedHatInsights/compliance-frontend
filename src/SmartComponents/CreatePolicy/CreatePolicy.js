import React from 'react';
import { Button, Wizard } from '@patternfly/react-core';
import { formValueSelector } from 'redux-form';
import CreateSCAPPolicy from './CreateSCAPPolicy';
import EditPolicyRules from './EditPolicyRules';
import EditPolicySystems from './EditPolicySystems';
import EditPolicyDetails from './EditPolicyDetails';
import ReviewCreatedPolicy from './ReviewCreatedPolicy';
import FinishedCreatePolicy from './FinishedCreatePolicy';
import { connect } from 'react-redux';
import {
    validateFirstPage,
    validateSecondPage
} from './validate';
import propTypes from 'prop-types';

class CreatePolicy extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isOpen: this.props.isOpen,
        stepIdReached: 1
    };

    toggleOpen = () => {
        const { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen
        });
    };

    onNext = ({ id }) => {
        this.setState({
            stepIdReached: this.state.stepIdReached < id ? id : this.state.stepIdReached
        });
    };

    render() {
        const { isOpen, stepIdReached } = this.state;
        const { benchmark, profile, name, refId } = this.props;

        const steps = [
            {
                id: 1,
                name: 'Create SCAP policy',
                component: <CreateSCAPPolicy/>,
                enableNext: validateFirstPage(benchmark, profile)
            },
            {
                id: 2,
                name: 'Details',
                component: <EditPolicyDetails/>,
                canJumpTo: stepIdReached >= 2,
                enableNext: validateSecondPage(name, refId)
            },
            {
                id: 3,
                name: 'Rules',
                component: <EditPolicyRules/>,
                canJumpTo: stepIdReached >= 3
            },
            {
                id: 4,
                name: 'Systems',
                component: <EditPolicySystems/>,
                canJumpTo: stepIdReached >= 4
            },
            {
                id: 5,
                name: 'Review',
                component: <ReviewCreatedPolicy/>,
                nextButtonText: 'Finish',
                canJumpTo: stepIdReached >= 5
            },
            {
                id: 6,
                name: 'Finished',
                component: <FinishedCreatePolicy onClose={this.toggleOpen}/>,
                isFinishedStep: true,
                canJumpTo: stepIdReached >= 6
            }
        ];

        return (
            <React.Fragment>
                <Button variant="primary" onClick={this.toggleOpen}>
                    Create new policy
                </Button>
                {isOpen && (
                    <Wizard
                        isOpen={isOpen}
                        onClose={this.toggleOpen}
                        isFullWidth
                        isFullHeight
                        title="Create SCAP policy"
                        description="Create a new policy for managing SCAP compliance"
                        steps={steps}
                        onNext={this.onNext}
                    />
                )}
            </React.Fragment>
        );
    }
}

CreatePolicy.propTypes = {
    benchmark: propTypes.string,
    profile: propTypes.string,
    name: propTypes.string,
    refId: propTypes.string,
    isOpen: propTypes.bool
};

CreatePolicy.defaultProps = {
    isOpen: false
};

const selector = formValueSelector('policyForm');
export default connect(
    state => ({
        benchmark: selector(state, 'benchmark'),
        profile: selector(state, 'profile'),
        name: selector(state, 'name'),
        refId: selector(state, 'refId')
    })
)(CreatePolicy);
