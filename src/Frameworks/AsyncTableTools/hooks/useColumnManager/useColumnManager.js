import React, { useState } from 'react';
import { ColumnManagementModal } from '@patternfly/react-component-groups';
import { getManagableColumns } from './helper';

/**
 *  @typedef {object} useColumnManagerReturn
 *
 *  @property {Array}    columns Patternfly table columns
 *  @property {Function} [columnManagerAction] Action props for a Toolbar action
 *  @property {object}   [ColumnManager] ColumnManager modal component to be shown to manage columns
 */

/**
 *  Provides columns for a Patternfly table, a (Primary)Toolbar action and a `ColumnManager` component
 *
 *  @param {Array}  columns Columns for a table to be managed
 *  @param {object} [options] AsyncTableTools options
 *  @param {string} [options.columnManagerSelectProp] Property to use for the selection manager to identify columns
 *  @param {string} [options.manageColumnLabel] Label for the action item to show
 *
 *  @returns {useColumnManagerReturn}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useColumnManager = (columns = [], options = {}) => {
  const {
    columnManagerSelectProp: selectProp = 'key',
    manageColumns: enableColumnManager,
    manageColumnLabel = 'Manage columns',
  } = options;
  const managableColumns = getManagableColumns(columns);
  const [selectedColumns, setSelectedColumns] = useState(managableColumns);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const onClick = () => {
    setIsManagerOpen(true);
  };

  const applyColumns = (newSelectedColumns) => {
    setSelectedColumns(newSelectedColumns);
    setIsManagerOpen(false);
  };

  return enableColumnManager
    ? {
        columns: selectedColumns.filter(({ isShown }) => isShown),
        applyColumns,
        columnManagerAction: {
          label: manageColumnLabel,
          onClick,
        },
        ColumnManager: function ColumnManager() {
          return (
            <ColumnManagementModal
              appliedColumns={selectedColumns}
              isOpen={isManagerOpen}
              onClose={() => setIsManagerOpen(false)}
              applyColumns={applyColumns}
              selectProp={selectProp}
            />
          );
        },
      }
    : { columns };
};

export default useColumnManager;
