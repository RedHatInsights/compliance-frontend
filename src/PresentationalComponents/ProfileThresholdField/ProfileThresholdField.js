import React from 'react';
import propTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormGroup } from '@patternfly/react-core';
import { ReduxFormTextInput } from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import {
  PolicyThresholdTooltip,
  ComplianceThresholdHelperText,
} from 'PresentationalComponents';

import useThresholdField from './hooks/useThresholdField';

export const ProfileThresholdField = ({ previousThreshold }) => {
  const { threshold, validThreshold, onThresholdChange } =
    useThresholdField(previousThreshold);

  return (
    <FormGroup
      fieldId="policy-threshold"
      validated={validThreshold ? 'default' : 'error'}
      helperTextInvalid={
        <ComplianceThresholdHelperText threshold={threshold} />
      }
      helperText="A value of 95% or higher is recommended"
      labelIcon={<PolicyThresholdTooltip />}
      label="Compliance threshold (%)"
    >
      <Field
        name="complianceThreshold"
        id="complianceThreshold"
        isRequired={true}
        onChange={onThresholdChange}
        validated={validThreshold ? 'default' : 'error'}
        defaultValue={threshold}
        aria-label="compliance threshold"
        component={ReduxFormTextInput}
        type="number"
        style={{ width: '60%', display: 'block' }}
      />
    </FormGroup>
  );
};

ProfileThresholdField.propTypes = {
  previousThreshold: propTypes.number,
};

export default reduxForm({
  form: 'policyForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ProfileThresholdField);
