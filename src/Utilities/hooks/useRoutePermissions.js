import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { findRouteByPath } from '@/Routes';

const useRoutePermissions = (to) => {
  const route = findRouteByPath(to);
  return usePermissionsWithContext(
    route?.requiredPermissions || [],
    false,
    false
  );
};

export default useRoutePermissions;
