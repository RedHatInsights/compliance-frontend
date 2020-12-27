import { useEffect, useLayoutEffect, useMemo } from 'react';
import { COMPLIANCE_API_ROOT } from '@/constants';
import ApiClient from 'Utilities/ApiClient';
import { normalizeData } from './utils/normalize';
import { default as useReducer} from 'Utilities/hooks/useReducerWithLogger';

const FETCH_COLLECTION = 'FETCH_COLLECTION';

const fetchCollection = async (apiClient, collection, params) => {
    const json = await apiClient.get(null, {
        params: {
            ...params,
            include: ['profiles']
        }
    });
    const normalized = Object.values(normalizeData(json, collection));

    return {
        type: FETCH_COLLECTION,
        payload: {
            collection: normalized,
            meta: json.meta,
            total: json.meta.total
        }
    };
}

const collectionReducer = (collection) => (
    (state, action) => {
        switch (action.type) {
            case FETCH_COLLECTION:
                return action.payload;
            default:
                console.log('No action for', action, state)
                throw new Error();
        }
    }
);

const useCollection = (collection, options = {}) => {
   const apiClient = new ApiClient({
       apiBase: COMPLIANCE_API_ROOT,
       path: `/${ collection }`
   });
   const fetchedCollection = options?.collection || collection;
   const initialState = {
      [collection]: [],
      params: options?.params || {}
   }
   const [state, dispatch] = useReducer(
      collectionReducer(collection), initialState
   )
   const dispatchFetch = useMemo(() => (async (params = state.params) => (
       dispatch(
           await fetchCollection(apiClient, fetchedCollection, params)
       )
   )), [state.params]);

   useLayoutEffect(() => {
       dispatchFetch()
   }, []);

   return {
        collection: state.collection,
        total: state.total,
        dispatch,
        fetch: dispatchFetch
   }
};

export default useCollection;
