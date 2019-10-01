import React from 'react';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import { TextInput, TextArea, Checkbox } from '@patternfly/react-core';

export const ReduxFormTextInput = field => (
    <TextInput
        value={field.input.value || field.defaultValue}
        onChange={field.input.onChange}
        {...field} />
);

export const ReduxFormTextArea = field => (
    <TextArea
        value={field.input.value || field.defaultValue}
        onChange={field.input.onChange}
        {...field} />
);

export const ReduxFormCheckboxInput = field => (
    <Checkbox
        value={field.input.value}
        onChange={field.input.onChange}
        {...field} />
);

export const ReduxFormCreatableSelectInput = field => (
    <rawComponents.Select selectVariant="createable"
        value={field.selected}
        onChange={field.input.onChange}
        {...field} />
);
