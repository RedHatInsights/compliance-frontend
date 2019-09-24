import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form } from '@patternfly/react-core';
import { ReduxFormTextInput } from '../ReduxFormWrappers/ReduxFormWrappers';

const EditPolicyRules = () => {
    return (
        <React.Fragment>
            <Form>
                <Field defaultValue={'rules'}
                    component={ReduxFormTextInput}
                    type='text'
                    isRequired={true}
                    id="rules"
                    name="rules"
                    aria-describedby="rules"
                />
            </Form>
        </React.Fragment>
    );
};

export default reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false
})(EditPolicyRules);
