import {
  buildAppConfig,
  getEnvTargetFromPathname,
  getAppConfig,
  readEnvTarget,
} from './appConfig';

describe('appConfig', () => {
  describe('getEnvTargetFromPathname', () => {
    it('returns hcc when origin does not contain foreman_rh_cloud', () => {
      expect(getEnvTargetFromPathname('https://console.redhat.com')).toBe(
        'hcc',
      );
    });

    it('returns iop when origin contains foreman_rh_cloud', () => {
      expect(
        getEnvTargetFromPathname('https://myhost.foreman_rh_cloud.example.com'),
      ).toBe('iop');
    });
  });

  describe('readEnvTarget', () => {
    it('delegates to getEnvTargetFromPathname using window.location.origin', () => {
      expect(readEnvTarget()).toBe(
        getEnvTargetFromPathname(window.location.origin),
      );
    });
  });

  describe('buildAppConfig', () => {
    it('hcc: enables unleash, pdf, remediations', () => {
      const p = buildAppConfig('hcc');
      expect(p.envTarget).toBe('hcc');
      expect(p.features.unleash).toBe(true);
      expect(p.features.staticUnleashFlags).toBe(false);
      expect(p.features.unleashFlagProvider).toBe(false);
      expect(p.features.pdf).toBe(true);
      expect(p.features.remediations).toBe(true);
      expect(p.features.dashboardZeroState).toBe(true);
      expect(p.chrome.useDocumentTitleFallback).toBe(false);
    });

    it('iop: disables unleash, pdf, remediations; title fallback on', () => {
      const p = buildAppConfig('iop');
      expect(p.envTarget).toBe('iop');
      expect(p.features.unleash).toBe(false);
      expect(p.features.staticUnleashFlags).toBe(true);
      expect(p.features.unleashFlagProvider).toBe(false);
      expect(p.features.pdf).toBe(false);
      expect(p.features.remediations).toBe(false);
      expect(p.features.dashboardZeroState).toBe(false);
      expect(p.chrome.useDocumentTitleFallback).toBe(true);
    });
    it('iop: uses insights cloud compliance API path', () => {
      expect(buildAppConfig('iop').api.complianceBasePath).toBe(
        '/insights_cloud/api/compliance/v2',
      );
    });

    it('hcc: uses console gateway compliance API path', () => {
      expect(buildAppConfig('hcc').api.complianceBasePath).toBe(
        '/api/compliance/v2',
      );
    });
  });

  describe('getComplianceApiBasePath', () => {
    it('follows deployment from origin', () => {
      const target = getEnvTargetFromPathname(
        'https://satellite.foreman_rh_cloud.local:8443',
      );
      expect(buildAppConfig(target).api.complianceBasePath).toBe(
        '/insights_cloud/api/compliance/v2',
      );
    });
  });

  describe('getAppConfig', () => {
    it('matches buildAppConfig for the active deployment target', () => {
      expect(getAppConfig()).toEqual(buildAppConfig(readEnvTarget()));
    });

    it('returns a new object each call (no hidden cache)', () => {
      const a = getAppConfig();
      const b = getAppConfig();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });
});
