import React from 'react';
import propTypes from 'prop-types';
import { InlineEdit } from 'PresentationalComponents';
import { validatorFor, disableEdit } from '../helpers';

const InlineValueEdit = ({ value, valueDefinition, ...props }) => (
  <p>
    {valueDefinition?.title}:{' '}
    <InlineEdit
      isDisabled={disableEdit(
        value ||
          valueDefinition?.defaultValue ||
          valueDefinition?.default_value,
      )}
      defaultValue={
        valueDefinition?.defaultValue || valueDefinition?.default_value
      }
      validate={validatorFor(valueDefinition)}
      {...{ ...props, value }}
    />
  </p>
);

InlineValueEdit.propTypes = {
  value: propTypes.string,
  valueDefinition: propTypes.object,
};

export default InlineValueEdit;
