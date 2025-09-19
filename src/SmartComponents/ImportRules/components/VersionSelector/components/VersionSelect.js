import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import {
  Content,
  ContentVariants,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

const VersionSelect = ({
  label,
  ariaLabel,
  placeholder,
  options,
  value,
  onChange,
  isDisabled = false,
}) => {
  const ssgVersion =
    value &&
    options.find(
      ({ value: optionValue }) => String(optionValue) === String(value),
    )?.ssgVersion;

  const onChangeSelect = useCallback(
    (_event, optionValue) => onChange?.(optionValue),
    [onChange],
  );

  return (
    <FormGroup label={label}>
      <FormSelect
        className="pf-v6-u-mb-sm"
        isDisabled={isDisabled}
        aria-label={ariaLabel}
        onChange={onChangeSelect}
        value={value}
      >
        {placeholder && (
          <FormSelectOption
            isPlaceholder
            key={-1}
            label={placeholder || 'Select options'}
          />
        )}

        {options.map(({ label, value }) => (
          <FormSelectOption key={label} value={value} label={label} />
        ))}
      </FormSelect>

      {ssgVersion && (
        <Content component={ContentVariants.p} className="pf-v6-u-mb-sm">
          <strong>SSG version</strong> {ssgVersion}
        </Content>
      )}
    </FormGroup>
  );
};

VersionSelect.propTypes = {
  label: propTypes.string,
  ariaLabel: propTypes.string,
  placeholder: propTypes.string,
  options: propTypes.object,
  value: propTypes.string,
  onChange: propTypes.func,
  isDisabled: propTypes.bool,
};

export default VersionSelect;
