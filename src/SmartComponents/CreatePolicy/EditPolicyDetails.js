import React, { useEffect } from 'react';
import { compose } from 'redux';
import {
  Field,
  reduxForm,
  formValueSelector,
  propTypes as reduxFormPropTypes,
  stopAsyncValidation,
} from 'redux-form';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import {
  ReduxFormTextInput,
  ReduxFormTextArea,
} from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import {
  ProfileThresholdField,
  PolicyBusinessObjectiveTooltip,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';

export const EditPolicyDetails = ({
  change,
  profile,
  refId,
  name,
  dispatch,
}) => {
  const { data: totalPolicies, loading } = usePolicies({
    params: {
      filter: `os_major_version=${profile.os_major_version} AND title~"${name}"`,
    },
    onlyTotal: true,
    skip: !name,
  });

  useEffect(() => {
    if (loading) {
      change('detailsStepLoaded', false);
      return;
    }
    if (totalPolicies !== undefined) {
      if (profile && profile.ref_id !== refId) {
        change('name', `${profile.title}`);
        change('refId', `${profile.ref_id}`);
        change('description', `${profile.description}`);
      }
      if (totalPolicies > 0) {
        dispatch(
          stopAsyncValidation('policyForm', {
            name: 'A policy with this name already exists',
          }),
        );
      } else {
        dispatch(stopAsyncValidation('policyForm', null));
      }
      change('detailsStepLoaded', true);
    }
  }, [totalPolicies, loading, profile, refId, change, dispatch]);

  return (
    <React.Fragment>
      <Content>
        <Content component={ContentVariants.h1}>Details</Content>
      </Content>
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
          labelHelp={<PolicyBusinessObjectiveTooltip />}
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
  name: propTypes.string,
  change: reduxFormPropTypes.change,
  dispatch: reduxFormPropTypes.dispatch,
  detailsStepLoaded: propTypes.bool,
};

const mapStateToProps = (state) => {
  const profile = selector(state, 'profile');
  return {
    profile,
    refId: selector(state, 'refId'),
    name: selector(state, 'name'),
    detailsStepLoaded: selector(state, 'detailsStepLoaded'),
    initialValues: {
      name: `${profile.title}`,
      refId: `${profile.ref_id}`,
      description: `${profile.description}`,
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
  }),
)(EditPolicyDetails);
