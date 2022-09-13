import React, { useEffect } from 'react';
import { compose } from 'redux';
import {
  Field,
  reduxForm,
  formValueSelector,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import {
  ReduxFormTextInput,
  ReduxFormTextArea,
} from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import {
  ProfileThresholdField,
  PolicyBusinessObjectiveTooltip,
} from 'PresentationalComponents';

export const EditPolicyDetails = ({ change, policy, refId }) => {
  useEffect(() => {
    if (policy && policy.refId !== refId) {
      change('name', `${policy.name}`);
      change('refId', `${policy.refId}`);
      change('description', `${policy.description}`);
    }
  }, [policy]);

  return (
    <React.Fragment>
      <TextContent>
        <Text component={TextVariants.h1}>Details</Text>
      </TextContent>
      <br />
      <Form id="editpolicydetails">
        <FormGroup label="Policy name" isRequired fieldId="name">
          <Field
            component={ReduxFormTextInput}
            type="text"
            isRequired={true}
            id="name"
            name="name"
            aria-describedby="name"
          />
        </FormGroup>
        <FormGroup label="Reference ID" isRequired fieldId="refId">
          <Field
            type="text"
            component={ReduxFormTextInput}
            isDisabled
            id="refId"
            name="refId"
            aria-describedby="refId"
          />
        </FormGroup>
        <FormGroup label="Description" fieldId="description">
          <Field
            type="text"
            component={ReduxFormTextArea}
            id="description"
            name="description"
            aria-describedby="description"
          />
        </FormGroup>
        <FormGroup
          label="Business objective"
          labelIcon={<PolicyBusinessObjectiveTooltip />}
          fieldId="businessObjective"
        >
          <Field
            type="text"
            component={ReduxFormTextInput}
            id="businessObjective"
            name="businessObjective"
            aria-describedby="businessObjective"
            defaultValue={policy.businessObjective}
          />
        </FormGroup>
        <ProfileThresholdField previousThreshold={100} />
      </Form>
    </React.Fragment>
  );
};

const selector = formValueSelector('policyForm');

EditPolicyDetails.propTypes = {
  policy: propTypes.object,
  refId: propTypes.string,
  change: reduxFormPropTypes.change,
};

const mapStateToProps = (state) => {
  const policy = selector(state, 'profile');
  return {
    policy,
    refId: selector(state, 'refId'),
    initialValues: {
      name: `${policy.name}`,
      refId: `${policy.refId}`,
      description: `${policy.description}`,
      benchmark: selector(state, 'benchmark'),
      osMajorVersion: selector(state, 'osMajorVersion'),
      profile: selector(state, 'profile'),
    },
  };
};

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(EditPolicyDetails);
