import React, { useState } from 'react';
import ColumnManager from './Components/ColumnManager';

const filterColumnsBySelected = (columns, selected) =>
  columns.filter((column) => selected.includes(column.title));

const useColumnManager = (columns = [], options = {}) => {
  const manageableColumns = columns
    .map((column) =>
      column?.manageable === undefined
        ? { ...column, manageable: true }
        : column
    )
    .filter((column) => column.manageable === true);
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map(({ hiddenByDefault, title }) => !hiddenByDefault && title)
  );
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const { manageColumns: enableColumnManager } = options;
  const onClick = () => {
    setIsManagerOpen(true);
  };

  const onSave = (newSelectedColumns) => {
    setSelectedColumns(newSelectedColumns);
    setIsManagerOpen(false);
  };

  return enableColumnManager
    ? {
        columns: filterColumnsBySelected(columns, selectedColumns),
        columnManagerAction: {
          label: 'Manage columns',
          onClick,
        },
        ColumnManager: () => (
          <ColumnManager
            columns={manageableColumns}
            isOpen={isManagerOpen}
            onClose={() => setIsManagerOpen(false)}
            selectedColumns={selectedColumns}
            onSave={onSave}
          />
        ),
      }
    : { columns };
};

export default useColumnManager;
