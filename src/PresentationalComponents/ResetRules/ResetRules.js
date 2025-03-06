import React from 'react';
import { RebootingIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';

/**
 * This component displays a Reset Button
 *
 *  @param {object}   props                Component Props
 *  @param {number}   props.osMinorVersion Operating System Minor Version
 *  @param {Function} props.onRuleReset    Callback for resetting the rules
 */
const ResetRules = ({ osMinorVersion, onRuleReset }) => {
  const resetDefaultRules = () => {
    if (onRuleReset != null && osMinorVersion != null) {
      onRuleReset(osMinorVersion);
    }
  };
  return (
    <a className="pf-v5-u-ml-lg pf-v5-u-mr-xl" onClick={resetDefaultRules}>
      <RebootingIcon className="pf-v5-u-mr-sm" />
      Reset to default
    </a>
  );
};

ResetRules.propTypes = {
  osMinorVersion: propTypes.number,
  onRuleReset: propTypes.func,
};

export default ResetRules;
