import { createContext, useContext } from 'react';

export const TableContext = createContext(null);

export const useSerialisedTableState = () => {
  const { serialisedTableState } = useContext(TableContext);

  return serialisedTableState;
};

export const useRawTableState = () => {
  const { tableSate } = useContext(TableContext);

  return tableSate;
};

export { default } from './useTableState';
