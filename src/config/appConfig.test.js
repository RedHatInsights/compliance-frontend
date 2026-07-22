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
      expect(config.features.remediations).toBe(false);
      expect(config.features.dashboardZeroState).toBe(false);
      expect(config.features.inventoryGroupsAndTags).toBe(false);
      expect(config.routes.systemPermissions).toEqual([
        'compliance:report:read',
      ]);
    });
  });

  describe('getAppConfigHcc', () => {
    it('keeps standard cloud configuration', () => {
      const config = getAppConfigHcc();

      expect(config.envTarget).toBe('hcc');
      expect(config.api.complianceBasePath).toBe('/api/compliance/v2');
      expect(config.features.unleash).toBe(true);
      expect(config.features.remediations).toBe(true);
      expect(config.features.inventoryGroupsAndTags).toBe(true);
      expect(config.routes.systemPermissions).toEqual([
        'compliance:system:read',
      ]);
    });
  });
});
