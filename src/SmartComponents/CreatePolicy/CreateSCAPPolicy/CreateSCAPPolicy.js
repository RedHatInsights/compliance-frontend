import React from 'react';
import propTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  formValueSelector,
  reduxForm,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import { Bullseye, Spinner } from '@patternfly/react-core';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';
import CreateSCAPPolicyGraphQL from './CreateSCAPPolicyGraphQL';
import CreateSCAPPolicyRest from './CreateSCAPPolicyRest';

const CreateSCAPPolicy = (props) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled === undefined ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : apiV2Enabled ? (
    <CreateSCAPPolicyRest {...props} />
  ) : (
    <CreateSCAPPolicyGraphQL {...props} />
  );
};

CreateSCAPPolicy.propTypes = {
  change: reduxFormPropTypes.change,
  selectedProfile: propTypes.object,
  selectedOsMajorVersion: propTypes.string,
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    selectedProfile: selector(state, 'profile'),
    selectedOsMajorVersion: selector(state, 'osMajorVersion'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(CreateSCAPPolicy);
