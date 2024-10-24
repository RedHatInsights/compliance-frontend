import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import * as complianceApi from '@redhat-cloud-services/compliance-client/dist';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
const BASE_URL = '/api/compliance/v2';

const apiInstance = APIFactory(BASE_URL, complianceApi, instance);

export default apiInstance;
