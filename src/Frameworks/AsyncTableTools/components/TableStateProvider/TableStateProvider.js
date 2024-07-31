import React, { useState } from 'react';
import propTypes from 'prop-types';
import { TableContext } from '../../hooks/useTableState';

/**
 *  This component provides a context for components/hooks that want to use async tables and access it's state to perform API requests
 *
 *  @param {object} [props] Component Props
 *  @param {React.ReactElement} [props.children] Child components to render within
 *
 *  @returns {React.ReactElement}
 *
 *  @tutorial using-async-table-tools
 *
 *  @category AsyncTableTools
 *  @subcategory Components
 *
 */
const TableStateProvider = ({ children }) => {
  const [tableState, setTableState] = useState({});

  return (
    <TableContext.Provider
      value={{
        ...tableState,
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
