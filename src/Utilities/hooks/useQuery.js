import { useCallback, useEffect, useRef, useState } from 'react';
import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import systems from '@redhat-cloud-services/compliance-client/dist/Systems';
import policies from '@redhat-cloud-services/compliance-client/dist/Policies';
import policy from '@redhat-cloud-services/compliance-client/dist/Policy';
import policySystems from '@redhat-cloud-services/compliance-client/dist/PolicySystems';
import tailorings from '@redhat-cloud-services/compliance-client/dist/Tailorings';
import updatePolicy from '@redhat-cloud-services/compliance-client/dist/UpdatePolicy';

import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
export const BASE_URL = '/api/compliance/v2';

export const apiInstance = APIFactory(
  BASE_URL,
  { systems, policies, policy, policySystems, tailorings, updatePolicy },
  instance
);

export const useQuery = (fn, ...params) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const fnRef = useRef();
  const paramsRef = useRef();

  const callQuery = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fnRef.current(...paramsRef.current);
      if (data?.data) {
        setData(data.data);
      } else {
        setData(data);
      }
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      fnRef.current !== fn ||
      JSON.stringify(paramsRef.current) !== JSON.stringify(params)
    ) {
      fnRef.current = fn;
      paramsRef.current = params;
      callQuery();
    }
  }, [fn, params, callQuery]);

  return { data, error, loading, refetch: callQuery };
};
