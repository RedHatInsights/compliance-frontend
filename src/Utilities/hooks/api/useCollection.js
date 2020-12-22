import { useReducer, useEffect, useLayoutEffect } from 'react';
import { COMPLIANCE_API_ROOT } from '@/constants';
import ApiClient from 'Utilities/ApiClient';
import { normalizeData } from './utils/normalize';

const FETCH_COLLECTION = 'FETCH_COLLECTION';

const fetchCollection = async (apiClient, collection) => {
    const json = await apiClient.get();
    const normalized = Object.values(normalizeData(json, 'host'));

    return {
        type: FETCH_COLLECTION,
        payload: {
            collection: normalized
        }
    };
}

const collectionReducer = (collection) => (
    (state, action) => {
        switch (action.type) {
            case FETCH_COLLECTION:
                return {
                   [collection]: action.payload.collection
                };
            default:
                console.log('No action for', action, state)
                throw new Error();
        }
    }
);

const useCollection = (collection) => {
   const apiClient = new ApiClient({
       apiBase: COMPLIANCE_API_ROOT,
       path: `/${ collection }`
   });
   const initialState = {
      [collection]: []
   }
   const [state, dispatch] = useReducer(
      collectionReducer(collection), initialState
   )
   const dispatchFetch = async () => {
       console.log('Dispatch fetch')
       dispatch(await fetchCollection(apiClient, collection))
   };

   useLayoutEffect(() => {
       console.log('Layout effect')
       dispatchFetch()
   }, []);

   return {
        [collection]: state[collection],
        dispatch,
        fetch: dispatchFetch
   }
};

export default useCollection;
