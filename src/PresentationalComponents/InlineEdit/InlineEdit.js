import React, { useState, useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  FormGroup,
  Text,
  TextInput,
  TextVariants,
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

  const handleCloseEdit = () => {
    setValue(valueProp || defaultValue);
    // setDirty(false);
    setOpen(false);
  };

  const onSave = () => {
    setSaving(true);
    // setDirty(false);
    onSaveProp?.(value);
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
      className="pf-v5-c-inline-edit pf-v5-m-inline-editable"
      style={{ display: 'inline-block' }}
    >
      <div className="pf-v5-c-inline-edit__group">
        {open ? (
          <>
            <div>
              <Component
                value={value}
                onChange={(_, v) => onChange(v)}
                {...props}
              />
            </div>
            <div className="pf-v5-c-inline-edit__group pf-v5-m-action-group pf-v5-m-icon-group">
              <div className="pf-v5-c-inline-edit__action pf-v5-m-valid">
                <Button
                  className="pf-v5-c-button pf-v5-m-plain pf-v5-u-ml-sm"
                  type="button"
                  aria-label="Save edits"
                  isDisabled={!valid}
                  isLoading={saving}
                  onClick={onSave}
                >
                  <CheckIcon />
                </Button>
              </div>
              <div className="pf-v5-c-inline-edit__action">
                <Button
                  className="pf-v5-c-button pf-v5-m-plain pf-v5-u-ml-sm"
                  type="button"
                  aria-label="Cancel edits"
                  onClick={handleCloseEdit}
                >
                  <TimesIcon />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Text className="textAreaClosedText" component={TextVariants.p}>
            <Truncate text={value} length={380} inline={true} />
            {enableEdit && (
              <Button
                aria-label="Edit"
                className="pf-v5-u-ml-sm"
                onClick={() => {
                  setOpen(true);
                }}
                variant="plain"
              >
                <PencilAltIcon />
              </Button>
            )}
          </Text>
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
