import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form } from '@patternfly/react-core';
import { ReduxFormTextInput } from '../ReduxFormWrappers/ReduxFormWrappers';

const EditPolicySystems = () => {
    return (
        <React.Fragment>
            <Form>
                <Field defaultValue={'systems'}
                    component={ReduxFormTextInput}
                    type='text'
                    isRequired={true}
                    id="systems"
                    name="systems"
                    aria-describedby="systems"
                />
            </Form>
        </React.Fragment>
    );
};

export default reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false
})(EditPolicySystems);
