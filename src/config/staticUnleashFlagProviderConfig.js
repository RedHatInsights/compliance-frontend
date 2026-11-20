const staticUnleashToggles = [
  {
    name: 'compliance.kessel_enabled',
    enabled: false,
    variant: { name: 'disabled', enabled: false },
    impressionData: false,
  },
  {
    name: 'platform.rbac.workspaces',
    enabled: false,
    variant: { name: 'disabled', enabled: false },
    impressionData: false,
  },
];

export function staticUnleashFetch() {
  return Promise.resolve({
    ok: true,
    status: 200,
    headers: {
      get: () => '',
    },
    json: () =>
      Promise.resolve({
        toggles: staticUnleashToggles.map((toggle) => ({
          ...toggle,
          variant: { ...toggle.variant },
        })),
      }),
  });
}

export const staticUnleashFlagProviderConfig = {
  url: 'http://localhost',
  clientKey: 'static',
  appName: 'compliance',
  disableRefresh: true,
  disableMetrics: true,
  fetch: staticUnleashFetch,
  bootstrap: staticUnleashToggles,
  bootstrapOverride: true,
};
