import React from 'react';
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  TextArea,
} from '@patternfly/react-core';

export const ReduxFormTextInput = (field) => {
  const fieldError = field.meta.error;
  return (
    <>
      <TextInput
        value={field.input.value || field.defaultValue}
        onChange={(_, v) => field.input.onChange(v)}
        validated={fieldError ? 'error' : 'default'}
        {...field}
      />
      {fieldError && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant="error">{fieldError}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </>
  );
};

export const ReduxFormTextArea = (field) => (
  <TextArea
    value={field.input.value || field.defaultValue}
    onChange={(_, v) => field.input.onChange(v)}
    {...field}
  />
);
