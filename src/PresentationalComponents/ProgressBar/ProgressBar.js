import React from 'react';
import propTypes from 'prop-types';
import {
  Progress,
  ProgressVariant,
} from '@patternfly/react-core/dist/js/components/Progress';

const ProgressBar = ({ percent, failed }) => {
  let variant;
  let title;

  if (percent === 100) {
    title = 'Success';
    variant = ProgressVariant.success;
  } else if (failed) {
    title = 'Error';
    variant = ProgressVariant.danger;
  } else {
    title = 'Progress';
    variant = ProgressVariant.info;
  }

  return (
    <Progress
      id={'finished-create-policy'}
      value={percent}
      title={title}
      variant={variant}
      className="wizard-progress-bar"
    />
  );
};

ProgressBar.propTypes = {
  percent: propTypes.number,
  failed: propTypes.bool,
};

export default ProgressBar;
