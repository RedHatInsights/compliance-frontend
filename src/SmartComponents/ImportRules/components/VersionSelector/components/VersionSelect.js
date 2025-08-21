import React, { useState, useCallback } from 'react';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

const VersionSelect = ({
  label,
  ariaLabel,
  placeholder,
  options,
  onChange,
  isDisabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState();

  const onChangeSelect = useCallback(
    (_event, optionValue) => {
      setSelectedOption(optionValue);
      onChange?.(optionValue);
    },
    [onChange],
  );

  return (
    <FormGroup label={label}>
      <FormSelect
        isDisabled={isDisabled}
        aria-label={ariaLabel}
        onChange={onChangeSelect}
        value={selectedOption}
      >
        {placeholder && (
          <FormSelectOption isPlaceholder key={-1} label={placeholder} />
        )}

        {options.map((option, index) => (
          <FormSelectOption
            key={index}
            value={option.value}
            label={option.label}
          />
        ))}
      </FormSelect>
    </FormGroup>
  );
};

export default VersionSelect;
