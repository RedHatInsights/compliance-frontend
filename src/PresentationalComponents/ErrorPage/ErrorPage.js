import React from 'react';
import propTypes from 'prop-types';
import InvalidObject from '@redhat-cloud-services/frontend-components/InvalidObject';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const ErrorPage = ({ error }) => {
  const chrome = useChrome();

  if (error.networkError && error.networkError.statusCode === 401) {
    chrome.auth.logout(true);
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
