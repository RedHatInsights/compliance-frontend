const appConfigIop = Object.freeze({
  envTarget: 'iop',
  features: Object.freeze({
    unleash: false,
    pdf: false,
    remediations: false,
    dashboardZeroState: false,
    inventoryGroupsAndTags: false,
  }),
  api: Object.freeze({
    complianceBasePath: '/insights_cloud/api/compliance/v2',
    inventoryBasePath: '/insights_cloud/api/inventory/v1',
  }),
  routes: Object.freeze({
    systemPermissions: Object.freeze(['compliance:report:read']),
  }),
});

export function getAppConfigIop() {
  return appConfigIop;
}
