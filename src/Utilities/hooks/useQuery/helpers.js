import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import * as complianceApi from '@redhat-cloud-services/compliance-client';
import { getComplianceApiBasePath } from '@/config/appConfig';

export function getComplianceApiInstance() {
  return APIFactory(getComplianceApiBasePath(), complianceApi, {
    axios: instance,
  });
}
