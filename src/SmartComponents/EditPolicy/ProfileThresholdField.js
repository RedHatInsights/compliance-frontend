import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Title } from '@patternfly/react-core';
import { ReduxFormTextInput } from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import propTypes from 'prop-types';

class ProfileThresholdField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validThreshold: true,
            threshold: props.previousThreshold
        };
    }

    handleThresholdChange = threshold => {
        if (threshold > 100 || threshold < 0) {
            this.setState({ validThreshold: false });
        } else {
            this.setState({ validThreshold: true, threshold });
        }
    };

    render() {
        const { threshold, validThreshold } = this.state;
        return (
            <React.Fragment>
                <Title headingLevel="h3" size="xl">Compliance threshold</Title>
                The compliance threshold defines what percentage of rules must be met in order for a system to
                be determined &quot;compliant&quot;.
                <FormGroup field-id='policy-threshold'
                    isValid={validThreshold}
                    helperTextInvalid='Threshold has to be a number between 0 and 100'
                    helperText="A value of 95% or higher is recommended"
                    label="Compliance threshold (%)">
                    <Field name='complianceThreshold' id='complianceThreshold' isRequired={true}
                        onChange={this.handleThresholdChange}
                        isValid={validThreshold}
                        defaultValue={threshold}
                        aria-label="compliance threshold"
                        component={ReduxFormTextInput} type='number'
                        style={ { width: '60%', display: 'block' } } />
                </FormGroup>
            </React.Fragment>
        );
    }
}

ProfileThresholdField.propTypes = {
    previousThreshold: propTypes.number
};

export default reduxForm({
    form: 'editPolicy'
})(ProfileThresholdField);
