const HCC = 'hcc';
const IOP = 'iop';

const IOP_STATIC_PATH_MARKER = '/assets/apps/compliance';

export function getEnvTargetFromPathname(pathname = '') {
  if (pathname.includes(IOP_STATIC_PATH_MARKER)) {
    return IOP;
  }
  return HCC;
}

export function isRunningInIframe() {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function readEnvTarget() {
  if (typeof window === 'undefined' || !window.location?.pathname) {
    return HCC;
  }

  if (getEnvTargetFromPathname(window.location.pathname) === IOP) {
    return IOP;
  }

  if (isRunningInIframe()) {
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
