import React from 'react';
import {
    Form,
    FormGroup,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import BusinessObjectiveField from '../BusinessObjectiveField/BusinessObjectiveField';
import ProfileThresholdField from '../ProfileThresholdField/ProfileThresholdField';
import { ReduxFormTextInput, ReduxFormTextArea } from '../ReduxFormWrappers/ReduxFormWrappers';
import { Field, reduxForm } from 'redux-form';

const EditPolicyDetails = () => {
    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Policy details
                </Text>
            </TextContent>
            <Form>
                <FormGroup label="Policy name" isRequired fieldId="name">
                    <Field defaultValue={'default value is SSG + profile'}
                        component={ReduxFormTextInput}
                        type='text'
                        isRequired={true}
                        id="name"
                        name="name"
                        aria-describedby="name"
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
                <FormGroup label="User notes" fieldId="user-notes" helperText="A short note about this policy">
                    <Field
                        type="text"
                        component={ReduxFormTextInput}
                        id="userNotes"
                        name="userNotes"
                        aria-describedby="userNotes"
                    />
                </FormGroup>
                <BusinessObjectiveField />
                <ProfileThresholdField previousThreshold={90} />
            </Form>
        </React.Fragment>
    );
};

export default reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false
})(EditPolicyDetails);
