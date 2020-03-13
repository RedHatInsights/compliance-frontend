import React from 'react';
import propTypes from 'prop-types';
import {
    Title,
    Button,
    Text
} from '@patternfly/react-core';
import {
    WarningTriangleIcon
} from '@patternfly/react-icons';
import {
    InvalidObject
} from '@redhat-cloud-services/frontend-components/components/InvalidObject';

const ErrorPage = ({ error, ...props }) => {
    if (error.networkError && error.networkError.statusCode === 401) {
        window.insights.chrome.auth.logout(true);
        return false;
    }

    if (error.networkError && error.networkError.statusCode === 404) {
        return <InvalidObject />;
    }

    return <section {...props} className="pf-l-page__main-section pf-c-page__main-section ins-c-component_invalid-componet">
        <WarningTriangleIcon size="xl" style={ { opacity: '0.5' } } />
        <Title size='3xl'>There was an error</Title>
        <Text>
            If you need to contact Red Hat Support about this, this is the exact error:
            <Text>
                { error.message }
            </Text>
        </Text>
        <Button
            variant="link"
            onClick={ history.goBack }>
                Go back
        </Button>
    </section>;
};

ErrorPage.propTypes = {
    error: propTypes.object
};

export default ErrorPage;
