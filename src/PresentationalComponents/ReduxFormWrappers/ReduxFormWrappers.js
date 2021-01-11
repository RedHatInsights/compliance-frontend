import React from 'react';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/esm/select';
import { TextInput, TextArea } from '@patternfly/react-core';

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

export const ReduxFormCreatableSelectInput = field => (
    <InternalSelect selectVariant="createable"
        value={field.selected}
        onChange={field.input.onChange}
        {...field} />
);
