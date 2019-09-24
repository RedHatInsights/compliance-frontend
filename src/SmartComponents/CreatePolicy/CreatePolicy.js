import React from 'react';
import { Button, Wizard } from '@patternfly/react-core';
import CreateSCAPPolicy from './CreateSCAPPolicy';
import EditPolicyRules from './EditPolicyRules';
import EditPolicySystems from './EditPolicySystems';
import EditPolicyDetails from './EditPolicyDetails';
import ReviewCreatedPolicy from './ReviewCreatedPolicy';
import { connect } from 'react-redux';

class CreatePolicy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            stepIdReached: 1
        };

        this.toggleOpen = () => {
            const { isOpen } = this.state;
            this.setState({
                isOpen: !isOpen
            });
        };

        this.onNext = ({ id }) => {
            this.setState({
                stepIdReached: this.state.stepIdReached < id ? id : this.state.stepIdReached
            });
        };
    }

    render() {
        const { isOpen, stepIdReached } = this.state;

        const steps = [
            { id: 1, name: 'Create SCAP policy', component: <CreateSCAPPolicy/> },
            { id: 2, name: 'Details', component: <EditPolicyDetails/>, canJumpTo: stepIdReached >= 2 },
            { id: 3, name: 'Rules', component: <EditPolicyRules/>, canJumpTo: stepIdReached >= 3 },
            { id: 4, name: 'Systems', component: <EditPolicySystems/>, canJumpTo: stepIdReached >= 4 },
            { id: 5, name: 'Review & Schedule', component: <ReviewCreatedPolicy/>, nextButtonText: 'Finish',
                canJumpTo: stepIdReached >= 5 }
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

// const selector = formValueSelector('policyForm');
export default connect(
    /* state => ({
        benchmark:
        profileType:
        name:
        description:
        userNotes:
        businessObjectiveTitle:
        complianceThreshold:
        systems:
        rules:

    })
    */
)(CreatePolicy);
