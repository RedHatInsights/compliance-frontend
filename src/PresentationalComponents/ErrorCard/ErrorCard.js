import React from 'react';
import propTypes from 'prop-types';
import { Card, CardBody } from '@patternfly/react-core';
import { ErrorState } from '@patternfly/react-component-groups';

const ErrorCard = ({ errorMsg }) => (
  <Card className="ins-error-card">
    <CardBody>
      <ErrorState bodyText={errorMsg} />
    </CardBody>
  </Card>
);

ErrorCard.propTypes = {
  errorMsg: propTypes.string,
};

export default ErrorCard;
