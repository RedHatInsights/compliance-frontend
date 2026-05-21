import { ensureChromeRbacBridge } from './ensureChromeRbacBridge';

describe('ensureChromeRbacBridge', () => {
  const originalInsights = window.insights;

  afterEach(() => {
    window.insights = originalInsights;
  });

  it('does not overwrite an existing chrome.getUserPermissions', () => {
    const existing = jest.fn();
    window.insights = {
      chrome: {
        getUserPermissions: existing,
        auth: { getUserPermissions: jest.fn() },
      },
    };
    ensureChromeRbacBridge();
    expect(window.insights.chrome.getUserPermissions).toBe(existing);
  });

  it('aliases auth.getUserPermissions to chrome.getUserPermissions', () => {
    const authGetUserPermissions = jest.fn();
    window.insights = {
      chrome: {
        auth: { getUserPermissions: authGetUserPermissions },
      },
    };
    ensureChromeRbacBridge();
    expect(window.insights.chrome.getUserPermissions).toBe(authGetUserPermissions);
  });

  it('is a no-op when auth.getUserPermissions is missing', () => {
    window.insights = { chrome: {} };
    ensureChromeRbacBridge();
    expect(window.insights.chrome.getUserPermissions).toBeUndefined();
  });
});
