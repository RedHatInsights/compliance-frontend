import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Title, Popover, PopoverPosition } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { ReduxFormTextInput } from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import propTypes from 'prop-types';
import round from 'lodash/round';
import { thresholdValid } from '../CreatePolicy/validate';

export class ProfileThresholdField extends React.Component {
    state = {
        validThreshold: thresholdValid(this.props.previousThreshold),
        threshold: round(this.props.previousThreshold || 100, 1)
    };

    handleThresholdChange = (threshold) => (
        this.setState({
            validThreshold: thresholdValid(threshold),
            threshold: round(threshold, 1)
        })
    )

    render() {
        const { threshold, validThreshold } = this.state;
        const { showTitle } = this.props;
        const explanation = <React.Fragment>The compliance threshold defines what percentage of rules
            must be met in order for a system to be determined &quot;compliant&quot;.</React.Fragment>;
        const titleHeader = <Title headingLevel="h3" size="xl">Compliance threshold</Title>;
        const title = <React.Fragment>
            { titleHeader }
            { explanation }
        </React.Fragment>;
        const popover = <Popover
            position={PopoverPosition.top}
            headerContent={titleHeader}
            bodyContent={explanation}
        >
            <OutlinedQuestionCircleIcon />
        </Popover>;

        return (
            <React.Fragment>
                { showTitle && title }
                <FormGroup fieldId='policy-threshold'
                    validated={ validThreshold ? 'default' : 'error' }
                    helperTextInvalid='Threshold has to be a number between 0 and 100'
                    helperText="A value of 95% or higher is recommended"
                    label={<React.Fragment>Compliance threshold (%) {!showTitle && popover}</React.Fragment>}>
                    <Field name='complianceThreshold' id='complianceThreshold' isRequired={true}
                        onChange={this.handleThresholdChange}
                        validated={ validThreshold ? 'default' : 'error' }
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
    previousThreshold: propTypes.number,
    showTitle: propTypes.bool
};

export default reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(ProfileThresholdField);
