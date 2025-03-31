import React from 'react';
import { NumberInput } from '@patternfly/react-core';

const NumberFilter = ({ onChange, value }) => {
  const onMinus = () => {
    const newValue = (value || 0) - 1;
    onChange(newValue);
  };
  console.log(value);
  const onChangeHandler = (event) => {
    const value = event.target.value;
    onChange(value === '' ? value : +value);
  };

  const onPlus = () => {
    const newValue = (value || 0) + 1;
    onChange(newValue);
  };

  return (
    <NumberInput
      value={value || ''}
      onMinus={onMinus}
      onChange={onChangeHandler}
      onPlus={onPlus}
      inputName="input"
      inputAriaLabel="number input"
      minusBtnAriaLabel="minus"
      plusBtnAriaLabel="plus"
    />
  );
};

export default NumberFilter;
