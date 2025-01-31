import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import {
  formValueSelector,
  reduxForm,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import EditPolicyProfilesRulesRest from './EditPolicyProfilesRulesRest';

const EditPolicyProfilesRules = (props) => {
  return <EditPolicyProfilesRulesRest {...props} />;
};

EditPolicyProfilesRules.propTypes = {
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
  valueOverrides: propTypes.object,
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    policy: selector(state, 'profile'), // TODO: use "profile" naming instead of "policy"
    osMajorVersion: selector(state, 'osMajorVersion'),
    osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
    selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
    ruleValues: selector(state, 'ruleValues'),
    valueOverrides: selector(state, 'valueOverrides'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(EditPolicyProfilesRules);
