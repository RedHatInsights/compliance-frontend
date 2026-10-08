import { getAppConfig } from './appConfig';
import { getAppConfigHcc } from './appConfig.hcc';
import { getAppConfigIop } from './appConfig.iop';
import HccSystemDetailsLink from 'PresentationalComponents/SystemDetailsLink/HccSystemDetailsLink';
import IopSystemDetailsLink from 'PresentationalComponents/SystemDetailsLink/IopSystemDetailsLink';

describe('appConfig', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the HCC config when IOP is not true', () => {
    jest.replaceProperty(process, 'env', { ...process.env, IOP: 'false' });

    expect(getAppConfig()).toBe(getAppConfigHcc());
  });

  it('returns the IOP config when IOP is true', () => {
    jest.replaceProperty(process, 'env', { ...process.env, IOP: 'true' });

    expect(getAppConfig()).toBe(getAppConfigIop());
  });

  describe('getAppConfigHcc', () => {
    it('keeps the current cloud API paths and route permissions', () => {
      const config = getAppConfigHcc();

      expect(config.envTarget).toBe('hcc');
      expect(config.api.complianceBasePath).toBe('/api/compliance/v2');
      expect(config.api.inventoryBasePath).toBe('/api/inventory/v1');
      expect(config.features).toEqual({
        unleash: true,
        pdf: true,
        remediations: true,
        dashboardZeroState: true,
        inventoryGroupsAndTags: true,
      });
      expect(config.routes.systemPermissions).toEqual([
        'compliance:system:read',
        'compliance:report:read',
      ]);
      expect(config.routes.systemsPermissions).toEqual([
        'compliance:system:read',
        'compliance:policy:read',
      ]);
      expect(config.systemDetailsLink).toBe(HccSystemDetailsLink);
    });
  });

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
      expect(config.features).toEqual({
        unleash: false,
        pdf: false,
        remediations: false,
        dashboardZeroState: false,
        inventoryGroupsAndTags: false,
      });
      expect(config.routes.systemPermissions).toEqual([
        'compliance:report:read',
      ]);
      expect(config.routes.systemsPermissions).toEqual([
        'compliance:policy:read',
      ]);
      expect(config.systemDetailsLink).toBe(IopSystemDetailsLink);
    });
  });
});
