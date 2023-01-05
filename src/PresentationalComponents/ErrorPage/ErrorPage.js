import React from 'react';
import propTypes from 'prop-types';
import InvalidObject from '@redhat-cloud-services/frontend-components/InvalidObject';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';

const ErrorPage = ({ error }) => {
  if (error.networkError && error.networkError.statusCode === 401) {
    window.insights.chrome.auth.logout(true);
    return false;
  }

  if (error.networkError && error.networkError.statusCode === 403) {
    return <NotAuthorized serviceName="Compliance" />;
  }

  if (error.networkError && error.networkError.statusCode === 404) {
    return <InvalidObject />;
  }

  return <ErrorState />;
};

ErrorPage.propTypes = {
  error: propTypes.object,
};

export default ErrorPage;
