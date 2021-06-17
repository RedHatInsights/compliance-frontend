import React from 'react';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import { TextInput, TextArea } from '@patternfly/react-core';

export const ReduxFormTextInput = (field) => (
  <TextInput
    value={field.input.value || field.defaultValue}
    onChange={field.input.onChange}
    {...field}
  />
);

export const ReduxFormTextArea = (field) => (
  <TextArea
    value={field.input.value || field.defaultValue}
    onChange={field.input.onChange}
    {...field}
  />
);

export const ReduxFormCreatableSelectInput = (field) => (
  <rawComponents.RawSelect
    selectVariant="createable"
    value={field.selected}
    onChange={field.input.onChange}
    {...field}
  />
);
