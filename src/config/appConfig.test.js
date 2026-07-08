import { getAppConfigHcc } from './appConfig.hcc';
import { getAppConfigIop } from './appConfig.iop';

describe('appConfig', () => {
  describe('getAppConfigIop', () => {
    it('uses insights cloud API paths and disables cloud-only features', () => {
      const config = getAppConfigIop();

      expect(config.envTarget).toBe('iop');
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
  });

  describe('getAppConfigHcc', () => {
    it('keeps standard cloud configuration', () => {
      const config = getAppConfigHcc();

      expect(config.envTarget).toBe('hcc');
      expect(config.api.complianceBasePath).toBe('/api/compliance/v2');
      expect(config.features.unleash).toBe(true);
    });
  });
});
