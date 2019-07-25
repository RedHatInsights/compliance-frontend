import {
    Dropdown,
    DropdownPosition,
    DropdownToggle,
    DropdownItem,
    Modal,
    Form,
    Button
} from '@patternfly/react-core';
import React, { Component } from 'react';
import propTypes from 'prop-types';
import UpdateProfile from './UpdateProfile';
import ProfileThresholdField from './ProfileThresholdField';
import BusinessObjectiveField from './BusinessObjectiveField';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

class EditPolicy extends Component {
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
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen
        }));
    };

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const { policyId, isOpen, isModalOpen, businessObjective } = this.state;
        const { previousThreshold, businessObjectiveTitle, complianceThreshold } = this.props;
        const dropdownItems = [
            <DropdownItem key="action" onClick={this.handleModalToggle} component="button">
                Edit policy
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                <Dropdown
                    onSelect={this.onSelect}
                    className='policy-details-dropdown'
                    position={DropdownPosition.right}
                    toggle={<DropdownToggle onToggle={this.onToggle}>Actions</DropdownToggle>}
                    isOpen={isOpen}
                    dropdownItems={dropdownItems}
                />
                <Modal
                    isSmall
                    title="Edit policy details"
                    isOpen={isModalOpen}
                    onClose={this.handleModalToggle}
                    actions={[
                        <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
                            Cancel
                        </Button>,
                        <UpdateProfile
                            key='confirm'
                            policyId={policyId}
                            threshold={complianceThreshold || previousThreshold}
                            businessObjectiveTitle={businessObjectiveTitle}
                        />
                    ]}
                >
                    <Form>
                        <BusinessObjectiveField
                            businessObjective={businessObjective}
                            policyId={policyId}
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
    businessObjectiveTitle: propTypes.string,
    complianceThreshold: propTypes.string
};

const selector = formValueSelector('editPolicy');
export default connect(
    state => ({
        complianceThreshold: selector(state, 'complianceThreshold'),
        businessObjectiveTitle: selector(state, 'businessObjectiveTitle') && selector(state, 'businessObjectiveTitle').value
    })
)(EditPolicy);
