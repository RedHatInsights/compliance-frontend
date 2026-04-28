/** RBAC permission strings mapped to Kessel relation names for workspace checks. */
export const PERMISSION_MAP = {
  'compliance:policy:read': 'compliance_policy_view',
  'compliance:policy:write': 'compliance_policy_edit',
  'compliance:policy:create': 'compliance_policy_new',
  'compliance:policy:delete': 'compliance_policy_remove',
  'compliance:report:read': 'compliance_report_view',
};

export const KESSEL_PERMISSIONS_LIST = Object.values(PERMISSION_MAP);
