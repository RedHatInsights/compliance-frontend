import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Title, Popover, PopoverPosition } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { ReduxFormTextInput } from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import propTypes from 'prop-types';
import round from 'lodash/round';

export class ProfileThresholdField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validThreshold: true,
            threshold: round(props.previousThreshold, 1)
        };
    }

    handleThresholdChange = threshold => {
        if (threshold > 100 || threshold < 0) {
            this.setState({ validThreshold: false });
        } else {
            this.setState({ validThreshold: true, threshold: round(threshold, 1) });
        }
    };

    render() {
        const { threshold, validThreshold } = this.state;
        const popover = <Popover
            position={PopoverPosition.top}
            headerContent={<Title headingLevel="h3" size="xl">Compliance threshold</Title>}
            bodyContent={<div>The compliance threshold defines what percentage of rules must be met in order for a system to
            be determined &quot;compliant&quot;.</div>}
        >
            <OutlinedQuestionCircleIcon />
        </Popover>;

        return (
            <React.Fragment>
                <FormGroup fieldId='policy-threshold'
                    isValid={validThreshold}
                    helperTextInvalid='Threshold has to be a number between 0 and 100'
                    helperText="A value of 95% or higher is recommended"
                    label={<React.Fragment>Compliance threshold (%) {popover}</React.Fragment>}>
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
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(ProfileThresholdField);
