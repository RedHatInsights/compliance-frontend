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
  column,
  onChange,
  isSelected,
  isDisabled,
  id,
}) => (
  <DataListItem>
    <DataListItemRow>
      <DataListControl>
        <DataListCheck
          checked={isSelected}
          onChange={onChange}
          otherControls
          isDisabled={isDisabled}
          id={`${id}-id`}
          name={`${id}-id`}
        />
      </DataListControl>
      <DataListItemCells
        dataListCells={[
          <DataListCell key={`${id}-cell`}>
            <label htmlFor={`${id}-id`}>{column.title}</label>
          </DataListCell>,
        ]}
      />
    </DataListItemRow>
  </DataListItem>
);

ColumnManagerListItem.propTypes = {
  id: propTypes.string,
  column: propTypes.object,
  onChange: propTypes.func,
  isSelected: propTypes.bool,
  isDisabled: propTypes.bool,
};

export default ColumnManagerListItem;
