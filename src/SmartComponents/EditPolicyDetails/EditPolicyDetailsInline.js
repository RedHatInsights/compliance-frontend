import React, { useState, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  FormGroup,
  Content,
  TextInput,
  ContentVariants,
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
  style,
  hasEditPermission,
  ...props
}) => {
  const copiedData = policy;
  // TODO Re-enable when there is a alternative to Prompt
  // const [dirty, setDirty] = useState(false);

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

  const handleSaveEdit = () => {
    setIsEditOpen(false);
    refetch();
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    // setDirty(false);
  };

  const constructData = {
    ...copiedData,
    [propertyName]: value,
  };

  const [isSaving, onSave] = useOnSavePolicyDetails(policy, constructData, {
    onSave: handleSaveEdit,
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
    <FormGroup className="pf-v6-c-inline-edit pf-v6-m-inline-editable">
      <Content component={ContentVariants.h5}>
        {label}
        {hasEditPermission && (
          <Button
            icon={<PencilAltIcon />}
            onClick={handleToggle}
            variant="plain"
            style={{ marginLeft: '5px' }}
            ouiaId="InlineEditPencil"
          />
        )}
        {variant === 'threshold' ? (
          <PolicyThresholdTooltip />
        ) : variant === 'business' ? (
          <PolicyBusinessObjectiveTooltip />
        ) : null}
      </Content>
      <div className="pf-v6-c-inline-edit__group">
        {isEditOpen ? (
          <>
            <div style={style}>
              <Component value={value} onChange={handleTextUpdate} {...props} />
              {showTextUnderInline && validThreshold ? (
                <Content component="p">{textUnderInline}</Content>
              ) : null}
              {!validThreshold && (
                <ComplianceThresholdHelperText threshold={value} />
              )}
            </div>
            <div
              className="pf-v6-c-inline-edit__group pf-v6-m-action-group pf-v6-m-icon-group"
              style={{
                display: 'inline',
              }}
            >
              <div
                className="pf-v6-c-inline-edit__action pf-v6-m-valid"
                style={{
                  display: 'inline',
                }}
              >
                <Button
                  icon={
                    <Icon>
                      <CheckIcon />
                    </Icon>
                  }
                  className="pf-v6-c-button"
                  variant="plain"
                  type="button"
                  aria-label="Save edits"
                  ouiaId="SaveEdits"
                  isDisabled={!validThreshold ? true : false}
                  isLoading={isSaving}
                  onClick={() => onSave()}
                  style={{
                    marginLeft: '5px',
                    color: validThreshold
                      ? 'var(--pf-t--global--background--color--primary--default)'
                      : 'var(--pf-v6-c-button--disabled--Color)',
                  }}
                />
              </div>
              <div
                className="pf-v6-c-inline-edit__action"
                style={{
                  display: 'inline',
                }}
              >
                <Button
                  icon={
                    <Icon>
                      <TimesIcon />
                    </Icon>
                  }
                  className="pf-v6-c-button"
                  variant="plain"
                  type="button"
                  aria-label="Cancel edits"
                  ouiaId="CancelEdits"
                  onClick={handleCloseEdit}
                  style={{ marginLeft: '5px' }}
                />
              </div>
            </div>
          </>
        ) : variant !== 'description' ? (
          <Content className="labelClosedText" component={ContentVariants.p}>
            {inlineClosedText}
          </Content>
        ) : (
          <Content className="textAreaClosedText" component={ContentVariants.p}>
            <Truncate text={text} length={380} inline={true} />
          </Content>
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
  Component: propTypes.elementType,
  refetch: propTypes.func,
  style: propTypes.object,
  hasEditPermission: propTypes.bool.isRequired,
};

export default EditPolicyDetailsInline;
