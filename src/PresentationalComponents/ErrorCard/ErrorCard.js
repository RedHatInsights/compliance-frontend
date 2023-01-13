import React from 'react';
import propTypes from 'prop-types';
import { Card, CardBody } from '@patternfly/react-core';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';

const ErrorCard = ({ errorMsg }) => (
  <Card className="ins-error-card">
    <CardBody>
      <ErrorState errorDescription={errorMsg} />
    </CardBody>
  </Card>
);

ErrorCard.propTypes = {
  errorMsg: propTypes.string,
};

export default ErrorCard;
