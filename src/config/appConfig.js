const HCC = 'hcc';
const IOP = 'iop';

const IOP_URL_MARKER = 'foreman_rh_cloud';

export function getEnvTargetFromPathname(pathname = '') {
  return pathname.includes(IOP_URL_MARKER) ? IOP : HCC;
}

export function readEnvTarget() {
  if (typeof window === 'undefined' || !window.location?.pathname) {
    return HCC;
  }
  return getEnvTargetFromPathname(window.location.pathname);
}

export function buildAppConfig(envTarget) {
  const isIop = envTarget === IOP;
  const platformUnleash = !isIop;

  return Object.freeze({
    envTarget,
    features: Object.freeze({
      unleash: platformUnleash,
      unleashFlagProvider: !isIop && !platformUnleash,
      pdf: !isIop,
      remediations: !isIop,
      dashboardZeroState: !isIop,
    }),
    api: Object.freeze({
      complianceBasePath: isIop
        ? '/insights_cloud/api/compliance/v2'
        : '/api/compliance/v2',
    }),
    chrome: Object.freeze({
      useDocumentTitleFallback: isIop,
    }),
  });
}

export function getComplianceApiBasePath() {
  return getAppConfig().api.complianceBasePath;
}

export function getAppConfig() {
  return buildAppConfig(readEnvTarget());
}
