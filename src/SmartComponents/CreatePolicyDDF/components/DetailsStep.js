import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { useFormApi, FormSpy } from '@data-driven-forms/react-form-renderer';
import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  TextArea,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import {
  PolicyThresholdTooltip,
  PolicyBusinessObjectiveTooltip,
  ComplianceThresholdHelperText,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';

const thresholdValid = (threshold) => {
  const parsedThreshold = parseFloat(threshold);
  return (
    !isNaN(parsedThreshold) && parsedThreshold <= 100 && parsedThreshold >= 0
  );
};

const DetailsStepContent = ({ profile, name }) => {
  const { change } = useFormApi();
  const [nameError, setNameError] = useState(null);
  const [threshold, setThreshold] = useState(100);
  const [isValidThreshold, setIsValidThreshold] = useState(true);

  const { data: totalPolicies, loading } = usePolicies({
    params: {
      filters: `title="${name || profile.title}"`,
    },
    onlyTotal: true,
    skip: !name && !profile.title,
  });

  useEffect(() => {
    if (profile) {
      change('name', profile.title);
      change('description', profile.description);
      change('details-validation', 'pending');
    }
  }, [profile, change]);

  useEffect(() => {
    if (!loading && totalPolicies !== undefined) {
      if (totalPolicies > 0) {
        setNameError('A policy with this name already exists');
        change('details-validation', 'invalid');
      } else {
        setNameError(null);
        change('details-validation', 'valid');
      }
    }
  }, [totalPolicies, loading, change]);

  const handleNameChange = (_event, value) => {
    change('name', value);
  };

  const handleDescriptionChange = (_event, value) => {
    change('description', value);
  };

  const handleBusinessObjectiveChange = (_event, value) => {
    change('businessObjective', value);
  };

  const handleThresholdChange = (_event, value) => {
    setThreshold(value);
    const valid = thresholdValid(value);
    setIsValidThreshold(valid);
    if (valid) {
      change('complianceThreshold', parseFloat(value));
    }
  };

  return (
    <React.Fragment>
      <Content>
        <Content component={ContentVariants.h1}>Details</Content>
      </Content>
      <br />
      <Form id="editpolicydetails">
        <FormGroup label="Policy name" isRequired fieldId="name">
          <FormSpy subscription={{ values: true }}>
            {({ values }) => (
              <TextInput
                type="text"
                id="name"
                name="name"
                value={values.name || ''}
                onChange={handleNameChange}
                validated={nameError ? 'error' : 'default'}
                aria-describedby="name"
              />
            )}
          </FormSpy>
          {nameError && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="error">{nameError}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>

        <FormGroup label="Reference ID" isRequired fieldId="refId">
          <TextInput
            type="text"
            id="refId"
            name="refId"
            value={profile.ref_id}
            isDisabled
            aria-describedby="refId"
          />
        </FormGroup>

        <FormGroup label="Description" fieldId="description">
          <FormSpy subscription={{ values: true }}>
            {({ values }) => (
              <TextArea
                id="description"
                name="description"
                value={values.description || ''}
                onChange={handleDescriptionChange}
                aria-describedby="description"
              />
            )}
          </FormSpy>
        </FormGroup>

        <FormGroup
          label="Business objective"
          labelHelp={<PolicyBusinessObjectiveTooltip />}
          fieldId="businessObjective"
        >
          <FormSpy subscription={{ values: true }}>
            {({ values }) => (
              <TextInput
                type="text"
                id="businessObjective"
                name="businessObjective"
                value={values.businessObjective || ''}
                onChange={handleBusinessObjectiveChange}
                aria-describedby="businessObjective"
              />
            )}
          </FormSpy>
        </FormGroup>

        <FormGroup
          fieldId="policy-threshold"
          labelHelp={<PolicyThresholdTooltip />}
          label="Compliance threshold (%)"
          style={{ width: '60%', display: 'block' }}
        >
          <TextInput
            type="number"
            id="complianceThreshold"
            name="complianceThreshold"
            value={threshold}
            onChange={handleThresholdChange}
            validated={isValidThreshold ? 'default' : 'error'}
            aria-label="compliance threshold"
          />
          {isValidThreshold ? (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="default">
                  A value of 95% or higher is recommended
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          ) : (
            <ComplianceThresholdHelperText threshold={threshold} />
          )}
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

DetailsStepContent.propTypes = {
  profile: propTypes.object,
  name: propTypes.string,
};

const DetailsStep = () => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <DetailsStepContent profile={values.profile} name={values.name} />
    )}
  </FormSpy>
);

export default DetailsStep;
