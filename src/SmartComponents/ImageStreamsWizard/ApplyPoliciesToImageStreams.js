import React from 'react';
import { FormSection, Field, reduxForm } from 'redux-form';
import { Form, FormGroup } from '@patternfly/react-core';
import { ReduxFormTextInput } from '../ReduxFormWrappers/ReduxFormWrappers';

class ApplyPoliciesToImageStreams extends React.Component {
    render() {
        return (
            <Form>
                <FormSection name='imagestream'>
                    <FormGroup label='Imagestream name (namespace/imagename)' isRequired>
                        <Field name='name' id='name' isRequired={true}
                            component={ReduxFormTextInput} type='text' />
                    </FormGroup>
                </FormSection>
            </Form>
        );
    }
}

export default reduxForm({
    form: 'imagestreamWizard',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(ApplyPoliciesToImageStreams);
