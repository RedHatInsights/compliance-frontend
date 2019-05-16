import React from 'react';
import { Wizard } from '@redhat-cloud-services/frontend-components';
import AddOpenshiftConnection from '../ImageStreamsWizard/AddOpenshiftConnection';
import SelectPolicy from '../ImageStreamsWizard/SelectPolicy';
import ApplyPoliciesToImageStreams from '../ImageStreamsWizard/ApplyPoliciesToImageStreams';
import ImageStreamEmptyState from './ImageStreamEmptyState';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { post } from '../../Utilities/ComplianceBackend/ComplianceBackendAPI';

class ImageStreamsWizard extends React.Component {
    state = {
        isModalOpen: false
    };

    handleModalToggle = () => {
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen
        }));
    };

    handleOnClose = () => {
        /* eslint-disable camelcase */
        const { imagestream, openshift_connection, policy } = this.props;
        if (imagestream && imagestream.name.length !== 0 && Object.keys(openshift_connection).length === 4) {
            post('/imagestreams', {
                imagestream,
                openshift_connection,
                /* eslint-enable camelcase */
                policy
            });
        }

        this.setState({
            isModalOpen: false
        });
    }

    render() {
        const { isModalOpen } = this.state;

        const ModalStepContent = [
            <AddOpenshiftConnection key='step1'/>,
            <SelectPolicy key='step2'/>,
            <ApplyPoliciesToImageStreams key='step3'/>
        ];

        return (
            <React.Fragment>
                <ImageStreamEmptyState key='step0' openWizard={this.handleModalToggle} />
                <Wizard
                    title='Add a new Image Stream'
                    isOpen={isModalOpen}
                    confirmAction='Scan'
                    onClose={this.handleOnClose}
                    content={ModalStepContent}
                >
                </Wizard>
            </React.Fragment>
        );
    }
}

ImageStreamsWizard.propTypes = {
    /* This data is sent in this format to the backend */
    /* eslint-disable camelcase */
    openshift_connection: PropTypes.shape({
        openshift_connection: PropTypes.string,
        registry_api_url: PropTypes.string,
        username: PropTypes.string,
        token: PropTypes.string
    }),
    policy: PropTypes.object,
    imagestream: PropTypes.shape({ name: PropTypes.string })
};

const selector = formValueSelector('imagestreamWizard');
export default connect(
    state => ({
        openshift_connection: selector(state, 'openshift_connection'),
        /* eslint-enable camelcase */
        policy: selector(state, 'policy'),
        imagestream: selector(state, 'imagestream')
    })
)(ImageStreamsWizard);
