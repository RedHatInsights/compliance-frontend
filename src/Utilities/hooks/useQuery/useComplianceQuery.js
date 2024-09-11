import { useMemo } from 'react';
import {
  useRawTableState,
  useSerialisedTableState,
} from '../../../Frameworks/AsyncTableTools/hooks/useTableState';
import useQuery from './useQuery';

/**
 *  @typedef {object} useComplianceQueryReturn
 *
 *  @property {object}   data    Response data
 *  @property {boolean}  loading Loading state
 *  @property {object}   error   Error from the endpoint
 *  @property {Function} refetch Refetch the endpoint
 */

/**
 *
 * Custom hook that passes serialised state from AsyncTableTools to the useQuery parameters
 * Make sure the component above is wrapped with `<TableStateProvider/>`.
 *
 *  @param   {Function}                 endpoint Function to execute, ideally from the apiInstance
 *
 *  @returns {useComplianceQueryReturn}          Object containing state values and a refetch function
 *
 *  @category Compliance
 *  @subcategory Hooks
 *
 * @example
 * const query = useComplianceQuery(apiInstance.policies)
 *
 */
const useComplianceQuery = (endpoint) => {
  const tableState = useRawTableState();
  const serialisedTableState = useSerialisedTableState();

  const { offset, limit } = serialisedTableState?.pagination || {};

  const filter = serialisedTableState?.filters;

  const sortBy = serialisedTableState?.sort;

  const params = useMemo(
    () => [
      {
        limit,
        offset,
        filter,
        sortBy,
      },
    ],
    [limit, offset, filter, sortBy]
  );

  const skip = !tableState;

  return useQuery(endpoint, { params, skip });
};

export default useComplianceQuery;
