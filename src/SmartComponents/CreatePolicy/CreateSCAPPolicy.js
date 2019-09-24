import React from 'react';
import {
    Form,
    FormGroup,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import ProfileTypeSelect from './ProfileTypeSelect';
import { Field, reduxForm } from 'redux-form';
import { ReduxFormRadioInput } from '../ReduxFormWrappers/ReduxFormWrappers';

class CreateSCAPPolicy extends React.Component {
    render() {
        return (
            <React.Fragment>
                <TextContent>
                    <Text component={TextVariants.h1}>
                        Create SCAP policy
                    </Text>
                    <Text component={TextVariants.h4}>
                        Select the security guide and profile type for this policy.
                    </Text>
                </TextContent>
                <Form>
                    <FormGroup
                        label="Security guide"
                        isRequired
                        fieldId="benchmark">
                        <Field component={ReduxFormRadioInput} label="RHEL8" name='security-guide-rhel8' id='radio-rhel8'/>
                        <Field component={ReduxFormRadioInput} label="RHEL7" name='security-guide-rhel7' id='radio-rhel7'/>
                        <Field component={ReduxFormRadioInput} label="RHEL6" name='security-guide-rhel6' id='radio-rhel6'/>
                    </FormGroup>
                    <FormGroup label="Profile type" isRequired fieldId="profile-type">
                        <ProfileTypeSelect />
                    </FormGroup>
                </Form>
            </React.Fragment>
        );
    }
};

export default reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false
})(CreateSCAPPolicy);
