import React from 'react';
import { Switch } from '@patternfly/react-core';
import propTypes from 'prop-types';

const SelectedFilterSwitch = ({ isChecked, setActiveFilter }) => (
  <Switch
    label="Selected only"
    isChecked={isChecked}
    onChange={() => setActiveFilter('selected', !isChecked)}
  />
);

SelectedFilterSwitch.propTypes = {
  isChecked: propTypes.bool,
  setActiveFilter: propTypes.func,
};

export default SelectedFilterSwitch;
