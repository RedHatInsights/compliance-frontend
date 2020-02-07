import {
    Modal,
    Form,
    Button
} from '@patternfly/react-core';
import React, { Component } from 'react';
import propTypes from 'prop-types';
import UpdateProfileButton from './UpdateProfileButton';
import {
    ProfileThresholdField,
    BusinessObjectiveField
} from 'SmartComponents';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import round from 'lodash/round';

export class EditPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isModalOpen: false,
            policyId: props.policyId,
            businessObjective: props.businessObjective
        };
    }

    handleModalToggle = () => {
        const { isModalOpen } = this.state;
        insights.chrome.appAction(!isModalOpen ? 'edit-business-objective' : '');
        this.setState(() => ({
            isModalOpen: !isModalOpen,
            businessObjective: this.props.businessObjective
        }));
        this.props.onClose();
    };

    render() {
        const { policyId, isModalOpen, businessObjective } = this.state;
        const { previousThreshold, editPolicyBusinessObjective, complianceThreshold, dispatch } = this.props;

        return (
            <React.Fragment>
                <Button
                    variant='secondary'
                    onClick={this.handleModalToggle}
                >
                    Edit policy
                </Button>
                <Modal
                    isSmall
                    title="Edit policy details"
                    isOpen={isModalOpen}
                    onClose={this.handleModalToggle}
                    isFooterLeftAligned
                    actions={[
                        <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
                            Cancel
                        </Button>,
                        <UpdateProfileButton
                            key='confirm'
                            policyId={policyId}
                            threshold={ round(parseFloat(complianceThreshold || previousThreshold), 1) }
                            businessObjective={businessObjective}
                            editPolicyBusinessObjective={editPolicyBusinessObjective}
                            onClick={this.handleModalToggle}
                        />
                    ]}
                >
                    <Form>
                        <BusinessObjectiveField
                            businessObjective={businessObjective}
                            policyId={policyId}
                            dispatch={dispatch}
                        />
                        <ProfileThresholdField previousThreshold={previousThreshold} />
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

EditPolicy.propTypes = {
    policyId: propTypes.string,
    previousThreshold: propTypes.number,
    businessObjective: propTypes.object,
    editPolicyBusinessObjective: propTypes.object,
    complianceThreshold: propTypes.string,
    onClose: propTypes.func,
    dispatch: propTypes.func
};

const selector = formValueSelector('policyForm');
export default connect(
    state => ({
        complianceThreshold: selector(state, 'complianceThreshold'),
        editPolicyBusinessObjective: selector(state, 'businessObjective')
    })
)(EditPolicy);
