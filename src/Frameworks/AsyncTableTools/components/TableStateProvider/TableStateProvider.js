import React, { useState } from 'react';
import propTypes from 'prop-types';
import { TableContext } from '../../hooks/useTableState';

/**
 *  This component provides a context for components/hooks that want to use async tables and access it's state to perform API requests
 *
 *  @param {object} [props]
 *  @param {React.ReactElement} [props.children]
 *
 *  @returns {React.ReactElement}
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
