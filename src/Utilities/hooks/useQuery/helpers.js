import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import * as complianceApi from '@redhat-cloud-services/compliance-client';
import { API_BASE_URL } from '@/constants';

// TODO Delete once all places using `apiInstance` directly have been removed
export const apiInstance = APIFactory(API_BASE_URL, complianceApi, {
  axios: instance,
});
