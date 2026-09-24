import { createIopProviderOptions } from './createIopProviderOptions';

describe('createIopProviderOptions', () => {
  afterEach(() => {
    delete window.insights;
  });

  it('exposes chrome auth and RBAC helpers via Scalprum options', async () => {
    const permissions = [
      { permission: 'compliance:report:read', resourceDefinitions: [] },
      { permission: 'compliance:policy:read', resourceDefinitions: [] },
    ];

    const options = createIopProviderOptions({
      user: { identity: { user: { username: 'tester' } } },
      permissions,
    });

    const { chrome } = options.api;

    expect(chrome.auth.getUser).toBeDefined();
    expect(await chrome.auth.getUser()).toEqual({
      identity: { user: { username: 'tester' } },
    });

    const scoped = await chrome.getUserPermissions('compliance');
    expect(scoped).toHaveLength(2);

    expect(chrome.getApp()).toBe('compliance');

    expect(options.config.inventory).toEqual(
      expect.objectContaining({
        name: 'inventory',
        manifestLocation: expect.stringContaining(
          '/assets/apps/inventory/fed-mods.json',
        ),
      }),
    );
    expect(
      options.pluginSDKOptions.pluginLoaderOptions.transformPluginManifest,
    ).toEqual(expect.any(Function));
  });

  it('rewrites inventory fed-mods baseURL auto to the IoP cdn path', () => {
    const options = createIopProviderOptions();
    const { transformPluginManifest } =
      options.pluginSDKOptions.pluginLoaderOptions;

    const rewritten = transformPluginManifest({
      name: 'inventory',
      baseURL: 'auto',
      loadScripts: ['js/inventory.js'],
    });

    expect(rewritten.baseURL).toBe(
      `${window.location.origin}/assets/apps/inventory/`,
    );
    expect(rewritten.loadScripts).toEqual([
      `${window.location.origin}/assets/apps/inventory/js/inventory.js`,
    ]);
  });
});
