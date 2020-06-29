import React from 'react';
import {
    Button,
    Modal
} from '@patternfly/react-core';
import EditPolicySystems from '../CreatePolicy/EditPolicySystems';
import { SubmitEditSystemsButton } from './SubmitEditSystemsButton';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';

class EditSystems extends React.Component {
    state = {
        isOpen: this.props.isOpen
    };

    toggleOpen = () => {
        const { isOpen } = this.state;
        const { onClose } = this.props;

        this.setState({
            isOpen: !isOpen
        }, onClose);
    };

    render() {
        const { isOpen } = this.state;
        const { policyId, selectedSystemIds } = this.props;

        return (
            <React.Fragment>
                <Button onClick={this.toggleOpen}>
                    Edit systems
                </Button>
                <Modal
                    title={`Edit systems`}
                    width={'75%'}
                    isOpen={isOpen}
                    isFooterLeftAligned
                    actions={[
                        <SubmitEditSystemsButton key='save'
                            aria-label='save'
                            policyId={policyId}
                            systemIds={selectedSystemIds}
                            variant='primary'/>,
                        <Button key="cancel" variant="secondary" onClick={this.toggleOpen}>
                            Cancel
                        </Button>
                    ]}
                >
                    <EditPolicySystems showHeader={false} />
                </Modal>
            </React.Fragment>
        );
    }
}

EditSystems.propTypes = {
    isOpen: propTypes.bool,
    onClose: propTypes.func,
    policyId: propTypes.number.isRequired,
    selectedSystemIds: propTypes.arrayOf(propTypes.string).isRequired
};

EditSystems.defaultProps = {
    isOpen: false
};

const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            selectedSystemIds: selector(state, 'systems')
        })
    ),
    reduxForm({
        form: 'policyForm'
    })
)(EditSystems);
