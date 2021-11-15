import React from 'react';
import propTypes from 'prop-types';
import {
  DataListCheck,
  DataListControl,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListItemCells,
} from '@patternfly/react-core';

const ColumnManagerListItem = ({
  key,
  column,
  onChange,
  isSelected,
  isDisabled,
}) => (
  <DataListItem>
    <DataListItemRow>
      <DataListControl>
        <DataListCheck
          checked={isSelected}
          onChange={onChange}
          otherControls
          isDisabled={isDisabled}
        />
      </DataListControl>
      <DataListItemCells
        dataListCells={[
          <DataListCell key={`${key}-cell`}>
            <label>{column.title}</label>
          </DataListCell>,
        ]}
      />
    </DataListItemRow>
  </DataListItem>
);

ColumnManagerListItem.propTypes = {
  key: propTypes.string,
  column: propTypes.object,
  onChange: propTypes.func,
  isSelected: propTypes.bool,
  isDisabled: propTypes.bool,
};

export default ColumnManagerListItem;
