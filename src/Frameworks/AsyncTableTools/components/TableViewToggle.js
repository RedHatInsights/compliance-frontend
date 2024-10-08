import React from 'react';
import propTypes from 'prop-types';
import { ToggleGroup, ToggleGroupItem, Icon } from '@patternfly/react-core';

const TableViewToggle = ({ views, onToggle, currentTableView }) => (
  <ToggleGroup>
    {Object.entries(views).map(([key, { icon: ToggleIcon }]) => (
      <ToggleGroupItem
        key={key}
        icon={
          <Icon>
            <ToggleIcon />
          </Icon>
        }
        aria-label={key}
        isSelected={currentTableView === key}
        onChange={() => onToggle(key)}
      />
    ))}
  </ToggleGroup>
);

TableViewToggle.propTypes = {
  views: propTypes.object,
  onToggle: propTypes.function,
  currentTableView: propTypes.string,
};

export default TableViewToggle;
