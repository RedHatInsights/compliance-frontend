import React, { useState, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
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
// import Prompt from '@redhat-cloud-services/frontend-components/Prompt';
import { useOnSave as useOnSavePolicyDetails } from '../EditPolicy/hooks';
import { thresholdValid } from '../CreatePolicy/validate';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

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
  refetch,
  ...props
}) => {
  const copiedData = policy;
  // TODO Re-enable when there is a alternative to Prompt
  // const [dirty, setDirty] = useState(false);

  const { hasAccess, isLoading } = usePermissionsWithContext(
    ['compliance:policy:write'],
    false,
    false
  );

  const hasPermission = !isLoading && hasAccess;

  const [value, setValue] = useState(text);
  const [validThreshold, setValidThreshold] = useState(true);
  const handleTextUpdate = (newText, e) => {
    if (e.target.id === 'policydetails-input-threshold') {
      if (thresholdValid(newText) === true) {
        setValue(newText);
        setValidThreshold(true);
        // setDirty(!!e.target.value);
      } else {
        setValidThreshold(false);
      }
    }
    setValue(newText);
    // setDirty(!!e.target.value);
  };
  const handleCloseEdit = () => {
    setIsEditOpen(false);
    // setDirty(false);
    refetch();
  };

  const constructData =
    propertyName === 'businessObjective'
      ? { ...copiedData, [propertyName]: { title: value } }
      : {
          ...copiedData,
          [propertyName]: value,
        };

  const [isSaving, onSave] = useOnSavePolicyDetails(policy, constructData, {
    onSave: handleCloseEdit,
  });

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
    <FormGroup className="pf-v5-c-inline-edit pf-v5-m-inline-editable">
      <Text component={TextVariants.h5}>
        {label}
        {hasPermission && (
          <Button
            onClick={handleToggle}
            variant="plain"
            style={{ 'margin-left': '5px' }}
          >
            <i className="fas fa-pencil-alt" aria-hidden="true" />
          </Button>
        )}
        {variant === 'threshold' ? (
          <PolicyThresholdTooltip />
        ) : variant === 'business' ? (
          <PolicyBusinessObjectiveTooltip />
        ) : null}
      </Text>
      <Text
        className="pf-v5-c-inline-edit__value"
        id="pf-v5-global--spacer--xs"
      >
        {text}
      </Text>
      <div className="pf-v5-c-inline-edit__action pf-v5-m-enable-editable">
        <Button
          className="pf-v5-c-button pf-v5-m-plain"
          type="button"
          id="edit-button"
          aria-label="Edit"
          aria-labelledby="single-editable-edit-button"
        />
      </div>
      <div className="pf-v5-c-inline-edit__group">
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
            <div className="pf-v5-c-inline-edit__group pf-v5-m-action-group pf-v5-m-icon-group">
              <div className="pf-v5-c-inline-edit__action pf-v5-m-valid">
                <Button
                  className="pf-v5-c-button pf-v5-m-plain"
                  type="button"
                  aria-label="Save edits"
                  isDisabled={!validThreshold ? true : false}
                  isLoading={isSaving}
                  onClick={() => onSave()}
                  style={{ 'margin-left': '5px' }}
                >
                  <i className="fas fa-check" aria-hidden="true"></i>
                </Button>
              </div>
              <div className="pf-v5-c-inline-edit__action">
                <Button
                  className="pf-v5-c-button pf-v5-m-plain"
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
      {/* <Prompt
        when={dirty}
        message="You have unsaved changes on this page. Are you sure you want to leave?"
      /> */}
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
  refetch: propTypes.func,
};

export default EditPolicyDetailsInline;
