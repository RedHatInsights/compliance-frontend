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
  });
});
