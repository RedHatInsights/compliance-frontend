import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    Modal,
    Form,
    FormGroup,
    TextInput,
    Button
} from '@patternfly/react-core';
import React, { Component } from 'react';
import propTypes from 'prop-types';
import UpdateProfileThreshold from './UpdateProfileThreshold';

class SetThresholdDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isModalOpen: false,
            validThreshold: true,
            threshold: props.previousThreshold
        };
    }

    handleModalToggle = () => {
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen
        }));
    };

    handleTextInputChange = threshold => {
        if (threshold > 100 || threshold < 0) {
            this.setState({ validThreshold: false });
        } else {
            this.setState({ validThreshold: true, threshold });
        }
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
        const { isOpen, isModalOpen, threshold, validThreshold } = this.state;
        const { policyId } = this.props;
        const dropdownItems = [
            <DropdownItem key="action" onClick={this.handleModalToggle} component="button">
                Set compliance threshold
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                <Dropdown
                    onSelect={this.onSelect}
                    toggle={<DropdownToggle onToggle={this.onToggle}>Actions</DropdownToggle>}
                    isOpen={isOpen}
                    dropdownItems={dropdownItems}
                />
                <Modal
                    isSmall
                    title="Update compliance threshold"
                    isOpen={isModalOpen}
                    onClose={this.handleModalToggle}
                    actions={[
                        <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
                            Cancel
                        </Button>,
                        <UpdateProfileThreshold
                            key='confirm'
                            policyId={policyId}
                            threshold={threshold} />
                    ]}
                >
                        The compliance threshold defines what percentage of rules must be met in order for a system to
                        be determined &quot;compliant&quot;
                    <Form>
                        <FormGroup field-id='policy-threshold'
                            isValid={validThreshold}
                            helperTextInvalid='Threshold has to be a number between 0 and 100'
                            label="Compliance threshold (%):">
                            <TextInput
                                value={threshold}
                                type='number'
                                id='policy-threshold'
                                onChange={this.handleTextInputChange}
                                isValid={validThreshold}
                                aria-label="compliance threshold"
                            />
                        </FormGroup>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

SetThresholdDropdown.propTypes = {
    policyId: propTypes.string,
    previousThreshold: propTypes.number
};

export default SetThresholdDropdown;
