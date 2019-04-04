import React from 'react';
import { TextInput, Checkbox } from '@patternfly/react-core';

export const ReduxFormTextInput = field => (
    <TextInput
        value={field.input.value}
        onChange={field.input.onChange}
        {...field} />
);

export const ReduxFormCheckboxInput = field => (
    <Checkbox
        value={field.input.value}
        onChange={field.input.onChange}
        {...field} />
);
