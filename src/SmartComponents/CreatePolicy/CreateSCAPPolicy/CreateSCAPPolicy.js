import React from 'react';
import propTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  formValueSelector,
  reduxForm,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import CreateSCAPPolicyRest from './CreateSCAPPolicyRest';

const CreateSCAPPolicy = (props) => {
  return <CreateSCAPPolicyRest {...props} />;
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
