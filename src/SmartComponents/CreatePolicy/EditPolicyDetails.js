import React from 'react';
import { compose } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Form, FormGroup, Text, TextContent, TextVariants } from '@patternfly/react-core';

import { ReduxFormTextInput, ReduxFormTextArea } from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import {
    ProfileThresholdField,
    BusinessObjectiveField
} from 'SmartComponents';

const EditPolicyDetails = ({ profile, dispatch }) => {
    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Policy details
                </Text>
            </TextContent>
            <br/>
            <Form id='editpolicydetails'>
                <FormGroup label="Policy name" isRequired fieldId="name">
                    <Field
                        component={ReduxFormTextInput}
                        type='text'
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
                <BusinessObjectiveField
                    businessObjective={{}}
                    policyId={profile.id}
                    dispatch={dispatch}
                />
                <ProfileThresholdField showTitle={false} previousThreshold={profile.complianceThreshold} />
            </Form>
        </React.Fragment>
    );
};

const selector = formValueSelector('policyForm');

EditPolicyDetails.propTypes = {
    profile: propTypes.object,
    dispatch: propTypes.func
};

export default compose(
    connect(
        state => ({
            profile: JSON.parse(selector(state, 'profile')),
            initialValues: {
                name: `${JSON.parse(selector(state, 'profile')).name}`,
                refId: `${JSON.parse(selector(state, 'profile')).refId}`,
                description: `${JSON.parse(selector(state, 'profile')).description}`,
                benchmark: selector(state, 'benchmark'),
                profile: selector(state, 'profile')
            }
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicyDetails);

export { EditPolicyDetails };
