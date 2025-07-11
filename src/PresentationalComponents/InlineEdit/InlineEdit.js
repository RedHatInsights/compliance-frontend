import React, { useState, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  FormGroup,
  Content,
  TextInput,
  ContentVariants,
} from '@patternfly/react-core';
import { CheckIcon, TimesIcon, PencilAltIcon } from '@patternfly/react-icons';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
// import Prompt from '@redhat-cloud-services/frontend-components/Prompt';

const InlineEdit = ({
  value: valueProp,
  defaultValue,
  variant,
  validate,
  onSave: onSaveProp,
  label,
  enableEdit = true,
  isOpen = false,
  Component = TextInput,
  ...props
}) => {
  const input = useRef();
  // TODO Re-enable when there is a alternative to Prompt
  // const [dirty, setDirty] = useState(false);
  const [value, setValue] = useState(() => valueProp || defaultValue);
  const [valid, setValid] = useState(null);
  const [open, setOpen] = useState(() => isOpen || false);
  const [saving, setSaving] = useState(false);

  const onChange = (newValue) => {
    setValue(newValue);

    if (newValue !== value) {
      // setDirty(true);
      setValid(validate?.(newValue) || true);
    } else {
      // setDirty(false);
      setValid(null);
    }
  };

  const onCloseEdit = async () => {
    setSaving(true);
    const value = valueProp || defaultValue;
    setValue(value);
    await onSaveProp?.(value);
    // setDirty(false);
    setOpen(false);
    setSaving(false);
  };

  const onSave = async () => {
    setSaving(true);
    // setDirty(false);
    await onSaveProp?.(value);
    setOpen(false);
    setSaving(false);
  };

  useEffect(() => {
    if (open && input?.current) {
      input.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <FormGroup
      className="pf-v6-c-inline-edit pf-v6-m-inline-editable"
      style={{ display: 'inline-block' }}
    >
      <div className="pf-v6-c-inline-edit__group">
        {open ? (
          <>
            <div>
              <Component
                value={value}
                onChange={(_, v) => onChange(v)}
                {...props}
              />
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
                  icon={<CheckIcon />}
                  className="pf-v6-c-button pf-v6-u-ml-sm"
                  variant="plain"
                  type="button"
                  aria-label="Save edits"
                  ouiaId="SaveEdits"
                  isDisabled={!valid}
                  isLoading={saving}
                  onClick={onSave}
                  style={{
                    'margin-left': '5px',
                    color: valid
                      ? 'var(--pf-t--global--text--color--100)'
                      : 'var(--pf-t--global--text--color--disabled)',
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
                  icon={<TimesIcon />}
                  className="pf-v6-c-button pf-v6-u-ml-sm"
                  variant="plain"
                  type="button"
                  aria-label="Cancel edits"
                  ouiaId="CancelEdits"
                  onClick={onCloseEdit}
                  style={{ 'margin-left': '5px' }}
                />
              </div>
            </div>
          </>
        ) : (
          <Content className="textAreaClosedText" component={ContentVariants.p}>
            <Truncate text={value} length={380} inline={true} />
            {enableEdit && (
              <Button
                icon={<PencilAltIcon />}
                aria-label="Edit"
                ouiaId="InlineEditPencil"
                className="pf-v6-u-ml-sm"
                onClick={() => {
                  setOpen(true);
                }}
                variant="plain"
              />
            )}
          </Content>
        )}
      </div>
      {/*
      <Prompt
        when={dirty}
        message="You have unsaved changes on this page. Are you sure you want to leave?"
      /> */}
    </FormGroup>
  );
};

InlineEdit.propTypes = {
  defaultValue: propTypes.string,
  variant: propTypes.string,
  Component: propTypes.node,
  label: propTypes.string,
  validate: propTypes.func,
  onSave: propTypes.func,
  isOpen: propTypes.bool,
  enableEdit: propTypes.bool,
  value: propTypes.string,
};

export default InlineEdit;
