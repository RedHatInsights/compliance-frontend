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
});

export function getAppConfigHcc() {
  return appConfigHcc;
}
