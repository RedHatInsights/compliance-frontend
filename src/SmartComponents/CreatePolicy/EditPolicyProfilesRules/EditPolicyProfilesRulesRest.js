import React from 'react';
import propTypes from 'prop-types';
import { propTypes as reduxFormPropTypes } from 'redux-form';

export const EditPolicyProfilesRulesRest = ({
  policy,
  selectedRuleRefIds,
  change,
  osMajorVersion,
  osMinorVersionCounts,
  ruleValues,
}) => {
  return <React.Fragment />;
};

EditPolicyProfilesRulesRest.propTypes = {
  policy: propTypes.object,
  change: reduxFormPropTypes.change,
  osMajorVersion: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    })
  ),
  selectedRuleRefIds: propTypes.array,
  ruleValues: propTypes.array,
};

export default EditPolicyProfilesRulesRest;
