import React from 'react';
import {
    Button,
    Modal
} from '@patternfly/react-core';
import EditPolicySystems from '../CreatePolicy/EditPolicySystems';
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

        return (
            <React.Fragment>
                <Button onClick={this.toggleOpen}>
                    Edit systems
                </Button>
                <Modal
                    title={`Edit systems`}
                    width={'50%'}
                    isOpen={isOpen}
                    isFooterLeftAligned
                    actions={[
                        <Button key="submit" onClick={this.toggleOpen}>
                            Submit
                        </Button>,
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
    onClose: propTypes.func
};

EditSystems.defaultProps = {
    isOpen: false
};

export default EditSystems;
