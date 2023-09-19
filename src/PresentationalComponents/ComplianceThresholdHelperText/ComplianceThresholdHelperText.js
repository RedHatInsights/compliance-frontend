import React from 'react';
import propTypes from 'prop-types';
import { HelperText, HelperTextItem } from '@patternfly/react-core';
import { hasMaxDecimals } from '../../SmartComponents/CreatePolicy/validate';

const ComplianceThresholdHelperText = ({ threshold }) => {
  const parsedThreshold = parseFloat(threshold);

  return (
    <React.Fragment>
      <HelperText>
        {(parsedThreshold < 0 ||
          parsedThreshold > 100 ||
          isNaN(parsedThreshold)) && (
          <HelperTextItem variant="error">
            Threshold has to be a number between 0 and 100
          </HelperTextItem>
        )}
        {!hasMaxDecimals(parsedThreshold, 1) && (
          <HelperTextItem variant="error">
            Threshold values can have a maximum of one decimal place
          </HelperTextItem>
        )}
      </HelperText>
    </React.Fragment>
  );
};

ComplianceThresholdHelperText.propTypes = {
  threshold: propTypes.oneOfType([propTypes.string, propTypes.number]),
};

export default ComplianceThresholdHelperText;
