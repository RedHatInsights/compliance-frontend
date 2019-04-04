import React from 'react';
import {
    Title,
    TextContent,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody,
    Button
} from '@patternfly/react-core';
import { ClipboardCheckIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const ImageStreamEmptyState = ({ openWizard }) => (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon size="xl" title="Compliance" icon={ClipboardCheckIcon} />
            <br/>
            <Title size="lg">No Image Streams</Title>
            <EmptyStateBody>
                <TextContent>
                    You have not added any Image Streams to scan yet.<br/>

                    Add an Image Stream to scan and view compliance reports.
                </TextContent>
            </EmptyStateBody>
            <Button variant='primary' onClick={openWizard}> Scan an Image Stream </Button>
        </EmptyState>
    </Bullseye>
);

ImageStreamEmptyState.propTypes = {
    openWizard: PropTypes.func.isRequired
};

export default ImageStreamEmptyState;
