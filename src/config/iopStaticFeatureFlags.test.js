import { getIopStaticFeatureFlag } from './iopStaticFeatureFlags';
import { staticUnleashFlagProviderConfig } from './staticUnleashFlagProviderConfig';

describe('iop static feature flags', () => {
  it('bootstraps cloud-only flags as disabled', () => {
    expect(staticUnleashFlagProviderConfig.bootstrap).toEqual([
      expect.objectContaining({
        name: 'compliance.kessel_enabled',
        enabled: false,
      }),
      expect.objectContaining({
        name: 'platform.rbac.workspaces',
        enabled: false,
      }),
    ]);
    expect(staticUnleashFlagProviderConfig.disableRefresh).toBe(true);
    expect(staticUnleashFlagProviderConfig.bootstrapOverride).toBe(true);
  });

  it('returns the bootstrapped value for a known flag', () => {
    expect(getIopStaticFeatureFlag('compliance.kessel_enabled')).toBe(false);
    expect(getIopStaticFeatureFlag('platform.rbac.workspaces')).toBe(false);
  });

  it('returns false for an unknown flag', () => {
    expect(getIopStaticFeatureFlag('compliance.unknown')).toBe(false);
  });
});
