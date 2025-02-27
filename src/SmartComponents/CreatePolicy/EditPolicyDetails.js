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

export const EditPolicyDetails = ({ change, profile, refId }) => {
  useEffect(() => {
    if (profile && profile.ref_id !== refId) {
      change('name', `${profile.title}`);
      change('refId', `${profile.ref_id}`);
      change('description', `${profile.description}`);
    }
  }, [profile]);

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
            defaultValue={profile.business_objective}
          />
        </FormGroup>
        <ProfileThresholdField previousThreshold={100} />
      </Form>
    </React.Fragment>
  );
};

const selector = formValueSelector('policyForm');

EditPolicyDetails.propTypes = {
  profile: propTypes.object,
  refId: propTypes.string,
  change: reduxFormPropTypes.change,
};

const mapStateToProps = (state) => {
  const profile = selector(state, 'profile');
  return {
    profile,
    refId: selector(state, 'refId'),
    initialValues: {
      name: `${profile.title}`,
      refId: `${profile.ref_id}`,
      description: `${profile.description}`,
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
