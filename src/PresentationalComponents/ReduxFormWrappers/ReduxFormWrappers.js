import React from 'react';
import { TextInput, TextArea } from '@patternfly/react-core';

export const ReduxFormTextInput = (field) => (
  <TextInput
    value={field.input.value || field.defaultValue}
    onChange={(_, v) => field.input.onChange(v)}
    {...field}
  />
);

export const ReduxFormTextArea = (field) => (
  <TextArea
    value={field.input.value || field.defaultValue}
    onChange={(_, v) => field.input.onChange(v)}
    {...field}
  />
);
