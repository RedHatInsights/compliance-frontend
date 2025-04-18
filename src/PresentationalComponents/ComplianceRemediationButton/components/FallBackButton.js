import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@patternfly/react-core';

const FallbackButton = ({ text = 'Plan remediation' }) => (
  <Button variant="primary" isDisabled>
    {text}
  </Button>
);

FallbackButton.propTypes = {
  text: propTypes.string,
};

export default FallbackButton;
