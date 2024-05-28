import React from 'react';
import propTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
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
      labelIcon={<PolicyThresholdTooltip />}
      label="Compliance threshold (%)"
      style={{ width: '60%', display: 'block' }}
    >
      <Field
        name="complianceThreshold"
        id="complianceThreshold"
        isRequired={true}
        onChange={(_, v) => onThresholdChange(v)}
        validated={validThreshold ? 'default' : 'error'}
        defaultValue={threshold}
        aria-label="compliance threshold"
        component={ReduxFormTextInput}
        type="number"
      />
      {validThreshold ? (
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant="default">
              A value of 95% or higher is recommended
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      ) : (
        <ComplianceThresholdHelperText threshold={threshold} />
      )}
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
