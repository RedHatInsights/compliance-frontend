import { UnleashClient } from 'unleash-proxy-client';
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
    expect(staticUnleashFlagProviderConfig.disableMetrics).toBe(true);
    expect(staticUnleashFlagProviderConfig.bootstrapOverride).toBe(true);
    expect(staticUnleashFlagProviderConfig.fetch).toEqual(expect.any(Function));
  });

  it('starts the Unleash client without a network request', async () => {
    global.fetch.mockClear();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const client = new UnleashClient(staticUnleashFlagProviderConfig);

    await client.start();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(client.isEnabled('compliance.kessel_enabled')).toBe(false);
    expect(client.isEnabled('platform.rbac.workspaces')).toBe(false);

    client.stop();
    errorSpy.mockRestore();
  });

  it('returns the bootstrapped value for a known flag', () => {
    expect(getIopStaticFeatureFlag('compliance.kessel_enabled')).toBe(false);
    expect(getIopStaticFeatureFlag('platform.rbac.workspaces')).toBe(false);
  });

  it('returns false for an unknown flag', () => {
    expect(getIopStaticFeatureFlag('compliance.unknown')).toBe(false);
  });
});
