import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import systems from '@redhat-cloud-services/compliance-client/dist/Systems';
import policies from '@redhat-cloud-services/compliance-client/dist/Policies';
import policy from '@redhat-cloud-services/compliance-client/dist/Policy';
import policySystems from '@redhat-cloud-services/compliance-client/dist/PolicySystems';
import tailorings from '@redhat-cloud-services/compliance-client/dist/Tailorings';
import updatePolicy from '@redhat-cloud-services/compliance-client/dist/UpdatePolicy';
import deletePolicy from '@redhat-cloud-services/compliance-client/dist/DeletePolicy';
import report from '@redhat-cloud-services/compliance-client/dist/Report';
import reports from '@redhat-cloud-services/compliance-client/dist/Reports';

import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
export const BASE_URL = '/api/compliance/v2';

const apiInstance = APIFactory(
  BASE_URL,
  {
    systems,
    policies,
    policy,
    policySystems,
    tailorings,
    updatePolicy,
    deletePolicy,
    report,
    reports,
  },
  instance
);

export default apiInstance;
