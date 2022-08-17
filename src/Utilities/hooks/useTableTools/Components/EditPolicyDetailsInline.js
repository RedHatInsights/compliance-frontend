import React, { useState } from 'react';
import {
  Button,
  FormGroup,
  Text,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';

const EditPolicyDetailsInline = ({
  text,
  variant,
  policyData,
  buttonId,
  setCloseHook,
}) => {
  const copiedData = policyData;
  //handling text changes
  const [inputText, setInputText] = useState(text);
  const handleTextUpdate = (newText) => {
    setInputText(newText);
  };
  const handleCloseEdit = () => {
    setCloseHook(false);
  };

  const useLinkToPolicy = () => {
    const anchor = useAnchor();
    const linkToBackground = useLinkToBackground(
      `/scappolicies/${policyData.id}`
    );
    return () => {
      linkToBackground({ hash: anchor });
    };
  };

  const useOnSave = (policy, updatedPolicyHostsAndRules) => {
    const updatePolicy = usePolicy();
    const linkToPolicy = useLinkToPolicy();
    const [isSaving, setIsSaving] = useState(false);
    const onSave = () => {
      if (isSaving) {
        return Promise.resolve({});
      }
      setIsSaving(true);
      handleCloseEdit();
      updatePolicy(policy, updatedPolicyHostsAndRules)
        .then(() => {
          setIsSaving(false);
          dispatchNotification({
            variant: 'success',
            title: 'Policy updated',
            autoDismiss: true,
          });
          linkToPolicy();
        })
        .catch((error) => {
          setIsSaving(false);
          dispatchNotification({
            variant: 'danger',
            title: 'Error updating policy',
            description: error.message,
          });
          linkToPolicy();
        });
    };
    return [isSaving, onSave];
  };

  const constructData =
    buttonId === 'businessObjective'
      ? { ...copiedData, [buttonId]: { title: inputText } }
      : {
          ...copiedData,
          [buttonId]: inputText,
        };

  const [isSaving, onSave] = useOnSave(policyData, constructData);
  return (
    <FormGroup
      className="pf-c-inline-edit pf-m-inline-editable"
      id="single-editable-example"
    >
      <Text
        className="pf-c-inline-edit__value"
        id="single-editable --pf-global--spacer--xs"
      >
        {text}
      </Text>
      <div className="pf-c-inline-edit__action pf-m-enable-editable">
        <Button
          className="pf-c-button pf-m-plain"
          type="button"
          id="edit-button"
          aria-label="Edit"
          aria-labelledby="single-editable-example-edit-button single-editable"
        />
      </div>
      <div className="pf-c-inline-edit__group">
        {variant === 'business' ? (
          <TextInput
            className="pf-c-form-control pf-u-w-33-on-lg"
            type="text"
            value={inputText}
            aria-label="Editable text input"
            onChange={handleTextUpdate}
          />
        ) : variant === 'threshold' ? (
          <div>
            <TextInput
              className="pf-c-form-control pf-u-w-100-on-lg"
              type="text"
              value={inputText}
              aria-label="Editable text input"
              onChange={handleTextUpdate}
            />
            <Text>A value of 95% or higher is recommended</Text>
          </div>
        ) : (
          <TextArea
            resizeOrientation="vertical"
            className="pf-c-form-control pf-u-w-33-on-lg"
            aria-label="Editable textarea"
            defaultValue={inputText}
            onChange={handleTextUpdate}
          />
        )}
        <div className="pf-c-inline-edit__group pf-m-action-group pf-m-icon-group">
          <div className="pf-c-inline-edit__action pf-m-valid">
            <Button
              className="pf-c-button pf-m-plain"
              type="button"
              aria-label="Save edits"
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
      </div>
    </FormGroup>
  );
};

EditPolicyDetailsInline.propTypes = {
  text: propTypes.string,
  variant: propTypes.string,
  policyData: propTypes.obj,
  buttonId: propTypes.string,
  handleCloseEdit: propTypes.func,
  setCloseHook: propTypes.hook,
};

export default EditPolicyDetailsInline;
