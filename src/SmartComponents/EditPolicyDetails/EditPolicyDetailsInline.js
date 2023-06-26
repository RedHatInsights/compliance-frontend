import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  FormGroup,
  Text,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';
import {
  PolicyThresholdTooltip,
  PolicyBusinessObjectiveTooltip,
  ComplianceThresholdHelperText,
} from 'PresentationalComponents';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import propTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { useOnSavePolicyDetails } from '../EditPolicy/hooks';
import { thresholdValid } from '../CreatePolicy/validate';

const EditPolicyDetailsInline = ({
  text,
  policy,
  variant,
  propertyName,
  inlineClosedText,
  label,
  showTextUnderInline,
  textUnderInline,
  typeOfInput,
  Component = TextInput,
  ...props
}) => {
  const copiedData = policy;
  const [value, setValue] = useState(text);
  const [validThreshold, setValidThreshold] = useState(true);
  const handleTextUpdate = (newText, e) => {
    if (e.target.id === 'policydetails-input-threshold') {
      if (thresholdValid(newText) === true) {
        setValue(newText);
        setValidThreshold(true);
        setDirty(!!e.target.value);
      } else {
        setValidThreshold(false);
      }
    }
    setValue(newText);
    setDirty(!!e.target.value);
  };
  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setDirty(false);
    setValue(text);
  };
  //marking page as dirty if user didn't save changes and tries to navigate away
  const [dirty, setDirty] = useState(false);
  const constructData =
    propertyName === 'businessObjective'
      ? { ...copiedData, [propertyName]: { title: value } }
      : {
          ...copiedData,
          [propertyName]: value,
        };

  const [isSaving, onSave] = useOnSavePolicyDetails(
    policy,
    constructData,
    handleCloseEdit,
    policy.id
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleToggle = () => {
    setIsEditOpen(!isEditOpen);
    setValue(text);
  };
  const useInputFocus = useRef();
  useEffect(() => {
    if (isEditOpen && useInputFocus && useInputFocus.current) {
      useInputFocus.current.focus();
    }
  }, [isEditOpen]);

  return (
    <FormGroup className="pf-c-inline-edit pf-m-inline-editable">
      <Text component={TextVariants.h5}>
        {label}
        <Button
          onClick={handleToggle}
          variant="plain"
          style={{ 'margin-left': '5px' }}
        >
          <i className="fas fa-pencil-alt" aria-hidden="true" />
        </Button>
        {variant === 'threshold' ? (
          <PolicyThresholdTooltip />
        ) : variant === 'business' ? (
          <PolicyBusinessObjectiveTooltip />
        ) : null}
      </Text>
      <Text className="pf-c-inline-edit__value" id="pf-global--spacer--xs">
        {text}
      </Text>
      <div className="pf-c-inline-edit__action pf-m-enable-editable">
        <Button
          className="pf-c-button pf-m-plain"
          type="button"
          id="edit-button"
          aria-label="Edit"
          aria-labelledby="single-editable-edit-button"
        />
      </div>
      <div className="pf-c-inline-edit__group">
        {isEditOpen ? (
          <>
            <div>
              <Component value={value} onChange={handleTextUpdate} {...props} />
              {showTextUnderInline && validThreshold ? (
                <Text>{textUnderInline}</Text>
              ) : null}
              {!validThreshold && (
                <ComplianceThresholdHelperText threshold={value} />
              )}
            </div>
            <div className="pf-c-inline-edit__group pf-m-action-group pf-m-icon-group">
              <div className="pf-c-inline-edit__action pf-m-valid">
                <Button
                  className="pf-c-button pf-m-plain"
                  type="button"
                  aria-label="Save edits"
                  isDisabled={!validThreshold ? true : false}
                  isLoading={isSaving}
                  onClick={onSave}
                  style={{ 'margin-left': '5px' }}
                >
                  <i className="fas fa-check" aria-hidden="true"></i>
                </Button>
              </div>
              <div className="pf-c-inline-edit__action">
                <Button
                  className="pf-c-button pf-m-plain"
                  type="button"
                  aria-label="Cancel edits"
                  onClick={handleCloseEdit}
                  style={{ 'margin-left': '5px' }}
                >
                  <i className="fas fa-times" aria-hidden="true"></i>
                </Button>
              </div>
            </div>
          </>
        ) : variant !== 'description' ? (
          <Text className="labelClosedText" component={TextVariants.p}>
            {inlineClosedText}
          </Text>
        ) : (
          <Text className="textAreaClosedText" component={TextVariants.p}>
            <Truncate text={text} length={380} inline={true} />
          </Text>
        )}
      </div>
      <Prompt
        when={dirty}
        message="You have unsaved changes on this page. Are you sure you want to leave?"
      />
    </FormGroup>
  );
};

EditPolicyDetailsInline.propTypes = {
  text: propTypes.string,
  variant: propTypes.string,
  policy: propTypes.object,
  propertyName: propTypes.string,
  inlineClosedText: propTypes.string,
  label: propTypes.string,
  showTextUnderInline: propTypes.string,
  textUnderInline: propTypes.string,
  typeOfInput: propTypes.string,
  Component: propTypes.node,
};

export default EditPolicyDetailsInline;
