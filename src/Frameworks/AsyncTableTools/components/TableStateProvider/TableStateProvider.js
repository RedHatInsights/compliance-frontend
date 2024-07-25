import React, { useState } from 'react';
import propTypes from 'prop-types';
import { TableContext } from '../../hooks/useTableState';

/**
 * This component provides a context for components/hooks that want to use async tables and access it's state to perform API requests
 *
 * @param {Object} [props]
 */
const TableStateProvider = ({ children }) => {
  const [{ tableState, serialisedTableState }, setTableState] = useState({});

  return (
    <TableContext.Provider
      value={{
        tableState,
        serialisedTableState,
        setTableState,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

TableStateProvider.propTypes = {
  children: propTypes.node,
};

export default TableStateProvider;
