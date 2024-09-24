import { useContext } from 'react';
import { TableContext } from '../constants';

/**
 * Hook to access the serialised table state
 *
 *  @returns {object} serialised table state
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useSerialisedTableState = () => {
  const { state } = useContext(TableContext) || {};

  return state?.[0]?.serialisedTableState;
};

export default useSerialisedTableState;
