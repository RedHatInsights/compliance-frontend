import { useContext } from 'react';
import { TableContext } from '../constants';

/**
 * Hook to access both the "raw" and the serialised  table state
 *
 *  @returns {object} table state
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useFullTableState = () => {
  const { state } = useContext(TableContext);

  return state?.[0];
};

export default useFullTableState;
