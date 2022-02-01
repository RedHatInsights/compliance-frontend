import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  DataList,
  Modal,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import ColumnManagerListItem from './ColumnManagerListItem';

const ColumnManager = ({
  isOpen,
  columns,
  onSave: onSaveArgument,
  onClose: onCloseProp,
  selectedColumns: selectedColumnsProp = [],
}) => {
  const [selectedColumns, setSelectedColumns] = useState(selectedColumnsProp);
  const isSelectedColumn = ({ title }) => selectedColumns.includes(title);
  const selectAllColumns = () => {
    setSelectedColumns(columns.map(({ title }) => title));
  };
  const toggleColumn = (column) => {
    if (isSelectedColumn(column)) {
      setSelectedColumns(
        selectedColumns.filter((title) => title !== column.title)
      );
    } else {
      setSelectedColumns([...selectedColumns, column.title]);
    }
  };
  const onSave = () => {
    onSaveArgument && onSaveArgument(selectedColumns);
  };
  const onClose = () => {
    setSelectedColumns(selectedColumnsProp);
    onCloseProp && onCloseProp();
  };

  const description = (
    <TextContent>
      <Text component={TextVariants.p}>
        Selected categories will be displayed in the table.
      </Text>
      <Button isInline onClick={selectAllColumns} variant="link">
        Select all
      </Button>
    </TextContent>
  );

  return (
    <Modal
      title="Manage columns"
      isOpen={isOpen}
      variant="small"
      onClose={onClose}
      ouiaId="ManageColumns"
      description={description}
      actions={[
        <Button key="save" variant="primary" ouiaId="Save" onClick={onSave}>
          Save
        </Button>,
        <Button
          key="cancel"
          variant="secondary"
          ouiaId="Cancel"
          onClick={onClose}
        >
          Cancel
        </Button>,
      ]}
    >
      <DataList
        aria-label="Table column management"
        id="table-column-management"
        isCompact
      >
        {columns.map((column, idx) => (
          <ColumnManagerListItem
            key={`column-${idx}`}
            id={`column-${idx}`}
            column={column}
            isSelected={isSelectedColumn(column)}
            onChange={() => {
              toggleColumn(column);
            }}
            isDisabled={idx === 0}
          />
        ))}
      </DataList>
    </Modal>
  );
};

ColumnManager.propTypes = {
  columns: propTypes.array,
  selectedColumns: propTypes.array,
  isOpen: propTypes.bool,
  onSave: propTypes.func,
  onClose: propTypes.func,
};

export default ColumnManager;
