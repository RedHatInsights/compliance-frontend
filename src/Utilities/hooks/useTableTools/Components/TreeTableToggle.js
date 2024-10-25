import React from 'react';
import propTypes from 'prop-types';

import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';

const TreeTableToggle = ({ onToggle, tableType }) => (
  <ToggleGroup>
    <ToggleGroupItem
      icon={<ListIcon />}
      aria-label="list"
      isSelected={tableType === 'list'}
      onChange={onToggle}
    />
    <ToggleGroupItem
      icon={<TreeviewIcon />}
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
