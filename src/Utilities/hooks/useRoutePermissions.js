import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { findRouteByPath } from '@/Routes';

const useRoutePermissions = (to) => {
  const route = findRouteByPath(to);
  return usePermissions('compliance', route?.requiredPermissions, false, true);
};

export default useRoutePermissions;
