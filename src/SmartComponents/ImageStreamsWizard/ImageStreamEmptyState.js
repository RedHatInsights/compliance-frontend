import React from 'react';
import {
    Title,
    TextContent,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    Button
} from '@patternfly/react-core';
import { ClipboardCheckIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import emptyStateStyles from '@patternfly/patternfly/components/EmptyState/empty-state.css';

const ImageStreamEmptyState = ({ openWizard }) => (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon size="xl" title="Compliance" icon={ClipboardCheckIcon} />
            <br/>
            <Title size="lg">No Image Streams</Title>
            <span className={emptyStateStyles.emptyStateBody}>
                <TextContent>
                    You have not added any Image Streams to scan yet.<br/>

                    Add an Image Stream to scan and view compliance reports.
                </TextContent>
            </span>
            <Button variant='primary' onClick={openWizard}> Scan an Image Stream </Button>
        </EmptyState>
    </Bullseye>
);

ImageStreamEmptyState.propTypes = {
    openWizard: PropTypes.func.isRequired
};

export default ImageStreamEmptyState;
