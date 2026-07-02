import { createIopProviderOptions } from './createIopProviderOptions';

describe('createIopProviderOptions', () => {
  afterEach(() => {
    delete window.insights;
  });

  it('exposes chrome auth and RBAC helpers on window.insights', async () => {
    const permissions = [
      { permission: 'compliance:report:read', resourceDefinitions: [] },
      { permission: 'compliance:policy:read', resourceDefinitions: [] },
    ];

    const options = createIopProviderOptions({
      user: { identity: { user: { username: 'tester' } } },
      permissions,
    });

    expect(window.insights.chrome.auth.getUser).toBeDefined();
    expect(await window.insights.chrome.auth.getUser()).toEqual({
      identity: { user: { username: 'tester' } },
    });

    const scoped = await window.insights.chrome.getUserPermissions('compliance');
    expect(scoped).toHaveLength(2);

    expect(options.api.chrome.getApp()).toBe('compliance');
  });
});
