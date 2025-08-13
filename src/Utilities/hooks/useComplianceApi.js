import { useMemo, useEffect } from 'react';
import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import { useAxiosWithPlatformInterceptors } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import * as complianceApi from '@redhat-cloud-services/compliance-client';
import { API_BASE_URL } from '@/constants';

/**
 *
 * Hook to get a  Compliance javascript-client or specific endpoint function
 *
 *  @param   {string}          [endpoint] String of the javascript-clients export for the needed endpoint
 *
 *  @returns {object|Function}            Compliance javascript-client or specific endpoint function
 *
 *  @category Compliance
 *  @subcategory Hooks
 *
 */
const useComplianceApi = (endpoint) => {
  const axios = useAxiosWithPlatformInterceptors();

  const apiEndpoint = useMemo(() => {
    const apiInstance = APIFactory(API_BASE_URL, complianceApi, axios);
    return endpoint ? apiInstance[endpoint] : apiInstance;
  }, [axios, endpoint]);

  useEffect(() => {
    if (endpoint && !apiEndpoint) {
      console.warn('Available endpoints:', Object.keys(complianceApi));
      throw `Endpoint ${endpoint} does not exist!`;
    }
  }, [endpoint, apiEndpoint]);

  return apiEndpoint;
};

export default useComplianceApi;
