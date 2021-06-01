import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
    FormGroup, TextArea, TextInput
} from '@patternfly/react-core';
import {
    PolicyThresholdTooltip,
    PolicyBusinessObjectiveTooltip
} from 'PresentationalComponents';
import { thresholdValid } from '../CreatePolicy/validate';

export const useThresholdValidate = () => {
    const [validThreshold, setValidThreshold] = useState(true);
    return [validThreshold, (threshold) => {
        const valid = thresholdValid(threshold);
        setValidThreshold(valid);
        return valid;
    }];
};

const EditPolicyDetailsTab = ({ policy, setUpdatedPolicy }) => {
    const [validThreshold, validateThreshold] = useThresholdValidate();

    return <div className="pf-c-form">
        <FormGroup label="Policy description" isRequired fieldId="description">
            <TextArea
                style={ { width: 800, height: 110 } }
                isRequired
                type="text"
                id="description"
                name="description"
                aria-describedby="description"
                defaultValue={ policy.description }
                onChange={ (value) => {
                    setUpdatedPolicy((policy) => ({
                        ...policy,
                        description: value
                    }));
                }} />
        </FormGroup>

        <FormGroup
            label="Business objective"
            labelIcon={ <PolicyBusinessObjectiveTooltip /> }
            fieldId="business-objective">
            <TextInput
                type="text"
                style={ { width: 300 } }
                id="business-objective"
                name="business-objective"
                aria-describedby="business-objective"
                defaultValue={ policy?.businessObjective?.title }
                onChange={ (value) => {
                    setUpdatedPolicy((policy) =>({
                        ...policy,
                        businessObjective: {
                            ...policy.businessObjective,
                            title: value
                        }
                    }));
                }} />
        </FormGroup>

        <FormGroup
            validated={ validThreshold ? 'default' : 'error' }
            label='Compliance threshold (%)'
            labelIcon={ <PolicyThresholdTooltip /> }
            fieldId='policy-threshold'
            helperTextInvalid='Threshold has to be a number between 0 and 100'
            helperText='A value of 95% or higher is recommended'>
            <TextInput
                type='number'
                style={ { width: 150 } }
                name='compliance-threshold'
                id='compliance-threshold'
                defaultValue={ policy.complianceThreshold }
                aria-describedby="policy-threshold"
                onChange={ (value) => {
                    setUpdatedPolicy((policy) =>({
                        ...policy,
                        complianceThreshold: value,
                        complianceThresholdValid: validateThreshold(value)
                    }));
                }} />
        </FormGroup>
    </div>;
};

EditPolicyDetailsTab.propTypes = {
    policy: propTypes.shape({
        description: propTypes.string,
        businessObjective: propTypes.object,
        complianceThreshold: propTypes.oneOfType([
            propTypes.string,
            propTypes.number
        ])
    }),
    setUpdatedPolicy: propTypes.func
};

export default EditPolicyDetailsTab;
