import { findRouteByPath } from '@/Routes';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from 'Utilities/hooks/usePermissionCheck';

export const useRoutePermissionsRbacV1 = (to) => {
  const route = findRouteByPath(to);
  const requiredPermissions = route?.requiredPermissions || [];
  return useRbacV1Permissions(requiredPermissions);
};

export const useRoutePermissionsKessel = (to) => {
  const route = findRouteByPath(to);
  const requiredPermissions = route?.requiredPermissions || [];
  return useKesselPermissions(requiredPermissions);
};
