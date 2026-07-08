const HCC = 'hcc';
const IOP = 'iop';

export function readEnvTarget() {
  if (process.env.IOP === 'true') {
    return IOP;
  }

  return HCC;
}

export function buildAppConfig(envTarget) {
  const isIop = envTarget === IOP;

  return Object.freeze({
    envTarget,
    features: Object.freeze({
      unleash: !isIop,
      pdf: !isIop,
      remediations: !isIop,
      dashboardZeroState: !isIop,
    }),
    api: Object.freeze({
      complianceBasePath: isIop
        ? '/insights_cloud/api/compliance/v2'
        : '/api/compliance/v2',
      inventoryBasePath: isIop
        ? '/insights_cloud/api/inventory/v1'
        : '/api/inventory/v1',
    }),
  });
}

let cachedAppConfig;

export function getAppConfig() {
  if (!cachedAppConfig) {
    cachedAppConfig = buildAppConfig(readEnvTarget());
  }
  return cachedAppConfig;
}

export function getComplianceApiBasePath() {
  return getAppConfig().api.complianceBasePath;
}

export function resetAppConfigForTests() {
  cachedAppConfig = undefined;
}
