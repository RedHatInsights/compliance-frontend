import { useContext } from 'react';
import { TableContext } from '../constants';

/**
 * Hook to access the "raw" table state
 *
 *  @returns {object} raw table state
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useRawTableState = () => {
  const context = useContext(TableContext);

  return context?.state?.[0]?.tableState;
};

export default useRawTableState;
