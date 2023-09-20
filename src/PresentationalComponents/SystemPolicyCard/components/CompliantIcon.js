import React from 'react';
import propTypes from 'prop-types';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

const CompliantIcon = ({ compliant }) =>
  compliant ? (
    <div className="ins-c-policy-card ins-m-compliant">
      <CheckCircleIcon /> Compliant
    </div>
  ) : (
    <div className="ins-c-policy-card ins-m-noncompliant">
      <ExclamationCircleIcon /> Not compliant
    </div>
  );

CompliantIcon.propTypes = {
  compliant: propTypes.bool,
};
export default CompliantIcon;
