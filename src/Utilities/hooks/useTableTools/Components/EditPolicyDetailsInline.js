import React, { useState, useEffect } from 'react';
import { TextArea, TextInput } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { useOnSave } from '../../../../SmartComponents/EditPolicy/hooks.js';

const EditPolicyDetailsInline = ({ text, variant, policyData, buttonId }) => {
  const copiedData = policyData;
  //handling text changes
  const [inputText, setInputText] = useState(text);
  const [updatedText, setUpdatedText] = useState('');
  const handleTextUpdate = (newText) => {
    setInputText(newText);
  };

  useEffect(() => {
    useOnSave(policyData, { ...copiedData, [buttonId]: updatedText });
  }, [updatedText]);

  const onSave = (newText) => {
    setUpdatedText(newText);
  };

  return (
    <form
      className="pf-c-inline-edit pf-m-inline-editable"
      id="single-editable-example"
    >
      <div className="pf-c-inline-edit__group">
        <div
          className="pf-c-inline-edit__value"
          id="single-editable-example-label"
        >
          {text}
        </div>
        <div className="pf-c-inline-edit__action pf-m-enable-editable">
          <button
            className="pf-c-button pf-m-plain"
            type="button"
            id="single-editable-example-edit-button"
            aria-label="Edit"
            aria-labelledby="single-editable-example-edit-button single-editable-example-label"
          >
            <i className="fas fa-pencil-alt" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div className="pf-c-inline-edit__group">
        {variant === 'inline' ? (
          <div className="pf-c-inline-edit__input">
            <TextInput
              className="pf-c-form-control"
              type="text"
              value={inputText}
              aria-label="Editable text input"
              onChange={handleTextUpdate}
            />
          </div>
        ) : (
          <TextArea
            aria-label="Editable textarea"
            defaultValue={inputText}
            onChange={handleTextUpdate}
          />
        )}
        <div className="pf-c-inline-edit__group pf-m-action-group pf-m-icon-group">
          <div className="pf-c-inline-edit__action pf-m-valid">
            <button
              className="pf-c-button pf-m-plain"
              type="button"
              aria-label="Save edits"
              onClick={onSave}
            >
              <i className="fas fa-check" aria-hidden="true"></i>
            </button>
          </div>
          <div className="pf-c-inline-edit__action">
            <button
              className="pf-c-button pf-m-plain"
              type="button"
              aria-label="Cancel edits"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

EditPolicyDetailsInline.propTypes = {
  text: propTypes.string,
  variant: propTypes.string,
  policyData: propTypes.obj,
  buttonId: propTypes.string,
};

export default EditPolicyDetailsInline;
