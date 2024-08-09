import React, { useState } from 'react';
import get from 'lodash/get';
import { ColumnManagementModal } from '@patternfly/react-component-groups';
import { filterColumnsBySelected, filterManageableColumns } from './helper';

/**
 *  Provides columns for a Patternfly table, a (Primary)Toolbar action and a `ColumnManager` component
 *
 *  @param {Array} columns Columns for a table to be managed
 *  @param {object} [options] function to call when a selection is made
 *
 *  @returns {object}
 *
 */
const useColumnManager = (columns = [], options = {}) => {
  const {
    columnManagerSelectProp: selectProp = 'key',
    manageColumns: enableColumnManager,
    manageColumnLabel = 'Manage columns',
  } = options;
  const managableColumns = columns.map((column) => ({
    isShownByDefault: true,
    isShown: true,
    ...column,
  }));
  console.log('yolo');
  const [selectedColumns, setSelectedColumns] = useState(managableColumns);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const onClick = () => {
    setIsManagerOpen(true);
  };

  const onSave = (newSelectedColumns) => {
    console.log(newSelectedColumns);
    setSelectedColumns(newSelectedColumns);
    setIsManagerOpen(false);
  };

  return enableColumnManager
    ? {
        columns: filterColumnsBySelected(
          managableColumns,
          selectedColumns,
          selectProp
        ),
        columnManagerAction: {
          label: manageColumnLabel,
          onClick,
        },
        // eslint-disable-next-line react/display-name
        ColumnManager: () => (
          <ColumnManagementModal
            appliedColumns={managableColumns}
            isOpen={isManagerOpen}
            onClose={() => setIsManagerOpen(false)}
            applyColumns={onSave}
            selectProp={selectProp}
          />
        ),
      }
    : { columns };
};

export default useColumnManager;
