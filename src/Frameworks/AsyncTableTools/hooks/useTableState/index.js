import { createContext, useContext } from 'react';

export const TableContext = createContext();

/**
 *  Hook to access the serialised table state
 *
 *  @returns {object} serialised table state
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
export const useSerialisedTableState = () => {
  const { serialisedTableState } = useContext(TableContext) || {};

  return serialisedTableState;
};

/**
 *  Hook to access the "raw" table state
 *
 *  @returns {object} raw table state
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
export const useRawTableState = () => {
  const { tableState } = useContext(TableContext) || {};

  return tableState;
};

export { default } from './useTableState';
