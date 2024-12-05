import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Bullseye } from '@patternfly/react-core';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import propTypes from 'prop-types';
import {
  formValueSelector,
  reduxForm,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';
import EditPolicyProfilesRulesRest from './EditPolicyProfilesRulesRest';
import EditPolicyProfilesRulesGraphQL from './EditPolicyProfilesRulesGraphQL';

const EditPolicyProfilesRules = (props) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled === undefined ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : apiV2Enabled ? (
    <EditPolicyProfilesRulesRest {...props} />
  ) : (
    <EditPolicyProfilesRulesGraphQL {...props} />
  );
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
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    policy: selector(state, 'profile'), // TODO: use "profile" naming instead of "policy"
    osMajorVersion: selector(state, 'osMajorVersion'),
    osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
    selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
    ruleValues: selector(state, 'ruleValues'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(EditPolicyProfilesRules);
