import React from 'react';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

const DownloadButton = ({
  asyncFunction,
  label,
  buttonProps,
  ...restProps
}) => (
  <Button
    {...buttonProps}
    {...restProps}
    variant="primary"
    onClick={() => asyncFunction()}
  >
    {label}
  </Button>
);

DownloadButton.propTypes = {
  asyncFunction: propTypes.func,
  label: propTypes.label,
  buttonProps: propTypes.object,
};

export default DownloadButton;
