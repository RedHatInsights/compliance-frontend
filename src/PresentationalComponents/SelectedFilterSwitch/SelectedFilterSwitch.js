import React from 'react';
import propTypes from 'prop-types';
import { Switch } from '@patternfly/react-core';

const SelectedFilterSwitch = ({ isChecked, setActiveFilter, ...props }) => (
  <Switch
    label="Selected only"
    isChecked={isChecked}
    onChange={() => setActiveFilter('selected', !isChecked)}
    {...props}
  />
);

SelectedFilterSwitch.propTypes = {
  isChecked: propTypes.bool,
  setActiveFilter: propTypes.func,
};

export default SelectedFilterSwitch;
