import React from 'react';
import propTypes from 'prop-types';

import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import { ListIcon } from '@patternfly/react-icons';
import Bars from './Bars';

const TreeTableToggle = ({ onToggle, tableType }) => (
  <ToggleGroup>
    <ToggleGroupItem
      icon={<ListIcon />}
      aria-label="list"
      isSelected={tableType === 'list'}
      onChange={onToggle}
    />
    <ToggleGroupItem
      icon={<Bars />}
      aria-label="tree"
      isSelected={tableType === 'tree'}
      onChange={onToggle}
    />
  </ToggleGroup>
);

TreeTableToggle.propTypes = {
  onToggle: propTypes.function,
  tableType: propTypes.string,
};

export default TreeTableToggle;
