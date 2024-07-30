import { createContext, useContext } from 'react';

export const TableContext = createContext();

export const useSerialisedTableState = () => {
  const { serialisedTableState } = useContext(TableContext) || {};

  return serialisedTableState;
};

export const useRawTableState = () => {
  const { tableState } = useContext(TableContext) || {};

  return tableState;
};

export { default } from './useTableState';
