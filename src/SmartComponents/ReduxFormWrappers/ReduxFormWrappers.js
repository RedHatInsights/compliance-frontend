import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { TextInput, Checkbox } from '@patternfly/react-core';

export const ReduxFormTextInput = field => (
    <TextInput
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
    <CreatableSelect
        value={field.selected}
        onChange={field.input.onChange}
        {...field} />
);
