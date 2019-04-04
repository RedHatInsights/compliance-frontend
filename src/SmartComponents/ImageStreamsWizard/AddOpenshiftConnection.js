import React from 'react';
import { Field, FormSection, reduxForm } from 'redux-form';
import { Form, FormGroup } from '@patternfly/react-core';
import { ReduxFormTextInput } from './ReduxFormWrappers';

const AddOpenshiftConnection = () => {
    return (
        <Form>
            <FormSection name='openshift_connection'>
                <FormGroup label='Openshift API URL' isRequired>
                    <Field name='api_url' id='api_url' isRequired={true}
                        component={ReduxFormTextInput} type='url' />
                </FormGroup>
                <FormGroup label='Registry API URL' isRequired>
                    <Field name='registry_api_url' id='registry_api_url' isRequired={true}
                        component={ReduxFormTextInput} type='url' />
                </FormGroup>
                <FormGroup label='Username' isRequired>
                    <Field name='username' id='username' isRequired={true}
                        component={ReduxFormTextInput} type='text' />
                </FormGroup>
                <FormGroup label='Token' isRequired>
                    <Field name='token' id='token' isRequired={true}
                        component={ReduxFormTextInput} type='text' />
                </FormGroup>
            </FormSection>
        </Form>
    );
};

export default reduxForm({
    form: 'imagestreamWizard',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(AddOpenshiftConnection);
