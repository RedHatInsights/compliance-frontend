import React, { useState, useRef } from 'react';
import propTypes from 'prop-types';
import { TableContext } from '../../hooks/useTableState/constants';

/**
 * This component provides a context for components/hooks that want to use async tables and access it's state to perform API requests
 *
 *  @param   {object}             [props]          Component Props
 *  @param   {React.ReactElement} [props.children] Child components to render within
 *
 *  @returns {React.ReactElement}                  The passed in component wrapped in a TableContext provider
 *
 *  @tutorial using-async-table-tools
 *
 *  @category AsyncTableTools
 *  @subcategory Components
 *
 */
const TableStateProvider = ({ children }) => {
  const state = useState();
  const observers = useRef({});
  const serialisers = useRef({});

  return (
    <TableContext.Provider
      value={{
        state,
        observers,
        serialisers,
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
