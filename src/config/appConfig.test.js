import {
  buildAppConfig,
  readEnvTarget,
  resetAppConfigForTests,
} from './appConfig';

describe('appConfig', () => {
  const originalIop = process.env.IOP;

  afterEach(() => {
    process.env.IOP = originalIop;
    resetAppConfigForTests();
  });

  describe('readEnvTarget', () => {
    it('returns iop when the IoP build flag is set', () => {
      process.env.IOP = 'true';

      expect(readEnvTarget()).toBe('iop');
    });

    it('returns hcc for the default cloud build', () => {
      delete process.env.IOP;

      expect(readEnvTarget()).toBe('hcc');
    });
  });

  describe('buildAppConfig', () => {
    it('iop: uses insights cloud API paths and disables cloud-only features', () => {
      const config = buildAppConfig('iop');

      expect(config.api.complianceBasePath).toBe(
        '/insights_cloud/api/compliance/v2',
      );
      expect(config.api.inventoryBasePath).toBe(
        '/insights_cloud/api/inventory/v1',
      );
      expect(config.features.unleash).toBe(false);
      expect(config.features.pdf).toBe(false);
      expect(config.features.dashboardZeroState).toBe(false);
    });

    it('hcc: keeps standard cloud configuration', () => {
      const config = buildAppConfig('hcc');

      expect(config.api.complianceBasePath).toBe('/api/compliance/v2');
      expect(config.features.unleash).toBe(true);
    });
  });
});
