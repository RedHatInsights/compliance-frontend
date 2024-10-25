import React, { useState, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  FormGroup,
  Text,
  TextInput,
  TextVariants,
  Icon,
} from '@patternfly/react-core';
import { TimesIcon, CheckIcon, PencilAltIcon } from '@patternfly/react-icons';

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
  const handleTextUpdate = (event, newText) => {
    if (event.target.id === 'policydetails-input-threshold') {
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
            ouiaId="InlineEditPencil"
          >
            <PencilAltIcon />
          </Button>
        )}
        {variant === 'threshold' ? (
          <PolicyThresholdTooltip />
        ) : variant === 'business' ? (
          <PolicyBusinessObjectiveTooltip />
        ) : null}
      </Text>
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
            <div
              className="pf-v5-c-inline-edit__group pf-v5-m-action-group pf-v5-m-icon-group"
              style={{
                display: 'inline',
              }}
            >
              <div
                className="pf-v5-c-inline-edit__action pf-v5-m-valid"
                style={{
                  display: 'inline',
                }}
              >
                <Button
                  className="pf-v5-c-button"
                  variant="plain"
                  type="button"
                  aria-label="Save edits"
                  ouiaId="SaveEdits"
                  isDisabled={!validThreshold ? true : false}
                  isLoading={isSaving}
                  onClick={() => onSave()}
                  style={{
                    'margin-left': '5px',
                    color: validThreshold
                      ? 'var(--pf-v5-global--primary-color--100)'
                      : 'var(--pf-v5-c-button--disabled--Color)',
                  }}
                >
                  <Icon>
                    <CheckIcon />
                  </Icon>
                </Button>
              </div>
              <div
                className="pf-v5-c-inline-edit__action"
                style={{
                  display: 'inline',
                }}
              >
                <Button
                  className="pf-v5-c-button"
                  variant="plain"
                  type="button"
                  aria-label="Cancel edits"
                  ouiaId="CancelEdits"
                  onClick={handleCloseEdit}
                  style={{ 'margin-left': '5px' }}
                >
                  <Icon>
                    <TimesIcon />
                  </Icon>
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
