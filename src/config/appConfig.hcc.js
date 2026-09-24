const appConfigHcc = Object.freeze({
  envTarget: 'hcc',
  features: Object.freeze({
    unleash: true,
    pdf: true,
    remediations: true,
    dashboardZeroState: true,
    inventoryGroupsAndTags: true,
  }),
  api: Object.freeze({
    complianceBasePath: '/api/compliance/v2',
    inventoryBasePath: '/api/inventory/v1',
  }),
  routes: Object.freeze({
    systemPermissions: Object.freeze([
      'compliance:system:read',
      'compliance:report:read',
    ]),
    systemsPermissions: Object.freeze([
      'compliance:system:read',
      'compliance:policy:read',
    ]),
  }),
});

export function getAppConfigHcc() {
  return appConfigHcc;
}
