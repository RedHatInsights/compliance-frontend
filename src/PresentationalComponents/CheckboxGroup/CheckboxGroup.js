import React from 'react';
import { Field } from 'redux-form';
import propTypes from 'prop-types';
import { Checkbox } from '@patternfly/react-core';

const CheckboxFieldArray = ({ input, options }) => {
    const { name, onChange } = input;
    const inputValue = input.value;

    const handleChange = (checked, value) => {
        const arr = [...new Set(inputValue)];
        if (checked) {
            arr.push(value);
        } else {
            arr.splice(arr.indexOf(value), 1);
        }

        return onChange(arr);
    };

    return (
        <React.Fragment>
            {
                options.map(({ label, value, defaultChecked }, index) => (
                    <Checkbox key={label} id={label} label={label}
                        name={`${name}[${index}]`} value={value}
                        isChecked={inputValue === '' ? defaultChecked : inputValue.includes(value)}
                        onChange={(checked) => handleChange(checked, value)}
                    />
                ))
            }
        </React.Fragment>
    );
};

CheckboxFieldArray.propTypes = {
    input: propTypes.shape({
        name: propTypes.string.isRequired,
        onChange: propTypes.func,
        value: propTypes.array
    }),
    options: propTypes.arrayOf(propTypes.shape({
        label: propTypes.string.isRequired,
        value: propTypes.string.isRequired,
        defaultChecked: propTypes.bool
    })).isRequired
};

const CheckboxGroup = (props) => (
    <Field {...props} type="checkbox" component={CheckboxFieldArray} />
);

CheckboxGroup.propTypes = {
    options: propTypes.arrayOf(propTypes.shape({
        label: propTypes.string.isRequired,
        value: propTypes.string.isRequired,
        defaultChecked: propTypes.bool
    })).isRequired
};

export { CheckboxFieldArray };
export default CheckboxGroup;
