import React from 'react';
import PropTypes from 'prop-types';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';

export const SYSTEMS_VIEW = {
  ALL: 'all',
  SELECTED: 'selected',
};

const SystemsViewToggle = ({ systemsView, onSystemsViewChange }) => (
  <ToggleGroup aria-label="Systems list view" className="pf-v6-u-ml-md">
    <ToggleGroupItem
      text="All systems"
      isSelected={systemsView === SYSTEMS_VIEW.ALL}
      onChange={() => onSystemsViewChange(SYSTEMS_VIEW.ALL)}
      ouiaId="EditPolicySystemsViewAll"
    />
    <ToggleGroupItem
      text="Selected systems"
      isSelected={systemsView === SYSTEMS_VIEW.SELECTED}
      onChange={() => onSystemsViewChange(SYSTEMS_VIEW.SELECTED)}
      ouiaId="EditPolicySystemsViewSelected"
    />
  </ToggleGroup>
);

SystemsViewToggle.propTypes = {
  systemsView: PropTypes.oneOf([SYSTEMS_VIEW.ALL, SYSTEMS_VIEW.SELECTED])
    .isRequired,
  onSystemsViewChange: PropTypes.func.isRequired,
};

export default SystemsViewToggle;
