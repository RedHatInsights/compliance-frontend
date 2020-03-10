import React from 'react';
import propTypes from 'prop-types';
import {
    Title,
    Button,
    Text
} from '@patternfly/react-core';
import {
    ErrorCircleOIcon
} from '@patternfly/react-icons';
import {
    InvalidObject
} from '@redhat-cloud-services/frontend-components';

const ErrorPage = ({ error, ...props }) => {
    if (error.networkError && error.networkError.statusCode === 401) {
        window.insights.chrome.auth.logout();
    }

    if (error.networkError && error.networkError.statusCode === 404) {
        return <InvalidObject />;
    }

    return <section {...props} className="pf-l-page__main-section pf-c-page__main-section ins-c-component_invalid-componet">
        <Title size='3xl'>There was an error</Title>
        <ErrorCircleOIcon size="xl" style={ { opacity: '0.5' } } />
        <Title size='xl' className='ins-c-text__sorry'>
            If you need to contact Red Hat Support about this, this is the exact error:
            <Text>
                { error.message }
            </Text>
        </Title>
        <Button
            variant="link"
            onClick={ history.goBack }>
                Go Back
        </Button>
    </section>;
};

ErrorPage.propTypes = {
    error: propTypes.object
};

export default ErrorPage;
