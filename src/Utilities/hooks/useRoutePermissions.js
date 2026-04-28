import { findRouteByPath } from '@/Routes';
import { usePermissions } from 'Utilities/hooks/usePermissionCheck';

export const useRoutePermissions = (to) => {
  const route = findRouteByPath(to);
  const requiredPermissions = route?.requiredPermissions || [];
  return usePermissions(requiredPermissions);
};
