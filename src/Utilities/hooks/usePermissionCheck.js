import { useMemo } from 'react';
import { useCompliancePermissions } from 'Utilities/CompliancePermissionsProvider';

export { PERMISSION_MAP } from 'Utilities/permissionConstants';

export const usePermissions = (requiredPermissions) => {
  const { checkAccess, isLoading } = useCompliancePermissions();

  return useMemo(
    () => ({
      hasAccess: checkAccess(requiredPermissions),
      isLoading,
    }),
    [checkAccess, isLoading, requiredPermissions],
  );
};
