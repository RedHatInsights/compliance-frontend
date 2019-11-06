import React from 'react';
import { FormGroup, Form } from '@patternfly/react-core';
import { FormSection, Field, reduxForm } from 'redux-form';
import { ReduxFormCheckboxInput } from '../ReduxFormWrappers/ReduxFormWrappers';

const SelectPolicy = () => {
    // TODO: possibly extract the field options into an array. unless the order matters and should be guranteed
    return (
        <Form>
            <FormSection name='policy'>
                <FormGroup isRequired label="Which policy do you want to scan for?" fieldId="policy">
                    <Field component={ReduxFormCheckboxInput} value='pci'
                        id="PCI-DSS v3.2.1 Control Baseline" name="pci-dss"
                        label="PCI-DSS v3.2.1 Control Baseline"
                        aria-label="PCI-DSS v3.2.1 Control Baseline" />
                    <Field component={ReduxFormCheckboxInput} value='hipaa'
                        id="Health Insurance Portability and Accountability Act (HIPAA)"
                        name="hipaa" label="Health Insurance Portability and Accountability Act (HIPAA)"
                        aria-label="Health Insurance Portability and Accountability Act (HIPAA)" />
                    <Field component={ReduxFormCheckboxInput} value='cjis'
                        id="Criminal Justice Information Services (CJIS)" name="cjis"
                        label="Criminal Justice Information Services (CJIS)"
                        aria-label="Criminal Justice Information Services (CJIS)" />
                    <Field component={ReduxFormCheckboxInput} value='standard'
                        id="Standard System Security Profile" name="standard"
                        label="Standard System Security Profile" aria-label="Standard System Security Profile" />
                    <Field component={ReduxFormCheckboxInput} value='disa'
                        id="DISA STIG" name="stig-rhel7-disa" label="DISA STIG"
                        aria-label="DISA STIG" />
                </FormGroup>
            </FormSection>
        </Form>
    );
};

export default reduxForm({
    form: 'imagestreamWizard',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(SelectPolicy);
